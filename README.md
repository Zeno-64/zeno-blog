# zeno.blog.br — caderno de estudos

O blog de estudos do Zeno: o que ele aprende construindo, em posts curtos
(TIL) e longos (artigos), organizado em trilhas, séries e uma biblioteca, com
revisão espaçada das perguntas de cada post.

Site estático em [Astro](https://astro.build): o conteúdo é Markdown e YAML
dentro do repositório, sem banco de dados e sem servidor. É um dos três
domínios do Zeno:

| domínio        | papel             | repositório                             |
| -------------- | ----------------- | --------------------------------------- |
| `zeno.net.br`  | porta de entrada  | `zeno-net` (React + Vite)               |
| `zeno.dev.br`  | portfólio         | `zeno-dev` (React + Vite, várias rotas) |
| `zeno.blog.br` | caderno de estudos | este (`zeno-blog`, Astro)              |

Os três dividem as cores, as fontes e a "janela com luz na borda" (os tokens
estão em `src/styles/global.css`).

## Rodar

Precisa do Node 22.12 ou mais novo (o `.nvmrc` diz `22`).

```bash
npm install
npm run dev
```

Abre em http://localhost:5182, com os rascunhos visíveis (marcados com um selo
âmbar). A busca só funciona depois do build:

```bash
npm run build
npm run preview
```

## Comandos

| comando | o que faz |
| --- | --- |
| `npm run dev` | servidor local com recarga, mostra rascunhos |
| `npm run build` | gera `dist/` e o índice da busca (Pagefind) |
| `npm run preview` | serve o `dist/` como vai ficar no ar |
| `npm run novo -- "Título" [--tipo til] [--trilha web] [--serie id]` | cria um rascunho a partir de `modelos/` |
| `npm run og` | build, gera as imagens de prévia de link e faz o build de novo |
| `npm run check` | confere tipos e os arquivos `.astro` |

## Escrever e publicar, em resumo

```bash
npm run novo -- "Por que o wa.me fecha a aba no computador" --tipo til --trilha web
```

1. O comando cria `src/content/posts/til/por-que-o-wa-me-fecha-a-aba-no-computador.md`
   como rascunho. O endereço do post é o nome do arquivo.
2. Escreva com o `npm run dev` aberto. Troque todo texto marcado com
   `TROCAR —`: o build para se encontrar algum num post publicado.
3. Mude para `rascunho: false` e confira a `data`.
4. `npm run og` para gerar a imagem de prévia do post.
5. Commit e push: a Cloudflare publica sozinha.

O passo a passo completo, com todos os campos do frontmatter, está em
[`docs/como-publicar.md`](docs/como-publicar.md).

## Onde fica cada coisa

```text
src/content/posts/        os posts (.md). Subpastas só organizam; o endereço é o nome do arquivo
src/data/trilhas.yaml     trilhas de estudo: etapas com status feito / estudando / proximo
src/data/series.yaml      séries (posts em sequência: parte 1, 2, 3…)
src/data/biblioteca.yaml  livros, cursos e documentação: quero / lendo / lido / parei
src/data/ideias.yaml      a fila de ideias de post (página /ideias)
src/content.config.ts     o formato de cada um: campo errado quebra o build com mensagem clara
src/lib/site.ts           nome, descrição, menu, domínios e redes
src/lib/posts.ts          regras dos posts: rascunho, ordem, tempo de leitura, cor por tipo
src/lib/remark-avisos.mjs os blocos de aviso (> [!DICA], > [!CUIDADO]…)
src/pages/                uma página por rota
src/styles/global.css     cores, fontes, estilo do texto dos posts (.prosa) e animações
modelos/                  os modelos que o npm run novo usa, um por tipo de post
scripts/                  novo.mjs (rascunho) e og.mjs (imagens de prévia)
public/og/                imagens de prévia geradas — vão no commit
docs/                     guias: publicar, calendário, estudos e ideias para o futuro
```

## Páginas

