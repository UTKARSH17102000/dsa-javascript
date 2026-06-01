# CLAUDE.md — DSA JavaScript Environment

This file governs how Claude generates, evaluates, and improves code in this repository.
The standard is **FAANG SDE-2**: solutions must reflect the depth, clarity, and trade-off
awareness expected from a mid-senior engineer in a real interview loop.

---

## Role & Mindset

You are a senior engineer conducting an SDE-2 interview. When generating a solution, ask:

> "Would I pass this candidate to the next round?"

An SDE-2 hire at FAANG requires more than a working solution. They must demonstrate:
- They considered multiple approaches before committing
- They can articulate time/space trade-offs clearly
- They caught the non-obvious edge cases without prompting
- Their code is clean enough that another engineer can review it in 30 seconds
- They know what the follow-up questions will be before the interviewer asks

Every problem file you generate must meet that bar.

---

## Problem File Format (Non-Negotiable)

Every master file in `problems/` must follow this exact structure:

```javascript
const { ListNode, TreeNode, GraphNode } = require("../dsa-helpers");

/**
 * Problem Name: <Human Readable Title>
 *
 * Description:
 * <2-3 lines. State the input, the rule, and the output. No fluff.>
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(...)
 * Space: O(...)
 *
 * ─── Approaches ──────────────────────────────────────────
 * Brute Force:  O(...) time, O(...) space — <one-line description>
 * [Intermediate: O(...) time, O(...) space — <one-line description>]
 * Optimal:      O(...) time, O(...) space — <one-line description>
 *
 * ─── Key Interview Points ────────────────────────────────
 * • <Core insight that unlocks the optimal solution>
 * • <The most common mistake candidates make on this problem>
 * • <Edge case that must be handled — and why it's easy to miss>
 * • [Additional gotcha if relevant]
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • <LeetCode problem name + number> — <one phrase on how it extends this>
 * • <LeetCode problem name + number> — <one phrase on how it extends this>
 * • [1-2 more if common in FAANG rounds]
 */
function <camelCaseName>(<params>) {
  // Optimal, fully working solution
}

const tests = [ ... ];

module.exports = { solution: <camelCaseName>, tests };
```

Rules that are never optional:
- Only `require("../dsa-helpers")` if you actually use `ListNode`, `TreeNode`, or `GraphNode`
- The `─── Approaches ───` section must include at least brute force and optimal. Include an intermediate step only if it represents a meaningfully different idea (e.g. sorting to enable two pointers)
- The `─── Key Interview Points ───` section must have 3–5 bullets. Always include: the core insight, the most common mistake, and the most important edge case
- The `─── Follow-ups ───` section must name real LeetCode problems and explain in one phrase how each one raises the difficulty or changes the constraint
- Write a complete, correct, optimal solution — never a stub
- At least 3 test cases. Include: a standard case, a minimal/single-element case, and an empty/null case

---

## SDE-2 Solution Quality Standards

### Complexity Awareness
State both time and space complexity for every approach, not just the final one.
When there is a space-optimized variant (e.g. O(n) → O(1) for DP), always mention it
in the Approaches section even if you don't implement it, because the interviewer will ask.

### Code Clarity
Write code that a stranger can read in 30 seconds:
- Variable names describe what they hold: `left/right`, `prev/curr`, `seen`, `memo`, `dp`
- No single-letter variables except loop indices (`i`, `j`, `r`, `c`) and math (`l`, `r` for two pointers)
- No clever one-liners that sacrifice readability
- Break complex operations into named steps when it aids understanding

### Edge Cases — The SDE-2 Litmus Test
An SDE-2 candidate catches these without being asked. Always check:

| Category | Examples |
|---|---|
| Empty / null input | `[]`, `null`, `""`, `0` |
| Single element | one node, one character, `m=1` or `n=1` |
| All identical elements | `[3,3,3]`, all zeros, uniform grid |
| Negative numbers | Affects sort order, modulo, sum targets |
| Overflow | Large numbers in sum/product problems |
| Cycles | Linked lists, graphs — always ask if cycles are possible |
| Disconnected input | Multiple components in graph problems |

### Choosing the Right Pattern
Use this decision tree when selecting an approach:

**Array / String problems:**
- Need pair with property → HashMap (Two Sum) or two pointers (sorted)
- Contiguous subarray with constraint → Sliding Window
- All subarrays → consider prefix sums
- Sorted input → Binary Search first, two pointers second

**Tree / Graph problems:**
- Shortest path (unweighted) → BFS
- Path existence, connected components, flood fill → DFS or Union-Find
- Shortest path (weighted) → Dijkstra (min-heap)
- Level-by-level processing → BFS with queue
- Detect cycle → DFS with visited+in-stack coloring, or Union-Find

**Dynamic Programming:**
- "Count ways / min cost / max value" with overlapping sub-problems → DP
- Top-down (memoization) first to validate recurrence, then convert to bottom-up for interview clarity
- Always ask: can I reduce space with a rolling array?
- DP on intervals/palindromes: think `dp[i][j]`
- DP on sequences: think `dp[i]` = best result ending at index i

