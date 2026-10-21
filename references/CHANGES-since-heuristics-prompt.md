# Changes made after the heuristics-audit prompt (implementation detail)

All changes are in the PM feedback build: `agentic-setup-cards-states-pm-feedback.html`, built by `references/tools/session5/deck-enhanced/pm/build_pm.py` from `pm.css` and `pm.js, pm2.js, pm3.js, pm4.js, pm5.js, pm6.js` (concatenated in that order, injected before `window.__deck = {`). Run `python3 references/tools/session5/deck-enhanced/pm/build_pm.py` to rebuild. Artifact version at the end: 30. Helpers used below (`S`, `BRANDS`, `BRANDS0`, `brandIsNew`, `lobIsNew`, `decide`, `renderReview`, `renderDeep`, `card(i)`, `focusCard`, `uxState`, `uxI`, `uxReset`, `LOCK_COPY`, `TPLS`, `TPL_LOBS`) already exist in the base file.

## 1. Brands and LOBs approval scenarios (pm4.js)
Classification, `pmClassify()` on the current BRANDS against `BRANDS0` (the agent's original draft):
- `none`: nothing edited, added or removed. Behaviour is unchanged from before.
- `remove`: only removals, no new brand or LOB.
- `all`: every LOB is new or in a new brand (`nl === total LOBs`).
- `partial`: some new or edited, at least one original left.

`decide(i, kind)` is wrapped for the brands step when `brandsChanged()`:
- `all`: card status `inreview`. Card face headline "Not done yet. Waiting for approval", text "All your brands and LOBs were edited or added, so they were sent for review. Please wait for approval. Template mapping is locked until then. GTM partners is still open." Amber clock tick (existing `done-face.wait`). Left text keeps "Your brands and LOBs are in review". `LOCK_COPY[4]` becomes ["Waiting for Brands and LOBs approval", "Your brands and LOBs are with the telecom operators. Skip this step for now and map templates once they are approved. You can change it later at any time."], so Templates shows the existing lock overlay. GTM is not locked (already true in `isLocked`).
- `partial`: card status `done`. Success face gets an amber line above the Next line: "N brand(s) and N LOB(s) are under review. The rest is set up." Toast: "Brands and LOBs saved. N brands and N LOBs are under review."
- `remove`: card `done`, toast "Brands and LOBs updated. Templates will be mapped again.", sets `S.remapPending = true`.
- After the decision the deck advances to the next open card after 5.5 s unless `S.pmNoAdv` (used by menu states).
- `pmApprove()` simulates the operators approving 45 s later: `inreview` becomes `done`, `LOCK_COPY[4]` restored, locks refreshed, `S.bPend.open = false`. If Templates is the open card or the open edit page, it calls `pmMapUpdated()`, else a toast "Brands and LOBs were approved. Template mapping is up to date."

## 2. Template remapping and the "mapping updated" popup (pm4.js)
- `pmRemap()`, when `S.remapPending` and Templates is unlocked and rendered (card or edit page): shows a `.pm-remap` overlay (spinner `.pm-rsp`, "Mapping your templates again", "You removed a line of business, so I am mapping your templates again. This takes a moment.") for 4.5 s. Then it clears `S.remapPending`, sets removed LOBs' templates to unmapped (`t.lob = t.lob0 = ""`), splices removed LOBs out of `TPL_LOBS`, re-renders, toast "Templates were mapped again to your updated lines of business". The screen afterwards is the normal Templates screen.
- `pmMapUpdated()`: dialog (`.dlg-bd > .dlg.dlg3`) titled "Your mapping was updated", text "Your brands and LOBs were approved, so the templates were mapped again. Please check the mapping and confirm.", single button "Check mapping" that closes it and re-renders Templates. Triggered by `pmApprove()` when the user is on Templates.
- `pmTplNote()` returns the review note while `S.bPend.type === "partial"` and `S.bPend.open`: "N brand(s) and N LOB(s) are still under review. We suggest you skip this step for now and map templates once they are approved. If you continue now, templates are mapped to the approved LOBs only. You can change the mapping later at any time." It shows as a banner on the Templates edit page (`.ux-nbar.warn.pm-nbar`).
- Not implemented: the removal-only case never waits in review; the popup does not change real mapping numbers (sample data).

## 3. Lock-like Templates state while brands are under review (pm6.js)
In `renderReview` for Templates when `pmTplNote()` is non-empty and `S.tplProceed` is false: add `.ux-lockov.pm-hold` over the card body (blurred content, padlock, bold "Your brands and LOBs are still under review", the note text, buttons "Skip for now" and "Continue anyway"). The footer's Confirm mapping button is disabled. "Skip for now" calls `decide(4, "later")`. "Continue anyway" sets `S.tplProceed = true`, re-renders (overlay gone, Confirm enabled), toast "Templates will be mapped to the approved LOBs only". `S.tplProceed` resets when the note disappears.

## 4. "You can change this later at any time" (pm4.js)
Every review card except Business profile (KYC) appends `<p class="pm-chg">You can change this later at any time.</p>` to `.r-body`, unless the card shows an empty or error face. Not added to the edit pages.

## 5. Previous and Next (pm4.js, pm.css)
A fixed `.pm-nav` (bottom right, 18 px from the edges) with two 44 px round icon buttons, `#pmPrev` and `#pmNext`, no text, `aria-label` and `title` "Previous step" and "Next step". Shown only when `S.phase === "review"`, no edit page open and no dialog. Previous disabled at step 1, Next at step 5. They call `focusCard(S.active ± 1)`. Clicking side cards still works.

## 6. Partial KYC approval (pm5.js)
`pmTelco(ok)` builds Airtel, Jio, Vi, BSNL with the first `ok` approved. If the profile card is `done` and `c.telco.ok < 4`, `doneFace` for the profile becomes: headline "Approved by 2 of 4 operators"; text "Your business profile is done. 2 operators are still reviewing it."; a 2-column list `.pm-tl` (green "Approved" with a tick, amber "Still reviewing" with a clock); an amber note "You can carry on. Messages go out only through the approved operators until the others approve."; the Next line. The left text reads "Business profile is partly approved" and "Approved by 2 of 4 telecom operators. The others are still reviewing." (300 ms interval overrides `#hTitle` and `#atTele`). The finale card sub-label uses `doneMini` -> "Approved by 2 of 4". The live flow still ends 4 of 4 (`c.telco` unset). Operators later approving is not simulated.

## 7. Prototype menu and button (pm4.js, pm5.js, pm.css)
- `#proto` (button) moved to the top right (`top:14px; right:18px`), menu opens downward (`top:42px; right:0`).
- New menu entries under "Brands and LOBs": "All edited: amber, waiting" (`pm-all`), "All edited: templates locked" (`pm-all-lock`), "Partly edited: done, N under review" (`pm-partial`), "Partly edited: templates warning" (`pm-partial-warn`), "Approved while mapping: popup" (`pm-partial-popup`), "LOB removed: remapping" (`pm-remove-remap`); under "Business profile": "Approved by 2 of 4 operators" (`pm-kyc`).
- `uxState(name)` is wrapped twice: names starting `pm-` are handled in pm4.js (resets BRANDS to `BRANDS0`, marks steps 1 and 2 done, applies an edit, calls `decide(2, "accept")`, then focuses Templates for the lock, warn, popup and remap cases; popup state calls `pmApprove` after 3.5 s), `pm-kyc` in pm5.js.

## Checks and known gaps
Screenshots were reviewed for the amber card, locked Templates, partly edited card, Templates warning and lock overlay, popup, remap result, partial KYC card, and the arrows and Prototype button. Not checked: the remap loader mid-spin, the edit-page variants of the warning and loader, the finale card text for partial KYC, narrow screens. Approval timing, operator names, counts and the Templates figures are sample values.
