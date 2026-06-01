/**
 * DSA Helpers for Local JavaScript Environment
 * Provides ListNode, TreeNode, GraphNode, Matrix Grid, PriorityQueue, MinHeap, MaxHeap, Deep Equality, and Terminal Color Utilities.
 */

// Terminal ANSI Styles
const styles = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
  
  // Text Colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  
  // Background Colors
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m"
};

/**
 * Linked List Node (LeetCode Style)
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }

  /**
   * Converts a standard JavaScript array to a Linked List.
   */
  static arrayToList(arr) {
    if (!arr || arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
      curr.next = new ListNode(arr[i]);
      curr = curr.next;
    }
    return head;
  }

  /**
   * Converts a Linked List back to a standard JavaScript array.
   */
  static listToArray(head) {
    const arr = [];
    let curr = head;
    while (curr) {
      arr.push(curr.val);
      curr = curr.next;
    }
    return arr;
  }

  /**
   * Pretty prints a Linked List structure with cycle detection.
   */
  static listToString(head) {
    if (!head) return "null";
    const parts = [];
    let curr = head;
    const seen = new Set();
    while (curr) {
      if (seen.has(curr)) {
        parts.push(`[Cycle back to node val: ${curr.val}]`);
        break;
      }
      seen.add(curr);
      parts.push(`\x1b[33m${curr.val}\x1b[0m`);
      curr = curr.next;
    }
    if (!seen.has(curr)) {
      parts.push("\x1b[90mnull\x1b[0m");
    }
    return parts.join(" ➔ ");
  }
}

/**
 * Binary Tree Node (LeetCode Style)
 */
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }

  /**
   * Deserializes a standard LeetCode level-order array into a Binary Tree.
   */
  static arrayToTree(arr) {
    if (!arr || arr.length === 0 || arr[0] === null || arr[0] === undefined) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
      const curr = queue.shift();
      if (curr === null) continue;

      // Left Child
      if (i < arr.length) {
        const leftVal = arr[i++];
        if (leftVal !== null && leftVal !== undefined) {
          curr.left = new TreeNode(leftVal);
          queue.push(curr.left);
        } else {
          curr.left = null;
        }
      }

      // Right Child
      if (i < arr.length) {
        const rightVal = arr[i++];
        if (rightVal !== null && rightVal !== undefined) {
          curr.right = new TreeNode(rightVal);
          queue.push(curr.right);
        } else {
          curr.right = null;
        }
      }
    }
    return root;
  }

  /**
   * Serializes a Binary Tree back into a standard LeetCode level-order array.
   */
  static treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
      const curr = queue.shift();
      if (curr) {
        result.push(curr.val);
        queue.push(curr.left);
        queue.push(curr.right);
      } else {
        result.push(null);
      }
    }
    // Trim trailing nulls to match standard LeetCode output
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }
    return result;
  }

  /**
   * Helper to print a Binary Tree in an elegant hierarchical ASCII structure.
   */
  static treeToString(node, prefix = "", isLeft = true) {
    if (!node) return "";
    let out = "";
    
    const nodeVal = `\x1b[36m${node.val}\x1b[0m`;
    out += prefix + (isLeft ? "├── " : "└── ") + nodeVal + "\n";
    
    const newPrefix = prefix + (isLeft ? "│   " : "    ");
    if (node.left || node.right) {
      if (node.left) {
        out += TreeNode.treeToString(node.left, newPrefix, true);
      } else {
        out += newPrefix + "├── \x1b[90mnull\x1b[0m\n";
      }
      
      if (node.right) {
        out += TreeNode.treeToString(node.right, newPrefix, false);
      } else {
        out += newPrefix + "└── \x1b[90mnull\x1b[0m\n";
      }
    }
    return out;
  }
}

/**
 * Graph Node (LeetCode Style)
 */
class GraphNode {
  constructor(val, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }

