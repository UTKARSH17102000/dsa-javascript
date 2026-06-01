---
description: Generate a self-contained LeetCode-style practice file in temp/<topic>/ that runs with just `node`. Pre-filled with problem description, test cases, and function signature — you only write the logic.
---

You are generating a self-contained JavaScript practice file for the DSA environment at `D:\GithubRepos\DSA`.

## Step 1 — Parse arguments

Arguments: `$ARGUMENTS`

Extract:
- **topic**: value after `--topic` or `-t`, OR infer from the problem description (e.g. "DFS Graphs" → `graphs`, "Binary Tree" → `trees`, "Two Sum" → `arrays`, "Coin Change" → `dp`, "Binary Search" → `binary-search`, "Linked List" → `linked-lists`, "Trie" → `tries`, "Heap" → `heaps`, "Backtracking" → `backtracking`, "Sliding Window" or "Subarray" → `arrays`)
- **problemDescription**: everything that is not a flag — could be a pattern name like "DFS Graphs", a problem name like "Number of Islands", or a LeetCode URL

If `$ARGUMENTS` is empty, ask:
> "What do you want to practice? Give me a pattern (e.g. 'DFS Graphs', 'Binary Tree BFS', 'DP Coin Change') or a LeetCode URL."
Wait for the answer before continuing.

## Step 2 — Resolve to a specific problem

If the input is a **LeetCode URL** (starts with `http`): use WebFetch to retrieve the problem.

If the input is a **pattern name** (e.g. "DFS Graphs", "sliding window", "union find"): choose the single most representative, commonly-asked LeetCode problem for that pattern at SDE-2 level. Use this lookup:

| Pattern phrase | Pick this problem |
|---|---|
| DFS Graphs / graph dfs / number of islands | Number of Islands (LC 200) |
| BFS Graphs / graph bfs / rotting oranges | Rotting Oranges (LC 994) |
| Clone Graph | Clone Graph (LC 133) |
| Topological Sort / course schedule | Course Schedule (LC 207) |
| Union Find | Number of Connected Components (LC 323) |
| Dijkstra / shortest path | Network Delay Time (LC 743) |
| Binary Tree DFS / invert tree | Invert Binary Tree (LC 226) |
| Binary Tree BFS / level order | Binary Tree Level Order Traversal (LC 102) |
| LCA / lowest common ancestor | Lowest Common Ancestor of a Binary Tree (LC 236) |
| Max Depth / tree depth | Maximum Depth of Binary Tree (LC 104) |
| Validate BST | Validate Binary Search Tree (LC 98) |
| Serialize deserialize tree | Serialize and Deserialize Binary Tree (LC 297) |
| Two Sum | Two Sum (LC 1) |
| Sliding Window / longest substring | Longest Substring Without Repeating Characters (LC 3) |
| Minimum Window Substring | Minimum Window Substring (LC 76) |
| Subarray Sum | Subarray Sum Equals K (LC 560) |
| Product except self | Product of Array Except Self (LC 238) |
| Merge Intervals | Merge Intervals (LC 56) |
| Coin Change / DP | Coin Change (LC 322) |
| Unique Paths / grid DP | Unique Paths (LC 62) |
| Longest Increasing Subsequence / LIS | Longest Increasing Subsequence (LC 300) |
| Binary Search | Search Insert Position (LC 35) |
| Search Rotated | Search in Rotated Sorted Array (LC 33) |
| Koko / search on answer | Koko Eating Bananas (LC 875) |
| Reverse Linked List | Reverse Linked List (LC 206) |
| Middle of Linked List | Middle of the Linked List (LC 876) |
| Linked List Cycle | Linked List Cycle (LC 141) |
| Merge K Sorted | Merge K Sorted Lists (LC 23) |
| Top K Elements / K frequent | K Most Frequent Elements (LC 347) |
| Trie / implement trie | Implement Trie (LC 208) |
| Word Search | Word Search (LC 79) |
| Combination Sum / backtracking | Combination Sum (LC 39) |
| Permutations | Permutations (LC 46) |
| Next Greater Element | Next Greater Element I (LC 496) |
| Monotonic Stack | Daily Temperatures (LC 739) |
| Valid Parentheses / stack | Valid Parentheses (LC 20) |

If the input doesn't match any entry: pick the single best-fit problem at the SDE-2 level for the described pattern.

## Step 3 — Determine the kebab-case filename and topic folder

- **filename**: kebab-case of the problem title (e.g. `number-of-islands`, `coin-change`)
- **topicFolder**: one of: `graphs`, `trees`, `arrays`, `dp`, `binary-search`, `linked-lists`, `tries`, `heaps`, `backtracking`, `strings`, `stacks`
- **outputPath**: `temp/<topicFolder>/<filename>.js`

## Step 4 — Design the function signature and test cases

