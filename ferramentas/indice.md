# Índice de Ferramentas e APIs

## API Banco Central do Brasil (BACEN)

**Base URL:** `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{serie}/dados/ultimos/1?formato=json`
**Autenticação:** Nenhuma — API pública e gratuita
**Retorno:** `[{"data":"DD/MM/AAAA","valor":"X.XX"}]` — taxa em % ao mês

### Séries mais usadas

| Série | Descrição | Uso |
|---|---|---|
| 20714 | Financiamento de veículos novos — PF | Carros novos |
| 20715 | Financiamento de veículos usados — PF | Carros usados |
| 433 | Crédito imobiliário — SBPE | Imóveis |
| 20586 | Crédito pessoal não consignado | Empréstimo pessoal |
| 20585 | Crédito pessoal consignado | Desconto em folha |
| 11 | Taxa Selic (referência) | Comparativo geral |

### Exemplo de consulta (Bash)

```bash
# Veículo novo
curl -s "https://api.bcb.gov.br/dados/serie/bcdata.sgs.20714/dados/ultimos/1?formato=json"

# Histórico dos últimos 12 meses
curl -s "https://api.bcb.gov.br/dados/serie/bcdata.sgs.20714/dados/ultimos/12?formato=json"
```

---

## N8N (automação — a integrar na Fase 2)

**Status:** Pendente configuração
**Uso:** Webhook WhatsApp, OCR de contratos, enriquecimento de leads, notificações
**Docs:** n8n.io/docs

### Fluxos planejados
- `webhook-whatsapp` — captura mensagens via Evolution API ou Z-API
- `ocr-contrato` — extrai texto de PDFs/fotos de contratos
- `enriquecimento-lead` — Receita Federal, IEPTB-GO, PJe-GO
- `notificacao-lucas` — WhatsApp pessoal + Google Calendar

---

## WhatsApp Business API

**Status:** Pendente configuração
**Opções:** Evolution API (self-hosted) ou Z-API (cloud)
**Uso:** Triagem automática de leads, respostas do FAQ, notificação ao Lucas

---

## Google Vision API (OCR)

**Status:** Opcional — alternativa ao Tesseract
**Uso:** Extrair texto de fotos de contratos enviados pelo WhatsApp
**Custo:** Primeiras 1.000 chamadas/mês gratuitas

---

## PJe-GO (consulta processual)

**URL:** `https://pje.tjgo.jus.br`
**Uso:** Verificar se cliente tem processos ativos (enriquecimento de lead)
**Método:** Scraping via N8N (não tem API pública)

---

## Receita Federal (CPF)

**URL:** `https://www.receita.fazenda.gov.br/Aplicacoes/SSL/ATCTA/CPF/ConsultaPublica.asp`
**Uso:** Situação cadastral do CPF do lead
**Método:** Consulta pública via N8N
