# Group 8 — Advanced Structures
# Patterns: Trie · Heap Design from scratch
# Prerequisite: Group 1 (Map), Group 2 (Heap/Queue), Group 3 (Tree DFS)
# Daily read: open this when working on Trie or design problems (3 min)

---

## PREREQUISITE CHAIN
```
Tree DFS (Group 3) + Map (Group 1)
    │
    └──► Trie (prefix tree — 26-branch tree of characters)
              │
              └──► Trie + DFS backtracking (Word Search II)

Heap concept (Group 2)
    │
    └──► Heap Design from scratch (sift-up / sift-down)
```

---

## ── TRIE ────────────────────────────────────────────────────────────────────
# Real world: phone autocomplete — each character is a branch, words end with a flag.

```javascript
class TrieNode {
    constructor() {
        this.children = {};     // or new Array(26).fill(null) for lowercase only
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const c of word) {
            if (!node.children[c]) node.children[c] = new TrieNode();
            node = node.children[c];
        }
        node.isEnd = true;      // mark end of word — don't forget this!
    }

    search(word) {
        let node = this.root;
        for (const c of word) {
            if (!node.children[c]) return false;
            node = node.children[c];
        }
        return node.isEnd;      // must reach a word-end node
    }

    startsWith(prefix) {
        let node = this.root;
        for (const c of prefix) {
            if (!node.children[c]) return false;
            node = node.children[c];
        }
        return true;            // only needs to exist — no isEnd check
    }
}
```

⚠️ Watch out: `search` checks `node.isEnd`. `startsWith` does NOT. Mixing these is the most common Trie bug under interview pressure.

---

## ── TRIE WITH WILDCARD (DFS) ────────────────────────────────────────────────
# Use when: search with '.' wildcard that matches any single character.

```javascript
searchWithWildcard(word) {
    return this._dfs(word, 0, this.root);
}

_dfs(word, idx, node) {
    if (idx === word.length) return node.isEnd;
    const c = word[idx];
    if (c === '.') {
        for (const child of Object.values(node.children)) {
            if (child && this._dfs(word, idx + 1, child)) return true;
        }
        return false;
    } else {
        if (!node.children[c]) return false;
        return this._dfs(word, idx + 1, node.children[c]);
    }
}
```

⚠️ Watch out: when `c === '.'`, iterate ALL children and return true if ANY matches. Don't return false early — you need to try every branch.

---

## ── HEAP DESIGN (from scratch — 1-indexed array) ───────────────────────────
# Real world: a self-organizing pile — the smallest always floats to the top.

```javascript
class MinHeap {
    constructor() {
        this.heap = [null];   // 1-indexed: ignore index 0
        this.size = 0;
    }

    insert(val) {
        this.heap.push(val);
        this.size++;
        this._siftUp(this.size);
    }

    poll() {
        const min = this.heap[1];
        this.heap[1] = this.heap[this.size];
        this.heap.pop();
        this.size--;
        this._siftDown(1);
        return min;
    }

    peek() { return this.heap[1]; }

    // Build heap from array — O(n) using sift-down from last parent
    buildHeap(arr) {
        this.heap = [null, ...arr];
        this.size = arr.length;
        for (let i = Math.floor(this.size / 2); i >= 1; i--) {
            this._siftDown(i);                     // start from LAST PARENT, not last element
        }
    }

    _siftUp(i) {
        while (i > 1 && this.heap[i] < this.heap[Math.floor(i / 2)]) {
            [this.heap[i], this.heap[Math.floor(i / 2)]] = [this.heap[Math.floor(i / 2)], this.heap[i]];
            i = Math.floor(i / 2);
        }
    }

    _siftDown(i) {
        while (2 * i <= this.size) {
            let child = 2 * i;                     // left child
            if (child < this.size && this.heap[child + 1] < this.heap[child]) child++;  // pick smaller child
            if (this.heap[i] <= this.heap[child]) break;
            [this.heap[i], this.heap[child]] = [this.heap[child], this.heap[i]];
            i = child;
        }
    }
}
```

⚠️ Watch out: `buildHeap` starts sift-down from `Math.floor(size / 2)` (last parent with children), NOT from the last element. Sifting up from every element is O(n log n). Sifting down from every parent is O(n).

---

## Your Recurring Mistakes — Group 8
- **Trie search vs startsWith**: adding `isEnd` check in `startsWith` (should NOT be there)
- **Wildcard search**: returning false after first non-matching child instead of trying all children when `c === '.'`
- **Heap buildHeap**: starting sift-down from last element instead of `Math.floor(size / 2)`
- **Trie insert**: forgetting `node.isEnd = true` at the end — the word is silently never found
