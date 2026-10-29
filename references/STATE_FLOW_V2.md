# Agentic setup: state flow reference V2 (aligned to Specs V2)

Duplicate of `STATE_FLOW.md`, reworked against `AgenticOnboardingSpecsV2_2_1.md` (the Specs). `STATE_FLOW.md` and its FigJam board (https://www.figma.com/board/HMRjHhzJnwTnqhVJ8kc2xz) are unchanged and still describe the prototype as built.

- **FigJam board V2 (14 diagrams):** https://www.figma.com/board/VrI7TNjdgZi5VHYtVAqNB0
- **Rule:** where the prototype and the Specs differ, the Specs win. Every box in the board carries a Specs ID, for example `(FLOW-005)`, so an agent can read the full line in the Specs.
- **Scope of the step diagrams:** they run from the step's summary card up to opening its Details page. What happens inside a Details page is not drawn, because the prototype still has placeholders there.

## Diagram index

| # | Diagram | What it answers |
|---|---|---|
| V2-01 | Journey | The whole path, and where the summary card, Details page and success screens sit |
| V2-02 | Preparation and replay | When the animation plays and when the summary card appears for the first time |
| V2-03 | When each step opens and completes | Opening and completion rules, locks, what holds the journey |
| V2-04 | Animation after the first time | Try Again, KYC submit, templates matched again, GTM Check Again; no replay on a second open |
| V2-05 | Summary card to Details page | Card anatomy, Details page layout, what each Details page holds (rough), save dialog |
| V2-06 to V2-10 | KYC details, Team, Brands and LOBs, GTM partners, Templates | Card states and buttons for each step |
| V2-11 | Finale, window, landing, return, log out | The landing order, migration window states, Start Migration |
| V2-12 | Reviews and statuses | Four reviewers, item statuses, status precedence |
| V2-13 | Errors, offline, others, blacklisted | Failure handling by outcome, concurrency notices, eligibility |
| V2-14 | Gate | Reading, accepting, errors, download |

## Animation and summary card timing (from the Specs)

- Preparation requests start together when the second document is accepted (PREP-001), not when Begin Onboarding is pressed.
- The first-time replay plays after Begin Onboarding, one card at a time in deck order: the loader scene and checks list play, then the summary card shows the result (PREP-007). A card whose answer has not arrived stays Preparing (PREP-008). The user cannot open cards during the replay (PREP-010).
- The animation plays again only for Try Again, KYC Submit, templates matched again, and GTM Check Again. A card opened a second time shows no replay (BP-004).
- Late decisions update the card quietly with no message screen (SUCC-008, APPR-035).

## Where the prototype differs from the Specs (known, not exhaustive)

| Area | Specs | Prototype today |
|---|---|---|
| After the gate | Success screen about 2 s, then an opening of three typed lines (first visit only), then the start screen "Your agent will prepare five steps" (SUCC-007, OPEN) | "Setup plan" screen with "Leave the heavy lifting to me" and Begin Onboarding; no opening |
| Success screens | About 2 s (4 s for KYC details), with a Next button (SUCC-005, SUCC-002) | About 8 s with an "Up next" bar |
| Failure during processing | No failed-source state; a failed step shows the failed card after the replay; Do It Later only on Team and Templates (PREP-026, RETRY-001) | A "Something went wrong" screen can interrupt the replay, with Do It Later for any step |
| KYC data and source names | Data from the KYC tables; no source tag on a field (PREP-024, BP-016); the replay shows six fixed source lines | Animation names DLT, GSTIN, MCA, Website, Trademark persistently; source tags appear while filling |
| KYC partly or not approved | A card state with View and Contact Support (BP-012, BP-013) | Shown on the blue page (changed on request) |
| Closed window button | Start Migration, enabled in every window state (WIN-007) | "Start Acquisition" (changed on request) |
| Details page header | "Step n of 5 · step name", title, Show Summary (DET-001) | Breadcrumb Step / Page / Action, then the title (changed on request) |
| Brands lines of business | Shown as chips (BRAND-001) | Rows on tiles, no chips (changed on request) |
| No access screen | Not in the Specs; the Specs have the blacklisted dialog (ELIG) | Both exist |

## Notes for an implementing agent

- The prototype is in-memory only: no routing, history or saved progress. The Specs require saved progress for the organisation, the landing rule (LAND) and no browser Back between cards (LAND-001).
- Auto-approval of brands and LOBs is a backend setting the user never sees (BRAND-025); the diagrams show both outcomes.
- Numbers, dates and IDs in the prototype are sample data.

## PM corrections applied (board V2, regenerated diagrams marked "(corrected)")
- V2-01: Do It Later now leads to the blue "{Step} is saved for later" page (SUCC-009), not the success screen; opening cites OPEN-001 and OPEN-002.
- V2-03: GTM opens with Brands' condition AND at least one rate card has arrived (FLOW-007, FLOW-020, GTM-003).
- V2-08: Brands branches into manual (Submit for Approval) vs automatic (Confirm); box ticking is BRAND-017, the gate before the main button.
- V2-09: MAN-015 sits on the waiting-for-rate-cards side; added failed-twice Add Manually path (RETRY-013/014, no Do It Later for GTM).
- V2-10: added TPL-009, TMATCH-018, TMATCH-017, TMATCH-009 and the failed-twice path (Add Manually, Try Again, Do It Later).
- V2-11: added session expiry (CASE-003, CASE-004).
- V2-13: gate-other-accepted shows name on tab with message, no dialog (CONC-015); dialog only for same-moment accept (CONC-024); added CONC-009, CONC-012, CONC-017.
- V2-14: after both accepted, gate closes and user lands by the landing rule.
Unchanged: V2-02, 04, 05, 06, 07, 12. Old versions of the replaced diagrams were deleted from the board.
