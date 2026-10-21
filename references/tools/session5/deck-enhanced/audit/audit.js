/* ===== UI heuristics audit fixes (references/audits/ui-heuristics-2026-10-21.md) ===== */
/* C1 the business profile can be corrected once the agent has filled it */
function auKycEdited(k) { return !!(S.kycEdit && S.kycEdit[k] != null); }
KYC.forEach((f) => { const v0 = f.v; f.v = () => (auKycEdited(f.k) ? S.kycEdit[f.k] : v0()); });
document.body.insertAdjacentHTML("beforeend", [
  ["type", ["Public Limited", "Private Limited", "Limited Liability Partnership", "Partnership", "Government Undertaking"]],
  ["ind", ["Banking & Financial Services", "Insurance", "Telecom", "Retail & E-commerce", "Healthcare"]],
  ["sub", ["Scheduled Commercial Bank", "Small Finance Bank", "Payments Bank", "Co-operative Bank", "NBFC"]],
].map(([k, o]) => `<datalist id="au-dl-${k}">${o.map((x) => `<option value="${esc(x)}">`).join("")}</datalist>`).join(""));
function auKycSubmitState() {
  const el = card(0); if (!el) return;
  const empty = $$(".pin[data-kyc]", el).filter((x) => !x.value.trim());
  $$(".pin[data-kyc]", el).forEach((x) => x.classList.toggle("inp-miss", !x.value.trim()));
  const sb = $(".r-foot [data-act=accept]", el); if (sb) sb.disabled = !S.profileAuth || !S.profileFilled || empty.length > 0;
}
function auUnlockKyc() {
  const el = card(0); if (!el || !S.profileFilled || S.profileFilling || S.cards[0].st !== "review") return;
  $$(".pf", el).forEach((row) => { const inp = $(".pin[readonly]", row), f = KYC.find((x) => x.k === row.dataset.k); if (!inp || !f) return;
    inp.readOnly = false; inp.removeAttribute("tabindex"); inp.dataset.kyc = f.k; if (f.sel) inp.setAttribute("list", `au-dl-${f.k}`); });
}
stage.addEventListener("input", (e) => {
  const t = e.target; if (!t.matches || !t.matches(".pin[data-kyc]")) return;
  S.kycEdit = S.kycEdit || {}; S.kycEdit[t.dataset.kyc] = t.value;
  const row = t.closest(".pf"), tag = row && $(".src-tag", row); if (tag) { tag.textContent = "Edited"; tag.classList.add("au-you"); }
  auKycSubmitState();
});
document.addEventListener("change", (e) => { if (e.target.id === "pAuth") setTimeout(auKycSubmitState, 0); });

/* M1 keyboard focus stays on what can be seen */
function auSetTab(el, off) {
  $$("a,button,input,select,textarea,[tabindex],.r-body,.ctw", el).forEach((x) => {
    if (off) { if (!x.hasAttribute("data-au-ti")) { x.setAttribute("data-au-ti", x.getAttribute("tabindex") ?? ""); x.tabIndex = -1; } }
    else if (x.hasAttribute("data-au-ti")) { const v = x.getAttribute("data-au-ti"); if (v === "") x.removeAttribute("tabindex"); else x.setAttribute("tabindex", v); x.removeAttribute("data-au-ti"); }
  });
  if (off) el.setAttribute("aria-hidden", "true"); else el.removeAttribute("aria-hidden");
}
function auFocusSync() {
  const g = $("#gate"); if (g) { const out = g.classList.contains("is-out"); if (g.inert !== out) g.inert = out; }
  const hs = $("#tbSteps"); if (hs && !hs.inert) hs.inert = true;
  const dOpen = typeof deep !== "undefined" && !deep.hidden;
  [stage, $("#tband"), $("#closes")].forEach((x) => { if (x && x.inert !== dOpen) x.inert = dOpen; });
  const fin = S.phase === "finale";
  cards().forEach((el, i) => auSetTab(el, !fin && !(S.phase === "review" && i === S.active)));
}

