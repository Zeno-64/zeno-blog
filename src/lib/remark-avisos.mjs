// Avisos no estilo do GitHub, escritos como citação:
//
//   > [!DICA]
//   > Rode o build antes de subir.
//
// viram <aside class="aviso aviso-dica" data-rotulo="Dica">. Tipos:
// NOTA, DICA, IMPORTANTE e CUIDADO (maiúsculas ou minúsculas). Uma citação
// comum continua sendo citação.

const TIPOS = {
  NOTA: 'Nota',
  DICA: 'Dica',
  IMPORTANTE: 'Importante',
  CUIDADO: 'Cuidado',
}

const MARCA = /^\[!(nota|dica|importante|cuidado)\][ \t]*\n?/i

/** @param {any} no */
function visitar(no) {
  if (no.type === 'blockquote') converter(no)
  if (Array.isArray(no.children)) no.children.forEach(visitar)
}

/** @param {any} citacao */
function converter(citacao) {
  const paragrafo = citacao.children[0]
  const texto = paragrafo?.type === 'paragraph' ? paragrafo.children[0] : null
  if (texto?.type !== 'text') return
  const achou = texto.value.match(MARCA)
  if (!achou) return

  const tipo = /** @type {keyof typeof TIPOS} */ (achou[1].toUpperCase())
  texto.value = texto.value.slice(achou[0].length)
  // "[!DICA]" sozinho na primeira linha: limpa o que sobrou dela
  if (!texto.value) paragrafo.children.shift()
  if (paragrafo.children[0]?.type === 'break') paragrafo.children.shift()
  if (paragrafo.children.length === 0) citacao.children.shift()

  citacao.data = {
    hName: 'aside',
    hProperties: { className: ['aviso', `aviso-${tipo.toLowerCase()}`], 'data-rotulo': TIPOS[tipo] },
  }
}

export function remarkAvisos() {
  /** @param {any} arvore */
  return (arvore) => visitar(arvore)
}
