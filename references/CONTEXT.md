# Context handoff: DigiConsent agentic setup prototype

Written so another Claude account can pick this work up cold. Read this first, then `references/agentic-onboarding-requirements.md`.

## 1. What this project is

A **clickable HTML prototype** of "agentic onboarding" for DigiConsent (a consent-management platform; the customer in the demo data is HDFC Bank). An AI guide, the **Migration Manager**, prepares each onboarding step, says what it did, and asks the user to review. The full product requirements are in `references/agentic-onboarding-requirements.md` (7 steps in 3 stages: Setup = Agreements, Business profile, Team; Estate = Brands and LOBs, GTM partners, Templates; Migrate = Kick off migration).

The user is a designer / product owner. They iterate by sending short, spoken-style feedback (often transcribed, with filler words) and by leaving **comments on the published artifacts**. They care about: fewer boxes, a single canvas look, professional / subtle / "intelligent" feel, smooth transitions, no overlap, correct alignment of animations, and the agent doing the heavy lifting while the user only reviews.

## 2. Repo layout (branch `claude/bold-mccarthy-bls1vj`, repo `pranovreddy/AgenticSetup`)

| File | What it is |
|---|---|
| `agentic-setup.html` | **Main prototype** (v1 direction). Top Migration Manager bar with telemetry lines, single canvas, loaders in the workspace. |
| `full-agentic-setup-blob.html` | **Variation A "blob"**: agent lives in a bottom dock; dock is hidden while the loader plays, a blob flies down from the loader and opens a one-line tray; CTA sits beside the tray. |
| `agentic-setup-sidebar.html` | **Variation B "sidebar"** (the latest, most active one): left rail shows only an agent telemetry card (blob, orbit of step icons, live log); top of workspace is a gradient with the agent summary; agreements are summary-first then full text in one column. |
| `references/agentic-onboarding-requirements.md` | Source requirements (do not edit). |
| `references/Agentic_Migration_Html.html` | The original uploaded prototype, untouched. |
| `references/Animations_claude_-_Agent_Loaders_v33.html` | The user's loader reference (engine + scenes). Untouched. |
| `references/Animations_claude_-_Agent_Loaders_v34.html` | v33 + our `agreements` and `team` scenes. |
| `references/Animations_claude_-_Agent_Loaders_v35.html` | v34 + our `gtm` scene + embed fixes (brand tall frame, bottom dock mode, blob centring). **This is the source of the loaders used by all three prototypes.** |
| `references/Home-Agentic` (user upload, not in repo) | The user's reference for the sidebar telemetry card (`.agent-card`, `agent-tel-*`). |
| `references/tools/*.js` | Playwright helper scripts (see section 7). |

Published artifacts (private, owned by the user; a new session must republish with `Artifact` and the same `url` to update):
- Main: https://claude.ai/artifact/Yb6WJetu4541wBjjH372YP
- Blob: https://claude.ai/artifact/Aqrdou8ZTJxoWoiDaPyCDw
- Sidebar: https://claude.ai/artifact/Fiqmwb5S9bAKEkJENhcWGg
Comment threads reach the session as "[Artifact comment sent to Claude]" messages with a `claude.ai/code/artifact/<uuid>` URL (a different URL form from the one above). Reply and resolve with the `ArtifactComments` tool. Wake subscriptions for the Blob and Sidebar artifacts failed to register ("mint_failed"); only the main artifact had one.

## 3. Architecture of the prototypes

Each prototype is one big self-contained HTML file (about 2 MB because the loader document is embedded as a string). Inside: a large `<style>` block, markup, and one IIFE with `state` and render functions. Important patterns:

