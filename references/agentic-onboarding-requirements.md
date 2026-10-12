# Agentic onboarding: requirements


|                  |                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **What this is** | The requirements for agentic onboarding. Everything needed to understand the journey is in this document. |
| **Prototype**    | "Agentic single page setup actions 6"                                                                     |


## In short

Setup happens on one page. An AI guide, the Migration Manager, prepares each step, says what it did, and guides the user through the journey.

This document covers the Migration Manager and the onboarding journey. Every step's own screen, in every state, already exists and isn't redefined here. Those screens are shown in the workspace on this page. The user does not leave for a separate product page to do the step.

For each step, this defines what the Migration Manager says in every outcome, and which existing screen then shows.

Brands and LOBs in review hold up the journey. Templates in review don't.

For GTM partners, the application selects partners and sets the allocation automatically. The user still gives the final confirmation.

Kick off migration does not continue on this page. It summarises the setup and says the user is set to start migration. **Go to migration** ends onboarding and takes the user into the product.

## Words used in this document


| Word        | Meaning                                                                                                                                                                                                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Onboarding  | The whole journey of the seven steps an organisation completes before anyone lands in the product. Agreements, business profile, team, brands and LOBs, GTM partners, templates, and kick off migration. It belongs to the organisation. Once it is complete, no one in the organisation goes through it again. |
| Walkthrough | A short explainer shown to each user once, the first time they land in the product. It is not part of onboarding.                                                                                                                                                                                               |
| The product | Everything the user reaches after onboarding. Its menu, its pages, and its existing screens.                                                                                                                                                                                                                    |
| Summary     | The kick-off migration step's screen. It recaps the setup and holds the **Go to migration** button.                                                                                                                                                                                                             |


## 1. Scope


| In this document                                                                     | Not in this document                                                                                                                                              |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Migration Manager: its bar, statuses, lines, and "What I did"                    | Each step's screen and its states (filled, partly filled, empty, nothing found). These exist already.                                                             |
| The journey: order, transitions, success screens, stage summaries, pauses, returning | How the user edits within a step, for example adding brands or LOBs. This also exists already.                                                                    |
| The telemetry for every step and every outcome                                       | Whether a submission can be changed while it's in review                                                                                                          |
| Which reviews hold up the journey                                                    | Uploading, processing and approving migration files                                                                                                               |
| When each step opens, and what completes it                                          | The product's upload flow after the walkthrough                                                                                                                   |
| The walkthrough, and what it lands on                                                | The Acquisition page. Until that flow exists, a closed migration window still ends on the Migration page, with the same summary.                                  |
| The page updating while it is open                                                   | In-app messages and email. Not in this story.                                                                                                                     |
| Leaving and coming back: where they land, logout, what is kept                       | The length of the session.                                                                                                                                        |
| The kick-off summary, and the handoff into the product                               | Role-based access. Not in this story. Every user sees the journey below. Differences by role are in `agentic-onboarding-rbac.md`, which is not part of this spec. |


## 2. The page

Rail on the left, Migration Manager bar at the top, the step's existing screen in the workspace, and the action bar at the bottom.


| Area                        | What it does                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Rail (left)                 | The stages and steps of this journey, a way to move between the ones that can be opened, and **Log out**. How it behaves is in section 3.                                            |
| Migration Manager bar (top) | The AI guide's name, status, and current line. It also offers "What I did" for the step in view. How that control looks is for design later. What the list contains is in section 4. |
| Workspace (centre)          | A preparation scene, the step's existing screen, a success screen, a stage summary, the paused state, or the kick-off summary.                                                       |
| Action bar (bottom)         | The step's buttons, and after a step, the countdown to the next one.                                                                                                                 |


## 3. The rail

The rail is how the user moves between the stages and steps of onboarding. It is not the product menu. The user does not reach the product menu until onboarding is complete.

It always lists the three stages, in order, and the steps inside each.


| Stage   | Steps                                    |
| ------- | ---------------------------------------- |
| Setup   | Agreements, Business profile, Team       |
| Estate  | Brands and LOBs, GTM partners, Templates |
| Migrate | Kick off migration                       |


Each stage says how many of its steps are done. Setup and Estate are out of 3. Migrate is out of 1.

The rail marks the step that is open in the workspace, and still shows that step's status. Choosing another step that can be opened puts that step in the workspace. Choosing a step that cannot be opened yet does nothing. Choosing the step that is already open does nothing.

When the workspace moves on by itself, after a step or a stage, the rail follows it.

Below the stages, the rail has **Log out**. It is always there while the rail is. What it does is in section 10.

### What a stage says


