# Context handoff: DigiConsent agentic setup prototype

Written so another Claude account can pick this work up cold. Read this first, then `references/agentic-onboarding-requirements.md`.

## 1. What this project is

A **clickable HTML prototype** of "agentic onboarding" for DigiConsent (a consent-management platform; the customer in the demo data is HDFC Bank). An AI guide, the **Migration Manager**, prepares each onboarding step, says what it did, and asks the user to review. The full product requirements are in `references/agentic-onboarding-requirements.md` (7 steps in 3 stages: Setup = Agreements, Business profile, Team; Estate = Brands and LOBs, GTM partners, Templates; Migrate = Kick off migration).

The user is a designer / product owner. They iterate by sending short, spoken-style feedback (often transcribed, with filler words) and by leaving **comments on the published artifacts**. They care about: fewer boxes, a single canvas look, professional / subtle / "intelligent" feel, smooth transitions, no overlap, correct alignment of animations, and the agent doing the heavy lifting while the user only reviews.

## 2. Repo layout (session 1 branch `claude/bold-mccarthy-bls1vj`; session 2 branch `claude/dazzling-wozniak-oqrxqs`; repo `pranovreddy/AgenticSetup`)

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
| `references/Home-Agentic_reference.html` | The user's reference for the sidebar telemetry card (`.agent-card`, `agent-tel-*` CSS, `agentTelArcLayout` JS). The sidebar rail was ported from this. |
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
- Helper scripts in `references/tools/` (they hard-code scratch paths such as `/tmp/claude-0/.../scratchpad` and `file:///home/user/AgenticSetup/...`; adjust before use):
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
- Blob alignment: Agreements, Team and GTM blobs are now level with the right-hand elements (Team and GTM use `data-dock="bottom"` with a fixed pill position `dy`). The KYC blob sits about 8 px high relative to the form; Matching and Brand Map were not re-checked.
- The sidebar telemetry card does not support drag/swipe on the arc (reference does).
- Walkthrough, return opening, logout confirmation and other requirement items exist from the original prototype but were not re-verified after the redesign.
- Wake subscriptions for the Blob and Sidebar artifacts are not registered, so new comments on them do not wake a session automatically.

## 8b. Session 2 update (read this first; it supersedes older notes above where they conflict)

Branch is now `claude/dazzling-wozniak-oqrxqs` (all session 2 work is pushed there; the older `claude/bold-mccarthy-bls1vj` holds session 1). Four prototypes live at the repo root, all single self-contained HTML files (~2 MB) built by appending override CSS blocks and JS to the same big file:

| File | What it is | Published artifact |
|---|---|---|
| `agentic-setup.html` | v1 main (top Migration Manager bar) | https://claude.ai/artifact/Yb6WJetu4541wBjjH372YP |
| `full-agentic-setup-blob.html` | Variation A blob dock | https://claude.ai/artifact/Aqrdou8ZTJxoWoiDaPyCDw |
| `agentic-setup-sidebar.html` | Variation B, **now the "pills + pop-ups" version** (no sidebar bar any more) | https://claude.ai/artifact/U35bpo3CuUv3YJtUu3tsJS (comments reach the session) |
| `agentic-setup-telemetry.html` | Copy of the sidebar version with **telemetry in the loader header and summaries on the page** | https://claude.ai/artifact/KASiXjMGtNJYSg9EZHqyTa (its comment URL form is `claude.ai/code/artifact/931609b2-...`; wake subscription failed to register, so comments must be sent into the session) |

Update an artifact by calling `Artifact` with the same file path (no `icon`). Reply to and resolve comment threads with `ArtifactComments` (reply text must end with the Claude Code footer).

### Current flow (both sidebar and telemetry versions)
1. Opening cover ("I'm fetching information...") then straight to the **Agreements gate**: a pop-up over a blurred, dimmed app (body class `ag-gate`). No loader, no title. Blue-tinted top gradient, centred glossy hero ("Review and accept"), centred segmented tabs (Terms / Privacy), thin reading-progress line, "In short" summary text, numbered clauses, Accept button (disabled until scrolled to end). Logo, user and steps pills are hidden here.
2. **"What happens next"** screen (`#agNextUp`, `agNextUpShow`): numbered timeline of the 5 areas, "Nothing goes live until you accept it", Continue. Pills visible from here on.
3. Business profile (KYC) loader, then the profile form (no summary for KYC, it is a form).
4. Team, Brands and LOBs, GTM partners, Templates each: loader, then a **summary**, then Approve/Skip, then a **summary success state**, then straight into the next loader (the detail step is never shown in between). "View details" opens the full step; "View summary" pill (top right) returns to the summary. Skip exists only for Team ("Do it later") and Templates ("Skip for now"). Brands/LOBs cannot be skipped (requirements say it holds up the journey).
5. Kick off migration keeps its full page (old success/handoff screens).

Key code anchors in the files (search these names): `agSummaryData`, `agSumTable` (telemetry only), `agSummarySync`, `agSummaryApprove`, `agSummarySkip`, `agSumSuccessData`, `agSumFlowUntil`, `successAutoArm`, `AG_DONE_TOAST`, `agDoneToastShow`, `agNextUpShow`, `AG_NEXTUP`, `agGateSync`, `AG_LOADER_WHY` + `agLoaderNote` + `agLsRender` (loader copy/stepper, telemetry file), `rtBuild/rtLayout/rtRender` (ported Home reference agent card, now unused in the UI), `AG_TEL_ORDER` (6 steps, agreements removed), `AG_TEL_CARD`, `AG_TELE`.

### Sidebar version specifics
- Left side is three floating glass pills, not a bar: logo mark in a circle + user avatar with a progress ring (top), steps pill (vertical, centred, icons only, names on hover, thin progress line, green ticks). `.setup-layout .cl-overview` is only a container; its logo/user/footer are `position:fixed`.
- Summary = pop-up card over the blurred details page (dark pill CTA was rejected, CTA is blue), rows in the trendy list style from the user's reference image (large pastel avatars turned blue shades, verified tick, grey email/mobile, pill on the right).
- Agent telemetry card (arc, beam, blob, log) was removed from the rail at the user's request (see Telemetry version).

### Telemetry version specifics
- No right-hand panel any more (it was built, matched the Home reference, then the user asked to remove it). Instead, each loader has a header block at the top: title, one-sentence "what/why", a **dynamic stepper** (finished steps = ticks, current step expands into a labelled pill with spinner, others numbered dots joined by lines), a "Now reading <source> · elapsed · N to go" line, and a "Show details" toggle that opens a 2-column list of all steps with their source and state. The animation scales to the space below (`agFitLoaders` subtracts `.ag-ltop` height). There is no "Next:" line.
- Summaries are **on the page** (fixed layer on `document.body`, z-index 50, left padding 134px to clear the pills): compact header bar (tag, source chips, headline, next-step line, 2 big numbers), then ONE white table (column headers, hairline rows, footer with count, View details, optional skip, primary button). Mounted on the body, not inside `.cl-detail-card`, because `render()` rebuilds the card and would delete it.

### Design lessons from the user's feedback (do not repeat these mistakes)
- Too many colours (green, pink, purple, maroon, orange) looked childish: use **shades of blue only**; green only for the tiny success tick.
- Too many boxes and cards: prefer hairlines, one surface, one gradient washing down from the top edge. Do not put a card or a different background behind a summary; do not make a second card around the same content.
- Heavy blue header bands and strong glassmorphism felt "too much"; the user asked to *reduce* glass behind pop-ups. Backdrops are a plain dim plus light blur. Glass is only for the small left pills and the "View summary" pill.
- Do not invent a stats-tile row, branching trails, or decorative stat cards; they were rejected as "too much" / "lacking character". What worked: trendy list rows (see reference image style), centred glossy hero icon, large numbers used sparingly.
- Text sizes must match the rest of UI: loader animations are drawn at natural size (max scale 1), status pill ~12.5px.
- The user does not like explanatory text sitting in the same place twice (the stepper and the pill under the blob said the same thing; hence the "Now reading" line and the details list).
- Never claim something was checked unless a screenshot was viewed. Always state what was not tested.

### Things still unverified / open ideas
- Loaders other than the business-profile one were not re-viewed after the header/stepper change; narrow window widths untested; the "View summary" pill in the telemetry version's table layout was not re-tested; the in-page summary was seen for Team, Brands, GTM and Templates but only the Team one after the compact header.
- The Brands/GTM/Templates detail pages still contain many boxes (original prototype), and GTM "Edit partners allocation" was not touched.
- Kick off migration still has no loader or telemetry.
- Telemetry artifact has no wake subscription (mint_failed); retry `ArtifactComments` action `watch` with its url if wanted.
- The user may continue this work on another account (possibly with Opus). Everything needed is in this folder and the repo root files.

### How to test (Playwright, headless Chromium)
Scripts used this session are in `references/tools/session2/`. They open the file with `file://`, wait for `.ag-sec` (agreements), scroll `.ag-agree` to the bottom and click `#agAcceptBtn` twice, click `[data-nextup-go]`, wait for the profile form (`.ag-profile input[type=checkbox]`), tick it and click Submit, then wait for `#agSummary` and click `[data-sum-go]` / `[data-sum-skip]`. Takes 60-120 s per run because of the opening cover and loaders. Use `--no-sandbox`. Do not run two browsers at once on slow steps.

## 8c. Session 3 (Opus pass): `agentic-setup-telemetry-opus.html`

Branch `claude/optimistic-heisenberg-i0otau`. A copy of the telemetry version titled "DigiConsent Agentic Telemetry Opus", with every new screen offered in versions the user picks from a **Versions** button (bottom left). Picks are stored in the viewer's browser (`localStorage` key `agOpusVersions.v1`) and listed under "Your picks" with a copy button. Each row has "Preview", which puts the app in the state just before that screen (`opPreview`, also `window.__opPreview(kind, key)` for tests).

All new code is prefixed `op` (CSS `.op-*`, JS `op*`) and sits in one CSS block before `</style>` and one JS block before the final `render()`.