  /**
   * Converts a standard LeetCode 1-indexed adjacency list to a Graph.
   */
  static adjListToGraph(adjList) {
    if (!adjList || adjList.length === 0) return null;
    const map = new Map();
    
    for (let i = 1; i <= adjList.length; i++) {
      map.set(i, new GraphNode(i));
    }
    
    for (let i = 1; i <= adjList.length; i++) {
      const node = map.get(i);
      const neighborVals = adjList[i - 1];
      if (neighborVals) {
        for (const nVal of neighborVals) {
          const neighborNode = map.get(nVal);
          if (neighborNode) {
            node.neighbors.push(neighborNode);
          }
        }
      }
    }
    
    return map.get(1);
  }

  /**
   * Converts a connected Graph back into a standard LeetCode 1-indexed adjacency list.
   */
  static graphToAdjList(startNode) {
    if (!startNode) return [];
    
    const map = new Map();
    const queue = [startNode];
    const visited = new Set([startNode]);
    
    while (queue.length > 0) {
      const curr = queue.shift();
      map.set(curr.val, curr.neighbors.map(n => n.val).sort((a, b) => a - b));
      
      for (const neighbor of curr.neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    const maxVal = Math.max(...map.keys());
    const result = [];
    for (let i = 1; i <= maxVal; i++) {
      result.push(map.get(i) || []);
    }
    return result;
  }

  /**
   * Stunning visual listing of graph nodes and their neighbors.
   */
  static graphToString(startNode) {
    if (!startNode) return "  Empty Graph";
    
    const queue = [startNode];
    const visited = new Set([startNode]);
    const lines = [];
    
    while (queue.length > 0) {
      const curr = queue.shift();
      const neighborVals = curr.neighbors.map(n => `\x1b[33m${n.val}\x1b[0m`).join(", ");
      lines.push(`  Node \x1b[36m${curr.val}\x1b[0m ➔ [ ${neighborVals || "no neighbors"} ]`);
      
      for (const neighbor of curr.neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    lines.sort((a, b) => {
      const aNum = parseInt(a.match(/Node \x1b\[36m(\d+)/)[1]);
      const bNum = parseInt(b.match(/Node \x1b\[36m(\d+)/)[1]);
      return aNum - bNum;
    });
    
    return lines.join("\n");
  }
}

/**
 * Custom general PriorityQueue structure using a binary heap.
 */
class PriorityQueue {
  constructor(compare = (a, b) => a - b) {
    this.heap = [];
    this.compare = compare;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0];
  }

  enqueue(val) {
    this.heap.push(val);
    this._heapifyUp();
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this._heapifyDown();
    }
    return root;
  }

  _heapifyUp() {
    let idx = this.heap.length - 1;
    while (idx > 0) {
      const pIdx = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[pIdx]) >= 0) break;
      this._swap(idx, pIdx);
      idx = pIdx;
    }
  }

  _heapifyDown() {
    let idx = 0;
    const len = this.heap.length;
    while (2 * idx + 1 < len) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let target = left;

      if (right < len && this.compare(this.heap[right], this.heap[left]) < 0) {
        target = right;
      }

      if (this.compare(this.heap[idx], this.heap[target]) <= 0) break;
      this._swap(idx, target);
      idx = target;
    }
  }

  _swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

class MinHeap extends PriorityQueue {
  constructor() {
    super((a, b) => a - b);
  }
}

class MaxHeap extends PriorityQueue {
  constructor() {
    super((a, b) => b - a);
  }
}

/**
 * Beautiful 2D grid alignment for DP tables and Graph mazes.
 */
function formatMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
    return "";
  }
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  const colWidths = Array(cols).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellStr = String(matrix[r][c] !== undefined && matrix[r][c] !== null ? matrix[r][c] : "-");
      colWidths[c] = Math.max(colWidths[c], cellStr.length);
    }
  }
  
  const topBorder = "  ┌" + colWidths.map(w => "─".repeat(w + 2)).join("┬") + "┐";
  const middleBorder = "  ├" + colWidths.map(w => "─".repeat(w + 2)).join("┼") + "┤";
  const bottomBorder = "  └" + colWidths.map(w => "─".repeat(w + 2)).join("┴") + "┘";
  
  const formattedRows = [];
  for (let r = 0; r < rows; r++) {
    const rowCells = [];
    for (let c = 0; c < cols; c++) {
      const cellVal = matrix[r][c];
      const cellStr = String(cellVal !== undefined && cellVal !== null ? cellVal : "-");
      
      let styledCell = cellStr;
      if (cellVal === 1 || cellVal === "1" || cellVal === "★" || cellVal === true) {
        styledCell = `\x1b[32m${cellStr}\x1b[0m`;
      } else if (cellVal === 0 || cellVal === "0" || cellVal === "#" || cellVal === false) {
        styledCell = `\x1b[90m${cellStr}\x1b[0m`;
      } else if (typeof cellVal === "number") {
        styledCell = `\x1b[33m${cellStr}\x1b[0m`;
      }
      
      const padding = " ".repeat(colWidths[c] - cellStr.length);
      rowCells.push(` ${styledCell}${padding} `);
    }
    formattedRows.push("  │" + rowCells.join("│") + "│");
  }
  
  return [
    topBorder,
    formattedRows.join("\n" + middleBorder + "\n"),
    bottomBorder
  ].join("\n");
}

