---
name: avaliar-risco
description: >
  Avalia e classifica o risco jurídico de um caso usando matriz severidade × probabilidade.
  Gera score de risco (VERDE/AMARELO/LARANJA/VERMELHO), estima exposição financeira,
  indica se escalona para conselho externo e produz memo de risco estruturado.
  Adaptado do legal-risk-assessment plugin (knowledge-work-plugins/legal).
  Use quando o usuário pedir "avaliar risco", "qual é o risco desse caso",
  "probabilidade de ganhar", "quanto posso cobrar de êxito", ou /avaliar-risco.
---

# /avaliar-risco — Avaliação de Risco Jurídico

Skill de avaliação de risco de casos. Recebe descrição do caso → aplica matriz severidade × probabilidade → gera score, recomendações e memo de risco.

**Fonte:** Adaptado de `knowledge-work-plugins/legal/skills/legal-risk-assessment`

## Dependências

- **Contexto do caso:** dados do lead em `clientes/pipeline.md` ou descrição fornecida
- **Tom:** `_memoria/preferencias.md`
- **Outputs vão em:** `saidas/avaliacoes-risco/<cliente>-<YYYY-MM-DD>.md`

---

## Matriz de Risco

### Dimensão 1 — Severidade (impacto se o risco se materializar)

| Nível | Label | Critério para nosso escritório |
|---|---|---|
| 1 | Negligível | Desvio < 20% da média BACEN; contrato sem garantia real; valor < R$ 5k |
| 2 | Baixo | Desvio 20-50% ou valor R$ 5k–R$ 20k; chances de acordo amigável altas |
| 3 | Moderado | Desvio > 50% ou valor R$ 20k–R$ 80k; banco historicamente difícil |
| 4 | Alto | Valor > R$ 80k; busca e apreensão em andamento; negativação já ocorreu |
| 5 | Crítico | Execução judicial ativa; risco de perda do bem imóvel; múltiplos credores |

### Dimensão 2 — Probabilidade (chance do resultado favorável ao cliente)

| Nível | Label | Critério |
|---|---|---|
| 5 | Quase certo | Taxa contratada > 2x a média BACEN; jurisprudência uniforme favorável |
| 4 | Provável | Desvio > 50%; banco com histórico de condenações similares |
| 3 | Possível | Desvio 20-50%; depende de análise de tarifas e seguros |
| 2 | Improvável | Desvio < 20%; taxa dentro da média; contestação técnica difícil |
| 1 | Remoto | Taxa abaixo da média; contrato bem estruturado; sem vícios aparentes |

> **Atenção:** probabilidade aqui é de resultado favorável (ganhar) — diferente do modelo original que mede probabilidade de risco se materializar.

### Score de Viabilidade

**Score = Severidade × Probabilidade (de ganho)**

| Score | Viabilidade | Cor | Honorários sugeridos |
|---|---|---|---|
| 16-25 | **EXCELENTE** | 🟢 VERDE | Êxito, entrada reduzida ou gratuita |
| 10-15 | **BOA** | 🟡 AMARELO | Êxito com entrada padrão |
| 5-9 | **MODERADA** | 🟠 LARANJA | Êxito com entrada elevada ou fixo parcial |
| 1-4 | **BAIXA** | 🔴 VERMELHO | Encaminhar parceiro ou declinar |

---

## Workflow

### Passo 1 — Receber o caso

Perguntar (se não tiver todos os dados):
1. Nome do cliente e área (consumidor / imobiliário / sucessório)
2. Valor total do contrato / patrimônio em disputa
3. Taxa contratada (se financiamento) — checar contra BACEN se não analisado ainda
4. Banco / parte contrária
5. Há contrato disponível para análise? Já foi analisado pelo /analisar-contrato?
6. Situação atual: inadimplência, negativação, busca e apreensão, execução?

### Passo 2 — Aplicar a matriz

Para cada dimensão, escolher o nível (1-5) com justificativa.

Calcular o Score de Viabilidade.

### Passo 3 — Recomendações

Com base no score:

**🟢 VERDE (16-25):**
- Prioridade máxima — atender imediatamente
- Proposta: honorários de êxito (15-25% do valor recuperado) + entrada simbólica ou gratuita
- Prazo meta para protocolar: 3 dias úteis
- Ação: emitir laudo BACEN, preparar petição inicial

**🟡 AMARELO (10-15):**
- Alta prioridade — atender em 48h
- Proposta: honorários de êxito + entrada padrão (R$ 500–R$ 1.000)
- Ação: solicitar contrato completo, analisar tarifas e seguros embutidos

**🟠 LARANJA (5-9):**
- Prioridade normal — avaliar custo-benefício para o cliente
- Proposta: honorário fixo (R$ 1.500–R$ 3.000) ou êxito com entrada elevada
- Ação: explicar ao cliente que o caso é possível mas não garantido

**🔴 VERMELHO (1-4):**
- Declinar ou encaminhar
- Ação: explicar o motivo com clareza; sugerir parceiro especializado se pertinente
- Nota: não criar expectativa falsa para o cliente

### Passo 4 — Memo de risco

```markdown
# Avaliação de Risco — [Nome do Cliente]
**Data:** [data]  **Área:** [área]  **Analista:** Lucas Taveira

## Resumo
Caso: [descrição em 2 linhas]

## Score de Viabilidade
Severidade: [1-5] — [label e justificativa]
Probabilidade de êxito: [1-5] — [label e justificativa]
**Score: [resultado] — [COR]**

## Exposição Financeira Estimada
Valor em disputa: R$ [valor]
Excesso estimado recuperável: R$ [valor] (se calculável via BACEN)
Exposição de honorários: R$ [faixa sugerida]

## Fatores Favoráveis
- [fator 1]
- [fator 2]

## Fatores de Risco
- [risco 1]
- [risco 2]

## Recomendação
[texto da recomendação conforme score]

## Próximos Passos
1. [ação — responsável — prazo]
```

### Passo 5 — Salvar

Salvar o memo em `saidas/avaliacoes-risco/<nome-cliente>-<YYYY-MM-DD>.md`.

---

## Regras

- Nunca prometer percentual de êxito exato ("90% de chance de ganhar" — proibido pelo CED)
- Usar sempre linguagem de probabilidade qualitativa ("alta", "moderada")
- Se o caso for VERMELHO, explicar com respeito e clareza — cliente merece honestidade
- Se houver laudos BACEN já emitidos, usar os dados deles na avaliação
- Atualizar o pipeline.md com o score calculado
