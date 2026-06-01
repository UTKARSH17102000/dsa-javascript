# Group 3 — Trees
# Patterns: Tree DFS · Post-order Global · DFS Sentinel · Tree BFS · BST · Construct Trees · LCA
# Prerequisite: Group 2 (Stack for iterative DFS, Queue for BFS)
# Daily read: open this when working on any tree pattern (3 min)

---

## PREREQUISITE CHAIN
```
DFS recursive (Group 1 concept)
    │
    ├──► Tree DFS (pre/in/post order)
    │       │
    │       ├──► Post-order with global max (diameter, max path sum)
    │       ├──► DFS with bounds (validate BST)
    │       └──► DFS with return value (balanced tree, LCA)
    │
    └──► Tree BFS (level order) ← uses Queue from Group 2
```

---

## ── TREE DFS — RECURSIVE ────────────────────────────────────────────────────
# Real world: exploring a family tree — go as deep as possible before backtracking.

```javascript
// Pre-order: root → left → right (good for copying/serializing)
function preorder(node) {
    if (!node) return;
    process(node);
    preorder(node.left);
    preorder(node.right);
}

// In-order: left → root → right (gives sorted order for BST)
function inorder(node) {
    if (!node) return;
    inorder(node.left);
    process(node);
    inorder(node.right);
}

// Post-order: left → right → root (good for bottom-up info — height, size)
function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    process(node);
}

// DFS returning a value (height pattern)
function height(node) {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    return 1 + Math.max(left, right);
}
```

⚠️ Watch out: always check `if (!node) return` as the FIRST line. Don't check `node.left === null` before recursing — let the recursive call handle null itself.

---

## ── POST-ORDER WITH GLOBAL VARIABLE ────────────────────────────────────────
# Use when: the answer combines info from both subtrees (diameter, max path sum).
# Trick: return something useful to the parent; track the global answer separately.

```javascript
// Diameter of Binary Tree
let maxDiameter = 0;

function depth(node) {
    if (!node) return 0;
    const left = depth(node.left);
    const right = depth(node.right);
    maxDiameter = Math.max(maxDiameter, left + right);  // path through this node
    return 1 + Math.max(left, right);                   // return height to parent
}

// Binary Tree Maximum Path Sum
let maxSum = -Infinity;

function maxGain(node) {
    if (!node) return 0;
    const left = Math.max(0, maxGain(node.left));       // discard negative branches
    const right = Math.max(0, maxGain(node.right));
    maxSum = Math.max(maxSum, node.val + left + right); // path through this node
    return node.val + Math.max(left, right);            // return best single-arm to parent
}
```

⚠️ Watch out: the global variable tracks the answer; the return value serves the parent. These are two different things — confusing them is the #1 mistake on path-sum problems.

---

## ── DFS WITH SENTINEL (-1 pattern) ─────────────────────────────────────────
# Use when: an invalid subtree should short-circuit the entire recursion up the call stack.

```javascript
// Balanced Binary Tree
function checkHeight(node) {
    if (!node) return 0;
    const left = checkHeight(node.left);
    if (left === -1) return -1;                         // short-circuit immediately
    const right = checkHeight(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;         // this node is unbalanced
    return 1 + Math.max(left, right);
}
// call: checkHeight(root) !== -1
```

⚠️ Watch out: check for -1 IMMEDIATELY after each recursive call. Never let it propagate through more arithmetic.

---

## ── BST PATTERNS ────────────────────────────────────────────────────────────
# Real world: a phonebook sorted by name — left subtree is smaller, right is larger at every node.

```javascript
// Validate BST — pass bounds down; don't just compare with parent
function isValid(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return isValid(node.left, min, node.val) &&
           isValid(node.right, node.val, max);
}
// call: isValid(root, -Infinity, Infinity)
// Use -Infinity/Infinity — node values can be Number.MIN/MAX_SAFE_INTEGER

// Iterative in-order (Kth smallest — avoid full traversal)
function kthSmallest(root, k) {
    const stack = [];
    let curr = root;
    while (curr || stack.length > 0) {
        while (curr) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        if (--k === 0) return curr.val;
        curr = curr.right;
    }
}

// BST search
function search(root, val) {
    if (!root || root.val === val) return root;
    return val < root.val ? search(root.left, val) : search(root.right, val);
}
```

⚠️ Watch out: validate BST using `-Infinity / Infinity` as initial bounds, not `Number.MIN/MAX_SAFE_INTEGER`. A node with value `Number.MIN_SAFE_INTEGER` would fail the check incorrectly with integer bounds.

---

## ── TREE BFS — LEVEL ORDER ──────────────────────────────────────────────────
# Real world: reading a pyramid row by row from top to bottom.

```javascript
function levelOrder(root) {
    if (!root) return [];
    const queue = [root];
    const result = [];

    while (queue.length > 0) {
        const size = queue.length;               // snapshot before inner loop!
        const level = [];
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
}

// Right side view — take the last element of each level:
// level[level.length - 1]
```

---

## ── CONSTRUCT TREE FROM TRAVERSALS ─────────────────────────────────────────
# Key insight: pre-order first element = root. In-order root position splits left/right subtrees.

```javascript
function buildTree(preorder, inorder) {
    const inorderIndex = new Map();
    inorder.forEach((val, idx) => inorderIndex.set(val, idx));

    function build(preStart, preEnd, inStart, inEnd) {
        if (preStart > preEnd) return null;
        const rootVal = preorder[preStart];
        const root = new TreeNode(rootVal);
        const mid = inorderIndex.get(rootVal);
        const leftSize = mid - inStart;
        root.left = build(preStart + 1, preStart + leftSize, inStart, mid - 1);
        root.right = build(preStart + leftSize + 1, preEnd, mid + 1, inEnd);
        return root;
    }
    return build(0, preorder.length - 1, 0, inorder.length - 1);
}
```

⚠️ Watch out: `leftSize = mid - inStart` (distance from left boundary to root in inorder). Use this to correctly partition the preorder range.

---

## ── LCA — LOWEST COMMON ANCESTOR ───────────────────────────────────────────
# Real world: closest common ancestor of two people in a family tree.

```javascript
function lca(root, p, q) {
    if (!root || root === p || root === q) return root;
    const left = lca(root.left, p, q);
    const right = lca(root.right, p, q);
    if (left && right) return root;   // p and q are on different sides → root is LCA
    return left ?? right;             // both on same side → return the non-null one
}
```

⚠️ Watch out: if both `left` and `right` are non-null, the current node IS the LCA. This is the split point — don't recurse further.

---

## Your Recurring Mistakes — Group 3
- **Global variable**: putting the answer in the return value instead of a separate outer variable
- **BST validation**: using `Number.MIN/MAX_SAFE_INTEGER` instead of `-Infinity/Infinity`
- **Sentinel pattern**: not checking for -1 immediately — letting it flow into `Math.max` etc.
- **Level-order**: not snapshotting `queue.length` before the inner loop
- **LCA**: not handling the case where both `left` and `right` are non-null
