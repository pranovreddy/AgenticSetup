# DigiConsent agentic setup prototype

Clickable HTML prototypes of agentic onboarding for DigiConsent.

**For a new Claude session: read `references/CONTEXT.md` first** (section 8i is the latest: work only on `Agentic FlipCards updated text.html`) (section 8b is the latest state, then `references/agentic-onboarding-requirements.md`). Latest work lives on branch `claude/optimistic-heisenberg-i0otau` (see CONTEXT.md 8d); check it out before doing anything.

## Open a preview
Each prototype is one self-contained HTML file. To preview, publish it with the `Artifact` tool (same file path to update an existing one; the artifact URLs are listed in `references/CONTEXT.md`):

- `Animation + Blue BG Agentic Setup.html` is the current base to enhance: the Pixels Intelligence blue field with the agent-loader animations under the processing steps. See CONTEXT.md 8g. `agentic-setup-hybrid-cards.html` is its 3D flip-cards sibling.
- `agentic-setup-telemetry-opus.html` was the newest before the cards and pixels work: the telemetry direction with 2 to 3 versions per screen (Versions button, bottom left). See CONTEXT.md 8c.
- `agentic-setup-telemetry.html` is the previous direction (loader header with live steps, summaries on the page).
- `agentic-setup-sidebar.html` is the pills and pop-up version.
- `agentic-setup.html` and `full-agentic-setup-blob.html` are the earlier variations.

Locally, open the file with a `file://` URL in Chromium; there is no server. The opening cover and loaders take about a minute before the first screen is usable.

## Complaint management demonstration

- `digiconsent-complaints-demo.html` is the leadership demonstration of the DigiConsent complaint management solution: a seven-screen guided story, six test cases, role desks (subscriber, both operators, DigiConsent, enterprise, reviewer) and the architecture view. One offline file, no network requests. It is built from `complaints-demo/src/` by `python3 complaints-demo/build.py`; edit the sources, not the built file. Tunable values are in `CONFIG` at the top of `complaints-demo/src/data.js`.
- `digiconsent-complaints-flows.html` holds the flow diagrams for the same procedure (end to end, today and proposed, reporting and withdrawal, matching, findings, remedy, report again, subscriber status).
- `digiconsent-complaints-journey.html` is the simple version for leadership: one complaint in seven steps, three outcomes, Next and Back only.
