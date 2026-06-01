# DSA Pattern Card Template
# Location: dsa-prep/templates/dsa-pattern-card.md
# Used by: CLAUDE.md coaching flow (on solve) and srs-revision-coach/SKILL.md (on review)
# Do NOT edit the SRS Tracking block structure — the skill reads these exact field names

---

# [Problem Name] — [Difficulty]
Problem Link: [LeetCode URL]
Solved Date: [YYYY-MM-DD]
Pattern Tag: [e.g. sliding-window / two-pointer / bfs / dp-1d / monotonic-stack]

## SRS Tracking
- Stage: 1
- Review Date: [Solved Date + 1 day]
- Last Rating: —
- Review Count: 0
- Graduated: No

---

# Real World Analogy
A concrete real-world scenario that maps to this algorithm's core mechanic.

## Core Insight
One sentence — the "aha" that unlocks this problem.

## Approach
2–3 sentences in plain English. No jargon. How you think through it, not how you code it.

## Mental Model

| Decision | Why |
|---|---|
| ... | ... |
| ... | ... |

## Pseudocode
```
step 1
step 2
  nested step
step 3
```

## Complexity

### Time: O(...)

| Component | Cost | Why |
|---|---|---|
| ... | O(...) | ... |
| Total | O(...) | ... |

### Space: O(...)

| Structure | Size | Why |
|---|---|---|
| ... | O(...) | ... |

## Watch Out For
- Edge case 1 (why it's easy to miss)
- Edge case 2
- Common mistake on this specific problem

## Dry Run
Step-by-step trace on a representative test case from the session.

```
Input: ...

Step 1: ...
Step 2: ...
...
Output: ...
```

## Boilerplate Template
The reusable JS skeleton that applies to any problem with this pattern.

```javascript
// [Pattern name] boilerplate
// Use this as your starting scaffold for any [pattern] problem

function solve(input) {
  // ... pattern scaffold here
}
```
