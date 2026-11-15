import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { postsVisiveis, ROTULO_TIPO, urlPost } from '../lib/posts'
import { SITE } from '../lib/site'

export async function GET(contexto: APIContext) {
  const posts = await postsVisiveis()
  return rss({
    title: SITE.titulo,
    description: SITE.descricao,
    site: contexto.site!,
    items: posts.map((p) => ({
      title: p.data.titulo,
      description: p.data.descricao,
      pubDate: p.data.data,
      link: urlPost(p),
      categories: [ROTULO_TIPO[p.data.tipo], ...p.data.tags],
    })),
    customData: '<language>pt-br</language>',
  })
}
