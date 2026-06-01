/**
 * JavaScript Interview Gotchas Cheat Sheet
 * A premium terminal reference covering the most critical JS pitfalls in technical interviews.
 *
 * Usage:
 *   npm run gotchas                  → Show all categories
 *   npm run gotchas -- --topic sort  → Filter by topic keyword
 */

const { styles } = require("./dsa-helpers");

const args = process.argv.slice(2);
let filterTopic = null;
for (let i = 0; i < args.length; i++) {
  if ((args[i] === "--topic" || args[i] === "-t") && args[i + 1]) {
    filterTopic = args[i + 1].toLowerCase();
    i++;
  }
}

// ─── Gotcha Definitions ────────────────────────────────────────────────────────
const gotchas = [
  {
    id: 1,
    tag: "sort",
    title: "Array .sort() Uses Lexicographic (String) Order by Default",
    risk: "HIGH",
    description: "JS converts elements to strings before comparing, so numeric arrays sort incorrectly.",
    bad: `[1, 10, 100, 2, 21].sort()
// ❌ Returns: [1, 10, 100, 2, 21]  — wrong!`,
    good: `[1, 10, 100, 2, 21].sort((a, b) => a - b)
// ✅ Returns: [1, 2, 10, 21, 100]  — correct ascending

[1, 10, 100, 2, 21].sort((a, b) => b - a)
// ✅ Returns: [100, 21, 10, 2, 1]  — correct descending`,
    tip: "Always pass a comparator function to .sort() when working with numbers.",
    complexity: null
  },
  {
    id: 2,
    tag: "division",
    title: "Integer Division Returns a Float",
    risk: "HIGH",
    description: "JS is single-number-type (IEEE 754 float). 5 / 2 gives 2.5, not 2.",
    bad: `const mid = (lo + hi) / 2;
// ❌ mid = 2.5 for lo=0, hi=5 — breaks array indexing!`,
    good: `const mid = Math.floor((lo + hi) / 2);  // ✅ Safe, explicit
const mid = (lo + hi) >> 1;            // ✅ Bitwise right shift (fast, rounds down)
const mid = (lo + hi) | 0;             // ✅ Bitwise OR 0 (truncates toward zero)`,
    tip: "Binary search mid-point MUST use Math.floor or bitwise >> 1.",
    complexity: null
  },
  {
    id: 3,
    tag: "overflow",
    title: "Number Overflow & Safe Integer Boundaries",
    risk: "MEDIUM",
    description: "JS Number.MAX_SAFE_INTEGER = 2^53 - 1. Beyond this, arithmetic loses precision.",
    bad: `Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2  // ❌ true!`,
    good: `// Use BigInt for large numbers (e.g., factorial, large sums):
const n = BigInt("99999999999999999");
const result = n * BigInt(2);  // ✅ precise

// Use Infinity for boundary problems:
let max = -Infinity;  // ✅ better than let max = 0 for negative inputs`,
    tip: "For interview problems: use Number.MIN_SAFE_INTEGER / MAX_SAFE_INTEGER as sentinels.",
    complexity: null
  },
  {
    id: 4,
    tag: "array shift unshift",
    title: ".shift() and .unshift() Are O(N) — NOT O(1)",
    risk: "HIGH",
    description: "Unlike push/pop (O(1) at tail), shift/unshift operate at the HEAD and shift all indices.",
    bad: `// Queue implemented naively with array:
const queue = [];
queue.push(val);    // ✅ O(1) — adds to tail
queue.shift();      // ❌ O(N) — removes from head, re-indexes everything!`,
    good: `// ✅ Option 1: Use a pointer-based queue (zero allocation):
let head = 0;
const queue = [];
queue.push(val);
const front = queue[head++];

// ✅ Option 2: Use two stacks or a deque class for O(1) amortized ops`,
    tip: "In BFS problems, using .shift() makes your BFS O(N²) instead of O(N). Always use pointer-based queues.",
    complexity: "O(N) naive vs O(1) amortized with pointer trick"
  },
  {
    id: 5,
    tag: "reference equality set map object",
    title: "Object/Array Equality Is By Reference, Not Value",
    risk: "HIGH",
    description: "Set and Map use reference identity for objects. Two arrays with same content are NOT equal.",
    bad: `const set = new Set();
set.add([1, 2]);
set.has([1, 2]);  // ❌ false — different object reference!

{} === {}         // ❌ false
[] === []         // ❌ false`,
    good: `// ✅ Serialize objects/arrays to strings when using Sets/Maps as keys:
const set = new Set();
set.add(JSON.stringify([1, 2]));
set.has(JSON.stringify([1, 2]));  // ✅ true

// ✅ For shallow compare, compare element-by-element:
const equal = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);`,
    tip: "When deduplicating arrays in Sets or using array coords as Map keys, always JSON.stringify them.",
    complexity: null
  },
  {
    id: 6,
    tag: "splice slice",
    title: ".splice() Mutates the Array — .slice() Does Not",
    risk: "MEDIUM",
    description: ".splice() changes the original array in place. .slice() returns a new array (non-destructive).",
    bad: `const arr = [1, 2, 3, 4, 5];
arr.splice(1, 2);  // ❌ Mutates arr → arr is now [1, 4, 5]
                   //    Returns [2, 3] (removed elements)`,
    good: `// ✅ .slice(start, end) — non-mutating:
const sub = arr.slice(1, 3);  // Returns [2, 3], arr unchanged

// ✅ To remove without mutation (create new array):
const newArr = [...arr.slice(0, 1), ...arr.slice(3)];`,
    tip: "In recursive problems, prefer .slice() over .splice() to avoid mutation bugs.",
    complexity: "Both are O(N)"
  },
  {
    id: 7,
    tag: "NaN undefined null falsy",
    title: "NaN, Falsy Values, and Comparison Traps",
    risk: "MEDIUM",
    description: "NaN is the only JS value not equal to itself. undefined and null behave unexpectedly in comparisons.",
    bad: `NaN === NaN      // ❌ false — NaN is never equal to anything!
null == undefined // ✅ true (loose equality)
null === undefined // ❌ false (strict equality)
0 == false       // ✅ true (coercion!)
"" == false      // ✅ true (coercion!)`,
    good: `// ✅ Always check NaN with Number.isNaN():
Number.isNaN(NaN)   // true
Number.isNaN("abc") // false (unlike global isNaN which coerces!)

// ✅ Falsy values: false, 0, "", null, undefined, NaN
// Use strict equality === and guard explicitly:
if (val !== null && val !== undefined) { ... }
// Or: if (val != null) { ... }  // catches both null AND undefined`,
    tip: "In graph/DP problems with cell values, always guard: if (grid[r][c] !== 0) is NOT the same as if (grid[r][c])!",
    complexity: null
  },
  {
    id: 8,
    tag: "closure loop var",
    title: "var in Loops Creates Shared Closure (Use let)",
    risk: "MEDIUM",
    description: "var is function-scoped, not block-scoped. Loop callbacks capture the FINAL value of i, not each iteration's.",
    bad: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// ❌ Prints: 3  3  3  — all see final value of i!`,
    good: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// ✅ Prints: 0  1  2  — each iteration has its own block-scoped i`,
    tip: "Always use let/const. Never use var. This comes up in closure-based callback problems.",
    complexity: null
  },
  {
    id: 9,
    tag: "string immutable concat",
    title: "String Concatenation in Loops Is O(N²)",
    risk: "HIGH",
    description: "Strings are immutable in JS. Concatenating in a loop creates a new string on every iteration.",
    bad: `let result = "";
for (const char of chars) {
  result += char;  // ❌ Creates a new string every iteration → O(N²) total
}`,
    good: `// ✅ Collect into array, join once at the end → O(N):
const parts = [];
for (const char of chars) {
  parts.push(char);
}
const result = parts.join("");`,
    tip: "In problems that build strings (anagram checks, decode strings, etc.), always use an array buffer.",
    complexity: "O(N²) bad vs O(N) good"
  },
  {
    id: 10,
    tag: "modulo negative",
    title: "The % Operator Returns Negative Results for Negative Numbers",
    risk: "MEDIUM",
    description: "JS % is a remainder operator, not a true mathematical modulo. With negative numbers it returns negative results.",
    bad: `-7 % 3  // ❌ Returns -1 in JS (not 2 like Python)
// This breaks circular index calculations!`,
    good: `// ✅ Safe modulo that always returns non-negative:
const mod = (n, m) => ((n % m) + m) % m;

mod(-7, 3)  // ✅ Returns 2
mod(7, 3)   // ✅ Returns 1

// Use for circular array problems:
const nextIdx = mod(currIdx - 1, arr.length);`,
    tip: "Any time you compute circular/rotated indices, use the safe mod helper above.",
    complexity: null
  }
];

