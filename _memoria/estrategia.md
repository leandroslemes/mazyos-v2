# Estratégia

## Fase

Validação e primeira automação. Escritório funcionando, com cliente entrando, mas travado no gargalo do Lucas na triagem.

## Gargalo atual

Lucas é o único ponto de captação + fechamento + cross-sell. Tempo dele consumido por leads desqualificados e dúvidas repetidas impede dedicar mais energia a leads de alto potencial e crescer a operação.

Três problemas em cascata:
1. Ele explica o básico (o que é abusividade, por que o contrato não é abusivo) antes de chegar na conversa de fechamento
2. Volume de leads de baixa renda crescendo — não conseguem pagar tabela OAB, então ele perde ou aceita pagar mal
3. Cross-sell e captação dependem 100% da presença dele — se tira o pé, para de entrar dinheiro novo

## Prioridade principal

**Tirar do Lucas a tarefa de "explicar que o contrato NÃO é abusivo".**

Essa é a tarefa de maior frequência, maior tempo gasto e menor retorno:
- Acontece toda semana, várias vezes
- Vira conversa de 20-30 min porque o cliente quer entender o porquê
- Termina sem contrato — o cliente vai embora, Lucas saiu no prejuízo de tempo
- Ele tem que "tirar a esperança" de alguém que tá afogado em parcela

**Solução:** análise BACEN automática + resposta padronizada no WhatsApp via N8N.
Lead manda foto do contrato → N8N faz OCR + extrai taxa + consulta BACEN + calcula desvio → bot responde se é ou não abusivo.
Lucas só entra quando o laudo dá abusivo — ou seja, quando vale o tempo dele.

**Meta:** 90% dos casos "não abusivos" resolvidos sem Lucas tocar.
**API BACEN:** pública e gratuita — primeira vitória rápida pra mostrar valor.

## O que pode esperar

- Monetização de leads de baixa renda (funil B / parceiro terceirizado)
- Cross-sell estruturado sem depender do Lucas na frente
- Conteúdo para Instagram (pode rodar em paralelo, mas não é o gargalo)

## Contexto com prazo

- Fase 2 do roadmap (automação triagem BACEN) — implementar primeiro
- Confirmar tom de voz com Lucas antes de gerar peças de conteúdo
- Confirmar hex das cores e arquivos do logo com João Paulo Fabino (designer) antes de gerar visuais
