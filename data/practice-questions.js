// Question bank for the CS 715/657 practice midterm.
// Each question: id, part, title, prompt, code (original), output (exact), idea,
// steps[], mistakes[], tries[{change, expect}], optional model / fixed / play.
window.QUESTIONS = [
  {
    id: "A1", part: "A", points: 4, title: "Repeated inner list",
    prompt: "Predict the output.",
    code: `m = [[0] * 2] * 3
m[0][0] = 7
print(m)`,
    output: `[[7, 0], [7, 0], [7, 0]]`,
    idea: "Shared references: <code>[x] * n</code> repeats the <em>same</em> object n times. It doesn't make copies.",
    steps: [
      "<code>[0] * 2</code> builds one list <code>[0, 0]</code>.",
      "<code>[ that_list ] * 3</code> builds an outer list holding <b>three references to that one list</b>.",
      "<code>m[0][0] = 7</code> mutates the single inner list.",
      "All three rows are the same object, so all three show <code>7</code>."
    ],
    mistakes: ["Answering <code>[[7, 0], [0, 0], [0, 0]]</code>, as if <code>*</code> copied the rows.", "Forgetting the spaces after commas in the printed output."],
    tries: [
      { change: "Replace line 1 with <code>m = [[0] * 2 for _ in range(3)]</code>", expect: "<code>[[7, 0], [0, 0], [0, 0]]</code>, because a new row is built each iteration." },
      { change: "Add <code>print(m[0] is m[2])</code>", expect: "<code>True</code> with the original code, <code>False</code> with the comprehension." },
      { change: "Replace <code>m[0][0] = 7</code> with <code>m[0] = [7, 7]</code>", expect: "Only row 0 changes. Rebinding a slot doesn't touch the shared list." }
    ]
  },
  {
    id: "A2", part: "A", points: 4, title: "List inside a tuple",
    prompt: "Predict the output.",
    code: `t = ([1], 2)
u = t[0]
u.append(5)
print(t)`,
    output: `([1, 5], 2)`,
    idea: "A tuple is immutable, but the objects it <em>holds</em> may be mutable. <code>u</code> and <code>t[0]</code> are the same list.",
    steps: [
      "<code>t</code> holds a reference to a list <code>[1]</code> and the int <code>2</code>.",
      "<code>u = t[0]</code> ties a second name to that same list. Nothing is copied.",
      "<code>u.append(5)</code> mutates the list in place.",
      "The tuple still points to the same list, which now contains <code>[1, 5]</code>."
    ],
    mistakes: ["Thinking tuples \"freeze\" their contents.", "Expecting a <code>TypeError</code>. No item of the tuple is reassigned."],
    tries: [
      { change: "Replace line 3 with <code>u = u + [5]</code>", expect: "<code>([1], 2)</code>. <code>+</code> builds a new list and rebinds <code>u</code> only." },
      { change: "Replace line 3 with <code>t[0] = [9]</code>", expect: "<code>TypeError: 'tuple' object does not support item assignment</code>" },
      { change: "Add <code>print(u is t[0])</code>", expect: "<code>True</code>" }
    ]
  },
  {
    id: "A3", part: "A", points: 4, title: "Adding equal values to a set",
    prompt: "Predict the output.",
    code: `s = {1, 2}
s.add(2)
s.add(2.0)
s.add(True)
print(s, len(s))`,
    output: `{1, 2} 2`,
    idea: "Sets decide duplicates by <b>hash, then ==</b>. <code>2 == 2.0</code> and <code>True == 1</code> (bool is a subclass of int), and they hash the same. The element inserted <b>first</b> stays.",
    steps: [
      "<code>s.add(2)</code>: 2 is already present, so nothing changes.",
      "<code>s.add(2.0)</code>: <code>2.0 == 2</code> with the same hash, so it's a duplicate and is ignored.",
      "<code>s.add(True)</code>: <code>True == 1</code> with the same hash, so it's a duplicate and is ignored.",
      "The set still holds the original <code>1</code> and <code>2</code>, and its length is 2."
    ],
    mistakes: ["Printing <code>{1, 2, 2.0, True}</code>.", "Printing <code>{True, 2.0}</code>. The <em>first</em> inserted element is kept, not replaced."],
    tries: [
      { change: "Start with <code>s = set()</code> and add <code>True</code> first, then <code>1</code>", expect: "<code>{True} 1</code>. The first element wins." },
      { change: "Add <code>s.add(\"1\")</code>", expect: "Length 3. Strings never equal numbers." },
      { change: "Add <code>print(hash(True), hash(1), hash(1.0))</code>", expect: "<code>1 1 1</code>" }
    ]
  },
  {
    id: "A4", part: "A", points: 4, title: "Iterating a dict",
    prompt: "Predict the output.",
    code: `d = {"a": 1, "b": 2}
print([k for k in d])
print([v for v in d.values()])
print(list(d.items()))`,
    output: `['a', 'b']
[1, 2]
[('a', 1), ('b', 2)]`,
    idea: "Iterating a dict yields its <b>keys</b> in insertion order. <code>.values()</code> yields values, and <code>.items()</code> yields <code>(key, value)</code> tuples.",
    steps: [
      "<code>for k in d</code> loops over keys: <code>'a'</code>, <code>'b'</code>.",
      "<code>d.values()</code> gives <code>1</code>, <code>2</code>.",
      "<code>d.items()</code> gives tuples. <code>list()</code> turns them into a list of tuples.",
      "Three <code>print</code> calls produce three lines. Strings print in single quotes inside containers."
    ],
    mistakes: ["Writing <code>[\"a\", \"b\"]</code> with double quotes. Python prints single quotes.", "Thinking dict iteration yields pairs."],
    tries: [
      { change: "Add <code>d[\"c\"] = 3</code> after line 1", expect: "Key <code>'c'</code> appears last. Insertion order is kept." },
      { change: "Add <code>print(d.items())</code>", expect: "<code>dict_items([('a', 1), ('b', 2)])</code>, a view rather than a list." }
    ]
  },
  {
    id: "A5", part: "A", points: 4, title: "Filters and set comprehensions",
    prompt: "Predict the output.",
    code: `ns = [1, -2, 3, -4]
print([n for n in ns if n > 0])
print({abs(n) for n in ns})
print(len({abs(n) for n in ns}))`,
    output: `[1, 3]
{1, 2, 3, 4}
4`,
    idea: "A list comprehension with <code>if</code> filters. A set comprehension <code>{...}</code> removes duplicates (order may vary).",
    steps: [
      "The filter keeps the positives: <code>[1, 3]</code>.",
      "<code>abs</code> of each value: 1, 2, 3, 4, all distinct.",
      "The set has 4 elements."
    ],
    mistakes: ["Confusing <code>{...}</code> comprehension with a dict.", "Worrying about set order. Any order is accepted."],
    tries: [
      { change: "Change <code>ns</code> to <code>[1, -1, 3, -3]</code>", expect: "Set <code>{1, 3}</code>, length 2. Duplicates collapse." },
      { change: "Replace <code>{abs(n) ...}</code> with <code>[abs(n) ...]</code>", expect: "<code>[1, 2, 3, 4]</code>. A list keeps order and duplicates." }
    ]
  },
  {
    id: "A6", part: "A", points: 4, title: "Dict comprehension with ord",
    prompt: "Predict the output.",
    code: `print({c: ord(c) - 96 for c in "cab"})`,
    output: `{'c': 3, 'a': 1, 'b': 2}`,
    idea: "A dict comprehension builds keys in loop order. <code>ord('a')</code> is 97, so <code>ord(c) - 96</code> is the letter's position in the alphabet.",
    steps: [
      "Loop over <code>\"cab\"</code>: c, a, b.",
      "c → 99 − 96 = 3, a → 1, b → 2.",
      "Dicts keep insertion order, so <code>'c'</code> comes first."
    ],
    mistakes: ["Sorting the keys alphabetically.", "Using 97 instead of 96 (off by one)."],
    tries: [
      { change: "Use <code>\"abca\"</code>", expect: "<code>{'a': 1, 'b': 2, 'c': 3}</code>. The repeated key just overwrites." },
      { change: "Use <code>ord(c) - 97</code>", expect: "Zero-based positions." }
    ]
  },
  {
    id: "A7", part: "A", points: 4, title: "map is a one-shot iterator",
    prompt: "Predict the output.",
    code: `m = map(str, [1, 2])
print(list(m), list(m))`,
    output: `['1', '2'] []`,
    idea: "<code>map</code> and <code>filter</code> return <b>lazy iterators</b> that can be consumed <b>once</b>.",
    steps: [
      "<code>map</code> doesn't compute anything yet.",
      "The first <code>list(m)</code> pulls every value: <code>['1', '2']</code>.",
      "The iterator is now exhausted, so the second <code>list(m)</code> is <code>[]</code>."
    ],
    mistakes: ["Printing the list twice.", "Writing <code>[1, 2]</code>. <code>str</code> turned them into strings."],
    tries: [
      { change: "Replace line 1 with <code>m = list(map(str, [1, 2]))</code>", expect: "<code>['1', '2'] ['1', '2']</code>. A list can be reused." },
      { change: "Add <code>print(m)</code> before line 2", expect: "<code>&lt;map object at 0x…&gt;</code>" }
    ]
  },
  {
    id: "A8", part: "A", points: 4, title: "reduce",
    prompt: "Predict the output.",
    code: `from functools import reduce

print(reduce(lambda a, b: a if a > b else b, [3, 9, 2]))
print(reduce(lambda a, b: a + b, ["x", "y", "z"]))`,
    output: `9
xyz`,
    idea: "<code>reduce(f, xs)</code> folds left: <code>f(f(x0, x1), x2)</code>.",
    steps: [
      "f(3, 9) → 9, then f(9, 2) → 9. That's the maximum.",
      "\"x\" + \"y\" → \"xy\", then \"xy\" + \"z\" → \"xyz\".",
      "<code>print</code> of a string shows no quotes."
    ],
    mistakes: ["Printing <code>'xyz'</code> with quotes.", "Folding right-to-left."],
    tries: [
      { change: "Try <code>reduce(lambda a, b: a - b, [10, 3, 2])</code>", expect: "<code>5</code>, which is (10−3)−2." },
      { change: "Try <code>reduce(lambda a, b: a + b, [])</code>", expect: "<code>TypeError</code>: an empty sequence with no initial value." },
      { change: "Try <code>reduce(lambda a, b: a + b, [], 0)</code>", expect: "<code>0</code>" }
    ]
  },
  {
    id: "A9", part: "A", points: 4, title: "Mutable default argument",
    prompt: "Predict the output.",
    code: `def add(v, bag={}):
    bag[v] = True
    return len(bag)

print(add("a"))
print(add("b"))
print(add("a"))`,
    output: `1
2
2`,
    idea: "Default values are evaluated <b>once</b>, when <code>def</code> runs, and shared by every call (they're stored in <code>add.__defaults__</code>).",
    steps: [
      "Call 1: bag = {a} → 1.",
      "Call 2: the <em>same</em> bag = {a, b} → 2.",
      "Call 3: \"a\" is already a key → still 2."
    ],
    mistakes: ["Answering 1, 1, 1 (assuming a fresh dict per call).", "Answering 3 on the last call (keys are unique)."],
    tries: [
      { change: "Add <code>print(add.__defaults__)</code> at the end", expect: "<code>({'a': True, 'b': True},)</code>, the shared dict." },
      { change: "Fix it: <code>def add(v, bag=None):</code> then <code>bag = {} if bag is None else bag</code>", expect: "1, 1, 1" }
    ]
  },
  {
    id: "A10", part: "A", points: 4, title: "Class attribute shared by instances",
    prompt: "Predict the output.",
    code: `class Log:
    lines = []
    def __init__(self, name):
        self.name = name
    def write(self, s):
        self.lines.append(s)

a = Log("a"); b = Log("b")
a.write("one"); b.write("two")
print(len(a.lines), len(b.lines), a.lines is b.lines)`,
    output: `2 2 True`,
    idea: "<code>lines = []</code> in the class body is a <b>class attribute</b>: one list shared by all instances. <code>self.lines.append</code> finds it through the class and mutates it.",
    steps: [
      "Neither instance has its own <code>lines</code>, so the lookup falls through to <code>Log.lines</code>.",
      "Both writes append to that single list: <code>['one', 'two']</code>.",
      "Both lengths are 2, and <code>is</code> is True."
    ],
    mistakes: ["Answering <code>1 1 False</code>.", "Thinking <code>self.</code> automatically means per-instance."],
    tries: [
      { change: "Move <code>self.lines = []</code> into <code>__init__</code>", expect: "<code>1 1 False</code>" },
      { change: "In <code>write</code>, use <code>self.lines = self.lines + [s]</code>", expect: "<code>1 1 False</code>. Assignment creates an instance attribute that shadows the class one." }
    ]
  },
  {
    id: "B1", part: "B", points: 12, title: "Why old[:] isn't enough",
    prompt: "You have a list of lists and want a copy you can modify without affecting the original. Explain why <code>new = old[:]</code> is not sufficient, and describe what would be. (2–4 sentences)",
    code: `old = [[1, 2], [3, 4]]
new = old[:]
print("Original code (above) is the setup; see the demo below.")`,
    play: `import copy

old = [[1, 2], [3, 4]]

shallow = old[:]
shallow[0][0] = 99        # inner list is shared
shallow.append([5, 6])    # outer list is new
print("old after shallow edit:", old)

old = [[1, 2], [3, 4]]
deep = copy.deepcopy(old)
deep[0][0] = 99
print("old after deep edit:   ", old)

old = [[1, 2], [3, 4]]
rows = [row[:] for row in old]
rows[0][0] = 99
print("old after row copy:    ", old)`,
    output: `old after shallow edit: [[99, 2], [3, 4]]
old after deep edit:    [[1, 2], [3, 4]]
old after row copy:     [[1, 2], [3, 4]]`,
    idea: "Shallow vs deep copy. A slice copies only the outer list. The inner lists are shared references.",
    model: "<code>old[:]</code> makes a <b>shallow copy</b>: a new outer list whose elements are the <b>same inner list objects</b> as in <code>old</code>. So <code>new[0][0] = 99</code> also changes <code>old</code>; only outer-level changes such as <code>new.append(...)</code> stay separate. To get an independent copy, copy every level: <code>copy.deepcopy(old)</code>, or <code>[row[:] for row in old]</code> for a list of flat lists.",
    steps: ["Use the word <b>shallow</b>.", "Say the inner lists are shared, with an example of the effect.", "Give a correct deep-copy method."],
    mistakes: ["Only saying \"it copies by reference\" without separating the outer and inner levels.", "Suggesting <code>old.copy()</code> or <code>list(old)</code>. They're also shallow."],
    tries: [
      { change: "Replace <code>old[:]</code> with <code>old.copy()</code> or <code>list(old)</code>", expect: "Same shallow behavior." },
      { change: "Make the data 3 levels deep, e.g. <code>[[[1]]]</code>, and try the row copy", expect: "<code>row[:]</code> isn't enough anymore. Only <code>deepcopy</code> copies every level." }
    ]
  },
  {
    id: "B2", part: "B", points: 12, title: "isinstance(True, int)",
    prompt: "<code>isinstance(True, int)</code> evaluates to <code>True</code>. Explain why, and describe a concrete way this can produce a wrong result in a function that inspects the type of a label. (2–4 sentences)",
    code: `print(isinstance(True, int))`,
    play: `print(isinstance(True, int))      # True
print(issubclass(bool, int))       # True
print(True == 1, True + True)      # True 2

def kind_buggy(label):
    if isinstance(label, int):
        return "int"
    elif isinstance(label, bool):
        return "bool"              # unreachable for bools!
    return type(label).__name__

def kind_fixed(label):
    if isinstance(label, bool):    # test bool FIRST
        return "bool"
    elif isinstance(label, int):
        return "int"
    return type(label).__name__

labels = [1, True, 0, False, 1.0, "1"]
print([kind_buggy(x) for x in labels])
print([kind_fixed(x) for x in labels])`,
    output: `True
True
True 2
['int', 'int', 'int', 'int', 'float', 'str']
['int', 'bool', 'int', 'bool', 'float', 'str']`,
    idea: "<code>bool</code> is a subclass of <code>int</code>, so every bool passes an int check.",
    model: "In Python <code>bool</code> is a <b>subclass of <code>int</code></b>: <code>True</code> behaves as 1 and <code>False</code> as 0, so <code>isinstance(True, int)</code> is True. A function that classifies labels with <code>if isinstance(label, int): ... elif isinstance(label, bool): ...</code> reports every boolean label as an int (the bool branch is unreachable), so it can't count how many labels arrived as booleans. Fix: check <code>bool</code> before <code>int</code>, or compare <code>type(label) is int</code>.",
    steps: ["Explain that bool is a subclass of int.", "Give a <b>concrete</b> buggy function or scenario.", "Give the fix."],
    mistakes: ["Only restating \"True is 1\" without a concrete wrong result.", "Suggesting <code>isinstance(label, bool)</code> placed <em>after</em> the int check."],
    tries: [
      { change: "Replace the checks with <code>type(label) is int</code>", expect: "Bools are no longer classified as int." },
      { change: "Add <code>print(sum([True, True, False]))</code>", expect: "<code>2</code>. Bools act as numbers." }
    ]
  },
  {
    id: "C1", part: "C", points: 21, title: "census merges labels",
    prompt: "State the output the buggy code produces (6 pts), explain the cause in one or two sentences (7 pts), and write a corrected version (8 pts).",
    code: `def census(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return counts

print(census([1, True, 1.0, 0, False, "1"]))`,
    fixed: `def census(labels):
    counts = {}
    for label in labels:
        key = (label, type(label).__name__)   # type is part of the key
        counts[key] = counts.get(key, 0) + 1
    return counts

print(census([1, True, 1.0, 0, False, "1"]))`,
    output: `{1: 3, 0: 2, '1': 1}`,
    fixedOutput: `{(1, 'int'): 1, (True, 'bool'): 1, (1.0, 'float'): 1, (0, 'int'): 1, (False, 'bool'): 1, ('1', 'str'): 1}`,
    idea: "Dict keys are matched by hash and ==. <code>1</code>, <code>True</code> and <code>1.0</code> collapse into one key, and so do <code>0</code> and <code>False</code>. The first key object is kept.",
    model: "<b>Output:</b> <code>{1: 3, 0: 2, '1': 1}</code><br><b>Cause:</b> <code>1</code>, <code>True</code> and <code>1.0</code> are equal and have equal hashes, so the dict treats them as a single key (keeping the first, <code>1</code>). <code>0</code> and <code>False</code> merge the same way, and only the string <code>\"1\"</code> stays separate.<br><b>Fix:</b> make the type part of the key, <code>(label, type(label).__name__)</code>. See the Fixed version.",
    steps: ["Give the exact dict.", "Name the mechanism: equal <b>and same hash</b> means the same key.", "Write a fix that truly separates the types."],
    mistakes: ["Fixing with <code>str(label)</code>. That merges <code>1</code> with <code>\"1\"</code>.", "Giving the key as <code>True</code> or <code>1.0</code>. The first key inserted stays."],
    tries: [
      { change: "Reorder the input to <code>[True, 1, 1.0]</code> (buggy)", expect: "<code>{True: 3}</code>. The first key object wins." },
      { change: "Use <code>type(label)</code> instead of <code>type(label).__name__</code>", expect: "This works too, but the printed keys are uglier." }
    ]
  },
  {
    id: "D1", part: "D", points: 15, title: "Comprehension, reduce, map + filter",
    prompt: "Given <code>ROWS</code>, write one expression for each: (a) a list comprehension producing the names in order; (b) a call to <code>reduce</code> returning the total of all scores; (c) an expression using <code>map</code> and <code>filter</code> producing the upper-cased names of everyone scoring at least 90. State the result.",
    code: `ROWS = [
    ("ann", 90),
    ("bob", 72),
    ("cy", 90),
    ("di", 55),
]`,
    play: `from functools import reduce

ROWS = [
    ("ann", 90),
    ("bob", 72),
    ("cy", 90),
    ("di", 55),
]

# (a)
print([name for name, score in ROWS])
# (b)  initial value 0 is required
print(reduce(lambda acc, r: acc + r[1], ROWS, 0))
# (c)
print(list(map(lambda r: r[0].upper(), filter(lambda r: r[1] >= 90, ROWS))))`,
    output: `['ann', 'bob', 'cy', 'di']
307
['ANN', 'CY']`,
    idea: "Tuple unpacking in comprehensions, fold with an initial value, and lazy <code>map</code>/<code>filter</code> wrapped in <code>list()</code>.",
    model: "(a) <code>[name for name, score in ROWS]</code><br>(b) <code>reduce(lambda acc, r: acc + r[1], ROWS, 0)</code> → 307<br>(c) <code>list(map(lambda r: r[0].upper(), filter(lambda r: r[1] &gt;= 90, ROWS)))</code> → <code>['ANN', 'CY']</code>",
    steps: ["In (b) the initial <code>0</code> matters. Without it the first <code>acc</code> is a tuple, and tuple + int raises TypeError.", "In (c), filter first, then map, and wrap in <code>list()</code>.", "<code>&gt;= 90</code> includes cy. State the result, because the question asks for it."],
    mistakes: ["Omitting the initial value in reduce.", "Using <code>&gt; 90</code>.", "Forgetting <code>list()</code>."],
    tries: [
      { change: "Remove the <code>, 0</code> from reduce", expect: "<code>TypeError: can only concatenate tuple (not \"int\") to tuple</code>" },
      { change: "Swap the order: map first, then filter on the names", expect: "Harder. You lose the score, so build the pairs differently." }
    ]
  },
  {
    id: "D2", part: "D", points: 20, title: "Class with value equality",
    prompt: "Write <code>__eq__</code> (equal only if coords equal, labels equal, and labels have the same type; return <code>NotImplemented</code> for non-LabeledPoints) and a consistent <code>__hash__</code>. Then state <code>len({LabeledPoint((1.0,), 1), LabeledPoint((1.0,), True)})</code> and <code>len({((1.0,), 1), ((1.0,), True)})</code>, and explain the difference in one sentence.",
    code: `class LabeledPoint:
    def __init__(self, coords, label):
        self.coords = tuple(coords)
        self.label = label`,
    play: `class LabeledPoint:
    def __init__(self, coords, label):
        self.coords = tuple(coords)
        self.label = label

    def __eq__(self, other):
        if not isinstance(other, LabeledPoint):
            return NotImplemented
        return (self.coords == other.coords
                and self.label == other.label
                and type(self.label) is type(other.label))

    def __hash__(self):
        return hash((self.coords, self.label, type(self.label).__name__))

    def __repr__(self):
        return f"LabeledPoint({self.coords}, {self.label!r})"

print(len({LabeledPoint((1.0,), 1), LabeledPoint((1.0,), True)}))
print(len({((1.0,), 1), ((1.0,), True)}))
print(LabeledPoint([1.0], 1) == LabeledPoint((1.0,), 1))
print(LabeledPoint((1.0,), 1) == "not a point")`,
    output: `2
1
True
False`,
    idea: "Equal objects must have equal hashes, so hash exactly the fields you compare. Defining <code>__eq__</code> without <code>__hash__</code> makes the class unhashable.",
    model: "See the playground code. <b>(c)</b> With LabeledPoint: <b>2</b>. With plain tuples: <b>1</b>. Plain tuples compare element by element and <code>1 == True</code> with the same hash, so the set sees a duplicate; our <code>__eq__</code> also requires the same label type, and the hash includes the type name, so the two points stay distinct.",
    steps: ["Include the <code>NotImplemented</code> branch for foreign types.", "Check all three conditions. Use <code>type(a) is type(b)</code>, not isinstance (bool would pass an int check).", "Hash a tuple of the same fields, including the type."],
    mistakes: ["Forgetting <code>__hash__</code>, which gives <code>TypeError: unhashable type</code>.", "Hashing fields that differ from the ones compared.", "Returning <code>False</code> instead of <code>NotImplemented</code>."],
    tries: [
      { change: "Delete the <code>__hash__</code> method", expect: "<code>TypeError</code> mentioning <code>unhashable type: 'LabeledPoint'</code> (exact wording varies by Python version)" },
      { change: "Delete <code>__eq__</code> and <code>__hash__</code>", expect: "Identity equality: the set length is 2, and <code>==</code> gives False." },
      { change: "Remove the type check from <code>__eq__</code> and the type name from the hash", expect: "The first set's length becomes 1, same as the tuples." }
    ]
  }
];

