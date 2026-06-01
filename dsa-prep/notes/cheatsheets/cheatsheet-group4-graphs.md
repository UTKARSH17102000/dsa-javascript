# Group 4 — Graphs
# Patterns: Build Graph · DFS · BFS · Cycle Detection · Topological Sort · Bipartite · Dijkstra · Union-Find
# Prerequisite: Group 2 (Queue for BFS) · Group 3 (DFS recursive)
# Daily read: open this when working on any graph pattern (3 min)

---

## PREREQUISITE CHAIN
```
DFS recursive (Group 3)          Queue / BFS (Group 2)
        │                                │
        ▼                                ▼
  DFS on Graph              BFS on Graph (unweighted shortest path)
        │                                │
        ├──► Cycle detection             ├──► Multi-source BFS
        ├──► Connected components        └──► Bipartite (2-coloring)
        └──► Topological Sort (DFS)
                                   Topological Sort (Kahn's BFS)
                                         │
                                         └──► Cycle detection (directed)

Union-Find (standalone)
        │
        └──► Cycle detection (undirected) + MST Kruskal

BFS + Heap (Group 2 Heap)
        │
        └──► Dijkstra (weighted shortest path)
```

---

## ── BUILD ADJACENCY LIST ────────────────────────────────────────────────────

```javascript
// Undirected graph
const graph = new Map();
for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u).push(v);
    graph.get(v).push(u);   // BOTH directions for undirected
}

// Directed graph (one direction only — omit the reverse)
graph.get(u).push(v);

// Weighted graph (for Dijkstra)
const graph = new Map();  // node → [[neighbor, weight], ...]
graph.get(u).push([v, weight]);
```

⚠️ Watch out: undirected graphs need BOTH directions added. Forgetting the reverse edge is the most common graph setup bug.

---

## ── DFS ON GRAPH ────────────────────────────────────────────────────────────
# Real world: exploring a cave — go as deep as possible before backtracking.

```javascript
function dfs(node, visited, graph) {
    visited.add(node);
    for (const neighbor of graph.get(node) ?? []) {
        if (!visited.has(neighbor)) {
            dfs(neighbor, visited, graph);
        }
    }
}

// Count connected components
let components = 0;
const visited = new Set();
for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
        dfs(i, visited, graph);
        components++;
    }
}
```

⚠️ Watch out: mark visited BEFORE recursing — not after. Otherwise you revisit nodes and risk infinite recursion on cyclic graphs.

---

## ── CYCLE DETECTION ─────────────────────────────────────────────────────────
# Undirected: node visited AND not the immediate parent → cycle
# Directed: node currently on the DFS path (recStack) → cycle (back edge)

```javascript
// Undirected — DFS with parent tracking
function hasCycleUndirected(node, parent, visited, graph) {
    visited.add(node);
    for (const neighbor of graph.get(node) ?? []) {
        if (!visited.has(neighbor)) {
            if (hasCycleUndirected(neighbor, node, visited, graph)) return true;
        } else if (neighbor !== parent) return true;  // visited AND not parent = cycle
    }
    return false;
}

// Directed — DFS with recursion stack
const visited = new Set();
const recStack = new Set();

function hasCycleDirected(node) {
    visited.add(node);
    recStack.add(node);
    for (const neighbor of graph.get(node) ?? []) {
        if (!visited.has(neighbor) && hasCycleDirected(neighbor)) return true;
        if (recStack.has(neighbor)) return true;      // back edge = cycle
    }
    recStack.delete(node);                            // remove from current DFS path on backtrack
    return false;
}
```

⚠️ Watch out: directed cycle detection requires `recStack.delete(node)` on backtrack. Without it, nodes left in recStack produce false positives.

---

## ── TOPOLOGICAL SORT ────────────────────────────────────────────────────────
# Real world: course prerequisites — must take X before Y before Z.
# Only valid for Directed Acyclic Graphs (DAGs).

