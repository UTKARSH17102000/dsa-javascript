---
description: Add a new DSA problem to the local JavaScript environment at D:\GithubRepos\DSA. Creates the master solution file, topic/company classification stubs, and revision practice files — all wired up correctly. Runs npm run solve to verify the solution passes before finishing.
---

You are adding a new DSA problem to the local JavaScript environment at `D:\GithubRepos\DSA`.

## Step 1 — Collect all required information

Arguments provided: `$ARGUMENTS`

Try to extract from the arguments:
- **problemName**: kebab-case filename before any flags (e.g. `two-sum`, `clone-graph`)
- **topic**: value after `--topic` or `-t`
- **company**: value after `--company` or `-c`
- **problemStatement**: a URL (`http...`) or raw problem text after the flags

For **every** piece of information that is missing from the arguments, ask the user directly — one message per missing item, in this order:

1. If **problemName** is missing:
   > "What is the problem name? (kebab-case, e.g. `merge-intervals`)"
   Wait for the answer before continuing.

2. If **topic** is missing:
   > "What topic should this be filed under? (e.g. `arrays`, `dp`, `graphs`, `trees`, `strings`, `linked-lists`) — or type `none` to skip."
   Wait for the answer before continuing.

3. If **company** is missing:
   > "Which company is this problem associated with? (e.g. `google`, `meta`, `amazon`, `microsoft`) — or type `none` to skip."
   Wait for the answer before continuing.

4. If **problemStatement** is missing:
   > "Paste the LeetCode URL or the full problem description:"
   Wait for the answer before continuing.

Do not proceed past Step 1 until all four pieces of information have been collected (topic and company can be `none`).

## Step 2 — Fetch the problem if a URL was given

If the problem statement looks like a URL (starts with `http`), use WebFetch to retrieve the full problem description from it. Extract: problem title, description, constraints, and examples.

## Step 3 — Determine the data structure type

Based on the problem description, decide which input/output types apply:
- **Linked List** → use `ListNode.arrayToList([...])`
- **Binary Tree** → use `TreeNode.arrayToTree([...])` with LeetCode-style BFS level-order arrays (`null` for missing nodes)
- **Graph** → use `GraphNode.adjListToGraph([[...]])` with 1-indexed adjacency lists
- **DP/Grid 2D matrix** → design solution to return the full 2D array (the test runner renders it as a pretty grid)
- **Standard primitives/arrays/objects** → use them directly

## Step 4 — Create the master file

Create `problems/<problemName>.js` with this exact structure:

```javascript
const { ListNode, TreeNode, GraphNode } = require("../dsa-helpers");

/**
 * Problem Name: <Human Readable Title>
 *
 * Description:
 * <Concise 2-3 line description of the problem>
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(...)
 * Space: O(...)
 *
 * ─── Approaches ──────────────────────────────────────────
 * Brute Force:  O(...) time, O(...) space — <one-line description>
 * [Intermediate: O(...) time, O(...) space — <one-line description>  ← include only if there's a meaningful middle step]
 * Optimal:      O(...) time, O(...) space — <one-line description>
 *
 * ─── Key Interview Points ────────────────────────────────
 * • <Core insight that makes the optimal solution work>
 * • <Common mistake or gotcha to watch out for>
 * • <Edge case worth mentioning to the interviewer>
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • <Related LeetCode problem or common variation>
 * • <Harder extension of this problem>
 */
function <camelCaseName>(<params>) {
  // Optimal, fully working solution
}

const tests = [
  { input: <...>, expected: <...> },
  { input: <...>, expected: <...> },
  { input: <...>, expected: <...> },
  // At least 3 tests: standard cases + tricky edge cases
  // (empty input, single element, negative numbers, extreme bounds, etc.)
];

module.exports = { solution: <camelCaseName>, tests };
```

