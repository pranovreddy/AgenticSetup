# Templates: brands & LOBs confirmation gate

**Surface:** `agentic-setup-pixels-intelligence.html`  
**Date:** 2026-10-22

## Behaviour

- Every time the user **opens** Templates in a visit, show a card face (log state) asking if all brands and LOBs are added — until they Continue or Skip.
- Leaving Templates and coming back re-asks.
- Existing Templates overlays (`lock` / `hold` / `remap`) take priority over this gate.

## Copy & CTAs

- Chip: Before you map
- Headline: Have you added all your brands and LOBs?
- Body: Proceed only if everything is in. If you still need to add more, you can do Templates later. Having all brands and LOBs helps suggest better template matches.
- Show current counts (brands · LOBs).
- **Continue with existing brands and LOBs** → normal Templates review card.
- **Skip** → mark Templates for later → finale.

## Flag

`F.tplGate`: `"ask"` | `"ok"` | `null` (reset when leaving the step or on jump).
