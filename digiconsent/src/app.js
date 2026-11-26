/* ------------------------------------------------------------------
   DigiConsent complaints, brief version.

   Flow: choose Message or Call -> add a screenshot -> the screenshot is
   scanned and the messages / calls in it are listed -> pick one (skipped
   when there is only one) -> reason -> optional comment -> optional
   consent revoke -> Submit -> complaint receipt with the agent working
   the case to a decision.

   Reasons and processing labels follow DigiConsent-PWA-Complaint-Brief.md.
   Motion follows "Consent OS - Agent Loaders": blue working, green done,
   amber waiting; the particle blob is the one recurring character.

   The screenshot reading, the record checks and the sender
   acknowledgements are SIMULATED: see ITEMS, buildPlan() and outcome().

   Edit this file or app.css, then run:  python3 build.py
------------------------------------------------------------------- */
const E = React.createElement;
const { useState, useEffect, useRef } = React;
const h = E;
const RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

/* ---- icons (stroke set shared with the loaders) ---- */
const ICON = {
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  signal: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  fileCheck: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
  radio: '<path d="M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4"/><circle cx="12" cy="12" r="2"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="m5 7-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>',
  receipt: '<path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2z"/><path d="M8 8h8M8 12h8"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  alert: '<path d="M12 8v5M12 16.5h.01"/><circle cx="12" cy="12" r="9"/>',
};
const ic = (name, size, cls) => E("svg", { className: "ic" + (cls ? " " + cls : ""), width: size || 18, height: size || 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, dangerouslySetInnerHTML: { __html: ICON[name] || "" } });
const MARK = '<path opacity=".95" transform="translate(13 3.094)" d="M0 0L4.952 3.714L0 7.429Z"/><path opacity=".85" transform="translate(16.715 8.047)" d="M4.952 0V6.19L0 4.333Z"/><path opacity=".75" transform="translate(16.715 15.475)" d="M4.952 2.476L0 5.571V0Z"/><path opacity=".95" transform="translate(8.047 15.475)" d="M4.952 7.429L0 3.714L4.952 0Z"/><path opacity=".85" transform="translate(4.334 11.762)" d="M0 6.19V0L4.952 1.857Z"/><path opacity=".75" transform="translate(4.334 4.953)" d="M0 3.095L4.952 0V5.571Z"/>';
const okdot = (tone, size) => h("span", { className: "okdot okdot--" + (tone || "ok"), style: size ? { width: size, height: size } : null }, ic(tone === "warn" ? "arrow" : tone === "bad" ? "alert" : "check", 10));

/* ---- toast + navigation shell ---- */
const toast = (() => {
  let t;
  return m => {
    let el = document.getElementById("sa-toast");
    if (!el) { el = document.createElement("div"); el.id = "sa-toast"; el.className = "sa-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = m; clearTimeout(t); t = setTimeout(() => el.remove(), 2600);
  };
})();
const nav = to => window.__nav(to);
const BRANDS = {};
Object.keys(LOGOS).forEach(id => { BRANDS[id] = { id, name: NAMES[id], logo: LOGOS[id] }; });

/* complaints filed in this session, shown on the history page */
const SEED = [
  { id: "CMP-X8K2M9PL", state: "under_review", mode: "SMS", date: "10 Mar 2026", desc: "Received unauthorized promotional SMS from unknown sender." },
  { id: "CMP-R4JN7YBQ", state: "resolved", mode: "Robo Call", date: "28 Feb 2026", desc: "Automated call received despite consent revocation." },
  { id: "CMP-W1DF5GHT", state: "rejected", mode: "Voice Call", date: "15 Feb 2026", desc: "Unwanted sales call during late hours." },
];
let FILED = [];
const fileCase = c => {
  const i = FILED.findIndex(x => x.id === c.id);
  if (i >= 0) FILED[i] = { ...FILED[i], ...c };
  else FILED.unshift({ date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), isNew: true, ...c });
  window.dispatchEvent(new Event("sa-filed"));
};
const newId = () => "CMP-" + Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

/* ==================================================================
   Demo data: what the screenshot "reading" finds
   ================================================================== */
const ITEMS = {
  m1: { id: "m1", type: "message", cls: "promo", sender: "VM-HDFCBK", brandId: "hdfc-bank", time: "10:42 AM",
    text: "HDFC Bank: Pre-approved Personal Loan of Rs.5,00,000 at 10.49% p.a. Apply now: hdfcbank.co/pl",
    permission: { purpose: "personal loan offers", channels: ["SMS"] }, consent: "valid",
    record: "You agreed on 14 Mar 2024, in the HDFC Bank app, to receive personal loan offers by SMS." },
  m2: { id: "m2", type: "message", cls: "promo", sender: "AX-HDFCBK", brandId: "hdfc-bank", time: "12:05 PM",
    text: "HDFC Bank: Get the Millennia Credit Card with 5% cashback on every order. Apply in 2 minutes...",
    permission: { purpose: "credit card offers", channels: ["SMS", "call"] }, consent: "mismatch",
    record: "Your original permission covered personal loan offers.", used: "credit card offer" },
  m3: { id: "m3", type: "message", cls: "service", sender: "HDFCBK", brandId: "hdfc-bank", time: "2:30 PM",
    text: "HDFC Bank: Your EMI of Rs.12,450 is due on 5 Dec. Pay now and get 10% off a top-up loan: hdfc.co" },
  m4: { id: "m4", type: "message", cls: "otp", sender: "VM-PAYTMB", brandId: "paytm", time: "4:10 PM",
    text: "428193 is your OTP for Paytm login. Do not share this code with anyone. Valid for 10 minutes." },
  c1: { id: "c1", type: "call", cls: "unknown", sender: "+91 98765 43210", brandId: null, time: "6:30 PM",
    text: "Incoming call · 1 min 05 sec", sub: "Mobile · Not in your contacts" },
  c2: { id: "c2", type: "call", cls: "promo", sender: "1409 220 418", brandId: "hdfc-bank", time: "11:20 AM",
    text: "Incoming call · 2 min 12 sec", sub: "Registered telemarketer (140 series)",
    permission: { purpose: "credit card offers", channels: ["call"] }, consent: "valid",
    record: "You agreed on 2 Aug 2025, on hdfcbank.com, to receive credit card offers by call." },
  c3: { id: "c3", type: "call", cls: "service", sender: "1600 412 208", brandId: "hdfc-bank", time: "3:05 PM",
    text: "Incoming call · 0 min 48 sec", sub: "Service line (1600 series)" },
};
const rows = (n, of) => Array.from({ length: n }, (_, i) => ({ x: 0, y: +(i * 100 / of).toFixed(2), w: 100, h: +(100 / of).toFixed(2) }));
const LIST5 = rows(5, 5);
/* each demo screenshot: which events it shows, where each sits (percent), and any one-time code to hide */
const SAMPLES = {
  message: [
    { key: "sample-many-whole-list", label: "Inbox, 4 messages", ids: ["m1", "m2", "m3", "m4"], boxes: LIST5.slice(0, 4), mask: { x: 13.4, y: 69.6, w: 10.4, h: 4.6 } },
    { key: "sample-m1-promo-loan", label: "One loan offer", ids: ["m1"] },
    { key: "sample-m3-service-emi", label: "EMI reminder", ids: ["m3"] },
    { key: "sample-m4-otp", label: "One-time code", ids: ["m4"], mask: { x: 13.2, y: 49, w: 10.5, h: 19.5 } },
  ],
  call: [
    { key: "gen-call-log", label: "Call log, 3 calls", ids: ["c2", "c3", "c1"], boxes: rows(3, 3) },
    { key: "sample-c1-call", label: "One unknown call", ids: ["c1"] },
  ],
};
/* the 3-call log is drawn here so the call path can show a list too */
const drawCallLog = () => {
  const list = ["c2", "c3", "c1"].map(id => ITEMS[id]), RH = 190, cv = document.createElement("canvas");
  cv.width = 1080; cv.height = RH * list.length;
  const g = cv.getContext("2d"), F = (w, s) => w + " " + s + 'px Inter, -apple-system, "Segoe UI", Roboto, sans-serif';
  g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
  list.forEach((it, i) => {
    const y = i * RH, br = it.brandId;
    g.fillStyle = br ? "#ed232a" : "#64748b"; g.beginPath(); g.arc(86, y + 62, 38, 0, 6.2832); g.fill();
    g.fillStyle = "#fff"; g.font = F(700, 34); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(br ? "H" : "#", 86, y + 64);
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.fillStyle = "#0f172a"; g.font = F(700, 38); g.fillText(it.sender, 150, y + 66);
    g.fillStyle = "#334155"; g.font = F(400, 28); g.fillText(it.text, 150, y + 114);
    g.fillStyle = "#64748b"; g.font = F(400, 25); g.fillText(it.sub, 150, y + 154);
    g.textAlign = "right"; g.font = F(400, 27); g.fillText(it.time, 1030, y + 62);
    if (i < list.length - 1) { g.fillStyle = "#e2e8f0"; g.fillRect(150, y + RH - 2, 930, 2); }
  });
  return cv.toDataURL("image/png");
};
const sampleUrl = s => (s.key === "gen-call-log" ? drawCallLog() : window.__SAMPLES[s.key]);
/* any other upload: one placeholder event, since real screenshots are not read in this prototype */
const generic = type => ({ id: "g1", type, cls: "unknown", sender: type === "call" ? "Unknown number" : "Unknown sender", brandId: null, time: "Today", generic: true,
  text: type === "call" ? "Call found in your screenshot" : "Message found in your screenshot" });
