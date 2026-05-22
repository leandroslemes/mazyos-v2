---
name: analisar-contrato
description: >
  Análise de abusividade contratual via API pública do Banco Central.
  Recebe taxa do contrato, tipo de financiamento e prazo.
  Consulta a média BACEN, calcula o desvio e emite laudo:
  ABUSIVO / NO LIMITE / DENTRO DA MÉDIA.
  Use quando o usuário disser "/analisar-contrato", "analisa esse contrato",
  "é abusivo?", "quanto é a média BACEN", ou quando receber taxa de financiamento.
---

# /analisar-contrato — Análise BACEN

## Dependências

- `ferramentas/indice.md` — endpoints da API BACEN e códigos de série
- Bash (para consultar a API via curl)
- Output: `saidas/laudos-bacen/{cliente}-{data}.md`

---

## Tipos de financiamento e séries BACEN

| Tipo | Série BACEN | Descrição |
|---|---|---|
| Veículo novo (pessoa física) | 20714 | Financiamento de veículos novos — PF |
| Veículo usado (pessoa física) | 20715 | Financiamento de veículos usados — PF |
| Imóvel (SBPE) | 433 | Crédito imobiliário — taxa média mensal |
| Crédito pessoal não consignado | 20586 | Crédito pessoal sem vínculo empregatício |
| Crédito pessoal consignado | 20585 | Crédito pessoal com desconto em folha |

---

## Workflow

### Passo 1 — Coletar dados do contrato

Perguntar se não foram fornecidos:
1. **Taxa de juros** do contrato (ao mês — ex: "2,49% a.m." ou "29,88% a.a.")
2. **Tipo de financiamento** (veículo novo/usado, imóvel, pessoal)
3. **Banco/financeira**
4. **Prazo** em meses
5. **Nome do cliente** (para nomear o laudo)

Se a taxa vier em formato anual, converter para mensal:
`taxa_mensal = (1 + taxa_anual/100)^(1/12) - 1`

### Passo 2 — Consultar API BACEN

Usar o código da série correspondente ao tipo de financiamento.

```bash
# Exemplo para veículo novo (série 20714)
curl -s "https://api.bcb.gov.br/dados/serie/bcdata.sgs.20714/dados/ultimos/1?formato=json"
```

Retorno esperado:
```json
[{"data":"21/05/2025","valor":"1.91"}]
```

O valor retornado é a taxa média mensal em percentual.

### Passo 3 — Calcular desvio

```
desvio_percentual = ((taxa_contrato - media_bacen) / media_bacen) * 100
```

### Passo 4 — Classificar

| Desvio | Laudo | Orientação |
|---|---|---|
| > 50% acima da média | **ABUSIVO** | Laudo positivo — recomendar ação de revisão |
| 20% a 50% acima | **NO LIMITE** | Analisar cláusulas adicionais (IOF, seguros, tarifas) |
| < 20% acima ou abaixo da média | **DENTRO DA MÉDIA** | Contrato regular — informar cliente |

### Passo 5 — Emitir laudo

Salvar em `saidas/laudos-bacen/{cliente}-{YYYY-MM-DD}.md`:

```markdown
# Laudo de Abusividade — {Nome do Cliente}
**Data:** {data}
**Analista:** Sistema MazyOS / Claude Code

## Contrato analisado
- **Banco:** {banco}
- **Tipo:** {tipo de financiamento}
- **Taxa contratada:** {taxa}% a.m.
- **Prazo:** {prazo} meses

## Comparativo BACEN
- **Média BACEN ({mês}/{ano}):** {media}% a.m.
- **Série consultada:** {código da série}
- **Desvio:** {desvio}% ({acima/abaixo} da média)

## Laudo

### {ABUSIVO / NO LIMITE / DENTRO DA MÉDIA}

{Texto explicativo do laudo — 2-3 linhas técnicas e acessíveis}

## Recomendação
{O que fazer a seguir}

---
*Laudo gerado automaticamente. Sujeito à revisão pelo Dr. Lucas Taveira (OAB/GO).*
*Fonte: Banco Central do Brasil — {URL da série}*
```

### Passo 6 — Integrar com triagem

Se o laudo for **ABUSIVO** ou **NO LIMITE**: informar o resultado e perguntar se quer rodar `/briefing-cliente` na sequência.

Se for **DENTRO DA MÉDIA**: informar e sugerir resposta padrão ao cliente (via `/resposta-duvida`).

---

## Texto padrão por veredito (adaptar ao tom do cliente)

**ABUSIVO:**
> "Analisei as condições do seu contrato com base na taxa média praticada pelo mercado, conforme dados do Banco Central. A taxa aplicada está {desvio}% acima da média — o que configura abusividade e fundamenta uma ação de revisão. Preciso de mais alguns dados para calcular o valor exato que pode ser recuperado."

**NO LIMITE:**
> "A taxa do seu contrato está acima da média do mercado, mas para confirmar se há abusividade preciso analisar o contrato completo — especialmente tarifas, IOF e seguros embutidos. Pode me enviar o contrato ou a primeira página?"

**DENTRO DA MÉDIA:**
> "Analisei a taxa do seu financiamento com base nos dados do Banco Central. A taxa aplicada está dentro da faixa praticada pelo mercado — o que não caracteriza abusividade de juros. Se quiser, posso verificar se existem outros tipos de cobrança irregular no contrato."

---

## Regras

- Nunca afirmar abusividade sem executar o cálculo BACEN — vedação OAB
- Sempre registrar a data da consulta BACEN (as médias mudam mensalmente)
- Laudo salvo em saidas/laudos-bacen/ — nunca sobrescrever laudos anteriores
- Texto para o cliente: técnico o suficiente para ser levado a sério, simples o suficiente para o leigo entender
- Nunca prometer resultado antes de analisar o contrato completo
