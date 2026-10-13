# Changes after lunch — Agentic Setup final approach

For: PM, to port into the file being worked on.
File changed: `agentic-setup-final-approach.html` only (110 lines added, 12 removed).
Range: commits `8a98284` → `400956f` (today, 09:10 → 09:31). Everything before that was done before lunch and is not listed here.
Raw diff: `references/after-lunch-changes.patch` (apply with `git apply`, or read it as a list of edits).

> I took "lunch" to be the 1h35m gap in the commit log, between 07:35 and 09:10. If you meant a different cut-off, tell me and I will regenerate this.

## Summary

| # | Screen | What changed |
|---|---|---|
| 1 | GTM partners summary | Partners we did not pick now show too, muted, under the selected ones |
| 2 | Setup cover animation | Rebuilt: blob in the centre, the 3 steps around a circle, focus cone and focus ring on the active step |
| 3 | Setup cover status line | Same status style as the loader animations: rolling shimmer text, drawn border, count, segments |
| 4 | Business profile | "Summary" AI chip above the headline, like the other steps |
| 5 | Review and accept popup | Stray blue line at the top-left corner removed |

Not done: the Figma design you shared for the Migration page. The Figma connector was not reachable from this environment, so I built the Migration countdown page (before lunch) from your pasted image instead.

---

## 1. GTM partners summary: show partners we did not pick

Before: only the 2 selected partners were listed.
After: all 4 are listed. The 2 selected come first, then the 2 not picked, muted (62% opacity, desaturated), with a grey "Not selected" pill. The reason block reads "Why I did not pick it" instead of "Why I picked it".

Screenshot: `references/after-lunch/partners-not-picked.png`

Where to change:
- `opList()`: for key `e1` in compact mode, the row source changed from `m.items.filter(x => x.on)` to the selected items followed by the unselected ones.
- `opGtmWho()`: the label `Why I picked it` is now conditional on `it.on`.
- CSS: `.op-list .op-item.is-dim`, `.op-list .op-item.is-dim .op-reason`, `.op-list .op-item.is-dim .op-pill`.

## 2. Setup cover animation: blob in the centre, steps around a circle

Before: the blob with three steps in a horizontal track underneath.
After: the blob stays in the centre. Platform, Organisation and Agents sit on a circle around it (top, bottom-right, bottom-left, 120° apart).
- A soft focus cone widens from the blob toward the step being processed. It rotates smoothly from one step to the next.
- The active step grows, glows, and gets a round focus ring (a short blue arc circling it). The ring replaced an earlier box-corner version that looked off.
- A blue progress arc draws around the circle as each step starts, and closes the full circle at the end.
- Finished steps turn solid blue with a small pop.

Screenshots: `references/after-lunch/setup-cover-step1.png`, `setup-cover-step2.png`

Where to change:
- `opCoverThen()`: the horizontal track markup is gone. It now builds an `.op-co` orbit element (SVG ring and arc, `.op-co-cone`, three `.op-co-node`s) and appends it to the boot mark. Node positions are in `PT`, the cone angles are derived from them (`ANG`).
- CSS: the `.op-co*` block, plus `.op-cv-mark{margin-bottom:76px}` to make room under the circle.

Heads-up for porting: the raw patch contains a few intermediate rules that later rules override (for example the dashed box corners and the spoke lines). Keep the rules in the order they appear and the result is the same as the current file.

## 3. Setup cover status line: same style as the loader animations

Before: a plain pill with "2 / 3" and the text.
After, matching the other loader animations:
- The text has a shimmer sweep, and rolls up and out while the next step's text rolls in with a soft blur.
- The pill border draws itself (an SVG stroke) as each step progresses.
- The "1/3" count sits inside the pill on the right.
- Three small progress segments sit under the pill and fill one by one.
- The last line turns green: "Your workspace is ready".

Where to change:
- `opCoverThen()`: new status markup (`.op-pbar`, `.op-roll`, `.op-pcount`, `.op-segs`) and the per-step roll logic.
- CSS: `.op-cv-status`, `.op-pbar`, `.op-roll`, `.op-pcount`, `.op-segs`, `.op-seg`.

## 4. Business profile: AI summary chip

The left side of the Business profile page now starts with the same "Summary" chip (AI mark) used on the other steps, above the headline.

Screenshot: `references/after-lunch/profile-summary-chip.png`

Where to change: `opDetailSync()`, the `head` markup for key `"1"`; CSS `.op-dside-hd .op-sumchip{margin:0 0 14px}`.

## 5. Review and accept popup: blue line at the top-left corner

A 3px-wide blue accent bar belonging to the "In short" box was being drawn at the card's top-left corner. It is hidden now; the "In short" accent line next to the summary is unchanged.

Where to change (CSS only): `body.ag-gate .ag-brief::before{display:none}` and `body.ag-gate .cl-detail-card::before{display:none}`.
