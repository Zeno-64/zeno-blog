---
titulo: SPA, WhatsApp e a prévia de link que não aparece
descricao: Crawler de link não roda JavaScript. Como gerar um HTML por rota no build do Vite e fazer a foto certa aparecer.
data: 2026-11-15
tipo: artigo
tags: [vite, seo, react, open-graph]
serie: do-zero-ao-ar
parte: 2
trilha: web
revisao:
  - pergunta: Por que a prévia de link de uma SPA mostra o título errado?
    resposta: O robô que monta a prévia lê o HTML que o servidor entrega e não executa JavaScript. Numa SPA, esse HTML é o mesmo index.html para todas as rotas.
  - pergunta: Por que o og:image precisa ser um endereço absoluto?
    resposta: Quem monta a prévia não resolve caminho relativo de forma confiável. Com https:// e o domínio, a imagem é sempre encontrada.
  - pergunta: Por que o plugin para o build quando não acha uma meta tag?
    resposta: Porque publicar o site inteiro com a prévia errada é pior que um build vermelho. Se alguém mexer no index.html e apagar a tag, o erro aparece na hora.
fontes:
  - titulo: The Open Graph protocol
    url: https://ogp.me/
  - titulo: Vite — API de plugins
    url: https://vite.dev/guide/api-plugin
  - titulo: LinkedIn Post Inspector
    url: https://www.linkedin.com/post-inspector/
---

O site está no ar, lindo, rápido. Você manda o link de um produto no WhatsApp e a prévia aparece com o título da página inicial e a foto genérica. Ou sem foto nenhuma.

Isso acontece com quase toda SPA — site React com React Router, por exemplo. O motivo é simples, e a solução cabe num plugin de 50 linhas.

## Por que acontece

Numa SPA, o servidor entrega **o mesmo `index.html` para todas as rotas**. Quem troca título, descrição e imagem conforme a página é o JavaScript, depois de carregar.

O robô que monta a prévia — do WhatsApp, do LinkedIn, do Facebook — **não executa JavaScript**. Ele baixa o HTML, lê as meta tags `og:` e vai embora. Para ele, toda página do site é a home.

> [!NOTA]
> O Google é exceção: ele renderiza JavaScript, com atraso. Mas prévia de link é outro robô, e esse não espera.

## A solução: um HTML por rota, no build

Se o robô só lê HTML, cada rota precisa ter o seu, já com as meta tags certas. Não precisa de SSR nem de framework novo: um plugin do Vite, rodando no fim do build, copia o `index.html` para `dist/<rota>/index.html` trocando as tags.

```ts
// vite.config.ts (resumido)
function metaPorRota(rotas: Meta[]): Plugin {
  return {
    name: 'meta-por-rota',
    apply: 'build',
    closeBundle() {
      const modelo = readFileSync('dist/index.html', 'utf8')
      for (const rota of rotas) {
        let html = modelo.replace(/<title>[^<]*<\/title>/, `<title>${rota.titulo}</title>`)
        html = trocar(html, 'property="og:title"', rota.titulo)
        html = trocar(html, 'property="og:image"', rota.imagem)
        // … description, og:description, og:url, canonical
        const destino = resolve('dist', rota.caminho.slice(1), 'index.html')
        mkdirSync(dirname(destino), { recursive: true })
        writeFileSync(destino, html)
      }
    },
  }
}
```

O detalhe que mais importa está no `trocar`: **se a tag não existir, o build para.**

```ts
function trocar(html: string, seletor: string, valor: string) {
  const alvo = new RegExp(`(<meta[^>]*${seletor}[^>]*content=")[^"]*(")`, 'i')
  if (!alvo.test(html)) throw new Error(`meta-por-rota: não achei ${seletor}`)
  return html.replace(alvo, `$1${escapar(valor)}$2`)
}
```

Hospedagem estática como a do Cloudflare entrega `dist/produtos/x/index.html` quando alguém pede `/produtos/x`. Rota que não tem arquivo cai no `index.html` normal da SPA. O React Router continua funcionando igual — o arquivo novo só chega com as meta tags certas.

## A imagem certa

Três regras para o `og:image`:

1. **Endereço absoluto**, com `https://` e domínio. Caminho relativo falha em metade dos robôs.
2. **1200 × 630**, em JPG ou PNG. É o tamanho que todo mundo recorta bem.
3. **Uma por página que vale a pena compartilhar.** Para gerar em série, uso o Chrome que já está instalado, via `puppeteer-core`, montando um cartão em HTML e tirando o print — é o `npm run og` do [zeno.dev.br](https://zeno.dev.br).

## Testar antes de mandar para o cliente

Primeiro, o que o robô vê:

```bash
curl -s https://seusite.com.br/produtos/x/ | grep -i "og:"
```

Depois, os inspetores oficiais, como o _Post Inspector_ do LinkedIn. O WhatsApp guarda a prévia em cache por um tempo: para testar de novo depois de corrigir, mande o link com um parâmetro qualquer no fim, como `?v=2`.

Este é o segundo passo da série — o primeiro é colocar o [site no ar com domínio próprio](/posts/site-estatico-cloudflare-registro-br/).
