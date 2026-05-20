# MazyOS — Tutorial Completo

> De zero a operação total. Passo a passo para quem nunca usou Claude Code.

---

## O que você vai precisar

1. **Um computador** (Windows, Mac ou Linux)
2. **VS Code** instalado — [baixar aqui](https://code.visualstudio.com/)
3. **Claude Code** instalado — a extensão de IA que roda no terminal
4. **Uma conta na Anthropic** (Claude) com créditos ou plano ativo
5. **Git** instalado (o VS Code geralmente já instala junto)

Se você não sabe se tem Git, abre o terminal e digita `git --version`. Se aparecer um número, tá instalado.

---

## Parte 1 — Instalação (5 minutos)

### Passo 1: Abrir o VS Code

Abra o VS Code. Se nunca usou, é só abrir como qualquer programa.

### Passo 2: Abrir o terminal integrado

No VS Code, aperte:
- **Windows/Linux:** `Ctrl + '` (crase)
- **Mac:** `Cmd + '`

Vai aparecer um terminal na parte de baixo da tela. É ali que você vai digitar tudo.

### Passo 3: Clonar o MazyOS

No terminal, cole e aperte Enter:

```
git clone https://github.com/mazzeoia/MazyOS.git
```

Espere terminar. Vai criar uma pasta chamada `MazyOS`.

### Passo 4: Entrar na pasta

```
cd MazyOS
```

### Passo 5: Abrir a pasta no VS Code

```
code .
```

Vai abrir uma nova janela do VS Code já dentro da pasta do MazyOS.

### Passo 6: Iniciar o Claude Code

No terminal da nova janela, digite:

```
claude
```

O Claude Code vai iniciar. Agora você está dentro do sistema.

### Passo 7: Rodar a instalação

Digite no Claude:

```
/instalar
```

O sistema vai te fazer **10 perguntas** sobre o seu negócio. Responda uma por vez, sem pressa. Ele vai perguntar:

1. Nome da empresa
2. O que você faz (em uma frase simples)
3. Quem te paga (perfil de cliente real)
4. Se trabalha sozinho ou tem equipe
5. Um exemplo real da sua escrita (cola uma legenda do Insta, um email, qualquer coisa)
6. O que te dá ranço quando alguém escreve (ex: "vamos juntos!", emojis demais)
7. Qual o gargalo do negócio hoje
8. Qual tarefa repetitiva você quer tirar das costas
9. Se tem identidade visual (cores, fonte)
10. Se tem logo

**Pronto.** O sistema agora te conhece.

### Passo 8: Renomear a pasta

Feche o VS Code. Vá no Explorer (Windows) ou Finder (Mac) e renomeie a pasta `MazyOS` para o nome do seu negócio. Exemplo: `minha-empresa`.

Abra o VS Code de novo nessa pasta renomeada.

---

## Parte 2 — Uso Diário (o básico)

### Começando o dia

Toda vez que abrir o VS Code pra trabalhar, inicie o Claude e digite:

```
/abrir
```

O sistema carrega tudo que sabe sobre você e mostra um resumo em 4 linhas:

```
Padaria do João — pães artesanais e confeitaria sob encomenda
Foco atual: aumentar pedidos pelo Instagram
Meta: Publicar 4 carrosséis — 2/4 (50%) — próximo: carrossel sobre fermentação
Tom: direto, quente, sem frescura

Pronto. O que vamos fazer?
```

A partir daí, é só pedir o que precisa.

### Salvando seu trabalho

Quando terminar uma sessão de trabalho:

```
/salvar
```

Ele faz backup de tudo no GitHub. Se nunca configurou, ele te guia no processo (leva 2 minutos na primeira vez).

### Vendo o que foi feito na semana

```
/resumo-semana
```

### Vendo o que está pendente

```
/fila
```

### Vendo o foco atual

```
/status
```

---

## Parte 3 — Definindo Metas com /goal

O `/goal` é o que transforma o MazyOS de "ferramenta que espera comando" para "parceiro que te cobra resultado".

### Criando sua primeira meta

Digite:

```
/goal
```

O sistema pergunta:
- **Qual o objetivo concreto?** → Ex: "Publicar 8 artigos no blog até fim de junho"
- **Até quando?** → Ex: "30/06/2026"

Ele quebra em sub-tarefas automaticamente:

```
Meta criada!

Objetivo: Publicar 8 artigos no blog
Prazo: 30/06/2026

Checklist:
- [ ] Artigo 1: como conservar pão artesanal
- [ ] Artigo 2: diferença entre fermentação natural e industrial
- [ ] Artigo 3: por que pão artesanal custa mais
- [ ] Artigo 4: receitas com pão dormido
- [ ] Artigo 5: como escolher farinha de qualidade
- [ ] Artigo 6: história do pão no Brasil
- [ ] Artigo 7: pão sem glúten — vale a pena?
- [ ] Artigo 8: como montar cesta de café da manhã
```

### Acompanhando o progresso

Toda vez que rodar `/abrir` ou `/goal`, o sistema mostra:

```
Meta: Publicar 8 artigos — 3/8 (37%)
Prazo: 30/06 (41 dias restantes)
Ritmo: 1.5 artigos/semana — no prazo
Próximo: Artigo 4 — receitas com pão dormido
```

### Progresso automático

Quando você roda `/publicar-tema` e publica um artigo que está na checklist, o sistema **marca automaticamente** como feito e te avisa:

```
Meta atualizada: 4/8 concluído (50%)
```

### Quando a meta é batida

O sistema celebra e pergunta:

```
Meta batida! Quer definir a próxima?
```

### Dica de ouro

Defina **no máximo 2 metas** ao mesmo tempo. Foco > quantidade. Uma meta de conteúdo + uma meta de vendas funciona bem.

---

## Parte 4 — As Skills (o que o sistema faz por você)

### Criar conteúdo pro Instagram

```
/carrossel
```

Diga o tema. Exemplo: "Cria um carrossel sobre como conservar pão artesanal em casa"

O sistema:
1. Escreve o texto (te mostra pra aprovar)
2. Cria o visual em HTML
3. Renderiza em PNG 1080x1350 (pronto pra postar)
4. Gera a legenda com hashtags

Tudo salvo em `marketing/conteudo/`.

### Criar conteúdo completo (blog + carrossel + legendas)

```
/publicar-tema
```

Diga o tema ou deixe ele sugerir da estratégia de SEO. Ele entrega:
- Artigo de blog completo
- Carrossel resumo
- Legenda pro Instagram/Facebook
- Legenda pro LinkedIn

### Plano de SEO completo

```
/seo
```

Roda 8 passos de pesquisa real (não inventa dados):
1. Pesquisa o que as pessoas buscam no seu nicho
2. Analisa quem são seus concorrentes online
3. Monta seu Google Meu Negócio
4. Otimiza seu site
5. Cria estratégia de conteúdo
6. Estrutura campanhas de Google Ads
7. Monta checklist de monitoramento
8. Otimiza pra aparecer em IAs (ChatGPT, Gemini)

Se quiser rodar só um passo: `/seo passo 3` (só Google Meu Negócio).

### Campanha de Google Ads

```
/anuncio-google
```

Gera a campanha inteira em CSV pronto pra importar no Google Ads Editor.

### Relatório de anúncios

```
/relatorio-ads
```

Cole os exports do Google Ads e Meta Ads. Ele gera relatório com alertas e recomendações.

### Responder avaliações do Google

```
/responder-avaliacoes
```

Cole as avaliações. Ele escreve respostas humanas, curtas e personalizadas.

### Email profissional

```
/email-profissional
```

Diga pra quem é e o objetivo. Ele rascunha no seu tom de voz.

### Analisar dados

```
/analisar-dados
```

Jogue um CSV, planilha ou PDF na pasta `dados/` e peça a análise. Ele gera resumo executivo.

### Novo projeto/cliente

```
/novo-projeto
```

Cria pasta organizada com briefing e contexto dedicado.

---

## Parte 5 — Fluxo Ideal de Trabalho

### Segunda-feira (planejamento)

```
/abrir
/goal          ← ver progresso da meta
/fila          ← ver o que está pendente
/status        ← confirmar foco da semana
```

Decidir o que fazer na semana baseado no que o sistema mostra.

### Terça a quinta (produção)

```
/publicar-tema conservar-pao-artesanal
```

Ou:

```
/carrossel "5 erros que estragam seu pão"
```

Ou:

```
/email-profissional "responder o cliente João sobre orçamento de encomenda"
```

### Sexta (fechamento)

```
/resumo-semana     ← ver o que produziu
/salvar            ← backup no GitHub
/goal              ← conferir se está no ritmo
```

### Mensal

```
/seo passo 7       ← rodar checklist de monitoramento
/relatorio-ads     ← se tiver campanhas rodando
/dashboard         ← visão geral em HTML
```

---

## Parte 6 — Dicas para Extrair o Máximo

### 1. Corrija o sistema — ele aprende

Se o Claude escrever algo que não combina com você, corrija:

> "Não usa 'alavancar', eu nunca falo assim. Prefiro 'fazer crescer'."

Ele vai perguntar: "Quer que eu salve isso pra não precisar repetir?"

Diga sim. Na próxima vez, ele já sabe.

### 2. Crie skills personalizadas

Se você repete algo toda semana que nenhuma skill cobre:

```
/mapear-rotinas
```

Ele te entrevista sobre o que você repete e cria skills sob medida.

### 3. Use o preview server pra ver carrosséis

No terminal (fora do Claude):

```
node scripts/preview-server.js
```

Abre http://localhost:3333 no browser. Todos os carrosséis aparecem ali com preview.

### 4. Mantenha a memória atualizada

Se algo mudou no negócio (novo serviço, novo cliente, mudou de foco):

```
/atualizar
```

O sistema varre tudo e propõe atualizações.

### 5. Defina metas realistas

Boas metas pro `/goal`:
- "Publicar 4 artigos até fim do mês"
- "Criar campanha de Google Ads até sexta"
- "Responder todas as avaliações pendentes hoje"

Metas ruins:
- "Melhorar o marketing" (vago demais)
- "Faturar R$ 100k" (não depende só do sistema)

### 6. Rode /seo uma vez — use o resultado por meses

O `/seo` é pesado (demora 30-60 min). Mas o resultado alimenta todas as outras skills:
- `/publicar-tema` puxa temas da estratégia de conteúdo
- `/anuncio-google` puxa keywords da pesquisa de demanda
- `/carrossel` puxa tom e linguagem das preferências

Rode uma vez, use por 3 meses. Depois rode de novo.

### 7. Não tenha medo de errar

O `/salvar` faz backup no GitHub. Se algo der errado, tudo pode ser recuperado. O sistema é feito pra você usar sem medo.

---

## Parte 7 — Resumo dos Comandos

| Comando | O que faz | Quando usar |
|---|---|---|
| `/instalar` | Setup inicial | Uma vez só |
| `/abrir` | Carrega contexto | Início de cada sessão |
| `/salvar` | Backup no GitHub | Fim de cada sessão |
| `/goal` | Define/acompanha metas | Planejamento |
| `/status` | Foco + progresso | Rápido check |
| `/fila` | Conteúdo pendente | Decidir o que fazer |
| `/resumo-semana` | O que foi produzido | Sexta-feira |
| `/dashboard` | Visão geral em HTML | Mensal |
| `/carrossel` | Cria post visual | Produção de conteúdo |
| `/publicar-tema` | Blog + carrossel + legendas | Produção completa |
| `/seo` | Plano de SEO em 8 passos | Uma vez por trimestre |
| `/anuncio-google` | Campanha Google Ads | Quando for anunciar |
| `/relatorio-ads` | Relatório de performance | Semanal (se tiver ads) |
| `/responder-avaliacoes` | Respostas pro Google | Quando tiver reviews |
| `/email-profissional` | Rascunho de email | Quando precisar |
| `/analisar-dados` | Resumo de CSV/planilha | Quando tiver dados |
| `/novo-projeto` | Pasta de cliente/projeto | Novo trabalho |
| `/mapear-rotinas` | Cria skills personalizadas | Quando repetir algo |
| `/atualizar` | Sincroniza memória | Quando algo mudar |

---

## Parte 8 — Se algo der errado

| Problema | Solução |
|---|---|
| "Não reconhece o comando" | Verifique se está dentro da pasta do MazyOS no terminal |
| "Memória em branco" | Rode `/instalar` de novo |
| "Carrossel sem PNG" | Instale Playwright: `npx playwright install chromium` |
| "Não consegue postar no Instagram" | Configure as chaves da Meta API no `.env` (peça ajuda ao Claude) |
| "Perdeu algum arquivo" | Rode `git log` pra ver histórico e `git checkout` pra recuperar |
| "Sistema lento" | Normal em skills pesadas como `/seo`. Espere terminar. |
| "Quer recomeçar do zero" | Delete os arquivos em `_memoria/` e rode `/instalar` |

---

## Última dica

O MazyOS não é uma ferramenta que você usa de vez em quando. É o sistema onde seu negócio roda. Quanto mais você usa, mais ele te conhece, mais rápido fica, e menos você precisa repetir.

Comece com `/abrir` todo dia. O resto vem naturalmente.
