/* =====================================================================
   INCUBADORA VERDE · graficos.js
   Gráficos simples em canvas (barras e linhas) com dica ao passar o
   mouse ou tocar. Cores vêm dos tokens do tema.
   ===================================================================== */
window.IV = window.IV || {};

IV.graficos = (function () {
  function token(nome) { return getComputedStyle(document.documentElement).getPropertyValue(nome).trim(); }

  function passoBonito(bruto) {
    var exp = Math.pow(10, Math.floor(Math.log10(bruto)));
    var f = bruto / exp;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * exp;
  }
  function escala(min, max, n) {
    if (min === max) { max = min + 1; }
    var passo = passoBonito((max - min) / n);
    var lo = Math.floor(min / passo) * passo, hi = Math.ceil(max / passo) * passo, ticks = [];
    for (var v = lo; v <= hi + passo / 2; v += passo) ticks.push(Math.round(v * 1e6) / 1e6);
    return { lo: lo, hi: hi, ticks: ticks };
  }

  /* cfg: { tipo: "barra"|"linha", rotulos: [], series: [{nome, cor, valores, tracejado}],
            unidadeY, marcaX: {indice, texto}, formatoY: fn } */
  function desenhar(canvas, cfg) {
    var caixa = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var W = canvas.clientWidth || 600, H = canvas.clientHeight || 260;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var cTinta = token("--tinta-2"), cSuave = token("--suave"), cGrade = token("--grade"), cSup = token("--superficie");
    var fonte = "12px " + (token("--f-corpo") || "sans-serif");
    var todos = [];
    cfg.series.forEach(function (s) { s.valores.forEach(function (v) { if (isFinite(v)) todos.push(v); }); });
    if (!todos.length) {
      ctx.fillStyle = cSuave; ctx.font = fonte; ctx.textAlign = "center";
      ctx.fillText("Preencha valores numéricos para ver o gráfico.", W / 2, H / 2);
      canvas._geo = null; return;
    }
    var min = Math.min(0, Math.min.apply(null, todos)), max = Math.max.apply(null, todos);
    var esc = escala(min, max, 4);
    var fmt = cfg.formatoY || function (v) { return IV.util.br(v); };

    ctx.font = fonte;
    var larguraY = Math.max.apply(null, esc.ticks.map(function (t) { return ctx.measureText(fmt(t)).width; }));
    var m = { e: Math.ceil(larguraY) + 14, d: 14, t: 26, b: 38 };
    var pw = W - m.e - m.d, ph = H - m.t - m.b;
    var y = function (v) { return m.t + ph - ((v - esc.lo) / (esc.hi - esc.lo)) * ph; };
    var n = cfg.rotulos.length;

    // grade e eixo Y
    ctx.lineWidth = 1; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    esc.ticks.forEach(function (t) {
      var yy = Math.round(y(t)) + 0.5;
      ctx.strokeStyle = t === 0 ? token("--linha-forte") : cGrade;
      ctx.beginPath(); ctx.moveTo(m.e, yy); ctx.lineTo(W - m.d, yy); ctx.stroke();
      ctx.fillStyle = cSuave; ctx.fillText(fmt(t), m.e - 8, yy);
    });

    // posições X
    var xs = [], banda = pw / Math.max(1, n);
    for (var i = 0; i < n; i++) xs.push(cfg.tipo === "barra" ? m.e + banda * (i + 0.5) : m.e + (n === 1 ? pw / 2 : (pw * i) / (n - 1)));

    // rótulos X (pula alguns se não couberem)
    ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = cTinta;
    var maxL = Math.max.apply(null, cfg.rotulos.map(function (r) { return ctx.measureText(String(r)).width; })) + 10;
    var pulo = Math.max(1, Math.ceil(maxL / (pw / Math.max(1, n))));
    cfg.rotulos.forEach(function (r, i) {
      if (i % pulo !== 0 && i !== n - 1) return;
      var txt = String(r); if (txt.length > 14) txt = txt.slice(0, 13) + "…";
      ctx.fillText(txt, xs[i], H - m.b + 8);
    });
    if (cfg.unidadeX) { ctx.fillStyle = cSuave; ctx.textAlign = "right"; ctx.fillText(cfg.unidadeX, W - m.d, H - 14); }

    // marca vertical (ex.: ponto de equilíbrio)
    if (cfg.marcaX && isFinite(cfg.marcaX.x)) {
      var mx = m.e + ((cfg.marcaX.x - cfg.marcaX.x0) / (cfg.marcaX.x1 - cfg.marcaX.x0)) * pw;
      ctx.save(); ctx.strokeStyle = token("--tinta"); ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(mx, m.t); ctx.lineTo(mx, m.t + ph); ctx.stroke(); ctx.restore();
      ctx.fillStyle = token("--tinta"); ctx.textAlign = mx > W - 150 ? "right" : "left"; ctx.textBaseline = "top";
      ctx.font = "bold " + fonte; ctx.fillText(cfg.marcaX.texto, mx + (mx > W - 150 ? -6 : 6), m.t + 2); ctx.font = fonte;
    }

    // séries
    var ns = cfg.series.length;
    cfg.series.forEach(function (s, si) {
      ctx.fillStyle = s.cor; ctx.strokeStyle = s.cor;
      if (cfg.tipo === "barra") {
        var gap = 2, bw = Math.max(4, Math.min(56, (banda * 0.7) / ns));
        s.valores.forEach(function (v, i) {
          if (!isFinite(v)) return;
          var x0 = xs[i] - (bw * ns) / 2 + si * bw + gap / 2, y0 = y(Math.max(0, v)), y1 = y(Math.min(0, v));
          var h = Math.max(1, y1 - y0), r = Math.min(4, bw / 2, h);
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x0, y0, bw - gap, h, v >= 0 ? [r, r, 0, 0] : [0, 0, r, r]);
          else ctx.rect(x0, y0, bw - gap, h);
          ctx.fill();
        });
      } else {
        ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.setLineDash(s.tracejado ? [7, 5] : []);
        ctx.beginPath(); var comecou = false;
        s.valores.forEach(function (v, i) { if (!isFinite(v)) return; if (!comecou) { ctx.moveTo(xs[i], y(v)); comecou = true; } else ctx.lineTo(xs[i], y(v)); });
        ctx.stroke(); ctx.setLineDash([]);
        if (n <= 24) s.valores.forEach(function (v, i) {
          if (!isFinite(v)) return;
          ctx.beginPath(); ctx.arc(xs[i], y(v), 4, 0, Math.PI * 2); ctx.fillStyle = s.cor; ctx.fill();
          ctx.lineWidth = 2; ctx.strokeStyle = cSup; ctx.stroke(); ctx.strokeStyle = s.cor;
        });
        // rótulo direto no fim da linha
        if (ns > 1) {
          var ult = s.valores.length - 1; while (ult >= 0 && !isFinite(s.valores[ult])) ult--;
          if (ult >= 0) { ctx.fillStyle = cTinta; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(s.nome, xs[ult] - 6, y(s.valores[ult]) - 6); }
        }
      }
    });
    canvas._geo = { xs: xs, cfg: cfg, y: y, W: W };
    ligarDica(canvas, caixa, fmt);
  }

  function ligarDica(canvas, caixa, fmt) {
    if (canvas._dicaLigada) return;
    canvas._dicaLigada = true;
    var dica = document.createElement("div"); dica.className = "tooltip"; dica.hidden = true; caixa.appendChild(dica);
    function mover(ev) {
      var g = canvas._geo; if (!g) { dica.hidden = true; return; }
      var ret = canvas.getBoundingClientRect();
      var px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - ret.left;
      var melhor = 0, dist = Infinity;
      g.xs.forEach(function (x, i) { var d = Math.abs(x - px); if (d < dist) { dist = d; melhor = i; } });
      var linhas = g.cfg.series.map(function (s) { var v = s.valores[melhor]; return (g.cfg.series.length > 1 ? s.nome + ": " : "") + (isFinite(v) ? (g.cfg.formatoY || fmt)(v) : "–"); });
      dica.textContent = g.cfg.rotulos[melhor] + (g.cfg.prefixoX || "") + " · " + linhas.join(" · ");
      var topo = Math.min.apply(null, g.cfg.series.map(function (s) { var v = s.valores[melhor]; return isFinite(v) ? g.y(v) : 200; }));
      dica.style.left = Math.max(80, Math.min(g.W - 80, g.xs[melhor])) + canvas.offsetLeft + "px";
      dica.style.top = (topo + canvas.offsetTop) + "px";
      dica.hidden = false;
    }
    canvas.addEventListener("mousemove", mover);
    canvas.addEventListener("touchstart", mover, { passive: true });
    canvas.addEventListener("mouseleave", function () { dica.hidden = true; });
  }

  return { desenhar: desenhar, token: token };
})();
