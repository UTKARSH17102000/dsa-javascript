const { ListNode, TreeNode, GraphNode } = require("../dsa-helpers");

/**
 * Problem Name: Clone Graph
 *
 * Description:
 * Given a reference to a node in a connected undirected graph, return a deep copy of the
 * entire graph. Each node holds an integer value and a list of its neighbors.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(V + E)  — every node and edge visited once
 * Space: O(V)      — HashMap for visited clones + recursion/queue overhead
 *
 * ─── Approaches ──────────────────────────────────────────
 * DFS (recursive): O(V+E) time, O(V) space — natural for graph traversal; concise code
 * BFS (iterative): O(V+E) time, O(V) space — same complexity; avoids stack overflow on deep graphs
 *
 * ─── Key Interview Points ────────────────────────────────
 * • The HashMap (node.val → cloned node) is essential — without it cycles cause infinite recursion
 * • Create the clone and insert it into the map BEFORE recursing into neighbors (breaks cycles)
 * • BFS is preferred for very wide/deep graphs in production to avoid stack overflow
 * • Null input is a valid edge case — return null immediately
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Copy List with Random Pointer (LeetCode 138) — same HashMap clone pattern on a linked list
 * • Serialize and Deserialize Binary Tree (LeetCode 297) — related graph/tree reconstruction
 * • Number of Connected Components — graph traversal without needing a clone
 */
function cloneGraph(node) {
  if (!node) return null;

  const map = new Map();

  function dfs(curr) {
    if (map.has(curr.val)) {
      return map.get(curr.val);
    }

    const copy = new GraphNode(curr.val);
    map.set(curr.val, copy);

    for (const neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }

    return copy;
  }

  return dfs(node);
}

// Test cases list
// Note: We use GraphNode.adjListToGraph to easily construct connected graph nodes from adjacency lists!
const tests = [
  {
    input: GraphNode.adjListToGraph([[2, 4], [1, 3], [2, 4], [1, 3]]),
    expected: GraphNode.adjListToGraph([[2, 4], [1, 3], [2, 4], [1, 3]])
  },
  {
    input: GraphNode.adjListToGraph([[]]),
    expected: GraphNode.adjListToGraph([[]])
  },
  {
    input: null,
    expected: null
  }
];

module.exports = {
  solution: cloneGraph,
  tests
};
