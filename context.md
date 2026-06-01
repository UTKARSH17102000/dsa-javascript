# Session Context
<!-- Claude: read this at the start of every session. Update it when work is done. -->

---

## Quick Resume

This is a JavaScript DSA interview-prep repo targeting **SDE-2 at FAANG**. It has three layers:
1. **`problems/`** — master solutions with SDE-2 quality docblocks (run with `npm run solve`)
2. **`dsa-prep/`** — coaching system with SRS spaced repetition (slash commands: `/dsa-start`, `/dsa-review`, etc.)
3. **`temp/`** — quick throwaway practice files (slash command: `/practice <topic>`, run with `node`)

All three layers are fully functional and wired. The coaching system (`dsa-prep/`) starts **completely fresh** — `REVIEW.md` is empty, no solved cards yet. The user is at the beginning of their coaching journey.

**Owner:** Utkarsh Goswami (`uttkarsh17102000@gmail.com`, GitHub: `UTKARSH17102000`)
**Repo:** https://github.com/UTKARSH17102000/dsa-javascript
**Stack:** JavaScript (Node.js), no external dependencies for running solutions

---

## Last Session — 2026-06-01

### What was accomplished
- **Upgraded all 6 problem files** with a full SDE-2 docblock format: four sections per problem — `─── Complexity`, `─── Approaches` (brute→optimal with Big-O), `─── Key Interview Points`, `─── Follow-ups` (named LeetCode problems)
- **Created GitHub repo** `UTKARSH17102000/dsa-javascript` (public) and pushed all code
- **Wrote `CLAUDE.md`** — code generation rules for SDE-2 level: pattern selection guide, JS gotchas, test case structure, mandatory checklist
- **Rewrote `README.md`** — clean docs with problem file format example, command table, folder structure
- **Built complete `dsa-prep/` coaching system** (modelled on `dev-vpandey/dsa-prep`, ported to JS):
  - 5 slash commands: `/dsa-start`, `/dsa-review`, `/dsa-pattern`, `/dsa-retry`, `/dsa-status`
  - SRS skill with 6 stages (1d/3d/10d/21d/45d/90d), Full/Snippet/Blitz review modes, Sprint Mode
  - 6 JavaScript cheatsheets (Groups 1–5, 8) — all Java code converted to JS idioms
  - `REVIEW.md`, `GRADUATED.md`, `GAP-DRILLS.md` — all empty, ready to fill
  - Pattern card and post-solve checklist templates
- **Built `/practice` skill** — generates a self-contained `temp/<topic>/<problem>.js` that runs with just `node`. Covers 35+ patterns, handles single/multi-param, ListNode, TreeNode variants. Inline test runner with `_deepEqual` and labeled test output
- **Tested `/practice` on "graph dfs"** → `temp/graphs/number-of-islands.js` (5 test cases, verified 5/5 pass with a solution, reset to blank for practice)

### What was NOT done / still pending
- `context.md` was just created (this file) — first session it exists
- Cheatsheet Groups 6 (Backtracking) and 7 (DP) are intentionally not built — they get built progressively as problems in those topics are solved
- No problems have been practiced in the coaching system yet (`REVIEW.md` is empty)
- `temp/` has only `graphs/number-of-islands.js` so far

---

## Complete Project Inventory

### Layer 1 — Problem Solving (`npm run solve`)

**Solved problems (6):**
| File | Topic | Company | Pattern |
|---|---|---|---|
| `problems/two-sum.js` | arrays | google | HashMap complement lookup |
| `problems/clone-graph.js` | graphs | meta | DFS + HashMap clone |
| `problems/unique-paths.js` | dp | google | Bottom-up DP grid |
| `problems/graph-dfs.js` | graphs | uber | Number of Islands (DFS + BFS) |
| `problems/reverse-linked-list.js` | — | — | Three-pointer iterative |
| `problems/invert-binary-tree.js` | — | — | Recursive DFS swap |

**Commands:**
```
npm run solve <name>                          # run test suite
npm run solve <name> -- --input "[args]"      # custom input
npm run new <name> -- --topic <t> -c <co>    # bootstrap new problem
npm run mock <name> -- --time 45             # timed mock interview
npm run review                               # spaced repetition dashboard
npm run review <name> -- --rating easy|medium|hard
npm run gotchas                              # JS traps reference
```

**Adding a new problem:** use `/dsa-problem` skill (asks for name, topic, company, URL, creates all files, runs tests)

### Layer 2 — Coaching System (`dsa-prep/`)

**State:** Fresh start — `REVIEW.md` is empty, no solved cards.

