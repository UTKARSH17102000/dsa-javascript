# DSA JavaScript Environment

A local development and testing environment for JavaScript Data Structures and Algorithms.
No browser, no account, no bloat — just your terminal, your code, and immediate feedback.

Built to the standard of a **FAANG SDE-2 interview**: every problem includes complexity
analysis, a comparison of all approaches, key interview insights, and follow-up problems.

---

## Quick Start

```bash
npm run solve two-sum          # run tests
npm run mock two-sum           # timed interview session
npm run review                 # see what's due for review today
npm run gotchas                # JS interview traps cheat sheet
```

---

## Commands

| Command | What it does |
|---|---|
| `npm run solve <name>` | Run solution against test cases |
| `npm run solve <name> -- --input "[args]"` | Test with custom terminal input |
| `npm run new <name>` | Bootstrap a new problem (master + stubs + revision files) |
| `npm run mock <name>` | Start a timed mock interview session |
| `npm run mock <name> -- --time 45` | Mock session with custom duration (minutes) |
| `npm run review` | Spaced repetition dashboard — see what's due today |
| `npm run review <name> -- --rating easy\|medium\|hard` | Log confidence and schedule next review |
| `npm run gotchas` | 10 critical JS interview traps with fixes |

---

## Problem File Format

Every `problems/` file is structured to match what an SDE-2 candidate would communicate
out loud in a real interview — not just the solution, but the reasoning behind it.

```javascript
/**
 * Problem Name: Two Sum
 *
 * Description:
 * Given an array of integers nums and an integer target, return indices of the two numbers
 * that add up to target. Each input has exactly one solution; same element can't be used twice.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(n)
 * Space: O(n)
 *
 * ─── Approaches ──────────────────────────────────────────
 * Brute Force:  O(n²) time, O(1) space  — nested loop checking every pair
 * Optimal:      O(n)  time, O(n) space  — HashMap stores value→index for O(1) complement lookup
 *
 * ─── Key Interview Points ────────────────────────────────
 * • Check the map for complement BEFORE inserting current element — handles [3,3] correctly
 * • Two-pointer on sorted array is O(n)/O(1) but loses original indices (Two Sum II, not this)
 * • Problem guarantees exactly one solution — no "not found" handling needed unless asked
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Two Sum II (LC 167) — array is sorted → two pointers, O(1) space
 * • Three Sum (LC 15) — sort + fix one element + two-pointer inner loop, O(n²)
 * • Four Sum (LC 18) — two nested loops + two-pointer, O(n³)
 */
function twoSum(nums, target) { ... }
```

---

## Folder Structure

```
DSA/
├── problems/                        # Master solutions (source of truth)
│   ├── two-sum.js
│   ├── clone-graph.js
│   ├── unique-paths.js
│   ├── graph-dfs.js
│   ├── reverse-linked-list.js
│   └── invert-binary-tree.js
│
├── topics/                          # Organized by DSA topic
│   ├── arrays/
│   │   ├── two-sum.js               # Re-exports master (no duplication)
│   │   └── revision/
│   │       └── two-sum.js           # Blank stub — practice from scratch
│   ├── graphs/
│   │   ├── clone-graph.js
│   │   ├── graph-dfs.js
│   │   └── revision/
│   ├── dp/
│   │   ├── unique-paths.js
│   │   └── revision/
│   └── ...
│
├── companies/                       # Organized by company
│   ├── google/
│   │   ├── two-sum.js
│   │   ├── unique-paths.js
│   │   └── revision/
│   ├── meta/
│   │   ├── clone-graph.js
│   │   └── revision/
│   ├── uber/
│   │   ├── graph-dfs.js
│   │   └── revision/
│   └── ...
│
├── dsa-helpers.js                   # ListNode, TreeNode, GraphNode, Heap, PriorityQueue
├── run.js                           # Test runner
├── create.js                        # Problem bootstrapper
├── mock.js                          # Mock interview mode
├── review.js                        # Spaced repetition tracker
├── gotchas.js                       # JS interview traps
├── reviews.json                     # Auto-generated: your review log
├── CLAUDE.md                        # AI generation standards (SDE-2 level)
└── AI_PROMPT_GUIDE.md               # Prompt template for non-Claude AI tools
```

---

## Solving & Testing

```bash
npm run solve two-sum
npm run solve clone-graph
npm run solve unique-paths
```

The runner uses smart fuzzy matching — partial names and paths both work:

```bash
npm run solve two           # finds two-sum.js
npm run solve graphs/rev/clone    # finds topics/graphs/revision/clone-graph.js
npm run solve revision/two-sum    # runs your practice stub
```

When multiple files match, the master in `problems/` runs by default. A ranked list is shown.

### Custom input

```bash
npm run solve two-sum -- --input "[[3, 2, 4], 6]"
npm run solve unique-paths -- --input "[3, 5]"
```

---

## Practice & Revision

Every problem has a blank revision stub that imports the test cases from the master:

```
topics/graphs/revision/clone-graph.js   ← write your solution here
companies/meta/revision/clone-graph.js  ← same, filed under company
```

To practice a problem from scratch:
1. Open the revision stub
2. Write your solution in the blank function
3. Run `npm run solve graphs/revision/clone-graph` to verify

---

## Mock Interview Mode

Simulates a timed coding interview in your terminal:

```bash
npm run mock two-sum              # 30-minute session (default)
npm run mock clone-graph -- --time 45
```

