// ════════════════════════════════════════════════════════════════
//  PRACTICE: Number of Islands
//  Pattern:  graph / dfs  ·  LC 200
//  Run:      node temp/graphs/number-of-islands.js
// ════════════════════════════════════════════════════════════════
//
// Problem:
// Given an m×n grid of '1's (land) and '0's (water), return the
// number of islands. An island is a group of horizontally or
// vertically connected '1' cells, surrounded by water or the grid
// boundary.
//
// Example:
//   Input:  [["1","1","0"],["0","1","0"],["0","0","1"]]
//   Output: 2
//
// Constraints:
//   · m, n ≥ 1
//   · grid[i][j] is '0' or '1'
//   · grid is not modified between calls
// ────────────────────────────────────────────────────────────────

// ── Your solution ─────────────────────────────────────────────────

function numIslands(grid) {
  // ↓↓ write your solution below ↓↓



  // ↑↑ write your solution above ↑↑
}

// ── Tests ─────────────────────────────────────────────────────────
//   input:    2D array of '0'/'1' strings
//   expected: number of islands

const tests = [
  {
    input: [
      ["1","1","0","0","0"],
      ["1","1","0","0","0"],
      ["0","0","1","0","0"],
      ["0","0","0","1","1"]
    ],
    expected: 3,
    label: "three separate islands"
  },
  {
    input: [
      ["1","1","1","1","0"],
      ["1","1","0","1","0"],
      ["1","1","0","0","0"],
      ["0","0","0","0","0"]
    ],
    expected: 1,
    label: "one large connected island"
  },
  {
    input: [["1"]],
    expected: 1,
    label: "single land cell"
  },
  {
    input: [["0","0"],["0","0"]],
    expected: 0,
    label: "all water"
  },
  {
    input: [
      ["1","0","1"],
      ["0","1","0"],
      ["1","0","1"]
    ],
    expected: 5,
    label: "checkerboard — every land cell isolated"
  },
];

// ── Runner (do not modify) ────────────────────────────────────────

function _deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => _deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    return ka.every((k, i) => k === kb[i] && _deepEqual(a[k], b[k]));
  }
  return false;
}

let _passed = 0;
const _name = 'Number of Islands';
console.log(`\n  ─── ${_name} ${'─'.repeat(Math.max(0, 46 - _name.length))}\n`);

for (let _i = 0; _i < tests.length; _i++) {
  const { input, expected, label } = tests[_i];
  let _result, _ok;
  try {
    _result = numIslands(input);
    _ok = _deepEqual(_result, expected);
  } catch (_e) {
    console.log(`  ❌  Test ${_i + 1} ERROR${label ? ' — ' + label : ''}: ${_e.message}`);
    continue;
  }
  if (_ok) {
    console.log(`  ✅  Test ${_i + 1} passed${label ? ' — ' + label : ''}`);
    _passed++;
  } else {
    console.log(`  ❌  Test ${_i + 1} FAILED${label ? ' — ' + label : ''}`);
    console.log(`      expected → ${JSON.stringify(expected)}`);
    console.log(`      got      → ${JSON.stringify(_result)}`);
  }
}
console.log(`\n  ${_passed === tests.length ? '🎉' : '💥'}  ${_passed}/${tests.length} tests passed\n`);
