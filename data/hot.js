// Most-likely exam patterns (outputs verified with python3)
window.HOT = [
 {
  "id": "alias",
  "title": "Repeated inner list with *",
  "why": "<code>[[0]*3]*2</code> = 2 arrows to ONE row. Mutating one row changes “both”.",
  "src": "Practice A1, HW2 S2, Lecture 4",
  "code": "m = [[0] * 3] * 2\nm[1][0] = 5\nprint(m)",
  "out": "[[5, 0, 0], [5, 0, 0]]"
 },
 {
  "id": "copy",
  "title": "Shallow copy of nested lists",
  "why": "<code>a[:]</code> copies only the outer list. Inner lists are shared, so <code>b[0].append</code> shows in <code>a</code>, but <code>b.append</code> doesn't.",
  "src": "Practice B1, HW2 S5",
  "code": "a = [[1], [2]]\nb = a[:]\nb[0].append(9)\nb.append([3])\nprint(a)\nprint(b)",
  "out": "[[1, 9], [2]]\n[[1, 9], [2], [3]]"
 },
 {
  "id": "merge",
  "title": "1 == 1.0 == True in sets/dicts",
  "why": "Equal values with the same hash = one key. A dict keeps the <b>first key</b> and the <b>last value</b>. <code>\"\"</code> is not 0.",
  "src": "Practice A3/C1, HW2 S3/Q3",
  "code": "d = {1: \"a\", True: \"b\", 1.0: \"c\"}\ns = {0, False, 0.0, \"\"}\nprint(d, s, len(s))",
  "out": "{1: 'c'} {0, ''} 2"
 },
 {
  "id": "default",
  "title": "Mutable default argument",
  "why": "The default list is created once at <code>def</code> time and shared by every call. Both results are the same list.",
  "src": "Practice A9, HW3 S1",
  "code": "def f(x, acc=[]):\n    acc.append(x)\n    return acc\n\nr1 = f(1)\nr2 = f(2)\nprint(r1, r2, r1 is r2)",
  "out": "[1, 2] [1, 2] True"
 },
 {
  "id": "classattr",
  "title": "Class attribute: mutate vs assign",
  "why": "<code>self.members.append</code> mutates the shared class list. <code>self.count += 1</code> creates an instance attribute, so <code>Team.count</code> stays 0.",
  "src": "Practice A10, HW3 S4",
  "code": "class Team:\n    members = []\n    count = 0\n    def join(self, name):\n        self.members.append(name)\n        self.count += 1\n\na = Team(); b = Team()\na.join(\"x\"); b.join(\"y\")\nprint(a.members, a.count, Team.count)",
  "out": "['x', 'y'] 1 0"
 },
 {
  "id": "lazy",
  "title": "map is one-shot; reduce folds left",
  "why": "<code>sum(m)</code> consumes the iterator, so <code>list(m)</code> is empty. <code>(10-2)-3 = 5</code>. With tuples you need the initial <code>0</code>.",
  "src": "Practice A7/A8/D1",
  "code": "from functools import reduce\nm = map(lambda x: x * 2, [1, 2, 3])\nprint(sum(m), list(m))\nprint(reduce(lambda acc, x: acc - x, [10, 2, 3]))\nprint(reduce(lambda acc, r: acc + r[1], [(\"a\", 4), (\"b\", 5)], 0))",
  "out": "12 []\n5\n9"
 },
 {
  "id": "comp",
  "title": "Comprehensions: nested, dict overwrite, set filter",
  "why": "The first <code>for</code> is the outer loop. A repeated dict key keeps its last value. A set removes duplicates.",
  "src": "Practice A4–A6, Quiz 3 Q10",
  "code": "print([(i, j) for i in range(3) for j in range(i)])\nprint({w[0]: w for w in [\"ab\", \"ac\", \"b\"]})\nprint({x % 3 for x in range(10) if x > 4})",
  "out": "[(1, 0), (2, 0), (2, 1)]\n{'a': 'ac', 'b': 'b'}\n{0, 1, 2}"
 },
 {
  "id": "late",
  "title": "Late-binding lambdas",
  "why": "Lambdas look up <code>i</code> when called, after the loop ended, so all see 2. <code>i=i</code> freezes each value as a default.",
  "src": "HW3 S2",
  "code": "fs = [lambda: i * 10 for i in range(3)]\ngs = [lambda i=i: i * 10 for i in range(3)]\nprint([f() for f in fs], [g() for g in gs])",
  "out": "[20, 20, 20] [0, 10, 20]"
 },
 {
  "id": "eqhash",
  "title": "__eq__ without __hash__",
  "why": "Defining <code>__eq__</code> sets <code>__hash__ = None</code>, so the object can't go in a set or be a dict key.",
  "src": "Practice D2, HW3 S6",
  "code": "class P:\n    def __init__(self, n):\n        self.n = n\n    def __eq__(self, other):\n        return isinstance(other, P) and self.n == other.n\n\nprint(P(1) == P(1), P.__hash__)\ntry:\n    print({P(1)})\nexcept TypeError as e:\n    print(type(e).__name__)",
  "out": "True None\nTypeError"
 },
 {
  "id": "scope",
  "title": "Scope: reading vs assigning a global",
  "why": "Assigning <code>x</code> anywhere in <code>h</code> makes it local in all of <code>h</code>, so reading it first is an UnboundLocalError. The global stays 1.",
  "src": "Lecture 3, Quiz 4",
  "code": "x = 1\ndef g():\n    print(x)\ndef h():\n    try:\n        print(x)\n    except UnboundLocalError as e:\n        print(type(e).__name__)\n    x = 2\ng(); h(); print(x)",
  "out": "1\nUnboundLocalError\n1"
 }
];
