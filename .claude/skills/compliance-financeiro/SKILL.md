---
name: compliance-financeiro
description: >
  Verifica conformidade de contratos de financiamento com a legislação consumerista brasileira
  (CDC, Código Civil, Resoluções BACEN, Súmulas STJ). Produz checklist de compliance
  e identifica violações que fundamentam ação de revisão contratual.
  Adaptado do compliance plugin (knowledge-work-plugins/legal).
  Use quando o usuário pedir "verificar conformidade", "está legal esse contrato",
  "quais leis foram violadas", "base legal para contestar", ou /compliance-financeiro.
---

# /compliance-financeiro — Checklist de Conformidade Jurídica

Skill de verificação de compliance em contratos de crédito ao consumidor. Analisa o contrato contra o arcabouço legal brasileiro aplicável e produz relatório de conformidade.

**Fonte:** Adaptado de `knowledge-work-plugins/legal/skills/compliance`

## Arcabouço Legal Aplicável

### CDC — Código de Defesa do Consumidor (Lei 8.078/90)

| Artigo | Obrigação | Violação comum |
|---|---|---|
| Art. 6°, III | Informação adequada e clara sobre o contrato | Taxa efetiva oculta ou mal informada |
| Art. 39, V | Proibição de cobrar sem prestação de serviço | TAC, TEC, seguros sem contraprestação |
| Art. 46 | Contrato com clareza suficiente para compreensão | Linguagem técnica excessiva sem explicação |
| Art. 51, IV | Proibição de cláusula abusiva que desvantaje consumidor | Taxa muito acima da média de mercado |
| Art. 51, XII | Proibição de obrigação acessória abusiva | Seguro obrigatório vinculado |
| Art. 52 | Informações obrigatórias no crédito | Ausência de CET, taxa mensal e anual, total a pagar |

### Código Civil

| Artigo | Obrigação |
|---|---|
| Art. 317 | Revisão por desequilíbrio superveniente (cláusula rebus sic stantibus) |
| Art. 395 | Juros de mora máximo 1% a.m. |
| Art. 421-A | Revisão em contratos de adesão |
| Art. 422 | Boa-fé objetiva nas relações contratuais |

### Resoluções BACEN / CMN

| Norma | Conteúdo |
|---|---|
| Res. CMN 3.919/10 | Tarifas bancárias — lista exaustiva de cobranças permitidas |
| Res. CMN 4.197/13 | Seguros — proibição de venda casada |
| Circ. BACEN 3.978/20 | CET — Custo Efetivo Total obrigatório no contrato |
| Res. CMN 4.676/18 | SFH — financiamento habitacional |

### Súmulas STJ Relevantes

| Súmula | Conteúdo |
|---|---|
| Súm. 297 | CDC aplicável às instituições financeiras |
| Súm. 382 | Abusividade de juros não decorre apenas de ultrapassar 12% a.a. |
| Súm. 530 | Pacto de redução de juros não veda ação de revisão |
| Súm. 541 | PIS/COFINS não integra a base de cálculo dos juros |
| Súm. 560 | Capitalização mensal de juros depende de pactuação expressa |
| Súm. 572 | Comissão de permanência: vedada cumulação com outros encargos |
| Súm. 596 | Cumulação: juros remuneratórios + correção monetária + multa permitida |

---

## Workflow

### Passo 1 — Identificar o tipo e as partes

1. Credor: banco / financeira / cooperativa / FGTS
2. Tipo: veículo / imóvel / pessoal / consignado / cartão
3. Data de assinatura (normas podem mudar ao longo do tempo)
4. Estado de assinatura (pode afetar foro e legislação estadual)

### Passo 2 — Verificar o CET (Custo Efetivo Total)

- O contrato informa a taxa mensal? ✓/✗
- O contrato informa a taxa anual? ✓/✗
- O contrato informa o CET? ✓/✗
- O valor total a pagar está expresso? ✓/✗
- Ausência de qualquer item = **infração ao art. 52 CDC + Circ. BACEN 3.978**

### Passo 3 — Verificar encargos

Para cada encargo cobrado:
- É encargo permitido pela Res. CMN 3.919?
- Há contraprestação real pelo serviço?
- Foi informado antes da assinatura?

Encargos que requerem atenção especial:
- **TAC (Tarifa de Abertura de Crédito):** vedada para contratos após 30/04/2008
- **TEC (Tarifa de Emissão de Carnê):** vedada para contratos a partir de 30/04/2011
- **Seguros:** devem ser opcionais, com livre escolha da seguradora
- **Comissão de permanência:** vedada acumulação com outros encargos moratórios

### Passo 4 — Verificar taxa de juros

- Comparar a taxa informada no contrato com a taxa efetiva cobrada
- Verificar se há capitalização composta (anatocismo) — permitida se pactuada expressamente
- Calcular desvio em relação à média BACEN (usar /analisar-contrato se necessário)
- Identificar se há "spread" excessivo ou juros punitivos ocultos

### Passo 5 — Relatório de conformidade

```markdown
# Relatório de Compliance — [Cliente] / [Banco]
**Data:** [data]  **Tipo de crédito:** [tipo]

## Status Geral: ✅ CONFORME / ⚠️ PARCIALMENTE CONFORME / ❌ NÃO CONFORME

## Checklist de Informações Obrigatórias (Art. 52 CDC)
- [ ] Taxa de juros mensal informada
- [ ] Taxa anual (CET) informada
- [ ] Total de parcelas e valor de cada uma
- [ ] Valor total a pagar
- [ ] Valor das tarifas e encargos

## Análise de Encargos
| Encargo | Status | Base Legal | Ação |
|---|---|---|---|
| [encargo] | ✅/⚠️/❌ | [lei/res.] | [o que fazer] |

## Violações Identificadas
1. **[violação]:** [descrição + base legal + fundamento para ação]

## Fundamentos para Ação Judicial
[texto jurídico citando os artigos e súmulas violados, pronto para usar na petição]

## Recomendação
[Ação cabível: revisional / declaratória / repetição de indébito + cumulação possível]
```

### Passo 6 — Salvar

Salvar em `saidas/compliance/<cliente>-<YYYY-MM-DD>.md`.

---

## Regras

- Sempre citar o número exato do artigo, lei e data
- Verificar se a súmula aplicável é do STJ (federal) ou TJ local
- Não confundir "ilegal" com "ineficaz" — algumas cláusulas são nulas de pleno direito, outras apenas anuláveis
- Se não tiver certeza sobre norma específica, indicar "verificar com especialista em [tema]"
- Nunca garantir sucesso na ação — compliance não significa vitória, apenas fundamentos
