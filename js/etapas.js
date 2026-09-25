/* =====================================================================
   INCUBADORA VERDE · etapas.js
   As 12 MISSÕES (na ordem em que acontecem). Cada missão mostra uma
   pergunta por tela.

   Campos de cada pergunta:
     pergunta  texto grande que o aluno lê
     rotulo    nome curto (usado no dossiê e nos prompts)
     ajuda     explicação simples logo abaixo da pergunta
     comecos   começos de frase que o aluno toca para inserir
     kitDica   parte do guia do tema que aparece como ajuda
               (sementes · medicoes · seguranca · perguntasMotoras)
     obrig     conta para o progresso
   Tipos: texto · longo · lista · escolha · multipla · kit · papeis ·
          dados (tabela de medições) · financeiro (calculadora)

   Os ids (e1...e12) são internos; a numeração que o aluno vê é a
   ordem desta lista.
   ===================================================================== */
window.IV = window.IV || {};

IV.ETAPAS = [
  /* ================================================ MISSÃO 1 */
  {
    id: "e1", titulo: "Nossa equipe", disc: "neg", tempo: "15 minutos",
    porque: "Cada pessoa cuida de uma parte. Assim ninguém fica parado e ninguém faz tudo sozinho.",
    hoje: ["Escolher quem cuida de cada parte", "Dizer o que cada um sabe fazer bem", "Combinar como a equipe vai trabalhar"],
    prompts: ["p_semana"],
    perguntas: [
      { id: "papeis", tipo: "papeis", rotulo: "Quem cuida de cada parte", pergunta: "Quem vai cuidar de cada parte do projeto?",
        ajuda: "Toquem nas partes ao lado do nome de cada pessoa. Uma pessoa pode ter duas partes. Todas as partes precisam ter alguém.", obrig: true },
      { id: "forcas", tipo: "multipla", rotulo: "O que a equipe sabe fazer bem", pergunta: "O que a equipe sabe fazer bem?",
        ajuda: "Marquem tudo o que alguém do grupo faz bem. Isso ajuda a escolher uma ideia que combina com vocês.", obrig: true,
        opcoes: ["Desenhar", "Escrever", "Falar em público", "Fazer contas", "Mexer no celular e no computador", "Construir e montar coisas", "Fazer vídeos e posts", "Vender e negociar", "Cozinhar", "Pesquisar", "Organizar"] },
      { id: "combinados", tipo: "longo", rotulo: "Combinados da equipe", pergunta: "Quais são os combinados da equipe?",
        ajuda: "Quando vão se reunir? Como vão conversar? O que acontece se alguém não fizer a parte dele?", obrig: true,
        comecos: ["Vamos nos reunir ", "Vamos conversar pelo ", "Se alguém não conseguir fazer a tarefa, "] },
      { id: "nome_equipe", tipo: "texto", rotulo: "Nome da equipe", pergunta: "Qual é o nome da equipe?",
        ajuda: "Pode ser provisório. Dá para mudar depois." }
    ]
  },

  /* ================================================ MISSÃO 2 */
  {
    id: "e2", titulo: "O que já sabemos", disc: "bio", tempo: "20 minutos", introKit: "resumo",
    porque: "Antes de pesquisar, vocês escrevem o que já sabem. No fim do projeto, vão comparar e ver o quanto aprenderam.",
    hoje: ["Escrever o que já sabem sobre o tema", "Escrever 3 perguntas que querem responder", "Pedir para a IA explicar o tema de um jeito fácil"],
    prompts: ["p_mapa", "p_pesquisa"],
    perguntas: [
      { id: "ja_sabemos", tipo: "longo", rotulo: "O que já sabemos", pergunta: "O que vocês já sabem sobre o tema?",
        ajuda: "Escrevam sem pesquisar, só com o que vocês sabem. Aqui não existe resposta errada.", obrig: true,
        comecos: ["Nós sabemos que ", "Já ouvimos falar que ", "Achamos que "] },
      { id: "duvidas", tipo: "lista", rotulo: "Perguntas que queremos responder", pergunta: "Quais perguntas vocês querem responder?",
        ajuda: "Escrevam pelo menos 3, uma em cada linha. Comecem com Por que, Quanto, Como ou O que acontece.", obrig: true,
        comecos: ["Por que ", "Quanto ", "Como ", "O que acontece quando "], kitDica: "perguntasMotoras" },
      { id: "fontes", tipo: "multipla", rotulo: "Onde vamos pesquisar", pergunta: "Onde vocês vão procurar as respostas?",
        ajuda: "Marquem pelo menos dois lugares. Tudo que vier da internet ou da IA precisa ser conferido em outro lugar.", obrig: true,
        opcoes: ["Livro didático", "Sites do governo", "Embrapa ou universidades", "Vídeos de professores", "Entrevista com alguém que entende do assunto", "Inteligência artificial (conferindo depois)"] }
    ]
  },

  /* ================================================ MISSÃO 3 */
  {
    id: "e3", titulo: "O problema", disc: "bio", tempo: "30 minutos",
    porque: "Todo negócio ambiental resolve um problema de verdade. Se o problema é real e dá para medir, o projeto fica forte.",
    hoje: ["Escrever o problema em uma frase", "Dizer onde acontece e quem é prejudicado", "Mostrar uma prova de que ele existe"],
    prompts: ["p_problema", "p_entrevista"],
    perguntas: [
      { id: "problema", tipo: "longo", rotulo: "O problema", pergunta: "Qual é o problema?",
        ajuda: "Usem o modelo: Em [lugar], [o que acontece], e isso causa [consequência].", obrig: true,
        comecos: ["Na nossa escola, ", "No nosso bairro, ", "Em Foz do Iguaçu, ", ", e isso causa "] },
      { id: "onde", tipo: "escolha", rotulo: "Onde acontece", pergunta: "Onde o problema acontece?", obrig: true,
        ajuda: "Escolham o lugar mais perto de vocês. Problemas perto são mais fáceis de medir.",
        opcoes: ["Na escola", "Nas nossas casas", "No bairro", "Em Foz do Iguaçu", "Na região Oeste do Paraná"] },
      { id: "afetados", tipo: "longo", rotulo: "Quem é prejudicado", pergunta: "Quem ou o que é prejudicado?",
        ajuda: "Pessoas, animais, plantas, rios, solo... Sejam específicos.", obrig: true,
        comecos: ["Os mais prejudicados são ", "Isso prejudica "] },
      { id: "evidencias", tipo: "longo", rotulo: "Provas de que o problema existe", pergunta: "Como vocês sabem que esse problema existe?",
        ajuda: "Uma foto, uma observação, uma conversa com alguém ou um dado de um site confiável. Se ainda não têm, escrevam como vão conseguir.", obrig: true,
        comecos: ["Nós vimos que ", "Conversamos com ", "Segundo o site ", "Vamos conseguir a prova "] },
      { id: "tamanho", tipo: "longo", rotulo: "Tamanho do problema", pergunta: "Qual é o tamanho do problema, em número?",
        ajuda: "Pode ser um palpite com conta. Ex.: 3 kg por dia × 20 dias = 60 kg por mês. Digam de onde veio o número.", obrig: true,
        comecos: ["Mais ou menos ", "Por dia são ", "Por mês são ", "Esse número veio de "] },
      { id: "pergunta", tipo: "longo", rotulo: "Pergunta do projeto", pergunta: "Qual pergunta o projeto vai responder?",
        ajuda: "Completem: Como podemos [fazer o quê] para [melhorar o quê] em [lugar]?", obrig: true,
        comecos: ["Como podemos ", " para ", " na nossa escola?", " no nosso bairro?"] }
    ]
  },

  /* ================================================ MISSÃO 4 */
  {
    id: "e4", titulo: "A nossa ideia", disc: "neg", tempo: "40 minutos",
    porque: "Agora o problema vira um produto ou serviço que alguém usaria ou compraria. Primeiro muitas ideias, depois a escolha.",
    hoje: ["Escrever várias ideias", "Escolher a melhor", "Explicar como funciona e quem vai comprar"],
    prompts: ["p_ideias", "p_valida"],
    perguntas: [
      { id: "ideias_brutas", tipo: "lista", rotulo: "Chuva de ideias", pergunta: "Escrevam pelo menos 3 ideias",
        ajuda: "Uma ideia por linha. Vale ideia simples ou maluca. Não julguem agora. Se travarem, abram as ideias do professor logo abaixo.", obrig: true,
        kitDica: "sementes" },
      { id: "tipo_solucao", tipo: "escolha", rotulo: "Tipo de solução", pergunta: "A ideia escolhida é...", obrig: true,
        ajuda: "Escolham a opção que mais combina com a ideia de vocês.",
        opcoes: ["Um produto (algo que se vende)", "Um serviço (algo que se faz para alguém)", "Um app ou site", "Um kit ou oficina para ensinar", "Uma campanha na escola"] },
      { id: "ideia", tipo: "longo", rotulo: "A ideia escolhida", pergunta: "Qual ideia vocês escolheram?",
        ajuda: "Expliquem em poucas frases, como se contassem para alguém que nunca ouviu falar.", obrig: true,
        comecos: ["Nossa ideia é ", "Ela resolve o problema porque "] },
      { id: "como_funciona", tipo: "lista", rotulo: "Como funciona", pergunta: "Como funciona, passo a passo?",
        ajuda: "Do começo (de onde vem o resíduo) até o fim (o que a pessoa recebe). Um passo por linha.", obrig: true,
        comecos: ["1. Primeiro, ", "2. Depois, ", "3. Em seguida, ", "4. Por fim, "] },
      { id: "publico", tipo: "longo", rotulo: "Quem vai comprar ou usar", pergunta: "Quem vai comprar ou usar?",
        ajuda: "Sejam específicos: \"mães da escola que têm horta\" é melhor do que \"todo mundo\".", obrig: true,
        comecos: ["Quem vai comprar são ", "Quem vai usar são "] },
      { id: "proposta_valor", tipo: "longo", rotulo: "Por que comprariam", pergunta: "Por que essas pessoas comprariam ou usariam?",
        ajuda: "Que problema resolve para elas? Por que é melhor do que o que já existe?", obrig: true,
        comecos: ["Elas comprariam porque ", "É melhor do que o que já existe porque "] },
      { id: "nome_negocio", tipo: "texto", rotulo: "Nome do negócio", pergunta: "Qual é o nome do negócio?",
        ajuda: "Pode ser provisório. Na Missão 10 a IA pode ajudar a criar um nome melhor." }
    ]
  },

  /* ================================================ MISSÃO 5 */
  {
    id: "e7", titulo: "O teste: o que vamos medir", disc: "mat", tempo: "30 minutos",
    porque: "Na feira, vocês precisam mostrar números medidos por vocês. Aqui vocês planejam o teste que vai gerar esses números.",
    hoje: ["Decidir o que vão mudar e o que vão medir", "Decidir como e quando vão medir", "Dar um palpite do resultado"],
    prompts: ["p_mat", "p_experimento"],
    perguntas: [
      { id: "var_indep", tipo: "longo", rotulo: "O que vamos mudar no teste", pergunta: "O que vocês vão MUDAR no teste?",
        ajuda: "É a única coisa diferente entre as amostras. Ex.: a quantidade de borra de café na terra (0%, 25% e 50%).", obrig: true,
        comecos: ["Vamos mudar ", "As amostras vão ser: "] },
      { id: "grandezas", tipo: "longo", rotulo: "O que vamos medir (e a unidade)", pergunta: "O que vocês vão MEDIR, e em qual unidade?",
        ajuda: "Ex.: altura da planta em centímetros (cm), massa em quilos (kg), temperatura em graus (°C), volume em litros (L).", obrig: true,
        comecos: ["Vamos medir ", " em "], kitDica: "medicoes" },
      { id: "var_ctrl", tipo: "longo", rotulo: "O que fica igual", pergunta: "O que vai ficar IGUAL em todas as amostras?",
        ajuda: "Para o teste ser justo, só uma coisa muda. O resto fica igual: quantidade de água, lugar, tamanho do pote, horário da medida.", obrig: true,
        comecos: ["Vai ficar igual: "] },
      { id: "repeticoes", tipo: "escolha", rotulo: "Repetições", pergunta: "Quantas vezes vão repetir cada amostra?",
        ajuda: "Uma vez só pode ser sorte. Repetindo, dá para ver se o resultado se confirma. Três vezes é o mínimo recomendado.", obrig: true,
        opcoes: ["1 vez", "2 vezes", "3 vezes", "4 vezes ou mais"] },
      { id: "plano_coleta", tipo: "longo", rotulo: "Como e quando vamos medir", pergunta: "Quando e como vão medir?",
        ajuda: "Quem mede, com qual instrumento (régua, balança, termômetro) e em quais dias.", obrig: true,
        comecos: ["Quem mede é ", "Vamos usar ", "Vamos medir nos dias "] },
      { id: "hipotese", tipo: "longo", rotulo: "Palpite (hipótese)", pergunta: "Qual é o palpite de vocês para o resultado?",
        ajuda: "Completem: Nós achamos que [vai acontecer isso] porque [motivo]. Na ciência, esse palpite se chama hipótese.", obrig: true,
        comecos: ["Nós achamos que ", " porque "] },
      { id: "ferramentas_mat", tipo: "kit", kitChave: "mat", rotulo: "Contas que vamos usar", pergunta: "Que contas e ferramentas de Matemática vão usar?",
        ajuda: "Escolham pelo menos duas. Se não entenderem alguma, usem a ajuda da IA \"Explica as contas do projeto\".", obrig: true }
    ]
  },

  /* ================================================ MISSÃO 6 */
  {
    id: "e8", titulo: "Montar o teste e o protótipo", disc: "qui", tempo: "40 minutos", introKit: "armadilhas",
    porque: "Protótipo é a primeira versão, bem simples, do produto de vocês. Montem até o fim da semana 2 para dar tempo de medir.",
    hoje: ["Listar os materiais", "Escrever o passo a passo", "Pensar na segurança e mostrar ao professor"],
    prompts: ["p_experimento", "p_prototipo"],
    perguntas: [
      { id: "prototipo", tipo: "longo", rotulo: "O que vamos montar", pergunta: "O que vocês vão montar ou produzir?",
        ajuda: "Descrevam a versão mais simples que já funciona. Não precisa ficar bonito agora.", obrig: true,
        comecos: ["Vamos montar ", "A primeira versão vai ser "] },
      { id: "materiais", tipo: "lista", rotulo: "Materiais", pergunta: "Quais materiais vão usar?",
        ajuda: "Um material por linha, com a quantidade. Prefiram materiais reaproveitados.", obrig: true,
        comecos: ["garrafas PET", "potes", "régua", "balança", "luvas"] },
      { id: "procedimento", tipo: "lista", rotulo: "Passo a passo", pergunta: "Qual é o passo a passo?",
        ajuda: "Escrevam como uma receita, um passo por linha, para que outra pessoa consiga repetir.", obrig: true,
        comecos: ["1. ", "2. ", "3. ", "4. ", "5. "] },
      { id: "seguranca", tipo: "longo", rotulo: "Cuidados de segurança", pergunta: "Quais cuidados de segurança vão ter?",
        ajuda: "O que pode cortar, queimar, sujar ou fazer mal? Que proteção vão usar? O que só o professor pode fazer?", obrig: true,
        comecos: ["Vamos usar ", "Só o professor vai ", "Não vamos "], kitDica: "seguranca" },
      { id: "supervisao", tipo: "escolha", rotulo: "Aprovação do professor", pergunta: "O professor já viu e aprovou o teste?", obrig: true,
        ajuda: "Mostrem o passo a passo e os cuidados ao professor ANTES de começar.",
        opcoes: ["Sim", "Ainda não", "Não tem nenhum risco"] }
    ]
  },

  /* ================================================ MISSÃO 7 */
  {
    id: "e5", titulo: "A Biologia do projeto", disc: "bio", tempo: "30 minutos",
    porque: "A Biologia explica o que acontece com os seres vivos no problema e na solução de vocês.",
    hoje: ["Pedir para a IA explicar a Biologia do tema", "Escolher os assuntos de Biologia", "Explicar com as palavras de vocês"],
    prompts: ["p_bio"],
    perguntas: [
      { id: "conceitos_bio", tipo: "kit", kitChave: "bio", rotulo: "Assuntos de Biologia", pergunta: "Quais assuntos de Biologia aparecem no projeto?",
        ajuda: "Escolham pelo menos dois. Se não entenderem algum, peçam para a IA explicar.", obrig: true },
      { id: "seres_vivos", tipo: "longo", rotulo: "Seres vivos envolvidos", pergunta: "Quais seres vivos estão envolvidos?",
        ajuda: "Micróbios (bactérias, fungos), plantas, animais, pessoas. Digam o papel de cada um.", obrig: true,
        comecos: ["Os seres vivos envolvidos são ", "O papel deles é "] },
      { id: "processo_bio", tipo: "longo", rotulo: "O que acontece com eles", pergunta: "O que acontece com esses seres vivos?",
        ajuda: "Expliquem com as palavras de vocês. Ex.: \"as bactérias se alimentam dos restos de comida e liberam gás\".", obrig: true,
        comecos: ["O que acontece é que ", "Isso acontece porque "] },
      { id: "saude", tipo: "longo", rotulo: "Efeito na saúde e no ambiente", pergunta: "Como isso afeta a saúde das pessoas ou o ambiente?",
        comecos: ["Isso afeta a saúde porque ", "Isso afeta o ambiente porque "] },
      { id: "demo_bio", tipo: "longo", rotulo: "Como mostrar a Biologia na feira", pergunta: "Como mostrar a Biologia na feira?",
        ajuda: "Uma amostra, fotos do antes e depois, um desenho, uma lupa...", comecos: ["Vamos mostrar "] }
    ]
  },

  /* ================================================ MISSÃO 8 */
  {
    id: "e6", titulo: "A Química do projeto", disc: "qui", tempo: "30 minutos",
    porque: "A Química explica quais substâncias existem no projeto e como elas se transformam.",
    hoje: ["Pedir para a IA explicar a Química do tema", "Escolher os assuntos de Química", "Escrever a transformação que acontece"],
    prompts: ["p_qui", "p_integra"],
    perguntas: [
      { id: "conceitos_qui", tipo: "kit", kitChave: "qui", rotulo: "Assuntos de Química", pergunta: "Quais assuntos de Química aparecem no projeto?",
        ajuda: "Escolham pelo menos dois. Se não entenderem algum, peçam para a IA explicar.", obrig: true },
      { id: "substancias", tipo: "longo", rotulo: "Substâncias e materiais", pergunta: "Quais substâncias ou materiais aparecem no projeto?",
        ajuda: "Nome do dia a dia e, se souberem, o nome químico. Ex.: óleo (gordura), soda cáustica (hidróxido de sódio).", obrig: true,
        comecos: ["As substâncias são "] },
      { id: "tipo_transf", tipo: "escolha", rotulo: "Tipo de transformação", pergunta: "Os materiais viram outra substância ou só mudam de forma?", obrig: true,
        ajuda: "Se aparece uma substância nova (cheiro, cor, gás, sabão...), é transformação química. Se só muda de forma ou estado (cortar, secar, derreter), é física.",
        opcoes: ["Viram outra substância (química)", "Só mudam de forma ou estado (física)", "As duas coisas", "Ainda não sabemos"] },
      { id: "reacao", tipo: "longo", rotulo: "A transformação", pergunta: "Escrevam a transformação: o que entra → o que sai",
        ajuda: "Ex.: óleo + soda cáustica → sabão + glicerina.", obrig: true,
        comecos: [" + ", " → "] },
      { id: "riscos", tipo: "longo", rotulo: "Riscos químicos", pergunta: "Algum material é perigoso? Que cuidado vão ter?", obrig: true,
        comecos: ["O material perigoso é ", "O cuidado é ", "Nenhum material é perigoso porque "], kitDica: "seguranca" },
      { id: "demo_qui", tipo: "longo", rotulo: "Como mostrar a Química na feira", pergunta: "Como mostrar a Química na feira?",
        ajuda: "Ex.: teste de pH com repolho roxo, comparar amostras, mostrar o antes e o depois.", comecos: ["Vamos mostrar "] }
    ]
  },

  /* ================================================ MISSÃO 9 */
  {
    id: "e9", titulo: "Nossos resultados", disc: "mat", tempo: "20 minutos (voltem aqui toda vez que medirem)",
    porque: "Aqui vocês anotam os números medidos. O sistema faz as contas e o gráfico. Vocês explicam o que eles mostram.",
    hoje: ["Anotar as medições na tabela", "Olhar as contas e o gráfico", "Explicar o resultado em uma frase com número"],
    prompts: ["p_analise"],
    perguntas: [
      { id: "tabela", tipo: "dados", rotulo: "Tabela de medições", pergunta: "Anotem as medições",
        ajuda: "Primeira coluna: o que foi medido (dia ou amostra). Segunda coluna em diante: os números. Escrevam a unidade no título da coluna.", obrig: true },
      { id: "resultado", tipo: "longo", rotulo: "O que os números mostram", pergunta: "O que os números mostram?",
        ajuda: "Olhem a média, o maior e o menor valor. Escrevam uma frase COM número.", obrig: true,
        comecos: ["A média foi ", "O maior valor foi ", "A amostra que teve o melhor resultado foi ", " porque "] },
      { id: "hipotese_ok", tipo: "escolha", rotulo: "O palpite estava certo?", pergunta: "O palpite de vocês (Missão 5) estava certo?", obrig: true,
        ajuda: "Errar o palpite não é problema. O importante é explicar o que aconteceu.",
        opcoes: ["Sim", "Em parte", "Não", "Ainda não dá para saber"] },
      { id: "limitacoes", tipo: "longo", rotulo: "O que pode ter atrapalhado", pergunta: "O que pode ter atrapalhado o teste?",
        ajuda: "Chuva, pouco tempo, erro na medida, poucas repetições, amostra estragada...", obrig: true,
        comecos: ["Pode ter atrapalhado ", "Na próxima vez, faríamos "] },
      { id: "observacoes", tipo: "longo", rotulo: "O que vimos sem número", pergunta: "O que vocês viram que não virou número?",
        ajuda: "Cheiro, cor, mofo, bichinhos, mudanças que chamaram atenção.", comecos: ["Percebemos que "] }
    ]
  },

  /* ================================================ MISSÃO 10 */
  {
    id: "e10", titulo: "Dinheiro e impacto", disc: "neg", tempo: "40 minutos",
    porque: "Um negócio precisa pagar os próprios gastos. Aqui vocês descobrem quanto precisam vender e quanto ajudam o ambiente.",
    hoje: ["Anotar os gastos", "Escolher o preço", "Calcular o bem que o projeto faz ao ambiente"],
    prompts: ["p_financas", "p_impacto", "p_marca"],
    perguntas: [
      { id: "financeiro", tipo: "financeiro", rotulo: "Contas do negócio", pergunta: "Façam as contas do negócio",
        ajuda: "Preencham os passos na ordem. As contas aparecem sozinhas, explicadas em frases.", obrig: true },
      { id: "impacto_esperado", tipo: "longo", rotulo: "Impacto ambiental", pergunta: "Que bem o projeto faz para o ambiente?",
        ajuda: "Usem o número que a calculadora mostrou. Ex.: \"cada sabão reaproveita meio litro de óleo; vendendo 40, são 20 litros\".", obrig: true,
        comecos: ["Cada unidade vendida evita ", "Vendendo a meta, são ", "Isso ajuda o ambiente porque "] },
      { id: "canais", tipo: "multipla", rotulo: "Como as pessoas vão conhecer e comprar", pergunta: "Como as pessoas vão conhecer e comprar?", obrig: true,
        ajuda: "Marquem todos os caminhos que vão usar.",
        opcoes: ["Na feira da escola", "Instagram", "WhatsApp", "Na cantina", "Em lojas parceiras", "Para vizinhos e família", "Para a própria escola"] },
      { id: "parceiros", tipo: "longo", rotulo: "Parceiros", pergunta: "Quem pode ajudar o negócio?",
        ajuda: "Quem fornece o material? Quem ajuda a vender? Comércios, cooperativas, a própria escola, a família.",
        comecos: ["Quem fornece o material é ", "Quem pode ajudar a vender é "] }
    ]
  },

  /* ================================================ MISSÃO 11 */
  {
    id: "e11", titulo: "Preparar a feira", disc: "com", tempo: "40 minutos",
    porque: "Na feira, o visitante fica poucos minutos. Vocês precisam chamar atenção, mostrar algo e explicar de forma simples.",
    hoje: ["Criar a frase de abertura", "Decidir o que o visitante vai ver", "Dividir quem fala o quê e treinar"],
    prompts: ["p_pitch", "p_banner", "p_banca"],
    perguntas: [
      { id: "gancho", tipo: "longo", rotulo: "Frase de abertura", pergunta: "Qual frase vai chamar a atenção do visitante?",
        ajuda: "Uma pergunta ou um número surpreendente do projeto de vocês.", obrig: true,
        comecos: ["Você sabia que ", "Quanto você acha que "] },
      { id: "demonstracao", tipo: "longo", rotulo: "O que o visitante vai ver ou fazer", pergunta: "O que o visitante vai ver ou fazer no estande?",
        ajuda: "Quando o visitante participa, ele presta mais atenção: um teste, uma amostra, um quiz.", obrig: true,
        comecos: ["O visitante vai ", "Vamos mostrar "] },
      { id: "materiais_feira", tipo: "multipla", rotulo: "Materiais da feira", pergunta: "O que vai ter no estande?", obrig: true,
        ajuda: "Marquem tudo o que vão levar.",
        opcoes: ["Banner", "Protótipo", "Amostras do produto", "Gráfico impresso", "Maquete", "QR code", "Folheto", "Tabela de preços", "Experimento ao vivo"] },
      { id: "divisao_fala", tipo: "longo", rotulo: "Quem fala o quê", pergunta: "Quem vai falar cada parte?",
        ajuda: "Todos falam. Cada um explica a sua parte e sabe um resumo das outras. Toquem nos nomes para começar.", obrig: true, comecosMembros: true },
      { id: "perguntas_temidas", tipo: "lista", rotulo: "Perguntas difíceis", pergunta: "Que perguntas vocês têm medo de receber?",
        ajuda: "Uma por linha. Vocês vão treinar as respostas com a ajuda \"Simula os jurados da feira\"." }
    ]
  },

  /* ================================================ MISSÃO 12 */
  {
    id: "e12", titulo: "O que aprendemos", disc: "com", tempo: "20 minutos",
    porque: "Registrar o que aprenderam e como usaram a IA também faz parte da avaliação.",
    hoje: ["Escrever o que aprenderam em cada matéria", "Contar como usaram a IA"],
    prompts: ["p_revisor", "p_dossie"],
    perguntas: [
      { id: "aprend_bio", tipo: "longo", rotulo: "O que aprendemos de Biologia", pergunta: "O que vocês aprenderam de Biologia?", obrig: true, comecos: ["Aprendemos que "] },
      { id: "aprend_qui", tipo: "longo", rotulo: "O que aprendemos de Química", pergunta: "O que vocês aprenderam de Química?", obrig: true, comecos: ["Aprendemos que "] },
      { id: "aprend_mat", tipo: "longo", rotulo: "O que aprendemos de Matemática", pergunta: "O que vocês aprenderam de Matemática?", obrig: true, comecos: ["Aprendemos que ", "A conta mais importante foi "] },
      { id: "uso_ia", tipo: "longo", rotulo: "Como usamos a IA", pergunta: "Como vocês usaram a IA?",
        ajuda: "Para que usaram? O que conferiram em outro lugar? Em que discordaram dela? O que decidiram sozinhos?", obrig: true,
        comecos: ["Usamos a IA para ", "Conferimos ", "Discordamos da IA quando ", "Decidimos sozinhos "] },
      { id: "futuro", tipo: "longo", rotulo: "E depois da feira?", pergunta: "O negócio poderia continuar depois da feira?", comecos: ["Poderia continuar se "] }
    ]
  }
];

IV.ETAPAS.forEach(function (e, i) {
  e.num = i + 1;
  e.perguntas.forEach(function (p) { p.rotulo = p.rotulo || p.pergunta; });
});
IV.etapaPorId = function (id) { return IV.ETAPAS.find(function (e) { return e.id === id; }); };

IV.KIT_DICAS = {
  sementes: "Ideias do professor para o tema de vocês",
  medicoes: "O que dá para medir no tema de vocês",
  seguranca: "Cuidados de segurança do tema de vocês",
  perguntasMotoras: "Perguntas sugeridas pelo professor",
  armadilhas: "Atenção: erros comuns neste tema",
  resumo: "Sobre o tema de vocês"
};
