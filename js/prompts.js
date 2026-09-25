/* =====================================================================
   INCUBADORA VERDE · prompts.js
   Monta prompts completos (para ChatGPT, Claude, Gemini, Copilot etc.)
   a partir das respostas do grupo.
   Estrutura de cada prompt:  PAPEL · CONTEXTO · TAREFA · FORMATO ·
   REGRAS · MODO · PEDIDO ESPECÍFICO
   ===================================================================== */
window.IV = window.IV || {};

IV.MODOS = [
  { id: "tutor", nome: "Tutor", resumo: "A IA ensina e faz perguntas. Não entrega pronto.",
    texto: "MODO TUTOR. Você é orientador, não autor. Não entregue respostas prontas nem textos finais. Explique os conceitos com exemplos do cotidiano, faça no máximo 3 perguntas por vez para nos fazer pensar e dê dicas graduais. Quando respondermos, corrija ou confirme e avance. Se pedirmos a resposta pronta, lembre que o projeto é nosso e ofereça uma pista maior." },
  { id: "orientador", nome: "Orientador", resumo: "A IA explica, dá opções e a equipe decide.",
    texto: "MODO ORIENTADOR. Explique o raciocínio, ofereça de 2 a 4 opções com prós e contras e deixe as decisões para nós. Pode dar exemplos completos, mas marque com [DECIDIR] o que a equipe precisa escolher e com [MEDIR] o que precisa ser medido por nós." },
  { id: "especialista", nome: "Especialista", resumo: "A IA entrega o material completo e detalhado.",
    texto: "MODO ESPECIALISTA. Entregue o conteúdo completo, detalhado e bem organizado. Mesmo assim, explique cada decisão para que possamos defendê-la diante da banca e liste no final tudo o que precisamos verificar, medir ou reescrever com nossas palavras." }
];

IV.FASES = [
  { id: "comeco", nome: "Começo" },
  { id: "ideia", nome: "Ideia e validação" },
  { id: "ciencia", nome: "Ciência" },
  { id: "prototipo", nome: "Protótipo e dados" },
  { id: "negocio", nome: "Negócio" },
  { id: "feira", nome: "Feira" },
  { id: "final", nome: "Revisão e documento final" }
];

/* ---------------------------------------------------------------------
   CONTEXTO
   --------------------------------------------------------------------- */
IV.contexto = function (grupo, estado, secoes, config) {
  var U = IV.util, w = IV.workshopPorId(grupo.workshop);
  var tudo = secoes.indexOf("tudo") >= 0;
  var L = [];
  var semanas = Math.max(0, Math.ceil(U.diasEntre(U.hojeISO(), config.feira) / 7));
  L.push("## Sobre nós");
  L.push("- Estudantes do 1º ano do Ensino Médio em " + IV.PROJETO.cidade + ".");
  L.push("- Projeto integrador de Química, Biologia e Matemática: cada grupo cria uma ideia de EMPREENDEDORISMO AMBIENTAL para apresentar em uma feira no fim do ano.");
  L.push("- Workshop " + w.numero + ": " + w.titulo);
  L.push("- Nosso tema: " + grupo.tema + " (" + grupo.rotulo + ")");
  L.push("- Equipe: " + grupo.integrantes.join(", ") + " (" + grupo.integrantes.length + " pessoa" + (grupo.integrantes.length > 1 ? "s" : "") + ")");
  L.push("- Hoje: " + U.dataBR(U.hojeISO()) + ". Feira: " + U.dataBR(config.feira) + " (cerca de " + semanas + " semana" + (semanas === 1 ? "" : "s") + " restantes).");

  if (tudo || secoes.indexOf("kit") >= 0) {
    var k = grupo.kit;
    L.push("");
    L.push("## Orientação do professor para o nosso tema");
    L.push(k.resumo);
    L.push("Perguntas motoras sugeridas:");
    k.perguntasMotoras.forEach(function (p) { L.push("- " + p); });
    L.push("Conceitos sugeridos de Biologia: " + k.bio.join("; ") + ".");
    L.push("Conceitos sugeridos de Química: " + k.qui.join("; ") + ".");
    L.push("Ferramentas sugeridas de Matemática: " + k.mat.join("; ") + ".");
    L.push("Cuidados de segurança indicados: " + k.seguranca.join("; ") + ".");
    L.push("Armadilhas comuns: " + k.armadilhas.join("; ") + ".");
    if (grupo.nota) L.push("Observação: " + grupo.nota);
  }

  var vazias = [];
  IV.ETAPAS.forEach(function (e) {
    if (!tudo && secoes.indexOf(e.id) < 0) return;
    var resp = (estado.respostas && estado.respostas[e.id]) || {};
    var blocos = [];
    e.perguntas.forEach(function (p) {
      var t = U.texto(p, resp[p.id], grupo);
      if (!t) return;
      if (t.indexOf("\n") >= 0 || p.tipo === "lista" || p.tipo === "multipla" || p.tipo === "kit") blocos.push("**" + p.rotulo + ":**\n" + t);
      else blocos.push("**" + p.rotulo + ":** " + t);
    });
    if (blocos.length) {
      L.push("");
      L.push("## Missão " + e.num + ": " + e.titulo);
      L.push(blocos.join("\n\n"));
    } else vazias.push("Missão " + e.num + " (" + e.titulo + ")");
  });

  if ((tudo || secoes.indexOf("diario") >= 0) && estado.diario && estado.diario.length) {
    L.push("");
    L.push("## Diário de bordo (registros mais recentes)");
    estado.diario.slice(-12).forEach(function (d) { L.push("- " + U.dataBR(d.data) + " [" + d.tipo + "] " + d.texto); });
  }
  if (secoes.indexOf("progresso") >= 0 || tudo) {
    L.push("");
    L.push("## Andamento");
    var sem = U.semanaAtual(config);
    var cr = IV.CRONOGRAMA.find(function (c) { return c.semana === sem; });
    L.push("- Semana atual do projeto: " + (sem === 0 ? "ainda não começou" : sem > IV.CRONOGRAMA.length ? "prazo encerrado" : sem + " de " + IV.CRONOGRAMA.length + (cr ? " (foco: " + cr.foco + "; entrega: " + cr.entrega + ")" : "")));
    IV.ETAPAS.forEach(function (e) { var p = U.progressoEtapa(estado, e); L.push("- Missão " + e.num + " " + e.titulo + ": " + p.pct + "% das perguntas obrigatórias"); });
  }
  if (vazias.length) {
    L.push("");
    L.push("Ainda não preenchemos: " + vazias.join(", ") + ".");
  }
  return L.join("\n");
};

