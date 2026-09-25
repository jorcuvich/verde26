# Incubadora Verde

Sistema para os 11 grupos do Projeto Integrador Meio Ambiente (Química, Biologia e Matemática, 1º ano do EM) desenvolverem uma ideia de empreendedorismo ambiental até a feira (cronograma de 5 semanas).

## Como colocar no ar

- **Local:** abra `index.html` no navegador (funciona sem servidor).
- **Na internet:** envie a pasta inteira para qualquer hospedagem estática (GitHub Pages, Netlify, o seu próprio domínio). Não há banco de dados nem servidor.

## Onde mudar cada coisa

| Arquivo | O que tem |
|---|---|
| `js/dados.js` | Workshops, grupos, integrantes, guia de cada tema, cronograma, rubrica, **datas padrão** (`inicioPadrao`, `feiraPadrao`) |
| `js/etapas.js` | As 12 missões, as perguntas, as dicas e os começos de frase |
| `js/prompts.js` | As 26 ajudas da IA (prompts) e as regras enviadas à IA |
| `js/exemplo.js` | O projeto exemplo fictício (borra de café) |
| `js/util.js` | Estatística, finanças, progresso |
| `js/formulario.js` | Campos, tabela de dados e calculadora do negócio |
| `js/graficos.js` | Gráficos |
| `js/armazenamento.js` | Salvamento no navegador e backup |
| `js/app.js` | Telas e navegação |
| `css/estilo.css` | Visual |

## Observações

- No cartaz, o **Grupo 3** aparece duas vezes (W1 com Sara; W2 com Andreas, Felipe M. e Pietro H.). No sistema eles são "Grupo 3 · W1" e "Grupo 3 · W2". Para renumerar, mude o campo `rotulo` em `js/dados.js`.
- As respostas ficam no navegador de cada aparelho (localStorage). Os grupos devem baixar o backup (.json) ao fim de cada aula; o professor importa vários backups de uma vez no Painel do Professor.
- Modo da IA: `modoIA` em `js/dados.js` ("tutor", "orientador" ou "especialista").
- Endereços diretos: `index.html#g7` (missões do Grupo 7), `#g7-ia`, `#g7-salvar`, `#professor`.