/* hide a one-time code (box in percent of the image) before the image is shared */
const maskImage = (url, box) => new Promise(res => {
  const im = new Image();
  im.onload = () => {
    const cv = document.createElement("canvas"), W = im.naturalWidth, H = im.naturalHeight;
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d");
    g.drawImage(im, 0, 0);
    g.fillStyle = "#0f172a";
    const x = box.x / 100 * W, y = box.y / 100 * H, w = box.w / 100 * W, hh = box.h / 100 * H, r = Math.min(10, hh / 3);
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.fill();
    res(cv.toDataURL("image/png"));
  };
  im.onerror = () => res(url);
  im.src = url;
});

/* ==================================================================
   Reasons per kind of event (brief: "Reason choices")
   ================================================================== */
const reasonsFor = (cls, type) => {
  const R = (id, label) => ({ id, label });
  const scam = R("scam", "This looks like a scam"), other = R("else", "Something else");
  const T = {
    promo: { main: [R("never", "I never signed up for this"), R("agreed", "I agreed before, but want it to stop"), R("optedout", "I already opted out")],
             more: [R("scope", "I only agreed to other offers"), R("often", "These offers come too often")] },
    service: { main: [type === "call" ? R("offer", "They tried to sell me something") : R("offer", "There’s an offer in my service update"), R("dontuse", "I don’t use this service"), R("reminder", "I keep getting the same reminder")], more: [] },
    transactional: { main: [R("notstart", "I didn’t start this transaction"), R("someone", "This transaction belongs to someone else"), R("many", "I received this more than once")], more: [] },
    otp: { main: [R("noreq", "I didn’t request this code"), R("keep", "The codes keep coming"), R("asked", "Someone asked me for the code")], more: [] },
    unknown: { main: [R("sales", "An unknown number made a sales pitch"), scam, R("keep", "They keep contacting me")], more: [] },
  }[cls] || null;
  const t = T || { main: [], more: [] };
  const main = t.main.concat(t.main.some(r => r.id === "scam") ? [] : [scam]);
  return { main: main.concat([other]), more: t.more };
};
const CLS_TAG = { promo: ["Promotional", "blue"], service: ["Service", "violet"], transactional: ["Transactional", "violet"], otp: ["One-time code", "amber"], unknown: ["Unregistered sender", "rose"] };

/* ==================================================================
   After Submit (all simulated): the checks, the decision, the answer
   ================================================================== */
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const chan = ch => (ch.length > 1 ? "SMS and call" : ch[0]);
const OPT_OUT_DATE = "23 Nov 2026";

/* the answer, written to answer the reason */
const outcome = c => {
  const { item, cls, reasonId, revoke, brandName } = c;
  const call = item.type === "call", p = item.permission, what = call ? "call" : "SMS", who = brandName || "the sender", sent = call ? "made" : "sent";
  const O = (state, verdict, head, body, actions, next) => ({ state, verdict, head, body, actions, next });
  const track = { label: "Track in history", go: "history" };
  const revoked = p ? ["Consent revoked for " + p.purpose + " by " + chan(p.channels), who + "’s system confirmed the change"] : [];

  if (reasonId === "scam") return O("escalated", "Flagged as suspected fraud", "Sent to the fraud team.",
    "We matched the " + what + " and passed the sender, time and route to the fraud team. Don’t tap links or share codes from this sender.",
    ["Sender flagged for fraud review"].concat(revoke ? revoked : []), track);

  if (cls === "promo" && p) {
    if (reasonId === "agreed") return revoke
      ? O("resolved", "Consent was valid", cap(p.purpose) + " stopped.", "Your consent covered this " + what + " when it was " + sent + ". We’ve withdrawn it, so " + who + " can no longer " + (call ? "call you with " : "send you ") + p.purpose + " by " + chan(p.channels) + ".", revoked, { label: "View consent change", go: "wallet" })
      : O("resolved", "Consent was valid", "Complaint recorded.", "Your consent covered this " + what + " when it was " + sent + ", and it is still active. You can revoke it any time from My Wallet.", ["Complaint logged against " + item.sender], { label: "Review your consent", go: "wallet" });
    if (reasonId === "never" || reasonId === "scope") {
      if (item.consent === "mismatch") return O("resolved", "Upheld", "Your complaint was upheld.", item.record + " It was used for a " + item.used + ". We’ve told " + who + " to correct its records.",
        ["Violation recorded against " + item.sender, "Correction notice sent to " + who].concat(revoke ? revoked : []), track);
      return O("resolved", "Sign-up record found", "We found your sign-up record.", item.record + (revoke ? " We’ve revoked it, so these offers stop now." : " It is still active."),
        (revoke ? revoked : ["Sign-up record attached to this case"]), { label: "I don’t recognise this sign-up", go: "review" });
    }
    if (reasonId === "optedout") return O("resolved", "Upheld", "This should not have reached you.", "You opted out on " + OPT_OUT_DATE + ". This " + what + " was " + sent + " 2 days later, so it broke the rules. We’ve raised a violation with the operator that delivered it.",
      ["Violation raised with the delivering operator", "Your opt-out re-applied and confirmed"], track);
    if (reasonId === "often") return O("resolved", "Feedback recorded", "We’ve recorded your feedback.", "We matched 3 offers from this sender in the last 7 days. A lower frequency isn’t available for this permission, so we’ve noted it for " + who + (revoke ? " and stopped these offers." : " and kept your consent as it is."),
      ["Frequency feedback sent to " + who].concat(revoke ? revoked : []), { label: revoke ? "View consent change" : "Review your consent", go: "wallet" });
  }
  if (cls === "service") {
    if (reasonId === "offer") return O("resolved", "Upheld", call ? "We’ve flagged the sales pitch." : "We found an offer in your reminder.", "This " + (call ? "call" : "message") + " carried a promotion under a service purpose. We’ve asked " + who + " to correct it. Genuine reminders can continue.",
      ["Violation recorded against " + item.sender, (call ? "Call script" : "Template") + " correction requested from " + who], track);
    return O("escalated", "Needs the sender", "We’re checking what triggered this.", "We matched the " + (call ? "call" : "message") + " and asked " + who + " to check why you received it. You don’t need to do anything else.",
      ["Sent to " + who + " with the evidence"], track);
  }
  if (cls === "transactional") return O("escalated", "Needs the sender", "We’re checking what triggered this.", "We matched the message and asked " + who + " to check why it was sent to your number.", ["Sent to " + who + " with the evidence"], track);
  if (cls === "otp") {
    if (reasonId === "asked") return O("escalated", "Possible impersonation", "Don’t share that code.", "We’ve logged this as a possible impersonation attempt. Never give a code to anyone who asks, including someone claiming to be from " + who + ".",
      ["Logged with the security team"], { label: "Report to security", go: "security" });
    return O("escalated", "Needs the sender", "We’re checking what triggered this.", "We matched the message and asked " + who + " to check why it was sent to your number. If you think someone is trying to get into your account, report it to security.",
      ["Sent to " + who + " with the evidence"], { label: "Report to security", go: "security" });
  }
  if (cls === "unknown" && reasonId !== "else") return O("escalated", "Needs the operator", "Number reported to its operator.", "This " + what + " came from a number that isn’t registered for business use. We’ve sent it to the originating operator to act on.",
    ["Reported to the originating operator"], track);
  return O("resolved", "Complaint recorded", "Complaint recorded.", "We matched the " + what + " and logged your complaint against the sender.", ["Complaint logged against " + item.sender], track);
};

