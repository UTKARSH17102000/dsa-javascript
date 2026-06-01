# Group 1 — Foundation
# Patterns: Array · Map · Two Pointer · Sliding Window · Intervals · Utilities
# Prerequisite: none — this is the base everything else builds on
# Daily read: open this when working on any Group 1 pattern (3 min)

---

## ── ARRAY ───────────────────────────────────────────────────────────────────
# Real world: numbered lockers in a row — instant access by position.

```javascript
arr.sort((a, b) => a - b);                        // ascending — ALWAYS pass comparator
arr.sort((a, b) => b - a);                        // descending
arr.sort((a, b) => a[0] - b[0]);                  // 2D array by column 0

new Array(n).fill(0);                             // [0, 0, ..., 0]
new Array(m).fill(null).map(() => new Array(n).fill(0));  // 2D grid m×n

// Prefix sum — O(1) range queries after O(n) build
const prefix = new Array(n + 1).fill(0);
for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
const rangeSum = prefix[r + 1] - prefix[l];      // sum of nums[l..r]

// Deep copy 2D array
const copy = grid.map(row => [...row]);
```

⚠️ Watch out: `arr.sort()` without a comparator sorts lexicographically — `[10, 2, 3]` becomes `[10, 2, 3]`. Always pass `(a, b) => a - b`.

---

## ── MAP ─────────────────────────────────────────────────────────────────────
# Real world: a dictionary — look up any word instantly by its key.

```javascript
const map = new Map();
map.set(key, val);
map.get(key);                                     // undefined if missing (not null!)
map.get(key) ?? 0;                                // safe default (handles 0 and false correctly)
map.has(key);
map.delete(key);
map.size;                                         // O(1) — unlike Object.keys(obj).length

// Increment count pattern
map.set(key, (map.get(key) ?? 0) + 1);

// computeIfAbsent equivalent — initialize list if missing
if (!map.has(key)) map.set(key, []);
map.get(key).push(val);
// OR: (map.get(key) ?? map.set(key, []).get(key)).push(val);  ← concise but terse

// Frequency map
const freq = new Map();
for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

// Iterate
for (const [key, val] of map) { /* ... */ }
for (const key of map.keys()) { /* ... */ }
for (const val of map.values()) { /* ... */ }

// Prefix sum + Map (subarray sum = k)
const prefixCount = new Map([[0, 1]]);            // empty prefix = 1
let sum = 0, result = 0;
for (const num of nums) {
    sum += num;
    result += prefixCount.get(sum - k) ?? 0;
    prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1);
}
```

⚠️ Watch out: `map.get(key)` returns `undefined`, NOT `null`. Use `?? 0` not `|| 0` when values can legitimately be `0` or `false`.

---

## ── TWO POINTER ─────────────────────────────────────────────────────────────
# Real world: two people walking toward each other — they meet somewhere in the middle.

```javascript
// Opposite ends (sorted array)
let left = 0, right = arr.length - 1;
while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) { /* found */ left++; right--; }
    else if (sum < target) left++;
    else right--;
}

// Skip non-valid characters (valid palindrome pattern)
while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++; right--;
}
const isAlphaNum = c => /[a-z0-9]/i.test(c);

// Slow / fast pointer (linked list middle, cycle detection)
let slow = head, fast = head;
while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
}
// slow is now at middle
```

⚠️ Watch out: `left < right` (not `<=`). At `left === right` there's nothing left to compare.

---

## ── SLIDING WINDOW ──────────────────────────────────────────────────────────
# Real world: a train window moving along a track — seeing a fixed-width slice at a time.

```javascript
// Variable-size window (longest substring satisfying constraint)
let left = 0, maxLen = 0;
const window = new Map();

for (let right = 0; right < s.length; right++) {
    // expand window: add s[right]
    window.set(s[right], (window.get(s[right]) ?? 0) + 1);

    // shrink window while constraint is violated
    while (/* window invalid */) {
        const leftChar = s[left];
        window.set(leftChar, window.get(leftChar) - 1);
        if (window.get(leftChar) === 0) window.delete(leftChar);
        left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
}

// Fixed-size window (anagram / exact-k problems)
const k = ...; // window size
// Build initial window [0, k-1]
for (let i = 0; i < k; i++) { /* add s[i] */ }

for (let right = k; right < s.length; right++) {
    // add s[right] to window
    // remove s[right - k] from window  ← this is the element falling off the left
    // check if window satisfies condition
}
```

⚠️ Watch out: for fixed-size window, the element leaving is `s[right - k]`, NOT `s[left]`. Mixing these up produces wrong results.

---

## ── INTERVALS ───────────────────────────────────────────────────────────────
# Real world: meeting bookings on a calendar — detecting overlaps and merging time slots.

```javascript
// Sort by start time first
intervals.sort((a, b) => a[0] - b[0]);

// Merge overlapping intervals
const merged = [intervals[0]];
for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
        last[1] = Math.max(last[1], intervals[i][1]);  // extend
    } else {
        merged.push(intervals[i]);
    }
}

// Check overlap: [a,b] and [c,d] overlap iff a <= d && c <= b
// Non-overlap: b < c || d < a

// Count minimum rooms (Meeting Rooms II)
// Use a min-heap of end times — if next start >= heap.peek(), reuse the room
```

⚠️ Watch out: merge condition is `intervals[i][0] <= last[1]` (≤ not <). Two meetings that touch at a point (e.g. [1,3] and [3,5]) should merge.

---

## ── UTILITIES ───────────────────────────────────────────────────────────────

```javascript
// String / char
const chars = s.split('');                        // string → array of chars
chars.join('');                                   // array of chars → string
s.charCodeAt(i) - 97;                             // 'a'=0, 'b'=1, ..., 'z'=25
String.fromCharCode(97 + idx);                    // 0→'a', 1→'b', ...
s[i].toLowerCase();
/[a-z0-9]/i.test(c);                              // isAlphanumeric

// Integer / math
Math.floor(a / b);                                // integer division
Math.ceil(a / b);                                 // ceiling division
(a + b - 1) / b | 0;                             // integer ceiling (no float)
(a % m + m) % m;                                  // safe modulo (handles negatives)
Math.max(a, b);  Math.min(a, b);
Number.MAX_SAFE_INTEGER;  // 9007199254740991
Infinity;  -Infinity;                             // use instead of MAX/MIN_VALUE

// Array
arr.slice(l, r);                                  // [l, r) — does NOT mutate
arr.splice(i, count);                             // mutates! removes count elements at i
[...arr];                                         // shallow copy

// Set
const seen = new Set();
seen.add(x);  seen.has(x);  seen.delete(x);  seen.size;
```

⚠️ Watch out: `%` in JavaScript returns negative for negative numbers: `-1 % 5 === -1` (not 4). Always use `((n % m) + m) % m` for safe modulo.

---

## Your Recurring Mistakes — Group 1
- **Sort**: calling `.sort()` without a comparator — lexicographic order corrupts numeric sorting
- **Map default**: using `|| 0` instead of `?? 0` — breaks when the value is legitimately 0
- **Fixed window**: removing `s[left]` instead of `s[right - k]` from the window
- **Intervals merge**: using `<` instead of `<=` in overlap check — misses touching intervals
- **Modulo**: forgetting safe modulo pattern when input can be negative
