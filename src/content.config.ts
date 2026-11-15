import { defineCollection, reference } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { TIPOS } from './lib/tipos'

/** Posts: um arquivo .md por post em src/content/posts/ (pode usar
 *  subpastas para se organizar — o endereço vem só do nome do arquivo).
 *  Arquivo que começa com _ é ignorado (bom para rascunho bem cru). */
const posts = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.md$/, '').split('/').pop()!,
  }),
  schema: z.object({
    titulo: z.string().max(90),
    /** Uma ou duas frases: vira o resumo na lista, no feed e na prévia de link. */
    descricao: z.string().max(220),
    data: z.coerce.date(),
    atualizado: z.coerce.date().optional(),
    tipo: z.enum(TIPOS).default('artigo'),
    tags: z.array(z.string()).default([]),
    serie: reference('series').optional(),
    /** Ordem dentro da série (1, 2, 3…). */
    parte: z.number().int().positive().optional(),
    trilha: reference('trilhas').optional(),
    /** true: só aparece no `npm run dev`, nunca no site publicado. */
    rascunho: z.boolean().default(false),
    /** true: entra em "Comece por aqui" na home. */
    fixado: z.boolean().default(false),
    fontes: z.array(z.object({ titulo: z.string(), url: z.url() })).default([]),
    /** Perguntas para a página /revisao (repetição espaçada). */
    revisao: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).default([]),
  }),
})

/** Trilhas de estudo: o "mapa" de cada assunto, com etapas e status. */
const trilhas = defineCollection({
  loader: file('src/data/trilhas.yaml'),
  schema: z.object({
    nome: z.string(),
    descricao: z.string(),
    objetivo: z.string(),
    ordem: z.number().default(99),
    etapas: z.array(
      z.object({
        titulo: z.string(),
        status: z.enum(['feito', 'estudando', 'proximo']),
        nota: z.string().optional(),
      }),
    ),
  }),
})

/** Séries: posts em sequência (parte 1, 2, 3…). */
const series = defineCollection({
  loader: file('src/data/series.yaml'),
  schema: z.object({
    nome: z.string(),
    descricao: z.string(),
  }),
})

/** Biblioteca: livros, cursos, documentação, vídeos e artigos. */
const biblioteca = defineCollection({
  loader: file('src/data/biblioteca.yaml'),
  schema: z.object({
    titulo: z.string(),
    autor: z.string().optional(),
    tipo: z.enum(['livro', 'curso', 'documentacao', 'video', 'artigo']),
    status: z.enum(['quero', 'lendo', 'lido', 'parei']),
    url: z.url().optional(),
    trilha: reference('trilhas').optional(),
    nota: z.string().optional(),
  }),
})

/** Ideias de post na fila. Viram rascunho com `npm run novo`. */
const ideias = defineCollection({
  loader: file('src/data/ideias.yaml'),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(TIPOS).default('artigo'),
    trilha: reference('trilhas').optional(),
    prioridade: z.enum(['alta', 'media', 'baixa']).default('media'),
    notas: z.string().optional(),
  }),
})

export const collections = { posts, trilhas, series, biblioteca, ideias }
