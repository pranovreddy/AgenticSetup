const CONTENT = {
  about: [
    { h: `The problem today`, html: `
<p>How a complaint about a message from a registered sender (RTM, registered telemarketer traffic) moves from complaint to closure today. Stage times are indicative, may overlap and are not event-level timestamps.</p>
<table class="tbl"><thead><tr><th>Step</th><th>What happens</th><th>Time</th></tr></thead><tbody>
<tr><td>1. Register</td><td>The subscriber complains in the TRAI DND app, a telco app, 1909 or Sanchar Saathi (Chakshu). The subscriber's operator, the terminating access provider (TAP), registers it in its customer system (CRM) and issues a service request (SR) number. The shared register (DLT) is called.</td><td>Not timed</td></tr>
<tr><td>2. Identify the sender's operator</td><td>The originating access provider (OAP) is identified from the operator's own data, or by a number portability check for unregistered traffic. If it cannot be identified, the complaint is closed as incomplete details.</td><td>Not timed</td></tr>
<tr><td>3. Hand to the OAP</td><td>Written to the OAP's DLT channel.</td><td>Not timed</td></tr>
<tr><td>4. Evidence</td><td>System checks and a match against the network record (CDR). On other Vi message centres a sync wait comes first. Another operator as OAP replies later. For BSNL, no CDR found closes the complaint as CDR not found.</td><td>See the three waits below</td></tr>
<tr><td>5. Decision</td><td>A back-office agent reviews the system's recommended action.</td><td>About 1 day (Vi, BSNL) <span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>6. Close</td><td>Written back to DLT. Closure is the end state.</td><td>Not timed</td></tr>
</tbody></table>
<p><strong>Three separate waits, never one.</strong></p>
<ol>
<li><strong>Network records.</strong> System checks take 5 to 10 minutes <span class="tag tag-sourced">SOURCED</span>. On other Vi message centres there is a 12 hour sync wait <span class="tag tag-sourced">SOURCED</span>, then the CDR lookup answers in 30 minutes to 12 hours <span class="tag tag-sourced">SOURCED</span> (indicative).</li>
<li><strong>Scrub records.</strong> How long they take to reach the case is not measured.</li>
<li><strong>Joining them across operators.</strong> 2 days expected, often longer <span class="tag tag-sourced">SOURCED</span>. This includes the other operator's own investigation and cannot all be attributed to lookup.</li>
</ol>
<p><strong>What it adds up to.</strong> The complaint-level median action and resolution lag is 24 hours for RTM and 49 hours for unregistered (UTM) traffic <span class="tag tag-sourced">SOURCED</span> (medians, Vi sample, January to May 2026). Reported OAP closure averages range from 3 to 14 days <span class="tag tag-sourced">SOURCED</span>, six operators in the source, not weighted by complaints.</p>
<p><strong>What closure means to the subscriber.</strong> In the analysed RTM sample 96% of complaints were classified invalid <span class="tag tag-sourced">SOURCED</span>: Not a UCC 42%, Customer not in DND 33%, CDR not matched 6%, Preference not blocked 5%, Incomplete information 4% <span class="tag tag-sourced">SOURCED</span> (together 90% of invalid cases). Invalid is a regulatory or evidence disposition. It does not show that the message was appropriate or that the subscriber's concern was resolved.</p>
<p>About 80% of analysed RTM SMS complaints <span class="tag tag-sourced">SOURCED</span> concern service messages, unrequested OTPs or promotions sent through service headers. That is why service and transactional messages are in the solution, not only promotional ones.</p>
<p><strong>The four subscriber problems.</strong></p>
<ol><li>I do not know how to complain.</li><li>I cannot easily explain what went wrong.</li><li>I wait too long and remain exposed.</li><li>The closure does not solve my problem.</li></ol>` },

    { h: `The core idea`, html: `
<p>A complaint management solution that runs on the DigiConsent platform and works across operators. A subscriber reports one message or call. The TAP opens one case and keeps it to the end. A case ends when the subscriber has an explanation, any remedy they asked for has taken effect, and the cause has been assigned to the party that produced it.</p>
<p>It does five jobs: <strong>intake</strong> (report the exact message without retyping it), <strong>evidence</strong> (deciding facts in seconds or minutes), <strong>decision</strong> (a finding the evidence supports, by approved rule or an authorised reviewer), <strong>remedy</strong> (complete what the subscriber asked for and make the sender fix its cause) and <strong>prevention</strong> (use confirmed cases to find repeat causes and adjust enterprise trust).</p>
<p><strong>One consolidated evidence log per message</strong> <span class="tag tag-proposed">PROPOSED</span>, written by the message's OAP and its TAP, readable only by those two. The platform does not run the five scrub checks. Each end already logs its own checks. The solution joins the two halves.</p>
<ul>
<li>DND (do not disturb) and preference run at the OAP or the TAP. The time band is part of DND.</li>
<li>Consent runs at the TAP, not at the telemarketer.</li>
<li>Header, template and the enterprise-to-telemarketer chain run at the OAP and sometimes the TAP.</li>
<li>Service and transactional messages get no consent check but get the others.</li>
</ul>
<p><strong>Who runs the decision rules.</strong> The telcos hold the keys and run the rules inside their own environment: the TAP's, for its cases. The platform hosts the encrypted logs and cannot read them. It finds a log by a keyed hash of its matching key, so it never opens one. The telcos send findings and task requests to the platform, never the log <span class="tag tag-proposed">PROPOSED</span>.</p>
<p><strong>What stays as today.</strong> OAP identification, DLT registration and audit. Only the evidence lookup step is replaced. An incomplete log marks the case "evidence pending" and follows today's path.</p>` },

    { h: `Three layers of evidence`, html: `
<p>The CDR is not replaced. The log is added beside it. The layers join on sender, recipient, time and event reference.</p>
<table class="tbl"><thead><tr><th>Layer</th><th>What it records</th><th>Status</th><th>What it does not prove</th></tr></thead><tbody>
<tr><td>1. Network event (CDR)</td><td>The network event and the result recorded. A record can describe an attempt or a failure, so delivery is read from the result field. Covers registered and unregistered traffic.</td><td><span class="tag tag-exists">EXISTS TODAY</span></td><td>Content, consent, who triggered it</td></tr>
<tr><td>2. Consolidated evidence log</td><td>The checks performed, their results and the basis on which the systems allowed or blocked the communication, with register versions and references to the original records. Registered traffic only.</td><td><span class="tag tag-proposed">PROPOSED</span></td><td>A verdict. It records what the systems decided.</td></tr>
<tr><td>3. Source evidence</td><td>Consent origin and scope, message text against the registered template, the enterprise's trigger record. The main evidence for unregistered and person-to-person traffic.</td><td><span class="tag tag-exists">EXISTS TODAY</span> fetched when needed</td><td>A conclusion without the other layers</td></tr>
</tbody></table>` },

    { h: `The evidence log`, html: `
<ul>
<li>One log per message and recipient. Append-only: each end adds entries and neither overwrites the other. Every entry names its writer and the register version used.</li>
<li>One log per OAP and TAP pair. Four operators make 12 pair logs, plus 4 internal logs, one for each operator where OAP and TAP are the same.</li>
<li>Read only by named roles at the two operators, opened per complaint with a case ID, every read logged. Belonging to the pair is not enough.</li>
<li>Kept at least 7 days <span class="tag tag-sourced">SOURCED</span> (the complaint window), longer for open complaints. The DLT holds the access rule and receipts, not the rows (to confirm).</li>
<li>Sizing: about 1 billion a day kept 7 days, at 1 to 2 KB a log, is 7 to 14 TB before indexes, replication and overhead <span class="tag tag-assumed">ASSUMED</span>. What the 1 billion counts is to confirm.</li>
</ul>
<p><strong>Finding the same message.</strong> First a correlation ID carried between the two systems where feasible. Then a mapping between each end's local message IDs. Then a bounded fallback on recipient, header and a time window, which may return several candidates and never guesses.</p>
<p><strong>Keeping the log current.</strong> Targets to prove in the pilot, not measurements.</p>
<ul>
<li><strong>Freshness:</strong> searchable within a minute (Targets to prove).</li>
<li><strong>Gap detection:</strong> hourly counts per pair reconciled with source logs, gaps flagged within the hour (Targets to prove).</li>
<li><strong>Replay:</strong> unique entry IDs, so a late or repeated feed is replayed without duplicates.</li>
<li><strong>Outage recovery:</strong> complaints in a gap are marked "evidence pending", follow today's path and are backfilled. No complaint is closed as invalid because of a gap.</li>
</ul>` },

    { h: `Who does what`, html: `
<table class="tbl"><thead><tr><th>Party</th><th>Role in a case</th></tr></thead><tbody>
<tr><td>Subscriber</td><td>Selects the event, reason and desired remedy. An optional checkbox authorises scoped withdrawal. Can appeal or report again.</td></tr>
<tr><td>TAP (the subscriber's operator)</td><td>Owns the case and the subscriber's status. Registers in CRM, calls the DLT, writes its half of the log, decides from the log by approved rule in its own environment, informs the subscriber.</td></tr>
<tr><td>OAP (the sender's operator)</td><td>Writes its half of the log. Reads it through its own rules component. Accepts or reviews findings under the agreed matrix. Executes only network actions it controls.</td></tr>
<tr><td>DLT</td><td>Carries the complaint to the OAP channel. Holds registers, action and closure codes, and the log's access rule and receipts.</td></tr>
<tr><td>DigiConsent</td><td>Subscriber surfaces. Consent register and withdrawals with receipts. Enterprise task exchange with proof of completion. Trust score history. Prevention view. Hosts the encrypted logs and cannot read them.</td></tr>
<tr><td>Enterprise (PE) and telemarketer (TM)</td><td>Return source evidence. Correct the campaign, mapping, template or suppression. Prove completion. See only the task information they need.</td></tr>
<tr><td>Authorised reviewer</td><td>Handles conflicts, contested attribution and material sanctions.</td></tr>
</tbody></table>` },

    { h: `The metric`, html: `
<p><strong>Objective.</strong> Give the user an evidence-supported answer to their actual concern and complete their agreed remedy within {targetMinutes} minutes <span class="tag tag-sourced">SOURCED</span> wherever feasible. When the answer takes longer, explain the outstanding work and give a reliable next update.</p>
<p><strong>The one headline metric.</strong> Percentage of all complaints registered in the predefined pilot scope that receive meaningful resolution within {targetMinutes} minutes. <strong>Baseline to be measured.</strong></p>
<ul>
<li>The clock starts when the TAP's CRM registers the complaint.</li>
<li>It stops at the latest of: the supported final finding, confirmed completion of any required user remedy, and communication of the outcome to the user.</li>
<li>Pending, manual and failed cases count in the denominator once observed for {targetMinutes} minutes.</li>
<li>Retries do not add cases. Rerouting does not restart the clock. An overturned finding corrects the result.</li>
</ul>
<p><strong>What qualifies.</strong> The evidence supports the finding, the promised available action is confirmed, and pending work has an owner and a next update. A deadline or an acknowledgement alone does not count. Sender enforcement is tracked separately.</p>
<p><strong>Scope.</strong> <span class="tag tag-stage1">STAGE 1</span> RTM SMS where both ends are Vi or BSNL. Promotional first, then service and transactional. Unregistered, person-to-person and voice complaints are <span class="tag tag-later">LATER</span> and stay out. Case times on the page are <span class="tag tag-illus">ILLUSTRATIVE</span>. No invented uplift and no universal guarantee.</p>` },

    { h: `The stages`, html: `
<table class="tbl"><thead><tr><th>Stage</th><th>Operators</th><th>Complaint types</th><th>How it runs</th></tr></thead><tbody>
<tr><td>Whole solution</td><td>Vi, BSNL, Jio and Airtel, each as OAP and TAP</td><td>RTM promotional; RTM service and transactional; UTM and P2P, SMS and voice</td><td>Evidence log for RTM. CDR plus source evidence for UTM and P2P.</td></tr>
<tr><td><span class="tag tag-stage1">STAGE 1</span> the first pilot</td><td>Vi and BSNL, each as OAP and TAP. Only messages where both ends are Stage 1 operators.</td><td>RTM SMS: promotional first, then service and transactional</td><td>Both ends write the log in shadow. Decide from complete logs. Act once the OAP acceptance rules are agreed.</td></tr>
<tr><td><span class="tag tag-stage2">STAGE 2</span></td><td>Jio and Airtel start writing</td><td>RTM across all four operators</td><td>As Stage 1</td></tr>
<tr><td><span class="tag tag-later">LATER</span></td><td>All</td><td>UTM and P2P (SMS and voice); RTM voice</td><td>A shared lookup, below</td></tr>
</tbody></table>
<p><strong>Why Vi and BSNL first.</strong> The DLT platform already serves both operators.</p>
<p><strong>What Stage 1 must prove.</strong></p>
<ol><li>The same message is found at both ends (match rate, ambiguous cases counted).</li><li>The evidence is there in time (freshness and completeness).</li><li>Decisions lead to useful actions (remedies confirmed complete).</li></ol>
<p><strong>Voice complaints</strong> <span class="tag tag-later">LATER</span>. A voice complaint is about an unwanted call, not a complaint made by phone. The CDR shows that a call happened, not what was said or whether the brand is real. There is no scrub log for calls, so the evidence log does not cover them, and the CDR wait rules out a ten-minute promise. In Vi's March 2026 report as TAP, 26,596 of 29,224 complaints (91%) were about calls <span class="tag tag-sourced">SOURCED</span>. That is one operator in one month.</p>
<p><strong>Later: unregistered and person-to-person lookup.</strong> Operators feed one lookup while the CDRs stay where they are. A fingerprint is shared, not the CDR. Six answers replace "CDR not found": matched, ambiguous, not yet available, wrong operator, unavailable, no match in the searched scope.</p>` },

    { h: `Open items`, html: `
<p><strong>Assumed on this page until settled.</strong></p>
<ul>
<li>Proposed DigiConsent intake routes converge on the TAP's CRM. Channel integrations are to confirm in the pilot.</li>
<li>A service-labelled ad records the reason and opens a purpose-misuse review. A withdrawal checkbox appears only where a matching promotional consent is identified.</li>
<li>A withdrawal has no undo. A subscriber who wants offers again grants consent again through DigiConsent.</li>
</ul>
<p><strong>To confirm in the pilot.</strong></p>
<ul>
<li>Whether a correlation ID can be carried between message centres. This is the first test.</li>
<li>What the "1 billion a day" counts <span class="tag tag-assumed">ASSUMED</span>.</li>
<li>Whether the DLT can hold log rows, or only the access rule and receipts.</li>
<li>Whether DND applies to service and transactional streams.</li>
<li>The OAP acceptance rules, who executes each action, and the enterprise deadlines (illustrative today).</li>
<li>The evidence contract with the back office and network team.</li>
<li>The baseline: stage timestamps and a representative sample.</li>
<li>The regulatory items in the procedure, which are second hand.</li>
</ul>` },

    { h: `About the records`, html: `<p><strong>Operator names are real. The records, times and results shown for them are fictional.</strong></p>` }
  ],

  detail: {
    1: [
      { h: `1. Discover`, html: `
<p>Target a report action on the specific SMS or recent call where platform or inbox partnerships support it. Pilot alternative: share a screenshot into the telco app, highlight the relevant message, confirm the selection.</p>
<p>Every route opens the same case at the subscriber's operator, the terminating access provider (TAP).</p>
<ul>
<li><span class="tag tag-exists">EXISTS TODAY</span> Telco app, TRAI DND app, assisted 1909 and Sanchar Saathi (Chakshu).</li>
<li><span class="tag tag-proposed">PROPOSED</span> Report from the inbox or call log, and the DigiConsent web app (PWA), wallet, WhatsApp and voice agent. How each registers at the TAP is to confirm.</li>
</ul>
<p>An agent reads the event and reason back before submission.</p>` },
      { h: `2. Confirm the event`, html: `
<p>Prefill sender or header, or phone number, receiving SIM, channel, date and time, and the selected text or call duration where available. Ask for a missing date or SIM only when it changes the match.</p>
<p>Preview the data. Mask OTP values and omit unrelated conversation content.</p>
<p>Sender or header and date of receipt are mandatory. The complaint window is 7 days <span class="tag tag-sourced">SOURCED</span>.</p>
<p>Vi rejected 360 of 29,224 complaints in March 2026 for a missing sender or date, and 54 for age over 7 days <span class="tag tag-sourced">SOURCED</span>. The prefill exists to prevent those rejections.</p>` },
      { h: `How it works today`, html: `
<p>Find the route (TRAI DND app, telco app, 1909), re-enter the sender, time and message, and choose a broad category.</p>
<p>Today's form, one operator's complaint form, asks for 9 fields <span class="tag tag-sourced">SOURCED</span>: mode of communication, sender number, business name, reason, category, referred number, date and time, alternate mobile, email. With the message selected, the new flow asks the subscriber to type none of them.</p>` },
      { h: `What comes next`, html: `<p>Capture intent, choose the remedy and acknowledge. The consent withdrawal rule applies only when the subscriber explicitly selects the checkbox. See the operating detail on the next screen.</p>` }
    ],

    2: [
      { h: `3. Capture intent`, html: `
<p>The technical category is inferred in the backend. The subscriber picks a reason in their own words.</p>
<table class="tbl"><thead><tr><th>Message or call</th><th>Reasons offered</th></tr></thead><tbody>
<tr><td>Promotional</td><td>"I never agreed", "I already asked them to stop", "Too many offers"</td></tr>
<tr><td>Service</td><td>"This update contains an ad", "This account is not mine", "Too many alerts"</td></tr>
<tr><td>Transactional</td><td>"I did not start this", "Wrong transaction", "Duplicate alert"</td></tr>
<tr><td>Person-to-person call</td><td>"Unrequested sales call", "Repeated calls", "Possible impersonation"</td></tr>
</tbody></table>
<p>Always allow suspected scam, other and unsure. Suspected fraud opens specialist support promptly. If money has already been lost, the first action is "Call 1930" and the prepared report waits (compliance to validate the final routing).</p>
<p>A service-labelled message can still be reported as an advertisement: "You can report an offer even if the message was labelled as a service update."</p>` },
      { h: `4. Choose the remedy`, html: `
<p>For a matching promotional consent show an initially unchecked box: "Also withdraw my consent for promotional SMS from Example Retail, Online Retail. Keep delivery updates."</p>
<p>Submit complaint is enabled with either choice. For other concerns, capture the desired change.</p>` },
      { h: `5. Acknowledge`, html: `
<p>On acceptance by the operator's customer system (CRM) show: "Case C101 registered at 14:00. Vi is checking whether this offer was sent after your opt-out. Next update by 14:10." <span class="tag tag-illus">ILLUSTRATIVE</span></p>
<p>If delayed, show the reason, current owner and revised next update. A next-update commitment is different from a promised completion time.</p>
<p>The confirmation shows two separate lines, "Investigation: Pending" and "Offers from Example Retail: withdrawn at 14:00, in force when confirmed", plus "Delivery updates remain enabled."</p>
<p>Related target: acknowledge in under 1 minute (proposed target).</p>` },
      { h: `The consent withdrawal rule`, html: `
<p>Submitting registers the complaint. Only an explicitly selected checkbox authorises withdrawal on submission.</p>
<ul>
<li><strong>Applicability.</strong> Show the option for a matching promotional SMS or call consent. For a service-labelled message reported as an ad, track suspected misuse regardless of the checkbox. Offer withdrawal only for a separately identified matching promotional permission.</li>
<li><strong>What is withdrawn.</strong> The subscriber's consent for the sender and its line of business, on the channel complained about: SMS for an SMS offer, calls for a call.</li>
<li><strong>When.</strong> On submission with the box selected, withdrawal is requested at registration, independently of the verdict. Scope, choice, time and action ID are recorded.</li>
<li><strong>Unchecked.</strong> Register and investigate. Display "Complaint registered. Your marketing preference is unchanged." No withdrawal, no withdrawal receipt and no enforcement timer.</li>
<li><strong>Recorded, then in force.</strong> Recorded is when the consent register holds the withdrawal, in the same minute as registration. In force is when the sender's systems and scrubbing honour it. The Complaints code of practice (CoP) allows 30 minutes after resolution <span class="tag tag-sourced">SOURCED</span>. The user remedy is complete only when the withdrawal is in force. Later sends are classified against the in-force time.</li>
<li><strong>Who is told.</strong> The subscriber, the enterprise and the TAP's shared register (DLT). The DLT releases a token to update the consent register.</li>
<li><strong>No consent on record.</strong> There is nothing to withdraw. A do not disturb (DND) block is offered, which the subscriber confirms.</li>
<li><strong>Duplicates.</strong> A duplicate complaint does not create a second withdrawal.</li>
<li><strong>No undo.</strong> A subscriber who wants offers again grants consent again through DigiConsent (to confirm).</li>
</ul>` }
    ],

    3: [
      { h: `Register and route`, html: `
<p>The customer system (CRM) of the subscriber's operator, the terminating access provider (TAP), creates the service request (SR) number and calls the shared register (DLT). The DLT writes the complaint on the channel of the sender's operator, the originating access provider (OAP), for both internal and external cases.</p>
<p><strong>Exception.</strong> Preserve the original case ID and registration time on retry or reroute.</p>` },
      { h: `Optional scoped withdrawal`, html: `
<p>Submit the action once if the subscriber checked the box.</p>
<p><strong>Exception.</strong> Show requested, recorded and in force only as each is confirmed. A failed action has an owner and a retry.</p>` },
      { h: `Match`, html: `
<p>The TAP checks the shared correlation ID, then mapped local IDs, then recipient, header and a bounded time window. Compare the event-time route where available.</p>
<p><strong>Exception.</strong> Multiple candidates require clarification. Stale portability data triggers route recovery. Never guess between repeated OTPs.</p>` },
      { h: `Retrieve`, html: `
<p>Authorised operator rules, running in the TAP's environment, read the pair's evidence log. Each end appends its facts, source references and versions. Verify freshness and coverage for this route and event.</p>
<p><strong>Exception.</strong> Where the log is complete, answer directly without a routine OAP request. Otherwise request missing facts from their owner. The network result distinguishes attempted, failed and delivered events.</p>` },
      { h: `Investigate the reason`, html: `
<ul>
<li>Post-opt-out: compare scope, send time and effective revocation.</li>
<li>Disputed consent: verify the consent origin, scope and supporting evidence.</li>
<li>Disguised promotion: compare actual content with declared purpose.</li>
<li>Unrequested OTP: ask the enterprise about trigger and recipient mapping.</li>
</ul>
<p><strong>Exception.</strong> Ask one specific question with a due time (evidence tasks default to {evidenceDue} minutes <span class="tag tag-illus">ILLUSTRATIVE</span>). An enterprise sees only relevant task information. Consent on record is an intermediate finding when its acquisition is disputed.</p>` },
      { h: `Decide`, html: `
<p>Use approved automated rules only for evidence-complete findings within the agreed authority matrix. The OAP accepts or reviews findings under that agreement. A reviewer handles conflicts, contested attribution and material sanctions.</p>
<p><strong>Record.</strong> Finding, supporting facts, decision authority, rule version and accountable actor. When the OAP writes an authorised resolution to DLT, the TAP consumes it into CRM without routine duplicate back-office review.</p>` },
      { h: `Execute`, html: `
<p>The consent store or the enterprise confirms the scoped opt-out is in force. The enterprise fixes the account, campaign or trigger. An operator repairs a scrubber or executes an authorised network action.</p>
<p><strong>Exception.</strong> Task acknowledgement means received. Completion requires scope, execution outcome, effective time and proof reference. Retry using the same action ID. Escalate failures to the owner. Correction tasks default to {correctionDue} minutes <span class="tag tag-illus">ILLUSTRATIVE</span>.</p>` },
      { h: `Inform and monitor`, html: `
<p>The TAP explains the finding, why, what changed, the effective time, any separate work and the challenge route. The notification time is recorded.</p>
<p><strong>Exception.</strong> If user relief is pending, retain the owner and next update (default every {nextUpdate} minutes <span class="tag tag-illus">ILLUSTRATIVE</span>). Preserve evidence for open cases and appeals under agreed retention.</p>` },
      { h: `Evidence response drill-down`, html: `
<table class="tbl"><thead><tr><th>Answer</th><th>What happens</th></tr></thead><tbody>
<tr><td>Matched</td><td>Advances only the fact established.</td></tr>
<tr><td>Ambiguous</td><td>Bounded matching or one user clarification.</td></tr>
<tr><td>Not yet available</td><td>Retry scheduled against source freshness.</td></tr>
<tr><td>Wrong operator</td><td>Route corrected, case ID retained.</td></tr>
<tr><td>Unavailable</td><td>Escalated to the source owner.</td></tr>
<tr><td>No match in searched scope</td><td>Bounded recovery and alternative evidence checks.</td></tr>
</tbody></table>
<p>After exhausted recovery an authorised reviewer can report "Unable to determine" with limits, checks performed and appeal rights. A timeout or a missing record is never translated to "invalid".</p>` },
      { h: `Regulatory items the procedure follows (second hand, to verify)`, html: `
<p>These come second hand from the regulatory analysis. Verify them against the TRAI Direction of 27 February 2026 and the minutes of 2 April 2026 before showing them as requirements.</p>
<ul>
<li>No closure at an intermediary stage: terminal closure only on the final action, with a closure event to the complainant.</li>
<li>Standard action and closing codes, including intermediary states for unregistered traffic.</li>
<li>An appeal endpoint for the TRAI DND app.</li>
<li>Complaint history kept beyond three months, with a lifetime query.</li>
<li>Prompt API responses, within seconds.</li>
</ul>` }
    ],

    4: [
      { h: `The eight findings`, html: `
<p>Seven findings can come from the log and one from enterprise evidence. The rules are proposed and are to be agreed with the back-office team that decides today. Anything the rules do not cover goes to a person. The position of the sender's operator, the originating access provider (OAP), is illustrative and to be agreed. PE is the principal entity, the enterprise sender. TM is its telemarketer.</p>
<table class="tbl"><thead><tr><th>Finding</th><th>What the evidence shows</th><th>User relief</th><th>Executor and proof</th><th>Score</th><th>OAP position</th></tr></thead><tbody>
<tr><td>No consent</td><td>Promotional message, no valid consent at send time.</td><td>Explanation. Nothing to withdraw, so a do not disturb (DND) block is offered, which the subscriber confirms.</td><td>PE stops sending and fixes acquisition or targeting. Proof: effective time and scope, plus the PE's correction reference.</td><td>One PE demerit if PE-attributable and verified.</td><td>Accepts</td></tr>
<tr><td>After revocation</td><td>Consent revoked before the message was sent, in the register or in the enterprise's own opt-out record.</td><td>Scoped suppression with effective time. Service updates remain.</td><td>PE campaign owner corrects suppression. Proof: effective time plus campaign audit reference.</td><td>One PE demerit for the verified incident. Repeat sender flagged.</td><td>Accepts</td></tr>
<tr><td>Scrub miss</td><td>Preference blocked the category, message delivered.</td><td>Protection confirmed. Explanation of which control failed.</td><td>Owner of the scrubber that let it through. Proof: repair validated on later traffic.</td><td>Recorded against the proven actor. No PE penalty.</td><td>Reviews</td></tr>
<tr><td>Unregistered content or chain</td><td>Header, template or PE-TM chain check failed.</td><td>Explanation. Actual status of any selected withdrawal.</td><td>TM or PE corrects registration. OAP blocks the template or chain. Proof: block reference.</td><td>Per attribution, TM or PE.</td><td>Reviews</td></tr>
<tr><td>Category misuse</td><td>Promotional content in a service or transactional template. Needs the actual content compared with the registered template and category. A registered label alone cannot settle it.</td><td>Explanation. Actual status of any selected withdrawal.</td><td>PE and TM correct the campaign. OAP reclassifies or blacklists the template. Proof: reference.</td><td>Per attribution. Material sanctions by a reviewer.</td><td>Reviews</td></tr>
<tr><td>Consent on record</td><td>Verify how this record entered the register and its scope at send time.</td><td>Explain the supported basis and offer a challenge. Show any separately chosen remedy.</td><td>Acquired consent: verify grant evidence. Migrated consent: verify the source permission, migration linkage and scope mapping. Unknown origin: trace with the record owner.</td><td>No demerit on incomplete proof.</td><td>Review when disputed</td></tr>
<tr><td>Not verifiable</td><td>A check has no entry in the log, or recovery is exhausted.</td><td>The exact gap, what was checked, available protection, how to challenge.</td><td>Authorised reviewer records the limits. Where the missing entry shows scrubbing was skipped, the subscriber's operator decides the action on the OAP or TM.</td><td>None. Not counted as supported resolution. Never closed as invalid.</td><td>Not applicable</td></tr>
<tr><td>Enterprise error confirmed (not a log finding)</td><td>The enterprise's trigger and recipient mapping record, plus the log showing a registered service template delivered.</td><td>Explanation. Correction confirmed. Essential alerts continue for legitimate accounts.</td><td>PE corrects the source record. Proof: correction confirmed with time.</td><td>Operational remediation tracked. Scoring only under an approved attributable-failure policy.</td><td>Not applicable</td></tr>
</tbody></table>` },
      { h: `Three paths on the page`, html: `
<p>First occurrence is a history attribute and can accompany any finding. The page uses three initial paths: violation confirmed, no violation established on sufficient evidence, and investigation pending. The third is a live state. If an investigation ends inconclusively, that terminal outcome is shown separately.</p>
<p>"Invalid" is reserved for an approved internal classification, and its actual basis is explained to the user.</p>` },
      { h: `What the subscriber is told and what is done`, html: `<table class="tbl"><thead><tr><th>Case</th><th>User communication and control</th><th>Enterprise or operator outcome</th><th>Score treatment</th></tr></thead><tbody>
<tr><td>Valid, enterprise-attributable post-opt-out offer</td><td>"We confirmed this offer was sent after your opt-out. Your marketing suppression took effect at 14:07. Service updates remain available." <span class="tag tag-illus">ILLUSTRATIVE</span> Until confirmation, show "Correction in progress".</td><td>The enterprise campaign owner corrects suppression. The authorised sender's operator handles any network action. Record proof and review other affected campaigns.</td><td>One approved enterprise demerit for the verified incident.</td></tr>
<tr><td>Valid, control failure attributable to telco or telemarketer</td><td>Explain which control failed, user protection and expected correction.</td><td>Assign to the actual control owner and validate the repair.</td><td>Recorded against the proven actor. No enterprise penalty by association.</td></tr>
<tr><td>No violation found on sufficient evidence</td><td>Explain the basis in terms of the reported reason. Offer lower frequency, scoped withdrawal or another supported remedy. Confirm any selected action when effective.</td><td>Record reason and outcome under the enterprise. Track purpose-misuse concerns for review.</td><td>No violation demerit.</td></tr>
<tr><td>Legitimate service category, wrong recipient</td><td>"The enterprise confirmed this alert belongs to another account. It is correcting the number. Next update at 16:25." <span class="tag tag-illus">ILLUSTRATIVE</span> Follow with actual confirmation.</td><td>The enterprise validates the mapping privately and corrects the source record. Essential alerts continue for legitimate accounts.</td><td>Operational remediation tracked. Scoring only under an approved attributable-failure policy.</td></tr>
<tr><td>Evidence pending or disputed</td><td>Explain the unanswered question. Offer reason-specific relief, show actual protection status, owner and next update.</td><td>Create an enterprise-linked evidence or correction task with deadline and escalation. Verify consent origin, scope, content or trigger.</td><td>No demerit on suspicion.</td></tr>
<tr><td>Unable to determine after recovery</td><td>Explain what was checked, the remaining gap and available protection. Offer appeal and report-again controls.</td><td>Preserve the original reason and track suspected misuse at enterprise, template and campaign level. Escalate overdue or repeated concerns.</td><td>No violation demerit and no successful resolution credit.</td></tr>
</tbody></table>` }
    ],

    5: [
      { h: `What the subscriber is told and what is done`, html: `<table class="tbl"><thead><tr><th>Case</th><th>User communication and control</th><th>Enterprise or operator outcome</th><th>Score treatment</th></tr></thead><tbody>
<tr><td>Valid, enterprise-attributable post-opt-out offer</td><td>"We confirmed this offer was sent after your opt-out. Your marketing suppression took effect at 14:07. Service updates remain available." <span class="tag tag-illus">ILLUSTRATIVE</span> Until confirmation, show "Correction in progress".</td><td>The enterprise campaign owner corrects suppression. The authorised sender's operator handles any network action. Record proof and review other affected campaigns.</td><td>One approved enterprise demerit for the verified incident.</td></tr>
<tr><td>Valid, control failure attributable to telco or telemarketer</td><td>Explain which control failed, user protection and expected correction.</td><td>Assign to the actual control owner and validate the repair.</td><td>Recorded against the proven actor. No enterprise penalty by association.</td></tr>
<tr><td>No violation found on sufficient evidence</td><td>Explain the basis in terms of the reported reason. Offer lower frequency, scoped withdrawal or another supported remedy. Confirm any selected action when effective.</td><td>Record reason and outcome under the enterprise. Track purpose-misuse concerns for review.</td><td>No violation demerit.</td></tr>
<tr><td>Legitimate service category, wrong recipient</td><td>"The enterprise confirmed this alert belongs to another account. It is correcting the number. Next update at 16:25." <span class="tag tag-illus">ILLUSTRATIVE</span> Follow with actual confirmation.</td><td>The enterprise validates the mapping privately and corrects the source record. Essential alerts continue for legitimate accounts.</td><td>Operational remediation tracked. Scoring only under an approved attributable-failure policy.</td></tr>
<tr><td>Evidence pending or disputed</td><td>Explain the unanswered question. Offer reason-specific relief, show actual protection status, owner and next update.</td><td>Create an enterprise-linked evidence or correction task with deadline and escalation. Verify consent origin, scope, content or trigger.</td><td>No demerit on suspicion.</td></tr>
<tr><td>Unable to determine after recovery</td><td>Explain what was checked, the remaining gap and available protection. Offer appeal and report-again controls.</td><td>Preserve the original reason and track suspected misuse at enterprise, template and campaign level. Escalate overdue or repeated concerns.</td><td>No violation demerit and no successful resolution credit.</td></tr>
</tbody></table>` },
      { h: `Subscriber status`, html: `
<p>The timeline has six steps: Registered, Checking evidence, Finding available, Action in progress, Action effective, Outcome sent. "Waiting for enterprise", "Waiting for network evidence", "Under review" and "Reopened" appear when applicable. Each shows last update, accountable owner and next-update time. Where no action is required, the reason is given and the stage is skipped.</p>
<p>The status chip uses four words.</p>
<ul>
<li><strong>Reported:</strong> Registered.</li>
<li><strong>Being checked:</strong> every step from Checking evidence to Action effective, including the waiting and review states. The protection card shows what is recorded and what is in force.</li>
<li><strong>Needs you:</strong> a question to the subscriber.</li>
<li><strong>Resolved:</strong> Outcome sent.</li>
</ul>
<p>Reopened shows Being checked with a Reopened tag. No subscriber-facing final message reads Closed, Disposed, Invalid, Rejected, Resolved with no action, or Forwarded.</p>` },
      { h: `Enterprise task`, html: `
<p>The task shows the principal entity (PE, the enterprise sender), the relevant campaign or template, the reason, minimum evidence, required correction, due time, named owner and challenge route.</p>
<p>States: assigned, acknowledged, investigating, applied, verified. Branches: failed, overdue and disputed.</p>
<p>At expiry the executor's escalation contact is notified and the subscriber is updated through their operator. Deadlines are pilot illustrations and configuration values: evidence {evidenceDue} minutes, correction {correctionDue} minutes <span class="tag tag-illus">ILLUSTRATIVE</span>.</p>
<p>Acknowledgement means received. It never completes the user's correction.</p>` },
      { h: `Trust score`, html: `
<p>The score belongs to the PE. The history shows case, incident, responsible actor, authorised decision, policy version, severity, adjustment and appeal outcome.</p>
<ul>
<li>"Decrease applied" for confirmed PE-attributable misconduct: {demerit} demerit per verified incident <span class="tag tag-illus">ILLUSTRATIVE</span>.</li>
<li>"No change" for permitted traffic, pending attribution or a duplicate.</li>
<li>Distinct affected users and events are aggregated at campaign level for reviewer assessment. Raw complaint volume alone cannot determine a penalty.</li>
<li>An overturned finding creates a reversal entry and a corrected notice to the user and the enterprise.</li>
<li>A score adjustment and a network sanction require distinct decisions.</li>
</ul>
<p><strong>How the platform scores.</strong> Six pillars: DLT operational 30%, regulatory 25%, business legitimacy 20%, consent quality 15%, financial health 6%, digital reputation 4% <span class="tag tag-sourced">SOURCED</span>. Complaint signals sit in the DLT operational pillar. Phishing and fake OTP categories carry a heavier penalty multiplier.</p>
<p><strong>Bands and response ladder.</strong> Green from {greenFrom}: no action. Amber from {amberFrom}: temporary blocks that escalate from template to header to line of business to enterprise. Red below {amberFrom}: permanent template block, header deactivation and revocation of consents tagged to the line of business or the enterprise <span class="tag tag-illus">ILLUSTRATIVE</span>. The platform forwards the information to telcos, who act on senders.</p>
<p>The page shows the band chip and the adjustment ledger, not a numeric score or a formula.</p>` },
      { h: `Enterprise follow-up for every reported reason`, html: `
<p>Persist the event, original allegation, desired outcome, PE and known campaign or template, evidence status, verdict, action owner, due time and proof. If the PE is unknown, the subscriber's operator owns attribution. Findings and user relief stay separate. Lack of evidence is insufficient for a no-violation finding.</p>
<p><strong>Example.</strong> The subscriber reports a loan offer inside a service update and leaves the checkbox unchecked. The case and suspected purpose misuse are registered. The campaign owner is asked for the delivered content, declared purpose and template. The user is told which fact is missing, offered a supported scoped control and shown who will respond and when. Essential service alerts are preserved. On deadline expiry the case escalates to the investigator and the subscriber is updated.</p>
<p>Tracking continues across distinct complaints, including permitted or inconclusive events. Repeated signals trigger review. Confirmed misuse creates a correction task with proof and an effective time. A score change follows only attribution and an authorised finding. An unchecked box never disables follow-up or creates a withdrawal action.</p>` }
    ],

    6: [
      { h: `Is this the same problem?`, html: `
<p>Compare event identity, sender or resource, channel, purpose, remedy scope, event send time and the prior action's effective time. Keep every distinct event traceable.</p>
<p>A later send is classified by its send time against the time the withdrawal came into force, not the time it was recorded and not the delivery time.</p>
<p>Before classifying, ask "Is this the same problem?" If matching is uncertain, ask the subscriber before linking.</p>` },
      { h: `Five triggers`, html: `
<table class="tbl"><thead><tr><th>Trigger</th><th>Procedure</th><th>Consequence</th></tr></thead><tbody>
<tr><td>Same event submitted again</td><td>Return the existing case, show status and append any new evidence.</td><td>No second demerit. No second consent withdrawal. No reset of the original clock.</td></tr>
<tr><td>Subscriber disagrees with the finding</td><td>Open an appeal against the original case. Assign an authorised reviewer, show owner and update time, preserve the earlier evidence and decision.</td><td>Explain the upheld or revised finding, correct actions and reverse an erroneous demerit.</td></tr>
<tr><td>New send before the prior fix took effect</td><td>Register a separate event linked to the active correction. Assess any independent breach.</td><td>Continued exposure, but it cannot prove the later fix failed.</td></tr>
<tr><td>New send after an effective correction in the same scope</td><td>Register a linked complaint. Verify send time, sender, remedy scope and propagation, and identify which control failed.</td><td>If confirmed, reopen remediation, escalate to the campaign or control owner and consider an approved repeat demerit. Give the user both case references and the next action.</td></tr>
<tr><td>Same sender, different purpose</td><td>Verify the earlier opt-out scope. A delivery update after an offers-only opt-out may be expected.</td><td>Explain the distinction. Keep service alerts and let the user challenge actual disguised promotion.</td></tr>
</tbody></table>` },
      { h: `Prevention view`, html: `
<p>Confirmed cases are grouped by responsible campaign, template or control. The view shows distinct events, affected recipients, correction effective time and subsequent recurrence.</p>
<p>A threshold opens review: {reviewUsers} distinct affected users <span class="tag tag-illus">ILLUSTRATIVE</span>. Reviewers may request a wider correction, verify it on later traffic and apply authorised graduated action.</p>` }
    ],

    7: [
      { h: `The one headline metric`, html: `
<p>Percentage of all complaints registered in the predefined pilot scope that receive meaningful resolution within {targetMinutes} minutes <span class="tag tag-sourced">SOURCED</span>. The target is a configuration value. <strong>Baseline to be measured.</strong></p>
<ul>
<li>Start the clock when the customer system (CRM) of the subscriber's operator, the terminating access provider (TAP), registers the complaint.</li>
<li>Stop at the latest of: the supported final finding, confirmed completion of any required user remedy (for a selected withdrawal, the withdrawal in force), and communication of the outcome to the user.</li>
<li>Include pending, manual and failed cases in the denominator once they have had {targetMinutes} minutes of observation.</li>
<li>Technical retries do not add cases. Rerouting does not restart the clock.</li>
<li>Correct the result if a finding is overturned.</li>
</ul>` },
      { h: `What qualifies`, html: `
<p>Meaningful resolution means the evidence supports the finding, the promised available action is confirmed, and pending work has an owner and a next update. Sender enforcement is tracked separately.</p>
<ul>
<li>An explanation can qualify when it addresses the allegation and no user remedy remains outstanding.</li>
<li>A sender-wide campaign investigation may continue after user resolution if its result is not needed to settle this user's allegation or deliver their remedy. Both statuses are shown.</li>
<li>A pending enterprise correction to this user's account keeps the user case open.</li>
<li>A deadline or an acknowledgement alone does not count.</li>
</ul>` },
      { h: `Scope`, html: `
<p><span class="tag tag-stage1">STAGE 1</span> Messages from registered senders (RTM SMS) where both ends are Stage 1 operators, Vi or BSNL. Promotional first, then service and transactional.</p>
<p><span class="tag tag-later">LATER</span> Unregistered (UTM), person-to-person (P2P) and voice complaints stay out of the denominator.</p>
<p>Illustrative times are used only for the selected case. No invented uplift, no live regulator integration and no universal ten-minute guarantee.</p>` },
      { h: `Related targets (not the headline)`, html: `
<ul>
<li>Acknowledge in under 1 minute (proposed target). Shown as a step on Screen 2.</li>
<li>The Complaints code of practice (CoP) asks for 1 hour to resolve and inform telco-channel complaints, then 30 minutes for the action to become enforceable in scrubbing <span class="tag tag-sourced">SOURCED</span>.</li>
</ul>
<p><strong>The difference from the headline.</strong> The CoP figures are an outer limit for resolving and enforcing. The headline measures how many complaints reach meaningful resolution, with the remedy confirmed in force and the user informed, within {targetMinutes} minutes.</p>` },
      { h: `Numbers and sources`, html: `
<table class="tbl"><thead><tr><th>Number</th><th>Value</th><th>Source</th><th>Label</th></tr></thead><tbody>
<tr><td>Headline target</td><td>Meaningful resolution within {targetMinutes} minutes (configurable)</td><td>Strategy deck</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Acknowledgement</td><td>Under 1 minute</td><td>Strategy deck</td><td>Proposed target</td></tr>
<tr><td>CoP turnaround</td><td>1 hour to resolve and inform, then 30 minutes to become enforceable in scrubbing</td><td>Complaints CoP note</td><td><span class="tag tag-sourced">SOURCED</span> Operating detail only</td></tr>
<tr><td>System checks</td><td>5 to 10 minutes</td><td>Complaint flow workbook</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Sync wait, other Vi message centres</td><td>12 hours</td><td>Complaint flow workbook, confirmed</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>CDR lookup response</td><td>30 minutes to 12 hours</td><td>Complaint flow workbook</td><td><span class="tag tag-sourced">SOURCED</span> indicative</td></tr>
<tr><td>Back-office review</td><td>About 1 day (Vi, BSNL)</td><td>Complaint flow workbook</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Other operator as OAP</td><td>2 days expected, often longer</td><td>Complaint flow workbook</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Complaint-level medians</td><td>24 hours RTM, 49 hours UTM (Vi sample, January to May 2026)</td><td>Backend analysis</td><td><span class="tag tag-sourced">SOURCED</span> medians</td></tr>
<tr><td>OAP closure averages</td><td>3 to 14 days, six operators in the source</td><td>Backend analysis</td><td><span class="tag tag-sourced">SOURCED</span> not complaint-weighted</td></tr>
<tr><td>Invalid RTM</td><td>96%; reasons 42, 33, 6, 5 and 4% (90% of invalid)</td><td>Complaints analysis, via strategy deck</td><td><span class="tag tag-sourced">SOURCED</span> sample</td></tr>
<tr><td>Service-type share</td><td>About 80% of analysed RTM SMS complaints</td><td>RTM beyond-promotions note</td><td><span class="tag tag-sourced">SOURCED</span> sample</td></tr>
<tr><td>Volume, March 2026, Vi</td><td>As TAP 29,224 (2,628 SMS, 26,596 voice, voice 91%). As OAP 1,08,066 (UTM 1,03,487, RTM 4,579).</td><td>PMR Annexure X</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Intake rejections</td><td>Vi, March 2026, as TAP: 360 of 29,224 for missing sender or date; 54 for age over 7 days</td><td>PMR Annexure X</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Complaint window</td><td>7 days</td><td>PMR categories</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Fields on today's form</td><td>9</td><td>Complaint experience note</td><td><span class="tag tag-sourced">SOURCED</span> one operator's form</td></tr>
<tr><td>Sizing</td><td>1 billion a day (unit to confirm); 1 to 2 KB a log; 7 to 14 TB for 7 days</td><td>Design assumption</td><td><span class="tag tag-assumed">ASSUMED</span></td></tr>
<tr><td>Log targets</td><td>Searchable within a minute; gaps flagged within the hour</td><td>Design target</td><td>Targets to prove</td></tr>
<tr><td>Trust score pillars</td><td>DLT operational 30%, regulatory 25%, business legitimacy 20%, consent quality 15%, financial health 6%, digital reputation 4%</td><td>Reputation scoring model</td><td><span class="tag tag-sourced">SOURCED</span></td></tr>
<tr><td>Trust bands</td><td>Green from {greenFrom}, Amber from {amberFrom}, Red below {amberFrom} (configurable)</td><td>Complaints CoP note</td><td>Defaults <span class="tag tag-illus">ILLUSTRATIVE</span></td></tr>
<tr><td>Demerit size and review threshold</td><td>{demerit} demerit per verified incident; review opens at {reviewUsers} distinct affected users (configurable)</td><td>None in the materials</td><td><span class="tag tag-illus">ILLUSTRATIVE</span></td></tr>
<tr><td>Task deadlines and next update</td><td>Evidence {evidenceDue} minutes, correction {correctionDue} minutes, next update {nextUpdate} minutes (configurable)</td><td>None in the materials</td><td><span class="tag tag-illus">ILLUSTRATIVE</span></td></tr>
<tr><td>Case times, IDs, versions</td><td>Everything shown for the six cases</td><td>Invented</td><td><span class="tag tag-illus">ILLUSTRATIVE</span></td></tr>
</tbody></table>` }
    ]
  },

  glossary: [
    [`Subscriber`, `The person who receives the message or call and complains.`],
    [`PE (principal entity)`, `The enterprise on whose behalf messages are sent; the brand.`],
    [`TM (telemarketer)`, `The intermediary that delivers a PE's messages. The PE-TM chain is registered on the DLT.`],
    [`OAP (originating access provider)`, `The sender's operator, where the message enters the network.`],
    [`TAP (terminating access provider)`, `The subscriber's operator, where the message is delivered and the complaint is received.`],
    [`The four operators`, `Vi, BSNL, Jio and Airtel, the access providers the solution covers. Each can be OAP or TAP. Always written in this order and spelling.`],
    [`PWA, wallet, voice agent`, `The DigiConsent surfaces where a subscriber sees and changes consents: a web app, an in-app wallet and a phone conversation.`],
    [`DLT (distributed ledger technology)`, `The shared register of headers, templates, consents and complaints.`],
    [`SMSC (short message service centre)`, `The operator system that routes SMS.`],
    [`CDR`, `The operator's record of a network event and the result recorded.`],
    [`RTM (registered telemarketer) traffic`, `Messages and calls from registered senders: SMS headers and the 140 and 160 voice series.`],
    [`UTM (unregistered telemarketer) traffic`, `Messages and calls from unregistered numbers.`],
    [`P2P`, `Person-to-person numbers used for commercial contact.`],
    [`Voice complaint`, `A complaint about an unwanted phone call, as opposed to a complaint made by phone.`],
    [`DND (do not disturb)`, `The subscriber preference register, with category and time band.`],
    [`Scrubbing`, `The checks before delivery: DND or preference, consent, header, template, PE-TM chain.`],
    [`LoB (line of business)`, `The part of an enterprise that consent is scoped to.`],
    [`UCC`, `Unsolicited commercial communication.`],
    [`PMR (performance monitoring report)`, `The monthly report operators file with TRAI. Annexure X carries complaint counts.`],
    [`CoP (code of practice)`, `The platform's operating note for a topic, here complaints.`],
    [`CRM, SR`, `The operator's customer system, and the service request number it issues.`],
    [`MNP (mobile number portability)`, `Moving a number between operators. The operator at the time of an event can differ from today's.`],
    [`BO (back office)`, `Operator staff who review complaints today.`],
    [`Trust score`, `The platform's conduct-based score for an enterprise.`],
    [`TRAI, TCCCPR`, `The Telecom Regulatory Authority of India and the Telecom Commercial Communications Customer Preference Regulations.`]
  ]
};