/* M2 review cards keep their text at 17px or more: the card is narrower or shorter (its body scrolls) instead of smaller */
function auDims(nat, sr, LPx) {
  const tb = document.body.classList.contains("has-tband");
  const w = Math.max(640, Math.min(940, Math.floor(sr.width - LPx - 56 - (tb ? 40 : 0))));
  return [w, Math.round(Math.min(nat, innerHeight * .88))];
}
/* edit pages: body text 15px or more, small capitals 13px or more */
function auDeepFloor() {
  if (typeof deep === "undefined" || deep.hidden) return;
  $$("*", deep).forEach((e) => {
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || /^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName);
    if (!own || e.closest(".pm-phone")) return;
    const cs = getComputedStyle(e), min = cs.textTransform === "uppercase" ? 13 : 15;
    if (parseFloat(cs.fontSize) < min) e.style.setProperty("font-size", min + "px", "important");
  });
}
{ let q = 0; new MutationObserver(() => { cancelAnimationFrame(q); q = requestAnimationFrame(auDeepFloor); }).observe(deep, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] }); }

/* M4 the profile's status line follows the real sequence: checking, sending, with the operators */
function auVerifyHead() {
  if (S.auSent) return ["With the telecom operators", "Airtel, Jio, Vi and BSNL are reviewing your business profile. This takes a few minutes. Team opens once they approve it."];
  if (S.auVline === 2) return ["Sending to the telecom operators", "Your business profile is going to Airtel, Jio, Vi and BSNL for approval."];
  return ["Checking your profile before it's sent", "I'm matching your KYC against trusted sources. Then it goes to the telecom operators for review."];
}
setInterval(() => {
  const c0 = S.cards[0]; if (!c0) return;
  if (c0.st !== "inreview") { S.auVline = 0; S.auSent = 0; clearTimeout(S.auSentT); S.auSentT = 0; return; }
  const ln = $("[data-vline]", card(0)), v = ln && /Sending/.test(ln.textContent) ? 2 : 1;
  if (v !== S.auVline) { S.auVline = v; tbSync(); }
  if (v === 2 && !S.auSent && !S.auSentT) S.auSentT = setTimeout(() => { if (S.cards[0].st !== "inreview") return; S.auSent = 1; toast("Sent to Airtel, Jio, Vi and BSNL for review"); tbSync(); }, RM ? 0 : 2600);
}, 300);
document.addEventListener("click", (e) => { if (!e.target.closest("[data-au-next]")) return; e.stopPropagation(); const n = firstOpen(); if (n >= 0) focusCard(n); else maybeFinale(); }, true);

/* M5 "What I did" ticks only what really finished */
const _auAcc = heroAcc;
heroAcc = function (i) {
  const c = i >= 0 ? S.cards[i] : null, sig = c ? [i, c.flag, c.tries, c.busy].join() : "";
  if (i === accFor && sig !== S.auAccSig) accFor = -2;
  S.auAccSig = sig; _auAcc(i);
  if (!c || !c.flag) return;
  const lis = $$("#hAcc .acc-trace li"); if (!lis.length) return;
  const warn = (li, t) => { li.classList.add("au-warn"); li.innerHTML = `${uxI("attention")}${esc(t)}`; };
  const skip = (li, t) => { li.classList.add("au-skip"); li.innerHTML = `<i class="au-dash" aria-hidden="true"></i>${esc(t || li.textContent)}`; };
  let done = lis.length;
  if (c.flag === "fail") { lis.forEach((li, k) => { if (k === 1) warn(li, `${li.textContent}: couldn't finish`); if (k > 1) skip(li); }); done = 1; }
  if (c.flag === "nothing") { skip(lis[lis.length - 1], "Found nothing to suggest"); done = lis.length - 1; }
  if (c.flag === "norate") { warn(lis[0], "No partner has sent a rate card yet"); lis.forEach((li, k) => { if (k) skip(li); }); done = 0; }
  const em = $("#hAcc .acc[data-k='0'] em"); if (em) em.textContent = `${done} of ${lis.length} done`;
};