// ─── Rendering ────────────────────────────────────────────────────────────────
const riskColor = { HIGH: styles.red, MEDIUM: styles.yellow, LOW: styles.green };
const riskEmoji = { HIGH: "🔴", MEDIUM: "🟡", LOW: "🟢" };

const filtered = filterTopic
  ? gotchas.filter(g => g.tag.includes(filterTopic) || g.title.toLowerCase().includes(filterTopic))
  : gotchas;

console.log(`\n${styles.cyan}${styles.bright}╔══════════════════════════════════════════════════════════════════════╗${styles.reset}`);
console.log(`${styles.cyan}${styles.bright}║         ⚡ JavaScript Interview Gotchas & Traps Reference            ║${styles.reset}`);
console.log(`${styles.cyan}${styles.bright}╚══════════════════════════════════════════════════════════════════════╝${styles.reset}`);

if (filterTopic) {
  console.log(`${styles.yellow}  Filtering by topic: "${filterTopic}" — ${filtered.length} result(s)${styles.reset}`);
} else {
  console.log(`${styles.gray}  ${filtered.length} critical traps. Use --topic <keyword> to filter (e.g., --topic sort).${styles.reset}`);
}
console.log();

if (filtered.length === 0) {
  console.log(`${styles.yellow}  No gotchas found matching "${filterTopic}".${styles.reset}\n`);
  process.exit(0);
}