Determine:
- **functionName**: camelCase (e.g. `numIslands`, `coinChange`)
- **parameters**: the exact parameter list the function takes
- **isMultiParam**: `true` if the function takes MORE than 1 parameter — affects how the runner calls it
- **needsListNode**: `true` if the problem uses linked lists
- **needsTreeNode**: `true` if the problem uses a binary tree

Design at least 4 test cases:
1. A standard representative case
2. A second distinct case testing a different path
3. A minimal/single-element edge case
4. An empty/null/zero case

For **ListNode tests**: `input` is a JS array (e.g. `[1,2,3,4,5]`), and the runner converts it using `ListNode.from()`. `expected` is also a JS array for comparison. Do NOT put `ListNode` objects directly in the test array.

For **TreeNode tests**: `input` is a LeetCode-style level-order array (e.g. `[4,2,7,1,3,6,9]`), runner converts using `TreeNode.from()`. `expected` is also a level-order array.

For **multi-param functions**: `input` is an array of arguments, e.g. `input: [[2,7,11,15], 9]`. Runner calls `fn(...input)`.

For **single-param functions**: `input` is the raw value. Runner calls `fn(input)`.

## Step 5 — Write the practice file

Create `D:\GithubRepos\DSA\temp\<topicFolder>\<filename>.js` with EXACTLY this structure:

```javascript
// ════════════════════════════════════════════════════════════════
//  PRACTICE: <Human Readable Problem Title>
//  Pattern:  <pattern tag>  ·  <LeetCode number if known>
//  Run:      node temp/<topicFolder>/<filename>.js
// ════════════════════════════════════════════════════════════════
//
// Problem:
// <3–5 line description. State the input clearly, the rule, and the output.>
//
// Example:
//   Input:  <first test case input, human-readable>
//   Output: <first test case expected output>
//
// Constraints:
//   · <key constraint 1>
//   · <key constraint 2>
// ────────────────────────────────────────────────────────────────
```

Then, **only if `needsListNode` is true**, include this inline helper block:

```javascript
// ── Helpers ──────────────────────────────────────────────────────
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
  static from(arr) {
    if (!arr || arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let cur = head;
    for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
    return head;
  }
  static toArray(head) {
    const arr = [];
    while (head) { arr.push(head.val); head = head.next; }
    return arr;
  }
}
```

Then, **only if `needsTreeNode` is true**, include this inline helper block:

```javascript
// ── Helpers ──────────────────────────────────────────────────────
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
  static from(arr) {
    if (!arr || arr.length === 0) return null;
    const root = new TreeNode(arr[0]);
    const q = [root];
    let i = 1;
    while (q.length > 0 && i < arr.length) {
      const node = q.shift();
      if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); q.push(node.left); } i++;
      if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); q.push(node.right); } i++;
    }
    return root;
  }
  static toArray(root) {
    if (!root) return [];
    const res = [], q = [root];
    while (q.length > 0) {
      const node = q.shift();
      if (node) { res.push(node.val); q.push(node.left); q.push(node.right); }
      else res.push(null);
    }
    while (res[res.length - 1] === null) res.pop();
    return res;
  }
}
```

Then the solution scaffold:

```javascript
// ── Your solution ─────────────────────────────────────────────────

function <functionName>(<params>) {
  // ↓↓ write your solution below ↓↓



  // ↑↑ write your solution above ↑↑
}
```

Then the test cases:

```javascript
// ── Tests ─────────────────────────────────────────────────────────
//   input:    <explanation of what input represents>
//   expected: <explanation of what expected represents>

const tests = [
  { input: <...>, expected: <...>, label: "<descriptive label>" },
  { input: <...>, expected: <...>, label: "<descriptive label>" },
  { input: <...>, expected: <...>, label: "<descriptive label>" },
  { input: <...>, expected: <...>, label: "<descriptive label>" },
];
```

Then the self-contained runner. This runner must NEVER be modified by the user. Choose the correct variant:

**Variant A — single-param function** (isMultiParam is false):
```javascript
// ── Runner ────────────────────────────────────────────────────────

function _deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => _deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    return ka.every((k, i) => k === kb[i] && _deepEqual(a[k], b[k]));
  }
  return false;
}

let _passed = 0;
const _name = '<Human Readable Problem Title>';
console.log(`\n  ─── ${_name} ${'─'.repeat(Math.max(0, 46 - _name.length))}\n`);

for (let _i = 0; _i < tests.length; _i++) {
  const { input, expected, label } = tests[_i];
  let _result, _ok;
  try {
    _result = <functionName>(input);  // single param — pass input directly
    _ok = _deepEqual(_result, expected);
  } catch (_e) {
    console.log(`  ❌  Test ${_i + 1} ERROR${label ? ' — ' + label : ''}: ${_e.message}`);
    continue;
  }
  if (_ok) {
    console.log(`  ✅  Test ${_i + 1} passed${label ? ' — ' + label : ''}`);
    _passed++;
  } else {
    console.log(`  ❌  Test ${_i + 1} FAILED${label ? ' — ' + label : ''}`);
    console.log(`      expected → ${JSON.stringify(expected)}`);
    console.log(`      got      → ${JSON.stringify(_result)}`);
  }
}
console.log(`\n  ${_passed === tests.length ? '🎉' : '💥'}  ${_passed}/${tests.length} tests passed\n`);
```

