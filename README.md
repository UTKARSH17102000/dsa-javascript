# ⚡ Local JavaScript DSA Environment ⚡

A high-fidelity, modular, and visually stunning local development and testing environment for JavaScript Data Structures and Algorithms. It gives you the power of a premium interview prep tool right in your terminal — zero bloat, zero dependencies, and instant startup.

---

## 📦 Everything You Get

| Feature | Command | What It Does |
|---|---|---|
| **Solve & Test** | `npm run solve <name>` | Run your solution against test cases with beautiful output |
| **New Problem** | `npm run new <name>` | Bootstrap a classified problem with topic/company stubs |
| **Review** | `npm run review` | Spaced repetition dashboard — see what's due today |
| **Rate a Problem** | `npm run review <name> -- --rating <easy\|medium\|hard>` | Log confidence and schedule next review |
| **Mock Interview** | `npm run mock <name>` | Timed interview session with live countdown |
| **JS Gotchas** | `npm run gotchas` | 10 critical JS interview traps with fixes |
| **Custom Input** | `npm run solve <name> -- --input "[args]"` | Test with ad-hoc terminal inputs |

---

## 📂 Folder Structure

```text
d:\GithubRepos\DSA\
├── problems/                  # Master solutions & test suites (source of truth)
│   ├── two-sum.js
│   ├── clone-graph.js
│   └── unique-paths.js
├── topics/                    # Categorized by DSA topic
│   ├── graphs/
│   │   ├── clone-graph.js         # Re-exports master (no duplication)
│   │   └── revision/
│   │       └── clone-graph.js     # Blank practice stub, imports master tests
│   └── dp/
│       ├── unique-paths.js
│       └── revision/
│           └── unique-paths.js
├── companies/                 # Categorized by company
│   ├── google/
│   │   ├── unique-paths.js
│   │   └── revision/
│   │       └── unique-paths.js
│   └── meta/
│       ├── clone-graph.js
│       └── revision/
│           └── clone-graph.js
├── reviews.json               # Auto-generated: your spaced repetition log
├── dsa-helpers.js             # Data structures, Heaps, deep equality, formatters
├── run.js                     # Core test runner
├── create.js                  # Problem bootstrapper
├── review.js                  # Spaced repetition tracker
├── mock.js                    # Mock interview mode
├── gotchas.js                 # JS interview traps cheat sheet
├── AI_PROMPT_GUIDE.md         # Prompt template for AI-generated problems
└── README.md                  # This file
```

---

## 🚀 1. Solving & Testing Problems

### Run test cases against your solution:
```bash
npm run solve two-sum
npm run solve clone-graph
npm run solve unique-paths
```

The runner uses **smart fuzzy matching** — you can search by partial name or path:
```bash
npm run solve two      # Finds two-sum.js automatically
npm run solve revision/clone-graph   # Runs your practice revision stub
npm run solve graphs/rev/clone       # Also works!
```

If a name matches multiple files (master + stubs + revisions), a **prioritized selection menu** is shown and the master runs by default.

### Run with custom terminal input:
```bash
npm run solve two-sum -- --input "[[3, 2, 4], 6]"
npm run solve unique-paths -- --input "[3, 5]"
```

---

## 🗂️ 2. Creating & Classifying Problems

### Bootstrap a new problem:
```bash
npm run new <problem-name>
npm run new <problem-name> -- --topic <topic> --company <company>
```

**Examples:**
```bash
npm run new two-sum                              # Master file only
npm run new clone-graph -- -t graphs -c meta    # Full classification
npm run new unique-paths -- -t dp -c google
```

This generates **all files automatically**:
- `problems/clone-graph.js` — Master solution (write code here)
- `topics/graphs/clone-graph.js` — Linking stub (1 line, re-exports master)
- `topics/graphs/revision/clone-graph.js` — **Blank practice file** with master tests imported
- `companies/meta/clone-graph.js` — Company linking stub
- `companies/meta/revision/clone-graph.js` — Company revision stub

### How the revision system works:
The **Revision** file contains a blank function stub but **imports the test cases from the master** — so you can practice coding a solution from scratch and verify it instantly, with no setup:
```bash
# Practice the clone-graph problem from scratch:
# 1. Open: topics/graphs/revision/clone-graph.js
# 2. Write your solution in the blank function
# 3. Run:
npm run solve graphs/revision/clone-graph
```

---

## 🧠 3. Spaced Repetition Review Tracker

After solving a problem, log your confidence to schedule the next review:

### Rate a problem:
```bash
npm run review two-sum -- --rating easy    # Schedules next review in 7 days
npm run review clone-graph -- --rating medium  # 3 days
npm run review unique-paths -- --rating hard   # 1 day (try again tomorrow)
```

### View today's dashboard:
```bash
npm run review
```

Output:
```
╔═════════════════════════════════════════════════════════╗
║          ⚡ DSA Spaced Repetition Dashboard              ║
╚═════════════════════════════════════════════════════════╝
  Today: 2026-05-31

  📊 Stats:  3 problems tracked  │  3 total sessions  │  0 mastered (≥14d interval)

  🔥 Due for Review Today (1)
  ──────────────────────────────────────────────────────────
  ➤ clone-graph                    (due today)  Last: 🔴 hard  Sessions: 1

  📅 Up Next (2 problems scheduled)
  ──────────────────────────────────────────────────────────
    unique-paths                   in 2d (2026-06-02)
    two-sum                        in 3d (2026-06-03)
```

### View a specific problem's history:
```bash
npm run review two-sum -- --info
```