- **Agent at work** (`opLoaderChrome`, `opLoaderRender`): title + one "why" sentence on top, and one live line only. A = caption under the animation (step name, "n of N", segmented bar) with the pill inside the scene hidden; B = the pill inside the scene is the only live line (no caption); C = stepper across the top naming every step, pill hidden. The pill is hidden by injecting a `<style id="opChip">` into the loader srcdoc (`opLoaderDoc`). `OP_BOX_NOCHIP` crops the scene without the pill.
- **Summaries** (`opSumModel`, `opSumMarkup`): A list, B cards, C brief (what I did + sources on the left, compact list right). One data model per step, so all three always agree. GTM now uses the same partners and rates as its details page (`AG_GTM_POOL`, `agGtmPhaseAlloc`), not `AG_PARTNERS`. Template numbers now match the details page (98 of 100 mapped, 27 high confidence, 71 to check).
- **After approve** (`opSuccessPaint`): A centred, B ticks each item in place with a bar at the bottom, C centred with the whole journey. Skip shows "skipped" without ticks.
- **What happens next**: A the original timeline, B a five-column plan (Agent / You per area).
- **View summary** pill now appears ~0.1 s after leaving the summary (was ~3.5 s).
- Fixes carried in: broken GTM rate-card icon URLs; the agreements subtitle clipped under the sticky tabs; reduced motion never showed summaries (blocker check now scoped to the focused step, GTM marks itself ready); kick-off and toast colours moved from green to blue; "Filling your details with AI" chip moved to the top right so it never sits on the form.
- Defaults (`OP_DEFAULT`): loader A, Team A, Brands B, GTM B, Templates C, success C, next-up B.
- **Session 3b: two whole-experience directions** on every screen, plus "Whole experience" presets at the top of the panel (A–C Refined / D Board / E Conversation; picking D or E plays from the Team loader). D = loader with a Findings column streaming results (`OP_FIND`), decision board with a reason and an include switch per item and actions on top (GTM shows a rate race per phase), signed receipt on approve, full-screen route for what happens next. E = loader narrated line by line (`OP_NARR`), summary as an agent message with item tiles, reply chips, "How did you decide?" and a working ask box, approve shows your reply then the agent's confirmation, next-up as a chat. Code is in the `Opus 2` JS block (`opBoard`, `opChat`, `opSumBind`, `opSuccessPaint2`, `opNextUpMarkup`).
- **Version bar** (`opStrip`, top centre): appears on any loader, summary, confirmation or next-up screen, names the screen and swaps its version in place. Choosing a version in the panel jumps straight to that screen (`opSetAndShow`).

## 8d. Handoff after session 3 (read this first on a new account)

