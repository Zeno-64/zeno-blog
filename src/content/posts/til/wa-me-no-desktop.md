---
titulo: Por que o wa.me fecha a aba no computador
descricao: O botão de WhatsApp que funciona no celular e some no desktop — e o link que resolve.
data: 2026-11-15
tipo: til
tags: [whatsapp, windows, front-end]
trilha: web
revisao:
  - pergunta: Por que o wa.me pode fechar a aba sem abrir nada no Windows?
    resposta: Ele tenta passar a conversa para o app pelo protocolo whatsapp://. Se o protocolo ficou registrado sem app por trás (sobra de desinstalação), o navegador acha que deu certo, nada abre e a página fecha a aba.
  - pergunta: Qual link de WhatsApp usar no computador?
    resposta: web.whatsapp.com/send?phone=…&text=… — vai direto para o WhatsApp Web, sem tentar abrir o app.
---

Num site de cliente, o botão de WhatsApp funcionava no celular e, no meu computador, **abria uma aba que fechava sozinha** sem mostrar nada. Sem erro, sem aviso.

## A causa

O `wa.me` redireciona para `api.whatsapp.com/send`, e essa página tenta entregar a conversa para o app instalado pelo protocolo `whatsapp://`. O navegador pergunta ao Windows se alguém atende esse protocolo.

No registro do Windows existia a chave `HKCU:\SOFTWARE\Classes\whatsapp` com o valor `URL Protocol` — mas **sem nenhum comando de abertura dentro**. Sobra de um WhatsApp Desktop desinstalado. O navegador vê o protocolo registrado, **considera a entrega um sucesso**, nada abre, e a página fecha a aba.

Para conferir na sua máquina (PowerShell):

```powershell
Get-ChildItem HKCU:\SOFTWARE\Classes\whatsapp -Recurse
```

Se a chave existe mas não tem `shell\open\command`, é isso.

## O link que resolve

Não é bug do site, mas quem tem esse registro órfão clica no único botão que importa e nada acontece. Então o link muda conforme o aparelho:

```ts
function linkWhatsApp(numero: string, texto: string) {
  const celular = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const t = encodeURIComponent(texto)
  return celular
    ? `https://wa.me/${numero}?text=${t}` // abre o app
    : `https://web.whatsapp.com/send?phone=${numero}&text=${t}` // sem passar pelo protocolo
}
```

> [!CUIDADO]
> No link do computador a URL já tem `?phone=`, então o texto entra com `&text=`, não `?text=`.

Para detectar o celular com mais precisão, vale ir do sinal mais confiável para o menos: `navigator.userAgentData.mobile` (Chrome e afins), depois toque com cara de Mac (o iPad moderno se anuncia como Safari de desktop) e, por último, a expressão no _user agent_.