| State                     | When                                                                                      | What it says                                                                                                                       | What the user can do                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Not open                  | Estate, before Setup is complete. Migrate, before Setup and Estate are complete.          | Estate: "Opens once your organisation is set up." Migrate: "Opens once your consent estate is set up." None of its steps are done. | See the steps. Not open them.                                           |
| In progress               | The stage is open and at least one step is not complete.                                  | "{n} of {m} done."                                                                                                                 | Open any of its steps that are available.                               |
| Complete                  | Every step in it is complete. Team counts if it was skipped.                              | "{m} of {m} done."                                                                                                                 | Open a finished step again. Team can be opened to invite someone later. |
| Complete, needs attention | A step in it is complete, and still needs attention, and that does not block the journey. | "{m} of {m} done. Needs attention."                                                                                                | Open the step that needs attention.                                     |


Setup is never waiting on an earlier stage.

### What a step says


| State           | When                                                        | What it says                                                                                                                                                                           | Choosing it                                                                        |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Not available   | Its stage is not open, or the step itself is still waiting. | "Not available yet." Business profile, while agreements are not both accepted: "Waiting for agreements." Templates, until brands and LOBs are complete: "Waiting for brands and LOBs." | Nothing.                                                                           |
| Preparing       | The Migration Manager is working on it.                     | "Preparing."                                                                                                                                                                           | Opens it. The workspace shows that work.                                           |
| Ready           | It is the user's turn.                                      | "Ready."                                                                                                                                                                               | Opens it.                                                                          |
| In review       | It has been submitted and is waiting on someone else.       | "In review." This is the same for the business profile, brands and LOBs, and templates.                                                                                                  | Opens it, so they can see the status. They cannot change the submission from here. |
| Needs attention | They have to act on it again.                               | "Needs attention."                                                                                                                                                                     | Opens it.                                                                          |
| Skipped         | Team, and they chose "Do it later".                         | "Do it later." It counts as done.                                                                                                                                                      | Opens it, so they can invite someone.                                              |
| Done            | It is complete, and nothing needs them.                     | "Done."                                                                                                                                                                                | Opens it, to look.                                                                 |


A step keeps its status when it is the one on screen. The rail only adds that it is the open one.

### What changes the rail

- Agreements and Team can both be opened from the start. The business profile cannot, until both agreements are accepted.
- If the business profile is not approved, that step says "Needs attention" and is not done. Estate stays not open.
- Once at least one approval has come in, the business profile says "Done" and adds "{n} of {total} approved" until all of them have. It does not name who approved it.
- While brands and LOBs are in review and none are approved, Templates and Kick off migration say "Not available yet." GTM partners stays open.
- If none of the brands and LOBs are approved because they were rejected, the step says "Needs attention" and is not done. Templates stay not available. GTM partners stays open.
- If at least one brand and one LOB are approved and others are not, the step is done and says "Needs attention." Templates can be opened.
- Templates submitted for approval count as done, so Kick off migration can be opened. The step says "In review."
- Until every template is mapped and approved, Templates stays done and says "Needs attention." Kick off migration stays open.
- Kick off migration can be opened once Setup and Estate are done, whether or not the migration window is open. The window does not change the rail or the summary's button. It only changes what the walkthrough lands on.
- Once onboarding is complete, the rail is no longer shown. The user is in the product.

## 4. What I did

"What I did" is the record of how the Migration Manager prepared a step. The user opens it to see what was checked, where it came from, and what was found. It is not a place to accept, confirm, or submit.

The list is one per step. It is kept for the organisation. Whoever opens that step later sees the same list. A step that has not started has no list.

While a check is running, it is the Migration Manager's current line. It joins "What I did" when it finishes. The list is the finished checks, in the order they ran, then the result lines for the outcome that happened. A check that found nothing is still listed. A partial result names what is missing. The list never explains a failure as a system problem, such as "couldn't reach MCA".

Opening the list does not leave the step and does not change it. Closing it returns to the same step. On a finished step the list is still there. Preparation does not play again.

The sentences are the checks and result lines in `agentic-onboarding-copy.md`. This is what each step's list must contain.