**User profile:** SDE-2 FAANG target · JavaScript · Strong in arrays/foundations · Weak in Trees, Graphs, DP, Tries, Heaps · 60–90 min/day weekdays

**Slash commands:**
| Command | What it does |
|---|---|
| `/dsa-start` | Find what to practice next (sprint check → 3-problem rule → gap → new pattern) |
| `/dsa-review` | Run SRS review queue (max 5, Full/Snippet/Blitz per stage) |
| `/dsa-pattern <tag>` | Jump to a specific pattern directly |
| `/dsa-retry <name>` | Re-attempt a previously solved problem |
| `/dsa-status` | Stage distribution, overdue queue, gap drills, stats |

**SRS stages:** 1d → 3d → 10d → 21d → 45d → 90d (graduated)
**Ratings:** ✅ Strong (+1 stage, ×1.5 interval) · 🟡 Okay (no change) · 🔴 Weak (÷2) · ❌ Blank (reset Stage 1)
**Sprint Mode:** every new solve triggers Day+1 (Full) and Day+3 (Snippet) sprint reviews
**3-Problem Rule:** minimum 3 problems per pattern before moving on

**Cheatsheets (JS):** Groups 1–5 and 8 done. G6 (Backtracking) and G7 (DP) built progressively.

**Key files:**
```
dsa-prep/notes/REVIEW.md                ← SRS master table (source of truth)
dsa-prep/notes/GRADUATED.md             ← problems at 90-day interval
dsa-prep/notes/GAP-DRILLS.md            ← Muscle/Conceptual gap tracker
dsa-prep/notes/cheatsheets/             ← 6 JS cheatsheets + keyword index
dsa-prep/templates/dsa-pattern-card.md  ← fill after every solve
dsa-prep/templates/post-solve-checklist.md
```

### Layer 3 — Quick Practice (`temp/`)

**Command:** `/practice <pattern or problem name>`

**How it works:** generates `temp/<topic>/<problem>.js` with:
- Problem description, example, constraints (header comment)
- Blank `function solve(...) {}` scaffold — user fills in body only
- 4–5 pre-loaded test cases with labels
- Inline `_deepEqual` test runner — no npm, no require
- Run with: `node temp/<topic>/<problem>.js`

**Pattern → problem lookup:** 35+ patterns mapped (graphs, trees, dp, arrays, binary-search, linked-lists, tries, heaps, backtracking, stacks, strings)

**Current practice files:**
```
temp/graphs/number-of-islands.js     ← LC 200, DFS, 5 tests, blank scaffold
```

---

## Critical File Map

```
DSA/
├── CLAUDE.md              ← Code generation rules + DSA coaching flow
├── README.md              ← Full usage docs
├── context.md             ← THIS FILE — session state
│
├── problems/              ← Master solutions (npm run solve)
├── topics/                ← Classification stubs by topic
├── companies/             ← Classification stubs by company
│
├── dsa-prep/
│   ├── notes/REVIEW.md    ← SRS table — UPDATE after every coaching session
│   ├── notes/GRADUATED.md
│   ├── notes/GAP-DRILLS.md
│   ├── notes/cheatsheets/
│   └── templates/
│
├── temp/                  ← Throwaway practice files (node <file>)
│   └── graphs/
│       └── number-of-islands.js
│
├── .claude/
│   ├── commands/
│   │   ├── dsa-problem.md      ← /dsa-problem skill
│   │   ├── dsa-start.md        ← /dsa-start
│   │   ├── dsa-review.md       ← /dsa-review
│   │   ├── dsa-pattern.md      ← /dsa-pattern
│   │   ├── dsa-retry.md        ← /dsa-retry
│   │   ├── dsa-status.md       ← /dsa-status
│   │   └── practice.md         ← /practice
│   └── skills/srs-revision-coach/
│       ├── SKILL.md            ← SRS intervals + mode assignment
│       └── REFERENCE.md        ← Full/Snippet/Blitz execution steps
│
├── dsa-helpers.js         ← ListNode, TreeNode, GraphNode, MinHeap, MaxHeap, PriorityQueue
├── run.js                 ← Test runner
├── mock.js                ← Mock interview timer
├── review.js              ← Spaced repetition tracker
├── gotchas.js             ← JS interview traps
└── package.json
```

---

## Session Log

| # | Date | Summary |
|---|---|---|
| 1 | 2026-06-01 | Built entire repo from scratch: 6 solved problems with SDE-2 docblocks, GitHub repo created, CLAUDE.md + README, full dsa-prep coaching system (5 commands + SRS skill + 6 JS cheatsheets + templates), /practice skill with inline test runner, tested on number-of-islands |
