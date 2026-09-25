/* =====================================================================
   INCUBADORA VERDE · formulario.js
   Desenha UMA pergunta por vez (com ajudas) e trata o que os alunos
   digitam. Componentes especiais: papéis, tabela de medições e
   calculadora do negócio, todos explicados em frases simples.
   ===================================================================== */
window.IV = window.IV || {};

IV.form = (function () {
  var U = IV.util, esc = U.esc;

  function resp(estado, eid) {
    estado.respostas[eid] = estado.respostas[eid] || {};
    return estado.respostas[eid];
  }
  function idCampo(eid, qid, extra) { return "f-" + eid + "-" + qid + (extra !== undefined ? "-" + extra : ""); }

  function tabelaPadrao() {
    return { cols: ["Amostra ou dia", "Resultado (unidade)"], rows: [["", ""], ["", ""], ["", ""], ["", ""]], graf: { col: 1, tipo: "barra" } };
  }
  function finPadrao() {
    return { unidade: "", fixos: [{ item: "", valor: "" }], variaveis: [{ item: "", valor: "" }], preco: "", meta: "", impactoQtd: "", impactoUnid: "" };
  }

  /* ---------------- Ajudas ---------------- */
  function ajudas(grupo, e, p, id) {
    var h = "";
    var comecos = p.comecosMembros ? grupo.integrantes.map(function (n) { return n + ": "; }) : (p.comecos || []);
    if (comecos.length && ["longo", "lista", "texto"].indexOf(p.tipo) >= 0) {
      h += '<div class="comecos"><span class="comecos-rot">Comecem com:</span>' + comecos.map(function (c) {
        return '<button type="button" class="comeco" data-acao="inserir" data-alvo="' + id + '" data-txt="' + esc(c) + '" data-lista="' + (p.tipo === "lista" ? 1 : 0) + '">' + esc(c.trim() || c) + "…</button>";
      }).join("") + "</div>";
    }
    if (p.kitDica && grupo.kit[p.kitDica]) {
      var itens = grupo.kit[p.kitDica];
      h += '<details class="ajuda-box"><summary>' + esc(IV.KIT_DICAS[p.kitDica]) + "</summary>" +
        (Array.isArray(itens) ? '<ul class="lista">' + itens.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "<p>" + esc(itens) + "</p>") + "</details>";
    }
    if (!grupo.exemplo && ["longo", "lista", "texto"].indexOf(p.tipo) >= 0) {
      var ex = IV.EXEMPLO_ESTADO && IV.EXEMPLO_ESTADO.respostas[e.id] && IV.EXEMPLO_ESTADO.respostas[e.id][p.id];
      if (ex) h += '<details class="ajuda-box"><summary>Ver um exemplo</summary><p class="exemplo-tema">Exemplo de outro tema (borra de café). Não copiem: usem como modelo.</p><p class="exemplo-txt">' + esc(ex) + "</p></details>";
    }
    return h;
  }

  /* ---------------- Uma pergunta ---------------- */
  function campo(grupo, e, p, v) {
    var id = idCampo(e.id, p.id);
    var titulo = p.tipo === "escolha" || p.tipo === "multipla" || p.tipo === "kit" || p.tipo === "papeis" || p.tipo === "dados" || p.tipo === "financeiro"
      ? '<h2 class="q-titulo" id="' + id + '-rot">' + esc(p.pergunta) + "</h2>"
      : '<h2 class="q-titulo"><label for="' + id + '">' + esc(p.pergunta) + "</label></h2>";
    var h = titulo + (p.ajuda ? '<p class="q-ajuda">' + esc(p.ajuda) + "</p>" : "") + (p.obrig ? "" : '<p class="q-opcional">Esta pergunta é opcional.</p>');
    var da = ' data-e="' + e.id + '" data-q="' + p.id + '"';
    switch (p.tipo) {
      case "texto":
        h += '<input type="text" class="q-input" id="' + id + '"' + da + ' data-k="txt" value="' + esc(v || "") + '">'; break;
      case "longo":
        h += '<textarea class="q-input" id="' + id + '"' + da + ' data-k="txt" rows="5">' + esc(v || "") + "</textarea>"; break;
      case "lista":
        h += '<textarea class="q-input" id="' + id + '"' + da + ' data-k="txt" rows="6" placeholder="Uma por linha">' + esc(v || "") + "</textarea>"; break;
      case "escolha":
        h += '<div class="opcoes" role="radiogroup" aria-labelledby="' + id + '-rot">' + p.opcoes.map(function (o, i) {
          return '<label class="opcao"><input type="radio" name="' + id + '" id="' + id + "-" + i + '"' + da + ' data-k="radio" value="' + esc(o) + '"' + (v === o ? " checked" : "") + "><span>" + esc(o) + "</span></label>";
        }).join("") + "</div>"; break;
      case "multipla":
      case "kit":
        var opcoes = p.tipo === "kit" ? (grupo.kit[p.kitChave] || []) : p.opcoes;
        var sel = (v && v.sel) || [];
        var todas = opcoes.concat(sel.filter(function (s) { return opcoes.indexOf(s) < 0; }));
        h += '<div class="opcoes' + (p.tipo === "kit" ? " opcoes-kit" : "") + '" role="group" aria-labelledby="' + id + '-rot">' + todas.map(function (o, i) {
          return '<label class="opcao opcao-multi"><input type="checkbox" name="' + id + '" id="' + id + "-" + i + '"' + da + ' data-k="multi" value="' + esc(o) + '"' + (sel.indexOf(o) >= 0 ? " checked" : "") + "><span>" + esc(o) + "</span></label>";
        }).join("") + "</div>" +
          '<label class="q-outro" for="' + id + '-outro">Outro (opcional)</label><input type="text" id="' + id + '-outro"' + da + ' data-k="outro" value="' + esc((v && v.outro) || "") + '">'; break;
      case "papeis":
        v = v || {};
        h += '<div class="papeis-ajuda">' + IV.PAPEIS.map(function (pp) { return "<div><b>" + esc(pp.nome) + ":</b> " + esc(pp.faz) + "</div>"; }).join("") + "</div>";
        h += '<div class="papeis">' + grupo.integrantes.map(function (nome, mi) {
          var tem = v[nome] || [];
          return '<div class="papel-linha"><span class="papel-nome">' + esc(nome) + '</span><div class="opcoes">' + IV.PAPEIS.map(function (pp) {
            return '<label class="opcao opcao-multi opcao-peq"><input type="checkbox" id="' + id + "-" + mi + "-" + pp.id + '"' + da + ' data-k="papel" data-m="' + esc(nome) + '" value="' + pp.id + '"' + (tem.indexOf(pp.id) >= 0 ? " checked" : "") + "><span>" + esc(pp.nome) + "</span></label>";
          }).join("") + "</div></div>";
        }).join("") + "</div>"; break;
      case "dados":
        h += tabelaDados(e, p, v || tabelaPadrao()); break;
      case "financeiro":
        h += financeiro(e, p, v || finPadrao()); break;
    }
    h += ajudas(grupo, e, p, id);
    return '<div class="q" id="campo-' + e.id + "-" + p.id + '">' + h + "</div>";
  }

  /* ---------------- Tabela de medições ---------------- */
  function tabelaDados(e, p, t) {
    var da = ' data-e="' + e.id + '" data-q="' + p.id + '"';
    var h = '<div class="tab-rolagem"><table class="tab tab-dados"><thead><tr>';
    t.cols.forEach(function (c, ci) {
      h += '<th><div class="linha-flex" style="flex-wrap:nowrap"><input type="text" id="' + idCampo(e.id, p.id, "col" + ci) + '"' + da + ' data-k="colnome" data-c="' + ci + '" value="' + esc(c) + '" aria-label="Título da coluna ' + (ci + 1) + '">' +
        (ci > 0 && t.cols.length > 2 ? '<button type="button" class="btn btn-fantasma btn-peq" data-acao="rem-col"' + da + ' data-c="' + ci + '" aria-label="Apagar coluna ' + (ci + 1) + '">×</button>' : "") + "</div></th>";
    });
    h += '<th><span class="sr">Apagar linha</span></th></tr></thead><tbody>';
    t.rows.forEach(function (r, ri) {
      h += "<tr>" + t.cols.map(function (_, ci) {
        return '<td><input type="text"' + (ci > 0 ? ' inputmode="decimal"' : "") + ' id="' + idCampo(e.id, p.id, "r" + ri + "c" + ci) + '"' + da + ' data-k="cel" data-r="' + ri + '" data-c="' + ci + '" value="' + esc(r[ci] || "") + '" aria-label="Linha ' + (ri + 1) + ", " + esc(t.cols[ci]) + '"></td>';
      }).join("") + '<td><button type="button" class="btn btn-fantasma btn-peq" data-acao="rem-linha"' + da + ' data-r="' + ri + '" aria-label="Apagar linha ' + (ri + 1) + '">×</button></td></tr>';
    });
    h += "</tbody></table></div>";
    h += '<div class="linha-flex"><button type="button" class="btn btn-peq" data-acao="add-linha"' + da + ">+ Mais uma linha</button>" +
      (t.cols.length < 5 ? '<button type="button" class="btn btn-peq" data-acao="add-col"' + da + ">+ Mais uma coluna de números</button>" : "") + "</div>";
    h += '<div class="caixa-contas"><h3>O que as contas mostram</h3><div id="stats-' + e.id + '">' + statsHTML(t) + "</div></div>";
    var g = t.graf || { col: 1, tipo: "barra" };
    h += '<div class="grafico-caixa"><div class="linha-flex"><label class="suave" for="' + idCampo(e.id, p.id, "gcol") + '">Gráfico de</label>' +
      '<select id="' + idCampo(e.id, p.id, "gcol") + '"' + da + ' data-k="gcol" style="width:auto">' + t.cols.map(function (c, ci) { return ci === 0 ? "" : '<option value="' + ci + '"' + (g.col === ci ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select>" +
      '<select id="' + idCampo(e.id, p.id, "gtipo") + '"' + da + ' data-k="gtipo" style="width:auto" aria-label="Tipo de gráfico"><option value="barra"' + (g.tipo === "barra" ? " selected" : "") + '>Barras (comparar)</option><option value="linha"' + (g.tipo === "linha" ? " selected" : "") + ">Linha (mudança no tempo)</option></select></div>" +
      '<canvas id="graf-' + e.id + '" role="img" aria-label="Gráfico dos dados medidos"></canvas></div>';
    return h;
  }
  function statsHTML(t) {
    var st = U.estatisticas(t).filter(function (s) { return s.n > 0; });
    if (!st.length) return '<p class="suave">Quando vocês digitarem números na tabela, as contas aparecem aqui explicadas.</p>';
    var frases = st.map(function (s) {
      return '<div class="frase-conta"><b>' + esc(s.nome) + ":</b> vocês anotaram " + s.n + " número" + (s.n > 1 ? "s" : "") + ". " +
        "Somando tudo dá " + U.br(s.soma) + ". <b>Média</b> = " + U.br(s.soma) + " ÷ " + s.n + " = <b>" + U.br(s.media) + "</b>. " +
        "O <b>menor</b> valor foi " + U.br(s.min) + " e o <b>maior</b> foi " + U.br(s.max) + ".</div>";
    }).join("");
    var tabela = '<div class="tab-rolagem"><table class="tab"><thead><tr><th>Coluna</th><th class="num">Quantidade</th><th class="num">Média</th><th class="num">Mediana</th><th class="num">Menor</th><th class="num">Maior</th><th class="num">Desvio padrão</th></tr></thead><tbody>' +
      st.map(function (s) {
        return "<tr><td>" + esc(s.nome) + '</td><td class="num">' + s.n + '</td><td class="num">' + U.br(s.media) + '</td><td class="num">' + U.br(s.mediana) + '</td><td class="num">' + U.br(s.min) + '</td><td class="num">' + U.br(s.max) + '</td><td class="num">' + U.br(s.dp) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    return frases + '<details class="ajuda-box"><summary>Ver mais contas (mediana e desvio padrão)</summary>' + tabela +
      '<p><b>Mediana:</b> o número do meio quando todos estão em ordem.<br><b>Desvio padrão:</b> mostra se os números ficaram parecidos entre si (desvio pequeno) ou muito diferentes (desvio grande).</p></details>';
  }
  function desenharDados(e, t) {
    var cv = document.getElementById("graf-" + e.id); if (!cv) return;
    var g = t.graf || { col: 1, tipo: "barra" };
    var col = Math.min(g.col || 1, t.cols.length - 1);
    var linhas = t.rows.filter(function (r) { return String(r[0] || "").trim() || isFinite(U.num(r[col])); });
    IV.graficos.desenhar(cv, {
      tipo: g.tipo, rotulos: linhas.map(function (r, i) { return String(r[0] || "").trim() || "Linha " + (i + 1); }),
      series: [{ nome: t.cols[col], cor: IV.graficos.token("--serie-a"), valores: linhas.map(function (r) { return U.num(r[col]); }) }]
    });
  }

  /* ---------------- Calculadora do negócio ---------------- */
  function financeiro(e, p, f) {
    var da = ' data-e="' + e.id + '" data-q="' + p.id + '"';
    var u = f.unidade && f.unidade.trim() ? f.unidade.trim() : "unidade";
    function itens(lista, exemploItem) {
      return '<div class="fin-itens">' + (f[lista] || []).map(function (it, i) {
        return '<div class="fin-item"><input type="text" id="' + idCampo(e.id, p.id, lista + i + "i") + '"' + da + ' data-k="finitem" data-l="' + lista + '" data-i="' + i + '" data-f="item" value="' + esc(it.item) + '" placeholder="' + exemploItem + '" aria-label="O que é">' +
          '<input type="text" inputmode="decimal" id="' + idCampo(e.id, p.id, lista + i + "v") + '"' + da + ' data-k="finitem" data-l="' + lista + '" data-i="' + i + '" data-f="valor" value="' + esc(it.valor) + '" placeholder="R$" aria-label="Quanto custa em reais">' +
          '<button type="button" class="btn btn-fantasma btn-peq" data-acao="fin-rem"' + da + ' data-l="' + lista + '" data-i="' + i + '" aria-label="Apagar">×</button></div>';
      }).join("") + '</div><div><button type="button" class="btn btn-peq" data-acao="fin-add"' + da + ' data-l="' + lista + '">+ Mais um gasto</button></div>';
    }
    function input(f2, val, ph, dec) {
      return '<input type="text" ' + (dec ? 'inputmode="decimal" ' : "") + 'id="' + idCampo(e.id, p.id, f2) + '"' + da + ' data-k="fin" data-f="' + f2 + '" value="' + esc(val) + '" placeholder="' + ph + '">';
    }
    return '<div class="fin-lay"><div class="fin-passos">' +
      passo(1, "O que vocês vão vender?", "Escrevam UMA unidade do produto ou serviço.", '<label class="sr" for="' + idCampo(e.id, p.id, "unidade") + '">Unidade</label>' + input("unidade", f.unidade, "Ex.: barra de sabão") ) +
      passo(2, "Gastos de uma vez só", "Coisas que vocês compram uma vez para começar: balde, forma, peneira, banner.", itens("fixos", "Ex.: balde")) +
      passo(3, "Gastos para fazer 1 " + esc(u), "O material que vai em CADA unidade: embalagem, ingrediente, etiqueta.", itens("variaveis", "Ex.: embalagem")) +
      passo(4, "Por quanto vão vender 1 " + esc(u) + "?", "Pesquisem o preço de produtos parecidos.", '<label class="sr" for="' + idCampo(e.id, p.id, "preco") + '">Preço</label>' + input("preco", f.preco, "R$", true)) +
      passo(5, "Quantas vocês querem vender?", "Uma meta possível até a feira ou no primeiro mês.", '<label class="sr" for="' + idCampo(e.id, p.id, "meta") + '">Meta de vendas</label>' + input("meta", f.meta, "Ex.: 40", true)) +
      passo(6, "Quanto resíduo cada " + esc(u) + " reaproveita?", "Ex.: 0,5 litro de óleo; 1 kg de borra.", '<div class="grade-2"><div><label class="q-outro" for="' + idCampo(e.id, p.id, "impactoQtd") + '">Quantidade</label>' + input("impactoQtd", f.impactoQtd, "Ex.: 0,5", true) + '</div><div><label class="q-outro" for="' + idCampo(e.id, p.id, "impactoUnid") + '">De quê</label>' + input("impactoUnid", f.impactoUnid, "Ex.: litro de óleo") + "</div></div>") +
      '</div><div class="fin-res-col" id="fin-res-' + e.id + '">' + finResHTML(f) + "</div></div>";
  }
  function passo(n, titulo, ajuda, corpo) {
    return '<div class="fin-passo"><span class="fin-n">' + n + '</span><div class="pilha-p"><b>' + titulo + '</b><span class="q-ajuda-peq">' + ajuda + "</span>" + corpo + "</div></div>";
  }
  function finResHTML(f) {
    var r = U.financas(f), u = esc(r.unidade && r.unidade.trim() ? r.unidade.trim() : "unidade");
    var h = '<div class="caixa-contas"><h3>O que as contas mostram</h3>';
    if (!(isFinite(r.P) && r.P > 0) || !(r.CF > 0 || r.CV > 0)) {
      return h + '<p class="suave">Preencham os passos 1 a 5. As contas aparecem aqui, explicadas.</p></div>' + graficoFinHTML();
    }
    h += '<div class="frase-conta">Para fazer <b>1 ' + u + "</b>, vocês gastam <b>" + U.reais(r.CV) + "</b>.</div>";
    h += '<div class="frase-conta">Vendendo por ' + U.reais(r.P) + ", sobram <b>" + U.reais(r.MC) + "</b> em cada " + u + ".<br><span class=\"termo\">" + U.reais(r.P) + " − " + U.reais(r.CV) + " = " + U.reais(r.MC) + " · Na Matemática: margem de contribuição.</span></div>";
    h += '<div class="frase-conta">Os gastos de uma vez só somam <b>' + U.reais(r.CF) + "</b>.</div>";
    if (r.MC > 0) {
      h += '<div class="frase-conta destaque">Para pagar esses gastos, vocês precisam vender <b>' + r.PE + " " + u + "</b>.<br><span class=\"termo\">" + U.reais(r.CF) + " ÷ " + U.reais(r.MC) + " = " + U.br(r.CF / r.MC) + " → arredonda para cima = " + r.PE + " · Na Matemática: ponto de equilíbrio.</span></div>";
      if (isFinite(r.meta)) {
        var lucro = r.lucroMeta;
        h += '<div class="frase-conta">Se venderem ' + U.br(r.meta, 0) + ", o " + (lucro >= 0 ? "lucro" : "prejuízo") + " será <b>" + U.reais(Math.abs(lucro)) + "</b>.<br><span class=\"termo\">" + U.br(r.meta, 0) + " × " + U.reais(r.MC) + " − " + U.reais(r.CF) + " = " + U.reais(lucro) + "</span></div>";
        if (lucro < 0) h += '<div class="aviso-caixa">Com essa meta, ainda falta vender ' + (r.PE - r.meta) + " para pagar os gastos. Aumentem a meta, o preço, ou diminuam os gastos.</div>";
      }
    } else {
      h += '<div class="perigo-caixa">O preço está menor ou igual ao gasto de cada ' + u + ". Assim, quanto mais vender, mais dinheiro perde. Aumentem o preço ou diminuam os gastos.</div>";
    }
    if (isFinite(r.impactoMeta)) h += '<div class="frase-conta">E o ambiente ganha: ' + U.br(r.meta, 0) + " × " + U.br(r.impactoQtd) + " = <b>" + U.br(r.impactoMeta) + " " + esc(r.impactoUnid) + "</b> reaproveitados.</div>";
    return h + "</div>" + graficoFinHTML();
  }
  function graficoFinHTML() {
    return '<div class="grafico-caixa"><div class="legenda"><span><i style="background:var(--serie-a)"></i>Dinheiro que entra (vendas)</span><span><i style="background:repeating-linear-gradient(90deg,var(--serie-b) 0 7px,transparent 7px 11px)"></i>Dinheiro que sai (gastos)</span></div><canvas id="graf-fin" role="img" aria-label="Gráfico do dinheiro que entra e que sai conforme a quantidade vendida"></canvas><p class="termo">Onde as linhas se cruzam, as vendas pagam os gastos (ponto de equilíbrio). Depois disso, é lucro.</p></div>';
  }
  function desenharFin(f) {
    var cv = document.getElementById("graf-fin"); if (!cv) return;
    var r = U.financas(f);
    if (!r.valido) { IV.graficos.desenhar(cv, { tipo: "linha", rotulos: [], series: [{ nome: "", cor: "", valores: [] }] }); return; }
    var qMax = Math.max(10, isFinite(r.PE) ? r.PE * 2 : 0, isFinite(r.meta) ? Math.ceil(r.meta * 1.25) : 0);
    var passos = 10, pas = Math.max(1, Math.ceil(qMax / passos)), qs = [];
    for (var q = 0; q <= pas * passos; q += pas) qs.push(q);
    var u = r.unidade && r.unidade.trim() ? r.unidade.trim() : "unidades";
    IV.graficos.desenhar(cv, {
      tipo: "linha", rotulos: qs, prefixoX: " vendidos", unidadeX: "quantidade vendida (" + u + ")",
      formatoY: function (v) { return "R$ " + U.br(v, 0); },
      series: [
        { nome: "Entra", cor: IV.graficos.token("--serie-a"), valores: qs.map(function (q) { return r.P * q; }) },
        { nome: "Sai", cor: IV.graficos.token("--serie-b"), tracejado: true, valores: qs.map(function (q) { return r.CF + r.CV * q; }) }
      ],
      marcaX: isFinite(r.PE) ? { x: r.PE, x0: 0, x1: qs[qs.length - 1], texto: "Empate: " + r.PE } : null
    });
  }

  function aposRender(estado, e, p) {
    var r = (estado.respostas && estado.respostas[e.id]) || {};
    if (p.tipo === "dados") desenharDados(e, r[p.id] || tabelaPadrao());
    if (p.tipo === "financeiro") desenharFin(r[p.id] || finPadrao());
  }

  /* ---------------- Entrada de dados ---------------- */
  function obter(estado, el, padrao) {
    var R = resp(estado, el.dataset.e);
    if (R[el.dataset.q] === undefined || R[el.dataset.q] === null || R[el.dataset.q] === "") R[el.dataset.q] = padrao();
    return R[el.dataset.q];
  }
  function onInput(estado, el) {
    var k = el.dataset.k; if (!k || !el.dataset.e) return false;
    var e = IV.etapaPorId(el.dataset.e), R = resp(estado, el.dataset.e), q = el.dataset.q;
    switch (k) {
      case "txt": R[q] = el.value; break;
      case "radio": if (el.checked) R[q] = el.value; break;
      case "multi": case "outro":
        var v = R[q] || { sel: [], outro: "" };
        if (k === "multi") {
          v.sel = Array.prototype.slice.call(document.querySelectorAll('input[data-k="multi"][data-e="' + e.id + '"][data-q="' + q + '"]'))
            .filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
        } else v.outro = el.value;
        R[q] = v; break;
      case "papel":
        var pv = R[q] || {};
        pv[el.dataset.m] = Array.prototype.slice.call(document.querySelectorAll('input[data-k="papel"][data-e="' + e.id + '"]'))
          .filter(function (c) { return c.dataset.m === el.dataset.m && c.checked; }).map(function (c) { return c.value; });
        R[q] = pv; break;
      case "cel": case "colnome": case "gcol": case "gtipo":
        var t = obter(estado, el, tabelaPadrao);
        if (k === "cel") t.rows[+el.dataset.r][+el.dataset.c] = el.value;
        if (k === "colnome") t.cols[+el.dataset.c] = el.value;
        t.graf = t.graf || { col: 1, tipo: "barra" };
        if (k === "gcol") t.graf.col = +el.value;
        if (k === "gtipo") t.graf.tipo = el.value;
        var box = document.getElementById("stats-" + e.id); if (box) box.innerHTML = statsHTML(t);
        desenharDados(e, t); break;
      case "fin": case "finitem":
        var f = obter(estado, el, finPadrao);
        if (k === "fin") f[el.dataset.f] = el.value;
        else f[el.dataset.l][+el.dataset.i][el.dataset.f] = el.value;
        var res = document.getElementById("fin-res-" + e.id);
        if (res) { res.innerHTML = finResHTML(f); desenharFin(f); }
        break;
      default: return false;
    }
    return true;
  }

  function onAcao(estado, acao, el) {
    var map = {
      "add-linha": function (t) { t.rows.push(t.cols.map(function () { return ""; })); },
      "rem-linha": function (t) { if (t.rows.length > 1) t.rows.splice(+el.dataset.r, 1); },
      "add-col": function (t) { t.cols.push("Resultado " + t.cols.length + " (unidade)"); t.rows.forEach(function (r) { r.push(""); }); },
      "rem-col": function (t) {
        var c = +el.dataset.c; t.cols.splice(c, 1); t.rows.forEach(function (r) { r.splice(c, 1); });
        if (t.graf && t.graf.col >= t.cols.length) t.graf.col = 1;
      }
    };
    if (map[acao]) { map[acao](obter(estado, el, tabelaPadrao)); return true; }
    if (acao === "fin-add" || acao === "fin-rem") {
      var f = obter(estado, el, finPadrao), l = el.dataset.l;
      f[l] = f[l] || [];
      if (acao === "fin-add") f[l].push({ item: "", valor: "" });
      else { f[l].splice(+el.dataset.i, 1); if (!f[l].length) f[l].push({ item: "", valor: "" }); }
      return true;
    }
    return false;
  }

  return { campo: campo, aposRender: aposRender, onInput: onInput, onAcao: onAcao };
})();