### How the interval algorithm works:
| Rating | Next Review |
|---|---|
| `hard` | Always resets to **1 day** |
| `medium` | **1.5×** the previous interval |
| `easy` | **2.5×** the previous interval |

A problem is considered **mastered** once its interval reaches 14+ days.

---

## ⏱️ 4. Mock Interview Mode

Simulate a real timed coding interview session directly in your terminal:

```bash
npm run mock two-sum              # 30-minute session (default)
npm run mock clone-graph -- --time 45  # 45-minute session
```

**What happens:**
1. A blank practice file `problems/mock-two-sum.js` is created with the function stub and master tests already imported.
2. A **live countdown timer** starts in your terminal, updating every second with a progress bar that turns yellow at 10 minutes and red at 5 minutes.
3. Open the mock file in your editor and write your solution.
4. You can test at any time during the session: `npm run solve mock-two-sum`
5. Press **Ctrl+C** to submit early (or wait for the timer to expire).
6. The runner **automatically runs all test cases** on submission, prints results, and saves your attempt with a timestamp.
7. The session is logged in your review tracker.

After your session, rate your performance:
```bash
npm run review two-sum -- --rating medium
```

---

## ⚠️ 5. JavaScript Interview Gotchas

Quick-access reference for the most critical JS traps that trip up candidates:

```bash
npm run gotchas                    # Show all 10 gotchas
npm run gotchas -- --topic sort    # Filter by keyword
npm run gotchas -- --topic shift   # Show array complexity traps
npm run gotchas -- --topic closure # Show closure/var traps
```

**Topics covered:**
| # | Gotcha | Risk |
|---|---|---|
| 1 | `.sort()` uses string order by default | 🔴 HIGH |
| 2 | Integer division returns floats | 🔴 HIGH |
| 3 | Number overflow & safe integer limits | 🟡 MEDIUM |
| 4 | `.shift()` / `.unshift()` are O(N) not O(1) | 🔴 HIGH |
| 5 | Object/array equality is by reference | 🔴 HIGH |
| 6 | `.splice()` mutates, `.slice()` does not | 🟡 MEDIUM |
| 7 | `NaN`, falsy values, and `null` comparison traps | 🟡 MEDIUM |
| 8 | `var` in loops creates shared closure | 🟡 MEDIUM |
| 9 | String concatenation in loops is O(N²) | 🔴 HIGH |
| 10 | `%` returns negative for negative numbers | 🟡 MEDIUM |

---

## 📦 6. Data Structures & Helpers

All helpers are available via `require("../dsa-helpers")`:

### MinHeap / MaxHeap / PriorityQueue
JavaScript has no built-in heap. Use these for problems like *Top K Elements*, *Merge K Sorted Lists*, *Dijkstra's Algorithm*:
```javascript
const { MinHeap, MaxHeap, PriorityQueue } = require("../dsa-helpers");

// Min-Heap (smallest value dequeues first):
const minH = new MinHeap();
minH.enqueue(10); minH.enqueue(3); minH.enqueue(7);
minH.dequeue();  // → 3

// Max-Heap (largest value dequeues first):
const maxH = new MaxHeap();
maxH.enqueue(10); maxH.enqueue(3); maxH.enqueue(7);
maxH.dequeue();  // → 10

// Custom PriorityQueue (Dijkstra-style with {node, dist} objects):
const pq = new PriorityQueue((a, b) => a.dist - b.dist);
pq.enqueue({ node: "A", dist: 10 });
pq.enqueue({ node: "B", dist: 2 });
pq.dequeue();  // → { node: "B", dist: 2 }
```

### ListNode (Linked List)
```javascript
const { ListNode } = require("../dsa-helpers");
const head = ListNode.arrayToList([1, 2, 3, 4, 5]);
// Prints: ListNode { 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ null }
```

### TreeNode (Binary Tree)
```javascript
const { TreeNode } = require("../dsa-helpers");
// LeetCode-style BFS level-order input with null placeholders:
const root = TreeNode.arrayToTree([4, 2, 7, 1, 3, null, 9]);
```

### GraphNode (Undirected Graph)
```javascript
const { GraphNode } = require("../dsa-helpers");
// LeetCode 1-indexed adjacency list:
const node = GraphNode.adjListToGraph([[2, 4], [1, 3], [2, 4], [1, 3]]);
// Prints: Node 1 ➔ [ 2, 4 ] ...
```

### 2D Matrix (DP / Grid Problems)
Return a 2D array from your solution and it auto-renders as a pretty grid:
```javascript
// Output of uniquePaths(3, 7):
// Matrix Grid [3x7]:
// ┌───┬───┬───┬────┬────┬────┬────┐
// │ 1 │ 1 │ 1 │ 1  │ 1  │ 1  │ 1  │
// ├───┼───┼───┼────┼────┼────┼────┤
// │ 1 │ 2 │ 3 │ 4  │ 5  │ 6  │ 7  │
// ├───┼───┼───┼────┼────┼────┼────┤
// │ 1 │ 3 │ 6 │ 10 │ 15 │ 21 │ 28 │
// └───┴───┴───┴────┴────┴────┴────┘
```

---

## 🤖 7. AI-Powered Custom Problem Generation

To add any LeetCode problem instantly, use the prompt template in [AI_PROMPT_GUIDE.md](file:///d:/GithubRepos/DSA/AI_PROMPT_GUIDE.md):

1. Open `AI_PROMPT_GUIDE.md` and copy the prompt template.
2. Paste it into your AI assistant along with the problem description/link.
3. The AI will generate the master solution, test cases, classification stubs, and revision files automatically — all perfectly wired into this folder structure.