/* M6 rate card terms can be read before they are accepted */
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-au-terms]")) return; e.preventDefault(); e.stopPropagation();
  const sel = PARTNERS.filter((p) => p.picked), R = [["mig", "Migration", "per consent"], ["acq", "Acquisition", "per consent"], ["ref", "Refresh", "per consent a year"], ["sms", "SMS scrubbing", "per scrub"], ["voice", "Voice scrubbing", "per scrub"], ["rcs", "RCS scrubbing", "per scrub"]];
  const bd = document.createElement("div"); bd.className = "dlg-bd";
  bd.innerHTML = `<div class="dlg au-terms-dlg" role="dialog" aria-modal="true" aria-labelledby="auTT"><h3 id="auTT">Rate card terms</h3>${sel.map((p) => `<section><b>${esc(p.name)}</b><table>${R.map(([k, l, u]) => `<tr><td>${l}</td><td>₹${p.rates[k].toFixed(2)} <small>${u}</small></td></tr>`).join("")}</table>
    <ul><li>Rates are fixed for 12 months from the day you accept.</li><li>You are billed monthly for consents processed.</li><li>You can change the volume split with 7 days' notice.</li></ul></section>`).join("")}<p class="au-note">Sample terms for the prototype.</p><div class="row"><button class="btn btn-p" data-x="close">Close</button></div></div>`;
  document.body.appendChild(bd); const cl = $("[data-x=close]", bd); cl.focus();
  const close = () => { bd.remove(); document.removeEventListener("keydown", esc2, true); };
  const esc2 = (k) => { if (k.key === "Escape") { k.stopPropagation(); close(); } };
  document.addEventListener("keydown", esc2, true);
  bd.addEventListener("click", (x) => { if (x.target === bd || x.target.dataset.x === "close") close(); });
}, true);

/* M8 brands: the same "I've reviewed" tick on the card as on the edit page */
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.auOk !== undefined) { S.pmOk = t.checked; const b = $(".r-foot [data-act=accept]", t.closest(".card")); if (b) b.disabled = !t.checked; }
  if (t.id === "pmOk") S.pmOk = t.checked;
}, true);

/* M10 team: super admin note and a header tick that matches the rows */
function auAdminNote() {
  const n = PEOPLE.filter((p) => p.on && /Super Admin/.test(p.role)).length;
  return `<span class="au-fnote">${n ? `${n} ${n === 1 ? "person gets" : "people get"} Super Admin (full access).` : ""}</span>`;
}
function auTeamSync() {
  const el = card(KI("team")); if (!el) return;
  const all = $("[data-ptog-all]", el), rows = $$("[data-ptog]", el), on = rows.filter((r) => r.checked).length;
  if (all) { all.checked = rows.length > 0 && on === rows.length; all.indeterminate = on > 0 && on < rows.length; }
  const n = $(".r-foot .au-fnote", el); if (n) n.outerHTML = auAdminNote();
}
const _auRTC = refreshTeamCard;
refreshTeamCard = function () { _auRTC(); auTeamSync(); };

/* m7 a partly prepared GTM step reads the same everywhere */
function auPost(i) {
  const k = STEPS[i].key, el = card(i), c = S.cards[i]; if (!el) return;
  if (k === "team") auTeamSync();
  if (k === "gtm" && c.partly && c.st === "review") {
    const h = $(".r-h", el); if (h && h.firstChild) h.firstChild.textContent = "Karix takes all the volume for now ";
    $$(".ctbl tr.off", el).forEach((tr) => { $$("td.num", tr).forEach((td) => { td.textContent = "—"; td.classList.remove("bestc"); }); const s = $(".who small", tr); if (s) s.textContent = "No rate card yet"; });
  }
  if (k === "profile" && c.st === "review") auKycSubmitState();
}
const _auRR = renderReview;
renderReview = function (i) { _auRR(i); auPost(i); };
/* (tbSync also runs from an interval that holds the original function, so this runs from our own interval too) */
const _auTb = tbSync;
tbSync = function () { _auTb(); auHeadFix(); };
function auHeadFix() {
  if (S.phase !== "review") return;
  const i = S.active, c = S.cards[i], s = STEPS[i]; if (!c || c.st !== "review") return;
  const h = $("#hTitle"), p = $("#atTele"); if (!h || !p) return;
  let t = "", d = "";
  if (s.key === "gtm" && c.partly) { t = "Please review your GTM partners"; d = "Karix is the only partner with a rate card so far, so it takes all the volume. Confirm it, or wait for the others."; }
  if (c.attn && s.key === "profile") { t = "Fix 2 fields and submit again"; d = "Jio and Vi returned the legal entity name and registered address. Correct them, then submit to the telecom operators again."; }
  if (t && (h.textContent.trim() !== t || p.textContent.trim() !== d)) { heroSet("#hTitle", t); setAtTele(d); }
}

