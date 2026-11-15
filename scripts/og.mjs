// Gera as imagens de prévia de link (Open Graph, 1200×630) do blog.
//
//   npm run og
//
// O script do package.json faz: build → este arquivo → build de novo.
// Este arquivo lê dist/feed.json (só tem posts publicados) e grava:
//
//   public/og/blog.jpg               prévia padrão (home e páginas sem imagem própria)
//   public/og/posts/<endereço>.jpg   uma por post
//
// A página do post usa a imagem dele quando ela existe no build
// (src/pages/posts/[slug].astro) — daí o segundo build. Imagem de post que
// não existe mais (renomeado ou despublicado) é apagada. Faça commit das
// imagens junto com o post.
//
// Precisa do Google Chrome instalado. Em outro caminho:
//   CHROME="/caminho/do/chrome" npm run og
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FEED = resolve(RAIZ, 'dist/feed.json')
const DESTINO = resolve(RAIZ, 'public/og')
const DESTINO_POSTS = resolve(DESTINO, 'posts')

if (!existsSync(FEED)) {
  console.error('og: não achei dist/feed.json. Rode pelo "npm run og", que faz o build antes.')
  process.exit(1)
}
const feed = JSON.parse(readFileSync(FEED, 'utf8'))
const HOST = new URL(feed.home_page_url).host

const chrome = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((c) => !!c && existsSync(c))
if (!chrome) {
  console.error('og: não achei o Chrome. Rode com CHROME="/caminho/do/chrome" npm run og')
  process.exit(1)
}

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// O cartão é montado em about:blank, que não carrega file:// de forma
// confiável: a foto vai embutida.
const AVATAR = `data:image/webp;base64,${readFileSync(resolve(RAIZ, 'public/perfil.webp')).toString('base64')}`

// Mesmos nomes e cores de src/lib/posts.ts e dos .selo de global.css
const TIPO = {
  artigo: { rotulo: 'Artigo', cor: '#58b3ff' },
  til: { rotulo: 'TIL', cor: '#4ade80' },
  nota: { rotulo: 'Nota de estudo', cor: '#9fd8ff' },
  devlog: { rotulo: 'Devlog', cor: '#fbbf24' },
  leitura: { rotulo: 'Leitura', cor: '#ff6b7a' },
}

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const formatarData = (iso) => formatoData.format(new Date(iso)).replace(/\./g, '').replace(/ de /g, ' ')