- **Cascade is heavy and uses `!important`.** New styling is appended as override blocks just before the marker comment `/* ---- Motion: one calm swap between steps */` (search for it). Keep adding there, using tokens `--cv-ink`, `--cv-blue`, `--cv-line`, `--cv-ease` etc. defined in the first override block (search `Single canvas`).
- Rendering: `render()` swaps the `.cl-detail-card` pane with a short fade, then `renderCommit()` rebuilds the shell. Hooks run at the end of `renderCommit()` (`agMaybeStepIntro`, `agTeleRender`, `agPopulate`, ...).
- **Steps** are keyed `"0"` (Agreements), `"1"` (Business profile), `"2"` (Team), `"e0"` (Brands), `"e1"` (GTM), `"e2"` (Templates), `"m"` (Kick off). `state.ag.focus` is the open step. `agSelect(key)` opens a step and enforces locks; `agStepIsComplete(key)` tells if it is done.
- **Opening**: a full-screen cover plays three lines, then the page appears. The old Stage 1 and Stage 2 "sources lighting up" scenes were removed on request (`beginStepRun`, `beginEstateRun`), so the first thing the user sees after the cover is the Agreements loader.
- **Loaders**: `AG_LOADER_DOC` is one embedded HTML document (the loader engine plus all scenes) used in an iframe via `srcdoc`, with `__AG_ID__` / `__AG_VI__` placeholders. `AG_STEP_LOADER` maps step key to loader id (`agreements`, `kyc`, `team`, `brand`, `gtm`, `match`). `agShowStepAi` mounts the iframe; the embed posts messages to the parent (`{agLoader:true,state}` and `{agLoader:true,step:n}`), which drive telemetry and the hand-over. `AG_LOADER_BOX` holds the content box of each loader (stage coordinates) so the iframe can be cropped, centred and enlarged (`agFitLoaders`). Kick off migration and (partly) Team have no step loader of their own beyond this.
- **Telemetry**: `AG_TELE` (per loader: step names in present and past tense, the "did" sentence and the "next" sentence). `agTeleStart/Step/Finish/Render` drive the Migration Manager text. In the sidebar version `AG_TEL_CARD`, `agTelBuild`, `agTelLayout`, `agTelCardRender` render the left card (orbit geometry ported from the reference: arc, beam, hub, prev/next icons).
- **Agreements** (`agAgreementsMarkup`): summary as a short paragraph (`AG_DOC_PROSE`) whose underlined phrases scroll to clauses (`AG_DOC_REFS`), a read-progress bar, full text below. The **Accept button is disabled until the user scrolls to the end of that document** (`state.docRead`, `agReaderSync`, `#agAcceptBtn`).
- **GTM review** (`agRateCards`): summary first (why these partners), per-partner facts, "View full rate card" expandable (`<details>`), terms checkbox, and "Other partners we checked".
- **Populate effect**: `agPopulate()` adds `.cv-pop` to visible blocks so details fill in quickly after a step or tab appears.
- `agDockActions()` (blob version only) moves the step's `.ag-actions` out of the scrolling step into the card so it can sit beside the tray.

## 4. Loader pipeline (important if you touch animations)

1. Scenes live in `references/Animations_claude_-_Agent_Loaders_v35.html` (engine API: `addScene`, `makeCtx` with `c.step/state/focus/wait/fly/...`, `core(x,y,size)` for the agent blob, stage is 720x360).
2. The file has `buildEmbedHtml(id, variantIndex)` which exports one loader as a standalone document. `references/tools/embed-loaders.js` runs it in headless Chromium, applies our patches (placeholders, neutralise `history.replaceState` in `about:srcdoc`, `postMessage` of state and step, zero padding) and writes the result into `agentic-setup.html` as `AG_LOADER_DOC`, plus the `AG_STEP_LOADER` mappings. Then the same literal must be copied into `full-agentic-setup-blob.html` and `agentic-setup-sidebar.html` (a short Python regex replace was used; see git history).
3. After changing a scene, also update `AG_LOADER_BOX` in all three prototypes (measure with `measure-content-box.js`) and check blob alignment with `measure-blob-alignment.js`.
4. Gotchas learned: `.stage` has `contain: paint` so anything beyond 720x360 is clipped (Brand Map needed a taller embed frame: `html.embed.tall`, `H=460`); the status pill is positioned by `dockStatus()` from the blob position unless a `data-dock` mode is set (`ring`, `bottom`); CSS animations with `transform: none` in keyframes override inline transforms (do not animate the iframe itself); `.copy` pill must not overlap source name chips.
5. The scenes were authored with a subagent on a stronger model; if you need new scenes, the same approach works (give it the engine file, a style description, steps, timing 9 to 12 s, no dotted connector lines, blob centred, verify with Playwright screenshots).

## 5. Design decisions the user has made (keep these)

