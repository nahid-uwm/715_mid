// CS 715 midterm: lecture examples (generated, verified with python3)
window.PAGE = {
 "key": "lectures",
 "title": "Lecture Notes 1–5",
 "intro": "<p>Every code example from Lectures 1–5, rebuilt as clean, runnable Python. Predict the output first, then check the explanation, trace and anatomy. Each item ends with exam-style variations. Midterm focus: shared references and copying, how hashing and equality decide set/dict membership, list/tuple/set/dict operations, comprehensions, map/filter/reduce, default arguments and scope, instance vs class attributes, and <code>__eq__</code>/<code>__hash__</code>/<code>__str__</code>.</p>",
 "sections": [
  {
   "id": "l1",
   "title": "Lecture 1: Python Overview and Syntax",
   "intro": "<p><b>Ideas:</b> Python is imperative with functional features, object-oriented, and interpreted. Variables are not declared. <code>int</code> has unlimited precision and <code>float</code> is a 64-bit double. There is no automatic to-string conversion. You create an object by calling its class (no <code>new</code>). The lecture also previews control flow, functions, classes, exceptions, imports, comprehensions/lambda, file IO and type annotations. (The TensorFlow GPU check from Homework 1 is left out: it needs TensorFlow.)</p>",
   "items": [
    {
     "id": "l1-values",
     "title": "Variables and literal values",
     "prompt": "Each variable gets a different kind of literal. Predict the type name printed next to each value.",
     "code": "x = 10                              # int\ny = 3.14                            # float\nname = \"Alice\"                      # str\nflag = True                         # bool\nnums = [1, 2, 3]                    # list\npoint = (2, 3)                      # tuple\nperson = {\"age\": 30, \"city\": \"NY\"}  # dict\n\nfor v in (x, y, name, flag, nums, point, person):\n    print(type(v).__name__, v)",
     "output": "int 10\nfloat 3.14\nstr Alice\nbool True\nlist [1, 2, 3]\ntuple (2, 3)\ndict {'age': 30, 'city': 'NY'}",
     "explain": "Python variables are <b>never declared</b> (no <code>var</code>, <code>let</code>, <code>val</code>). A variable is created the first time you assign to it, and its type comes from the <b>value</b>, not from the name.<br><br>Facts from the instructor's notes:<br>&bull; <code>int</code> has <b>unlimited precision</b> (it can be as big as memory allows, handy for cryptography).<br>&bull; <code>float</code> is <b>64-bit</b>, the same as Java's <code>double</code>.<br>&bull; A dict literal like <code>{\"age\": 30}</code> is unusual among languages, and tuples are more common in functional languages.",
     "tags": [
      "types"
     ],
     "key": "Type belongs to the value. <code>int</code> = unlimited size, <code>float</code> = 64-bit double.",
     "lookFor": [
      "<code>type(v).__name__</code>",
      "very large integer arithmetic",
      "float equality tests"
     ],
     "mistakes": [
      "Thinking <code>int</code> overflows like Java/C. <code>2**100</code> is exact in Python.",
      "Expecting <code>0.1 + 0.2 == 0.3</code>. Floats are 64-bit binary, so it is <code>False</code>."
     ],
     "alts": [
      {
       "q": "Python ints have unlimited precision. What prints?",
       "code": "print(2 ** 100)",
       "answer": "1267650600228229401496703205376"
      },
      {
       "q": "float is a 64-bit double. What prints?",
       "code": "print(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)",
       "answer": "0.30000000000000004\nFalse"
      },
      {
       "q": "bool is a subclass of int. What prints?",
       "code": "print(True + True, type(True + True).__name__)",
       "answer": "2 int"
      }
     ]
    },
    {
     "id": "l1-control",
     "title": "if / elif / else, for, while",
     "prompt": "With <code>x = 10</code>, which branch prints, what does the <code>for</code> loop print, and what is <code>x</code> after the <code>while</code> loop?",
     "code": "x = 10\n\n# If / elif / else\nif x > 5:\n    print(\"big\")\nelif x == 5:\n    print(\"equal\")\nelse:\n    print(\"small\")\n\n# For loop\nfor i in range(5):\n    print(i)\n\n# While loop\nwhile x > 0:\n    x -= 1\nprint(\"x after while:\", x)",
     "output": "big\n0\n1\n2\n3\n4\nx after while: 0",
     "explain": "Only the <b>first</b> true branch of an <code>if/elif/else</code> runs. <code>range(5)</code> is 0, 1, 2, 3, 4 (5 is excluded). The <code>while</code> loop keeps subtracting 1 until <code>x &gt; 0</code> is false, so it stops at 0.<br><br>Instructor's view: the <code>for</code> loop is like a <b>comprehension</b> (it walks through a collection exactly once), while <code>while</code> is pure control flow.",
     "trace": "x before | x > 0 ? | x after\n10       | True    | 9\n...      | ...     | ...\n1        | True    | 0\n0        | False   | (loop ends)",
     "tags": [
      "control flow"
     ],
     "key": "<code>range(n)</code> stops <b>before</b> n. Only the first true branch of if/elif runs.",
     "mistakes": [
      "Expecting <code>range(5)</code> to include 5.",
      "Thinking both <code>if</code> and <code>elif</code> run when both are true."
     ],
     "alts": [
      {
       "q": "What prints when x is 5?",
       "code": "x = 5\nif x > 5:\n    print(\"big\")\nelif x == 5:\n    print(\"equal\")\nelse:\n    print(\"small\")",
       "answer": "equal"
      },
      {
       "q": "How many times does the loop body run?",
       "code": "x = 7\ncount = 0\nwhile x > 0:\n    x -= 2\n    count += 1\nprint(count, x)",
       "answer": "4 -1"
      }
     ]
    },
    {
     "id": "l1-func-fstring",
     "title": "Functions, f-strings, no automatic to-string",
     "prompt": "<code>greet</code> builds a string with an f-string. What happens when you try <code>\"Age: \" + 30</code> instead?",
     "code": "def greet(name: str) -> str:\n    return f\"Hello, {name}\"\n\nprint(greet(\"Alice\"))\n\nage = 30\nprint(f\"Age: {age}\")         # f-string formats the int for you\ntry:\n    print(\"Age: \" + age)     # str + int: no automatic conversion\nexcept TypeError as e:\n    print(type(e).__name__)\nprint(\"Age: \" + str(age))    # explicit conversion works",
     "output": "Hello, Alice\nAge: 30\nTypeError\nAge: 30",
     "explain": "Python does <b>not</b> convert to string automatically (unlike Java's <code>\"Age: \" + 30</code>). <code>str + int</code> raises <code>TypeError</code>.<br><br>Two fixes: put the value inside an f-string <code>{age}</code>, or call <code>str(age)</code>. The notes point out that <code>str</code> is a <b>class</b>: <code>str(n)</code> creates a new str object (like <code>new String(n)</code> in Java, but without <code>new</code>). It is fine to think of it as a conversion function.",
     "anatomy": [
      {
       "code": "return f\"Hello, {name}\"",
       "notes": [
        {
         "at": "f\"",
         "label": "f prefix = format string"
        },
        {
         "at": "{name}",
         "label": "expression inserted"
        }
       ]
      }
     ],
     "tags": [
      "strings",
      "types"
     ],
     "key": "<code>str + int</code> is a <code>TypeError</code>. Use an f-string or <code>str(x)</code>.",
     "mistakes": [
      "Writing <code>\"Total: \" + 5</code> and expecting <code>Total: 5</code>.",
      "Thinking type hints (<code>name: str</code>) are enforced. They are not checked at run time."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "print(\"5\" + str(5))\nprint(5 + int(\"5\"))\nprint(\"5\" * 3)",
       "answer": "55\n10\n555"
      },
      {
       "q": "What is printed (exception type only)?",
       "code": "try:\n    print(1 + \"1\")\nexcept Exception as e:\n    print(type(e).__name__)",
       "answer": "TypeError"
      }
     ]
    },
    {
     "id": "l1-class",
     "title": "Classes: objects are created by calling the class",
     "prompt": "Define <code>Dog</code> and create one. Notice there is no <code>new</code> keyword. What does <code>d.bark()</code> print?",
     "code": "class Dog:\n    def __init__(self, name: str):\n        self.name = name\n\n    def bark(self) -> None:\n        print(self.name, \"says woof!\")\n\nd = Dog(\"Rex\")   # calling the class makes a new object (no 'new')\nd.bark()\nprint(type(d).__name__, d.name)",
     "output": "Rex says woof!\nDog Rex",
     "explain": "You create an object by <b>calling the class like a function</b>: <code>Dog(\"Rex\")</code>. Python then runs <code>__init__</code> with <code>self</code> = the new object.<br><br><code>print(a, b)</code> puts <b>one space</b> between its arguments, so the output is <code>Rex says woof!</code>.",
     "anatomy": [
      {
       "code": "d = Dog(\"Rex\")",
       "notes": [
        {
         "at": "Dog(",
         "label": "call the class"
        },
        {
         "at": "\"Rex\"",
         "label": "passed to __init__ name"
        }
       ]
      }
     ],
     "tags": [
      "classes"
     ],
     "key": "Object creation = calling the class: <code>Dog(\"Rex\")</code>. No <code>new</code>.",
     "mistakes": [
      "Writing <code>new Dog(\"Rex\")</code> (Java habit): a SyntaxError in Python.",
      "Forgetting <code>self</code> as the first parameter of a method."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "class Cat:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + \" says meow\"\n\nc = Cat(\"Tom\")\nprint(c.speak())\nprint(isinstance(c, Cat))",
       "answer": "Tom says meow\nTrue"
      }
     ]
    },
    {
     "id": "l1-exceptions",
     "title": "try / except / finally",
     "prompt": "Dividing by zero raises an exception. Which lines print, and in what order?",
     "code": "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")\nfinally:\n    print(\"Done\")",
     "output": "Cannot divide by zero\nDone",
     "explain": "<code>10 / 0</code> raises <code>ZeroDivisionError</code>, so the <code>except</code> block runs. The <code>finally</code> block <b>always</b> runs last, whether there was an error or not.",
     "tags": [
      "exceptions"
     ],
     "key": "<code>finally</code> always runs.",
     "mistakes": [
      "Thinking <code>finally</code> is skipped when no error happens."
     ],
     "alts": [
      {
       "q": "No error this time. What prints?",
       "code": "try:\n    result = 10 / 2\n    print(result)\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")\nfinally:\n    print(\"Done\")",
       "answer": "5.0\nDone"
      },
      {
       "q": "finally runs even when the function returns. What prints?",
       "code": "def f():\n    try:\n        return \"from try\"\n    finally:\n        print(\"cleanup\")\n\nprint(f())",
       "answer": "cleanup\nfrom try"
      }
     ]
    },
    {
     "id": "l1-imports",
     "title": "import vs from ... import",
     "prompt": "Two import styles. What does <code>math.sqrt(16)</code> print? (<code>randint</code> is random, so we only check its range.)",
     "code": "import math\nfrom random import randint\n\nprint(math.sqrt(16))\nr = randint(1, 10)\nprint(1 <= r <= 10)     # randint includes BOTH ends",
     "output": "4.0\nTrue",
     "explain": "<code>import math</code> gives you a name <code>math</code>, and you write <code>math.sqrt</code>. <code>from random import randint</code> brings <code>randint</code> in directly.<br><br><code>math.sqrt</code> always returns a <b>float</b>: <code>4.0</code>, not <code>4</code>. <code>randint(1, 10)</code> can return 1 or 10 (both ends included, unlike <code>range</code>).",
     "tags": [
      "modules"
     ],
     "key": "<code>math.sqrt</code> returns a float (<code>4.0</code>). <code>randint(a, b)</code> includes b.",
     "mistakes": [
      "Expecting <code>math.sqrt(16)</code> to print <code>4</code>."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "import math\nprint(math.sqrt(25), int(math.sqrt(17)))\nprint(math.sqrt(16) == 4)",
       "answer": "5.0 4\nTrue"
      }
     ]
    },
    {
     "id": "l1-comp-lambda",
     "title": "Comprehension and lambda preview",
     "prompt": "A list comprehension, a set comprehension with a filter, and a lambda. Predict all three results.",
     "code": "squares = [n * n for n in range(5)]           # list comprehension\nevens = {n for n in range(10) if n % 2 == 0}  # set comprehension\ndoubler = lambda x: x * 2\n\nprint(squares)\nprint(evens)\nprint(doubler(5), doubler(\"ab\"))",
     "output": "[0, 1, 4, 9, 16]\n{0, 2, 4, 6, 8}\n10 abab",
     "explain": "<code>[...]</code> builds a list, <code>{...}</code> with single values builds a set. The <code>if</code> keeps only the values that pass.<br><br>A <code>lambda</code> is an anonymous function: <code>lambda x: x * 2</code> works like <code>def doubler(x): return x * 2</code>. Python has no static types, so <code>*</code> on a string repeats it: <code>\"ab\" * 2</code> = <code>\"abab\"</code>.",
     "anatomy": [
      {
       "code": "{n for n in range(10) if n % 2 == 0}",
       "notes": [
        {
         "at": "{n",
         "label": "value kept"
        },
        {
         "at": "for n in range(10)",
         "label": "generator"
        },
        {
         "at": "if n % 2 == 0",
         "label": "filter"
        }
       ]
      }
     ],
     "tags": [
      "comprehensions",
      "lambda"
     ],
     "key": "The brackets decide the result type: <code>[ ]</code> list, <code>{ }</code> set (or dict if there is <code>k: v</code>).",
     "mistakes": [
      "Thinking <code>{n for ...}</code> builds a dict. Without a <code>key: value</code> pair it is a set."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "print([n % 3 for n in range(6)])\nprint({n % 3 for n in range(6)})",
       "answer": "[0, 1, 2, 0, 1, 2]\n{0, 1, 2}"
      },
      {
       "q": "What prints?",
       "code": "f = lambda a, b=10: a + b\nprint(f(1), f(1, 2))",
       "answer": "11 3"
      }
     ]
    },
    {
     "id": "l1-file",
     "title": "File handling with with",
     "prompt": "Write <code>Hello</code> to a file, then read it back. (Adapted: the file goes in the temp folder.)",
     "code": "import os, tempfile\npath = os.path.join(tempfile.gettempdir(), \"data.txt\")\n\nwith open(path, \"w\") as f:\n    f.write(\"Hello\\n\")\n\nwith open(path) as f:\n    print(f.read())",
     "output": "Hello",
     "explain": "<code>with open(...) as f:</code> opens the file and <b>closes it automatically</b> when the block ends. Mode <code>\"w\"</code> creates or <b>overwrites</b>, and the default mode is <code>\"r\"</code> (read).<br><br>The file holds <code>Hello\\n</code> and <code>print</code> adds another newline, so a blank line follows <code>Hello</code>.",
     "tags": [
      "files"
     ],
     "key": "<code>with</code> auto-closes the file. <code>\"w\"</code> overwrites, <code>\"a\"</code> appends.",
     "mistakes": [
      "Thinking <code>\"w\"</code> appends to the file. It erases the old contents first."
     ],
     "alts": [
      {
       "q": "\"w\" vs \"a\" mode. What prints?",
       "code": "import os, tempfile\np = os.path.join(tempfile.gettempdir(), \"t715.txt\")\nwith open(p, \"w\") as f:\n    f.write(\"A\")\nwith open(p, \"w\") as f:\n    f.write(\"B\")\nwith open(p, \"a\") as f:\n    f.write(\"C\")\nwith open(p) as f:\n    print(f.read())",
       "answer": "BC"
      }
     ]
    },
    {
     "id": "l1-types",
     "title": "Type annotations and process_records",
     "prompt": "<code>process_records</code> collects <code>rec.get(key, default)</code> from each record and skips <code>None</code>. Predict <code>scores</code> and <code>names</code>.",
     "code": "from typing import List, Dict, Optional, Union\n\nRecord = Dict[str, Union[int, float, str]]   # type alias\n\ndef add(a: int, b: int) -> int:\n    return a + b\n\ndef process_records(\n    records: List[Record],\n    key: str,\n    default: Optional[Union[int, float]] = None\n) -> List[Union[int, float, str]]:\n    result: List[Union[int, float, str]] = []\n    for rec in records:\n        value = rec.get(key, default)\n        if value is not None:\n            result.append(value)\n    return result\n\ndata = [\n    {\"id\": 1, \"score\": 95.5, \"name\": \"Alice\"},\n    {\"id\": 2, \"score\": 88.0},                  # missing name\n    {\"id\": 3, \"score\": 72.3, \"name\": \"Charlie\"},\n]\nscores = process_records(data, \"score\")\nnames = process_records(data, \"name\", \"N/A\")\nprint(scores)\nprint(names)\nprint(add(2, 3))",
     "output": "[95.5, 88.0, 72.3]\n['Alice', 'N/A', 'Charlie']\n5",
     "explain": "<code>rec.get(key, default)</code> returns the default when the key is missing. Record 2 has no <code>\"name\"</code>, so it gives <code>\"N/A\"</code>. With no default, the result is <code>None</code> and the <code>if value is not None</code> line skips it.<br><br>Annotations (<code>a: int</code>, <code>-&gt; int</code>) are <b>optional hints</b> for tools like MyPy and Pydantic. Python does not enforce them at run time.",
     "anatomy": [
      {
       "code": "value = rec.get(key, default)",
       "notes": [
        {
         "at": "rec.get(",
         "label": "safe lookup"
        },
        {
         "at": "key,",
         "label": "key to find"
        },
        {
         "at": "default)",
         "label": "returned if missing"
        }
       ]
      }
     ],
     "tags": [
      "types",
      "dict"
     ],
     "key": "<code>d.get(k, default)</code> never raises. Type hints are not enforced at run time.",
     "mistakes": [
      "Expecting <code>add(\"a\", \"b\")</code> to fail because of the hints. It returns <code>\"ab\"</code>."
     ],
     "alts": [
      {
       "q": "No default this time. What prints?",
       "code": "data = [{\"name\": \"Alice\"}, {\"id\": 2}, {\"name\": \"Charlie\"}]\nresult = []\nfor rec in data:\n    value = rec.get(\"name\")\n    if value is not None:\n        result.append(value)\nprint(result)",
       "answer": "['Alice', 'Charlie']"
      },
      {
       "q": "Annotations are not enforced. What prints?",
       "code": "def add(a: int, b: int) -> int:\n    return a + b\nprint(add(\"a\", \"b\"), add(1.5, 2))",
       "answer": "ab 3.5"
      }
     ]
    },
    {
     "id": "l1-none",
     "title": "None, and str is a class",
     "prompt": "Instructor's notes: <code>None</code> has its own type, and <code>str</code> is a class. What do these print?",
     "code": "x = None\nprint(type(x).__name__)\nprint(x is None)\nprint(type(str).__name__)     # str itself is a class (a 'type')\ns = str(42)                   # like \"new String(42)\" in Java\nprint(s, type(s).__name__, len(s))",
     "output": "NoneType\nTrue\ntype\n42 str 2",
     "explain": "<code>None</code> is the only value of type <code>NoneType</code>, and any Python variable can hold it. Java's <code>null</code> is different: it fits only reference types (<code>int x = null</code> is illegal in Java).<br><br><code>str</code> is a class, so <code>str(42)</code> creates a new string object <code>\"42\"</code> (2 characters).",
     "tags": [
      "types"
     ],
     "key": "Test for None with <code>is None</code>. Calling a class (<code>str(42)</code>) creates an object.",
     "mistakes": [
      "Comparing with <code>== None</code>. It works, but <code>is None</code> is the idiom."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def f():\n    pass\nprint(f())\nprint(f() is None)",
       "answer": "None\nTrue"
      }
     ]
    }
   ]
  },
  {
   "id": "l2",
   "title": "Lecture 2: Bytecode, Values, Data Structures, Control Flow",
   "intro": "<p><b>Ideas:</b> Python compiles to bytecode (.pyc) that runs on the Python VM (slow, not optimized). The lecture builds factorial several ways: recursion, while, a printed trace, a string trace, a tuple-returning recursion, input, and a for loop. It covers primitive values (int, float, bool, None) and builtin objects (complex, str, bytes, bytearray), plus the builtin structures: tuple (immutable), list (mutable), set (unique and unordered), dict (key/value). Also: casting, <code>for</code> (iterates once) vs <code>while</code>, <code>range</code>, and avoiding <code>break</code>.</p>",
   "items": [
    {
     "id": "l2-bytecode",
     "title": "Python bytecode with dis",
     "prompt": "Python compiles <code>factorial</code> to bytecode before running it. What does <code>dis</code> show, roughly? (Exact output changes between Python versions.)",
     "code": "import dis\n\ndef factorial(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\ndis.dis(factorial)\nprint(factorial(10))",
     "output": null,
     "explain": "When a program first runs, Python compiles the source to <b>bytecode</b> (cached as <code>.pyc</code>), and the <b>Python Virtual Machine</b> executes it. You never call the compiler yourself: the interpreter does it.<br><br>In the slide's listing (older Python): <code>LOAD_FAST n</code>, <code>LOAD_CONST 1</code>, <code>COMPARE_OP &lt;=</code>, <code>POP_JUMP_IF_FALSE</code>, then <code>LOAD_GLOBAL factorial</code>, <code>BINARY_SUBTRACT</code>, <code>CALL_FUNCTION</code>, <code>BINARY_MULTIPLY</code>, <code>RETURN_VALUE</code>. Newer versions rename some of these (for example <code>BINARY_OP</code>, <code>CALL</code>), so the output is not fixed.<br><br>Exam facts from the notes: bytecode is <b>not optimized</b>, so it is slow for heavy computation. Each Python thread is an instance of the VM, so running many in parallel is expensive.",
     "tags": [
      "bytecode"
     ],
     "key": "Source &rarr; bytecode (.pyc) &rarr; run by the Python VM. Bytecode is slow (not optimized).",
     "lookFor": [
      "<code>import dis</code>",
      "questions about .pyc / the Python VM"
     ],
     "mistakes": [
      "Thinking Python runs source text line by line with no compile step."
     ],
     "alts": [
      {
       "q": "What does factorial return for these inputs?",
       "code": "def factorial(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\nprint(factorial(5), factorial(0), factorial(-3))",
       "answer": "120 1 1"
      }
     ]
    },
    {
     "id": "l2-fact2",
     "title": "factorial2: while loop",
     "prompt": "Iterative factorial with a <code>while</code> loop. What is <code>factorial2(10)</code>?",
     "code": "def factorial2(n):\n    ret = 1\n    while n > 1:\n        ret = n * ret\n        n = n - 1\n    return ret\n\nprint(factorial2(10))",
     "output": "3628800",
     "explain": "<code>ret</code> starts at 1 and gets multiplied by n, n-1, ..., 2. The loop stops when <code>n</code> reaches 1. The parameter <code>n</code> is a local variable, so changing it does not affect the caller.",
     "trace": "n  | ret = n * ret\n10 | 10\n9  | 90\n8  | 720\n7  | 5040\n6  | 30240\n5  | 151200\n4  | 604800\n3  | 1814400\n2  | 3628800\n1  | (loop stops)",
     "tags": [
      "loops",
      "functions"
     ],
     "key": "10! = 3628800. Loop runs while n &gt; 1.",
     "mistakes": [
      "Starting <code>ret</code> at 0 (the result is then always 0)."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def factorial2(n):\n    ret = 1\n    while n > 1:\n        ret = n * ret\n        n = n - 1\n    return ret\nprint(factorial2(5), factorial2(1), factorial2(0))",
       "answer": "120 1 1"
      },
      {
       "q": "The caller's variable is not changed. What prints?",
       "code": "def factorial2(n):\n    ret = 1\n    while n > 1:\n        ret = n * ret\n        n = n - 1\n    return ret\nm = 4\nr = factorial2(m)\nprint(m, r)",
       "answer": "4 24"
      }
     ]
    },
    {
     "id": "l2-fact3",
     "title": "factorial3: print the execution trace",
     "prompt": "Same loop, with <code>print(ret)</code> inside. What is printed before the final result?",
     "code": "def factorial3(n):\n    ret = 1\n    while n > 1:\n        ret = n * ret\n        print(ret)       # print the variable 'ret'\n        n = n - 1\n    return ret\n\nprint(factorial3(10))",
     "output": "10\n90\n720\n5040\n30240\n151200\n604800\n1814400\n3628800\n3628800",
     "explain": "Each pass prints the running product, which gives 9 lines (n = 10 down to 2). The last <code>print</code> prints the returned value, so 3628800 shows up twice. Printing inside a loop is the simplest way to <b>trace</b> a program.",
     "tags": [
      "loops",
      "tracing"
     ],
     "key": "Count the iterations: n from 10 down to 2 is 9 prints.",
     "mistakes": [
      "Forgetting the final <code>print</code> of the return value, which shows 3628800 a second time."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def factorial3(n):\n    ret = 1\n    while n > 1:\n        ret = n * ret\n        print(ret)\n        n = n - 1\n    return ret\nprint(factorial3(4))",
       "answer": "4\n12\n24\n24"
      }
     ]
    },
    {
     "id": "l2-fact4",
     "title": "factorial4: string concatenation trace",
     "prompt": "Build the string <code>10 * 9 * ... * 1</code> while multiplying. What one line is printed?",
     "code": "def factorial4(n):\n    ret = 1\n    s = str(n)\n    while n > 1:\n        ret = n * ret\n        n = n - 1\n        s = s + ' * ' + str(n)\n    print(s + ' = ' + str(ret))\n    return ret\n\nr = factorial4(10)\nprint(r)",
     "output": "10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1 = 3628800\n3628800",
     "explain": "<code>s</code> starts as <code>\"10\"</code>. Each pass adds <code>' * '</code> and the <b>new</b> n (after decrementing), so the string ends with <code>* 1</code>. Every int needs <code>str(...)</code> before <code>+</code>, because Python never converts to string on its own.",
     "tags": [
      "strings",
      "loops"
     ],
     "key": "<code>str + int</code> fails, so every number is wrapped in <code>str()</code>.",
     "mistakes": [
      "Leaving out <code>str(n)</code>, which causes a <code>TypeError</code>.",
      "Expecting the string to stop at <code>* 2</code>. n is decremented <b>before</b> it is appended."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def factorial4(n):\n    ret = 1\n    s = str(n)\n    while n > 1:\n        ret = n * ret\n        n = n - 1\n        s = s + ' * ' + str(n)\n    print(s + ' = ' + str(ret))\n    return ret\nfactorial4(4)",
       "answer": "4 * 3 * 2 * 1 = 24"
      }
     ]
    },
    {
     "id": "l2-fact5",
     "title": "factorial5: recursion returning a tuple",
     "prompt": "Recursive factorial that returns <code>(string, value)</code> and prints each level. In what order do the lines appear?",
     "code": "def factorial5(n):\n    if n <= 1:\n        ret = 1\n        s = '1'\n    else:\n        s, r = factorial5(n - 1)\n        s = s + \"*\" + str(n)\n        ret = r * n\n    print(s + ' = ' + str(ret))\n    return s, ret\n\nprint(factorial5(10))",
     "output": "1 = 1\n1*2 = 2\n1*2*3 = 6\n1*2*3*4 = 24\n1*2*3*4*5 = 120\n1*2*3*4*5*6 = 720\n1*2*3*4*5*6*7 = 5040\n1*2*3*4*5*6*7*8 = 40320\n1*2*3*4*5*6*7*8*9 = 362880\n1*2*3*4*5*6*7*8*9*10 = 3628800\n('1*2*3*4*5*6*7*8*9*10', 3628800)",
     "explain": "The recursion goes all the way down to <code>n = 1</code> <b>before</b> anything prints. Then each level prints on the way back up, so the lines go from smallest to largest.<br><br><code>return s, ret</code> returns a <b>tuple</b>, and <code>s, r = factorial5(n - 1)</code> unpacks it into two variables.",
     "anatomy": [
      {
       "code": "s, r = factorial5(n - 1)",
       "notes": [
        {
         "at": "s, r",
         "label": "unpack the tuple"
        },
        {
         "at": "factorial5(n - 1)",
         "label": "recursive call first"
        }
       ]
      }
     ],
     "trace": "call stack goes down: f(10) -> f(9) -> ... -> f(1)\nprints on the way UP:\nf(1)  prints 1 = 1\nf(2)  prints 1*2 = 2\nf(3)  prints 1*2*3 = 6\n...\nf(10) prints 1*2*...*10 = 3628800, returns ('1*2*...*10', 3628800)",
     "tags": [
      "recursion",
      "tuples"
     ],
     "key": "Printing after the recursive call means the output runs bottom-up: 1, then 1*2, and so on.",
     "mistakes": [
      "Expecting <code>10 = ...</code> first. The print comes <b>after</b> the recursive call returns."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def factorial5(n):\n    if n <= 1:\n        ret = 1\n        s = '1'\n    else:\n        s, r = factorial5(n - 1)\n        s = s + \"*\" + str(n)\n        ret = r * n\n    print(s + ' = ' + str(ret))\n    return s, ret\nprint(factorial5(3))",
       "answer": "1 = 1\n1*2 = 2\n1*2*3 = 6\n('1*2*3', 6)"
      },
      {
       "q": "Print BEFORE the recursive call. What prints?",
       "code": "def down(n):\n    print(n)\n    if n > 1:\n        down(n - 1)\ndown(3)",
       "answer": "3\n2\n1"
      }
     ]
    },
    {
     "id": "l2-fact6",
     "title": "factorial6: reading input",
     "prompt": "The slide reads n with <code>int(input(...))</code>. <b>Adapted:</b> <code>input()</code> is replaced with the fixed text <code>\"10\"</code>. What is returned?",
     "code": "def factorial(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\ndef factorial6():\n    text = \"10\"          # was: input('please type the number n: ')\n    n = int(text)        # input() always returns a str\n    return factorial(n)\n\nprint(factorial6())",
     "output": "3628800",
     "explain": "<code>input()</code> always returns a <b>string</b>, even when the user types digits. You must call <code>int(...)</code> before doing arithmetic. Here the typed value <code>\"10\"</code> is hard-coded so the example runs in the browser.",
     "tags": [
      "types"
     ],
     "key": "<code>input()</code> returns <code>str</code>. Wrap it in <code>int(...)</code>.",
     "mistakes": [
      "Forgetting <code>int()</code>: <code>\"10\" * 2</code> is <code>\"1010\"</code>, not 20."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "text = \"5\"\nprint(text * 2)\nprint(int(text) * 2)",
       "answer": "55\n10"
      }
     ]
    },
    {
     "id": "l2-values",
     "title": "Python values: primitives and builtin objects",
     "prompt": "Print the type of each kind of value from the slide. What do <code>abs(3+4j)</code> and <code>b'Python'[0]</code> give?",
     "code": "values = [42, 3.14, True, None, 3+4j, 'Python', b'Python', bytearray(b'Python')]\nfor v in values:\n    print(type(v).__name__)\n\nprint(abs(3+4j))        # magnitude of a complex number\nprint(b'Python'[0])     # bytes: indexing gives an int\nba = bytearray(b'Python')\nba[0] = ord('J')        # bytearray is mutable\nprint(ba)",
     "output": "int\nfloat\nbool\nNoneType\ncomplex\nstr\nbytes\nbytearray\n5.0\n80\nbytearray(b'Jython')",
     "explain": "The primitive values are <code>int</code>, <code>float</code>, <code>bool</code> and <code>None</code>. The builtin objects include <code>complex</code>, <code>str</code>, <code>bytes</code> (immutable) and <code>bytearray</code> (mutable).<br><br><code>abs(3+4j)</code> = &radic;(9+16) = 5.0. Indexing <code>bytes</code> gives an <b>int</b> (80 is the code of <code>'P'</code>).",
     "tags": [
      "types"
     ],
     "key": "<code>bytes</code> is immutable and <code>bytearray</code> is mutable. Indexing either one gives an int.",
     "mistakes": [
      "Expecting <code>b'Python'[0]</code> to be <code>'P'</code>. It is <code>80</code>."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "b = b'Hi'\ntry:\n    b[0] = 72\nexcept TypeError as e:\n    print(type(e).__name__)\nprint(len(b), b[1])",
       "answer": "TypeError\n2 105"
      },
      {
       "q": "What prints?",
       "code": "z = 1 + 2j\nprint(z.real, z.imag, type(z.real).__name__)",
       "answer": "1.0 2.0 float"
      }
     ]
    },
    {
     "id": "l2-strings",
     "title": "Strings are arrays of characters",
     "prompt": "Indexing, slicing, concatenation, <code>len</code>, <code>upper/lower</code>, f-strings, <code>split/join/replace</code>. Predict every line.",
     "code": "my_string = \"Hello, World!\"\nprint(my_string[0])\nprint(my_string[7])\nsubstring = my_string[0:5]\nprint(substring)\n\ngreeting = \"Hello\"\nname = \"Alice\"\nfull_greeting = greeting + \", \" + name + \"!\"\nprint(full_greeting)\nprint(len(my_string))\n\nprint(my_string.upper())\nprint(my_string.lower())\n\nage = 30\nformatted_string = f\"My name is {name} and I am {age}.\"\nprint(formatted_string)\n\nsentence = \"This is a sample.\"\nwords = sentence.split()\nprint(words)\njoined_sentence = \" \".join(words)\nprint(joined_sentence)\nreplaced_sentence = sentence.replace(\"sample\", \"great\")\nprint(replaced_sentence)",
     "output": "H\nW\nHello\nHello, Alice!\n13\nHELLO, WORLD!\nhello, world!\nMy name is Alice and I am 30.\n['This', 'is', 'a', 'sample.']\nThis is a sample.\nThis is a great.",
     "explain": "Index 7 of <code>\"Hello, World!\"</code> is <code>W</code> (H0 e1 l2 l3 o4 ,5 space6 W7). The slice <code>[0:5]</code> takes indices 0 to 4. The length is 13.<br><br><code>split()</code> with no argument splits on whitespace and returns a <b>list</b>. <code>\" \".join(list)</code> glues the pieces back together. Strings are <b>immutable</b>: <code>upper()</code> and <code>replace()</code> return <b>new</b> strings.",
     "trace": " H  e  l  l  o  ,     W  o  r  l  d  !\n 0  1  2  3  4  5  6  7  8  9 10 11 12\nmy_string[0:5] -> 'Hello' (0..4)",
     "tags": [
      "strings"
     ],
     "key": "Slices exclude the end index. String methods return new strings and never change the original.",
     "mistakes": [
      "Calling <code>s.upper()</code> and expecting <code>s</code> itself to change.",
      "Off-by-one on <code>[i:j]</code>: it stops at j-1."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "s = \"Python\"\nprint(s[-1], s[1:4], s[::-1])",
       "answer": "n yth nohtyP"
      },
      {
       "q": "Strings are immutable. What prints?",
       "code": "s = \"hello\"\ns.upper()\nprint(s)\ntry:\n    s[0] = \"H\"\nexcept TypeError as e:\n    print(type(e).__name__)",
       "answer": "hello\nTypeError"
      },
      {
       "q": "What prints?",
       "code": "print(\"a,b,,c\".split(\",\"))\nprint(\"-\".join([\"x\", \"y\", \"z\"]))",
       "answer": "['a', 'b', '', 'c']\nx-y-z"
      }
     ]
    },
    {
     "id": "l2-tuples",
     "title": "Tuples are immutable lists",
     "prompt": "Index, iterate, unpack, test membership, then <code>fruits += (...)</code> and <code>('hello',) * 3</code>. Predict each line.",
     "code": "fruits = ('apple', 'banana', 'orange', 'grape')\nprint(fruits[0])\nprint(fruits[2])\nfor fruit in fruits:          # iterate through the tuple\n    print(fruit)\n\nmixed_tuple = ('apple', 42, 3.14, True)\nnested_tuple = ((1, 2), ('a', 'b'))\n\na, b, c, d = fruits           # unpack the tuple (pattern matching)\nprint(a, b, c, d)\nprint(len(fruits))\nprint('apple' in fruits)\nprint('kiwi' in fruits)\n\nfruits += ('kiwi', 'pineapple')   # builds a NEW tuple\nprint(fruits)\n\nrepeated_tuple = ('hello',) * 3\nprint(repeated_tuple)",
     "output": "apple\norange\napple\nbanana\norange\ngrape\napple banana orange grape\n4\nTrue\nFalse\n('apple', 'banana', 'orange', 'grape', 'kiwi', 'pineapple')\n('hello', 'hello', 'hello')",
     "explain": "A tuple cannot be changed in place. <code>fruits += (...)</code> does not modify the old tuple: it builds a <b>new</b> tuple and rebinds the name <code>fruits</code> to it.<br><br><code>('hello',)</code> needs the comma to be a 1-element tuple. <code>('hello')</code> is just a string in parentheses.",
     "tags": [
      "tuples",
      "aliasing"
     ],
     "key": "Tuples are immutable, so <code>+=</code> makes a new tuple. A 1-tuple needs a trailing comma.",
     "mistakes": [
      "Writing <code>(5)</code> for a one-element tuple. It is just the int 5.",
      "Thinking <code>t += ...</code> changes other names that point to the old tuple."
     ],
     "alts": [
      {
       "q": "+= on a tuple rebinds the name only. What prints?",
       "code": "t = (1, 2)\nu = t\nt += (3,)\nprint(t)\nprint(u)",
       "answer": "(1, 2, 3)\n(1, 2)"
      },
      {
       "q": "What prints?",
       "code": "print(type((5)).__name__, type((5,)).__name__)\nprint(('ab',) * 2, ('ab') * 2)",
       "answer": "int tuple\n('ab', 'ab') abab"
      },
      {
       "q": "A tuple holding a list. What prints?",
       "code": "t = ([1], 2)\nt[0].append(3)\nprint(t)\ntry:\n    t[1] = 5\nexcept TypeError as e:\n    print(type(e).__name__)",
       "answer": "([1, 3], 2)\nTypeError"
      }
     ]
    },
    {
     "id": "l2-lists",
     "title": "Lists are mutable arrays",
     "prompt": "Slice, assign, <code>append</code>, <code>insert</code>, <code>remove</code>, <code>pop</code>, <code>index</code>, <code>count</code>, <code>reverse</code>, <code>sort</code>, <code>copy</code>. Predict each print.",
     "code": "fruits = ['apple', 'banana', 'orange', 'grape']\nprint(fruits[0])\nprint(fruits[2])\nsliced_fruits = fruits[1:3]\nprint(sliced_fruits)\n\nfruits[1] = 'kiwi'\nprint(fruits)\nfruits.append('pineapple')\nprint(fruits)\nfruits.insert(2, 'mango')\nprint(fruits)\nfruits.remove('orange')\nprint(fruits)\n\npopped_fruit = fruits.pop()\nprint(popped_fruit)\nprint(fruits)\nindex = fruits.index('kiwi')\nprint(index)\ncount = fruits.count('mango')\nprint(count)\nfruits.reverse()\nprint(fruits)\nfruits.sort()\nprint(fruits)\nnew_fruits = fruits.copy()\nprint(new_fruits)",
     "output": "apple\norange\n['banana', 'orange']\n['apple', 'kiwi', 'orange', 'grape']\n['apple', 'kiwi', 'orange', 'grape', 'pineapple']\n['apple', 'kiwi', 'mango', 'orange', 'grape', 'pineapple']\n['apple', 'kiwi', 'mango', 'grape', 'pineapple']\npineapple\n['apple', 'kiwi', 'mango', 'grape']\n1\n1\n['grape', 'mango', 'kiwi', 'apple']\n['apple', 'grape', 'kiwi', 'mango']\n['apple', 'grape', 'kiwi', 'mango']",
     "explain": "Most list methods (<code>append</code>, <code>insert</code>, <code>remove</code>, <code>reverse</code>, <code>sort</code>) change the list <b>in place</b> and return <code>None</code>. <code>pop()</code> removes the <b>last</b> item and returns it.<br><br><code>insert(2, x)</code> puts x <b>at</b> index 2 and shifts the rest right. <code>remove(x)</code> deletes the <b>first</b> matching value. <code>copy()</code> makes a <b>shallow</b> copy: a new list that holds the same element objects.",
     "tags": [
      "lists",
      "aliasing"
     ],
     "key": "In-place methods return <code>None</code>. <code>copy()</code> is shallow.",
     "mistakes": [
      "Writing <code>fruits = fruits.sort()</code>, which sets fruits to <code>None</code>.",
      "Confusing <code>remove(value)</code> with <code>pop(index)</code>."
     ],
     "alts": [
      {
       "q": "sort() returns None. What prints?",
       "code": "a = [3, 1, 2]\nb = a.sort()\nprint(a, b)\nprint(sorted([3, 1, 2]))",
       "answer": "[1, 2, 3] None\n[1, 2, 3]"
      },
      {
       "q": "Alias vs copy. What prints?",
       "code": "a = [1, 2]\nb = a\nc = a.copy()\nb.append(3)\nc.append(4)\nprint(a, b, c)",
       "answer": "[1, 2, 3] [1, 2, 3] [1, 2, 4]"
      },
      {
       "q": "What prints?",
       "code": "x = [10, 20, 30, 20]\nprint(x.pop(0), x.index(20), x.count(20))\nx.remove(20)\nprint(x)",
       "answer": "10 0 2\n[30, 20]"
      }
     ]
    },
    {
     "id": "l2-sets",
     "title": "Sets: unique, unordered, mutable",
     "prompt": "A duplicate <code>'apple'</code> is ignored. Then <code>add</code>, <code>remove</code>, <code>discard</code>. (A set's print order is arbitrary, so we print <code>sorted(...)</code>.)",
     "code": "# duplicate 'apple' is ignored\nfruits = {'apple', 'banana', 'orange', 'apple', 'grape'}\nprint(sorted(fruits), len(fruits))\nprint('apple' in fruits)\nprint('kiwi' in fruits)\n\nfruits.add('kiwi')\nfruits.add('kiwi')            # adding a duplicate is ignored\nprint(sorted(fruits))\n\nfruits.remove('orange')       # raises KeyError if missing\nfruits.discard('banana')      # no error if missing\nfruits.discard('banana')\nprint(sorted(fruits))\n\ntry:\n    fruits.remove('orange')   # already gone\nexcept KeyError as e:\n    print(type(e).__name__)",
     "output": "['apple', 'banana', 'grape', 'orange'] 4\nTrue\nFalse\n['apple', 'banana', 'grape', 'kiwi', 'orange']\n['apple', 'grape', 'kiwi']\nKeyError",
     "explain": "A set keeps <b>one copy</b> of each value, decided by <b>hash and ==</b>. It has <b>no order</b>, so the slide's printout order (<code>{'banana', 'apple', ...}</code>) can differ from run to run. That is why we sort here.<br><br><code>remove</code> raises <code>KeyError</code> when the item is missing, and <code>discard</code> stays silent.<br><br><b>Exam favorite:</b> <code>1</code>, <code>1.0</code> and <code>True</code> are equal and have the same hash, so a set keeps only the <b>first one inserted</b>.",
     "tags": [
      "sets",
      "hashing"
     ],
     "key": "Set membership uses hash + ==. <code>1 == 1.0 == True</code> collapse into one element, and the first one inserted is kept.",
     "mistakes": [
      "Expecting sets to keep insertion order.",
      "Expecting <code>{1, 1.0, True}</code> to have 3 elements. It has 1."
     ],
     "alts": [
      {
       "q": "1, 1.0 and True are equal with equal hashes. What prints?",
       "code": "s = {1, 1.0, True}\nprint(s, len(s))\nt = {True, 1, 1.0}\nprint(t)",
       "answer": "{1} 1\n{True}"
      },
      {
       "q": "What prints?",
       "code": "s = {1, 2, 2, 3}\ns.add(2.0)\ns.add('2')\nprint(len(s))",
       "answer": "4"
      },
      {
       "q": "Lists are unhashable. What prints?",
       "code": "try:\n    s = {[1, 2], [3]}\nexcept TypeError as e:\n    print(type(e).__name__)\nprint({(1, 2), (1, 2)})",
       "answer": "TypeError\n{(1, 2)}"
      }
     ]
    },
    {
     "id": "l2-setops",
     "title": "Set operators: | & - ^",
     "prompt": "<code>set1 = {1, 2, 3, 4}</code> and <code>set2 = {3, 4, 5, 6}</code>. Predict union, intersection, difference, symmetric difference, and <code>clear()</code>.",
     "code": "set1 = {1, 2, 3, 4}\nset2 = {3, 4, 5, 6}\nprint(set1 | set2)    # union\nprint(set1 & set2)    # intersection\nprint(set1 - set2)    # difference\nprint(set1 ^ set2)    # symmetric difference\n\nfruits = {'apple', 'kiwi'}\nfruits.clear()\nprint(fruits)",
     "output": "{1, 2, 3, 4, 5, 6}\n{3, 4}\n{1, 2}\n{1, 2, 5, 6}\nset()",
     "explain": "<code>|</code> = in either set, <code>&amp;</code> = in both, <code>-</code> = in the left set but not the right, <code>^</code> = in exactly one. An empty set prints as <code>set()</code>, because <code>{}</code> is an empty <b>dict</b>.",
     "trace": "set1: 1 2 3 4\nset2:     3 4 5 6\n|  -> 1 2 3 4 5 6\n&  ->     3 4\n-  -> 1 2\n^  -> 1 2     5 6",
     "tags": [
      "sets"
     ],
     "key": "<code>{}</code> is an empty dict. An empty set is <code>set()</code>.",
     "mistakes": [
      "Writing <code>s = {}</code> to make an empty set."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "a = {1, 2, 3}\nb = {2, 3, 4}\nprint(b - a, a ^ b, (a | b) - (a & b))",
       "answer": "{4} {1, 4} {1, 4}"
      },
      {
       "q": "What prints?",
       "code": "print(type({}).__name__, type(set()).__name__)",
       "answer": "dict set"
      }
     ]
    },
    {
     "id": "l2-dicts",
     "title": "Dictionaries: mutable key/value maps",
     "prompt": "Look up, update, add, <code>del</code>, <code>in</code>, then <code>keys()</code>, <code>values()</code>, <code>items()</code>, a dict comprehension, and a nested dict.",
     "code": "person = {\n    'name': 'John',\n    'age': 30,\n    'city': 'New York'\n}\nprint(person['name'])\nprint(person['age'])\nperson['age'] = 31                 # update existing key\nprint(person)\nperson['occupation'] = 'Engineer'  # add new key (goes at the end)\nprint(person)\ndel person['city']\nprint(person)\nprint('name' in person)            # 'in' checks KEYS\nprint('city' in person)\n\nkeys = person.keys()\nvalues = person.values()\nprint(keys)\nprint(values)\nfor key, value in person.items():\n    print(key, value)\n\nsquared_numbers = {x: x**2 for x in range(1, 6)}\nprint(squared_numbers)\n\nperson_info = {\n    'name': 'Alice',\n    'age': 25,\n    'address': {\n        'street': '123 Main St',\n        'city': 'Cityville',\n        'zipcode': '12345'\n    }\n}\nprint(person_info['address']['city'])",
     "output": "John\n30\n{'name': 'John', 'age': 31, 'city': 'New York'}\n{'name': 'John', 'age': 31, 'city': 'New York', 'occupation': 'Engineer'}\n{'name': 'John', 'age': 31, 'occupation': 'Engineer'}\nTrue\nFalse\ndict_keys(['name', 'age', 'occupation'])\ndict_values(['John', 31, 'Engineer'])\nname John\nage 31\noccupation Engineer\n{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\nCityville",
     "explain": "Dicts keep <b>insertion order</b>. Updating an existing key keeps its position, and a new key goes at the end. <code>in</code> checks <b>keys</b>, not values.<br><br><code>keys()</code>, <code>values()</code> and <code>items()</code> return <b>views</b>: live windows into the dict that update when the dict changes.",
     "anatomy": [
      {
       "code": "{x: x**2 for x in range(1, 6)}",
       "notes": [
        {
         "at": "x:",
         "label": "key"
        },
        {
         "at": "x**2",
         "label": "value"
        },
        {
         "at": "for x in range(1, 6)",
         "label": "x = 1..5"
        }
       ]
      }
     ],
     "tags": [
      "dict",
      "hashing"
     ],
     "key": "<code>in</code> tests keys. Keys are matched by hash + ==, so <code>1</code>, <code>1.0</code> and <code>True</code> are the <b>same key</b>.",
     "mistakes": [
      "Expecting <code>'John' in person</code> to be True. <code>in</code> checks keys only.",
      "Thinking <code>{1: 'a', 1.0: 'b', True: 'c'}</code> has 3 keys."
     ],
     "alts": [
      {
       "q": "Same key 1 / 1.0 / True. What prints?",
       "code": "d = {1: 'a', 1.0: 'b', True: 'c'}\nprint(d, len(d))",
       "answer": "{1: 'c'} 1"
      },
      {
       "q": "Views are live. What prints?",
       "code": "d = {'a': 1}\nk = d.keys()\nd['b'] = 2\nprint(k, len(k))",
       "answer": "dict_keys(['a', 'b']) 2"
      },
      {
       "q": "What prints?",
       "code": "d = {'x': 1, 'y': 2}\nd['x'] = 10\nd['z'] = 3\nprint(list(d.items()))\nprint(d.get('w', 0), 'y' in d, 2 in d)",
       "answer": "[('x', 10), ('y', 2), ('z', 3)]\n0 True False"
      }
     ]
    },
    {
     "id": "l2-casting",
     "title": "Casting between types",
     "prompt": "<code>str()</code>, <code>int()</code>, <code>float()</code>, <code>tuple()</code>, <code>list()</code>. What does <code>int(3.9)</code> give?",
     "code": "number = 42\nprint(repr(str(number)))        # '42'\nprint(repr(str(3.14)))          # '3.14'\nprint(int(\"123\"))\nprint(float(\"3.14\"))\nprint(float(42))\nprint(int(3.9))                 # truncates, does NOT round\nprint(tuple([1, 2, 3]))\nprint(list((4, 5, 6)))",
     "output": "'42'\n'3.14'\n123\n3.14\n42.0\n3\n(1, 2, 3)\n[4, 5, 6]",
     "explain": "<code>int(3.9)</code> <b>truncates toward zero</b> and gives <code>3</code>, not 4. <code>float(42)</code> gives <code>42.0</code>. <code>repr</code> shows the quotes, so you can see the result is a string.<br><br><code>int(\"3.9\")</code> fails with <code>ValueError</code>: <code>int()</code> only parses integer text.",
     "tags": [
      "types"
     ],
     "key": "<code>int()</code> truncates toward zero: <code>int(3.9)</code> = 3 and <code>int(-3.9)</code> = -3.",
     "mistakes": [
      "Thinking <code>int(3.9)</code> rounds to 4.",
      "Expecting <code>int(\"3.9\")</code> to work."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "print(int(-3.9), int(3.9), round(3.9))\ntry:\n    int(\"3.9\")\nexcept ValueError as e:\n    print(type(e).__name__)\nprint(int(float(\"3.9\")))",
       "answer": "-3 3 4\nValueError\n3"
      },
      {
       "q": "What prints?",
       "code": "print(bool(\"\"), bool(\"False\"), bool(0), bool([0]))\nprint(list(\"abc\"), tuple(\"ab\"))",
       "answer": "False True False True\n['a', 'b', 'c'] ('a', 'b')"
      }
     ]
    },
    {
     "id": "l2-for",
     "title": "for loops iterate a collection exactly once",
     "prompt": "A <code>for</code> loop over a list, a string, a <code>range</code>, a dict, and <code>dict.items()</code>. What does each one produce?",
     "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(fruit)\n\nword = \"Python\"\nfor letter in word:\n    print(letter, end=\" \")\nprint()\n\nfor number in range(1, 6):      # 1 to 5\n    print(number, end=\" \")\nprint()\n\nperson = {\"name\": \"Alice\", \"age\": 30, \"city\": \"New York\"}\nfor key in person:              # a dict iterates over its KEYS\n    print(key)\nfor key, value in person.items():\n    print(key, value)",
     "output": "apple\nbanana\ncherry\nP y t h o n \n1 2 3 4 5 \nname\nage\ncity\nname Alice\nage 30\ncity New York",
     "explain": "A <code>for</code> loop visits each element of an iterable <b>exactly once</b>. A string gives its characters. Looping over a dict gives its <b>keys</b>, and <code>.items()</code> gives <code>(key, value)</code> pairs that you can unpack. (<code>end=\" \"</code> is used here only to keep the output short.)",
     "tags": [
      "loops",
      "dict"
     ],
     "key": "<code>for k in d</code> gives keys. <code>for k, v in d.items()</code> gives pairs.",
     "mistakes": [
      "Expecting <code>for x in d</code> to give values."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "d = {\"a\": 1, \"b\": 2}\nprint([k for k in d], [v for v in d.values()])",
       "answer": "['a', 'b'] [1, 2]"
      },
      {
       "q": "What prints?",
       "code": "total = 0\nfor ch in \"1234\":\n    total += int(ch)\nprint(total)",
       "answer": "10"
      }
     ]
    },
    {
     "id": "l2-range",
     "title": "range(start, stop, step) and factorial7",
     "prompt": "Predict <code>range(5)</code>, <code>range(2, 6)</code>, <code>range(0, 10, 2)</code>, <code>range(5, 0, -1)</code>, and <code>factorial7(10)</code> (written with a for loop).",
     "code": "print(list(range(5)))\nprint(list(range(2, 6)))\nprint(list(range(0, 10, 2)))\nprint(list(range(5, 0, -1)))\nnumbers_list = list(range(1, 6))\nprint(numbers_list)\n\ndef factorial7(n):\n    ret = 1\n    for x in range(2, n + 1):\n        ret = ret * x\n    return ret\n\nprint(factorial7(10))",
     "output": "[0, 1, 2, 3, 4]\n[2, 3, 4, 5]\n[0, 2, 4, 6, 8]\n[5, 4, 3, 2, 1]\n[1, 2, 3, 4, 5]\n3628800",
     "explain": "<code>range(start, stop, step)</code> starts at <code>start</code> and <b>never includes</b> <code>stop</code>. With a negative step it counts down, and it still stops before <code>stop</code> (so <code>range(5, 0, -1)</code> ends at 1).<br><br><code>factorial7</code> needs <code>n + 1</code> so that n itself is multiplied in.",
     "anatomy": [
      {
       "code": "range(0, 10, 2)",
       "notes": [
        {
         "at": "0,",
         "label": "start (included)"
        },
        {
         "at": "10,",
         "label": "stop (excluded)"
        },
        {
         "at": "2)",
         "label": "step"
        }
       ]
      }
     ],
     "tags": [
      "loops",
      "range"
     ],
     "key": "stop is always excluded, in both directions.",
     "mistakes": [
      "Writing <code>range(2, n)</code> for factorial, which skips multiplying by n.",
      "Expecting <code>range(5, 0)</code> (no step) to count down. It is empty."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "print(list(range(10, 0, -3)))\nprint(list(range(5, 0)))\nprint(len(range(0, 10, 3)))",
       "answer": "[10, 7, 4, 1]\n[]\n4"
      },
      {
       "q": "What prints?",
       "code": "def factorial7(n):\n    ret = 1\n    for x in range(2, n + 1):\n        ret = ret * x\n    return ret\nprint(factorial7(5), factorial7(1))",
       "answer": "120 1"
      }
     ]
    },
    {
     "id": "l2-break",
     "title": "Avoiding break",
     "prompt": "The lecture says <code>break</code> is bad style. Compare the <code>break</code> versions with the versions that compute the loop range up front. Do they print the same thing?",
     "code": "fruits = [\"apple\", \"banana\", \"cherry\", \"orange\"]\n\n# with break\nfor fruit in fruits:\n    if fruit == \"cherry\":\n        break\n    print(fruit)\n\n# without break: compute the range first\nn = fruits.index(\"cherry\")\nfor i in range(n):\n    print(fruits[i])\n\n# while with break\nnumber = 1\nwhile number <= 5:\n    print(number)\n    if number == 3:\n        break\n    number += 1\n\n# while without break: tighten the condition\nnumber = 1\nwhile number <= 3:\n    print(number)\n    number += 1",
     "output": "apple\nbanana\napple\nbanana\n1\n2\n3\n1\n2\n3",
     "explain": "<code>break</code> exits the loop immediately. In the first loop <code>\"cherry\"</code> triggers the break <b>before</b> it is printed, so only apple and banana appear.<br><br>To avoid <code>break</code>, compute in advance how far to go (<code>fruits.index(\"cherry\")</code> = 2, so <code>range(2)</code>) or put the stop rule into the <code>while</code> condition. (The slide's <code>n = fruits.index(\"cherry\"):</code> has a stray colon, which is fixed here.)",
     "tags": [
      "loops"
     ],
     "key": "Replace <code>break</code> with a precise loop bound: same output, clearer loop.",
     "mistakes": [
      "Thinking the item that triggers <code>break</code> still gets printed. Here the print comes after the check."
     ],
     "alts": [
      {
       "q": "print BEFORE the check. What prints?",
       "code": "for x in [5, 7, 9, 11]:\n    print(x)\n    if x == 9:\n        break",
       "answer": "5\n7\n9"
      },
      {
       "q": "What prints?",
       "code": "nums = [4, 8, 15, 16]\nn = nums.index(15)\nprint([nums[i] for i in range(n)])",
       "answer": "[4, 8]"
      }
     ]
    }
   ]
  },
  {
   "id": "l3",
   "title": "Lecture 3: Newton-Raphson, Scope, Arguments",
   "intro": "<p><b>Ideas:</b> polynomials stored as coefficient lists; <code>derivative</code>; <code>calculate</code> (Horner's rule); Newton-Raphson as a recursive <b>inner function</b> (<code>raphson</code>) and as a <code>while</code> loop (<code>raphson2</code>). <b>Scope:</b> locals are the parameters plus every assigned name; inner functions can read outer variables; assigning a name anywhere makes it local everywhere in that function (UnboundLocalError); <code>global</code> is for top-level variables. <b>Arguments:</b> positional vs keyword (no positional after keyword), default values (evaluated once), and <code>*args</code>.</p>",
   "items": [
    {
     "id": "l3-derivative",
     "title": "derivative(poly)",
     "prompt": "A polynomial is stored as a coefficient list, so <code>[1, -4, 4]</code> means x&sup2; - 4x + 4. What does <code>derivative([1, -4, 4])</code> return?",
     "code": "# c1 * x^p + c2 * x^(p-1) + ... + cp * x + k\n# is stored as [c1, c2, ..., cp, k]\ndef derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:          # every coefficient except the constant k\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\nprint(derivative([1, -4, 4]))     # x^2 - 4x + 4  ->  2x - 4\nprint(derivative([3, 0, 2, 5]))   # 3x^3 + 2x + 5 ->  9x^2 + 0x + 2",
     "output": "[2, -4]\n[9, 0, 2]",
     "explain": "The power rule: c&middot;x<sup>p</sup> becomes c&middot;p&middot;x<sup>p-1</sup>. The first coefficient has power <code>len(poly) - 1</code>, and the power drops by 1 for each step. The constant <code>k</code> disappears, which is why the loop uses <code>poly[0:-1]</code> (everything except the last item).<br><br><code>ret = ret + [c * p]</code> builds a <b>new</b> list each time. <code>ret.append(c * p)</code> would do the same thing in place.",
     "anatomy": [
      {
       "code": "for c in poly[0:-1]:",
       "notes": [
        {
         "at": "poly[0:-1]",
         "label": "all but the constant"
        },
        {
         "at": "c in",
         "label": "each coefficient"
        }
       ]
      }
     ],
     "trace": "poly = [1, -4, 4], p starts at 2\nc  | p | c*p | ret\n1  | 2 | 2   | [2]\n-4 | 1 | -4  | [2, -4]\n(4 is skipped: it is the constant)",
     "tags": [
      "lists",
      "functions"
     ],
     "key": "<code>poly[0:-1]</code> drops the constant. Multiply each coefficient by its power, which counts down from <code>len-1</code>.",
     "mistakes": [
      "Forgetting that <code>[0:-1]</code> excludes the last element."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\nprint(derivative([2, 3, 0, 7]))\nprint(derivative([7]))",
       "answer": "[6, 6, 0]\n[]"
      },
      {
       "q": "Slice check. What prints?",
       "code": "poly = [5, 6, 7, 8]\nprint(poly[0:-1], poly[-1], poly[1:])",
       "answer": "[5, 6, 7] 8 [6, 7, 8]"
      }
     ]
    },
    {
     "id": "l3-calculate",
     "title": "calculate(poly, x): Horner's rule",
     "prompt": "<code>calculate</code> evaluates a polynomial with <code>ret = ret * x + c</code>. What is f(1) for f(x) = x&sup2; - 4x + 4?",
     "code": "def calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\nprint(calculate([1, -4, 4], 1))\nprint(calculate([1, -4, 4], 2))   # 2 is a root\nprint(calculate([3, 2, -1], 5))   # 3*25 + 2*5 - 1",
     "output": "1\n0\n84",
     "explain": "Horner's rule rewrites c1&middot;x&sup2; + c2&middot;x + c3 as ((c1)&middot;x + c2)&middot;x + c3. Each step multiplies the running total by x and adds the next coefficient, so no powers are needed.",
     "anatomy": [
      {
       "code": "ret = ret * x + c",
       "notes": [
        {
         "at": "ret * x",
         "label": "shift up one power"
        },
        {
         "at": "+ c",
         "label": "add next coefficient"
        }
       ]
      }
     ],
     "trace": "calculate([1, -4, 4], 1)\nc  | ret*x + c       | ret\n1  | 0*1 + 1         | 1\n-4 | 1*1 + (-4)      | -3\n4  | -3*1 + 4        | 1",
     "tags": [
      "functions",
      "loops"
     ],
     "key": "<code>ret = ret * x + c</code>, read left to right, evaluates the polynomial.",
     "mistakes": [
      "Starting <code>ret</code> at 1 instead of 0."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\nprint(calculate([2, 0, -1], 3), calculate([1, 1, 1, 1], 2), calculate([], 9))",
       "answer": "17 15 0"
      }
     ]
    },
    {
     "id": "l3-raphson",
     "title": "raphson: Newton-Raphson with a recursive inner function",
     "prompt": "Find a root of x&sup2; - 5x + 6 starting from guess 4, with &epsilon; = 0.0001. The inner function <code>fp</code> prints each guess. What prints?",
     "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\ndef calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\ndef raphson(poly, epsilon, guess):\n    deriv = derivative(poly)\n    def fp(x):                 # a fixed-point function\n        print(x)               # print a trace\n        p = calculate(poly, x)\n        if abs(p) > epsilon:\n            x = x - p / calculate(deriv, x)\n            x = fp(x)\n        return x\n    return fp(guess)\n\nprint(raphson([1, -5, 6], 0.0001, 4))",
     "output": "4\n3.3333333333333335\n3.066666666666667\n3.003921568627451\n3.0000152590218967\n3.0000152590218967",
     "explain": "Newton-Raphson: if y is a guess, then <b>y - f(y)/f'(y)</b> is a better guess. Stop when |f(y)| &le; &epsilon;.<br><br>The inner function <code>fp</code> can read <code>poly</code>, <code>epsilon</code> and <code>deriv</code> from the <b>enclosing scope</b>. It calls itself until the guess is good enough, and the final x is passed back up through every <code>return x</code>.<br><br>Starting from 4, the guesses converge to the root 3 (the other root, 2, is never reached). The first guess prints as <code>4</code> because it is still an int. After the division <code>/</code>, x becomes a float.",
     "anatomy": [
      {
       "code": "x = x - p / calculate(deriv, x)",
       "notes": [
        {
         "at": "x - p",
         "label": "old guess minus f(x)"
        },
        {
         "at": "/ calculate(deriv, x)",
         "label": "divided by f'(x)"
        }
       ]
      }
     ],
     "trace": "f(x) = x^2 - 5x + 6, f'(x) = 2x - 5\nx                    | f(x)                  | f'(x)\n4                    | 2                     | 3\n3.3333333333333335   | 0.44444444444444464   | 1.666666666666667\n3.066666666666667    | 0.07111111111111157   | 1.1333333333333337\n3.003921568627451    | 0.003936947327950691  | 1.007843137254902\n3.0000152590218967   | 1.525925473444545e-05 | (<= 0.0001: stop)",
     "tags": [
      "recursion",
      "scope",
      "closures"
     ],
     "key": "New guess = x - f(x)/f'(x). Stop when |f(x)| &le; &epsilon;. The inner function reads outer variables.",
     "mistakes": [
      "Expecting the first line to be <code>4.0</code>. It stays an int until <code>/</code> runs.",
      "Thinking it finds root 2. From 4 it converges to 3."
     ],
     "alts": [
      {
       "q": "Start exactly at a root. What prints?",
       "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\ndef calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\ndef raphson(poly, epsilon, guess):\n    deriv = derivative(poly)\n    def fp(x):\n        print(x)\n        p = calculate(poly, x)\n        if abs(p) > epsilon:\n            x = x - p / calculate(deriv, x)\n            x = fp(x)\n        return x\n    return fp(guess)\nr = raphson([1, -5, 6], 0.0001, 2)\nprint(\"root:\", r)",
       "answer": "2\nroot: 2"
      },
      {
       "q": "One Newton step by hand: f(x) = x^2 - 4, guess 3. What prints?",
       "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\ndef calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\npoly = [1, 0, -4]\nx = 3\nx = x - calculate(poly, x) / calculate(derivative(poly), x)\nprint(x)",
       "answer": "2.1666666666666665"
      }
     ]
    },
    {
     "id": "l3-raphson2",
     "title": "raphson2: the same algorithm with a while loop",
     "prompt": "The loop version prints x inside the loop and once more after it. Does it print the same lines as the recursive version?",
     "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\ndef calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\ndef raphson2(poly, epsilon, x):\n    deriv = derivative(poly)\n    p = calculate(poly, x)\n    while abs(p) > epsilon:\n        print(x)\n        p1 = calculate(deriv, x)\n        x = x - p / p1\n        p = calculate(poly, x)\n    print(x)\n    return x\n\nraphson2([1, -5, 6], 0.0001, 4)",
     "output": "4\n3.3333333333333335\n3.066666666666667\n3.003921568627451\n3.0000152590218967",
     "explain": "Yes, it prints the same 5 lines. The loop prints the 4 guesses that are not yet good enough, and the <code>print(x)</code> after the loop prints the final answer. Recursion and the while loop are two ways to write the same <b>fixed-point iteration</b>.",
     "tags": [
      "loops"
     ],
     "key": "Recursion and a while loop can express the same iteration. Update x, recompute f(x), and test again.",
     "mistakes": [
      "Forgetting to recompute <code>p</code> inside the loop, which makes it an infinite loop."
     ],
     "alts": [
      {
       "q": "Find the root of x^2 - 4 from guess 3. What prints?",
       "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\ndef calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\ndef raphson2(poly, epsilon, x):\n    deriv = derivative(poly)\n    p = calculate(poly, x)\n    while abs(p) > epsilon:\n        print(x)\n        p1 = calculate(deriv, x)\n        x = x - p / p1\n        p = calculate(poly, x)\n    print(x)\n    return x\nraphson2([1, 0, -4], 0.0001, 3)",
       "answer": "3\n2.1666666666666665\n2.0064102564102564\n2.0000102400262145"
      },
      {
       "q": "How many loop iterations run? What prints?",
       "code": "def derivative(poly):\n    ret = []\n    p = len(poly) - 1\n    for c in poly[0:-1]:\n        ret = ret + [c * p]\n        p = p - 1\n    return ret\n\ndef calculate(poly, x):\n    ret = 0\n    for c in poly:\n        ret = ret * x + c\n    return ret\n\ndef steps(poly, epsilon, x):\n    deriv = derivative(poly)\n    n = 0\n    p = calculate(poly, x)\n    while abs(p) > epsilon:\n        x = x - p / calculate(deriv, x)\n        p = calculate(poly, x)\n        n += 1\n    return n\nprint(steps([1, -5, 6], 0.0001, 4), steps([1, -5, 6], 0.0001, 3))",
       "answer": "4 0"
      }
     ]
    },
    {
     "id": "l3-scope-read",
     "title": "Scope: an inner function reads an outer variable",
     "prompt": "<code>g</code> is defined inside <code>f</code> and reads <code>x</code>, which it never assigns. What does <code>f()</code> print?",
     "code": "def f():\n    x = 6\n    def g():\n        y = x + 5      # x is 6 (from f's scope)\n        print(x, y)\n    g()\n\nf()",
     "output": "6 11",
     "explain": "A function's scope runs from its header to the end of its indented block. Its <b>local variables</b> are its parameters plus every name it <b>assigns</b>.<br><br><code>g</code> never assigns <code>x</code>, so <code>x</code> is not local to g. Python looks outward to <code>f</code>'s scope and finds 6. (Lookup order: Local, Enclosing, Global, Built-in.)",
     "trace": "scopes (LEGB):\n+-- f ------------------+\n|  x = 6                |\n|  +-- g -------------+ |\n|  |  y = x + 5  -----+-+--> x not local to g, found in f\n|  +------------------+ |\n+-----------------------+",
     "tags": [
      "scope",
      "closures"
     ],
     "key": "If a function only <b>reads</b> a name, Python finds it in an outer scope.",
     "mistakes": [
      "Thinking inner functions cannot see outer variables."
     ],
     "alts": [
      {
       "q": "Late binding: closures look up the variable when called. What prints?",
       "code": "fs = [lambda: i for i in range(3)]\nprint([f() for f in fs])",
       "answer": "[2, 2, 2]"
      },
      {
       "q": "A default argument freezes the value. What prints?",
       "code": "fs = [lambda i=i: i for i in range(3)]\nprint([f() for f in fs])",
       "answer": "[0, 1, 2]"
      },
      {
       "q": "The outer value at CALL time is used. What prints?",
       "code": "def f():\n    x = 1\n    def g():\n        return x * 10\n    x = 2\n    return g()\nprint(f())",
       "answer": "20"
      }
     ]
    },
    {
     "id": "l3-scope-unbound",
     "title": "Scope: assigning a name later makes it local everywhere",
     "prompt": "Now <code>g</code> reads <code>x</code> and <b>then</b> assigns <code>x = 0</code>. What happens? (We print only the exception type.)",
     "code": "def f():\n    x = 6\n    def g():\n        y = x + 5      # x is local to g, and not assigned yet!\n        x = 0          # this assignment makes x local to the WHOLE of g\n        print(x, y)\n    g()\n\ntry:\n    f()\nexcept NameError as e:\n    print(type(e).__name__)",
     "output": "UnboundLocalError",
     "explain": "Python decides which names are local <b>when it compiles the function</b>, not line by line. Because <code>x = 0</code> appears anywhere in <code>g</code>, <code>x</code> is local in <b>all</b> of g. The line <code>y = x + 5</code> then reads a local that has no value yet, which raises <code>UnboundLocalError</code> (a subclass of <code>NameError</code>).<br><br>The slide says there is <b>no fix</b> for using one name as both the outer variable and a local. If you really want g to <b>update</b> f's x, Python 3 has <code>nonlocal x</code> (not on the slides). For a top-level variable, use <code>global</code>.",
     "tags": [
      "scope"
     ],
     "key": "Any assignment to x anywhere in a function makes x local in the whole function. Reading it before the assignment raises <code>UnboundLocalError</code>.",
     "mistakes": [
      "Thinking the first line reads the outer x and only later lines use the local one.",
      "The same trap with <code>count += 1</code> on a global counter without <code>global count</code>."
     ],
     "alts": [
      {
       "q": "Same trap with +=. What prints?",
       "code": "count = 0\ndef inc():\n    count += 1\ntry:\n    inc()\nexcept NameError as e:\n    print(type(e).__name__)\nprint(count)",
       "answer": "UnboundLocalError\n0"
      },
      {
       "q": "Assignment only (no read first) is fine: it is a NEW local. What prints?",
       "code": "x = 6\ndef g():\n    x = 0\n    return x\nprint(g(), x)",
       "answer": "0 6"
      },
      {
       "q": "nonlocal lets g update f's variable. What prints?",
       "code": "def f():\n    x = 6\n    def g():\n        nonlocal x\n        x = x + 1\n    g()\n    g()\n    return x\nprint(f())",
       "answer": "8"
      }
     ]
    },
    {
     "id": "l3-global",
     "title": "global lets a function update a top-level variable",
     "prompt": "<code>k</code> declares <code>global x</code>, reads it, and then assigns <code>x = 0</code>. What does <code>k()</code> print, and what is <code>x</code> afterwards?",
     "code": "x = 6\ndef k():\n    global x\n    y = x + 5\n    x = 0\n    print(x, y)\n\nk()\nprint(x)        # the top-level x was changed",
     "output": "0 11\n0",
     "explain": "<code>global x</code> tells Python that <code>x</code> in this function means the <b>module-level</b> x. Reading gives 6, so y = 11, and assigning 0 changes the real top-level variable. The variable must be a <b>top-level</b> one; <code>global</code> cannot reach a variable inside an enclosing function.",
     "trace": "before k(): global x = 6\ninside k(): y = 6 + 5 = 11, then x = 0 (writes the global)\nprints: 0 11\nafter k(): global x = 0",
     "tags": [
      "scope"
     ],
     "key": "<code>global x</code> means reads and writes go to the module-level x.",
     "mistakes": [
      "Expecting <code>x</code> to still be 6 after <code>k()</code>."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "count = 0\ndef tick():\n    global count\n    count = count + 1\n    return count\ntick(); tick()\nprint(tick(), count)",
       "answer": "3 3"
      },
      {
       "q": "Without global, assignment creates a local. What prints?",
       "code": "x = 6\ndef k():\n    x = 0\n    print(x)\nk()\nprint(x)",
       "answer": "0\n6"
      }
     ]
    },
    {
     "id": "l3-keyword",
     "title": "Keyword arguments and default values",
     "prompt": "<code>greet(name, greeting=\"Hello\")</code> is called with keywords in different orders. What are the three lines?",
     "code": "def greet(name, greeting=\"Hello\"):\n    print(f\"{greeting}, {name}!\")\n\ngreet(name=\"Alice\")\ngreet(name=\"Bob\", greeting=\"Hi\")\ngreet(greeting=\"Hey\", name=\"Charlie\")\ngreet(\"Dan\")                 # positional works too",
     "output": "Hello, Alice!\nHi, Bob!\nHey, Charlie!\nHello, Dan!",
     "explain": "Arguments can be passed by <b>position</b> or by <b>keyword</b>. With keywords the order does not matter. A parameter with a <b>default value</b> can be left out.<br><br>It is <b>not legal</b> to put a positional argument after a keyword argument: <code>greet(name=\"A\", \"Hi\")</code> is a <code>SyntaxError</code>.",
     "tags": [
      "functions",
      "arguments"
     ],
     "key": "Keyword arguments can come in any order, but positional arguments must come first.",
     "mistakes": [
      "Writing <code>f(a=1, 2)</code>, which is a SyntaxError.",
      "Passing the same parameter twice, e.g. <code>greet(\"A\", name=\"B\")</code>, which is a TypeError."
     ],
     "alts": [
      {
       "q": "Positional after keyword. What prints?",
       "code": "try:\n    compile('greet(name=\"A\", \"Hi\")', '<test>', 'exec')\nexcept SyntaxError as e:\n    print(type(e).__name__)",
       "answer": "SyntaxError"
      },
      {
       "q": "Same parameter twice. What prints?",
       "code": "def greet(name, greeting=\"Hello\"):\n    print(f\"{greeting}, {name}!\")\ntry:\n    greet(\"A\", name=\"B\")\nexcept TypeError as e:\n    print(type(e).__name__)\ngreet(\"Eve\", \"Yo\")",
       "answer": "TypeError\nYo, Eve!"
      }
     ]
    },
    {
     "id": "l3-defaults",
     "title": "Default values are evaluated ONCE",
     "prompt": "A default value is created when the <code>def</code> line runs, not on each call. What happens with a <b>mutable</b> default list?",
     "code": "def add_item(x, items=[]):     # ONE list, created at def time\n    items.append(x)\n    return items\n\nprint(add_item(1))\nprint(add_item(2))             # same list again!\nprint(add_item(3, []))         # a fresh list passed in\n\ndef add_item_safe(x, items=None):\n    if items is None:\n        items = []             # new list on every call\n    items.append(x)\n    return items\n\nprint(add_item_safe(1))\nprint(add_item_safe(2))",
     "output": "[1]\n[1, 2]\n[3]\n[1]\n[2]",
     "explain": "The expression <code>[]</code> in <code>items=[]</code> runs <b>once</b>, when the function is defined. Every call that leaves out <code>items</code> gets <b>the same list object</b>, so appends pile up across calls.<br><br>The safe idiom is <code>items=None</code> plus <code>if items is None: items = []</code>. Lecture 4's <code>fib2(n, memo={})</code> uses this behavior on purpose, as a cache that lives across calls.",
     "anatomy": [
      {
       "code": "def add_item(x, items=[]):",
       "notes": [
        {
         "at": "items=",
         "label": "default parameter"
        },
        {
         "at": "[]",
         "label": "evaluated ONCE at def"
        }
       ]
      }
     ],
     "tags": [
      "functions",
      "defaults",
      "aliasing"
     ],
     "key": "A mutable default is shared by every call. Use <code>None</code> as the default when you need a fresh object each time.",
     "mistakes": [
      "Expecting <code>add_item(2)</code> to return <code>[2]</code>."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def f(x, acc=[]):\n    acc.append(x * 2)\n    return len(acc)\nprint(f(1), f(2), f(3, []), f(4))",
       "answer": "1 2 1 3"
      },
      {
       "q": "Defaults capture the value at def time. What prints?",
       "code": "y = 5\ndef f(a=y):\n    return a\ny = 10\nprint(f(), f(y))",
       "answer": "5 10"
      },
      {
       "q": "Dict default. What prints?",
       "code": "def tally(word, counts={}):\n    counts[word] = counts.get(word, 0) + 1\n    return counts\ntally(\"a\")\ntally(\"b\")\nprint(tally(\"a\"))",
       "answer": "{'a': 2, 'b': 1}"
      }
     ]
    },
    {
     "id": "l3-args",
     "title": "*args: variable-length arguments",
     "prompt": "<code>sum_numbers(*x)</code> accepts any number of arguments. What is the sum, and what is the type of <code>x</code>?",
     "code": "def sum_numbers(*x):\n    print(type(x).__name__, x)\n    result = 0\n    for num in x:\n        result += num\n    return result\n\ntotal = sum_numbers(1, 2, 3, 4, 5)\nprint(f\"Sum: {total}\")\nprint(sum_numbers())",
     "output": "tuple (1, 2, 3, 4, 5)\nSum: 15\ntuple ()\n0",
     "explain": "A <code>*</code> prefix collects all the extra positional arguments into <b>one sequence</b>. The slide says it is \"treated as a list\": you can loop over it like a list, but its real type is <b>tuple</b>. With no arguments it is <code>()</code>, and the sum is 0.",
     "anatomy": [
      {
       "code": "def sum_numbers(*x):",
       "notes": [
        {
         "at": "*x",
         "label": "packs all args into a tuple"
        }
       ]
      }
     ],
     "tags": [
      "functions",
      "arguments"
     ],
     "key": "<code>*x</code> packs the arguments into a tuple. <code>f(*lst)</code> unpacks a list into separate arguments.",
     "mistakes": [
      "Calling <code>x.append(...)</code> on *args. It is a tuple, so that fails."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def f(a, *rest):\n    print(a, rest)\nf(1)\nf(1, 2, 3)",
       "answer": "1 ()\n1 (2, 3)"
      },
      {
       "q": "Unpacking in a call. What prints?",
       "code": "def sum_numbers(*x):\n    result = 0\n    for num in x:\n        result += num\n    return result\nnums = [10, 20, 30]\nprint(sum_numbers(*nums), sum_numbers(nums[0], *nums[1:]))",
       "answer": "60 60"
      }
     ]
    }
   ]
  },
  {
   "id": "l4",
   "title": "Lecture 4: Functional Python, Identity, Aliasing, Recursion",
   "intro": "<p><b>Ideas:</b> higher-order functions and <code>lambda</code>; iterables and <code>iter()</code>; shared sequence operations; comprehensions (list/set/dict, filters, multiple generators, primes with <code>all</code>); <code>__str__</code> vs <code>__repr__</code>; <code>id</code>, <code>==</code> and <code>is</code>; <b>concurrent modification</b> (<code>[2, 3, 4]</code>); <b>aliasing</b> (<code>[[]] * 2</code>); <code>map</code> and <code>filter</code> (lazy, single-use iterators) and <code>reduce</code> (folds, initial value); recursion (fib: 177 calls) and memoization (11 calls) using a default <code>memo={}</code> or an inner function.</p>",
   "items": [
    {
     "id": "l4-hof",
     "title": "Higher-order functions: functions as values",
     "prompt": "<code>apply</code> receives a function <code>op</code> and calls it. What do the two prints show?",
     "code": "def apply(op, x, y):\n    return op(x, y)\n\ndef multiply(x, y):\n    return x * y\n\ndef divide(x, y):\n    if y != 0:\n        return x / y\n    else:\n        return \"Cannot divide by zero.\"\n\nprint(f\"Multiplication result: {apply(multiply, 4, 6)}\")\nprint(f\"Division result: {apply(divide, 10, 2)}\")",
     "output": "Multiplication result: 24\nDivision result: 5.0",
     "explain": "Functions are <b>first-class values</b>: you can store them in variables, pass them as arguments, and return them. Note <code>multiply</code> (no parentheses) is the function itself, while <code>multiply(4, 6)</code> is a call.<br><br><code>/</code> always returns a float, so <code>10 / 2</code> is <code>5.0</code>.",
     "tags": [
      "functions",
      "higher-order"
     ],
     "key": "Pass <code>f</code> (the function), not <code>f()</code> (its result). <code>/</code> always gives a float.",
     "mistakes": [
      "Writing <code>apply(multiply(), 4, 6)</code>.",
      "Expecting <code>10 / 2</code> to print <code>5</code>."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "def apply(op, x, y):\n    return op(x, y)\ndef divide(x, y):\n    if y != 0:\n        return x / y\n    else:\n        return \"Cannot divide by zero.\"\nprint(apply(divide, 1, 0))\nprint(apply(divide, 7, 2), 7 // 2)",
       "answer": "Cannot divide by zero.\n3.5 3"
      },
      {
       "q": "Returning a function. What prints?",
       "code": "def make_adder(n):\n    def add(x):\n        return x + n\n    return add\nadd5 = make_adder(5)\nprint(add5(10), make_adder(1)(1))",
       "answer": "15 2"
      }
     ]
    },
    {
     "id": "l4-lambda",
     "title": "Anonymous functions with lambda",
     "prompt": "The same <code>apply</code>, now with lambdas, including a conditional expression. Same output?",
     "code": "def apply(op, x, y):\n    return op(x, y)\n\nmul = lambda x, y: x * y\ndiv = lambda x, y: x / y if y != 0 else \"Cannot divide by zero.\"\n\nprint(f\"Multiplication result: {apply(mul, 4, 6)}\")\nprint(f\"Division result: {apply(div, 10, 2)}\")\nprint(f\"Division result: {apply(div, 10, 0)}\")",
     "output": "Multiplication result: 24\nDivision result: 5.0\nDivision result: Cannot divide by zero.",
     "explain": "<code>lambda params: expression</code> makes an unnamed function whose body is a <b>single expression</b> (no statements, no <code>return</code>). <code>A if cond else B</code> is the expression form of if/else.",
     "anatomy": [
      {
       "code": "lambda x, y: x / y if y != 0 else \"Cannot divide by zero.\"",
       "notes": [
        {
         "at": "x, y:",
         "label": "parameters"
        },
        {
         "at": "x / y if",
         "label": "value if true"
        },
        {
         "at": "y != 0",
         "label": "condition"
        },
        {
         "at": "else",
         "label": "otherwise"
        }
       ]
      }
     ],
     "tags": [
      "lambda",
      "higher-order"
     ],
     "key": "A lambda body is one expression, and its value is returned automatically.",
     "mistakes": [
      "Writing <code>return</code> inside a lambda (SyntaxError)."
     ],
     "alts": [
      {
       "q": "Lambda as a sort key. What prints?",
       "code": "pairs = [(\"b\", 2), (\"a\", 3), (\"c\", 1)]\nprint(sorted(pairs, key=lambda p: p[1]))\nprint(sorted(pairs))",
       "answer": "[('c', 1), ('b', 2), ('a', 3)]\n[('a', 3), ('b', 2), ('c', 1)]"
      },
      {
       "q": "What prints?",
       "code": "f = lambda x: \"even\" if x % 2 == 0 else \"odd\"\nprint([f(n) for n in range(3)])",
       "answer": "['even', 'odd', 'even']"
      }
     ]
    },
    {
     "id": "l4-iter",
     "title": "Iterables and iter()",
     "prompt": "<code>iter(obj)</code> succeeds for iterables and raises <code>TypeError</code> otherwise. What does <code>show</code> print for a string, a dict and an int?",
     "code": "def show(obj):\n    try:\n        iterator = iter(obj)\n    except TypeError as te:\n        print(\"not iterable:\", type(te).__name__)\n    else:              # runs only if no exception happened\n        for x in iterator:\n            print(x)\n\nshow(\"hi\")\nshow({\"a\": 1, \"b\": 2})     # a dict iterates over its keys\nshow(range(2))\nshow(42)",
     "output": "h\ni\na\nb\n0\n1\nnot iterable: TypeError",
     "explain": "Known iterables: string, tuple, range, list, set, dict (and its keys/values/items), and generators. <code>iter(obj)</code> returns an <b>iterator</b>, which hands out items one at a time with <code>next()</code>.<br><br>The <code>else</code> part of <code>try</code> runs only when the <code>try</code> block raised nothing. An <code>int</code> is not iterable, so <code>iter(42)</code> raises <code>TypeError</code>.",
     "tags": [
      "iterators"
     ],
     "key": "An iterator is used up once you consume it. <code>iter()</code> on a non-iterable raises <code>TypeError</code>.",
     "mistakes": [
      "Thinking an iterator can be reused after a full loop."
     ],
     "alts": [
      {
       "q": "An iterator remembers its position. What prints?",
       "code": "it = iter([1, 2, 3])\nprint(next(it))\nprint(list(it))\nprint(list(it))",
       "answer": "1\n[2, 3]\n[]"
      },
      {
       "q": "A list makes a NEW iterator each time. What prints?",
       "code": "nums = [1, 2]\nprint(list(nums), list(nums))\nit = iter(nums)\nprint(iter(it) is it)",
       "answer": "[1, 2] [1, 2]\nTrue"
      }
     ]
    },
    {
     "id": "l4-seqops",
     "title": "Shared sequence operations",
     "prompt": "Strings, tuples and lists all support <code>seq[i]</code>, <code>len</code>, <code>+</code>, <code>n * seq</code>, slicing and <code>in</code>. Predict each line.",
     "code": "for seq in (\"abc\", (1, 2, 3), [1, 2, 3]):\n    print(seq[1], len(seq), seq + seq, 2 * seq, seq[0:2], seq[-1] in seq)\n\nprint(\"x\" not in \"abc\")",
     "output": "b 3 abcabc abcabc ab True\n2 3 (1, 2, 3, 1, 2, 3) (1, 2, 3, 1, 2, 3) (1, 2) True\n2 3 [1, 2, 3, 1, 2, 3] [1, 2, 3, 1, 2, 3] [1, 2] True\nTrue",
     "explain": "These operations work the same way on any <b>sequence</b>. <code>+</code> concatenates, <code>n * seq</code> repeats, and <code>seq[i:j]</code> slices from i to j-1. Each one returns a <b>new</b> sequence of the same type.",
     "tags": [
      "lists",
      "strings",
      "tuples"
     ],
     "key": "<code>+</code> and <code>*</code> on sequences make new sequences. A slice <code>[i:j]</code> stops at j-1.",
     "mistakes": [
      "Expecting <code>+</code> between a list and a tuple to work (TypeError)."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "print([0] * 3, \"ab\" * 2, (1,) * 2)\nprint([1, 2] + [3], \"py\" + \"thon\")",
       "answer": "[0, 0, 0] abab (1, 1)\n[1, 2, 3] python"
      },
      {
       "q": "What prints?",
       "code": "try:\n    print([1] + (2,))\nexcept TypeError as e:\n    print(type(e).__name__)",
       "answer": "TypeError"
      }
     ]
    },
    {
     "id": "l4-comp",
     "title": "Comprehensions build lists, sets and dicts",
     "prompt": "The same generator <code>for x in r</code> inside <code>[ ]</code>, <code>{ }</code> and <code>{k: v}</code>. What does each one build?",
     "code": "r = range(0, 5)\nprint([x for x in r])\nprint({x for x in r})\nprint({x: x for x in r})",
     "output": "[0, 1, 2, 3, 4]\n{0, 1, 2, 3, 4}\n{0: 0, 1: 1, 2: 2, 3: 3, 4: 4}",
     "explain": "A comprehension evaluates to an iterable object, and the brackets decide which kind (the \"data constructor\"): <code>[ ]</code> a list, <code>{ }</code> a set, <code>{k: v}</code> a dict.<br><br>A <code>range</code> can be iterated many times. Each comprehension starts a fresh pass.",
     "tags": [
      "comprehensions"
     ],
     "key": "The bracket type decides the result type. A set comprehension drops duplicates, and a dict comprehension keeps the <b>last</b> value for a repeated key.",
     "mistakes": [
      "Expecting duplicate dict keys to keep the first value. The last value wins."
     ],
     "alts": [
      {
       "q": "Duplicate keys and values. What prints?",
       "code": "print({x % 3 for x in range(10)})\nprint({x % 2: x for x in range(5)})",
       "answer": "{0, 1, 2}\n{0: 4, 1: 3}"
      },
      {
       "q": "What prints?",
       "code": "words = [\"hi\", \"hey\", \"yo\"]\nprint({w: len(w) for w in words})\nprint([len(w) for w in words if \"h\" in w])",
       "answer": "{'hi': 2, 'hey': 3, 'yo': 2}\n[2, 3]"
      }
     ]
    },
    {
     "id": "l4-comp-filter",
     "title": "Comprehensions with filters and multiple generators",
     "prompt": "A filter (<code>if</code>), unpacking <code>d.items()</code>, and two <code>for</code> clauses. Predict all three lists.",
     "code": "r = range(0, 5)\nprint([x for x in r if x % 2 == 0])\n\nd = {1: \"one\", 2: \"two\", 3: \"three\", 4: \"four\"}\nprint([y for x, y in d.items() if x <= 2])\n\nprint([(a, b) for a in r\n              for b in d.keys()\n              if a < 2 and b < 2])",
     "output": "[0, 2, 4]\n['one', 'two']\n[(0, 1), (1, 1)]",
     "explain": "A <b>filter</b> is an <code>if</code> condition. Each <code>for ... in</code> pair is a <b>generator</b>. With two generators, the <b>first</b> <code>for</code> is the outer loop and the second is the inner loop, as if they were nested in that order.<br><br><code>d.items()</code> gives <code>(key, value)</code> pairs, unpacked into <code>x, y</code>. The keys 1 and 2 pass the filter, so the result is their values.<br><br>In the third one, a can be 0 or 1 (a &lt; 2) and b can only be 1 (keys start at 1), which gives <code>(0, 1)</code> and <code>(1, 1)</code>.",
     "anatomy": [
      {
       "code": "[y for x, y in d.items() if x <= 2]",
       "notes": [
        {
         "at": "y for",
         "label": "what to keep"
        },
        {
         "at": "x, y in",
         "label": "unpack (key, value)"
        },
        {
         "at": "d.items()",
         "label": "pairs source"
        },
        {
         "at": "if x <= 2",
         "label": "filter on key"
        }
       ]
      }
     ],
     "trace": "[(a, b) for a in r for b in d.keys() if a < 2 and b < 2]\na=0: b=1 ok -> (0,1); b=2,3,4 fail\na=1: b=1 ok -> (1,1); b=2,3,4 fail\na=2,3,4: a<2 fails\nresult: [(0, 1), (1, 1)]",
     "tags": [
      "comprehensions",
      "dict"
     ],
     "key": "Read the <code>for</code> clauses left to right as outer to inner loops. The <code>if</code> filters what gets kept.",
     "mistakes": [
      "Reversing the nesting order of the two <code>for</code> clauses.",
      "Returning keys instead of values: the expression before <code>for</code> is <code>y</code>."
     ],
     "alts": [
      {
       "q": "Two generators: order matters. What prints?",
       "code": "print([x * y for x in [1, 2] for y in [10, 20]])\nprint([(a, b) for a in range(3) for b in range(a)])",
       "answer": "[10, 20, 20, 40]\n[(1, 0), (2, 0), (2, 1)]"
      },
      {
       "q": "Filter on the value. What prints?",
       "code": "d = {\"a\": 3, \"b\": 8, \"c\": 5}\nprint([k for k, v in d.items() if v > 4])\nprint({v: k for k, v in d.items()})",
       "answer": "['b', 'c']\n{3: 'a', 8: 'b', 5: 'c'}"
      },
      {
       "q": "Nested comprehension: flatten. What prints?",
       "code": "m = [[1, 2], [3], [4, 5]]\nprint([x for row in m for x in row if x != 3])",
       "answer": "[1, 2, 4, 5]"
      }
     ]
    },
    {
     "id": "l4-primes",
     "title": "primes(n) with all()",
     "prompt": "<code>x</code> is kept if <code>all(x % y != 0 ...)</code> for every y from 2 to &radic;x. What is <code>primes(20)</code>?",
     "code": "import math\n\ndef primes(n):\n    return [x for x in range(2, n)\n            if all(x % y != 0\n                   for y in range(2, int(math.sqrt(x)) + 1))]\n\nprint(primes(20))",
     "output": "[2, 3, 5, 7, 11, 13, 17, 19]",
     "explain": "<code>all(...)</code> is <code>True</code> when every value is true, that is, no divisor was found. Checking divisors up to &radic;x is enough, and the <code>+ 1</code> is needed because <code>range</code> excludes its stop.<br><br>For x = 2 and 3 the inner range is empty, and <b><code>all</code> of an empty sequence is True</b>, so both count as prime. <code>n</code> itself is excluded by <code>range(2, n)</code>.",
     "anatomy": [
      {
       "code": "all(x % y != 0 for y in range(2, int(math.sqrt(x)) + 1))",
       "notes": [
        {
         "at": "all(",
         "label": "every test True?"
        },
        {
         "at": "x % y != 0",
         "label": "y does not divide x"
        },
        {
         "at": "int(math.sqrt(x)) + 1",
         "label": "up to sqrt(x) inclusive"
        }
       ]
      }
     ],
     "tags": [
      "comprehensions"
     ],
     "key": "<code>all([])</code> is True and <code>any([])</code> is False. The <code>+ 1</code> makes &radic;x itself get tested.",
     "mistakes": [
      "Dropping <code>+ 1</code>: then 4, 9 and 25 would count as prime."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "print(all([]), any([]), all([1, 0]), any([0, 3]))",
       "answer": "True False False True"
      },
      {
       "q": "Without +1. What prints?",
       "code": "import math\ndef primes_bad(n):\n    return [x for x in range(2, n)\n            if all(x % y != 0 for y in range(2, int(math.sqrt(x))))]\nprint(primes_bad(12))",
       "answer": "[2, 3, 4, 5, 6, 7, 8, 9, 11]"
      },
      {
       "q": "What prints?",
       "code": "import math\ndef primes(n):\n    return [x for x in range(2, n)\n            if all(x % y != 0 for y in range(2, int(math.sqrt(x)) + 1))]\nprint(primes(30)[-3:], len(primes(10)))",
       "answer": "[19, 23, 29] 4"
      }
     ]
    },
    {
     "id": "l4-str-repr",
     "title": "__str__ vs __repr__",
     "prompt": "<code>print</code> and <code>str()</code> call <code>__str__</code>, while the REPL echo and containers use <code>__repr__</code> (the official string). <code>datetime.now()</code> changes every run, so its output is not fixed.",
     "code": "import datetime\ntoday = datetime.datetime.now()\nprint(repr(today))   # like the REPL echo: datetime.datetime(2023, 9, 20, ...)\nprint(today)         # __str__: 2023-09-20 12:33:55.834546\nprint(str(today))",
     "output": null,
     "explain": "<code>__str__</code> is the friendly, human-readable form. <code>__repr__</code> is the <b>official</b> form, often valid Python that could rebuild the object. The REPL shows <code>repr</code>, and <code>print</code> shows <code>str</code>.<br><br>A list prints its elements with their <b>repr</b>. That is why strings inside a list show quotes. See the fixed-date version in the extra block.",
     "tags": [
      "str",
      "classes"
     ],
     "key": "<code>print(x)</code> uses <code>__str__</code>. Containers and the REPL use <code>__repr__</code>. Without <code>__str__</code>, Python falls back to <code>__repr__</code>.",
     "mistakes": [
      "Expecting <code>print([obj])</code> to use <code>obj.__str__</code>. It uses <code>__repr__</code>."
     ],
     "extra": [
      {
       "label": "Fixed date (deterministic)",
       "code": "import datetime\nd = datetime.datetime(2023, 9, 20, 12, 33, 55, 834546)\nprint(repr(d))\nprint(d)\nprint([d])",
       "output": "datetime.datetime(2023, 9, 20, 12, 33, 55, 834546)\n2023-09-20 12:33:55.834546\n[datetime.datetime(2023, 9, 20, 12, 33, 55, 834546)]"
      }
     ],
     "alts": [
      {
       "q": "print vs a list. What prints?",
       "code": "class P:\n    def __str__(self):\n        return \"str-P\"\n    def __repr__(self):\n        return \"repr-P\"\np = P()\nprint(p)\nprint([p])\nprint(str(p), repr(p))",
       "answer": "str-P\n[repr-P]\nstr-P repr-P"
      },
      {
       "q": "Only __repr__ defined. What prints?",
       "code": "class Q:\n    def __repr__(self):\n        return \"Q()\"\nprint(Q(), [Q()])",
       "answer": "Q() [Q()]"
      },
      {
       "q": "What prints?",
       "code": "print(\"hi\", repr(\"hi\"), [\"hi\"])",
       "answer": "hi 'hi' ['hi']"
      }
     ]
    },
    {
     "id": "l4-identity",
     "title": "id(), ==, and is",
     "prompt": "Two separate lists with the same contents. Are they <code>==</code>? Are they the same object? (Real <code>id</code> numbers change every run, so we compare them.)",
     "code": "x = [1, 2, 3]\ny = [1, 2, 3]\nprint(x == y)            # same content\nprint(id(x) == id(y))    # same object?\nprint(x is y)\n\nz = x                    # alias: another name for the SAME object\nprint(z is x, id(z) == id(x))",
     "output": "True\nFalse\nFalse\nTrue True",
     "explain": "<code>==</code> compares <b>content</b> (by default, for builtins). <code>id(obj)</code> is the object's identity, and <code>a is b</code> means <code>id(a) == id(b)</code>. Two list literals always create two different objects.<br><br><code>z = x</code> copies nothing. It adds a second name for the same list.",
     "trace": "x ---> [1, 2, 3]   (object A)\ny ---> [1, 2, 3]   (object B)\nz ---> object A\nx == y : True  (same content)\nx is y : False (A vs B)\nz is x : True",
     "tags": [
      "identity",
      "aliasing"
     ],
     "key": "<code>==</code> means same content. <code>is</code> means same object. Assignment never copies.",
     "mistakes": [
      "Using <code>is</code> to compare values. Use <code>==</code>, and save <code>is</code> for <code>None</code> and identity checks."
     ],
     "alts": [
      {
       "q": "+= mutates, = + rebinds. What prints?",
       "code": "x = [1, 2]\ny = x\ny += [3]\nprint(x, x is y)\ny = y + [4]\nprint(x, x is y)",
       "answer": "[1, 2, 3] True\n[1, 2, 3] False"
      },
      {
       "q": "What prints?",
       "code": "a = [1]\nb = [a, a]\nb[0].append(2)\nprint(b, b[0] is b[1])",
       "answer": "[[1, 2], [1, 2]] True"
      },
      {
       "q": "What prints?",
       "code": "s = [1, 2]\nt = list(s)\nprint(s == t, s is t, s[:] is s)",
       "answer": "True False False"
      }
     ]
    },
    {
     "id": "l4-concurrent",
     "title": "Concurrent modification: removing while looping",
     "prompt": "<code>remove(a, b)</code> tries to delete from <code>a</code> every item that is also in <code>b</code>. 1 and 2 are in both lists. What is <code>a</code> afterwards?",
     "code": "a = [1, 2, 3, 4]\nb = [1, 2, 5, 6]\n\ndef remove(l1, l2):\n    for x in l1:\n        if x in l2:\n            l1.remove(x)\n\nremove(a, b)\nprint(a)      # 2 was NOT removed!\n\n# fix: loop over a copy\na = [1, 2, 3, 4]\ndef remove_fixed(l1, l2):\n    for x in l1[:]:          # l1[:] is a shallow copy\n        if x in l2:\n            l1.remove(x)\n\nremove_fixed(a, b)\nprint(a)",
     "output": "[2, 3, 4]\n[3, 4]",
     "explain": "A <code>for</code> loop over a list walks an <b>index</b> forward: 0, 1, 2, ... Removing an item shifts everything after it one place left, so the loop <b>skips</b> the element that slid into the current slot.<br><br>Also, <code>a</code> is passed by reference, so <code>l1</code> <b>is</b> <code>a</code> and the caller's list changes. Fix: iterate over a copy (<code>l1[:]</code> or <code>list(l1)</code>), or build a new list with a comprehension. The slide warns that for nested data, a shallow copy may not be enough.",
     "trace": "step | index | list before          | x | x in b? | list after\n1    | 0     | [1, 2, 3, 4]         | 1 | yes     | [2, 3, 4]\n2    | 1     | [2, 3, 4]            | 3 | no      | [2, 3, 4]\n3    | 2     | [2, 3, 4]            | 4 | no      | [2, 3, 4]\n4    | 3     | len is 3 -> loop ends\n2 slid into index 0 after the remove, so it was never visited.",
     "tags": [
      "aliasing",
      "lists"
     ],
     "key": "Never change a list's length while looping over it. Loop over a copy instead.",
     "mistakes": [
      "Expecting <code>[3, 4]</code> from the original loop.",
      "Thinking the function changes only a local copy. <code>l1</code> and <code>a</code> are the same list."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "nums = [2, 4, 6, 8]\nfor x in nums:\n    if x % 2 == 0:\n        nums.remove(x)\nprint(nums)",
       "answer": "[4, 8]"
      },
      {
       "q": "What prints?",
       "code": "vals = [1, 1, 2, 3]\nfor v in vals:\n    if v == 1:\n        vals.remove(v)\nprint(vals)",
       "answer": "[1, 2, 3]"
      },
      {
       "q": "The comprehension fix builds a new list. What prints?",
       "code": "a = [1, 2, 3, 4]\nb = [1, 2, 5, 6]\na = [x for x in a if x not in b]\nprint(a)",
       "answer": "[3, 4]"
      }
     ]
    },
    {
     "id": "l4-aliasing",
     "title": "Aliasing with [[]] * 2",
     "prompt": "<code>l1 = [[]] * 2</code>, then append <code>i</code> to <code>l1[i]</code>. Why do both inner lists end up as <code>[0, 1]</code>?",
     "code": "l1 = [[]] * 2\nfor i in range(len(l1)):\n    l1[i].append(i)\nprint(l1)\nprint(l1[0] is l1[1])\n\n# fix: a comprehension creates a NEW inner list each time\nl2 = [[] for _ in range(2)]\nfor i in range(len(l2)):\n    l2[i].append(i)\nprint(l2)",
     "output": "[[0, 1], [0, 1]]\nTrue\n[[0], [1]]",
     "explain": "<code>*</code> copies <b>references</b>, not objects. <code>[[]] * 2</code> is a list holding the <b>same</b> empty list twice. Appending through <code>l1[0]</code> or <code>l1[1]</code> changes that one shared list.<br><br>The fix: <code>[[] for _ in range(2)]</code> evaluates <code>[]</code> on every pass, so each slot gets its own list. For copying existing nested data, use <code>copy.deepcopy</code>.",
     "trace": "l1 = [[]] * 2\n\n l1 ---> [ * , * ]\n           \\   /\n            v v\n            []   <- ONE shared list\n\nl1[0].append(0) -> shared = [0]\nl1[1].append(1) -> shared = [0, 1]\nprint -> [[0, 1], [0, 1]]",
     "tags": [
      "aliasing",
      "copying"
     ],
     "key": "<code>[x] * n</code> repeats the same reference n times. That is harmless for immutable values like 0, but a trap for lists.",
     "mistakes": [
      "Thinking <code>[[]] * 2</code> makes two independent lists.",
      "Thinking <code>.copy()</code> or <code>[:]</code> copies the inner lists too. Both are shallow."
     ],
     "alts": [
      {
       "q": "Grid trap. What prints?",
       "code": "row = [0] * 3\ngrid = [row] * 2\ngrid[0][0] = 9\nprint(grid)",
       "answer": "[[9, 0, 0], [9, 0, 0]]"
      },
      {
       "q": "Shallow vs deep copy. What prints?",
       "code": "import copy\na = [[1], [2]]\nb = a.copy()\nc = copy.deepcopy(a)\nb[0].append(9)\nc[1].append(7)\nprint(a)\nprint(b[0] is a[0], c[0] is a[0])",
       "answer": "[[1, 9], [2]]\nTrue False"
      },
      {
       "q": "Immutable elements are fine. What prints?",
       "code": "z = [0] * 3\nz[0] = 5\nprint(z)",
       "answer": "[5, 0, 0]"
      }
     ]
    },
    {
     "id": "l4-map",
     "title": "map transforms each element",
     "prompt": "<code>map</code> with a lambda and with the method <code>str.upper</code>. What do the lists contain?",
     "code": "numbers = [1, 2, 3, 4, 5]\ny = list(map(lambda x: x ** 2, numbers))\nprint(y)\n\nwords = [\"hello\", \"world\"]\nz = list(map(str.upper, words))\nprint(z)",
     "output": "[1, 4, 9, 16, 25]\n['HELLO', 'WORLD']",
     "explain": "<code>map(f, iterable)</code> applies <code>f</code> to each element. <code>str.upper</code> is the unbound method, called as <code>str.upper(\"hello\")</code>. <code>map</code> gives back an <b>iterator</b>, and <code>list(...)</code> forces it to run.",
     "tags": [
      "map",
      "higher-order"
     ],
     "key": "<code>map</code> applies f to every element and returns a lazy iterator.",
     "mistakes": [
      "Writing <code>map(str.upper(), words)</code>, which calls upper too early."
     ],
     "alts": [
      {
       "q": "Two iterables: map stops at the shortest. What prints?",
       "code": "print(list(map(lambda x, y: x + y, [1, 2, 3], [10, 20])))",
       "answer": "[11, 22]"
      },
      {
       "q": "What prints?",
       "code": "print(list(map(int, \"123\")), sum(map(len, [\"ab\", \"c\"])))",
       "answer": "[1, 2, 3] 3"
      }
     ]
    },
    {
     "id": "l4-map-lazy",
     "title": "map is a lazy iterator: you can consume it only once",
     "prompt": "<code>y = map(...)</code> is not a list. Loop over it twice: what does the second loop print, and what is <code>list(y)</code> after that?",
     "code": "numbers = [1, 2, 3, 4, 5]\ny = map(lambda x: x ** 2, numbers)\nprint(type(y).__name__)       # printing y itself shows <map object at 0x...>\n\nfor x in y:\n    print(x)\nprint(\"second loop:\")\nfor x in y:                   # already used up: prints nothing\n    print(x)\nprint(list(y))",
     "output": "map\n1\n4\n9\n16\n25\nsecond loop:\n[]",
     "explain": "<code>map</code> (and <code>filter</code>) return <b>iterators</b> that compute values <b>only when asked</b> (lazily). Once the first loop pulls every value, the iterator is <b>exhausted</b>: the second loop runs zero times and <code>list(y)</code> is <code>[]</code>.<br><br>To reuse the results, <b>reify</b> them first: <code>z = list(y)</code>. A list can be looped over any number of times.",
     "trace": "y = map(sq, [1,2,3,4,5])   (nothing computed yet)\nloop 1: pulls 1, 4, 9, 16, 25 -> iterator now EMPTY\nloop 2: nothing left -> no output\nlist(y) -> []",
     "tags": [
      "map",
      "iterators"
     ],
     "key": "map and filter iterators are single-use. Call <code>list()</code> once and reuse the list.",
     "mistakes": [
      "Expecting the second loop to print the squares again.",
      "Expecting <code>print(map(...))</code> to show the values."
     ],
     "alts": [
      {
       "q": "Laziness: nothing runs until values are pulled. What prints?",
       "code": "def sq(x):\n    print(\"computing\", x)\n    return x * x\nm = map(sq, [1, 2])\nprint(\"before list\")\nprint(list(m))",
       "answer": "before list\ncomputing 1\ncomputing 2\n[1, 4]"
      },
      {
       "q": "What prints?",
       "code": "m = map(abs, [-1, -2, 3])\nprint(sum(m), sum(m))",
       "answer": "6 0"
      },
      {
       "q": "filter is lazy too. What prints?",
       "code": "f = filter(lambda x: x > 1, [1, 2, 3])\nprint(2 in f, list(f))",
       "answer": "True [3]"
      }
     ]
    },
    {
     "id": "l4-filter",
     "title": "filter keeps elements where the test is true",
     "prompt": "<code>filter(lambda x: x % 2 == 0, numbers)</code>. What is the list?",
     "code": "numbers = [1, 2, 3, 4, 5]\ny = list(filter(lambda x: x % 2 == 0, numbers))\nprint(y)",
     "output": "[2, 4]",
     "explain": "<code>filter(pred, iterable)</code> keeps each element for which <code>pred(element)</code> is truthy. Like map, it returns a lazy iterator, so wrap it in <code>list()</code>. The comprehension equivalent is <code>[x for x in numbers if x % 2 == 0]</code>.",
     "tags": [
      "filter",
      "higher-order"
     ],
     "key": "filter = keep where the test is true. Same as a comprehension with <code>if</code>.",
     "mistakes": [
      "Confusing it with map: filter never changes the values, it only selects them."
     ],
     "alts": [
      {
       "q": "filter(None, ...) keeps truthy values. What prints?",
       "code": "print(list(filter(None, [0, 1, \"\", \"a\", None, [], [0]])))",
       "answer": "[1, 'a', [0]]"
      },
      {
       "q": "map + filter combined. What prints?",
       "code": "nums = [1, 2, 3, 4, 5, 6]\nprint(list(map(lambda x: x * 10, filter(lambda x: x % 3 == 0, nums))))",
       "answer": "[30, 60]"
      }
     ]
    },
    {
     "id": "l4-reduce",
     "title": "reduce folds a list into one value",
     "prompt": "<code>reduce(lambda x, y: x * y, numbers)</code>, then the same with initial value 10. What are the two products?",
     "code": "from functools import reduce\n\nnumbers = [1, 2, 3, 4, 5]\nproduct = reduce(lambda x, y: x * y, numbers)\nprint(product)        # 1 * 2 * 3 * 4 * 5\n\n# add an initial value as the third argument\nproduct = reduce(lambda x, y: x * y, numbers, 10)\nprint(product)        # 10 * 1 * 2 * 3 * 4 * 5",
     "output": "120\n1200",
     "explain": "<code>reduce(f, seq, init)</code> keeps an <b>accumulator</b> <code>x</code>. It starts as <code>init</code> (or as the first element if there is no init), then repeatedly sets <code>x = f(x, next_element)</code>.<br><br><code>x</code> is always the <b>running result</b> and <code>y</code> is the <b>next element</b>. <code>reduce</code> must be imported from <code>functools</code>.",
     "anatomy": [
      {
       "code": "reduce(lambda x, y: x * y, numbers, 10)",
       "notes": [
        {
         "at": "lambda x, y",
         "label": "x = accumulator, y = next"
        },
        {
         "at": "x * y",
         "label": "combine step"
        },
        {
         "at": "numbers",
         "label": "items to fold"
        },
        {
         "at": "10)",
         "label": "initial accumulator"
        }
       ]
      }
     ],
     "trace": "reduce(lambda x, y: x * y, [1,2,3,4,5], 10)\nx (acc) | y | x * y\n10      | 1 | 10\n10      | 2 | 20\n20      | 3 | 60\n60      | 4 | 240\n240     | 5 | 1200  <- result\n\nwithout init: x starts at 1, y starts at 2 -> 2, 6, 24, 120",
     "tags": [
      "reduce",
      "higher-order"
     ],
     "key": "reduce: the accumulator starts at init (or the first element). The lambda's first parameter is the accumulator and the second is the next item.",
     "mistakes": [
      "Forgetting <code>from functools import reduce</code>.",
      "Swapping the roles of x and y in non-commutative folds (subtraction, string building).",
      "<code>reduce</code> on an empty list with no initial value raises <code>TypeError</code>."
     ],
     "alts": [
      {
       "q": "Non-commutative fold. What prints?",
       "code": "from functools import reduce\nprint(reduce(lambda acc, s: acc + s, [\"a\", \"b\", \"c\"], \"x\"))\nprint(reduce(lambda acc, d: acc * 10 + d, [1, 2, 3]))\nprint(reduce(lambda x, y: x - y, [10, 2, 3]))",
       "answer": "xabc\n123\n5"
      },
      {
       "q": "Empty list. What prints?",
       "code": "from functools import reduce\nprint(reduce(lambda x, y: x + y, [], 0))\ntry:\n    reduce(lambda x, y: x + y, [])\nexcept TypeError as e:\n    print(type(e).__name__)",
       "answer": "0\nTypeError"
      },
      {
       "q": "Building a list with reduce. What prints?",
       "code": "from functools import reduce\nprint(reduce(lambda acc, x: acc + [x * 2], [1, 2, 3], []))\nprint(reduce(lambda a, b: a if a > b else b, [3, 9, 4]))",
       "answer": "[2, 4, 6]\n9"
      }
     ]
    },
    {
     "id": "l4-fib",
     "title": "Recursion: fib(10) makes 177 calls",
     "prompt": "A global <code>count</code> counts the calls. What do <code>fib(10)</code> and <code>count</code> print?",
     "code": "count = 0\n\ndef fib(n):\n    global count\n    count = count + 1\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fib(n - 1) + fib(n - 2)\n\nprint(fib(10), count)",
     "output": "55 177",
     "explain": "Each call of fib(n) with n &ge; 2 makes two more calls, so the same values are recomputed again and again. The number of calls C(n) = C(n-1) + C(n-2) + 1, with C(0) = C(1) = 1. That gives <b>177</b> calls for n = 10 (it grows exponentially).<br><br><code>global count</code> is needed because the function <b>assigns</b> count.",
     "trace": "C(n) = number of calls for fib(n) = C(n-1) + C(n-2) + 1\nn    : 0 1 2 3 4  5  6  7  8  9   10\nfib  : 0 1 1 2 3  5  8  13 21 34  55\nC(n) : 1 1 3 5 9  15 25 41 67 109 177",
     "tags": [
      "recursion",
      "scope"
     ],
     "key": "fib(10) = 55 with <b>177</b> calls without memoization, and <b>11</b> with it.",
     "mistakes": [
      "Leaving out <code>global count</code>, which gives UnboundLocalError."
     ],
     "alts": [
      {
       "q": "Count calls for fib(5). What prints?",
       "code": "count = 0\ndef fib(n):\n    global count\n    count = count + 1\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fib(n - 1) + fib(n - 2)\nprint(fib(5), count)",
       "answer": "5 15"
      },
      {
       "q": "How many times is fib(1) called during fib(5)?",
       "code": "calls = {}\ndef fib(n):\n    calls[n] = calls.get(n, 0) + 1\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    return fib(n - 1) + fib(n - 2)\nfib(5)\nprint(calls[1], calls[2], calls[5])",
       "answer": "5 3 1"
      }
     ]
    },
    {
     "id": "l4-fib2",
     "title": "Memoization with a mutable default: fib2(n, memo={})",
     "prompt": "<code>fib2</code> caches results in <code>memo</code>, a <b>default dict shared across calls</b>. How many counted calls now? What happens on a second call?",
     "code": "count = 0\n\ndef fib2(n, memo={}):\n    if n in memo:\n        return memo[n]\n\n    global count\n    count = count + 1\n\n    if n <= 0:\n        result = 0\n    elif n == 1:\n        result = 1\n    else:\n        result = fib2(n - 1, memo) + fib2(n - 2, memo)\n\n    memo[n] = result\n    return result\n\nprint(fib2(10), count)\nprint(fib2(10), count)     # memo survives between calls!\nprint(fib2(12), count)     # only 11 and 12 are new",
     "output": "55 11\n55 11\n144 13",
     "explain": "With the cache, each n from 0 to 10 is computed <b>once</b>: 11 counted calls. (Cache hits return before <code>count</code> is incremented.)<br><br><code>memo={}</code> is created <b>once</b>, at def time, so the cache persists across top-level calls. The second <code>fib2(10)</code> is a pure cache hit (count stays 11), and <code>fib2(12)</code> computes only 11 and 12 (count becomes 13). Here the mutable-default \"gotcha\" is used <b>on purpose</b>.",
     "anatomy": [
      {
       "code": "def fib2(n, memo={}):",
       "notes": [
        {
         "at": "n,",
         "label": "argument"
        },
        {
         "at": "memo=",
         "label": "default parameter"
        },
        {
         "at": "{}",
         "label": "ONE dict, made at def time"
        }
       ]
      }
     ],
     "trace": "call fib2(10) (memo empty)\nn computed in order of FIRST visit: 10, 9, 8, ..., 1, 0 -> 11 counted calls\nevery repeated n (e.g. second fib2(8)) -> cache hit, not counted\n\nprint #1: 55 11\nprint #2: 55 11   (10 in memo already)\nprint #3: 144 13  (computes 12 and 11 only)",
     "tags": [
      "recursion",
      "memoization",
      "defaults"
     ],
     "key": "Memoization: compute each n once, giving 11 calls for fib(10). A default <code>memo={}</code> is shared by every call.",
     "mistakes": [
      "Expecting the count to go back up by 11 on the second call: the memo is still full.",
      "Thinking <code>memo={}</code> creates a fresh dict every call."
     ],
     "alts": [
      {
       "q": "Count across calls. What prints?",
       "code": "count = 0\ndef fib2(n, memo={}):\n    if n in memo:\n        return memo[n]\n    global count\n    count = count + 1\n    if n <= 0:\n        result = 0\n    elif n == 1:\n        result = 1\n    else:\n        result = fib2(n - 1, memo) + fib2(n - 2, memo)\n    memo[n] = result\n    return result\nfib2(5)\nprint(count)\nfib2(5, {})\nprint(count)",
       "answer": "6\n12"
      },
      {
       "q": "Shared default dict. What prints?",
       "code": "def remember(k, v, store={}):\n    store[k] = v\n    return store\nremember(\"a\", 1)\nremember(\"b\", 2)\nprint(remember(\"c\", 3))",
       "answer": "{'a': 1, 'b': 2, 'c': 3}"
      }
     ]
    },
    {
     "id": "l4-fib3",
     "title": "Memoization with an inner function: fib3",
     "prompt": "<code>fib3</code> makes a fresh <code>memo</code> on each call, and the inner <code>f</code> shares it through the enclosing scope. What is the count after one call and after two calls?",
     "code": "count = 0\n\ndef fib3(n):\n    memo = {}                 # memo is a local variable of fib3\n    def f(n):\n        if n in memo:         # read from the enclosing scope\n            return memo[n]\n        global count\n        count = count + 1\n        if n <= 0:\n            result = 0\n        elif n == 1:\n            result = 1\n        else:\n            result = f(n - 1) + f(n - 2)\n        memo[n] = result      # mutating, not rebinding: no 'nonlocal' needed\n        return result\n    return f(n)\n\nprint(fib3(10), count)\nprint(fib3(10), count)        # new memo each call",
     "output": "55 11\n55 22",
     "explain": "Each call to <code>fib3</code> creates a <b>new</b> <code>memo</code>. The inner function <code>f</code> reads it from the enclosing scope, and <code>memo[n] = result</code> <b>mutates</b> the dict without rebinding the name, so no declaration is needed.<br><br>One call gives 11 counted calls. Unlike fib2, the cache does <b>not</b> persist, so a second call adds 11 more (22).",
     "tags": [
      "recursion",
      "memoization",
      "closures",
      "scope"
     ],
     "key": "An inner function can mutate an outer dict without <code>nonlocal</code>. A fresh memo per call means no sharing between calls.",
     "mistakes": [
      "Thinking <code>memo[n] = ...</code> inside <code>f</code> makes memo local (only <code>memo = ...</code> would)."
     ],
     "alts": [
      {
       "q": "Mutate vs rebind an outer variable. What prints?",
       "code": "def outer():\n    d = {}\n    def add():\n        d[\"k\"] = 1\n    add()\n    return d\nprint(outer())\n\ndef outer2():\n    total = 0\n    def add():\n        total = 5\n    add()\n    return total\nprint(outer2())",
       "answer": "{'k': 1}\n0"
      }
     ]
    }
   ]
  },
  {
   "id": "l5",
   "title": "Lecture 5: Modules, File IO, Classes, Iterators",
   "intro": "<p><b>Ideas:</b> modules and the import forms (<code>import m</code>, <code>as</code>, <code>from ... import</code>); file IO with <code>try/except/finally</code> and with <code>with</code>; classes with <code>__init__</code>; instance vs class attributes; <code>__str__</code>; <code>__eq__</code> and <code>__hash__</code> (needed for sets and dict keys, and <code>__eq__</code> alone makes a class unhashable); magic methods <code>__add__</code> and <code>__call__</code>; inheritance and overriding (expression tree); iterator classes (<code>__iter__</code>, <code>__next__</code>, <code>StopIteration</code>); context managers (<code>__enter__</code>, <code>__exit__</code>).</p>",
   "items": [
    {
     "id": "l5-import",
     "title": "import ... as and from ... import",
     "prompt": "<code>import calendar as cal</code> creates the alias <code>cal</code>, and <code>from calendar import TextCalendar, SUNDAY</code> imports the names directly. Both print September 2023 with Sunday first.",
     "code": "import calendar as cal\n\n# Set Sunday as the first day of the week\nc = cal.TextCalendar(cal.SUNDAY)\nprint(c.formatmonth(2023, 9))\n\nfrom calendar import TextCalendar, SUNDAY\nc2 = TextCalendar(SUNDAY)\nprint(c2.formatmonth(2023, 9) == c.formatmonth(2023, 9))",
     "output": "   September 2023\nSu Mo Tu We Th Fr Sa\n                1  2\n 3  4  5  6  7  8  9\n10 11 12 13 14 15 16\n17 18 19 20 21 22 23\n24 25 26 27 28 29 30\n\nTrue",
     "explain": "A <b>module</b> is a file of top-level variables, functions and classes. The import forms are:<br>&bull; <code>import calendar</code> creates the name <code>calendar</code>, used as <code>calendar.X</code><br>&bull; <code>import calendar as cal</code> creates the alias <code>cal</code><br>&bull; <code>from calendar import TextCalendar</code> brings just that name in<br>&bull; <code>from calendar import *</code> brings in all public names (it can shadow your own names)",
     "tags": [
      "modules"
     ],
     "key": "<code>import m</code> gives <code>m.x</code>. <code>from m import x</code> gives <code>x</code> directly.",
     "mistakes": [
      "After <code>import calendar as cal</code>, writing <code>calendar.SUNDAY</code>: only <code>cal</code> is defined."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "import math as m\nfrom math import sqrt, pi\nprint(sqrt(9), round(pi, 2), m.floor(2.7))\ntry:\n    print(math.pi)\nexcept NameError as e:\n    print(type(e).__name__)",
       "answer": "3.0 3.14 2\nNameError"
      }
     ]
    },
    {
     "id": "l5-fileio",
     "title": "File IO with try / except / finally (and a hidden bug)",
     "prompt": "<code>readFile</code> closes the file in <code>finally</code>. It works for an existing file. What happens for a <b>missing</b> file?",
     "code": "import os, tempfile\npath = os.path.join(tempfile.gettempdir(), \"l5_demo.txt\")\nwith open(path, \"w\") as f:\n    f.write(\"line 1\\nline 2\")\n\ndef readFile(path):\n    try:\n        file = open(path, 'r')        # read mode\n        content = file.read()\n        print(\"File content:\")\n        print(content)\n    except FileNotFoundError:\n        print(f\"The file '{os.path.basename(path)}' does not exist.\")\n    except Exception as e:\n        print(f\"An error occurred: {str(e)}\")\n    finally:\n        if file:                      # BUG if open() failed: 'file' never assigned\n            file.close()\n\nreadFile(path)\ntry:\n    readFile(\"no_such_file.txt\")\nexcept NameError as e:\n    print(type(e).__name__)",
     "output": "File content:\nline 1\nline 2\nThe file 'no_such_file.txt' does not exist.\nUnboundLocalError",
     "explain": "For the existing file, the content prints and <code>finally</code> closes it.<br><br>For a missing file, <code>open</code> raises <code>FileNotFoundError</code> <b>before</b> <code>file</code> is assigned. The except block prints the message, then <code>finally</code> runs <code>if file:</code> and reads an unassigned local, which raises <b><code>UnboundLocalError</code></b> (a <code>NameError</code>). <code>finally</code> <b>always</b> runs, even after an exception was handled.<br><br>Fixes: put <code>file = None</code> before <code>try</code>, or use <code>with</code> (next item). (The message uses <code>basename</code> only to keep the output short.)",
     "tags": [
      "exceptions",
      "files",
      "scope"
     ],
     "key": "<code>finally</code> always runs. Make sure every name it uses is assigned before the <code>try</code>.",
     "mistakes": [
      "Thinking the <code>finally</code> block is safe here. It crashes when <code>open</code> fails.",
      "Putting <code>except Exception</code> before <code>except FileNotFoundError</code>: the general one catches everything first."
     ],
     "alts": [
      {
       "q": "Order of except clauses. What prints?",
       "code": "try:\n    open(\"no_such_file_715.txt\")\nexcept Exception:\n    print(\"general\")\nexcept FileNotFoundError:\n    print(\"not found\")",
       "answer": "general"
      },
      {
       "q": "What prints?",
       "code": "def f():\n    try:\n        x = 1 / 0\n    except ZeroDivisionError:\n        print(\"caught\")\n        return \"from except\"\n    finally:\n        print(\"finally\")\nprint(f())",
       "answer": "caught\nfinally\nfrom except"
      }
     ]
    },
    {
     "id": "l5-with",
     "title": "with closes the file automatically",
     "prompt": "<code>readFile2</code> uses <code>with open(...)</code>. What prints for an existing file and for a missing one?",
     "code": "import os, tempfile\npath = os.path.join(tempfile.gettempdir(), \"l5_demo2.txt\")\nwith open(path, \"w\") as f:\n    f.write(\"hello\")\n\ndef readFile2(path):\n    try:\n        with open(path, 'r') as file:    # read mode\n            contents = file.read()\n            print(\"File Contents:\")\n            print(contents)\n        print(\"closed?\", file.closed)\n    except FileNotFoundError:\n        print(\"File not found.\")\n    except IOError:\n        print(\"An error occurred while reading the file.\")\n\nreadFile2(path)\nreadFile2(\"no_such_file.txt\")",
     "output": "File Contents:\nhello\nclosed? True\nFile not found.",
     "explain": "The <code>with</code> statement calls the file's <code>__exit__</code> when the block ends, normally or by exception, so the file is <b>always closed</b> and no <code>finally</code> is needed. A missing file raises <code>FileNotFoundError</code> from <code>open</code>, which the first except catches.",
     "tags": [
      "files",
      "context managers"
     ],
     "key": "<code>with</code> auto-closes the file, even if an error happens.",
     "mistakes": [
      "Reading from <code>file</code> after the <code>with</code> block, when it is already closed (ValueError)."
     ],
     "alts": [
      {
       "q": "Reading after the with block. What prints?",
       "code": "import os, tempfile\np = os.path.join(tempfile.gettempdir(), \"l5_alt.txt\")\nwith open(p, \"w\") as f:\n    f.write(\"x\")\nwith open(p) as f:\n    pass\ntry:\n    f.read()\nexcept ValueError as e:\n    print(type(e).__name__, f.closed)",
       "answer": "ValueError True"
      }
     ]
    },
    {
     "id": "l5-init",
     "title": "Class and constructor __init__",
     "prompt": "Two <code>Dog</code> objects, each with its own <code>name</code> and <code>age</code>. What does <code>info()</code> print for each?",
     "code": "class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def info(self):\n        print(f\"Name: {self.name}, Age: {self.age}\")\n\ndog1 = Dog(\"Buddy\", 3)\ndog2 = Dog(\"Molly\", 5)\ndog1.info()\ndog2.info()",
     "output": "Name: Buddy, Age: 3\nName: Molly, Age: 5",
     "explain": "The constructor is always named <code>__init__</code>. <code>self.name = name</code> creates an <b>instance attribute</b> stored in that one object, so each Dog has its own values. <code>dog1.info()</code> is shorthand for <code>Dog.info(dog1)</code>.",
     "tags": [
      "classes"
     ],
     "key": "<code>self.x = ...</code> in <code>__init__</code> makes a per-object (instance) attribute.",
     "mistakes": [
      "Forgetting <code>self.</code>: a plain <code>name = name</code> just makes a local variable."
     ],
     "alts": [
      {
       "q": "Method call two ways. What prints?",
       "code": "class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def info(self):\n        return f\"{self.name}:{self.age}\"\nd = Dog(\"Rex\", 2)\nprint(d.info(), Dog.info(d))",
       "answer": "Rex:2 Rex:2"
      },
      {
       "q": "Forgetting self. What prints?",
       "code": "class Box:\n    def __init__(self, v):\n        v = v * 2\nb = Box(3)\nprint(hasattr(b, \"v\"))",
       "answer": "False"
      }
     ]
    },
    {
     "id": "l5-class-attr",
     "title": "Instance vs class attributes",
     "prompt": "<code>count</code> lives on the <b>class</b> and <code>id</code> on each <b>instance</b>. What prints, especially after <code>a.count = 99</code>?",
     "code": "class Counter:\n    count = 0                       # class attribute: shared by all\n\n    def __init__(self):\n        Counter.count += 1          # update the CLASS attribute\n        self.id = Counter.count     # instance attribute\n\na = Counter()\nb = Counter()\nprint(Counter.count, a.count, b.count, a.id, b.id)\n\na.count = 99                        # creates an INSTANCE attribute on a (shadows)\nprint(Counter.count, a.count, b.count)\ndel a.count                         # remove the shadow\nprint(a.count)",
     "output": "2 2 2 1 2\n2 99 2\n2",
     "explain": "Attribute lookup <code>obj.x</code> checks the <b>instance first</b> and then the <b>class</b>. <code>a.count</code> finds nothing on <code>a</code>, so it reads <code>Counter.count</code>.<br><br><b>Assigning</b> <code>a.count = 99</code> never changes the class. It creates a new attribute on <code>a</code> that <b>shadows</b> the class one. <code>b</code> still sees the class value.",
     "trace": "Counter.count = 2        (class)\na: {id: 1}  -> a.count reads class -> 2\nb: {id: 2}  -> b.count reads class -> 2\n\na.count = 99\na: {id: 1, count: 99}  -> a.count = 99 (shadow)\nb: {id: 2}             -> b.count = 2\nCounter.count still 2",
     "tags": [
      "classes",
      "attributes"
     ],
     "key": "Reads go instance, then class. Assignment through an instance creates an instance attribute. Change shared data via <code>ClassName.attr</code>.",
     "mistakes": [
      "Thinking <code>a.count = 99</code> changes it for all objects.",
      "A <b>mutable</b> class attribute (a list) is shared: <code>self.items.append</code> changes it for everyone."
     ],
     "alts": [
      {
       "q": "Mutable class attribute. What prints?",
       "code": "class Bag:\n    items = []                 # shared list!\n    def add(self, x):\n        self.items.append(x)   # mutates the class's list\nb1, b2 = Bag(), Bag()\nb1.add(\"pen\")\nb2.add(\"cup\")\nprint(b1.items, b2.items, Bag.items is b1.items)",
       "answer": "['pen', 'cup'] ['pen', 'cup'] True"
      },
      {
       "q": "self.n += 1 on a class attribute. What prints?",
       "code": "class C:\n    n = 0\n    def bump(self):\n        self.n += 1           # reads class n, writes instance n\nx, y = C(), C()\nx.bump(); x.bump(); y.bump()\nprint(C.n, x.n, y.n)",
       "answer": "0 2 1"
      },
      {
       "q": "What prints?",
       "code": "class A:\n    tag = \"class\"\na = A()\nA.tag = \"changed\"\nprint(a.tag)\na.tag = \"mine\"\nA.tag = \"again\"\nprint(a.tag, A().tag)",
       "answer": "changed\nmine again"
      }
     ]
    },
    {
     "id": "l5-str",
     "title": "__str__ for a custom string form",
     "prompt": "With <code>__str__</code> defined, what does <code>print(dog1)</code> show?",
     "code": "class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __str__(self):\n        return f\"Name: {self.name}, Age: {self.age}\"\n\ndog1 = Dog(\"Buddy\", 3)\ndog2 = Dog(\"Molly\", 5)\nprint(dog1)\nprint(dog2)\nprint(\"Dog -> \" + str(dog1))",
     "output": "Name: Buddy, Age: 3\nName: Molly, Age: 5\nDog -> Name: Buddy, Age: 3",
     "explain": "<code>print(obj)</code> and <code>str(obj)</code> call <code>obj.__str__()</code>. It must <b>return</b> a string, not print one. Without <code>__str__</code> (and <code>__repr__</code>) you get the default <code>&lt;__main__.Dog object at 0x...&gt;</code>.",
     "tags": [
      "classes",
      "str"
     ],
     "key": "<code>__str__</code> must return a str. <code>print</code> calls it for you.",
     "mistakes": [
      "Printing inside <code>__str__</code> instead of returning: <code>print(d)</code> then fails with TypeError (it returned None)."
     ],
     "alts": [
      {
       "q": "__str__ that prints instead of returning. What prints?",
       "code": "class Bad:\n    def __str__(self):\n        print(\"oops\")\ntry:\n    str(Bad())\nexcept TypeError as e:\n    print(type(e).__name__)",
       "answer": "oops\nTypeError"
      },
      {
       "q": "Containers use __repr__. What prints?",
       "code": "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def __str__(self):\n        return self.name\n    def __repr__(self):\n        return f\"Dog({self.name!r})\"\nd = Dog(\"Rex\")\nprint(d, [d], f\"{d}\")",
       "answer": "Rex [Dog('Rex')] Rex"
      }
     ]
    },
    {
     "id": "l5-eq",
     "title": "__eq__ for custom equality",
     "prompt": "<code>__eq__</code> compares name and age. Are <code>dog1 == dog3</code> and <code>dog1 is dog3</code> both True?",
     "code": "class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __eq__(self, other):\n        return self.name == other.name and self.age == other.age\n\ndog1 = Dog(\"Buddy\", 3)\ndog2 = Dog(\"Molly\", 5)\ndog3 = Dog(\"Buddy\", 3)\nprint(dog1 == dog2)\nprint(dog1 == dog3)\nprint(dog1 is dog3)\nprint(dog1 != dog3)      # Python derives != from __eq__",
     "output": "False\nTrue\nFalse\nFalse",
     "explain": "<code>==</code> calls <code>__eq__</code>. Without it, Python falls back to <b>identity</b> (two different objects are never equal). <code>is</code> is always identity, whatever <code>__eq__</code> says.<br><br><b>Exam trap:</b> defining <code>__eq__</code> without <code>__hash__</code> sets <code>__hash__</code> to <code>None</code>, so the objects become <b>unhashable</b> and cannot go in a set or be dict keys.",
     "tags": [
      "classes",
      "equality",
      "hashing"
     ],
     "key": "<code>__eq__</code> without <code>__hash__</code> makes the class unhashable (TypeError in a set or dict).",
     "mistakes": [
      "Thinking <code>__eq__</code> changes what <code>is</code> returns.",
      "Putting objects with only <code>__eq__</code> into a set."
     ],
     "alts": [
      {
       "q": "__eq__ without __hash__. What prints?",
       "code": "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def __eq__(self, other):\n        return self.name == other.name\ntry:\n    s = {Dog(\"Rex\")}\nexcept TypeError as e:\n    print(type(e).__name__)\nprint(Dog.__hash__ is None)",
       "answer": "TypeError\nTrue"
      },
      {
       "q": "No __eq__ at all. What prints?",
       "code": "class Dog:\n    def __init__(self, name):\n        self.name = name\na, b = Dog(\"Rex\"), Dog(\"Rex\")\nprint(a == b, a == a, len({a, b}))",
       "answer": "False True 2"
      },
      {
       "q": "'in' on a list uses ==. What prints?",
       "code": "class P:\n    def __init__(self, x):\n        self.x = x\n    def __eq__(self, other):\n        return self.x == other.x\nprint(P(1) in [P(0), P(1)], [P(2)].count(P(2)))",
       "answer": "True 1"
      }
     ]
    },
    {
     "id": "l5-hash",
     "title": "__hash__ makes objects usable in sets and as dict keys",
     "prompt": "Three Dogs go into a set and two of them are equal. How many remain? (Set order depends on string hashes, so we print in sorted order.)",
     "code": "class Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __eq__(self, other):     # if absent, object identity is used\n        return self.name == other.name and self.age == other.age\n\n    def __hash__(self):\n        return (self.name + str(self.age)).__hash__()\n\n    def __str__(self):\n        return f\"Name: {self.name}, Age: {self.age}\"\n\ndogs = {Dog(\"Buddy\", 3), Dog(\"Molly\", 5), Dog(\"Buddy\", 3)}\nprint(len(dogs))\nfor d in sorted(dogs, key=lambda d: d.name):\n    print(d)\n\nages = {Dog(\"Buddy\", 3): \"good boy\"}\nprint(ages[Dog(\"Buddy\", 3)])     # a NEW but equal object finds the entry",
     "output": "2\nName: Buddy, Age: 3\nName: Molly, Age: 5\ngood boy",
     "explain": "A set or dict first uses <code>__hash__</code> to pick a bucket, then <code>__eq__</code> to confirm a match. The two <code>Dog(\"Buddy\", 3)</code> objects have the same hash (<code>hash(\"Buddy3\")</code>) <b>and</b> are equal, so the set keeps one. That leaves 2 dogs.<br><br>The rule: <b>equal objects must have equal hashes</b>. Build the hash from the same fields <code>__eq__</code> compares. <code>hash((self.name, self.age))</code> is the common idiom.",
     "anatomy": [
      {
       "code": "return (self.name + str(self.age)).__hash__()",
       "notes": [
        {
         "at": "self.name + str(self.age)",
         "label": "key string e.g. 'Buddy3'"
        },
        {
         "at": ".__hash__()",
         "label": "hash of that string"
        }
       ]
      },
      {
       "code": "def __hash__(self): return hash((self.name, self.age))",
       "notes": [
        {
         "at": "__hash__",
         "label": "used by set/dict"
        },
        {
         "at": "hash(",
         "label": "builtin hash"
        },
        {
         "at": "(self.name, self.age)",
         "label": "same fields as __eq__"
        }
       ]
      }
     ],
     "tags": [
      "classes",
      "hashing",
      "sets"
     ],
     "key": "Set and dict membership is hash first, then ==. Define both from the same fields.",
     "mistakes": [
      "Hashing on a field that <code>__eq__</code> ignores, or changing a field after the object is in a set (it gets lost).",
      "Expecting the set to print in insertion order."
     ],
     "alts": [
      {
       "q": "__hash__ but no __eq__: equality is identity. What prints?",
       "code": "class D:\n    def __init__(self, n):\n        self.n = n\n    def __hash__(self):\n        return hash(self.n)\nprint(len({D(1), D(1), D(2)}))",
       "answer": "3"
      },
      {
       "q": "Mutating a key after insertion. What prints?",
       "code": "class Dog:\n    def __init__(self, name, age):\n        self.name, self.age = name, age\n    def __eq__(self, other):\n        return (self.name, self.age) == (other.name, other.age)\n    def __hash__(self):\n        return hash((self.name, self.age))\nd = Dog(\"Buddy\", 3)\ns = {d}\nd.age = 4\nprint(Dog(\"Buddy\", 3) in s, Dog(\"Buddy\", 4) in s, d in s)",
       "answer": "False False False"
      },
      {
       "q": "Equal objects are the same dict key. What prints?",
       "code": "class K:\n    def __init__(self, v):\n        self.v = v\n    def __eq__(self, other):\n        return self.v == other.v\n    def __hash__(self):\n        return hash(self.v)\nd = {K(1): \"a\"}\nd[K(1)] = \"b\"\nd[K(2)] = \"c\"\nprint(len(d), d[K(1)])",
       "answer": "2 b"
      }
     ]
    },
    {
     "id": "l5-add",
     "title": "Magic methods: __add__ overloads +",
     "prompt": "<code>Polynomial.__add__</code> pads the shorter coefficient list with zeros and adds position by position. What is <code>p1 + p2</code>?",
     "code": "class Polynomial:\n    def __init__(self, coeffs):\n        self.coeffs = coeffs\n\n    def __add__(self, other):\n        l1, l2 = len(self.coeffs), len(other.coeffs)\n        l = max(l1, l2)\n        c = [0] * l\n        c1 = [0] * (l - l1) + self.coeffs\n        c2 = [0] * (l - l2) + other.coeffs\n        for i in range(l):\n            c[i] = c1[i] + c2[i]\n        return Polynomial(c)\n\np1 = Polynomial([3, 2, -1])   # 3x^2 + 2x - 1\np2 = Polynomial([1, -2, 1])   # x^2 - 2x + 1\ntotal = p1 + p2               # calls p1.__add__(p2)  (slide named it 'sum')\nprint(total.coeffs)           # 4x^2\n\np3 = p1 + Polynomial([5])     # shorter one is padded on the LEFT\nprint(p3.coeffs)",
     "output": "[4, 0, 0]\n[3, 2, 4]",
     "explain": "Operators are method calls: <code>a + b</code> runs <code>a.__add__(b)</code>, and <code>-</code> and <code>*</code> map to <code>__sub__</code> and <code>__mul__</code>. The padding goes on the <b>left</b> (the high powers), so the constant terms line up.<br><br>The slide stored the result in a variable named <code>sum</code>, which shadows the builtin <code>sum()</code>. We use <code>total</code> instead.",
     "trace": "p1 = [3, 2, -1]\np2 = [1, -2, 1]\nsum: [3+1, 2-2, -1+1] = [4, 0, 0]  -> 4x^2\n\np1 + [5]: pad [5] -> [0, 0, 5]\n[3, 2, -1] + [0, 0, 5] = [3, 2, 4]",
     "tags": [
      "classes",
      "magic methods"
     ],
     "key": "<code>a + b</code> is <code>a.__add__(b)</code>. The method returns a <b>new</b> object.",
     "mistakes": [
      "Padding on the right, which misaligns powers.",
      "Naming a variable <code>sum</code> or <code>list</code>, which hides the builtin."
     ],
     "alts": [
      {
       "q": "Shadowing a builtin. What prints?",
       "code": "sum = 5\ntry:\n    print(sum([1, 2]))\nexcept TypeError as e:\n    print(type(e).__name__)\ndel sum\nprint(sum([1, 2]))",
       "answer": "TypeError\n3"
      },
      {
       "q": "What prints?",
       "code": "class V:\n    def __init__(self, x):\n        self.x = x\n    def __add__(self, other):\n        return V(self.x + other.x)\n    def __mul__(self, k):\n        return V(self.x * k)\nv = V(2) + V(3) * 4\nprint(v.x)",
       "answer": "14"
      }
     ]
    },
    {
     "id": "l5-call",
     "title": "Magic methods: __call__ makes an object callable",
     "prompt": "With <code>__call__</code>, <code>p1(5)</code> evaluates the polynomial using Horner's rule. What is 3&middot;5&sup2; + 2&middot;5 - 1?",
     "code": "class Polynomial:\n    def __init__(self, coeffs):\n        self.coeffs = coeffs\n\n    def __call__(self, x):\n        ret = 0\n        for coeff in self.coeffs:\n            ret = ret * x + coeff\n        return ret\n\np1 = Polynomial([3, 2, -1])   # 3x^2 + 2x - 1\nprint(p1(5))\nprint(callable(p1), [p1(x) for x in range(3)])",
     "output": "84\nTrue [-1, 4, 15]",
     "explain": "<code>p1(5)</code> runs <code>p1.__call__(5)</code>, so the object behaves like a function. This is the same Horner loop as Lecture 3's <code>calculate</code>: 0&middot;5+3 = 3, then 3&middot;5+2 = 17, then 17&middot;5-1 = 84.",
     "tags": [
      "classes",
      "magic methods"
     ],
     "key": "<code>obj(args)</code> calls <code>obj.__call__(args)</code>.",
     "mistakes": [
      "Calling an object that has no <code>__call__</code> raises TypeError."
     ],
     "alts": [
      {
       "q": "What prints?",
       "code": "class Polynomial:\n    def __init__(self, coeffs):\n        self.coeffs = coeffs\n    def __call__(self, x):\n        ret = 0\n        for coeff in self.coeffs:\n            ret = ret * x + coeff\n        return ret\np2 = Polynomial([1, -2, 1])\nprint(p2(1), p2(3), list(map(p2, [0, 2])))",
       "answer": "0 4 [1, 1]"
      }
     ]
    },
    {
     "id": "l5-inherit",
     "title": "Inheritance and overriding: an expression tree",
     "prompt": "<code>Const</code>, <code>Var</code>, <code>Plus</code>, <code>Times</code> and <code>Pow</code> subclass <code>Exp</code> and override <code>__str__</code> and <code>eval</code>. What does the tree print, and what is its value for x = 3, y = 4?",
     "code": "class Exp:\n    def __str__(self): raise Exception('unsupported')\n    def eval(self, ctx): raise Exception('unsupported')\n\nclass Const(Exp):\n    def __init__(self, n):\n        self.n = n\n    def __str__(self): return str(self.n)\n    def eval(self, ctx): return self.n\n\nclass Var(Exp):\n    def __init__(self, v):\n        self.v = v\n    def __str__(self): return self.v\n    def eval(self, ctx): return ctx[self.v]\n\nclass Plus(Exp):\n    def __init__(self, e1, e2):\n        self.e1 = e1\n        self.e2 = e2\n    def __str__(self): return f'({self.e1} + {self.e2})'\n    def eval(self, ctx):\n        return self.e1.eval(ctx) + self.e2.eval(ctx)\n\nclass Times(Exp):\n    def __init__(self, e1, e2):\n        self.e1 = e1\n        self.e2 = e2\n    def __str__(self): return f'({self.e1} * {self.e2})'\n    def eval(self, ctx):\n        return self.e1.eval(ctx) * self.e2.eval(ctx)\n\nclass Pow(Exp):\n    def __init__(self, e, n):\n        self.e = e\n        self.n = n\n    def __str__(self): return f'({self.e}^{str(self.n)})'\n    def eval(self, ctx):\n        return self.e.eval(ctx) ** self.n\n\ne = Plus(Times(Const(2), Var(\"x\")), Pow(Var(\"y\"), 2))\nprint(e)\nprint(e.eval({\"x\": 3, \"y\": 4}))\nprint(isinstance(e, Exp), isinstance(e, Times))\ntry:\n    str(Exp())\nexcept Exception as ex:\n    print(type(ex).__name__)",
     "output": "((2 * x) + (y^2))\n22\nTrue False\nException",
     "explain": "Each subclass <b>overrides</b> <code>__str__</code> and <code>eval</code>. Calling <code>e.eval(ctx)</code> runs the version for <code>e</code>'s <b>actual class</b> (polymorphism), which then recursively evaluates its children. The f-string <code>{self.e1}</code> calls the child's <code>__str__</code>, so the string builds up recursively too.<br><br>The base <code>Exp</code> raises an exception, which acts like an abstract method. Python supports <b>multiple inheritance</b>, and every class ultimately derives from <code>object</code>.",
     "trace": "Plus\n|-- Times\n|   |-- Const(2)   -> 2\n|   +-- Var(x)     -> 3\n|   => 6\n+-- Pow(n=2)\n    +-- Var(y)     -> 4\n    => 16\n=> 22\nstr: ((2 * x) + (y^2))",
     "tags": [
      "classes",
      "inheritance",
      "recursion"
     ],
     "key": "Overriding plus recursion: each node handles itself and asks its children for the rest.",
     "mistakes": [
      "Forgetting that <code>Var.eval</code> looks the name up in the <code>ctx</code> dict (KeyError if it is missing)."
     ],
     "alts": [
      {
       "q": "Method resolution: the subclass wins. What prints?",
       "code": "class A:\n    def who(self): return \"A\"\n    def hello(self): return \"hello from \" + self.who()\nclass B(A):\n    def who(self): return \"B\"\nprint(A().hello(), B().hello())",
       "answer": "hello from A hello from B"
      },
      {
       "q": "super() calls the parent version. What prints?",
       "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return \"...\"\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(name)\n        self.kind = \"dog\"\n    def speak(self):\n        return super().speak() + \"woof\"\nd = Dog(\"Rex\")\nprint(d.name, d.kind, d.speak(), isinstance(d, Animal))",
       "answer": "Rex dog ...woof True"
      }
     ]
    },
    {
     "id": "l5-iterator",
     "title": "Iterator class: __iter__ and __next__",
     "prompt": "<code>Range(1, 5)</code> implements the iterator protocol. What does the <code>for</code> loop print, and can you iterate the same object twice?",
     "code": "class Range:\n    def __init__(self, start, end):\n        self.current = start\n        self.end = end\n\n    def __iter__(self):          # how a for-loop gets an iterator\n        return self\n\n    def __next__(self):          # called for each iteration\n        if self.current < self.end:\n            value = self.current\n            self.current += 1\n            return value\n        else:\n            raise StopIteration  # how the iterator stops\n\nfor num in Range(1, 5):\n    print(num)\n\nr = Range(1, 4)\nprint(list(r), list(r))          # second pass: already exhausted",
     "output": "1\n2\n3\n4\n[1, 2, 3] []",
     "explain": "A <code>for</code> loop calls <code>iter(obj)</code> (that is, <code>__iter__</code>), then calls <code>__next__</code> repeatedly until <code>StopIteration</code> is raised. <code>end</code> is excluded, just like the builtin <code>range</code>.<br><br>Because <code>__iter__</code> returns <code>self</code>, the object <b>is</b> its own iterator. Once <code>current</code> reaches <code>end</code>, it stays exhausted, the same as <code>map</code>.",
     "tags": [
      "iterators",
      "classes"
     ],
     "key": "<code>__iter__</code> returns the iterator, <code>__next__</code> gives the next value, and <code>StopIteration</code> ends the loop.",
     "mistakes": [
      "Expecting the second <code>list(r)</code> to restart from 1."
     ],
     "alts": [
      {
       "q": "Manual next(). What prints?",
       "code": "class Range:\n    def __init__(self, start, end):\n        self.current = start\n        self.end = end\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.current < self.end:\n            value = self.current\n            self.current += 1\n            return value\n        raise StopIteration\nr = Range(5, 7)\nprint(next(r), next(r))\ntry:\n    next(r)\nexcept StopIteration:\n    print(\"done\")",
       "answer": "5 6\ndone"
      },
      {
       "q": "What prints?",
       "code": "class Countdown:\n    def __init__(self, n):\n        self.n = n\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.n <= 0:\n            raise StopIteration\n        self.n -= 1\n        return self.n + 1\nprint([x * 10 for x in Countdown(3)], sum(Countdown(4)))",
       "answer": "[30, 20, 10] 10"
      }
     ]
    },
    {
     "id": "l5-context",
     "title": "Context manager class: __enter__ and __exit__",
     "prompt": "<code>Timer</code> measures how long the <code>with</code> block takes. The elapsed time changes every run, so the output is not fixed. See the extra block for the exact order of calls.",
     "code": "import time\n\nclass Timer:\n    def __enter__(self):\n        self.start_time = time.time()\n        return self              # becomes the 'as' variable\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        self.end_time = time.time()\n        elapsed_time = self.end_time - self.start_time\n        print(f\"Elapsed time: {elapsed_time:.4f} seconds\")\n\nwith Timer() as timer:\n    # Measure the execution time of some code\n    for _ in range(1000000):\n        pass",
     "output": null,
     "explain": "<code>with X() as v:</code> calls <code>__enter__</code> first, binding its return value to <code>v</code>. It runs the block, then <b>always</b> calls <code>__exit__</code>, even if the block raised. That is why files auto-close.<br><br><code>__exit__</code> receives the exception info, or <code>None, None, None</code> when there is no error. If it returns <code>True</code>, the exception is suppressed.",
     "tags": [
      "context managers",
      "classes"
     ],
     "key": "Order: <code>__enter__</code>, then the block, then <code>__exit__</code>, which runs even on error.",
     "mistakes": [
      "Thinking <code>v</code> in <code>as v</code> is the object created by <code>Timer()</code>. It is whatever <code>__enter__</code> returns."
     ],
     "extra": [
      {
       "label": "Deterministic order of calls",
       "code": "class Demo:\n    def __enter__(self):\n        print(\"1. __enter__\")\n        return self\n    def __exit__(self, exc_type, exc_value, traceback):\n        print(\"3. __exit__, exc_type =\", exc_type)\n\nwith Demo() as d:\n    print(\"2. body\")",
       "output": "1. __enter__\n2. body\n3. __exit__, exc_type = None"
      }
     ],
     "alts": [
      {
       "q": "__exit__ runs even on an exception. What prints?",
       "code": "class CM:\n    def __enter__(self):\n        print(\"enter\")\n        return \"value\"\n    def __exit__(self, t, v, tb):\n        print(\"exit\", t.__name__ if t else None)\n        return True          # suppress the exception\nwith CM() as x:\n    print(\"body\", x)\n    raise ValueError(\"boom\")\nprint(\"after\")",
       "answer": "enter\nbody value\nexit ValueError\nafter"
      },
      {
       "q": "What prints?",
       "code": "class CM:\n    def __enter__(self):\n        return 42\n    def __exit__(self, *args):\n        print(\"closing\")\nwith CM() as v:\n    print(v + 1)",
       "answer": "43\nclosing"
      }
     ]
    }
   ]
  }
 ]
};
