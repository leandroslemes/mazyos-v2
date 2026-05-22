---
name: triagem
description: >
  Classifica um lead em Alto, Médio ou Baixo potencial.
  Identifica a área jurídica (consumidor / imobiliário / sucessório),
  sugere funil e próxima ação. Atualiza clientes/pipeline.md.
  Use quando receber dados de um novo lead ou mensagem de WhatsApp,
  ou quando o usuário disser "/triagem", "classifica esse lead",
  "qual o potencial desse cliente", "triagem do João".
---

# /triagem — Classificação de Lead

## Dependências

- `_memoria/empresa.md` — perfil de cliente ideal por área
- `ofertas/consumidor.md`, `ofertas/imobiliario.md`, `ofertas/sucessorio.md` — critérios de cada área
- `clientes/pipeline.md` — CRM onde o resultado é salvo
- `saidas/laudos-bacen/` — laudo BACEN (se já existir)

---

## Workflow

### Passo 1 — Coletar dados do lead

Se o lead vier de `inbox/leads/`, ler o arquivo. Se vier da conversa, coletar:

- Nome e telefone
- Descrição do problema em linguagem do cliente
- Valor envolvido (parcela, imóvel, herança)
- Banco/financeira ou outra parte
- Canal de entrada (Instagram, indicação, WhatsApp orgânico)

### Passo 2 — Identificar área jurídica

| Palavras-chave | Área |
|---|---|
| financiamento, parcela, juros, banco, carro, casa, abusivo, Santander, Itaú, BV, Bradesco | Consumidor |
| imóvel, compra, venda, escritura, incorporadora, construtora, distrato, lote | Imobiliário |
| inventário, herança, falecimento, partilha, testamento, herdeiros | Sucessório |

### Passo 3 — Calcular potencial

**ALTO potencial:**
- Laudo BACEN abusivo (>50% acima da média) OU no limite com taxas embutidas suspeitas
- Valor do litígio > R$ 30.000
- Renda estimada compatível com tabela OAB
- Demanda clara e documentável

**MÉDIO potencial:**
- Laudo BACEN "no limite" (20-50% acima)
- Valor entre R$ 10.000 e R$ 30.000
- Renda classe C/D — tabela OAB apertada mas viável
- Demanda razoável, pode precisar de documentação adicional

**BAIXO potencial:**
- Contrato dentro da média BACEN (<20% acima)
- Valor < R$ 10.000
- Renda muito baixa — não sustenta honorários tabela OAB
- Demanda fraca ou sem documentação

### Passo 4 — Sugerir funil

| Potencial | Funil |
|---|---|
| Alto | → Notificar Lucas para atendimento prioritário |
| Médio | → Entrar no follow-up automático de 24h |
| Baixo | → Encaminhar para parceiro terceirizado |

### Passo 5 — Radar de cross-sell

Durante a análise, identificar menções a:
- "tenho um imóvel", "quero vender", "comprar casa" → oportunidade imobiliária
- "meu pai faleceu", "herança", "inventário" → oportunidade sucessória
- "outro financiamento" → potencial de segundo caso

Registrar no dossiê se identificar algum.

### Passo 6 — Salvar e notificar

1. Criar ou atualizar `clientes/dossies/{nome}-{data}.md`:

```markdown
# Dossiê — {Nome}
**Data:** {data}
**Telefone:** {telefone}
**Canal:** {canal}

## Demanda
{descrição do problema}

## Triagem
- **Área:** {área}
- **Potencial:** {ALTO / MÉDIO / BAIXO}
- **Laudo BACEN:** {resultado ou "pendente"}
- **Precificação sugerida:** {faixa}

## Cross-sell radar
{oportunidades identificadas ou "Nenhuma"}

## Próxima ação
{ação recomendada}
```

2. Atualizar `clientes/pipeline.md` adicionando linha na tabela do funil correto.

3. Se Alto potencial: informar Lucas que o briefing foi gerado e o lead aguarda.

---

## Regras

- Nunca classificar sem ao menos nome + descrição do problema
- Se não tiver laudo BACEN e a demanda for bancária, marcar "laudo pendente" e rodar `/analisar-contrato`
- Tom neutro nos dossiês — fatos, não julgamentos
- Se o potencial for Baixo, não informar isso ao lead — apenas encaminhar
