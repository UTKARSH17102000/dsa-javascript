# Group 2 — Linear Structures
# Patterns: Stack · Monotonic Stack · Queue / BFS · Multi-source BFS · Heap
# Prerequisite: Group 1 (Map for BFS visited tracking)
# Daily read: open this when working on any Group 2 pattern (3 min)

---

## PREREQUISITE CHAIN
```
Array / Map (Group 1)
    │
    ├──► Stack → Monotonic Stack (next greater, largest rectangle)
    │
    └──► Queue → BFS → Multi-source BFS
                  │
                  └──► Heap (priority-ordered BFS = Dijkstra → see Group 4)
```

---

## ── STACK ───────────────────────────────────────────────────────────────────
# Real world: a stack of plates — always add/remove from the top only.

```javascript
const stack = [];
stack.push(x);                   // add to top — O(1)
stack.pop();                     // remove from top — O(1)
stack[stack.length - 1];         // peek at top — O(1)
stack.length === 0;              // isEmpty

// Safe peek
if (stack.length > 0) stack[stack.length - 1];
```

⚠️ Watch out: JavaScript arrays are fine as stacks (push/pop are O(1)). Never use `shift()` / `unshift()` for stack operations — those are O(n).

---

## ── MONOTONIC STACK ─────────────────────────────────────────────────────────
# Real world: a bouncer line — shorter people get pushed out when a taller person arrives.
# Use when: next greater/smaller element, largest rectangle, trapping rain water.

```javascript
// Next Greater Element (monotonic decreasing stack — stores indices)
const result = new Array(n).fill(-1);
const stack = [];   // stores INDICES

for (let i = 0; i < n; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
        result[stack.pop()] = arr[i];    // i is the next greater for the popped index
    }
    stack.push(i);
}

// Next Smaller Element (monotonic increasing stack)
for (let i = 0; i < n; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
        result[stack.pop()] = arr[i];
    }
    stack.push(i);
}

// Circular array — iterate twice
for (let i = 0; i < 2 * n; i++) {
    const idx = i % n;
    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[idx]) {
        result[stack.pop()] = arr[idx];
    }
    if (i < n) stack.push(i);           // only push indices in the first pass
}
```

⚠️ Watch out: always store INDICES in the stack, not values — you need the index to fill the result array. Retrieve values as `arr[stack[stack.length - 1]]`.

---

## ── QUEUE / BFS ─────────────────────────────────────────────────────────────
# Real world: a checkout line — first person in is first person served.
# BFS explores nodes level by level — guarantees shortest path in unweighted graphs.
#
# ⚠️ IMPORTANT: Array.shift() is O(n). For performance-critical BFS, use a pointer-based queue
# or the Queue class from dsa-helpers. For typical interview problems, Array.shift() is fine.

```javascript
// Standard BFS on graph
const queue = [start];
const visited = new Set([start]);

while (queue.length > 0) {
    const node = queue.shift();          // O(n) — acceptable for interviews; use pointer for perf
    for (const neighbor of graph.get(node) ?? []) {
        if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
        }
    }
}

// Level-order BFS — capture one full level at a time
while (queue.length > 0) {
    const size = queue.length;           // ← snapshot BEFORE inner loop
    for (let i = 0; i < size; i++) {
        const node = queue.shift();
        // process node
        for (const neighbor of graph.get(node) ?? []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    level++;                             // one full level done
}

// BFS on grid (4-directional)
const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
const queue = [[startR, startC]];
const visited = Array.from({ length: m }, () => new Array(n).fill(false));
visited[startR][startC] = true;

while (queue.length > 0) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (visited[nr][nc]) continue;
        visited[nr][nc] = true;
        queue.push([nr, nc]);
    }
}
```

⚠️ Watch out: `const size = queue.length` MUST be captured before the inner `for` loop. The queue grows as you enqueue children — using `queue.length` directly in the loop condition corrupts the level boundary.

---

## ── MULTI-SOURCE BFS ────────────────────────────────────────────────────────
# Real world: multiple fires spreading simultaneously — all start at distance 0.
# Use when: distance from multiple sources (Walls & Gates, Rotting Oranges).

```javascript
const queue = [];

// Seed ALL sources first before starting BFS
for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
        if (grid[r][c] === SOURCE) {
            queue.push([r, c]);
            visited[r][c] = true;
        }
    }
}

// Then standard BFS — all sources expand simultaneously
while (queue.length > 0) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (/* out of bounds or invalid */) continue;
        // process and enqueue
    }
}
```

⚠️ Watch out: seed ALL sources BEFORE starting the BFS loop. If you BFS from one source then add the next, distances will be wrong.

---

## ── HEAP / PRIORITY QUEUE ───────────────────────────────────────────────────
# Real world: a hospital emergency room — most critical patient always seen next.
# JavaScript has no built-in heap — use MinHeap / MaxHeap / PriorityQueue from dsa-helpers.js

```javascript
const { MinHeap, MaxHeap, PriorityQueue } = require('../../dsa-helpers');

// Min-heap (smallest value out first)
const minHeap = new MinHeap();
minHeap.enqueue(10); minHeap.enqueue(3); minHeap.enqueue(7);
minHeap.dequeue();  // → 3
minHeap.peek();     // → next min without removing

// Max-heap (largest value out first)
const maxHeap = new MaxHeap();
maxHeap.dequeue();  // → largest

// Custom PriorityQueue — provide comparator (a, b) => a - b for min
const pq = new PriorityQueue((a, b) => a.dist - b.dist);
pq.enqueue({ node: 'A', dist: 10 });
pq.enqueue({ node: 'B', dist: 2 });
pq.dequeue();  // → { node: 'B', dist: 2 }

// K largest elements — min-heap of size K (evict smallest, keep K largest)
const heap = new MinHeap();
for (const num of nums) {
    heap.enqueue(num);
    if (heap.size > k) heap.dequeue();   // remove smallest → keeps K largest
}
// heap.peek() = Kth largest

// K smallest — max-heap of size K (evict largest, keep K smallest)
const heap = new MaxHeap();
for (const num of nums) {
    heap.enqueue(num);
    if (heap.size > k) heap.dequeue();
}

// Two-heap pattern (find median of data stream)
const lowerHalf = new MaxHeap();   // left half — max at top
const upperHalf = new MinHeap();   // right half — min at top
// invariant: lowerHalf.size === upperHalf.size OR lowerHalf.size === upperHalf.size + 1
```

⚠️ Watch out: never use a plain sorted array as a heap substitute — insertions are O(n). The heap helpers in dsa-helpers.js give O(log n) insert and dequeue.

---

## Your Recurring Mistakes — Group 2
- **Stack peek**: using `stack[0]` (front) instead of `stack[stack.length - 1]` (top)
- **Monotonic stack**: storing values instead of indices — can't fill result array correctly
- **Level-order BFS**: using `queue.length` in loop condition instead of snapshotting `size` first
- **Multi-source BFS**: seeding sources one at a time inside the loop instead of all upfront
- **Heap**: using a sorted array push/sort workaround instead of the proper heap helpers