/* M9 a closed window is not shown as a success */
const _auFin = finale;
finale = function () {
  _auFin();
  const closed = S.win === "closed"; document.body.classList.toggle("au-closed", closed);
  $("#auReq")?.remove();
  if (!closed) return;
  const ok = $(".ah-ok"); if (ok) ok.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const t = $("#deckTitle"); if (t) t.textContent = "Your migration window has closed";
  narrate("All five steps are done. Ask for a new window to start migration.", "", false);
  $("#finale p")?.insertAdjacentHTML("afterend", '<button class="btn btn-p" id="auReq">Request a new window</button>');
  $("#auReq").addEventListener("click", (e) => { e.currentTarget.disabled = true; e.currentTarget.textContent = "Request sent"; toast("Your account manager has the request. You'll get an email when the new window opens."); });
};

/* m6 a soft backdrop keeps the agent text readable where the side cards pass behind it */
function auHeroFit() {
  const hi = $("#tband .hero-in"), on = !!hi && S.phase === "review" && document.body.classList.contains("has-tband") && innerWidth > 860 && deep.hidden;
  document.body.classList.toggle("au-heroback", on);
}

/* m9 offline pauses the agent too */
const _auType = typeIntoField;
typeIntoField = async function (el, text, duration) { while ($("#uxOff")?.classList.contains("on")) await sleep(300); return _auType(el, text, duration); };

/* M11 progress is kept: a reload brings the user back to where they left off */
const AU_KEY = "au-progress-v1";
const auStore = { get() { try { return JSON.parse(localStorage.getItem(AU_KEY) || "null"); } catch (e) { return null; } }, set(v) { try { if (v) localStorage.setItem(AU_KEY, JSON.stringify(v)); else localStorage.removeItem(AU_KEY); } catch (e) { /* storage blocked */ } } };
const _auJump = jump;
jump = function (name) { S.auForced = name !== "restart"; if (name === "restart") auStore.set(null); return _auJump(name); };
const _auUx = uxState;
uxState = function (name) { S.auForced = true; return _auUx(name); };
setInterval(() => {
  if (S.auForced || S.auRestoring || (S.phase !== "review" && S.phase !== "finale")) return;
  auStore.set({ ph: S.phase, st: S.cards.map((c) => c.st), at: S.cards.map((c) => c.at || ""), win: S.win || "open" });
}, 1500);
setTimeout(() => {
  const sv = auStore.get(); if (!sv || !Array.isArray(sv.st) || sv.st.length !== S.cards.length) return;
  S.auRestoring = true; _auJump("review"); S.auForced = false; S.profileFilled = true; S.profileAuth = false;
  setTimeout(() => {
    sv.st.forEach((st, k) => { const c = S.cards[k]; c.st = st === "inreview" ? "done" : st; if (c.st !== "review") c.at = sv.at[k] || now(); });
    refreshLocks(); STEPS.forEach((_, k) => { renderReview(k); setStatus(k); }); railSync(); faces();
    const nx = firstOpen(); S.auRestoring = false;
    if (nx < 0) { finale(); return; }
    focusCard(nx);
    setTimeout(() => { const done = STEPS.filter((_, k) => S.cards[k].st === "done").map((s) => s.title); const h = $("#hTitle"), p = $(".h-s", $("#tband"));
      if (h) heroSet("#hTitle", "Welcome back, Ravi"); if (p) setAtTele(`You left off at ${STEPS[nx].title}.${done.length ? ` ${done.join(", ")} ${done.length > 1 ? "are" : "is"} done.` : ""} Nothing was lost.`); }, 700);
  }, 400);
}, 900);

setInterval(() => {
  auUnlockKyc(); auFocusSync(); auHeadFix(); auHeroFit();
  cards().forEach((el) => { const b = $(".r-body", el); el.classList.toggle("au-more", !!b && b.scrollHeight - b.scrollTop - b.clientHeight > 6); });
  document.body.classList.toggle("au-off", !!$("#uxOff.on"));
  const rv = $("[data-review]", card(0)); let q = rv && $(".au-offq", rv);
  if (rv && S.profileFilling && $("#uxOff.on")) { if (!q) rv.insertAdjacentHTML("beforeend", '<div class="pm-q au-offq"><span class="qt">Paused while you\'re offline</span></div>'); }
  else if (q) q.remove();
}, 300);