window.CONCEPTS = [
  ["Names & objects", "<code>b = a</code> shares one object. Mutating (<code>.append</code>, <code>x[i]=</code>) is visible to everyone holding it. Rebinding (<code>x = ...</code>) affects only that name. <code>==</code> compares value; <code>is</code> checks identity."],
  ["Set/dict merging", "<code>1 == 1.0 == True</code> and <code>0 == 0.0 == False</code>, with equal hashes, so they count as the same key. In a set the first element stays. In a dict the first key stays and the last value wins. <code>\"1\" != 1</code>."],
  ["Copying", "<code>[[0]*n]*m</code> holds m references to one row; fix it with <code>[[0]*n for _ in range(m)]</code>. <code>a[:]</code> and <code>.copy()</code> are shallow. Use <code>copy.deepcopy</code> for a deep copy."],
  ["Tuples", "A tuple is immutable, but a list inside it can still change. <code>(1,)</code> is a tuple; <code>(1)</code> is an int."],
  ["Mutable defaults", "<code>def f(x, acc=[])</code> creates one list for all calls, stored in <code>f.__defaults__</code>. Fix: <code>acc=None</code>, then create the list inside."],
  ["Class vs instance", "<code>class C: xs = []</code> is shared by all instances. <code>self.xs.append</code> shares it. <code>self.xs = ...</code> or <code>+=</code> on an int creates an instance attribute that shadows it."],
  ["__eq__ / __hash__", "With no <code>__eq__</code>, <code>==</code> is identity. Defining <code>__eq__</code> alone sets <code>__hash__ = None</code>, making the class unhashable. Hash the same fields you compare. Return <code>NotImplemented</code> for foreign types."],
  ["bool ⊂ int", "<code>isinstance(True, int)</code> is True. Test <code>bool</code> first, or compare with <code>type(x) is int</code>."],
  ["Comprehensions", "<code>[...]</code> list, <code>{...}</code> set, <code>{k: v ...}</code> dict. In a nested comprehension, the first <code>for</code> is the outer loop. Iterating a dict gives its keys in insertion order."],
  ["map / filter / reduce", "<code>map</code> and <code>filter</code> are lazy and can be used once; wrap them in <code>list()</code>. <code>reduce(f, xs, init)</code> folds left. On an empty list with no init it raises TypeError."],
  ["Scope", "A name assigned anywhere in a function is local throughout it, which can cause <code>UnboundLocalError</code>. Closures read variables at call time, so <code>[lambda: i ...]</code> all return the last i. Fix with <code>lambda i=i: i</code>."]
];
