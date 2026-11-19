/* ============================================================
   1. CONFIGURATION (brief 9.2). Every tunable value lives here.
   All defaults are ILLUSTRATIVE. Nothing else hard-codes them.
   ============================================================ */
const CONFIG = {
  metric: { targetMinutes: 10 },
  trustBands: { greenFrom: 70, amberFrom: 30 },
  demeritPerVerifiedIncident: 1,
  reviewOpensAtDistinctUsers: 5,
  taskDueMinutes: { evidence: 15, correction: 20 },
  nextUpdateMinutes: 10
};

/* ---------- time helpers (HH:MM or HH:MM:SS, same day) ---------- */
const TM = {
  sec(t) { const p = String(t).split(':').map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); },
  fmt(s) { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); },
  fmtS(s) { return TM.fmt(s) + ':' + String(s % 60).padStart(2, '0'); },
  add(t, min) { return TM.fmt(TM.sec(t) + min * 60); }
};

/* ============================================================
   2. STRING DICTIONARY. English only. All interface text.
   {name} placeholders are filled by fill().
   ============================================================ */
const STR = {
  product: 'DigiConsent',
  module: 'Complaint management',
  pageTitle: 'DigiConsent Complaint Management',
  fictional: 'Fictional records. Simulated actions.',
  skip: 'Skip to the demonstration',
  modeStory: 'Walkthrough',
  modeDesks: 'App',
  modeLabel: 'Demonstration mode',
  about: 'About this solution',
  detail: 'View operating detail',
  restart: 'Restart',
  back: 'Back',
  next: 'Next',
  close: 'Close',
  caseSelect: 'Case',
  caseSelectTitle: 'Choose a case',
  caseSelectHint: 'Selecting a case restarts the story with that case\'s evidence.',
  keys: 'Keys: Left and Right Arrow move Back and Next. R restarts. Esc closes panels.',
  ctxEvent: 'Selected event',
  ctxReason: 'Subscriber\'s reason',
  ctxChange: 'Requested change',
  ctxNone: 'Not selected yet',
  ctxCase: 'Case',
  clock: 'Case clock',
  clockNotStarted: 'Starts when Vi (TAP) registers the complaint',
  clockMinute: 'Minute {n} of a {targetMinutes} minute target',
  clockStopped: 'Stopped at {t}: {n} minutes',
  clockPast: 'Past the {targetMinutes} minute target. Still open.',
  met: 'Met',
  missed: 'Missed',
  pending: 'Pending',
  excluded: 'Outside the metric',
  owner: 'Owner',
  nextUpdate: 'Next update',
  lastUpdate: 'Last update',
  none: 'None',
  problem: 'Subscriber problem {n}',
  problems: ['', 'I do not know how to complain.', 'I cannot easily explain what went wrong.', 'I wait too long and remain exposed.', 'The closure does not solve my problem.'],
  presenter: 'Presenter line',
  screens: [
    null,
    { name: 'Select event', q: 'Can I report without retyping the message?', line: 'Rohan got a delivery update and an offer from the same sender. Rohan wants the offers to stop, not the delivery updates.', p: 1 },
    { name: 'Explain and submit', q: 'Can I report and choose which offers to stop?', line: 'Rohan selects the reason, checks the box to stop scoped offers and submits. Report-only is the unchecked path.', p: 2 },
    { name: 'Follow the investigation', q: 'Who has the evidence, and what are we waiting for?', line: 'One case at {tap}. The facts that decide it sit in one log that only {pairText} can read.', p: 3 },
    { name: 'See the finding', q: 'Why did this case take this path?', line: 'The evidence sends this case down one of three paths.', p: 3 },
    { name: 'Confirm the remedy', q: 'What changed for the user and who fixed it?', line: 'Two things must finish: the subscriber\'s relief and the sender\'s fix. Acknowledging a task finishes neither.', p: 4 },
    { name: 'Report again', q: 'Is this an appeal, a duplicate or a failed correction?', line: 'If it happens again we ask: same problem, or do you disagree?', p: 4 },
    { name: 'Decision and rollout', q: 'What must Stage 1 prove before expansion, and what are we asked to sponsor?', line: 'One metric. What Stage 1 must prove, and what we ask you to sponsor.', p: 0 }
  ],
  /* ----- labels (brief 7.6) ----- */
  tags: { stage1: 'STAGE 1', stage2: 'STAGE 2', later: 'LATER', exists: 'EXISTS TODAY', proposed: 'PROPOSED', sourced: 'SOURCED', assumed: 'ASSUMED', illus: 'ILLUSTRATIVE', confirm: 'TO CONFIRM' },
  /* ----- status words (brief 5.6) ----- */
  chips: { reported: 'Reported', checking: 'Being checked', needs: 'Needs you', resolved: 'Resolved', notStarted: 'Not reported yet' },
  reopened: 'Reopened',
  steps: ['Registered', 'Checking evidence', 'Finding available', 'Action in progress', 'Action effective', 'Outcome sent'],
  stepSkipped: 'Not needed: {why}',
  layers: {
    net: { name: 'Network event (CDR)', short: 'Network event', status: 'exists', where: 'Stays with each operator.' },
    log: { name: 'Consolidated evidence log', short: 'Evidence log', status: 'proposed', where: 'One per message and recipient, between the two operators.' },
    src: { name: 'Source evidence', short: 'Source evidence', status: 'exists', where: 'With the enterprise and the consent register. Fetched when needed.' }
  },
  /* ----- screen 1 ----- */
  s1: {
    modes: 'How Rohan reports',
    modeInbox: 'Report from the inbox',
    modeShot: 'Share a screenshot',
    modeAssist: 'Assisted intake',
    inboxTitle: 'Messages',
    callsTitle: 'Recent calls',
    select: 'Select this message',
    selected: 'Selected',
    report: 'Report this message',
    reportCall: 'Report this call',
    reportHint: 'Tap the message you want to report.',
    reportHintCall: 'Tap the call you want to report.',
    wrongPick: 'This case follows the other message. Select it to continue. A service update can still be reported when it carries an offer.',
    shotTitle: 'Shared to the Vi app',
    shotHint: 'This screenshot shows more than one message. Highlight the one you are reporting.',
    shotConfirm: 'Confirm selection',
    shotNeed: 'Highlight one message to continue.',
    assistTitle: 'Call with 1909',
    assistVoice: 'DigiConsent voice agent',
    assistAgent: 'Agent',
    assistYou: 'Rohan',
    assistLines: ['I can see recent messages on this number. Which one is this about?', 'The one at {time} from {header}.', 'I have the message from {header} at {time} today. What went wrong?', '{reason}', 'To confirm: {header}, {time}, and your reason is "{reason}". Is that right?'],
    assistConfirm: 'Yes, that is right',
    assistNote: 'The agent reads the event and reason back before submission. It opens the same case at the operator.',
    routes: 'Every route opens the same case at {tap}',
    routesExist: ['Telco app', 'TRAI DND app', '1909', 'Sanchar Saathi (Chakshu)'],
    routesNew: ['Report from the inbox or call log', 'DigiConsent PWA', 'WhatsApp', 'Voice agent'],
    routesNote: 'How each proposed route registers at the operator is to confirm in the pilot.',
    prefill: 'What the report already knows',
    prefillNote: 'Filled from the selected message. OTP values are masked and unrelated conversation is left out.',
    fields: { sender: 'Sender or header', sim: 'Receiving SIM', channel: 'Channel', when: 'Date and time', text: 'Selected text', number: 'Phone number', duration: 'Call duration', name: 'Displayed name' },
    typed: 'Fields Rohan types',
    typedNew: '0',
    typedOld: '9',
    today: 'How it works today',
    todayOn: 'Showing today\'s journey',
    todaySteps: ['Find the route: TRAI DND app, telco app or 1909.', 'Re-enter the sender, the time and the message by hand.', 'Choose a broad category that may not fit the problem.'],
    todayForm: 'Today\'s complaint form asks for nine fields',
    todayFormSrc: 'One operator\'s form (Airtel).',
    todayFields: ['Mode of communication', 'Sender number', 'Business name', 'Reason', 'Category', 'Referred number', 'Date and time', 'Alternate mobile', 'Email'],
    todayReject: 'Vi rejected 360 of 29,224 complaints in March 2026 for a missing sender or date, and 54 for age over 7 days.',
    todayNew: 'With the message selected, the new flow asks the subscriber to type none of them.',
    window: 'Complaint window: 7 days.',
    serviceHint: 'You can report an offer even if the message was labelled as a service update.'
  },
  /* ----- screen 2 ----- */
  s2: {
    formTitle: 'Report a message',
    formTitleCall: 'Report a call',
    what: 'What went wrong?',
    always: ['Suspected scam', 'Other', 'Not sure'],
    scamTitle: 'Suspected fraud opens specialist support promptly.',
    scamLost: 'If money has already been lost, the first action is Call 1930. Your prepared report waits.',
    scamNote: 'Final routing is for compliance to validate.',
    scripted: 'This case is scripted for "{reason}". Submit uses that reason.',
    remedy: 'What should change?',
    box: 'Also withdraw my consent for promotional SMS from Example Retail, Online Retail. Keep delivery updates.',
    boxNote: 'Optional. Submit works with either choice.',
    noBoxService: 'This is a service message. No consent is changed. We will ask the sender to correct the account link.',
    noBoxCall: 'This caller is unregistered, so there is no consent to withdraw. You can block the number on your phone.',
    preview: 'What is shared',
    submit: 'Submit complaint',
    ackTitle: 'Complaint registered',
    investigation: 'Investigation',
    investigationPending: 'Pending',
    explainTitle: 'Two separate things happen on Submit',
    explain1: 'Submitting registers the complaint. Every complaint is investigated and tracked against the enterprise.',
    explain2: 'Only a checked box authorises a withdrawal. It is recorded in the same minute, before any finding.',
    explain3: 'Recorded is when the consent register holds it. In force is when the sender\'s systems and scrubbing honour it. The remedy counts as complete only when it is in force.',
    recorded: 'Recorded',
    inForce: 'In force',
    notRequested: 'Not requested',
    ackTarget: 'Acknowledge in under 1 minute',
    ackTargetNote: 'Proposed target. A next-update time is a commitment to update, not a promised completion time.',
    checkedPath: 'Box checked: scoped withdrawal',
    uncheckedPath: 'Box unchecked: report only',
    pathNote: 'Both choices register the same allegation and keep enterprise-level tracking.',
    resubmit: 'Change the choice and submit again',
    altPrompt: 'Pick "I never agreed" to load the disputed-permission version of this case.'
  },
  /* ----- screen 3 ----- */
  s3: {
    lanes: { dc: 'DigiConsent', rev: 'Authorised reviewer' },
    logBand: 'Evidence log',
    logLock: 'Only the two operators can read this',
    logLockOne: 'Only this operator can read this',
    logClosed: 'Locked. Not yet opened for this case.',
    logOpened: 'Opened for case {id} at {t}. Read logged.',
    logInternal: 'Internal log: {tap} wrote both halves.',
    logNone: 'No evidence log for calls. This case relies on the CDR and source evidence.',
    logEntries: '{n} entries',
    dcNoLog: 'DigiConsent hosts the encrypted log and cannot read it. This lane shows withdrawals, tasks and score entries only.',
    time: 'Time control',
    step: 'Step',
    stepBack: 'Step back',
    slider: 'Move the case clock',
    toEnd: 'Last event',
    nextEvent: 'Next: {t} {who}, {what}',
    noNext: 'No further events in this case.',
    waiting: 'What we are waiting for',
    waitingNone: 'Nothing is outstanding.',
    how: 'See how it works',
    factHint: 'Select any fact to see its source, time, layer and what it establishes.',
    notYet: 'Nothing here yet at {t}.',
    rules: 'Decision rules run in {tap}\'s own environment (telco-controlled).',
    preReg: 'The case clock starts when Rohan submits. Go back to submit, or press Next to use the scripted choices.'
  },
  fact: { title: 'Fact', source: 'Source', time: 'Time', layer: 'Layer', est: 'What it establishes', not: 'What it does not establish', version: 'Register version', writer: 'Written by', open: 'Open fact: {name}' },
  /* ----- screen 4 ----- */
  s4: {
    branches: 'Three paths',
    b: { violation: 'Violation confirmed', none: 'No violation found', pending: 'Evidence under review' },
    bLoads: { violation: 'Loads C101', none: 'Loads C102', pending: 'Loads C103' },
    showing: 'Showing {id}: {label}',
    allegation: 'Rohan said',
    answers: 'The facts that answer it',
    finding: 'Finding',
    interim: 'Intermediate finding',
    noFinding: 'No finding yet',
    noFindingWhy: 'No verdict is issued until the evidence supports one. A timeout or a missing record is never turned into "invalid".',
    why: 'Why',
    authority: 'Decision authority',
    runner: 'Rules run by',
    rule: 'Rule version',
    oap: 'Position of the sender\'s operator',
    actor: 'Accountable actor',
    first: 'First occurrence',
    checked: 'View what we checked',
    checkedLog: 'Evidence log entries',
    checkedSrc: 'Source evidence',
    checkedNet: 'Network event',
    logNote: 'The log records what the systems decided. It is not a verdict.',
    told: 'What Rohan is told',
    thr: ['Time', 'Written by', 'Check', 'Result'],
    cand: ['Candidate', 'Header', 'Time', 'Written so far']
  },
  /* ----- screen 5 ----- */
  s5: {
    left: 'Rohan\'s outcome',
    right: 'The sender\'s or operator\'s task',
    advance: 'Advance the remedy',
    stages: { requested: 'Requested', recorded: 'Withdrawal recorded', effective: 'Effective', informed: 'User informed' },
    advanceTo: 'Advance to: {what} ({t})',
    done: 'Remedy confirmed and Rohan informed.',
    stillOpen: 'This case stays open. Owner and next update are shown.',
    protection: 'Protection',
    wdRecorded: 'Withdrawal recorded at {t}',
    wdInForce: 'In force at {t}',
    wdPending: 'In force when confirmed',
    wdNone: 'No consent change requested. Marketing preference unchanged.',
    wdNA: 'No consent applies to this complaint.',
    keeps: 'Delivery updates remain enabled.',
    task: 'Enterprise task',
    taskNone: 'No enterprise task in this case yet.',
    tf: { pe: 'Enterprise (PE)', item: 'Campaign or template', reason: 'Reason', evidence: 'Minimum evidence', fix: 'Required correction', due: 'Due', owner: 'Named owner', challenge: 'Challenge route', done: 'Completion condition' },
    taskStates: ['Assigned', 'Acknowledged', 'Investigating', 'Applied', 'Verified'],
    taskBranches: 'Branches: Failed, Overdue, Disputed',
    ackWarn: 'Acknowledged means received. Rohan\'s correction is not complete.',
    appliedWarn: 'Applied means dispatched. It is complete only when in force and proven.',
    overdue: 'If the deadline passes',
    overdueText: 'The task turns Overdue. The executor\'s escalation contact is notified and {tap} updates Rohan with the owner and a new next-update time. Deadlines are pilot illustrations.',
    challenge: 'Dispute through the task exchange. A reviewer decides.',
    completion: 'Scope, execution outcome, effective time and a proof reference. An acknowledgement or a deadline alone does not count.',
    score: 'Trust score history',
    scoreBelongs: 'The score belongs to the enterprise (PE).',
    band: 'Band',
    bandGreen: 'Green',
    bandNote: 'Green from {greenFrom}, Amber from {amberFrom}, Red below {amberFrom}. Band chip and ledger only: no numeric score is shown.',
    ledgerHead: ['Case', 'Incident', 'Responsible actor', 'Authorised decision', 'Policy', 'Severity', 'Adjustment', 'Appeal'],
    ledgerEmpty: 'No entry yet for this case.',
    entries: { decrease: 'Decrease applied', nochange: 'No change', reversal: 'Reversal' },
    demerit: '{demerit} demerit per verified incident',
    scoreSep: 'A score adjustment and a network sanction are distinct decisions.',
    follow: 'Separate work',
    followNote: 'Does not hold Rohan\'s case open.',
    overturn: 'Reviewer overturns this finding',
    overturnUndo: 'Remove the reviewer simulation',
    overturned: 'Finding overturned on review. Reversal entry added. Corrected notices sent to Rohan and Example Retail. Case reopened at Under review.',
    resolvedCard: { found: 'What was found', done: 'What was done', protection: 'Current protection', confirmed: 'Confirmed by' }
  },
  /* ----- screen 6 ----- */
  s6: {
    tl: 'Where the new send falls',
    recorded: 'Recorded {t}',
    inforce: 'In force {t}',
    newSend: 'New send {t}',
    delivered: 'Delivered {t}',
    field: 'New message send time',
    presets: 'Try',
    rule: 'Classified by send time against the in-force time. Not the recorded time and not the delivery time.',
    late: 'Failed-fix investigation',
    lateText: 'Sent at {s}, after the correction came into force at {f}, in the same scope. A linked complaint opens. Which control failed is not yet known, so no further demerit until attribution.',
    early: 'Continued exposure during pending relief',
    earlyText: 'Sent at {s}, before the correction came into force at {f}. It is linked to the active correction and assessed on its own. It cannot show that the later fix failed.',
    noFix: 'No correction is in force in this case yet, so a new send is registered as a separate event linked to the open case.',
    same: 'Is this the same problem?',
    sameHint: 'Asked before anything is classified. If matching is uncertain, Rohan is asked before linking.',
    sameYes: 'Yes, link it to {id}',
    sameNo: 'No, this is different',
    linked: 'New event linked to {id}. Both case references are shown to Rohan.',
    notLinked: 'Registered as a separate case. Not linked.',
    open105: 'Open linked case C105',
    controls: 'Rohan\'s controls',
    again: 'It happened again',
    disagree: 'I disagree',
    dup: 'Submit the same event again',
    other: 'A delivery update arrives',
    appealOpen: 'Appeal opened against {id}. Authorised reviewer assigned. Next update {t}. Earlier evidence and decision are preserved.',
    appealResult: 'If the finding is revised, actions are corrected and an erroneous demerit is reversed.',
    dupResult: 'Existing case {id} returned with its current status. New evidence is appended. No second demerit. No second consent withdrawal. The original clock is not reset.',
    otherResult: 'Same sender, different purpose. An offers-only opt-out keeps delivery updates, so this may be expected. Rohan can still report a service message that carries an offer.',
    prevention: 'Prevention view',
    preventionText: 'Confirmed cases are grouped by the responsible campaign, template or control. Review opens at {reviewUsers} distinct affected users.',
    prevHead: ['Campaign or control', 'Distinct events', 'Affected recipients', 'Correction effective', 'Recurrence after'],
  },
  /* ----- screen 7 ----- */
  s7: {
    counted: 'Did this case count?',
    countYes: '{id} is in the Stage 1 scope: RTM SMS, and both ends are Stage 1 operators.',
    countNo: '{id} is outside the Stage 1 scope: a voice complaint about an unregistered caller. It stays out of the denominator.',
    resMet: 'Resolved in {n} minutes. Within the {targetMinutes} minute target.',
    resMissed: 'Resolved in {n} minutes. Outside the {targetMinutes} minute target. It stays in the denominator.',
    resPending: 'Still open after {targetMinutes} minutes of observation. It stays in the denominator as not met, with an owner and a next update.',
    resOverturned: 'Finding overturned on review. The result is corrected: this case no longer counts as met.',
    metric: 'The one headline metric',
    metricText: 'Percentage of all complaints registered in the pilot scope that receive meaningful resolution within {targetMinutes} minutes.',
    baseline: 'Baseline to be measured',
    metricRules: ['The clock starts when the subscriber\'s operator registers the complaint.', 'It stops at the latest of: the supported finding, the confirmed remedy (for a withdrawal, in force) and the outcome reaching the subscriber.', 'Pending, manual and failed cases stay in the denominator.', 'Retries do not add cases. Rerouting does not restart the clock.', 'An overturned finding corrects the result.'],
    examples: 'The demonstration cases',
    examplesNote: 'Fictional examples of how cases are counted. Not pilot performance.',
    exHead: ['Case', 'Stage', 'In scope', 'Time to resolution', 'Result'],
    rollout: 'Where the rollout starts',
    stages: [
      { tag: 'stage1', name: 'Stage 1, the first pilot', who: 'Vi and BSNL, each as sender\'s and subscriber\'s operator', what: 'RTM SMS: promotional first, then service and transactional', how: 'Both ends write the log in shadow. Decide from complete logs.' },
      { tag: 'stage2', name: 'Stage 2', who: 'Jio and Airtel start writing', what: 'RTM across all four operators', how: 'As Stage 1.' },
      { tag: 'later', name: 'Later', who: 'All four operators', what: 'UTM and P2P, SMS and voice. RTM voice (140 and 160 series).', how: 'CDR lookup with source evidence.' }
    ],
    stage1Note: 'Stage 1 is a two-operator shadow pilot. The DLT platform already serves both operators.',
    proofs: 'What Stage 1 must prove',
    proofList: [['The same message is found at both ends', 'Match rate, with ambiguous cases counted.'], ['The evidence is there in time', 'Freshness and completeness.'], ['Decisions lead to useful actions', 'Remedies confirmed complete.']],
    ask: 'What we ask you to sponsor',
    asks: [['Sponsor the solution and Stage 1', 'RTM SMS, Vi and BSNL, shadow first, with Jio and Airtel to follow.'], ['Agree the authority and remedy matrix', 'Which findings the sender\'s operator accepts as they are and which it reviews, who executes each action, and the enterprise deadlines.'], ['Gate routine automated action on proof', 'Enable it only after evidence matches, the evidence is there in time, and completed remedies are verified.']],
    yes: 'In scope',
    no: 'Out of scope'
  },
  /* ----- architecture ----- */
  arch: {
    title: 'How a complaint is decided',
    overview: 'Overview',
    thisCase: 'This case',
    list: 'Read as list',
    diagram: 'Show the diagram',
    stageAll: 'All operators',
    stage1: 'Stage 1',
    stageSwitch: 'Rollout view',
    layerFilter: 'Highlight a layer',
    layerOff: 'No highlight',
    dlt: 'DLT',
    dltText: 'Carries the complaint to the OAP channel. Holds the log\'s access rule and receipts.',
    dc: 'DigiConsent',
    dcItems: ['Consent register', 'Enterprise task exchange', 'Trust score history', 'Prevention view', 'Hosts the encrypted logs and cannot read them'],
    streams: 'Complaint streams',
    stream1: 'RTM promotional, and RTM service and transactional',
    stream1b: 'Decided from the evidence log',
    stream2: 'UTM and P2P',
    stream2b: 'CDR and source evidence',
    pairs: '12 directional pair logs and 4 internal logs',
    pairsS1: '2 pair logs and 2 internal logs in Stage 1',
    pairHi: 'Highlighted: {oap} to {tap}, the pair of {id}',
    pairInt: 'Highlighted: the internal log at {tap}, used by {id}',
    pairVoice: 'Highlighted: the UTM and P2P branch, used by the voice case',
    internal: 'internal log',
    svgAlt: 'Diagram of the four operators Vi, BSNL, Jio and Airtel. Each has an internal log and is joined to every other operator by two directional pair logs, twelve in all. The same content is available with Read as list.',
    lit: 'Reached at {t}',
    notLit: 'Not reached yet',
    nodes: {
      phone: 'Subscriber phone',
      log: 'Evidence log',
      logText: 'One per message and recipient. Both ends write. Only these two operators read it, by named roles with a case ID, every read logged.',
      logTextOne: 'One per message and recipient. Internal log: one operator writes both halves. Read by named roles with a case ID, every read logged.',
      logNone: 'There is no scrub log for calls. The CDR shows the call happened: time and duration.',
      src: 'Source evidence',
      srcText: 'Consent origin and scope, with acquisition or migration evidence. Message text against the registered template. The enterprise\'s trigger record. Campaign trace. Fetched on request.',
      dlt: 'DLT',
      dltText: 'Complaint carried to the OAP channel. Registers and action codes. Holds the log\'s access rule and receipts.',
      tapText: 'Case in CRM with SR number, clock and status. Calls the DLT API. Runs the decision rules in its own environment (telco-controlled).',
      oapText: 'Scrubs at its SMSC. Writes its half of the log. Reads the log through its own rules component. Accepts or reviews findings. Executes network actions it controls.',
      bothText: 'Case in CRM with SR number, clock and status. Scrubs at its SMSC and writes both halves of the internal log. Runs the decision rules in its own environment (telco-controlled).',
      dcText: 'Consent register and withdrawal receipts. Enterprise task exchange. Trust score history. Prevention view. Hosts the encrypted log and cannot read it.',
      pe: 'Example Retail (PE) and Example Messaging (TM)',
      peText: 'Receives a task, returns proof. Sees only the task information it needs.',
      rev: 'Reviewer',
      revText: 'Exceptions: conflicts, contested attribution and material sanctions.',
      airtel: 'Airtel',
      airtelText: 'The first lookup\'s answer, from today\'s portability data. Not the operator at the time of the call.'
    },
    edges: {
      report: 'Complaint to {tap}',
      dlt: '{tap} to DLT',
      oap: 'DLT to the {oap} channel',
      wd: 'Withdrawal request to the consent register, recorded at registration',
      log: 'Both ends write. {tap}\'s rules read the log',
      finding: 'Finding to the {tap} case',
      task: 'Task to the enterprise through the task exchange',
      proof: 'Proof returns',
      remedy: 'Remedy tasks to the consent register, enterprise or OAP',
      effective: 'Effective time to {tap}',
      inform: 'Outcome to the subscriber',
      score: 'Outcome to trust score history and the prevention view',
      lookup: 'First lookup names Airtel',
      reroute: 'Route recovery re-queries Jio under the same case ID'
    }
  },
  /* ----- role desks ----- */
  desk: {
    viewing: 'Viewing as',
    yourTurn: 'Your next action',
    waitingOn: 'Waiting on {who}',
    stepTo: 'Step to it',
    nothing: 'Nothing left for this role in this case.',
    sees: 'This role sees',
    cannot: 'This role cannot see',
    queue: 'What happens next',
    queueDone: 'Done',
    queueNow: 'Next',
    queueLater: 'Later',
    activity: 'Activity so far',
    preReg: 'Nothing has reached this desk. The complaint is not registered yet.',
    submitFirst: 'Submit the complaint as Rohan',
    roles: {
      sub: { name: 'Rohan', sub: 'Subscriber', sees: ['Own messages and calls', 'Case status, owner and next update', 'What changed and when it took effect'], cannot: ['The evidence log', 'Enterprise campaign records'] },
      tap: { sub: 'Subscriber\'s operator: owns the case', sees: ['The case in CRM, the clock and Rohan\'s status', 'The evidence log for this message, opened with a case ID', 'Findings from its own rules component'], cannot: ['Enterprise records beyond the proof returned for a task'] },
      oap: { sub: 'Sender\'s operator: writes its half of the log', sees: ['The complaint on its DLT channel', 'The evidence log through its own rules component', 'Findings to accept or review under the matrix'], cannot: ['Rohan\'s case record in Vi\'s CRM'] },
      dc: { name: 'DigiConsent', sub: 'Platform: consent, tasks and trust', sees: ['Consent register and withdrawal receipts', 'Enterprise task exchange', 'Trust score history and prevention view', 'Findings and task requests sent by the operators'], cannot: ['The evidence log. It hosts the encrypted log and holds no key.'] },
      pe: { name: 'Example Retail', sub: 'Enterprise (PE) with Example Messaging (TM)', sees: ['Only the task: the question, the minimum evidence, the correction and the due time'], cannot: ['The evidence log', 'Rohan\'s other consents or complaints', 'Other enterprises\' tasks'] },
      rev: { name: 'Reviewer', sub: 'Authorised reviewer: exceptions only', sees: ['Cases the rules do not cover: conflicts, contested attribution, material sanctions and appeals', 'The finding, its supporting facts and the decision record'], cannot: ['Routine cases decided by approved rule'] }
    },
    crm: 'Case record',
    crmF: { sr: 'SR number', status: 'Status', sub: 'Stage', match: 'Matched by', feed: 'Feed status', linked: 'Linked case' },
    logView: 'Evidence log for this message',
    logAccess: 'Read by named role with case ID. This read is logged.',
    channel: 'DLT channel',
    matrix: 'Authority matrix position',
    matrixNote: 'Illustrative. To be agreed.',
    register: 'Consent register',
    regF: { id: 'Record', scope: 'Scope', sms: 'Messages', calls: 'Calls', version: 'Register version', receipt: 'Receipt', history: 'History' },
    on: 'On',
    off: 'Off',
    offPending: 'Off (recorded, not yet in force)',
    exchange: 'Task exchange',
    lockedLog: 'Encrypted evidence log',
    lockedLogText: 'Hosted here. Found by a keyed hash of its matching key. DigiConsent holds no key and never opens it.',
    revQueue: 'Exception queue',
    revEmpty: 'No exception in this case. It was decided by approved rule.',
    revAppeal: 'Appeal on {id}: review the finding, the supporting facts and the decision record.',
    revPending: 'Pending review: {what}',
    noLogDesk: 'This lane never shows log entries.'
  },
  x: {
    running: 'Within target so far', open: 'Open', minutes: '{n} min', voiceCase: 'Voice case', phoneNow: 'Rohan\'s phone',
    noEnterprise: 'Enterprise', noEnterpriseText: 'The caller is an unregistered number. No registered enterprise is involved, so there is no enterprise task.',
    already: 'Your consent for these offers was withdrawn under case C101. No second withdrawal is created.',
    chooseReason: 'Choose a reason to submit.',
    prefInForce: 'Offers from Example Retail: withdrawn at {t}, in force at {f}',
    prefWithdrawn: 'Offers from Example Retail: withdrawn at {t}, in force when confirmed',
    prefUnchanged: 'Complaint registered. Your marketing preference is unchanged.',
    underReview: 'Under review', correctedNotice: 'Corrected notice',
    correctedText: 'A reviewer has overturned the earlier finding on this case. The case is open again and under review. We will tell you what changes.',
    latest: 'Latest update, {t}', question: 'Did you get one message or two at 11:20?', caseTitle: 'Case {id}',
    reportAnother: 'To report another offer, select it in your inbox and tap Report.',
    newFlow: 'New flow', todayFlow: 'Today\'s form', onSubmit: 'On submit', proposedTarget: 'PROPOSED TARGET', statusNow: 'Status',
    laneTap: 'Subscriber\'s operator. Owns the case.', laneOap: 'Sender\'s operator. Writes its half of the log.', laneDc: 'Consent, tasks and trust. Cannot read the log.', lanePe: 'Enterprise (PE). Sees only its task.', laneBoth: 'Both ends of this message. Owns the case.',
    by: 'by {who}', illusNote: 'Times, IDs and versions are invented for this fictional case.', soFar: 'Established so far', telco: 'telco-controlled',
    noScore: 'No enterprise is attributed in this case, so there is no score entry.', overturnedShort: 'Overturned on review', reversalDecision: 'Reversal by authorised reviewer', taskWord: 'Task',
    recurYes: 'Yes: sent after the correction was in force', recurNo: 'No: sent before the correction was in force', forRohan: 'What changed for Rohan',
    activityNone: 'No activity yet.', auto: 'Automatic step', logHalf: 'Log entries written by {who}', logHalfNote: 'Each end appends its own entries. Neither overwrites the other.',
    position: 'Position', accepted: 'Accepted', awaiting: 'Awaiting position', noFindingYet: 'No finding yet.', callsNone: 'Off (never granted)', granted: 'Granted {d}',
    returned: 'Evidence returned', nothingReturned: 'Nothing returned yet.', glossary: 'Glossary',
    jioText: 'Held the number when the call was made. Returns the call record (CDR) under the same case ID.', pathOrder: 'The path, in case order',
    caseAlt: 'Diagram of the parties in this case and the path between them. The same content follows as an ordered list, and Read as list shows the nodes as text.',
    archClock: 'Lit to the case clock:', rulesTelco: 'The rules are telco-controlled: each operator runs its own rules component.',
    namesNote: 'Operator names are real. The records, times and results shown for them are fictional.'
  },
  app: {
    consoles: { tap: 'Complaint desk', oap: 'Sender-side desk', dc: 'Platform console', pe: 'Enterprise portal', rev: 'Review queue' },
    actionNeeded: 'Action needed', empty: 'No complaints yet', emptyHint: 'Report a message from Rohan\'s phone.', quick: 'Submit the scripted complaint',
    undo: 'Undo', map: 'Map', doIt: 'Do it', goTo: 'Go to {who}', done: 'Resolved. Rohan has the outcome.', open: 'Open with',
    uphold: 'Uphold the finding', upheld: 'Appeal decided: the finding is upheld. The earlier evidence and decision stand.',
    appealTitle: 'Your appeal', appealText: 'A reviewer is looking at this case. The earlier evidence and decision are kept.'
  },
  live: { screen: 'Screen {n} of 7: {name}', clock: 'Case clock {t}. {what}', caseLoaded: 'Case {id} loaded.', submitted: 'Complaint registered.', mode: '{mode} mode.' }
};