| Step                           | Checks, in order                                                                                             | Source                                            | Result the list must include                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Agreements                     | Pulled the latest platform agreements. Summarised the key terms.                                             | The platform agreements                           | "Found 2 agreements: Terms and conditions and Privacy policy." "Summarised each in 3 points."                                              |
| Business profile               | Checked DLT. Checked GSTIN. Checked MCA. Looked up the company website. Filled in the business profile.      | DLT registration, GSTIN, MCA, the company website | "Filled all {n} fields", or "Filled {n} of {total} fields" and "Couldn't fill: {fields}", or "Couldn't find your business details."        |
| Business profile, after submit | Checked the business details. Ran risk checks. Sent the profile for review.                                 | The submitted details                         | "Approved by {n} of {n}", or "Approved by {approved} of {total}", or "Not approved yet."                                                   |
| Team                           | Found people on the DLT registration. Matched a role to each person.                                         | DLT registration only                             | "Found {n} people" and "Suggested a role for each", or "Couldn't find anyone to invite."                                                   |
| Brands and LOBs                | Read the DLT headers and entities. Grouped them into brands. Created lines of business.                      | DLT registrations                                 | "Drafted {b} brands and {l} LOBs", or "Couldn't find brands and LOBs."                                                                     |
| GTM partners                   | Read partner requests. Compared rates for each phase. Chose a combination. Set the allocation across phases. | Rate cards partners have sent                     | "{n} partners have sent rate cards", "Chose {names}", and "Split volume across them by phase", or "Couldn't find any partner requests."    |
| Templates                      | Read the templates. Suggested a line of business for each. Scored confidence.                                | The enterprise's templates                        | "Suggested a line of business for all {total}", or "Suggested for {m} of {total}" and "Couldn't map {u}", or "Couldn't map any templates." |
| Kick off migration             | Checked the setup is complete. Checked the migration window.                                                 | The completed setup, and the migration window     | "Your window is open until {date}", or "Your window opens on {date}", or "Your window has closed."                                         |


## 5. The journey


| #   | Moment              | What happens                                                                                                                                                                             |
| --- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Opening             | Full screen, three lines: "Setting up WiselyConsent for {company}…", "Checking trusted sources for your organisation…", "Preparing your setup steps…". First visit only.                 |
| 2   | Stage 1 preparation | A scene of the stage's sources lighting up as the AI works through them, with "Your review opens here when this finishes."                                                               |
| 3   | Agreements          | The user accepts both agreements.                                                                                                                                                        |
| 4   | Business profile    | The user completes and submits the KYC form. It goes in for review, and the step says "In review" until the result comes back.                                                            |
| 5   | Team                | The user sends invites, or chooses "Do it later".                                                                                                                                        |
| 6   | Stage 1 summary     | Each step and when it was done, and a card for the next stage.                                                                                                                           |
| 7   | Stage 2 preparation | A second scene: brands, partners, templates.                                                                                                                                             |
| 8   | Brands and LOBs     | The user confirms the AI's drafts, which sets them up straight away, or changes them, which sends them in for review.                                                                    |
| 9   | GTM partners        | The user lands straight on the final confirmation with the AI's pick, accepts each partner's terms, and confirms.                                                                        |
| 10  | Templates           | The user confirms the AI's mappings, or changes them, which sends them in for review.                                                                                                    |
| 11  | Stage 2 summary     | Each step and when it was done, and a card for migration.                                                                                                                                |
| 12  | Kick off migration  | A summary of the setup, on this page, saying they are set to start migration, with **Go to migration**. Choosing it completes onboarding and takes them into the product. See section 9. |


Each step opens with a one-line intro of what the AI did, then the step's screen. After each step, a success screen shows what was done and moves on after 5 seconds, or straight away with "Continue".

## 6. When steps open and complete

The journey shows the steps in the order in section 5. A step can be available before the journey reaches it.

Progress is complete steps out of seven. A step with blocking needs attention does not count. A step with needs attention that does not block still counts.

### Stages


| Stage      | Opens when                   | Complete when                                                                                                                             |
| ---------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Setup   | From the start.              | Team is done or skipped, both agreements are accepted, and the business profile has at least one approval.                                |
| 2. Estate  | Stage 1 is complete.         | Brands and LOBs, GTM partners, and templates are all complete.                                                                            |
| 3. Migrate | Stages 1 and 2 are complete. | A user chooses **Go to migration** on the summary. That completes onboarding for the organisation. A file upload does not have to finish. |


### Steps


| Step               | Available when                                       | Complete when                                                                                                                                                                   |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agreements         | From the start. It does not wait for Team.           | Both documents, Terms of Use and Privacy Policy, are accepted.                                                                                                                  |
| Business profile   | Both agreements are accepted.                        | At least one approval comes back. While it is waiting, the step says "In review."                                                                                              |
| Team               | From the start.                                      | At least one invite is sent, or the user skips it.                                                                                                                              |
| Brands and LOBs    | Stage 2 opens.                                       | At least one brand and one LOB are approved, or the user confirms the suggestions unchanged. Confirming unchanged suggestions completes the step straight away, with no review. |
| GTM partners       | Stage 2 opens. It does not wait for brands and LOBs. | Partners are confirmed and their rate cards are accepted.                                                                                                                       |
| Templates          | Brands and LOBs are complete.                        | The user confirms the mappings. Confirming unchanged suggestions completes the step straight away, with no review.                                                              |
| Kick off migration | Stages 1 and 2 are complete.                         | A user chooses **Go to migration** on the summary. The migration window does not decide whether the step is available or complete. It decides what the walkthrough lands on.    |