IV.REGRAS = [
  "Público: somos adolescentes de 15 e 16 anos e muitos de nós têm dificuldade com leitura e com as matérias. Use frases curtas, palavras simples e exemplos do dia a dia. Quando usar uma palavra técnica, explique entre parênteses logo em seguida.",
  "Tamanho: no máximo 250 palavras por mensagem. Se a tarefa for grande, divida em partes numeradas, mande SÓ a Parte 1 e termine com: \"Escrevam CONTINUAR para ver a próxima parte.\" Nunca mande tudo de uma vez.",
  "Integração: conecte Biologia, Química e Matemática sempre que fizer sentido, sem forçar conexões artificiais.",
  "Números: mostre as contas passo a passo, com unidades. Separe sempre DADO NOSSO (medido por nós), DADO DE FONTE (com referência) e ESTIMATIVA (com as premissas escritas).",
  "Honestidade: não invente dados, estatísticas, leis, empresas, pessoas nem referências bibliográficas. Quando não tiver certeza, escreva [VERIFICAR] e diga onde podemos confirmar (ex.: IBGE, Embrapa, ABREMA, IAT, Sanepar, CIBiogás, Prefeitura de Foz do Iguaçu, SciELO).",
  "Segurança: procedimentos com soda cáustica, fogo, calor, gases inflamáveis, ferramentas de corte, vidro, água ou solo possivelmente contaminados só podem ser feitos com supervisão direta do professor. Indique essas etapas com [SÓ COM O PROFESSOR] e proponha sempre uma alternativa mais segura em escala escolar. Nunca sugira ingerir, cheirar diretamente ou testar produtos na pele.",
  "Contexto local: estamos em Foz do Iguaçu (PR), na tríplice fronteira, perto dos rios Paraná e Iguaçu e da Itaipu. Use exemplos locais apenas quando forem reais.",
  "Viabilidade: tudo precisa caber no prazo até a feira, com baixo custo e materiais acessíveis a estudantes.",
  "Fechamento: no fim da última parte, escreva \"O que fazer agora\" com até 3 ações curtas (cada uma com a parte responsável: Coordenação, Biologia, Química, Matemática ou Comunicação) e 1 ou 2 perguntas para a equipe pensar."
];

/* ---------------------------------------------------------------------
   CATÁLOGO DE PROMPTS
   Cada "tarefa" recebe (grupo, estado, config) e devolve texto.
   --------------------------------------------------------------------- */
function _r(estado, etapa, pergunta) {
  var e = IV.etapaPorId(etapa), p = e.perguntas.find(function (x) { return x.id === pergunta; });
  var v = estado.respostas && estado.respostas[etapa] && estado.respostas[etapa][pergunta];
  return IV.util.texto(p, v) || "";
}
function _rubricaTexto() {
  return IV.RUBRICA.map(function (r) { return "- " + r.criterio + " (peso " + String(r.peso).replace(".", ",") + "): " + r.descricao; }).join("\n");
}

