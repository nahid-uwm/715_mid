// Adapts the practice-exam data (practice-questions.js + practice-learn.js) to the shared PAGE schema
// and adds labelled anatomy diagrams for the key lines.
(() => {
  const Q = window.QUESTIONS, L = window.LEARN;
  const ANATOMY = {
    A1: [{ code: "m = [[0] * 2] * 3", notes: [
      { at: "[0] * 2", label: "ONE inner list [0, 0]" },
      { at: "* 3", label: "3 references to the SAME list" },
      { at: "m =", label: "m points to the outer list" }] }],
    A2: [{ code: "u = t[0]", notes: [
      { at: "u =", label: "new name, no copy" },
      { at: "t[0]", label: "the list inside the tuple" }] }],
    A3: [{ code: "s.add(True)", notes: [
      { at: "s.add", label: "hash, then == check" },
      { at: "True", label: "True == 1 → already present" }] }],
    A5: [{ code: "{abs(n) for n in ns}", notes: [
      { at: "{", label: "braces, no colon → SET" },
      { at: "abs(n)", label: "expression per item" },
      { at: "for n in ns", label: "loop" }] }],
    A6: [{ code: "{c: ord(c) - 96 for c in \"cab\"}", notes: [
      { at: "c:", label: "key" },
      { at: "ord(c) - 96", label: "value: a→1, b→2, c→3" },
      { at: "for c in", label: "loop order = key order" }] }],
    A7: [{ code: "m = map(str, [1, 2])", notes: [
      { at: "map(", label: "lazy iterator, nothing run yet" },
      { at: "str", label: "function applied to each" },
      { at: "[1, 2]", label: "input iterable" }] }],
    A8: [{ code: "reduce(lambda a, b: a if a > b else b, [3, 9, 2])", notes: [
      { at: "a,", label: "accumulator (result so far)" },
      { at: "b:", label: "next item" },
      { at: "a if a > b else b", label: "keep the bigger → max" },
      { at: "[3, 9, 2]", label: "folded left to right" }] }],
    A9: [{ code: "def add(v, bag={}):", notes: [
      { at: "def", label: "runs ONCE → creates function" },
      { at: "bag={}", label: "ONE dict, shared by all calls" }] }],
    A10: [{ code: "self.lines.append(s)", notes: [
      { at: "self.lines", label: "not on instance → class list" },
      { at: "append", label: "MUTATES the shared list" }] }],
    B1: [{ code: "new = old[:]", notes: [
      { at: "new =", label: "new OUTER list" },
      { at: "old[:]", label: "inner lists still shared" }] }],
    B2: [{ code: "if isinstance(label, int):", notes: [
      { at: "isinstance", label: "subclass check" },
      { at: "label", label: "True / False also match" },
      { at: "int", label: "bool is a subclass of int" }] }],
    C1: [{ code: "counts[label] = counts.get(label, 0) + 1", notes: [
      { at: "counts[label]", label: "Dictionary key" },
      { at: "get(label", label: "Look up key" },
      { at: "0)", label: "Start at 0" },
      { at: "+ 1", label: "Add one" }] },
      { code: "key = (label, type(label).__name__)", notes: [
      { at: "label,", label: "the value" },
      { at: "type(label).__name__", label: "'int' / 'bool' / 'float'" },
      { at: "(label", label: "tuple key keeps types apart" }] }],
    D1: [{ code: "reduce(lambda acc, r: acc + r[1], ROWS, 0)", notes: [
      { at: "acc,", label: "Accumulator" },
      { at: "r:", label: "Current tuple" },
      { at: "acc +", label: "Running total" },
      { at: "r[1]", label: "Score" },
      { at: "ROWS", label: "Dataset" },
      { at: "0)", label: "Start at 0" }] },
      { code: "list(map(lambda r: r[0].upper(), filter(lambda r: r[1] >= 90, ROWS)))", notes: [
      { at: "list(", label: "force the lazy iterator" },
      { at: "map(", label: "2nd: transform each" },
      { at: "r[0].upper()", label: "name → upper case" },
      { at: "filter(", label: "1st: keep matching rows" },
      { at: "r[1] >= 90", label: "at least 90" }] }],
    D2: [{ code: "return hash((self.coords, self.label, type(self.label).__name__))", notes: [
      { at: "hash((", label: "hash ONE tuple" },
      { at: "self.coords", label: "same fields as __eq__" },
      { at: "self.label,", label: "the label value" },
      { at: "type(self.label).__name__", label: "type keeps 1 ≠ True" }] }]
  };
  const items = Q.map(q => {
    const l = L[q.id] || {};
    const extra = [];
    if (q.play) extra.push({ label: q.part === "D" ? "Solution code" : "Demo code", code: q.play, output: q.output });
    if (q.fixed) extra.push({ label: "Fixed version", code: q.fixed, output: q.fixedOutput });
    return {
      id: q.id, title: `${q.id}. ${q.title} (${q.points} pts)`, tags: ["Part " + q.part],
      tested: l.tested,
      prompt: q.prompt,
      code: q.code, codeLabel: q.play ? "Given code" : "Code",
      output: q.play ? null : q.output,
      anatomy: ANATOMY[q.id],
      explain: `<div class="box">${q.idea}</div>` + (q.model ? `<p><b>Model answer (what to write):</b><br>${q.model}</p>` : ""),
      steps: q.steps, trace: l.behavior, key: l.key, lookFor: l.lookFor, tips: l.tips,
      mistakes: (q.mistakes || []).concat(l.moreMistakes || []),
      tries: q.tries, extra,
      alts: (l.variants || []).map(v => ({ q: v.q, code: v.code, answer: v.answer }))
    };
  });
  const part = p => items.filter(i => i.tags[0] === "Part " + p);
  window.PAGE = {
    key: "practice",
    title: "📝 Practice Midterm: Full Solutions",
    intro: "Same length, format and coverage as the real midterm (75 min, closed book). The real exam uses <b>different code with the same ideas</b>, so practise the <b>alternatives</b> under each question.",
    sections: [
      { id: "part-A", title: "Part A: Predict the Output (40 pts, 4 each)", intro: "Write output <b>exactly</b> as Python prints it (quotes, spaces, brackets). Any order for sets.", items: part("A") },
      { id: "part-B", title: "Part B: Short Explanation (24 pts, 12 each)", intro: "2–4 sentences: <b>mechanism + concrete example + fix</b>.", items: part("B") },
      { id: "part-C", title: "Part C: Find and Fix (21 pts)", intro: "Three labelled parts: <b>Output (6) / Cause (7) / Fix (8)</b>.", items: part("C") },
      { id: "part-D", title: "Part D: Write Code (35 pts)", intro: "Use the construct they name. State results when asked.", items: part("D") }
    ]
  };
})();
