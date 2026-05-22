---
name: resposta-duvida
description: >
  Banco de FAQ jurídico com respostas padronizadas e aprovadas pelo Lucas.
  Identifica o padrão da pergunta do cliente e entrega a resposta correta,
  calibrada ao tom do escritório (jurídico-acessível, sem prometer resultado).
  Use quando o usuário disser "/resposta-duvida", "como responder isso",
  "resposta pra essa dúvida", ou quando o N8N identificar dúvida repetida no WhatsApp.
---

# /resposta-duvida — Banco de FAQ Jurídico

## Dependências

- `_memoria/preferencias.md` — tom de voz do escritório
- Tom: jurídico-acessível — técnico suficiente para ser levado a sério, simples para o leigo entender
- NUNCA prometer resultado, NUNCA afirmar abusividade sem cálculo BACEN

---

## Categorias de dúvidas e respostas

### Categoria 1 — Abusividade de juros

**Padrões de pergunta:**
- "Meu contrato é abusivo?"
- "Tô pagando muito de juros, é legal isso?"
- "Posso entrar na justiça contra o banco?"
- "O banco pode cobrar essa taxa?"

**Resposta padrão:**
> "Essa é uma análise que precisa ser feita caso a caso, com base na taxa média praticada pelo mercado — dado público que consultamos direto no Banco Central. Para saber se o seu contrato tem juros abusivos, preciso que você me informe a taxa mensal que está no contrato (geralmente aparece como '% a.m.') e o tipo de financiamento (veículo, imóvel, pessoal). Com esses dados, tenho o resultado em minutos."

---

### Categoria 2 — Como funciona o processo de revisão

**Padrões de pergunta:**
- "Como funciona a revisão de contrato?"
- "Vou ter que ir ao banco? Vai ter audiência?"
- "Quanto tempo demora?"
- "O banco vai me ligar?"

**Resposta padrão:**
> "O processo de revisão de juros abusivos é 100% judicial — você não precisa ir ao banco nem negociar diretamente. Entramos com uma ação pedindo a revisão das cláusulas e, se o juiz deferir, o banco é obrigado a recalcular as parcelas. O tempo médio varia de 6 a 18 meses dependendo da comarca e da complexidade do caso. Mas antes de falar em prazo, preciso analisar o seu contrato para saber se há fundamento para a ação."

---

### Categoria 3 — Posso cancelar o financiamento?

**Padrões de pergunta:**
- "Posso cancelar o financiamento?"
- "Quero devolver o carro, como faz?"
- "Posso desistir do contrato?"

**Resposta padrão:**
> "Cancelar o financiamento e devolver o bem é possível em alguns casos, mas exige análise cuidadosa — porque dependendo das condições do contrato e do que já foi pago, pode ser desvantajoso. O que fazemos com mais frequência é a *revisão* das condições do contrato, não o cancelamento. Para te orientar corretamente, preciso entender melhor a sua situação. Me conta: qual é o banco, o valor do bem e há quanto tempo você está pagando?"

---

### Categoria 4 — Honorários e custos

**Padrões de pergunta:**
- "Quanto custa?"
- "Qual o valor dos honorários?"
- "Tem algum custo inicial?"

**Resposta padrão:**
> "Os honorários dependem do tipo e da complexidade do seu caso — por isso a primeira etapa é a análise do contrato, que é gratuita. Depois da análise, apresentamos a proposta de honorários com clareza: o valor, a forma de pagamento e o que está incluído. Trabalhamos com modalidades de êxito (honorários vinculados ao resultado) e fixo, dependendo do caso."

---

### Categoria 5 — Compra e venda de imóvel

**Padrões de pergunta:**
- "Vocês fazem contrato de compra e venda?"
- "Preciso de advogado para comprar um imóvel?"
- "O que é due diligence de imóvel?"

**Resposta padrão:**
> "Sim, atuamos em assessoria jurídica imobiliária — tanto para quem está comprando quanto para quem está vendendo. A nossa análise cobre: verificação de documentação do imóvel, certidões do vendedor, revisão do contrato de compra e venda e acompanhamento do processo de escritura e registro. Para contratos acima de R$ 100.000, a assessoria jurídica evita uma série de surpresas que podem custar muito mais do que os honorários. Quer agendar uma conversa para entender como funciona no seu caso?"

---

### Categoria 6 — Inventário

**Padrões de pergunta:**
- "Preciso fazer inventário, como começa?"
- "Meu pai faleceu, o que fazer com os bens?"
- "Inventário extrajudicial, o que é?"

**Resposta padrão:**
> "O inventário extrajudicial — que é feito em cartório, sem precisar de processo judicial — é a forma mais rápida e menos custosa quando todos os herdeiros são maiores, capazes e estão de acordo com a partilha. O prazo médio é de 30 a 60 dias. Para começar, preciso de algumas informações: quantos herdeiros são, quais são os bens (imóveis, contas, veículos), e se há testamento. Com isso, posso te dar um panorama completo do processo."

---

## Workflow

### Passo 1 — Identificar a categoria

Ler a pergunta do cliente e mapear para uma das 6 categorias acima.
Se não se encaixar em nenhuma: sinalizar como "nova dúvida — não coberta pelo FAQ" e pedir orientação ao Lucas para criar nova resposta.

### Passo 2 — Adaptar a resposta

Ajustar a resposta padrão ao contexto específico do cliente (nome, banco, valor mencionado) sem alterar a essência ou as restrições éticas.

### Passo 3 — Verificar tom

Antes de entregar, confirmar que a resposta:
- Não promete resultado
- Não afirma abusividade sem cálculo
- Não usa juridiquês desnecessário
- Tem chamada para próxima ação (ex: "me conta mais sobre...", "quer agendar?")

### Passo 4 — Entregar

Apresentar a resposta formatada, pronta para copiar e enviar no WhatsApp.

---

## Regras

- Nunca inventar dados jurídicos — se não souber a resposta certa, sinalizar
- Sempre terminar com uma pergunta ou chamada para ação — não deixar o cliente sem próximo passo
- Se a dúvida for sobre um caso específico que já pode ser analisado: oferecer `/analisar-contrato` imediatamente
- Novas dúvidas recorrentes que não estão no FAQ: registrar e pedir a Lucas para validar texto antes de padronizar