IV.PROMPTS = [
  /* ============================ COMEÇO ============================ */
  {
    id: "p_mapa", fase: "comeco", titulo: "Explica o nosso tema de um jeito fácil", disc: ["bio", "qui", "mat"],
    descricao: "Explicação simples do tema, com exemplos e palavras difíceis explicadas.",
    usa: ["kit", "e2"], requer: [],
    papel: "Você é um professor experiente de Biologia, Química e Matemática do Ensino Médio, especialista em educação ambiental e em projetos investigativos.",
    tarefa: function (g) {
      return [
        "Queremos entender bem o nosso tema, \"" + g.tema + "\", antes de pensar em ideias de negócio.",
        "1. Explique o tema em três níveis: (a) para uma criança de 10 anos, em até 3 frases; (b) para nós, do 1º ano, em até 2 parágrafos; (c) como um cientista explicaria, em 1 parágrafo, com os termos técnicos explicados entre parênteses.",
        "2. Monte uma tabela com 3 colunas (Biologia explica | Química explica | Matemática mede ou calcula) e pelo menos 5 linhas, mostrando como cada disciplina enxerga o tema.",
        "3. Crie um glossário com 12 termos essenciais: termo, definição curta e um exemplo do cotidiano.",
        "4. Liste 5 mitos ou erros comuns sobre o tema e o que a ciência realmente diz.",
        "5. Mostre conexões reais com Foz do Iguaçu e o Oeste do Paraná (marque [VERIFICAR] no que não tiver certeza).",
        "6. Sugira 5 perguntas investigáveis em poucas semanas, com materiais simples, que poderiam virar um negócio ambiental.",
        "7. Se já preenchemos a Missão 2, comente o que já sabemos: o que está correto, o que está incompleto e o que está errado."
      ].join("\n");
    },
    formato: "Use títulos numerados iguais aos itens da tarefa. Tabelas em formato de tabela. Texto corrido curto."
  },
  {
    id: "p_pesquisa", fase: "comeco", titulo: "Ajuda a responder nossas perguntas", disc: ["bio", "qui", "mat"],
    descricao: "Respostas iniciais para as perguntas da Missão 2 e onde confirmar cada uma.",
    usa: ["kit", "e1", "e2"], requer: ["e2"],
    papel: "Você é bibliotecário escolar e orientador de iniciação científica, especialista em ensinar adolescentes a pesquisar com fontes confiáveis.",
    tarefa: function (g, est) {
      return [
        "Estas são as nossas perguntas:",
        _r(est, "e2", "duvidas") || "(ainda não escrevemos; sugira 5 com base no tema)",
        "",
        "Para CADA pergunta:",
        "a) uma resposta inicial curta, em nível de Ensino Médio, marcando [VERIFICAR] o que precisa ser confirmado;",
        "b) o que exatamente precisamos pesquisar para responder bem;",
        "c) 3 combinações de palavras-chave para buscar em português (e 1 em inglês);",
        "d) o tipo de fonte mais confiável para ela (órgão oficial, artigo científico, livro didático, especialista local) e um exemplo de instituição;",
        "e) se dá para responder com um experimento ou medição nossa, diga qual.",
        "",
        "Depois:",
        "1. Uma checklist de 6 itens para avaliar se uma fonte na internet é confiável.",
        "2. Uma divisão da pesquisa entre os papéis da equipe (Coordenação, Biologia, Química, Matemática, Comunicação).",
        "3. Um modelo de fichamento (ficha de leitura) com campos para preenchermos a cada fonte lida, incluindo a referência no formato ABNT."
      ].join("\n");
    },
    formato: "Uma seção por pergunta, com os itens a) a e). Depois as três seções finais."
  },
  {
    id: "p_problema", fase: "comeco", titulo: "O nosso problema está bom?", disc: ["bio", "qui"],
    descricao: "Diz se o problema está claro e dá para medir, e como melhorar a frase.",
    usa: ["kit", "e3"], requer: ["e3"],
    papel: "Você é um orientador de projetos científicos e de negócios de impacto, rigoroso e encorajador.",
    tarefa: function () {
      return [
        "Analise o problema descrito na nossa Missão 3.",
        "1. Dê uma nota de 0 a 2 para cada critério, com justificativa de uma frase: real (existe de fato), local (acontece em um lugar concreto), mensurável (dá para medir), relevante (importa para alguém), solucionável em escala escolar, conectado às três disciplinas. Some a nota (máximo 12).",
        "2. Reescreva o nosso problema em 3 versões melhores, cada uma com um foco diferente.",
        "3. Avalie a pergunta de investigação usando o critério SMART (específica, mensurável, alcançável, relevante, com prazo) e proponha 2 versões melhoradas.",
        "4. Monte uma árvore de problemas em texto: causas (raízes) → problema (tronco) → consequências (galhos), marcando quais causas estão ao nosso alcance.",
        "5. Diga que evidências estão faltando e como conseguir cada uma em uma semana: observação, medição, entrevista ou dado oficial. Seja concreto (quem, onde, como).",
        "6. Explique a parte biológica e a parte química das consequências do problema.",
        "7. Diga qual estimativa numérica do tamanho do problema podemos fazer agora e mostre a conta."
      ].join("\n");
    },
    formato: "Seções numeradas. A nota do item 1 em tabela."
  },

  /* ======================= IDEIA E VALIDAÇÃO ====================== */
  {
    id: "p_ideias", fase: "ideia", titulo: "Dá ideias de negócio para o nosso tema", disc: ["neg", "mat"],
    descricao: "12 ideias de produto ou serviço e uma tabela para ajudar a escolher.",
    usa: ["kit", "e1", "e3", "e4"], requer: ["e3"],
    papel: "Você é um mentor de empreendedorismo socioambiental que trabalha com incubadoras de startups de estudantes.",
    tarefa: function (g) {
      return [
        "Queremos ideias de empreendedorismo ambiental que resolvam o nosso problema e usem Biologia, Química e Matemática de verdade.",
        "Pontos de partida sugeridos pelo professor (não são obrigatórios): " + g.kit.sementes.join("; ") + ".",
        "",
        "1. Gere 12 ideias diferentes: 3 produtos, 3 serviços, 2 soluções com tecnologia simples, 2 kits ou ações educativas e 2 negócios sociais. Para cada uma: nome provisório; como funciona (2 frases); cliente (quem paga); beneficiário (quem ganha com o impacto); uso de Biologia, de Química e de Matemática (1 linha cada); custo inicial (baixo, médio ou alto); o que dá para mostrar na feira.",
        "2. Considere as forças e os recursos da nossa equipe (Missão 1). Diga quais ideias combinam mais com a gente e por quê.",
        "3. Avalie também as ideias da nossa chuva de ideias (Missão 4), se houver, com a mesma sinceridade.",
        "4. Monte uma matriz de decisão com os critérios e pesos: impacto ambiental (peso 3), viabilidade até a feira (peso 3), uso real das três disciplinas (peso 2), custo baixo (peso 1), originalidade (peso 1). Dê notas de 1 a 5, mostre a fórmula da pontuação ponderada (soma de nota × peso) e calcule a pontuação de cada ideia.",
        "5. Apresente o ranking das 3 melhores com o principal risco de cada uma.",
        "6. Explique como poderíamos mudar os pesos se tivermos outras prioridades. A escolha final é nossa."
      ].join("\n");
    },
    formato: "Ideias em lista numerada. Matriz de decisão em tabela com a pontuação final calculada."
  },
  {
    id: "p_valida", fase: "ideia", titulo: "Critica a nossa ideia com sinceridade", disc: ["neg"],
    descricao: "Mostra os pontos fracos da ideia e testes simples para ver se ela funciona.",
    usa: ["e3", "e4", "e10"], requer: ["e4"],
    papel: "Você é um investidor exigente de negócios de impacto e faz o papel de advogado do diabo, com respeito e franqueza.",
    tarefa: function () {
      return [
        "Critique a nossa ideia (Missão 4) para torná-la mais forte.",
        "1. Liste as 8 suposições que precisam ser verdadeiras para a ideia funcionar (ex.: \"as pessoas vão guardar o óleo usado\"). Classifique cada uma como risco alto, médio ou baixo.",
        "2. Para as 3 suposições mais arriscadas, proponha um teste barato que caiba em uma semana (entrevista, pré-venda, protótipo de papel, teste com 5 pessoas), com um critério de sucesso numérico. Ex.: \"se 6 de 10 entrevistados disserem que comprariam por R$ 5\".",
        "3. Escreva as 5 objeções mais prováveis de um cliente e como responderíamos.",
        "4. Compare com o que já existe (concorrentes ou alternativas) e diga se o nosso diferencial é convincente.",
        "5. Aponte problemas legais ou sanitários que possam existir (ex.: venda de produtos de limpeza, alimentos, cosméticos) e como contornar em uma feira escolar.",
        "6. Dê um veredito: seguir, ajustar ou mudar de ideia, com justificativa."
      ].join("\n");
    },
    formato: "Tabela para as suposições. Demais itens em seções curtas."
  },
  {
    id: "p_entrevista", fase: "ideia", titulo: "Cria perguntas para entrevistar pessoas", disc: ["mat", "neg"],
    descricao: "Perguntas prontas para conversar com clientes ou pessoas afetadas.",
    usa: ["e3", "e4"], requer: ["e3"],
    papel: "Você é pesquisador de mercado e estatístico, com experiência em pesquisas feitas por estudantes.",
    tarefa: function () {
      return [
        "Queremos ouvir pessoas reais para confirmar o problema e testar a ideia.",
        "1. Um roteiro de entrevista com 8 a 10 perguntas abertas, sem induzir a resposta, para potenciais clientes ou pessoas afetadas. Explique o objetivo de cada pergunta.",
        "2. Um questionário fechado de 10 a 12 perguntas para Google Forms, com tipos de resposta (múltipla escolha, escala de 1 a 5, sim/não). Inclua 1 pergunta de disposição a pagar com faixas de preço.",
        "3. Quantas pessoas entrevistar de forma viável para nós e como escolhê-las para reduzir o viés. Explique a diferença entre amostra de conveniência e aleatória.",
        "4. Um modelo de planilha para tabular as respostas e as fórmulas de porcentagem.",
        "5. Que gráficos fazer com cada pergunta.",
        "6. Erros comuns (perguntas indutoras, duplas, vagas) com exemplos de pergunta ruim e pergunta boa.",
        "7. Cuidados éticos: consentimento, anonimato, nenhuma pergunta sobre dados pessoais sensíveis."
      ].join("\n");
    },
    formato: "Perguntas numeradas prontas para copiar. Planilha em tabela."
  },

  /* ============================ CIÊNCIA =========================== */
  {
    id: "p_bio", fase: "ciencia", titulo: "Explica a Biologia do projeto", disc: ["bio"],
    descricao: "Explica os seres vivos e processos do tema e corrige a Missão 7.",
    usa: ["kit", "e2", "e3", "e4", "e5"], requer: ["e5"],
    papel: "Você é professor de Biologia do Ensino Médio e pesquisador em ecologia e microbiologia ambiental.",
    tarefa: function () {
      return [
        "Queremos dominar a Biologia do nosso projeto.",
        "1. Explique com profundidade de Ensino Médio o processo biológico central do projeto: etapas, seres vivos envolvidos e o papel de cada um.",
        "2. Leia nossas respostas da Missão 7 e aponte, com gentileza e precisão, o que está correto, o que está incompleto e o que está errado, mostrando a forma correta.",
        "3. Relacione o projeto com os conteúdos de Biologia do Ensino Médio (ecologia, citologia, microbiologia, fisiologia, saúde) e com a área de Ciências da Natureza da BNCC, de modo geral.",
        "4. Proponha 2 experimentos biológicos simples, seguros e possíveis até a feira: materiais, procedimento, o que medir, grupo controle e resultado esperado.",
        "5. Descreva em texto um esquema ou diagrama (ciclo, cadeia alimentar, etapas) que possamos desenhar no banner, com as legendas.",
        "6. Escreva 6 perguntas que um jurado de Biologia faria, com respostas-modelo curtas.",
        "7. Indique onde aprofundar: apenas fontes que existem de verdade; o que não tiver certeza, marque [VERIFICAR]."
      ].join("\n");
    },
    formato: "Seções numeradas. Perguntas de banca em formato P: / R:."
  },
  {
    id: "p_qui", fase: "ciencia", titulo: "Explica a Química do projeto", disc: ["qui"],
    descricao: "Explica substâncias, transformações e cuidados, e corrige a Missão 8.",
    usa: ["kit", "e3", "e4", "e6", "e8"], requer: ["e6"],
    papel: "Você é professor de Química do Ensino Médio e técnico de laboratório com grande preocupação com segurança.",
    tarefa: function () {
      return [
        "Queremos dominar a Química do nosso projeto.",
        "1. Tabela das substâncias e materiais envolvidos: nome comum, nome químico, fórmula (quando houver uma fórmula definida), função no projeto e principal perigo.",
        "2. Para cada transformação: equação em palavras; equação química balanceada ou fórmula geral (quando for o caso); tipo de transformação ou reação; explicação no nível das moléculas, com uma analogia do cotidiano.",
        "3. Explique as propriedades importantes para o projeto (pH, densidade, solubilidade, polaridade, temperatura etc.) e como medir cada uma na escola com materiais simples (ex.: indicador de repolho roxo, fita de pH, termômetro, proveta).",
        "4. Segurança: tabela risco | como prevenir | o que fazer se acontecer | quem pode executar. Marque com [SÓ COM O PROFESSOR] o que não podemos fazer sozinhos e proponha uma versão mais segura para a demonstração na feira.",
        "5. Leia a nossa Missão 8 e corrija conceitos errados ou imprecisos.",
        "6. Mostre como a Química se liga à Biologia (efeitos nos seres vivos) e à Matemática (proporção, concentração, estequiometria, rendimento), com um cálculo de exemplo.",
        "7. Escreva 6 perguntas que um jurado de Química faria, com respostas-modelo curtas.",
        "Importante: quantidades de reagentes perigosos devem vir acompanhadas do aviso de que precisam ser conferidas pelo professor antes de qualquer uso."
      ].join("\n");
    },
    formato: "Tabelas nos itens 1 e 4. Equações em linha própria. Perguntas de banca em formato P: / R:."
  },
  {
    id: "p_mat", fase: "ciencia", titulo: "Explica as contas do projeto", disc: ["mat"],
    descricao: "Mostra quais contas fazer, com exemplo passo a passo usando os números de vocês.",
    usa: ["e3", "e4", "e7", "e9"], requer: ["e7"],
    papel: "Você é professor de Matemática do Ensino Médio, especialista em modelagem matemática e estatística aplicada a problemas reais.",
    tarefa: function () {
      return [
        "Queremos que a Matemática do projeto seja forte, correta e baseada nos nossos dados.",
        "1. Modelagem: transforme a nossa pergunta de investigação em variáveis (com unidades) e em uma ou mais fórmulas. Explique o significado de cada símbolo.",
        "2. Resolva um exemplo numérico completo usando os nossos números (ou estimativas, marcadas como tal), passo a passo e com unidades em todas as linhas.",
        "3. Estimativa de Fermi do impacto em três escalas: escola, bairro e cidade de Foz do Iguaçu (a população deve vir de fonte oficial; marque [VERIFICAR]). Escreva as premissas e calcule um cenário mínimo e um máximo.",
        "4. Revise o nosso plano de coleta (Missão 5): tamanho da amostra, frequência, instrumento, erros de medida. Sugira uma tabela de registro com cabeçalho e unidades.",
        "5. Qual gráfico usar e por quê; como deixá-lo honesto (eixo das barras começando em zero, unidades, título, fonte dos dados).",
        "6. Liste os conteúdos de Matemática do Ensino Médio que o projeto usa.",
        "7. Crie 4 exercícios curtos usando os dados do nosso projeto, do mais fácil ao mais difícil, para a equipe treinar. Coloque o gabarito comentado no final."
      ].join("\n");
    },
    formato: "Contas em linhas separadas, uma operação por linha. Exercícios numerados e gabarito em seção separada."
  },
  {
    id: "p_integra", fase: "ciencia", titulo: "Junta Biologia, Química e Matemática", disc: ["bio", "qui", "mat"],
    descricao: "Mostra como as três matérias se ligam no projeto.",
    usa: ["kit", "e3", "e4", "e5", "e6", "e7"], requer: ["e5", "e6", "e7"],
    papel: "Você é coordenador pedagógico especialista em projetos interdisciplinares de Ciências da Natureza e Matemática.",
    tarefa: function () {
      return [
        "Queremos que as três disciplinas apareçam integradas, e não como três trabalhos separados.",
        "1. Escreva o \"fio condutor\" do projeto em 5 passos: problema → o que a Biologia explica → o que a Química explica → o que a Matemática mede e calcula → como a solução usa tudo isso.",
        "2. Mostre uma mesma situação concreta do projeto vista pelas três disciplinas ao mesmo tempo (ex.: \"quando o óleo chega ao rio...\").",
        "3. Escreva uma fundamentação teórica integrada de 4 a 6 parágrafos em nível de Ensino Médio, que sirva de base para o nosso relatório. Vamos reescrever com as nossas palavras.",
        "4. Diagnóstico: qual disciplina está mais fraca no nosso projeto hoje? Dê 3 formas concretas de fortalecê-la até a feira.",
        "5. Tabela de conteúdos curriculares mobilizados por disciplina.",
        "6. Um mapa conceitual em texto (conceito → relação → conceito) com pelo menos 12 ligações, que possamos desenhar."
      ].join("\n");
    },
    formato: "Seções numeradas. Mapa conceitual como lista de ligações."
  },

  /* ======================= PROTÓTIPO E DADOS ====================== */
  {
    id: "p_experimento", fase: "prototipo", titulo: "Revisa o nosso teste (com segurança)", disc: ["qui", "bio", "mat"],
    descricao: "Confere se o teste é justo e seguro e monta a tabela de anotações.",
    usa: ["kit", "e5", "e6", "e7", "e8"], requer: ["e8"],
    papel: "Você é professor de Ciências com experiência em feiras de ciências e em segurança de laboratório escolar.",
    tarefa: function (g, est, cfg) {
      var dias = IV.util.diasEntre(IV.util.hojeISO(), cfg.feira);
      return [
        "Queremos um experimento bem feito, seguro e que termine antes da feira (faltam cerca de " + Math.max(0, dias) + " dias).",
        "1. Revise a nossa hipótese e as variáveis (independente, dependente, controladas). Reescreva se necessário.",
        "2. Desenho experimental: grupo controle, tratamentos, número de repetições (no mínimo 3) e duração compatível com o prazo.",
        "3. Lista de materiais com quantidades e custo aproximado; priorize materiais reaproveitados ou baratos.",
        "4. Procedimento numerado, com o que cada pessoa faz.",
        "5. Plano de segurança específico: equipamentos de proteção, etapas [SÓ COM O PROFESSOR], descarte correto dos resíduos do próprio experimento.",
        "6. Tabela de registro pronta (cabeçalho com unidades) e calendário das medições dia a dia.",
        "7. O que pode dar errado e o plano B para cada caso.",
        "8. Como analisar os resultados (que médias, que gráfico) e como mostrar o experimento na feira de forma segura."
      ].join("\n");
    },
    formato: "Seções numeradas. Tabela de registro em formato de tabela. Calendário em lista por data."
  },
  {
    id: "p_prototipo", fase: "prototipo", titulo: "Ajuda a montar o protótipo", disc: ["neg", "mat"],
    descricao: "Plano simples para construir a primeira versão e testar com pessoas.",
    usa: ["e4", "e8", "e10"], requer: ["e8"],
    papel: "Você é designer de produto e maker, especialista em prototipagem rápida com materiais reaproveitados.",
    tarefa: function () {
      return [
        "Queremos construir o protótipo em etapas, sem gastar muito.",
        "1. Defina o MVP (produto mínimo viável): o que entra e o que fica de fora, e por quê.",
        "2. Planeje 3 versões: v0 (papel, maquete ou simulação, feita em 1 aula), v1 (funciona de forma simples), v2 (versão para a feira). Para cada uma: materiais, custo, tempo e o que queremos aprender com ela.",
        "3. Se o protótipo tiver medidas, calcule dimensões, áreas, volumes ou quantidades de material, mostrando as contas.",
        "4. Divida a montagem por papel da equipe.",
        "5. Plano de teste com 5 pessoas reais: tarefas que elas farão, perguntas, e uma métrica de sucesso numérica.",
        "6. Como decidir o que melhorar entre uma versão e outra.",
        "7. Como documentar (fotos, vídeo curto, registros no diário) para mostrar a evolução na feira."
      ].join("\n");
    },
    formato: "Seções numeradas. As 3 versões em tabela."
  },
  {
    id: "p_analise", fase: "prototipo", titulo: "Explica os nossos resultados", disc: ["mat", "bio", "qui"],
    descricao: "Lê a tabela da Missão 9 e explica o que os números mostram.",
    usa: ["e3", "e7", "e8", "e9"], requer: ["e9"],
    papel: "Você é estatístico e cientista de dados que ensina adolescentes a interpretar resultados de experimentos com honestidade.",
    tarefa: function () {
      return [
        "Os dados da Missão 9 foram medidos por nós. As estatísticas já foram calculadas pelo sistema.",
        "1. Confira as estatísticas e explique em linguagem simples o que cada uma significa no nosso caso (média, mediana, amplitude, desvio padrão, coeficiente de variação).",
        "2. Interprete os dados: padrões, diferenças entre grupos, valores fora do padrão e possíveis explicações biológicas e químicas.",
        "3. A hipótese é sustentada? Com que grau de confiança, considerando o número de medições? Seja honesto.",
        "4. Sugira 2 gráficos (tipo, eixo x, eixo y, título, legenda) e explique como montá-los no Google Planilhas.",
        "5. Fontes de erro e como reduzi-las na próxima coleta.",
        "6. Tabela com duas colunas: \"Os dados permitem afirmar\" e \"Os dados NÃO permitem afirmar\".",
        "7. Um exemplo de texto de resultados e discussão (2 parágrafos) para nos inspirar.",
        "8. Que dados coletar a seguir para fortalecer a conclusão.",
        "Não invente valores que não estão na tabela."
      ].join("\n");
    },
    formato: "Seções numeradas. Item 6 em tabela."
  },
  {
    id: "p_planilha", fase: "prototipo", titulo: "Monta uma planilha para as contas", disc: ["mat"],
    descricao: "Planilha com fórmulas prontas para Google Planilhas ou Excel.",
    usa: ["e7", "e9", "e10"], requer: ["e7"],
    papel: "Você é professor de Matemática especialista em planilhas eletrônicas.",
    tarefa: function () {
      return [
        "Queremos uma planilha que faça os cálculos do projeto automaticamente.",
        "1. Estrutura com abas: Dados, Cálculos, Finanças, Impacto e Gráficos. Para cada aba: colunas (com unidades), 3 linhas de exemplo usando os nossos dados quando existirem.",
        "2. Fórmulas exatas para Google Planilhas em português (MÉDIA, MED, DESVPAD, SOMA, SE, ARRED, ARREDONDAR.PARA.CIMA) e o equivalente no Excel. Indique em qual célula cada fórmula vai.",
        "3. Na aba Finanças: custo fixo total, custo variável unitário, margem de contribuição, ponto de equilíbrio e lucro para diferentes quantidades vendidas.",
        "4. Na aba Impacto: impacto por unidade e impacto acumulado.",
        "5. Que gráficos criar e com quais intervalos de células.",
        "6. Explique cada fórmula em linguagem simples, para que qualquer pessoa da equipe consiga refazer."
      ].join("\n");
    },
    formato: "Uma seção por aba, com tabela de colunas e bloco de fórmulas."
  },

  /* ============================ NEGÓCIO =========================== */
  {
    id: "p_canvas", fase: "negocio", titulo: "Organiza o nosso negócio", disc: ["neg"],
    descricao: "Organiza o negócio em 9 quadros: cliente, venda, custos, parceiros...",
    usa: ["e3", "e4", "e10"], requer: ["e4"],
    papel: "Você é consultor de negócios de impacto socioambiental e usa o Business Model Canvas com estudantes.",
    tarefa: function () {
      return [
        "1. Preencha os 9 blocos do Business Model Canvas: segmentos de clientes, proposta de valor, canais, relacionamento, fontes de receita, recursos-chave, atividades-chave, parcerias-chave e estrutura de custos. Marque [NOSSO] o que veio das nossas respostas e [SUGESTÃO] o que você acrescentou.",
        "2. Acrescente o bloco de impacto: problema ambiental, beneficiários, métricas de impacto e como medir.",
        "3. Analise a coerência entre os blocos (ex.: o canal chega mesmo a esse cliente? a receita cobre os custos?).",
        "4. Escreva a frase-síntese: \"Nós ajudamos [cliente] a [resolver o problema] por meio de [solução], gerando [impacto ambiental mensurável].\" Proponha 3 versões.",
        "5. Três perguntas críticas que ainda precisamos responder sobre o negócio."
      ].join("\n");
    },
    formato: "Canvas em tabela (bloco | conteúdo | origem). Demais itens em seções curtas."
  },
  {
    id: "p_financas", fase: "negocio", titulo: "Confere preço, gastos e lucro", disc: ["mat", "neg"],
    descricao: "Confere as contas da Missão 10 e explica o ponto de equilíbrio.",
    usa: ["e4", "e10"], requer: ["e10"],
    papel: "Você é professor de Matemática Financeira e consultor de pequenos negócios.",
    tarefa: function () {
      return [
        "Os números da calculadora do negócio estão na Missão 10.",
        "1. Confira todos os cálculos (custo fixo total, custo variável unitário, margem de contribuição, ponto de equilíbrio, resultado na meta), mostrando as fórmulas.",
        "2. Liste custos que provavelmente esquecemos (embalagem, transporte, perdas, divulgação, taxas) com valores estimados em reais [VERIFICAR].",
        "3. Monte 3 cenários (pessimista, realista, otimista) em tabela, com as premissas de cada um e o resultado.",
        "4. Compare 3 estratégias de preço (custo mais margem, valor percebido pelo cliente, preço da concorrência). Recomende uma, com justificativa. A decisão final é nossa.",
        "5. Explique o ponto de equilíbrio como o encontro de duas funções afins: receita R(q) = P · q e custo C(q) = CF + CV · q. Mostre a conta para achar q, descreva como fica o gráfico e crie uma tabela de q = 0 até o dobro do ponto de equilíbrio.",
        "6. Como conseguir o dinheiro inicial (pré-venda, patrocínio de comércio local, vaquinha, parceria) e quanto precisamos.",
        "7. Como apresentar estes números na feira de forma clara em 30 segundos."
      ].join("\n");
    },
    formato: "Contas em linhas separadas. Cenários e tabela de q em formato de tabela."
  },
  {
    id: "p_impacto", fase: "negocio", titulo: "Calcula o bem que fazemos ao ambiente", disc: ["mat", "bio", "qui"],
    descricao: "Transforma o impacto do projeto em números, sem exagero.",
    usa: ["e3", "e4", "e9", "e10"], requer: ["e4"],
    papel: "Você é analista de impacto ambiental e combate afirmações exageradas (greenwashing).",
    tarefa: function () {
      return [
        "1. Proponha de 3 a 5 indicadores de impacto para o nosso projeto (nome, unidade, como medir, com que frequência).",
        "2. Calcule o impacto por unidade vendida ou por pessoa atendida e o impacto na nossa meta, com premissas escritas.",
        "3. Projete para 1 mês, 1 ano e para o caso de 10 escolas de Foz do Iguaçu adotarem a ideia. Mostre as contas.",
        "4. Dê uma faixa (mínimo e máximo) em vez de um número único quando houver incerteza.",
        "5. Traduza os resultados em comparações fáceis de entender, sem exagerar.",
        "6. Qualquer fator de conversão (ex.: kg de CO₂ equivalente por kg de resíduo) precisa ter fonte; se não tiver certeza, marque [VERIFICAR] e diga onde procurar.",
        "7. Liste as afirmações que NÃO podemos fazer (seriam exageradas ou sem prova) e como falar a mesma coisa de forma honesta."
      ].join("\n");
    },
    formato: "Indicadores em tabela. Contas em linhas separadas."
  },
  {
    id: "p_marca", fase: "negocio", titulo: "Cria nome, slogan e logo", disc: ["com"],
    descricao: "Sugestões de nome, frase, cores e posts para o negócio.",
    usa: ["e4", "e10", "e11"], requer: ["e4"],
    papel: "Você é designer de marcas para pequenos negócios sustentáveis.",
    tarefa: function () {
      return [
        "1. Sugira 10 nomes curtos e fáceis de lembrar, ligados ao impacto do projeto, com a ideia por trás de cada um. Diga como verificarmos se o nome já existe (busca no Instagram, no Google e no INPI).",
        "2. Crie 5 slogans.",
        "3. Proponha uma paleta de 4 cores com códigos HEX e a justificativa de cada cor.",
        "4. Descreva 3 conceitos de logo, simples o bastante para desenharmos à mão ou no Canva.",
        "5. Defina o tom de voz da marca, com exemplos de frases que usamos e frases que evitamos.",
        "6. Escreva 3 posts para Instagram (texto e ideia de imagem) para divulgar o projeto antes da feira.",
        "7. Se for produto físico, escreva o texto do rótulo ou etiqueta: nome, o que é, modo de uso, advertências de segurança (obrigatórias em produtos de limpeza), origem sustentável e contato."
      ].join("\n");
    },
    formato: "Seções numeradas, listas curtas."
  },

  /* ============================= FEIRA ============================ */
  {
    id: "p_pitch", fase: "feira", titulo: "Escreve a nossa apresentação de 3 minutos", disc: ["com"],
    descricao: "Texto da fala na feira, dividido entre os integrantes.",
    usa: ["e1", "e3", "e4", "e5", "e6", "e7", "e9", "e10", "e11"], requer: ["e4", "e11"],
    papel: "Você é treinador de apresentações e de pitch para feiras de ciências e competições de empreendedorismo jovem.",
    tarefa: function (g) {
      return [
        "Escreva o roteiro do nosso pitch de 3 minutos (cerca de 400 palavras faladas).",
        "1. Blocos com tempo: gancho (20 s), problema com um dado nosso (30 s), solução (30 s), ciência: Biologia, Química e Matemática (50 s), resultados (20 s), negócio (20 s), impacto e chamada final (10 s).",
        "2. Divida as falas entre " + g.integrantes.join(", ") + ", respeitando a nossa divisão de fala (Missão 11) se houver.",
        "3. Linguagem falada, frases curtas, sem ler slide. Indique entre colchetes o que mostrar em cada momento (protótipo, gráfico, amostra).",
        "4. Escreva também uma versão de 30 segundos e uma de 1 minuto.",
        "5. Diga como adaptar o pitch para 3 públicos: uma criança, um adulto que não entende do assunto e um jurado especialista.",
        "6. Dicas de postura, voz e de como lidar com o nervosismo e com perguntas que não sabemos responder."
      ].join("\n");
    },
    formato: "Roteiro em tabela (tempo | quem fala | fala | o que mostrar). Demais itens em seções."
  },
  {
    id: "p_banner", fase: "feira", titulo: "Escreve o texto do banner", disc: ["com", "bio", "qui", "mat"],
    descricao: "Textos curtos para cada parte do banner da feira.",
    usa: ["tudo"], requer: ["e4", "e9"],
    papel: "Você é designer de comunicação científica e avaliador de pôsteres em congressos e feiras.",
    tarefa: function (g) {
      return [
        "Escreva o conteúdo do nosso banner de 90 × 120 cm (vertical), com no máximo 500 palavras no total.",
        "1. Título (até 10 palavras) e subtítulo; autores (" + g.integrantes.join(", ") + "), turma, escola e professores orientadores (deixe [COMPLETAR]).",
        "2. Blocos: Problema; Pergunta ou objetivo; Biologia; Química; Matemática; Metodologia; Resultados (qual gráfico colocar e sua legenda); Nossa solução e negócio; Impacto; Conclusão; Referências no formato ABNT (apenas fontes reais que aparecem no nosso contexto, senão [COMPLETAR]).",
        "3. Limite de palavras por bloco e o texto de cada um, usando apenas as informações e os dados do nosso contexto. Onde faltar, escreva [FALTA: ...].",
        "4. Descreva o layout em grade (quais blocos ficam em cima, no meio e embaixo; onde entram imagens, gráfico e QR code).",
        "5. Tamanhos de fonte recomendados para leitura a 1,5 m de distância (título, subtítulos, corpo, legendas).",
        "6. Uma checklist de revisão final do banner com 10 itens."
      ].join("\n");
    },
    formato: "Uma seção por bloco do banner, com contagem de palavras entre parênteses."
  },
  {
    id: "p_banca", fase: "feira", titulo: "Simula os jurados da feira", disc: ["bio", "qui", "mat", "neg"], interativo: true,
    descricao: "A IA faz perguntas como os jurados, uma de cada vez, e dá nota.",
    usa: ["tudo"], requer: ["e4"],
    papel: "Você é uma banca avaliadora da feira formada por três jurados: uma bióloga, um químico e uma matemática com experiência em negócios. São exigentes, justos e gentis.",
    tarefa: function () {
      return [
        "Conduza uma simulação de banca em forma de conversa, seguindo estas regras:",
        "1. Apresente os três jurados em uma frase cada.",
        "2. Peça que façamos o pitch (vamos colar o texto ou um resumo) e ESPERE a nossa resposta.",
        "3. Depois, faça UMA pergunta por vez, alternando os jurados. Total de 9 perguntas: pelo menos 2 de Biologia, 2 de Química, 2 de Matemática, 2 sobre o negócio e 1 sobre o nosso processo e o uso de IA. Inclua as perguntas que temos medo de receber (Missão 11), se houver.",
        "4. Depois de cada resposta nossa: diga o que estava certo, o que faltou e mostre como seria uma resposta mais forte, em no máximo 5 linhas. Só então faça a próxima pergunta.",
        "5. Ao final, avalie com esta rubrica, dando nota de 0 a 10 por critério:",
        _rubricaTexto(),
        "Calcule a nota final como média ponderada pelos pesos, mostrando a conta. Liste 3 pontos fortes e 3 prioridades de melhoria.",
        "Comece agora pelo passo 1 e pare no passo 2, esperando o nosso pitch."
      ].join("\n");
    },
    formato: "Conversa. Mensagens curtas. Nunca faça mais de uma pergunta por mensagem."
  },

  /* ================== REVISÃO E DOCUMENTO FINAL =================== */
  {
    id: "p_revisor", fase: "final", titulo: "Procura erros no projeto", disc: ["bio", "qui", "mat", "neg"],
    descricao: "Procura erros de ciência, de conta e informações sem prova.",
    usa: ["tudo"], requer: ["e4", "e5", "e6", "e7"],
    papel: "Você é um revisor rigoroso de projetos científicos escolares, com formação em Biologia, Química e Matemática.",
    tarefa: function () {
      return [
        "Revise TODO o nosso projeto e encontre problemas. Cite o trecho exato em cada apontamento.",
        "1. Erros conceituais de Biologia e de Química, com a correção.",
        "2. Erros de cálculo, de unidade ou de arredondamento. Refaça as contas.",
        "3. Contradições entre missões (ex.: um número diferente em dois lugares, um público diferente do canal de venda).",
        "4. Afirmações sem evidência ou possivelmente falsas: marque [VERIFICAR] e diga como checar.",
        "5. Riscos de segurança que não estão cobertos.",
        "6. Fragilidades do negócio.",
        "7. O que falta para a feira, considerando o prazo.",
        "No final, uma tabela priorizada: gravidade (alta, média, baixa) | onde está | problema | como corrigir | papel responsável."
      ].join("\n");
    },
    formato: "Seções numeradas e tabela final ordenada por gravidade."
  },
  {
    id: "p_relatorio", fase: "final", titulo: "Ajuda a escrever o relatório", disc: ["bio", "qui", "mat", "neg"],
    descricao: "Estrutura do trabalho escrito, parte por parte.",
    usa: ["tudo"], requer: ["e9", "e10"],
    papel: "Você é orientador de iniciação científica no Ensino Médio e conhece as normas da ABNT para trabalhos escolares.",
    tarefa: function () {
      return [
        "Produza o relatório final do nosso projeto com esta estrutura:",
        "Capa (itens) · Resumo de até 150 palavras e 3 a 5 palavras-chave · 1 Introdução (problema, justificativa, objetivo geral e objetivos específicos) · 2 Fundamentação teórica (2.1 Biologia, 2.2 Química, 2.3 Matemática, integradas) · 3 Metodologia · 4 Resultados e discussão (com os dados reais da nossa tabela) · 5 Plano de negócio · 6 Impacto ambiental · 7 Considerações finais · Referências (ABNT, somente fontes reais) · Apêndice: como usamos a inteligência artificial.",
        "Regras:",
        "- Use apenas o que está no nosso contexto. Não invente resultados, entrevistas nem referências.",
        "- Onde faltar informação, escreva [COMPLETAR: o que falta].",
        "- Marque [VERIFICAR] qualquer afirmação que precise de fonte.",
        "- No modo Tutor, entregue apenas a estrutura com 3 perguntas-guia por seção, sem escrever o texto.",
        "- No modo Orientador, escreva o primeiro parágrafo de cada seção como exemplo e deixe o resto em tópicos.",
        "- No modo Especialista, escreva o rascunho completo, que vamos revisar e reescrever com as nossas palavras."
      ].join("\n");
    },
    formato: "Documento com títulos numerados no padrão de trabalho escolar."
  },
  {
    id: "p_checagem", fase: "final", titulo: "Isso é verdade? (checar informações)", disc: ["bio", "qui", "mat"],
    descricao: "Colem uma informação e a IA diz se é verdade e como conferir.",
    usa: ["e3", "e4", "e7"], requer: [],
    papel: "Você é checador de fatos especializado em ciência e meio ambiente.",
    tarefa: function () {
      return [
        "Verifique as afirmações que colamos em PEDIDO ESPECÍFICO. Se não colamos nada, verifique os números e as afirmações do nosso contexto (tamanho do problema, estimativas, impacto).",
        "Para cada afirmação:",
        "a) classificação: correta, parcialmente correta, incorreta ou não verificável;",
        "b) explicação em até 4 linhas;",
        "c) que tipo de fonte confirmaria e como buscá-la (palavras-chave, instituição);",
        "d) se tiver número, se a ordem de grandeza é plausível, com uma conta rápida de verificação.",
        "Depois, ensine 5 sinais de alerta de informação falsa ou exagerada sobre meio ambiente."
      ].join("\n");
    },
    formato: "Tabela: afirmação | classificação | explicação | como conferir."
  },
  {
    id: "p_semana", fase: "comeco", titulo: "O que fazer nesta semana?", disc: ["neg"],
    descricao: "Lista de tarefas da semana para cada pessoa da equipe.",
    usa: ["e1", "progresso", "diario"], requer: ["e1"],
    papel: "Você é gerente de projetos que orienta equipes de estudantes, prático e realista.",
    tarefa: function (g, est, cfg) {
      var sem = IV.util.semanaAtual(cfg);
      var cr = IV.CRONOGRAMA.find(function (c) { return c.semana === sem; });
      return [
        "Monte o nosso plano para esta semana." + (cr ? " Pelo cronograma, estamos na semana " + sem + " de " + IV.CRONOGRAMA.length + ", com foco em \"" + cr.foco + "\" e entrega esperada: " + cr.entrega + "." : ""),
        "Cronograma completo: " + IV.CRONOGRAMA.map(function (c) { return "semana " + c.semana + " = " + c.foco; }).join("; ") + ".",
        "1. 3 metas da semana, mensuráveis.",
        "2. Tarefas por integrante (" + g.integrantes.join(", ") + "), usando os papéis definidos, com tempo estimado e se é em sala ou em casa.",
        "3. Riscos de atraso considerando processos lentos do nosso tema (ex.: cura, decomposição, crescimento de plantas, coleta de dados) e o que precisa começar JÁ.",
        "4. Se estamos atrasados em relação ao cronograma, um plano de recuperação realista.",
        "5. Uma checklist de entrega para o fim da semana.",
        "6. O que registrar no diário de bordo."
      ].join("\n");
    },
    formato: "Tabela de tarefas (quem | o quê | onde | tempo | pronto quando). Demais itens em listas."
  },
  {
    id: "p_dossie", fase: "final", titulo: "Resumo completo do projeto", disc: ["bio", "qui", "mat", "neg"],
    descricao: "Junta tudo o que a equipe escreveu e mostra o que ainda falta.",
    usa: ["tudo"], requer: ["e4"],
    papel: "Você é, ao mesmo tempo, orientador científico (Biologia, Química e Matemática) e mentor de empreendedorismo socioambiental.",
    tarefa: function () {
      return [
        "Com base em TODO o contexto, produza o documento-mestre do nosso projeto:",
        "1. Sumário executivo (1 parágrafo).",
        "2. O problema, com evidências e números.",
        "3. A solução e como funciona.",
        "4. A ciência do projeto: Biologia, Química e Matemática integradas.",
        "5. Experimento, dados e resultados (apenas os que existem no contexto).",
        "6. O negócio: canvas resumido, custos, preço, ponto de equilíbrio.",
        "7. Impacto ambiental, com premissas.",
        "8. Plano semana a semana até a feira, a partir da semana atual.",
        "9. Riscos e como reduzi-los.",
        "10. Lacunas: o que está fraco, vazio ou precisa de verificação, em ordem de prioridade.",
        "11. As 5 próximas ações, com responsável por papel.",
        "Seja fiel ao que escrevemos. Onde faltar, escreva [FALTA: ...]. Não invente resultados."
      ].join("\n");
    },
    formato: "Documento com títulos numerados, tabelas quando ajudarem."
  }
];

