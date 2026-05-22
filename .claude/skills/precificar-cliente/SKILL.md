---
name: precificar-cliente
description: >
  Sugere faixa de honorários e modalidade de cobrança com base no perfil financeiro do cliente,
  complexidade do caso e tipo de demanda. Classifica em três faixas: acima da OAB, OAB, ou encaminhar parceiro.
  Use quando o usuário disser "/precificar-cliente", "quanto cobrar desse cliente",
  "qual a precificação", "consegue pagar?", ou quando a triagem classificar o potencial.
---

# /precificar-cliente — Sugestão de Precificação

## Dependências

- `_memoria/empresa.md` — perfil de cliente e política do escritório
- `clientes/dossies/{cliente}.md` — dados da triagem e perfil
- `ofertas/consumidor.md`, `ofertas/imobiliario.md`, `ofertas/sucessorio.md` — faixas por área

---

## Critérios de classificação

### Faixa A — Acima da Tabela OAB
**Quando:** Renda estimada classe A/B + caso complexo ou urgente
- Honorários: 20-30% acima da tabela OAB
- Modalidade: fixo ou êxito com entrada robusta

### Faixa B — Tabela OAB
**Quando:** Renda classe C + caso com laudo ABUSIVO ou NO LIMITE com potencial real
- Honorários: tabela OAB vigente GO
- Modalidade: êxito + entrada (R$ 500-1.500)

### Faixa C — Abaixo / Terceirizar
**Quando:** Renda classe D + laudo DENTRO DA MÉDIA + valor baixo
- Opção 1: Honorários de êxito puro (sem entrada) — aceitar se o volume justificar
- Opção 2: Encaminhar para advogado parceiro — receber comissão de indicação

---

## Referências de honorários por área (Goiás)

### Direito do Consumidor — Revisão de financiamento
| Valor do contrato | Tabela OAB |
|---|---|
| Até R$ 20.000 | R$ 1.500 – R$ 2.500 |
| R$ 20.001 – R$ 50.000 | R$ 2.500 – R$ 5.000 |
| R$ 50.001 – R$ 100.000 | R$ 5.000 – R$ 10.000 |
| Acima de R$ 100.000 | A negociar |

### Direito Imobiliário
- Assessoria compra e venda: 1% a 2% do valor do imóvel
- Due diligence isolada: R$ 2.000 – R$ 4.000 (fixo)
- Distrato/ação contra construtora: 15-20% de êxito

### Direito Sucessório — Inventário extrajudicial
- 6% a 10% do monte-mor (valor total do espólio)
- Mínimo: R$ 3.000

---

## Workflow

### Passo 1 — Ler perfil do cliente

Abrir `clientes/dossies/{cliente}.md` e identificar:
- Renda estimada (classe A/B/C/D)
- Tipo de demanda e valor envolvido
- Laudo BACEN (se for caso bancário)

### Passo 2 — Classificar faixa

Aplicar os critérios acima. Se houver dúvida entre B e C, preferir B e sugerir êxito com entrada baixa.

### Passo 3 — Montar proposta

Gerar sugestão estruturada:

```
Faixa: {A / B / C}
Honorários: R$ {min} – R$ {max}
Modalidade: {fixo / êxito + entrada / êxito puro / terceirizar}
Entrada sugerida: R$ {valor} (se aplicável)
Justificativa: {1 linha — por que essa faixa}
```

### Passo 4 — Alertas de risco

Sinalizar se:
- Cliente tem protestos ativos → risco de inadimplência nos honorários
- Caso tem potencial baixo → confirmar com Lucas antes de aceitar
- Valor do litígio < honorários sugeridos → inviável, recomendar renegociar ou rejeitar

---

## Regras

- Nunca comunicar a classificação de faixa ao cliente
- Sugestão é orientação para Lucas — ele decide e negocia
- Tabela OAB é o piso, não o teto — para clientes de alta renda, cobrar acima
- Caso Faixa C: sempre perguntar a Lucas antes de encaminhar — ele pode ter razão estratégica para aceitar
