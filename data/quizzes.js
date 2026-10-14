// CS 715 midterm practice: Quizzes 2–4 (original questions + exam-style alternatives)
window.PAGE = {
  key: "quizzes",
  title: "Quizzes 2–4",
  intro: "<p>All 30 quiz questions from Quizzes 2, 3 and 4, with the original choices in the original order. Each one has runnable code, a visual breakdown, and 2–3 <b>midterm-style variations</b> that lean on the big exam topics: shared references and copying, <code>1 == 1.0 == True</code> in sets/dicts, comprehensions, map/filter/reduce, defaults and scope, <code>*args</code>/<code>**kwargs</code>, and class vs instance attributes.</p><p>Quiz 2 Q9 (<code>[::-1]</code>) was the one missed. Start there if you're short on time.</p>",
  sections: [
  // ======================================================= QUIZ 2
  {
    id: "q2",
    title: "Quiz 2: Types, Loops, Slicing, Dicts, Comprehensions, Classes",
    intro: "<p>Topics: <code>/</code> always gives a float, <code>continue</code>, accumulator loops, list and string slicing (including negative step), <code>dict.get</code>, <code>Optional</code> type hints, <code>ValueError</code>, comprehensions with a filter, and class attributes vs instance attributes.</p>",
    items: [
    {
      id: "q2-1",
      title: "Type of 3 / 2",
      tags: ["types", "operators"],
      prompt: "What will be the type of <code>x</code> after running this code?<br><code>x = 3 / 2</code>",
      code: `x = 3 / 2
print(type(x))
print(x)`,
      output: `<class 'float'>
1.5`,
      choices: ["str", "decimal", "int", "float"],
      answer: 3,
      explain: "In Python 3, <code>/</code> is <b>true division</b>. It <b>always</b> returns a float, even when the result is a whole number (<code>4 / 2</code> is <code>2.0</code>).<br><br><b>int</b> is wrong because only <code>//</code> (floor division) keeps ints. <b>decimal</b> is a separate module type you only get from <code>decimal.Decimal</code>. <b>str</b> makes no sense: no quotes anywhere.",
      anatomy: [{ code: "x = 3 / 2", notes: [{ at: "3", label: "int" }, { at: "/", label: "true division → float" }, { at: "2", label: "int" }] }],
      key: "<code>/</code> → always float. <code>//</code> → floor (int if both ints). <code>%</code> → remainder.",
      mistakes: ["Thinking <code>4 / 2</code> is <code>2</code>. It is <code>2.0</code>.", "Forgetting <code>//</code> rounds toward <b>negative infinity</b>: <code>-7 // 2</code> is <code>-4</code>, not <code>-3</code>."],
      alts: [
        { q: "What prints?", code: `print(7 // 2, 7 / 2, -7 // 2, 7 % 3)`, answer: "3 3.5 -4 1" },
        { q: "What prints?", code: `print(type(4 / 2).__name__, 4 / 2)`, answer: "float 2.0" },
        { q: "int, float and bool compare equal. What prints?", code: `print(1 == 1.0 == True)
print(len({1, 1.0, True}))`, answer: `True
1` }
      ]
    },
    {
      id: "q2-2",
      title: "for loop with continue",
      tags: ["loops"],
      prompt: "What will this code print?",
      code: `for i in range(3):
    if i == 1:
        continue
    print(i)`,
      output: `0
2`,
      choices: ["012", "01", "12", "02"],
      answer: 3,
      explain: "<code>continue</code> means <b>skip the rest of this lap and go to the next one</b>. When <code>i == 1</code>, the <code>print</code> is skipped. So only 0 and 2 print (each on its own line).<br><br><b>012</b> ignores the continue. <b>01</b> prints 1 and skips 2, which is backwards. (<code>break</code> would print only 0.) <b>12</b> skips 0 instead of 1.",
      trace: `i | i == 1? | action
0 | no      | print 0
1 | YES     | continue (skip print)
2 | no      | print 2`,
      key: "<code>continue</code> = skip to next iteration. <code>break</code> = leave the loop completely.",
      mistakes: ["Mixing up <code>continue</code> and <code>break</code>.", "Forgetting <code>range(3)</code> is 0, 1, 2 (stops <b>before</b> 3)."],
      alts: [
        { q: "Same loop with <code>break</code>. What prints?", code: `for i in range(3):
    if i == 1:
        break
    print(i)`, answer: "0" },
        { q: "What prints?", code: `for i in range(6):
    if i % 2:
        continue
    print(i, end=" ")`, answer: "0 2 4" },
        { q: "What prints? (loop <code>else</code> runs only if no <code>break</code>)", code: `for i in range(3):
    if i == 5:
        break
else:
    print("done", i)`, answer: "done 2" }
      ]
    },
    {
      id: "q2-3",
      title: "mystery(3): factorial loop",
      tags: ["functions", "loops"],
      prompt: "What does this function return when called as <code>mystery(3)</code>?",
      code: `def mystery(x: int) -> int:
    result = 1
    for i in range(1, x + 1):
        result *= i
    return result

print(mystery(3))`,
      output: "6",
      choices: ["None", "6", "3", "9"],
      answer: 1,
      explain: "It multiplies 1 × 1 × 2 × 3 = <b>6</b>. That's the factorial 3!.<br><br><b>None</b> would only happen with no <code>return</code>. <b>3</b> is just x. <b>9</b> is 3² and nothing here squares.",
      trace: `i | result *= i
- | 1   (start)
1 | 1 * 1 = 1
2 | 1 * 2 = 2
3 | 2 * 3 = 6   → return 6`,
      key: "Accumulator pattern: start at the identity (1 for *, 0 for +), update every lap, return after the loop.",
      mistakes: ["Thinking <code>range(1, x + 1)</code> stops at x - 1. The <code>+ 1</code> makes x included.", "Indenting <code>return</code> inside the loop, which returns after the first lap."],
      alts: [
        { q: "What is <code>mystery(0)</code>? (the range is empty)", code: `def mystery(x):
    result = 1
    for i in range(1, x + 1):
        result *= i
    return result
print(mystery(0), mystery(5))`, answer: "1 120" },
        { q: "Same idea with <code>reduce</code>. What prints?", code: `from functools import reduce
print(reduce(lambda a, b: a * b, range(1, 5)))`, answer: "24" },
        { q: "Bug: <code>return</code> inside the loop. What prints?", code: `def mystery(x):
    result = 1
    for i in range(1, x + 1):
        result *= i
        return result
print(mystery(3))`, answer: "1" }
      ]
    },
    {
      id: "q2-4",
      title: "List slice nums[1:4]",
      tags: ["lists", "slicing"],
      prompt: "What is the output of this code?",
      code: `nums = [10, 20, 30, 40, 50]
print(nums[1:4])`,
      output: "[20, 30, 40]",
      choices: ["[20, 30, 40]", "[20, 30, 40, 50]", "[30, 40]", "[10, 20, 30]"],
      answer: 0,
      explain: "A slice <code>[start:stop]</code> includes <b>start</b> and stops <b>before</b> stop. Indexes 1, 2, 3 → 20, 30, 40.<br><br><b>[20, 30, 40, 50]</b> includes index 4 (stop is excluded). <b>[30, 40]</b> starts counting at 1 instead of 0. <b>[10, 20, 30]</b> is <code>nums[0:3]</code>.",
      anatomy: [{ code: "nums[1:4]", notes: [{ at: "1", label: "start (included)" }, { at: "4", label: "stop (excluded)" }] }],
      trace: `index: 0   1   2   3   4
value: 10  20  30  40  50
           ^start      ^stop (not taken)
[1:4] → 20 30 40`,
      key: "Slice length = stop − start (here 4 − 1 = 3 items). A slice makes a <b>new list</b> (shallow copy).",
      mistakes: ["Including the stop index.", "Thinking a slice is the same object. <code>nums[:]</code> is a <b>copy</b>, but <code>b = nums</code> is the <b>same</b> list."],
      alts: [
        { q: "What prints?", code: `nums = [10, 20, 30, 40, 50]
print(nums[-2:], nums[::2], nums[:-3])`, answer: "[40, 50] [10, 30, 50] [10, 20]" },
        { q: "Alias vs slice copy. What prints?", code: `nums = [10, 20, 30]
a = nums
b = nums[:]
a.append(40)
print(len(nums), len(b), a is nums, b is nums)`, answer: "4 3 True False" },
        { q: "Slices of out-of-range indexes don't crash. What prints?", code: `nums = [10, 20, 30]
print(nums[1:100], nums[5:])`, answer: "[20, 30] []" }
      ]
    },
    {
      id: "q2-5",
      title: "dict.get with a default",
      tags: ["dicts"],
      prompt: "What will be printed here?",
      code: `d = {"a": 1, "b": 2}
print(d.get("c", 99))`,
      output: "99",
      choices: ["2", "99", "\"c\"", "None"],
      answer: 1,
      explain: "<code>d.get(key, default)</code> returns the value if the key exists, otherwise the <b>default</b>. <code>\"c\"</code> is not a key, so you get <b>99</b>. No error.<br><br><b>None</b> is what you'd get with <code>d.get(\"c\")</code> (no default). <b>2</b> is <code>d[\"b\"]</code>. <b>\"c\"</b> is the key, not a value. <code>d[\"c\"]</code> would raise <code>KeyError</code>.",
      anatomy: [{ code: "d.get(\"c\", 99)", notes: [{ at: "\"c\"", label: "key to look up" }, { at: "99", label: "returned if missing" }] }],
      key: "<code>d[k]</code> → KeyError if missing. <code>d.get(k)</code> → None. <code>d.get(k, x)</code> → x. <code>get</code> never adds the key.",
      mistakes: ["Thinking <code>get</code> inserts the key into the dict (it doesn't; <code>setdefault</code> does).", "Expecting <code>d[\"c\"]</code> to return None."],
      alts: [
        { q: "Counting pattern. What prints?", code: `counts = {}
for w in ["a", "b", "a", "a"]:
    counts[w] = counts.get(w, 0) + 1
print(counts)`, answer: "{'a': 3, 'b': 1}" },
        { q: "1, 1.0 and True are the SAME key. What prints?", code: `d = {1: "a", 1.0: "b", True: "c"}
print(d, len(d))`, answer: "{1: 'c'} 1" },
        { q: "Does <code>get</code> add the key?", code: `d = {"a": 1}
x = d.get("z", 0)
print(x, "z" in d, len(d))`, answer: "0 False 1" }
      ]
    },
    {
      id: "q2-6",
      title: "Why Optional[str]",
      tags: ["type hints", "functions"],
      prompt: "Why does this function signature use <code>Optional[str]</code> instead of just <code>str</code>?",
      code: `from typing import Optional

def greet(name: Optional[str] = None) -> str:
    if name:
        return f"Hello, {name}"
    return "Hello, stranger"

print(greet())
print(greet("Ann"))`,
      output: `Hello, stranger
Hello, Ann`,
      choices: ["To make the function faster", "To restrict name only to strings", "To enforce type checking at runtime", "To allow name to be either str or None"],
      answer: 3,
      explain: "<code>Optional[str]</code> means <b><code>str | None</code></b>. The default is <code>None</code>, so the hint says \"a string, or nothing at all.\"<br><br>Type hints are <b>only documentation</b> for humans and tools. Python does <b>not</b> check them at runtime (so not \"enforce\"), they don't change speed, and they don't restrict anything (<code>greet(42)</code> still runs).",
      anatomy: [{ code: "def greet(name: Optional[str] = None) -> str:", notes: [{ at: "Optional[str]", label: "str or None" }, { at: "= None", label: "default value" }, { at: "-> str", label: "return type hint" }] }],
      key: "Type hints are not enforced. <code>Optional[X]</code> = <code>X | None</code>.",
      mistakes: ["Believing hints raise errors on wrong types.", "Forgetting <code>if name:</code> is also False for the empty string <code>\"\"</code>."],
      alts: [
        { q: "Hints are not enforced. What prints?", code: `def double(x: int) -> int:
    return x * 2
print(double("ab"), double(2.5))`, answer: "abab 5.0" },
        { q: "Empty string is falsy. What prints?", code: `def greet(name=None):
    if name:
        return f"Hello, {name}"
    return "Hello, stranger"
print(greet(""))
print(greet("0"))`, answer: `Hello, stranger
Hello, 0` }
      ]
    },
    {
      id: "q2-7",
      title: "int(\"hello\") error",
      tags: ["errors", "types"],
      prompt: "Which error is raised by this line?<br><code>x = int(\"hello\")</code>",
      code: `try:
    x = int("hello")
except Exception as e:
    print(type(e).__name__)`,
      output: "ValueError",
      choices: ["TypeError", "ValueError", "NameError", "IndexError"],
      answer: 1,
      explain: "<code>int()</code> accepts a string, so the <b>type</b> is fine. The <b>value</b> <code>\"hello\"</code> just isn't a number. Right type, bad value → <b>ValueError</b>.<br><br><b>TypeError</b> = wrong type for the operation (e.g. <code>\"5\" + 5</code>). <b>NameError</b> = using an undefined variable. <b>IndexError</b> = list index out of range.",
      key: "Right type, wrong value → ValueError. Wrong type → TypeError.",
      mistakes: ["Picking TypeError because \"it's a string.\"", "Thinking <code>int(\"3.5\")</code> works. It's a ValueError (but <code>int(3.5)</code> is 3)."],
      alts: [
        { q: "Which error for each?", code: `for f in [lambda: int("3.5"), lambda: "5" + 5, lambda: [1, 2][5], lambda: {"a": 1}["b"]]:
    try:
        f()
    except Exception as e:
        print(type(e).__name__)`, answer: `ValueError
TypeError
IndexError
KeyError` },
        { q: "What prints?", code: `print(int(3.9), int(" 42 "), int(-2.7))`, answer: "3 42 -2" }
      ]
    },
    {
      id: "q2-8",
      title: "Comprehension with a filter",
      tags: ["comprehensions"],
      prompt: "What is the output?",
      code: `squares = [x**2 for x in range(5) if x % 2 == 0]
print(squares)`,
      output: "[0, 4, 16]",
      choices: ["[1, 9, 25]", "[0, 2, 4]", "[0, 1, 4, 9, 16]", "[0, 4, 16]"],
      answer: 3,
      explain: "Read it right to left: loop 0..4 → <b>keep evens</b> (0, 2, 4) → <b>square</b> them → 0, 4, 16.<br><br><b>[0, 2, 4]</b> forgets to square. <b>[0, 1, 4, 9, 16]</b> ignores the filter. <b>[1, 9, 25]</b> squares odds (and 5 isn't even in range(5)).",
      anatomy: [{ code: "[x**2 for x in range(5) if x % 2 == 0]", notes: [{ at: "x**2", label: "expression (output)" }, { at: "for x in range(5)", label: "loop" }, { at: "if x % 2 == 0", label: "filter (keep evens)" }] }],
      trace: `x | x%2==0? | kept → x**2
0 | yes     | 0
1 | no      | -
2 | yes     | 4
3 | no      | -
4 | yes     | 16`,
      key: "<code>[EXPR for x in SEQ if COND]</code>: filter first, then transform. An <code>if/else</code> goes BEFORE <code>for</code>.",
      mistakes: ["Putting <code>if ... else</code> at the end (syntax error). Use <code>[a if c else b for x in s]</code>.", "Forgetting <code>**</code> is power, <code>^</code> is XOR."],
      alts: [
        { q: "if/else in front (transform, not filter). What prints?", code: `print([x if x % 2 == 0 else -x for x in range(5)])`, answer: "[0, -1, 2, -3, 4]" },
        { q: "Same with map/filter. What prints?", code: `print(list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, range(5)))))`, answer: "[0, 4, 16]" },
        { q: "Set and dict comprehensions. What prints?", code: `print({x % 3 for x in range(7)})
print({x: x**2 for x in range(4) if x})`, answer: `{0, 1, 2}
{1: 1, 2: 4, 3: 9}` }
      ]
    },
    {
      id: "q2-9",
      title: "Reverse a string: text[::-1] (MISSED)",
      tags: ["strings", "slicing"],
      prompt: "What does the following code print?",
      code: `text = "Python"
print(text[::-1])`,
      output: "nohtyP",
      choices: ["\"nothyP\"", "\"Python\"", "\"Pytho\"", "\"nohtyP\""],
      answer: 3,
      explain: "<code>[::-1]</code> = start at the <b>last</b> character, walk <b>backward one at a time</b>, all the way to the front. It reverses the whole string <b>exactly</b>, character by character.<br><br>Spell it backward slowly: P-y-t-h-o-n → <b>n-o-h-t-y-P</b>.<br><br><b>\"nothyP\"</b> (your pick) swaps the <code>t</code> and <code>h</code>. In \"Python\" the <code>t</code> (index 2) comes <b>before</b> the <code>h</code> (index 3), so reversed, <code>h</code> comes before <code>t</code>: n-o-<b>h-t</b>-y-P. <b>\"Python\"</b> ignores the step. <b>\"Pytho\"</b> is <code>text[:-1]</code> (drop last char).",
      anatomy: [{ code: "text[::-1]", notes: [{ at: "[:", label: "start: blank = from the end" }, { at: ":-1", label: "stop: blank = to the front" }, { at: "-1", label: "step -1 = go backward" }] }],
      trace: `index:   0  1  2  3  4  5
char:    P  y  t  h  o  n
neg idx: -6 -5 -4 -3 -2 -1

[::-1] walks 5 → 0:
  5→n  4→o  3→h  2→t  1→y  0→P
result:  n  o  h  t  y  P   =  "nohtyP"`,
      steps: [
        "Step is <b>negative</b> → blank start means \"last index\" (5), blank stop means \"past the front\".",
        "Take index 5 (<code>n</code>), 4 (<code>o</code>), 3 (<code>h</code>), 2 (<code>t</code>), 1 (<code>y</code>), 0 (<code>P</code>).",
        "Glue them: <b>nohtyP</b>. Check: reverse it again and you get <code>Python</code> back."
      ],
      key: "<code>s[::-1]</code> reverses exactly. To check your answer, read the original backward letter by letter. Don't just reorder from memory.",
      tips: ["Write the indexes under the letters. With a negative step, start ≥ stop, and the stop is still excluded.", "Sanity check: <code>s[::-1][::-1] == s</code>."],
      mistakes: ["Rearranging letters by \"feel\" (n-o-t-h vs n-o-h-t). Always go index by index.", "With a negative step, <code>s[1:4:-1]</code> is EMPTY because you can't walk backward from 1 to 4."],
      alts: [
        { q: "Every other char, backward. What prints?", code: `text = "Python"
print(text[::-2])`, answer: "nhy" },
        { q: "Negative start/stop. What prints?", code: `text = "Python"
print(text[-1:-4:-1], text[4:1:-1], repr(text[1:4:-1]))`, answer: "noh oht ''" },
        { q: "Palindrome check. What prints?", code: `for w in ["racecar", "Python", "noon"]:
    print(w, w == w[::-1])`, answer: `racecar True
Python False
noon True` }
      ]
    },
    {
      id: "q2-10",
      title: "Class attribute vs instance attribute",
      tags: ["classes", "OOP"],
      prompt: "What is the output of this code?",
      code: `class Dog:
    species = "Canine"
    def __init__(self, name):
        self.name = name

d = Dog("Buddy")
print(d.name, d.species)`,
      output: "Buddy Canine",
      choices: ["Canine Buddy", "Buddy Dog", "Dog Canine", "Buddy Canine"],
      answer: 3,
      explain: "<code>d.name</code> is an <b>instance attribute</b> (set in <code>__init__</code>) = \"Buddy\". <code>d.species</code> isn't on the instance, so Python looks up to the <b>class</b> and finds \"Canine\". Print order follows the arguments: name first.<br><br><b>Canine Buddy</b> has the order flipped. <b>Buddy Dog</b> / <b>Dog Canine</b> confuse the class name with an attribute value.",
      trace: `lookup d.species:
  d.__dict__   = {'name': 'Buddy'}   → not here
  Dog.__dict__ has species='Canine'  → found!`,
      key: "Attribute lookup: instance first, then class. Assigning <code>d.x = ...</code> creates an instance attribute that <b>shadows</b> the class one. Mutating a class-level list (<code>self.lst.append</code>) changes it for <b>all</b> instances.",
      mistakes: ["Putting a mutable list as a class attribute and expecting each object to get its own.", "Thinking <code>d.species = \"Wolf\"</code> changes <code>Dog.species</code>. It doesn't; it only creates <code>d.species</code>."],
      alts: [
        { q: "Mutable class attribute is SHARED. What prints?", code: `class Dog:
    tricks = []
    def __init__(self, name):
        self.name = name
    def add_trick(self, t):
        self.tricks.append(t)

a = Dog("A")
b = Dog("B")
a.add_trick("sit")
print(b.tricks, a.tricks is b.tricks)`, answer: "['sit'] True" },
        { q: "Assigning on the instance shadows. What prints?", code: `class Dog:
    species = "Canine"
d = Dog()
e = Dog()
d.species = "Wolf"
Dog.species = "K9"
print(d.species, e.species, Dog.species)`, answer: "Wolf K9 K9" },
        { q: "Class counter. What prints?", code: `class Dog:
    count = 0
    def __init__(self):
        Dog.count += 1
Dog(); Dog(); x = Dog()
print(Dog.count, x.count)`, answer: "3 3" }
      ]
    }
    ]
  },
  // ======================================================= QUIZ 3
  {
    id: "q3",
    title: "Quiz 3: bool, Strings, Tuples, Lists, Sets, Conversions, Nested Data",
    intro: "<p>Topics: <code>bool</code> is a subclass of <code>int</code>, string slicing, single-element tuples, <code>append</code> vs <code>extend</code>, set properties, <code>while</code> loops with <code>end=\" \"</code>, <code>int()</code>/<code>float()</code> conversion, nested dicts, and nested comprehensions.</p>",
    items: [
    {
      id: "q3-1",
      title: "Type of True",
      tags: ["types", "bool"],
      prompt: "What is the type of the value <code>True</code> in Python?",
      code: `print(type(True))
print(True + True)
print(isinstance(True, int))`,
      output: `<class 'bool'>
2
True`,
      choices: ["int", "str", "bool", "NoneType"],
      answer: 2,
      explain: "<code>True</code> and <code>False</code> are of type <b>bool</b>. Twist: <code>bool</code> is a <b>subclass of int</b>, so <code>True</code> behaves like 1 and <code>False</code> like 0 in math, and <code>True == 1</code> with the same hash.<br><br><b>int</b> is tempting because of that, but <code>type()</code> reports the exact type: bool. <b>str</b> would need quotes (<code>\"True\"</code>). <b>NoneType</b> is the type of <code>None</code>.",
      key: "<code>type(True)</code> is bool, but <code>True == 1</code> and <code>hash(True) == hash(1)</code>, so they collide in sets/dicts.",
      mistakes: ["Forgetting <code>{1, True}</code> has only ONE element.", "Writing <code>true</code> (lowercase) gives a NameError."],
      alts: [
        { q: "Set with 1, True, 1.0. What prints?", code: `s = {1, True, 1.0}
print(len(s), s)`, answer: "1 {1}" },
        { q: "What prints?", code: `print(sum([True, True, False]), True * 10)`, answer: "2 10" },
        { q: "What prints?", code: `d = {True: "yes", 0: "zero"}
print(d[1], d[False])`, answer: "yes zero" }
      ]
    },
    {
      id: "q3-2",
      title: "String slice \"hello\"[1:4]",
      tags: ["strings", "slicing"],
      prompt: "What will the following expression evaluate to?<br><code>\"hello\"[1:4]</code>",
      code: `print("hello"[1:4])`,
      output: "ell",
      choices: ["\"ell\"", "\"heo\"", "\"hel\"", "\"llo\""],
      answer: 0,
      explain: "Indexes 1, 2, 3 (stop 4 excluded) → e, l, l → <b>\"ell\"</b>.<br><br><b>\"hel\"</b> is <code>[0:3]</code>. <b>\"llo\"</b> is <code>[2:5]</code>. <b>\"heo\"</b> isn't a contiguous slice at all.",
      anatomy: [{ code: "\"hello\"[1:4]", notes: [{ at: "1", label: "start (included)" }, { at: "4", label: "stop (excluded)" }] }],
      trace: `index: 0 1 2 3 4
char:  h e l l o
         ^-----^ 1..3 → "ell"`,
      key: "Same slicing rules as lists. Strings are <b>immutable</b>: you can slice them but not assign into them.",
      mistakes: ["Including the stop index.", "Trying <code>s[0] = \"H\"</code>, which is a TypeError."],
      alts: [
        { q: "What prints?", code: `s = "hello"
print(s[-3:], s[:2] + s[3:], repr(s[10:]))`, answer: "llo helo ''" },
        { q: "Strings are immutable. What prints?", code: `s = "hello"
try:
    s[0] = "H"
except TypeError:
    print("TypeError")
print(s.upper(), s)`, answer: `TypeError
HELLO hello` }
      ]
    },
    {
      id: "q3-3",
      title: "Single-element tuple",
      tags: ["tuples"],
      prompt: "Which of the following creates a tuple with a single element?",
      code: `print(type((42)).__name__, type((42,)).__name__, type([42]).__name__)
try:
    tuple(42)
except TypeError:
    print("tuple(42) -> TypeError")`,
      output: `int tuple list
tuple(42) -> TypeError`,
      choices: ["(42)", "[42]", "tuple(42)", "(42,)"],
      answer: 3,
      explain: "The <b>comma</b> makes a tuple, not the parentheses. <code>(42,)</code> is a 1-tuple.<br><br><b>(42)</b> is just 42 in grouping parentheses (an int). <b>[42]</b> is a list. <b>tuple(42)</b> fails: <code>tuple()</code> needs an <b>iterable</b>, and an int isn't one (<code>tuple([42])</code> would work).",
      key: "Comma makes the tuple: <code>t = 42,</code> is also a tuple. Tuples are immutable but can <b>hold</b> mutable things.",
      mistakes: ["Writing <code>(42)</code> and expecting a tuple.", "Thinking a tuple's inner list can't change. It can."],
      alts: [
        { q: "What prints?", code: `t = 1, 2, 3
a, b = 1, 2
a, b = b, a
print(type(t).__name__, len(t), a, b)`, answer: "tuple 3 2 1" },
        { q: "Tuple holding a list. What prints?", code: `t = (1, [2, 3])
t[1].append(4)
print(t)`, answer: "(1, [2, 3, 4])" },
        { q: "Tuples are hashable (can be dict keys / set items); lists aren't. What prints?", code: `d = {(0, 0): "origin"}
print(d[(0, 0)])
try:
    {[0, 0]: "x"}
except TypeError:
    print("TypeError")`, answer: `origin
TypeError` }
      ]
    },
    {
      id: "q3-4",
      title: "append a list",
      tags: ["lists"],
      prompt: "What will this code print?",
      code: `nums = [1, 2, 3]
nums.append([4, 5])
print(nums)`,
      output: "[1, 2, 3, [4, 5]]",
      choices: ["[1, 2, 3]", "[1, 2, 3, (4, 5)]", "[1, 2, 3, 4, 5]", "[1, 2, 3, [4, 5]]"],
      answer: 3,
      explain: "<code>append</code> adds <b>one item</b>, whatever it is. Here the one item is the list <code>[4, 5]</code>, so it ends up nested. Length becomes 4.<br><br><b>[1, 2, 3, 4, 5]</b> is what <code>extend</code> (or <code>+=</code>) does. <b>(4, 5)</b>: nothing turns it into a tuple. <b>[1, 2, 3]</b>: <code>append</code> modifies the list in place.",
      trace: `append([4,5]) → [1, 2, 3, [4, 5]]   len 4
extend([4,5]) → [1, 2, 3, 4, 5]     len 5`,
      key: "<code>append(x)</code> → adds x as ONE element. <code>extend(seq)</code> → adds each element. Both return <code>None</code>.",
      mistakes: ["Writing <code>nums = nums.append(4)</code>. That sets nums to None.", "Confusing append with extend."],
      alts: [
        { q: "What prints?", code: `a = [1, 2, 3]
b = [1, 2, 3]
a.extend([4, 5])
b += "hi"
print(a, len(a))
print(b)`, answer: `[1, 2, 3, 4, 5] 5
[1, 2, 3, 'h', 'i']` },
        { q: "Shared reference. What prints?", code: `a = [1, 2]
b = a
b.append(3)
c = a.copy()
c.append(99)
print(a, b, c)`, answer: "[1, 2, 3] [1, 2, 3] [1, 2, 3, 99]" },
        { q: "The <code>[[0]*2]*2</code> trap. What prints?", code: `grid = [[0] * 2] * 2
grid[0][0] = 9
print(grid)
safe = [[0] * 2 for _ in range(2)]
safe[0][0] = 9
print(safe)`, answer: `[[9, 0], [9, 0]]
[[9, 0], [0, 0]]` }
      ]
    },
    {
      id: "q3-5",
      title: "Which statement about sets is true",
      tags: ["sets"],
      prompt: "Which statement about Python sets is true?",
      code: `s = {3, 1, 2}
s.add(4)
s.add(1)
print(sorted(s), len(s))
try:
    s.add([5])
except TypeError:
    print("TypeError: list is unhashable")`,
      output: `[1, 2, 3, 4] 4
TypeError: list is unhashable`,
      choices: ["Sets maintain insertion order.", "Sets can contain lists.", "Sets are mutable.", "Sets allow duplicate values."],
      answer: 2,
      explain: "You can <code>add</code>, <code>remove</code>, <code>discard</code>, <code>update</code> a set in place, so sets are <b>mutable</b>.<br><br><b>Insertion order</b>: no, sets are unordered (dicts keep order, sets don't). <b>Contain lists</b>: no, items must be <b>hashable</b> (immutable), so lists are rejected. <b>Duplicates</b>: no, adding <code>1</code> again changes nothing.",
      key: "Set = mutable container of unique, <b>hashable</b> items, unordered. Uniqueness uses <code>==</code> + hash, so <code>1</code>, <code>1.0</code>, <code>True</code> are one item. <code>frozenset</code> is the immutable version.",
      mistakes: ["<code>{}</code> is an empty <b>dict</b>, not a set. Use <code>set()</code>.", "Forgetting <code>{1, True, 1.0}</code> has length 1."],
      alts: [
        { q: "What prints?", code: `s = {1, True, 1.0}
print(len(s), s)
t = {True, 1}
print(t)`, answer: `1 {1}
{True}` },
        { q: "Set operations. What prints?", code: `a = {1, 2, 3}
b = {2, 3, 4}
print(sorted(a | b), a & b, a - b, sorted(a ^ b))`, answer: "[1, 2, 3, 4] {2, 3} {1} [1, 4]" },
        { q: "What prints?", code: `print(len(set("banana")), type({}).__name__, type(set()).__name__)`, answer: "3 dict set" }
      ]
    },
    {
      id: "q3-6",
      title: "while countdown with end=\" \"",
      tags: ["loops", "print"],
      prompt: "What is printed by this code?",
      code: `x = 3
while x > 0:
    print(x, end=" ")
    x -= 1`,
      output: "3 2 1",
      choices: ["210", "3210", "321", "Infinite loop"],
      answer: 2,
      explain: "Prints 3, 2, 1 on one line separated by spaces (<code>end=\" \"</code> replaces the newline). When x hits 0, <code>x &gt; 0</code> is False and the loop stops, so 0 is never printed. (The choices drop the spaces; <b>321</b> is the match.)<br><br><b>3210</b> would need <code>x &gt;= 0</code>. <b>210</b> would need the decrement <b>before</b> the print. <b>Infinite loop</b>: no, <code>x -= 1</code> moves x toward 0.",
      trace: `x | x > 0? | prints | x after
3 | yes    | "3 "   | 2
2 | yes    | "2 "   | 1
1 | yes    | "1 "   | 0
0 | NO     | stop`,
      key: "Check the condition before each lap. <code>end=</code> changes what goes after each print (default <code>\"\\n\"</code>).",
      mistakes: ["Off-by-one: printing 0.", "Forgetting the update line, which gives an infinite loop."],
      alts: [
        { q: "Decrement first. What prints?", code: `x = 3
while x > 0:
    x -= 1
    print(x, end=" ")`, answer: "2 1 0" },
        { q: "What prints?", code: `x = 3
while x >= 0:
    print(x, end=",")
    x -= 1
print()
print(1, 2, 3, sep="-")`, answer: `3,2,1,0,
1-2-3` }
      ]
    },
    {
      id: "q3-7",
      title: "int(\"7\") + float(\"2.5\")",
      tags: ["types", "conversion"],
      prompt: "What is the result of:<br><code>int(\"7\") + float(\"2.5\")</code>",
      code: `r = int("7") + float("2.5")
print(r, type(r).__name__)`,
      output: "9.5 float",
      choices: ["Error", "7.25", "\"72.5\"", "9.5"],
      answer: 3,
      explain: "Both strings are converted to numbers <b>first</b>: 7 + 2.5 = <b>9.5</b>. int + float → float.<br><br><b>\"72.5\"</b> is string concatenation (<code>\"7\" + \"2.5\"</code>), which doesn't happen after conversion. <b>Error</b>: both strings are valid numbers. <b>7.25</b> is just nonsense digit-gluing.",
      key: "Mixing int and float → float. Convert strings before doing math.",
      mistakes: ["Thinking <code>int(\"2.5\")</code> works. It's a ValueError. Use <code>int(float(\"2.5\"))</code>."],
      alts: [
        { q: "What prints?", code: `print("7" + "2.5", int("7") + int("2"), int(float("2.9")))`, answer: "72.5 9 2" },
        { q: "What prints?", code: `print(3 * "ab", type(1 + 2.0).__name__, 0.1 + 0.2 == 0.3)`, answer: "ababab float False" }
      ]
    },
    {
      id: "q3-8",
      title: "sum of converted strings",
      tags: ["comprehensions", "conversion"],
      prompt: "What does this print?",
      code: `vals = ["1", "2", "3"]
nums = [int(v) for v in vals]
print(sum(nums))`,
      output: "6",
      choices: ["Error", "[1, 2, 3]", "\"123\"", "6"],
      answer: 3,
      explain: "The comprehension turns <code>[\"1\",\"2\",\"3\"]</code> into <code>[1, 2, 3]</code>, then <code>sum</code> adds them: <b>6</b>.<br><br><b>[1, 2, 3]</b> is <code>nums</code>, but we print the <b>sum</b>. <b>\"123\"</b> is joining strings (<code>\"\".join(vals)</code>). <b>Error</b> would happen with <code>sum(vals)</code> directly (can't sum strings).",
      anatomy: [{ code: "nums = [int(v) for v in vals]", notes: [{ at: "int(v)", label: "convert each" }, { at: "for v in vals", label: "loop over strings" }] }],
      key: "Convert first, then aggregate. <code>sum(map(int, vals))</code> does the same thing.",
      mistakes: ["<code>sum([\"1\",\"2\"])</code> raises TypeError.", "Sorting numeric strings sorts alphabetically: <code>\"10\" &lt; \"9\"</code>."],
      alts: [
        { q: "map and reduce. What prints?", code: `from functools import reduce
vals = ["1", "2", "3"]
print(sum(map(int, vals)))
print(reduce(lambda a, b: a + b, vals))
print("".join(vals))`, answer: `6
123
123` },
        { q: "String vs number ordering. What prints?", code: `print(sorted(["10", "9", "2"]), max(["10", "9"]), max([10, 9]))`, answer: "['10', '2', '9'] 9 10" }
      ]
    },
    {
      id: "q3-9",
      title: "Nested dict lookup",
      tags: ["dicts", "nested"],
      prompt: "What does the following code print?",
      code: `students = { "Alice": {"math": 90, "cs": 85}, "Bob": {"math": 70, "cs": 95} }
print(students["Bob"]["cs"])`,
      output: "95",
      choices: ["70", "95", "Error", "85"],
      answer: 1,
      explain: "Read left to right: <code>students[\"Bob\"]</code> → <code>{\"math\": 70, \"cs\": 95}</code>, then <code>[\"cs\"]</code> → <b>95</b>.<br><br><b>70</b> is Bob's math. <b>85</b> is Alice's cs. <b>Error</b>: both keys exist.",
      anatomy: [{ code: "students[\"Bob\"][\"cs\"]", notes: [{ at: "[\"Bob\"]", label: "outer dict → Bob's dict" }, { at: "[\"cs\"]", label: "inner dict → 95" }] }],
      key: "Chain brackets one level at a time. <code>dict(d)</code> / <code>d.copy()</code> is <b>shallow</b>: inner dicts are still shared.",
      mistakes: ["Assuming a copy of the outer dict also copies the inner dicts."],
      alts: [
        { q: "Shallow copy shares inner dicts. What prints?", code: `import copy
students = {"Bob": {"cs": 95}}
shallow = dict(students)
deep = copy.deepcopy(students)
shallow["Bob"]["cs"] = 0
print(students["Bob"]["cs"], deep["Bob"]["cs"])`, answer: "0 95" },
        { q: "Dict comprehension over nested data. What prints?", code: `students = {"Alice": {"math": 90, "cs": 85}, "Bob": {"math": 70, "cs": 95}}
print({n: g["cs"] for n, g in students.items() if g["cs"] > 90})
print(students["Alice"].get("art", 0))`, answer: `{'Bob': 95}
0` }
      ]
    },
    {
      id: "q3-10",
      title: "Nested comprehension pairs",
      tags: ["comprehensions"],
      prompt: "What is the result of:",
      code: `pairs = [(x, y) for x in [1, 2] for y in [3, 4]]
print(pairs)`,
      output: "[(1, 3), (1, 4), (2, 3), (2, 4)]",
      choices: ["[(1, 3), (2, 4)]", "[(1, 2), (3, 4)]", "[(1, 3), (1, 4), (2, 3), (2, 4)]", "[(3, 1), (4, 1), (3, 2), (4, 2)]"],
      answer: 2,
      explain: "Two <code>for</code>s = <b>nested loops</b>, read left to right as outer → inner. For each x, y runs through all of [3, 4]. That's every combination (2 × 2 = 4 pairs).<br><br><b>[(1, 3), (2, 4)]</b> is <code>zip</code> (pairs side by side). <b>[(3, 1), …]</b> has the tuple order flipped. <b>[(1, 2), (3, 4)]</b> just splits the inputs.",
      anatomy: [{ code: "[(x, y) for x in [1, 2] for y in [3, 4]]", notes: [{ at: "(x, y)", label: "output tuple" }, { at: "for x", label: "OUTER loop" }, { at: "for y", label: "INNER loop" }] }],
      trace: `same as:
for x in [1, 2]:        # outer
    for y in [3, 4]:    # inner
        append((x, y))
x=1: (1,3) (1,4)
x=2: (2,3) (2,4)`,
      key: "Multiple <code>for</code>s in a comprehension = nested loops in the SAME order you'd write them.",
      mistakes: ["Confusing a nested comprehension with <code>zip</code>.", "Thinking the last <code>for</code> is the outer loop."],
      alts: [
        { q: "zip vs nested. What prints?", code: `print(list(zip([1, 2], [3, 4])))
print([(x, y) for x in [1, 2] for y in [3, 4] if x + y == 5])`, answer: `[(1, 3), (2, 4)]
[(1, 4), (2, 3)]` },
        { q: "List of lists vs flatten. What prints?", code: `print([[x * y for y in [3, 4]] for x in [1, 2]])
print([n for row in [[1, 2], [3]] for n in row])`, answer: `[[3, 4], [6, 8]]
[1, 2, 3]` }
      ]
    }
    ]
  },
  // ======================================================= QUIZ 4
  {
    id: "q4",
    title: "Quiz 4: Functions, Scope, Recursion, Defaults, *args/**kwargs",
    intro: "<p>Topics: <code>return</code> vs <code>print</code>, the <code>global</code> keyword, local variables shadowing globals, recursion and base cases, default arguments (including the <b>mutable default</b> trap), and <code>*args</code>/<code>**kwargs</code>.</p>",
    items: [
    {
      id: "q4-1",
      title: "Function that returns a sum",
      tags: ["functions"],
      prompt: "Which is the correct way to define a Python function that takes two parameters and returns their sum?",
      code: `def add(a, b):
    return a + b

def add_print(a, b):
    print(a + b)

print(add(2, 3))
r = add_print(2, 3)
print(r)`,
      output: `5
5
None`,
      choices: ["def add(a, b): print(a + b)", "function add(a, b): return a + b", "def add(a, b): sum = a + b", "def add(a, b): return a + b"],
      answer: 3,
      explain: "Python uses <code>def</code>, and \"returns\" means <code>return</code>.<br><br><code>print</code> only <b>shows</b> the value; the function still returns <b>None</b> (see the demo). <code>function</code> is JavaScript, not Python. <code>sum = a + b</code> computes but returns nothing (None), and also shadows the built-in <code>sum</code>.",
      key: "No <code>return</code> → the function returns <code>None</code>. print ≠ return.",
      mistakes: ["Using <code>print</code> when the question says \"return.\"", "Naming a variable <code>sum</code>, <code>list</code>, <code>max</code>, which hides the built-in."],
      alts: [
        { q: "What prints?", code: `def f(a, b):
    total = a + b
print(f(1, 2))`, answer: "None" },
        { q: "Returning multiple values. What prints?", code: `def f():
    return 1, 2
r = f()
x, y = f()
print(r, type(r).__name__, x + y)`, answer: "(1, 2) tuple 3" },
        { q: "<code>return</code> ends the function immediately. What prints?", code: `def first_even(nums):
    for n in nums:
        if n % 2 == 0:
            return n
    return -1
print(first_even([3, 8, 4]), first_even([1, 5]))`, answer: "8 -1" }
      ]
    },
    {
      id: "q4-2",
      title: "The global keyword",
      tags: ["scope"],
      prompt: "Which keyword is used inside a function to modify a variable declared at the global level?",
      code: `count = 0

def inc():
    global count
    count += 1

inc()
inc()
print(count)`,
      output: "2",
      choices: ["extern", "var", "global", "scope"],
      answer: 2,
      explain: "<code>global count</code> tells Python \"when I assign <code>count</code> here, I mean the module-level one.\" Without it, <code>count += 1</code> would try to make a <b>new local</b> and crash (UnboundLocalError).<br><br><b>extern</b> is C. <b>var</b> is JavaScript. <b>scope</b> isn't a keyword.",
      key: "You need <code>global</code> only to <b>rebind</b> (<code>=</code>, <code>+=</code>) a global. Reading it, or <b>mutating</b> a global list/dict (<code>.append</code>), works without it.",
      mistakes: ["Thinking you need <code>global</code> to call <code>lst.append(...)</code> on a global list.", "Forgetting that any assignment anywhere in a function makes that name local for the WHOLE function."],
      alts: [
        { q: "Without <code>global</code>. What prints?", code: `count = 0
def inc():
    try:
        count += 1
    except UnboundLocalError:
        print("UnboundLocalError")
inc()
print(count)`, answer: `UnboundLocalError
0` },
        { q: "Mutating a global list needs no <code>global</code>. What prints?", code: `items = []
def add(x):
    items.append(x)
add(1)
add(2)
print(items)`, answer: "[1, 2]" },
        { q: "<code>nonlocal</code> for nested functions. What prints?", code: `def outer():
    n = 0
    def inner():
        nonlocal n
        n += 5
    inner()
    inner()
    return n
print(outer())`, answer: "10" }
      ]
    },
    {
      id: "q4-3",
      title: "Local x shadows global x",
      tags: ["scope"],
      prompt: "What is the output of the following code?",
      code: `x = 5
def foo():
    x = 10
    print(x)
foo()
print(x)`,
      output: `10
5`,
      choices: ["5 then 5", "5 then 10", "10 then 10", "10 then 5"],
      answer: 3,
      explain: "Inside <code>foo</code>, <code>x = 10</code> creates a <b>new local</b> x. It prints 10. When foo ends, that local disappears. The global x was never touched, so the second print shows <b>5</b>.<br><br><b>10 then 10</b> would need <code>global x</code>. <b>5 then …</b> would mean the local print saw the global, but the local shadows it.",
      trace: `global: x = 5
foo():  local x = 10 → print 10   (global x still 5)
back:   print global x → 5`,
      key: "Assignment inside a function → local (unless <code>global</code>). Locals vanish when the function returns.",
      mistakes: ["Thinking the assignment inside the function changes the global."],
      alts: [
        { q: "Read-only access sees the global. What prints?", code: `x = 5
def foo():
    print(x)
foo()`, answer: "5" },
        { q: "Read BEFORE the local assignment. What prints?", code: `x = 5
def foo():
    try:
        print(x)
    except UnboundLocalError:
        print("UnboundLocalError")
    x = 10
foo()`, answer: "UnboundLocalError" },
        { q: "With <code>global</code>. What prints?", code: `x = 5
def foo():
    global x
    x = 10
    print(x)
foo()
print(x)`, answer: `10
10` }
      ]
    },
    {
      id: "q4-4",
      title: "Local vs global: true statement",
      tags: ["scope"],
      prompt: "Which of the following is true about local and global variables?",
      code: `name = "global"
def show():
    name = "local"
    print("inside:", name)
show()
print("outside:", name)`,
      output: `inside: local
outside: global`,
      choices: ["Global variables are automatically passed as arguments to functions.", "A global variable cannot be accessed inside a function.", "A local variable with the same name as a global variable hides the global one inside the function.", "Local variables always overwrite global variables."],
      answer: 2,
      explain: "Inside the function, the local <code>name</code> <b>shadows</b> (hides) the global one. Outside, the global is unchanged.<br><br><b>Auto-passed as arguments</b>: no, globals are just visible by name lookup (LEGB: Local → Enclosing → Global → Built-in). <b>Cannot be accessed</b>: you can <b>read</b> globals inside functions. <b>Always overwrite</b>: a local never changes the global (the demo proves it).",
      key: "LEGB lookup: Local, Enclosing, Global, Built-in. Nearest wins.",
      mistakes: ["Confusing <b>rebinding</b> a parameter (no effect outside) with <b>mutating</b> it (visible outside)."],
      alts: [
        { q: "Parameter shadows global. What prints?", code: `x = 1
def f(x):
    x = x + 1
    return x
print(f(10), x)`, answer: "11 1" },
        { q: "Mutate vs rebind a list parameter. What prints?", code: `a = [1]
def f(lst):
    lst.append(2)
    lst = [9]
    lst.append(3)
f(a)
print(a)`, answer: "[1, 2]" },
        { q: "Shadowing a built-in. What prints?", code: `def f(nums):
    max = 0
    for n in nums:
        if n > max:
            max = n
    return max
print(f([3, 7, 2]), max(1, 4))`, answer: "7 4" }
      ]
    },
    {
      id: "q4-5",
      title: "Recursion needs a base case",
      tags: ["recursion"],
      prompt: "Which of the following statements about recursion is true?",
      code: `def countdown(n):
    if n == 0:          # base case
        print("Go!")
        return
    print(n)
    countdown(n - 1)    # recursive case

countdown(3)

def no_base(n):
    return no_base(n - 1)

try:
    no_base(5)
except RecursionError:
    print("RecursionError")`,
      output: `3
2
1
Go!
RecursionError`,
      choices: ["A recursive function must always have a base case.", "Recursion cannot be used with keyword arguments.", "Python recursion never stops, even without a base case.", "Recursive functions are always faster than loops."],
      answer: 0,
      explain: "The <b>base case</b> is the stop sign. Without it the function calls itself forever until Python hits its recursion limit (about 1000) and raises <b>RecursionError</b>.<br><br><b>Keyword arguments</b> work fine in recursive calls. <b>Never stops</b>: Python stops it with RecursionError. <b>Always faster</b>: usually slower (extra function-call overhead).",
      key: "Every recursive function = base case (stop) + recursive case (smaller problem).",
      mistakes: ["Recursive step that doesn't move toward the base case (e.g. <code>f(n)</code> instead of <code>f(n-1)</code>)."],
      alts: [
        { q: "Print AFTER the recursive call. What prints?", code: `def show(n):
    if n == 0:
        return
    show(n - 1)
    print(n, end=" ")
show(3)`, answer: "1 2 3" },
        { q: "What prints?", code: `def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(sum_to(4), fib(6))`, answer: "10 8" }
      ]
    },
    {
      id: "q4-6",
      title: "Recursive factorial blank",
      tags: ["recursion"],
      prompt: "Fill in the blank to complete a recursive factorial function:<pre><code>def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return __________</code></pre>",
      code: `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(4))`,
      output: "24",
      choices: ["factorial(n)", "n + factorial(n-1)", "factorial(n-1)", "n * factorial(n-1)"],
      answer: 3,
      explain: "n! = n × (n−1)!. So the recursive case is <code>n * factorial(n-1)</code>.<br><br><b>factorial(n)</b> never gets smaller, so it's infinite recursion (RecursionError). <b>n + factorial(n-1)</b> adds instead of multiplying (factorial(4) would give 11). <b>factorial(n-1)</b> drops the n, so every call returns 1.",
      trace: `factorial(4) = 4 * factorial(3)
                   factorial(3) = 3 * factorial(2)
                                      factorial(2) = 2 * factorial(1)
                                                         factorial(1) = 1 * factorial(0)
                                                                            factorial(0) = 1  ← base
unwind: 1 → 1*1=1 → 2*1=2 → 3*2=6 → 4*6=24`,
      key: "Recursive case must (1) shrink the input and (2) combine with the current n.",
      mistakes: ["Forgetting to multiply by n.", "Base case <code>n == 1</code> breaks on <code>factorial(0)</code> (it recurses forever)."],
      alts: [
        { q: "With the wrong blank <code>n + factorial(n-1)</code>. What prints?", code: `def factorial(n):
    if n == 0:
        return 1
    return n + factorial(n-1)
print(factorial(4))`, answer: "11" },
        { q: "Recursive power. What prints?", code: `def power(b, e):
    if e == 0:
        return 1
    return b * power(b, e - 1)
print(power(2, 5), power(7, 0))`, answer: "32 1" }
      ]
    },
    {
      id: "q4-7",
      title: "Default argument greet()",
      tags: ["functions", "defaults"],
      prompt: "What will the following code print?",
      code: `def greet(name="Guest"):
    print("Hello,", name)
greet()
greet("Alice")`,
      output: `Hello, Guest
Hello, Alice`,
      choices: ["Hello, then Hello, Alice", "Hello, Guest then Hello, Alice", "Hello, name then Hello, name", "Error: default arguments not allowed"],
      answer: 1,
      explain: "No argument → the default <code>\"Guest\"</code> is used. With an argument, it replaces the default. <code>print</code> with two arguments puts a space between them.<br><br><b>\"Hello, name\"</b> would print the literal text, but <code>name</code> has no quotes so it's the variable. <b>\"Hello, \"</b> (empty): the default fills it in. <b>Error</b>: defaults are completely normal Python.",
      anatomy: [{ code: "def greet(name=\"Guest\"):", notes: [{ at: "name", label: "parameter" }, { at: "\"Guest\"", label: "default if not passed" }] }],
      key: "Default values are evaluated <b>ONCE</b>, when <code>def</code> runs. A mutable default (<code>[]</code>, <code>{}</code>) is shared between calls. Use <code>None</code> instead.",
      mistakes: ["Using <code>def f(x, bag=[])</code> and expecting a fresh list each call.", "Putting a non-default parameter after a default one (<code>def f(a=1, b)</code> is a SyntaxError)."],
      alts: [
        { q: "Mutable default trap. What prints?", code: `def add_item(item, bag=[]):
    bag.append(item)
    return bag
print(add_item(1))
print(add_item(2))
print(add_item(3, []))`, answer: `[1]
[1, 2]
[3]` },
        { q: "The <code>None</code> fix. What prints?", code: `def add_item(item, bag=None):
    if bag is None:
        bag = []
    bag.append(item)
    return bag
print(add_item(1))
print(add_item(2))`, answer: `[1]
[2]` },
        { q: "Defaults are captured at def time. What prints?", code: `n = 5
def f(x=n):
    return x
n = 10
print(f())
def g(a, b=2, c=3):
    print(a, b, c)
g(1, c=9)`, answer: `5
1 2 9` }
      ]
    },
    {
      id: "q4-8",
      title: "Any number of positional args",
      tags: ["functions", "*args"],
      prompt: "Which function definition correctly accepts any number of positional arguments?",
      code: `def func(*args):
    print(args, type(args).__name__, sum(args))

func(1, 2, 3)
func()`,
      output: `(1, 2, 3) tuple 6
() tuple 0`,
      choices: ["def func(*args): ...", "def func(**args): ...", "def func(args): ...", "def func(&amp;args): ..."],
      answer: 0,
      explain: "A single <code>*</code> packs any extra positional arguments into a <b>tuple</b> (possibly empty).<br><br><b>**args</b> collects <b>keyword</b> arguments into a dict (the name doesn't matter, the stars do). <b>args</b> with no star accepts exactly one argument. <b>&amp;args</b> isn't Python syntax (that's C/C++).",
      anatomy: [{ code: "def func(*args):", notes: [{ at: "*", label: "pack extra positionals" }, { at: "args", label: "a tuple" }] }],
      key: "<code>*</code> in a def = pack into a tuple. <code>*</code> in a call = unpack a sequence into separate args.",
      mistakes: ["Thinking <code>args</code> is a list. It's a <b>tuple</b>.", "Passing a list without <code>*</code>, which gives ONE argument (the list)."],
      alts: [
        { q: "Pack vs unpack. What prints?", code: `def f(*args):
    return len(args)
nums = [1, 2, 3]
print(f(nums), f(*nums), f())`, answer: "1 3 0" },
        { q: "What prints?", code: `def f(first, *rest):
    print(first, rest)
f(1)
f(1, 2, 3)`, answer: `1 ()
1 (2, 3)` }
      ]
    },
    {
      id: "q4-9",
      title: "*args vs **kwargs",
      tags: ["functions", "*args", "**kwargs"],
      prompt: "What is the difference between <code>*args</code> and <code>**kwargs</code> in function definitions?",
      code: `def show(*args, **kwargs):
    print(args)
    print(kwargs)

show(1, 2, a=3, b=4)`,
      output: `(1, 2)
{'a': 3, 'b': 4}`,
      choices: ["Both collect only keyword arguments.", "*args collects extra positional arguments, **kwargs collects extra keyword arguments.", "Both collect only positional arguments.", "*args collects keyword arguments, **kwargs collects positional arguments."],
      answer: 1,
      explain: "<b>One star</b> → extra <b>positional</b> args → <b>tuple</b>.<br><b>Two stars</b> → extra <b>keyword</b> (<code>name=value</code>) args → <b>dict</b>.<br><br>The other choices either say they're the same or swap them. The last choice is the classic flipped trap.",
      anatomy: [{ code: "show(1, 2, a=3, b=4)", notes: [{ at: "1, 2", label: "positional → args tuple" }, { at: "a=3, b=4", label: "keyword → kwargs dict" }] }],
      key: "* → tuple of positionals. ** → dict of keywords. In a call, <code>**d</code> unpacks a dict into keyword args.",
      mistakes: ["Swapping which one is the tuple and which is the dict.", "Putting a positional argument after a keyword argument in a call (SyntaxError)."],
      alts: [
        { q: "Unpacking a dict into a call. What prints?", code: `def f(a, b):
    return a - b
print(f(**{"b": 1, "a": 5}))
opts = {"sep": "-"}
print(1, 2, 3, **opts)`, answer: `4
1-2-3` },
        { q: "Looping over kwargs. What prints?", code: `def f(**kw):
    for k, v in kw.items():
        print(k, v)
f(x=1, y=2)`, answer: `x 1
y 2` }
      ]
    },
    {
      id: "q4-10",
      title: "func(a, b=2, *args, **kwargs)",
      tags: ["functions", "*args", "**kwargs", "defaults"],
      prompt: "What will the following code output?",
      code: `def func(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)
func(1, 3, 4, 5, x=10, y=20)`,
      output: "1 3 (4, 5) {'x': 10, 'y': 20}",
      choices: ["Error: too many arguments", "1 2 (3, 4, 5) {'x': 10, 'y': 20}", "1 3 () {}", "1 3 (4, 5) {'x': 10, 'y': 20}"],
      answer: 3,
      explain: "Positional arguments fill slots <b>left to right</b>: <code>1→a</code>, <code>3→b</code> (overriding the default 2), leftovers <code>4, 5→args</code>. Keyword args that don't match a parameter name go to <code>kwargs</code>.<br><br><b>1 2 (3, 4, 5)</b>: wrong, a default never \"skips\" a positional argument; 3 lands in b. <b>1 3 () {}</b> ignores the extras. <b>Error</b>: <code>*args</code>/<code>**kwargs</code> soak up any extras.",
      anatomy: [{ code: "def func(a, b=2, *args, **kwargs):", notes: [{ at: "a,", label: "required positional" }, { at: "b=2", label: "default (can be overridden)" }, { at: "*args", label: "extra positionals → tuple" }, { at: "**kwargs", label: "extra keywords → dict" }] }],
      trace: `call: func(1, 3, 4, 5, x=10, y=20)
  a      ← 1
  b      ← 3        (default 2 overridden)
  args   ← (4, 5)
  kwargs ← {'x': 10, 'y': 20}`,
      key: "Order in a def: normal → defaults → *args → **kwargs. Positionals fill left to right before anything goes into args.",
      mistakes: ["Thinking the default makes b get skipped.", "Passing the same parameter twice, like <code>func(1, 2, b=3)</code>, which is a TypeError."],
      alts: [
        { q: "What prints?", code: `def func(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)
func(1)
func(1, x=5)
func(1, b=7, z=0)`, answer: `1 2 () {}
1 2 () {'x': 5}
1 7 () {'z': 0}` },
        { q: "Same parameter twice. What prints?", code: `def func(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)
try:
    func(1, 2, b=3)
except TypeError:
    print("TypeError")`, answer: "TypeError" },
        { q: "Unpacking into it. What prints?", code: `def func(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)
func(*[1, 2, 3], **{"k": 4})`, answer: "1 2 (3,) {'k': 4}" }
      ]
    }
    ]
  }
  ]
};
