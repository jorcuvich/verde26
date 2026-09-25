/* =====================================================================
   INCUBADORA VERDE · dados.js
   Workshops, grupos, kits temáticos, cronograma e rubrica.
   Para mudar nomes, números de grupo ou datas, edite só este arquivo.
   ===================================================================== */
window.IV = window.IV || {};

IV.PROJETO = {
  nome: "Incubadora Verde",
  subtitulo: "Projeto Integrador Meio Ambiente · Química, Biologia e Matemática",
  serie: "1º ano do Ensino Médio",
  cidade: "Foz do Iguaçu (PR)",
  // Datas padrão (o professor pode alterar no Painel do Professor)
  inicioPadrao: "2026-09-28",
  feiraPadrao: "2026-10-30",
  // Modo da IA nos prompts: "tutor" (só pergunta e dá dicas), "orientador" (explica e dá opções), "especialista" (entrega completo)
  modoIA: "orientador"
};

IV.DISCIPLINAS = {
  bio: { nome: "Biologia", curto: "Bio" },
  qui: { nome: "Química", curto: "Quí" },
  mat: { nome: "Matemática", curto: "Mat" },
  neg: { nome: "Empreendedorismo", curto: "Neg" },
  com: { nome: "Comunicação", curto: "Com" }
};

IV.PAPEIS = [
  { id: "coord", nome: "Coordenação", faz: "cuida dos prazos, divide as tarefas e escreve no diário" },
  { id: "bio", nome: "Biologia", faz: "cuida da parte dos seres vivos e da saúde" },
  { id: "qui", nome: "Química", faz: "cuida das substâncias, das transformações e da segurança" },
  { id: "mat", nome: "Matemática", faz: "cuida das medidas, das contas, dos gráficos e do dinheiro" },
  { id: "com", nome: "Comunicação", faz: "cuida do nome, do banner e da apresentação na feira" }
];

IV.WORKSHOPS = [
  { id: "w1", numero: 1, titulo: "Quantos resíduos produzimos?", lema: "Conhecer para reduzir!", hue: 128 },
  { id: "w2", numero: 2, titulo: "O que acontece quando descartamos?", lema: "Descartar sem pensar traz grandes consequências!", hue: 210 },
  { id: "w3", numero: 3, titulo: "Resíduo orgânico: lixo ou recurso?", lema: "Do orgânico nascem novas oportunidades!", hue: 24 },
  { id: "w4", numero: 4, titulo: "Podemos transformar resíduos?", lema: "Criatividade também salva o planeta!", hue: 268 },
  { id: "w5", numero: 5, titulo: "Consumo consciente é transformação na escola", lema: "A mudança começa aqui!", hue: 335 }
];

/* ---------------------------------------------------------------------
   GRUPOS
   id interno único; "rotulo" é o que aparece para os alunos.
   Obs.: no cartaz o Grupo 3 aparece duas vezes (W1 e W2). Aqui eles
   são "g3a" e "g3b". Para renumerar, mude só o campo "rotulo".
   --------------------------------------------------------------------- */
