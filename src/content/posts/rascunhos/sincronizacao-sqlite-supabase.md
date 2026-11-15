---
titulo: Sincronizar SQLite e Supabase sem serviço de terceiros
descricao: Fila de envio, cursor por transação do Postgres e lápide no lugar de DELETE — o protocolo do app de receitas, por que ele é próprio e onde ele pode falhar.
data: 2026-11-15
tipo: artigo
tags: [sqlite, supabase, postgres, offline]
serie: offline-primeiro
parte: 1
trilha: mobile
rascunho: true
---

<!--
RASCUNHO — não aparece no site publicado (rascunho: true).
Base: app-receitas/docs/requisitos.md, §7. Publicar depois que a fase 2 rodar de verdade.
-->

## Por que não usar um serviço pronto

- App gratuito: cada serviço a mais é uma conta e uma fatura.
- Precisa continuar rodando no Expo Go.
- O volume de uma casa é pequeno, e o modelo de dados evita quase todo conflito.

## O protocolo

1. **Id gerado no aparelho** (uuid) — cria registro offline sem esperar o servidor.
2. **Envio** — fila local preenchida por gatilho, mandada em lote por upsert. Repetir não duplica.
3. **Recebimento** — cada linha guarda `xid_alteracao`; o cursor é o `xmin` do snapshot da puxada anterior, para não perder transação que estava em andamento.
4. **Exclusão** — lápide (`excluido_em`), nunca `DELETE`.
5. **Conflito** — última escrita vence nas tabelas editáveis; movimentos de estoque só recebem inserção, então os lançamentos se somam.

## Para escrever

- [ ] Diagrama do fluxo (aparelho ↔ Postgres)
- [ ] Explicar `xmin` e por que o timestamp não serve de cursor
- [ ] O que acontece com dois aparelhos offline editando a mesma receita
