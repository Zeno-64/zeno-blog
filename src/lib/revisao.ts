import { postsVisiveis, urlPost } from './posts'

export type CartaoRevisao = {
  /** Estável: muda só se a pergunta mudar (o progresso salvo segue o id). */
  id: string
  pergunta: string
  resposta: string
  titulo: string
  url: string
  trilha?: string
  tags: string[]
}

function hash(texto: string) {
  let h = 2166136261
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return (h >>> 0).toString(36)
}

/** Todas as perguntas de revisão dos posts publicados. */
export async function cartoesDeRevisao(): Promise<CartaoRevisao[]> {
  const posts = await postsVisiveis((p) => p.data.revisao.length > 0)
  return posts.flatMap((p) =>
    p.data.revisao.map((r) => ({
      id: `${p.id}:${hash(r.pergunta)}`,
      pergunta: r.pergunta,
      resposta: r.resposta,
      titulo: p.data.titulo,
      url: urlPost(p),
      trilha: p.data.trilha?.id,
      tags: p.data.tags,
    })),
  )
}
