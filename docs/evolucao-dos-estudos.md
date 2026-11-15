# Evolução dos estudos

O blog não é só vitrine: cada parte dele foi pensada para uma técnica de
estudo que funciona. Este guia liga as duas coisas e propõe um plano.

## O ciclo

```text
   construir ──► anotar ──► explicar ──► revisar
       ▲                                    │
       └──────────── ajustar a trilha ◄─────┘
```

| etapa | técnica | onde mora no blog |
| --- | --- | --- |
| **Construir** | aprender fazendo um projeto de verdade | devlogs e a página do projeto no `zeno.dev.br` |
| **Anotar** | registrar no dia, antes de esquecer o contexto | TIL e `src/data/ideias.yaml` |
| **Explicar** | técnica Feynman: se não sai simples, você ainda não entendeu | artigos e notas de estudo |
| **Revisar** | lembrar puxando da memória, em intervalos crescentes | perguntas de revisão, `/revisao` e o Anki |
| **Ajustar** | olhar o mapa e escolher o próximo passo | `/trilhas` e `/progresso` |

### Construir

Todo assunto novo entra por um projeto. Os seus já cobrem quase todas as
trilhas: sites de clientes (web), o app da nutricionista e o de receitas
(mobile e offline), o backend do dia a dia (Java e Spring). Estudar sem
projeto vira tutorial assistido; com projeto vira problema resolvido, que é o
que fica.

### Anotar

O melhor momento para um TIL é logo depois de resolver o problema, com o
terminal ainda aberto. Uma hora depois já parece óbvio e não parece digno de
post. Em caso de pressa, só a nota em `ideias.yaml` com o sintoma e a solução.

### Explicar (Feynman)

Ao escrever um artigo:

1. Explique como para alguém que sabe programar, mas não aquele assunto.
2. Onde travar ou precisar de jargão, é a parte que você não entendeu.
   Volte à documentação.
3. Reescreva mais simples. Um exemplo de código vale mais que três
   parágrafos.

Os posts são escritos para **você de seis meses atrás**. Isso resolve o
"quem vai ler isso?".

### Revisar

Reler dá sensação de saber; lembrar sem olhar é o que fixa. A página
`/revisao` faz repetição espaçada no sistema Leitner: acertou, a pergunta
volta em 1, 3, 7, 15 e 30 dias; errou, repete no fim da rodada e volta
amanhã. Cinco minutos por dia bastam.

Para usar no celular, o Anki é melhor:

1. Baixe `https://zeno.blog.br/revisao.csv`.
2. No Anki do computador: **Arquivo → Importar**, escolha o arquivo e o tipo
   de nota **Básico**. O separador e as tags já vêm configurados no próprio
   arquivo.
3. Sincronize com o AnkiMobile ou o AnkiDroid.

### Ajustar

No último domingo do mês, olhe `/trilhas` e `/progresso`: o que andou, o que
travou, o que perdeu sentido. Trilha não é contrato. Mudar o plano faz parte.

## As trilhas e o próximo passo de cada uma

| trilha | onde está | próximo passo |
| --- | --- | --- |
| **Front-end para negócios pequenos** | quase toda feita; Astro em estudo | acessibilidade de verdade (leitor de tela, teclado, contraste) e SEO local |
| **Apps com React Native** | Expo e SQLite em estudo | fechar a sincronização com Supabase e publicar o primeiro app nas lojas com EAS |
| **AWS na prática** | Cloud Practitioner e Developer Associate feitos em 2022 | renovar (veja abaixo) |
| **Java e Spring a fundo** | Spring Boot no dia a dia | Testcontainers, depois observabilidade |
| **Fundamentos que não envelhecem** | começando | DDIA, um capítulo a cada duas semanas, com uma nota de estudo por capítulo |

### A renovação da AWS

As certificações da AWS valem três anos. As de 2022 venceram em 2025, então
o caminho é fazer de novo uma prova, e vale escolher a que mais ajuda agora:

- **Developer – Associate** de novo, se o foco for backend e serverless;
- **Solutions Architect – Associate**, se o objetivo for desenhar sistemas e
  conversar com arquitetura, o que combina com a trilha de fundamentos.

Confira o guia da prova atual no site da AWS antes de começar: os domínios
mudam de uma versão para outra. Uma nota de estudo por domínio da prova vira
material de revisão (e conteúdo para o blog).

## Metas por trimestre

Poucas e verificáveis. Um exemplo para o primeiro trimestre de 2027:

- [ ] 12 semanas seguidas com pelo menos um post
- [ ] Série *Offline primeiro* com 3 partes publicadas
- [ ] Um app publicado na loja (Android primeiro)
- [ ] Prova da AWS marcada
- [ ] DDIA até o capítulo 4, com uma nota por capítulo
- [ ] 100 cartões em revisão no Anki

Escreva as metas do trimestre num post curto (tipo `nota`) no começo e faça a
retrospectiva no fim. Isso é aprender em público.

## Aprender em público, sem se expor demais

- Conte o problema e a solução, nunca o nome do cliente ou da empresa sem
  autorização.
- Código de trabalho não vai para o blog. Recrie o problema num exemplo seu.
- Errou num post? Corrija e marque `atualizado`. Mostrar a correção conta a
  favor.