- **Branch:** `claude/optimistic-heisenberg-i0otau` (contains everything from sessions 1 and 2 plus session 3). Check it out first.
- **Newest file:** `agentic-setup-telemetry-opus.html`, titled "DigiConsent Agentic Telemetry Opus".
- **Published preview (owned by the old account):** https://claude.ai/artifact/36NT37teZnfB3sAm6MQAgD. A new account cannot update it; publish the file again from the new account to get your own URL (it will be a new link). The comment wake subscription never registered, so paste comments into the session.
- **Also published from session 3:** an unchanged preview of `agentic-setup-telemetry.html` at https://claude.ai/artifact/PmtoaK9yfTXPoXJTbB65E5.
- **Where the user is:** they reviewed versions A to C ("these look good") and asked for D (Board) and E (Conversation), which are built. Next expected step: they send their picks (the panel's "Copy picks" text, one line per screen), then the chosen version per screen is made the only one and the rest are removed.
- **Not yet checked for D and E:** narrow or short windows (1000x650), reduced motion, and the business profile loader in D/E during a full run.
- **Known leftover:** the template "download" link does nothing inside the artifact viewer (viewer blocks downloads), pre-existing.
- **Test scripts:** `references/tools/session3/` (screenshots go to `/tmp/shots`, create it first; run from the repo root with `node references/tools/session3/<file>`):
  - `flow.js` plays the whole real flow (gate, accept, next-up, profile, each loader and summary) and screenshots each stage. ~3 min.
  - `pv.js <tag> "step|step"` opens the page and runs steps: `set:<screen>=<letter>` (picks a version through the panel, which also jumps to it), `prev:<screen>`, `wait:<ms>`, `shot:<name>`, `click:<css>`, `eval:<js>`. Screens: `loader`, `sum-2`, `sum-e0`, `sum-e1`, `sum-e2`, `success`, `nextup`. `window.__opPreview(kind, key)` jumps directly (kind = loader | summary | success | nextup).
  - `pvrm.js` is the same with reduced motion; `exp.js d|e` plays a whole experience preset end to end; `measure.js` measures loader content boxes.
  - Use `W=1000 H=650` env vars for small windows. Chromium is at `/opt/pw-browsers/chromium`, Playwright at `/opt/node22/lib/node_modules/playwright`.

## 9. User preferences for how to respond

Be brief; say what changed and what was not checked; never claim something was tested unless it was; propose a next step as a question. When a comment arrives from an artifact, reply in that thread with `ArtifactComments` and resolve it, and give one short line in the session.

## 8e. Session 4 (critique, Panel/Split layouts, final approach) — read this first

**Branch:** work was done on `claude/optimistic-heisenberg-i0otau` and merged (fast-forward) into the repo default branch `claude/bold-mccarthy-bls1vj`; both hold the same content. There is no `main`. Two new files at the repo root, both copies of the Opus prototype with changes on top:

- `agentic-setup-critiqued.html` — the working file for session 4. Published (owner's account): https://claude.ai/artifact/L2YzRZ8Yyi2qPoYpfjGnRY. Still has the **Versions** panel (versions A–G per screen) but the top version bar (`#opStrip`) is hidden by CSS.
- `agentic-setup-final-approach.html` — locked copy for the chosen layouts. Published: https://claude.ai/artifact/2GuVpZVBMDvW5fu4dV3eai. `OP_DEFAULT` is fixed (`opGet` ignores localStorage), `opEnsurePanel()` is not called, and `#opVpBtn/#opVp/#opStrip` are `display:none`. The code for the unused versions is still in the file (not stripped). **Continue editing this file for further changes.**

**Locked picks in the final file:** Agent at work A (Caption); Team, Brands, GTM, Templates summaries G (Split); Step details A (Full width); After you approve D (Receipt); What happens next D (Route).

### How the work is organised
- All session-4 CSS is appended in one block just before `/* ---- Design critique fixes ---- */` (search for it; the many overrides use `!important`). JS additions are inserted before `function opSumMarkup(key, v)` or near `opFullMarkup`/`opGMarkup`.
- The user works by leaving **comments on the published artifact**; they arrive as "[Artifact comment sent to Claude]" with a thread id. Reply and resolve with `ArtifactComments` (needs the `claude.ai/code/artifact/<uuid>` URL from the message, not the `claude.ai/artifact/...` one). Footer on replies: `---\n_Generated by [Claude Code](https://claude.ai/code)_`.
- Republish after each change with `Artifact` (same file path + `url`), then reply/resolve threads. Commit and push to the branch.

### What was added (by area)
- **Summary versions** (`opSumMarkup(key, v)`): a List, b Cards, c Brief, d Board, e Chat, **f Panel** (`opFullMarkup`: review left, collapsible info rows right), **g Split** (`opGMarkup`: title + agent rows left, wide review right; left rows start collapsed; gradient bottom-left). Info rows come from `opPanelInfo(m)` (trace, stats, sources, tip in `OP_TIP`). Accordion: one open at a time. The logo-icon pattern (`OP_FR_ART`) is hidden by CSS; the gradient remains.
- **Team step**: six people (3 Regulatory/Legal, 2 Business Admin, 1 Super Admin) in `AG_STEPS`. List view groups by role with a role dropdown (`opRolesMarkup`); cards view has role chips + search (`opFilterBar`).
- **Partners list** (`opGtmWho`): "2 of 4 selected", logo + name, highlighted reason, info icon popover with rates/split.
- **Step details layouts** (`opDetailSync`, screen id `details`): a Full width, f Agent right, g Agent left (aside with the same accordion). Works on steps 1, 2, e0, e1, e2; business profile uses `opProfileModel()`. `opSubSync` adds a one-line description under each details title. "Whole experience" presets now include F and G.
- **Agent at work**: composition pass (tag, bigger title, frosted caption/findings); loader scale cap 1.3; Brands/Team loader crop boxes (`OP_BOX_NOCHIP`) re-centred.
- **Next-up Route (d)**: restructured, CTA at bottom right of the right-hand panel. Logo wordmark (`#opLogo`) shows on the agreements gate, next-up and Route. Cover (`#agBoot`) now plays **after both agreements are accepted** (`opCoverThen` wraps `agNextUpShow`); the page opens on the agreements. "Agreements accepted" tag/toast removed.
- **Rail**: hover pills for step icons, logo expands to the full wordmark on hover (`.cl-overview-brand`), z-index fixes.
- **Other**: all primary buttons 36px/8px radius (F/G CTA 32px); "View details" renamed "Review and edit"; Migration Manager strip (`.welcome-card.is-agentic`) and "Version/Read for you" line hidden; accessibility CSS (contrast, focus rings, target sizes).

### Test scripts
`references/tools/session3/pv.js` hard-codes the opus filename; for session 4 files, copy and edit the `file://` path (or `sed` it temporarily). `window.__opPreview(kind, key)` kinds: loader | summary | success | nextup | details. Previewing loaders for step keys other than "2" can fall back to Team. Screenshots go to `/tmp/shots`.

### Known leftovers / not checked
- Business profile details page in G: the last form row is slightly clipped at 1333px height (cause not found).
- F/G not checked at small windows beyond the 1100px stacking rule; Brands summary in G only checked early; success D and nextup D flows not re-run end to end after the cover change.
- The final file keeps all unused version code; strip it if a lean file is wanted.
- Figma MCP failed to connect (proxy 403/timeouts); unrelated to the prototype.

## 8f. Session 5 (cards, copy pass, critique fixes) — READ THIS FIRST ON A NEW CHART

Newest state of the prototype. Everything below supersedes older sections where they conflict. Written 15 October 2026 for a fresh start with a different approach: it lists what exists, how it behaves, how the file is organised, and what the owner decided.

### 8f.1 Files and branches
- Repo `pranovreddy/AgenticSetup`. Work branch `claude/optimistic-heisenberg-i0otau`; the default branch `claude/bold-mccarthy-bls1vj` is kept equal by pushing HEAD to both (`git push origin HEAD:<branch>`). No `main`, no PR unless asked.
- **Current working file: `agentic-setup-final-approach-cards-critique-fixes.html`** (~2.5 MB, single self-contained HTML). Published (owner's account) at https://claude.ai/artifact/4tjUk8wUXCQHwjKEFtm3uW (version 44 at time of writing). The owner asked that only this artifact be published/opened.
- Lineage: `agentic-setup-final-approach.html` (locked session-4 picks) -> `...-cards.html` (cards layout) -> `...-cards-copy.html` (copy document applied; published QP5FZ3qZrzZtnDgqCqpa2T, no longer updated) -> **`...-cards-critique-fixes.html`** (all critique fixes + every later comment). `...-cards-prateek-suggestions.html` is an older side branch: do not open, publish or touch it.
- Source documents (owner-supplied, not all in the repo): `references/agentic-onboarding-requirements.md` (journey), the **copy document** (`agentic-onboarding-copy.md`, applied in the copy pass; rules: sentence case, "Onboarding Agent", no operator names, sentence-case buttons) and the **walkthrough requirements** (`agentic-walkthrough-requirements.md`, summarised in 8f.5).
- `references/design-critique-cards-copy/`: the UI/UX critique (`Design_critique_cards_copy.docx/.pdf`), `build_doc.js` (docx-js, includes the decision log I-01..I-08), `capture.js` (env `FILE`/`OUT`), `data/ shots/ sheets/ evidence/ show/ after/` (measurements and before/after captures). The critique's decisions are all applied except the open ones in 8f.9.

### 8f.2 How the owner works (process that worked)
1. Owner leaves **comments on the published artifact**; each arrives as "[Artifact comment sent to Claude]" with a thread id and an anchor (element path + visible text). Comments are often short ("make it like this", "this is still not updated"), sometimes dictated with filler words, sometimes with a screenshot sent in chat afterwards.
2. Loop per request: edit file -> test with Playwright screenshots (read the PNG) -> commit -> push both branches -> republish the critique-fixes artifact (same file path + url) -> reply in the thread with `ArtifactComments` (reply must end with the Claude Code footer; include `acknowledge_duplicate:true` only for a genuine follow-up) -> resolve the thread unless a question is pending.
3. When a comment is ambiguous (no clear anchor), say what was assumed, or ask in the thread and leave it open. Never claim something was tested unless a screenshot was viewed; state what was not checked.
4. Figma MCP is unreachable from the session (proxy 403). The owner pastes screenshots instead. Do not try to fetch Figma.
5. Design taste: fewer boxes, single canvas, subtle blue, sentence case, calm motion, details that fill in, nothing clipped, alignment exact, "do not repeat the same text twice", CTAs near the content on success screens, primary action at the bottom elsewhere.

### 8f.3 Architecture reminders (still true) plus new anchors
- IIFE with `state`, `render()` and many override blocks. **All critique-era CSS is appended before the marker `/* ---- Design critique fixes ---- */`** (insert new rules there, they win through order and `!important`). Python edit pattern used throughout: read file, `s.index(marker)`, insert string, write.
- Steps: `"0"` Agreements, `"1"` Business profile, `"2"` Team, `"e0"` Brands and LOBs, `"e1"` GTM partners, `"e2"` Templates, `"m"` Kick off, then the product (Consent Migration page, walkthrough). Scenario picker (`AG_SCENARIOS`, buttons `[data-id="..."]`, click through `evaluate`): happy, locked-team, profile-partial/none/waiting, team-empty, team-later, brands-empty/review/paused/partial/rejected, gtm-norates, tpl-none, tpl-attention, success-pair, kickoff-open, kickoff-closed, mig-notopen, walkthrough-open, walkthrough-soon, return-open, return-unchanged, logout-unsaved, org-finished, review-return, mm-waiting.
- `window.__opPreview(kind, key)` previews a screen directly (kinds: loader, sum, success, nextup, details). Example: `__opPreview('sum','e2')` shows the Templates summary.
- Summary screens (`#agSummary`): `opSumModel`, `opGMarkup` (split layout), `opList`, `opCardGrid`, `opGtmCards`, `opTplSummary` (new), `opSumMarkup`, `agSummaryApprove` / `agSummarySkip` / `agSumSuccessData`, `opSuccessPaint` (receipt with stamp). `agOutcomeShell/agOutcomeView` render status and empty screens.
- Step bodies: `AG_STEPS` (agreements, profile, team data), `AG_ESTATE` (brands, GTM, templates), `agEstateRow`, `agGtm*` (GTM board), `agTplBoard`/`agTplMain` (template mapping), `agBrandBoard`, `agMigRow`, `agMigUnlockedMarkup`.
- **Loader document**: one big embedded HTML string `AG_LOADER_DOC` (single line starting `  const AG_LOADER_DOC = `). To edit a scene: extract the literal with node (`eval` the line after stripping `const AG_LOADER_DOC =` and `;`), write to a file, edit that HTML (scenes are `addScene((() => {...})())`), re-serialise with `json.dumps(doc, ensure_ascii=False)`, replace `</script` with `<\/script`, and write it back to the same line. Crop boxes per loader are `AG_LOADER_BOX` and `OP_BOX_NOCHIP` (search `kyc: [120,`). Standalone preview of a scene: open the extracted file as `file:///.../doc.html?test#<id>` after `addInitScript(() => { window.__AG_VI__ = 0 })`; ids: secure, match, kyc, kycv, brand, migval, consent, agreements, team, gtm. The host listens for `postMessage({agLoader:true, state|step|ended})`.

### 8f.4 Functionality, screen by screen (current behaviour)
- **Opening**: cover plays after both agreements are accepted, then the setup plan.
- **Agreements** ("Review and Accept"): left column **Agent Summary** (chip with the agent icon, prose with clause links, then a boxed note "This summary is only a guide. What you accept is the full text of the document."), a thin vertical separator, right column: Terms of Use / Privacy Policy tabs above the document (sticky header with widened background so scrolled text never shows at the sides), single divider under the header. Accept stays disabled until the reader reaches the end; the dock sentence names the document and signatory.
- **Setup plan ("Five steps, then migration")**: left: kicker, title, subtext, then three plan points as a light stacked list with small illustrations (no card chrome); right: five-step vertical stepper with one line each; CTA "Start with your business profile". (A five-card version was tried and the owner asked to return to this layout; only the three points changed.)
- **Business details loader** (scene `kyc`, one scene): sources DLT, GSTIN, MCA, Website, Trademark scanned on the left (source name fades in right of the icon while scanned); form on the right with fixed field names matching the Business Profile page (Legal Entity Name, Business PAN/TAN, Entity Type, Registered Address, Website URL (left empty on purpose, filled later by the agent), Primary Industry); a small source tag appears next to a field while it is filled. Crop box enlarged so the whole form is visible.
- **Business Profile form**: agent fills fields by **real typing** (focus, character-by-character with rhythm, caret, readonly restored); `agProfileTypeInto`. Submit needs the authorisation checkbox. Then the verify loader ("Checking your business details", scene `kycv`): stage 1 checks list, stage 2 telecom approvals; the scene **holds its last frame** and posts `ended` so the host leaves cleanly (no replay of stage 1, no blank gap). Result screen "Business profile approved" with per-operator rows.
- **Team loader** (`team`): labels "DLT platform", "People on record", "Suggested for review" (turns blue at the end). **Team step**: Suggested users table where **department is a dropdown** (Finance Operations, Legal & Compliance, Marketing, Technology, Billing, Operations; current value kept) and **role is a dropdown**; name/email/mobile read-only; edit pop-up removed; role filter and search follow changes. Summary role line now reads "Can approve consent policies" etc. (smaller, muted). Review button text "Review and edit". Team success/outcome layouts are centred.
- **Brands loader** (`brand`, single scene like KYC): sources scanned on the left; right shows the **enterprise as a container holding brand cards that hold LOB rows** (not a tree). No names are shown (owner request): placeholder bars with generic "Enterprise" and "Brand" captions. Brands summary lists cards with an evidence icon (document with check) per LOB; success stamp is green.
- **GTM**: loader then summary (`op-gk` cards): "Why it was chosen" highlighted callout, three rates each on its own row (title left, rate, allocation %), scrubbing rates SMS/Call/RCS in a footer line, not-selected partners as expandable rows. **Review opens the compare-and-allocate screen directly** (`agGtmManualBoard` select partners with BEST tags and search; then `agGtmAllocBoard` set distribution, full width, Back / Save changes). No intermediate card screen, no Cancel. `agGtmEnsureManual` forces that screen whenever the step is not done. **Accept on the summary** (`agSummaryApprove('e1')`) uses the suggested partners and split and goes straight to the success state and the next loader. Save changes also completes the step.
- **Templates**: loader, then summary reimagined for hierarchy (`opTplSummary`): headline card (ring, "98 of 100 templates have a suggested line of business", one confidence bar high / need review / unmapped, legend), then "Lines of business" rows ranked by review needed (name, brand, small bar, suggested and need-review counts). Review opens the mapping board (`agTplBoard`): banner "A mapping change is only saved when you send the template for approval...", LOB list card, filter chips with select-all checkbox, rows with drag handles, confidence pills, pagination. Success hand-off then the kick-off finale.
- **Kick-off finale**: "You're set to start migration", "Migration closes in" 30-day clock (days / hrs / mins), pill "Closes in", button "Go to migration". Rail progress line stays inside the pill.
- **Consent Migration page** (matches the owner's Figma frames): header, 3-step strip with mono dates (`opMigDay/opMigDate`), empty state with **New Upload**, CSV format table; always shows the open state.
- **Success screens**: blue check disc with ring stamp in the step flow; the summary-level receipt stamp is green (owner request); actions sit near the content on success screens; Team centred.
- **Status / empty / search states**: `agOutcomeShell`; `agSearchEmpty` for no results.
- **Rail**: white selected icon, hover only on the icon, step progress line inside the pill, "Closes in" pill bottom-left.
- **Accordions** (summary side panel): chevrons right, square rows, last open by default (`opCollapse`); side chip reads **Agent Summary**.

### 8f.5 Walkthrough (first landing in the product)
Spec (owner's doc): plays once per user; four cards: Workspace, Admin, Operate, New Upload; buttons Previous / Skip / Next; the last card forward button is now **Upload consents** (owner override of the doc's "New Upload"), shown in both window states; highlighted groups: Workspace (Home, Manage Assets, Brands & LOBs, Promo Template Mapping), Admin (User and Roles, Finance, Audit Trail), Operate (Migration, Approvals, Integrations, Consent Acquisition, GTM Partners); Analyse is not highlighted. Card 4 tags the page's real **New Upload** button: a copy is lit above the scrim and tracks the real one each frame while the real one is hidden (only one button is ever seen); if there is no room beside the button the card sits above/below it, never behind the nav. Not-open text: "You can upload consents here once the migration window opens on {date}." Motion: card glides between positions (FLIP, `agTourRemember/agTourSettle`), progress bar fills, glow on highlighted group, reduced motion = no movement (not re-tested).

### 8f.6 Design decisions locked (do not reopen without the owner)
Blue success disc + ring stamp (summary receipt green); actions near content on success screens; Team centred; GTM details as cards then direct edit/allocate flow; no dark "organisation finished" screen (coloured text below the chip in A1/A2); accordions as above; Consent Migration page per Figma; walkthrough four cards; Agent Summary naming; copy rules in 8f.1; buttons 36px/8px radius.

### 8f.7 Test harness (all paths absolute; Chromium `/opt/pw-browsers/chromium`, Playwright `/opt/node22/lib/node_modules/playwright`)
- Boot: `goto file:///home/user/AgenticSetup/<file>`, wait for `#agAcceptBtn`, scroll `.ag-agree--canvas` to the end, set `disabled=false` and click `#agAcceptBtn` twice (2.5 s apart), then wait for `[data-nextup-go]` and click it.
- Business profile: wait for `#kycBusinessForm .kyc-control.is-filled[name=website]`, check `#kycAuthorized`, click `.kyc-submit` once enabled; verify loader runs ~25 s; result screen follows.
- Estate steps: scenario `happy`, then click `[data-action="ag-estate-confirm"]` (brands), wait for `#agSummary .op-gk` (GTM summary) or `#agSummary [data-sum-details]` (Review) / `[data-sum-go]` (Accept).
- Typical captures: frames every 1.2 s, tile with ffmpeg (`-pattern_type glob`, `tile=4x4`), read the sheet. Scratch scripts lived in the session scratchpad (not in the repo); recreate from the patterns above.

### 8f.8 Things to remember when starting the new approach
- A single big file with layered overrides is hard to change; the loader scenes (`AG_LOADER_DOC`) are the most reusable asset (KYC, kycv, team, brand, gtm, agreements scenes plus engine helpers `kvBeam`, `c.fly`, `c.ripple`, `c.focus`, `nd()`, `core()`).
- The copy document, the critique docx and the requirements md are the contract for wording and behaviour; the HTML is only one implementation.
- Keep screenshots as evidence; state what was not tested.

### 8f.9 Open items / undecided
- Critique items awaiting the owner: I-04 (which form of the status component), I-08 (card tag slot position), S-05, S-07, PM items V3-01/05/14/18, I-05 (template confidence UI).
- Walkthrough "window not open yet" card 4 copy versus a Migration page that always shows the open state; closed-window variant unreachable.
- Three older threads were left open for questions (GTM edit flow, Template scan, kick-off counter).
- Not re-tested: reduced-motion for walkthrough and the new loaders, narrow windows (1000x650) for the new Agreements split layout, Team summary after inline edits, the blinking caret during profile typing, Team loader labels inside the full flow, Brand/other loaders at other viewport sizes.
- Figma frames the owner referenced (node ids, e.g. 10501-112019, 10501-112033, 21531-38304) could not be fetched; screenshots were used.

### 8f.10 Deck variant: `agentic-setup-deck-enhanced.html`
- Source: the owner's `DigiConsent_Agent_Deck_1.html` (kept untouched at `references/DigiConsent_Agent_Deck_1.html`): gate, cover, horizontal five-card deck where the agent analyses all steps in one pass, then the user reviews card by card, with an inner "deep" page per card.
- Enhanced build is generated by `references/tools/session5/deck-enhanced/build.py` (patches the source; `css.css` is the override block, `deep.js` replaces the deep-page section). Re-run it with `python3 build.py` after editing the parts (paths inside point at /tmp; adjust).
- Changes: product tokens (blue, soft canvas), DigiConsent wordmark top-left, account chip with progress ring and **Log out** (confirm dialog, unsaved-aware, signed-out screen), **Closes in** pill bottom-left, prototype menu moved bottom-right.
- **Order and gates**: Business profile -> Team (invite or skip) -> GTM partners -> Brands and LOBs -> Templates. A step opens only after the previous is done (or skipped, for Team); locked cards show a blurred lock face with the reason; profile counts as passed only after operator approval; brands sent for review keep Templates locked until approved.
- **Inner pages** (match the product's review pages): shared-element expand from the card, deck eases back, staged entrance; aside = Agent Summary + accordions (what was checked, sources, what happens next); Team (Users / Roles tabs, search, add user, mobile, department and role dropdowns, remove), GTM (select partners with BEST tags, then per-phase allocation with totals = 100, same-for-all toggle, split bars, terms), Brands (enterprise container, editable brand names and LOBs, add brand), Templates (stats, LOB list, filters, search, bulk assign, drag handles, pagination), Profile (logo slot, source tags).
- Not tested: reduced motion, narrow windows, the unsaved-changes logout message, brands "send for review" path with the new gates.

### 8f.11 3D card environments (two options for the owner to pick)
Built from `agentic-setup-deck-enhanced.html` by `references/tools/session5/deck-enhanced/build3d.py` (replaces `layout()` with perspective transforms, adds an environment layer and a HUD):
- `agentic-setup-deck-3d-stage.html`: dark hall with a light shaft and floor grid; side panels angled like a corridor, floor reflection, left icon rail to jump between steps.
- `agentic-setup-deck-3d-glass.html`: soft room, frosted glass cards on a curve, control capsule under the focused card (previous, step name and status, Details, next) and progress dots.
In both, the step in process is the large, forward, fully lit card and the others recede.
- Owner picked **Glass (B)**. Update: out-of-focus cards are stacked at a steeper angle (56 deg), tighter and fainter, and each shows a gradient **front face** (step icon, name, status such as Queued, Working, Your review, Locked, Done, with a sweep of light). The card in focus **flips** (rotateY) to its details face. Opacity is applied per face (`--o`) because opacity on the card would flatten the 3D flip. Faces are rendered by `faces()` in the HUD script.
- Processing stage (phase analyse) now reserves side room (+92 gap, narrower focus card) so neighbouring cards and their step names stay exposed, like the review stage.
- 3D decks: full-width top header replaced by a top-left identity pill (logo, user, icon-only Log out).
- 3D decks: agent head is centred at top (blob above, kicker, title, narration centred, soft glow).
- 3D decks: identity is a slim vertical pill top-left (logo mark above, initials avatar below); hover or focus opens a flyout with wordmark, name, role and Log out.
- Glass deck: bigger cards (AW 760, review 570/620), step pill removed; bottom-centre arrows with dot stepper (#cap3 now only nav). Loader area flexes to fill the taller card.
- Glass room: horizon/floor moved to the bottom (~79%), aurora-tinted wall, glow line at the horizon, light pool under the card.
- Glass deck: agent narration no longer prefixes the step name (narrate pre is empty).
- Glass deck: every unfocused card has a vertical step-name + status label on its exposed outer edge (.cf-v); layout toggles is-right for cards after the active one.
- Version C: agentic-setup-deck-3d-glass-rail.html (Glass plus a left 'Setup steps' rail below the identity pill, compact 3-line agent head with blob at left, bigger cards, left edge fades). Built by the third make() call in build3d.py.
- Rail variant: steps are now an icon-only vertical pill (connected dots, active filled blue, done = green badge, locked = lock badge, label chip on hover), like the main prototype.
- Fix: the source deck defined typeInto twice (cover line vs input typing); the second one overrode the first so the opening cover text never showed. Input version is now typeIntoField (patched in build.py).
- Ring finale (3D decks): when processing ends, cards ease onto an arc (setMode('ring'), same transform function list so transitions are smooth) around a centred 'ready for review' message with a Start review button; clicking it hands off to startReview(). Rail variant: steps pill vertically centred. UNLOCK_JS in build3d.py replaces unlock().
- Ready screen now uses the overview-style row of five tilted cards with the ready message and Start review below (replaced the arc).
- Ready screen layout: message at the top, card row in the middle, Start review below the cards; cards stagger in from the centre and stagger out on Start review; text and CTA fade in after the cards settle and fade out fast.
- Ready screen now mirrors the finale layout: centred blob + kicker/title/subtitle header, card row beneath, Start review under the cards.
- 3D decks: the Review and accept gate has no card box (transparent, hairline dividers only).
- 3D decks: the accept gate fills the available height (about 1200px wide).
- 3D decks: top space trimmed (gate inset 24px, deck inset 30px).
- Processing view (3D Glass and Rail): header text hidden while the agent works; the blob sits alone at top centre (bigger, with a pulsing beam to the card); the telemetry line shows inside the focused card under the title (.tele, mirrored from #narr by a MutationObserver).
- 3D decks (Glass, Rail): focused card crisper (no will-change, no depth lift, no filters); blob near the top with an animated beam to the card while processing (beam height measured live; header height drops to 96px while working and layout re-runs); profile card re-laid out as the KYC form (enterprise logo with shimmer then reveal, starred labels, select-style fields, 7 fields typed in, authorisation text). KYC array and build3d patches in build3d.py; logo data URI in hdfc_logo.b64.
- Rail only: in the review stage the agent header keeps just the blob (details live in the card); source tags removed from profile fields. Note: from here on only the Rail build is changed; Glass and Stage files are left as last published.
- Rail only: processing now plays an in-card agent ingest scene (dark neon card; source chips fly into the agent blob, ring and progress, then the blob lifts and the furnished details appear as toggle rows). Built in RAIL_C_JS (playFx, fxSphere, FX_DATA) and RAIL_C_CSS (.fx). The iframe loaders are no longer used in Rail. The top header and blob are hidden while working and in review. About 5.5s per step instead of about 14s.
- Rail ingest scene v2: sources arrive as glass cards (title, skeleton lines, Reading status) from the sides; a captions block at the top of the scene states what the agent is doing (Source n of N / Reading X / Processing / Ready for review); segment bars, percent label, dashed ring and the in-card telemetry line were removed as redundant.
- Rail only: processing is one scene (analyseAll, IG_SRC, igEnsure in RAIL_C_JS; .ig CSS): six source icons orbit the agent blob on the left, each focuses, shows its name and 'feeds N steps', then flies in; the five step cards sit as rows on the right (layout mode 'ingest', body.mode-ingest) and fill in parallel; then they move to the ready row (ring mode). About 9s total. Per-card playFx scenes removed. Glass and Stage unchanged.
- Rail only: processing is now a staged scene (analyseAll in RAIL_C_JS): five cards on a curved arc at the top (layout mode 'ingest'), the agent blob on a podium front and centre, six sources on the floor below. The agent pulls each source (thread plus particles to the blob), then sends blue threads up to the cards that source feeds; the cards' progress and status update. Neutral sources, blue only for the information flow. About 17 s. Steps pill is now horizontal at the top centre; the bottom arrows and dots are removed; the deck starts 80px from the top.
- Rail only: the steps pill is visible only in the review stage (body.ph-review).
- Rail only: processing scene v3. Blob stands on its podium; all six sources sit in one glass tray at the bottom; caption on the left and a running 'insights sent' log on the right of the blob; data flows as fibre bundles (glow ribbon, two fine strands, comet streaks) that fan from the blob up to the cards, plus faint circuit guide lines and arcs behind the cards. Steps pill moved to the bottom centre in review; the review card sits higher. CSS note: RAIL_C_CSS blocks are prepended, so older equal-specificity rules win; use '.sg .x' selectors to override.
- Rail only: processing scene v4 follows the 'presence' reference. The agent blob stands on its podium with six source cards flanking it (three each side); ribbons (glow, fine strands, end dot) connect every source to the blob for the whole scene and a steady trickle of comet streaks flows in from all of them, brighter for the source being read; fibre bundles fan up from the blob to the five cards on the arc; the caption sits under the blob. The tray and the insights log were dropped.
- Rail only: processing scene v5 follows the minimal 'orbit nodes' reference: round icon-only source nodes (three each side, name underneath), thin elbow lines to concentric rings around the blob, dashed lanes running in from the stage edges (animated), comet streaks along the lines for all sources, brighter for the one being read.
- Rail only: processing scene v6 follows the 'logo belt' reference: large round source badges ride two belts (three each side) towards the agent, which has extra rotating arcs; the nearest badge on a belt is read (blue line, comets, belt speeds up) and drawn into the agent, the rest slide up one slot. Reading alternates left and right (DLT, Company website, GSTIN, Partner rate cards, MCA, DLT templates).
- Rail only: processing scene v7. Source nodes stay put (no absorption): coloured badges (DLT indigo, GSTIN amber, MCA green, website sky, rates violet, templates pink) with a spinning ring while read and a green check after. Step cards are tighter and overlap on a steeper arc, each with an accent colour, a larger icon, an accent top edge and one dot per source that lights up as it is read. Connections are one clean curve per link with ports at both ends and short light pulses travelling along them; links to the cards come from the agent. An extra 1.5s pause was added after the layout so the link geometry is measured on the settled layout.
- Rail only: processing scene v8. Sources sit in one row beside the blob (three each side, straight links through the row); palette is almost all blue (source and card accents are shades of blue; green only for the small check badges).
- Rail only: processing scene v9. Step cards sit on a 3D arc behind the agent blob (layout mode 'ingest', concave cylinder with perspective). Cards are processed one by one: each spins a full turn about Y (WAAPI 'rotate: y 360deg'), lifts forward, gets data from the sources that feed it and settles with a ready state. Six sources sit on a lit arch band under the blob (no connector lines; small light orbs fly source to agent to card). A live 'Agent telemetry' panel at the top logs what the agent is doing with timestamps.
- New variant agentic-setup-deck-3d-glass-rail-tether.html (copy of Rail, made by references/tools/session5/deck-enhanced/build_v2.py which patches the built Rail file): same top card arc and telemetry; blob moved lower; sources ride two curved paths either side of the blob; while a card is processed a luminous tether beam runs from the blob to it with a locking ring and streaming light, and the card turns in 3D.
- Tether variant layout v3 (build_v2.py then build_v3.py): blob top centre with six sources floating softly around it and no connector lines or arcs, a one-line telemetry pill under the agent that only shows what it is doing now, five step cards in a row at the bottom; the tether beam runs from the blob down to the active card.
- Tether variant: bottom cards now sit on a clean arc facing the camera (tilted along the arc, no perspective skew); telemetry is just one line of gradient text under the agent (no title, no time).
- New variant agentic-setup-deck-3d-glass-rail-cards.html (references/tools/session5/deck-enhanced/build_v4.py patches the built Rail file): processing goes back to the per-card product loaders inside the carousel cards, sped up (time shim inside the scene frame, each loader capped at 7.6s, shorter pauses; about 9s per card instead of about 14s) with a 'Preparing step n of 5' pill at the top; when done the cards stay closed (face side, now showing the result in plain words) with a left panel 'Your five steps are ready for review' and a Review button; clicking it flips the first card open and starts the normal review.

- Cards variant fix: `resetAll()` and `startReview()` now clear the ready panel (`#readyL`), the processing caption (`#pcap`) and `body.all-closed`, so a restart or fast click never leaves a stale left panel or collapsed header next to an open card; the header stays hidden while the ready panel is up. Checked at 1000x620 (ready state, Review click flips Business profile open).

- Cards variant: Prototype menu gets "Ready for review" (jumps straight to the closed-cards ready screen); clicking a closed card also starts review. Earlier stale-panel/header state came from the Prototype jumps not clearing the ready panel (fixed in a01e483).

- ROOT CAUSE of "published page differs from preview" (Cards + Tether): publishing rewrites every html on disk with a leading skeleton (`<!doctype html><html><head>…<style>…</style></head><body>` + a nested real doc). build_v2/v4 read that wrapped Rail file and `rindex('</style>')` before the first `</head>` put all new CSS inside the skeleton's style block, which the host drops. Builders now `_unwrap()` the source first, so CSS lands in the real `<style>`. Always verify by Artifact `read` of the published copy and rendering that saved file.

- Cards variant: removed the step list from the ready-for-review left panel (comment request); panel is now kicker, title, line and Review button.

- Cards variant: STEP n OF 5 label moved to the right of every card header; status chip and the top 'Preparing step' pill removed; in-card telemetry shimmers as processing (comment 19abfb88).

- Cards variant: confirmation BEFORE the agent starts. After the cover, the five steps show as closed cards with a left panel (title, one line, the five steps with what the agent will do, 'Start AI setup'). Click starts processing; after processing the existing 'ready for review' panel asks to confirm review. build_v4.py execs p8.py (kept beside it).

- Cards variant: closed cards start on step 1 (not GTM); removed the 'Five steps, prepared at once' intro step: the cover fades straight to the Start AI setup screen (comments cee57bf2 + user message).

### 8f.12 Glass Rail line: everything done to date, and the LATEST file is `agentic-setup-deck-3d-glass-rail-blue.html`

**Latest file = Blue.** Only the Glass Rail line is edited (Glass `…-3d-glass.html` and Stage `…-3d-stage.html` stay untouched). Build chain (scripts in `references/tools/session5/deck-enhanced/`, the working copies live in `/tmp/bd/`): `build3d.py` → Rail; `build_v2.py` + `build_v3.py` → Tether; `build_v4.py` (+ `p8.py`, exec'd by it) → Cards; `build_v5.py` → **Blue**. Publishing rewrites every html on disk with a leading skeleton; builders must `_unwrap()` their source first, otherwise added CSS lands in the skeleton `<style>` which the host drops (this caused the "preview differs from the browser" bug). Verify by `Artifact read` of the published copy and rendering that saved file.

Variants (artifacts): Rail (Js3PyS4zJaaMTiU5PXwmbi), Tether (83555wbQW9XYN1GPyVWchg), Cards (Y2Ms9ZAtD6c8pEatMmfcvi), Blue (new, see git log).

What the Rail line does, in order of the flow:
1. Agreements gate → cover (blob, three typed lines) → the cover fades straight to the **Start screen**. (The old "Five steps, prepared at once" intro step was removed.)
2. **Start screen (Cards/Blue):** five closed cards at the right (front card = step 1), left panel: kicker, "Your agent will prepare five steps", one line, the five steps with what the agent does for each, button **Start AI setup**. Nothing runs until the click. Prototype menu has "Ready for review" to jump straight to the next screen.
3. **Processing (Cards/Blue):** one card at a time, each with the product's loader scene in an iframe, sped up (timers, WAAPI durations and tween divisor divided by 1.7, scene cap 7.6 s; about 9-10 s per card, ~50 s total). The "STEP n OF 5" label sits at the right of each card header; status chips and the old top pill are removed. Telemetry (current action) is mirrored from the active card.
4. **Ready screen:** all five cards closed again, left panel "Your five steps are ready for review" + **Review them** (no step list, by request). Clicking Review (or a closed card) flips Business profile open and starts review.
5. Review: card flip animation, open card, steps unlock in order, KYC profile fill, deep review pages, finale.

Rail-line features accumulated earlier: 3D card arc with per-card spin, sources on a lit arch, live telemetry from a MutationObserver, steps pill / header changes, KYC profile layout with logo and fill animation, closes-in pill, avatar progress ring, focus/overview/ring/ingest layout modes (CSS 3D, WAAPI `rotate`/`translate`, SVG offset-path comets).

**Blue variant (latest):** copy of Cards with (a) closed cards restyled like the reference card the owner supplied: dark navy glass, round blue gradient icon disc, white title, grey description, ghost pill chips, blue/violet glow in the bottom-right; (b) while processing, the agent block at the top is a dark glass card in the same style (blue disc with the agent mark, pulsing rings, drifting conic glow, step kicker, shimmering live telemetry line, five progress segments). In-card telemetry line is hidden because the top card carries it. Open (review) cards stay light for readability.

Open items: small windows (<760 px high hide the step list on both panels; top agent card shrinks under 700 px); reduced motion for several variants untested; closed-card queued state in Cards is grey-blue, in Blue it is navy; artifact watch limit (10 per session) means comment notifications for newer artifacts do not wake the session.

- Blue: removed the step list from the Start panel (comment 8a824c7d); panel is kicker, title, line, Start AI setup.

- Blue: replaced the separate top agent card with a top band (gradient wash from the top with drifting glows, agent disc, live telemetry). In review the band shows 'What the agent did' + 'Action needed' for the active step and a minimal stepper (replaces the bottom rail; clickable for unlocked steps). Comment c517a00e; its text was garbled so this is an interpretation.

- Blue: top band changed from a gradient wash to a solid dark panel (telemetry, 'what the agent did', 'action needed' and the minimal dot stepper all inside it, stepper on the right of the first row); comment afe0d894 said the gradient took too much attention.

- Blue: top panel now shows the step NAME with one line of text under it (telemetry while processing; 'what the agent did. action needed.' in review); 'Step x of y' removed; the two-column did/action block dropped (comment 543894d5).

### 8f.13 Agent variant: `agentic-setup-deck-3d-glass-rail-agent.html` (newest; built from Blue by `build_v6.py`)
Reference the owner gave: a dark-to-violet hero where the product talks to the user, pill buttons under it, soft dotted gradient. Implemented as: (a) a dark navy hero at the top (dotted texture, soft blue glow, fades into the light page) where the agent speaks: small accent line, a headline in the agent's voice ("Working on your business profile", "Business profile is ready", "Please review your business profile", "I'm filling in your business profile"), one line of live telemetry / result / action under it; (b) five step pills under the headline (queued dot, spinner while working, green check when ready/done, current one white), clickable in review for unlocked steps; (c) the screen edge glows (animated conic border + inner glow) while the agent works, and flashes green when a step finishes; (d) nothing else at the top. Same flow as Blue otherwise (Start screen, processing, ready, review). Under 760 px height the greeting line is dropped.

- Agent: hero text and step pills are now centre-aligned over the card (comment aee2608a).

- Agent: the hero moved to a left panel (dark gradient fading right, headline, one line, step pills stacked vertically); cards shift right of the panel and the fan is compacted (extra negative gap, width fit accounts for panel + fan). Panel width min(400px, 28vw).

- Agent: left panel softened (mid-blue gradient instead of near-black, lighter text and pills) per comment ce42342b.

- Added `agentic-setup-cards.html` (uploaded by the owner, 819 KB, title 'Agentic Setup Cards'); committed as given, not generated by the build scripts.

- agentic-setup-cards.html (owner's hand-edited Agent version, now edited in place): AI processing no longer opens each card like the review page. During analyse the five cards form a curved glass wall (convex, ~17 deg steps) below a strip that plays the product scene; the active card lifts forward, glows and shows its live check text on its closed face; finished cards show their result line. Ready/start screens use smaller cards (x0.78). Hidden agent column no longer intercepts clicks. Patch logic lives in the file (arc-mode, topLd, layout arc branch).

- agentic-setup-cards.html: processing view is now a true 3D ring (5 cards on a circle seen slightly from above, ring turns one step per card via rAF so cards travel on the circle), product scene plays in the middle of the ring, only the front card is flipped white (live checklist / result), the rest stay dark; more padding inside cards and gaps between them (comment c89e7406).

- agentic-setup-cards.html: the product scene now plays INSIDE the white front card (not in the ring centre / above); cards 340x492 in the ring (comment e19fb1fc).

- agentic-setup-cards.html: ring seen straight on (tilt 0) so all cards sit on one horizontal line, gap 30 (comment e1b2c0af).

- agentic-setup-cards.html: scene inside the front card has no border and is larger (cards 392 wide); non-focus ring cards blurred 2.2px (comments 93af4284, fd63aba1).

- agentic-setup-cards.html: ring moved up; ready-for-review screen keeps the same ring turning slowly on the dark sides (ringIdleStart, class arc-idle); checklist removed from the white card; card 450x540 with a larger scene (318 px high) and a bigger live caption + progress bar under it (comments f2f60362, fe9fadec, 2bc33772). Scenes themselves are still the landscape product scenes; a true portrait recomposition would mean rebuilding each of the five scene layouts in LOADER_DOC.

### 8f.14 Cards (user file) — portrait loader scenes
- `agentic-setup-cards.html`: the ring's white front card is now taller (ring card 450x650, `.ld` 470px). The five product scenes (kyc, team, brand, gtm, match) were recomposed as portrait 360x410 stages instead of scaling the landscape ones, so elements use height rather than width.
- A second embedded doc `LOADER_DOC_P` (built by `references/tools/session5/deck-enhanced/portrait.py` from the original `LOADER_DOC`) is used only by `playLoader`; the review-step `kycv` scene still uses the landscape `LOADER_DOC`.
- kyc/brand: sources in a row on top, agent under them, result card below. team: registry on top, 2x2 people, invite list as a row of three. gtm: 2x2 partners, allocation and summary side by side below. match: stream | agent | lanes as three tall columns.
- `ptest.js` renders one scene standalone at 360x410 for checking.

### 8f.15 Cards (user file) — finished state
- `agentic-setup-cards.html` finale: larger gradient success check that pops in, draws its tick and pulses rings; confetti burst (skipped for reduced motion); green-rimmed step cards; the migration-window countdown sits in a frosted panel with a live dot and a glowing button.

### 8f.16 Cards (user file) — review stack no longer overlaps the left text
- In review (`has-tband`), finished steps now tuck behind the front card as a narrow peek (about 34px per step) instead of spreading left under the title and message. The left text keeps its full width.

### 8f.17 Cards (user file) — review stack both sides, authorisation row
- Review: upcoming steps on the right now peek behind the front card like the finished ones on the left (perspective-corrected offsets).
- Review footer: the "I'm authorised to submit this KYC" row has no grey background.

### 8f.18 Cards (user file) — left panel agent
- The left panel's agent blob is smaller (58px) and sits in a row with a "DigiConsent agent" pill above the title, instead of floating alone over it. Applies to processing, ready and review.

### 8f.19 Cards (user file) — crisp focus card, bigger profile form, richer ready state
- Focus card: no backdrop blur; the lock veil on locked steps is a plain light overlay (no blur); the staggered "materialize" entrance no longer uses blur (it left list items looking blurred).
- Business profile review form: larger logo, labels and fields (50px) so it fills the card.
- Step ready state (after processing): bigger success mark, a stats row (sources read, checks done, step to review), the crisp timeline, and a "Next" hint with the action for that step.

### 8f.20 Cards (user file) — smoother ring flip
- The ring's card flip now follows the ring position (`--flip` set per card in `ringPaint`, eased) instead of snapping when a card becomes primary. A card's header and details fade in only once it has settled at the front (`--cc`), so nothing busy shows while it turns. The idle ring stays on the dark face.

### 8f.21 Cards (user file) — Brands animation uses placeholders
- Brands and LOBs scene (portrait doc): no invented names. "Your enterprise", brand names, "Brand" caption and "Product line n" are now skeleton bars and empty pills (builder: `portrait.py`).

### 8f.22 Cards (user file) — agent summary chip
- Left panel: the big agent blob is removed; an "Agent summary" chip with a small static blob on its left sits above the title.

### 8f.23 Cards (user file) — chip blob, centred active card
- The "Agent summary" chip shows a small static particle-sphere blob (canvas drawn once) with the core in the middle.
- Ring: the front card is now exactly centred in the space right of the left panel (the panel offset is divided by the perspective factor, which had pushed it right).

### 8f.24 Cards (user file) — Brands scene tag as icon
- The "Enterprise" text tag in the Brands scene is now an icon-only pill.

### 8f.25 Cards (user file) — card style switcher (5 dark, 5 light)
- A switcher at the top centre picks the dark face (Now, Aurora, Editorial, Neon, Brand, Graphite) and the light face (Now, Porcelain, Tinted, Neo-ink, Frost, Spine). It sets `body.dk-N` / `body.lt-N` and remembers the choice in localStorage. "Now" is the previous look. All skins are CSS overrides at the end of the main stylesheet ("CARD SKINS" block).

### 8f.26 Cards (user file) — new card icons
- `cfArt` redrawn: each step has one glass tile with a crisp white line glyph (ID card, people, layers, bars, document) instead of the stacked 3D shapes. Tile and glyph colours are CSS variables (`--ig1`, `--ig2`, `--igs`, `--igr`, `--igo`) set per dark skin, so each style gets matching icons (violet-teal, amber outline, cyan neon, white, gold).
- The light card header icon is now a gradient tile with a white glyph.

### 8f.27 Cards (user file) — glassy minimal icons
- `cfArt` v3: a frosted-glass tile (translucent fill, soft highlight, gradient rim) with a thin 6px line glyph and a coloured glow behind it; replaces the solid blue tile. Skin variables: `--ig2` (glow/tint), `--igg` (glyph glow), `--igs` (glyph stroke), `--igo` (tint strength).

### 8f.28 Cards (user file) — Azure dark style
- Added dark style 6 "Azure": bright sky-blue frosted glass with a soft light bloom and glass icon tiles (user asked for the dark card face in blue). Switcher now lists six dark styles.

### 8f.29 Cards (user file) — brand blue default, text at the bottom
- Dark style 6 renamed "Brand blue" and retuned to the product blue (#2563eb); it is now the default dark face (the previous indigo style is "Indigo", slot 4). Stored choices still win.
- Dark face layout: status pill on top, icon in the middle, title and result at the bottom (flex order on `.cf-*`).

### 8f.30 Cards (user file) — styles locked
- The style switcher is removed. The look is fixed to dark "Brand blue" (`dk-6`) and light "Porcelain" (`lt-1`), set on `body` by a one-line script. The other skin CSS stays in the stylesheet unused.

### 8f.31 Cards (user file) — brand logo in the Agent summary chip
- The chip's blob is replaced by the brand logo (the same image as the top-left rail logo, copied from `.hdr .mk img` when the left panel is built).

### 8f.32 Cards (user file) — active line always centred
- Left panel task list: blank rows before and after the list, so the active line always sits in the middle row, including the first and last step (previously the last step slid to the bottom row).

### 8f.33 Cards (user file) — amber attention subtext; note line removed
- Dark card subtext turns amber (with a dot) when the step has something for the user to act on: GTM partners and Templates while ready or in review (`attn: true` on those steps).
- Removed the "Submitted for approval. Your team step opens as soon as it's approved." line under the profile check animation.

### 8f.34 Cards (user file) — closer, more compact cards
- PM feedback: cards looked like credit cards. Ready-screen ring is smaller with only a 4px gap between cards (440x560, scale x0.86); finale row and overview use a 10px gap; the fanned stack steps are tighter; corner radius is 22px; the "•••• 01" placeholder text is now "Step 1 of 5".

### 8f.35 Cards (user file) — brands as a hierarchy tree
- PM (Pratyush): the brands step is a hierarchy. In the review card, the enterprise sits at the root with brands as branches and lines of business as leaves, joined by connector lines (`.htree`/`.hlobs`). The Details page editor uses the same tree connectors (`.bgrid` > `.bcard` > `.lobrow`).

### 8f.36 Layout directions exploration (no change to the prototype)
- Problem: the card format shrinks content text and breaks on short windows; the processing ring reads as credit cards.
- Four directions mocked up at 1440x900 (agent processing and review for each), in `references/design-directions/` (`layout-directions.html`, builder `build.py`, PNGs in `png/`): A Workspace + Rail, B Top Dock, C Agent Console, D Mission Board + Folder Tabs. Waiting on the user to choose a direction before building it into the prototype.

### 8f.37 Console variations (no change to the prototype)
- User leaned towards C (Agent Console) but felt it had too many boxes. Three lighter variants mocked up in `references/design-directions/` (`console-variations.html`, `build_c.py`): C2 Open surface (no sheet, underlined fields), C3 Light console + ledger (flat label/value rows, breadcrumb), C4 Steps inside the console (vertical stepper in the blue panel, settings-style sections). C1 is the original for comparison.

### 8f.38 Direction chosen: C2 (Open surface). Processing screen options
- User picked C2 (blue console on the left, open surface on the right). Three agent-processing options mocked up in the C2 shell (`references/design-directions/processing-options.html`, `build_p.py`, PNGs `png/processing-P*.png`): P1 Lanes board (the style the user attached), P2 Tabs carry the progress, P3 Pipeline (sources, agent, five steps joined by lines). Next: user picks one, then build C2 and the chosen processing screen into the prototype and test at short heights.

### 8f.39 C2P2: new prototype file `agentic-setup-C2P2.html`
- Direction chosen: C2 (blue agent console left, open white surface right) with P2 processing (tabs carry the progress). Built as a new standalone file; the cards deck is unchanged.
- Flow: start (queued list + Start AI analysis) > processing (five tabs fill in turn, the focused step shows its sources, the form or list filling in live, tabs show the result line when ready, GTM and Templates amber) > ready > review (one step at a time, later steps locked, finished tabs clickable) > finished.
- Review screens: profile form with authorise checkbox and operator-check wait, team table with ticks and roles, brands as a hierarchy tree with removable LOBs, GTM partners with two-partner rule and phase split, templates list with LOB filters. Needs-you note and What I did / What happens next live in the console.
- Short windows (height under 700 or width under 980): the console collapses to a top bar, the surface scrolls, the footer stays pinned. Jump menu bottom left ("Prototype"); URL hashes `#proc #ready #r0..#r4 #final` jump directly.
- Builder parts in `references/tools/session5/deck-enhanced/c2p2/` (head + body, logo is injected from the rail logo).

### 8f.40 C2P2: the real loader animations on the right
- The processing surface now plays the product loader scenes (same `LOADER_DOC` as the cards deck, landscape, sped up 1.7x, cropped with the cards deck's `LD_BOX` boxes) in an iframe on the right: kyc for Business profile, team, brand, gtm, match. The hand-written live fills were removed.
- Scene step messages drive the tab bar and the console checklist; a scene ends on its own (7.6 s limit) and the next tab starts. The Brands scene uses placeholder shapes instead of "Brand A / Product line n". Reduced motion skips the scene and just advances.

### 8f.41 Cards (user file) — processing as a card stack (from the user's screen recording)
- Replaced the 3D ring during AI processing with the stack from the recording: the open step is one tall card; upcoming steps wait above it as narrowing dark pills (title + "Queued"), finished steps settle below it as pills (title + result with a green tick). When a step finishes its card shrinks into a pill and the next pill grows into the open card (width, height and position transition together; the white card fades in after it has expanded, then the scene starts).
- Code: `stackPaint()` and `body.stack-mode`, a `.pillf` face added to every card, `fitScene` uses fixed card dimensions while the stack is on. The ring is kept for the idle "ready for review" screen (the stack hands over to it when processing ends).
- Backup before the change: /tmp/bd/cards_pre_stack.html (not in the repo).

### 8f.42 Cards (user file) — wider stack card, original landscape animations
- The open card in the processing stack is now 780x540 (pills follow its width) and plays the original landscape loader scenes again (`LOADER_DOC` with `LD_BOX`), not the portrait ones. Portrait doc `LOADER_DOC_P` is no longer used during processing.

### 8f.43 Cards (user file) — bigger open card in the processing stack
- Open card 900x590 (was 780x540), scene area 400px high, pills tightened (gap 8, step 18). Still fits 1440x900 without scaling down.

### 8f.44 Cards (user file) — back to the 3D ring with the vertical animations
- User asked to go back to the 3D circle with the vertical (portrait) animations. A switch `STACK_ON = false` now selects the ring + portrait scenes (`LOADER_DOC_P`, `LD_BOX_P`) for processing. Setting it to `true` brings back the card stack with wide landscape scenes. Both code paths are kept.

### 8f.45 Cards (user file) — AI typing back in the profile review, more top space
- `fillProfile` types each business-profile field in turn again (logo shimmer, then field by field with the highlight, source tag popping in), instead of showing all values at once. The profile review pane has 22px more space above the logo.

### 8f.46 Cards (user file) — flat card icons
- `cfArt` v4: a flat white rounded tile with a bold brand-blue line glyph. No gradients, glow, blur or shadow (the glassy v3 was rejected). Colours via `--igt` (tile) and `--igs` (glyph).

### 8f.47 Cards (user file) — team search and role filter; Done check beside the step name
- Team review card: search box plus role chips with counts (All, Regulatory / Legal, Business Admin, Super Admin) above a richer user list (name, job title, email, department, role). Filters update the list in place without losing focus. The Details page keeps its search and now has the same role chips (and searches department too). Helpers: `teamMatch`, `roleChips`, `cardTeamRows`, `refreshTeamCard`.
- Dark card, finished state: the green check is on the right of the step name (it had dropped below it).

### 8f.48 Cards (user file) — responsive finished page; icons directly on the card
- Finished page: card row size now follows both width and height (`layout()` finale branch), the pack scrolls only if needed, and short windows (under 760px high) shrink the header, tick and countdown. Checked at 1440x900, 1280x640, 1024x700, 768x900 and 390x844.
- Card icons: the white tile is gone; a thin white line glyph at 50% opacity sits directly on the card (`.igtile` hidden). Glyphs match the steps: ID card, people, layers, bars, document.

### 8f.49 Cards (user file) — blue side cards, bigger focus card in review
- Review: the cards beside the focus card (locked, done, upcoming) stay brand blue (no grey, no desaturating filter, 92% opacity). The focus card is 1000 wide (was 920) and the side margin is smaller, so it scales to about 1.03x on a 1440 window.

### 8f.50 Cards (user file) — larger mini face; no box inside the box
- The mini card face (icon, name, result) is larger (icon tile 132px, name 36px, result 22px).
- Review card panes: inner panels (team list, brands enterprise block, brand rows, GTM and templates panels) lose their own border, background and shadow so content sits straight on the white card, separated by hairlines only.

### 8f.51 Cards (user file) — space under the card header bar
- Review panes start 22px below the header bar (`.r-body` padding-top), so the title and the first content no longer touch it.

### 8f.52 Cards (user file) — search and filters on one line; Brands and LOBs representation
- Team: search box and role chips sit on one line (card and Details page); the card's search field is wider so its placeholder is not cut.
- Brands and LOBs review card: enterprise root, then each brand as a coloured initials tile with name, sender ID and LOB count, its lines of business as chips under it, joined by tree connectors.

### 8f.53 Cards (user file) — templates review shows summary only
- Templates review card: summary stats plus a count per line of business (bars, plus Not mapped); the template-by-template list was removed from the card. The full list, filters and edits are in Details.

### 8f.54 Cards (user file) — five review tweaks
- Team card: the list is no longer cropped (card is 800 high for Team, one line per person: name and job title, department, role; the card body scrolls if it ever needs to).
- Brands card: more spacing between brands and chips; sender ID removed from the card and from Details.
- GTM: the "I accept the rate card terms" tick moved into the bottom bar, beside the buttons.
- The "Details" button is now "View and edit" on every review card.
- Templates: "Do it later" beside Confirm mapping; saving for later marks the step as later and does not block the finish.

### 8f.55 Cards (user file) — smaller finished page
- Finished page: card row about 22% smaller, header tick and title smaller, and the countdown block has no panel behind it (no background, border, shadow or blur).

### 8f.56 Cards (user file) — larger text in review cards
- Review cards: headline 22px, description 15px, table text 15px, names 15.5px, chips and search 13.5-15px, form labels and values larger, stats and bars larger. The Team card is back to 720 high (a taller card made everything scale down); rows are tighter so all six people still fit.

### 8f.57 Cards (user file) — finished page header on two lines
- Finished page: the green tick sits on the left, with the title and the subtitle as two left-aligned lines beside it (grid on `.ah-t`), instead of a centred stack.

### 8f.58 Cards (user file) — edited states, unsaved-changes dialog, grey skipped steps, loader corners
- Back to cards from a step's Details page now asks to Save changes / Discard changes / Keep editing when something was edited (snapshot on open, `restoreSnap`). Esc does the same.
- Edited steps look different on the card: amber banner with a summary of what changed and "Undo all", an "Edited" (or "Custom split" for GTM) tag, "New"/"Added" tags and green outlines on new brands, lines of business and people, and "· edited" on the dark face.
- Skipped (saved for later) steps show grey on the finished page, "Skipped for now" on the face, and the header reads "You can start migration" with a line naming what is saved for later.
- Team and Templates: "Do it later" now sits beside the primary button on the right.
- AI processing: the moving corner brackets around the animation are hidden (`.reticle`, `.kbay > i` in the loader doc).

### 8f.59 Cards (user file) — Go to migration: app, walkthrough, Consent Migration
- "Go to migration" opens the app shell: full sidebar (Workspace, Operate, Analyse, Admin, Migration highlighted) and a three-step walkthrough (Workspace, Operate, Analyse and Admin) with a spotlight ring on the sidebar group and a card anchored beside it (Skip, Back, Next, dots, progress; last step "Go to Migration"). Ported in spirit from `agentic-setup-final-approach-cards.html` (`agAppTourBeats`, `AG_APP_NAV`, `agMigUnlockedMarkup`).
- Then Consent Migration: title and copy, three stages (Upload and Submit closing in 30 days, Consent Notification, Consent Based Scrubbing), the "No consents uploaded yet" empty state with New upload, the CSV format chips, and a grey note if steps were saved for later. Other sidebar pages show a placeholder.

### 8f.60 Cards (user file) — team card headline removed
- Team review card: the "6 people to invite, each with a role" headline and description are removed; the list starts straight away. The Edited tag moved beside "Suggested users".

### 8f.61 UI/UX audit copy (agentic-setup-cards-ux.html)
A new file, built from `agentic-setup-cards.html` by `references/tools/session5/deck-enhanced/ux/build_ux.py` (the source file is untouched). Audit method: Playwright at 1440, 1024 and 390 wide on the gate, ready, review and finale screens, with a DOM check for text size, contrast, touch targets, names and overflow.
Fixed: (1) the gate overflowed at phone width, clipping the title, tabs and Accept button, so it is now a single column with the avatar pill made horizontal; (2) the Prototype menu no longer covers the Accept button on phones; (3) the processing and review copy overlapped the card on narrow screens, so it is now a top band; (4) the "ready" copy collided with the ring at 1024, so the ring offset and copy width were adjusted, and on phones the copy sits below the ring with a full-width button; (5) faint grey text raised to at least 4.5:1; (6) a visible focus ring for keyboard users; (7) larger touch targets (Prototype button, step rail, filter chips); (8) finale card text raised from about 8px to about 11px; (9) a global reduced-motion fallback.
Not fixed: the 3D ring and the review cards stay desktop-first (the card clips on a 390px phone, and the card body text scales with the card). The "Business profile" side-card label touches its result line while the ring turns.

### 8f.62 UX copy: 90vh focus card and larger review text
In `agentic-setup-cards-ux.html` (built by `references/tools/session5/deck-enhanced/ux/build_ux.py`): (1) the focus card in review is 90% of the viewport tall. The scale is now limited by width only, so the card gets taller instead of the text smaller (`dims()` and the `layout()` height clamp); (2) review text has a 16px floor (was 10px), applied by a MutationObserver (`bumpFonts`) to elements under `[data-review]`, plus inputs and selects, the "STEP n OF 5" label, and the side-card labels. Known: the horizontal result line on a side card still touches its vertical title while the ring turns.

Skipped steps on the finished page (UX copy) are light blue (`.cardf.s-skipped`) with dark blue text, instead of grey. Note 8f.62 also covers the review text floor.

Focus card height lowered from 90vh to 80vh (8f.62).

Focus card height lowered again, from 80vh to 70vh (8f.62).

8f.63 UX copy: the review band (step title and text) sits on top, left-aligned, so the card is centred with the full width below it (`body.has-tband` rules in build_ux.py; `LP` and `LPa` are 0 during review). The 'What I did' and 'What happens next' accordions are hidden in this layout. Card height is the step's natural height +12% (room for the 16px text floor) and the scale is limited by stage height again, so it is about 67% of the window height at 900px.

8f.64 UX copy: reverted the top band from 8f.63. The review text is on the left of the cards again, like before. Kept: the card is the step's natural height +20% so nothing clips at the 16px text floor.

8f.65 UX copy: the vertical stepper left of the review text is removed (.h-steps hidden), the enterprise logo is 1.5x (168x144), and review card heights are the natural height +15% (profile) or +12% (others). The earlier height rule based on the window height was replaced, since content height, not window height, is the limit.

8f.66 UX copy: the review text block (Agent summary, heading, lists) is moved left so its edge lines up with the logo pill at x=16 (screens wider than 860px).

8f.67 UX copy: left padding of the review text block raised from 16px to 40px (replaces the 8f.66 alignment).

8f.68 UX copy: review focus cards are 80% of the window height (the scale is set from innerHeight * .8 over the card's content height). Measured: 720px at 900 tall, 576px at 720 tall, all five steps, no clipping.

8f.69 UX copy: text size review of all five review cards. Every visible text is now 16px or larger, one size per role: labels and body 16 (labels 600, body 400, buttons 600), brand names 18 (the enterprise name was 17), table and stat values as before. The search box (15px) is raised to 16. The Team and Business profile cards have no headline (removed earlier), Brands, GTM and Templates keep their 22px headline.

8f.70 UX copy: the GTM partners review shows the four partners as cards in a 2x2 grid instead of a table. Each card has the partner mark, name, one-line reason, a Chosen / Not chosen chip, and three rate tiles (migration, acquisition, refresh) with the lowest rate in green with a 'Lowest' chip and the volume share on chosen partners. Chosen cards have a blue outline, the others are dimmed. The deep view table is unchanged.

8f.71 UX copy: the GTM partner cards from 8f.70 are reverted to the table (flag GTM_CARDS=False in build_ux.py keeps the card design). Table rows have more spacing (cell padding 18px, bigger partner marks).

8f.72 Part 2 design-gap sheet: `agentic-setup-gaps.html`, built by `references/tools/session5/deck-enhanced/gaps/build_gaps.py` (+ `gaps.css`). Fifteen sections drawn on the new review layout: Agent panel messages, the 8-status set (chip on card, side card and progress segment), finished faces, nothing found, couldn't prepare, preparation tiles and ready screen, partly prepared, Details notice bar and read-only, busy/error/offline, Save changes dialogs, finale states, Closes in, gate states, avatar menu and sign-out, concurrent edits. Status colours: Queued grey, Preparing blue, Ready teal, Locked slate, In review amber, Needs attention orange, Do it later violet (bookmark), Done green.

8f.73 Part 2 states in the prototype: `agentic-setup-cards-states.html`, built from the UX copy by `references/tools/session5/deck-enhanced/states/build_states.py` (states.js, states.css). Eight-status chip on the centre card, side cards and rail; finished faces (done with who and when, in review, needs attention, do it later); nothing found, couldn't prepare (first, after two tries, busy), no-rate-card lock, partly prepared; Details notice bar, read-only, late suggestion, Save dialogs per step; busy, error, unknown-result, offline, load failures; finale window states; gate states; Signed agreements; concurrent edits. Every state can be forced from the Prototype menu (`__deck.uxState(name)`). Not wired: the 'Do it yourself' path on Business profile only blanks the fields. The preparation tiles are patched on the analysis card only.

Centre-card 'Ready' chip removed in the states prototype (other statuses keep their chip).

States prototype: the Business profile verification animation is about 1.7x larger (scene scale cap 2 for .kv, body height 620px).

States prototype: the centre-card Preparing chip is removed too (Ready and Preparing are hidden).

8f.74 PM feedback copy: `agentic-setup-cards-states-pm-feedback.html`, built from the states prototype by `references/tools/session5/deck-enhanced/pm/build_pm.py` (pm.js, pm.css). Fixes for the PM team's 14 comments: (1) the summary clause highlights as the document scrolls; (2) ready/start stack cards use larger text; (3) start-screen copy; (4) Closes-in pill explains migration; (5) the card in action is larger (ring scale cap 1.05); (6) ready-screen copy and a one-click 'Review and submit'; (7) ready cards get a green outline and 'Ready for review' chip, kept blue (decision for the PM); (8) review card width 940 with 17px minimum text and a smaller left column; (9) the submit message says it is with the telecom operators; (10) checkboxes on Team rows, Send N invites follows; (11) results stay on screen longer (3.8 to 5.2 s, toast 5.2 s); (12) What I did is open by default; (13) lines of business show proof (seen in DLT header, or Attach proof for new ones); (14) template counts per LOB and a mapping status line. Not done: item 2's blur is only addressed with larger text, proof is not enforced before Send for review.

8f.75 PM comment 15: the Templates card says '98% of your 100 templates are mapped to a line of business' and that 2 had no suitable match, and that matched and unmapped ones can be reviewed.

Closes-in pill label is 'Migration closes in' (and 'Migration opens in') in the PM feedback file.

Closes-in context line shows only on hover or focus (PM feedback file); the pill is 56px at rest.

PM feedback file: the Business profile verification animation scale cap lowered from 2 to 1.5.

PM feedback file: crisper card text. The open review card is drawn flat (no preserve-3d child layers, back face hidden) and the stage edge mask is off in review. The start, ready and processing stacks are still 3D, so their text can still look soft on some screens; larger text was applied there.

PM feedback file: side-card text. Done side cards use the same large vertical label (52px, 28px sub-label) instead of the tiny horizontal text; side-card rotation 56 to 46 degrees so labels are less squeezed.

PM feedback file: new Brands and LOBs details page (brand and LOB cards, promo examples, Consent Wallet phone preview, confirm checkbox), GTM compare table (Scrubbing group, BEST cells, dark Selected N bar with Accept & Set Allocation) and Templates mapping page (LOB list with counts, confidence pills, drag onto a LOB, pager). Source: pm2.js, pm3.js.