**Variant B — multi-param function** (isMultiParam is true):
```javascript
// ── Runner ────────────────────────────────────────────────────────

function _deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => _deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    return ka.every((k, i) => k === kb[i] && _deepEqual(a[k], b[k]));
  }
  return false;
}

let _passed = 0;
const _name = '<Human Readable Problem Title>';
console.log(`\n  ─── ${_name} ${'─'.repeat(Math.max(0, 46 - _name.length))}\n`);

for (let _i = 0; _i < tests.length; _i++) {
  const { input, expected, label } = tests[_i];
  let _result, _ok;
  try {
    _result = <functionName>(...input);  // multi-param — spread input array as arguments
    _ok = _deepEqual(_result, expected);
  } catch (_e) {
    console.log(`  ❌  Test ${_i + 1} ERROR${label ? ' — ' + label : ''}: ${_e.message}`);
    continue;
  }
  if (_ok) {
    console.log(`  ✅  Test ${_i + 1} passed${label ? ' — ' + label : ''}`);
    _passed++;
  } else {
    console.log(`  ❌  Test ${_i + 1} FAILED${label ? ' — ' + label : ''}`);
    console.log(`      expected → ${JSON.stringify(expected)}`);
    console.log(`      got      → ${JSON.stringify(_result)}`);
  }
}
console.log(`\n  ${_passed === tests.length ? '🎉' : '💥'}  ${_passed}/${tests.length} tests passed\n`);
```

**Variant C — ListNode function** (needsListNode is true):

For ListNode problems, `input` is always a JS array. Convert using `ListNode.from(input)` before calling.
`expected` is also a JS array. Compare by converting the result back using `ListNode.toArray()`.

```javascript
// ── Runner ────────────────────────────────────────────────────────

function _deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => _deepEqual(v, b[i]));
  }
  return false;
}

let _passed = 0;
const _name = '<Human Readable Problem Title>';
console.log(`\n  ─── ${_name} ${'─'.repeat(Math.max(0, 46 - _name.length))}\n`);

for (let _i = 0; _i < tests.length; _i++) {
  const { input, expected, label } = tests[_i];
  let _result, _ok;
  try {
    // Convert array input to ListNode, get result, convert back to array for comparison
    const _head = Array.isArray(input[0]) ? input.map(a => ListNode.from(a)) : ListNode.from(input);
    _result = Array.isArray(input[0])
      ? ListNode.toArray(<functionName>(..._head))
      : ListNode.toArray(<functionName>(_head));
    _ok = _deepEqual(_result, expected);
  } catch (_e) {
    console.log(`  ❌  Test ${_i + 1} ERROR${label ? ' — ' + label : ''}: ${_e.message}`);
    continue;
  }
  if (_ok) {
    console.log(`  ✅  Test ${_i + 1} passed${label ? ' — ' + label : ''}`);
    _passed++;
  } else {
    console.log(`  ❌  Test ${_i + 1} FAILED${label ? ' — ' + label : ''}`);
    console.log(`      expected → ${JSON.stringify(expected)}`);
    console.log(`      got      → ${JSON.stringify(_result)}`);
  }
}
console.log(`\n  ${_passed === tests.length ? '🎉' : '💥'}  ${_passed}/${tests.length} tests passed\n`);
```

**Variant D — TreeNode function** (needsTreeNode is true):

For TreeNode problems, `input` is a LeetCode-style level-order array. `expected` is also a level-order array.

Same as Variant C but use `TreeNode.from(input)` and `TreeNode.toArray()`.

## Step 6 — Create directories and save the file

Create `D:\GithubRepos\DSA\temp\<topicFolder>\` if it doesn't exist.
Write the file to `D:\GithubRepos\DSA\temp\<topicFolder>\<filename>.js`.

## Step 7 — Verify the runner works

Run `node D:\GithubRepos\DSA\temp\<topicFolder>\<filename>.js`

The function body is empty so all tests will show ❌ FAILED (or ❌ ERROR with undefined) — that is expected and correct.
The runner itself must execute without crashing. If it crashes (syntax error, etc.), fix the file before reporting success.

If the runner crashes, read the error, fix the generated file, and run again until the runner executes cleanly.

## Step 8 — Report

Print:
```
Created: temp/<topicFolder>/<filename>.js

  Practice:  <Problem Name> (<LC number>)
  Pattern:   <pattern tag>
  Tests:     <N> pre-loaded (all failing until you fill in the solution)

To start:
  1. Open  temp/<topicFolder>/<filename>.js
  2. Write your solution inside the function body
  3. Run:   node temp/<topicFolder>/<filename>.js
```
