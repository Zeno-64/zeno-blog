# Como publicar

O caminho de uma ideia até o post no ar, e tudo que dá para usar dentro dele.

## O fluxo

```text
ideia ──► rascunho ──► texto ──► revisão ──► publicado ──► divulgado
(ideias.yaml)  (npm run novo)        (checklist)  (push)       (LinkedIn)
```

1. **Ideia.** Anote em `src/data/ideias.yaml` assim que aparecer: título,
   tipo, trilha e uma linha de nota. Ideia anotada não precisa ser lembrada.
2. **Rascunho.** Quando for escrever:

   ```bash
   npm run novo -- "Título do post" --tipo artigo --trilha web --serie do-zero-ao-ar
   ```

   Só o título é obrigatório. O comando confere se a trilha e a série
   existem, escolhe a pasta pelo tipo e avisa se o endereço já está em uso.
3. **Texto.** Escreva com `npm run dev` aberto em
   `http://localhost:5182/posts/<endereço>/`. A página recarrega a cada
   salvamento.
4. **Revisão.** Passe pelo [checklist](#checklist-antes-de-publicar).
5. **Publicar.** `rascunho: false`, `npm run og`, commit e push.
6. **Divulgar.** Veja [depois de publicar](#depois-de-publicar).

## Tipos de post

| tipo | para quê | tamanho |
| --- | --- | --- |
| `til` | "Hoje eu aprendi": uma descoberta pequena. Sintoma, causa e o que resolve. | cabe numa tela |
| `artigo` | Um assunto completo, com contexto, exemplo e o porquê. | 5 a 12 minutos |
| `nota` | Resumo do que você está estudando, do jeito que entendeu. | livre |
| `devlog` | Diário de um projeto: o que foi feito, o que quebrou, o que vem. | curto e frequente |
| `leitura` | Livro, curso ou documentação: o que ficou e se vale a pena. | 3 a 6 minutos |

Na dúvida entre TIL e artigo, escreva o TIL. Se crescer, vira artigo depois,
e o TIL ganha um link para ele.

## O frontmatter

O bloco entre `---` no topo do arquivo. O formato é conferido no build
(`src/content.config.ts`): campo com valor errado para o build e diz onde.

| campo | obrigatório | o que é |
| --- | --- | --- |
| `titulo` | sim | até 90 caracteres. Use aspas simples se tiver `:` |
| `descricao` | sim | até 220 caracteres. Aparece na lista, no feed e na prévia de link |
| `data` | sim | `2026-11-15`. Define a ordem e o mapa de publicação |
| `atualizado` | não | data da última mudança relevante. Aparece como "atualizado em" |
| `tipo` | não | `artigo` (padrão), `til`, `nota`, `devlog` ou `leitura` |
| `tags` | não | `[css, react]`. Em minúsculas, no singular, sem repetir a trilha |
| `trilha` | não | id de `src/data/trilhas.yaml` (`web`, `mobile`, `aws`, `java-spring`, `fundamentos`) |
| `serie` | não | id de `src/data/series.yaml` |
| `parte` | com série | 1, 2, 3… a ordem dentro da série |
| `rascunho` | não | `true` esconde do site publicado |
| `fixado` | não | `true` põe o post em "Comece por aqui", na home. Use em 1 a 3 posts |
| `fontes` | não | lista de `{ titulo, url }`: o que você leu para escrever |
| `revisao` | não | lista de `{ pergunta, resposta }` para a página `/revisao` |

Exemplo completo:

```yaml
---
titulo: 'SPA, WhatsApp e a prévia de link que não aparece'
descricao: Por que o link de um site React chega sem foto no WhatsApp e como resolver gerando um HTML por rota no build.
data: 2026-11-15
tipo: artigo
tags: [seo, open-graph, vite]
trilha: web
serie: do-zero-ao-ar
parte: 2
rascunho: false
fontes:
  - titulo: The Open Graph protocol
    url: https://ogp.me/
revisao:
  - pergunta: Por que o WhatsApp não mostra a prévia de uma SPA?
    resposta: O robô dele não roda JavaScript. Ele lê só o HTML que chega, e numa SPA é o mesmo index.html para todas as rotas.
---
```

## Dentro do texto

### Títulos

Comece as seções no `##`. O `#` é o título do post e já vem do frontmatter.
Com dois ou mais `##`/`###`, o post ganha índice: na lateral no computador,
recolhido no topo no celular. Cada título vira âncora (o `#` que aparece ao
passar o mouse) para linkar direto na seção.

### Avisos

```markdown
> [!DICA]
> Rode o build antes de subir.
```

Tipos: `NOTA`, `DICA`, `IMPORTANTE` e `CUIDADO`. Use pouco: um ou dois por
post. Se tudo é aviso, nada é.

### Código

Bloco com a linguagem depois das crases, para ganhar cor:

````markdown
```bash
npx wrangler deploy --dry-run
```
````

Todo bloco ganha um botão "copiar". Prefira um bloco por ideia a um bloco
enorme com tudo.

### Imagens

Coloque a imagem numa pasta `imagens` ao lado do post e use caminho relativo:

```markdown
![O menu do celular preso dentro do cabeçalho](./imagens/menu-preso.png)
```

No build ela vira `.webp`, com largura e altura definidas (a página não
"pula" ao carregar). O texto entre colchetes é obrigatório: descreva o que a
imagem mostra para quem não pode vê-la.

### Links

- Para outro post: `[parte 2](/posts/spa-previa-de-link/)`.
- Para uma trilha: `[trilha web](/trilhas/web/)`.
- Para fora: o link normal. Se for referência importante, ponha também em
  `fontes`.

## Séries e trilhas

- **Série** é leitura em ordem: parte 1, parte 2… Crie em
  `src/data/series.yaml` e use `serie` + `parte` nos posts. A página do post
  mostra a lista de partes, e a série só aparece com o que já foi publicado.
- **Trilha** é o mapa de um assunto. Quando um post fecha uma etapa, mude o
  `status` dela em `src/data/trilhas.yaml` para `feito` (ou `estudando`).
  A barra de progresso da trilha, a home e `/progresso` se atualizam sozinhas.

## Perguntas de revisão

Duas a quatro por post, no fim do frontmatter. Elas aparecem no fim do post e
entram na `/revisao`.

- Pergunte o que você teria perguntado **antes** de aprender aquilo.
- Uma ideia por pergunta. Se a resposta tem "e também", são duas perguntas.
- Resposta curta, do jeito que você diria em voz alta.
- Evite pergunta de sim ou não: "Por que…" e "Como…" ensinam mais.

## Checklist antes de publicar

- [ ] Nenhum `TROCAR —` sobrando (o build para se tiver)
- [ ] Título diz o assunto; descrição diz o que o leitor leva
- [ ] O primeiro parágrafo explica o problema sem precisar do título
- [ ] Código testado, do jeito que está no post
- [ ] Imagens com texto alternativo
- [ ] Nada de cliente, empresa ou dado que não seja seu para contar
- [ ] Trilha e série certas; etapa da trilha atualizada, se for o caso
- [ ] Duas a quatro perguntas de revisão
- [ ] `rascunho: false` e `data` de hoje
- [ ] `npm run og` (gera a prévia e faz o build) passou sem erro

## Depois de publicar

1. Apague a ideia de `src/data/ideias.yaml`, se veio de lá.
2. Atualize a biblioteca, se o post for sobre uma leitura.
3. Confira a prévia do link colando o endereço numa conversa do WhatsApp
   com você mesmo.
4. LinkedIn: um parágrafo com o problema, um com o que você aprendeu e o
   link no fim. Por exemplo:

   ```text
   Fiz um site em React, mandei o link no WhatsApp e… nada de foto, nada de título.

   O robô do WhatsApp não roda JavaScript: ele lê só o HTML que chega. Numa SPA,
   é o mesmo index.html para todas as páginas. A saída foi gerar um HTML por rota
   no build, com as meta tags certas em cada um.

   Escrevi o passo a passo, com o plugin do Vite: https://zeno.blog.br/posts/spa-previa-de-link/
   ```

## Mudar um post publicado

- **Correção pequena:** só edite.
- **Mudança de conteúdo:** edite e ponha `atualizado: <data de hoje>`.
- **Mudar o endereço:** evite, porque quebra links que já circularam. Se
  precisar, crie `public/_redirects` com uma linha por mudança:

  ```text
  /posts/endereco-antigo/ /posts/endereco-novo/ 301
  ```

- **Despublicar:** `rascunho: true`. O `npm run og` apaga a imagem de prévia
  que sobrou.
