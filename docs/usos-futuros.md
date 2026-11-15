# Usos futuros

Ideias para quando o blog tiver ritmo, em ordem de esforço. Nenhuma é
necessária agora: o que importa nos primeiros meses é publicar.

**Esforço:** P = uma tarde · M = um fim de semana · G = mais que isso.

## Para quem lê

| ideia | esforço | como | quando vale |
| --- | --- | --- | --- |
| **Estatística sem cookie** | P | Cloudflare Web Analytics: liga no painel, sem banner de cookies | logo depois de publicar |
| **Comentários** | P | [giscus](https://giscus.app): comentários guardados no GitHub Discussions do repositório, sem anúncio nem rastreio. Um componente em `src/pages/posts/[slug].astro` | quando chegarem as primeiras mensagens pelo LinkedIn |
| **Newsletter** | P | Buttondown ou similar lendo o `rss.xml`: cada post vira e-mail sozinho. Um formulário em `/sobre` e no fim dos posts | com uns 20 posts publicados |
| **Busca em janela** | P | trocar a interface padrão do Pagefind pela nova (Component UI), abrindo por cima da página com a tecla `/` | quando incomodar sair da página para buscar |
| **Leitura sem internet** | M | PWA com service worker guardando os posts lidos (`@vite-pwa/astro`) | se os leitores forem de celular, em trânsito |
| **Versão em inglês** | G | rotas `/en/` com o i18n do Astro e um campo `traducao` no frontmatter. Começar só pelos artigos fixados | quando quiser vagas fora do Brasil |

## Para estudar melhor

| ideia | esforço | como |
| --- | --- | --- |
| **Revisão em todos os aparelhos** | M | hoje o progresso fica no navegador. Primeiro passo: botões "exportar / importar progresso" (um JSON). Depois: um Worker com D1 ou KV e login por link no e-mail |
| **Página `/agora`** | P | o que está estudando, lendo e construindo neste mês, num YAML. O `zeno.dev.br` já tem uma: dá para ler a mesma fonte |
| **Snippets** | P | coleção `snippets` com trechos de código prontos para copiar (comando de DNS, config do Wrangler, hooks de React), com busca |
| **Glossário** | M | coleção `termos`: cada termo com definição curta e os posts que o usam. Vira um "dicionário do Zeno" |
| **Mapa de assuntos** | M | gráfico das tags e de como os posts se ligam, gerado no build |
| **Lembrete de revisão** | M | um Worker com cron que manda um e-mail semanal com "você tem 12 cartões para hoje" |

## Para a carreira e para renda

| ideia | esforço | como |
| --- | --- | --- |
| **Posts ligados aos projetos** | P | o `zeno.dev.br` já lê o `feed.json`. Próximo passo: a página de cada projeto listar os posts com a tag do projeto |
| **"Do zero ao ar" como guia** | M | a série completa vira um guia em PDF ou e-book para quem quer fazer sites para negócios pequenos. Gratuito em troca do e-mail (lista da newsletter) ou pago |
| **Curso curto** | G | a mesma série em vídeo, com os repositórios de exemplo. O blog vira a página de venda e a documentação |
| **Página de serviços no blog** | P | um bloco discreto no fim dos artigos da trilha web: "precisa de um site assim? fale comigo" levando ao `zeno.dev.br/contato` |
| **Palestras** | P | coleção `palestras` com slides e vídeo; os artigos mais lidos viram roteiro para meetups |
| **Patrocínio de leitores** | P | GitHub Sponsors ou Apoia.se no rodapé, quando houver público fiel |

## Técnico

| ideia | esforço | por quê |
| --- | --- | --- |
| **Subir para o Astro 7** | P | resolve os avisos do `npm audit`. Precisa do Node 22.23.4 ou mais novo (veja o README) |
| **Webmentions** | M | mostrar quando outro site ou post linka para o seu (webmention.io) |
| **Testes de link quebrado** | P | um passo no build que confere todos os links internos |
| **Imagens de prévia automáticas** | P | rodar o `npm run og` dentro do build da Cloudflare, sem precisar commitar as imagens (precisa de um Chrome no ambiente de build) |