Team is the only step that can be skipped. The control is "Do it later". Skipping it counts as complete and blocks nothing. Every other step is mandatory. There is no Skip button.

If the business profile is not approved, the step is not complete and stage 2 stays locked.

If at least one brand and one LOB are approved and others are not, brands and LOBs stay complete, show needs attention, and templates still open.

If none of the brands and LOBs are approved, the step is not complete and templates stay unavailable. GTM partners are not affected.

Templates under review do not hold the journey. Kick off migration still opens. Until every template is mapped and approved, the step stays complete and shows needs attention. Mapping is still needed for scrubbing, so the reminder stays. A partial approval is enough to carry on, and consents can be migrated without every template mapped.

## 7. Journey rules


| ID  | Rule                                                                                                                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Open and complete.** Section 6 is the full rule for when each stage and step opens and what completes it.                                                                                                                                               |
| R2  | **Order.** Stage 1: agreements, business profile, team. Stage 2: brands and LOBs, GTM partners, templates. Brands come first so the review starts as early as possible.                                                                                    |
| R3  | **One page.** Every step through templates happens in the workspace. Nothing opens another page. Kick off migration is the exception in section 9.                                                                                                        |
| R4  | **The rail.** Section 3 is the full rule for what the rail lists, what it says, and what choosing a step does.                                                                                                                                            |
| R5  | **After a step.** A success screen shows what was done, by whom and when. The next available step opens after 5 seconds, or straight away with "Continue".                                                                                                |
| R6  | **After a stage.** A stage summary lists each step and when it was done, with a card for the next stage.                                                                                                                                                  |
| R7  | **Mandatory.** Every step is mandatory except Team, which has "Do it later" and doesn't block anything.                                                                                                                                                   |
| R8  | **Opening and returning.** The first-visit opening plays once. On every later sign-in, a short return opening plays, and the user lands on the next step that needs them. Section 10 is the full rule.                                                    |
| R9  | **Confirmed as suggested.** If the user confirms the AI's brands and LOBs, or its template mappings, without changes, there's no review. The step completes straight away.                                                                                |
| R10 | **In review.** The step, its stage on the rail, and the Migration Manager bar say "In review", since when, and "Learn more". They do not name who is reviewing it.                                                                                          |
| R11 | **Journey paused.** If brands and LOBs are in review and nothing else is available, the workspace shows the paused state and the Migration Manager's status is Waiting. The user can log out or leave. When they come back, they land as section 10 says. |
| R12 | **Learn more.** Every pending state has "Learn more", which opens the migration education content.                                                                                                                                                        |
| R13 | **Review comes back.** While the page is open, the step updates without a refresh and the Migration Manager says what happened. No in-app message and no email.                                                                                           |
| R14 | **Outcomes.** Approved: complete. Partly approved: complete, with needs attention. Not approved: needs attention, and the step reopens.                                                                                                                   |
| R15 | **Same journey for everyone.** This story is the Super Admin journey. Every user who opens onboarding sees the same steps and the same buttons.                                                                                                           |
| R16 | **Prepared once.** The AI prepares each step once for the organisation. Whoever opens it sees the same work. Progress is the whole organisation's, out of seven.                                                                                          |



| Step                                               | Shown as                 | Needs a review when                                                | While in review                                                                     |
| -------------------------------------------------- | ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Business profile                                   | In review                | Always, once it is submitted. Automatic for now.                   | Verifying, then the approval result. The step says "In review."                    |
| Brands and LOBs                                    | In review         | The user changed or added anything, or the AI found nothing.       | Holds up the journey. GTM partners can still be done. Templates and migration wait. |
| Templates                                          | In review         | The user changed any mapping, or mapped templates the AI couldn't. | Doesn't hold up the journey. Kick off migration still opens.                        |
| Agreements, Team, GTM partners, Kick off migration | —                 | Never.                                                             | —                                                                                   |


## 8. Notes for engineering


