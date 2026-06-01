# Post-Solve Checklist
# Run this after solving a problem correctly (own solution or after seeing the answer).

## 1. Fill the card
Fill out `dsa-prep/templates/dsa-pattern-card.md` with ALL sections complete.
Use YYYY-MM-DD format for ALL dates (Solved Date, Review Date).

## 2. Set SRS fields
Based on MAANG interviewer rating (1–5):
- 5/5 → Stage 3, Review Date = today + 7  (nailed it clean — sprint skipped)
- 4/5 → Stage 2, Review Date = today + 3  (one minor miss)
- ≤3/5 → Stage 1, Review Date = today + 1 (standard — sprint active)

Set: Last Rating = —, Review Count = 0, Graduated = No

## 3. Save card
Save completed card to `dsa-prep/notes/[problem-name]-solved.md`

## 4. Cheatsheet sync
Look up the card's Pattern Tag in `dsa-prep/notes/cheatsheets/cheatsheet-index.md`, open the mapped section:
1. If the exact sub-pattern variant **exists** → verify the boilerplate matches the card's Boilerplate Template exactly. If it differs, update cheatsheet to match (card is always source of truth).
2. If the sub-pattern variant **does not exist** → announce: "⚠️ New variant detected: [variant] not found in [cheatsheet section]. Add it?" Wait for confirmation before writing.

## 5. Update REVIEW.md
Append a row to `dsa-prep/notes/REVIEW.md`:
```
| [file]-solved.md | [Problem Name] | [Pattern Tag] | [Stage] | [Review Date] | — | 0 | No |
```

## 6. Pattern Lock announcement
- Stage 1 or 2: "🏃 Sprint active — /dsa-review will run Sprint Mode for your next 2 reviews."
- Stage 3 (5/5 clean solve): "Pattern locked — sprint skipped. Next review in 7 days."

## 7. 3-Problem Rule
Count problems in `dsa-prep/notes/REVIEW.md` that share this pattern tag.
Tag matching = broad/prefix match (e.g. `two-pointer / in-place` and `two-pointer / move shorter` both count toward `two-pointer`).
- If < 3: announce "Pattern has X/3 problems. Here's your next one:" and immediately suggest an unseen problem from the same tag.
- If ≥ 3: announce "Pattern solid at 3+ problems. Ready for a new pattern when you are."

Always announce this — never wait to be asked.

## 8. MAANG Rating + Debrief
Give a score 1–5 as if you are an SDE-2 interviewer at FAANG:
- **What went well**: 2–3 specific things
- **What to improve**: 1–2 concrete gaps
- **Verdict**: "Would advance" / "Borderline" / "Would not advance"