| rota | o que tem |
| --- | --- |
| `/` | abertura, "comece por aqui" (posts com `fixado: true`), últimos posts, TIL, o que está na mesa e as trilhas |
| `/posts/` | arquivo por ano, com filtro por tipo |
| `/posts/<endereço>/` | o post: índice, avisos, código com botão de copiar, série, perguntas de revisão, fontes |
| `/til/` | só os "hoje eu aprendi" |
| `/trilhas/`, `/trilhas/<id>/` | o mapa de cada assunto: etapas, posts, leituras e ideias ligadas |
| `/series/`, `/series/<id>/` | posts em sequência |
| `/tags/`, `/tags/<tag>/` | todas as tags |
| `/biblioteca/` | na mesa, na fila e lidos |
| `/ideias/` | a fila de posts, por prioridade |
| `/revisao/` | repetição espaçada com as perguntas dos posts (progresso salvo no navegador) |
| `/revisao.csv` | as mesmas perguntas para importar no Anki |
| `/progresso/` | números, mapa de publicação do ano e andamento das trilhas |
| `/busca/` | busca no texto de todos os posts (atalho: tecla `/` em qualquer página) |
| `/sobre/` | o que é o caderno e como ele se organiza |
| `/rss.xml`, `/feed.json` | feeds. O `zeno.dev.br` lê o `feed.json` para mostrar os últimos posts |

## Decisões que valem saber

- **Zero JavaScript por padrão.** Só têm script o índice que acende, o botão
  de copiar código, a revisão e a busca.
- **Conteúdo é dado validado.** Trilha, série e biblioteca são YAML com
  formato definido em `src/content.config.ts`. Uma trilha com nome errado num
  post quebra o build e diz qual arquivo.
- **Rascunho nunca vaza.** `rascunho: true` só aparece no `npm run dev`. Post
  publicado com texto de modelo (`TROCAR`) para o build.
- **Transições entre páginas sem framework.** View Transitions do próprio
  navegador: o título do post "voa" da lista para a página. A barra de leitura
  usa animação ligada à rolagem, em CSS. Tudo respeita "reduzir movimento".
- **Busca sem servidor.** O Pagefind gera um índice estático no build.
- **Imagens otimizadas.** Imagem ao lado do post (`![texto](./imagens/x.png)`)
  vira `.webp` com largura e altura certas.

## Publicar na Cloudflare

O `wrangler.jsonc` já está pronto (assets em `./dist`, página 404 própria) e
`public/_headers` define cabeçalhos de segurança e cache.

1. Crie o repositório `zeno-blog` no GitHub e faça o push.
2. Cloudflare → **Workers & Pages** → **Create** → **Import a repository**.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
3. Em **Settings → Domains & Routes → Custom Domain**, adicione
   `zeno.blog.br` e depois `www.zeno.blog.br`.
4. Só então os links do `zeno.net.br` e do `zeno.dev.br` para o blog passam a
   abrir.

## Versões fixadas e o `npm audit`

- **Astro está fixo na 6.4.8.** O Astro 7 pede Node 22.23.4 ou mais novo, e
  esta máquina tem o 22.22.2. Para subir: atualize o Node, rode
  `npm i astro@latest @astrojs/markdown-remark@latest @astrojs/rss@latest @astrojs/sitemap@latest`,
  `npm run build` e `npm run check`.
- **O `vite` está fixo na 7.3.8** nas dependências de desenvolvimento: o
  `@tailwindcss/vite` precisa usar o mesmo Vite do Astro 6. Sem isso o npm
  instala o Vite 8 e o build quebra com "Missing field `tsconfigPaths`". Ao
  subir para o Astro 7, teste tirar essa linha.
- **O `npm audit` acusa 3 avisos** (astro, sharp e esbuild), todos resolvidos
  no Astro 7. Nenhum alcança o site publicado: os do Astro são de XSS em
  páginas renderizadas no servidor a cada visita, e aqui tudo vira HTML
  estático no build, com texto escrito por você. Os do sharp exigem processar
  uma imagem maliciosa, e só passam por ele as imagens que você mesmo coloca
  nos posts. O do esbuild é leitura de arquivos pelo servidor de
  desenvolvimento no Windows: deixe o `npm run dev` aberto só enquanto escreve.
  Mesmo assim, suba para o Astro 7 quando atualizar o Node.
