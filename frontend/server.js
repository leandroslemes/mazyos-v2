const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const { randomUUID } = require('crypto');
const { exec, spawn } = require('child_process');

const app  = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

const dirs = {
  db:      path.join(__dirname, 'data'),
  uploads: path.join(__dirname, 'uploads'),
  memoria: path.join(ROOT, '_memoria'),
};
Object.values(dirs).forEach(d => fs.mkdirSync(d, { recursive: true }));

// ── MULTER ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: dirs.uploads,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID().slice(0,8)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = ['application/pdf','image/jpeg','image/png','image/webp','image/jpg',
                'text/csv','application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain','application/json'];
    cb(null, ok.includes(file.mimetype) || file.mimetype.startsWith('text/'));
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(dirs.uploads));
app.use('/n8n-workflows', express.static(path.join(ROOT, 'sistemas', 'n8n')));
app.use('/conteudo', express.static(path.join(ROOT, 'marketing', 'conteudo')));

// ── DB HELPER ─────────────────────────────────────────────────────────────────
function db(name) {
  const file = path.join(dirs.db, `${name}.json`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ items:[] }, null, 2));
  const read  = () => { const d = JSON.parse(fs.readFileSync(file,'utf8')); return d.items||d.leads||[]; };
  const write = items => fs.writeFileSync(file, JSON.stringify({ items }, null, 2));
  return { read, write };
}
const DBS = { leads: db('leads'), mensagens: db('mensagens'), campanhas: db('campanhas'), carrossels: db('carrossels'), atividades: db('atividades'), n8n_eventos: db('n8n_eventos') };

function logAtividade(tipo, descricao, ref = null) {
  const items = DBS.atividades.read();
  items.unshift({ id: randomUUID(), tipo, descricao, ref, created_at: new Date().toISOString() });
  DBS.atividades.write(items.slice(0, 100));
}

// ── BACEN ─────────────────────────────────────────────────────────────────────
const SERIES = { veiculo_novo:20714, veiculo_usado:20715, imovel:433, pessoal:20586, consignado:20585 };
const TIPO_LABEL = { veiculo_novo:'Veículo novo (PF)', veiculo_usado:'Veículo usado (PF)', imovel:'Crédito imobiliário', pessoal:'Crédito pessoal', consignado:'Consignado' };
const bacenCache = new Map();

