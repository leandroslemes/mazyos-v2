# MazyOS — Sistema operacional do negócio

Sua empresa roda em cima desse arquivo. O `/instalar` complementa o
final com regras específicas do seu negócio.

---

## Contexto do negócio

No início de toda conversa, ler (quando existirem e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona
2. `_memoria/preferencias.md` — tom de voz, estilo, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos
4. `_memoria/goals.md` — metas ativas e progresso (se existir)

Usar essas informações como base pra qualquer resposta ou decisão.

Pra tarefas visuais (carrossel, post, landing page), consultar
`identidade/design-guide.md` como referência de estilo.

Não listar o que foi lido nem confirmar a leitura. Usar naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante
em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se
não encontrar, executar normalmente.

Regras adicionais de comportamento estão em `.claude/rules/` — o Claude
as carrega automaticamente quando relevantes.
