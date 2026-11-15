import { getCollection, type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>
export type TipoPost = Post['data']['tipo']

export const ROTULO_TIPO: Record<TipoPost, string> = {
  artigo: 'Artigo',
  til: 'TIL',
  nota: 'Nota de estudo',
  devlog: 'Devlog',
  leitura: 'Leitura',
}

export const DESCRICAO_TIPO: Record<TipoPost, string> = {
  artigo: 'Texto completo sobre um assunto, com contexto, exemplo e o porquê.',
  til: '"Today I learned": uma descoberta pequena, curta e direta.',
  nota: 'Resumo do que estou estudando, do jeito que eu entendi.',
  devlog: 'Diário de um projeto: o que foi feito, o que quebrou, o que vem.',
  leitura: 'Livro, curso ou documentação: o que ficou e se vale a pena.',
}

/** Classe de cor do selo de cada tipo (definidas em global.css). */
export const COR_TIPO: Record<TipoPost, string> = {
  artigo: 'selo-azul',
  til: 'selo-verde',
  nota: 'selo-gelo',
  devlog: 'selo-ambar',
  leitura: 'selo-vermelho',
}

/** Posts visíveis, do mais novo para o mais antigo. Rascunhos aparecem
 *  no `npm run dev` (com selo) e nunca no site publicado. */
export async function postsVisiveis(filtro?: (p: Post) => boolean) {
  const lista = await getCollection(
    'posts',
    (p) => (import.meta.env.PROD ? !p.data.rascunho : true) && (filtro ? filtro(p) : true),
  )
  if (import.meta.env.PROD) lista.forEach(barrarModelo)
  return lista.sort((a, b) => b.data.data.valueOf() - a.data.data.valueOf())
}

/** Os modelos (npm run novo) marcam o texto de exemplo com "TROCAR".
 *  Post publicado com esse texto para o build, com o nome do arquivo. */
function barrarModelo(p: Post) {
  const texto = JSON.stringify(p.data) + (p.body ?? '')
  if (texto.includes('TROCAR')) {
    throw new Error(`O post "${p.id}" (${p.filePath}) ainda tem texto de modelo marcado com TROCAR.`)
  }
}

export const urlPost = (p: Post) => `/posts/${p.id}/`

/** Palavras do texto corrido (sem blocos de código nem marcação). */
export function palavras(p: Post) {
  const texto = (p.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()!|-]/g, ' ')
  return texto.split(/\s+/).filter(Boolean).length
}

export const minutosLeitura = (p: Post) => Math.max(1, Math.round(palavras(p) / 200))

// Datas do frontmatter chegam como meia-noite UTC: formatar em UTC evita
// o post de dia 15 aparecer como dia 14 no fuso de Brasília.
const formato = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const formatarData = (d: Date) => formato.format(d).replace(/\./g, '').replace(/ de /g, ' ')
export const dataISO = (d: Date) => d.toISOString().slice(0, 10)

/** "Java & Spring" → "java-spring": endereço das páginas de tag. */
export const slugTag = (tag: string) =>
  tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Nome de view transition válido para o título de um post (lista ↔ página). */
export const nomeTransicao = (p: Post) => `post-${slugTag(p.id)}`