async function getBACEN(serie) {
  const now = Date.now();
  if (bacenCache.has(serie) && now - bacenCache.get(serie).ts < 300_000) return bacenCache.get(serie).data;
  const r = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/1?formato=json`);
  if (!r.ok) throw new Error(`BACEN HTTP ${r.status}`);
  const [d] = await r.json();
  bacenCache.set(serie, { data:d, ts:now });
  return d;
}

function calcLaudo(taxa, media) {
  const d = ((taxa - media) / media) * 100;
  const desvio = +d.toFixed(1);
  if (d > 50)  return { laudo:'ABUSIVO',        cor:'red',   desvio };
  if (d >= 20) return { laudo:'NO LIMITE',       cor:'amber', desvio };
               return { laudo:'DENTRO DA MÉDIA', cor:'green', desvio };
}

function calcPotencial(analise) {
  if (!analise)                         return 'MEDIO';
  if (analise.laudo === 'ABUSIVO')      return 'ALTO';
  if (analise.laudo === 'NO LIMITE')    return 'MEDIO';
  return 'BAIXO';
}

function calcPrec(pot, area, valor) {
  if (pot === 'BAIXO') return { faixa:'Encaminhar parceiro', modalidade:'Terceirizar', min:0, max:0 };
  if (area === 'consumidor') {
    const v = parseFloat(valor)||0;
    if (v <= 20000) return { faixa:'R$ 1.500 – R$ 2.500', modalidade:'Êxito + entrada R$ 500',   min:1500, max:2500 };
    if (v <= 50000) return { faixa:'R$ 2.500 – R$ 5.000', modalidade:'Êxito + entrada R$ 1.000', min:2500, max:5000 };
    return           { faixa:'R$ 5.000 – R$ 10.000',      modalidade:'Êxito + entrada R$ 1.500', min:5000, max:10000 };
  }
  if (area === 'imobiliario') return { faixa:'1% a 1,5% do valor', modalidade:'Fixo ou êxito', min:0, max:0 };
  return { faixa:'6% a 10% do monte-mor', modalidade:'Fixo', min:0, max:0 };
}

function calcCross(area, desc) {
  const d = (desc||'').toLowerCase(), s = [];
  if (area !== 'imobiliario' && /im[oó]vel|apartamento|casa|terreno|comprar|vender/.test(d))   s.push('Mencionou imóvel → assessoria imobiliária');
  if (area !== 'sucessorio'  && /faleceu|herança|invent[aá]rio|partilha|herdeiro/.test(d))      s.push('Mencionou herança/falecimento → inventário');
  if (area === 'consumidor'  && /outro financiamento|segundo|mais um contrato/.test(d))         s.push('Possível segundo financiamento a analisar');
  return s;
}

// ── ROTAS: UPLOAD ─────────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('arquivo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error:'nenhum arquivo recebido' });
  res.json({ url:`/uploads/${req.file.filename}`, nome:req.file.originalname, tipo:req.file.mimetype, tamanho:req.file.size });
});

// ── ROTAS: ANALISAR ───────────────────────────────────────────────────────────
app.post('/api/analisar', async (req, res) => {
  const { taxa, tipo } = req.body;
  if (!taxa || !tipo || !SERIES[tipo]) return res.status(400).json({ error:'taxa e tipo são obrigatórios' });
  // Tenta WF2 N8N se configurado
  const cfg = readN8NCfg();
  if (cfg.wf2) {
    try {
      const r = await fetch(cfg.wf2, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ taxa:parseFloat(taxa), tipo }),
        signal:AbortSignal.timeout(15000)
      });
      if (r.ok) { const d = await r.json(); if (d.laudo) { n8nEvt('wf2_bacen','via_n8n',`BACEN via N8N: ${d.laudo}`); return res.json(d); } }
    } catch(_) { /* fallback local */ }
  }
  try {
    const d = await getBACEN(SERIES[tipo]);
    const media = parseFloat(d.valor);
    res.json({ ...calcLaudo(parseFloat(taxa), media), media_bacen:media, data_ref:d.data, tipo:TIPO_LABEL[tipo] });
  } catch(e) { res.status(500).json({ error:'Erro ao consultar BACEN', msg:e.message }); }
});

// ── ROTAS: LEADS ──────────────────────────────────────────────────────────────
app.get('/api/leads', (_, res) => res.json(DBS.leads.read().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))));
app.get('/api/leads/:id', (req, res) => {
  const l = DBS.leads.read().find(x=>x.id===req.params.id);
  l ? res.json(l) : res.status(404).json({ error:'não encontrado' });
});
app.post('/api/leads', async (req, res) => {
  const { nome, telefone, canal, area, descricao, banco, tipo, taxa, prazo, parcela, veiculo, valor, documento_url, mensagem_id } = req.body;
  if (!nome||!area) return res.status(400).json({ error:'nome e area obrigatórios' });
  let analise = null;
  if (taxa && tipo && SERIES[tipo]) {
    try {
      const d = await getBACEN(SERIES[tipo]);
      analise = { ...calcLaudo(parseFloat(taxa), parseFloat(d.valor)), media_bacen:parseFloat(d.valor), data_ref:d.data };
    } catch(_) {}
  }
  const pot  = calcPotencial(analise);
  const prec = calcPrec(pot, area, valor);
  const cross = calcCross(area, descricao);
  const lead = {
    id:randomUUID(), nome, telefone:telefone||'', canal:canal||'whatsapp',
    area, descricao:descricao||'', banco:banco||'', tipo:tipo||'',
    taxa:taxa?+parseFloat(taxa).toFixed(2):null, prazo:prazo?parseInt(prazo):null,
    parcela:parcela?+parseFloat(parcela).toFixed(2):null, veiculo:veiculo||'',
    valor:valor?+parseFloat(valor).toFixed(2):null, documento_url:documento_url||null,
    mensagem_id:mensagem_id||null,
    analise, potencial:pot, precificacao:prec, cross_sell:cross,
    status:pot==='ALTO'?'aguardando':pot==='MEDIO'?'followup':'encaminhar',
    notas:'', created_at:new Date().toISOString()
  };
  const items = DBS.leads.read(); items.push(lead); DBS.leads.write(items);
  if (mensagem_id) {
    const msgs = DBS.mensagens.read();
    const m = msgs.find(x=>x.id===mensagem_id);
    if (m) { m.status='convertido'; m.lead_id=lead.id; DBS.mensagens.write(msgs); }
  }
  logAtividade('lead_criado', `Lead criado: ${nome} (${pot})`, lead.id);
  res.status(201).json(lead);
});
app.patch('/api/leads/:id', (req, res) => {
  const items = DBS.leads.read();
  const l = items.find(x=>x.id===req.params.id);
  if (!l) return res.status(404).json({ error:'não encontrado' });
  Object.assign(l, req.body); DBS.leads.write(items);
  if (req.body.status === 'fechado') logAtividade('contrato_fechado', `Contrato fechado: ${l.nome}`, l.id);
  res.json(l);
});
app.delete('/api/leads/:id', (req, res) => {
  DBS.leads.write(DBS.leads.read().filter(x=>x.id!==req.params.id));
  res.json({ ok:true });
});

// ── ROTAS: MEMORIA ────────────────────────────────────────────────────────────
const MEM_KEYS = ['empresa','preferencias','estrategia','goals'];
app.get('/api/memoria/:key', (req, res) => {
  if (!MEM_KEYS.includes(req.params.key)) return res.status(400).json({ error:'arquivo inválido' });
  const file = path.join(dirs.memoria, `${req.params.key}.md`);
  res.json({ content: fs.existsSync(file) ? fs.readFileSync(file,'utf8') : '' });
});
app.post('/api/memoria/:key', (req, res) => {
  if (!MEM_KEYS.includes(req.params.key)) return res.status(400).json({ error:'arquivo inválido' });
  const file = path.join(dirs.memoria, `${req.params.key}.md`);
  fs.writeFileSync(file, req.body.content||'', 'utf8');
  logAtividade('memoria_atualizada', `Memória atualizada: ${req.params.key}`);
  res.json({ ok:true, saved_at:new Date().toISOString() });
});

// ── ROTAS: MENSAGENS ──────────────────────────────────────────────────────────
app.get('/api/mensagens', (_, res) => res.json(DBS.mensagens.read().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))));
app.post('/api/mensagens', (req, res) => {
  const { numero, texto, canal, nome } = req.body;
  const msg = { id:randomUUID(), numero:numero||'desconhecido', nome:nome||'', texto:texto||'', canal:canal||'whatsapp', status:'novo', created_at:new Date().toISOString() };
  const items = DBS.mensagens.read(); items.push(msg); DBS.mensagens.write(items);
  logAtividade('mensagem_recebida', `Mensagem de ${numero||'desconhecido'}`);
  res.status(201).json(msg);
});
app.patch('/api/mensagens/:id', (req, res) => {
  const items = DBS.mensagens.read();
  const m = items.find(x=>x.id===req.params.id);
  if (!m) return res.status(404).json({ error:'não encontrado' });
  Object.assign(m, req.body); DBS.mensagens.write(items); res.json(m);
});
app.delete('/api/mensagens/:id', (req, res) => {
  DBS.mensagens.write(DBS.mensagens.read().filter(x=>x.id!==req.params.id));
  res.json({ ok:true });
});

// Webhook WhatsApp (para N8N / Evolution API)
app.post('/webhook/whatsapp', (req, res) => {
  const b = req.body;
  const numero = b.from||b.phone||b.number||b.sender||b.remoteJid||'desconhecido';
  const texto  = b.body||b.message||b.text||b.content||JSON.stringify(b).slice(0,300);
  const nome   = b.pushName||b.name||b.contactName||'';
  const msg = { id:randomUUID(), numero, nome, texto, canal:'whatsapp', status:'novo', raw:b, created_at:new Date().toISOString() };
  const items = DBS.mensagens.read(); items.push(msg); DBS.mensagens.write(items);
  logAtividade('webhook_recebido', `WhatsApp de ${numero}`);
  res.json({ received:true, id:msg.id });
});

// ── ROTAS: CAMPANHAS ──────────────────────────────────────────────────────────
app.get('/api/campanhas', (_, res) => res.json(DBS.campanhas.read()));
app.post('/api/campanhas', (req, res) => {
  const c = { id:randomUUID(), created_at:new Date().toISOString(), ativa:true, ...req.body };
  const items = DBS.campanhas.read(); items.push(c); DBS.campanhas.write(items);
  logAtividade('campanha_criada', `Campanha: ${c.nome}`);
  res.status(201).json(c);
});
app.put('/api/campanhas/:id', (req, res) => {
  const items = DBS.campanhas.read();
  const idx = items.findIndex(x=>x.id===req.params.id);
  if (idx===-1) return res.status(404).json({ error:'não encontrado' });
  items[idx] = { ...items[idx], ...req.body }; DBS.campanhas.write(items); res.json(items[idx]);
});
app.delete('/api/campanhas/:id', (req, res) => {
  DBS.campanhas.write(DBS.campanhas.read().filter(x=>x.id!==req.params.id));
  res.json({ ok:true });
});

// ── ROTAS: CARROSSELS ─────────────────────────────────────────────────────────
app.get('/api/carrossels/files', (_, res) => {
  const dir = path.join(ROOT, 'marketing', 'conteudo');
  if (!fs.existsSync(dir)) return res.json([]);
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => {
      const htmlPath = path.join(dir, e.name, 'carrossel.html');
      const hasHtml  = fs.existsSync(htmlPath);
      // PNGs ficam em instagram/ (render.js) ou na raiz da pasta
      const igDir  = path.join(dir, e.name, 'instagram');
      const pngDir = fs.existsSync(igDir) ? igDir : path.join(dir, e.name);
      const prefix = fs.existsSync(igDir) ? 'instagram/' : '';
      const pngs   = fs.existsSync(pngDir)
        ? fs.readdirSync(pngDir).filter(f => f.endsWith('.png')).sort()
        : [];
      // usa mtime do html ou do primeiro png
      const statTarget = hasHtml ? htmlPath : (pngs[0] ? path.join(pngDir, pngs[0]) : null);
      const stat = statTarget && fs.existsSync(statTarget) ? fs.statSync(statTarget) : null;
      if (!stat && !pngs.length) return null;
      // formata nome legível removendo sufixo de data
      const label = e.name.replace(/-\d{4}-\d{2}-\d{2}$/, '').replace(/-/g, ' ');
      return {
        slug:       e.name,
        label,
        html_url:   hasHtml ? `/conteudo/${e.name}/carrossel.html` : null,
        pngs:       pngs.map(p => `/conteudo/${e.name}/${prefix}${p}`),
        cover:      pngs.length ? `/conteudo/${e.name}/${prefix}${pngs[0]}` : null,
        slides:     pngs.length,
        created_at: stat ? stat.mtime.toISOString() : new Date().toISOString()
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(entries);
});

app.get('/api/carrossels', (_, res) => res.json(DBS.carrossels.read().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))));
app.post('/api/carrossels', (req, res) => {
  const c = { id:randomUUID(), created_at:new Date().toISOString(), ...req.body };
  const items = DBS.carrossels.read(); items.push(c); DBS.carrossels.write(items);
  logAtividade('carrossel_criado', `Carrossel: ${c.tema||'sem tema'}`);
  res.status(201).json(c);
});
app.delete('/api/carrossels/:id', (req, res) => {
  DBS.carrossels.write(DBS.carrossels.read().filter(x=>x.id!==req.params.id));
  res.json({ ok:true });
});

// ── CONFIG WEBHOOKS N8N ───────────────────────────────────────────────────────
const N8N_CFG_FILE = path.join(dirs.db, 'n8n_config.json');
function readN8NCfg() {
  if (!fs.existsSync(N8N_CFG_FILE)) return { wf1:'', wf2:'', wf3:'', wf4:'' };
  try { return JSON.parse(fs.readFileSync(N8N_CFG_FILE,'utf8')); } catch { return { wf1:'', wf2:'', wf3:'', wf4:'' }; }
}
function writeN8NCfg(c) { fs.writeFileSync(N8N_CFG_FILE, JSON.stringify(c,null,2)); }

app.get('/api/n8n/config', (_, res) => res.json(readN8NCfg()));
app.post('/api/n8n/config', (req, res) => {
  const cfg = readN8NCfg();
  ['wf1','wf2','wf3','wf4'].forEach(k => { if (req.body[k] !== undefined) cfg[k] = req.body[k]; });
  writeN8NCfg(cfg);
  res.json({ ok:true, config:cfg });
});

// Proxy MazyOS → N8N: chama webhook configurado e aguarda resposta
app.post('/api/n8n/run/:wf', async (req, res) => {
  const { wf } = req.params;
  const cfg = readN8NCfg();
  const url = cfg[wf];
  if (!url) return res.status(400).json({ error:`Webhook ${wf.toUpperCase()} não configurado. Configure a URL no painel N8N.` });
  try {
    const r = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(req.body),
      signal:AbortSignal.timeout(30000)
    });
    if (!r.ok) throw new Error(`N8N HTTP ${r.status}`);
    const data = await r.json();
    n8nEvt(`${wf}_webhook`, 'resposta_recebida', `${wf.toUpperCase()} respondeu: ${JSON.stringify(data).slice(0,100)}`);
    res.json(data);
  } catch(e) {
    n8nEvt(`${wf}_webhook`, 'erro', `${wf.toUpperCase()} falhou: ${e.message}`);
    res.status(502).json({ error:'Webhook N8N não respondeu', msg:e.message });
  }
});

// ── ROTAS: N8N ────────────────────────────────────────────────────────────────

function n8nEvt(workflow, tipo, descricao, ref=null) {
  const evts = DBS.n8n_eventos.read();
  evts.unshift({ id:randomUUID(), workflow, tipo, descricao, ref, ts:new Date().toISOString() });
  DBS.n8n_eventos.write(evts.slice(0,200));
}

// Status geral — dashboard N8N
app.get('/api/n8n/status', (_, res) => {
  const leads = DBS.leads.read(), msgs = DBS.mensagens.read();
  const evts  = DBS.n8n_eventos.read();
  const lastOf = wf => evts.find(e => e.workflow === wf) || null;
  res.json({
    webhooks: {
      whatsapp:    `/webhook/whatsapp`,
      n8n_lead:    `/webhook/n8n/lead`,
      n8n_analisar:`/webhook/n8n/analisar`,
      n8n_laudo:   `/webhook/n8n/laudo/:lead_id`,
      n8n_enrich:  `/webhook/n8n/enrich/:lead_id`,
      n8n_evento:  `/webhook/n8n/evento`,
    },
    stats: {
      msgs_novas:    msgs.filter(m=>m.status==='novo').length,
      leads_total:   leads.length,
      leads_alto:    leads.filter(l=>l.potencial==='ALTO').length,
      leads_n8n:     leads.filter(l=>l.fonte==='n8n').length,
      em_triagem:    leads.filter(l=>l.status==='aguardando').length,
    },
    ultimos_eventos: evts.slice(0,15),
    workflows: {
      wf1: lastOf('wf1_whatsapp'),
      wf2: lastOf('wf2_bacen'),
      wf3: lastOf('wf3_enrich'),
      wf4: lastOf('wf4_notify'),
    }
  });
});

// Fila de mensagens não triadas — N8N pode fazer polling
app.get('/api/n8n/queue', (_, res) => {
  const msgs  = DBS.mensagens.read().filter(m=>m.status==='novo');
  const triados = new Set(DBS.leads.read().map(l=>l.mensagem_id).filter(Boolean));
  res.json(msgs.filter(m=>!triados.has(m.id)).slice(0,20));
});

// Lead completo vindo do N8N (com dados enriquecidos)
app.post('/webhook/n8n/lead', async (req, res) => {
  const { nome, telefone, area, descricao, taxa, tipo, valor, cpf, renda_estimada, score_credito, protestos, processos, workflow_id } = req.body;
  if (!nome || !area) return res.status(400).json({ error:'nome e area obrigatórios' });
  let analise = null;
  if (taxa && tipo && SERIES[tipo]) {
    try {
      const d = await getBACEN(SERIES[tipo]);
      analise = { ...calcLaudo(parseFloat(taxa), parseFloat(d.valor)), media_bacen:parseFloat(d.valor), data_ref:d.data };
    } catch(_) {}
  }
  const pot   = calcPotencial(analise);
  const prec  = calcPrec(pot, area||'consumidor', valor);
  const cross = calcCross(area||'consumidor', descricao);
  const lead  = {
    id:randomUUID(), nome, telefone:telefone||'', canal:'whatsapp', area:area||'consumidor',
    descricao:descricao||'', taxa:taxa?+parseFloat(taxa).toFixed(2):null,
    tipo:tipo||'', valor:valor?+parseFloat(valor).toFixed(2):null,
    cpf:cpf||'', renda_estimada:renda_estimada||null, score_credito:score_credito||null,
    protestos:protestos||0, processos:processos||0,
    analise, potencial:pot, precificacao:prec, cross_sell:cross,
    status:pot==='ALTO'?'aguardando':pot==='MEDIO'?'followup':'encaminhar',
    notas:'', fonte:'n8n', workflow_id:workflow_id||null,
    created_at:new Date().toISOString()
  };
  const items = DBS.leads.read(); items.push(lead); DBS.leads.write(items);
  n8nEvt('wf1_whatsapp', 'lead_criado', `Lead criado: ${nome} (${pot})`, lead.id);
  logAtividade('n8n_lead', `N8N → Lead: ${nome} (${pot})`, lead.id);
  res.status(201).json(lead);
});

// Laudo BACEN chegando do N8N — atualiza lead
app.post('/webhook/n8n/laudo/:id', async (req, res) => {
  const items = DBS.leads.read();
  const lead  = items.find(x=>x.id===req.params.id);
  if (!lead) return res.status(404).json({ error:'lead não encontrado' });
  const { taxa, tipo, laudo_externo } = req.body;
  let analise = laudo_externo||null;
  if (!analise && taxa && tipo && SERIES[tipo]) {
    try {
      const d = await getBACEN(SERIES[tipo]);
      analise = { ...calcLaudo(parseFloat(taxa), parseFloat(d.valor)), media_bacen:parseFloat(d.valor), data_ref:d.data };
    } catch(_) {}
  }
  if (analise) {
    lead.analise    = analise;
    lead.potencial  = calcPotencial(analise);
    lead.precificacao = calcPrec(lead.potencial, lead.area, lead.valor);
  }
  DBS.leads.write(items);
  n8nEvt('wf2_bacen', 'laudo_atualizado', `Laudo: ${lead.nome} → ${analise?.laudo||'?'}`, lead.id);
  logAtividade('n8n_laudo', `N8N → Laudo: ${lead.nome} (${analise?.laudo||'?'})`, lead.id);
  res.json(lead);
});

// Análise BACEN direta — recebe contrato, devolve laudo sem lead existente
app.post('/webhook/n8n/analisar', async (req, res) => {
  const { taxa, tipo, lead_id } = req.body;
  if (!taxa || !tipo || !SERIES[tipo]) return res.status(400).json({ error:'taxa e tipo obrigatórios' });
  try {
    const d = await getBACEN(SERIES[tipo]);
    const analise = { ...calcLaudo(parseFloat(taxa), parseFloat(d.valor)), media_bacen:parseFloat(d.valor), data_ref:d.data, tipo:TIPO_LABEL[tipo] };
    if (lead_id) {
      const items = DBS.leads.read();
      const lead  = items.find(x=>x.id===lead_id);
      if (lead) { lead.analise=analise; lead.potencial=calcPotencial(analise); DBS.leads.write(items); }
    }
    n8nEvt('wf2_bacen', 'analise_concluida', `BACEN: taxa ${taxa}% → ${analise.laudo}`, lead_id||null);
    res.json(analise);
  } catch(e) { res.status(500).json({ error:'Erro BACEN', msg:e.message }); }
});

// Dados de enriquecimento chegando do N8N
app.post('/webhook/n8n/enrich/:id', (req, res) => {
  const items = DBS.leads.read();
  const lead  = items.find(x=>x.id===req.params.id);
  if (!lead) return res.status(404).json({ error:'lead não encontrado' });
  const { renda_estimada, score_credito, protestos, processos, receita_situacao, cep_regiao } = req.body;
  Object.assign(lead, { renda_estimada:renda_estimada||null, score_credito:score_credito||null, protestos:protestos||0, processos:processos||0, receita_situacao:receita_situacao||'', cep_regiao:cep_regiao||'' });
  DBS.leads.write(items);
  n8nEvt('wf3_enrich', 'perfil_enriquecido', `Perfil enriquecido: ${lead.nome}`, lead.id);
  logAtividade('n8n_enrich', `N8N → Enriquecimento: ${lead.nome}`, lead.id);
  res.json(lead);
});

// Evento genérico de workflow N8N
app.post('/webhook/n8n/evento', (req, res) => {
  const { workflow, tipo, descricao, ref, dados } = req.body;
  const evt = { id:randomUUID(), workflow:workflow||'n8n', tipo:tipo||'info', descricao:descricao||'', ref:ref||null, dados:dados||null, ts:new Date().toISOString() };
  const evts = DBS.n8n_eventos.read(); evts.unshift(evt); DBS.n8n_eventos.write(evts.slice(0,200));
  logAtividade(`n8n_evt`, descricao||`Evento N8N: ${workflow}`, ref||null);
  res.json({ ok:true, id:evt.id });
});

// ── ROTAS: STATS + ATIVIDADES ─────────────────────────────────────────────────
app.get('/api/stats', (_, res) => {
  const leads = DBS.leads.read(), msgs = DBS.mensagens.read(), camps = DBS.campanhas.read();
  res.json({
    total: leads.length,
    alto:  leads.filter(l=>l.potencial==='ALTO').length,
    medio: leads.filter(l=>l.potencial==='MEDIO').length,
    baixo: leads.filter(l=>l.potencial==='BAIXO').length,
    fechados: leads.filter(l=>l.status==='fechado').length,
    abusivos: leads.filter(l=>l.analise?.laudo==='ABUSIVO').length,
    msgs_novas: msgs.filter(m=>m.status==='novo').length,
    camps_ativas: camps.filter(c=>c.ativa).length
  });
});
app.get('/api/atividades', (_, res) => res.json(DBS.atividades.read().slice(0,30)));

// ── HUB IA: SESSÕES + CANCEL + STREAM-JSON ────────────────────────────────────
const HUB_FILE      = path.join(dirs.db, 'hub_history.json');
const HUB_SESS_FILE = path.join(dirs.db, 'hub_sessions.json');
const readHub       = () => { try { return JSON.parse(fs.readFileSync(HUB_FILE,'utf8')); } catch { return []; } };
const writeHub      = h  => fs.writeFileSync(HUB_FILE, JSON.stringify(h.slice(0,200), null, 2));
const readSessions  = () => { try { return JSON.parse(fs.readFileSync(HUB_SESS_FILE,'utf8')); } catch { return {}; } };
const writeSessions = s  => fs.writeFileSync(HUB_SESS_FILE, JSON.stringify(s, null, 2));

const activeRuns = new Map(); // runId → { proc }

app.get('/api/hub/history', (_, res) => res.json(readHub()));
app.delete('/api/hub/history', (_, res) => { writeHub([]); res.json({ ok:true }); });

// Lista de sessões
app.get('/api/hub/sessions', (_, res) => {
  const s = readSessions();
  const list = Object.entries(s)
    .map(([id, sess]) => ({
      id,
      claudeSessionId: sess.claudeSessionId,
      turns: Math.floor((sess.turns?.length || 0) / 2),
      preview: sess.turns?.[0]?.content?.slice(0, 70) || 'Sessão vazia',
      created_at: sess.created_at,
      updated_at: sess.updated_at
    }))
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .slice(0, 30);
  res.json(list);
});

// Detalhe de uma sessão (turnos completos)
app.get('/api/hub/sessions/:id', (req, res) => {
  const sess = readSessions()[req.params.id];
  if (!sess) return res.status(404).json({ error: 'sessão não encontrada' });
  res.json(sess);
});

// Deletar sessão
app.delete('/api/hub/sessions/:id', (req, res) => {
  const s = readSessions();
  delete s[req.params.id];
  writeSessions(s);
  res.json({ ok: true });
});

// Cancelar um run ativo
app.post('/api/hub/cancel', (req, res) => {
  const { runId } = req.body;
  const run = activeRuns.get(runId);
  if (!run) return res.status(404).json({ error: 'run não encontrado' });
  try { run.proc.kill('SIGTERM'); } catch (_) {}
  activeRuns.delete(runId);
  res.json({ ok: true });
});

app.post('/api/hub/chat', (req, res) => {
  const { message, sessionId, model } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'mensagem vazia' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const heartbeat = setInterval(() => { try { res.write(': ping\n\n'); } catch (_) {} }, 8000);

  const projectDir = path.resolve(__dirname, '..');
  const claudeExe  = path.join(process.env.APPDATA || '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
  const claudeBin  = fs.existsSync(claudeExe) ? claudeExe : 'claude';

  // stream-json devolve eventos estruturados (texto, custo, session_id)
  const args = ['--output-format', 'stream-json', '--verbose'];

  // Se já temos um claudeSessionId para essa sessão, retomamos o contexto
  const sessions     = readSessions();
  const hubSessId    = sessionId || null;
  const claudeSessId = hubSessId && sessions[hubSessId]?.claudeSessionId;
  if (claudeSessId) args.push('--resume', claudeSessId);

  if (model) args.push('--model', model);
  args.push('-p', message);

  const runId = randomUUID();
  const proc  = spawn(claudeBin, args, {
    cwd: projectDir, shell: false,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  activeRuns.set(runId, { proc });

  // Envia runId imediatamente para o cliente poder cancelar
  try { res.write(`data: ${JSON.stringify({ type: 'run_id', runId })}\n\n`); } catch (_) {}

  let fullText = '', newClaudeSessId = null, closed = false, buf = '';

  const finish = (code) => {
    if (closed) return;
    closed = true;
    activeRuns.delete(runId);
    clearInterval(heartbeat);

    // Persiste a sessão com o claudeSessionId retornado pelo Claude
    if (hubSessId) {
      const all = readSessions();
      if (!all[hubSessId]) all[hubSessId] = { claudeSessionId: null, turns: [], created_at: new Date().toISOString() };
      if (newClaudeSessId) all[hubSessId].claudeSessionId = newClaudeSessId;
      all[hubSessId].updated_at = new Date().toISOString();
      all[hubSessId].turns = (all[hubSessId].turns || []).concat([
        { role: 'user',      content: message.slice(0, 1000), ts: new Date().toISOString() },
        { role: 'assistant', content: fullText.slice(0, 8000), ts: new Date().toISOString() }
      ]);
      writeSessions(all);
    }

    const h = readHub();
    h.unshift({ id: randomUUID(), message: message.slice(0, 500), response: fullText.slice(0, 8000), ts: new Date().toISOString(), code, sessionId: hubSessId });
    writeHub(h);
    logAtividade('hub_chat', `Hub IA: ${message.slice(0, 60)}`, null);
    try { res.write(`data: ${JSON.stringify({ type: 'done', code })}\n\n`); res.end(); } catch (_) {}
  };

  proc.stdout.on('data', chunk => {
    buf += chunk.toString('utf8');
    const lines = buf.split('\n');
    buf = lines.pop(); // guarda linha incompleta
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const evt = JSON.parse(line);
        if (evt.type === 'assistant' && evt.message?.content) {
          for (const block of evt.message.content) {
            if (block.type === 'text' && block.text) {
              fullText += block.text;
              try { res.write(`data: ${JSON.stringify({ type: 'text', text: block.text })}\n\n`); } catch (_) {}
            }
          }
        } else if (evt.type === 'result') {
          newClaudeSessId = evt.session_id || null;
          try {
            res.write(`data: ${JSON.stringify({ type: 'meta', cost: evt.total_cost_usd, duration_ms: evt.duration_ms, session_id: evt.session_id })}\n\n`);
          } catch (_) {}
        }
      } catch (_) {
        // linha não é JSON — trata como texto plano (fallback para --print)
        if (line.trim()) {
          fullText += line + '\n';
          try { res.write(`data: ${JSON.stringify({ type: 'text', text: line + '\n' })}\n\n`); } catch (_) {}
        }
      }
    }
  });

  proc.stderr.on('data', chunk => {
    const t = chunk.toString('utf8').trim();
    if (t && !t.includes('no stdin data received')) {
      try { res.write(`data: ${JSON.stringify({ type: 'info', text: t })}\n\n`); } catch (_) {}
    }
  });

  proc.on('error', err => {
    clearInterval(heartbeat);
    activeRuns.delete(runId);
    if (!closed) {
      closed = true;
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', text: `Erro ao iniciar Claude: ${err.message}` })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done', code: 1 })}\n\n`);
        res.end();
      } catch (_) {}
    }
  });

  proc.on('close', finish);
  req.on('close', () => { clearInterval(heartbeat); });
});