| ID  | Note                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| E1  | **GTM partners, automated.** After the telemetry picks the best partners and split, the user lands straight on the final confirmation screen. The application makes the partner selection and allocation calls itself; until now the user made them. The user still accepts each partner's rate card terms and confirms, and can go back to choose partners and allocation manually. This is the only step where the journey takes an action on the user's behalf. |
| E2  | Every AI action, the automated GTM selection and allocation (recorded as done by the system), and every user approval go into the audit trail.                                                                                                                                                                                                                                                                                                                     |
| E3  | If the user has reduced motion turned on, the opening, scenes and typing are replaced by the final text, shown at once.                                                                                                                                                                                                                                                                                                                                            |
| E4  | The opening and scenes can't be skipped. The Skip buttons in the prototype were for testing only.                                                                                                                                                                                                                                                                                                                                                                  |


## 9. After the journey

Kick off migration is the last step of onboarding. It stays on the onboarding page. It summarises what was set up and tells the user they are set to start migration. It does not run the upload journey.

The button is **Go to migration**.


| Window       | What the summary shows                                            | Button              |
| ------------ | ----------------------------------------------------------------- | ------------------- |
| Open         | They are set to start migration. The window is open until {date}. | **Go to migration** |
| Not open yet | They are set to start migration. The window opens on {date}.      | **Go to migration** |
| Closed       | The same summary. The window has closed.                          | **Go to migration** |


Choosing **Go to migration** completes the step and completes onboarding for the organisation. The user lands in the product, on the Migration page. The walkthrough plays over it, because it is their first landing in the product. From then on, no one in the organisation goes to onboarding again.

The summary does not change when the window has closed. It is the same recap, with the same **Go to migration** button, and it still leads to the Migration page. Later, once the Acquisition flow exists, a closed window will lead to the Acquisition page instead. That flow is not part of this story.

### The walkthrough

The walkthrough is not part of onboarding. It plays once for each user, the first time they land in the product. It is not tied to the button. A user who did not choose **Go to migration**, such as a second person in the organisation, sees it the first time they land in the product, over whichever page the product opens on.

It counts as seen once it starts. Closing it at any point leaves the user on the page behind it, and it does not play again.

It is three cards over the product, with the real menu visible behind them. The user can go back or go forward. The walkthrough does not explain how to fill in the upload form. If reduced motion is on, the three cards appear at once, with no movement between them.

The last card leads into the next action. Its button is not a neutral dismiss. What it does depends on the migration window.


| #                             | Title        | What it says                                                                                                                                                            | Button                                                                                                                                                                       |
| ----------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1                             | The menu     | "This is the product. Use the menu to move around: Workspace, Operate, Analyse, and Admin."                                                                             | Next                                                                                                                                                                         |
| 2, window open                | Migration    | "Migration is under Operate. This is where you upload consents, until {date}."                                                                                          | Back, Next                                                                                                                                                                   |
| 2, window not open, or closed | Migration    | "Migration is under Operate. It opens on {date}. This is where you'll upload consents." When the window has closed, the date line is "The migration window has closed." | Back, Next                                                                                                                                                                   |
| 3, window open                | You're ready | "Your setup is done. Upload your consent file to start migration."                                                                                                      | Back, **Upload file**. It takes the user to the Migration page and opens the existing upload screen.                                                                         |
| 3, window not open, or closed | You're ready | "Your setup is done. You can upload files here once migration starts." When the window has closed: "Your setup is done. The migration window has closed."               | Back, **Go to Migration**. It lands the user on the Migration page, where the existing **Learn more** button sits at the centre. The card does not carry its own Learn more. |


For a user who is not already on the Migration page, the last card takes them there first.

From the Migration page, the product's current screens and flows apply. This document does not define uploading, processing or approving files.

There is no Platform Setup item in the navigation.

## 10. Leaving and coming back

Onboarding is a journey, not a page the user dips in and out of. Until the organisation has completed onboarding, onboarding is the only place any of its users can be. Progress belongs to the organisation and is kept.

### Where they are allowed to be

- Until onboarding is complete, every way into the product leads back to onboarding. That includes a saved product address, a bookmark, and the browser's Back button. The browser's Back and forward buttons do not move between steps. They stay on onboarding, on the step that is open.
- Onboarding is complete when a user chooses **Go to migration** on the summary. It is complete for the organisation, not for that one user.
- Once it is complete, no one in the organisation goes to onboarding again. Every user lands in the product, including a user who never opened onboarding. There is no way back into it.
- A user who is on a step when someone else completes onboarding is taken to the product. The Migration Manager says the organisation has finished.
- A user's first landing in the product plays the walkthrough once. Section 9 says what it shows and where it ends.

### Where they land when they come back

If the organisation has completed onboarding, they land in the product. The walkthrough plays if they have not seen it.