/** O mesmo "hash" de commit de mentira da home (src/pages/index.astro). */
function hash(texto) {
  let h = 2166136261
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

const endereco = (item) => new URL(item.url).pathname.split('/').filter(Boolean).pop()

// ------------------------------------------------------------------ visuais

function janela(arquivo, linhas) {
  return `
  <div class="janela">
    <div class="barra"><i></i><i></i><i></i><span>${esc(arquivo)}</span></div>
    <div class="terminal">
      ${linhas.map((l, i) => `<div><span class="n">${i + 1}</span>${l}</div>`).join('')}
    </div>
  </div>`
}

/** O frontmatter do post, como ele está no arquivo .md */
function visualFrontmatter(item) {
  const z = item._zeno ?? {}
  const campo = (chave, valor) => `<b>${chave}:</b> ${esc(valor)}`
  const linhas = [
    '<em>---</em>',
    campo('titulo', `'${item.title}'`),
    campo('tipo', z.tipo ?? 'artigo'),
    campo('data', item.date_published.slice(0, 10)),
  ]
  if (item.tags?.length) linhas.push(campo('tags', `[${item.tags.join(', ')}]`))
  if (z.trilha) linhas.push(campo('trilha', z.trilha))
  if (z.serie) linhas.push(campo('serie', z.serie.id) + (z.serie.parte ? ` <em># parte ${z.serie.parte}</em>` : ''))
  linhas.push('<em>---</em>')
  return janela(`posts/${endereco(item)}.md`, linhas)
}

/** O git log da home: os últimos posts */
function visualGitLog(itens) {
  const linhas = itens
    .slice(0, 7)
    .map(
      (item) =>
        `<span class="hash">${hash(endereco(item))}</span> <em>${esc((TIPO[item._zeno?.tipo] ?? TIPO.artigo).rotulo.toLowerCase())}:</em> ${esc(item.title)}`,
    )
  return janela('~/estudos — git log --oneline', linhas.length ? linhas : ['<em>(o primeiro post vem aí)</em>'])
}

// ------------------------------------------------------------------ cartões

const cartoes = [
  {
    nome: 'blog',
    rotulo: '<span class="ponto"></span>aprendendo em público',
    titulo: 'Caderno de estudos',
    texto: feed.description,
    caminho: '',
    visual: visualGitLog(feed.items),
  },
  ...feed.items.map((item) => {
    const tipo = TIPO[item._zeno?.tipo] ?? TIPO.artigo
    const minutos = item._zeno?.minutos_de_leitura
    return {
      nome: `posts/${endereco(item)}`,
      rotulo: `<span class="selo" style="--cor:${tipo.cor}">${tipo.rotulo}</span>${esc(formatarData(item.date_published))}${minutos ? ` · ${minutos} min de leitura` : ''}`,
      titulo: item.title,
      texto: item.summary,
      caminho: `/posts/${endereco(item)}/`,
      visual: visualFrontmatter(item),
    }
  }),
]

const FONTES =
  'https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@1,700&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500&display=block'

/** Título longo encolhe; a descrição perde uma linha para caber. */
const tamanhoTitulo = (t) => (t.length <= 20 ? 76 : t.length <= 38 ? 60 : t.length <= 62 ? 50 : 44)

function html(c) {
  const linhasTexto = c.titulo.length > 38 ? 2 : 3
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTES}">
<style>
  * { margin: 0; box-sizing: border-box }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #05070d; color: #f2f6fb; font-family: Inter, system-ui, sans-serif }
  .luz { position: absolute; inset: 0;
    background:
      radial-gradient(55% 75% at 88% 12%, rgba(47,129,247,.30), transparent 70%),
      radial-gradient(45% 55% at 0% 100%, rgba(88,179,255,.10), transparent 70%) }
  .malha { position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
    background-size: 44px 44px;
    -webkit-mask-image: radial-gradient(70% 90% at 75% 30%, #000 25%, transparent 80%) }
  .moldura { position: absolute; inset: 0; border: 1px solid rgba(88,179,255,.18) }
  main { position: relative; height: 100%; padding: 56px 60px 52px; display: flex; gap: 48px }
  .esquerda { flex: 1; min-width: 0; display: flex; flex-direction: column }
  .marca { display: flex; align-items: center; gap: 14px }
  .marca img { width: 50px; height: 50px; border-radius: 13px; object-fit: cover;
    border: 2px solid #05070d; box-shadow: 0 0 0 2px #e11d3a, 0 0 26px rgba(225,29,58,.55) }
  .marca b { font-family: 'Chakra Petch'; font-style: italic; font-weight: 700; font-size: 32px; letter-spacing: -.02em }
  .marca span { font-family: 'JetBrains Mono'; font-size: 15px; color: #58b3ff; border: 1px solid rgba(47,129,247,.35);
    background: rgba(47,129,247,.12); border-radius: 6px; padding: 2px 8px }
  .rotulo { margin-top: auto; display: flex; align-items: center; gap: 14px;
    font-family: 'JetBrains Mono'; font-size: 18px; color: #9fd8ff }
  .ponto { width: 9px; height: 9px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,.8) }
  .selo { --cor: #58b3ff; color: var(--cor); border: 1px solid color-mix(in oklab, var(--cor) 40%, transparent);
    background: color-mix(in oklab, var(--cor) 12%, transparent); border-radius: 999px; padding: 3px 14px; font-size: 16px }
  h1 { margin-top: 14px; font-family: 'Chakra Petch'; font-style: italic; font-weight: 700; line-height: 1.04;
    letter-spacing: -.02em; text-shadow: 0 0 34px rgba(47,129,247,.40) }
  p { margin-top: 18px; font-size: 24px; line-height: 1.42; color: #c3cede;
    display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden }
  .url { margin-top: 26px; font-family: 'JetBrains Mono'; font-size: 18px; color: #58b3ff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
  .url em { font-style: normal; color: #8093ab }
  .direita { width: 440px; flex-shrink: 0; display: flex; align-items: center; justify-content: center }
  .janela { width: 100%; border-radius: 16px; overflow: hidden; background: #0c111c;
    border: 1px solid rgba(88,179,255,.38);
    box-shadow: 0 0 0 1px rgba(47,129,247,.12), 0 0 60px -10px rgba(47,129,247,.55), 0 40px 80px -30px #000 }
  .barra { display: flex; align-items: center; gap: 8px; padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,.07); font-family: 'JetBrains Mono'; font-size: 13px; color: #8093ab }
  .barra i { width: 10px; height: 10px; border-radius: 50%; background: #253047; flex-shrink: 0 }
  .barra i:nth-child(3) { background: #2f81f7 }
  .barra span { margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
  .terminal { padding: 20px 20px 24px; font-family: 'JetBrains Mono'; font-size: 15px; line-height: 1.9; color: #c3cede }
  .terminal div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
  .terminal .n { display: inline-block; width: 26px; color: #4d5b70 }
  .terminal b { font-weight: 500; color: #58b3ff }
  .terminal em { font-style: normal; color: #8093ab }
  .terminal .hash { color: #fbbf24 }
</style></head><body>
<div class="luz"></div><div class="malha"></div><div class="moldura"></div>
<main>
  <div class="esquerda">
    <div class="marca"><img src="${AVATAR}" alt=""><b>Zeno</b><span>.blog</span></div>
    <div class="rotulo">${c.rotulo}</div>
    <h1 style="font-size:${tamanhoTitulo(c.titulo)}px">${esc(c.titulo)}</h1>
    <p style="-webkit-line-clamp:${linhasTexto}">${esc(c.texto)}</p>
    <div class="url">${HOST}<em>${esc(c.caminho)}</em></div>
  </div>
  <div class="direita">${c.visual}</div>
</main>
</body></html>`
}

// ------------------------------------------------------------------ gravação

mkdirSync(DESTINO_POSTS, { recursive: true })

// imagem de post que saiu do feed (renomeado, despublicado) vai embora
const atuais = new Set(feed.items.map((item) => `${endereco(item)}.jpg`))
for (const arquivo of readdirSync(DESTINO_POSTS)) {
  if (arquivo.endsWith('.jpg') && !atuais.has(arquivo)) {
    rmSync(resolve(DESTINO_POSTS, arquivo))
    console.log('og: apagada', `public/og/posts/${arquivo}`)
  }
}

const navegador = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--hide-scrollbars'] })
try {
  const pagina = await navegador.newPage()
  await pagina.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  for (const c of cartoes) {
    // 'load' e não 'networkidle0': a conexão com o Google Fonts fica
    // aberta entre um cartão e outro e o "rede ociosa" nunca chega
    await pagina.setContent(html(c), { waitUntil: 'load' })
    await pagina.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})))
    })
    await pagina.screenshot({ path: resolve(DESTINO, `${c.nome}.jpg`), type: 'jpeg', quality: 86 })
    console.log('og:', `public/og/${c.nome}.jpg`)
  }
} finally {
  await navegador.close()
}
console.log(`og: ${cartoes.length} imagens`)