function fill(s, v) {
  const cfg = {
    targetMinutes: CONFIG.metric.targetMinutes, greenFrom: CONFIG.trustBands.greenFrom, amberFrom: CONFIG.trustBands.amberFrom,
    demerit: CONFIG.demeritPerVerifiedIncident, reviewUsers: CONFIG.reviewOpensAtDistinctUsers,
    evidenceDue: CONFIG.taskDueMinutes.evidence, correctionDue: CONFIG.taskDueMinutes.correction, nextUpdate: CONFIG.nextUpdateMinutes
  };
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (v && v[k] != null) ? v[k] : (cfg[k] != null ? cfg[k] : m));
}

/* ============================================================
   3. CASE FIXTURES (brief section 8). All ILLUSTRATIVE.
   One timed-event list per case drives every surface.
   Event: t time, a actor, lane, ttl, txt, act (role action label),
   fact (optional fact card), p (state patch), on (option predicate).
   ============================================================ */
const NOT = {
  header: 'What the message actually said. A registered label cannot settle a content allegation.',
  template: 'A template label does not settle a content allegation. That needs the actual text.',
  chain: 'Who triggered this particular send, or why.',
  dnd: 'Consent. A preference check says only whether the category was blocked.',
  consent: 'A consent ID is a pointer. It does not prove how the consent was captured, or that no opt-out exists outside the register.',
  net: 'A network result does not prove content or consent, or who triggered the message.',
  src: 'A conclusion without the other layers. It is one party\'s record until joined with the log.'
};
function logRow(t, w, check, result, extra) {
  const key = { 'Header': 'header', 'Template': 'template', 'PE-TM chain': 'chain', 'DND': 'dnd', 'Consent': 'consent', 'Network result': 'net' }[check];
  const est = {
    header: 'The header was registered in this category when the check ran.',
    template: 'The message was sent against this registered template.',
    chain: 'The enterprise and telemarketer chain matched its declaration.',
    dnd: 'The result of the preference check when it ran.',
    consent: 'What the consent register held, in this version, when the check ran.',
    net: 'The result the network recorded for this event. Delivery is read from the result field.'
  }[key];
  return Object.assign({ t, w, check, result, layer: key === 'net' ? 'net' : 'log', est, not: NOT[key] }, extra || {});
}
const due = (t, kind) => TM.add(t, CONFIG.taskDueMinutes[kind]);
const nxt = (t) => TM.add(t, CONFIG.nextUpdateMinutes);

