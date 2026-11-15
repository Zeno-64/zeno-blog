import { cartoesDeRevisao } from '../lib/revisao'

/** As perguntas de revisão em CSV para importar no Anki
 *  (Arquivo → Importar). As linhas com # são cabeçalhos que o Anki 2.1.55+
 *  entende: separador, texto puro e qual coluna tem as tags. */
export async function GET() {
  const cartoes = await cartoesDeRevisao()
  const campo = (t: string) => `"${t.replace(/"/g, '""')}"`
  const tag = (t: string) => t.trim().replace(/\s+/g, '_')
  const linhas = cartoes.map((c) =>
    [c.pergunta, c.resposta, ['zeno-blog', c.trilha ?? '', ...c.tags].filter(Boolean).map(tag).join(' ')]
      .map(campo)
      .join(';'),
  )
  const csv = ['#separator:Semicolon', '#html:false', '#tags column:3', ...linhas].join('\n') + '\n'
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } })
}