What happens:
1. A blank mock file is created with the function stub and test cases imported
2. A live countdown timer starts — turns yellow at 10 min, red at 5 min
3. Edit the mock file in your editor and run `npm run solve mock-two-sum` at any point
4. On submit (Ctrl+C or timer expiry) all tests run automatically and results are logged
5. Rate your performance after: `npm run review two-sum -- --rating medium`

---

## Spaced Repetition Review

```bash
npm run review                               # today's dashboard
npm run review two-sum -- --rating easy      # schedule next review in 7 days
npm run review clone-graph -- --rating medium  # 3 days
npm run review unique-paths -- --rating hard   # 1 day (retry tomorrow)
npm run review two-sum -- --info             # full history for one problem
```

Dashboard output:
```
╔═════════════════════════════════════════════════════════╗
║          ⚡ DSA Spaced Repetition Dashboard              ║
╚═════════════════════════════════════════════════════════╝
  Today: 2026-06-01

  📊 Stats:  6 problems tracked  │  8 total sessions  │  1 mastered (≥14d interval)

  🔥 Due for Review Today (1)
  ──────────────────────────────────────────────────────────
  ➤ clone-graph                    (due today)  Last: 🔴 hard  Sessions: 2

  📅 Up Next
  ──────────────────────────────────────────────────────────
    two-sum                        in 3d (2026-06-04)
    unique-paths                   in 6d (2026-06-07)
```

Interval algorithm:
| Rating | Next Review |
|---|---|
| `hard` | Resets to **1 day** |
| `medium` | **1.5×** previous interval |
| `easy` | **2.5×** previous interval |
| ≥14 days | Considered **mastered** |

---

## Data Structures & Helpers

All helpers are imported via `require("../dsa-helpers")`.

### ListNode

```javascript
const { ListNode } = require("../dsa-helpers");
const head = ListNode.arrayToList([1, 2, 3, 4, 5]);
// ListNode { 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ null }
```

### TreeNode

```javascript
const { TreeNode } = require("../dsa-helpers");
// LeetCode-style level-order BFS array with null for missing nodes
const root = TreeNode.arrayToTree([4, 2, 7, 1, 3, null, 9]);
```

### GraphNode

```javascript
const { GraphNode } = require("../dsa-helpers");
// 1-indexed adjacency list
const node = GraphNode.adjListToGraph([[2, 4], [1, 3], [2, 4], [1, 3]]);
// Node 1 ➔ [ 2, 4 ], Node 2 ➔ [ 1, 3 ], ...
```

### MinHeap / MaxHeap / PriorityQueue

```javascript
const { MinHeap, MaxHeap, PriorityQueue } = require("../dsa-helpers");

const minH = new MinHeap();
minH.enqueue(10); minH.enqueue(3); minH.enqueue(7);
minH.dequeue();  // → 3

// Dijkstra-style custom comparator
const pq = new PriorityQueue((a, b) => a.dist - b.dist);
pq.enqueue({ node: "A", dist: 10 });
pq.enqueue({ node: "B", dist: 2 });
pq.dequeue();  // → { node: "B", dist: 2 }
```

### 2D Matrix (DP / Grid problems)

Return a 2D array from your solution and the runner renders it as a table automatically:

```
Matrix Grid [3x7]:
┌───┬───┬───┬────┬────┬────┬────┐
│ 1 │ 1 │ 1 │ 1  │ 1  │ 1  │ 1  │
├───┼───┼───┼────┼────┼────┼────┤
│ 1 │ 2 │ 3 │ 4  │ 5  │ 6  │ 7  │
├───┼───┼───┼────┼────┼────┼────┤
│ 1 │ 3 │ 6 │ 10 │ 15 │ 21 │ 28 │
└───┴───┴───┴────┴────┴────┴────┘
```

---

## JavaScript Interview Gotchas

```bash
npm run gotchas                        # all 10 gotchas
npm run gotchas -- --topic sort        # filter by keyword
```

| # | Trap | Risk |
|---|---|---|
| 1 | `.sort()` uses string order by default — always pass `(a,b) => a-b` | HIGH |
| 2 | Integer division returns floats — use `Math.floor` or `>> 1` | HIGH |
| 3 | Number overflow — check `Number.MAX_SAFE_INTEGER` for large inputs | MEDIUM |
| 4 | `.shift()` / `.unshift()` are O(n) — use a proper queue or pointer | HIGH |
| 5 | Object/array equality is by reference — `[] === []` is false | HIGH |
| 6 | `.splice()` mutates the original array — `.slice()` does not | MEDIUM |
| 7 | `NaN`, falsy traps, and `null == undefined` quirks | MEDIUM |
| 8 | `var` in loops creates a shared closure — always use `let` | MEDIUM |
| 9 | String concatenation in loops is O(n²) — use an array and `.join("")` | HIGH |
| 10 | `%` returns negative for negative numbers — use `((n%m)+m)%m` | MEDIUM |

---

## AI-Assisted Problem Generation

This repo is configured for Claude Code. The `CLAUDE.md` file at the project root
instructs Claude to generate solutions at SDE-2 FAANG standard — including all four
docblock sections (Complexity, Approaches, Key Interview Points, Follow-ups).

To add a problem with Claude Code:
```
/dsa-problem two-sum --topic arrays --company google
```

For other AI tools (ChatGPT, Gemini, etc.), use the template in `AI_PROMPT_GUIDE.md`.