Otherwise they do not return to the exact step they left. They return to the next step that needs them. The first of these that applies:


| Order | If                                                                                     | They land on                                                                                                 |
| ----- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1     | A step is Ready, or has blocking needs attention                                       | The first such step in journey order. If the Migration Manager is still preparing it, they see it preparing. |
| 2     | Nothing needs them, and brands and LOBs are in review and holding the journey          | The paused state. The Migration Manager's status is Waiting.                                                 |
| 3     | Nothing needs them, and the business profile is in review                              | The business profile, showing "In review." The Migration Manager's status is Waiting.                         |
| 4     | Nothing needs them, and a step is still being prepared                                 | That step, with the preparation shown.                                                                       |
| 5     | Nothing needs them, and Setup and Estate are done                                      | The kick-off summary.                                                                                        |


A step with needs attention that does not block the journey does not pull them back. It is shown on the rail, and they can open it.

Landing follows the same rule after a refresh, after the session ends, after logging out, and after signing in on another device.

If they were mid-step, no earlier step is reopened. If the step they were on was finished while they were away, they land on the next one that needs them under the rule above.

### The opening on a return

Every time a user signs in, until they have seen the walkthrough, a short full-screen opening plays before they land. It tells them what is happening: the workspace is being set up, their progress is being restored, and a next step is being chosen. It plays once per sign-in. A refresh within the same session does not replay it. It follows E4 and cannot be skipped.

Once the user has seen the walkthrough, the opening no longer plays. It plays for a user whose organisation completed onboarding before they signed in. They see the opening, land in the product, and then the walkthrough plays.

The first-visit opening in section 5 is different. It plays only on a user's first visit. If it is interrupted, it plays again on their next visit until it has played to the end once. After that, the return opening is the one they see, until they have seen the walkthrough.

After the opening, the Migration Manager says "Welcome back", what changed since they left, and what is next. What changed is any of these that happened while they were away: a review was decided, the business profile was approved or not, someone else in the organisation finished a step, or the migration window opened or closed. If none of those happened, it says nothing has changed. This line shows in onboarding. It does not show in the product.

### Logging out

The rail has **Log out** below the stages, on every step. It is always there while the rail is. It asks for confirmation. If the screen has anything the user has not saved, the confirmation says it will not be kept. Confirming ends the session and returns them to the sign-in page. It does not open the product.

The first-visit opening and the return opening are full screen and show no rail. There is no logout during them. In the product, logging out is the product's own.

### What is kept, and what is not

Nothing is saved unless the user explicitly saves or submits it. No change is kept just because the user made it on screen.


| Kept for the organisation                                                                                                        | Not kept                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Anything submitted, accepted or confirmed, including one agreement accepted while the other is not.                              | Typing that has not been submitted.                                                    |
| Team skipped with "Do it later".                                                                                                 | Any change the user made but did not explicitly save or submit.                        |
| What the Migration Manager prepared, and the "What I did" record.                                                                | A form position on a screen. They return to the screen the landing rule picks.         |
| That the opening, the walkthrough and any return opening have been seen.                                                         |                                                                                        |
| The GTM partner selection and allocation the application made itself. The user returns to the final confirmation with that pick. | Changes the user made to that pick without saving them. The application's pick stands. |


If the session ends mid-step, nothing unsaved is recovered. No second draft is created. A screen that already keeps its own draft is unchanged by this document.

### Cases


| Case                                                                            | What happens                                                                                                                                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Refresh                                                                         | Lands by the rule above. No opening.                                                                                                                                                              |
| Close the tab or browser                                                        | Same as the session ending. The next sign-in lands by the rule above.                                                                                                                             |
| Session expires while idle                                                      | The next action shows the sign-in page. After signing in, they land by the rule above. Nothing unsaved is kept.                                                                                   |
| Session expires while submitting                                                | If the submit completed, they land on the next step that needs them. If it did not, the step is still waiting for them. Either way, the step shows its true status.                               |
| Logs out, then signs in                                                         | Same as the session expiring.                                                                                                                                                                     |
| Signs in on another device                                                      | Same landing. Progress is shared.                                                                                                                                                                 |
| Types the product address or uses Back                                          | Returns to onboarding, on the step that is open or the landing rule picks.                                                                                                                        |
| Preparation runs while they are away                                            | It continues for the organisation. On return, the finished checks are in "What I did". Nothing plays again.                                                                                       |
| A review is decided while they are away                                         | The step shows the result on return, and the Migration Manager says so. There is no in-app message and no email.                                                                                  |
| The migration window opens or closes while they are away                        | The summary shows the current state on return, and the Migration Manager says what changed. The rail and the button do not change. What the walkthrough lands on follows the window at that time. |
| Two tabs open                                                                   | When a tab comes back into focus, it shows the current state. A stale tab cannot submit over a newer one.                                                                                         |
| Two people in the organisation                                                  | Both see the same progress. Each gets the first-visit opening once. The first to submit wins, and the other sees the updated step.                                                                |
| Someone else finishes the step this user is on                                  | The step shows as done, with who and when, and moves on as it would after any step.                                                                                                               |
| Someone else completes onboarding while this user is in it                      | This user is taken to the product, and the Migration Manager says the organisation has finished. Their walkthrough plays at that landing.                                                         |
| A user signs in after onboarding was completed                                  | The return opening, if they have not seen the walkthrough. Then the product, and the walkthrough.                                                                                                 |
| After onboarding is complete, the user types an onboarding address or uses Back | They stay in the product.                                                                                                                                                                         |
| Opening interrupted                                                             | See above.                                                                                                                                                                                        |
| Walkthrough interrupted by a refresh                                            | They are on the page behind it. The cards do not play again.                                                                                                                                      |


