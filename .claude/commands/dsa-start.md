Read `dsa-prep/notes/REVIEW.md`.

Run these checks in order and show the first one that applies:

## Check 1 — Pattern Lock Sprint Active?
Find any Stage 1 or Stage 2 problem whose Review Date is today or overdue.
If found → announce: "🏃 Sprint active: [problem] is Stage [N] and due for Pattern Lock review.
Handle this in /dsa-review first before starting a new problem."

## Check 2 — 3-Problem Rule: Pattern in Progress?
Find the most recently added pattern tag (last few rows of REVIEW.md).
Count how many problems share that tag across all rows (broad/prefix match).
If < 3 → announce: "Pattern [tag] has [N]/3 problems. Suggested next:" and give one unseen problem from that same tag.
Follow the full coaching flow from CLAUDE.md (DSA Coaching section) once confirmed.

## Check 3 — Pattern Gap?
Find pattern tags not seen in any Review Date within the last 7 days.
Pick the tag with the oldest last-review date as the gap.
Announce: "Gap found: [tag] — last practiced [date]. Suggested:" and give one unseen problem from that tag.
Follow the full coaching flow from CLAUDE.md (DSA Coaching section) once confirmed.

## If no checks fire
All patterns are fresh and at 3+ problems.
Announce: "All patterns solid. Time to start a new one. Picking from your weakest area..."
Suggest the next pattern based on FAANG SDE-2 frequency for someone strong in foundations but weak in advanced patterns:
Priority order: Trees → Graphs → DP → Tries & Heaps (Advanced) → Backtracking → Greedy