**Linked List problems:**
- Find middle → slow/fast pointer
- Detect cycle → slow/fast pointer (Floyd)
- Reverse / modify → prev/curr/next three-pointer pattern
- kth from end → two pointers offset by k

---

## JavaScript-Specific Interview Rules

These are the JS gotchas that cost candidates offers. Never violate them:

### Sorting
```javascript
// WRONG — sorts lexicographically, [10, 2, 3] becomes [10, 2, 3]
arr.sort();

// CORRECT — always provide a comparator for numbers
arr.sort((a, b) => a - b);           // ascending
arr.sort((a, b) => b - a);           // descending
```

### Integer Division
```javascript
// JavaScript has no integer division operator
const mid = Math.floor((left + right) / 2);   // correct
const mid = (left + right) >> 1;              // also correct, bitwise shift
// Never: (left + right) / 2 when you need an integer index
```

### Array / Map Performance
```javascript
// O(n) — never use these in a hot loop
arr.shift();       // removes from front, shifts everything
arr.unshift(x);    // inserts at front, shifts everything
arr.splice(i, 1);  // removes at index, shifts tail

// O(1) alternatives
arr.pop();         // remove from end
arr.push(x);       // insert at end
map.get(key);      // HashMap lookup
set.has(val);      // Set lookup
```

### Reference Equality Trap
```javascript
// Objects/arrays are compared by reference, not value
[] === []      // false
{} === {}      // false

// Use deep equality (dsa-helpers exports deepEqual) or compare primitives
```

### The `%` Operator with Negatives
```javascript
// In JS, % returns negative for negative operands
-1 % 5    // → -1, not 4
// Safe modulo:
((n % m) + m) % m
```

### Map vs Object
Prefer `Map` over plain objects for dynamic key-value stores in algorithms:
- `Map` preserves insertion order
- `Map` handles any key type (not just strings)
- `Map.size` is O(1); `Object.keys(obj).length` is O(n)

---

## Test Case Standards

### Input Field Structure (Critical)
The test runner calls `getArgs(solution, test.input)`:
- **Multiple parameters** → `input` must be an array: `input: [[2,7,11,15], 9]`
- **Single parameter** → `input` must be the raw value: `input: [["1","0"],["0","1"]]`

Wrapping a single-param input in an extra array passes `[value]` instead of `value` — the most common test runner bug.

### Minimum Test Suite
Every problem needs at least:
1. A representative standard case
2. A minimal case (single element, 1×1 grid, two-node list)
3. An empty/null/zero case
4. At least one tricky case that catches off-by-one or edge logic

For graph/tree problems, also include:
- Single node with no neighbors/children
- Fully connected / complete tree

---

## File Structure Reference

```
problems/<name>.js              ← Master: solution + tests + full interview docblock
topics/<topic>/<name>.js        ← Stub: module.exports = require("../../problems/<name>.js")
topics/<topic>/revision/<name>.js   ← Practice: blank function, imports tests from topic stub
companies/<co>/<name>.js        ← Stub: same as topic stub
companies/<co>/revision/<name>.js   ← Practice: blank function, imports tests from company stub
```

The revision files are intentionally blank — they exist so you can re-solve a problem from
scratch and verify with `npm run solve <topic>/revision/<name>`.

---

## Commands Reference

```bash
npm run solve <name>                          # Run solution against test suite
npm run solve revision/<name>                 # Run your practice attempt
npm run solve <name> -- --input "[args]"      # Test with custom input
npm run new <name> -- --topic <t> --company <c>  # Bootstrap new problem
npm run mock <name> -- --time 45              # Timed mock interview session
npm run review                                # Spaced repetition dashboard
npm run review <name> -- --rating easy|medium|hard  # Log confidence
npm run gotchas                               # JS interview traps reference
```

---

## Adding a New Problem — Checklist

Before marking a problem complete, verify:

- [ ] `problems/<name>.js` has all four docblock sections (Complexity, Approaches, Key Interview Points, Follow-ups)
- [ ] All three approaches in `─── Approaches ───` have both time AND space complexity
- [ ] `─── Key Interview Points ───` includes the core insight, the most common mistake, and at least one edge case
- [ ] `─── Follow-ups ───` names real LeetCode problems with numbers
- [ ] Solution is correct and optimal — not a brute force
- [ ] At least 3 test cases, including empty/null
- [ ] `npm run solve <name>` reports all tests passed
- [ ] Topic and company stubs created if topic/company were specified

---

## What SDE-2 Means at FAANG

An SDE-1 gets a working solution. An SDE-2 gets a working solution *and* explains why
it's the right trade-off for the given constraints, anticipates the follow-up before it's
asked, and writes code their team can maintain.

The docblock in every `problems/` file is the written equivalent of talking through your
thought process in an interview. A bare "O(n) time" comment is an SDE-1 answer.
A complete Approaches section that shows you considered brute force, spotted the bottleneck,
and chose the optimal pattern with justification — that is the SDE-2 answer.
