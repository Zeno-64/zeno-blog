// Cria um post novo a partir do modelo do tipo, já como rascunho.
//
//   npm run novo -- "Título do post"
//   npm run novo -- "Título do post" --tipo til
//   npm run novo -- "Título do post" --tipo artigo --trilha web --serie do-zero-ao-ar
//
// tipos: artigo (padrão), til, nota, devlog, leitura
// O arquivo vai para src/content/posts/<pasta do tipo>/<endereço>.md com
// rascunho: true e a data de hoje. Para publicar: rascunho: false.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const POSTS = resolve(RAIZ, 'src/content/posts')
const PASTA_DO_TIPO = { artigo: 'artigos', til: 'til', nota: 'notas', devlog: 'devlog', leitura: 'leituras' }

function sair(mensagem) {
  console.error(`\n  ${mensagem}\n`)
  process.exit(1)
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    tipo: { type: 'string', short: 't', default: 'artigo' },
    trilha: { type: 'string' },
    serie: { type: 'string' },
  },
})

const titulo = positionals.join(' ').trim()
if (!titulo) sair('Uso: npm run novo -- "Título do post" [--tipo til] [--trilha web] [--serie do-zero-ao-ar]')
if (!(values.tipo in PASTA_DO_TIPO)) sair(`Tipo "${values.tipo}" não existe. Use: ${Object.keys(PASTA_DO_TIPO).join(', ')}.`)

/** ids de um arquivo YAML de dados (linhas "- id: xxx") */
const ids = (arquivo) =>
  [...readFileSync(resolve(RAIZ, 'src/data', arquivo), 'utf8').matchAll(/^- id:\s*(\S+)/gm)].map((m) => m[1])

for (const [campo, arquivo] of [
  ['trilha', 'trilhas.yaml'],
  ['serie', 'series.yaml'],
]) {
  if (values[campo] && !ids(arquivo).includes(values[campo])) {
    sair(`${campo} "${values[campo]}" não existe em src/data/${arquivo}. Opções: ${ids(arquivo).join(', ')}.`)
  }
}

const endereco = titulo
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 70)
  .replace(/-$/, '')

// o endereço vem só do nome do arquivo: não pode repetir em pasta nenhuma
function todosOsArquivos(pasta) {
  return readdirSync(pasta, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? todosOsArquivos(join(pasta, e.name)) : [join(pasta, e.name)],
  )
}
const repetido = todosOsArquivos(POSTS).find((f) => f.split(/[\\/]/).pop() === `${endereco}.md`)
if (repetido) sair(`Já existe um post com esse endereço: ${relative(RAIZ, repetido)}`)

const hoje = new Date().toLocaleDateString('sv') // AAAA-MM-DD no fuso local
const linhaOpcional = (campo, valor, dica) => (valor ? `${campo}: ${valor}` : `# ${campo}: ${dica}`)

const conteudo = readFileSync(resolve(RAIZ, 'modelos', `${values.tipo}.md`), 'utf8')
  .replaceAll('{{titulo}}', titulo.replace(/'/g, "''"))
  .replaceAll('{{data}}', hoje)
  .replace('{{trilha}}', linhaOpcional('trilha', values.trilha, 'id em src/data/trilhas.yaml'))
  .replace('{{serie}}', linhaOpcional('serie', values.serie, 'id em src/data/series.yaml (e "parte: 1")'))
  .replace('{{parte}}', values.serie ? 'parte: 1' : '')

const destino = resolve(POSTS, PASTA_DO_TIPO[values.tipo], `${endereco}.md`)
mkdirSync(dirname(destino), { recursive: true })
writeFileSync(destino, conteudo)

console.log(`
  Rascunho criado: ${relative(RAIZ, destino).replaceAll('\\', '/')}

  Veja enquanto escreve:  npm run dev  →  http://localhost:5182/posts/${endereco}/
  Para publicar:          troque para "rascunho: false" e confira a data.
`)
