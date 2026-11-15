---
titulo: 'Do registro.br à Cloudflare: site estático sem mensalidade'
descricao: O roteiro que uso em todo site de cliente — domínio, DNS, Worker de assets e o que conferir antes de divulgar.
data: 2026-11-15
tipo: artigo
tags: [cloudflare, dns, deploy, registro.br]
serie: do-zero-ao-ar
parte: 1
trilha: web
revisao:
  - pergunta: Em nome de quem registrar o .com.br de um cliente?
    resposta: No CPF ou CNPJ do próprio cliente. O domínio é um ativo do negócio, e quem é titular controla renovação e transferência.
  - pergunta: Por que manter o endereço workers.dev ligado depois de configurar o domínio?
    resposta: Ele é o caminho de reserva. Se o domínio próprio falhar durante a propagação, o site continua acessível. Só desligue depois de testar a raiz e o www.
  - pergunta: Como saber se os nameservers do Cloudflare já estão valendo?
    resposta: Com nslookup -type=NS dominio.com.br 8.8.8.8. Enquanto aparecer auto.dns.br, ainda não propagou; quando aparecer ns.cloudflare.com, pegou.
fontes:
  - titulo: Cloudflare Workers — Static Assets
    url: https://developers.cloudflare.com/workers/static-assets/
  - titulo: Cloudflare Workers — Custom Domains
    url: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
  - titulo: RFC 6666 — o bloco IPv6 de descarte (100::/64)
    url: https://www.rfc-editor.org/rfc/rfc6666
---

Site de negócio pequeno — salão, ateliê, consultório — quase nunca precisa de servidor. É HTML, CSS, JavaScript e imagens. E site estático no Cloudflare sai de graça: **o único custo recorrente real é o domínio**, uns R$ 40 por ano no registro.br.

Este é o roteiro que sigo em todo projeto, na ordem que evita deixar o site fora do ar.

## 1. Preparar o projeto

O Cloudflare publica a pasta do build como _assets_ estáticos de um Worker. Sem código de Worker rodando, os pedidos aos arquivos estáticos não entram no limite do plano grátis. Precisa de dois arquivos na raiz.

O `wrangler.jsonc` diz qual pasta publicar:

```jsonc
{
  "name": "nome-do-projeto",
  "compatibility_date": "2024-11-01",
  "assets": {
    "directory": "./dist",
    // SPA com React Router: rota desconhecida cai no index.html
    "not_found_handling": "single-page-application"
  }
}
```

E o `.nvmrc` com a versão do Node (só `22`), senão o build no Cloudflare pode rodar com outra. Antes de subir, valide localmente:

```bash
npx wrangler deploy --dry-run
```

## 2. Criar o Worker no painel

Em **Workers & Pages → Create application**, importe o repositório do GitHub e preencha:

| campo | valor |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

> [!CUIDADO]
> Deixe **"Protect with Cloudflare Access" desligado**. Ligado, ele pede login para qualquer pessoa que abrir o site.

A partir daí, cada `git push` publica sozinho em menos de um minuto, num endereço provisório `nome-do-projeto.<conta>.workers.dev`.

## 3. Registrar e apontar o domínio

**Registre no CPF ou CNPJ do cliente**, não no seu. Domínio é patrimônio do negócio. Para saber se o nome está livre, o registro.br responde por RDAP:

```bash
curl -s "https://rdap.registro.br/domain/NOME.com.br" -o /dev/null -w "%{http_code}\n"
```

`404` é livre; `200` é registrado. Depois, nesta ordem:

1. **No Cloudflare**, _Add a site_ → domínio → plano Free. Ele devolve dois nameservers `xxx.ns.cloudflare.com`.
2. **No registro.br**, no domínio → DNS → alterar servidores DNS → cole os dois.
3. **Espere a propagação** (minutos a algumas horas no `.br`) e confira:

```bash
nslookup -type=NS NOME.com.br 8.8.8.8
```

Enquanto aparecer `auto.dns.br`, não propagou.

## 4. Ligar o domínio ao Worker

Em **Workers & Pages → projeto → Settings → Domains & Routes → Add → Custom Domain**, adicione o domínio raiz. E **repita para o `www`**: são dois endereços separados, e nenhum dos dois entra sozinho.

Três coisas que parecem erro e não são:

- **O `workers.dev` continua ligado.** Ele é a rede de segurança até você testar os dois endereços novos. Só desligue depois.
- **O domínio responde `100::` por um tempo.** É o bloco IPv6 de descarte da RFC 6666: o registro está esperando a delegação do `.br` terminar. Some sozinho.
- **Só no seu computador não abre.** O Windows e o Chrome guardam o "não existe" de antes. `ipconfig /flushdns` limpa o sistema; `chrome://net-internals/#dns` → _Clear host cache_ limpa o Chrome. Testar no celular, em rede móvel, tira a dúvida em segundos.

Por fim, em **SSL/TLS → Edge Certificates**, ligue **Always Use HTTPS**. Sem isso o site também responde em HTTP puro, sem redirecionar.

## 5. O que não apagar

Ao ativar o domínio, o Cloudflare importa registros de e-mail mesmo sem o cliente ter e-mail: `MX` nulo, `TXT v=spf1 -all` e `_dmarc`. **Não apague.** Eles dizem ao mundo "este domínio não manda e-mail" e impedem alguém de forjar mensagem em nome do negócio. Só mexa nos três juntos, se o cliente decidir ter e-mail de verdade.

## Checklist antes de divulgar

- [ ] Raiz e `www` abrem com cadeado
- [ ] HTTP redireciona para HTTPS
- [ ] Testado no celular, em rede móvel
- [ ] Prévia do link no WhatsApp com foto e título certos — assunto da [parte 2](/posts/spa-previa-de-link/)
- [ ] Só então: desligar o `workers.dev`
