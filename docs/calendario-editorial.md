# Calendário editorial

Um ritmo que cabe ao lado de um emprego em tempo integral e de projetos
próprios. A régua não é volume, é **não quebrar a sequência de semanas** (ela
aparece em `/progresso`).

## A cadência

| o quê | quando | tempo |
| --- | --- | --- |
| **TIL** | toda semana, no dia em que algo te travou | 20 a 30 min |
| **Artigo** | a cada 2 semanas | 2 a 3 h, em duas sentadas |
| **Devlog** | 1 por mês para cada projeto ativo | 40 min |
| **Leitura** | quando terminar um livro ou curso | 1 h |
| **Revisão** (`/revisao`) | todo dia, ou quase | 5 min |
| **Manutenção** | último domingo do mês | 30 min |

**Semana mínima:** um TIL. Se a semana foi pesada, um TIL de cinco parágrafos
mantém a sequência viva, e é isso que importa.

## A semana

- **Durante a semana:** quando algo te prender por mais de 20 minutos,
  anote na hora em `src/data/ideias.yaml` (ou num `npm run novo` direto). O
  sintoma e o comando que resolveu já são metade do TIL.
- **Uma sessão fixa** de 90 minutos no fim de semana: termina o TIL da
  semana e avança o artigo da quinzena.
- **Publicar sempre no mesmo dia** (por exemplo, segunda de manhã) ajuda
  quem acompanha pelo LinkedIn e pelo RSS.

## Manutenção do mês (30 min)

1. Abra `/progresso`: sequência, mapa do ano, trilhas.
2. Atualize os `status` em `src/data/trilhas.yaml`.
3. Mova livros e cursos em `src/data/biblioteca.yaml`.
4. Repriorize `src/data/ideias.yaml`: apague o que perdeu a graça.
5. Escolha os dois artigos do mês seguinte.

## As próximas 12 semanas

Começando na segunda, 16 de novembro de 2026. As ideias já estão em
`src/data/ideias.yaml` e os rascunhos em `src/content/posts/rascunhos/`.

| semana | TIL | artigo / outro |
| --- | --- | --- |
| 1 · 16 nov | Domínio novo não abre só para você? É cache de DNS | — |
| 2 · 23 nov | Imagens de prévia de link geradas com o Chrome que já está instalado | **Artigo:** Sincronizar SQLite e Supabase sem serviço de terceiros (rascunho pronto · *Offline primeiro*, parte 1) |
| 3 · 30 nov | Os alertas do Security Insights do Cloudflare não são invasão | **Devlog:** Extensão do Chrome sem etapa de build — e como o ZapFlow é testado |
| 4 · 7 dez | um TIL do app em que estiver trabalhando | **Nota:** RPG Maker MZ é só texto — e por isso dá para programar com IA (rascunho pronto) |
| 5 · 14 dez | um TIL do trabalho (sem detalhes da empresa) | **Artigo:** SEO local — por que o Perfil da Empresa no Google vale mais que o site (*Do zero ao ar*, parte 3) |
| 6 · 21 dez | — semana leve: só o TIL, se der — | |
| 7 · 28 dez | **Retrospectiva:** o que aprendi em 2026 (artigo curto, com o mapa do `/progresso`) | |
| 8 · 4 jan | TIL | **Nota:** Certificação AWS vence em três anos — o plano para renovar |
| 9 · 11 jan | TIL | **Artigo:** Quanto cobrar por um site de negócio pequeno |
| 10 · 18 jan | TIL | **Leitura:** Designing Data-Intensive Applications, parte 1 |
| 11 · 25 jan | TIL | **Artigo:** Row Level Security com dois perfis — nutricionista e paciente (*Offline primeiro*, parte 2) |
| 12 · 1 fev | TIL | **Nota:** Testes de integração com Testcontainers no Spring Boot |

Ao fim das 12 semanas: cerca de 20 posts novos, duas séries andando e a
trilha de AWS com plano de renovação definido.

## Reaproveitar cada post

Um texto, quatro usos:

- **LinkedIn:** o problema e a lição em três parágrafos, link no fim.
- **Projeto:** devlogs e artigos linkados na página do projeto no
  `zeno.dev.br`.
- **Série completa vira material:** "Do zero ao ar" inteira é um guia para
  quem quer fazer sites para negócios pequenos (PDF, e-book ou aula).
- **Perguntas de revisão:** exportadas para o Anki pelo `/revisao.csv`.

## Quando a sequência quebrar

Vai acontecer. Publique o próximo TIL sem pedir desculpas no texto e siga.
Uma semana em branco no mapa não apaga as cheias.
