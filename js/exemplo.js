/* =====================================================================
   INCUBADORA VERDE · exemplo.js
   Um projeto fictício, totalmente preenchido, para mostrar aos alunos
   como fica um trabalho completo. Tema propositalmente diferente dos
   temas da turma. Dados FICTÍCIOS.
   ===================================================================== */
window.IV = window.IV || {};

IV.GRUPO_EXEMPLO = {
  id: "ex", rotulo: "Exemplo", workshop: "w3", temaNum: 0, exemplo: true,
  tema: "Borra de café: resíduo ou recurso?",
  integrantes: ["Aluna A", "Aluno B", "Aluna C"],
  nota: "Projeto fictício de demonstração. Os dados são inventados para mostrar como o sistema funciona. Explorem, gerem prompts e comparem com o projeto de vocês.",
  kit: {
    resumo: "Cafeterias e lanchonetes descartam quilos de borra de café por dia. Ela tem matéria orgânica e nutrientes, mas também cafeína e taninos, que em excesso atrapalham a germinação. Dá para transformar em substrato para mudas?",
    perguntasMotoras: [
      "Quanta borra de café é descartada perto da escola?",
      "Qual proporção de borra no substrato ajuda as mudas, e a partir de quanto atrapalha?",
      "Quem compraria um substrato feito com borra?"
    ],
    bio: ["Germinação e crescimento de plantas", "Decomposição por microrganismos", "Efeito alelopático (substâncias que inibem outras plantas)", "Nutrição vegetal"],
    qui: ["Cafeína e taninos", "Matéria orgânica e nitrogênio", "pH do substrato", "Compostagem da borra"],
    mat: ["Porcentagem de germinação", "Média e desvio padrão de repetições", "Proporção de mistura", "Custo, preço e ponto de equilíbrio"],
    sementes: ["Substrato para mudas", "Coleta de borra em cafeterias", "Kit de horta de mesa", "Oficina de hortas"],
    medicoes: ["% de germinação", "altura das mudas (cm)", "kg de borra por dia"],
    seguranca: ["Borra úmida mofa rápido: secar antes de guardar"],
    armadilhas: ["Borra fresca em excesso inibe a germinação: testar proporções"],
    conexoes: ""
  }
};

