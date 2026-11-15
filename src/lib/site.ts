/** Tudo que identifica o blog. Mude aqui, não nos componentes. */
export const SITE = {
  url: 'https://zeno.blog.br',
  nome: 'Zeno',
  titulo: 'Zeno · caderno de estudos',
  descricao:
    'O caderno de estudos do Zeno, engenheiro de software: o que aprendo construindo — backend, front, apps e o que aparecer no caminho.',
  autor: 'Zeno',
  autorUrl: 'https://zeno.dev.br/sobre',
  /** Imagem de prévia de link padrão (1200×630, em public/). */
  ogPadrao: '/og/blog.jpg',
}

export const navegacao = [
  { rota: '/posts/', rotulo: 'Posts' },
  { rota: '/til/', rotulo: 'TIL' },
  { rota: '/trilhas/', rotulo: 'Trilhas' },
  { rota: '/biblioteca/', rotulo: 'Biblioteca' },
  { rota: '/revisao/', rotulo: 'Revisão' },
  { rota: '/sobre/', rotulo: 'Sobre' },
]

export const dominios = [
  { host: 'zeno.net.br', url: 'https://zeno.net.br', papel: 'porta de entrada', atual: false },
  { host: 'zeno.dev.br', url: 'https://zeno.dev.br', papel: 'portfólio', atual: false },
  { host: 'zeno.blog.br', url: 'https://zeno.blog.br', papel: 'você está aqui', atual: true },
]

export const redes = [
  { nome: 'GitHub', url: 'https://github.com/Zeno-64' },
  { nome: 'LinkedIn', url: 'https://www.linkedin.com/in/kevin-baradelli/' },
]
