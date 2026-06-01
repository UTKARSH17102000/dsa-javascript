const { ListNode, TreeNode, GraphNode } = require("../dsa-helpers");

/**
 * Problem Name: Unique Paths (DP State Grid)
 *
 * Description:
 * A robot starts at the top-left of an m×n grid and can only move right or down.
 * Count the number of unique paths to reach the bottom-right corner.
 * This solution returns the full DP grid; dp[m-1][n-1] is the answer.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(m * n)
 * Space: O(m * n)  — storing the full DP table (reducible to O(n) with a single-row rollover)
 *
 * ─── Approaches ──────────────────────────────────────────
 * Brute Force:     O(2^(m+n)) time, O(m+n) space  — pure recursion, exponential branching
 * Memoization:     O(m*n)     time, O(m*n) space  — top-down DP, same result as bottom-up
 * Bottom-up DP:    O(m*n)     time, O(m*n) space  — fill grid left-to-right, top-to-bottom
 * Space-optimized: O(m*n)     time, O(n)   space  — keep only one row, rolling update
 * Math (nCr):      O(min(m,n)) time, O(1) space   — C(m+n−2, m−1) combinatorics formula
 *
 * ─── Key Interview Points ────────────────────────────────
 * • Base case: entire first row and first column are 1 (only one direction available)
 * • Recurrence: dp[r][c] = dp[r-1][c] + dp[r][c-1]
 * • Space can be optimized to O(n) by updating a single row in place — mention this proactively
 * • The math formula C(m+n-2, m-1) is O(1) space but interviewers usually want the DP approach
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Unique Paths II (LeetCode 63) — add obstacle cells; set dp to 0 where obstacle exists
 * • Minimum Path Sum (LeetCode 64) — same grid traversal but minimize sum instead of count
 * • Dungeon Game (LeetCode 174) — reverse DP from bottom-right with health constraint
 * • Count paths in a DAG — generalizes to any directed acyclic graph with topological order DP
 */
function uniquePaths(m, n) {
  // Create an m x n grid initialized with 1s
  const dp = Array(m).fill(0).map(() => Array(n).fill(1));

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      // The paths to dp[r][c] is the sum of paths from top cell and left cell
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }

  return dp;
}

// Test cases list
// input: [m, n]
// expected: The complete formatted 2D DP table showing path counts at each cell.
const tests = [
  {
    input: [3, 7],
    expected: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 2, 3, 4, 5, 6, 7],
      [1, 3, 6, 10, 15, 21, 28]
    ]
  },
  {
    input: [3, 2],
    expected: [
      [1, 1],
      [1, 2],
      [1, 3]
    ]
  }
];

module.exports = {
  solution: uniquePaths,
  tests
};
