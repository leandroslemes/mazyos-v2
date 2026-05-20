Verifica a fila de conteúdo pendente:

1. Buscar arquivos de blog com `draft: true` no frontmatter (em `site/` ou subpastas)
2. Buscar pastas em `marketing/conteudo/` que NÃO têm subpasta `instagram/` com PNGs (carrossel criado mas não renderizado)
3. Buscar pastas em `marketing/conteudo/` que não têm `legenda.md`

Responder com lista curta no formato:

```
Fila de publicação:
- [draft] titulo-do-blog.md — falta: renderizar PNGs
- [draft] outro-blog.md — pronto pra /aprovar-post
- [sem legenda] marketing/conteudo/pasta-x/

Nada pendente? → "Fila limpa. Próximo tema: [sugerir do 05-estrategia-conteudo.md se existir]"
```

Se não encontrar nenhum blog ou conteúdo, responder: "Nenhum conteúdo na fila. Rode /publicar-tema pra criar."