IV.GRUPOS = [
  {
    id: "g1", rotulo: "Grupo 1", workshop: "w1", temaNum: 1,
    tema: "Quais tipos de resíduos produzimos?",
    integrantes: ["Adryan", "Rayane", "Pietro Tavares", "Josué"],
    kit: {
      resumo: "Descobrir QUAIS resíduos a escola (ou as casas de vocês) gera, separar por categoria e entender quais têm valor, quais são perigosos e quais não têm destino hoje em Foz do Iguaçu.",
      perguntasMotoras: [
        "Qual é a composição do lixo da nossa escola (em % da massa)?",
        "Quanto do que jogamos fora tem valor econômico e está sendo desperdiçado?",
        "Quais resíduos perigosos (pilhas, lâmpadas, eletrônicos) circulam sem destino correto?"
      ],
      bio: [
        "Biodegradável x não biodegradável: quem decompõe cada material",
        "Resíduos como abrigo e alimento de vetores (ratos, baratas, Aedes aegypti)",
        "Ingestão de plástico por animais e efeitos na fauna",
        "Microrganismos decompositores e o destino do lixo orgânico",
        "Doenças associadas ao descarte inadequado (leptospirose, dengue)"
      ],
      qui: [
        "Composição dos materiais: celulose, polímeros (PET, PEAD, PP), metais (alumínio, aço), vidro (sílica)",
        "Substâncias puras x misturas e processos de separação",
        "Propriedades usadas na triagem: densidade, magnetismo, condutividade",
        "Resíduos perigosos: metais pesados em pilhas e baterias (Pb, Cd, Hg)",
        "Códigos de identificação dos plásticos (1 a 7)"
      ],
      mat: [
        "Amostragem: como escolher dias e locais de coleta",
        "Composição gravimétrica: porcentagem de cada categoria na massa total",
        "Gráficos de setores e de barras",
        "Média e estimativa por pessoa por dia (kg/aluno/dia)",
        "Proporção e regra de três para extrapolar (escola → bairro → cidade)"
      ],
      sementes: [
        "Serviço de auditoria de resíduos para escolas e pequenos comércios",
        "Kit de coleta seletiva com sinalização clara e QR code explicativo",
        "Mapa digital de pontos de descarte correto em Foz do Iguaçu",
        "Ponte entre a escola e cooperativas de catadores (venda ou doação de recicláveis)",
        "Ponto de coleta de pilhas e eletrônicos com campanha"
      ],
      medicoes: ["massa por categoria (kg)", "volume (L)", "número de itens", "% reciclável", "kg por aluno por dia"],
      seguranca: [
        "Usar luvas e não abrir sacos com vidro quebrado ou objetos cortantes",
        "Nunca manusear resíduos de saúde (seringas, curativos)",
        "Não abrir pilhas nem baterias"
      ],
      armadilhas: [
        "Reciclável não significa reciclado: verifiquem o que a coleta de Foz realmente recicla",
        "Um único dia de coleta não representa o ano todo",
        "Pesar lixo molhado aumenta a massa: anotem as condições"
      ],
      conexoes: "Pode trocar dados com o Grupo 2 (quantidade) e o Grupo 3 · W1 (estratégias de redução)."
    }
  },
  {
    id: "g2", rotulo: "Grupo 2", workshop: "w1", temaNum: 2,
    tema: "Quantos resíduos produzimos?",
    integrantes: ["Francieli", "Lara", "Geovana", "Emily"],
    kit: {
      resumo: "Medir QUANTO resíduo é gerado (escola, refeitório, casas), comparar com médias oficiais e projetar o impacto ao longo do tempo. É o grupo dos números do projeto.",
      perguntasMotoras: [
        "Quantos kg de resíduos a escola gera por dia, por semana e por ano?",
        "Quanto de comida o refeitório desperdiça por refeição?",
        "Se nada mudar, quanto teremos produzido até o fim do ano letivo?"
      ],
      bio: [
        "Pegada ecológica e capacidade de suporte do ambiente",
        "Desperdício de alimentos e cadeia alimentar",
        "Aterro sanitário: chorume e impacto em solo, água e seres vivos",
        "Decomposição da matéria orgânica e gases produzidos"
      ],
      qui: [
        "Chorume: o que contém (matéria orgânica, amônia, metais)",
        "Gases de aterro: metano (CH₄) e gás carbônico (CO₂)",
        "Densidade do lixo: relação entre massa e volume",
        "Decomposição aeróbia x anaeróbia"
      ],
      mat: [
        "Coleta e organização de dados em tabelas",
        "Média, mediana, mínimo, máximo e amplitude",
        "Taxa per capita (kg/pessoa/dia)",
        "Projeções: função afim (crescimento constante) e comparações",
        "Conversão de unidades (g, kg, t; L, m³)",
        "Estimativa de Fermi (estimar com poucos dados e bom raciocínio)"
      ],
      sementes: [
        "Placar público do desperdício: painel semanal com dados da escola",
        "Consultoria de redução de desperdício para lanchonetes e restaurantes",
        "Planilha ou app de monitoramento do lixo doméstico",
        "Desafio gamificado entre turmas com ranking e premiação",
        "Programa \"prato limpo\" no refeitório com metas mensuráveis"
      ],
      medicoes: ["kg por dia por turma", "kg de restos por refeição", "número de alunos atendidos", "kg por pessoa por dia"],
      seguranca: [
        "Luvas e balança protegida por saco plástico",
        "Não abrir lixo de banheiro nem resíduos de saúde"
      ],
      armadilhas: [
        "Projetar um ano a partir de um dia sem considerar variações (feriados, cardápio)",
        "Comparar dados da escola com médias nacionais sem ajustar a unidade",
        "Usar números da internet sem fonte (procurem dados oficiais e do Panorama dos Resíduos Sólidos)"
      ],
      conexoes: "Seus dados podem alimentar os Grupos 1, 3 · W1, 10 e 11."
    }
  },
  {
    id: "g3a", rotulo: "Grupo 3 · W1", workshop: "w1", temaNum: 3,
    tema: "Estratégias para reduzir os resíduos",
    integrantes: ["Sara"],
    nota: "Equipe de uma pessoa: escolha uma ideia de escopo enxuto e busque parcerias com os Grupos 1 e 2, que já vão ter dados.",
    kit: {
      resumo: "Propor e testar estratégias que reduzam os resíduos NA ORIGEM (antes de virarem lixo), mostrando com números quanto cada estratégia economiza.",
      perguntasMotoras: [
        "Qual resíduo da escola é mais fácil de evitar?",
        "Quanto uma troca de hábito (ex.: copo retornável) economiza em um ano?",
        "O que faz uma pessoa mudar um hábito de consumo?"
      ],
      bio: [
        "Redução na fonte x reciclagem: impacto sobre os ecossistemas",
        "Extração de recursos naturais e perda de habitats",
        "Ciclos biogeoquímicos e acúmulo de materiais no ambiente"
      ],
      qui: [
        "Materiais descartáveis x duráveis (plástico de uso único, isopor/EPS)",
        "Ciclo de vida simplificado: extração, produção, uso, descarte",
        "Energia gasta para produzir cada material"
      ],
      mat: [
        "Função afim para comparar custos ao longo do tempo (descartável x durável)",
        "Ponto de equilíbrio: a partir de quantos usos o durável compensa",
        "Porcentagem de redução (antes e depois)",
        "Gráficos comparativos"
      ],
      sementes: [
        "Sistema de copos ou potes retornáveis da escola com empréstimo",
        "Desafio lixo zero com certificação para turmas",
        "Troca-troca de materiais escolares e uniformes",
        "Guia de compras sem embalagem para famílias",
        "Embalagem retornável para a cantina"
      ],
      medicoes: ["itens descartáveis usados por dia", "custo por unidade", "número de usos", "% de redução"],
      seguranca: ["Higienização adequada de itens reutilizáveis de alimentação"],
      armadilhas: [
        "Um item durável só compensa se for realmente usado muitas vezes",
        "Reduzir não é o mesmo que reciclar: mostrem a diferença com dados"
      ],
      conexoes: "Parceria natural com os Grupos 1, 2 e 10."
    }
  },
  {
    id: "g3b", rotulo: "Grupo 3 · W2", workshop: "w2", temaNum: 1,
    tema: "Decomposição, ciclagem da matéria e poluição do solo",
    integrantes: ["Andreas", "Felipe M.", "Pietro H."],
    kit: {
      resumo: "Entender como a matéria volta ao ambiente pela decomposição, o que acontece quando o solo recebe resíduos que não se decompõem ou que são tóxicos, e como medir a saúde de um solo.",
      perguntasMotoras: [
        "Quais materiais se decompõem e em quanto tempo, nas nossas condições?",
        "Como saber se um solo está saudável ou contaminado?",
        "Dá para recuperar um solo degradado com resíduos orgânicos?"
      ],
      bio: [
        "Decompositores: bactérias e fungos",
        "Detritívoros: minhocas, tatuzinhos, colêmbolos",
        "Ciclo do carbono e ciclo do nitrogênio",
        "Microbiota e fertilidade do solo",
        "Bioensaio de germinação como indicador de contaminação"
      ],
      qui: [
        "Decomposição aeróbia (gera CO₂ e H₂O) x anaeróbia (gera CH₄)",
        "pH do solo e sua medição",
        "Metais pesados no solo (Pb, Cd, Hg) e sua persistência",
        "Chorume e lixiviação (quando a água arrasta substâncias)",
        "Matéria orgânica, húmus e nutrientes (N, P, K)"
      ],
      mat: [
        "Taxa de decomposição: % de massa perdida por semana",
        "Função exponencial de decaimento (introdução)",
        "Gráficos de massa x tempo",
        "Porcentagem de germinação e comparação entre amostras",
        "Média de repetições"
      ],
      sementes: [
        "Minhocário (vermicompostagem) com venda de húmus",
        "Kit simples de análise de solo para hortas (pH, textura, germinação)",
        "Teste público de embalagens \"biodegradáveis\": quais realmente se decompõem",
        "Consultoria para recuperar canteiros ou terrenos degradados da escola",
        "Substrato para mudas a partir de resíduos"
      ],
      medicoes: ["massa das amostras ao longo das semanas (g)", "pH do solo", "% de germinação", "temperatura do solo (°C)"],
      seguranca: [
        "Não coletar solo de lixões nem de áreas com resíduos perigosos",
        "Luvas e lavagem das mãos após manusear solo"
      ],
      armadilhas: [
        "Tabelas de \"tempo de decomposição\" (ex.: plástico 400 anos) circulam sem fonte clara: tratem como estimativas",
        "Em 5 semanas a decomposição avança pouco: enterrem as amostras na semana 1 ou 2, usem materiais que mudam rápido (casca de fruta, papel) e pesem toda semana"
      ],
      conexoes: "Conversa direto com os Grupos 5 (compostagem) e 6 (biofertilizante)."
    }
  },
  {
    id: "g4", rotulo: "Grupo 4", workshop: "w2", temaNum: 2,
    tema: "Poluição da água, bioacumulação e magnificação trófica",
    integrantes: ["Juliana", "Eloah", "Ana Isabelly"],
    kit: {
      resumo: "Investigar como poluentes chegam aos rios (Paraná, Iguaçu e córregos urbanos de Foz), por que alguns se acumulam nos seres vivos e aumentam ao longo da cadeia alimentar, e o que dá para fazer a respeito.",
      perguntasMotoras: [
        "Como está a água do córrego mais próximo da escola?",
        "Por que o peixe grande tem mais mercúrio do que o peixe pequeno?",
        "Que solução simples reduz a poluição que chega aos rios da cidade?"
      ],
      bio: [
        "Cadeias e teias alimentares, níveis tróficos",
        "Bioacumulação (no indivíduo) x magnificação trófica (ao longo da cadeia)",
        "Eutrofização: excesso de nutrientes e morte por falta de oxigênio",
        "Bioindicadores: macroinvertebrados aquáticos",
        "Microplásticos nos organismos aquáticos"
      ],
      qui: [
        "Poluentes persistentes: mercúrio (metilmercúrio), agrotóxicos, POPs",
        "Lipossolubilidade: por que certas substâncias ficam na gordura",
        "Parâmetros da água: pH, oxigênio dissolvido, turbidez, nitrato e fosfato",
        "Concentração: mg/L, ppm e ppb",
        "Adsorção (carvão ativado) e filtração"
      ],
      mat: [
        "Progressão geométrica para modelar a magnificação (fator por nível)",
        "Notação científica e conversão ppm ↔ ppb ↔ mg/L",
        "Diluição e proporção",
        "Gráficos em escala logarítmica (introdução)",
        "Médias e comparação entre pontos de coleta"
      ],
      sementes: [
        "Serviço ou kit de monitoramento cidadão de córregos (parâmetros simples + bioindicadores)",
        "Filtro demonstrativo de baixo custo para ensinar tratamento de água",
        "Adsorvente natural testado para remover corante de água",
        "Barreira ecológica para reter lixo em bocas de lobo",
        "Campanha de descarte correto com dados de impacto nos peixes"
      ],
      medicoes: ["pH", "turbidez (comparação visual ou disco de Secchi)", "temperatura (°C)", "diversidade de macroinvertebrados", "% de remoção de cor"],
      seguranca: [
        "Nunca beber água \"filtrada\" do experimento: filtro caseiro não torna água potável",
        "Coleta em córregos apenas com adulto, luvas e sem entrar na água",
        "Não manusear mercúrio ou agrotóxicos: usem simulações e dados publicados"
      ],
      armadilhas: [
        "\"1 litro de óleo contamina X mil litros de água\": o número varia muito entre fontes",
        "Água transparente não é sinônimo de água limpa",
        "Magnificação real não multiplica por um fator fixo: o modelo é uma simplificação"
      ],
      conexoes: "Relação com o Grupo 7 (óleo nos rios) e o Grupo 8 (microplásticos)."
    }
  },
  {
    id: "g5", rotulo: "Grupo 5", workshop: "w3", temaNum: 1,
    tema: "Compostagem",
    integrantes: ["Luna", "Marina", "Sofia"],
    kit: {
      resumo: "Transformar resíduo orgânico (restos de frutas, verduras, folhas) em adubo por meio da compostagem, controlando temperatura, umidade e a mistura de materiais, e transformar isso em negócio.",
      perguntasMotoras: [
        "Quanto resíduo orgânico a escola ou o bairro poderia compostar?",
        "Qual mistura de materiais produz composto mais rápido e sem cheiro?",
        "Quem compraria o composto, e por quanto?"
      ],
      bio: [
        "Microrganismos da compostagem: bactérias mesófilas e termófilas, fungos, actinomicetos",
        "Fases da compostagem (mesófila, termófila, resfriamento, maturação)",
        "Vermicompostagem: papel das minhocas",
        "Eliminação de patógenos pela temperatura",
        "Nutrição das plantas e matéria orgânica no solo"
      ],
      qui: [
        "Relação carbono/nitrogênio (C/N): materiais \"marrons\" e \"verdes\"",
        "Decomposição aeróbia é exotérmica: por que a pilha esquenta",
        "Umidade e oxigenação",
        "pH ao longo do processo e liberação de amônia (cheiro)",
        "Nutrientes N, P, K e húmus"
      ],
      mat: [
        "Média ponderada para calcular a relação C/N da mistura",
        "Gráfico de temperatura x tempo",
        "Redução de massa e de volume em %",
        "Estimativa de produção (kg de composto por kg de resíduo)",
        "Custo por kg e preço de venda"
      ],
      sementes: [
        "Composteira doméstica de baixo custo (baldes) para venda",
        "Serviço de coleta de orgânicos em restaurantes e feiras",
        "Adubo ou húmus embalado com marca",
        "Horta escolar alimentada pelo próprio composto",
        "Oficina paga ou kit educacional de compostagem"
      ],
      medicoes: ["temperatura diária (°C)", "massa inicial e final (kg)", "volume (L)", "umidade (teste da mão)", "dias até a maturação"],
      seguranca: [
        "Não colocar carne, laticínios, óleo ou fezes de animais domésticos",
        "Luvas; cuidado com chorume",
        "Tampa e telas para evitar moscas e roedores"
      ],
      armadilhas: [
        "Compostagem completa leva mais de 5 semanas: montem a composteira na semana 1, apresentem o PROCESSO (temperatura, redução de volume) e, se possível, consigam composto pronto de outra fonte para mostrar o produto final",
        "Cheiro forte indica excesso de umidade ou de nitrogênio, não \"compostagem normal\""
      ],
      conexoes: "Pode fornecer adubo para o Grupo 11 (plano da escola) e comparar com o Grupo 6."
    }
  },
  {
    id: "g6", rotulo: "Grupo 6", workshop: "w3", temaNum: 2,
    tema: "Biodigestores e biofertilizantes",
    integrantes: ["Júnior", "Isadora", "Gabriel", "Samuel"],
    kit: {
      resumo: "Usar a digestão anaeróbia (sem oxigênio) para transformar resíduos orgânicos em biogás (energia) e biofertilizante (adubo líquido). Foz do Iguaçu tem o CIBiogás no Parque Tecnológico Itaipu, uma referência nacional no tema.",
      perguntasMotoras: [
        "Quanto biogás um biodigestor pequeno produz com os restos da cantina?",
        "O biofertilizante faz as plantas crescerem mais?",
        "Para quem um biodigestor seria um bom negócio (sítio, restaurante, escola)?"
      ],
      bio: [
        "Digestão anaeróbia: bactérias e arqueas metanogênicas",
        "Etapas: hidrólise, acidogênese, acetogênese, metanogênese",
        "Biofertilizante e nutrição das plantas",
        "Redução de patógenos e de odores",
        "Dejetos da suinocultura e avicultura no Oeste do Paraná"
      ],
      qui: [
        "Composição do biogás: metano (CH₄, cerca de 50 a 70%), CO₂ e traços de H₂S",
        "Combustão do metano: CH₄ + 2 O₂ → CO₂ + 2 H₂O + energia",
        "Poder calorífico e comparação com o GLP (gás de cozinha)",
        "pH do biodigestor e acidificação",
        "Metano como gás de efeito estufa"
      ],
      mat: [
        "Volume de gás por deslocamento de água",
        "Taxa de produção diária (L/dia) e gráfico acumulado",
        "Conversão de volume de gás em energia (kWh) e em botijões equivalentes",
        "Custo, economia mensal e tempo de retorno do investimento (payback)",
        "Comparação estatística de plantas com e sem biofertilizante"
      ],
      sementes: [
        "Mini biodigestor demonstrativo como kit educacional",
        "Biofertilizante líquido embalado para hortas urbanas",
        "Dimensionamento de biodigestor para restaurante ou propriedade rural",
        "Serviço de coleta de orgânicos para alimentar biodigestores",
        "Parceria de visita ou mentoria com o CIBiogás"
      ],
      medicoes: ["volume de gás (mL ou L)", "temperatura (°C)", "pH do líquido", "altura ou massa das plantas (cm, g)", "dias de produção"],
      seguranca: [
        "Biogás é inflamável e o H₂S é tóxico: NÃO queimar o gás sem supervisão direta do professor",
        "Na feira, demonstrar com balão ou medição de volume, nunca com chama",
        "Recipientes fechados acumulam pressão: usar válvula de alívio ou balão"
      ],
      armadilhas: [
        "Mini biodigestores de garrafa podem demorar 1 a 3 semanas para começar a produzir: montem na semana 1",
        "Números de \"quanto biogás por kg\" variam muito com o tipo de resíduo: citem a fonte"
      ],
      conexoes: "Compare resultados com o Grupo 5 (compostagem) e o Grupo 3 · W2 (solo)."
    }
  },
  {
    id: "g7", rotulo: "Grupo 7", workshop: "w4", temaNum: 1,
    tema: "Óleo de cozinha e produção de sabão",
    integrantes: ["Manuela H.", "Rafaella", "Geovanna M."],
    kit: {
      resumo: "Transformar óleo de cozinha usado, que polui água e entope redes de esgoto, em sabão, por meio da reação de saponificação, e construir um negócio em torno da coleta e da venda.",
      perguntasMotoras: [
        "Quanto óleo usado as famílias da escola descartam por mês?",
        "Qual receita produz um sabão seguro (pH adequado) e que limpa bem?",
        "Quanto custa produzir uma barra, e por quanto dá para vender?"
      ],
      bio: [
        "Óleo na água: película que dificulta a troca de oxigênio",
        "Efeitos sobre peixes, aves e microrganismos aquáticos",
        "Entupimento de redes e proliferação de pragas",
        "Pele humana: por que um sabão muito básico irrita"
      ],
      qui: [
        "Triglicerídeos (óleos e gorduras) e ácidos graxos",
        "Saponificação: óleo + hidróxido de sódio → sabão + glicerol",
        "Hidróxido de sódio (soda cáustica): base forte e corrosiva",
        "Reação exotérmica e cura do sabão",
        "Micelas: como o sabão remove a gordura (parte polar e apolar)",
        "pH do produto final"
      ],
      mat: [
        "Proporção e estequiometria (índice de saponificação)",
        "Rendimento: litros de óleo → número de barras",
        "Custo por barra, preço, margem e ponto de equilíbrio",
        "Impacto: litros de óleo desviados do esgoto",
        "Gráficos de pH por receita"
      ],
      sementes: [
        "Sabão em barra artesanal com marca própria",
        "Ponto de coleta: troque óleo usado por sabão",
        "Parceria com pastelarias, restaurantes e a cantina",
        "Sabão para limpeza de pisos e roupas vendido para a comunidade",
        "Kit de coleta de óleo com garrafa padronizada"
      ],
      medicoes: ["volume de óleo coletado (L)", "massa de sabão (g)", "pH do sabão", "tempo de cura (dias)", "custo por barra (R$)"],
      seguranca: [
        "Soda cáustica é muito corrosiva: manuseio só pelo professor ou com óculos, luvas nitrílicas e jaleco",
        "Adicionar a soda à água, NUNCA a água sobre a soda; ambiente ventilado",
        "Sabão precisa curar cerca de 4 semanas e ter o pH testado antes de qualquer uso",
        "Sabão artesanal não pode ser vendido como cosmético para pele (regras da ANVISA)"
      ],
      armadilhas: [
        "Cura de cerca de 4 semanas: o primeiro lote precisa ser feito (com o professor) na semana 1 para estar curado na feira; lotes posteriores podem ser mostrados em cura, com o pH medido ao longo do tempo",
        "O número \"1 litro de óleo contamina 25 mil litros de água\" tem origem incerta: procurem a fonte ou apresentem como estimativa"
      ],
      conexoes: "O Grupo 4 pode ajudar com o impacto do óleo na água."
    }
  },
  {
    id: "g8", rotulo: "Grupo 8", workshop: "w4", temaNum: 2,
    tema: "Polímeros e reciclagem",
    integrantes: ["Giovanna", "Maria V."],
    kit: {
      resumo: "Entender o que são os plásticos (polímeros), por que são tão difíceis de eliminar, como identificá-los e reciclá-los e quais alternativas existem, como bioplásticos de amido.",
      perguntasMotoras: [
        "Quais tipos de plástico mais aparecem no lixo da escola?",
        "Dá para separar plásticos usando só água e sal (densidade)?",
        "Um bioplástico feito na escola serve para algum produto real?"
      ],
      bio: [
        "Microplásticos e nanoplásticos nos seres vivos",
        "Ingestão e emaranhamento de animais",
        "Por que microrganismos quase não degradam a maioria dos plásticos",
        "Bioplásticos: origem vegetal x biodegradabilidade"
      ],
      qui: [
        "Monômeros, polímeros e polimerização",
        "Termoplásticos x termofixos",
        "Códigos de identificação: 1 PET, 2 PEAD, 3 PVC, 4 PEBD, 5 PP, 6 PS, 7 outros",
        "Separação por densidade (flutua ou afunda em água e em soluções salinas)",
        "Bioplástico de amido com glicerol (plastificante)"
      ],
      mat: [
        "Densidade = massa ÷ volume",
        "Porcentagem de cada tipo de plástico",
        "Valor de mercado por kg de reciclável",
        "Razão volume compactado / volume solto",
        "Receita estimada de uma coleta"
      ],
      sementes: [
        "Bioplástico de amido para vasos de mudas ou embalagens simples",
        "Serviço de triagem por densidade para cooperativas",
        "Ecotijolo (garrafa PET preenchida com plástico não reciclável) para bancos e canteiros",
        "Campanha de tampinhas com destino e receita conhecidos",
        "Guia visual de identificação de plásticos para a comunidade"
      ],
      medicoes: ["massa e volume das amostras (g, mL)", "densidade (g/mL)", "tempo de secagem do bioplástico", "resistência (teste de tração simples)", "kg por tipo"],
      seguranca: [
        "NÃO derreter nem queimar plásticos: liberam gases tóxicos (especialmente PVC e isopor)",
        "Bioplástico de amido com fogão ou placa aquecedora só com supervisão"
      ],
      armadilhas: [
        "\"Biodegradável\" no rótulo pode exigir compostagem industrial para se degradar",
        "Nem todo plástico com símbolo de reciclagem é aceito pela coleta local"
      ],
      conexoes: "Troque dados com o Grupo 1 (tipos de resíduos) e o Grupo 4 (microplásticos)."
    }
  },
  {
    id: "g9", rotulo: "Grupo 9", workshop: "w4", temaNum: 3,
    tema: "Materiais reaproveitáveis e transformações",
    integrantes: ["Manuela K.", "Pedro", "Vitória"],
    kit: {
      resumo: "Dar nova função a materiais que seriam descartados (pneus, paletes, vidro, tecidos, madeira), projetando produtos com medidas reais, custo real e segurança.",
      perguntasMotoras: [
        "Qual material descartado em Foz tem volume grande e pouco reaproveitamento?",
        "Que produto útil dá para criar com ele, com medidas e custo conhecidos?",
        "Quanto material deixa de ir para o aterro a cada produto vendido?"
      ],
      bio: [
        "Pneus e recipientes com água parada: criadouros do Aedes aegypti",
        "Menos extração de recursos naturais: impacto em florestas e ecossistemas",
        "Hortas verticais e jardins em materiais reaproveitados"
      ],
      qui: [
        "Transformações físicas x químicas",
        "Composição dos materiais: borracha vulcanizada, vidro, madeira, tecidos, metais",
        "Corrosão e degradação de materiais",
        "Tratamentos químicos de madeira (selos HT e MB em paletes)",
        "Tintas e vernizes: base água x solvente"
      ],
      mat: [
        "Geometria: áreas e volumes para projetar produtos",
        "Escala e desenho técnico simples (planta com medidas)",
        "Cálculo de quantidade de material por produto",
        "Custo de produção, preço e margem",
        "Massa de material desviada do aterro"
      ],
      sementes: [
        "Vasos e floreiras de pneus (furados para não acumular água)",
        "Móveis de paletes para áreas de convivência",
        "Luminárias e objetos de vidro reaproveitado",
        "Upcycling de uniformes e tecidos",
        "Brindes sustentáveis para empresas locais"
      ],
      medicoes: ["dimensões (cm)", "área e volume (cm², L)", "massa de material reaproveitado (kg)", "tempo de produção (h)", "custo (R$)"],
      seguranca: [
        "Ferramentas de corte e furadeira só com supervisão e óculos",
        "Pneus sempre furados no fundo ou cobertos",
        "Paletes com selo MB (brometo de metila) devem ser evitados; preferir HT (tratamento térmico)",
        "Vidro: lixar bordas e usar luvas"
      ],
      armadilhas: [
        "Produto bonito sem medida e sem custo não é projeto: registrem tudo",
        "Reaproveitar pode gastar mais tinta e cola do que o material economiza: calculem"
      ],
      conexoes: "O Grupo 11 pode usar seus produtos no plano da escola."
    }
  },
  {
    id: "g10", rotulo: "Grupo 10", workshop: "w5", temaNum: 1,
    tema: "Consumo consciente e os 6R",
    integrantes: ["Isabel", "Ana Clara", "Ana Clara Prestes", "Luciano"],
    kit: {
      resumo: "Medir os hábitos de consumo da comunidade escolar e criar algo que mude comportamento usando os 6R: Repensar, Recusar, Reduzir, Reutilizar, Reciclar e Recuperar.",
      perguntasMotoras: [
        "Qual é o perfil de consumo dos alunos da escola?",
        "Qual dos 6R é o menos praticado, e por quê?",
        "O que faria um adolescente mudar um hábito de consumo?"
      ],
      bio: [
        "Pegada ecológica e uso de recursos naturais",
        "Sobrecarga da Terra: consumimos mais do que o planeta repõe",
        "Perda de biodiversidade ligada ao consumo",
        "Saúde e consumo (alimentos ultraprocessados, embalagens)"
      ],
      qui: [
        "Ciclo de vida dos produtos: da extração ao descarte",
        "Materiais das embalagens e sua reciclabilidade",
        "Pegada de carbono e CO₂ equivalente",
        "Recuperar: energia e materiais a partir de resíduos"
      ],
      mat: [
        "Pesquisa estatística: questionário, amostra, tabulação",
        "Porcentagens, gráficos de barras e de setores",
        "Índice de consumo consciente com pontuação ponderada",
        "Comparação antes e depois de uma intervenção",
        "Margem de erro e tamanho da amostra (introdução)"
      ],
      sementes: [
        "Quiz ou calculadora da pegada ecológica da escola",
        "Brechó ou feira de trocas com moeda própria",
        "Selo de consumo consciente para a cantina e comércios do bairro",
        "Jogo de cartas ou tabuleiro dos 6R",
        "Campanha com desafios semanais e medição de resultados"
      ],
      medicoes: ["respostas do questionário", "% por hábito", "pontuação média do índice", "variação antes/depois"],
      seguranca: ["Questionários anônimos e sem dados pessoais sensíveis"],
      armadilhas: [
        "Pergunta mal feita gera dado ruim: testem o questionário antes",
        "Pessoas dizem que fazem mais do que realmente fazem: comparem declaração com observação"
      ],
      conexoes: "Pode trabalhar com o Grupo 11 e usar dados dos Grupos 1 e 2."
    }
  },
  {
    id: "g11", rotulo: "Grupo 11", workshop: "w5", temaNum: 2,
    tema: "Plano de intervenção para a escola",
    integrantes: ["Maria V. S.", "Maria Eduarda", "Lucas"],
    kit: {
      resumo: "Fazer um diagnóstico ambiental da escola (resíduos, água, energia, áreas verdes) e propor um plano de intervenção com metas, indicadores, custos e cronograma, que possa ser implementado de verdade.",
      perguntasMotoras: [
        "Qual é o maior problema ambiental da nossa escola hoje, medido com dados?",
        "Que meta dá para atingir em um ano, e como vamos saber se atingimos?",
        "Quanto custa o plano e quem pode financiar?"
      ],
      bio: [
        "O ambiente escolar como ecossistema",
        "Áreas verdes, arborização, sombra e conforto térmico",
        "Horta escolar e biodiversidade urbana",
        "Saúde ambiental: água parada, pragas, qualidade do ar"
      ],
      qui: [
        "Consumo de água e de energia",
        "Produtos de limpeza: composição e alternativas",
        "Resíduos da cantina e do laboratório",
        "Qualidade da água dos bebedouros (parâmetros básicos)"
      ],
      mat: [
        "Indicadores e metas mensuráveis (SMART)",
        "Leitura de contas de água e energia (m³, kWh) e custos",
        "Pesquisa de opinião com gráficos",
        "Orçamento e cronograma",
        "Comparação antes e depois"
      ],
      sementes: [
        "Plano Escola Sustentável com indicadores públicos",
        "Consultoria ambiental estudantil para outras escolas",
        "Programa de monitores ambientais por turma",
        "Selo verde para salas de aula",
        "Integração dos projetos dos outros grupos em um único plano"
      ],
      medicoes: ["consumo de água (m³/mês)", "consumo de energia (kWh/mês)", "kg de resíduos", "respostas de pesquisa", "área verde (m²)"],
      seguranca: ["Pedir autorização da direção antes de qualquer intervenção física"],
      armadilhas: [
        "Plano sem responsável e sem prazo não sai do papel",
        "Metas vagas (\"conscientizar\") não podem ser medidas"
      ],
      conexoes: "Este grupo pode conectar TODOS os outros: o plano pode incluir as soluções deles."
    }
  }
];