This document does not set the session length.

## 11. Scenarios to test


| Scenario                                        | What should happen                                                                                                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First login                                     | Opening, stage 1 scene, then Agreements.                                                                                                                              |
| Returning user                                  | Return opening, then "Welcome back". Lands on the next step that needs them, not the exact step they left.                                                            |
| Return, step finished while away                | Lands on the next step that needs them.                                                                                                                               |
| Return, brands in review                        | Lands on the paused state. Status Waiting.                                                                                                                            |
| Return, business profile in review              | Lands on the business profile. It says "In review." Status Waiting.                                                                                                   |
| Return, nothing changed                         | "Welcome back" says nothing has changed.                                                                                                                              |
| Return, only a non-blocking needs attention     | Lands on the kick-off summary. The step with the reminder is on the rail.                                                                                             |
| Log out from a step                             | Asks to confirm. Warns if there is unsaved input. Ends the session.                                                                                                   |
| Session ends with unsaved typing                | The typing is gone. They land by the rule.                                                                                                                            |
| Product address before onboarding is complete   | Returns them to onboarding.                                                                                                                                           |
| Browser Back inside onboarding                  | They stay on the open step.                                                                                                                                           |
| Onboarding complete, a user signs in            | They land in the product. The walkthrough plays if they have not seen it. They never see onboarding.                                                                  |
| Return opening, walkthrough already seen        | No opening.                                                                                                                                                           |
| Return opening, walkthrough not yet seen        | The opening plays on every sign-in.                                                                                                                                   |
| Someone else completes onboarding               | This user is taken to the product.                                                                                                                                    |
| Refresh                                         | No opening. Lands by the rule.                                                                                                                                        |
| Business profile partly filled                  | "Couldn't fill: {fields}" in the telemetry, and the Migration Manager names them.                                                                                     |
| Nobody found for Team                           | "Couldn't find anyone to invite". The user adds people or does it later.                                                                                              |
| Brands confirmed as suggested                   | Complete straight away. No review.                                                                                                                                    |
| Brands changed                                  | In review. GTM partners is available. Templates and migration wait.                                                                                                   |
| Brands in review, GTM done                      | Journey paused. Status Waiting. "Learn more" available.                                                                                                               |
| Brands approved                                 | Step complete. Templates opens. The Migration Manager says so.                                                                                                        |
| Brands nothing found                            | "Couldn't find brands and LOBs", then the nothing-found screen.                                                                                                       |
| GTM partners found                              | Telemetry, then straight to the final confirmation with the AI's pick.                                                                                                |
| Templates changed                               | In review. Kick off migration still opens.                                                                                                                            |
| KYC partly approved                             | Complete with the badge. The Migration Manager says the rest will follow.                                                                                             |
| Kick off, window open                           | Summary on this page. **Go to migration** completes onboarding and lands on the Migration page. The walkthrough plays over it.                                        |
| Kick off, window not open yet                   | Summary on this page. **Go to migration** completes onboarding and lands on the Migration page. The walkthrough plays over it.                                        |
| Walkthrough, close before the last card         | They stay on the page behind it. The cards do not play again for that user.                                                                                           |
| Walkthrough, window open, last button           | **Upload file** ends the cards, takes them to the Migration page, and opens the existing upload screen.                                                               |
| Walkthrough, window not open, last button       | **Go to Migration** ends the cards and lands on the Migration page, where **Learn more** is at the centre. The card says they can upload files once migration starts. |
| Walkthrough, window closed                      | Same as the window not being open. **Go to Migration** lands on the Migration page, where **Learn more** is at the centre.                                            |
| Walkthrough, second user                        | Plays once for them at their first landing in the product, over the page the product opens on.                                                                        |
| What I did, partial profile                     | The list includes "Couldn't fill: {fields}". Opening it does not submit the profile.                                                                                  |
| What I did, nothing found                       | The list includes the "couldn't find" result and names the source. The empty screen is unchanged.                                                                     |
| What I did, finished step                       | The same list is still there. Preparation does not play again.                                                                                                        |