IV.EXEMPLO_ESTADO = {
  app: "incubadora-verde", versao: 1, grupo: "ex", atualizado: null, usoPrompts: [],
  respostas: {
    e1: {
      nome_equipe: "Equipe Coador",
      papeis: { "Aluna A": ["coord", "com"], "Aluno B": ["qui", "mat"], "Aluna C": ["bio"] },
      forcas: { sel: ["Fazer contas", "Fazer vídeos e posts", "Construir e montar coisas", "Vender e negociar"], outro: "" },
      combinados: "Vamos nos reunir toda terça no intervalo. Vamos conversar pelo grupo do WhatsApp. Se alguém não conseguir fazer a tarefa, avisa até quinta."
    },
    e2: {
      ja_sabemos: "Nós sabemos que a borra de café é lixo orgânico. Já ouvimos falar que algumas pessoas colocam borra nos vasos de plantas, mas não sabemos se faz bem ou mal.",
      duvidas: "Por que algumas pessoas dizem que a borra mata as plantas?\nQuanto de borra uma cafeteria joga fora por dia?\nQual a melhor quantidade de borra para misturar na terra?",
      fontes: { sel: ["Embrapa ou universidades", "Entrevista com alguém que entende do assunto", "Inteligência artificial (conferindo depois)"], outro: "" }
    },
    e3: {
      problema: "No nosso bairro, as duas cafeterias perto da escola jogam a borra de café no lixo comum, e isso causa mais lixo no aterro, onde a borra apodrece e solta gás metano.",
      onde: "No bairro",
      afetados: "Isso prejudica o ar (o metano esquenta o planeta) e o aterro, que enche mais rápido. As cafeterias também pagam para o lixo ser levado.",
      evidencias: "Conversamos com os gerentes das duas cafeterias e tiramos fotos dos sacos de borra no lixo.",
      tamanho: "Por dia são mais ou menos 3 kg em cada cafeteria. 3 kg × 2 cafeterias = 6 kg por dia. 6 kg × 26 dias = 156 kg por mês. Esse número veio da conversa com os gerentes.",
      pergunta: "Como podemos reaproveitar pelo menos 50 kg de borra por mês para fazer terra para mudas no nosso bairro?"
    },
    e4: {
      ideias_brutas: "Terra para mudas com borra\nVela com cheiro de café\nAdubo líquido\nKit de horta de mesa\nComposteira na escola",
      tipo_solucao: "Um produto (algo que se vende)",
      ideia: "Nossa ideia é vender terra para mudas misturada com borra de café seca, em sacos de 2 kg. Ela resolve o problema porque a borra deixa de ir para o lixo.",
      como_funciona: "1. Primeiro, pegamos a borra nas cafeterias duas vezes por semana\n2. Depois, secamos a borra no sol por 3 dias\n3. Em seguida, misturamos com terra na quantidade que testamos\n4. Por fim, colocamos nos sacos, etiquetamos e vendemos",
      publico: "Quem vai comprar são as famílias da escola que têm horta ou plantas em casa.",
      proposta_valor: "Elas comprariam porque é mais barato que a terra das lojas (R$ 12 a R$ 20). É melhor do que o que já existe porque é feito no bairro e testado por nós.",
      nome_negocio: "Borra Viva"
    },
    e7: {
      var_indep: "Vamos mudar a quantidade de borra na terra. As amostras vão ser: 0% (só terra), 25% de borra e 50% de borra.",
      grandezas: "Vamos medir quantas sementes nasceram, em porcentagem (%), e a altura das mudas em centímetros (cm).",
      var_ctrl: "Vai ficar igual: tipo de semente (alface), quantidade de água, lugar (janela da sala 12), tamanho da bandeja.",
      repeticoes: "3 vezes",
      plano_coleta: "Quem mede é o Aluno B. Vamos usar régua. Vamos contar as sementes no dia 7 e medir a altura no dia 21.",
      hipotese: "Nós achamos que com 25% de borra as mudas vão crescer mais, porque a borra tem nutrientes. Com 50%, achamos que menos sementes vão nascer, porque a borra tem cafeína.",
      ferramentas_mat: { sel: ["Porcentagem de germinação", "Média e desvio padrão de repetições", "Custo, preço e ponto de equilíbrio"], outro: "" }
    },
    e8: {
      prototipo: "Vamos montar 9 bandejas de mudas (3 de cada tipo de terra) e 3 sacos de terra com 25% de borra para 3 famílias testarem.",
      materiais: "9 bandejas de mudas\n180 sementes de alface\n3 kg de borra seca\nterra\nrégua\nfita crepe para etiquetas\nluvas",
      procedimento: "1. Secar a borra no sol por 3 dias\n2. Fazer as 3 misturas de terra\n3. Plantar 20 sementes em cada bandeja\n4. Regar todas igual, todo dia\n5. Contar as sementes que nasceram no dia 7\n6. Medir a altura no dia 21",
      seguranca: "Vamos usar luvas porque a borra úmida pode ter mofo. Não vamos guardar borra molhada. Vamos lavar as mãos depois.",
      supervisao: "Não tem nenhum risco"
    },
    e5: {
      conceitos_bio: { sel: ["Germinação e crescimento de plantas", "Efeito alelopático (substâncias que inibem outras plantas)"], outro: "" },
      seres_vivos: "Os seres vivos envolvidos são as sementes e mudas de alface, os micróbios que decompõem a borra e os fungos (mofo). O papel deles é crescer (alface) e decompor (micróbios).",
      processo_bio: "O que acontece é que a semente absorve água e começa a crescer (germinação). Isso acontece porque o embrião dentro da semente acorda. Mas a cafeína da borra pode atrapalhar esse processo.",
      saude: "Isso afeta o ambiente porque menos borra vai para o aterro e menos metano vai para o ar.",
      demo_bio: "Vamos mostrar as 3 bandejas lado a lado e fotos de cada semana."
    },
    e6: {
      conceitos_qui: { sel: ["Cafeína e taninos", "pH do substrato"], outro: "" },
      substancias: "As substâncias são borra de café (tem cafeína e matéria orgânica), terra, água.",
      tipo_transf: "As duas coisas",
      reacao: "Secar a borra: borra molhada → borra seca + vapor de água (física). Decompor: borra + oxigênio → gás carbônico + água + nutrientes (química).",
      riscos: "Nenhum material é perigoso porque só usamos borra, terra e água. O cuidado é secar bem a borra para não mofar.",
      demo_qui: "Vamos mostrar o teste de pH das misturas com suco de repolho roxo."
    },
    e9: {
      tabela: {
        cols: ["Amostra", "Sementes que nasceram (%)", "Altura no dia 21 (cm)"],
        rows: [
          ["0% R1", "85", "6,2"], ["0% R2", "80", "5,8"], ["0% R3", "90", "6,5"],
          ["25% R1", "80", "7,1"], ["25% R2", "85", "6,9"], ["25% R3", "75", "7,4"],
          ["50% R1", "45", "3,9"], ["50% R2", "50", "4,2"], ["50% R3", "40", "3,5"]
        ],
        graf: { col: 2, tipo: "barra" }
      },
      resultado: "A amostra que teve o melhor resultado foi a de 25%: altura média de 7,1 cm, contra 6,2 cm sem borra. Com 50%, só 45% das sementes nasceram, em média.",
      hipotese_ok: "Sim",
      limitacoes: "Pode ter atrapalhado a luz, que era diferente em cada lado da janela. Na próxima vez, faríamos 5 repetições.",
      observacoes: "Percebemos que na bandeja de 50% apareceu mofo branco na primeira semana."
    },
    e10: {
      financeiro: {
        unidade: "saco de 2 kg",
        fixos: [{ item: "Peneira e baldes", valor: "45" }, { item: "Carimbo e etiquetas", valor: "30" }],
        variaveis: [{ item: "Saco plástico", valor: "0,60" }, { item: "Terra", valor: "1,50" }, { item: "Etiqueta", valor: "0,40" }],
        preco: "8", meta: "40", impactoQtd: "1", impactoUnid: "kg de borra que não vai para o lixo"
      },
      impacto_esperado: "Cada unidade vendida evita que 1 kg de borra vá para o lixo. Vendendo a meta, são 40 kg de borra reaproveitada.",
      canais: { sel: ["Na feira da escola", "WhatsApp", "Em lojas parceiras"], outro: "" },
      parceiros: "Quem fornece o material são as duas cafeterias. Quem pode ajudar a vender é o avô do Aluno B, que produz mudas."
    },
    e11: {
      gancho: "Você sabia que as duas cafeterias aqui perto jogam fora mais de 150 kg de borra de café por mês?",
      demonstracao: "O visitante vai adivinhar qual bandeja cresceu mais. Depois vamos mostrar o gráfico com a resposta.",
      materiais_feira: { sel: ["Banner", "Protótipo", "Amostras do produto", "Gráfico impresso", "Tabela de preços"], outro: "" },
      divisao_fala: "Aluna A: a frase de abertura, o problema e o negócio. Aluna C: a Biologia e os resultados. Aluno B: a Química e as contas.",
      perguntas_temidas: "Por que vocês não fizeram mais repetições?\nA cafeína não faz mal para quem come a alface?"
    },
    e12: {
      aprend_bio: "Aprendemos que uma substância de uma planta pode atrapalhar outra planta de nascer (alelopatia).",
      aprend_qui: "Aprendemos que a mesma substância (cafeína) pode ajudar ou atrapalhar, dependendo da quantidade.",
      aprend_mat: "Aprendemos que a média sozinha engana. O desvio padrão mostra se as repetições deram parecido.",
      uso_ia: "Usamos a IA para entender alelopatia e para montar as contas. Discordamos da IA quando ela disse que a borra é muito ácida: medimos e o pH deu perto de neutro. Decidimos sozinhos usar 25% de borra, por causa do teste.",
      futuro: "Poderia continuar se as cafeterias continuarem dando a borra. Poderíamos vender na feira do bairro."
    }
  },
  diario: [
    { id: "d1", data: "2026-09-29", tipo: "Decisão", autor: "Aluna A", texto: "Escolhemos borra de café porque há duas cafeterias perto da escola." },
    { id: "d2", data: "2026-10-01", tipo: "Medição", autor: "Aluno B", texto: "Plantamos as 9 bandejas. Borra seca por 3 dias." },
    { id: "d3", data: "2026-10-08", tipo: "Descoberta", autor: "Aluna C", texto: "Germinação muito menor no tratamento de 50%." },
    { id: "d4", data: "2026-10-10", tipo: "Uso de IA", autor: "Aluno B", texto: "Pedimos a análise dos dados. A IA sugeriu gráfico de barras com desvio padrão. Conferimos as médias na calculadora." }
  ]
};
