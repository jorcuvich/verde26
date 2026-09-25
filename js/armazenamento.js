/* =====================================================================
   INCUBADORA VERDE · armazenamento.js
   Salva tudo no navegador (localStorage), com backup em arquivo .json.
   Se o navegador bloquear o armazenamento, os dados ficam só na memória
   até a página fechar (e o sistema avisa).
   ===================================================================== */
window.IV = window.IV || {};

IV.store = (function () {
  var PREFIX = "iv:v1:";
  var memoria = {};
  var persistente = true;

  function ler(chave) {
    try { var v = localStorage.getItem(PREFIX + chave); return v === null ? (memoria[chave] || null) : v; }
    catch (e) { persistente = false; return memoria[chave] || null; }
  }
  function gravar(chave, valor) {
    memoria[chave] = valor;
    try { localStorage.setItem(PREFIX + chave, valor); return true; }
    catch (e) { persistente = false; return false; }
  }
  function apagar(chave) {
    delete memoria[chave];
    try { localStorage.removeItem(PREFIX + chave); } catch (e) { /* ignora */ }
  }

  function vazio(gid) {
    return { app: "incubadora-verde", versao: 1, grupo: gid, respostas: {}, diario: [], usoPrompts: [], atualizado: null };
  }
  function carregar(gid) {
    var raw = ler("grupo:" + gid);
    if (!raw && gid === "ex" && IV.EXEMPLO_ESTADO) return JSON.parse(JSON.stringify(IV.EXEMPLO_ESTADO));
    if (!raw) return vazio(gid);
    try {
      var e = JSON.parse(raw);
      e.respostas = e.respostas || {}; e.diario = e.diario || []; e.usoPrompts = e.usoPrompts || [];
      return e;
    } catch (err) { return vazio(gid); }
  }
  function salvar(gid, estado) {
    estado.atualizado = new Date().toISOString();
    return gravar("grupo:" + gid, JSON.stringify(estado));
  }
  function limpar(gid) { apagar("grupo:" + gid); }

  function config() {
    var c = null;
    try { c = JSON.parse(ler("config") || "null"); } catch (e) { c = null; }
    c = c || {};
    return { inicio: c.inicio || IV.PROJETO.inicioPadrao, feira: c.feira || IV.PROJETO.feiraPadrao };
  }
  function salvarConfig(c) { gravar("config", JSON.stringify(c)); }

  function pref(chave, padrao) { var v = ler("pref:" + chave); return v === null ? padrao : v; }
  function setPref(chave, valor) { gravar("pref:" + chave, String(valor)); }

  /* ---------------- Backup ---------------- */
  function exportarGrupo(gid) {
    var e = carregar(gid);
    e.exportado = new Date().toISOString();
    return JSON.stringify(e, null, 2);
  }
  function exportarTurma() {
    var pacote = { app: "incubadora-verde", tipo: "turma", versao: 1, exportado: new Date().toISOString(), config: config(), grupos: {} };
    IV.GRUPOS.forEach(function (g) { pacote.grupos[g.id] = carregar(g.id); });
    return JSON.stringify(pacote, null, 2);
  }
  // Devolve lista de ids importados ou lança erro com mensagem clara
  function importar(texto, opcoes) {
    opcoes = opcoes || {};
    var obj;
    try { obj = JSON.parse(texto); } catch (e) { throw new Error("O arquivo não é um backup válido (JSON com erro)."); }
    if (!obj || obj.app !== "incubadora-verde") throw new Error("Este arquivo não foi gerado pela Incubadora Verde.");
    var ids = [];
    if (obj.tipo === "turma") {
      Object.keys(obj.grupos || {}).forEach(function (gid) {
        if (!IV.grupoPorId(gid)) return;
        gravar("grupo:" + gid, JSON.stringify(obj.grupos[gid])); ids.push(gid);
      });
      if (obj.config && opcoes.comConfig) salvarConfig(obj.config);
    } else {
      if (!IV.grupoPorId(obj.grupo)) throw new Error("O grupo deste backup não existe nesta turma.");
      if (opcoes.somenteGrupo && opcoes.somenteGrupo !== obj.grupo) {
        throw new Error("Este backup é do " + IV.grupoPorId(obj.grupo).rotulo + ", não deste grupo.");
      }
      gravar("grupo:" + obj.grupo, JSON.stringify(obj)); ids.push(obj.grupo);
    }
    return ids;
  }

  /* ---------------- Download de arquivos ---------------- */
  var downloadsPromise = null;
  function capDownloads() {
    if (downloadsPromise) return downloadsPromise;
    if (window.claude && typeof window.claude.use === "function") {
      downloadsPromise = window.claude.use("downloads").catch(function () { return null; });
    } else downloadsPromise = Promise.resolve(null);
    return downloadsPromise;
  }
  if (window.claude && typeof window.claude.use === "function") capDownloads();

  function baixarDireto(nome, conteudo, mime) {
    var blob = new Blob([conteudo], { type: (mime || "text/plain") + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = nome; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
    return Promise.resolve("ok");
  }
  function baixar(nome, conteudo, mime) {
    if (!(window.claude && typeof window.claude.use === "function")) return baixarDireto(nome, conteudo, mime);
    return capDownloads().then(function (dl) {
      if (!dl) return "indisponivel";
      return dl.save({ filename: nome, data: conteudo }).then(function () { return "ok"; }, function (err) {
        return err && err.code === "declined" ? "recusado" : "indisponivel";
      });
    });
  }

  return {
    carregar: carregar, salvar: salvar, limpar: limpar, config: config, salvarConfig: salvarConfig,
    pref: pref, setPref: setPref, exportarGrupo: exportarGrupo, exportarTurma: exportarTurma,
    importar: importar, baixar: baixar, persistente: function () { return persistente; }
  };
})();
