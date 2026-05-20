---
name: seo
description: >
  Fluxo completo de SEO, GEO e Google Ads em 8 passos: pesquisa de demanda, análise de
  concorrência, Google Meu Negócio, otimização on-page, estratégia de conteúdo, Google Ads,
  checklist de monitoramento e GEO (aparecer em IAs como ChatGPT, Gemini, Perplexity).
  Use quando o usuário pedir "seo", "geo", "palavras-chave", "google ads",
  "aparecer no google", "aparecer no chatgpt", "aparecer nas ias",
  "google meu negócio", "gmb", "analisar concorrência seo",
  "pesquisa de nicho", "google trends".
---

# /seo — SEO completo + GEO + Google Ads

## Dependências

- **Contexto do negócio:** `_memoria/empresa.md`
- **Tom de voz:** `_memoria/preferencias.md`
- **Estratégia atual:** `_memoria/estrategia.md`
- **Ferramentas:** WebSearch, WebFetch (nativos)
- **Outputs vão em:** `marketing/seo/`

---

## Passos disponíveis

| Passo | Nome | Arquivo de referência | Output |
|---|---|---|---|
| 1 | Demanda | `.claude/skills/seo/01-demanda.md` | `marketing/seo/01-pesquisa-demanda.md` |
| 2 | Concorrência | `.claude/skills/seo/02-concorrencia.md` | `marketing/seo/02-analise-concorrencia.md` |
| 3 | GMB | `.claude/skills/seo/03-gmb.md` | `marketing/seo/03-google-meu-negocio.md` |
| 4 | On-page | `.claude/skills/seo/04-on-page.md` | `marketing/seo/04-otimizacao-on-page.md` |
| 5 | Conteúdo | `.claude/skills/seo/05-conteudo.md` | `marketing/seo/05-estrategia-conteudo.md` |
| 6 | Google Ads | `.claude/skills/seo/06-google-ads.md` | `marketing/seo/06-google-ads.md` |
| 7 | Monitoramento | `.claude/skills/seo/07-monitoramento.md` | `marketing/seo/07-checklist-monitoramento.md` |
| 8 | GEO | `.claude/skills/seo/08-geo.md` | `marketing/seo/08-geo-otimizacao-ia.md` |

---

## Execução

**Completa:** Ao rodar `/seo`, executar todos os 8 passos em sequência. Para cada passo, ler o arquivo de referência correspondente e seguir suas instruções. Entre cada passo, mostrar resumo do que foi encontrado antes de seguir.

**Parcial:** O usuário pode rodar apenas um passo:
- `/seo passo 3` ou `/seo gmb` ou `/seo geo`
- Nesse caso, ler APENAS o arquivo do passo solicitado

Ao finalizar (todos os passos ou passo individual), apresentar **resumo executivo** com:
- Top 5 oportunidades encontradas
- Ações prioritárias (o que fazer primeiro)
- Estimativa de investimento em ads (se passo 6 foi executado)
- Próximos passos recomendados

---

## Regras

- Toda pesquisa deve ser real (usar WebSearch/WebFetch), nunca inventar dados de volume ou concorrência
- Copies e textos seguem `_memoria/preferencias.md` estritamente
- Termos em português do Brasil, como o público busca
- Quando um dado não puder ser obtido (ex: volume exato), deixar claro que é estimativa e explicar a lógica
- Focar em termos com intenção comercial/transacional pra negócio B2C/B2B local
- Schema markup em formato JSON-LD (padrão Google)
- Google Ads: nunca inventar CPC ou estimativas de custo sem base real
