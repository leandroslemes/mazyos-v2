---
name: briefing-cliente
description: >
  Gera o dossiê de 1 página que Lucas lê antes de atender o cliente.
  Consolida triagem + laudo BACEN + perfil financeiro + precificação sugerida + radar de cross-sell.
  Use quando o usuário disser "/briefing-cliente", "monta o briefing do João",
  "prepara o atendimento", "o que eu preciso saber antes de ligar", ou quando a triagem finalizar com potencial Alto.
---

# /briefing-cliente — Dossiê pré-atendimento

## Dependências

- `clientes/dossies/{cliente}.md` — dados da triagem
- `saidas/laudos-bacen/{cliente}-*.md` — laudo BACEN (se existir)
- `ofertas/consumidor.md` — faixas de honorários por tipo de caso
- Output: `saidas/briefings/{cliente}-{data}.md`

---

## Workflow

### Passo 1 — Coletar fontes

1. Ler `clientes/dossies/{cliente}.md` — triagem feita
2. Ler laudo BACEN mais recente em `saidas/laudos-bacen/` (se existir)
3. Se não tiver laudo e a demanda for bancária: rodar `/analisar-contrato` antes de continuar

### Passo 2 — Calcular precificação sugerida

Com base no perfil do cliente e tipo de caso:

| Perfil | Tipo | Honorários sugeridos |
|---|---|---|
| Classe A/B | Qualquer | Acima da tabela OAB |
| Classe C | Consumidor (veículo/imóvel) | Tabela OAB — R$ 2.500 a R$ 5.000 |
| Classe C | Imobiliário | Tabela OAB — 1-2% do valor do imóvel |
| Classe C | Sucessório | Tabela OAB — 6-10% do monte-mor |
| Classe D | Ticket baixo | Encaminhar parceiro OR honorários de êxito puro |

Modalidades possíveis:
- **Êxito + entrada:** entrada R$ 500-1.000 + % do resultado
- **Fixo:** valor único — para demandas com prazo previsível
- **Êxito puro:** sem entrada — para clientes de baixa renda (margem menor, volume maior)

### Passo 3 — Radar de cross-sell

Revisar dossiê buscando sinais de outras demandas:

| Sinal no dossiê | Oportunidade |
|---|---|
| "tenho um apartamento", "quero comprar/vender" | Assessoria imobiliária |
| "meu pai/mãe faleceu", "herança", "bens do casal" | Inventário extrajudicial |
| "outro financiamento", "segundo veículo" | Segundo caso de revisão |
| "construtora atrasou", "distrato" | Direito imobiliário |
| "negativado", "nome sujo" | Direito do consumidor |

### Passo 4 — Gerar briefing

Salvar em `saidas/briefings/{cliente}-{YYYY-MM-DD}.md`:

```markdown
# Briefing pré-atendimento — {Nome}
**Data:** {data} · **Gerado às:** {hora}

---

## Situação em 30 segundos
{2-3 linhas resumindo o caso de forma direta — o que o cliente quer, o que o sistema encontrou, o que Lucas precisa decidir}

## Potencial: {ALTO / MÉDIO / BAIXO}

---

## O caso
| Campo | Dado |
|---|---|
| Tipo de demanda | {tipo} |
| Banco/parte contrária | {banco ou parte} |
| Valor envolvido | {R$ valor} |
| Prazo | {prazo} |
| Canal de entrada | {canal} |

## Análise BACEN
| Campo | Dado |
|---|---|
| Taxa do contrato | {taxa}% a.m. |
| Média BACEN | {media}% a.m. (mês/ano) |
| Desvio | {desvio}% |
| Laudo | **{ABUSIVO / NO LIMITE / DENTRO DA MÉDIA}** |

## Perfil do cliente
| Campo | Dado |
|---|---|
| Renda estimada | {classe} |
| Protestos | {resultado} |
| Processos ativos | {resultado} |
| Histórico no escritório | {sim/não} |

## Proposta sugerida
| Campo | Dado |
|---|---|
| Faixa de honorários | R$ {min} – R$ {max} |
| Modalidade | {êxito+entrada / fixo / êxito puro} |
| Entrada sugerida | R$ {valor} |
| Observação | {se houver} |

## Cross-sell radar
{Oportunidades identificadas ou "Nenhuma detectada nessa triagem"}

## Próxima ação
{O que Lucas precisa fazer na conversa — validar contrato completo? Fechar? Negociar faixa?}

---
*Briefing gerado automaticamente pelo MazyOS. Revisar antes de usar.*
```

### Passo 5 — Notificar

Informar que o briefing foi salvo e onde encontrá-lo.
Se Alto potencial: perguntar se quer que o sistema adicione ao Google Calendar (via N8N quando disponível).

---

## Regras

- Briefing deve ser lido em menos de 2 minutos — sem redundância
- "Situação em 30 segundos" é obrigatória — Lucas lê isso antes de qualquer campo
- Cross-sell é sugestão, não instrução — Lucas decide se e quando abordar
- Nunca incluir cálculo de valores de indenização sem contrato completo analisado
- Salvar sempre com data no nome — nunca sobrescrever briefing anterior