/* ---------------------------------------------------------------------
   CRONOGRAMA: 5 semanas (as datas reais vêm da data de início)
   O experimento é montado na semana 2 para render pelo menos 2 semanas
   de medições. A fundamentação de Biologia e Química acontece enquanto
   os dados são coletados.
   --------------------------------------------------------------------- */
IV.CRONOGRAMA = [
  { semana: 1, foco: "Equipe, tema e problema", etapas: ["e1", "e2", "e3"], entrega: "Papéis, conceitos escolhidos e problema com evidência. Processos lentos (cura, compostagem, biodigestão) já começam." },
  { semana: 2, foco: "Ideia e experimento", etapas: ["e4", "e7", "e8"], entrega: "Ideia escolhida, plano de medição e experimento ou protótipo montado até o fim da semana" },
  { semana: 3, foco: "Ciência e coleta de dados", etapas: ["e5", "e6", "e9"], entrega: "Fundamentação de Biologia e Química e primeiras medições registradas" },
  { semana: 4, foco: "Resultados e negócio", etapas: ["e9", "e10"], entrega: "Dados analisados, custos, preço e ponto de equilíbrio" },
  { semana: 5, foco: "Feira", etapas: ["e11", "e12"], entrega: "Banner, pitch ensaiado e dossiê completo" }
];