- One **single canvas** background, hairlines instead of nested cards; the rail and workspace share the canvas; subtle gradients only.
- **No** generic centre blob with typed text and progress bar as a step intro. Animations (loaders) only.
- The "securing the page" (Encryption) loader belongs to migration, **not** to Agreements.
- Dotted connector lines in the Agreements loader are **removed**; keep the blob centred and level with the right-hand elements; pill under the whole scene.
- Agreement summary is **prose with clause links**, not a numbered list (numbers look like steps). Full text is below it in one column in the sidebar version. Accept requires reading to the end.
- Migration Manager copy while working is **one live line**; after finishing: one "what I did" line and one "Your turn" line (no checklist, no "Next"). In the sidebar version the top strip is hidden while a loader plays, and afterwards is a quiet gradient wash that fades from the top into the page (no card, no shadow).
- GTM: generic animation (seeing partners, reviewing rate cards, selecting, allocating, preparing), then a **summary-first review page** with expandable rate cards.
- Details should **fill in** (populate) rather than pop in.
- Rail in the sidebar version: only the telemetry card (no stage list); chevrons and icons move between steps; prev/next icons visible on the arc; blob centred above the beam. The user asked for this to match their reference `Home-Agentic` file, not an interpretation.

## 6. Requirements reminders (from the requirements doc)

Brands and LOBs in review hold up the journey; templates in review do not; Team can be skipped ("Do it later"); GTM selection and allocation are automated but the user confirms; Kick off migration only summarises and has a "Go to migration" button that ends onboarding; walkthrough plays once in the product; returning users land on the next step that needs them; reduced motion replaces animations with final text; opening and scenes cannot be skipped in the real product (the prototype has a skip via double-clicking the blob and a Scenarios floating button for jumping to states).

## 7. How to work and test here

- Environment: Chromium at `/opt/pw-browsers/chromium`, Playwright module at `/opt/node22/lib/node_modules/playwright` (do not run `playwright install`). Open the local file with `file://` URLs; there is no server.
- Helper scripts in `references/tools/` (they hard-code local scratch paths; adjust before use):
  - `embed-loaders.js` regenerates the embedded loader document.
  - `measure-content-box.js`, `measure-blob-alignment.js` report loader geometry.
  - `preview-cropped-loader.js` renders each loader inside the same crop logic used on the page.
  - `screenshot-sidebar-flow.js` and `screenshot-accept-flow.js` drive the page (wait for the loader, accept both agreements) and take screenshots.
- The initial cover plus the Agreements loader take about 40 s before the Agreements screen is usable; wait for `.ag-sec` or `.ag-loader-frame` to disappear. The Scenarios button's items are in the DOM as `[data-id="happy"]` etc. and can be clicked via `evaluate` (they are not visible to Playwright's click).
- Typical loop: edit, screenshot at 1280x820 and at a short window (1000x650 or 1280x640), read the PNG, fix, then `git add -A && git commit && git push -u origin claude/bold-mccarthy-bls1vj`, then republish the artifact(s) with `Artifact` (same file path, no `icon`).
- Commit messages in this session end with the attribution lines required by the environment. Do not open a pull request unless asked.

## 8. Known gaps and open ideas

- Business profile, Team, Brands and LOBs editor, Templates mapping still contain many boxes; only Agreements, GTM review and the shell were redesigned for the single-canvas look.
- Kick off migration has no loader or telemetry (its card has a title only).
- In the sidebar version the rail has no stage list, so users cannot jump between steps except by the arrows and icons (untested clicking).
- The blob version hides the "You are approving ... on behalf of" note and has an untested log chevron.
- The KYC loader blob sits about 8 px high relative to the form; Matching and Brand Map blobs were not re-centred.
- The sidebar telemetry card does not support drag/swipe on the arc (reference does).
- Walkthrough, return opening, logout confirmation and other requirement items exist from the original prototype but were not re-verified after the redesign.
- Wake subscriptions for the Blob and Sidebar artifacts are not registered, so new comments on them do not wake a session automatically.

## 9. User preferences for how to respond

Be brief; say what changed and what was not checked; never claim something was tested unless it was; propose a next step as a question. When a comment arrives from an artifact, reply in that thread with `ArtifactComments` and resolve it, and give one short line in the session.
