/**
 * Problem Name: Graph DFS — Number of Islands (Recursive & Iterative)
 *
 * Description:
 * Given an m×n grid of '1's (land) and '0's (water), count the number of islands.
 * An island is a group of horizontally/vertically connected land cells surrounded by water.
 * Demonstrates both recursive DFS and iterative DFS (explicit stack) approaches.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(m * n)  — every cell is visited at most once
 * Space: O(m * n)  — visited matrix + recursion stack / explicit stack
 *
 * ─── Approaches ──────────────────────────────────────────
 * DFS recursive:  O(m*n) time, O(m*n) space — clean code; risk of stack overflow on huge grids
 * DFS iterative:  O(m*n) time, O(m*n) space — explicit stack avoids call-stack overflow
 * BFS:            O(m*n) time, O(min(m,n)) space — queue; better space in practice for wide islands
 * Union-Find:     O(m*n·α) time, O(m*n) space — best for dynamic connectivity or streaming input
 *
 * ─── Key Interview Points ────────────────────────────────
 * • Mark cells visited (or mutate '1'→'0') before pushing to stack/recursing to avoid double-counting
 * • Diagonal neighbors do NOT count — only 4 directions (up/down/left/right)
 * • Mutating the input grid saves O(m*n) extra space; ask the interviewer if it's allowed
 * • Iterative DFS is preferred over recursive when the grid can be very large (stack overflow risk)
 * • Union-Find shines when edges arrive one at a time (streaming) or for follow-up connectivity queries
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Max Area of Island (LeetCode 695) — track island size during DFS, return maximum
 * • Surrounded Regions (LeetCode 130) — flood-fill from border to find non-capturable regions
 * • Pacific Atlantic Water Flow (LeetCode 417) — two BFS/DFS passes from opposite borders
 * • Number of Connected Components in Undirected Graph (LeetCode 323) — same pattern on adjacency list
 */

// ── Approach 1: Recursive DFS ────────────────────────────────────────────────
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || visited[r][c] || grid[r][c] === "0") return;
    visited[r][c] = true;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!visited[r][c] && grid[r][c] === "1") {
        dfs(r, c);
        count++;
      }
    }
  }

  return count;
}

// ── Approach 2: Iterative DFS (explicit stack) ────────────────────────────────
function numIslandsIterative(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!visited[r][c] && grid[r][c] === "1") {
        const stack = [[r, c]];
        visited[r][c] = true;
        while (stack.length) {
          const [cr, cc] = stack.pop();
          for (const [dr, dc] of dirs) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === "1") {
              visited[nr][nc] = true;
              stack.push([nr, nc]);
            }
          }
        }
        count++;
      }
    }
  }

  return count;
}

const tests = [
  {
    // Single large island
    input: [["1","1","1","1","0"],
            ["1","1","0","1","0"],
            ["1","1","0","0","0"],
            ["0","0","0","0","0"]],
    expected: 1
  },
  {
    // Three separate islands
    input: [["1","1","0","0","0"],
            ["1","1","0","0","0"],
            ["0","0","1","0","0"],
            ["0","0","0","1","1"]],
    expected: 3
  },
  {
    // Single cell island
    input: [["1"]],
    expected: 1
  },
  {
    // All water
    input: [["0","0"],["0","0"]],
    expected: 0
  },
  {
    // Each cell is its own island (checkerboard)
    input: [["1","0","1"],
            ["0","1","0"],
            ["1","0","1"]],
    expected: 5
  }
];

module.exports = { solution: numIslands, tests };