Rules:
- Only include `require("../dsa-helpers")` if the problem actually uses `ListNode`, `TreeNode`, or `GraphNode`
- Write a fully working, optimal solution — not a stub
- Include at least 3 test cases; add more for complex problems
- Edge cases must include things like: empty arrays, null input, single-node graphs/trees, zero dimensions
- The `─── Approaches ───` section must list every meaningfully distinct approach from naive to optimal, each on one line with its Big-O. Omit the intermediate row only if there is no step between brute force and optimal.
- The `─── Key Interview Points ───` section must have 3–5 bullets covering: the key algorithmic insight, at least one gotcha/common mistake, and the most important edge cases.
- The `─── Follow-ups ───` section must have 2–4 bullets naming real LeetCode problems or well-known variations, with a one-phrase explanation of how each extends the current problem.
- **Critical — `input` field structure:** The test runner uses `getArgs(solution, test.input)`. If the solution takes **more than 1 parameter**, `input` must be an array of arguments (e.g. `input: [[2,7,11,15], 9]` for `twoSum(nums, target)`). If the solution takes **exactly 1 parameter**, `input` must be the raw value itself — NOT wrapped in an array (e.g. `input: [["1","0"],["0","1"]]` for `numIslands(grid)`). Wrapping a single-param input in an extra array causes the function to receive `[value]` instead of `value`.

## Step 5 — Create topic files (only if `--topic` was given)

**`topics/<topic>/<problemName>.js`**:
```javascript
// Classification file for topic/company linking
// Simply imports and re-exports the master problem implementation
module.exports = require("../../problems/<problemName>.js");
```

**`topics/<topic>/revision/<problemName>.js`**:
```javascript
const { ListNode, TreeNode, GraphNode } = require("../../../dsa-helpers");
// Import the test cases directly from the master problem definition!
const { tests } = require("../<problemName>.js");

/**
 * Practice Session: <Human Readable Title> (topics/<topic>)
 *
 * Re-code your solution from scratch below and run the tests to verify correctness!
 */
function <camelCaseName>() {
  // PRACTICE SOLUTION HERE

}

module.exports = {
  solution: <camelCaseName>,
  tests
};
```

Note: Only include the `require("../../../dsa-helpers")` line if the problem uses `ListNode`, `TreeNode`, or `GraphNode`.

## Step 6 — Create company files (only if `--company` was given)

**`companies/<company>/<problemName>.js`**:
```javascript
// Classification file for topic/company linking
// Simply imports and re-exports the master problem implementation
module.exports = require("../../problems/<problemName>.js");
```

**`companies/<company>/revision/<problemName>.js`**:
```javascript
const { ListNode, TreeNode, GraphNode } = require("../../../dsa-helpers");
// Import the test cases directly from the master problem definition!
const { tests } = require("../<problemName>.js");

/**
 * Practice Session: <Human Readable Title> (companies/<company>)
 *
 * Re-code your solution from scratch below and run the tests to verify correctness!
 */
function <camelCaseName>() {
  // PRACTICE SOLUTION HERE

}

module.exports = {
  solution: <camelCaseName>,
  tests
};
```

Note: Only include the `require("../../../dsa-helpers")` line if the problem uses `ListNode`, `TreeNode`, or `GraphNode`.

## Step 7 — Verify

Run `npm run solve <problemName>` from `D:\GithubRepos\DSA`.

If any tests fail, fix the solution in `problems/<problemName>.js` and re-run until all tests pass. Do not report success until the runner output confirms all tests passed.

## Step 8 — Report

After all tests pass, print a concise summary:

```
Created:
  problems/<problemName>.js          ✓ (solution + N test cases)
  topics/<topic>/<problemName>.js    ✓ (if topic provided)
  topics/<topic>/revision/...        ✓ (if topic provided)
  companies/<company>/...            ✓ (if company provided)
  companies/<company>/revision/...   ✓ (if company provided)

All tests passed. Practice with:
  npm run solve <problemName>
  npm run solve <topic>/revision/<problemName>   (if topic provided)
  npm run mock <problemName>
```
