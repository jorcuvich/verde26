/* =====================================================================
   INCUBADORA VERDE · app.js
   Telas e navegação.
   Endereços: #inicio · #como-usar · #professor
              #g7 (missões do grupo) · #g7-e3 (uma missão)
              #g7-ia · #g7-diario · #g7-projeto · #g7-salvar
   ===================================================================== */
(function () {
  var U = IV.util, S = IV.store, esc = U.esc;
  var app = document.getElementById("app");
  var atual = { gid: null, estado: null, aba: null, etapa: null };
  var ui = { passo: {}, extras: {}, confirmar: null, avisoVazio: false };
  var timerSalvar = null;

  /* ------------------------------------------------ utilidades */
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("visivel");
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("visivel"); }, 3000);
  }
  function selecionar(el) {
    if (!el) return;
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function copiar(texto, alvo, msgOk) {
    var falhou = function () {
      if (alvo) { var d = alvo.closest("details"); if (d) d.open = true; selecionar(alvo); }
      toast("Não deu para copiar sozinho. O texto foi selecionado: usem Copiar (ou Ctrl+C).");
    };
    try { navigator.clipboard.writeText(texto).then(function () { toast(msgOk || "Copiado!"); }, falhou); }
    catch (e) { falhou(); }
  }
  function baixar(nome, conteudo, mime) {
    S.baixar(nome, conteudo, mime).then(function (r) {
      if (r === "ok") toast("Arquivo salvo: " + nome);
      else if (r === "recusado") toast("Download cancelado.");
      else toast("Não deu para baixar aqui. Usem o botão Copiar.");
    });
  }
  function slug(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase(); }
  function hueDe(g) { return IV.workshopPorId(g.workshop).hue; }
  function cfg() { return S.config(); }
  function listaNums(nums) { return nums.length === 1 ? String(nums[0]) : nums.slice(0, -1).join(", ") + " e " + nums[nums.length - 1]; }

  function salvarAgora() {
    if (!atual.gid) return;
    S.salvar(atual.gid, atual.estado);
    var el = document.getElementById("salvo");
    if (el) el.textContent = S.persistente() ? "Salvo às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Atenção: este navegador não guarda os dados. Usem Salvar no fim da aula.";
  }
  function agendarSalvar() { clearTimeout(timerSalvar); timerSalvar = setTimeout(function () { timerSalvar = null; salvarAgora(); }, 350); }
  window.addEventListener("beforeunload", function () { if (timerSalvar) { clearTimeout(timerSalvar); salvarAgora(); } });

  function carregarGrupo(gid) {
    if (atual.gid !== gid) { atual.gid = gid; atual.estado = S.carregar(gid); ui.confirmar = null; }
    return atual.estado;
  }

  /* ------------------------------------------------ progresso das missões */
  function progM(est, e) { return U.progressoEtapa(est, e); }
  function respondida(est, e, p) { var r = est.respostas[e.id] || {}; return U.preenchido(p, r[p.id]); }
  function proximaMissao(est) { return IV.ETAPAS.find(function (e) { return progM(est, e).pct < 100; }) || null; }
  function passoInicial(est, e) {
    var algum = e.perguntas.some(function (p) { return respondida(est, e, p); });
    if (!algum) return 0;
    var i = e.perguntas.findIndex(function (p) { return p.obrig && !respondida(est, e, p); });
    return i >= 0 ? i + 1 : e.perguntas.length + 1;
  }

  /* ------------------------------------------------ rotas */
  function rota() {
    if (timerSalvar) { clearTimeout(timerSalvar); timerSalvar = null; salvarAgora(); }
    var h = (location.hash || "").replace(/^#/, "");
    var navAtivo = "inicio";
    var m = h.match(/^(g\d+[ab]?|ex)(?:-([a-z0-9]+))?$/);
    if (m && IV.grupoPorId(m[1])) {
      var aba = m[2] || "missoes";
      var alias = { visao: "missoes", etapas: "missoes", prompts: "ia", dossie: "projeto", backup: "salvar" };
      telaGrupo(m[1], alias[aba] || aba);
      navAtivo = null;
    } else if (h === "professor") { navAtivo = "professor"; atual.gid = null; telaProfessor(); }
    else if (h === "como-usar") { navAtivo = "como-usar"; atual.gid = null; telaComoUsar(); }
    else { atual.gid = null; telaInicio(); }
    document.querySelectorAll(".topo nav a").forEach(function (a) {
      if (navAtivo && a.getAttribute("href") === "#" + navAtivo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* ================================================ INÍCIO */
  function cartaoGrupo(g) {
    var e = S.carregar(g.id), pct = U.progressoGeral(e), prox = proximaMissao(e);
    return '<a class="cartao" href="#' + g.id + '" style="--wh:' + hueDe(g) + '">' +
      '<div class="cartao-topo"><span class="cartao-grupo">' + esc(g.rotulo) + '</span><span class="num suave" style="font-size:.85rem">' + pct + "%</span></div>" +
      '<div class="cartao-tema">' + esc(g.tema) + "</div>" +
      '<div class="cartao-membros">' + esc(g.integrantes.join(", ")) + "</div>" +
      '<div class="cartao-rodape"><div class="prog" role="progressbar" aria-label="Progresso" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
      "<span>" + (g.exemplo ? "Projeto de demonstração, todo preenchido" : prox ? "Próxima: Missão " + prox.num + ", " + esc(prox.titulo) : "Todas as missões feitas") + "</span></div></a>";
  }
  function cronogramaHTML(c) {
    var sem = U.semanaAtual(c), faltam = U.diasEntre(U.hojeISO(), c.feira), vistas = {};
    var h = '<section class="linha-tempo"><div class="linha-flex" style="justify-content:space-between"><h2>Cronograma</h2><span class="pill pill-neutro num">' +
      (faltam > 0 ? "Feira em " + U.dataBR(c.feira) + " · faltam " + faltam + " dias" : faltam === 0 ? "A feira é hoje!" : "Feira realizada em " + U.dataBR(c.feira)) + '</span></div><div class="semanas">';
    IV.CRONOGRAMA.forEach(function (s) {
      var ini = U.addDias(c.inicio, (s.semana - 1) * 7);
      var nums = s.etapas.filter(function (id) { var novo = !vistas[id]; vistas[id] = 1; return novo; }).map(function (id) { return IV.etapaPorId(id).num; });
      var cls = s.semana < sem ? " passada" : s.semana === sem ? " atual" : "";
      h += '<div class="semana' + cls + '"' + (s.semana === sem ? ' aria-current="step"' : "") + '><span class="s-num">Semana ' + s.semana + (s.semana === sem ? " · agora" : "") + '</span><span class="s-data num">a partir de ' + U.dataBR(ini).slice(0, 5) + '</span><span class="s-foco">' + esc(s.foco) + '</span><span class="s-missoes">' + (nums.length ? "Missões " + listaNums(nums) : "Continuar a Missão 9") + "</span></div>";
    });
    return h + "</div></section>";
  }
  function telaInicio() {
    var c = cfg();
    var h = '<div class="pagina"><section class="hero-simples"><span class="rotulo-caps">' + esc(IV.PROJETO.subtitulo) + "</span>" +
      "<h1>Escolham o grupo de vocês</h1><p>Toquem no cartão do grupo para começar ou continuar. Cada grupo faz <b>12 missões curtas</b>, uma pergunta de cada vez, e no fim tem um projeto completo para a feira.</p>" +
      '<ol class="como-faixa"><li><b>Façam a missão da semana</b><span>Uma pergunta por vez, com exemplos.</span></li><li><b>Peçam ajuda à IA</b><span>O sistema prepara o texto. Vocês só copiam e colam.</span></li><li><b>No fim da aula, salvem</b><span>Baixem o arquivo e enviem ao professor.</span></li></ol></section>';
    h += '<div class="workshops">';
    IV.WORKSHOPS.forEach(function (w) {
      var gs = IV.GRUPOS.filter(function (g) { return g.workshop === w.id; });
      h += '<section class="ws" style="--wh:' + w.hue + '"><div class="ws-cab"><span class="ws-num">' + w.numero + '</span><div><h2>' + esc(w.titulo) + '</h2><p class="ws-lema">' + esc(w.lema) + "</p></div></div>" +
        '<div class="cartoes">' + gs.map(cartaoGrupo).join("") + "</div></section>";
    });
    h += '<section class="ws" style="--wh:190"><div class="ws-cab"><span class="ws-num">?</span><div><h2>Querem ver como fica pronto?</h2><p class="ws-lema">Um projeto inventado, com todas as missões feitas, para servir de modelo.</p></div></div><div class="cartoes">' + cartaoGrupo(IV.GRUPO_EXEMPLO) + "</div></section>";
    h += "</div>" + cronogramaHTML(c) + "</div>";
    app.innerHTML = h;
    document.title = "Incubadora Verde";
  }

  /* ================================================ GRUPO */
  var ABAS = [
    { id: "missoes", nome: "Missões" }, { id: "ia", nome: "Ajuda da IA" }, { id: "diario", nome: "Diário" },
    { id: "projeto", nome: "Nosso projeto" }, { id: "salvar", nome: "Salvar" }
  ];
  function telaGrupo(gid, aba) {
    var g = IV.grupoPorId(gid), est = carregarGrupo(gid), pct = U.progressoGeral(est), w = IV.workshopPorId(g.workshop);
    var eMissao = /^e\d+$/.test(aba) ? IV.etapaPorId(aba) : null;
    atual.aba = eMissao ? "missao" : aba;
    var abaAtiva = eMissao ? "missoes" : aba;
    var h = '<div class="pagina" style="--wh:' + hueDe(g) + '">' +
      '<header class="g-cab"><div class="g-cab-linha"><div class="pilha-p"><span class="g-rotulo">' + esc(g.rotulo) + " · Workshop " + w.numero + '</span><h1>' + esc(g.tema) + '</h1><div class="g-membros">' + g.integrantes.map(function (n) { return "<span>" + esc(n) + "</span>"; }).join("") + "</div></div>" +
      '<div class="g-prog"><span class="rotulo-caps">Projeto pronto</span><span class="g-prog-num num" id="g-pct">' + pct + '%</span><div class="prog"><i id="g-bar" style="width:' + pct + '%"></i></div><span class="salvo" id="salvo">' + (est.atualizado ? "Última alteração: " + U.dataBR(est.atualizado) : "Nada salvo ainda") + "</span></div></div></header>" +
      '<nav class="abas" aria-label="Seções do grupo">' + ABAS.map(function (a) { return '<a href="#' + gid + (a.id === "missoes" ? "" : "-" + a.id) + '"' + (a.id === abaAtiva ? ' aria-current="page"' : "") + ">" + a.nome + "</a>"; }).join("") + "</nav>" +
      '<div class="conteudo-aba" id="conteudo"></div></div>';
    app.innerHTML = h;
    document.title = g.rotulo + " · Incubadora Verde";
    var alvo = document.getElementById("conteudo");
    if (eMissao) { atual.etapa = eMissao; telaMissao(g, est, eMissao, alvo); return; }
    ({ missoes: abaMissoes, ia: abaIA, diario: abaDiario, projeto: abaProjeto, salvar: abaSalvar }[aba] || abaMissoes)(g, est, alvo);
  }
  function atualizarProgressoUI() {
    var est = atual.estado, pct = U.progressoGeral(est);
    var a = document.getElementById("g-pct"), b = document.getElementById("g-bar");
    if (a) a.textContent = pct + "%"; if (b) b.style.width = pct + "%";
    if (atual.etapa && atual.aba === "missao") {
      atual.etapa.perguntas.forEach(function (p, i) {
        var d = document.getElementById("dot-" + (i + 1));
        if (d) d.classList.toggle("feito", respondida(est, atual.etapa, p));
      });
    }
  }

  /* ---------------- Aba Missões (trilha) ---------------- */
  function linhaMissao(g, est, e) {
    var p = progM(est, e), total = e.perguntas.length;
    var feitas = e.perguntas.filter(function (q) { return respondida(est, e, q); }).length;
    var estado = p.pct === 100 ? "feita" : feitas > 0 ? "andamento" : "nova";
    var rot = { feita: "Feita", andamento: "Em andamento", nova: "Não começou" }[estado];
    var btn = { feita: "Revisar", andamento: "Continuar", nova: "Começar" }[estado];
    return '<a class="missao-linha m-' + estado + '" href="#' + g.id + "-" + e.id + '"><span class="m-num" aria-hidden="true">' + (estado === "feita" ? "✓" : e.num) + '</span>' +
      '<span class="m-info"><span class="m-tit">Missão ' + e.num + ": " + esc(e.titulo) + '</span><span class="m-meta">' + rot + " · " + feitas + " de " + total + " perguntas · " + esc(e.tempo) + '</span></span><span class="btn btn-peq ' + (estado === "feita" ? "" : "btn-w") + '">' + btn + "</span></a>";
  }
  function abaMissoes(g, est, alvo) {
    var c = cfg(), sem = U.semanaAtual(c), prox = proximaMissao(est), vistas = {};
    var h = "";
    if (g.nota) h += '<div class="aviso-caixa" style="margin-bottom:16px">' + esc(g.nota) + "</div>";
    if (prox) {
      var ps = passoInicial(est, prox), n = prox.perguntas.length;
      h += '<section class="continuar"><div class="pilha-p"><span class="rotulo-caps">Próximo passo</span><h2>Missão ' + prox.num + ": " + esc(prox.titulo) + "</h2><p>" +
        (ps === 0 ? "Vocês ainda não começaram esta missão. Leva " + esc(prox.tempo) + "." : "Vocês pararam na pergunta " + Math.min(ps, n) + " de " + n + ".") + '</p></div><a class="btn btn-grande btn-w" href="#' + g.id + "-" + prox.id + '">' + (ps === 0 ? "Começar a missão" : "Continuar") + " →</a></section>";
    } else {
      h += '<section class="continuar"><div class="pilha-p"><span class="rotulo-caps">Parabéns</span><h2>Todas as missões estão feitas!</h2><p>Agora usem a Ajuda da IA para escrever a apresentação e o banner.</p></div><a class="btn btn-grande btn-w" href="#' + g.id + '-projeto">Ver o projeto completo →</a></section>';
    }
    h += '<div class="trilha">';
    IV.CRONOGRAMA.forEach(function (s) {
      var ini = U.addDias(c.inicio, (s.semana - 1) * 7), fim = U.addDias(ini, 4);
      var novas = s.etapas.filter(function (id) { var nv = !vistas[id]; vistas[id] = 1; return nv; });
      var repetidas = s.etapas.filter(function (id) { return novas.indexOf(id) < 0; });
      h += '<section class="semana-bloco' + (s.semana === sem ? " agora" : "") + '"><div class="semana-cab"><h3>Semana ' + s.semana + '</h3><span class="suave num">' + U.dataBR(ini).slice(0, 5) + " a " + U.dataBR(fim).slice(0, 5) + "</span>" + (s.semana === sem ? '<span class="pill pill-ok">Esta semana</span>' : "") + '</div><p class="semana-foco">' + esc(s.foco) + "</p>" +
        novas.map(function (id) { return linhaMissao(g, est, IV.etapaPorId(id)); }).join("") +
        repetidas.map(function (id) { var e = IV.etapaPorId(id); return '<a class="missao-lembrete" href="#' + g.id + "-" + e.id + '">Voltem à Missão ' + e.num + " (" + esc(e.titulo) + ") para anotar as novas medições.</a>"; }).join("") + "</section>";
    });
    h += "</div>";
    var k = g.kit;
    h += '<details class="guia"><summary>Guia do tema (dicas do professor)</summary><div class="pilha" style="padding-top:12px"><p>' + esc(k.resumo) + "</p>" +
      '<div class="grade-3">' + ["bio", "qui", "mat"].map(function (d) {
        return '<div class="col-disc disc-' + d + '"><h4>' + IV.DISCIPLINAS[d].nome + '</h4><ul class="lista">' + k[d].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div>" +
      '<div class="grade-2"><div class="perigo-caixa"><b>Segurança</b><ul class="lista">' + k.seguranca.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div><div class="aviso-caixa"><b>Erros comuns</b><ul class="lista">' + k.armadilhas.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" +
      (k.conexoes ? '<p class="suave"><b>Outros grupos que podem ajudar:</b> ' + esc(k.conexoes) + "</p>" : "") + "</div></details>";
    h += '<p class="lembrete-salvar">No fim de cada aula, toquem em <a href="#' + g.id + '-salvar"><b>Salvar</b></a> e enviem o arquivo ao professor.</p>';
    alvo.innerHTML = h;
  }

  /* ---------------- Uma missão, passo a passo ---------------- */
  function chavePasso(g, e) { return g.id + ":" + e.id; }
  function telaMissao(g, est, e, alvo) {
    var k = chavePasso(g, e);
    if (ui.passo[k] === undefined) ui.passo[k] = passoInicial(est, e);
    var passo = ui.passo[k], n = e.perguntas.length;
    var dots = '<ol class="passos-dots" aria-label="Passos da missão">' +
      '<li><button type="button" class="dot dot-intro' + (passo === 0 ? " atual" : "") + '" data-acao="ir-passo" data-i="0"' + (passo === 0 ? ' aria-current="step"' : "") + ">Início</button></li>" +
      e.perguntas.map(function (p, i) {
        return '<li><button type="button" id="dot-' + (i + 1) + '" class="dot' + (respondida(est, e, p) ? " feito" : "") + (passo === i + 1 ? " atual" : "") + '" data-acao="ir-passo" data-i="' + (i + 1) + '" aria-label="Pergunta ' + (i + 1) + '"' + (passo === i + 1 ? ' aria-current="step"' : "") + ">" + (i + 1) + "</button></li>";
      }).join("") +
      '<li><button type="button" class="dot dot-intro' + (passo === n + 1 ? " atual" : "") + '" data-acao="ir-passo" data-i="' + (n + 1) + '"' + (passo === n + 1 ? ' aria-current="step"' : "") + ">Fim</button></li></ol>";
    var topo = '<div class="missao-topo"><a class="voltar" href="#' + g.id + '">← Todas as missões</a><span class="rotulo-caps">Missão ' + e.num + " de " + IV.ETAPAS.length + '</span></div><h1 class="missao-titulo">' + esc(e.titulo) + "</h1>" + dots;
    var corpo = passo === 0 ? introMissao(g, est, e) : passo <= n ? perguntaMissao(g, est, e, passo) : fimMissao(g, est, e);
    alvo.innerHTML = '<div class="missao">' + topo + '<div class="missao-corpo">' + corpo + "</div></div>";
    if (passo >= 1 && passo <= n) {
      IV.form.aposRender(est, e, e.perguntas[passo - 1]);
      var campo = alvo.querySelector(".q-input");
      if (campo && !("ontouchstart" in window)) campo.focus({ preventScroll: true });
    }
  }
  function introMissao(g, est, e) {
    var ps = passoInicial(est, e), n = e.perguntas.length;
    var h = '<div class="cartao-missao"><div class="pilha-p"><span class="rotulo-caps">Por que esta missão importa</span><p class="grande">' + esc(e.porque) + "</p></div>" +
      '<div class="pilha-p"><span class="rotulo-caps">Hoje vocês vão</span><ol class="hoje">' + e.hoje.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></div>" +
      '<p class="suave">São ' + n + " perguntas, uma de cada vez. Tempo: " + esc(e.tempo) + ". Tudo é salvo sozinho.</p>";
    if (e.introKit && g.kit[e.introKit]) {
      var v = g.kit[e.introKit];
      h += '<div class="' + (e.introKit === "armadilhas" ? "aviso-caixa" : "ok-caixa") + '"><b>' + esc(IV.KIT_DICAS[e.introKit]) + "</b>" + (Array.isArray(v) ? '<ul class="lista">' + v.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "<p>" + esc(v) + "</p>") + "</div>";
    }
    if (e.id === "e2" || e.id === "e5" || e.id === "e6") {
      h += '<div class="dica-ia"><b>Dica:</b> nesta missão, a ajuda da IA "' + esc(IV.promptPorId(e.prompts[0]).titulo) + '" ajuda muito. Ela está no fim da missão e na aba Ajuda da IA.</div>';
    }
    h += '<div class="nav-passos"><span></span><button type="button" class="btn btn-grande btn-w" data-acao="ir-passo" data-i="' + (ps === 0 || ps > n ? 1 : ps) + '">' + (ps === 0 ? "Começar" : ps > n ? "Revisar as respostas" : "Continuar da pergunta " + ps) + " →</button></div></div>";
    return h;
  }
  function perguntaMissao(g, est, e, passo) {
    var p = e.perguntas[passo - 1], n = e.perguntas.length, v = (est.respostas[e.id] || {})[p.id];
    var h = '<div class="cartao-missao"><span class="rotulo-caps">Pergunta ' + passo + " de " + n + "</span>" + IV.form.campo(g, e, p, v);
    if (ui.avisoVazio) {
      h += '<div class="aviso-caixa" id="aviso-vazio">Esta pergunta é importante para o projeto. Escrevam pelo menos uma frase. Se ainda não sabem, podem pular e voltar depois.<div class="linha-flex" style="margin-top:8px"><button type="button" class="btn btn-peq" data-acao="ir-passo" data-i="' + (passo + 1) + '">Pular por enquanto</button></div></div>';
    }
    h += '<div class="nav-passos"><button type="button" class="btn" data-acao="ir-passo" data-i="' + (passo - 1) + '">← Voltar</button>' +
      '<button type="button" class="btn btn-grande btn-w" data-acao="proxima" data-i="' + (passo + 1) + '">' + (passo === n ? "Terminar missão" : "Próxima") + " →</button></div></div>";
    return h;
  }
  function cartaoIA(g, est, pid, destaque, suf) {
    suf = suf || "";
    var p = IV.promptPorId(pid), pr = IV.prontidao(p, est);
    return '<div class="ia-card' + (destaque ? " destaque" : "") + '"><div class="pilha-p"><b class="ia-tit">' + esc(p.titulo) + '</b><span class="suave">' + esc(p.descricao) + "</span>" +
      (pr.faltam.length ? '<span class="pcard-falta">Fica melhor depois de terminar: ' + pr.faltam.map(function (e) { return "Missão " + e.num; }).join(", ") + "</span>" : "") + "</div>" +
      '<details class="ajuda-box"><summary>Querem pedir algo a mais? (opcional)</summary><textarea id="extra-' + pid + suf + '" data-k="extra" data-p="' + pid + '" rows="2" aria-label="Pedido a mais" placeholder="' + (pid === "p_checagem" ? "Colem aqui a informação que querem checar" : "Ex.: expliquem com mais exemplos") + '">' + esc(ui.extras[pid] || "") + "</textarea></details>" +
      '<div class="linha-flex"><button type="button" class="btn btn-w" data-acao="copiar-ia" data-p="' + pid + '">Copiar pergunta para a IA</button></div>' +
      '<details class="ajuda-box"><summary>Ver o texto que vai ser copiado</summary><pre class="prompt-pre" id="pre-' + pid + suf + '" data-pre="' + pid + '">' + esc(IV.montarPrompt(pid, g, est, cfg(), null, ui.extras[pid] || "")) + "</pre></details></div>";
  }
  function comoUsarIAHTML() {
    return '<ol class="passos-ia"><li><b>Toquem em "Copiar pergunta para a IA".</b></li><li><b>Abram uma IA:</b> <a href="https://chatgpt.com" target="_blank" rel="noopener">ChatGPT</a>, <a href="https://gemini.google.com" target="_blank" rel="noopener">Gemini</a>, <a href="https://copilot.microsoft.com" target="_blank" rel="noopener">Copilot</a> ou <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a>.</li><li><b>Colem e enviem.</b> No celular, segurem o dedo na caixa de texto e toquem em Colar. No computador, Ctrl+V.</li><li><b>Leiam com calma.</b> A IA responde em partes: escrevam CONTINUAR para ver a próxima. Depois voltem aqui e melhorem as respostas com as palavras de vocês.</li></ol>';
  }
  function fimMissao(g, est, e) {
    var faltam = e.perguntas.filter(function (p) { return p.obrig && !respondida(est, e, p); });
    var idx = IV.ETAPAS.indexOf(e), prox = IV.ETAPAS[idx + 1];
    var h = '<div class="cartao-missao">';
    h += faltam.length ? '<h2 class="q-titulo">Quase lá!</h2><p class="grande">Falta' + (faltam.length > 1 ? "m " : " ") + faltam.length + " pergunta" + (faltam.length > 1 ? "s importantes" : " importante") + ". Toquem para responder:</p>"
      : '<h2 class="q-titulo">Missão ' + e.num + ' concluída!</h2><p class="grande">Muito bem. Confiram as respostas e depois peçam ajuda à IA para melhorar.</p>';
    h += '<ul class="resumo-respostas">' + e.perguntas.map(function (p, i) {
      var ok = respondida(est, e, p);
      return '<li class="' + (ok ? "ok" : p.obrig ? "falta" : "opc") + '"><button type="button" data-acao="ir-passo" data-i="' + (i + 1) + '"><span class="r-ico" aria-hidden="true">' + (ok ? "✓" : p.obrig ? "!" : "–") + '</span><span class="r-txt">' + esc(p.pergunta) + '</span><span class="r-est">' + (ok ? "respondida" : p.obrig ? "falta responder" : "opcional") + "</span></button></li>";
    }).join("") + "</ul></div>";
    h += '<section class="cartao-missao"><h2 class="q-titulo">Agora, peçam ajuda à IA</h2><p>A IA vai ler o que vocês escreveram e ajudar a melhorar. Façam assim:</p>' + comoUsarIAHTML() +
      e.prompts.map(function (pid, i) { return cartaoIA(g, est, pid, i === 0); }).join("") + "</section>";
    h += '<section class="cartao-missao"><h2 class="q-titulo">Anotem no diário</h2><p>Uma frase sobre o que a equipe fez ou decidiu hoje.</p>' +
      '<textarea id="diario-rapido" class="q-input" rows="3" aria-label="Frase para o diário"></textarea><div class="comecos"><span class="comecos-rot">Comecem com:</span>' +
      ["Hoje nós ", "Decidimos que ", "A IA ajudou a ", "Conferimos que "].map(function (c) { return '<button type="button" class="comeco" data-acao="inserir" data-alvo="diario-rapido" data-txt="' + esc(c) + '" data-lista="0">' + esc(c.trim()) + "…</button>"; }).join("") +
      '</div><div><button type="button" class="btn" data-acao="diario-rapido">Salvar no diário</button></div></section>';
    h += '<div class="nav-passos"><a class="btn" href="#' + g.id + '">← Todas as missões</a>' + (prox ? '<a class="btn btn-grande btn-w" href="#' + g.id + "-" + prox.id + '">Missão ' + prox.num + ": " + esc(prox.titulo) + " →</a>" : '<a class="btn btn-grande btn-w" href="#' + g.id + '-projeto">Ver o projeto completo →</a>') + "</div>";
    return h;
  }
  function irPasso(i) {
    var g = IV.grupoPorId(atual.gid), e = atual.etapa, k = chavePasso(g, e), n = e.perguntas.length;
    ui.avisoVazio = false;
    ui.passo[k] = Math.max(0, Math.min(n + 1, i));
    salvarAgora();
    telaMissao(g, atual.estado, e, document.getElementById("conteudo"));
    var topo = document.querySelector(".missao");
    if (topo) topo.scrollIntoView({ block: "start" });
  }

  /* ---------------- Aba Ajuda da IA ---------------- */
  function abaIA(g, est, alvo) {
    var prox = proximaMissao(est) || IV.ETAPAS[IV.ETAPAS.length - 1];
    var usados = {};
    var h = '<div class="pilha"><section class="cartao-missao"><h2 class="q-titulo">Como pedir ajuda à IA</h2>' + comoUsarIAHTML() +
      '<div class="aviso-caixa"><b>Regras de ouro</b><ul class="lista"><li>Não copiem a resposta da IA direto no projeto. Leiam e escrevam com as palavras de vocês.</li><li>Tudo que vier com [VERIFICAR] precisa ser conferido em outro lugar.</li><li>Nada de soda cáustica, fogo, gás ou ferramenta de corte sem o professor.</li></ul></div></section>';
    h += '<section class="pilha"><h2>Para a missão de agora (Missão ' + prox.num + ": " + esc(prox.titulo) + ")</h2>" + prox.prompts.map(function (pid, i) { return cartaoIA(g, est, pid, i === 0); }).join("") + "</section>";
    h += '<section class="pilha"><h2>Todas as ajudas, por missão</h2>';
    IV.ETAPAS.forEach(function (e) {
      h += '<details class="grupo-ia"><summary>Missão ' + e.num + ": " + esc(e.titulo) + ' <span class="suave">(' + e.prompts.length + ')</span></summary><div class="pilha" style="padding-top:10px">' +
        e.prompts.map(function (pid) { usados[pid] = 1; return cartaoIA(g, est, pid, false, "-" + e.id); }).join("") + "</div></details>";
    });
    var outros = IV.PROMPTS.filter(function (p) { return !usados[p.id]; });
    if (outros.length) h += '<details class="grupo-ia"><summary>Outras ajudas <span class="suave">(' + outros.length + ')</span></summary><div class="pilha" style="padding-top:10px">' + outros.map(function (p) { return cartaoIA(g, est, p.id, false, "-outros"); }).join("") + "</div></details>";
    alvo.innerHTML = h + "</section></div>";
  }
  function copiarIA(pid, botao) {
    var g = IV.grupoPorId(atual.gid);
    var texto = IV.montarPrompt(pid, g, atual.estado, cfg(), null, ui.extras[pid] || "");
    document.querySelectorAll('[data-pre="' + pid + '"]').forEach(function (pre) { pre.textContent = texto; });
    var card = botao && botao.closest(".ia-card");
    copiar(texto, card ? card.querySelector("pre") : null, "Copiado! Agora abram a IA, colem e enviem.");
    atual.estado.usoPrompts.push({ id: pid, data: U.hojeISO() }); salvarAgora();
  }

  /* ---------------- Diário ---------------- */
  var TIPOS_DIARIO = ["O que fizemos", "Decisão", "Medição", "Problema", "Uso da IA", "Conversa com alguém"];
  function abaDiario(g, est, alvo) {
    var h = '<div class="pilha"><section class="cartao-missao"><h2 class="q-titulo"><label for="d-texto">O que a equipe fez hoje?</label></h2><p class="q-ajuda">Escrevam uma ou duas frases. O diário mostra ao professor e aos jurados como vocês trabalharam.</p>' +
      '<textarea id="d-texto" class="q-input" rows="3"></textarea><div class="comecos"><span class="comecos-rot">Comecem com:</span>' +
      ["Hoje nós ", "Decidimos que ", "Medimos ", "A IA ajudou a ", "Conferimos que ", "Tivemos um problema: "].map(function (c) { return '<button type="button" class="comeco" data-acao="inserir" data-alvo="d-texto" data-txt="' + esc(c) + '" data-lista="0">' + esc(c.trim()) + "…</button>"; }).join("") + "</div>" +
      '<div class="diario-form"><div class="campo"><label for="d-data">Data</label><input type="date" id="d-data" value="' + U.hojeISO() + '"></div>' +
      '<div class="campo"><label for="d-tipo">Tipo</label><select id="d-tipo">' + TIPOS_DIARIO.map(function (t) { return "<option>" + t + "</option>"; }).join("") + "</select></div>" +
      '<div class="campo"><label for="d-autor">Quem escreve</label><select id="d-autor"><option>Equipe toda</option>' + g.integrantes.map(function (n) { return "<option>" + esc(n) + "</option>"; }).join("") + "</select></div></div>" +
      '<div><button type="button" class="btn btn-w" data-acao="diario-add">Salvar no diário</button></div></section>';
    var lista = (est.diario || []).slice().sort(function (a, b) { return a.data < b.data ? 1 : a.data > b.data ? -1 : 0; });
    h += '<section class="bloco"><div class="bloco-tit"><h3>Anotações</h3><span class="suave num">' + lista.length + "</span></div>" +
      (lista.length ? '<div class="diario-lista">' + lista.map(function (d) {
        return '<div class="registro"><span class="registro-data">' + U.dataBR(d.data) + '</span><div class="pilha-p"><span class="registro-tipo">' + esc(d.tipo) + (d.autor ? " · " + esc(d.autor) : "") + '</span><p style="white-space:pre-wrap">' + esc(d.texto) + "</p></div>" +
          (ui.confirmar === "d:" + d.id ? '<div class="confirma"><span>Apagar?</span><button type="button" class="btn btn-perigo btn-peq" data-acao="diario-del" data-id="' + d.id + '">Apagar</button><button type="button" class="btn btn-peq" data-acao="cancelar">Não</button></div>' : '<button type="button" class="btn btn-fantasma btn-peq" data-acao="pedir-conf" data-c="d:' + d.id + '" aria-label="Apagar anotação">×</button>') + "</div>";
      }).join("") + "</div>" : '<p class="suave">Nenhuma anotação ainda.</p>') + "</section></div>";
    alvo.innerHTML = h;
  }

  /* ---------------- Nosso projeto ---------------- */
  function dossieHTML(g, est) {
    var h = '<section><span class="rotulo-caps">' + esc(IV.PROJETO.nome) + " · " + esc(g.rotulo) + '</span><h1 style="font-size:clamp(1.6rem,4vw,2.4rem)">' + esc(g.tema) + '</h1><p class="suave">' + esc(g.integrantes.join(", ")) + " · " + U.dataBR(U.hojeISO()) + "</p></section>";
    IV.ETAPAS.forEach(function (e) {
      var r = (est.respostas && est.respostas[e.id]) || {};
      h += "<section><h2>Missão " + e.num + ": " + esc(e.titulo) + "</h2><dl>";
      e.perguntas.forEach(function (p) {
        var v = r[p.id], tem = U.preenchido(p, v);
        if (!tem && !p.obrig) return;
        h += "<dt>" + esc(p.rotulo) + "</dt>";
        if (!tem) { h += '<dd class="vazio">Ainda não respondido</dd>'; return; }
        if (p.tipo === "dados") {
          h += '<dd><div class="tab-rolagem"><table class="tab"><thead><tr>' + v.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
            v.rows.filter(function (row) { return row.some(function (x) { return String(x || "").trim(); }); }).map(function (row) { return "<tr>" + v.cols.map(function (_, i) { return '<td class="' + (i ? "num" : "") + '">' + esc(row[i] || "") + "</td>"; }).join("") + "</tr>"; }).join("") +
            "</tbody></table></div>" + '<p style="margin-top:8px;white-space:pre-wrap">' + esc(U.estatisticasTexto(v)) + "</p></dd>";
        } else h += "<dd>" + esc(U.texto(p, v)) + "</dd>";
      });
      h += "</dl></section>";
    });
    if (est.diario && est.diario.length) {
      h += "<section><h2>Diário</h2><dl>" + est.diario.slice().sort(function (a, b) { return a.data > b.data ? 1 : -1; }).map(function (d) { return "<dt>" + U.dataBR(d.data) + " · " + esc(d.tipo) + (d.autor ? " · " + esc(d.autor) : "") + "</dt><dd>" + esc(d.texto) + "</dd>"; }).join("") + "</dl></section>";
    }
    return h;
  }
  function dossieMarkdown(g, est) {
    var secoes = IV.ETAPAS.map(function (e) { return e.id; }).concat(["diario"]);
    return "# " + g.rotulo + ": " + g.tema + "\n\n" + IV.contexto(g, est, secoes, cfg()).replace(/^## Sobre nós/, "## Identificação");
  }
  function abaProjeto(g, est, alvo) {
    var faltam = IV.ETAPAS.filter(function (e) { return progM(est, e).pct < 100; });
    var h = '<div class="pilha"><div class="bloco-tit"><div class="pilha-p"><h2>Nosso projeto</h2><p class="suave">Tudo o que a equipe escreveu, organizado em um documento. Serve para o relatório, o banner e a apresentação.</p></div><div class="linha-flex">' +
      '<button type="button" class="btn" data-acao="copiar-dossie">Copiar tudo</button><button type="button" class="btn btn-w" data-acao="baixar-html">Baixar documento</button></div></div>';
    if (faltam.length) h += '<div class="aviso-caixa">Missões que ainda faltam: ' + faltam.map(function (e) { return '<a href="#' + g.id + "-" + e.id + '">' + e.num + "</a>"; }).join(", ") + ".</div>";
    h += '<article class="dossie" id="dossie" style="--wh:' + hueDe(g) + '">' + dossieHTML(g, est) + "</article></div>";
    alvo.innerHTML = h;
  }
  function dossieArquivoHTML(g, est) {
    var css = "body{font-family:Georgia,serif;max-width:820px;margin:40px auto;padding:0 20px;color:#16231B;line-height:1.55}h1,h2{font-family:Arial,sans-serif}h2{border-bottom:2px solid #1C6A45;padding-bottom:4px;margin-top:32px}dt{font-weight:bold;margin-top:12px;font-family:Arial,sans-serif;font-size:.92em}dd{margin:4px 0 0;white-space:pre-wrap}table{border-collapse:collapse;margin:8px 0}td,th{border:1px solid #ccc;padding:4px 8px}.vazio{color:#888;font-style:italic}.rotulo-caps{text-transform:uppercase;letter-spacing:.08em;font-size:.75em;color:#555}.suave{color:#555}";
    return "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><title>" + esc(g.rotulo) + "</title><style>" + css + "</style></head><body>" + dossieHTML(g, est) + "</body></html>";
  }

  /* ---------------- Salvar ---------------- */
  function abaSalvar(g, est, alvo) {
    var h = '<div class="pilha">' + (S.persistente() ? "" : '<div class="perigo-caixa">Este navegador não está guardando os dados. Baixem o arquivo antes de fechar a página.</div>') +
      '<section class="cartao-missao"><h2 class="q-titulo">Fim da aula? Salvem o trabalho</h2><ol class="passos-ia">' +
      '<li><b>Toquem no botão abaixo</b> para baixar o arquivo do grupo.<div style="margin-top:10px"><button type="button" class="btn btn-grande btn-w" data-acao="exportar">Baixar arquivo do grupo</button></div></li>' +
      "<li><b>Enviem o arquivo ao professor</b> (WhatsApp, e-mail ou Classroom).</li>" +
      "<li><b>Guardem uma cópia</b> no Drive ou no celular de alguém da equipe.</li></ol>" +
      '<p class="suave">Última alteração: ' + (est.atualizado ? U.dataBR(est.atualizado) + " às " + new Date(est.atualizado).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "nenhuma") + "</p></section>" +
      '<section class="cartao-missao"><h2 class="q-titulo">Vão usar outro celular ou computador?</h2><p>Abram este site no outro aparelho, entrem no grupo, venham até aqui e escolham o arquivo que baixaram.</p>' +
      '<div class="campo"><label for="imp-arq">Escolher o arquivo do grupo</label><input type="file" id="imp-arq" accept=".json,application/json" data-k="import-grupo"></div>' +
      '<details class="ajuda-box"><summary>Não conseguem baixar arquivos?</summary><p>Toquem em "Copiar como texto" e colem numa conversa com vocês mesmos no WhatsApp. No outro aparelho, colem o texto no campo abaixo.</p><div class="linha-flex"><button type="button" class="btn" data-acao="copiar-backup">Copiar como texto</button></div>' +
      '<label class="q-outro" for="imp-txt">Colar o texto aqui</label><textarea id="imp-txt" rows="3"></textarea><div><button type="button" class="btn" data-acao="importar-texto">Abrir o texto colado</button></div></details></section>' +
      '<details class="ajuda-box" id="zona-apagar"' + (ui.confirmar === "limpar" ? " open" : "") + '><summary>Apagar tudo deste grupo</summary><p class="suave">Apaga as respostas e o diário deste grupo neste aparelho.' + (g.exemplo ? " No exemplo, volta para a versão original." : "") + "</p>" +
      (ui.confirmar === "limpar" ? '<div class="confirma"><span>Tem certeza? Sem o arquivo salvo, não dá para desfazer.</span><button type="button" class="btn btn-perigo btn-peq" data-acao="limpar">Sim, apagar</button><button type="button" class="btn btn-peq" data-acao="cancelar">Cancelar</button></div>' : '<button type="button" class="btn btn-perigo" data-acao="pedir-conf" data-c="limpar">' + (g.exemplo ? "Restaurar exemplo" : "Apagar tudo") + "</button>") + "</details></div>";
    alvo.innerHTML = h;
  }

  /* ================================================ PROFESSOR */
  function telaProfessor() {
    var c = cfg();
    var h = '<div class="pagina pilha"><div class="pilha-p"><span class="rotulo-caps">Painel do professor</span><h1 style="font-size:clamp(1.8rem,4vw,2.6rem)">Acompanhamento da turma</h1><p class="suave" style="max-width:75ch">Cada grupo trabalha no próprio aparelho. Para ver tudo aqui, peça o arquivo de cada grupo (aba Salvar) e importe todos de uma vez.</p></div>';
    h += '<div class="grade-2"><section class="bloco"><h3>Importar arquivos dos grupos</h3><div class="campo"><label for="imp-varios">Selecione um ou vários arquivos .json</label><input type="file" id="imp-varios" multiple accept=".json,application/json" data-k="import-varios"></div><div id="imp-res"></div><div><button type="button" class="btn" data-acao="exportar-turma">Baixar arquivo da turma inteira</button></div></section>' +
      '<section class="bloco"><h3>Datas do projeto</h3><div class="grade-2"><div class="campo"><label for="cfg-ini">Início (semana 1)</label><input type="date" id="cfg-ini" value="' + c.inicio + '"></div><div class="campo"><label for="cfg-feira">Dia da feira</label><input type="date" id="cfg-feira" value="' + c.feira + '"></div></div><div><button type="button" class="btn btn-pri" data-acao="salvar-config">Salvar datas</button></div><p class="dica suave" style="font-size:.88rem">Estas datas ficam só neste aparelho. Para todos verem as mesmas datas, altere inicioPadrao e feiraPadrao em js/dados.js.</p></section></div>';
    h += '<section class="bloco"><div class="bloco-tit"><h3>Progresso por missão</h3><span class="suave" style="font-size:.88rem">% das perguntas importantes respondidas (dados deste aparelho)</span></div><div class="tab-rolagem"><table class="tab tab-painel"><thead><tr><th>Grupo</th>' +
      IV.ETAPAS.map(function (e) { return '<th title="' + esc(e.titulo) + '">M' + e.num + "</th>"; }).join("") + "<th>Total</th><th>Diário</th><th>IA</th><th>Atualizado</th></tr></thead><tbody>";
    IV.GRUPOS.forEach(function (g) {
      var est = S.carregar(g.id);
      h += '<tr><td><a href="#' + g.id + '"><b>' + esc(g.rotulo) + '</b></a><br><span class="suave" style="font-size:.82rem">' + esc(g.tema) + "</span></td>" +
        IV.ETAPAS.map(function (e) { var p = progM(est, e).pct; return '<td><span class="celula-pct ' + (p === 100 ? "c2" : p > 0 ? "c1" : "c0") + '">' + p + "</span></td>"; }).join("") +
        '<td class="num"><b>' + U.progressoGeral(est) + '%</b></td><td class="num">' + (est.diario || []).length + '</td><td class="num">' + (est.usoPrompts || []).length + '</td><td class="num">' + (est.atualizado ? U.dataBR(est.atualizado) : "–") + "</td></tr>";
    });
    h += "</tbody></table></div></section>";
    h += '<section class="bloco"><h3>Como conduzir cada aula</h3><ol class="lista">' +
      "<li><b>Ritmo:</b> 12 missões em " + IV.CRONOGRAMA.length + " semanas, 2 ou 3 por semana. Cada missão leva de 15 a 40 minutos.</li>" +
      "<li><b>Abertura (5 min):</b> cada grupo abre a página e toca em \"Continuar\".</li>" +
      "<li><b>Missão (20 a 30 min):</b> uma pergunta por tela, com começos de frase e um exemplo de outro tema. Circule pela sala e cobre frases com número.</li>" +
      "<li><b>Ajuda da IA (10 min):</b> no fim de cada missão há o botão \"Copiar pergunta para a IA\". A IA foi instruída a responder em partes curtas e em linguagem simples.</li>" +
      "<li><b>Fechamento (5 min):</b> uma frase no diário e o arquivo do grupo enviado a você (aba Salvar).</li></ol>" +
      '<p class="suave" style="font-size:.9rem">Modo da IA atual: <b>' + esc((IV.MODOS.find(function (m) { return m.id === IV.PROJETO.modoIA; }) || IV.MODOS[1]).nome) + "</b>. Para mudar para Tutor (a IA só dá dicas e faz perguntas) ou Especialista, altere modoIA em js/dados.js. Use \"Simula os jurados da feira\" como ensaio e faça perguntas orais: o domínio do conteúdo aparece na fala, não no texto.</p></section>";
    h += '<section class="bloco"><h3>Rubrica da feira</h3><div class="tab-rolagem"><table class="tab"><thead><tr><th>Critério</th><th class="num">Peso</th><th>O que se espera</th></tr></thead><tbody>' +
      IV.RUBRICA.map(function (r) { return "<tr><td><b>" + esc(r.criterio) + '</b></td><td class="num">' + String(r.peso).replace(".", ",") + "</td><td>" + esc(r.descricao) + "</td></tr>"; }).join("") + "</tbody></table></div></section>";
    h += '<details class="ajuda-box"' + (ui.confirmar === "limpar-tudo" ? " open" : "") + "><summary>Apagar dados de todos os grupos neste aparelho</summary>" +
      (ui.confirmar === "limpar-tudo" ? '<div class="confirma"><span>Apagar todos os grupos deste aparelho?</span><button type="button" class="btn btn-perigo btn-peq" data-acao="limpar-tudo">Sim, apagar tudo</button><button type="button" class="btn btn-peq" data-acao="cancelar">Cancelar</button></div>' : '<button type="button" class="btn btn-perigo" data-acao="pedir-conf" data-c="limpar-tudo">Apagar tudo</button>') + "</details></div>";
    app.innerHTML = h;
    document.title = "Professor · Incubadora Verde";
  }

  /* ================================================ COMO USAR */
  function telaComoUsar() {
    var passos = [
      ["Entrem no grupo", "Na página inicial, toquem no cartão do grupo de vocês."],
      ["Toquem em \"Continuar\"", "O sistema mostra qual é a próxima missão. São 12 missões curtas."],
      ["Respondam uma pergunta por vez", "Leiam a pergunta e a dica. Se travarem, toquem num começo de frase ou em \"Ver um exemplo\". Tudo é salvo sozinho."],
      ["No fim da missão, peçam ajuda à IA", "Toquem em \"Copiar pergunta para a IA\", abram o ChatGPT, Gemini, Copilot ou Claude, colem e enviem. Leiam a resposta e melhorem o que escreveram, com as palavras de vocês."],
      ["Anotem no diário", "Uma frase sobre o que fizeram ou decidiram."],
      ["Salvem no fim da aula", "Na aba Salvar, baixem o arquivo e enviem ao professor."]
    ];
    var h = '<div class="pagina pilha" style="max-width:820px"><div class="pilha-p"><span class="rotulo-caps">Como usar</span><h1 style="font-size:clamp(1.8rem,4vw,2.6rem)">Seis passos, toda aula</h1></div>' +
      '<ol class="passos-grandes">' + passos.map(function (p) { return "<li><b>" + p[0] + "</b><span>" + p[1] + "</span></li>"; }).join("") + "</ol>" +
      '<div class="aviso-caixa"><b>Regras de ouro da IA</b><ul class="lista"><li>A IA ajuda, mas quem decide é a equipe.</li><li>Não copiem a resposta da IA direto. Escrevam com as palavras de vocês: os jurados vão perguntar.</li><li>O que vier com [VERIFICAR] precisa ser conferido em outro lugar.</li><li>Nada perigoso sem o professor.</li></ul></div>' +
      '<p><a class="btn btn-grande btn-pri" href="#ex">Ver um projeto pronto de exemplo</a></p></div>';
    app.innerHTML = h;
    document.title = "Como usar · Incubadora Verde";
  }

  /* ================================================ EVENTOS */
  app.addEventListener("input", function (ev) {
    var el = ev.target, k = el.dataset && el.dataset.k;
    if (!k) return;
    if (k === "extra") {
      ui.extras[el.dataset.p] = el.value;
      var novoTxt = atual.gid ? IV.montarPrompt(el.dataset.p, IV.grupoPorId(atual.gid), atual.estado, cfg(), null, el.value) : "";
      document.querySelectorAll('[data-pre="' + el.dataset.p + '"]').forEach(function (pre) { pre.textContent = novoTxt; });
      document.querySelectorAll('textarea[data-k="extra"][data-p="' + el.dataset.p + '"]').forEach(function (t) { if (t !== el) t.value = el.value; });
      return;
    }
    if (k === "import-grupo" || k === "import-varios") return;
    if (atual.gid && IV.form.onInput(atual.estado, el)) {
      if (ui.avisoVazio) { ui.avisoVazio = false; var av = document.getElementById("aviso-vazio"); if (av) av.remove(); }
      agendarSalvar(); atualizarProgressoUI();
    }
  });
  app.addEventListener("change", function (ev) {
    var el = ev.target, k = el.dataset && el.dataset.k;
    if (!k) return;
    if (k === "import-grupo") { lerArquivos(el.files, function (txts) { importarTextos(txts, { somenteGrupo: atual.gid }); }); return; }
    if (k === "import-varios") { lerArquivos(el.files, function (txts) { importarTextos(txts, {}); }); return; }
    if (k === "radio" || k === "multi" || k === "papel" || k === "gcol" || k === "gtipo") {
      if (atual.gid && IV.form.onInput(atual.estado, el)) { agendarSalvar(); atualizarProgressoUI(); }
    }
  });
  function lerArquivos(files, cb) {
    var arr = Array.prototype.slice.call(files || []), txts = [], n = arr.length;
    if (!n) return;
    arr.forEach(function (f) {
      var r = new FileReader();
      r.onload = function () { txts.push({ nome: f.name, texto: String(r.result) }); if (txts.length === n) cb(txts); };
      r.onerror = function () { txts.push({ nome: f.name, texto: "" }); if (txts.length === n) cb(txts); };
      r.readAsText(f);
    });
  }
  function importarTextos(txts, opcoes) {
    var ok = [], erros = [];
    txts.forEach(function (t) { try { ok = ok.concat(S.importar(t.texto, opcoes)); } catch (e) { erros.push(t.nome + ": " + e.message); } });
    if (atual.gid) {
      if (ok.indexOf(atual.gid) >= 0) { atual.estado = S.carregar(atual.gid); ui.passo = {}; }
      if (erros.length) toast(erros[0]); else { toast("Trabalho do grupo recuperado."); location.hash = atual.gid; }
    } else {
      telaProfessor();
      var res = document.getElementById("imp-res");
      if (res) res.innerHTML = (ok.length ? '<div class="ok-caixa">Importados: ' + ok.map(function (id) { return esc(IV.grupoPorId(id).rotulo); }).join(", ") + "</div>" : "") + (erros.length ? '<div class="perigo-caixa">' + erros.map(esc).join("<br>") + "</div>" : "");
    }
  }
  function inserirTexto(el) {
    var alvo = document.getElementById(el.dataset.alvo); if (!alvo) return;
    var txt = el.dataset.txt, v = alvo.value;
    if (v && el.dataset.lista === "1" && !/\n$/.test(v)) v += "\n";
    else if (v && el.dataset.lista !== "1" && !/\s$/.test(v) && !/^[ ,.]/.test(txt)) v += " ";
    alvo.value = v + txt;
    alvo.dispatchEvent(new Event("input", { bubbles: true }));
    alvo.focus();
    try { alvo.setSelectionRange(alvo.value.length, alvo.value.length); } catch (e) { /* ignora */ }
  }

  app.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-acao]"); if (!el) return;
    var acao = el.dataset.acao, g = atual.gid ? IV.grupoPorId(atual.gid) : null, est = atual.estado;
    if (g && atual.etapa && IV.form.onAcao(est, acao, el)) {
      salvarAgora();
      var y = window.scrollY; telaMissao(g, est, atual.etapa, document.getElementById("conteudo")); window.scrollTo(0, y); atualizarProgressoUI();
      return;
    }
    switch (acao) {
      case "inserir": inserirTexto(el); break;
      case "ir-passo": irPasso(+el.dataset.i); break;
      case "proxima":
        var e = atual.etapa, k = chavePasso(g, e), p = e.perguntas[ui.passo[k] - 1];
        if (p && p.obrig && !respondida(est, e, p)) {
          ui.avisoVazio = true; telaMissao(g, est, e, document.getElementById("conteudo"));
          var av = document.getElementById("aviso-vazio"); if (av) av.scrollIntoView({ block: "center" });
          return;
        }
        irPasso(+el.dataset.i); break;
      case "copiar-ia": copiarIA(el.dataset.p, el); break;
      case "diario-rapido":
        var tr = document.getElementById("diario-rapido"), txt0 = tr.value.trim();
        if (!txt0) { toast("Escrevam uma frase antes de salvar."); tr.focus(); return; }
        est.diario.push({ id: "d" + Date.now(), data: U.hojeISO(), tipo: "O que fizemos", autor: "Equipe toda", texto: "Missão " + atual.etapa.num + ": " + txt0 });
        tr.value = ""; salvarAgora(); toast("Salvo no diário."); break;
      case "diario-add":
        var txt = document.getElementById("d-texto").value.trim();
        if (!txt) { toast("Escrevam o que aconteceu antes de salvar."); document.getElementById("d-texto").focus(); return; }
        est.diario.push({ id: "d" + Date.now(), data: document.getElementById("d-data").value || U.hojeISO(), tipo: document.getElementById("d-tipo").value, autor: document.getElementById("d-autor").value, texto: txt });
        salvarAgora(); abaDiario(g, est, document.getElementById("conteudo")); toast("Salvo no diário."); break;
      case "diario-del":
        est.diario = est.diario.filter(function (d) { return d.id !== el.dataset.id; }); ui.confirmar = null; salvarAgora(); abaDiario(g, est, document.getElementById("conteudo")); break;
      case "pedir-conf": ui.confirmar = el.dataset.c; rota(); break;
      case "cancelar": ui.confirmar = null; rota(); break;
      case "copiar-dossie": copiar(dossieMarkdown(g, est), document.getElementById("dossie")); break;
      case "baixar-html": baixar(slug(g.rotulo) + "-projeto.html", dossieArquivoHTML(g, est), "text/html"); break;
      case "exportar": salvarAgora(); baixar(slug(g.rotulo) + "-" + U.hojeISO() + ".json", S.exportarGrupo(g.id), "application/json"); break;
      case "copiar-backup": salvarAgora(); copiar(S.exportarGrupo(g.id), null, "Copiado! Colem numa conversa para guardar."); break;
      case "importar-texto":
        var t = document.getElementById("imp-txt").value.trim();
        if (!t) { toast("Colem o texto primeiro."); return; }
        importarTextos([{ nome: "texto colado", texto: t }], { somenteGrupo: g.id }); break;
      case "limpar":
        S.limpar(g.id); atual.estado = S.carregar(g.id); ui.confirmar = null; ui.passo = {}; toast(g.exemplo ? "Exemplo restaurado." : "Dados apagados."); rota(); break;
      case "salvar-config":
        var ini = document.getElementById("cfg-ini").value, fe = document.getElementById("cfg-feira").value;
        if (!ini || !fe || fe <= ini) { toast("A feira precisa ser depois do início."); return; }
        S.salvarConfig({ inicio: ini, feira: fe }); toast("Datas salvas."); break;
      case "exportar-turma": baixar("turma-" + U.hojeISO() + ".json", S.exportarTurma(), "application/json"); break;
      case "limpar-tudo": IV.GRUPOS.forEach(function (x) { S.limpar(x.id); }); ui.confirmar = null; toast("Dados apagados."); telaProfessor(); break;
    }
  });

  window.addEventListener("hashchange", function () { ui.confirmar = null; ui.avisoVazio = false; rota(); window.scrollTo(0, 0); });
  var redesenhar = function () {
    if (atual.gid && atual.aba === "missao" && atual.etapa) {
      var k = chavePasso(IV.grupoPorId(atual.gid), atual.etapa), p = atual.etapa.perguntas[(ui.passo[k] || 0) - 1];
      if (p) IV.form.aposRender(atual.estado, atual.etapa, p);
    }
  };
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redesenhar); } catch (e) { /* navegadores antigos */ }
  var tmr; window.addEventListener("resize", function () { clearTimeout(tmr); tmr = setTimeout(redesenhar, 200); });
  new MutationObserver(redesenhar).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  rota();
})();
