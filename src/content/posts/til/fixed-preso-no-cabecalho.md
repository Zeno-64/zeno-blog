---
titulo: O menu fixo que ficou preso no cabeçalho
descricao: backdrop-filter, filter e transform viram a referência dos filhos com position fixed. O menu de tela cheia virou uma faixa de 64px.
data: 2026-11-15
tipo: til
tags: [css, front-end, react]
trilha: web
revisao:
  - pergunta: Quais propriedades fazem um elemento virar a referência dos filhos com position fixed?
    resposta: transform, filter, backdrop-filter, perspective, contain (paint/layout) e will-change com alguma delas. Com qualquer uma no ancestral, o fixed passa a se posicionar por ele, não pela tela.
  - pergunta: Como tirar um elemento fixed de dentro de um ancestral com filtro, em React?
    resposta: Com createPortal(elemento, document.body) — o componente continua no mesmo lugar da árvore do React, mas o HTML vai para o body.
fontes:
  - titulo: MDN — position (containing block do fixed)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/position
---

No celular, o menu do [zeno.dev.br](https://zeno.dev.br) deveria cobrir a tela inteira. Abria assim: só o primeiro link, espremido dentro do cabeçalho, com a página aparecendo por baixo.

O menu era `position: fixed` com `inset-x-0 top-16 bottom-0` — tela cheia, abaixo do cabeçalho. O CSS estava certo. O problema estava no **pai**.

## A causa

Quando o menu abre, o cabeçalho ganha um fundo de vidro fosco: `backdrop-filter: blur(...)`. E um elemento com `backdrop-filter` — assim como `filter`, `transform`, `perspective` e mais alguns — **vira o bloco de referência dos descendentes com `position: fixed`**.

Ou seja: o `fixed` deixou de se posicionar pela tela e passou a se posicionar pelo cabeçalho, que tem 64px de altura. `top: 64px; bottom: 0` dentro de uma caixa de 64px é uma faixa sem altura — e o resto vazou.

## A correção

Em React, o jeito limpo é renderizar o menu direto no `body` com um portal. Ele continua no mesmo componente (mesmo estado, mesmos eventos), mas o HTML sai de dentro do cabeçalho:

```tsx
import { createPortal } from 'react-dom'

{createPortal(
  <AnimatePresence>
    {aberto && <motion.div className="fixed inset-x-0 bottom-0 top-16">…</motion.div>}
  </AnimatePresence>,
  document.body,
)}
```

## O primo escondido

A mesma regra pega animação. A transição de página usava `filter: blur(6px) → blur(0px)` no `<main>`. Terminada a animação, o `blur(0px)` **continua lá** — e `blur(0)` ainda é um filtro. Qualquer `fixed` futuro dentro das páginas ia herdar o mesmo bug. No Framer Motion, dá para limpar no fim:

```ts
centro: { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }
```

> [!DICA]
> Elemento `fixed` que aparece cortado ou no lugar errado: procure nos ancestrais por `transform`, `filter` ou `backdrop-filter` antes de mexer no próprio elemento.
