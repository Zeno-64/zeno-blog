import type { APIContext } from 'astro'
import { minutosLeitura, postsVisiveis, urlPost } from '../lib/posts'
import { SITE } from '../lib/site'

/** JSON Feed 1.1 (https://jsonfeed.org/version/1.1).
 *
 *  Além de servir leitor de feed, é o que a home do zeno.dev.br lê para
 *  mostrar os últimos posts — o CORS dele está em public/_headers. Os
 *  campos usados lá: title, url, summary, date_published e tags. O
 *  scripts/og.mjs também lê daqui (tipo, trilha e série vão em _zeno). */
export async function GET(contexto: APIContext) {
  const site = contexto.site!
  const absoluta = (caminho: string) => new URL(caminho, site).href
  const posts = await postsVisiveis()

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE.titulo,
    home_page_url: absoluta('/'),
    feed_url: absoluta('/feed.json'),
    description: SITE.descricao,
    language: 'pt-BR',
    icon: absoluta('/perfil.webp'),
    favicon: absoluta('/favicon.svg'),
    authors: [{ name: SITE.autor, url: SITE.autorUrl }],
    items: posts.map((p) => ({
      id: absoluta(urlPost(p)),
      url: absoluta(urlPost(p)),
      title: p.data.titulo,
      summary: p.data.descricao,
      content_text: p.data.descricao,
      date_published: p.data.data.toISOString(),
      ...(p.data.atualizado && { date_modified: p.data.atualizado.toISOString() }),
      tags: p.data.tags,
      // extensão própria (o padrão pede o "_" na frente)
      _zeno: {
        tipo: p.data.tipo,
        minutos_de_leitura: minutosLeitura(p),
        ...(p.data.trilha && { trilha: p.data.trilha.id }),
        ...(p.data.serie && { serie: { id: p.data.serie.id, parte: p.data.parte ?? null } }),
      },
    })),
  }

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  })
}
