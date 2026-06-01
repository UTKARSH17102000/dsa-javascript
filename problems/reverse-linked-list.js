const { ListNode } = require("../dsa-helpers");

/**
 * Problem Name: Reverse Linked List
 *
 * Description:
 * Given the head of a singly linked list, reverse the list in-place and return the new head.
 *
 * ─── Complexity ──────────────────────────────────────────
 * Time:  O(n)
 * Space: O(1)  — iterative in-place (recursive uses O(n) call stack)
 *
 * ─── Approaches ──────────────────────────────────────────
 * Iterative: O(n) time, O(1) space — three-pointer (prev/curr/next) sliding window
 * Recursive: O(n) time, O(n) space — elegant but uses call stack; reverse sub-list on the way back
 *
 * ─── Key Interview Points ────────────────────────────────
 * • Always save next = curr.next BEFORE overwriting curr.next — forgetting this loses the rest of the list
 * • After the loop, prev (not curr) is the new head — curr will be null at termination
 * • Recursive version: base case is null or single node; wire curr.next.next = curr then curr.next = null
 * • Clarify whether the list can be empty or have a single node — both are valid edge cases
 *
 * ─── Follow-ups ──────────────────────────────────────────
 * • Reverse Linked List II (LeetCode 92) — reverse only between positions left and right
 * • Palindrome Linked List (LeetCode 234) — reverse second half and compare with first
 * • Reorder List (LeetCode 143) — find mid, reverse second half, then interleave
 * • Reverse Nodes in k-Group (LeetCode 25) — reverse every k nodes iteratively
 */
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}

// Test cases list
// Note: We use ListNode.arrayToList to create lists for inputs and expected results!
const tests = [
  {
    input: ListNode.arrayToList([1, 2, 3, 4, 5]),
    expected: ListNode.arrayToList([5, 4, 3, 2, 1])
  },
  {
    input: ListNode.arrayToList([1, 2]),
    expected: ListNode.arrayToList([2, 1])
  },
  {
    input: ListNode.arrayToList([]),
    expected: null
  }
];

module.exports = {
  solution: reverseList,
  tests
};