## 12. Still open

- **The walkthrough is the same for every role for now.** Making it depend on role comes later. It is not part of this story.
- The wording of the new lines: sent for review, paused, review outcomes, returning, nothing found. The three walkthrough lines in section 9 are a first draft.
- The layout of "What I did" is for design later. Its contents are in section 4.

## 13. Existing screens

These are the screens the journey shows. They already exist. Links are from the Dev Handoff Enterprise page. Sections above the Dashboards cover agreements, the business profile, team, brands and LOBs, GTM partners, and migration. Template mapping sits below the Dashboards, in Promo Template Mapping Final, and is included here because the journey uses it.


| Step             | State                   | Frame                                     | Link                                                                                                |
| ---------------- | ----------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Agreements       | Ready to accept         | Agreement                                 | [10642:238987](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=10642-238987) |
| Agreements       | One of two accepted     | If only 1 is accepted                     | [10642:239435](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=10642-239435) |
| Agreements       | Both accepted           | All accepted                              | [14682:29385](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14682-29385)   |
| Business profile | Fetching                | Fetching details                          | [14310:96730](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14310-96730)   |
| Business profile | Could not fetch         | Fetching failed                           | [14310:96902](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14310-96902)   |
| Business profile | Partly filled           | Mandatory field missing                   | [15925:107873](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=15925-107873) |
| Business profile | Filled                  | Business details with pre-filled data     | [14310:97053](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14310-97053)   |
| Business profile | All details filled      | All details filled, not NBFC              | [9329:60788](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=9329-60788)     |
| Business profile | Partly approved         | Partial approved                          | [14310:96336](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14310-96336)   |
| Business profile | All approved            | All approved                              | [14310:96467](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14310-96467)   |
| Business profile | Not approved            | Rejected                                  | [14310:96596](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14310-96596)   |
| Team             | People to invite        | Add User                                  | [3679:35357](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=3679-35357)     |
| Brands and LOBs  | Suggestions             | AI Suggestions for Brands & LOBs          | [7560:85281](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=7560-85281)     |
| Brands and LOBs  | Nothing found           | No Ai Suggestions                         | [7560:81801](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=7560-81801)     |
| Brands and LOBs  | Add after nothing found | Add Brands, after no AI suggestion        | [7560:89718](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=7560-89718)     |
| Brands and LOBs  | Preparing               | loading                                   | [7560:82090](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=7560-82090)     |
| Brands and LOBs  | Rejected                | Rejected Reason                           | [7560:82622](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=7560-82622)     |
| GTM partners     | No rate cards yet       | Servicing Partners                        | [18018:130609](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=18018-130609) |
| GTM partners     | Choose partners         | Select GTM Partner                        | [18018:131252](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=18018-131252) |
| GTM partners     | Final confirmation      | Terms of Service                          | [18018:130409](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=18018-130409) |
| GTM partners     | Allocation              | GTM Partner Set Distribution              | [18018:132190](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=18018-132190) |
| Templates        | Preparing               | AI Template Mapping Loader                | [14683:117523](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14683-117523) |
| Templates        | Suggestions             | AI Template mapping result                | [14683:117584](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14683-117584) |
| Templates        | Review suggestions      | Review Suggestions                        | [14683:117746](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14683-117746) |
| Templates        | Could not map           | AI Template Mapping Failed                | [14683:117546](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14683-117546) |
| Templates        | None mapped             | No Mapping                                | [14683:119667](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=14683-119667) |
| Kick off         | Learn more              | Learn about Consent Migration             | [10090:45821](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=10090-45821)   |
| Kick off         | Window not open         | Migration empty state, window not started | [10501:111720](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=10501-111720) |
| Kick off         | Upload screen           | Upload file                               | [9380:85341](https://www.figma.com/design/v6VQUvYZbG3jKvJRILt7OL/Consent-OS?node-id=9380-85341)     |


No frame above the dashboards is named for Team with nobody to invite. The Enhanced KYC section repeats "Business details with pre-filled data" several times. The link above is the first of those frames.