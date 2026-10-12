# DigiConsent agentic setup prototype

Clickable HTML prototypes of agentic onboarding for DigiConsent.

**For a new Claude session: read `references/CONTEXT.md` first** (section 8b is the latest state, then `references/agentic-onboarding-requirements.md`). Work lives on branch `claude/dazzling-wozniak-oqrxqs`; check it out before doing anything.

## Open a preview
Each prototype is one self-contained HTML file. To preview, publish it with the `Artifact` tool (same file path to update an existing one; the artifact URLs are listed in `references/CONTEXT.md`):

- `agentic-setup-telemetry-opus.html` is the newest: the telemetry direction with 2 to 3 versions per screen (Versions button, bottom left). See CONTEXT.md 8c.
- `agentic-setup-telemetry.html` is the previous direction (loader header with live steps, summaries on the page).
- `agentic-setup-sidebar.html` is the pills and pop-up version.
- `agentic-setup.html` and `full-agentic-setup-blob.html` are the earlier variations.

Locally, open the file with a `file://` URL in Chromium; there is no server. The opening cover and loaders take about a minute before the first screen is usable.