// ── SKILLS: lista skills do workspace ─────────────────────────────────────────
app.get('/api/skills', (_, res) => {
  const skillsDir = path.join(ROOT, '.claude', 'skills');
  if (!fs.existsSync(skillsDir)) return res.json([]);
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name !== '_shared')
    .map(e => {
      const skillFile = path.join(skillsDir, e.name, 'SKILL.md');
      if (!fs.existsSync(skillFile)) return null;
      const content = fs.readFileSync(skillFile, 'utf8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*[>|]?\s*\n?([\s\S]*?)(?=\n---|\nmetadata:)/m)
                     || content.match(/^description:\s*(.+)$/m);
      const name = nameMatch ? nameMatch[1].trim().replace(/^['"]|['"]$/g,'') : e.name;
      let desc = descMatch ? descMatch[1].replace(/^\s+/gm,'').replace(/\n/g,' ').trim() : '';
      if (desc.length > 120) desc = desc.slice(0, 120) + '…';
      return { id: e.name, command: `/${e.name}`, name, description: desc };
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));
  res.json(skills);
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const wh = `http://localhost:${PORT}/webhook/whatsapp`;
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`║  Lucas Taveira Advogados — Sistema v2                ║`);
  console.log(`║  App:     http://localhost:${PORT}                       ║`);
  console.log(`║  Webhook: ${wh}  ║`);
  console.log(`╚══════════════════════════════════════════════════════╝\n`);
  exec(`start http://localhost:${PORT}`);
}).on('error', err => {
  if (err.code === 'EADDRINUSE') console.error(`\nPorta ${PORT} em uso. Execute: npx kill-port ${PORT}\n`);
  process.exit(1);
});