const REASONS = {
  promo: ['I never agreed', 'I already asked them to stop', 'Too many offers'],
  service: ['This update contains an ad', 'This account is not mine', 'Too many alerts'],
  call: ['Unrequested sales call', 'Repeated calls', 'Possible impersonation']
};
const SUBSCRIBER = { name: 'Rohan', number: '+91 98XXX XX317', sim: 'SIM 1, Vi' };
const SVC_MSG = { id: 'svc', header: 'VM-EXDLVR-S', time: '09:10', text: 'Your order 4821 arrives today.', cat: 'service', template: 'T-7702' };

function buildCases(c105Send) {
  const C = {};

  /* ---------------- C101 confirmed violation ---------------- */
  C.C101 = {
    id: 'C101', label: 'Confirmed violation', short: 'Offer after opt-out', stage: 'stage1', inScope: true,
    tap: 'Vi', oap: 'BSNL', pair: 'cross', kind: 'promo', branch: 'violation', type: 'RTM promotional SMS',
    inbox: [SVC_MSG, { id: 'm', header: 'VM-EXDLVR-P', time: '13:52', text: 'Special offer: get 30% off your next order.', cat: 'promo', template: 'T-7710' }],
    target: 'm', reason: 'I already asked them to stop', remedy: 'Stop offers; keep delivery updates', remedyNo: 'Report only; preference unchanged',
    consent: { id: 'C-1142', scope: 'Example Retail, Online Retail, promotional SMS', granted: '2 Nov', v0: 'v3204', v1: 'v3211', receipt: 'RC-0413', boxDefault: true },
    regAt: '14:00', branchAt: '14:04', sr: 'SR-26-0101', eventId: 'EV-101',
    ackLine: 'Vi is checking whether this offer was sent after your opt-out.',
    feed: 'BSNL feed current to 14:00. Vi feed current to 14:00.', match: 'Correlation ID',
    logOpenAt: '14:01',
    log: [
      logRow('13:52:40', 'oap', 'Header', 'registered, promotional'),
      logRow('13:52:40', 'oap', 'Template', 'T-7710, promotional'),
      logRow('13:52:40', 'oap', 'PE-TM chain', 'as declared'),
      logRow('13:52:41', 'tap', 'DND', 'category not blocked'),
      logRow('13:52:41', 'tap', 'Consent', 'C-1142, granted 2 Nov, not revoked', { ver: 'v3204' }),
      logRow('13:52:42', 'tap', 'Network result', 'delivered, source ref CDR-R-8830')
    ],
    src: [{ id: 's1', t: '14:04', from: 'Example Retail opt-out record and campaign trace', fact: 'STOP received 09:00:12 and logged by the enterprise. The campaign that sent the 13:52 offer used suppression list L-0911, built at 08:30.', est: 'The subscriber opted out with the enterprise before the offer was sent, and the campaign used a list built before that opt-out.', not: NOT.src }],
    task: (o) => ({ item: 'Campaign using suppression list L-0911, template T-7710', reason: 'Offer reported as sent after an opt-out', evidence: 'The enterprise\'s opt-out record for this number and the suppression list the campaign used', fix: 'Scoped offer suppression for this subscriber. Publish a corrected list.', due: due('14:01', 'evidence'), owner: 'Campaign owner, Example Retail' }),
    finding: (o) => ({
      name: 'After revocation', tone: 'red', branch: 'violation',
      head: 'This offer was sent after Rohan opted out.',
      why: 'The register never received the opt-out, so the log alone reads "Consent on record". The enterprise\'s own opt-out record, received at 09:00:12, moves the finding to After revocation. This is why the log is not a verdict.',
      facts: [['log', 4, 'The register still showed consent at 13:52. On its own this would read as permitted.'], ['src', 0, 'The enterprise holds an opt-out from 09:00:12 and sent from a list built at 08:30.'], ['log', 5, 'The offer was delivered at 13:52.']],
      authority: 'Approved rule, accepted by BSNL (OAP)', runner: 'Vi (TAP)', rule: 'R-demo-1', oapPos: 'Accepts', actor: 'Example Retail (PE)', first: 'Yes', at: '14:04'
    }),
    outcome: (o) => ({
      found: 'This offer was sent after your opt-out. The sender used an out-of-date suppression list.',
      done: o.w ? 'Your consent for promotional SMS from Example Retail was withdrawn and the sender corrected its list.' : 'The sender corrected its list so your 09:00 opt-out is honoured. No withdrawal was issued by this complaint.',
      protection: 'Offers from Example Retail are suppressed from 14:07. Delivery updates (VM-EXDLVR-S) are unaffected.',
      confirmed: 'Vi (TAP), from ' + (o.w ? 'the consent register receipt RC-0413 and ' : '') + 'list L-0912, at 14:07. You were informed at 14:08.'
    }),
    score: { key: 'decrease', incident: 'Offer after opt-out, EV-101', actor: 'Example Retail (PE)', decision: 'After revocation, by approved rule', policy: 'P-demo-1', severity: 'Verified incident, first occurrence', at: '14:08' },
    follow: { task: 'Wider campaign audit of other recipients on list L-0911', owner: 'Campaign owner, Example Retail', state: 'Pending' },
    repeat: { recorded: '14:00', inForce: '14:07', def: '14:35', alt: '14:05' },
    events: [
      { t: '14:00', a: 'tap', lane: 'tap', ttl: 'Case C101 registered in CRM', txt: 'SR-26-0101 issued. The clock starts. DLT API called.', p: { step: 0, owner: 'Vi case desk', next: nxt('14:00'), e: ['report', 'dlt'], msg: ['Case C101 registered at 14:00. Vi is checking whether this offer was sent after your opt-out. Next update by ' + nxt('14:00') + '.'] } },
      { t: '14:00', a: 'oap', lane: 'oap', ttl: 'Complaint on the BSNL channel', txt: 'Carried by the DLT API. No routine evidence request follows.', p: { e: ['oap'] } },
      { t: '14:00', a: 'dc', lane: 'dc', on: o => o.w, ttl: 'Withdrawal recorded', txt: 'Consent C-1142 withdrawn for promotional SMS. Register v3211, receipt RC-0413. It does not wait for the finding.', p: { wd: 'recorded', wdAt: '14:00', e: ['wd'] }, fact: { layer: 'src', source: 'DigiConsent consent register', est: 'The register holds the withdrawal from 14:00, as version v3211.', not: 'That the sender\'s systems and scrubbing honour it yet. That is the in-force time.' } },
      { t: '14:00', a: 'dc', lane: 'dc', on: o => !o.w, ttl: 'No consent change requested', txt: 'Report only. Marketing preference unchanged. The allegation is still tracked against the enterprise.', p: {} },
      { t: '14:01', a: 'tap', lane: 'tap', act: 'Open the evidence log', ttl: 'Evidence log opened', txt: 'Matched by correlation ID. Both halves are present, so no routine request goes to BSNL. The read is logged against C101.', p: { step: 1, logOpen: true, e: ['log'] } },
      { t: '14:01', a: 'tap', lane: 'pe', act: 'Send the enterprise task', ttl: 'Task assigned: opt-out record and suppression list', txt: 'One question: did this subscriber opt out before 13:52, and which suppression list did the campaign use? Due ' + due('14:01', 'evidence') + '.', p: { task: 'assigned', sub: 'Waiting for enterprise', e: ['task'] } },
      { t: '14:02', a: 'pe', lane: 'pe', act: 'Acknowledge the task', ttl: 'Task acknowledged', txt: 'Campaign owner, Example Retail. Acknowledged means received, nothing more.', p: { task: 'acknowledged' } },
      { t: '14:04', a: 'pe', lane: 'pe', act: 'Return the source evidence', ttl: 'Source evidence returned', txt: 'STOP received 09:00:12. Campaign used suppression list L-0911, built at 08:30.', p: { task: 'investigating', e: ['proof'] }, factRef: ['src', 0] },
      { t: '14:04', a: 'tap', lane: 'tap', act: 'Run the decision rules', ttl: 'Finding: After revocation', txt: 'Rules R-demo-1, run in Vi\'s own environment. PE-attributable, first occurrence.', p: { step: 2, finding: true, sub: null, e: ['finding'], msg: ['We confirmed this offer was sent after your opt-out.', 'Correction in progress.'] } },
      { t: '14:04', a: 'oap', lane: 'oap', act: 'Accept the finding', ttl: 'Finding accepted', txt: 'Accepted as it is under the illustrative matrix. No network action is needed from BSNL.', p: { accepted: true } },
      { t: '14:05', a: 'pe', lane: 'pe', act: 'Apply the correction', ttl: 'Scoped offer suppression applied', txt: 'Action ACT-101-1 dispatched. Applied is not yet in force.', p: { step: 3, task: 'applied', remedy: 'requested', e: ['remedy'] } },
      { t: '14:07', a: 'dc', lane: 'dc', on: o => o.w, act: 'Confirm the withdrawal is in force', ttl: 'Withdrawal in force', txt: 'The enterprise published list L-0912 and scrubbing adopted register v3211. Verified, proof RC-0413 and L-0912.', p: { step: 4, wd: 'inforce', inForceAt: '14:07', task: 'verified', remedy: 'effective', e: ['effective'] } },
      { t: '14:07', a: 'dc', lane: 'dc', on: o => !o.w, act: 'Confirm the correction is in force', ttl: 'Suppression in force', txt: 'The enterprise published list L-0912, which honours its own 09:00 opt-out. Verified, proof L-0912. No withdrawal was issued by this complaint.', p: { step: 4, task: 'verified', remedy: 'effective', e: ['effective'] } },
      { t: '14:08', a: 'tap', lane: 'tap', act: 'Inform Rohan', ttl: 'Outcome sent to Rohan', txt: 'Finding, what changed, effective time and how to challenge. Service updates (VM-EXDLVR-S) are unaffected.', p: { step: 5, informed: true, stopped: true, remedy: 'informed', sub: null, next: null, e: ['inform'], msg: ['We confirmed this offer was sent after your opt-out. Your marketing suppression took effect at 14:07. Service updates remain available.'] } },
      { t: '14:08', a: 'dc', lane: 'dc', act: 'Post the score entry', ttl: 'Trust score: Decrease applied', txt: 'One verified, PE-attributable incident. Policy P-demo-1. A network sanction would need its own decision.', p: { score: true, e: ['score'] } },
      { t: '14:08', a: 'pe', lane: 'pe', ttl: 'Separate task: wider campaign audit', txt: 'Other recipients on list L-0911. Owner: Campaign owner, Example Retail. Pending. It does not hold Rohan\'s case open.', p: { follow: true } }
    ]
  };

  /* ---------------- C102 permitted offer (internal log) ---------------- */
  C.C102 = {
    id: 'C102', label: 'Permitted offer', short: 'Too many offers', stage: 'stage1', inScope: true,
    tap: 'Vi', oap: 'Vi', pair: 'internal', kind: 'promo', branch: 'none', type: 'RTM promotional SMS',
    inbox: [SVC_MSG, { id: 'm', header: 'VM-EXDLVR-P', time: '14:48', text: 'Special offer: get 30% off your next order.', cat: 'promo', template: 'T-7710' }],
    target: 'm', reason: 'Too many offers', altReason: 'I never agreed', remedy: 'Stop offers; keep delivery updates', remedyNo: 'Report only; preference unchanged',
    consent: { id: 'C-2290', scope: 'Example Retail, Online Retail, promotional SMS', granted: '20 Oct', v0: 'v3410', v1: 'v3411', receipt: 'RC-0422', boxDefault: true },
    regAt: '15:00', branchAt: '15:02', sr: 'SR-26-0102', eventId: 'EV-102',
    ackLine: 'Vi is checking whether this offer was permitted.',
    feed: 'Vi feed current to 15:00.', match: 'Correlation ID',
    logOpenAt: '15:01',
    log: [
      logRow('14:48:10', 'oap', 'Header', 'registered, promotional'),
      logRow('14:48:10', 'oap', 'Template', 'T-7710, promotional'),
      logRow('14:48:10', 'oap', 'PE-TM chain', 'as declared'),
      logRow('14:48:11', 'tap', 'DND', 'category not blocked'),
      logRow('14:48:11', 'tap', 'Consent', 'C-2290, granted 20 Oct, not revoked', { ver: 'v3410' }),
      logRow('14:48:12', 'tap', 'Network result', 'delivered, source ref CDR-R-2217')
    ],
    src: [{ id: 's1', t: '15:02', on: o => !o.alt, from: 'Example Retail consent capture record', fact: 'Consent C-2290 was captured 20 Oct 18:41 through the enterprise\'s website form, consent text version 3, scope promotional SMS from Example Retail.', est: 'How and when this consent was captured, and that its scope covers this offer.', not: NOT.src }],
    task: (o) => ({ item: 'Consent C-2290, template T-7710', reason: o.alt ? 'Subscriber says no consent was given' : 'Offer reported as too frequent', evidence: 'How consent C-2290 was captured and what its scope is', fix: o.alt ? 'Produce the capture evidence, or stop sending and correct acquisition' : 'None required if capture and scope are verified', due: due('15:01', 'evidence'), owner: 'Customer data desk, Example Retail' }),
    finding: (o) => o.alt ? ({
      name: 'Consent on record', interim: true, tone: 'amber', branch: 'pending',
      head: 'A consent is on record, and Rohan disputes it. The sender is checking how it was captured.',
      why: 'Consent on record is an intermediate finding when its acquisition is disputed. No demerit on incomplete proof. The withdrawal stands either way.',
      facts: [['log', 4, 'The register held consent C-2290 at 14:48. A consent ID is a pointer, not proof of capture.']],
      authority: 'Review when disputed', runner: 'Vi (TAP and OAP)', rule: 'R-demo-1', oapPos: 'Review when disputed', actor: 'Not yet attributed', first: 'Not applicable', at: '15:02'
    }) : ({
      name: 'Consent on record', tone: 'green', branch: 'none',
      head: 'No rule breach found. The offer was permitted when it was sent.',
      why: 'Capture and scope are verified, so there is no violation. Frequency is a preference, not a breach. Rohan\'s chosen remedy is delivered separately from the finding.',
      facts: [['log', 4, 'The register held consent C-2290, not revoked, at 14:48.'], ['src', 0, 'The consent was captured on 20 Oct through the website form and covers promotional SMS.']],
      authority: 'Approved rule', runner: 'Vi (TAP and OAP)', rule: 'R-demo-1', oapPos: 'Not applicable: same operator', actor: 'None', first: 'Not applicable', at: '15:02'
    }),
    outcome: (o) => ({
      found: 'No rule breach. A valid consent from 20 Oct covered this offer.',
      done: o.w ? 'Your consent for promotional SMS from Example Retail was withdrawn, as you asked.' : 'Nothing was changed. Your marketing preference is unchanged, and you can withdraw this consent at any time.',
      protection: o.w ? 'Offers from Example Retail are suppressed from 15:06. Delivery updates are unaffected.' : 'Offers from Example Retail remain permitted. Delivery updates are unaffected.',
      confirmed: o.w ? 'Vi (TAP), from the consent register receipt RC-0422, at 15:06. You were informed at 15:07.' : 'Vi (TAP), by approved rule, at 15:02. You were informed at 15:03.'
    }),
    score: { key: 'nochange', incident: 'Offer reported, EV-102', actor: 'None', decision: 'Consent on record: permitted traffic', policy: 'P-demo-1', severity: 'None', at: '15:07', altDecision: 'Pending attribution', altAt: '15:10' },
    repeat: { recorded: '15:00', inForce: '15:06', def: '15:30', alt: '15:03' },
    events: [
      { t: '15:00', a: 'tap', lane: 'tap', ttl: 'Case C102 registered in CRM', txt: 'SR-26-0102 issued. The clock starts. DLT API called.', p: { step: 0, owner: 'Vi case desk', next: nxt('15:00'), e: ['report', 'dlt', 'oap'], msg: ['Case C102 registered at 15:00. Vi is checking whether this offer was permitted. Next update by ' + nxt('15:00') + '.'] } },
      { t: '15:00', a: 'dc', lane: 'dc', on: o => o.w, ttl: 'Withdrawal recorded', txt: 'Consent C-2290 withdrawn for promotional SMS. Register v3411, receipt RC-0422. It does not wait for the finding.', p: { wd: 'recorded', wdAt: '15:00', e: ['wd'] }, fact: { layer: 'src', source: 'DigiConsent consent register', est: 'The register holds the withdrawal from 15:00, as version v3411.', not: 'That the sender\'s systems and scrubbing honour it yet. That is the in-force time.' } },
      { t: '15:00', a: 'dc', lane: 'dc', on: o => !o.w, ttl: 'No consent change requested', txt: 'Report only. Marketing preference unchanged. The allegation is still tracked against the enterprise.', p: {} },
      { t: '15:01', a: 'tap', lane: 'tap', act: 'Open the evidence log', ttl: 'Internal evidence log opened', txt: 'Vi is both ends of this message, so the log is internal. Both halves are present. The read is logged against C102.', p: { step: 1, logOpen: true, e: ['log'] } },
      { t: '15:01', a: 'tap', lane: 'pe', act: 'Send the enterprise task', ttl: 'Task assigned: consent capture and scope', txt: 'One question: how was consent C-2290 captured, and what is its scope? Due ' + due('15:01', 'evidence') + '.', p: { task: 'assigned', sub: 'Waiting for enterprise', e: ['task'] } },
      { t: '15:02', a: 'pe', lane: 'pe', on: o => !o.alt, act: 'Return the source evidence', ttl: 'Source evidence returned', txt: 'Captured 20 Oct 18:41 through the website form, consent text version 3, scope promotional SMS from Example Retail.', p: { task: 'verified', e: ['proof'] }, factRef: ['src', 0] },
      { t: '15:02', a: 'tap', lane: 'tap', on: o => !o.alt, act: 'Run the decision rules', ttl: 'Finding: Consent on record', txt: 'Capture and scope verified. No violation. Frequency is a preference, not a breach.', p: { step: 2, finding: true, sub: null, e: ['finding'], msg: o => o.w ? ['No rule breach found. Your withdrawal is being put in force.'] : ['No rule breach found. Your marketing preference is unchanged.'] } },
      { t: '15:02', a: 'pe', lane: 'pe', on: o => o.alt, act: 'Acknowledge the task', ttl: 'Task acknowledged: capture being checked', txt: 'Customer data desk, Example Retail. The consent is disputed, so the capture evidence is being traced.', p: { task: 'investigating' } },
      { t: '15:02', a: 'tap', lane: 'tap', on: o => o.alt, act: 'Record the intermediate finding', ttl: 'Intermediate finding: Consent on record, disputed', txt: 'The register shows a consent. Rohan says none was given. No verdict and no demerit until capture is verified.', p: { finding: true, sub: 'Waiting for enterprise', owner: 'Customer data desk, Example Retail', next: '15:30', msg: ['Sender is checking how it was captured. Next update at 15:30.'] } },
      { t: '15:03', a: 'tap', lane: 'tap', on: o => !o.alt && !o.w, act: 'Inform Rohan', ttl: 'Outcome sent to Rohan', txt: 'No action was requested, so the action stages are skipped. Rohan is offered lower frequency or a scoped withdrawal.', p: { step: 5, skip: 'no action was requested', informed: true, stopped: true, next: null, e: ['inform'], msg: ['No rule breach found. Your marketing preference is unchanged. You can withdraw this consent at any time.'] } },
      { t: '15:03', a: 'dc', lane: 'dc', on: o => o.w, act: 'Dispatch the withdrawal', ttl: 'Withdrawal sent to the sender and scrubbing', txt: 'Enterprise and DLT notified. The DLT releases a token to update the consent register.', p: o => o.alt ? { remedy: 'requested', e: ['remedy'] } : { step: 3, remedy: 'requested', e: ['remedy'] } },
      { t: '15:06', a: 'dc', lane: 'dc', on: o => o.w, act: 'Confirm the withdrawal is in force', ttl: 'Withdrawal in force', txt: 'Scrubbing adopted register v3411. Verified, proof RC-0422.', p: o => o.alt ? { wd: 'inforce', inForceAt: '15:06', remedy: 'effective', e: ['effective'] } : { step: 4, wd: 'inforce', inForceAt: '15:06', remedy: 'effective', e: ['effective'] } },
      { t: '15:07', a: 'tap', lane: 'tap', on: o => !o.alt && o.w, act: 'Inform Rohan', ttl: 'Outcome sent to Rohan', txt: 'Finding and remedy are stated separately. Delivery updates are unaffected.', p: { step: 5, informed: true, stopped: true, remedy: 'informed', next: null, e: ['inform'], msg: ['No rule breach found, but your consent for promotional SMS from Example Retail has been withdrawn.'] } },
      { t: '15:07', a: 'dc', lane: 'dc', on: o => !o.alt, act: 'Post the score entry', ttl: 'Trust score: No change', txt: 'Permitted traffic. The reason and outcome are still recorded under the enterprise.', p: { score: true, e: ['score'] } },
      { t: '15:10', a: 'tap', lane: 'tap', on: o => o.alt, act: 'Send the minute 10 update', ttl: 'Update sent: still open', txt: 'Owner: Customer data desk, Example Retail. Next update 15:30. The withdrawal stands and there is no demerit.', p: { score: true, msg: o => ['Sender is checking how it was captured. Next update at 15:30.'].concat(o.w ? ['Your withdrawal stands.'] : []) } }
    ]
  };

  /* ---------------- C103 wrong service alert ---------------- */
  C.C103 = {
    id: 'C103', label: 'Wrong service alert', short: 'Alert for someone else\'s order', stage: 'stage1', inScope: true,
    tap: 'Vi', oap: 'BSNL', pair: 'cross', kind: 'service', branch: 'pending', type: 'RTM service SMS',
    inbox: [SVC_MSG, { id: 'm', header: 'VM-EXDLVR-S', time: '15:52', text: 'Your order 5307 has shipped and arrives tomorrow.', cat: 'service', template: 'T-7702' }],
    target: 'm', reason: 'This account is not mine', remedy: 'Correct the account link', remedyNo: 'Correct the account link',
    consent: null,
    regAt: '16:00', branchAt: '16:10', sr: 'SR-26-0103', eventId: 'EV-103',
    ackLine: 'Vi is checking why this alert reached your number.',
    feed: 'BSNL feed current to 16:00. Vi feed current to 16:00.', match: 'Correlation ID',
    logOpenAt: '16:02',
    log: [
      logRow('15:52:05', 'oap', 'Header', 'registered, service'),
      logRow('15:52:05', 'oap', 'Template', 'T-7702, service'),
      logRow('15:52:05', 'oap', 'PE-TM chain', 'as declared'),
      logRow('15:52:06', 'tap', 'DND', 'not applicable to this stream (to confirm)'),
      logRow('15:52:07', 'tap', 'Network result', 'delivered, source ref CDR-R-9142')
    ],
    logNote: 'No consent entry: service messages get no consent check.',
    src: [{ id: 's1', t: '16:21', from: 'Example Retail trigger and recipient mapping record', fact: 'Order 5307 was keyed with the wrong mobile number. The alert was triggered for the number ending 317, which is not on that account.', est: 'Why a registered service alert reached a number that has no such order.', not: NOT.src }],
    task: (o) => ({ item: 'Order alert trigger, template T-7702', reason: 'Service alert reported as belonging to another account', evidence: 'The trigger record and the account linked to the number ending 317', fix: 'Correct the number on order 5307. Keep essential alerts for the legitimate account.', due: '16:20', owner: 'Customer data desk, Example Retail' }),
    finding: (o) => ({
      name: 'Enterprise error confirmed', tone: 'amber', branch: 'pending',
      head: 'The alert was genuine, but it belongs to another account.',
      why: 'The log shows a registered service template delivered, so no rule was broken. The enterprise\'s own mapping record shows the wrong number was keyed. This is a data error, not a rule breach, and it comes from enterprise evidence, not from the log.',
      facts: [['log', 1, 'A registered service template was used.'], ['log', 4, 'The alert was delivered to this number at 15:52.'], ['src', 0, 'The enterprise confirms order 5307 was keyed with the wrong number.']],
      authority: 'Approved rule on enterprise evidence', runner: 'Vi (TAP)', rule: 'R-demo-1', oapPos: 'Not applicable', actor: 'Example Retail (PE), data error', first: 'Yes', at: '16:21'
    }),
    outcome: (o) => ({
      found: 'The alert belonged to another customer\'s order. The sender had the wrong number on that order.',
      done: 'Example Retail corrected the number on order 5307.',
      protection: 'You will not get alerts for that account. Alerts for your own orders continue.',
      confirmed: 'Vi (TAP), from the enterprise\'s proof reference EXR-FIX-2207, at 16:26. You were informed at 16:27.'
    }),
    score: { key: 'nochange', incident: 'Wrong-recipient alert, EV-103', actor: 'Example Retail (PE)', decision: 'Enterprise error confirmed', policy: 'P-demo-1', severity: 'Operational remediation tracked', at: '16:27' },
    repeat: null,
    events: [
      { t: '16:00', a: 'tap', lane: 'tap', ttl: 'Case C103 registered in CRM', txt: 'SR-26-0103 issued. The clock starts. DLT API called.', p: { step: 0, owner: 'Vi case desk', next: nxt('16:00'), e: ['report', 'dlt'], msg: ['Case C103 registered at 16:00. Vi is checking why this alert reached your number. Next update by ' + nxt('16:00') + '.'] } },
      { t: '16:00', a: 'oap', lane: 'oap', ttl: 'Complaint on the BSNL channel', txt: 'Carried by the DLT API. No routine evidence request follows.', p: { e: ['oap'] } },
      { t: '16:00', a: 'dc', lane: 'dc', ttl: 'No consent change', txt: 'Service message. No consent is checked for it and none is withdrawn.', p: {} },
      { t: '16:02', a: 'tap', lane: 'tap', act: 'Open the evidence log', ttl: 'Network event matched, log opened', txt: 'Matched by correlation ID. A registered service template was delivered. The log cannot say whose account it was.', p: { step: 1, logOpen: true, e: ['log'] } },
      { t: '16:02', a: 'tap', lane: 'pe', act: 'Send the enterprise task', ttl: 'Task assigned: trigger and account link', txt: 'One question: was this alert triggered for the number ending 317, and which account is linked? Due 16:20.', p: { task: 'assigned', sub: 'Waiting for enterprise', owner: 'Customer data desk, Example Retail', e: ['task'] } },
      { t: '16:04', a: 'pe', lane: 'pe', act: 'Acknowledge the task', ttl: 'Task acknowledged', txt: 'Customer data desk, Example Retail. Acknowledged means received, nothing more.', p: { task: 'acknowledged' } },
      { t: '16:10', a: 'tap', lane: 'tap', act: 'Send the minute 10 update', ttl: 'Minute 10: update sent, case still open', txt: 'Rohan sees Waiting for enterprise, the named owner and the next update. The target is missed and that is recorded.', p: { next: '16:20', msg: ['Waiting for enterprise. Customer data desk, Example Retail is checking which account this alert belongs to. Next update by 16:20.'] } },
      { t: '16:21', a: 'pe', lane: 'pe', act: 'Return the source evidence', ttl: 'Wrong mapping confirmed', txt: 'Order 5307 was keyed with the wrong number.', p: { task: 'investigating', e: ['proof'] }, factRef: ['src', 0] },
      { t: '16:21', a: 'tap', lane: 'tap', act: 'Run the decision rules', ttl: 'Finding: Enterprise error confirmed', txt: 'A data error, not a rule breach. Decided on enterprise evidence with the log.', p: { step: 2, finding: true, sub: null, next: '16:25', e: ['finding'], msg: ['The enterprise confirmed this alert belongs to another account. It is correcting the number. Next update at 16:25.'] } },
      { t: '16:25', a: 'tap', lane: 'tap', act: 'Send the on-time update', ttl: 'On-time update sent', txt: 'Correction in progress. Next update by 16:30.', p: { step: 3, remedy: 'requested', next: '16:30', e: ['remedy'], msg: ['Correction in progress. Next update by 16:30.'] } },
      { t: '16:26', a: 'pe', lane: 'pe', act: 'Apply the correction', ttl: 'Source record corrected', txt: 'Number corrected on order 5307. Proof reference EXR-FIX-2207.', p: { step: 4, task: 'verified', remedy: 'effective', inForceAt: '16:26', e: ['effective'] } },
      { t: '16:27', a: 'tap', lane: 'tap', act: 'Inform Rohan', ttl: 'Outcome sent to Rohan', txt: 'Resolved in 27 minutes, outside the target. Essential alerts continue for the legitimate account.', p: { step: 5, informed: true, stopped: true, remedy: 'informed', next: null, e: ['inform'], msg: ['The sender corrected the number at 16:26. You will not get alerts for that account. Alerts for your own orders continue.'] } },
      { t: '16:27', a: 'dc', lane: 'dc', act: 'Post the score entry', ttl: 'Trust score: No change', txt: 'Operational remediation tracked. Scoring applies only under an approved attributable-failure policy.', p: { score: true, e: ['score'] } }
    ]
  };

  /* ---------------- C104 ambiguous ---------------- */
  C.C104 = {
    id: 'C104', label: 'Ambiguous match', short: 'Two candidates, one delayed feed', stage: 'stage1', inScope: true,
    tap: 'Vi', oap: 'BSNL', pair: 'cross', kind: 'promo', branch: 'pending', type: 'RTM promotional SMS',
    inbox: [SVC_MSG, { id: 'm', header: 'VM-EXDLVR-P', time: '11:20', text: 'Special offer: get 30% off your next order.', cat: 'promo', template: 'T-7710' }],
    target: 'm', reason: 'I already asked them to stop', remedy: 'Stop offers; keep delivery updates', remedyNo: 'Report only; preference unchanged',
    consent: { id: 'C-3317', scope: 'Example Retail, Online Retail, promotional SMS', granted: '14 Sep', v0: 'v3301', v1: 'v3302', receipt: 'RC-0431', boxDefault: true },
    regAt: '12:00', branchAt: '12:10', sr: 'SR-26-0104', eventId: 'EV-104',
    ackLine: 'Vi is checking whether this offer was sent after your opt-out.',
    feed: 'BSNL feed current to 11:19. Vi feed current to 11:59.', feedWarn: true, match: 'Not matched: two candidates',
    logOpenAt: '12:01',
    log: [],
    candidates: [['M1', 'VM-EXDLVR-P', '11:20:08', 'Vi (TAP) entries only'], ['M2', 'VM-EXDLVR-P', '11:20:51', 'Vi (TAP) entries only']],
    src: [],
    task: null,
    finding: (o) => null,
    pendingWhy: 'Two messages share the header and the minute, and BSNL\'s half of the log is not there yet. The search never guesses between candidates.',
    outcome: null,
    score: { key: 'nochange', incident: 'Offer reported, EV-104', actor: 'Not yet attributed', decision: 'Pending: no demerit on suspicion', policy: 'P-demo-1', severity: 'None', at: '12:10' },
    repeat: null,
    events: [
      { t: '12:00', a: 'tap', lane: 'tap', ttl: 'Case C104 registered in CRM', txt: 'SR-26-0104 issued. The clock starts. DLT API called.', p: { step: 0, owner: 'Vi case desk', next: nxt('12:00'), e: ['report', 'dlt'], msg: ['Case C104 registered at 12:00. Vi is checking whether this offer was sent after your opt-out. Next update by ' + nxt('12:00') + '.'] } },
      { t: '12:00', a: 'oap', lane: 'oap', ttl: 'Complaint on the BSNL channel', txt: 'Carried by the DLT API.', p: { e: ['oap'] } },
      { t: '12:00', a: 'dc', lane: 'dc', on: o => o.w, ttl: 'Withdrawal recorded', txt: 'Consent C-3317 withdrawn for promotional SMS. Register v3302, receipt RC-0431. Enforcement stays pending until confirmed.', p: { wd: 'recorded', wdAt: '12:00', e: ['wd'] }, fact: { layer: 'src', source: 'DigiConsent consent register', est: 'The register holds the withdrawal from 12:00, as version v3302.', not: 'That it is in force. Enforcement is not yet confirmed.' } },
      { t: '12:00', a: 'dc', lane: 'dc', on: o => !o.w, ttl: 'No consent change requested', txt: 'Report only. Marketing preference unchanged. The allegation is still tracked against the enterprise.', p: {} },
      { t: '12:01', a: 'tap', lane: 'tap', act: 'Search the evidence log', ttl: 'Log search returns two candidates', txt: 'No correlation ID. ID mapping is unavailable because the BSNL feed is current only to 11:19. The bounded fallback on recipient, header and minute returns M1 and M2.', p: { step: 1, logOpen: true, sub: 'Waiting for network evidence', owner: 'Vi evidence desk', e: ['log'] } },
      { t: '12:01', a: 'oap', lane: 'oap', ttl: 'BSNL half not yet written', txt: 'BSNL feed current to 11:19. The 11:20 entries have not arrived. Answer: not yet available.', p: {} },
      { t: '12:02', a: 'tap', lane: 'tap', act: 'Ask Rohan one question', ttl: 'One question to Rohan', txt: 'Did you get one message or two at 11:20? Both texts are shown.', p: { needs: true, msg: ['One question: did you get one message or two at 11:20?'] } },
      { t: '12:03', a: 'sub', lane: 'tap', act: 'Answer: they look identical', ttl: 'Rohan answers: they look identical', txt: 'The case keeps both events and waits. No automatic verdict.', p: { needs: false, next: '12:15', msg: ['Thank you. We are keeping both messages on your case. Waiting for network evidence. Next update 12:15.'] } },
      { t: '12:10', a: 'tap', lane: 'tap', act: 'Send the minute 10 update', ttl: 'Minute 10: still waiting, clock still running', txt: 'Owner: Vi evidence desk. Retry when the BSNL feed covers the full 11:20 search window. Next update 12:15. The clock keeps running from 12:00.', p: { score: true, msg: o => ['Waiting for network evidence. Vi evidence desk will retry when BSNL\'s records arrive. Next update 12:15.'].concat(o.w ? ['Your withdrawal is recorded. It is in force when confirmed.'] : []) } }
    ]
  };

  /* ---------------- C105 after earlier action (send time is a field) ---------------- */
  (function () {
    const S = TM.sec(c105Send || '14:35');
    const inForce = TM.sec('14:07');
    const late = S >= inForce;
    const sT = TM.fmt(S);
    const deliv = late ? S + 24 : S + 240;
    const reg = TM.fmt(late ? S + 300 : S + 420);
    const r = (n) => TM.add(reg, n);
    C.C105 = {
      id: 'C105', label: 'After earlier action', short: 'Another offer after C101', stage: 'stage1', inScope: true, linked: 'C101',
      tap: 'Vi', oap: 'BSNL', pair: 'cross', kind: 'promo', branch: 'pending', type: 'RTM promotional SMS', late, sendAt: sT,
      inbox: [SVC_MSG, { id: 'old', header: 'VM-EXDLVR-P', time: '13:52', text: 'Special offer: get 30% off your next order.', cat: 'promo', template: 'T-7710', note: 'Reported as C101' }, { id: 'm', header: 'VM-EXDLVR-P', time: sT, text: 'Weekend deal: free delivery on your next order.', cat: 'promo', template: 'T-7711' }],
      target: 'm', reason: 'I already asked them to stop', remedy: 'Stop offers; keep delivery updates', remedyNo: 'Stop offers; keep delivery updates',
      consent: { id: 'C-1142', scope: 'Example Retail, Online Retail, promotional SMS', granted: '2 Nov', v0: 'v3204', v1: 'v3211', receipt: 'RC-0413', already: true, boxDefault: false },
      regAt: reg, branchAt: r(2), sr: 'SR-26-0105', eventId: 'EV-105',
      ackLine: 'Vi is checking this offer against your earlier case C101.',
      feed: 'BSNL feed current to ' + reg + '. Vi feed current to ' + reg + '.', match: 'Correlation ID',
      logOpenAt: r(1),
      log: [
        logRow(TM.fmtS(S + 20), 'oap', 'Header', 'registered, promotional'),
        logRow(TM.fmtS(S + 20), 'oap', 'Template', 'T-7711, promotional'),
        logRow(TM.fmtS(S + 20), 'oap', 'PE-TM chain', 'as declared'),
        logRow(TM.fmtS(S + 21), 'tap', 'DND', 'category not blocked'),
        logRow(TM.fmtS(S + 21), 'tap', 'Consent', 'C-1142, granted 2 Nov, not revoked', { ver: 'v3204' }),
        logRow(TM.fmtS(deliv), 'tap', 'Network result', 'delivered, source ref CDR-R-9377')
      ],
      src: [],
      task: (o) => late ? ({ item: 'Campaign using template T-7711', reason: 'Offer sent after a correction came into force', evidence: 'Campaign trace: which list and which register version this send used', fix: 'To be set once the failed control is attributed', due: due(r(2), 'evidence'), owner: 'Campaign owner, Example Retail' }) : null,
      finding: (o) => late ? ({
        name: 'Failed-fix investigation', interim: true, tone: 'amber', branch: 'pending',
        head: 'This offer was sent after the earlier correction came into force. Which control failed is not yet known.',
        why: 'The consent check read register v3204. The withdrawal is in v3211, so the scrubber that read v3204 was behind. That supports a stale register at the scrub, but it is not yet an attribution. Three candidates each have an owner. No further demerit until the control owner confirms.',
        facts: [['log', 4, 'The check read register v3204, older than v3211 which holds the withdrawal.'], ['log', 0, 'A promotional header and template, so category misuse is not supported.']],
        authority: 'Reviewer for contested attribution', runner: 'Vi (TAP)', rule: 'R-demo-1', oapPos: 'Reviews', actor: 'Not yet attributed', first: 'No: linked to C101', at: r(2)
      }) : ({
        name: 'Continued exposure during pending relief', interim: true, tone: 'amber', branch: 'pending',
        head: 'This offer was sent before the earlier correction came into force.',
        why: 'The send at ' + sT + ' is before the in-force time 14:07, so reading register v3204 is expected. It is linked to C101 and assessed on its own, because the opt-out dates from 09:00. It cannot show that the later fix failed. Delivery at ' + TM.fmt(deliv) + ' does not change the classification.',
        facts: [['log', 4, 'The check read register v3204. Expected: the withdrawal was not in force until 14:07.'], ['log', 5, 'Delivered at ' + TM.fmt(deliv) + '. Classification uses the send time, not this.']],
        authority: 'Approved rule, independent assessment', runner: 'Vi (TAP)', rule: 'R-demo-1', oapPos: 'Reviews', actor: 'Example Retail (PE), under assessment', first: 'No: linked to C101', at: r(2)
      }),
      outcome: null,
      score: { key: 'nochange', incident: 'Repeat offer, EV-105', actor: 'Not yet attributed', decision: late ? 'Pending attribution: no further demerit' : 'Linked to C101: no second demerit for the same cause until assessed', policy: 'P-demo-1', severity: 'None', at: r(10) },
      repeat: null,
      events: [
        { t: reg, a: 'tap', lane: 'tap', ttl: 'Case C105 registered, linked to C101', txt: 'SR-26-0105 issued. The clock starts. Send time ' + sT + ' is compared with the in-force time 14:07.', p: { step: 0, owner: 'Vi case desk', next: nxt(reg), e: ['report', 'dlt'], msg: ['Case C105 registered at ' + reg + ', linked to C101. Vi is checking this offer against your earlier case. Next update by ' + nxt(reg) + '.'] } },
        { t: reg, a: 'oap', lane: 'oap', ttl: 'Complaint on the BSNL channel', txt: 'Carried by the DLT API.', p: { e: ['oap'] } },
        { t: reg, a: 'dc', lane: 'dc', ttl: 'No second withdrawal', txt: 'The withdrawal of C-1142 was recorded at 14:00 (v3211) and in force at 14:07. Nothing new is issued.', p: { wd: 'inforce', wdAt: '14:00', inForceAt: '14:07' } },
        { t: r(1), a: 'tap', lane: 'tap', act: 'Open the evidence log', ttl: 'Evidence log opened', txt: late ? 'The consent check read register v3204. The withdrawal is in v3211. The scrubber was behind.' : 'The consent check read register v3204. Expected: the withdrawal was not yet in force at ' + sT + '.', p: { step: 1, logOpen: true, e: ['log'] } },
        late
          ? { t: r(2), a: 'tap', lane: 'tap', act: 'Open the failed-fix investigation', ttl: 'Failed-fix investigation opened', txt: 'Three candidates, each with an owner: the register refresh at Vi\'s scrub (Vi control owner), the enterprise campaign list (trace requested), the header or category (BSNL check).', p: { finding: true, sub: 'Under review', owner: 'Vi control owner', next: r(15), e: ['finding'], msg: ['This offer was sent after your opt-out took effect. We are finding out which control failed. Next update ' + r(15) + '.'] } }
          : { t: r(2), a: 'tap', lane: 'tap', act: 'Classify the send', ttl: 'Continued exposure during pending relief', txt: 'Sent before the in-force time. Linked to C101. An independent breach assessment opens, because the opt-out dates from 09:00.', p: { finding: true, sub: 'Under review', owner: 'Vi case desk', next: r(15), e: ['finding'], msg: ['This offer was sent before your opt-out took effect at 14:07. It is linked to case C101 and is being assessed on its own. Next update ' + r(15) + '.'] } },
        late ? { t: r(2), a: 'tap', lane: 'pe', act: 'Request the campaign trace', ttl: 'Task assigned: campaign trace', txt: 'Which list and which register version did this send use? Due ' + due(r(2), 'evidence') + '.', p: { task: 'assigned', e: ['task'] } } : null,
        late ? { t: r(3), a: 'oap', lane: 'oap', act: 'Check the header and category', ttl: 'Header and category checked', txt: 'The log shows a promotional header and template. Category misuse is not supported.', p: {} } : null,
        late ? { t: r(4), a: 'pe', lane: 'pe', act: 'Acknowledge the task', ttl: 'Task acknowledged', txt: 'Campaign owner, Example Retail. Acknowledged means received, nothing more.', p: { task: 'acknowledged' } } : null,
        { t: r(10), a: 'tap', lane: 'tap', act: 'Send the minute 10 update', ttl: 'Minute 10: update sent, case still open', txt: late ? 'Attribution pending. No further demerit until the control owner confirms. Next update ' + r(15) + '.' : 'Independent assessment continues. It cannot show the later fix failed. Next update ' + r(15) + '.', p: { score: true } }
      ].filter(Boolean)
    };
  })();

  /* ---------------- Voice case (Later) ---------------- */
  C.VOICE = {
    id: 'VOICE', label: 'Voice case', short: 'Sales call from a personal number', stage: 'later', inScope: false,
    tap: 'Vi', oap: 'Jio', oapRole: 'OAP at the time of the call', pair: 'voice', kind: 'call', branch: 'pending', type: 'P2P voice call',
    inbox: [{ id: 'k1', header: 'Aunty Meera', time: '12:31', text: 'Incoming, 6 min 12 s', cat: 'call' }, { id: 'm', header: '+91 9XXXX XX721', time: '14:04', text: 'Incoming, 42 s. Shown as "Example Finance"', cat: 'call', duration: '42 seconds', shown: 'Example Finance (caller-ID information)' }],
    target: 'm', reason: 'Unrequested sales call', remedy: 'Investigate the caller; block the number', remedyNo: 'Investigate the caller; block the number',
    consent: null,
    regAt: '14:20', branchAt: '14:58', sr: 'SR-26-0106', eventId: 'EV-V01',
    ackLine: 'Vi is tracing where this call came from.',
    feed: 'CDR lookup: answers state how current the records are.', match: 'CDR, after route recovery',
    logOpenAt: null, log: [], noLog: true,
    src: [
      { id: 'n1', t: '14:58', layer: 'net', from: 'Jio call record (CDR), read through the operator\'s API', fact: 'Call from +91 9XXXX XX721 to the number ending 317 at 14:04, 42 seconds.', est: 'That the call happened, its time and its duration.', not: 'What was said, or whether the brand named is real. A displayed caller name is caller-ID information.' },
      { id: 's1', t: '14:58', from: 'Related complaints against the number', fact: '3 related complaints against +91 9XXXX XX721 in the last 10 days (ILLUSTRATIVE).', est: 'That other subscribers report the same number. It points the same way.', not: 'Purpose or brand on its own. It is corroboration, not proof.' }
    ],
    task: null,
    finding: (o) => null,
    pendingWhy: 'The CDR shows the call happened. Purpose and brand still need corroboration, and there is no recording and no scrub log for calls.',
    outcome: null,
    score: null,
    repeat: null,
    events: [
      { t: '14:20', a: 'tap', lane: 'tap', ttl: 'Case registered in CRM', txt: 'SR-26-0106 issued. A voice complaint about an unregistered caller. Labelled LATER and outside the headline metric.', p: { step: 0, owner: 'Vi case desk', next: '15:00', e: ['report', 'dlt'], msg: ['Your report is registered at 14:20. Vi is tracing where this call came from. Next update at 15:00.', 'You can block this number on your phone now.'] } },
      { t: '14:20', a: 'dc', lane: 'dc', ttl: 'No consent record', txt: 'An unregistered caller has no consent record, so there is nothing to withdraw. Protection offered: block the number on the phone.', p: {} },
      { t: '14:22', a: 'tap', lane: 'tap', act: 'Run the first lookup', ttl: 'First lookup names Airtel', txt: 'Today\'s portability data says the number is with Airtel.', p: { step: 1, sub: 'Waiting for network evidence', e: ['lookup'] } },
      { t: '14:26', a: 'tap', lane: 'tap', act: 'Read the lookup answer', ttl: 'Answer: wrong operator', txt: 'Airtel has no such call at 14:04. One of six answers that replace "CDR not found". The route is corrected and the case ID is kept.', p: {} },
      { t: '14:28', a: 'tap', lane: 'tap', act: 'Recover the route', ttl: 'Event-time route names Jio', txt: 'The number was ported from Jio to Airtel eight days earlier (ILLUSTRATIVE). Vi re-queries Jio under the same case ID.', p: { owner: 'Traceback investigator at Vi (TAP)', e: ['reroute'] } },
      { t: '14:58', a: 'oap', lane: 'oap', act: 'Return the call record', ttl: 'CDR matched at Jio', txt: 'Call at 14:04, 42 seconds. It shows the call happened. It says nothing about purpose or brand.', p: { e: ['log'] }, factRef: ['src', 0] },
      { t: '14:58', a: 'tap', lane: 'tap', act: 'Corroborate purpose and brand', ttl: 'Corroboration under way', txt: '3 related complaints against the number in the last 10 days (ILLUSTRATIVE). The displayed name is caller-ID information and there is no recording. Pending with the traceback investigator.', p: { sub: 'Under review', next: '15:00', msg: ['We confirmed the call took place. We are still checking who made it and why. Traceback investigator at Vi is the owner. Next update at 15:00.'] }, factRef: ['src', 1] }
    ]
  };
  return C;
}
const CASE_ORDER = ['C101', 'C102', 'C103', 'C104', 'C105', 'VOICE'];
