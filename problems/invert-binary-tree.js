const { TreeNode } = require("../dsa-helpers");

/**
 * Problem Name: Invert Binary Tree
 *
 * Description:
 * Given the root of a binary tree, mirror it by swapping every node's left and right
 * children recursively, then return the root.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(n)  — every node visited exactly once
 * Space: O(h)  — h is tree height; O(log n) balanced, O(n) skewed (call stack)
 *
 * ─── Approaches ──────────────────────────────────────────
 * DFS recursive:  O(n) time, O(h) space — swap children then recurse; most concise
 * BFS iterative:  O(n) time, O(n) space — level-order with queue; swap children at each level
 * DFS iterative:  O(n) time, O(h) space — explicit stack; avoids recursion limit on deep trees
 *
 * ─── Key Interview Points ────────────────────────────────
 * • Swap children BEFORE or AFTER recursing — both are correct since we touch every node anyway
 * • Null root is a valid edge case — return null immediately
 * • BFS (iterative) is useful to mention as an alternative to show breadth of knowledge
 * • The famous "Google hired someone who couldn't invert a binary tree" meme makes this a classic warmup
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Symmetric Tree (LeetCode 101) — check if a tree is a mirror of itself (compare mirrored subtrees)
 * • Flip Equivalent Binary Trees (LeetCode 951) — allow arbitrary flips; check if trees are flip-equivalent
 * • Maximum Depth of Binary Tree (LeetCode 104) — same DFS skeleton, different aggregation
 */
function invertTree(root) {
  if (!root) return null;
  
  // Swap the left and right children
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  
  return root;
}

// Test cases list
// Note: We use TreeNode.arrayToTree to easily create trees from LeetCode-style flat arrays!
const tests = [
  {
    input: TreeNode.arrayToTree([4, 2, 7, 1, 3, 6, 9]),
    expected: TreeNode.arrayToTree([4, 7, 2, 9, 6, 3, 1])
  },
  {
    input: TreeNode.arrayToTree([2, 1, 3]),
    expected: TreeNode.arrayToTree([2, 3, 1])
  },
  {
    input: TreeNode.arrayToTree([]),
    expected: null
  }
];

module.exports = {
  solution: invertTree,
  tests
};
