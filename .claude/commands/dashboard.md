Gera um dashboard HTML com visão consolidada do estado do MazyOS.

1. Ler `_memoria/empresa.md`, `_memoria/estrategia.md`, `_memoria/goals.md`
2. Verificar status de `identidade/design-guide.md` (preenchido ou vazio)
3. Listar skills disponíveis em `.claude/skills/`
4. Contar conteúdos em `marketing/conteudo/` (total, com PNGs, sem PNGs)
5. Contar blogs em draft vs publicados (se `site/` existir)
6. Verificar último commit (`git log -1 --format="%h %s (%ar)"`)

Gerar HTML estático em `saidas/dashboard.html` com:
- Nome do negócio e foco atual
- Progresso da meta ativa (barra visual)
- Tabela de conteúdos recentes (últimos 5)
- Lista de skills com descrição curta
- Status da memória (preenchida/vazia pra cada arquivo)
- Último commit/push

Estilo: fundo #fafafa, fonte Inter, cards com border-radius 8px, sombra sutil.
Sem dependências externas (CSS inline, Google Fonts via link).

Após gerar, informar: "Dashboard gerado em saidas/dashboard.html — abra no browser pra visualizar."
