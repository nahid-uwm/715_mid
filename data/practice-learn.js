// Deep-learning notes per question. Each entry has:
// tested, key, behavior (a trace), lookFor[], tips[], moreMistakes[],
// variants[{q, code, answer}] (similar exam-style questions; each one runs in the playground).
window.LEARN = {
  A1: {
    tested: "Whether you know that <code>*</code> on a list copies <b>references</b>, not objects, and can follow one mutation through several aliases.",
    key: "<code>[obj] * n</code> → n arrows pointing to the <b>same</b> obj. That's harmless for numbers and strings (immutable) and dangerous for lists, dicts and sets (mutable).",
    behavior: `[0] * 2          -> creates ONE list L = [0, 0]
[L] * 3          -> outer = [L, L, L]   (3 arrows, 1 object)
m[0][0] = 7      -> L becomes [7, 0]
print(m)         -> [L, L, L] = [[7, 0], [7, 0], [7, 0]]`,
    lookFor: ["A <b>mutable</b> thing (<code>[]</code>, <code>[0]*k</code>, <code>{}</code>) multiplied with <code>*</code>.", "An <b>index-assign into the inner level</b> (<code>m[i][j] = …</code> or <code>m[i].append</code>). That mutates the shared object.", "Compare with <code>m[i] = …</code>, which <b>rebinds one slot</b> and breaks the alias for that row only."],
    tips: ["Draw it: one box for the inner list, three arrows to it.", "Ask: <i>“How many inner list objects were created?”</i> With <code>*</code> it's always <b>one</b>. With a comprehension it's one per iteration.", "The outer <code>* 3</code> on the inner <code>[0]*2</code> is fine, because the 0s are ints."],
    moreMistakes: ["Thinking <code>[[0]*2]*3</code> and <code>[[0]*2 for _ in range(3)]</code> are the same.", "After <code>m[1] = [5, 5]</code>, thinking all rows change. Only row 1 changes, and rows 0 and 2 stay shared."],
    variants: [
      { q: "Append to one row of a repeated empty list.", code: `g = [[]] * 3
g[0].append(1)
print(g)`, answer: `[[1], [1], [1]]` },
      { q: "Rebind one row, then mutate another.", code: `m = [[0] * 2] * 3
m[1] = [5, 5]
m[0][0] = 7
print(m)`, answer: `[[7, 0], [5, 5], [7, 0]]` },
      { q: "Comprehension version: independent rows.", code: `m = [[0] * 2 for _ in range(3)]
m[0][0] = 7
print(m, m[0] is m[1])`, answer: `[[7, 0], [0, 0], [0, 0]] False` },
      { q: "Dicts repeated with *.", code: `ds = [{}] * 2
ds[0]["k"] = 1
print(ds)`, answer: `[{'k': 1}, {'k': 1}]` }
    ]
  },
  A2: {
    tested: "Immutability of a tuple vs mutability of the objects inside it, and aliasing through <code>u = t[0]</code>.",
    key: "A tuple fixes <b>which objects</b> it holds, not <b>what those objects contain</b>. Assignment (<code>u = t[0]</code>) never copies.",
    behavior: `t = (L, 2)      where L = [1]
u = t[0]        -> u is L        (alias)
u.append(5)     -> L = [1, 5]   (mutation)
print(t)        -> ([1, 5], 2)`,
    lookFor: ["A tuple containing a list, dict or set.", "A name bound to an element (<code>u = t[0]</code>) and then <b>mutated</b> (<code>.append</code>, <code>+=</code>, <code>[i] =</code>).", "Is it <b>rebinding</b> (<code>u = u + [5]</code>, so the tuple is unchanged) or <b>mutating</b> (<code>u.append</code>, so the tuple shows it)?"],
    tips: ["Tuple errors happen only on <code>t[i] = …</code>. Methods called on the inner object never raise.", "Tricky one: <code>t[0] += [5]</code> extends the list <b>and then</b> raises TypeError. The list is changed anyway!"],
    moreMistakes: ["Saying <code>TypeError</code> for <code>u.append</code>.", "Thinking tuples are hashable even when they contain a list. <code>hash(([1], 2))</code> raises TypeError."],
    variants: [
      { q: "Rebind instead of mutate.", code: `t = ([1], 2)
u = t[0]
u = u + [5]
print(t, u)`, answer: `([1], 2) [1, 5]` },
      { q: "+= on a list inside a tuple (famous trick).", code: `t = ([1], 2)
try:
    t[0] += [5]
except TypeError as e:
    print("TypeError")
print(t)`, answer: `TypeError
([1, 5], 2)` },
      { q: "Can a tuple holding a list be a set element?", code: `try:
    s = {([1], 2)}
except TypeError:
    print("unhashable")`, answer: `unhashable` }
    ]
  },
  A3: {
    tested: "How sets decide duplicates (<b>hash, then ==</b>), that <code>bool</code> is a subclass of <code>int</code>, and which element is kept.",
    key: "<code>1 == 1.0 == True</code> and <code>0 == 0.0 == False</code> share a hash, so they're the <b>same element</b>. The set keeps the <b>first one inserted</b>. Strings never equal numbers.",
    behavior: `s = {1, 2}
add(2)    -> 2 already in        -> {1, 2}
add(2.0)  -> 2.0 == 2, same hash -> ignored
add(True) -> True == 1, same hash -> ignored
print(s, len(s)) -> {1, 2} 2`,
    lookFor: ["Mixed <code>1 / 1.0 / True</code> or <code>0 / 0.0 / False</code> in a set, dict keys or <code>in</code> tests.", "Which one appears <b>first</b>? That's the one printed.", "Strings like <code>\"1\"</code> or <code>\"\"</code>. They stay separate."],
    tips: ["Mnemonic: <b>“triplets”</b>. <code>1/1.0/True</code> are triplets and so are <code>0/0.0/False</code>. In a set, the first triplet to arrive takes the seat.", "<code>len</code> = number of distinct <b>values</b>, not distinct types.", "<code>True in {1}</code> is <code>True</code>."],
    moreMistakes: ["Printing <code>{1, 2, True}</code>.", "Thinking <code>add</code> replaces the stored element. It doesn't.", "Thinking <code>None</code> or <code>\"\"</code> equals <code>0</code>. They don't."],
    variants: [
      { q: "Set literal with mixed equal values.", code: `print({True, 1, 1.0, 0, False, "0"})`, answer: `{0, True, '0'}` },
      { q: "Length of a messy label set.", code: `labels = {1, 1.0, True, 2, "2", 0, False}
print(len(labels))`, answer: `4` },
      { q: "Membership with equal values.", code: `print(True in {1, 2}, 2.0 in {2}, "1" in {1})`, answer: `True True False` },
      { q: "Tuples merge too (element-wise equality).", code: `print(len({((1.0, 2.0), 1), ((1.0, 2.0), True)}))`, answer: `1` }
    ]
  },
  A4: {
    tested: "What iterating a dict yields, insertion order, and the exact print format of lists of strings and tuples.",
    key: "<code>for x in d</code> → <b>keys</b>. <code>.values()</code> → values. <code>.items()</code> → <code>(k, v)</code> tuples. Order = <b>insertion order</b>.",
    behavior: `for k in d          -> 'a', 'b'
d.values()          -> 1, 2
list(d.items())     -> [('a', 1), ('b', 2)]`,
    lookFor: ["<code>for … in d</code> without a method gives keys.", "Is the result wrapped in <code>list()</code>? Without it you get <code>dict_items([...])</code>.", "Overwriting a key keeps its <b>original position</b>."],
    tips: ["Formatting: strings inside containers use <b>single quotes</b>, with a space after each comma and after each colon.", "<code>del d[k]</code> and then re-adding the key moves it to the end."],
    moreMistakes: ["Using double quotes.", "Writing <code>[(a, 1), (b, 2)]</code> without quotes.", "Assuming the keys come out sorted."],
    variants: [
      { q: "Overwriting keeps position; new key goes last.", code: `d = {"b": 1, "a": 2}
d["b"] = 9
d["c"] = 0
print(list(d), list(d.values()))`, answer: `['b', 'a', 'c'] [9, 2, 0]` },
      { q: "Unpacking items in a comprehension.", code: `d = {"x": 1, "y": 2}
print([k * v for k, v in d.items()])`, answer: `['x', 'yy']` },
      { q: "Printing views without list().", code: `d = {"a": 1}
print(d.keys(), d.items())`, answer: `dict_keys(['a']) dict_items([('a', 1)])` }
    ]
  },
  A5: {
    tested: "List comprehension with a filter, set comprehension removing duplicates, and set length.",
    key: "<code>[…]</code> keeps order and duplicates. <code>{…}</code> without a colon is a <b>set</b>, which drops duplicates. The <code>if</code> filters items <b>before</b> the expression is applied.",
    behavior: `[n for n in ns if n > 0]  -> 1, 3 kept       -> [1, 3]
{abs(n) for n in ns}       -> 1, 2, 3, 4     -> {1, 2, 3, 4}
len(...)                   -> 4`,
    lookFor: ["Curly braces: with <code>k: v</code> it's a dict, without a colon it's a set.", "A transformation that makes values collide (<code>abs</code>, <code>% n</code>, <code>len</code>, <code>.lower()</code>). Duplicates vanish in a set.", "Where the <code>if</code> is. <code>x if c else y</code> <i>before</i> <code>for</code> is a conditional expression, not a filter."],
    tips: ["Sets print in any order on the exam (accepted), but small ints usually come out sorted.", "<code>{}</code> alone is an empty <b>dict</b>. An empty set is <code>set()</code>."],
    moreMistakes: ["Confusing <code>[x if x > 0 else 0 for x in ns]</code> (same length) with <code>[x for x in ns if x > 0]</code> (filtered)."],
    variants: [
      { q: "Collisions after a transformation.", code: `ns = [1, -1, 2, -2, 3]
print({abs(n) for n in ns}, len({n % 2 for n in ns}))`, answer: `{1, 2, 3} 2` },
      { q: "Conditional expression vs filter.", code: `ns = [1, -2, 3]
print([n if n > 0 else 0 for n in ns], [n for n in ns if n > 0])`, answer: `[1, 0, 3] [1, 3]` },
      { q: "Empty braces.", code: `print(type({}).__name__, type(set()).__name__)`, answer: `dict set` }
    ]
  },
  A6: {
    tested: "Dict comprehension, character codes, and insertion order following the loop.",
    key: "Keys appear in the <b>order the loop produces them</b>. A repeated key overwrites its value but keeps its first position.",
    behavior: `"cab" -> c, a, b
ord('c') - 96 = 3, ord('a') - 96 = 1, ord('b') - 96 = 2
{'c': 3, 'a': 1, 'b': 2}`,
    lookFor: ["What the loop iterates (a string iterates characters).", "Duplicate keys during the loop: the last value wins.", "<code>ord</code>/<code>chr</code> arithmetic: <code>ord('a') = 97</code>, <code>ord('A') = 65</code>, <code>ord('0') = 48</code>."],
    tips: ["Remember 97 for 'a'. Then <code>ord(c) - 96</code> gives 1-based positions.", "<code>chr(ord('a') + 2)</code> is <code>'c'</code>."],
    moreMistakes: ["Sorting the keys.", "Off by one (97 vs 96)."],
    variants: [
      { q: "Repeated key in a dict comprehension.", code: `print({c: i for i, c in enumerate("abca")})`, answer: `{'a': 3, 'b': 1, 'c': 2}` },
      { q: "zip into a dict.", code: `print(dict(zip("ab", [1, 2, 3])))`, answer: `{'a': 1, 'b': 2}` },
      { q: "Swap keys and values (collision!).", code: `d = {"x": 1, "y": 1, "z": 2}
print({v: k for k, v in d.items()})`, answer: `{1: 'y', 2: 'z'}` }
    ]
  },
  A7: {
    tested: "That <code>map</code> (and <code>filter</code>) are <b>lazy, single-use iterators</b>.",
    key: "An iterator is a <b>one-way stream</b>. Once something consumes it (<code>list</code>, <code>for</code>, <code>sum</code>, <code>in</code>, <code>max</code>…), it's empty.",
    behavior: `m = map(str, [1, 2])  -> nothing computed yet
list(m)  -> pulls '1', '2' -> ['1', '2']   (m now exhausted)
list(m)  -> []`,
    lookFor: ["A <code>map</code>/<code>filter</code>/<code>zip</code> object stored in a variable and <b>used twice</b>.", "Hidden consumers: <code>sum(m)</code>, <code>len(list(m))</code>, <code>x in m</code> (partial!), a <code>for</code> loop.", "Printing the object directly shows <code>&lt;map object at …&gt;</code>."],
    tips: ["Want to reuse it? Store <code>list(map(...))</code>.", "<code>x in iterator</code> consumes items <b>up to and including</b> the match."],
    moreMistakes: ["Expecting <code>['1', '2'] ['1', '2']</code>.", "Writing <code>[1, 2]</code>. The ints were converted to strings."],
    variants: [
      { q: "filter consumed by sum.", code: `f = filter(lambda x: x % 2, [1, 2, 3])
print(sum(f), list(f))`, answer: `4 []` },
      { q: "Partial consumption by 'in'.", code: `m = map(lambda x: x * 10, [1, 2, 3])
print(20 in m, list(m))`, answer: `True [30]` },
      { q: "zip is also one-shot.", code: `z = zip("ab", [1, 2])
print(list(z), list(z))`, answer: `[('a', 1), ('b', 2)] []` }
    ]
  },
  A8: {
    tested: "Tracing <code>reduce</code> as a left fold, with and without an initial value.",
    key: "<code>reduce(f, [a, b, c])</code> = <code>f(f(a, b), c)</code>. With an initial value: <code>f(f(f(init, a), b), c)</code>. The <b>first argument is the accumulator</b>.",
    behavior: `max fold:  f(3, 9) = 9 ; f(9, 2) = 9          -> 9
concat:    "x" + "y" = "xy" ; "xy" + "z" = "xyz" -> xyz`,
    lookFor: ["Non-commutative operations (<code>-</code>, <code>/</code>, string concatenation, <code>a*10 + b</code>). Order matters.", "Is there a 3rd argument (the initial value)?", "Empty list with no initial value → <code>TypeError</code>."],
    tips: ["Write the trace as a table: acc | x | new acc.", "<code>print</code> of a string shows no quotes, but inside a list it does."],
    moreMistakes: ["Folding right-to-left: (10 − (3 − 2)) = 9 instead of 5.", "Writing <code>'xyz'</code> with quotes."],
    variants: [
      { q: "Subtraction fold.", code: `from functools import reduce
print(reduce(lambda a, b: a - b, [10, 3, 2]))`, answer: `5` },
      { q: "Digits to a number.", code: `from functools import reduce
print(reduce(lambda a, b: a * 10 + b, [1, 2, 3]))`, answer: `123` },
      { q: "Initial value and an empty list.", code: `from functools import reduce
print(reduce(lambda a, b: a + b, [], 0), reduce(lambda a, b: a * b, [2, 3], 10))`, answer: `0 60` },
      { q: "Building a list with reduce.", code: `from functools import reduce
print(reduce(lambda acc, x: acc + [x * 2], [1, 2, 3], []))`, answer: `[2, 4, 6]` }
    ]
  },
  A9: {
    tested: "That default argument values are created <b>once</b> at definition time and shared by all calls.",
    key: "<code>def f(x, acc=[])</code>: the <code>[]</code> is built when <code>def</code> runs and lives in <code>f.__defaults__</code>. Every call that omits <code>acc</code> uses the <b>same</b> object.",
    behavior: `def runs        -> bag = {} created once
add("a")        -> bag = {a}      -> 1
add("b")        -> bag = {a, b}   -> 2
add("a")        -> key exists     -> 2`,
    lookFor: ["A default that is <code>[]</code>, <code>{}</code> or <code>set()</code>, mutated inside the function.", "Several calls in a row, especially if the function <b>returns the default object itself</b> (then all results are the same object).", "A call that <b>passes</b> the argument explicitly. That call doesn't touch the default."],
    tips: ["Fix pattern: <code>acc=None</code> then <code>acc = [] if acc is None else acc</code>.", "If the function returns the list, earlier results “change” too, because they're the same object."],
    moreMistakes: ["Answering 1, 1, 1.", "Forgetting dict keys are unique (third call is 2, not 3).", "Thinking an explicit argument resets the default."],
    variants: [
      { q: "Returning the shared default.", code: `def tally(x, seen=[]):
    seen.append(x)
    return seen
r1 = tally(1)
r2 = tally(2)
print(r1, r2, r1 is r2)`, answer: `[1, 2] [1, 2] True` },
      { q: "An explicit argument skips the default.", code: `def f(x, acc=[]):
    acc.append(x)
    return len(acc)
print(f(1), f(2, []), f(3))`, answer: `1 1 2` },
      { q: "Inspect __defaults__.", code: `def f(x, acc=[]):
    acc.append(x)
f(1); f(2)
print(f.__defaults__)`, answer: `([1, 2],)` },
      { q: "The None fix.", code: `def f(x, acc=None):
    acc = [] if acc is None else acc
    acc.append(x)
    return acc
print(f(1), f(2))`, answer: `[1] [2]` }
    ]
  },
  A10: {
    tested: "Class attributes vs instance attributes, and the attribute lookup order (instance, then class).",
    key: "<b>Assign = shadow, mutate = share.</b> <code>self.lines.append</code> mutates the class's list, which all instances share. <code>self.x = …</code> creates a private instance attribute.",
    behavior: `Log.lines = []  (one list on the class)
a.write("one") -> a has no 'lines' -> finds Log.lines -> append
b.write("two") -> same Log.lines   -> append
a.lines is b.lines -> True ; both len 2`,
    lookFor: ["A mutable value in the <b>class body</b> (not in <code>__init__</code>).", "Whether methods <b>mutate</b> it (shared) or <b>assign</b> to <code>self.x</code> (shadow).", "<code>self.count += 1</code> on a class int creates an instance attribute. The class value stays the same.", "<code>ClassName.x += 1</code> explicitly changes the class attribute."],
    tips: ["Lookup: <code>obj.__dict__</code> first, then the class.", "Fix: initialize mutable state in <code>__init__</code>: <code>self.lines = []</code>."],
    moreMistakes: ["Answering <code>1 1 False</code>.", "Thinking <code>self.total += 1</code> updates the class counter."],
    variants: [
      { q: "+= on a class int via self.", code: `class Counter:
    total = 0
    def __init__(self):
        self.total += 1
c = Counter(); d = Counter()
print(Counter.total, c.total, d.total)`, answer: `0 1 1` },
      { q: "Explicit class update plus a shadow.", code: `class C:
    n = 0
    def __init__(self):
        C.n += 1
        self.id = C.n
c1 = C(); c2 = C(); c1.n = 100
print(C.n, c1.n, c2.n, c2.id)`, answer: `2 100 2 2` },
      { q: "Assignment shadows the class list.", code: `class Bag:
    items = []
    def add(self, x):
        self.items = self.items + [x]
p = Bag(); q = Bag()
p.add(1); q.add(2)
print(p.items, q.items, Bag.items)`, answer: `[1] [2] []` }
    ]
  },
  B1: {
    tested: "Explaining shallow vs deep copy in words, with the mechanism and a correct remedy.",
    key: "Copies are <b>one level deep</b> unless you ask for more. A slice, <code>.copy()</code> and <code>list()</code> are all shallow.",
    behavior: `old ──> [ L0 , L1 ]
new = old[:] ──> [ L0 , L1 ]   (new outer list, SAME L0 and L1)
new[0][0] = 99 -> L0 changes -> old sees it
new.append(...) -> only new's outer list changes`,
    lookFor: ["Any question asking about copying <b>nested</b> data (a list of lists, a list of dicts, a dict of lists).", "The words “without affecting the original”."],
    tips: ["Answer template, 3 parts: <b>(1) shallow</b> means a new outer list with shared inner lists; <b>(2) the consequence</b>, e.g. <code>new[0][0] = 99</code> changes old; <b>(3) the remedy</b>, <code>copy.deepcopy(old)</code> or <code>[row[:] for row in old]</code>.", "Mention that the remedy works at any depth (deepcopy) versus one extra level (row copy)."],
    moreMistakes: ["Suggesting <code>old.copy()</code> or <code>list(old)</code> as the fix.", "Saying “it's a reference”. <code>old[:]</code> <i>is</i> a new outer list."],
    variants: [
      { q: "Shallow copy of a dict holding lists.", code: `d = {"a": [1]}
e = d.copy()
e["a"].append(2)
e["b"] = [3]
print(d)`, answer: `{'a': [1, 2]}` },
      { q: "Row copy isn't enough at 3 levels.", code: `import copy
old = [[[1]]]
rows = [r[:] for r in old]
rows[0][0][0] = 9
print(old, copy.deepcopy(old) is old)`, answer: `[[[9]]] False` }
    ]
  },
  B2: {
    tested: "Explaining that <code>bool</code> subclasses <code>int</code>, and showing a concrete bug it causes in type-inspecting code.",
    key: "Every bool <b>is an int</b>: <code>isinstance(True, int)</code>, <code>True == 1</code>, <code>True + True == 2</code>. To separate them, test <code>bool</code> <b>first</b>, or use <code>type(x) is int</code>.",
    behavior: `issubclass(bool, int) -> True
if isinstance(label, int): ...   <- True/False enter here
elif isinstance(label, bool): ... <- unreachable`,
    lookFor: ["Any <code>if isinstance(x, int)</code> before a bool check.", "Counting, summing or dict-keying labels that mix <code>1</code> and <code>True</code>.", "“Type of label” questions. Expect bool/int confusion."],
    tips: ["Answer template: <b>why</b> (subclass), a <b>concrete example</b> (show the buggy if/elif and the wrong result), the <b>fix</b> (bool first / <code>type(x) is int</code>).", "<code>sum([True, True, False])</code> is 2. Booleans silently act as numbers."],
    moreMistakes: ["Only saying “True equals 1” with no example of wrong output.", "Proposing <code>isinstance(x, int) and not isinstance(x, bool)</code> but writing it backwards."],
    variants: [
      { q: "Booleans act as numbers.", code: `print(sum([True, True, False]), True * 3, isinstance(False, int))`, answer: `2 3 True` },
      { q: "type() vs isinstance.", code: `x = True
print(type(x) is int, type(x).__name__, isinstance(x, int))`, answer: `False bool True` }
    ]
  },
  C1: {
    tested: "Applying the set/dict merging rule to a real counting function, then fixing it so the types stay separate.",
    key: "In a dict, equal-and-same-hash keys share <b>one slot</b>. The <b>first key object stays</b> and the counts add up. Fix: make the <b>type part of the key</b>.",
    behavior: `1     -> new key 1            {1: 1}
True  -> == 1 -> slot of 1    {1: 2}
1.0   -> == 1 -> slot of 1    {1: 3}
0     -> new key 0            {1: 3, 0: 1}
False -> == 0 -> slot of 0    {1: 3, 0: 2}
"1"   -> new key '1'          {1: 3, 0: 2, '1': 1}`,
    lookFor: ["A dict built with <code>d[x] = d.get(x, 0) + 1</code> over mixed numeric and bool values.", "The input order decides which key object is printed.", "Find-and-fix needs <b>three labeled parts</b>: Output / Cause / Fix."],
    tips: ["Trace with the table above. It's fast and exact.", "A good fix key: <code>(label, type(label).__name__)</code>. A bad fix: <code>str(label)</code>, which merges <code>1</code> and <code>\"1\"</code>.", "<code>collections.Counter</code> has the same merging behavior."],
    moreMistakes: ["Printing <code>{True: 3, …}</code> or <code>{1.0: …}</code>.", "Forgetting the string key's quotes: <code>'1'</code>."],
    variants: [
      { q: "Order changes the printed key.", code: `def census(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return counts
print(census([True, 1, 0.0, False, "0"]))`, answer: `{True: 2, 0.0: 2, '0': 1}` },
      { q: "Counter merges too.", code: `from collections import Counter
print(Counter([1, True, 1.0, 2]))`, answer: `Counter({1: 3, 2: 1})` },
      { q: "Why str() is a bad fix.", code: `print(len({str(x) for x in [1, "1", True]}))`, answer: `2` }
    ]
  },
  D1: {
    tested: "Writing one-expression solutions with the named construct: a comprehension with tuple unpacking, <code>reduce</code> with an initial value, and <code>map</code> + <code>filter</code> chained.",
    key: "Use the construct they ask for. In <code>reduce</code>, the <b>accumulator type must match the result</b>, so give an initial value when the items are tuples.",
    behavior: `(a) unpack each (name, score) -> keep name
(b) acc=0 -> 0+90 -> 90+72 -> 162+90 -> 252+55 = 307
(c) filter(score >= 90) -> ann, cy ; map(upper) -> ['ANN', 'CY']`,
    lookFor: ["“at least” means <code>&gt;=</code>, “more than” means <code>&gt;</code>.", "“State the result”: write the value too.", "Tuples as items: <code>r[0]</code>/<code>r[1]</code> in lambdas, unpacking in comprehensions."],
    tips: ["<code>map</code>/<code>filter</code> results need <code>list()</code> to show values.", "Order: <b>filter first</b> (it needs the score), then map (which may drop it).", "Alternatives: <code>sum(s for _, s in ROWS)</code> is fine in general, but not when they ask for reduce."],
    moreMistakes: ["<code>reduce(lambda a, b: a[1] + b[1], ROWS)</code>. That breaks after the first step, because <code>a</code> becomes an int.", "Using a for loop when a comprehension was asked for."],
    variants: [
      { q: "Average with reduce.", code: `from functools import reduce
ROWS = [("ann", 90), ("bob", 72), ("cy", 90), ("di", 55)]
total = reduce(lambda acc, r: acc + r[1], ROWS, 0)
print(total / len(ROWS))`, answer: `76.75` },
      { q: "Dict comprehension name → passed.", code: `ROWS = [("ann", 90), ("bob", 72), ("cy", 90), ("di", 55)]
print({n: s >= 70 for n, s in ROWS})`, answer: `{'ann': True, 'bob': True, 'cy': True, 'di': False}` },
      { q: "Max by score with reduce.", code: `from functools import reduce
ROWS = [("ann", 90), ("bob", 72), ("cy", 95), ("di", 55)]
print(reduce(lambda a, b: a if a[1] >= b[1] else b, ROWS))`, answer: `('cy', 95)` },
      { q: "Set of distinct scores.", code: `ROWS = [("ann", 90), ("bob", 72), ("cy", 90), ("di", 55)]
print(len({s for _, s in ROWS}))`, answer: `3` }
    ]
  },
  D2: {
    tested: "Writing <code>__eq__</code> and <code>__hash__</code> correctly (NotImplemented, a strict type check, a consistent hash) and predicting set sizes.",
    key: "<b>The contract:</b> <code>a == b</code> ⇒ <code>hash(a) == hash(b)</code>. Hash a tuple of <b>exactly the fields you compare</b>. Defining <code>__eq__</code> alone makes the class <b>unhashable</b>.",
    behavior: `LP((1.0,), 1) vs LP((1.0,), True):
  coords equal, 1 == True, but type int is not bool -> NOT equal
  hashes include 'int' vs 'bool' -> different -> set size 2
plain tuples ((1.0,), 1) vs ((1.0,), True):
  element-wise equal + same hash -> set size 1`,
    lookFor: ["“equal only if …”: turn each condition into an <code>and</code> clause.", "“same type”: use <code>type(a) is type(b)</code>, not isinstance.", "“against a non-X”: <code>return NotImplemented</code>.", "Lists in attributes: convert them to a tuple before hashing."],
    tips: ["Memorize the <code>__eq__</code>/<code>__hash__</code> template in the playground. It's worth 14 points.", "<code>__repr__</code> isn't required, but it helps you debug in the playground.", "Without <code>__eq__</code>, two equal-looking objects are different (identity), so the set size equals the object count."],
    moreMistakes: ["<code>hash(self.coords, self.label)</code>: hash takes ONE argument, so wrap the fields in a tuple.", "Using <code>isinstance(self.label, type(other.label))</code>: <code>isinstance(True, int)</code> passes."],
    variants: [
      { q: "No __eq__ at all: identity semantics.", code: `class P:
    def __init__(self, n):
        self.n = n
print(P(1) == P(1), len({P(1), P(1)}))`, answer: `False 2` },
      { q: "__eq__ only: unhashable.", code: `class T:
    def __init__(self, n):
        self.n = n
    def __eq__(self, o):
        return isinstance(o, T) and self.n == o.n
print(T(1) == T(1), T.__hash__)
try:
    {T(1)}
except TypeError:
    print("TypeError")`, answer: `True None
TypeError` },
      { q: "Equal objects dedup in a set.", code: `class Tag:
    def __init__(self, name, v):
        self.name, self.v = name, v
    def __eq__(self, o):
        if not isinstance(o, Tag):
            return NotImplemented
        return self.name == o.name and self.v == o.v and type(self.v) is type(o.v)
    def __hash__(self):
        return hash((self.name, self.v, type(self.v).__name__))
print(len({Tag("a", 1), Tag("a", 1), Tag("a", 1.0), Tag("a", True)}))`, answer: `3` },
      { q: "NotImplemented falls back to False.", code: `class Tag:
    def __init__(self, v):
        self.v = v
    def __eq__(self, o):
        if not isinstance(o, Tag):
            return NotImplemented
        return self.v == o.v
    __hash__ = None
print(Tag(1) == 1, Tag(1) != "x")`, answer: `False True` }
    ]
  }
};
