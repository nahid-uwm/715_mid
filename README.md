# CS 715 Midterm Lab

A study website for the CS 715/657 midterm. It covers the practice exam, Quizzes 2–4, Lectures 1–5 and Homework 2–3. Every code block is runnable, and every block can be **stepped through line by line with an animated memory diagram**.

## Open it
Double-click `index.html`. If your browser blocks scripts on `file://`, serve the folder instead:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000. It works on phones too: put the folder on any static host, or open it from your laptop's IP on the same Wi-Fi.

**Internet is needed** the first time you press Run or Step-through. Python (Pyodide, about 10 MB) loads on demand and is then cached. Without internet, all answers and explanations still work.

## Pages
| Page | What's inside |
|---|---|
| `index.html` | Home: the 10 most likely exam patterns, a 2-hour plan, the cheat sheet, and a step-through demo |
| `practice.html` | Practice midterm A1–D2: exact outputs, model answers, labelled diagrams, traces, and 49 alternatives |
| `quizzes.html` | Quizzes 2–4 (30 MCQs): click an answer to check it, then read the explanation and alternatives |
| `lectures.html` | Lectures 1–5 code examples: cleaned up, runnable, explained, with alternatives |
| `homework.html` | Homework 2–3: every snippet plus full solution code and model written answers |

## On every code block
- **▶ Run** executes the code in the browser.
- **👣 Step-through** animates execution. It shows the next line to run, the variables (frames), and the objects with arrows for references. A yellow flash marks what just changed, and printed output builds up step by step. Use Play/Pause and speed, the slider, or the ← → keys.
- **✎ Edit** lets you change the code, then Run or Step-through again. **↺ Reset** restores the original.
- **Quiz mode** (top right) hides all answers. **Understood** checkboxes track progress in your browser.

## Files
- `assets/core.js`: engine (header and nav, Pyodide runner, step-through tracer and renderer, anatomy diagrams, page renderer, `Core.selfTest()`)
- `assets/core.css`: styles, light/dark themes, mobile layout
- `data/*.js`: page content (`practice-questions.js` + `practice-learn.js` → `practice.js`, `quizzes.js`, `lectures.js`, `homework.js`, `hot.js`)
- `data/SCHEMA.md`: content schema
- `tools/verify.js`: `node tools/verify.js data/quizzes.js …` runs every block with local `python3` and checks the stated outputs

In the browser console on any study page, `await Core.selfTest()` runs every block in Pyodide and through the tracer.
