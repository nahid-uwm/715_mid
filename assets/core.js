/* CS 715 Midterm Lab: shared engine.
   Header/nav, theme, Pyodide runner, step-through memory visualizer,
   anatomy (labelled code) diagrams, and the generic study-page renderer. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const store = {
    get(k, d) { try { const v = localStorage.getItem("cs715:" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("cs715:" + k, JSON.stringify(v)); } catch {} }
  };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ---------------- theme ---------------- */
  const applyTheme = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  applyTheme(store.get("theme", null));
  const isDark = () => (document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";

  /* ---------------- header ---------------- */
  const PAGES = [
    ["index", "index.html", "🏠 Home"], ["practice", "practice.html", "📝 Practice Exam"],
    ["quizzes", "quizzes.html", "✅ Quizzes"], ["lectures", "lectures.html", "📚 Lectures"],
    ["homework", "homework.html", "🧩 Homework"]
  ];
  function header(active, withSide) {
    const h = el("header", "hdr");
    h.innerHTML = `
      <div class="hdr-row">
        ${withSide ? `<button class="ibtn menu-btn" aria-label="Open contents" aria-expanded="false">☰</button>` : ""}
        <a class="brand" href="index.html">CS 715 <span>Midterm Lab</span></a>
        <div class="hdr-tools">
          <span class="chip" id="pyChip" title="Python runs in your browser">Python: on demand</span>
          ${withSide ? `<label class="toggle" title="Hide all answers"><input type="checkbox" id="quizMode"> <span>Quiz<span class="lbl-long"> mode</span></span></label>` : ""}
          <button class="ibtn" id="themeBtn" aria-label="Toggle dark mode">◐</button>
        </div>
      </div>
      <nav class="tabs" aria-label="Pages">${PAGES.map(([k, href, label]) =>
        `<a class="tab ${k === active ? "active" : ""}" href="${href}" ${k === active ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav>`;
    document.body.prepend(h);
    $("#themeBtn").onclick = () => { const n = isDark() ? "light" : "dark"; applyTheme(n); store.set("theme", n); };
    const qm = $("#quizMode");
    if (qm) {
      qm.checked = store.get("quiz", false); document.body.classList.toggle("quiz", qm.checked);
      qm.onchange = () => { document.body.classList.toggle("quiz", qm.checked); store.set("quiz", qm.checked); };
    }
    const mb = $(".menu-btn");
    if (mb) {
      const set = o => { document.body.classList.toggle("side-open", o); mb.setAttribute("aria-expanded", o); };
      mb.onclick = () => set(!document.body.classList.contains("side-open"));
      document.addEventListener("click", e => {
        if (e.target.classList.contains("scrim") || e.target.closest(".side a")) set(false);
      });
      document.addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    }
    // keep --hdr in sync with real header height (tabs may wrap)
    const sync = () => document.documentElement.style.setProperty("--hdr", h.offsetHeight + "px");
    sync(); addEventListener("resize", sync);
  }

  /* ---------------- Pyodide ---------------- */
  let pyPromise = null;
  const PY_SETUP = String.raw`
import sys, io, types, json, traceback, inspect

def _run_user(code):
    out = io.StringIO()
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    err = ""
    try:
        exec(compile(code, "<code>", "exec"), {"__name__": "__main__"})
    except BaseException:
        et, ev, tb = sys.exc_info()
        err = "".join(traceback.format_exception(et, ev, tb.tb_next))
    finally:
        sys.stdout, sys.stderr = old
    return out.getvalue(), err

class _VizStop(Exception):
    pass

def _viz_run(code, max_steps=500):
    steps = []
    buf = io.StringIO()
    g = {"__name__": "__main__"}
    FN = "<viz>"

    def enc(v, heap, depth=0):
        if v is None or isinstance(v, (bool, int, float, complex)):
            return {"p": repr(v)}
        if isinstance(v, str):
            r = repr(v)
            return {"p": r if len(r) <= 60 else r[:57] + "...'"}
        if isinstance(v, types.ModuleType):
            return {"p": "module " + v.__name__}
        if isinstance(v, (types.BuiltinFunctionType, types.BuiltinMethodType)):
            return {"p": "built-in " + getattr(v, "__name__", "fn")}
        if isinstance(v, type) and v.__module__ == "builtins":
            return {"p": "class " + v.__name__}
        oid = "o" + str(id(v))
        if oid in heap or depth > 8:
            return {"r": oid}
        heap[oid] = None
        o = {"t": type(v).__name__}
        try:
            if isinstance(v, (list, tuple)):
                o["k"] = "list" if isinstance(v, list) else "tuple"
                o["items"] = [enc(x, heap, depth + 1) for x in v[:40]]
                o["more"] = max(0, len(v) - 40)
            elif isinstance(v, (set, frozenset)):
                o["k"] = "set"
                o["items"] = [enc(x, heap, depth + 1) for x in list(v)[:40]]
            elif isinstance(v, dict):
                o["k"] = "dict"
                o["pairs"] = [[enc(k, heap, depth + 1), enc(x, heap, depth + 1)] for k, x in list(v.items())[:40]]
            elif isinstance(v, types.FunctionType):
                o["k"] = "func"
                o["name"] = v.__qualname__
                try:
                    o["sig"] = "(" + ", ".join(v.__code__.co_varnames[:v.__code__.co_argcount]) + ")"
                    sig = inspect.signature(v)
                    o["sig"] = "(" + ", ".join(
                        (("*" if p.kind == p.VAR_POSITIONAL else "**" if p.kind == p.VAR_KEYWORD else "") + p.name)
                        for p in sig.parameters.values()) + ")"
                except Exception:
                    pass
                names = [p for p in v.__code__.co_varnames[:v.__code__.co_argcount]]
                d = v.__defaults__ or ()
                o["defaults"] = [[names[len(names) - len(d) + i] if len(names) >= len(d) else "?", enc(x, heap, depth + 1)] for i, x in enumerate(d)]
                cells = []
                for n, c in zip(v.__code__.co_freevars, v.__closure__ or ()):
                    try:
                        cells.append([n, enc(c.cell_contents, heap, depth + 1)])
                    except ValueError:
                        cells.append([n, {"p": "<empty>"}])
                o["cells"] = cells
            elif isinstance(v, type):
                o["k"] = "class"
                o["name"] = v.__name__
                attrs, meths = [], []
                for n, x in vars(v).items():
                    if n.startswith("__") and n not in ("__init__", "__eq__", "__hash__", "__repr__", "__str__"):
                        if n == "__hash__" and x is None:
                            attrs.append([n, {"p": "None"}])
                        continue
                    if isinstance(x, (types.FunctionType, staticmethod, classmethod, property)):
                        meths.append(n)
                    elif n == "__hash__" and x is None:
                        attrs.append([n, {"p": "None"}])
                    else:
                        attrs.append([n, enc(x, heap, depth + 1)])
                o["attrs"] = attrs
                o["methods"] = meths
            elif hasattr(v, "__dict__") and type(v).__module__ == "__main__":
                o["k"] = "obj"
                o["cls"] = type(v).__name__
                o["attrs"] = [[n, enc(x, heap, depth + 1)] for n, x in vars(v).items()]
            else:
                o["k"] = "other"
                r = type(v).__name__ + " object"
                if type(v).__name__ in ("map", "filter", "zip", "range", "enumerate", "generator", "list_iterator", "dict_keys", "dict_values", "dict_items", "reversed"):
                    try:
                        r = repr(v) if type(v).__name__ in ("range", "dict_keys", "dict_values", "dict_items") else r + " (lazy iterator)"
                    except Exception:
                        pass
                else:
                    try:
                        rr = repr(v)
                        r = rr if len(rr) < 70 else rr[:67] + "..."
                    except Exception:
                        pass
                o["repr"] = r
        except Exception as e:
            o = {"t": type(v).__name__, "k": "other", "repr": "?"}
        heap[oid] = o
        return {"r": oid}

    def frame_vars(f, heap, is_global):
        items = (g if is_global else f.f_locals).items()
        out = []
        for n, x in list(items):
            if n.startswith("__") or n.startswith(".") or n in ("_run_user", "_viz_run", "_VizStop"):
                continue
            out.append([n, enc(x, heap)])
        return out

    def snapshot(frame, event, arg):
        chain = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == FN:
                chain.append(f)
            f = f.f_back
        chain.reverse()
        heap = {}
        frames = []
        for f in chain:
            is_g = f.f_code.co_name == "<module>"
            fr = {"name": "Global frame" if is_g else f.f_code.co_name, "vars": frame_vars(f, heap, is_g)}
            if f is frame and event == "return" and not is_g:
                fr["ret"] = enc(arg, heap)
            frames.append(fr)
        if not chain or chain[0].f_code.co_name != "<module>":
            frames.insert(0, {"name": "Global frame", "vars": frame_vars(None, heap, True)})
        st = {"line": frame.f_lineno, "ev": event, "fn": frame.f_code.co_name, "frames": frames, "heap": heap, "out": buf.getvalue()}
        if event == "exception":
            st["exc"] = arg[0].__name__ + ": " + str(arg[1])
        steps.append(st)
        if len(steps) >= max_steps:
            raise _VizStop()

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != FN:
            return None
        if event in ("line", "return", "exception"):
            if event == "return" and frame.f_code.co_name == "<module>":
                return tracer
            snapshot(frame, event, arg)
        return tracer

    error, truncated = "", False
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = buf
    try:
        sys.settrace(tracer)
        exec(compile(code, FN, "exec"), g)
    except _VizStop:
        truncated = True
    except BaseException:
        et, ev, tb = sys.exc_info()
        error = "".join(traceback.format_exception(et, ev, tb.tb_next)).replace('File "<viz>", ', "")
    finally:
        sys.settrace(None)
        sys.stdout, sys.stderr = old
    heap = {}
    final = {"line": None, "ev": "end", "fn": "", "frames": [{"name": "Global frame", "vars": frame_vars(None, heap, True)}],
             "heap": heap, "out": buf.getvalue(), "error": error}
    steps.append(final)
    return json.dumps({"steps": steps, "truncated": truncated})
`;
  function setChip(cls, text) { const c = $("#pyChip"); if (c) { c.className = "chip " + cls; c.textContent = text; } }
  function loadPy() {
    if (pyPromise) return pyPromise;
    setChip("loading", "Python: loading…");
    pyPromise = (async () => {
      if (typeof loadPyodide !== "function") throw new Error("Python runtime script not loaded (are you offline?)");
      const py = await loadPyodide();
      py.runPython(PY_SETUP);
      setChip("ready", "Python: ready");
      return py;
    })().catch(e => { setChip("failed", "Python: unavailable"); pyPromise = null; throw e; });
    return pyPromise;
  }

  /* ---------------- syntax highlighting ---------------- */
  function highlight(code, target) {
    target.classList.add("cm-s-site");
    if (window.CodeMirror && CodeMirror.runMode) CodeMirror.runMode(code, "python", target);
    else target.textContent = code;
  }

  /* ---------------- code block ---------------- */
  let cbCounter = 0;
  function codeBlock(code, opts = {}) {
    const id = "cb" + (++cbCounter);
    const wrap = el("div", "cb");
    wrap.id = id;
    wrap.innerHTML = `
      <div class="cb-head">
        <span class="cb-label">${esc(opts.label || "Python")} <span class="edited-badge" hidden>· edited</span></span>
        <button class="cb-btn run" data-a="run" title="Run (Ctrl/⌘+Enter while editing)">▶ Run</button>
        <button class="cb-btn viz" data-a="viz" title="Step through line by line with a memory picture">👣 Step-through</button>
        <button class="cb-btn" data-a="edit">✎ Edit</button>
        <button class="cb-btn" data-a="reset" hidden>↺ Reset</button>
        <button class="cb-btn" data-a="copy" title="Copy code">⧉</button>
      </div>
      <pre class="cb-code"><code></code></pre>
      <pre class="cb-out" hidden aria-live="polite"></pre>
      <div class="viz-host"></div>`;
    const pre = $(".cb-code", wrap), out = $(".cb-out", wrap), vizHost = $(".viz-host", wrap);
    highlight(code, $("code", pre));
    let cm = null, viz = null;
    const getCode = () => cm ? cm.getValue() : code;
    const markEdited = () => {
      const e = getCode() !== code;
      $(".edited-badge", wrap).hidden = !e; $('[data-a="reset"]', wrap).hidden = !cm && !e;
    };
    const showOut = html => { out.hidden = false; out.innerHTML = html; };
    async function run() {
      const btn = $('[data-a="run"]', wrap); btn.disabled = true;
      showOut('<span class="muted">' + (pyPromise ? "Running…" : "Loading Python in your browser (first time only, ~10 MB)…") + "</span>");
      try {
        const py = await loadPy();
        const res = py.globals.get("_run_user")(getCode());
        const [o, err] = res.toJs(); res.destroy();
        let html = o ? esc(o) : "";
        if (err) html += `<span class="err">${esc(err)}</span>`;
        showOut(html || '<span class="muted">(no output)</span>');
      } catch (e) {
        showOut(`<span class="err">Could not start Python: ${esc(e.message || e)}. The playground needs internet the first time.</span>`);
      } finally { btn.disabled = false; }
    }
    async function visualize() {
      const btn = $('[data-a="viz"]', wrap);
      if (viz) { viz.destroy(); viz = null; btn.classList.remove("on"); btn.textContent = "👣 Step-through"; return; }
      btn.disabled = true;
      vizHost.innerHTML = `<div class="viz"><div class="viz-cap">${pyPromise ? "Tracing…" : "Loading Python (first time only)…"}</div></div>`;
      try {
        const py = await loadPy();
        const src = getCode();
        const json = py.globals.get("_viz_run")(src);
        const data = JSON.parse(json);
        viz = Viz(vizHost, src, data, id);
        btn.classList.add("on"); btn.textContent = "✕ Close steps";
      } catch (e) {
        vizHost.innerHTML = `<div class="viz"><div class="viz-cap exc">Could not visualize: ${esc(e.message || e)}</div></div>`;
      } finally { btn.disabled = false; }
    }
    wrap.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "run") run();
      if (a === "viz") visualize();
      if (a === "copy") { navigator.clipboard?.writeText(getCode()); e.target.textContent = "✓"; setTimeout(() => e.target.textContent = "⧉", 1000); }
      if (a === "edit" && !cm) {
        pre.hidden = true;
        cm = CodeMirror(c => pre.after(c), {
          value: code, mode: "python", theme: "site", lineNumbers: true, indentUnit: 4, tabSize: 4,
          viewportMargin: Infinity, lineWrapping: false,
          extraKeys: {
            Tab: c => c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end"),
            "Shift-Tab": c => c.indentSelection("subtract"),
            "Ctrl-Enter": run, "Cmd-Enter": run
          }
        });
        cm.on("change", () => { markEdited(); if (viz) { viz.destroy(); viz = null; const b = $('[data-a="viz"]', wrap); b.classList.remove("on"); b.textContent = "👣 Step-through"; } });
        e.target.closest("[data-a]").hidden = true; markEdited(); cm.focus();
      }
      if (a === "reset") { if (cm) cm.setValue(code); out.hidden = true; markEdited(); }
    });
    wrap.setCode = c => { if (!cm) $('[data-a="edit"]', wrap).click(); cm.setValue(c); };
    return wrap;
  }

  /* ---------------- visualizer ---------------- */
  function Viz(host, src, data, uid) {
    const steps = data.steps, lines = src.split("\n");
    host.innerHTML = `
      <div class="viz" tabindex="0" aria-label="Step-through visualizer. Use left and right arrow keys.">
        <div class="viz-ctrl">
          <button class="vb" data-v="first" aria-label="First step">⏮</button>
          <button class="vb" data-v="prev" aria-label="Previous step">◀</button>
          <button class="vb play" data-v="play">▶ Play</button>
          <button class="vb" data-v="next" aria-label="Next step">▶</button>
          <button class="vb" data-v="last" aria-label="Last step">⏭</button>
          <input type="range" min="0" max="${steps.length - 1}" value="0" aria-label="Step">
          <span class="viz-count"></span>
          <select class="viz-speed" aria-label="Speed"><option value="1400">slow</option><option value="800" selected>normal</option><option value="350">fast</option></select>
        </div>
        <div class="viz-cap"></div>
        <div class="viz-grid">
          <div>
            <div class="viz-code">${lines.map((l, i) => `<div class="vl" data-ln="${i + 1}"><span class="ln">${i + 1}</span><span>${esc(l) || " "}</span></div>`).join("")}</div>
            <div class="viz-legend"><b class="g">➜ green</b> = next line to run · <b class="b">↳ blue</b> = line that just ran</div>
            <div class="viz-out-h">Printed output</div>
            <pre class="viz-out"></pre>
          </div>
          <div class="mem"><div class="mem-frames"><h5>Variables (frames)</h5></div><div class="mem-heap"><h5>Objects</h5></div><svg class="arrows"></svg></div>
        </div>
        ${data.truncated ? '<div class="viz-note">⚠ Stopped after 500 steps (long loop). Shorten the input to see the whole run.</div>' : ""}
        <div class="viz-note">Arrows = references. Two arrows to one box = <b>the same object</b> (aliasing). Yellow flash = just changed.</div>
      </div>`;
    const root = $(".viz", host), range = $("input[type=range]", root), cap = $(".viz-cap", root),
      codeBox = $(".viz-code", root), outBox = $(".viz-out", root), mem = $(".mem", root),
      framesBox = $(".mem-frames", root), heapBox = $(".mem-heap", root), svg = $("svg.arrows", root);
    let i = 0, timer = null, prevSnap = null;

    const val = (v, oidPrefix) => v.r !== undefined
      ? `<span class="ptr" data-to="${uid}-${v.r}" title="reference"></span>`
      : `<span class="prim">${esc(v.p)}</span>`;
    const valText = (v, heap) => v.r !== undefined ? (heap[v.r] ? heap[v.r].t + " object" : "object") : v.p;

    function objHtml(oid, o) {
      const k = o.k;
      const label = { list: "list", tuple: "tuple", set: "set", dict: "dict", func: "function", class: "class", obj: (o.cls || "") + " instance", other: o.t }[k] || o.t;
      let body = "";
      if (k === "list" || k === "tuple") {
        body = o.items.length ? `<div class="cells">${o.items.map((x, j) => `<div class="cell"><i>${j}</i>${val(x)}</div>`).join("")}${o.more ? `<div class="cell"><i>…</i>+${o.more}</div>` : ""}</div>` : '<div class="empty">empty</div>';
      } else if (k === "set") {
        body = o.items.length ? `<div class="cells">${o.items.map(x => `<div class="cell">${val(x)}</div>`).join("")}</div>` : '<div class="empty">empty set()</div>';
      } else if (k === "dict") {
        body = o.pairs.length ? o.pairs.map(([a, b]) => `<div class="kv"><span class="k">${val(a)}</span><span>→</span>${val(b)}</div>`).join("") : '<div class="empty">empty {}</div>';
      } else if (k === "func") {
        body = `<div class="obj-note">${esc(o.name)}${esc(o.sig || "()")}</div>` +
          (o.defaults || []).map(([n, x]) => `<div class="kv"><span class="k">default ${esc(n)}</span>${val(x)}</div>`).join("") +
          (o.cells || []).map(([n, x]) => `<div class="kv"><span class="k">closure ${esc(n)}</span>${val(x)}</div>`).join("");
      } else if (k === "class") {
        body = `<div class="obj-note">class ${esc(o.name)}</div>` +
          (o.attrs || []).map(([n, x]) => `<div class="kv"><span class="k">${esc(n)}</span>${val(x)}</div>`).join("") +
          ((o.methods || []).length ? `<div class="obj-note">methods: ${o.methods.map(esc).join(", ")}</div>` : "");
      } else if (k === "obj") {
        body = (o.attrs || []).length ? o.attrs.map(([n, x]) => `<div class="kv"><span class="k">${esc(n)}</span>${val(x)}</div>`).join("") : '<div class="empty">no instance attributes</div>';
      } else {
        body = `<div class="obj-note">${esc(o.repr || o.t)}</div>`;
      }
      return `<div class="obj k-${k}" data-oid="${uid}-${oid}"><div class="obj-h"><span>${esc(label)}</span><span class="oid">#${oid.slice(-4)}</span></div>${body}</div>`;
    }

    function render() {
      const s = steps[i], prev = i > 0 ? steps[i - 1] : null;
      range.value = i;
      $(".viz-count", root).textContent = `Step ${i + 1} / ${steps.length}`;
      // caption
      cap.className = "viz-cap";
      if (s.ev === "line") cap.innerHTML = `<b>➜ Next:</b> line ${s.line} <code>${esc((lines[s.line - 1] || "").trim())}</code>${s.fn && s.fn !== "<module>" ? ` &nbsp;(inside <b>${esc(s.fn)}</b>)` : ""}`;
      else if (s.ev === "return") {
        cap.classList.add("ret");
        const fr = s.frames[s.frames.length - 1];
        cap.innerHTML = s.fn === "<module>" ? "Module finished" : `<b>↩ ${esc(s.fn)}</b> returns <code>${esc(fr && fr.ret ? valText(fr.ret, s.heap) : "None")}</code>`;
      } else if (s.ev === "exception") { cap.classList.add("exc"); cap.innerHTML = `<b>⚠ Exception</b> in ${esc(s.fn)}: <code>${esc(s.exc)}</code>`; }
      else if (s.ev === "end") {
        if (s.error) { cap.classList.add("exc"); cap.innerHTML = `<b>✗ Program stopped with an error</b><pre class="out" style="margin-top:6px">${esc(s.error)}</pre>`; }
        else { cap.classList.add("ret"); cap.innerHTML = "<b>✓ Program finished.</b> Final state of memory below."; }
      }
      // code lines
      $$(".vl", codeBox).forEach(d => d.classList.remove("cur", "prev"));
      if (prev && prev.line && prev.ev === "line") $(`.vl[data-ln="${prev.line}"]`, codeBox)?.classList.add("prev");
      if (s.line) {
        const cur = $(`.vl[data-ln="${s.line}"]`, codeBox);
        if (cur) { cur.classList.add(s.ev === "line" ? "cur" : "prev"); const top = cur.offsetTop - codeBox.clientHeight / 2; codeBox.scrollTo({ top, behavior: "smooth" }); }
      }
      // stdout
      const pOut = prev ? prev.out : "";
      outBox.innerHTML = s.out.startsWith(pOut) && s.out.length > pOut.length ? esc(pOut) + "<mark>" + esc(s.out.slice(pOut.length)) + "</mark>" : (esc(s.out) || '<span style="opacity:.6">(nothing printed yet)</span>');
      // frames
      const prevVars = {};
      if (prevSnap) prevSnap.frames.forEach((f, fi) => f.vars.forEach(([n, v]) => prevVars[fi + ":" + f.name + ":" + n] = JSON.stringify(v)));
      framesBox.innerHTML = "<h5>Variables (frames)</h5>" + s.frames.map((f, fi) => {
        const rows = f.vars.map(([n, v]) => {
          const key = fi + ":" + f.name + ":" + n, changed = prevSnap && prevVars[key] !== JSON.stringify(v);
          return `<div class="var ${changed ? "flash" : ""}"><span class="vn">${esc(n)}</span>${val(v)}</div>`;
        }).join("") + (f.ret ? `<div class="var ret flash"><span class="vn">↩ return</span>${val(f.ret)}</div>` : "");
        return `<div class="frame ${fi === s.frames.length - 1 && s.ev !== "end" ? "active" : ""}"><div class="frame-h">${esc(f.name)}</div>${rows || '<div class="empty">(no variables yet)</div>'}</div>`;
      }).join("");
      // heap
      const ids = Object.keys(s.heap);
      heapBox.innerHTML = "<h5>Objects</h5>" + (ids.length ? ids.map(oid => objHtml(oid, s.heap[oid])).join("") : '<div class="empty">(no objects yet)</div>');
      if (prevSnap) ids.forEach(oid => {
        const box = $(`[data-oid="${uid}-${oid}"]`, heapBox);
        if (!prevSnap.heap[oid]) box.classList.add("new");
        else if (JSON.stringify(prevSnap.heap[oid]) !== JSON.stringify(s.heap[oid])) box.classList.add("flash");
      });
      prevSnap = s;
      requestAnimationFrame(drawArrows);
    }

    function drawArrows() {
      const mr = mem.getBoundingClientRect();
      svg.setAttribute("width", mem.scrollWidth); svg.setAttribute("height", mem.scrollHeight);
      const color = getComputedStyle(root).getPropertyValue("--accent").trim() || "#2457d6";
      let paths = `<defs><marker id="ah-${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker></defs>`;
      $$(".ptr", mem).forEach(p => {
        const t = $(`[data-oid="${p.dataset.to}"]`, mem); if (!t) return;
        const a = p.getBoundingClientRect(), b = t.getBoundingClientRect();
        const sx = a.left + a.width / 2 - mr.left, sy = a.top + a.height / 2 - mr.top;
        let ex, ey, c1x, c1y, c2x, c2y;
        if (b.left - mr.left > sx + 14) {          // target to the right
          ex = b.left - mr.left - 2; ey = b.top - mr.top + 12;
          const dx = Math.max(30, (ex - sx) / 2);
          c1x = sx + dx; c1y = sy; c2x = ex - dx; c2y = ey;
        } else {                                   // same column / stacked: loop around the right edge
          ex = b.right - mr.left + 2; ey = b.top - mr.top + 12;
          const bulge = Math.min(mem.clientWidth - 4, Math.max(sx, ex) + 26 + Math.min(30, Math.abs(ey - sy) / 8));
          c1x = bulge; c1y = sy; c2x = bulge; c2y = ey;
        }
        paths += `<path d="M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}" fill="none" stroke="${color}" stroke-width="1.8" opacity=".85" marker-end="url(#ah-${uid})"/>`;
      });
      svg.innerHTML = paths;
    }

    const go = n => { i = Math.max(0, Math.min(steps.length - 1, n)); render(); };
    const stop = () => { clearInterval(timer); timer = null; $('[data-v="play"]', root).textContent = "▶ Play"; };
    const play = () => {
      if (timer) return stop();
      if (i >= steps.length - 1) go(0);
      $('[data-v="play"]', root).textContent = "⏸ Pause";
      timer = setInterval(() => { if (i >= steps.length - 1) stop(); else go(i + 1); }, +$(".viz-speed", root).value);
    };
    root.addEventListener("click", e => {
      const v = e.target.closest("[data-v]")?.dataset.v; if (!v) return;
      if (v !== "play") stop();
      ({ first: () => go(0), prev: () => go(i - 1), next: () => go(i + 1), last: () => go(steps.length - 1), play })[v]();
    });
    $(".viz-speed", root).onchange = () => { if (timer) { stop(); play(); } };
    range.oninput = () => { stop(); go(+range.value); };
    root.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); stop(); go(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); stop(); go(i - 1); }
      if (e.key === " ") { e.preventDefault(); play(); }
    });
    const ro = new ResizeObserver(() => requestAnimationFrame(drawArrows)); ro.observe(mem);
    go(0);
    root.focus({ preventScroll: true });
    return { destroy() { stop(); ro.disconnect(); host.innerHTML = ""; } };
  }

  /* ---------------- anatomy diagram ---------------- */
  function anatomy(a) {
    const code = a.code;
    let notes = a.notes.map(n => ({ ...n, col: code.indexOf(n.at) })).filter(n => n.col >= 0).sort((x, y) => x.col - y.col);
    // numbered, coloured underline segments (non-overlapping)
    let html = "", pos = 0;
    notes.forEach((n, k) => {
      const start = Math.max(n.col, pos), end = Math.max(start, n.col + n.at.length);
      html += esc(code.slice(pos, start));
      const c = "c" + ((k % 6) + 1);
      html += `<span class="seg ${c}">${esc(code.slice(start, end)) || " "}<sup>${k + 1}</sup></span>`;
      pos = end;
    });
    html += esc(code.slice(pos));
    const legend = notes.map((n, k) => `<div class="c${(k % 6) + 1}"><span class="n">${k + 1}</span><span><code>${esc(n.at)}</code> ${esc(n.label)}</span></div>`).join("");
    // ASCII arrow tree (desktop), like:  ↑ ↑   └── label
    const cols = notes.map(n => n.col), labelCol = code.length + 3;
    const row = len => Array(len).fill(" ");
    const L = [code];
    const r1 = row(labelCol); cols.forEach(c => r1[c] = "↑"); L.push(r1.join("").trimEnd());
    const r2 = row(labelCol); cols.forEach(c => r2[c] = "│"); L.push(r2.join("").trimEnd());
    for (let k = notes.length - 1; k >= 0; k--) {
      const r = row(labelCol);
      cols.slice(0, k).forEach(c => r[c] = "│");
      r[cols[k]] = "└";
      for (let x = cols[k] + 1; x < labelCol - 1; x++) r[x] = "─";
      L.push(r.join("") + " " + notes[k].label);
    }
    const box = el("div", "anat");
    box.innerHTML = `<div class="anat-line mono">${html}</div><div class="anat-legend">${legend}</div><pre class="anat-tree">${esc(L.join("\n"))}</pre>`;
    return box;
  }

  /* ---------------- generic study page ---------------- */
  function renderPage(P) {
    header(P.key, true);
    const total = P.sections.reduce((n, s) => n + s.items.length, 0);
    let done = store.get("done:" + P.key, {});
    const layout = el("div", "layout");
    layout.innerHTML = `
      <aside class="side" aria-label="Contents">
        <div class="prog">Understood: <b id="progText">0 / ${total}</b><div class="bar"><div id="progBar"></div></div>
          <button class="linkbtn" id="progReset">Reset progress</button></div>
        <input class="side-search" type="search" placeholder="Filter questions…" aria-label="Filter questions">
        <div id="sideList"></div>
      </aside>
      <div class="scrim"></div>
      <main class="main"><div class="main-narrow">
        <div class="page-head"><h1>${P.title}</h1><div class="lead">${P.intro || ""}</div>
          <div class="box" style="font-size:.9rem">💡 <b>How to study here:</b> predict first, then press <b>▶ Run</b>.
          Press <b>👣 Step-through</b> to watch the code run line by line with arrows showing which name points to which object.
          <b>✎ Edit</b> any code and run it again. Turn on <b>Quiz mode</b> (top right) to hide all answers.</div>
        </div>
        <div id="content"></div>
      </div></main>`;
    document.body.append(layout);
    const side = $("#sideList"), content = $("#content");
    let sideHtml = "";
    for (const s of P.sections) {
      sideHtml += `<div class="side-title">${esc(s.title)}</div>`;
      sideHtml += s.items.map(it => `<a class="si" href="#${it.id}" data-id="${it.id}"><span class="dot"></span><span>${esc(it.title)}</span></a>`).join("");
      const h = el("h2", "sec-title", s.title); h.id = s.id; content.append(h);
      if (s.intro) content.append(el("div", "sec-intro", s.intro));
      s.items.forEach((it, n) => content.append(renderItem(it, n, P.key)));
    }
    side.innerHTML = sideHtml;
    // filter
    $(".side-search").oninput = e => {
      const q = e.target.value.toLowerCase();
      $$(".si", side).forEach(a => a.hidden = q && !a.textContent.toLowerCase().includes(q));
      $$(".card[data-item]", content).forEach(c => c.hidden = q && !c.dataset.search.includes(q));
    };
    // progress
    const upd = () => {
      const n = Object.keys(done).filter(k => done[k]).length;
      $("#progText").textContent = `${n} / ${total}`; $("#progBar").style.width = (100 * n / total) + "%";
      $$(".si", side).forEach(a => a.classList.toggle("done", !!done[a.dataset.id]));
      $$("input[data-done]", content).forEach(cb => cb.checked = !!done[cb.dataset.done]);
    };
    content.addEventListener("change", e => { if (e.target.dataset.done) { done[e.target.dataset.done] = e.target.checked; store.set("done:" + P.key, done); upd(); } });
    $("#progReset").onclick = () => { done = {}; store.set("done:" + P.key, done); upd(); };
    upd();
    // current item highlight in sidebar
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { $$(".si.cur", side).forEach(a => a.classList.remove("cur")); const a = $(`.si[data-id="${e.target.id}"]`, side); if (a) { a.classList.add("cur"); a.scrollIntoView({ block: "nearest" }); } }
    }), { rootMargin: "-30% 0px -65% 0px" });
    $$(".card[data-item]", content).forEach(c => io.observe(c));
    if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 50);
  }

  function list(items, cls) { return `<ul class="${cls}">${items.map(x => `<li>${x}</li>`).join("")}</ul>`; }

  function renderItem(it, n, pageKey) {
    const card = el("article", "card");
    card.id = it.id; card.dataset.item = "1";
    card.dataset.search = (it.title + " " + (it.tags || []).join(" ") + " " + it.prompt).toLowerCase().replace(/<[^>]+>/g, "");
    card.innerHTML = `
      <div class="item-head"><h3>${esc(it.title)}</h3>
        ${(it.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}
        <label class="understood"><input type="checkbox" data-done="${it.id}"> Understood</label></div>
      ${it.tested ? `<div class="box tested" style="margin-top:10px">🎯 <b>What's being tested:</b> ${it.tested}</div>` : ""}
      <div class="prompt">${it.prompt}</div>`;
    if (it.code) card.append(codeBlock(it.code, { label: it.codeLabel || "Code" }));
    // MCQ
    let mcqWrap = null;
    if (it.choices) {
      mcqWrap = el("div", "choices");
      mcqWrap.innerHTML = it.choices.map((c, k) => `<button class="choice" data-k="${k}"><span class="letter">${"ABCDEFG"[k]}</span><span>${c}</span></button>`).join("");
      card.append(mcqWrap);
      const vw = el("div", "verdict-wrap"); card.append(vw);
      mcqWrap.addEventListener("click", e => {
        const b = e.target.closest(".choice"); if (!b) return;
        const k = +b.dataset.k;
        $$(".choice", mcqWrap).forEach(x => x.classList.remove("correct", "wrong"));
        $(`.choice[data-k="${it.answer}"]`, mcqWrap).classList.add("correct");
        if (k !== it.answer) b.classList.add("wrong");
        vw.innerHTML = `<div class="verdict ${k === it.answer ? "ok" : "bad"}">${k === it.answer ? "✓ Correct!" : "✗ Not quite. The correct answer is highlighted in green."}</div>`;
        ans.hidden = false; tog.textContent = "Hide explanation"; tog.setAttribute("aria-expanded", "true");
      });
    }
    // answer panel
    const tog = el("button", "btn ghost ans-toggle", it.choices ? "Show answer & explanation" : "Show answer & explanation");
    tog.setAttribute("aria-expanded", "false");
    const ans = el("div", "ans"); ans.hidden = true;
    tog.onclick = () => { ans.hidden = !ans.hidden; tog.textContent = ans.hidden ? "Show answer & explanation" : "Hide explanation"; tog.setAttribute("aria-expanded", !ans.hidden); };
    card.append(tog, ans);
    let h = "";
    if (it.choices) h += `<h4>✅ Answer</h4><div class="box answer"><b>${"ABCDEFG"[it.answer]}.</b> ${it.choices[it.answer]}</div>`;
    if (it.code && it.output != null) h += `<h4>🖨 Exact output</h4><pre class="out">${esc(it.output)}</pre>`;
    ans.innerHTML = h;
    if (it.anatomy && it.anatomy.length) { ans.append(el("h4", null, "🔍 Visual breakdown")); it.anatomy.forEach(a => ans.append(anatomy(a))); }
    let h2 = "";
    if (it.explain) h2 += `<h4>💬 Explanation</h4><div>${it.explain}</div>`;
    if (it.steps && it.steps.length) h2 += `<h4>🪜 Step by step</h4><ol>${it.steps.map(s => `<li>${s}</li>`).join("")}</ol>`;
    if (it.trace) h2 += `<h4>🧠 Memory picture / trace</h4><pre class="trace">${esc(it.trace)}</pre>`;
    if (it.key) h2 += `<h4>🔑 Key thing to remember</h4><div class="box key">${it.key}</div>`;
    if (it.lookFor && it.lookFor.length) h2 += `<h4>👀 What to look for on the exam</h4>${list(it.lookFor, "look")}`;
    if (it.tips && it.tips.length) h2 += `<h4>💡 Tips & tricks</h4>${list(it.tips, "tips")}`;
    if (it.mistakes && it.mistakes.length) h2 += `<h4>⚠️ Common mistakes</h4>${list(it.mistakes, "mist")}`;
    if (it.tries && it.tries.length) h2 += `<h4>🧪 Try this change</h4>${list(it.tries.map(t => `${t.change}. <i>Expect:</i> ${t.expect}`), "")}`;
    ans.insertAdjacentHTML("beforeend", h2);
    (it.extra || []).forEach(x => {
      ans.append(el("h4", null, "🧩 " + esc(x.label)));
      ans.append(codeBlock(x.code, { label: x.label }));
      if (x.output != null) { const d = el("details"); d.innerHTML = `<summary>Expected output</summary><pre class="out">${esc(x.output)}</pre>`; ans.append(d); }
    });
    // alternatives
    if (it.alts && it.alts.length) {
      const alts = el("div", "alts", `<h4>🎲 Likely exam alternatives (${it.alts.length}): predict, then run</h4>`);
      it.alts.forEach((a, k) => {
        const d = el("div", "alt", `<div class="alt-q">${k + 1}. ${a.q}</div>`);
        d.append(codeBlock(a.code, { label: "Alternative " + (k + 1) }));
        const det = el("details"); det.innerHTML = `<summary>Show answer</summary><pre class="out">${esc(a.answer)}</pre>`;
        d.append(det); alts.append(d);
      });
      card.append(alts);
    }
    return card;
  }

  // Developer self-test: runs every block of the current page in Pyodide and through the tracer.
  async function selfTest() {
    const py = await loadPy(), run = py.globals.get("_run_user"), viz = py.globals.get("_viz_run");
    const bad = []; let n = 0;
    const check = (where, code, want) => {
      if (!code) return;
      n++;
      const r = run(code); const [o, err] = r.toJs(); r.destroy();
      if (want != null && (o + (err ? "ERR:" + err : "")).replace(/\s+$/, "") !== String(want).replace(/\s+$/, "")) bad.push({ where, got: o + err, want });
      try { const d = JSON.parse(viz(code)); if (!d.steps.length) bad.push({ where, viz: "no steps" });
        const end = d.steps[d.steps.length - 1]; if (!!end.error !== !!err) bad.push({ where, viz: "error mismatch", e: end.error }); }
      catch (e) { bad.push({ where, viz: String(e) }); }
    };
    for (const s of window.PAGE.sections) for (const it of s.items) {
      check(it.id, it.code, it.output);
      (it.extra || []).forEach((x, k) => check(it.id + " extra" + k, x.code, x.output));
      (it.alts || []).forEach((a, k) => check(it.id + " alt" + k, a.code, a.answer));
    }
    return { checked: n, problems: bad };
  }

  window.Core = { header, renderPage, codeBlock, anatomy, esc, store, loadPy, selfTest };
  document.addEventListener("DOMContentLoaded", () => {
    if (window.PAGE) renderPage(window.PAGE);
    else if (document.body.dataset.page) header(document.body.dataset.page, false);
  });
})();