IV.promptPorId = function (id) { return IV.PROMPTS.find(function (p) { return p.id === id; }); };

/* ---------------------------------------------------------------------
   PRONTIDÃO: quanto do que o prompt precisa já foi preenchido
   --------------------------------------------------------------------- */
IV.prontidao = function (prompt, estado) {
  if (!prompt.requer.length) return { ok: true, pct: 100, faltam: [] };
  var faltam = [], soma = 0;
  prompt.requer.forEach(function (eid) {
    var e = IV.etapaPorId(eid), p = IV.util.progressoEtapa(estado, e);
    soma += p.pct;
    if (p.pct < 60) faltam.push(e);
  });
  var pct = Math.round(soma / prompt.requer.length);
  return { ok: faltam.length === 0, pct: pct, faltam: faltam };
};

/* ---------------------------------------------------------------------
   MONTAGEM FINAL
   --------------------------------------------------------------------- */
IV.montarPrompt = function (promptId, grupo, estado, config, modoId, extra) {
  var p = IV.promptPorId(promptId);
  var modo = IV.MODOS.find(function (m) { return m.id === (modoId || IV.PROJETO.modoIA); }) || IV.MODOS[1];
  var partes = [];
  partes.push("# PAPEL\n" + p.papel);
  partes.push("# CONTEXTO DO NOSSO PROJETO\n" + IV.contexto(grupo, estado, p.usa, config));
  partes.push("# TAREFA\n" + p.tarefa(grupo, estado, config));
  partes.push("# FORMATO DA RESPOSTA\n" + p.formato + " Escreva em português do Brasil.");
  partes.push("# REGRAS\n" + IV.REGRAS.map(function (r, i) { return (i + 1) + ". " + r; }).join("\n"));
  partes.push("# MODO DE AJUDA\n" + modo.texto);
  if (extra && extra.trim()) partes.push("# PEDIDO ESPECÍFICO DA EQUIPE\n" + extra.trim());
  if (!p.interativo) partes.push("Se alguma informação essencial estiver faltando, faça no máximo 3 perguntas antes de começar; caso contrário, comece direto.");
  return partes.join("\n\n");
};