/* the checks the agent runs, in order. Labels are the brief's short labels. */
const buildPlan = c => {
  const { item, cls, reasonId, revoke, brandName } = c;
  const call = item.type === "call", p = item.permission, what = call ? "call" : "message", who = brandName || "the sender";
  const S = (key, icon, name, label, finding, tone) => ({ key, icon, name, label, finding, tone: tone || "ok" });
  const src = [];
  src.push(S("cdr", "signal", "Network record", call ? "Matching your call" : "Matching your message",
    call ? "Call from " + item.sender + " reached your number at " + item.time + "." : "Delivered to your number at " + item.time + " from " + item.sender + "."));
  src.push(cls === "unknown"
    ? S("scrub", "shield", "Delivery rules", "Checking delivery rules", "No scrub record. This came from a number that isn’t registered for business use.", "bad")
    : S("scrub", "shield", "Delivery rules", "Checking delivery rules",
        cls === "promo" ? (call ? "Placed as a promotional call from a registered telemarketer line." : "Sent as promotional under a registered header and template.")
        : cls === "otp" ? "Sent as an authentication message under a registered template." : "Sent under a registered " + (cls === "transactional" ? "transactional" : "service") + (call ? " line." : " template.")));
  if (cls === "promo" && p) src.push(S("consent", "fileCheck", "Consent record", "Checking your consent",
    item.consent === "mismatch" ? item.record + " It was used for a " + item.used + "." : item.record, item.consent === "mismatch" ? "bad" : "ok"));
  else if (cls === "unknown") src.push(S("route", "radio", "Originating route", "Checking the trigger", "Traced to the originating operator. The number is not a registered telemarketer.", "bad"));
  else src.push(S("content", "tag", cls === "service" && reasonId === "offer" ? "Content check" : "Sender trigger", cls === "service" && reasonId === "offer" ? "Checking the offer" : "Checking the trigger",
    cls === "service" && reasonId === "offer" ? (call ? "You reported a sales pitch on a service call. That is outside its registered purpose." : "The reminder carries a top-up loan offer, which is outside its service purpose.")
    : "Asked " + who + " what triggered this " + what + " for your number.", cls === "service" && reasonId === "offer" ? "bad" : "warn"));
  src.push(S("prefs", "sliders", "Your preferences", "Checking your preferences",
    cls === "promo" ? "Your preferences allowed " + who + " offers by " + (call ? "call" : "SMS") + " when this was " + (call ? "made." : "sent.")
    : cls === "unknown" ? "Your preferences block promotional " + (call ? "calls" : "messages") + " from unregistered numbers."
    : "Service and security " + (call ? "calls" : "messages") + " are not limited by your promotional preferences."));
  if (cls === "promo") src.push(S("optout", "ban", "Opt-out register", "Checking your opt-out",
    reasonId === "optedout" ? "You opted out on " + OPT_OUT_DATE + ". This was " + (call ? "made" : "sent") + " 2 days later." : "No opt-out on record before this was " + (call ? "made." : "sent."), reasonId === "optedout" ? "bad" : "ok"));

  const out = outcome(c);
  const acts = revoke && p && reasonId !== "optedout" ? [
    { key: "stop", icon: "lock", name: "Consent revoke", label: "Stopping these offers", finding: "Withdrew your consent for " + p.purpose + " by " + chan(p.channels) + "." },
    { key: "ack", icon: "shieldCheck", name: "Sender confirmation", label: "Confirming your change", finding: who + "’s system confirmed the change." },
  ] : [];
  return { src, acts, out, srcMs: src.length >= 5 ? 4400 : 5400 };
};

/* ==================================================================
   The agent blob: the rotating particle sphere from the loaders.
   Palette and spin follow the agent state.
   ================================================================== */
