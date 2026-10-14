// Homework 2 + Homework 3 study data (CS 715 midterm). See data/SCHEMA.md.
// Every output below was produced by running the code with python3 (3.12 / 3.14).
(function () {

const RAW = `RAW = [
    ((1.0, 2.0), 1),
    ((3.0, 4.0), 0),
    ((1.0, 2.0), 1),
    ((5.0, 6.0), True),
    ((7.0, 8.0), 1.0),
    ((9.0, 1.0), False),
    ((2.0, 3.0), "1"),
    ((4.0, 5.0), 0),
    ((5.0, 6.0), True),
    ((3.0, 4.0), False),
    ((7.0, 8.0), 1),
]`;

const HW2_FUNCS = `def count_labels(records):
    counts = {}
    for features, label in records:
        counts[label] = counts.get(label, 0) + 1
    return counts

def dedup_naive(records):
    return list(set(records))

def typed_key(record):
    features, label = record
    return (features, label, type(label).__name__)`;

const HW2_DATASET = `class Dataset:
    def __init__(self, records):
        self.records = list(records)          # our own copy of the list

    @staticmethod
    def _canonical(label):
        # bool FIRST: True/False are also ints (bool is a subclass of int)
        if isinstance(label, bool):
            return int(label)
        if isinstance(label, int) and label in (0, 1):
            return label
        if isinstance(label, float) and label in (0.0, 1.0):
            return int(label)
        return None                           # e.g. "1": a string -> don't guess

    def normalized_labels(self):
        """Return (normalized_records, problems). Nothing is silently coerced."""
        normalized = [(f, self._canonical(l)) for f, l in self.records
                      if self._canonical(l) is not None]
        problems = [(f, l) for f, l in self.records if self._canonical(l) is None]
        return normalized, problems

    def dedup(self):
        seen = set()
        out = []
        for record in self.records:
            key = typed_key(record)           # label TYPE is part of identity
            if key not in seen:
                seen.add(key)
                out.append(record)            # keeps first occurrence, in order
        return Dataset(out)

    def summary(self):
        normalized, problems = self.normalized_labels()
        return {
            "records": len(self.records),
            "label_counts": {c: sum(1 for _, l in normalized if l == c) for c in (0, 1)},
            "unresolved": len(problems),
        }`;

const HW3_RECORD = `class Record:
    def __init__(self, features, label):
        self.features = tuple(features)
        self.label = label

    def __repr__(self):
        return f"Record({self.features!r}, {self.label!r}, {type(self.label).__name__})"

    def __eq__(self, other):
        if not isinstance(other, Record):
            return NotImplemented             # let Python try the other side / fall back
        return (self.features == other.features
                and self.label == other.label
                and type(self.label) is type(other.label))

    def __hash__(self):
        # equal records -> same tuple -> same hash (consistent with __eq__)
        return hash((self.features, self.label, type(self.label).__name__))`;

const HW3_DATASET = `class Dataset:
    def __init__(self, records=None):
        # NOT records=[]: a default value is built ONCE, when 'def' runs, and
        # stored in __init__.__defaults__. Every Dataset() would share and
        # mutate that same list. None is immutable, so it is a safe sentinel.
        self.records = list(records) if records is not None else []

    @classmethod
    def from_raw(cls, raw):
        return cls([Record(f, l) for f, l in raw])

    def __len__(self):
        return len(self.records)

    def dedup(self):
        # dict keys are unique and remember insertion order -> order-preserving
        return Dataset(list(dict.fromkeys(self.records)))

    @staticmethod
    def _canonical(label):
        # bool must be tested BEFORE int: isinstance(True, int) is True, so an
        # int test first would swallow booleans and the bool rule never runs.
        if isinstance(label, bool):
            return int(label)
        if isinstance(label, int):
            return label if label in (0, 1) else None
        if isinstance(label, float):
            return int(label) if label in (0.0, 1.0) else None
        return None                           # strings like "1": don't guess

    def filter(self, predicate=lambda r: not isinstance(r.label, str)):
        # a function default is fine: it is shared, but never mutated
        return Dataset([r for r in self.records if predicate(r)])

    def label_census(self):
        census = {}
        for r in self.records:
            key = (r.label, type(r.label).__name__)
            census[key] = census.get(key, 0) + 1
        return census`;

const MODEL = "<b>Model answer:</b> ";

window.PAGE = {
  key: "homework",
  title: "Homework 2 & 3",
  intro: "<p>Every code part of Homework 2 (values, references, representation) and Homework 3 (functions and classes), with verified outputs, memory pictures and likely exam variants. The practice midterm says the real exam uses <i>different code with the same ideas</i> — so do the <b>alts</b> on each card.</p><p>Big ideas: <b>names point at objects</b> (assignment never copies); <b><code>==</code> + <code>hash</code> decide what a set/dict merges</b> (<code>1 == 1.0 == True</code>, <code>0 == False</code>); <b>defaults are built once</b>; <b>closures look up variables late</b>; <b>defining <code>__eq__</code> removes <code>__hash__</code></b>.</p>",
  sections: [
  // ======================================================================
  {
    id: "hw2",
    title: "Homework 2: Values, References, and Representation",
    intro: "<p>Shared data for Q3 (11 records, 6 different label values: <code>1, 0, True, 1.0, False, \"1\"</code>):</p><pre>" + RAW + "</pre>",
    items: [
    // ---------------- S1
    {
      id: "hw2-s1", title: "S1: b = a then append", tags: ["aliasing", "references"],
      prompt: "Predict, run, explain.",
      code: `a = [1, 2]
b = a
b.append(3)
print(a)`,
      output: "[1, 2, 3]",
      explain: "<code>b = a</code> does <b>not</b> copy the list. It makes a second name for the <i>same</i> list object. <code>append</code> changes that one object in place, so looking through either name shows <code>[1, 2, 3]</code>.",
      steps: ["<code>a = [1, 2]</code>: build a list object, point <code>a</code> at it.", "<code>b = a</code>: point <code>b</code> at the same object (no new list).", "<code>b.append(3)</code>: mutate the shared object.", "<code>print(a)</code>: <code>[1, 2, 3]</code>."],
      trace: `a ──┐
    ├──> [1, 2, 3]      (one list object, two names)
b ──┘

a is b  -> True`,
      key: "Assignment binds a name to an object; it never copies. Mutation through one alias is seen by all aliases.",
      lookFor: ["<code>b = a</code> followed by a mutating method (<code>append</code>, <code>extend</code>, <code>+=</code>, <code>sort</code>, item assignment)"],
      tips: ["Mutate (<code>.append</code>, <code>+=</code> on a list, <code>x[i] = …</code>) → everyone sees it. Rebind (<code>b = b + [3]</code>, <code>b = [..]</code>) → only <code>b</code> moves."],
      mistakes: ["Thinking <code>b = a</code> makes a copy.", "Thinking <code>b += [3]</code> behaves like <code>b = b + [3]</code> for lists (it doesn't: <code>+=</code> mutates in place)."],
      extra: [{ label: "Make a real copy", code: `a = [1, 2]
b = a.copy()        # or a[:] or list(a)
b.append(3)
print(a, b, a is b)`, output: "[1, 2] [1, 2, 3] False" }],
      alts: [
        { q: "Rebinding instead of mutating:", code: `a = [1, 2]
b = a
b = b + [3]
print(a, b)`, answer: "[1, 2] [1, 2, 3]" },
        { q: "<code>+=</code> on a list:", code: `a = [1, 2]
b = a
b += [3]
print(a, a is b)`, answer: "[1, 2, 3] True" },
        { q: "<code>+=</code> on an immutable string:", code: `s = "hi"
t = s
t += "!"
print(s, t)`, answer: "hi hi!" }
      ]
    },
    // ---------------- S2
    {
      id: "hw2-s2", title: "S2: [[0] * 3] * 3", tags: ["aliasing", "lists"],
      prompt: "Predict, run, explain.",
      code: `grid = [[0] * 3] * 3
grid[0][0] = 9
print(grid)`,
      output: "[[9, 0, 0], [9, 0, 0], [9, 0, 0]]",
      explain: "<code>[0] * 3</code> builds ONE row <code>[0, 0, 0]</code>. The outer <code>* 3</code> copies the <i>reference</i> to that row three times. So <code>grid</code> is a list of three arrows to the same row. Changing <code>grid[0][0]</code> changes that row, and all three \"rows\" show it.",
      steps: ["<code>[0] * 3</code> → one row object R = <code>[0, 0, 0]</code> (repeating the int 0 is harmless, ints are immutable).", "<code>[R] * 3</code> → <code>[R, R, R]</code>: three references, one object.", "<code>grid[0][0] = 9</code> mutates R.", "Printing shows R three times."],
      trace: `grid ──> [ R, R, R ]
           │  │  │
           └──┴──┴──> R = [9, 0, 0]

grid[0] is grid[1] is grid[2]  -> True`,
      anatomy: [{ code: "grid = [[0] * 3] * 3", notes: [
        { at: "[[0] * 3]", label: "list holding ONE row" },
        { at: "] * 3", label: "copies the reference 3x" } ] }],
      key: "<code>[row] * n</code> repeats references, not rows. Use <code>[[0] * 3 for _ in range(3)]</code> to get independent rows.",
      lookFor: ["<code>[[…]] * n</code>, <code>[[]] * n</code>, <code>[row] * n</code>, <code>[row, row]</code>"],
      tips: ["The comprehension re-runs <code>[0] * 3</code> each loop → a fresh row each time."],
      mistakes: ["Expecting only the first row to change.", "Thinking the inner <code>[0] * 3</code> is the problem (it isn't: ints are immutable)."],
      extra: [{ label: "Fixed version", code: `grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 9
print(grid)
print(grid[0] is grid[1])`, output: "[[9, 0, 0], [0, 0, 0], [0, 0, 0]]\nFalse" }],
      alts: [
        { q: "Same row listed twice:", code: `row = [0] * 3
grid = [row, row]
row[1] = 5
print(grid, grid[0] is grid[1])`, answer: "[[0, 5, 0], [0, 5, 0]] True" },
        { q: "Mutate vs rebind inside a repeated list:", code: `g = [[]] * 2
g[0].append(1)
g[1] = [7]
print(g)`, answer: "[[1], [7]]" },
        { q: "Repeating immutables is safe:", code: `row = [0] * 3
row[0] = 9
print(row)`, answer: "[9, 0, 0]" }
      ]
    },
    // ---------------- S3
    {
      id: "hw2-s3", title: "S3: {1, 1.0, True, 2, \"2\", 0, False}", tags: ["sets", "hashing", "equality"],
      prompt: "Predict, run, explain.",
      code: `labels = {1, 1.0, True, 2, "2", 0, False}
print(labels)
print(len(labels))`,
      output: null,
      explain: "A set keeps one element per <b>equal</b> value (same hash + <code>==</code>). <code>1 == 1.0 == True</code> and they hash the same, so they collapse into ONE element; the set keeps the <b>first</b> one it saw: <code>1</code>. Likewise <code>0 == False</code> → keeps <code>0</code>. <code>\"2\"</code> is a string and is <b>not</b> equal to <code>2</code>, so both stay. Result: 4 elements <code>{0, 1, 2, '2'}</code> (print order may vary because string hashes are randomized per run, so <code>output</code> is null here; <code>len</code> is always <b>4</b>).",
      steps: ["Add 1 → {1}", "Add 1.0: equals 1 → ignored (1 stays)", "Add True: equals 1 → ignored", "Add 2 → {1, 2}", "Add \"2\": a str, different → {1, 2, '2'}", "Add 0 → 4 elements", "Add False: equals 0 → ignored", "len = 4"],
      trace: `value  hash  equal to existing?   set after
1      1     -                    {1}
1.0    1     1 == 1.0  merged     {1}
True   1     1 == True merged     {1}
2      2     -                    {1, 2}
"2"    ?     no ("2" != 2)        {1, 2, '2'}
0      0     -                    {0, 1, 2, '2'}
False  0     0 == False merged    {0, 1, 2, '2'}`,
      key: "<code>True == 1 == 1.0</code> and <code>False == 0</code> with equal hashes → sets/dicts merge them, keeping the FIRST object.",
      lookFor: ["Sets or dict keys mixing <code>bool</code>, <code>int</code>, <code>float</code>", "\"how many elements / what is len\""],
      tips: ["bool is a subclass of int: <code>True</code> behaves like <code>1</code>.", "Strings never equal numbers: <code>\"2\" != 2</code>."],
      mistakes: ["Answering 7, or 5 (forgetting <code>0 == False</code>).", "Thinking the set keeps <code>True</code> (it keeps the first-inserted <code>1</code>)."],
      extra: [{ label: "Deterministic view", code: `labels = {1, 1.0, True, 2, "2", 0, False}
print(len(labels))
print(sorted(labels, key=repr))
print(1 == 1.0 == True, hash(1) == hash(1.0) == hash(True))`, output: "4\n['2', 0, 1, 2]\nTrue True" }],
      alts: [
        { q: "Which object survives?", code: `print({1, 1.0, True})
print({True, 1, 1.0})`, answer: "{1}\n{True}" },
        { q: "Dict keys merge the same way (the key stays, the value is replaced):", code: `d = {}
d[1] = "int"
d[True] = "bool"
d[1.0] = "float"
print(d)`, answer: "{1: 'float'}" },
        { q: "Falsy values:", code: `print(len({0, False, 0.0, "", None}))`, answer: "3" }
      ]
    },
    // ---------------- S4
    {
      id: "hw2-s4", title: "S4: tuple holding a list", tags: ["immutability", "tuples"],
      prompt: "Predict, run, explain.",
      code: `t = (1, [2, 3])
t[1].append(4)
print(t)`,
      output: "(1, [2, 3, 4])",
      explain: "A tuple is immutable: its <b>slots</b> can't be re-pointed. But slot 1 points at a list, and the list itself is mutable. <code>t[1].append(4)</code> doesn't change the tuple's arrows — it changes the list at the end of arrow 1.",
      trace: `t ──> ( 1 , ● )
             │
             └──> [2, 3, 4]   (list mutated in place; tuple arrows unchanged)`,
      key: "Immutable container ≠ immutable contents. The tuple fixes WHICH objects it holds, not what's inside them.",
      lookFor: ["Tuples (or frozensets keys) containing lists/dicts", "<code>t[i].append</code> vs <code>t[i] = …</code> vs <code>t[i] += …</code>"],
      tips: ["A tuple containing a list is <b>unhashable</b> — it can't be a set element or dict key."],
      mistakes: ["Predicting a TypeError for <code>t[1].append(4)</code>.", "Forgetting the famous <code>t[1] += [4]</code> trap: error AND the list changes."],
      extra: [{ label: "Unhashable tuple", code: `t = (1, [2, 3])
try:
    hash(t)
except TypeError as e:
    print(type(e).__name__)`, output: "TypeError" }],
      alts: [
        { q: "The <code>+=</code> trap (classic):", code: `t = (1, [2, 3])
try:
    t[1] += [4]
except TypeError as e:
    print(type(e).__name__)
print(t)`, answer: "TypeError\n(1, [2, 3, 4])" },
        { q: "Reassigning a slot:", code: `t = (1, [2, 3])
try:
    t[1] = [9]
except TypeError as e:
    print(type(e).__name__)
print(t)`, answer: "TypeError\n(1, [2, 3])" }
      ]
    },
    // ---------------- S5
    {
      id: "hw2-s5", title: "S5: shallow copy original[:]", tags: ["copy", "aliasing"],
      prompt: "Predict, run, explain.",
      code: `original = [[1, 2], [3, 4]]
copy = original[:]
copy[0][0] = 99
copy.append([5, 6])
print(original)
print(copy)`,
      output: "[[99, 2], [3, 4]]\n[[99, 2], [3, 4], [5, 6]]",
      explain: "<code>original[:]</code> is a <b>shallow</b> copy: a NEW outer list whose slots point at the SAME inner lists. <code>copy[0][0] = 99</code> goes through a shared inner list → visible in both. <code>copy.append(...)</code> changes only the new outer list → <code>original</code> keeps 2 rows.",
      trace: `original ──> [ ●, ● ]
               │  │
               │  └──────> [3, 4]   <──┐
               └─> [99, 2] <──┐        │
copy     ──> [ ●, ●, ● ]──────┘────────┘
                     └──> [5, 6]   (only in copy)`,
      key: "Shallow copy = new outer container, shared inner objects. Use <code>copy.deepcopy</code> to copy the inner lists too.",
      lookFor: ["<code>x[:]</code>, <code>list(x)</code>, <code>x.copy()</code>, <code>copy.copy(x)</code> on nested lists"],
      mistakes: ["Thinking <code>[:]</code> copies everything (deep).", "Thinking the append shows up in <code>original</code>."],
      extra: [{ label: "Deep copy", code: `import copy
original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0][0] = 99
print(original)
print(deep[0] is original[0])`, output: "[[1, 2], [3, 4]]\nFalse" }],
      alts: [
        { q: "Replace a slot vs mutate a slot:", code: `a = [[1], [2]]
b = list(a)
b[0] = [0]
b[1].append(5)
print(a)`, answer: "[[1], [2, 5]]" },
        { q: "Equal but not identical:", code: `a = [1, 2]
b = a[:]
print(a == b, a is b)`, answer: "True False" }
      ]
    },
    // ---------------- S6
    {
      id: "hw2-s6", title: "S6: 0.1 + 0.2 == 0.3 vs sum([0.1] * 10) == 1.0", tags: ["floats", "representation"],
      prompt: "Predict, run, explain. The two lines disagree — explain <i>why one is False and the other is True</i>.",
      code: `print(0.1 + 0.2 == 0.3)
print(sum([0.1] * 10) == 1.0)`,
      output: "False\nTrue",
      explain: "<b>Line 1 (False):</b> 0.1, 0.2 and 0.3 can't be stored exactly in binary; each literal becomes the <i>nearest double</i>. 0.1 and 0.2 are both stored slightly <b>too big</b>, and the sum rounds to the double just <b>above</b> 0.3 (<code>0.30000000000000004</code>), while the literal <code>0.3</code> is the double just <b>below</b> 0.3 (<code>0.29999999999999998890</code>). Two different doubles → False.<br><br><b>Line 2 (True):</b> since <b>Python 3.12</b>, <code>sum()</code> of floats uses <b>compensated (Neumaier) summation</b>: it tracks the tiny rounding error of every addition and adds it back at the end. The exact total of ten stored 0.1's is <code>1.0000000000000000555</code>, whose nearest double is exactly <code>1.0</code>. So <code>sum</code> returns <code>1.0</code>. A plain loop <code>total += 0.1</code> (and <code>sum</code> on Python ≤ 3.11) lets the errors pile up and gives <code>0.9999999999999999</code> → False. So the disagreement is about <b>how many roundings happen and whether they are corrected</b>, not just \"floats are inexact\".",
      steps: ["0.1 is stored as 0.1000000000000000055511…, 0.2 as 0.2000000000000000111…", "0.1 + 0.2 = exact 0.3000000000000000166…, rounded to nearest double 0.30000000000000004441", "Literal 0.3 is stored as 0.29999999999999998890 → different double → False", "sum([0.1]*10) (3.12+) keeps a running error-compensation term → result is the double nearest the true total → exactly 1.0 → True"],
      trace: `                 stored (20 digits)
0.1          ->  0.10000000000000000555
0.2          ->  0.20000000000000001110
0.1 + 0.2    ->  0.30000000000000004441   <- rounds UP
0.3          ->  0.29999999999999998890   <- different double

naive loop  total += 0.1  (10 times) -> 0.9999999999999999   (errors pile up)
sum([0.1]*10)   Python 3.12+         -> 1.0                  (errors compensated)`,
      key: "<code>==</code> on floats compares exact doubles. 0.1+0.2 lands on a different double than 0.3; <code>sum()</code> (3.12+) corrects accumulated rounding so it lands on exactly 1.0. Compare floats with <code>math.isclose</code>.",
      lookFor: ["<code>==</code> between float results", "<code>sum</code> of floats vs a <code>+=</code> loop", "Python version questions"],
      tips: ["Numbers like 0.5, 0.25, 0.75 (powers of 2) are exact → their sums compare fine.", "<code>math.fsum</code> is always exactly rounded on every version."],
      mistakes: ["Just saying \"floats are inexact\" without explaining why line 2 is True.", "Assuming <code>sum</code> and a manual <code>+=</code> loop give the same float."],
      extra: [
        { label: "Show the exact stored values", code: `print(f"{0.1:.20f}")
print(f"{0.2:.20f}")
print(f"{0.1 + 0.2:.20f}")
print(f"{0.3:.20f}")`, output: "0.10000000000000000555\n0.20000000000000001110\n0.30000000000000004441\n0.29999999999999998890" },
        { label: "Naive loop vs sum vs fsum", code: `import math
total = 0.0
for _ in range(10):
    total += 0.1
print(total, total == 1.0)
print(sum([0.1] * 10), math.fsum([0.1] * 10))`, output: "0.9999999999999999 False\n1.0 1.0" }
      ],
      alts: [
        { q: "Manual accumulation:", code: `total = 0.0
for _ in range(10):
    total += 0.1
print(total == 1.0, total)`, answer: "False 0.9999999999999999" },
        { q: "The right way to compare:", code: `import math
print(math.isclose(0.1 + 0.2, 0.3), round(0.1 + 0.2, 10) == round(0.3, 10))`, answer: "True True" },
        { q: "Exact binary fractions:", code: `print(0.5 + 0.25 == 0.75, 0.1 + 0.2)`, answer: "True 0.30000000000000004" }
      ]
    },
    // ---------------- Q2(a)
    {
      id: "hw2-q2a", title: "Q2(a): dis — product_loop vs product_literal", tags: ["bytecode", "dis", "constant folding"],
      prompt: "Disassemble both functions and report the number of bytecode instructions in each. Both return 120. How many multiplications does <code>product_literal</code> perform <i>when it runs</i>?",
      code: `import dis

def product_loop():
    ret = 1
    for x in range(2, 6):
        ret = ret * x
    return ret

def product_literal():
    return 2 * 3 * 4 * 5

dis.dis(product_loop)
dis.dis(product_literal)`,
      output: null,
      explain: "The exact listing depends on the Python version (so <code>output</code> is null). On <b>Python 3.12</b>: <code>product_loop</code> has <b>18</b> instructions, <code>product_literal</code> has <b>2</b> (<code>RESUME</code>, <code>RETURN_CONST 120</code>). On 3.14 it's 18 and 3 (<code>LOAD_SMALL_INT 120</code>, <code>RETURN_VALUE</code>).<br><br>The compiler does <b>constant folding</b>: <code>2 * 3 * 4 * 5</code> uses only constants, so the compiler computes 120 <i>at compile time</i> and stores the answer. <code>product_literal</code> performs <b>0 multiplications</b> when it runs. <code>product_loop</code> has one <code>BINARY_OP (*)</code> instruction inside the loop, executed <b>4 times</b> (x = 2, 3, 4, 5).",
      steps: ["Source → compiler → bytecode (what actually runs).", "Compiler sees <code>2*3*4*5</code>: all constants → folds to <code>120</code>.", "Loop version: <code>ret * x</code> depends on runtime values → real <code>BINARY_OP *</code>, run 4×."],
      trace: `product_literal (3.12)          product_loop (3.12, key part)
RESUME                          ...
RETURN_CONST  120               FOR_ITER
                                STORE_FAST    x
0 multiplications at run time   LOAD_FAST     ret
                                LOAD_FAST     x
                                BINARY_OP     5 (*)   <- runs 4 times
                                STORE_FAST    ret
                                JUMP_BACKWARD ...`,
      key: "Constant expressions are folded at compile time: <code>2*3*4*5</code> becomes the constant 120 → 0 runtime multiplications. Source code ≠ what runs.",
      lookFor: ["<code>dis.dis</code>", "Expressions made only of literals", "\"how many operations at runtime\""],
      tips: ["Folding works left-to-right: <code>n * 2 * 3</code> is <code>(n*2)*3</code> → nothing to fold (2 multiplications). <code>n * (2*3)</code> folds to <code>n * 6</code>."],
      mistakes: ["Saying 3 multiplications (counting the source operators).", "Saying the loop has 4 multiplication instructions (1 instruction, executed 4 times)."],
      extra: [{ label: "Count * instructions (version-independent)", code: `import dis

def product_loop():
    ret = 1
    for x in range(2, 6):
        ret = ret * x
    return ret

def product_literal():
    return 2 * 3 * 4 * 5

def count_mult(f):
    return sum(1 for i in dis.get_instructions(f)
               if i.opname == "BINARY_OP" and i.argrepr == "*")

print(count_mult(product_loop), count_mult(product_literal))
print(product_loop() == product_literal() == 120)`, output: "1 0\nTrue" }],
      alts: [
        { q: "How many <code>*</code> instructions remain after folding?", code: `import dis

def g(n):
    return n * 2 * 3

def h(n):
    return n * (2 * 3)

for f in (g, h):
    print(sum(1 for i in dis.get_instructions(f)
              if i.opname == "BINARY_OP" and i.argrepr == "*"))`, answer: "2\n1" },
        { q: "Is <code>2 ** 10</code> computed at runtime?", code: `import dis

def f():
    return 2 ** 10

print([i.opname for i in dis.get_instructions(f) if i.opname == "BINARY_OP"])
print(f())`, answer: "[]\n1024" }
      ]
    },
    // ---------------- Q2(b)
    {
      id: "hw2-q2b", title: "Q2(b): x = 257; y = 257; x is y", tags: ["identity", "is", "compilation"],
      prompt: "Run <code>x = 257 / y = 257 / print(x is y)</code> as a script, then line by line in the REPL. Report both and explain using (a).",
      code: `x = 257
y = 257
print(x is y)`,
      output: "True",
      explain: "<b>Script: True. REPL (one line at a time): False.</b><br><br>As a script, the whole file is compiled into <b>one code object</b>. The compiler stores each distinct constant once in that code object's constant table, so both <code>257</code> literals become the <i>same</i> int object → <code>x is y</code> is True.<br><br>In the REPL each line is compiled <b>separately</b> into its own code object, each creating its own <code>257</code> object. CPython only pre-caches small ints <b>-5 … 256</b>, so 257 is not shared → False. (With 256 you'd get True in both.) Lesson: <code>is</code> checks identity (same object), which depends on compilation details; use <code>==</code> to compare values.",
      trace: `SCRIPT (one code object)         REPL (each line compiled alone)
consts: (257, ...)               line 1 consts: (257,) -> obj A
x ──┐                            line 2 consts: (257,) -> obj B
    ├──> 257  (one object)       x ──> 257 (A)
y ──┘                            y ──> 257 (B)
x is y -> True                   x is y -> False`,
      key: "<code>is</code> = same object; <code>==</code> = same value. Constants in ONE compiled unit are shared; ints -5..256 are always cached.",
      lookFor: ["<code>is</code> used on ints/strings", "\"script vs REPL\"", "numbers just outside 256"],
      tips: ["Only use <code>is</code> for <code>None</code> (and sentinels)."],
      mistakes: ["Saying \"257 is never cached so always False\" — it's True in a script.", "Using <code>is</code> to compare numbers."],
      extra: [{ label: "Simulate both with compile()", code: `# script: one compile for all three lines
exec(compile("x = 257\\ny = 257\\nprint(x is y)", "<script>", "exec"))

# REPL: compile each line separately
ns = {}
exec(compile("x = 257", "<line1>", "single"), ns)
exec(compile("y = 257", "<line2>", "single"), ns)
print(ns["x"] is ns["y"], ns["x"] == ns["y"])`, output: "True\nFalse True" }],
      alts: [
        { q: "Small ints are cached even across separate compiles:", code: `ns = {}
exec(compile("a = 256", "<1>", "single"), ns)
exec(compile("b = 256", "<2>", "single"), ns)
print(ns["a"] is ns["b"])`, answer: "True" },
        { q: "A value computed at runtime:", code: `x = 257
y = int("257")
print(x == y, x is y)`, answer: "True False" },
        { q: "Lists are never shared:", code: `a = [1, 2]
b = [1, 2]
print(a == b, a is b)`, answer: "True False" }
      ]
    },
    // ---------------- Q2(c)
    {
      id: "hw2-q2c", title: "Q2(c): limits of verifying by reading source", tags: ["written", "verifier"],
      prompt: "<b>Written.</b> Based on (a) and (b), state one limitation of verifying a program by reading its source alone.",
      code: `x = 257
y = int("257")
print(x == y)
print(x is y)`,
      output: "True\nFalse",
      explain: MODEL + "The source is not what runs: the compiler transforms it (constant folding in (a)) and decides which objects are shared (constants in one code object in (b)). So reading <code>x is y</code> cannot tell you the answer — the same lines print True as a script and False in the REPL, and <code>2*3*4*5</code> performs no multiplications at all. A verifier must also run/inspect the program (e.g. with <code>dis</code>, tests, printing intermediate values) in the actual environment.",
      key: "Behavior depends on source + compiler + runtime/environment, not source alone.",
      mistakes: ["Answering only \"code can have bugs\" without tying it to (a)/(b)."],
      alts: [
        { q: "Same value, different identity:", code: `a = 1000
b = 999 + int("1")
print(a == b, a is b)`, answer: "True False" },
        { q: "What does folding leave behind?", code: `def f():
    return 60 * 60 * 24

print(f())`, answer: "86400" }
      ]
    },
    // ---------------- Q3(a)
    {
      id: "hw2-q3a", title: "Q3(a): count_labels(records)", tags: ["dict", "counting"],
      prompt: "Write <code>count_labels(records)</code> returning a dict mapping each label to the number of records carrying it. Don't normalize labels.",
      code: `def count_labels(records):
    counts = {}
    for features, label in records:
        counts[label] = counts.get(label, 0) + 1
    return counts

print(count_labels([((0.0,), "cat"), ((1.0,), "dog"), ((2.0,), "cat")]))`,
      output: "{'cat': 2, 'dog': 1}",
      explain: "Loop over the records, unpack each <code>(features, label)</code>, and bump that label's counter. <code>counts.get(label, 0)</code> returns the current count, or 0 the first time a label appears.",
      anatomy: [{ code: "counts[label] = counts.get(label, 0) + 1", notes: [
        { at: "counts[label]", label: "store under this key" },
        { at: "get(label", label: "look up current count" },
        { at: "0)", label: "default if key is new" },
        { at: "+ 1", label: "add one" } ] }],
      trace: `record             label   counts after
((0.0,), "cat")    "cat"   {'cat': 1}
((1.0,), "dog")    "dog"   {'cat': 1, 'dog': 1}
((2.0,), "cat")    "cat"   {'cat': 2, 'dog': 1}`,
      key: "<code>d[k] = d.get(k, 0) + 1</code> is the counting idiom. Dict keys merge equal values (<code>1</code>, <code>1.0</code>, <code>True</code>).",
      lookFor: ["\"count how many\" → dict + <code>.get(k, 0)</code> or <code>collections.Counter</code>"],
      mistakes: ["<code>counts[label] += 1</code> without initializing → KeyError.", "Iterating <code>for label in records</code> (that's the whole tuple)."],
      extra: [{ label: "Solution on RAW", code: RAW + "\n\n" + HW2_FUNCS + "\n\nprint(count_labels(RAW))", output: "{1: 6, 0: 4, '1': 1}" }],
      alts: [
        { q: "Counting mixed bool/int/float labels:", code: `counts = {}
for label in [True, 1, 1.0]:
    counts[label] = counts.get(label, 0) + 1
print(counts)`, answer: "{True: 3}" },
        { q: "Counter merges too:", code: `from collections import Counter
print(Counter([0, False, 0.0, 1]))`, answer: "Counter({0: 3, 1: 1})" },
        { q: "Count by (label, type) to keep them apart:", code: `counts = {}
for label in [True, 1, 1.0, 1]:
    k = (label, type(label).__name__)
    counts[k] = counts.get(k, 0) + 1
print(counts)`, answer: "{(True, 'bool'): 1, (1, 'int'): 2, (1.0, 'float'): 1}" }
      ]
    },
    // ---------------- Q3(b)
    {
      id: "hw2-q3b", title: "Q3(b): dedup_naive via set", tags: ["sets", "dedup"],
      prompt: "Write <code>dedup_naive(records)</code> that removes duplicates by converting the list to a <code>set</code> and back to a <code>list</code>.",
      code: `def dedup_naive(records):
    return list(set(records))

data = [((1.0, 2.0), 1), ((1.0, 2.0), 1), ((3.0, 4.0), 0)]
print(len(data), len(dedup_naive(data)))`,
      output: "3 2",
      explain: "<code>set(records)</code> keeps one copy of each <b>equal</b> record (records are tuples, compared by value). <code>list(...)</code> turns it back into a list. Two side effects: (1) the original <b>order is lost</b> (set order follows hashes, and string hashes change between runs); (2) records that are <code>==</code> but not identical in type (<code>0</code> vs <code>False</code>) are merged.",
      key: "<code>list(set(x))</code> dedups by <code>==</code>/hash, loses order, and merges <code>1/1.0/True</code> and <code>0/False</code>.",
      lookFor: ["<code>list(set(...))</code>", "<code>len(set(...))</code>"],
      tips: ["Order-preserving dedup: <code>list(dict.fromkeys(x))</code>."],
      mistakes: ["Assuming the result keeps the original order.", "Trying to put records containing lists into a set (TypeError: unhashable)."],
      extra: [{ label: "On RAW", code: RAW + "\n\n" + HW2_FUNCS + "\n\nprint(len(RAW), len(dedup_naive(RAW)))", output: "11 7" }],
      alts: [
        { q: "Tuples compare element by element:", code: `print(len(set([(1, 2), (1, 2), (2, 1)])))`, answer: "2" },
        { q: "Nested equal numbers merge:", code: `print(len(set([((1,), 1), ((1,), True), ((1.0,), 1)])))`, answer: "1" },
        { q: "Order-preserving dedup:", code: `print(list(dict.fromkeys([3, 1, 3, 2, 1])))`, answer: "[3, 1, 2]" }
      ]
    },
    // ---------------- Q3(c)
    {
      id: "hw2-q3c", title: "Q3(c): 11 → 7, which 2 were NOT exact duplicates; typed_key count", tags: ["sets", "hashing", "dedup"],
      prompt: "Report the count before/after <code>dedup_naive(RAW)</code>. Four records were removed; two were exact duplicates, two were not — identify those two and explain. Then count distinct records under <code>typed_key</code>.",
      code: RAW + `

seen = {}                         # record -> index of first occurrence
for i, r in enumerate(RAW):
    if r in seen:                 # 'in' uses hash + ==
        j = seen[r]
        print(f"#{i} {r} merged into #{j} {RAW[j]}")
    else:
        seen[r] = i

def typed_key(record):
    features, label = record
    return (features, label, type(label).__name__)

print(len(RAW), len(set(RAW)), len({typed_key(r) for r in RAW}))`,
      output: "#2 ((1.0, 2.0), 1) merged into #0 ((1.0, 2.0), 1)\n#8 ((5.0, 6.0), True) merged into #3 ((5.0, 6.0), True)\n#9 ((3.0, 4.0), False) merged into #1 ((3.0, 4.0), 0)\n#10 ((7.0, 8.0), 1) merged into #4 ((7.0, 8.0), 1.0)\n11 7 9",
      explain: "<b>Before 11, after 7.</b> Exact duplicates removed: #2 <code>((1.0, 2.0), 1)</code> and #8 <code>((5.0, 6.0), True)</code>.<br><b>Not exact duplicates:</b><br>• <code>((3.0, 4.0), False)</code> was merged into <code>((3.0, 4.0), 0)</code> because <code>False == 0</code> and <code>hash(False) == hash(0)</code>.<br>• <code>((7.0, 8.0), 1)</code> was merged into <code>((7.0, 8.0), 1.0)</code> because <code>1 == 1.0</code> and they hash the same.<br>A tuple's hash and <code>==</code> are built from its elements, so equal-but-different-type labels make equal tuples. The set keeps whichever came first.<br><br><b>typed_key:</b> adding <code>type(label).__name__</code> makes <code>'bool'</code> ≠ <code>'int'</code> ≠ <code>'float'</code>, so those two pairs stay apart → <b>9</b> distinct records (only the 2 exact duplicates removed) vs 7 for <code>dedup_naive</code>.",
      trace: `#   record                 set lookup             result
0   ((1.0,2.0), 1)         new                    keep
1   ((3.0,4.0), 0)         new                    keep
2   ((1.0,2.0), 1)         == #0 (exact)          drop
3   ((5.0,6.0), True)      new                    keep
4   ((7.0,8.0), 1.0)       new                    keep
5   ((9.0,1.0), False)     new                    keep
6   ((2.0,3.0), "1")       new                    keep
7   ((4.0,5.0), 0)         new                    keep
8   ((5.0,6.0), True)      == #3 (exact)          drop
9   ((3.0,4.0), False)     == #1 (False == 0)     drop  <- NOT exact
10  ((7.0,8.0), 1)         == #4 (1 == 1.0)       drop  <- NOT exact
                                         set size: 7
typed_key adds 'bool'/'int'/'float' -> #9 and #10 kept -> 9`,
      anatomy: [{ code: "return (features, label, type(label).__name__)", notes: [
        { at: "features", label: "same features…" },
        { at: "label,", label: "…same value…" },
        { at: "type(label).__name__", label: "…AND same type name" } ] }],
      key: "11 → 7 with <code>set</code>; 9 with <code>typed_key</code>. The 2 false merges: <code>False</code>→<code>0</code> and <code>1</code>→<code>1.0</code> (for features (3,4) and (7,8)).",
      lookFor: ["\"how many distinct\" with mixed bool/int/float", "keys that include <code>type(x).__name__</code>"],
      mistakes: ["Naming <code>((5.0, 6.0), True)</code> as a non-exact duplicate (it is exact).", "Saying <code>((2.0, 3.0), \"1\")</code> merged with a <code>1</code> (strings never equal ints)."],
      alts: [
        { q: "Naive vs typed:", code: `def typed_key(record):
    features, label = record
    return (features, label, type(label).__name__)

data = [((0,), 0), ((0,), False), ((0,), 0.0)]
print(len(set(data)), len({typed_key(r) for r in data}))`, answer: "1 3" },
        { q: "Why the tuples merge:", code: `a = ((3.0, 4.0), 0)
b = ((3.0, 4.0), False)
print(a == b, hash(a) == hash(b))`, answer: "True True" }
      ]
    },
    // ---------------- Q3(d)
    {
      id: "hw2-q3d", title: "Q3(d): count_labels(RAW) has only 3 keys", tags: ["dict", "hashing"],
      prompt: "Report <code>count_labels(RAW)</code>. It has 3 keys but RAW uses 6 distinct label values. Which labels were combined, and why? Why can't <code>count_labels</code> tell how many labels arrived as booleans?",
      code: RAW + "\n\n" + HW2_FUNCS + "\n\nprint(count_labels(RAW))",
      output: "{1: 6, 0: 4, '1': 1}",
      explain: "Six label values: <code>1, 0, True, 1.0, False, \"1\"</code>.<br>• Key <code>1</code> (6) = <code>1</code> ×3 + <code>True</code> ×2 + <code>1.0</code> ×1. The first one seen was int <code>1</code>, so that object stays the key.<br>• Key <code>0</code> (4) = <code>0</code> ×2 + <code>False</code> ×2.<br>• Key <code>'1'</code> (1) = the string, which is not equal to 1.<br>Why: dict keys are matched by hash + <code>==</code>; <code>True == 1 == 1.0</code> and <code>False == 0</code> with equal hashes, so they hit the same entry and only the count is updated.<br><br><b>One sentence:</b> once <code>True</code> lands in the key <code>1</code>, the dict keeps only one key object and a number, so the information about which records had a bool (vs int/float) is gone.",
      trace: `label    lands in key   counts
1        1             {1:1}
0        0             {1:1, 0:1}
1        1             {1:2, 0:1}
True     1  (True==1)  {1:3, 0:1}
1.0      1  (1.0==1)   {1:4, 0:1}
False    0  (False==0) {1:4, 0:2}
"1"      '1' (new)     {1:4, 0:2, '1':1}
0        0             {1:4, 0:3, '1':1}
True     1             {1:5, 0:3, '1':1}
False    0             {1:5, 0:4, '1':1}
1        1             {1:6, 0:4, '1':1}`,
      key: "<code>{1: 6, 0: 4, '1': 1}</code>: 1/True/1.0 → key 1; 0/False → key 0; \"1\" stays separate. First-inserted key object wins.",
      mistakes: ["Writing the key as <code>True</code> (the first label seen was int 1).", "Merging <code>'1'</code> into <code>1</code>."],
      alts: [
        { q: "First key wins, last value wins:", code: `print({1: "a", True: "b", 1.0: "c"})`, answer: "{1: 'c'}" },
        { q: "Count order matters for the key:", code: `counts = {}
for lab in [False, 0, 0.0]:
    counts[lab] = counts.get(lab, 0) + 1
print(counts)`, answer: "{False: 3}" }
      ]
    },
    // ---------------- Q3(e)
    {
      id: "hw2-q3e", title: "Q3(e): class Dataset (normalize, dedup, summary)", tags: ["classes", "dedup", "bool vs int"],
      prompt: "Write <code>Dataset</code> with a constructor taking records, <code>normalized_labels()</code> (canonical 0/1, ambiguous labels reported, not coerced), <code>dedup()</code> without the losses from (c), and <code>summary()</code> (record count + label counts).",
      code: RAW + "\n\n" + HW2_FUNCS + "\n\n" + HW2_DATASET + `

ds = Dataset(RAW)
normalized, problems = ds.normalized_labels()
print(len(normalized), problems)
print(len(ds.dedup().records))
print([l for _, l in ds.dedup().records])
print(ds.summary())
print(ds.dedup().summary())`,
      output: "10 [((2.0, 3.0), '1')]\n9\n[1, 0, True, 1.0, False, '1', 0, False, 1]\n{'records': 11, 'label_counts': {0: 4, 1: 6}, 'unresolved': 1}\n{'records': 9, 'label_counts': {0: 4, 1: 4}, 'unresolved': 1}",
      explain: "• <b>_canonical</b> checks <code>bool</code> <i>before</i> <code>int</code> because <code>isinstance(True, int)</code> is True (bool is a subclass of int). <code>1.0</code>/<code>0.0</code> are exact so they map to 1/0. The string <code>\"1\"</code> is ambiguous (text, could be a typo or a category name) → returned as <code>None</code> and <b>reported</b> in <code>problems</code>, not coerced.<br>• <b>dedup</b> uses <code>typed_key</code> so <code>0</code>/<code>False</code> and <code>1</code>/<code>1.0</code> stay apart, keeps the first occurrence, and preserves order → 9 records.<br>• <b>summary</b> counts normalized labels with a dict comprehension and reports how many were unresolved.",
      steps: ["Constructor copies the list (<code>list(records)</code>) so outside changes don't leak in.", "normalized_labels: comprehension keeps resolvable records, a second one collects problems.", "dedup: <code>seen</code> set of typed keys + output list (order kept).", "summary: <code>{'records': n, 'label_counts': {0: …, 1: …}, 'unresolved': k}</code>"],
      anatomy: [{ code: "if isinstance(label, bool):", notes: [
        { at: "isinstance", label: "type test" },
        { at: "bool", label: "MUST come before int" } ] }],
      trace: `_canonical(label):
1     -> 1      True  -> 1      1.0 -> 1
0     -> 0      False -> 0      "1" -> None  (reported)
normalized: 10 records, problems: [((2.0, 3.0), '1')]`,
      key: "Check <code>bool</code> before <code>int</code>; dedup with a typed key + a <code>seen</code> set to keep order; report, don't guess.",
      lookFor: ["<code>isinstance(x, int)</code> where x may be a bool", "\"preserve order\" dedup"],
      tips: ["Dedup <b>before</b> normalizing if the type is evidence; after normalizing, <code>((3.0,4.0),0)</code> and <code>((3.0,4.0),False)</code> become identical."],
      mistakes: ["<code>isinstance(label, int)</code> first → bools never hit the bool branch.", "<code>int(\"1\")</code> silently coercing the string label.", "Using <code>set</code> again inside dedup (loses order and merges types)."],
      extra: [{ label: "Why bool must be first", code: `def wrong(x):
    if isinstance(x, int):
        return "int"
    if isinstance(x, bool):
        return "bool"

print(wrong(True), isinstance(True, int), issubclass(bool, int))`, output: "int True True" }],
      alts: [
        { q: "bool arithmetic:", code: `print(True + True, True * 3, True + 1.0)`, answer: "2 3 2.0" },
        { q: "type() vs isinstance():", code: `print(type(True) is int, isinstance(True, int), type(True).__name__)`, answer: "False True bool" },
        { q: "Order-preserving typed dedup:", code: `seen, out = set(), []
for x in [1, True, 1, 1.0, True]:
    k = (x, type(x).__name__)
    if k not in seen:
        seen.add(k)
        out.append(x)
print(out)`, answer: "[1, True, 1.0]" }
      ]
    },
    // ---------------- Q3(f)
    {
      id: "hw2-q3f", title: "Q3(f): dedup_naive in a training pipeline (written)", tags: ["written", "ML pipeline"],
      prompt: "<b>Written.</b> If <code>dedup_naive</code> were an unchecked step in a training pipeline, describe one concrete way the model could be wrong, and one check that would have caught it.",
      code: RAW + `

def typed_key(record):
    features, label = record
    return (features, label, type(label).__name__)

after = list(set(RAW))
labels = {type(l).__name__ for _, l in after}
print(len(after), len({typed_key(r) for r in RAW}))
print(sorted(labels))`,
      output: "7 9\n['bool', 'float', 'int', 'str']",
      explain: MODEL + "Records whose labels differ only in type are silently merged, and the survivor is whichever came first — e.g. a source that used <code>False</code> to mean \"not reviewed\" is merged into class 0 and rows are dropped without anyone noticing, which shifts class balance. Also the string <code>\"1\"</code> survives as a separate, third \"class\", so a classifier may learn 3 classes (or crash/skip it), and the set's order changes between runs (string hash randomization), so training isn't reproducible. A check that catches it: assert the dedup count equals the number of distinct <code>typed_key</code>s (7 ≠ 9 → fail), and assert every label is an <code>int</code> in {0, 1} before training (would flag <code>'str'</code>, <code>'bool'</code>, <code>'float'</code>).",
      key: "Silent merges change counts and class balance; guard with assertions on counts and label types.",
      mistakes: ["Being vague (\"the data could be wrong\") — name the merged records and a concrete assert."],
      alts: [
        { q: "A pipeline guard:", code: `labels = [1, 0, True, 1.0, "1"]
bad = [l for l in labels if type(l) is not int or l not in (0, 1)]
print(bad)`, answer: "[True, 1.0, '1']" },
        { q: "Class balance before/after a lossy dedup:", code: `data = [((0,), 0), ((0,), False), ((1,), 1)]
print(sum(1 for _, l in data if l == 0), sum(1 for _, l in set(data) if l == 0))`, answer: "2 1" }
      ]
    },
    // ---------------- Q4
    {
      id: "hw2-q4", title: "Q4: Your environment", tags: ["environment", "floats", "versions"],
      prompt: "Run the script in your conda environment, report the output and environment name. If a classmate got a different result with identical source, what does that say about source vs behavior?",
      code: `import sys, platform
print(sys.version)
print(platform.platform())
print(platform.machine())
print(repr(0.1 + 0.2))
print(repr(sum([0.1] * 10)))
print(repr(sum([0.1] * 20)))`,
      output: null,
      explain: "The first three lines depend on your machine and Python build, so <code>output</code> is null. The float lines: <code>0.30000000000000004</code> everywhere; but <code>sum([0.1]*10)</code> is <code>1.0</code> on <b>Python 3.12+</b> (compensated summation) and <code>0.9999999999999999</code> on 3.11 and earlier; <code>sum([0.1]*20)</code> is <code>2.0</code> on 3.12+ and <code>2.0000000000000004</code> before.<br><br>" + MODEL + "A program's behavior is a function of its source <b>and</b> its environment (interpreter version, libraries, OS/CPU). Identical source with different output means the source alone doesn't determine the result, so you must record and pin the environment (e.g. conda env export) to reproduce results.",
      trace: `                           Python <= 3.11          Python >= 3.12
repr(0.1 + 0.2)            0.30000000000000004     0.30000000000000004
repr(sum([0.1] * 10))      0.9999999999999999      1.0
repr(sum([0.1] * 20))      2.0000000000000004      2.0`,
      key: "Same source + different environment can = different output (e.g. <code>sum</code> of floats changed in 3.12).",
      mistakes: ["Blaming the classmate's typing instead of the interpreter version."],
      extra: [{ label: "Float lines only (Python 3.12+)", code: `print(repr(0.1 + 0.2))
print(repr(sum([0.1] * 10)))
print(repr(sum([0.1] * 20)))`, output: "0.30000000000000004\n1.0\n2.0" }],
      alts: [
        { q: "Old-style summation (what Python ≤ 3.11 did):", code: `total = 0.0
for _ in range(20):
    total += 0.1
print(repr(total))`, answer: "2.0000000000000004" },
        { q: "Version-independent exact sum:", code: `import math
print(math.fsum([0.1] * 10), math.fsum([0.1] * 20))`, answer: "1.0 2.0" }
      ]
    },
    // ---------------- Q5
    {
      id: "hw2-q5", title: "Q5: Reflection (incl. 715-only paragraph)", tags: ["written", "reflection"],
      prompt: "1) Which result surprised you most? 2) Is a program that runs without errors and gives plausible output correct? <b>715 only:</b> describe an ML situation where the analogous problem would NOT be visible by inspection, and what you'd need to detect it.",
      code: `train = [((1.0, 2.0), 1), ((3.0, 4.0), 0)]
test = [((3.0, 4.0), False), ((5.0, 6.0), 1)]
leaked = set(train) & set(test)
print(leaked)`,
      output: "{((3.0, 4.0), False)}",
      explain: MODEL + "<b>1.</b> e.g. <code>dedup_naive</code> merging <code>((3.0, 4.0), False)</code> into <code>((3.0, 4.0), 0)</code> — I believed a set removes only exact copies.<br><b>2.</b> Before: \"if it runs and looks right, it's right.\" Now: no — <code>dedup_naive</code> ran fine and returned plausible data but silently lost records; correctness needs checks (counts, types, invariants), not just absence of errors.<br><b>715:</b> In ML the merged values are hidden inside large arrays or learned weights: e.g. near-duplicate examples shared between train and test (leakage) or labels silently cast to float inside a framework. Accuracy looks great and nothing errors, and you can't eyeball a million rows. To detect it you need explicit tests: counts and type/label-distribution checks before/after each stage, train/test overlap checks (hashing records), and a held-out evaluation or a known-answer baseline to compare against.",
      tips: ["In the demo, the leaked record prints as <code>((3.0, 4.0), False)</code>: the train copy has label <code>0</code>, the test copy <code>False</code>, they are <code>==</code>, and <code>&amp;</code> happened to return the test set's object. The overlap is real but the types hide it from a casual look."],
      key: "\"Runs without error\" ≠ correct. Detect silent problems with invariants: counts, types, distributions, overlap checks.",
      mistakes: ["Only answering 1 and 2 and skipping the 715 paragraph."],
      alts: [
        { q: "Overlap check across splits:", code: `train = {(1.0, 2.0), (3.0, 4.0)}
test = {(3.0, 4.0), (5.0, 6.0)}
print(len(train & test))`, answer: "1" },
        { q: "Invariant check on counts:", code: `before = [1, 1, 0, False]
after = list(set(before))
print(len(before) - len(after))`, answer: "2" }
      ]
    }
    ]
  },
  // ======================================================================
  {
    id: "hw3",
    title: "Homework 3: Functions and Classes",
    intro: "<p>Same RAW data as HW2. Key numbers: <code>len(set(RAW))</code> = <b>7</b>, <code>len(Dataset.from_raw(RAW).dedup())</code> = <b>9</b>.</p>",
    items: [
    // ---------------- S1
    {
      id: "hw3-s1", title: "S1: def collect(x, acc=[])", tags: ["mutable default", "functions"],
      prompt: "Predict, run, explain.",
      code: `def collect(x, acc=[]):
    acc.append(x)
    return acc

print(collect(1))
print(collect(2))
print(collect(3))`,
      output: "[1]\n[1, 2]\n[1, 2, 3]",
      explain: "Default values are evaluated <b>once</b>, when the <code>def</code> statement runs, and stored on the function object (<code>collect.__defaults__</code>). Every call that omits <code>acc</code> gets that <b>same</b> list, and <code>append</code> mutates it, so it keeps growing across calls.",
      trace: `collect.__defaults__ ──> ( ● ,)
                           │
call 1: acc ───────────────┤
call 2: acc ───────────────┼──> [1, 2, 3]   (one list for all calls)
call 3: acc ───────────────┘`,
      anatomy: [{ code: "def collect(x, acc=[]):", notes: [
        { at: "x,", label: "new each call" },
        { at: "acc=[]", label: "list built ONCE at def time" } ] }],
      key: "Mutable defaults are shared across calls. Use <code>acc=None</code> then <code>if acc is None: acc = []</code>.",
      lookFor: ["<code>=[]</code>, <code>={}</code>, <code>=set()</code> in a def line"],
      mistakes: ["Predicting <code>[1] [2] [3]</code>."],
      extra: [{ label: "Fixed with None sentinel", code: `def collect(x, acc=None):
    if acc is None:
        acc = []
    acc.append(x)
    return acc

print(collect(1))
print(collect(2))`, output: "[1]\n[2]" }],
      alts: [
        { q: "Are the results the same object?", code: `def f(x, acc=[]):
    acc.append(x)
    return acc

a = f(1)
b = f(2)
print(a is b, a)`, answer: "True [1, 2]" },
        { q: "Rebinding instead of mutating:", code: `def f(x, acc=[]):
    acc = acc + [x]
    return acc

print(f(1), f(2))`, answer: "[1] [2]" },
        { q: "Passing your own list bypasses the default:", code: `def f(x, acc=[]):
    acc.append(x)
    return acc

print(f(1), f(2, []), f(3))`, answer: "[1, 3] [2] [1, 3]" }
      ]
    },
    // ---------------- S2
    {
      id: "hw3-s2", title: "S2: late-binding lambdas", tags: ["closures", "lambda"],
      prompt: "Predict, run, explain.",
      code: `fs = [lambda: i for i in range(3)]
print([f() for f in fs])

gs = [lambda i=i: i for i in range(3)]
print([g() for g in gs])`,
      output: "[2, 2, 2]\n[0, 1, 2]",
      explain: "<code>lambda: i</code> doesn't store the value of <code>i</code>; it stores a reference to the <b>variable</b> <code>i</code> (a closure cell) and looks it up <b>when called</b>. All three lambdas share one cell, which holds 2 after the loop → <code>[2, 2, 2]</code>.<br><code>lambda i=i: i</code> uses a default: the current value of <code>i</code> is evaluated <b>at lambda-creation time</b> and saved in each lambda's own <code>__defaults__</code> → <code>[0, 1, 2]</code>.",
      trace: `fs:  f0 ─┐
     f1 ─┼──> cell i ──> 2      (looked up at call time)
     f2 ─┘

gs:  g0.__defaults__ = (0,)
     g1.__defaults__ = (1,)     (captured at creation)
     g2.__defaults__ = (2,)`,
      anatomy: [
        { code: "fs = [lambda: i for i in range(3)]", notes: [
          { at: "lambda: i", label: "reads i LATER (call time)" },
          { at: "for i", label: "one shared variable i" } ] },
        { code: "gs = [lambda i=i: i for i in range(3)]", notes: [
          { at: "i=i", label: "value saved NOW (default)" },
          { at: ": i", label: "uses its own copy" } ] }],
      key: "Closures capture variables, not values (late binding). <code>i=i</code> freezes the current value.",
      lookFor: ["lambdas or inner defs created in a loop/comprehension"],
      mistakes: ["Predicting <code>[0, 1, 2]</code> for the first line."],
      extra: [{ label: "Peek inside", code: `fs = [lambda: i for i in range(3)]
gs = [lambda i=i: i for i in range(3)]
print(fs[0].__code__.co_freevars, fs[0].__closure__[0].cell_contents)
print([g.__defaults__ for g in gs])`, output: "('i',) 2\n[(0,), (1,), (2,)]" }],
      alts: [
        { q: "With an argument:", code: `fs = [lambda x: x * i for i in range(3)]
print([f(10) for f in fs])`, answer: "[20, 20, 20]" },
        { q: "Variable changed after the loop:", code: `fs = []
for i in range(3):
    fs.append(lambda: i)
i = 10
print([f() for f in fs])`, answer: "[10, 10, 10]" },
        { q: "Factory function = one cell per call:", code: `def make(i):
    return lambda: i

fs = [make(i) for i in range(3)]
print([f() for f in fs])`, answer: "[0, 1, 2]" }
      ]
    },
    // ---------------- S3
    {
      id: "hw3-s3", title: "S3: mutate vs rebind a parameter", tags: ["functions", "references"],
      prompt: "Predict, run, explain.",
      code: `def mutate(lst):
    lst.append(99)

def rebind(lst):
    lst = [99]

a = [1]
mutate(a)
print(a)

b = [1]
rebind(b)
print(b)`,
      output: "[1, 99]\n[1]",
      explain: "Calling a function binds the parameter name to the <b>same object</b> the caller passed (\"pass by object reference\"). <code>mutate</code> changes that object → the caller sees it. <code>rebind</code> only moves its <i>local</i> name <code>lst</code> to a new list; the caller's <code>b</code> still points at the old one.",
      trace: `mutate(a):  a ──┬──> [1, 99]
           lst ──┘

rebind(b):  b ──> [1]
           lst ──> [99]   (local, thrown away on return)`,
      key: "Mutation inside a function is visible outside; rebinding the parameter is not.",
      mistakes: ["Thinking Python copies the list on call.", "Thinking <code>lst = [99]</code> replaces the caller's list."],
      extra: [{ label: "Return the new object instead", code: `def rebind(lst):
    lst = [99]
    return lst

b = [1]
b = rebind(b)
print(b)`, output: "[99]" }],
      alts: [
        { q: "<code>+=</code> mutates a list parameter:", code: `def f(lst):
    lst += [99]

a = [1]
f(a)
print(a)`, answer: "[1, 99]" },
        { q: "<code>lst = lst + …</code> rebinds:", code: `def f(lst):
    lst = lst + [99]

a = [1]
f(a)
print(a)`, answer: "[1]" },
        { q: "Ints are immutable:", code: `def f(n):
    n += 1

x = 5
f(x)
print(x)`, answer: "5" }
      ]
    },
    // ---------------- S4
    {
      id: "hw3-s4", title: "S4: class attribute list shared", tags: ["classes", "class attributes"],
      prompt: "Predict, run, explain.",
      code: `class Bag:
    items = []
    def add(self, x):
        self.items.append(x)

p = Bag()
q = Bag()
p.add("a")
q.add("b")
print(p.items)
print(q.items)
print(p.items is q.items)`,
      output: "['a', 'b']\n['a', 'b']\nTrue",
      explain: "<code>items = []</code> in the class body is a <b>class attribute</b>: one list stored on <code>Bag</code>, created once. <code>self.items</code> first looks on the instance (nothing there), then on the class, and finds that one list. <code>append</code> mutates it, so both instances see both items.",
      trace: `Bag.items ──> ['a', 'b']
                ↑      ↑
p (no own items)  q (no own items)   -> lookup falls back to class`,
      key: "Mutable class attributes are shared by all instances. Put per-instance state in <code>__init__</code> (<code>self.items = []</code>).",
      lookFor: ["a list/dict assigned in the class body, then mutated via <code>self.</code>"],
      mistakes: ["Predicting <code>['a']</code> and <code>['b']</code>."],
      extra: [{ label: "Fixed", code: `class Bag:
    def __init__(self):
        self.items = []
    def add(self, x):
        self.items.append(x)

p = Bag()
q = Bag()
p.add("a")
q.add("b")
print(p.items, q.items, p.items is q.items)`, output: "['a'] ['b'] False" }],
      alts: [
        { q: "Augmented assignment on an int class attribute creates an instance attribute:", code: `class C:
    count = 0

a = C()
b = C()
a.count += 1
print(a.count, b.count, C.count)`, answer: "1 0 0" },
        { q: "Rebinding through self shadows the class list:", code: `class C:
    items = []

a = C()
a.items = a.items + ["x"]
print(C.items, a.items)`, answer: "[] ['x']" }
      ]
    },
    // ---------------- S5
    {
      id: "hw3-s5", title: "S5: default == and hash are identity", tags: ["classes", "equality", "hashing"],
      prompt: "Predict, run, explain.",
      code: `class Point:
    def __init__(self, n):
        self.n = n

print(Point(1) == Point(1))
print(len({Point(1), Point(1)}))`,
      output: "False\n2",
      explain: "Without <code>__eq__</code>, objects inherit <code>object</code>'s rules: <code>==</code> means <b>same object</b> (identity) and the hash is based on identity. Two separate <code>Point(1)</code> objects are different objects → <code>==</code> is False, and the set keeps both → 2.",
      trace: `Point(1) ──> obj A (n=1)
Point(1) ──> obj B (n=1)
A == B  -> A is B -> False
set: {A, B} -> len 2`,
      key: "Default <code>==</code> is <code>is</code>. Value equality only exists if you define <code>__eq__</code>.",
      mistakes: ["Assuming Python compares attributes automatically."],
      extra: [{ label: "Same object", code: `class Point:
    def __init__(self, n):
        self.n = n

p = Point(1)
print(p == p, len({p, p}))`, output: "True 1" }],
      alts: [
        { q: "<code>!=</code> follows:", code: `class Point:
    def __init__(self, n):
        self.n = n

print(Point(1) != Point(1))`, answer: "True" },
        { q: "dataclass adds <code>__eq__</code> (and so drops the hash):", code: `from dataclasses import dataclass

@dataclass
class P:
    n: int

print(P(1) == P(1))
try:
    {P(1)}
except TypeError as e:
    print(type(e).__name__)`, answer: "True\nTypeError" },
        { q: "frozen dataclass is hashable by value:", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class P:
    n: int

print(len({P(1), P(1)}))`, answer: "1" }
      ]
    },
    // ---------------- S6
    {
      id: "hw3-s6", title: "S6: __eq__ without __hash__ → unhashable", tags: ["classes", "hashing"],
      prompt: "Predict, run, explain. The second line raises an error — report it exactly and explain what defining <code>__eq__</code> changed.",
      code: `class Tagged:
    def __init__(self, n):
        self.n = n
    def __eq__(self, other):
        return isinstance(other, Tagged) and self.n == other.n

print(Tagged(1) == Tagged(1))
try:
    print({Tagged(1)})
except TypeError as e:
    print(type(e).__name__)
print(Tagged.__hash__)`,
      output: "True\nTypeError\nNone",
      explain: "The exact error is <code>TypeError: unhashable type: 'Tagged'</code>.<br>Defining <code>__eq__</code> in a class makes Python set <code>__hash__ = None</code> for that class. Reason: the rule \"equal objects must have equal hashes\" would be broken if it kept the identity-based hash (two equal Tagged(1)s would hash differently). With <code>__hash__</code> None the objects are <b>unhashable</b> → can't go into a set or be dict keys. <code>==</code> now compares <code>n</code> → True.",
      steps: ["<code>Tagged(1) == Tagged(1)</code> → our <code>__eq__</code> → True.", "<code>{Tagged(1)}</code> needs <code>hash(Tagged(1))</code>.", "<code>Tagged.__hash__</code> is None → TypeError: unhashable type: 'Tagged'."],
      anatomy: [{ code: "def __hash__(self): return hash(self.n)", notes: [
        { at: "__hash__", label: "add this to fix" },
        { at: "self.n", label: "same fields as __eq__" } ] }],
      key: "Define <code>__eq__</code> ⇒ <code>__hash__</code> becomes None ⇒ unhashable. Define <code>__hash__</code> from the same fields as <code>__eq__</code>.",
      lookFor: ["a class with <code>__eq__</code> used in a set / as a dict key"],
      mistakes: ["Predicting <code>{&lt;Tagged object&gt;}</code> is printed.", "Writing a <code>__hash__</code> that uses fields <code>__eq__</code> ignores (or vice-versa)."],
      extra: [{ label: "Fixed: consistent __hash__", code: `class Tagged:
    def __init__(self, n):
        self.n = n
    def __eq__(self, other):
        return isinstance(other, Tagged) and self.n == other.n
    def __hash__(self):
        return hash(self.n)

print(len({Tagged(1), Tagged(1), Tagged(2)}))`, output: "2" }],
      alts: [
        { q: "Dict key:", code: `class T:
    def __eq__(self, other):
        return True

try:
    d = {T(): 1}
except TypeError as e:
    print(type(e).__name__)`, answer: "TypeError" },
        { q: "Comparing with a non-Tagged:", code: `class Tagged:
    def __init__(self, n):
        self.n = n
    def __eq__(self, other):
        return isinstance(other, Tagged) and self.n == other.n

print(Tagged(1) == 1, Tagged(1) != Tagged(2))`, answer: "False True" },
        { q: "A subclass that only adds __hash__:", code: `class A:
    def __eq__(self, other):
        return True

class B(A):
    def __hash__(self):
        return 0

print(A.__hash__ is None, len({B(), B()}))`, answer: "True 1" }
      ]
    },
    // ---------------- Q2(a)
    {
      id: "hw3-q2a", title: "Q2(a): collect.__defaults__ before/after", tags: ["function object", "defaults"],
      prompt: "Run and report. How does this relate to S1?",
      code: `def collect(x, acc=[]):
    acc.append(x)
    return acc

print(collect.__defaults__)
collect(1)
collect(2)
print(collect.__defaults__)`,
      output: "([],)\n([1, 2],)",
      explain: "<code>__defaults__</code> is a tuple stored <b>on the function object</b> holding the default values, built once at <code>def</code> time. After two calls it shows <code>([1, 2],)</code>: the same list object, mutated by the calls. That is exactly why S1 grows: every call without <code>acc</code> uses <code>collect.__defaults__[0]</code>.",
      trace: `after def:     collect.__defaults__ ──> ( ● ,) ──> []
after 2 calls: collect.__defaults__ ──> ( ● ,) ──> [1, 2]   (same list)`,
      key: "Defaults live in <code>f.__defaults__</code> — a tuple created once, holding objects that can be mutated.",
      mistakes: ["Thinking the tuple changed (it didn't; the list inside did)."],
      alts: [
        { q: "Dict default:", code: `def f(x, d={}):
    d[x] = x
    return d

f(1)
f(2)
print(f.__defaults__)`, answer: "({1: 1, 2: 2},)" },
        { q: "Mutate the default from outside:", code: `def g(a, b=[]):
    return b

g.__defaults__[0].append(5)
print(g(0))`, answer: "[5]" },
        { q: "Immutable default:", code: `def h(a, b=None, c=3):
    pass

print(h.__defaults__)`, answer: "(None, 3)" }
      ]
    },
    // ---------------- Q2(b)
    {
      id: "hw3-q2b", title: "Q2(b): __code__, __closure__, cell_contents", tags: ["closures", "function object"],
      prompt: "Run and report. <code>outer</code> has returned, so where is 10 stored? Why does <code>h.__closure__</code> differ from <code>i.__closure__</code>?",
      code: `def h(a, b=2, *args, **kw):
    pass

print(h.__defaults__)
print(h.__code__.co_argcount)
print(h.__code__.co_varnames)
print(h.__closure__)

def outer():
    n = 10
    def inner():
        return n
    return inner

i = outer()
print(i.__code__.co_freevars)
print(i.__closure__[0].cell_contents)`,
      output: "(2,)\n2\n('a', 'b', 'args', 'kw')\nNone\n('n',)\n10",
      explain: "• <code>__defaults__ = (2,)</code>: only <code>b</code> has a default.<br>• <code>co_argcount = 2</code>: positional params <code>a, b</code> (not <code>*args</code>/<code>**kw</code>).<br>• <code>co_varnames</code>: all local names, params first.<br>• <code>h.__closure__ = None</code>: <code>h</code> uses no variables from an enclosing function.<br>• <code>inner</code> uses <code>n</code> from <code>outer</code>, so <code>n</code> is a <b>free variable</b> (<code>co_freevars = ('n',)</code>). When <code>outer</code> ran, Python put <code>n</code> in a <b>cell</b> object; <code>inner</code> was created holding a reference to that cell in <code>__closure__</code>. The stack frame is gone, but the cell lives on because the function object still points at it → <code>cell_contents</code> is 10.",
      trace: `i ──> function inner
        __code__.co_freevars = ('n',)
        __closure__ = ( cell ,)
                         │
                         └──> 10      (survives after outer's frame is gone)

h ──> function h
        __closure__ = None   (no free variables)`,
      key: "A closure keeps captured variables in <b>cell</b> objects referenced by <code>f.__closure__</code>; plain functions have <code>__closure__ = None</code>.",
      lookFor: ["nested <code>def</code> returning the inner function", "<code>nonlocal</code>"],
      mistakes: ["Counting <code>*args</code>/<code>**kw</code> in <code>co_argcount</code> (answer is 2).", "Saying 10 is stored in <code>__defaults__</code> or in <code>inner</code>'s code."],
      extra: [{ label: "Cells are shared and live (late binding)", code: `def outer():
    n = 10
    def inner():
        return n
    n = 20
    return inner

print(outer()())
print(outer().__closure__[0].cell_contents)`, output: "20\n20" }],
      alts: [
        { q: "nonlocal counter:", code: `def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

c = make_counter()
c()
c()
print(c.__closure__[0].cell_contents)`, answer: "2" },
        { q: "Keyword-only params:", code: `def f(a, b, *args, c=1, **kw):
    pass

print(f.__code__.co_argcount, f.__defaults__, f.__kwdefaults__)`, answer: "2 None {'c': 1}" },
        { q: "Two closures from one call share a cell:", code: `def pair():
    x = 0
    def get():
        return x
    def setx(v):
        nonlocal x
        x = v
    return get, setx

get, setx = pair()
setx(7)
print(get())`, answer: "7" }
      ]
    },
    // ---------------- Q2(c)
    {
      id: "hw3-q2c", title: "Q2(c): state not visible in the function body (written)", tags: ["written", "function object"],
      prompt: "<b>Written.</b> Give one example of state that belongs to a function but is not visible anywhere in its body.",
      code: `def collect(x, acc=[]):
    acc.append(x)
    return acc

collect(1)
collect(2)
print(collect.__defaults__)`,
      output: "([1, 2],)",
      explain: MODEL + "The default list stored in <code>collect.__defaults__</code>: after calls it holds <code>[1, 2]</code>, but the body only says <code>acc.append(x)</code> and the source still says <code>acc=[]</code>. Another example is a closure cell (<code>i.__closure__[0].cell_contents == 10</code>), whose value is set by the enclosing call, not by the inner body. In both cases the function object carries state that only inspection or running it reveals.",
      key: "Function objects carry state: <code>__defaults__</code>, <code>__closure__</code> cells, <code>__dict__</code> attributes.",
      mistakes: ["Naming a local variable (that IS in the body)."],
      alts: [
        { q: "Attributes on functions:", code: `def f():
    pass

f.calls = 3
print(f.__dict__)`, answer: "{'calls': 3}" },
        { q: "Same body, different hidden state:", code: `def make(n):
    def g():
        return n
    return g

a, b = make(1), make(2)
print(a.__code__ is b.__code__, a(), b())`, answer: "True 1 2" }
      ]
    },
    // ---------------- Q3(a)
    {
      id: "hw3-q3a", title: "Q3(a): class Record (__repr__, strict __eq__, __hash__)", tags: ["classes", "dunder", "hashing"],
      prompt: "Write <code>Record</code> with <code>features</code>, <code>label</code>, a <code>__repr__</code> showing features/label/label type, an <code>__eq__</code> requiring equal features, equal labels AND same label type, and a consistent <code>__hash__</code>. Verify <code>Record((3.0, 4.0), 0)</code> ≠ <code>Record((3.0, 4.0), False)</code> (and hashes differ), and identical args are equal.",
      code: HW3_RECORD + `

a = Record((3.0, 4.0), 0)
b = Record((3.0, 4.0), False)
c = Record((3.0, 4.0), 0)
print(a, b)
print(a == b, hash(a) == hash(b))
print(a == c, hash(a) == hash(c), a is c)
print(a == ((3.0, 4.0), 0))`,
      output: "Record((3.0, 4.0), 0, int) Record((3.0, 4.0), False, bool)\nFalse False\nTrue True False\nFalse",
      explain: "• <code>__repr__</code> adds <code>type(self.label).__name__</code> so <code>0</code> vs <code>False</code> is visible.<br>• <code>__eq__</code>: if <code>other</code> isn't a Record, return <code>NotImplemented</code> (Python then tries the reflected side and finally falls back to identity → False). Otherwise require features equal, labels equal, and <code>type(...) is type(...)</code>.<br>• <code>__hash__</code> hashes exactly the fields <code>__eq__</code> compares (including the type name), so equal records always hash equal. <code>(f, 0, 'int')</code> vs <code>(f, False, 'bool')</code> hash differently (with overwhelming probability — hashes may collide, but sets still use <code>__eq__</code> to separate them).",
      anatomy: [{ code: "def __hash__(self): return hash((self.features, self.label, type(self.label).__name__))", notes: [
        { at: "hash((", label: "hash one tuple" },
        { at: "self.features,", label: "same fields as __eq__" },
        { at: "self.label,", label: "label value" },
        { at: "type(self.label).__name__", label: "type name: 'int' vs 'bool'" } ] }],
      key: "Equal ⇒ same hash. Hash exactly what <code>__eq__</code> compares. Return <code>NotImplemented</code> for unknown types.",
      lookFor: ["<code>__eq__</code> + <code>__hash__</code> pairs", "<code>type(a) is type(b)</code> vs <code>isinstance</code>"],
      tips: ["Store features as a tuple so the record is hashable."],
      mistakes: ["Forgetting <code>__hash__</code> (→ unhashable, see S6).", "Hashing only <code>features</code> is <i>allowed</i> (consistent) but causes more collisions; hashing a field <code>__eq__</code> ignores is a bug.", "Returning <code>False</code> instead of <code>NotImplemented</code> — works, but blocks the other operand's <code>__eq__</code>."],
      alts: [
        { q: "repr inside a list:", code: HW3_RECORD + `

print([Record((1.0,), True), Record((1.0,), 1.0)])`, answer: "[Record((1.0,), True, bool), Record((1.0,), 1.0, float)]" },
        { q: "Set of Records:", code: HW3_RECORD + `

s = {Record((7.0, 8.0), 1), Record((7.0, 8.0), 1.0), Record((7.0, 8.0), 1)}
print(len(s))`, answer: "2" },
        { q: "NotImplemented in action:", code: `class A:
    def __eq__(self, other):
        if not isinstance(other, A):
            return NotImplemented
        return True

print(A() == A(), A() == 5, A().__eq__(5))`, answer: "True False NotImplemented" }
      ]
    },
    // ---------------- Q3(b)
    {
      id: "hw3-q3b", title: "Q3(b): class Dataset (None default, from_raw, __len__, dedup)", tags: ["classes", "classmethod", "mutable default"],
      prompt: "Write <code>Dataset</code>: constructor with a non-mutable default for <code>records</code> (comment why), classmethod <code>from_raw(raw)</code>, <code>__len__</code>, and order-preserving <code>dedup()</code> returning a new Dataset.",
      code: RAW + "\n\n" + HW3_RECORD + "\n\n" + HW3_DATASET + `

ds = Dataset.from_raw(RAW)
print(len(Dataset()), len(ds))
d = ds.dedup()
print(len(d), type(d).__name__)
print(d.records[:3])
a, b = Dataset(), Dataset()
a.records.append("x")
print(b.records)`,
      output: "0 11\n9 Dataset\n[Record((1.0, 2.0), 1, int), Record((3.0, 4.0), 0, int), Record((5.0, 6.0), True, bool)]\n[]",
      explain: "• <code>records=None</code>: a default like <code>[]</code> is built once and shared by every <code>Dataset()</code> (the S1 bug). <code>None</code> is immutable; we build a fresh list per instance.<br>• <code>@classmethod from_raw(cls, raw)</code> receives the class as <code>cls</code>, turns each tuple into a <code>Record</code>, and calls <code>cls(...)</code> (works for subclasses too).<br>• <code>__len__</code> lets <code>len(ds)</code> work.<br>• <code>dedup</code>: <code>dict.fromkeys</code> uses <code>Record.__hash__/__eq__</code>, keeps the <b>first</b> of each, and dicts remember insertion order.",
      anatomy: [{ code: "def __init__(self, records=None):", notes: [
        { at: "records=None", label: "immutable sentinel" },
        { at: "self,", label: "the new instance" } ] }],
      trace: `Dataset()  -> records=None -> self.records = []   (new list each time)
Dataset([]) default trap avoided:
  a.records ──> [ 'x' ]
  b.records ──> [ ]          (separate lists)`,
      key: "Never use a mutable default; use <code>None</code> + create inside. <code>classmethod</code> = alternative constructor.",
      mistakes: ["<code>def __init__(self, records=[])</code>.", "Writing <code>from_raw</code> without <code>@classmethod</code> or forgetting <code>cls</code>.", "Using <code>set</code> in dedup (loses order)."],
      extra: [{ label: "The bug you avoided", code: `class Bad:
    def __init__(self, records=[]):
        self.records = records

a = Bad()
b = Bad()
a.records.append(1)
print(b.records, a.records is b.records)`, output: "[1] True" }],
      alts: [
        { q: "classmethod with a subclass:", code: `class Base:
    @classmethod
    def make(cls):
        return cls()

class Sub(Base):
    pass

print(type(Sub.make()).__name__)`, answer: "Sub" },
        { q: "<code>__len__</code> also drives truthiness:", code: `class Box:
    def __init__(self, items=None):
        self.items = items if items is not None else []
    def __len__(self):
        return len(self.items)

print(bool(Box()), bool(Box([1])), len(Box([1, 2])))`, answer: "False True 2" },
        { q: "<code>dict.fromkeys</code> keeps first occurrence order:", code: `print(list(dict.fromkeys(["b", "a", "b", "c", "a"])))`, answer: "['b', 'a', 'c']" }
      ]
    },
    // ---------------- Q3(c)
    {
      id: "hw3-q3c", title: "Q3(c): len(set(RAW)) = 7 vs Record dedup = 9", tags: ["hashing", "dedup"],
      prompt: "Report <code>len(set(RAW))</code> and <code>len(Dataset.from_raw(RAW).dedup())</code>. Which records account for the difference and why does <code>Record</code> keep them apart?",
      code: RAW + "\n\n" + HW3_RECORD + "\n\n" + HW3_DATASET + `

print(len(set(RAW)), len(Dataset.from_raw(RAW).dedup()))
kept = Dataset.from_raw(RAW).dedup().records
print([r for r in kept if r.features in ((3.0, 4.0), (7.0, 8.0))])`,
      output: "7 9\n[Record((3.0, 4.0), 0, int), Record((7.0, 8.0), 1.0, float), Record((3.0, 4.0), False, bool), Record((7.0, 8.0), 1, int)]",
      explain: "<b>7 vs 9.</b> The 2 extra records are <code>((3.0, 4.0), False)</code> (merged into <code>((3.0, 4.0), 0)</code> by <code>set</code>) and <code>((7.0, 8.0), 1)</code> (merged into <code>((7.0, 8.0), 1.0)</code>). Plain tuples compare labels with <code>==</code>, and <code>False == 0</code>, <code>1 == 1.0</code>. <code>Record.__eq__</code> also requires <code>type(label)</code> to match (bool ≠ int, int ≠ float), and <code>__hash__</code> includes the type name, so they stay distinct. Both approaches remove the 2 exact duplicates (#2 and #8).",
      trace: `record                 set(RAW) (tuple ==)        Record dedup (value + type)
((1.0,2.0), 1)    #2   dup of #0                  dup of #0
((5.0,6.0), True) #8   dup of #3                  dup of #3
((3.0,4.0), False)#9   == ((3.0,4.0), 0)  MERGED  bool != int   KEPT
((7.0,8.0), 1)   #10   == ((7.0,8.0), 1.0) MERGED int != float  KEPT
                       11 - 4 = 7                 11 - 2 = 9`,
      key: "7 (tuple equality merges 0/False and 1/1.0) vs 9 (Record equality includes the type).",
      mistakes: ["Counting <code>((2.0, 3.0), \"1\")</code> as part of the difference (it's distinct in both).", "Thinking Record dedup gives 11 (exact duplicates are still removed)."],
      alts: [
        { q: "Same idea, smaller data:", code: HW3_RECORD + `

data = [((0,), 0), ((0,), False), ((0,), 0.0), ((0,), 0)]
print(len(set(data)), len({Record(f, l) for f, l in data}))`, answer: "1 3" },
        { q: "Which tuple survives in a set?", code: `s = set()
s.add(((7.0, 8.0), 1.0))
s.add(((7.0, 8.0), 1))
print(s)`, answer: "{((7.0, 8.0), 1.0)}" }
      ]
    },
    // ---------------- Q3(d)
    {
      id: "hw3-q3d", title: "Q3(d): _canonical (staticmethod), filter(predicate=default), label_census", tags: ["staticmethod", "default args", "bool vs int"],
      prompt: "Add a staticmethod <code>_canonical(label)</code> (0/1 or None; test bool before int and say why), <code>filter(predicate)</code> with a default predicate keeping non-string labels (call it with and without an argument), and <code>label_census()</code> keyed by <code>(label, type name)</code>.",
      code: RAW + "\n\n" + HW3_RECORD + "\n\n" + HW3_DATASET + `

ds = Dataset.from_raw(RAW)
print([Dataset._canonical(x) for x in (True, False, 1, 0, 1.0, 2, "1")])
print(len(ds.filter()))
print(len(ds.filter(lambda r: Dataset._canonical(r.label) == 1)))
print(ds.label_census())`,
      output: "[1, 0, 1, 0, 1, None, None]\n10\n6\n{(1, 'int'): 3, (0, 'int'): 2, (True, 'bool'): 2, (1.0, 'float'): 1, (False, 'bool'): 2, ('1', 'str'): 1}",
      explain: "• <b>_canonical</b> is a <code>@staticmethod</code>: it needs neither <code>self</code> nor <code>cls</code>. bool is tested first because <code>isinstance(True, int)</code> is True; if the int branch came first, every bool would be handled by the int rule and the bool branch would be dead code (and <code>True</code> would be returned as-is instead of the int 1). <code>2</code> and <code>\"1\"</code> → None (can't canonicalize without guessing).<br>• <b>filter()</b> with no argument uses the default lambda (drop string labels) → 11 − 1 = <b>10</b>. With <code>lambda r: _canonical(r.label) == 1</code> → 3×<code>1</code> + 2×<code>True</code> + 1×<code>1.0</code> = <b>6</b>. A function as a default is safe because it's never mutated.<br>• <b>label_census</b>: keys like <code>(1, 'int')</code> and <code>(True, 'bool')</code> differ in the type-name slot, so they don't merge (unlike HW2's <code>count_labels</code>).",
      anatomy: [{ code: "def filter(self, predicate=lambda r: not isinstance(r.label, str)):", notes: [
        { at: "predicate=", label: "default used if no arg" },
        { at: "lambda r", label: "built once at def time" },
        { at: "not isinstance", label: "keep non-string labels" } ] }],
      trace: `label_census key       count
(1, 'int')             3
(0, 'int')             2
(True, 'bool')         2
(1.0, 'float')         1
(False, 'bool')        2
('1', 'str')           1      total 11`,
      key: "Test <code>bool</code> before <code>int</code>. A census keyed by <code>(label, type name)</code> keeps 1/True/1.0 apart.",
      lookFor: ["<code>@staticmethod</code> vs <code>@classmethod</code>", "function-valued default parameters"],
      mistakes: ["Calling <code>self._canonical</code> from outside without the class/instance prefix.", "Expecting <code>filter()</code> with no argument to keep all 11 records."],
      alts: [
        { q: "Default predicate vs explicit:", code: `def keep(xs, pred=lambda v: v > 0):
    return [v for v in xs if pred(v)]

print(keep([-1, 2, 3]), keep([-1, 2, 3], lambda v: v < 0))`, answer: "[2, 3] [-1]" },
        { q: "Census with a typed key:", code: `census = {}
for lab in [1, True, 1.0, 1]:
    k = (lab, type(lab).__name__)
    census[k] = census.get(k, 0) + 1
print(census)`, answer: "{(1, 'int'): 2, (True, 'bool'): 1, (1.0, 'float'): 1}" },
        { q: "staticmethod vs classmethod calls:", code: `class C:
    @staticmethod
    def s(x):
        return x * 2
    @classmethod
    def c(cls):
        return cls.__name__

print(C.s(3), C().s(4), C.c(), C().c())`, answer: "6 8 C C" }
      ]
    },
    // ---------------- Q3(e)
    {
      id: "hw3-q3e", title: "Q3(e): when strict equality is the wrong choice (written)", tags: ["written", "equality design"],
      prompt: "<b>Written.</b> Describe one situation in which the stricter equality you wrote would be the <i>wrong</i> choice, and what you would change.",
      code: RAW + `

def canonical(label):
    if isinstance(label, bool):
        return int(label)
    if isinstance(label, (int, float)) and label in (0, 1):
        return int(label)
    return None

print(len({(f, l, type(l).__name__) for f, l in RAW}))
print(len({(f, canonical(l)) for f, l in RAW}))`,
      output: "9\n7",
      explain: MODEL + "If the label types differ only because different sources serialized the same class differently (one wrote <code>True</code>, one <code>1</code>, one <code>1.0</code>), they mean the same thing. Strict equality keeps <code>((7.0, 8.0), 1)</code> and <code>((7.0, 8.0), 1.0)</code> as two records, so the same example is trained on twice (over-weighted) and may leak across a train/test split. Then I would canonicalize first (map labels to int 0/1 with <code>_canonical</code>) and define <code>__eq__</code>/<code>__hash__</code> on <code>(features, canonical label)</code> → 7 records here. Similarly, for float features from sensors, exact equality is too strict; compare rounded/tolerance-based values.",
      key: "Equality is a design choice: strict when type carries meaning, canonical when it's just a serialization artifact.",
      mistakes: ["Giving a situation without saying what to change."],
      alts: [
        { q: "Exact float features are too strict:", code: `print((0.1 + 0.2,) == (0.3,), (round(0.1 + 0.2, 9),) == (round(0.3, 9),))`, answer: "False True" },
        { q: "Canonical key merges serialization variants:", code: `labels = [1, True, 1.0]
print(len({(l, type(l).__name__) for l in labels}), len({int(l) for l in labels}))`, answer: "3 1" }
      ]
    },
    // ---------------- Q4
    {
      id: "hw3-q4", title: "Q4: Reflection (incl. 715-only paragraph)", tags: ["written", "reflection", "serialization"],
      prompt: "1) What surprised you most? 2) What else were you treating as fixed that you could specify yourself? <b>715 only:</b> if Records are written to disk by one program and read by another with a slightly different <code>__eq__</code>, what could go wrong and how would you detect it?",
      code: `import json

rec = ((1.0, 2.0), True)
back = json.loads(json.dumps(rec))
print(back, type(back).__name__)
try:
    {tuple(back)}
except TypeError as e:
    print(type(e).__name__)`,
      output: "[[1.0, 2.0], True] list\nTypeError",
      explain: MODEL + "<b>1.</b> e.g. that <code>{Tagged(1)}</code> fails just because I defined <code>__eq__</code>, or that defaults live on the function object (<code>__defaults__</code>).<br><b>2.</b> Ordering (<code>__lt__</code>), truthiness (<code>__bool__</code>/<code>__len__</code>), string form (<code>__repr__</code>), iteration (<code>__iter__</code>), arithmetic operators, attribute lookup, and even what <code>len()</code> and <code>in</code> mean — all are protocols I can define.<br><b>715:</b> Saved data stores only attribute values, not the behavior; equality comes from whichever class definition the <i>reader</i> uses. If the reader's <code>__eq__</code> ignores the label type (or a JSON round trip turns tuples into lists and type info changes), records the writer considered distinct get merged (or vice-versa), so dedup counts, joins, set membership and train/test overlap checks silently differ between programs; dict lookups with keys hashed differently can even miss. Detect it by storing a schema/class version with the data, running round-trip tests (write → read → compare counts, <code>label_census</code>, and per-record equality under both definitions), and recording expected summary statistics (e.g. 9 unique records) to assert on load.",
      key: "Serialized data carries values, not <code>__eq__</code>. Version the schema and test round trips + counts.",
      mistakes: ["Skipping the detection part of the 715 paragraph."],
      extra: [{ label: "Two definitions of equality, two answers", code: RAW + `

strict = {(f, l, type(l).__name__) for f, l in RAW}
loose = {(f, l) for f, l in RAW}
print(len(strict), len(loose))`, output: "9 7" }],
      alts: [
        { q: "pickle round trip keeps types:", code: `import pickle

r = pickle.loads(pickle.dumps(((1.0, 2.0), True)))
print(r, type(r[1]).__name__)`, answer: "((1.0, 2.0), True) bool" },
        { q: "JSON changes 1.0 vs 1?", code: `import json

print(json.loads(json.dumps([1, 1.0, True])))`, answer: "[1, 1.0, True]" }
      ]
    }
    ]
  }
  ]
};

})();