```javascript
// Kahn's Algorithm (BFS — preferred, detects cycles naturally)
const inDegree = new Array(n).fill(0);
const adj = new Map();

for (const [course, prereq] of prerequisites) {
    if (!adj.has(prereq)) adj.set(prereq, []);
    adj.get(prereq).push(course);    // prereq → course
    inDegree[course]++;
}

const queue = [];
for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) queue.push(i);
}

let processed = 0;
while (queue.length > 0) {
    const curr = queue.shift();
    processed++;
    for (const next of adj.get(curr) ?? []) {
        if (--inDegree[next] === 0) queue.push(next);
    }
}

// Cycle check: processed !== n → cycle exists
// Nodes in a cycle never reach inDegree 0 → never enqueued
return processed === n;
```

⚠️ Watch out: if `processed < n` after BFS, a cycle exists. This is the cycle detection mechanism — always check it.

---

## ── BIPARTITE CHECK ─────────────────────────────────────────────────────────
# Real world: split people into two teams — no two teammates dislike each other.
# 2-coloring: if every adjacent node has a different color → bipartite.

```javascript
const color = new Array(n).fill(-1);

function isBipartite(start) {
    const queue = [start];
    color[start] = 0;
    while (queue.length > 0) {
        const node = queue.shift();
        for (const neighbor of graph.get(node) ?? []) {
            if (color[neighbor] === -1) {
                color[neighbor] = 1 - color[node];    // flip color
                queue.push(neighbor);
            } else if (color[neighbor] === color[node]) {
                return false;                          // same color adjacent → not bipartite
            }
        }
    }
    return true;
}

// Run from every unvisited node (graph may be disconnected)
for (let i = 0; i < n; i++) {
    if (color[i] === -1 && !isBipartite(i)) return false;
}
return true;
```

⚠️ Watch out: run the bipartite check from EVERY uncolored node. A disconnected graph with a non-bipartite component will be missed if you only start from node 0.

---

## ── DIJKSTRA — WEIGHTED SHORTEST PATH ──────────────────────────────────────
# Real world: Google Maps — always extend the cheapest known path first.
# Requires: PriorityQueue from dsa-helpers (min-heap on cost).

```javascript
const { PriorityQueue } = require('../../dsa-helpers');

function dijkstra(graph, n, src) {
    const dist = new Array(n).fill(Infinity);
    dist[src] = 0;

    const pq = new PriorityQueue((a, b) => a[0] - b[0]);  // [cost, node]
    pq.enqueue([0, src]);

    while (pq.size > 0) {
        const [cost, node] = pq.dequeue();

        if (cost > dist[node]) continue;               // stale entry — skip

        for (const [neighbor, weight] of graph.get(node) ?? []) {
            const newCost = dist[node] + weight;
            if (newCost < dist[neighbor]) {
                dist[neighbor] = newCost;
                pq.enqueue([newCost, neighbor]);
            }
        }
    }
    return dist;
}
```

⚠️ Watch out: `if (cost > dist[node]) continue` is not optional. The priority queue holds stale entries from before a shorter path was found. Without this guard, Dijkstra is incorrect.

---

## ── UNION-FIND ──────────────────────────────────────────────────────────────
# Real world: friend groups — find which group someone belongs to, merge two groups.
# Use when: dynamic connectivity, cycle detection, MST (Kruskal).

```javascript
const parent = Array.from({ length: n }, (_, i) => i);
const rank = new Array(n).fill(0);

function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);  // path compression
    return parent[x];
}

function union(x, y) {
    const px = find(x), py = find(y);
    if (px === py) return false;                        // already connected = cycle
    if (rank[px] < rank[py]) [px, py] = [py, px];      // swap for union by rank
    parent[py] = px;
    if (rank[px] === rank[py]) rank[px]++;
    return true;
}

// union() returning false = already connected = this edge forms a cycle
// Key signal for Redundant Connection problems
```

⚠️ Watch out: path compression (`parent[x] = find(parent[x])`) is essential — without it, `find` degrades to O(n) and Union-Find loses its near-O(1) guarantee.

---

## Your Recurring Mistakes — Group 4
- **Graph setup**: forgetting both directions for undirected graphs
- **DFS**: marking visited after recursing instead of before
- **Directed cycle**: not deleting from `recStack` on backtrack — false positives
- **Topological sort**: not checking `processed === n` — missing the cycle detection step
- **Dijkstra**: omitting the stale-entry guard `if (cost > dist[node]) continue`
- **Union-Find**: skipping path compression — O(n) find defeats the purpose