for (const g of filtered) {
  const rc = riskColor[g.risk] || styles.white;
  const re = riskEmoji[g.risk] || "⚪";

  console.log(`${styles.bright}${styles.white}  ── #${g.id} ${g.title}${styles.reset}`);
  console.log(`  ${rc}${re} Risk: ${g.risk}${styles.reset}${g.complexity ? `   ${styles.gray}│ Complexity: ${g.complexity}${styles.reset}` : ""}`);
  console.log(`  ${styles.dim}${g.description}${styles.reset}`);

  console.log(`\n  ${styles.red}${styles.bright}✗ Dangerous (DO NOT DO):${styles.reset}`);
  g.bad.split("\n").forEach(line => {
    console.log(`  ${styles.dim}${styles.red}  ${line}${styles.reset}`);
  });

  console.log(`\n  ${styles.green}${styles.bright}✓ Correct Approach:${styles.reset}`);
  g.good.split("\n").forEach(line => {
    console.log(`  ${styles.green}  ${line}${styles.reset}`);
  });

  console.log(`\n  ${styles.cyan}💡 ${g.tip}${styles.reset}`);
  console.log(`\n  ${"─".repeat(70)}\n`);
}

console.log(`${styles.gray}  All ${filtered.length} gotchas shown. Keep these sharp for your interview! 🚀${styles.reset}\n`);
