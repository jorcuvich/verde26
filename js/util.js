/* =====================================================================
   INCUBADORA VERDE · util.js
   Funções compartilhadas: números, estatística, finanças, progresso,
   datas e formatação de respostas em texto.
   ===================================================================== */
window.IV = window.IV || {};

IV.util = (function () {
  function num(v) {
    if (v === null || v === undefined) return NaN;
    if (typeof v === "number") return v;
    var s = String(v).trim().replace(/\s/g, "").replace(/R\$/i, "");
    if (!s) return NaN;
    // "1.234,56" → 1234.56 ; "2,5" → 2.5 ; "2.5" → 2.5
    if (s.indexOf(",") >= 0 && s.indexOf(".") >= 0) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(",", ".");
    var n = Number(s);
    return isFinite(n) ? n : NaN;
  }
  function br(n, casas) {
    if (n === null || n === undefined || !isFinite(n)) return "–";
    if (casas === undefined) casas = Math.abs(n) >= 100 ? 1 : 2;
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: casas });
  }
  function reais(n) {
    if (!isFinite(n)) return "–";
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dataBR(iso) {
    if (!iso) return "";
    var p = String(iso).slice(0, 10).split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }
  function parseISO(iso) {
    var p = String(iso).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function addDias(iso, dias) {
    var d = parseISO(iso); d.setDate(d.getDate() + dias);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function diasEntre(aIso, bIso) {
    return Math.round((parseISO(bIso) - parseISO(aIso)) / 86400000);
  }

  /* ---------------- Estatística da tabela de dados ---------------- */
  function estatisticas(tabela) {
    if (!tabela || !tabela.cols || !tabela.rows) return [];
    var out = [];
    for (var j = 1; j < tabela.cols.length; j++) {
      var vals = [];
      tabela.rows.forEach(function (r) { var n = num(r[j]); if (isFinite(n)) vals.push(n); });
      if (!vals.length) { out.push({ col: j, nome: tabela.cols[j] || ("Coluna " + (j + 1)), n: 0 }); continue; }
      var ord = vals.slice().sort(function (a, b) { return a - b; });
      var soma = vals.reduce(function (a, b) { return a + b; }, 0);
      var media = soma / vals.length;
      var meio = Math.floor(ord.length / 2);
      var mediana = ord.length % 2 ? ord[meio] : (ord[meio - 1] + ord[meio]) / 2;
      var dp = NaN;
      if (vals.length > 1) {
        var sq = vals.reduce(function (a, v) { return a + (v - media) * (v - media); }, 0);
        dp = Math.sqrt(sq / (vals.length - 1));
      }
      out.push({
        col: j, nome: tabela.cols[j] || ("Coluna " + (j + 1)), n: vals.length, soma: soma, media: media,
        mediana: mediana, min: ord[0], max: ord[ord.length - 1], amplitude: ord[ord.length - 1] - ord[0],
        dp: dp, cv: media !== 0 && isFinite(dp) ? Math.abs(dp / media) * 100 : NaN
      });
    }
    return out;
  }

  /* ---------------- Finanças do negócio ---------------- */
  function financas(f) {
    f = f || {};
    var soma = function (arr) { return (arr || []).reduce(function (a, it) { var n = num(it.valor); return a + (isFinite(n) ? n : 0); }, 0); };
    var CF = soma(f.fixos), CV = soma(f.variaveis), P = num(f.preco), meta = num(f.meta), imp = num(f.impactoQtd);
    var r = { CF: CF, CV: CV, P: P, meta: meta, unidade: f.unidade || "unidade", periodo: f.periodo || "mês",
      impactoQtd: imp, impactoUnid: f.impactoUnid || "" };
    r.MC = isFinite(P) ? P - CV : NaN;
    r.margemPct = isFinite(P) && P > 0 ? (r.MC / P) * 100 : NaN;
    r.markupPct = CV > 0 && isFinite(P) ? ((P - CV) / CV) * 100 : NaN;
    r.PE = isFinite(r.MC) && r.MC > 0 ? Math.ceil(CF / r.MC) : NaN;
    r.receitaMeta = isFinite(meta) && isFinite(P) ? meta * P : NaN;
    r.custoMeta = isFinite(meta) ? CF + CV * meta : NaN;
    r.lucroMeta = isFinite(r.receitaMeta) ? r.receitaMeta - r.custoMeta : NaN;
    r.impactoMeta = isFinite(meta) && isFinite(imp) ? meta * imp : NaN;
    r.valido = isFinite(P) && P > 0 && (CF > 0 || CV > 0);
    return r;
  }

  /* ---------------- Preenchimento e progresso ---------------- */
  function preenchido(p, v) {
    if (v === undefined || v === null) return false;
    switch (p.tipo) {
      case "multipla": case "kit":
        return !!(v && ((v.sel && v.sel.length) || (v.outro && String(v.outro).trim())));
      case "papeis":
        return !!(v && Object.keys(v).some(function (k) { return v[k] && v[k].length; }));
      case "dados":
        return !!(v && v.rows && v.rows.some(function (r) { return r.slice(1).some(function (c) { return isFinite(num(c)); }); }));
      case "financeiro":
        return financas(v).valido;
      default:
        return String(v).trim().length > 0;
    }
  }
  function progressoEtapa(estado, etapa) {
    var resp = (estado.respostas && estado.respostas[etapa.id]) || {};
    var obrig = etapa.perguntas.filter(function (p) { return p.obrig; });
    var feitas = obrig.filter(function (p) { return preenchido(p, resp[p.id]); }).length;
    var extras = etapa.perguntas.filter(function (p) { return !p.obrig && preenchido(p, resp[p.id]); }).length;
    return { feitas: feitas, total: obrig.length, extras: extras, pct: obrig.length ? Math.round((feitas / obrig.length) * 100) : 0 };
  }
  function progressoGeral(estado) {
    var f = 0, t = 0;
    IV.ETAPAS.forEach(function (e) { var p = progressoEtapa(estado, e); f += p.feitas; t += p.total; });
    return t ? Math.round((f / t) * 100) : 0;
  }

  /* ---------------- Texto de uma resposta ---------------- */
  function texto(p, v, grupo) {
    if (!preenchido(p, v)) return "";
    switch (p.tipo) {
      case "multipla": case "kit":
        var itens = (v.sel || []).slice();
        if (v.outro && String(v.outro).trim()) itens.push(String(v.outro).trim());
        return itens.map(function (i) { return "- " + i; }).join("\n");
      case "lista":
        return String(v).split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) { return "- " + l.replace(/^[-•*]\s*/, ""); }).join("\n");
      case "papeis":
        return Object.keys(v).filter(function (k) { return v[k] && v[k].length; }).map(function (nome) {
          return "- " + nome + ": " + v[nome].map(function (id) { var pp = IV.PAPEIS.find(function (x) { return x.id === id; }); return pp ? pp.nome : id; }).join(", ");
        }).join("\n");
      case "dados":
        return tabelaMarkdown(v) + "\n\nEstatísticas calculadas automaticamente:\n" + estatisticasTexto(v);
      case "financeiro":
        return financasTexto(v);
      default:
        return String(v).trim();
    }
  }
  function tabelaMarkdown(t) {
    if (!t || !t.cols) return "";
    var cab = "| " + t.cols.map(function (c) { return c || "?"; }).join(" | ") + " |";
    var sep = "| " + t.cols.map(function () { return "---"; }).join(" | ") + " |";
    var linhas = (t.rows || []).filter(function (r) { return r.some(function (c) { return String(c || "").trim(); }); })
      .map(function (r) { return "| " + t.cols.map(function (_, i) { return String(r[i] === undefined ? "" : r[i]).trim(); }).join(" | ") + " |"; });
    return [cab, sep].concat(linhas).join("\n");
  }
  function estatisticasTexto(t) {
    return estatisticas(t).filter(function (s) { return s.n > 0; }).map(function (s) {
      return "- " + s.nome + ": n = " + s.n + "; soma = " + br(s.soma) + "; média = " + br(s.media) + "; mediana = " + br(s.mediana) +
        "; mínimo = " + br(s.min) + "; máximo = " + br(s.max) + "; amplitude = " + br(s.amplitude) +
        (isFinite(s.dp) ? "; desvio padrão amostral = " + br(s.dp) + "; coeficiente de variação = " + br(s.cv, 1) + "%" : "");
    }).join("\n");
  }
  function financasTexto(f) {
    var r = financas(f), u = r.unidade;
    var L = [];
    L.push("Produto vendido (1 unidade): " + u);
    L.push("Gastos de uma vez só (custos fixos):");
    (f.fixos || []).filter(function (i) { return i.item || i.valor; }).forEach(function (i) { L.push("  - " + (i.item || "item") + ": " + reais(num(i.valor))); });
    L.push("Gastos para fazer 1 " + u + " (custos variáveis):");
    (f.variaveis || []).filter(function (i) { return i.item || i.valor; }).forEach(function (i) { L.push("  - " + (i.item || "item") + ": " + reais(num(i.valor))); });
    L.push("Custo fixo total (CF) = " + reais(r.CF));
    L.push("Custo para fazer 1 unidade (CV) = " + reais(r.CV));
    L.push("Preço de venda (P) = " + reais(r.P));
    L.push("Sobra por unidade, margem de contribuição (P − CV) = " + reais(r.MC));
    L.push("Ponto de equilíbrio = CF ÷ (P − CV) = " + (isFinite(r.PE) ? r.PE + " unidades" : "não existe (o preço não cobre o custo de cada unidade)"));
    if (isFinite(r.meta)) {
      L.push("Meta de vendas: " + br(r.meta, 0) + " unidades");
      L.push("Resultado na meta = meta × (P − CV) − CF = " + reais(r.lucroMeta));
    }
    if (isFinite(r.impactoQtd)) {
      L.push("Impacto por unidade: " + br(r.impactoQtd) + " " + r.impactoUnid);
      if (isFinite(r.impactoMeta)) L.push("Impacto na meta: " + br(r.impactoMeta) + " " + r.impactoUnid);
    }
    return L.join("\n");
  }

  /* ---------------- Cronograma ---------------- */
  function semanaAtual(config) {
    var d = diasEntre(config.inicio, hojeISO());
    if (d < 0) return 0;
    return Math.min(IV.CRONOGRAMA.length + 1, Math.floor(d / 7) + 1);
  }

  return {
    num: num, br: br, reais: reais, esc: esc, hojeISO: hojeISO, dataBR: dataBR, addDias: addDias, diasEntre: diasEntre,
    estatisticas: estatisticas, financas: financas, preenchido: preenchido, progressoEtapa: progressoEtapa,
    progressoGeral: progressoGeral, texto: texto, tabelaMarkdown: tabelaMarkdown, estatisticasTexto: estatisticasTexto,
    financasTexto: financasTexto, semanaAtual: semanaAtual
  };
})();
