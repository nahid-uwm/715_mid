// Usage: node tools/verify.js data/quizzes.js [more files...]
// Runs every code block with python3 and compares against the stated output.
const { execFileSync } = require("child_process");
const path = require("path");
let fails = 0, checked = 0;
function run(code) {
  try { return execFileSync("python3", ["-c", code], { stdio: ["ignore", "pipe", "pipe"], timeout: 10000 }).toString(); }
  catch (e) { return (e.stdout || "").toString() + "\n<<ERROR>> " + (e.stderr || "").toString().trim().split("\n").pop(); }
}
function check(where, code, want) {
  if (!code || want === null || want === undefined) return;
  checked++;
  const got = run(code).replace(/\s+$/, ""), exp = String(want).replace(/\s+$/, "");
  if (got !== exp) { fails++; console.log(`\n✗ ${where}\n  GOT:  ${JSON.stringify(got)}\n  WANT: ${JSON.stringify(exp)}`); }
}
for (const f of process.argv.slice(2)) {
  global.window = {};
  delete require.cache[path.resolve(f)];
  require(path.resolve(f));
  const P = window.PAGE;
  if (!P || !P.sections) { console.log(`✗ ${f}: window.PAGE missing`); fails++; continue; }
  const ids = new Set();
  for (const s of P.sections) for (const it of s.items) {
    const w = `${f} :: ${it.id}`;
    if (ids.has(it.id)) { fails++; console.log(`✗ duplicate id ${w}`); } ids.add(it.id);
    for (const k of ["id", "title", "prompt", "explain", "key", "mistakes", "alts"])
      if (it[k] === undefined) { fails++; console.log(`✗ ${w}: missing ${k}`); }
    if (it.choices && (typeof it.answer !== "number" || !it.choices[it.answer])) { fails++; console.log(`✗ ${w}: bad answer index`); }
    if (it.code && it.output === undefined) { fails++; console.log(`✗ ${w}: code without output field`); }
    check(w + " [code]", it.code, it.output);
    (it.extra || []).forEach((x, i) => check(`${w} [extra ${i}: ${x.label}]`, x.code, x.output));
    (it.alts || []).forEach((a, i) => { if (!a.code || a.answer == null) { fails++; console.log(`✗ ${w}: alt ${i} needs code+answer`); } else check(`${w} [alt ${i}]`, a.code, a.answer); });
    (it.anatomy || []).forEach(a => a.notes.forEach(n => { if (!a.code.includes(n.at)) { fails++; console.log(`✗ ${w}: anatomy 'at' not found: ${n.at}`); } }));
  }
}
console.log(`\n${checked} code blocks checked, ${fails} problems.`);
process.exit(fails ? 1 : 0);
