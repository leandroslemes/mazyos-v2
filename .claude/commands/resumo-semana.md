Gera um resumo do que foi produzido nos últimos 7 dias.

1. Rodar `git log --since="7 days ago" --oneline` pra ver commits recentes
2. Listar arquivos criados/modificados na última semana em `marketing/`, `saidas/`, `clientes/`
3. Contar: quantos carrosséis, blogs, emails, relatórios foram gerados

Responder no formato:

```
Semana [DD/MM — DD/MM]:
- X carrosséis criados
- X blogs (Y publicados, Z em draft)
- X emails rascunhados
- X relatórios gerados
- Outros: [listar se houver]

Destaques: [1-2 itens mais relevantes]
```

Se não houver commits ou arquivos recentes: "Semana sem produção registrada."