const PAL = { blue: [24, 58, 214, 102, 156, 255], amber: [168, 98, 6, 246, 192, 92], green: [5, 118, 80, 92, 214, 160] };
const SPEED = { think: 1, tool: 2.3, verify: 1.6, wait: .45, done: .35 };
function Blob({ size, state, kick, bare }) {
  const ref = useRef(null), st = useRef(state), inst = useRef(null);
  st.current = state;
  useEffect(() => { if (inst.current && kick) inst.current.kick = 1; }, [kick]);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const s = size, C = Math.round(s * 1.3), dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.width = C * dpr; cv.height = C * dpr;
    const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const k = Math.min(1.5, Math.max(.85, s / 76)), count = s < 60 ? 200 : s < 90 ? 340 : 480, pts = [];
    for (let i = 0; i < count; i++) {
      const yy = 1 - (i / (count - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - yy * yy)), th = i * 2.399963;
      pts.push({ x: Math.cos(th) * r, y: yy, z: Math.sin(th) * r, s: (.72 + (i % 7) * .06) * k });
    }
    const b = { R: s * .37, rotY: Math.random() * 6, rotX: .55, kick: 0 };
    inst.current = b;
    const pal = PAL.blue.slice();
    let speed = 1, raf = 0;
    const frame = () => {
      const kind = st.current, target = kind === "wait" ? PAL.amber : kind === "done" ? PAL.green : PAL.blue;
      for (let i = 0; i < 6; i++) pal[i] += (target[i] - pal[i]) * .06;
      speed += ((SPEED[kind] || 1) - speed) * .05;
      const cx = C / 2, cy = C / 2, R = b.R * (1 + b.kick * .1);
      if (!RM) { b.rotY += .016 * speed * (1 + b.kick * 2); b.rotX += .0044 * speed; }
      b.kick *= .93;
      const cY = Math.cos(b.rotY), sY = Math.sin(b.rotY), cX = Math.cos(b.rotX), sX = Math.sin(b.rotX);
      const [r0, g0, b0, r1, g1, b1] = pal;
      g.clearRect(0, 0, C, C);
      const glow = g.createRadialGradient(cx, cy, 0, cx, cy, R * 1.4);
      glow.addColorStop(0, "rgba(" + (r1 | 0) + "," + (g1 | 0) + "," + (b1 | 0) + "," + (.24 + b.kick * .2) + ")");
      glow.addColorStop(.55, "rgba(" + ((r0 + r1) / 2 | 0) + "," + ((g0 + g1) / 2 | 0) + "," + ((b0 + b1) / 2 | 0) + ",.1)");
      glow.addColorStop(1, "rgba(" + (r0 | 0) + "," + (g0 | 0) + "," + (b0 | 0) + ",0)");
      g.fillStyle = glow; g.beginPath(); g.arc(cx, cy, R * 1.4, 0, 6.283); g.fill();
      const P = pts.map(p => { const x1 = p.x * cY - p.z * sY, z1 = p.x * sY + p.z * cY; return { x: x1, y: p.y * cX - z1 * sX, z: p.y * sX + z1 * cX, s: p.s }; });
      P.sort((a, c2) => a.z - c2.z);
      for (const p of P) {
        const depth = (p.z + 1) / 2, r = (.3 + depth * .86) * p.s, f = .24 + depth * depth * .76, a = .14 + f * .82;
        g.beginPath(); g.arc(cx + p.x * R, cy + p.y * R, r, 0, 6.283);
        g.fillStyle = "rgba(" + (r0 + f * (r1 - r0) | 0) + "," + (g0 + f * (g1 - g0) | 0) + "," + (b0 + f * (b1 - b0) | 0) + "," + a + ")";
        g.fill();
        if (depth > .88) {
          g.fillStyle = "rgba(230,240,255," + ((depth - .88) / .12 * .5) + ")";
          g.beginPath(); g.arc(cx + p.x * R - r * .28, cy + p.y * R - r * .3, r * .42, 0, 6.283); g.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [size]);
  return h("div", { className: "core", style: { width: size, height: size } },
    h("canvas", { ref, "aria-hidden": true }),
    !bare && h("span", { className: "core__mark" },
      h("svg", { className: "m-logo", viewBox: "0 0 26 26", fill: "#fff", "aria-hidden": true, dangerouslySetInnerHTML: { __html: MARK } }),
      ic(state === "wait" ? "arrow" : "check", 14, "m-check")));
}
const Spin = () => h("svg", { className: "spin", viewBox: "0 0 16 16", "aria-hidden": true }, h("circle", { className: "t", cx: 8, cy: 8, r: 6 }), h("circle", { className: "a", cx: 8, cy: 8, r: 6, pathLength: 100 }));
const Roll = ({ text, cls }) => h("span", { className: "roll " + (cls || "") }, h("span", { key: text }, text));

/* ==================================================================
   Shared pieces
   ================================================================== */
const maskedText = it => (it.cls === "otp" ? it.text.replace(/^\d{4,8}/, "••••••") : it.text);
const BRAND_TINT = { "hdfc-bank": "#ED232A", paytm: "#00B9F1", swiggy: "#FC8019" };
function Avatar({ it }) {
  const br = it.brandId && BRANDS[it.brandId];
  if (br) return h("span", { className: "ev__av ev__av--brand", style: { background: BRAND_TINT[br.id] || "var(--blue)" } }, br.name.charAt(0));
  return h("span", { className: "ev__av" }, ic(it.type === "call" ? "phone" : "message", 17));
}
function EventCard({ it, onPick, on, idx, compact }) {
  const br = it.brandId && BRANDS[it.brandId], tag = CLS_TAG[it.cls];
  return h(onPick ? "button" : "div", {
    type: onPick ? "button" : undefined, role: onPick ? "radio" : undefined, "aria-checked": onPick ? !!on : undefined, onClick: onPick,
    className: "ev" + (onPick ? " is-pick" : "") + (on ? " is-on" : "") + (compact ? " ev--compact" : ""), style: idx != null ? { animationDelay: idx * 70 + "ms" } : null },
    h(Avatar, { it }),
    h("span", { className: "ev__body" },
      h("span", { className: "ev__top" }, h("span", { className: "ev__sender" }, it.sender), h("span", { className: "ev__time" }, it.time)),
      h("span", { className: "ev__text" }, maskedText(it)),
      !compact && h("span", { className: "ev__tags" },
        br && h("span", { className: "tag" }, br.name),
        !it.generic && tag && h("span", { className: "tag tag--" + tag[1] }, tag[0]),
        it.cls === "otp" && h("span", { className: "tag tag--green" }, ic("lock", 11), "Code hidden"))),
    onPick && h("span", { className: "radio" + (on ? " is-on" : "") }, on ? ic("check", 12) : null));
}
function Header({ title, sub, back, right }) {
  return h("div", { className: "page-hero pb-6 sticky top-0 z-50 bg-background" },
    h("div", { className: "flex items-center justify-between" },
      h("div", { className: "flex items-center gap-3" },
        back !== false && h("button", { type: "button", onClick: () => nav(-1), "aria-label": "Go back", className: "header-icon-btn" }, ic("back", 16)),
        h("div", { className: "flex-1 min-w-0" },
          h("h1", { className: "text-xl font-display font-bold" }, title),
          sub && h("p", { className: "text-xs text-muted-foreground mt-0.5 truncate" }, sub))),
      right !== false && h("button", { type: "button", onClick: () => nav("/complaint-history"), "aria-label": "Complaint history", className: "header-icon-btn" }, ic("history", 16))));
}
function Step({ n, done, title, label, hint, children, id, summary, onChange, changeLabel }) {
  if (summary) return h("section", { className: "step step--sum is-done", id },
    h("span", { className: "step__n" }, ic("check", 12)),
    h("div", { className: "sum" }, h("span", { className: "sum__l" }, label), h("div", { className: "sum__v" }, summary)),
    onChange && h("button", { type: "button", className: "link sum__chg", onClick: onChange, "aria-label": (changeLabel || "Change") + " " + label.toLowerCase() }, changeLabel || "Change"));
  return h("section", { className: "step" + (done ? " is-done" : ""), id },
    h("div", { className: "step__head" },
      h("span", { className: "step__n" }, done ? ic("check", 12) : n),
      h("div", { className: "step__ttl" }, h("h2", null, title), hint && h("p", null, hint))),
    children);
}

/* ==================================================================
   Page 1: the complaint form
   ================================================================== */
function ComplaintForm({ onSubmit, fast, setFast }) {
  const [evType, setEvType] = useState(null);            // "message" | "call"
  const [shot, setShot] = useState(null);                // { url, shared, items, boxes, masked }
  const [scan, setScan] = useState("idle");              // idle | reading | finding | ready
  const [selId, setSelId] = useState(null);
  const [reasonId, setReasonId] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [note, setNote] = useState("");
  const [revoke, setRevoke] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [edit, setEdit] = useState(null);                // a finished step reopened with "Change"
  const fileRef = useRef(null), timers = useRef([]), listRef = useRef(null), locked = useRef(false);
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);

  const noun = evType === "call" ? "call" : "message";
  const items = shot && scan === "ready" ? shot.items : [];
  const sel = items.find(i => i.id === selId) || null;
  const reasons = sel ? reasonsFor(sel.cls, sel.type) : null;
  const reason = reasons ? reasons.main.concat(reasons.more).find(r => r.id === reasonId) : null;
  const br = sel && sel.brandId ? BRANDS[sel.brandId] : null;
  const canRevoke = !!sel && !!sel.permission && !!reason;
  const canSubmit = !!sel && !!reason;

  const resetChoices = () => { setEdit(null); setSelId(null); setReasonId(null); setMoreOpen(false); setRevoke(false); };
  const pickType = t => {
    setEdit(null);
    if (t === evType) return;
    clearTimers(); setEvType(t); setShot(null); setScan("idle"); resetChoices();
  };
  /* the screenshot is read, the events in it are found, then they are listed below */
  const begin = (url, det) => {
    clearTimers(); resetChoices();
    setShot({ url, shared: null, items: det.items, boxes: det.boxes || null, masked: !!det.mask });
    setScan("reading"); setAnnounce("Processing your screenshot");
    (det.mask ? maskImage(url, det.mask) : Promise.resolve(url)).then(shared => setShot(s => (s && s.url === url ? { ...s, shared } : s)));
    later(() => setScan("finding"), RM ? 300 : 1300);
    later(() => {
      setScan("ready");
      if (det.items.length === 1) setSelId(det.items[0].id);
      setAnnounce(det.items.length === 1 ? "Found the " + noun + ". Choose what bothered you." : det.items.length + " " + noun + "s found. Choose the one you want to report.");
      
    }, RM ? 600 : 2600);
  };
  const useSample = s => begin(sampleUrl(s), { items: s.ids.map(id => ITEMS[id]), boxes: s.boxes, mask: s.mask });
  const onFile = ev => {
    const file = ev.target.files && ev.target.files[0]; ev.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Please choose an image file");
    if (file.size > 10 * 1024 * 1024) return toast("The file must be under 10MB");
    const rd = new FileReader();
    rd.onload = e2 => begin(e2.target.result, { items: [generic(evType)] });
    rd.readAsDataURL(file);
  };
  const pickItem = id => { setEdit(null); setSelId(id); setReasonId(null); setMoreOpen(false); setRevoke(false); };
  const pickReason = id => { setEdit(null); setReasonId(id); setRevoke(id === "agreed"); };
  const submit = () => {
    if (!canSubmit || locked.current) return;
    locked.current = true;                                 // a double tap can't file twice
    onSubmit({ id: newId(), filedAt: new Date(), item: sel, cls: sel.cls, reasonId, reasonLabel: reason.label, note: note.trim(), revoke: canRevoke && revoke, brandName: br ? br.name : "" });
  };

  const stepsDone = [!!evType, scan === "ready" && !!sel, !!reason];
  const progress = [!!evType, scan === "ready", !!sel, !!reason, !!reason && (note.trim().length > 0 || revoke)];   // one bar per step
  const found = items.length === 1 ? "1 " + noun + " found" : items.length + " " + noun + "s found";
  const thumb = shot ? (shot.masked ? shot.shared : shot.url) : null;
  const clearShot = () => { clearTimers(); setShot(null); setScan("idle"); resetChoices(); };
  const multi = items.length > 1;

  return h("div", { className: "cx min-h-screen bg-background" },
    h(Header, { title: "Raise a complaint", sub: "Report an unwanted message or call" }),
    h("div", { className: "bf-sr", role: "status", "aria-live": "polite", "aria-atomic": true }, announce),
    h("div", { className: "app-page px-5 md:px-8 cx-body" },
      h("div", { className: "segs", style: { gridTemplateColumns: "repeat(" + progress.length + ",1fr)" }, "aria-hidden": true }, progress.map((d, i) => h("div", { key: i, className: "seg" + (d ? " done" : "") }, h("i", null)))),
      h("input", { ref: fileRef, id: "cx-file", type: "file", accept: "image/*", onChange: onFile, className: "hidden" }),

      /* one card; each step is a section in it that folds once answered */
      h("div", { className: "steps" },
      /* 1. message or call */
      h(Step, { n: 1, done: stepsDone[0], title: "What do you want to report?", label: "Reporting",
        summary: evType && edit !== 1 ? h("span", { className: "sum__row" }, ic(evType === "call" ? "phone" : "message", 15), evType === "call" ? "A call" : "A message") : null, onChange: () => setEdit(1) },
        h("div", { className: "kinds", role: "radiogroup", "aria-label": "What do you want to report?" },
          [["message", "Message", "SMS offers, reminders, codes", "message"], ["call", "Call", "Sales, service or unknown calls", "phone"]].map(([id, t, s, icn]) =>
            h("button", { key: id, type: "button", role: "radio", "aria-checked": evType === id, onClick: () => pickType(id), className: "kind" + (evType === id ? " is-on" : "") },
              h("span", { className: "kind__ic" }, ic(icn, 20)),
              h("span", { className: "kind__t" }, t), h("span", { className: "kind__s" }, s),
              h("span", { className: "kind__ck" }, ic("check", 11)))))),

      /* 2. the screenshot: upload, then a short "processing" state */
      evType && h(Step, { n: 2, done: stepsDone[1], key: "shot-" + evType, title: "Add a screenshot", label: "Screenshot",
        hint: evType === "call" ? "Include the number and the date or time of the call." : "Include the sender, time and the message you want to report.",
        summary: scan === "ready" ? h("span", { className: "sum__row" },
          h("img", { src: thumb || shot.url, alt: "", className: "sum__thumb" }),
          h("span", { className: "sum__col" }, found, shot.masked && h("span", { className: "sum__sub" }, ic("lock", 11), "One-time code hidden"))) : null,
        onChange: clearShot, changeLabel: "Replace" },
        !shot
          ? h("div", { className: "up" },
              h("button", { type: "button", className: "drop", onClick: () => fileRef.current && fileRef.current.click() },
                h("span", { className: "drop__ic" }, ic("upload", 22)),
                h("span", { className: "drop__t" }, "Upload a screenshot"),
                h("span", { className: "drop__s" }, "PNG or JPG, up to 10MB")),
              h("div", { className: "samples" },
                h("span", { className: "samples__l" }, "No screenshot handy? Try a demo one"),
                h("div", { className: "samples__row" }, SAMPLES[evType].map(s =>
                  h("button", { key: s.key, type: "button", className: "chipbtn", onClick: () => useSample(s) }, ic("image", 13), s.label)))))
          : h("div", { className: "proc" },
              h("span", { className: "proc__thumb" }, thumb && h("img", { src: thumb, alt: "" })),
              h("div", { className: "proc__b" },
                h("span", { className: "proc__t" }, "Processing your screenshot"),
                h(Roll, { text: scan === "reading" ? "Reading the image" : "Finding the " + noun + "s in it", cls: "proc__s" }),
                h("span", { className: "proc__bar" }, h("i", null))),
              h(Blob, { size: 54, state: "tool", bare: true }))),

      /* 3. the messages / calls found in it */
      scan === "ready" && h(Step, { n: 3, done: !!sel, key: "found", id: "cx-found",
        title: "Which " + noun + " do you want to report?", label: sel && sel.type === "call" ? "Call" : "Message",
        hint: "We found " + items.length + " in your screenshot. Pick one.",
        summary: sel && (!multi || edit !== 3) ? h("span", { className: "sum__col" },
          h("span", { className: "sum__row" }, sel.sender, h("span", { className: "sum__time" }, sel.time)),
          h("span", { className: "sum__sub sum__sub--clip" }, sel.generic ? "Placeholder: this prototype can’t read your own screenshots yet." : maskedText(sel))) : null,
        onChange: multi ? () => setEdit(3) : null },
        h("div", { className: "evs", role: "radiogroup", ref: listRef },
          items.map((it, i) => h(EventCard, { key: it.id, it, idx: i, on: selId === it.id, onPick: () => pickItem(it.id) })))),

      /* 4. reason */
      sel && h(Step, { n: 4, done: !!reason, key: "why-" + sel.id, title: "What bothered you?", label: "Reason",
        summary: reason && edit !== 4 ? reason.label : null, onChange: () => setEdit(4) },
        h("div", { className: "reasons", role: "radiogroup", "aria-label": "What bothered you?" },
          reasons.main.concat(moreOpen || reasons.more.some(r => r.id === reasonId) ? reasons.more : []).map((r, i) =>
            h("button", { key: r.id, type: "button", role: "radio", "aria-checked": reasonId === r.id, onClick: () => pickReason(r.id), className: "reason" + (reasonId === r.id ? " is-on" : ""), style: { animationDelay: i * 45 + "ms" } },
              h("span", { className: "radio" + (reasonId === r.id ? " is-on" : "") }, reasonId === r.id ? ic("check", 12) : null),
              h("span", null, r.label)))),
        reasons.more.length > 0 && !moreOpen && !reasons.more.some(r => r.id === reasonId) && h("button", { type: "button", className: "link", onClick: () => setMoreOpen(true) }, "More reasons", ic("chevron", 13))),

      /* 5. comment and consent, both optional */
      reason && h(Step, { n: 5, key: "more-" + sel.id, title: "Anything to add?", hint: "Both are optional." },
        h("div", { className: "field" },
          h("label", { htmlFor: "cx-note" }, "Comment"),
          h("textarea", { id: "cx-note", value: note, onChange: ev => setNote(ev.target.value.slice(0, 300)), rows: 3, className: "textarea",
            placeholder: sel.type === "call" ? "For example, what the caller said or offered" : "Anything else we should know" }),
          h("span", { className: "field__count" }, note.length + "/300")),
        canRevoke && h("label", { className: "revoke" + (revoke ? " is-on" : ""), htmlFor: "cx-revoke" },
          h("input", { id: "cx-revoke", type: "checkbox", checked: revoke, onChange: ev => setRevoke(ev.target.checked) }),
          h("span", { className: "revoke__box" }, ic("check", 12)),
          h("span", { className: "revoke__txt" },
            h("span", { className: "revoke__t" }, "Also revoke my consent"),
            h("span", { className: "revoke__s" }, "Stop " + sel.permission.purpose + " from " + (br ? br.name : "this sender") + " by " + chan(sel.permission.channels) + ". You can give it again from My Wallet."))))),

      /* submit */
      reason && h("div", { className: "submit" },
        h("button", { type: "button", onClick: submit, disabled: !canSubmit, className: "cta" }, "Submit complaint", ic("arrow", 17)),
        h("p", { className: "fine fine--center" }, ic("bolt", 12), "We start investigating straight away. Most complaints close in under a minute.")),

      h(Proto, { fast, setFast })));
}
/* prototype controls are only shown in the in-app report version (dialer.js) */
const SHOW_PROTO = typeof DialerApp === "function";
function Proto({ fast, setFast, onReset }) {
  if (!SHOW_PROTO) return null;
  return h("details", { className: "proto" },
    h("summary", null, "Prototype controls"),
    h("div", { className: "proto__body" },
      h("label", { className: "toggle", htmlFor: "cx-fast" }, h("input", { id: "cx-fast", type: "checkbox", checked: fast, onChange: ev => setFast(ev.target.checked) }), "Fast preview: play the investigation 5× faster"),
      h("p", null, "Screenshot reading, record checks and sender confirmations are simulated."),
      onReset && h("button", { type: "button", className: "btn btn--ghost btn--sm", onClick: onReset }, "Start a new complaint")));
}

/* ==================================================================
   Page 2: the complaint receipt, with the agent working the case
   ================================================================== */
const STG = 300, CX0 = 150, CY0 = 150, RING = 108;
function AgentStage({ plan, src, active, stage, kick, tone }) {
  const n = plan.src.length;
  const pos = i => { const a = (-90 + i * 360 / n) * Math.PI / 180; return { x: CX0 + Math.cos(a) * RING, y: CY0 + Math.sin(a) * RING, deg: -90 + i * 360 / n }; };
  const blobState = stage === "done" ? (tone === "escalated" ? "wait" : "done") : stage === "decide" ? "verify" : stage === "evidence" || stage === "act" ? "tool" : "think";
  const a = active >= 0 ? pos(active) : null;
  return h("div", { className: "stage", "data-stage": stage, "data-tone": tone, "aria-hidden": true },
    h("svg", { className: "stage__ring", viewBox: "0 0 " + STG + " " + STG },
      h("circle", { className: "glow", cx: CX0, cy: CY0, r: RING - 8 }),
      h("circle", { className: "trk", cx: CX0, cy: CY0, r: RING }),
      h("circle", { className: "hl" + (a ? " on" : ""), cx: CX0, cy: CY0, r: RING, pathLength: 100, style: { transform: "rotate(" + ((a ? a.deg : -90) - 21.6) + "deg)" } }),
      plan.src.map((s, i) => { const p = pos(i); return h("line", { key: s.key, className: "wire" + (src[i] === "run" || src[i] === "send" ? " hot" : src[i] === "done" ? " ok" : ""), x1: p.x, y1: p.y, x2: CX0, y2: CY0 }); })),
    h("span", { className: "stage__wave", key: "w" + (stage === "done") }),
    plan.src.map((s, i) => {
      const p = pos(i), st = src[i], top = p.y < CY0 - 10;
      return h("div", { key: s.key, className: "nd", "data-s": st, style: { left: p.x - 20, top: p.y - 20 } },
        ic(s.icon, 17),
        h("span", { className: "nd__tasks" }, h("i", null), h("i", null)),
        h("span", { className: "nd__badge nd__badge--" + s.tone }, ic(s.tone === "ok" ? "check" : "alert", 9)),
        h("span", { className: "nd__chip" + (top ? " is-top" : ""), style: { left: 20 + Math.max(48, Math.min(STG - 48, p.x)) - p.x } }, s.name),
        st === "send" && h("span", { className: "pk", style: { "--dx": (CX0 - p.x) + "px", "--dy": (CY0 - p.y) + "px" } }));
    }),
    h("div", { className: "stage__core" },
      h("span", { className: "ripple", key: "r" + kick }),
      h("span", { className: "reticle reticle--core" + (stage === "decide" ? " on" : "") }, h("i", null), h("i", null), h("i", null), h("i", null)),
      h(Blob, { size: 96, state: blobState, kick })));
}
const fmtClock = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0");
function Receipt({ c, fast, setFast, onNew }) {
  const plan = useRef(buildPlan(c)).current, out = plan.out;
  const [s, setS] = useState({ stage: "register", label: "Registering your complaint", src: plan.src.map(() => "queued"), active: -1, kick: 0, log: [], running: null });
  const [secs, setSecs] = useState(0);
  const [took, setTook] = useState(null);
  const [review, setReview] = useState(false);
  const [owned, setOwned] = useState(false);            // "Yes, I gave this consent"
  const speed = useRef(fast ? 5 : 1).current;
  const verdictRef = useRef(null);

  useEffect(() => {
    const ids = [], t0 = performance.now(), now = () => (performance.now() - t0) / 1000 * speed;
    const at = (ms, fn) => ids.push(setTimeout(fn, ms / speed));
    const up = fn => setS(p => ({ ...p, ...fn(p) }));
    const logRow = (p, row) => p.log.concat([{ ...row, at: Math.round(now()) }]);
    fileCase({ id: c.id, state: "under_review", mode: c.item.type === "call" ? "Call" : "SMS", desc: c.reasonLabel, brand: c.brandName });
    const tick = setInterval(() => setSecs(now()), 250);
    let t = 0;
    at(500, () => up(p => ({ log: logRow(p, { icon: "receipt", name: "Complaint registered", text: "Case " + c.id + (c.source === "dialer" ? " opened from your call log." : c.source === "messages" ? " opened from your messages." : " opened and your screenshot saved."), tone: "ok" }) })));
    t += 2200;
    plan.src.forEach((x, i) => {
      at(t, () => up(p => ({ stage: "evidence", label: x.label, active: i, running: x, src: p.src.map((v, j) => (j === i ? "run" : v)) })));
      at(t + plan.srcMs - 800, () => up(p => ({ src: p.src.map((v, j) => (j === i ? "send" : v)) })));
      at(t + plan.srcMs - 200, () => up(p => ({ kick: p.kick + 1, running: null, src: p.src.map((v, j) => (j === i ? "done" : v)), log: logRow(p, { icon: x.icon, name: x.name, text: x.finding, tone: x.tone }) })));
      t += plan.srcMs + 300;
    });
    const dec = { icon: "scale", name: "Decision", label: "Weighing the evidence" };
    at(t, () => up(() => ({ stage: "decide", label: dec.label, active: -1, running: dec })));
    t += 3800;
    at(t - 200, () => up(p => ({ kick: p.kick + 1, running: null, log: logRow(p, { icon: "scale", name: "Decision: " + out.verdict, text: out.head, tone: out.state === "resolved" ? "ok" : "warn", strong: true }) })));
    plan.acts.forEach(x => {
      at(t, () => up(() => ({ stage: "act", label: x.label, running: x })));
      t += 3200;
      at(t - 200, () => up(p => ({ kick: p.kick + 1, running: null, log: logRow(p, { icon: x.icon, name: x.name, text: x.finding, tone: "ok" }) })));
    });
    at(t, () => up(() => ({ stage: "wrap", label: "Preparing your update" })));
    t += 1800;
    at(t, () => {
      clearInterval(tick);
      const sec = Math.round(t / 1000);
      setSecs(sec); setTook(sec);
      up(p => ({ stage: "done", kick: p.kick + 1, label: out.state === "resolved" ? "Complaint closed" : "Handed over with evidence" }));
      fileCase({ id: c.id, state: out.state === "resolved" ? "resolved" : "under_review", desc: c.reasonLabel + " · " + out.head });
      ids.push(setTimeout(() => { if (verdictRef.current) verdictRef.current.scrollIntoView({ block: "nearest", behavior: RM ? "auto" : "smooth" }); }, 500));
    });
    return () => { ids.forEach(clearTimeout); clearInterval(tick); };
  }, []);

  const done = s.stage === "done", tone = done ? out.state : "work";
  const nDone = s.src.filter(v => v === "done").length;
  const order = ["register", "evidence", "decide", "act", "wrap", "done"], si = order.indexOf(s.stage);
  const track = [["Registered", 1], ["Evidence", 2], ["Decision", 3], [out.state === "resolved" ? "Closed" : "Handed over", 5]];
  const segState = (k, to) => (si >= to ? "done" : (k === 0 ? si === 0 : si >= track[k - 1][1]) ? "run" : "");
  const filed = c.filedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + ", " + c.filedAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const copyId = () => {
    const ok = () => toast("Complaint ID copied");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c.id).then(ok, () => toast("Press and hold the ID to copy it")); else toast("Press and hold the ID to copy it");
  };
  const doNext = n => {
    if (n.go === "wallet") nav("/wallet");
    else if (n.go === "history") nav("/complaint-history");
    else if (n.go === "review") { setReview(true); toast("Review opened on " + c.id); }
    else if (n.go === "security") toast("Security reporting opened for " + c.id);
  };
  const title = done ? (out.state === "resolved" ? "Complaint resolved" : "Complaint handed over") : s.stage === "decide" ? "Reaching a decision" : s.stage === "act" ? "Acting on the decision" : "Investigating your complaint";
  const p = c.item.permission;

  return h("div", { className: "cx min-h-screen bg-background" },
    h(Header, { title: "Complaint receipt", sub: done ? (out.state === "resolved" ? "Resolved in " + took + " seconds" : "Handed over in " + took + " seconds") : "We’re working on it now" }),
    h("div", { className: "bf-sr", role: "status", "aria-live": "polite", "aria-atomic": true }, done ? out.head + " " + out.body : s.label),
    h("div", { className: "app-page px-5 md:px-8 cx-body" },

      /* the receipt: ID, time, live status and the agent */
      h("section", { className: "rc", "data-tone": tone },
        h("div", { className: "rc__ok", role: "status" },
          h("svg", { className: "rc__okmark", viewBox: "0 0 44 44", "aria-hidden": true }, h("circle", { cx: 22, cy: 22, r: 20 }), h("path", { d: "M13 22.500l6.200 6.200L31.500 16" })),
          h("div", null, h("p", { className: "rc__okt" }, "Complaint submitted"), h("p", { className: "rc__oks" }, "We’ve registered it. Keep this ID for your records."))),
        h("div", { className: "rc__top" },
          h("div", { className: "rc__idw" },
            h("span", { className: "eyebrow" }, "Complaint ID"),
            h("button", { type: "button", className: "rc__id", onClick: copyId, "aria-label": "Copy complaint ID " + c.id }, c.id, ic("copy", 14))),
          h("span", { className: "pillst pillst--" + tone }, done ? okdot(out.state === "resolved" ? "ok" : "warn", 14) : h("i", { className: "pillst__dot" }), done ? (out.state === "resolved" ? "Resolved" : "Handed over") : "Investigating")),
        h("dl", { className: "rc__meta" },
          h("div", null, h("dt", null, "Filed"), h("dd", null, filed)),
          h("div", null, h("dt", null, c.item.type === "call" ? "Call from" : "Message from"), h("dd", null, c.item.sender + (c.brandName ? " · " + c.brandName : ""))),
          h("div", null, h("dt", null, "Time taken"), h("dd", { className: "num" }, done ? took + " seconds" : fmtClock(secs)))),
        h("div", { className: "rc__perf" }),

        h("div", { className: "rc__agent" },
          h("h2", { className: "rc__title" }, h(Roll, { text: title, cls: "roll--title" })),
          h("p", { className: "rc__sub" }, done ? (out.state === "resolved" ? "Every check below ran against your records." : "We’ve done everything that can be done without the sender.") : "This usually takes 30 to 60 seconds. You can leave this page."),
          h(AgentStage, { plan, src: s.src, active: s.active, stage: s.stage, kick: s.kick, tone }),
          h("div", { className: "status status--lg", "data-state": done ? (out.state === "resolved" ? "done" : "wait") : "work" },
            done ? okdot(out.state === "resolved" ? "ok" : "warn") : h(Spin),
            h(Roll, { text: s.label }),
            s.stage === "evidence" && h("span", { className: "pcount" }, h("b", null, Math.min(nDone + 1, plan.src.length)), "/", plan.src.length)),
          h("ol", { className: "track" }, track.map(([lb, to], k) => h("li", { key: lb, className: "track__s " + segState(k, to) }, h("span", { className: "seg " + segState(k, to) }, h("i", null)), lb))))),

      /* the answer */
      done && h("section", { className: "verdict verdict--" + out.state, ref: verdictRef },
        h("span", { className: "eyebrow eyebrow--tone" }, out.verdict),
        h("h3", null, out.head),
        h("p", null, out.body),
        h("ul", { className: "verdict__acts" }, out.actions.map(a => h("li", { key: a }, okdot(out.state === "resolved" ? "ok" : "warn"), a))),
        review && h("p", { className: "banner" }, "We’ve opened a review on this case. You’ll see it in your complaint history."),
        owned && h("p", { className: "banner banner--ok" }, "Thanks for confirming. This sign-up stays on record as yours and the case is closed."),
        h("div", { className: "btns" + (out.next.go === "review" ? " btns--stack" : "") },
          h("button", { type: "button", className: "btn btn--primary", onClick: () => { setOwned(false); doNext(out.next); } }, out.next.label),
          out.next.go === "review" && h("button", { type: "button", className: "btn btn--ghost", onClick: () => { setReview(false); setOwned(true); } }, "Yes, I gave this consent"),
          out.next.go !== "review" && h("button", { type: "button", className: "btn btn--ghost", onClick: onNew }, "Report another"))),

      /* what the agent checked, as it happens */
      h("section", { className: "trail" },
        h("div", { className: "trail__head" }, h("h3", null, "What we checked"), h("span", { className: "num" }, s.log.length + (done ? " steps" : " so far"))),
        h("ol", { className: "trail__list" },
          s.log.map((r, i) => h("li", { key: i, className: "tr" + (r.strong ? " tr--strong" : "") },
            h("span", { className: "tr__ic tr__ic--" + r.tone }, ic(r.icon, 15)),
            h("div", { className: "tr__b" }, h("span", { className: "tr__n" }, r.name), h("span", { className: "tr__t" }, r.text)),
            h("span", { className: "tr__at num" }, "+" + r.at + "s"))),
          s.running && h("li", { key: "run-" + s.running.name, className: "tr tr--run" },
            h("span", { className: "tr__ic tr__ic--run" }, ic(s.running.icon, 15)),
            h("div", { className: "tr__b" }, h("span", { className: "tr__n" }, s.running.name), h("span", { className: "sk", style: { width: "82%" } }), h("span", { className: "sk", style: { width: "54%" } })),
            h(Spin)))),

      /* what was reported */
      h("section", { className: "details" },
        h("h3", null, "What you reported"),
        h(EventCard, { it: c.item, compact: true }),
        h("dl", { className: "facts" },
          c.sim && h("div", null, h("dt", null, "Received on"), h("dd", null, c.sim.slot + " · " + c.sim.number + " (" + c.sim.operator + ")")),
          h("div", null, h("dt", null, "Reason"), h("dd", null, c.reasonLabel)),
          c.note && h("div", null, h("dt", null, "Your comment"), h("dd", null, c.note)),
          p && h("div", null, h("dt", null, "Consent"), h("dd", null, c.revoke ? "Revoke " + p.purpose + " by " + chan(p.channels) : "Keep as it is")))),

      h(Proto, { fast, setFast, onReset: onNew })));
}

