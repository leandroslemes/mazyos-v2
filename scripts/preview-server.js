/**
 * MazyOS Preview Server
 * Serve os HTMLs de marketing/conteudo/ com live preview no browser.
 * 
 * Uso: node scripts/preview-server.js [porta]
 * Acessa: http://localhost:3333
 * 
 * Mostra grid de todos os carrosséis gerados com links diretos.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2]) || 3333;
const CONTENT_DIR = path.join(__dirname, '..', 'marketing', 'conteudo');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function getContentFolders() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const folder = path.join(CONTENT_DIR, d.name);
      const hasHtml = fs.existsSync(path.join(folder, 'carrossel.html'));
      const hasPngs = fs.existsSync(path.join(folder, 'instagram'));
      const hasLegenda = fs.existsSync(path.join(folder, 'legenda.md'));
      return { name: d.name, hasHtml, hasPngs, hasLegenda };
    })
    .sort((a, b) => b.name.localeCompare(a.name));
}

function renderIndex() {
  const folders = getContentFolders();
  const rows = folders.map(f => {
    const status = [];
    if (f.hasHtml) status.push('<span style="color:#22c55e">HTML</span>');
    if (f.hasPngs) status.push('<span style="color:#3b82f6">PNGs</span>');
    if (f.hasLegenda) status.push('<span style="color:#a855f7">Legenda</span>');
    const link = f.hasHtml ? `<a href="/view/${f.name}/carrossel.html">Abrir</a>` : '—';
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${f.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${status.join(' ')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${link}</td>
    </tr>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>MazyOS — Preview</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Inter,system-ui,sans-serif; background:#fafafa; padding:40px; }
    h1 { font-size:24px; margin-bottom:8px; color:#1a1a1a; }
    p.sub { color:#666; margin-bottom:32px; font-size:14px; }
    table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
    th { text-align:left; padding:12px; background:#1a1a1a; color:#fff; font-size:13px; }
    a { color:#2563eb; text-decoration:none; font-weight:500; }
    a:hover { text-decoration:underline; }
    .empty { text-align:center; padding:40px; color:#999; }
  </style>
</head>
<body>
  <h1>MazyOS Preview</h1>
  <p class="sub">Conteudo em marketing/conteudo/ — atualiza ao recarregar</p>
  ${folders.length === 0 
    ? '<div class="empty">Nenhum conteudo encontrado. Rode /carrossel ou /publicar-tema primeiro.</div>'
    : `<table>
    <thead><tr><th>Pasta</th><th>Status</th><th>Preview</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`}
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderIndex());
    return;
  }

  if (req.url.startsWith('/view/')) {
    const relativePath = req.url.replace('/view/', '');
    const filePath = path.join(CONTENT_DIR, decodeURIComponent(relativePath));
    
    if (!filePath.startsWith(CONTENT_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n  MazyOS Preview Server rodando em:\n`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Servindo: ${CONTENT_DIR}`);
  console.log(`  Ctrl+C pra parar\n`);
});
