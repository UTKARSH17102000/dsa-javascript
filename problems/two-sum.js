/**
 * Problem Name: Two Sum
 *
 * Description:
 * Given an array of integers nums and an integer target, return indices of the two numbers
 * such that they add up to target. Each input has exactly one solution; the same element
 * may not be used twice.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(n)
 * Space: O(n)
 *
 * ─── Approaches ──────────────────────────────────────────
 * Brute Force:  O(n²) time, O(1) space  — nested loop checking every pair
 * Optimal:      O(n)  time, O(n) space  — HashMap stores value→index for O(1) complement lookup
 *
 * ─── Key Interview Points ────────────────────────────────
 * • Check the map for complement BEFORE inserting current element — handles duplicate values like [3,3] correctly
 * • Two-pointer on a sorted array is O(n) time O(1) space, but loses original indices (suits Two Sum II, not this)
 * • Problem guarantees exactly one solution, so no need to handle "not found" unless asked
 * • Always clarify: can the array contain negatives? duplicates? (both are fine here)
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Two Sum II (LeetCode 167) — array is sorted → two pointers, O(1) space
 * • Three Sum (LeetCode 15) — sort + fix one element + two-pointer inner loop, O(n²)
 * • Four Sum (LeetCode 18) — two nested loops + two-pointer, O(n³)
 * • Two Sum — return all pairs instead of indices → collect all matches, don't early-return
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test cases list
const tests = [
  {
    input: [[2, 7, 11, 15], 9],
    expected: [0, 1]
  },
  {
    input: [[3, 2, 4], 6],
    expected: [1, 2]
  },
  {
    input: [[3, 3], 6],
    expected: [0, 1]
  }
];

module.exports = {
  solution: twoSum,
  tests
};
