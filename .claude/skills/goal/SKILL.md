---
name: goal
description: >
  Define, acompanha e atualiza metas do negócio com tracking persistente.
  Cria e mantém o arquivo `_memoria/goals.md` com checklist de progresso.
  Use quando o usuário disser "definir meta", "qual minha meta", "progresso",
  "como tá o objetivo", "/goal", "quero atingir X até Y", "meta do mês".
---

# /goal — Metas com tracking persistente

Transforma o MazyOS de reativo (espera comando) pra proativo (sugere próximo passo baseado na meta).

## Dependências

- **Arquivo de metas:** `_memoria/goals.md` (criar se não existir)
- **Estratégia:** `_memoria/estrategia.md` (pra alinhar meta com foco)
- **Contexto:** `_memoria/empresa.md`

---

## Workflow

### Criar meta nova

Se o usuário pedir pra definir uma meta:

1. Perguntar (se não ficou claro):
   - "Qual o objetivo concreto? (ex: publicar 4 artigos, fechar 2 clientes, faturar X)"
   - "Até quando? (data limite)"

2. Quebrar em sub-tarefas mensuráveis (3-8 itens)

3. Salvar em `_memoria/goals.md` no formato:

```markdown
## Meta ativa

**Objetivo:** [descrição concreta]
**Prazo:** [data]
**Criada em:** [data de hoje]

### Checklist

- [ ] Sub-tarefa 1
- [ ] Sub-tarefa 2
- [ ] Sub-tarefa 3
- ...

### Progresso

- [data] — Meta criada
```

Se já existir uma meta ativa, perguntar:
> "Já tem uma meta ativa: '[objetivo]'. Quer substituir, adicionar outra, ou marcar como concluída?"

### Consultar progresso

Se o usuário perguntar "como tá a meta", "progresso", ou rodar `/goal`:

1. Ler `_memoria/goals.md`
2. Contar itens feitos vs total
3. Calcular ritmo (itens/semana) e projetar se vai bater o prazo
4. Responder em 3-5 linhas:

```
Meta: [objetivo] — [X/Y] concluído ([Z%])
Prazo: [data] ([N dias restantes])
Ritmo: [N itens/semana] — [no prazo / atrasado / adiantado]
Próximo: [próximo item não-feito da checklist]
```

### Marcar progresso

Quando uma skill completar algo que bate com um item da meta (ex: `/publicar-tema` publica um blog que está na checklist), atualizar automaticamente:

1. Marcar o item como `[x]` em `_memoria/goals.md`
2. Adicionar linha no histórico: `- [data] — [item] concluído via /[skill]`
3. Informar o usuário: "Meta atualizada: [X/Y] concluído."

### Concluir meta

Quando todos os itens estiverem marcados (ou o usuário disser "meta concluída"):

1. Mover o bloco pra seção `## Metas concluídas` no final do arquivo
2. Adicionar data de conclusão
3. Perguntar: "Meta batida! Quer definir a próxima?"

---

## Integração com /abrir

O `/abrir` deve ler `_memoria/goals.md` e incluir uma linha de progresso no resumo de sessão:

```
Meta: [objetivo] — [X/Y] ([Z%]) — próximo: [item]
```

---

## Regras

- Máximo 2 metas ativas simultâneas (foco > quantidade)
- Sub-tarefas devem ser concretas e verificáveis (não "melhorar SEO", sim "publicar artigo sobre X")
- Nunca marcar item como feito sem evidência (arquivo criado, commit feito, etc.)
- Se o prazo passou e a meta não foi batida, alertar no próximo `/abrir` ou `/goal`
- Metas concluídas ficam como histórico — nunca apagar
