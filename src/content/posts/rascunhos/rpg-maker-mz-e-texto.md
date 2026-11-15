---
titulo: RPG Maker MZ é só texto — e por isso dá para programar com IA
descricao: Um projeto MZ é uma pasta de JSON e JavaScript. O que isso permite, os dois caminhos que funcionam e a regra que evita perder trabalho.
data: 2026-11-15
tipo: nota
tags: [rpg-maker, javascript, ia]
rascunho: true
fontes:
  - titulo: RPG Maker MZ — Help (estrutura do projeto)
    url: https://rpgmakerofficial.com/product/MZ_help-en/01_02.html
  - titulo: rmmz-corescript (código da engine)
    url: https://github.com/stak/rmmz-corescript
---

<!--
RASCUNHO — não aparece no site publicado (rascunho: true).
Base: jogo-bruno/reports/"RPG Maker com Claude Code.md". Faltam os testes na prática.
-->

## A ideia central

- O editor do MZ é uma interface por cima de arquivos simples: `data/` (JSON) e `js/` (engine e plugins).
- A engine carrega 14 arquivos de banco de dados no início; mapas sob demanda (`Map001.json`…).

## Os dois caminhos

1. **Plugins em JavaScript** — o terreno mais firme: API documentada.
2. **Editar banco, eventos e mapas** — de preferência por um servidor MCP da comunidade.

## A regra de ouro

> [!CUIDADO]
> Feche o editor do MZ antes de o agente escrever, e faça commit antes de cada sessão. O editor guarda o projeto em memória e sobrescreve os arquivos ao salvar.

## Para escrever

- [ ] Testar um plugin simples do zero
- [ ] Testar uma edição de evento via JSON
- [ ] Prints do antes e depois
