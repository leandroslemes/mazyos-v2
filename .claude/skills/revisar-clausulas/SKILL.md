---
name: revisar-clausulas
description: >
  Análise profunda de cláusulas contratuais em contratos de financiamento, compra e venda
  de imóveis e instrumentos de inventário. Identifica desvios do playbook do escritório,
  classifica riscos por nível (VERDE/AMARELO/LARANJA/VERMELHO) e gera relatório de revisão
  com recomendações. Adaptado do contract-review plugin (knowledge-work-plugins/legal).
  Use quando o usuário pedir "revisar contrato", "analisar cláusulas", "checar contrato",
  "o que está errado nesse contrato", ou /revisar-clausulas.
---

# /revisar-clausulas — Revisão de Cláusulas Contratuais

Skill de análise contratual profunda. Recebe texto ou upload de contrato → analisa cada cláusula contra o playbook do escritório → classifica riscos → gera relatório com redlines e recomendações.

**Fonte:** Adaptado de `knowledge-work-plugins/legal/skills/contract-review`

## Dependências

- **Playbook de posições:** ver seção abaixo (embutido nesta skill)
- **Tom jurídico:** `_memoria/preferencias.md`
- **Outputs vão em:** `saidas/revisoes/<cliente>-<YYYY-MM-DD>/`

---

## Playbook do Escritório — Posições-Padrão

### Contratos de Financiamento (área: consumidor)

| Cláusula | Posição Ideal | Aceitável | Alerta Imediato |
|---|---|---|---|
| Taxa de juros | ≤ média BACEN | até +20% da média | > +50% da média |
| Multa por atraso | 2% | até 5% | > 5% (ilegal) |
| Juros de mora | 1% a.m. | até 1% a.m. | > 1% a.m. (ilegal) |
| Tarifa de cadastro | 0 | até R$ 450 | > R$ 450 (STJ) |
| Seguro obrigatório | Não | Opcional | Obrigatório sem escolha |
| TAC / TEC | 0 | Justificada | Genérica sem contraprestação |
| Cláusula de vencimento antecipado | Restrita | Inadimplemento claro | Gatilhos vagos |
| Foro | Domicílio do consumidor | Sede próxima | Foro distante abusivo |

### Contratos de Compra e Venda de Imóvel (área: imobiliário)

| Cláusula | Posição Ideal | Aceitável | Alerta Imediato |
|---|---|---|---|
| Entrega com tolerância | 0 dias | até 180 dias | > 180 dias sem penalidade |
| Multa por distrato (comprador) | ≤ 25% | até 25% | > 25% (Lei 13.786/18) |
| Retenção por inadimplência | ≤ 25% | até 25% | > 25% |
| Correção monetária | INCC na obra | INCC ou IPCA | Índices arbitrários |
| Comissão de corretagem | No preço | Separada com aviso | Cobrada sem informar |
| Habite-se | Responsabilidade do vendedor | Compartilhada | Exclusiva do comprador |
| Metragem | Tolerância 5% | até 5% | Acima → abatimento proporcional |

### Instrumentos de Inventário (área: sucessório)

| Item | Posição Ideal | Alerta |
|---|---|---|
| Avaliação dos bens | Valor de mercado | Sub/superavaliação |
| ITCMD base de cálculo | Valor mercado | Valor venal inferior |
| Partilha proporcional | Cotas iguais sem causa | Desigualdade sem motivação |
| Dívidas do espólio | Catalogadas e assumidas | Omissão de passivos |
| Meação do cônjuge | Respeitada | Confusão patrimonial |

---

## Workflow

### Passo 1 — Receber o contrato

1. Perguntar: qual é o tipo de contrato? (financiamento / compra-venda imóvel / inventário / outro)
2. Perguntar: o texto já está na conversa ou há arquivo para ler?
3. Se arquivo: ler de `dados/` ou do caminho informado
4. Confirmar o contexto: banco/credor, valor, partes, data de assinatura

### Passo 2 — Mapeamento de cláusulas

Ler o contrato inteiro e extrair:
- Todas as cláusulas com número/título
- Para cada cláusula: transcrever o trecho relevante + identificar a obrigação criada

**CHECKPOINT:** Mostrar lista de cláusulas identificadas. Aguardar confirmação antes da análise.

### Passo 3 — Análise contra o playbook

Para cada cláusula, classificar:

```
🟢 VERDE — Dentro do padrão ideal. Nenhuma ação necessária.
🟡 AMARELO — Aceitável mas acima do ideal. Registrar para negociação.
🟠 LARANJA — Desvio relevante. Recomendar negociação ou adendo.
🔴 VERMELHO — Inaceitável. Cláusula abusiva, ilegal ou que viola direito do consumidor.
```

Fundamentação para cada desvio:
- CDC (Lei 8.078/90) — arts. 39, 51, 52
- Código Civil — arts. 317, 395, 421, 422
- Súmulas STJ relevantes (Súm. 382, 297, 530, 560, 572, 628)
- Resolução BACEN ou circulares aplicáveis
- Lei 13.786/18 (incorporações imobiliárias)

### Passo 4 — Relatório de revisão

Gerar relatório estruturado com:

```markdown
# Revisão Contratual — [Nome do Cliente]
**Data:** [data]  **Contrato:** [tipo]  **Partes:** [credor × devedor]

## Resumo Executivo
[3-5 linhas: situação geral, número de alertas por nível, recomendação principal]

## Classificação Geral: [VERDE / AMARELO / LARANJA / VERMELHO]

## Análise de Cláusulas

### 🔴 CRÍTICOS (requerer correção antes de assinar)
[Para cada item: cláusula, trecho, problema, base legal, sugestão de redação]

### 🟠 ATENÇÃO (negociar ou registrar ressalva)
[idem]

### 🟡 REGISTRAR (acompanhar, sem ação imediata)
[idem]

### 🟢 OK (dentro do padrão)
[lista resumida das cláusulas sem problemas]

## Recomendação Final
[Assinar / Assinar com ressalvas / Negociar antes / Não assinar]

## Próximos Passos
1. [ação - responsável - prazo]
```

### Passo 5 — Salvar

Salvar o relatório em `saidas/revisoes/<nome-cliente>-<YYYY-MM-DD>.md`.

Perguntar: "Quer que eu crie uma peça de contestação ou notificação extrajudicial baseada nos pontos críticos?"

---

## Regras

- Nunca afirmar que uma cláusula é ilegal sem citar base legal específica
- Distinguir "ilegal" (viola lei expressa) de "abusivo" (viola proporcionalidade/boa-fé)
- Sempre indicar a Súmula ou julgado do STJ quando disponível
- Não dar parecer de "pode assinar" sem antes verificar os itens críticos
- Tom: técnico mas acessível para o cliente leigo entender os riscos
- Se o contrato estiver em imagem (foto), alertar que a análise pode ser incompleta
