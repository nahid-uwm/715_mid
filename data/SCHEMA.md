# Page data schema (shared by all study pages)

Each data file is a plain browser script that assigns ONE global:

```js
window.PAGE = {
  key: "quizzes",                 // localStorage namespace: "quizzes" | "lectures" | "homework"
  title: "Quizzes 2–4",
  intro: "<p>html intro</p>",
  sections: [{
    id: "q2",                     // url-safe, unique on the page
    title: "Quiz 2: Types, Control Flow, Collections",
    intro: "<p>optional html</p>",
    items: [{
      id: "q2-1",                 // url-safe, unique on the page
      title: "Type of 3 / 2",     // short
      tags: ["types"],            // optional
      prompt: "html question text; inline code in <code>…</code>",
      code: "python source (plain text, NOT html-escaped). Shown highlighted + runnable + visualizable. Optional.",
      output: "EXACT stdout of `code` (verified by running python3), or null if the code prints nothing / output is nondeterministic",
      choices: ["html choice", "..."],   // MCQ only (keep original quiz choices + order)
      answer: 2,                          // MCQ only: index of the correct choice
      explain: "html: plain-language explanation of WHY (beginner friendly, short paragraphs / <br>)",
      steps: ["html step", "..."],        // optional step-by-step walkthrough
      anatomy: [                           // optional but ENCOURAGED: labeled visual breakdown of one line of code
        { code: "counts[label] = counts.get(label, 0) + 1",
          notes: [ { at: "counts[label]", label: "Dictionary key" },
                   { at: "get(label", label: "Look up key" },
                   { at: "0)", label: "Start at 0" },
                   { at: "+ 1", label: "Add one" } ] }
        // `at` MUST be an exact substring of `code`; the arrow points at its first char.
        // Notes may be in any order; the renderer sorts them. Keep labels short (≤ 28 chars).
      ],
      trace: "optional plain-text monospace trace table or memory picture (NOT html), e.g.\nacc | r          | new acc\n0   | ('ann',90) | 90",
      key: "html: the ONE thing to remember",
      lookFor: ["html"],    // optional: code patterns that signal this concept on the exam
      tips: ["html"],       // optional: tricks / mnemonics
      mistakes: ["html"],   // common student mistakes (1–3)
      extra: [              // optional extra runnable blocks: solutions, fixed versions, demos
        { label: "Solution", code: "python", output: "exact stdout or null" }
      ],
      alts: [               // REQUIRED 1–3: likely exam-style alternatives on the same idea
        { q: "html question", code: "python", answer: "exact stdout" }
      ]
    }]
  }]
};
```

## Rules
- Python runs in the browser via Pyodide (CPython **3.12**). Use only the standard library. No `input()`, no network, no numpy/tensorflow.
  If an original example needs those, adapt it (e.g. replace `input()` with a fixed value and say so in `explain`).
- Every `output` / `alts[].answer` / `extra[].output` MUST be the exact stdout produced by running the code with `python3` (no trailing newline needed).
  Verify with a script. If output depends on time, memory addresses, randomness or Python version, set it to `null` (for alts, rewrite the code so it is deterministic).
- Error cases: print a stable message, e.g. `try: ... except TypeError as e: print(type(e).__name__)`. Never rely on exact error wording (it changes between 3.12 and 3.13).
- Code fields are plain text with real newlines (use JS template literals with backticks; escape backticks and `${` if present). HTML fields: escape `<`, `>`, `&` in code shown inside html.
- Tone: simple, visual, exam-focused. Prefer `anatomy` diagrams and `trace` tables over long prose.
- File must be valid JS: `node -e 'global.window={};require("./data/FILE.js");console.log(Object.keys(window.PAGE))'` must work.
