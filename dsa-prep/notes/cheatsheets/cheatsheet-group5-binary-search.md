# Group 5 — Binary Search
# Patterns: Standard · First/Last Occurrence · Lower Bound · Search on Answer · Rotated Array · 2D Matrix · Peak
# Prerequisite: Group 1 (sorted arrays) — binary search only works on monotonic/sorted spaces
# Daily read: open this when working on any binary search pattern (3 min)

---

## PREREQUISITE CHAIN
```
Sorted Array (Group 1)
    │
    ├──► Standard Binary Search (find target)
    │       │
    │       ├──► First occurrence (leftmost)
    │       ├──► Last occurrence (rightmost)
    │       └──► Lower bound / insertion point
    │
    ├──► Rotated Sorted Array variants
    │
    ├──► Search on Answer (binary search on value range, not array index)
    │       │
    │       └──► Koko Eating Bananas · Capacity to Ship · Cutting Wood
    │
    └──► 2D Matrix binary search
```

---

## ── STANDARD BINARY SEARCH ──────────────────────────────────────────────────
# Real world: guessing a number — always cut the remaining range in half.

```javascript
let lo = 0, hi = arr.length - 1;
while (lo <= hi) {                                  // lo <= hi — runs until range is empty
    const mid = lo + Math.floor((hi - lo) / 2);    // NEVER (lo + hi) / 2 if values are huge
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;
```

⚠️ Watch out: `lo + Math.floor((hi - lo) / 2)` avoids potential overflow. In JavaScript numbers are floats so it rarely matters, but this is the safe habit and the one interviewers expect to see.

---

## ── FIRST OCCURRENCE (leftmost target) ──────────────────────────────────────
# Keep searching LEFT after finding target.

```javascript
let lo = 0, hi = arr.length - 1, result = -1;
while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) {
        result = mid;        // save answer
        hi = mid - 1;        // keep searching LEFT for an earlier occurrence
    } else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return result;
```

---

## ── LAST OCCURRENCE (rightmost target) ──────────────────────────────────────
# Keep searching RIGHT after finding target.

```javascript
let lo = 0, hi = arr.length - 1, result = -1;
while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) {
        result = mid;        // save answer
        lo = mid + 1;        // keep searching RIGHT for a later occurrence
    } else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return result;
```

---

## ── LOWER BOUND (insertion point) ───────────────────────────────────────────
# Smallest index where arr[index] >= target. Used for: Search Insert Position.

```javascript
let lo = 0, hi = arr.length;                        // hi = length (not length-1) — can insert at end
while (lo < hi) {                                   // lo < hi (not lo <= hi)
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;                                  // arr[mid] >= target: mid could be the answer
}
return lo;                                          // lo === hi === insertion point
```

⚠️ Watch out: `hi = arr.length` (not `length - 1`) and `lo < hi` (not `lo <= hi`). This template is different from standard search — confusing the two is the most common binary search bug.

---

## ── SEARCH ON ANSWER ─────────────────────────────────────────────────────────
# Real world: adjusting a dial — find the minimum setting that satisfies a condition.
# Use when: "find minimum/maximum X such that condition(X) is true"
# Signal words: "minimum speed", "minimum capacity", "minimum days", "at most k"

```javascript
// Template — minimize
let lo = MIN_POSSIBLE_ANSWER, hi = MAX_POSSIBLE_ANSWER;
while (lo < hi) {                                   // lo < hi — converges to single answer
    const mid = lo + Math.floor((hi - lo) / 2);
    if (feasible(mid)) hi = mid;                    // mid works → try smaller (minimize)
    else lo = mid + 1;                              // mid doesn't work → need larger
}
return lo;

// feasible(k): "can we achieve the goal with value = k?"

// Example — Koko Eating Bananas: can Koko eat all piles in h hours at speed k?
function feasible(piles, k, h) {
    let hours = 0;
    for (const pile of piles) hours += Math.ceil(pile / k);   // ceiling division
    return hours <= h;
}
// lo = 1, hi = Math.max(...piles)
```

⚠️ Watch out: always use `Math.ceil(pile / k)` for ceiling division on integers — not `Math.floor((pile + k - 1) / k)` style, though that also works. Both are fine in JS.

---

## ── ROTATED SORTED ARRAY ────────────────────────────────────────────────────
# Real world: a sorted list that got cut and rearranged — one half is always sorted.
# Key insight: at every mid, exactly one of [lo,mid] or [mid,hi] is sorted. Check which.

```javascript
// Search in Rotated Sorted Array
let lo = 0, hi = arr.length - 1;
while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) return mid;

    if (arr[lo] <= arr[mid]) {                      // LEFT half is sorted
        if (arr[lo] <= target && target < arr[mid]) hi = mid - 1;  // target in left
        else lo = mid + 1;                          // target in right
    } else {                                        // RIGHT half is sorted
        if (arr[mid] < target && target <= arr[hi]) lo = mid + 1;  // target in right
        else hi = mid - 1;                          // target in left
    }
}
return -1;

// Find Minimum in Rotated Array (no duplicates)
let lo = 0, hi = arr.length - 1;
while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] > arr[hi]) lo = mid + 1;           // min is in right half
    else hi = mid;                                   // mid could be the min
}
return arr[lo];
```

⚠️ Watch out: use `arr[lo] <= arr[mid]` with `<=` to handle the 2-element array case where `lo === mid`. Using `<` misses it.

---

## ── 2D MATRIX BINARY SEARCH ─────────────────────────────────────────────────
# Treat the entire matrix as a flattened 1D sorted array.

```javascript
// Only works when matrix is fully sorted end-to-end (LC 74 — not LC 240)
const m = matrix.length, n = matrix[0].length;
let lo = 0, hi = m * n - 1;

while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const val = matrix[Math.floor(mid / n)][mid % n];  // convert 1D index to 2D
    if (val === target) return true;
    else if (val < target) lo = mid + 1;
    else hi = mid - 1;
}
return false;
```

⚠️ Watch out: `row = Math.floor(mid / n)`, `col = mid % n`. Only valid when each row is sorted AND the first element of each row is greater than the last element of the previous row.

---

## ── FIND PEAK ELEMENT ────────────────────────────────────────────────────────
# Key insight: if arr[mid] < arr[mid+1], a peak exists in the right half — always move uphill.

```javascript
let lo = 0, hi = arr.length - 1;
while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;     // uphill → peak is to the right
    else hi = mid;                                   // downhill → peak is here or to the left
}
return lo;
```

---

## Your Recurring Mistakes — Group 5
- **Lower bound**: using `hi = arr.length - 1` instead of `hi = arr.length`
- **Lower bound**: using `lo <= hi` instead of `lo < hi` — loop runs one extra iteration
- **First occurrence**: returning immediately on match instead of saving + continuing left
- **Search on answer**: setting `hi = mid - 1` instead of `hi = mid` — skips the answer
- **Rotated array**: using `<` instead of `<=` in `arr[lo] <= arr[mid]` — 2-element edge case
- **2D matrix**: using `mid / n` without `Math.floor` — float index crashes