/* ---------------------------------------------------------------------
   RUBRICA DA FEIRA (usada no simulador de banca e no painel)
   --------------------------------------------------------------------- */
IV.RUBRICA = [
  { id: "r1", criterio: "Problema real e bem delimitado", peso: 1, descricao: "O problema existe, está localizado (escola, bairro, Foz) e tem evidência." },
  { id: "r2", criterio: "Biologia aplicada", peso: 1.5, descricao: "Conceitos biológicos corretos que explicam o problema ou a solução." },
  { id: "r3", criterio: "Química aplicada", peso: 1.5, descricao: "Substâncias, transformações e propriedades explicadas corretamente, com segurança." },
  { id: "r4", criterio: "Matemática com dados reais", peso: 1.5, descricao: "Medições feitas pelo grupo, cálculos corretos, gráficos adequados." },
  { id: "r5", criterio: "Viabilidade do negócio", peso: 1.5, descricao: "Público, custos, preço e ponto de equilíbrio coerentes." },
  { id: "r6", criterio: "Impacto ambiental mensurável", peso: 1, descricao: "O impacto é estimado com números e premissas claras." },
  { id: "r7", criterio: "Protótipo ou demonstração", peso: 1, descricao: "Algo concreto que o visitante vê, toca ou testa." },
  { id: "r8", criterio: "Comunicação", peso: 0.5, descricao: "Pitch claro, banner organizado, todos sabem explicar." },
  { id: "r9", criterio: "Processo e uso crítico de IA", peso: 0.5, descricao: "Diário de bordo em dia; o grupo sabe o que verificou e o que decidiu por conta própria." }
];

