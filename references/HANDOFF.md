# Handoff: DigiConsent agentic onboarding prototype

Latest working file: `agentic-setup-cards-states-pm-feedback.html` (published artifact https://claude.ai/artifact/AF4jT5BR9fiAttHiPhJuHF, version 26). Full history of every change is in `references/CONTEXT.md` (sections 8f.14 to 8f.75, then the unnumbered "PM feedback file:" and "States prototype:" notes at the end).

## File chain (each is built from the one before; the earlier files stay untouched)
1. `agentic-setup-cards.html`: the main prototype (ring of five cards, review cards, finale, app shell).
2. `agentic-setup-cards-ux.html`: UI/UX audit fixes. Builder: `references/tools/session5/deck-enhanced/ux/build_ux.py`.
3. `agentic-setup-cards-states.html`: Part 2 design gaps as live, forceable states. Builder: `.../states/build_states.py` (states.js, states.css).
4. `agentic-setup-cards-states-pm-feedback.html`: the PM team's feedback, plus later comments. Builder: `.../pm/build_pm.py` (pm.js, pm2.js for Brands details, pm3.js for GTM and Templates details, pm.css).
Side files: `agentic-setup-gaps.html` (the 15-gap design sheet, builder in `.../gaps/`), `agentic-setup-C2P2.html` (standalone layout direction C2 with processing option P2).

To change the latest file: edit `pm/pm.css`, `pm/pm*.js` or `pm/build_pm.py`, then run `python3 references/tools/session5/deck-enhanced/pm/build_pm.py` (it reads the states file and writes the pm-feedback file). Builders use `sub(old, new)` with an exact-once assertion, so a failed assert means the source text changed upstream.

## How to test
Playwright with Chromium at `/opt/pw-browsers/chromium` (abort Google Fonts requests). In the page, `__deck.jump('analyse'|'ready'|'review'|'finale'|'restart')` and `__deck.uxState('<state>')` force any state. The Prototype menu (bottom right) lists every state grouped by screen.

## Working rules the user set
- Only the Glass Rail line is edited; Glass and Stage decks stay untouched.
- Reply to artifact comments in the thread, then resolve; keep the chat reply to one short line.
- No PR unless asked. Push to both branches after each change: `claude/optimistic-heisenberg-i0otau` and `claude/bold-mccarthy-bls1vj`.
- Republish the artifact after each change, and add a note to `references/CONTEXT.md`.
- Commit messages end with the Co-Authored-By and Claude-Session lines given in the session reminder.
- Keep the review card text at 17px or more; the review focus card is 85vh tall; edit pages are zoomed to 85%.

## Open items
- Thread "use the cards from the previous version" (left text of the review stage) is waiting on the user's answer.
- Thread "remove this" (cb95850f) was on the whole page; waiting for the user to point at the element.
- Brands approval scenarios and template remapping are in pm4.js (see the last CONTEXT note).
- Business profile "Do it yourself" path only blanks fields (no focus, animation still runs).
- Preparation tiles ("Nothing found", "Couldn't prepare") are patched on the analysis card only; the ready-screen copy changes only for flagged steps in the real flow.
- Card text can still look soft on some screens in the 3D start, ready and processing stacks.
- Proof for new lines of business is not enforced before Send for review.
- The "need review" and confidence figures on the Templates page are invented sample values.
