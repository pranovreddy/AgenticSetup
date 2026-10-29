# Agentic setup: state flow reference for developers and agents

Single source of truth for every state that is currently active in the prototype. Removed states are not listed.

- **Prototype file:** `Agentic flipcards specchanges.html` (artifact https://claude.ai/artifact/XZXKvpEvBEDMeaSLPdepxs)
- **FigJam flow diagrams (10 diagrams, one board):** https://www.figma.com/board/HMRjHhzJnwTnqhVJ8kc2xz
- **How to open a state in the prototype:** Prototype menu (top right) > group > entry. In code each entry is `XS["<key>"]()` (scripted state) or `jump("<key>")` (flow screen); keys are listed below.

## Flow in one line

`login > 2-step code > agreements (Terms, Privacy) > setup plan > AI processing (sources, KYC, Team, Brands, GTM, Templates) > ready for review > review cards in order (KYC details, Team, Brands and LOBs, GTM partners, Templates) > finale > migration page + 4-card walkthrough`

Each review step ends in a success page (or a saved-for-later page) followed by an "Up next" bar that auto-continues after 8 seconds.

## Diagram index

| # | Diagram | Covers |
|---|---|---|
| 01 | Master flow | login to product, review order |
| 02 | Agreements and login | Terms, Privacy, load/refuse/race errors |
| 03 | AI processing | six scenes, nothing found, failed, retry, taking longer |
| 04 | KYC details | fill, locked fields, submit, verification, operator results |
| 05 | Team | card, details, failures, saved for later, invites sent |
| 06 | Brands and LOBs | tree, submit, review table, partial approval, recalculation |
| 07 | GTM partners | recommendation, share errors, waiting for rate cards |
| 08 | Templates | check screen, mapping, failures, saved for later |
| 09 | Finale and product | four finale variants, migration, walkthrough |
| 10 | Global and shared | card/page mechanics, offline, load failures, no access, eligibility |

## Rules that apply to every screen

- Secondary button on the left, primary button on the right. Button labels are Title Case with an icon.
- Card status chips are limited to: Queued, Preparing, Locked, In review, Needs attention, Do it later, Done. A ready card shows no chip.
- "Do It Later" ends in a whole-page message, "{Step} is saved for later", with the pill "Saved for later" and a Continue to {next step} button.
- Locked steps are dimmed and cannot be opened. A finished step opens as a read-only overview with View and edit.
- The full page is headed by a breadcrumb: {step on the cards} / {page name} / {action in progress}, then the page title.
- Retries and remaps play the step animation on its own, in the centre card, never with neighbouring cards.
- Wording and layout follow `agentic-onboarding-copy-28oct.md` and the "Claude spec diff" where the prototype differs.

## State inventory (every active entry in the Prototype menu)

### Flow  (diagram 01)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Login | `login` | `jump("login")` |
| Agreements | `gate` | `jump("gate")` |
| Setup plan | `plan` | `jump("plan")` |
| AI processing | `proc` | `jump("proc")` |
| Ready for review | `ready` | `jump("ready")` |
| Review: KYC details | `r0` | `jump("r0")` |
| Review: Team | `r1` | `jump("r1")` |
| Review: Brands and LOBs | `r2` | `jump("r2")` |
| Review: GTM partners | `r3` | `jump("r3")` |
| Review: Templates | `r4` | `jump("r4")` |
| Finished | `final` | `jump("final")` |
| Migration + walkthrough | `app` | `jump("app")` |

### Card animation  (diagram 03)

| Prototype menu label | Key | How it opens |
|---|---|---|
| From KYC details (rail starts) | `proc-form` | `jump("proc-form")` |
| Team card | `proc-team` | `jump("proc-team")` |
| Brands card | `proc-brands` | `jump("proc-brands")` |
| GTM partners card | `proc-gtm` | `jump("proc-gtm")` |
| Templates card | `proc-tpl` | `jump("proc-tpl")` |
| Sources scan (before rail) | `proc-sources` | `jump("proc-sources")` |

### Agreements  (diagram 02)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Can't be loaded | `gate-fail` | `XS["gate-fail"]()` |
| Acceptance refused | `gate-refused` | `XS["gate-refused"]()` |

### Agent messages  (diagram 10)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Welcome back | `msg-back` | `XS["msg-back"]()` |
| After a decision | `msg-next` | `XS["msg-next"]()` |

### AI processing  (diagram 03)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Step didn't finish (failed) | `err-team` | `XS["err-team"]()` |
| Nothing found | `nf-team` | `XS["nf-team"]()` |
| Taking longer, jump to the end | `slow-end-quick` | `XS["slow-end-quick"]()` |

### KYC details  (diagram 04)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Profile approved by none | `gap-profile-none` | `XS["gap-profile-none"]()` |
| Edited: brands are recalculated | `rc-brands` | `XS["rc-brands"]()` |
| Done, who and when | `done-profile` | `XS["done-profile"]()` |
| Something went wrong | `err-kyc` | `XS["err-kyc"]()` |
| Partly prepared | `partly-profile` | `XS["partly-profile"]()` |
| Save failed | `err-profile` | `XS["err-profile"]()` |
| Locked fields not found: update in DLT | `lock-profile` | `XS["lock-profile"]()` |
| Locked fields: still missing after retry | `lock-profile-still` | `XS["lock-profile-still"]()` |
| Locked fields not found: contact support | `lock-profile-support` | `XS["lock-profile-support"]()` |
| Verification animation: all 3 stages | `kv-anim` | `XS["kv-anim"]()` |
| Verification animation: slow motion | `kv-anim-slow` | `XS["kv-anim-slow"]()` |
| Verification: couldn't send | `kv-error` | `XS["kv-error"]()` |
| Approved by 2 out of 4 operators | `pm-kyc` | `XS["pm-kyc"]()` |
| Completed: view, 4 out of 4 telcos | `ov-profile-4` | `XS["ov-profile-4"]()` |
| Completed: view, 2 out of 4 telcos | `ov-profile-2` | `XS["ov-profile-2"]()` |
| Profile view: none approved | `ov-profile-0` | `XS["ov-profile-0"]()` |

### Team  (diagram 05)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Nothing found | `nothing-team` | `XS["nothing-team"]()` |
| Couldn't prepare, first try | `fail-team` | `XS["fail-team"]()` |
| Couldn't prepare, after two tries | `fail2-team` | `XS["fail2-team"]()` |
| Do it later | `later-team` | `XS["later-team"]()` |
| Success: invites sent | `ok-team` | `XS["ok-team"]()` |
| Success: saved for later | `ok-team-later` | `XS["ok-team-later"]()` |
| Coming back to a finished step | `back-team` | `XS["back-team"]()` |
| Details: nothing found | `notice-team-nothing` | `XS["notice-team-nothing"]()` |
| Save changes dialog | `dialog-team` | `XS["dialog-team"]()` |

### Brands and LOBs  (diagram 06)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Sent for approval: in review card | `pm-all` | `XS["pm-all"]()` |
| Edited: templates are remapped | `rc-tpl` | `XS["rc-tpl"]()` |
| Nothing found | `nothing-brands` | `XS["nothing-brands"]()` |
| One brand, two LOBs suggested | `brands-single` | `XS["brands-single"]()` |
| Couldn't prepare | `fail-brands` | `XS["fail-brands"]()` |
| Details: no suggestion prepared | `notice-brands-noprep` | `XS["notice-brands-noprep"]()` |
| Details: save failed | `derr-brands` | `XS["derr-brands"]()` |
| Success: sent for approval | `ok-brands` | `XS["ok-brands"]()` |
| Save changes dialog | `dialog-brands` | `XS["dialog-brands"]()` |
| All edited: amber, waiting | `pm-all` | `XS["pm-all"]()` |
| All edited: templates locked | `pm-all-lock` | `XS["pm-all-lock"]()` |
| Partly edited: done, N under review | `pm-partial` | `XS["pm-partial"]()` |
| Partly edited: templates warning | `pm-partial-warn` | `XS["pm-partial-warn"]()` |
| LOB removed: remapping | `pm-remove-remap` | `XS["pm-remove-remap"]()` |

### GTM partners  (diagram 07)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Share error per phase | `spec-gtm-error` | `XS["spec-gtm-error"]()` |
| Couldn't prepare, first try | `fail-gtm` | `XS["fail-gtm"]()` |
| Couldn't prepare, after two tries | `fail2-gtm` | `XS["fail2-gtm"]()` |
| No rate cards, locked | `norate-gtm` | `XS["norate-gtm"]()` |
| Success: partners selected | `ok-gtm` | `XS["ok-gtm"]()` |
| Save changes dialog | `dialog-gtm` | `XS["dialog-gtm"]()` |

### Templates  (diagram 08)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Check screen with approval advisory | `pm-partial-warn` | `XS["pm-partial-warn"]()` |
| Brands check before mapping | `tpl-gate` | `XS["tpl-gate"]()` |
| Nothing found | `nothing-templates` | `XS["nothing-templates"]()` |
| Trying again | `busy-templates` | `XS["busy-templates"]()` |
| Couldn't prepare, first try | `fail-templates` | `XS["fail-templates"]()` |
| Couldn't prepare, after two tries | `fail2-templates` | `XS["fail2-templates"]()` |
| Success: templates mapped | `ok-templates` | `XS["ok-templates"]()` |
| Needs attention | `attention-templates` | `XS["attention-templates"]()` |
| Save changes dialog | `dialog-templates` | `XS["dialog-templates"]()` |

### Finale  (diagram 09)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Skipped steps | `fin-skipped` | `XS["fin-skipped"]()` |
| Window not open yet | `fin-notopen` | `XS["fin-notopen"]()` |
| Window open | `fin-open` | `XS["fin-open"]()` |
| Window closed | `fin-closed` | `XS["fin-closed"]()` |

### Finished steps: View details  (diagram 05-08)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Team: User Management | `dv-team` | `XS["dv-team"]()` |
| Brands and LOBs: Brands & LOBs | `dv-brands` | `XS["dv-brands"]()` |
| GTM partners: GTM Partners | `dv-gtm` | `XS["dv-gtm"]()` |
| Templates: Template Mapping | `dv-tpl` | `XS["dv-tpl"]()` |

### Whole screen  (diagram 10)

| Prototype menu label | Key | How it opens |
|---|---|---|
| Offline | `offline-x` | `XS["offline-x"]()` |
| Setup failed to load | `loadfail-deck` | `XS["loadfail-deck"]()` |
| Card failed to load | `loadfail-card` | `XS["loadfail-card"]()` |
| Details failed to load | `loadfail-deep` | `XS["loadfail-deep"]()` |

### Edge cases  (diagram 10)

| Prototype menu label | Key | How it opens |
|---|---|---|
| No access to this setup | `no-access` | `XS["no-access"]()` |
| Another user accepts while you read | `gap-race` | `XS["gap-race"]()` |
| Ready on return | `gap-return-ready` | `XS["gap-return-ready"]()` |
| Brands item states: card | `gap-brands-items-card` | `XS["gap-brands-items-card"]()` |
| Not eligible, on the review screen | `gap-not-eligible` | `XS["gap-not-eligible"]()` |

## Notes for an implementing agent

- Duplicate keys in the menu (for example `pm-all`, `pm-partial-warn`) are two menu labels for one state.
- States are in-memory only: there is no URL routing, history or refresh persistence in the prototype. A real build needs deep links and server-saved progress.
- Numbers in the prototype (counts, dates, IP, reference IDs, approvals) are sample data.
- The acquisition destination after a closed migration window is not decided yet.
- The TCCCPR trust line for Brands is behind `SHOW_TCCCPR=false` until product and legal confirm it.