IV.FONTES = [
  { nome: "IBGE (Cidades e Censo)", uso: "população e dados de Foz do Iguaçu" },
  { nome: "Panorama dos Resíduos Sólidos no Brasil (ABREMA)", uso: "geração e destino de resíduos" },
  { nome: "SNIS / SINISA (Ministério das Cidades)", uso: "saneamento, água e resíduos por município" },
  { nome: "Embrapa", uso: "compostagem, solos, biofertilizantes" },
  { nome: "CIBiogás (Parque Tecnológico Itaipu)", uso: "biogás e biodigestores" },
  { nome: "IAT: Instituto Água e Terra (PR)", uso: "qualidade da água e meio ambiente no Paraná" },
  { nome: "Sanepar", uso: "água e esgoto no Paraná" },
  { nome: "Ministério do Meio Ambiente e Lei 12.305/2010 (PNRS)", uso: "política de resíduos sólidos" },
  { nome: "SciELO e Google Acadêmico", uso: "artigos científicos em português" },
  { nome: "Prefeitura de Foz do Iguaçu", uso: "coleta seletiva e pontos de entrega" }
];

IV.grupoPorId = function (id) {
  if (IV.GRUPO_EXEMPLO && id === IV.GRUPO_EXEMPLO.id) return IV.GRUPO_EXEMPLO;
  return IV.GRUPOS.find(function (g) { return g.id === id; });
};
IV.workshopPorId = function (id) { return IV.WORKSHOPS.find(function (w) { return w.id === id; }); };
