# Lucas Taveira Advogados — MazyOS

Workspace do escritório Lucas Taveira Advogados. Sistema operacional do negócio jurídico — organiza operação, conteúdo, automações e comunicação.

## O que é esse workspace

Operação digital do escritório Lucas Taveira Advogados. Concentra memória do negócio, identidade visual, marketing jurídico, automações de triagem e materiais comerciais.

**Estrutura de pastas:**
- `_memoria/` — quem é o escritório, como falamos, foco atual
- `identidade/` — marca aplicada em tudo que o sistema gera
- `marketing/` — conteúdo para Instagram, artigos jurídicos, campanhas
- `saidas/` — documentos pontuais gerados pelo sistema
- `dados/` — arquivos a analisar (contratos, extratos, planilhas)
- `scripts/` — automações e utilitários
- `frontend/` — MazyOS dashboard (Node.js/Express, porta 3000). Iniciar com `node server.js` dentro da pasta
- `sistemas/` — workflows N8N (`sistemas/n8n/`) e commands do Claude Code

## Contexto do negócio

No início de toda conversa, ler (quando existirem e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o escritório, o que faz, como funciona
2. `_memoria/preferencias.md` — tom de voz, estilo, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos
4. `_memoria/goals.md` — metas ativas e progresso (se existir)

Usar essas informações como base pra qualquer resposta ou decisão.

Pra tarefas visuais (carrossel, post, landing page), consultar `identidade/design-guide.md` como referência de estilo.

Não listar o que foi lido nem confirmar a leitura. Usar naturalmente.

## Sobre o escritório

Lucas Taveira Advogados é um escritório de advocacia digital (serviços 100% online). Atua em revisão de juros abusivos em financiamentos, assessoria em compra e venda de imóveis e inventário extrajudicial. Atende principalmente pessoa física (classe média/baixa) que chega pelo Instagram ou indicação.

## Estrutura de pastas (MVP)

- `inbox/leads/` — mensagens e dados de novos leads (alimentado pelo N8N na Fase 2)
- `inbox/contratos/` — PDFs e fotos de contratos recebidos
- `clientes/pipeline.md` — CRM em Markdown (atualizado pela skill /triagem)
- `clientes/dossies/` — dossiê individual por cliente
- `ofertas/` — critérios e honorários por área (consumidor, imobiliario, sucessorio)
- `saidas/laudos-bacen/` — laudos gerados pela skill /analisar-contrato
- `saidas/briefings/` — briefings gerados pela skill /briefing-cliente
- `saidas/minutas/` — minutas de peças processuais
- `ferramentas/indice.md` — endpoints de APIs (BACEN, Receita, etc.)
- `frontend/` — dashboard MazyOS completo: Hub IA (sessões Claude Code), CRM de leads, pipeline, biblioteca de carrosseis, catálogo de skills
- `sistemas/n8n/` — 4 workflows de automação: wf1 (WhatsApp triagem), wf2 (BACEN), wf3 (enriquecimento), wf4 (notificação)

## Equipe

- **Lucas Taveira** — sócio principal, advogado (OAB/GO). Cuida de captação, triagem, fechamento de contratos, conteúdo no Instagram e artigos jurídicos.
- **Amanda Carolina** — advogada (OAB/GO). Operacional jurídico: peças processuais, acompanhamento de prazos.

## Tom de voz

Jurídico-acessível: técnico o suficiente pra ser levado a sério, simples o suficiente pro cliente leigo entender. Sóbrio, direto, sem juridiquês pesado.

**Nunca:** prometer resultado antes de analisar contrato, afirmar abusividade sem cálculo BACEN, linguagem de guru motivacional.

Ver `_memoria/preferencias.md` para detalhes e pendências de calibração.

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se não encontrar, executar normalmente.

Regras adicionais de comportamento estão em `.claude/rules/` — carregadas automaticamente quando relevantes.

## Regras do sistema

- Documentos jurídicos salvos em `saidas/`
- Conteúdo de marketing em `marketing/`
- Dados e contratos pra análise em `dados/`
- Identidade visual sempre consultada em `identidade/design-guide.md` antes de gerar peças
- Tom de voz sempre consultado em `_memoria/preferencias.md` antes de escrever qualquer coisa em nome do Lucas

## Skills disponíveis (24 no total — ver catálogo em `.claude/skills/`)

**Jurídicas (core):**
- `/triagem` — classifica lead em Alto/Médio/Baixo potencial, atualiza pipeline
- `/analisar-contrato` — consulta API BACEN e emite laudo de abusividade
- `/briefing-cliente` — dossiê de 1 página para Lucas antes do atendimento
- `/precificar-cliente` — sugere faixa de honorários por perfil do cliente
- `/resposta-duvida` — banco de FAQ jurídico com respostas padronizadas
- `/revisar-clausulas` — análise de cláusulas contratuais
- `/avaliar-risco` — matriz de risco jurídico (VERDE/AMARELO/VERMELHO)
- `/compliance-financeiro` — conformidade com CDC, Código Civil, Banco Central

**Conteúdo e marketing:**
- `/carrossel` — cria carrossel/post visual (HTML + PNG via Playwright)
- `/publicar-tema` — conteúdo SEO completo a partir de um tema
- `/email-profissional` — rascunha emails profissionais
- `/anuncio-google` — estrutura de campanha Google Ads
- `/seo` — fluxo completo SEO/GEO/Google Ads
- `/responder-avaliacoes` — respostas para avaliações Google Meu Negócio
- `/aprovar-post` — publica post da fila de conteúdo

**Operação e sistema:**
- `/atualizar` — reconcilia arquivos de contexto com o estado real do workspace
- `/salvar` — commit + push para o GitHub
- `/goal` — define e acompanha metas com tracking persistente
- `/abrir` — abre sessão de trabalho carregando memória do negócio
- `/instalar` — configura MazyOS em novo negócio
- `/mapear-rotinas` — mapeia tarefas repetitivas e gera skills personalizadas
- `/novo-projeto` — cria pasta de projeto com CLAUDE.md dedicado
- `/analisar-dados` — analisa CSV/Excel e gera resumo executivo
- `/relatorio-ads` — relatório de performance de anúncios pagos

## Ferramentas conectadas

- [~] N8N (automação — triagem WhatsApp + análise BACEN) — workflows criados em `sistemas/n8n/`, aguardando configuração de URLs no painel
- [ ] WhatsApp Business — Fase 2
- [ ] Instagram (@luucastaveira)
- [ ] JusBrasil (artigos jurídicos)
- [ ] Google Calendar
- [ ] Gmail
- [x] API BACEN (pública e gratuita — usada pela skill /analisar-contrato)
