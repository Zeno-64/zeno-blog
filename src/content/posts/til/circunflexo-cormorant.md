---
titulo: Cormorant Garamond e o circunflexo fora do lugar
descricao: Uma fonte linda no Google Fonts que entorta o "ê" e o "ô" em títulos grandes — e como testar acento antes de escolher fonte.
data: 2026-11-15
tipo: til
tags: [tipografia, css, fontes]
trilha: web
revisao:
  - pergunta: Que palavras usar para testar uma fonte em português?
    resposta: Palavras com todos os acentos, em tamanho de título — "você", "três", "experiência", "ação", "pôr", "à", "lápis". O texto padrão em inglês não mostra o problema.
---

Num site de estúdio de beleza, o título usava **Cormorant Garamond**, uma serifada elegante do Google Fonts. Em tamanho grande, o circunflexo de **"você"**, **"experiência"** e **"três"** aparecia alto demais e deslocado para a direita, como se tivesse sido colado por cima da letra.

Em inglês a fonte é impecável — e é em inglês que quase todo mundo testa.

## O que fiz

Troquei o título para **Playfair Display**, que tem o mesmo ar de revista e acentua direito. O corpo do texto, em Montserrat, não tinha problema nenhum.

## O teste que ficou

Antes de escolher uma fonte de título para site em português, digito no campo de teste do Google Fonts, em 72px:

```text
Você já pôs três ações à prova? Experiência, lápis, maçã, coração.
```

Se `ê â ô ã õ á à ç` saem certos nesse tamanho, a fonte serve. Leva dez segundos e evita trocar a fonte com o site pronto.
