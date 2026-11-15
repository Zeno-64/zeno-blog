// @ts-check
import { unified } from '@astrojs/markdown-remark'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { remarkAvisos } from './src/lib/remark-avisos.mjs'

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Endereço de produção: entra em canonical, og:url, sitemap e feeds.
  site: 'https://zeno.blog.br',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
    // remark-avisos: "> [!DICA]" vira um bloco de aviso (ver src/lib)
    processor: unified({ remarkPlugins: [remarkAvisos] }),
  },
  vite: { plugins: [tailwindcss()] },
  server: { port: 5182 },
})