/* ==================================================================
   History + shell
   ================================================================== */
const SA_LABEL = { under_review: "Under review", resolved: "Resolved", rejected: "Rejected" };
function History() {
  const [, bump] = useState(0);
  useEffect(() => { const f = () => bump(n => n + 1); window.addEventListener("sa-filed", f); return () => window.removeEventListener("sa-filed", f); }, []);
  const all = FILED.concat(SEED);
  return h("div", { className: "cx min-h-screen bg-background" },
    h(Header, { title: "Complaint history", sub: "Track your complaints", right: false }),
    h("div", { className: "app-page px-5 md:px-8 cx-body" },
      all.map(c => h("div", { key: c.id, className: "sa-card" },
        h("div", { className: "sa-top" }, h("span", { className: "sa-id" }, c.id, c.isNew && h("span", { className: "sa-new" }, "New")), h("span", { className: "sa-chip sa-chip--" + c.state }, SA_LABEL[c.state])),
        h("p", { className: "sa-meta" }, c.mode + " · " + c.date + (c.brand ? " · " + c.brand : "")),
        h("p", { className: "sa-desc" }, c.desc),
        h("div", { className: "sa-track" },
          h("div", { className: "sa-step ok" }, "Registered"),
          h("div", { className: "sa-step " + (c.state === "under_review" ? "on" : "ok") }, "Checking"),
          h("div", { className: "sa-step " + (c.state === "under_review" ? "" : c.state === "rejected" ? "on" : "ok") }, c.state === "rejected" ? "Closed" : "Resolved")))),
      h("button", { type: "button", className: "btn btn--primary", onClick: () => nav("/complaint") }, "Raise a complaint")));
}
function Home() {
  return h("div", { className: "cx min-h-screen bg-background" },
    h(Header, { title: "DigiConsent", sub: "Complaints prototype", back: false }),
    h("div", { className: "app-page px-5 md:px-8 cx-body" },
      h("p", { className: "fine" }, "This stands in for the app’s home screen. The complaint flow starts below."),
      h("button", { type: "button", className: "btn btn--primary", onClick: () => nav("/complaint") }, "Raise a complaint"),
      h("button", { type: "button", className: "btn btn--ghost", onClick: () => nav("/complaint-history") }, "Complaint history")));
}
function Complaint() {
  const [filed, setFiled] = useState(null);
  const [fast, setFast] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => { window.scrollTo(0, 0); }, [filed, n]);
  return filed
    ? h(Receipt, { key: filed.id, c: filed, fast, setFast, onNew: () => { setFiled(null); setN(x => x + 1); } })
    : h(ComplaintForm, { key: n, onSubmit: setFiled, fast, setFast });
}
function App() {
  const [st, setSt] = useState({ stack: ["/complaint"], n: 0 });
  window.__nav = to => setSt(s => {
    if (typeof to === "number") return s.stack.length > 1 ? { ...s, stack: s.stack.slice(0, -1) } : { ...s, stack: ["/"] };
    if (to === "/wallet") { toast("My Wallet isn’t part of this prototype"); return s; }
    if (to === "/") return { ...s, stack: ["/"] };
    if (to === "/complaint") return { stack: ["/complaint"], n: s.n + 1 };
    return { ...s, stack: s.stack.concat(to) };
  });
  const r = st.stack[st.stack.length - 1], inFlow = st.stack.includes("/complaint");
  useEffect(() => { if (r !== "/complaint") window.scrollTo(0, 0); }, [r]);
  /* the complaint stays mounted under History, so an investigation keeps running while you look away */
  return h(React.Fragment, null,
    inFlow && h("div", { hidden: r !== "/complaint" }, h(Complaint, { key: st.n })),
    r === "/complaint-history" ? h(History) : r === "/" ? h(Home) : null);
}