/**
 * Deep Equality Helper for testing code correctness.
 */
function deepEqual(a, b) {
  if (a === b) return true;

  if (a instanceof ListNode && b instanceof ListNode) {
    return deepEqual(ListNode.listToArray(a), ListNode.listToArray(b));
  }
  if (a instanceof TreeNode && b instanceof TreeNode) {
    return deepEqual(TreeNode.treeToArray(a), TreeNode.treeToArray(b));
  }
  if (a instanceof GraphNode && b instanceof GraphNode) {
    return deepEqual(GraphNode.graphToAdjList(a), GraphNode.graphToAdjList(b));
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

/**
 * Rich formatting of values for console output
 */
function formatValue(val) {
  if (val === null) return `${styles.gray}null${styles.reset}`;
  if (val === undefined) return `${styles.gray}undefined${styles.reset}`;
  if (typeof val === "string") return `${styles.green}"${val}"${styles.reset}`;
  if (typeof val === "number") return `${styles.yellow}${val}${styles.reset}`;
  if (typeof val === "boolean") return `${styles.magenta}${val}${styles.reset}`;

  if (val instanceof ListNode) {
    return `${styles.bright}ListNode {${styles.reset} ${ListNode.listToString(val)} ${styles.bright}}${styles.reset}`;
  }

  if (val instanceof TreeNode) {
    const structure = TreeNode.treeToString(val).trim();
    return `${styles.bright}TreeNode {\n${structure}\n}${styles.reset}`;
  }

  if (val instanceof GraphNode) {
    return `${styles.bright}GraphNode {\n${GraphNode.graphToString(val)}\n}${styles.reset}`;
  }

  if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) {
    return `${styles.bright}Matrix Grid [${val.length}x${val[0].length}]:${styles.reset}\n${formatMatrix(val)}`;
  }

  if (Array.isArray(val)) {
    const items = val.map(item => {
      if (typeof item === "string") return `"${item}"`;
      if (item instanceof ListNode) return `ListNode(${ListNode.listToArray(item).join(",")})`;
      if (item instanceof TreeNode) return `TreeNode(${TreeNode.treeToArray(item).join(",")})`;
      if (item instanceof GraphNode) return `GraphNode(1)`;
      return String(item);
    });
    return `[ ${items.join(", ")} ]`;
  }

  if (typeof val === "object") {
    try {
      return JSON.stringify(val, null, 2);
    } catch (e) {
      return String(val);
    }
  }

  return String(val);
}

module.exports = {
  styles,
  ListNode,
  TreeNode,
  GraphNode,
  PriorityQueue,
  MinHeap,
  MaxHeap,
  deepEqual,
  formatValue
};
