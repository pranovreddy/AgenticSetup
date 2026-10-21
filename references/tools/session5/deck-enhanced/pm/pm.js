/* ===== PM feedback layer ===== */
/* 1 highlight the summary clause for the section being read */
function pmHl() { const doc = $("#doc"); if (!doc) return; let cur = 0; $$("h3", doc).forEach((x, n) => { if (x.offsetTop <= doc.scrollTop + 60) cur = n; }); const links = $$("#prose a[data-clause]"); let best = null; links.forEach((a) => { if (+a.dataset.clause <= cur) best = a; }); links.forEach((a) => a.classList.toggle("on", a === best)); }
$("#doc").addEventListener("scroll", pmHl, { passive: true }); $("#tabs").addEventListener("click", () => setTimeout(pmHl, 60)); setTimeout(pmHl, 300);
/* 4 closes-in context */
{ $("#closes")?.setAttribute("tabindex", "0"); const s = $("#closes .s"); if (s && !$(".cx", s)) s.insertAdjacentHTML("beforeend", '<small class="cx">Finish onboarding before this window closes, so you can migrate your consents.</small>'); }
/* 7 ready screen chips say Ready for review, with a tick */
const _pmFaces = faces;
faces = function () { _pmFaces(); const rd = !!$("#readyL"); document.body.classList.toggle("pm-ready", rd && document.body.classList.contains("all-closed")); if (!rd || !document.body.classList.contains("all-closed")) return; $$(".cardf .cf-st.ux", stage).forEach((x) => { x.innerHTML = `${uxI("done")}Ready for review`; }); };
new MutationObserver(() => { const r = $("#readyL"); if (r && !r.dataset.pm) { r.dataset.pm = 1; $(".rdl-go", r)?.insertAdjacentHTML("beforebegin", `<p class="rdl-note">${uxI("done")}Every step is filled in and checked.</p>`); const g = $(".rdl-go", r); if (g) g.firstChild.textContent = "Review and submit "; } }).observe(stage, { childList: true });
/* 10 team: invite checkboxes */
function pmTeamFoot() { const n = PEOPLE.filter((p) => p.on).length, b = $(".card .r-foot [data-act=accept][data-i=\"1\"]"); if (b) { b.textContent = `Send ${n} invite${n === 1 ? "" : "s"}`; b.disabled = !n; } }
document.addEventListener("change", (e) => {
  const t = e.target; if (t.dataset.ptog !== undefined) { const p = PEOPLE.find((x) => x.email === t.dataset.ptog); if (p) p.on = t.checked; refreshTeamCard(); pmTeamFoot(); }
  if (t.dataset.ptogAll !== undefined) { const q = (S.cardTeamQ || "").trim().toLowerCase(), role = S.cardTeamRole || "all"; PEOPLE.forEach((p) => { if (teamMatch(p, q, role)) p.on = t.checked; }); refreshTeamCard(); pmTeamFoot(); }
  if (t.dataset.pmproof !== undefined) { S.proof = S.proof || {}; S.proof[t.dataset.pmproof] = t.files[0] ? t.files[0].name : ""; rerenderDeep(); toast("Proof attached"); }
}, true);
/* 13 and 14 lines of business: proof and template mapping */
const pmTplCount = (l) => { const x = TPL_LOBS.find((t) => t.lob === l); return x ? x.n : 0; };
function pmLobMeta(bi, li, l, closed) {
  const b = BRANDS[bi], isNew = lobIsNew(b, l), n = pmTplCount(l), key = `${bi}:${li}`, got = (S.proof || {})[key];
  const tc = `<span class="tc">${uxI("doc")}${n ? `${n} templates mapped` : "No templates mapped yet"}</span>`;
  if (!isNew) return `<div class="lm"><span class="pf ok">${uxI("done")}Proof: seen in DLT header ${esc(b.hdr || "HDFCBK")}</span>${tc}</div>`;
  if (got) return `<div class="lm"><span class="pf ok">${uxI("done")}Proof attached: ${esc(got)}</span>${tc}</div>`;
  return `<div class="lm"><span class="pf need">${uxI("attention")}Proof needed</span>${closed ? "" : `<label class="attach">Attach proof<input type="file" data-pmproof="${key}" accept=".pdf,.png,.jpg,.jpeg"></label>`}<span style="color:#5b6678">Licence, registration certificate or a page on your website</span></div>`;
}
function pmMapStat() {
  const un = 2, ok = 98, miss = BRANDS.reduce((a, b) => a + b.lobs.filter((l) => !pmTplCount(l)).length, 0), changed = brandsChanged();
  return `<div class="mapstat${changed || un ? " warn" : ""}">${uxI(changed ? "attention" : "done")}<span>${changed ? "Template mapping runs again after your changes are approved." : `Template mapping: ${ok} of 100 templates are mapped to these lines of business.`}</span><em>${un} unmapped</em>${miss ? `<em>${miss} new line${miss > 1 ? "s" : ""} without templates</em>` : ""}</div>`;
}
/* task ticker becomes one pill whose text changes */
setInterval(() => { const box = $("#hTasks"); if (!box) return; if (!box.classList.contains("pm-hide")) box.classList.add("pm-hide"); let pill = $("#pmPill"); if (!pill) { box.insertAdjacentHTML("afterend", '<div class="pm-pill" id="pmPill" hidden><i class="sp2"></i><span class="tx2"></span></div>'); pill = $("#pmPill"); }
  const f = $("li.focus .tx", box), txt = f ? f.textContent : ""; if (!txt) { pill.hidden = true; pill.dataset.t = ""; return; } pill.hidden = false; if (pill.dataset.t !== txt) { pill.dataset.t = txt; const t = $(".tx2", pill); t.textContent = txt; t.style.animation = "none"; void t.offsetWidth; t.style.animation = ""; } }, 250);
/* crisp text: once the cards stop moving, drop their transitions so they are redrawn at the final size */
{ let tm = 0; const still = () => document.body.classList.add("pm-still"); new MutationObserver(() => { document.body.classList.remove("pm-still"); clearTimeout(tm); tm = setTimeout(still, 1100); }).observe(stage, { attributes: true, attributeFilter: ["style"], subtree: true }); tm = setTimeout(still, 1500); }
/* AI query pill inside each analysing card; autofill pill on the profile review */
setInterval(() => {
  $$(".card", stage).forEach((el) => { const ln = $("[data-line]", el), host = $("[data-analyse]", el); if (!host) return; let q = $(".pm-q", host);
    if (!ln || !$(".ld", host)) { if (q) q.remove(); return; }
    if (!q) { host.insertAdjacentHTML("beforeend", `<div class="pm-q"><span class="qi">${typeof AI_MARK !== "undefined" ? AI_MARK : ""}</span><span class="qt"></span><span class="qd"><i></i><i></i><i></i></span></div>`); q = $(".pm-q", host); }
    const t = ln.textContent.replace(/\s+/g, " ").trim(), tx = $(".qt", q); if (tx.dataset.v !== t) { tx.dataset.v = t; tx.textContent = t; tx.style.animation = "none"; void tx.offsetWidth; tx.style.animation = ""; } });
  { const rv = $("[data-review]", card(0)); let f = rv && $(".pm-q.fill", rv); if (S.profileFilling && rv) { const cur = $(".pf.is-filling label, .pf.is-filling .lab", rv), n = cur && cur.firstChild ? cur.firstChild.textContent.replace("*", "").trim() : ""; const t = n ? `Filling in ${n}` : "Filling in your business profile"; if (!f) { rv.insertAdjacentHTML("afterbegin", `<div class="pm-q fill"><span class="qi">${typeof AI_MARK !== "undefined" ? AI_MARK : ""}</span><span class="qt"></span><span class="qd"><i></i><i></i><i></i></span></div>`); f = $(".pm-q.fill", rv); } const x = $(".qt", f); if (x.textContent !== t) x.textContent = t; } else if (f) f.remove(); }
  const pill = $("#pmPill"); if (!pill) return;
  if (S.profileFilling) { const f = $(".pf.is-filling label, .pf.is-filling .lab, .pf.is-filling b", card(0)), n = f ? f.textContent.replace("*", "").trim() : ""; const t = n ? `Filling in ${n}` : "Filling in your business profile"; pill.hidden = false; pill.dataset.t = "fill"; const x = $(".tx2", pill); if (x.textContent !== t) x.textContent = t; }
  else if (pill.dataset.t === "fill") { pill.hidden = true; pill.dataset.t = ""; }
}, 250);
/* the review (verification) animation gets the same query pill */
setInterval(() => { const el = card(0), rv = el && $("[data-review]", el); if (!rv) return; const ln = $("[data-vline]", rv); let q = $(".pm-q.ver", rv);
  if (!ln) { if (q) q.remove(); return; }
  if (!q) { rv.insertAdjacentHTML("beforeend", `<div class="pm-q ver"><span class="qi">${typeof AI_MARK !== "undefined" ? AI_MARK : ""}</span><span class="qt"></span><span class="qd"><i></i><i></i><i></i></span></div>`); q = $(".pm-q.ver", rv); }
  const t = ln.textContent.replace(/\s+/g, " ").trim(), tx = $(".qt", q); if (tx.dataset.v !== t) { tx.dataset.v = t; tx.textContent = t; tx.style.animation = "none"; void tx.offsetWidth; tx.style.animation = ""; } }, 250);
/* ===== Prototype menu grouped by screen and card ===== */
{ const m = $("#protoMenu"); if (m) {
  const G = [
    ["Flow", [["Agent analysis", "j:analyse"], ["Ready for review", "j:ready"], ["Review cards", "j:review"], ["Finale", "j:finale"], ["Restart from agreements", "j:restart"]]],
    ["Agreements", [["Accepted", "gate-accepted"], ["Can’t be loaded", "gate-fail"], ["Acceptance refused", "gate-refused"]]],
    ["Agent text on the left", [["Waiting", "msg-wait"], ["GTM waiting", "msg-gtm"], ["Welcome back", "msg-back"], ["After a decision", "msg-next"]]],
    ["Business profile", [["Done, who and when", "done-profile"], ["Needs attention", "attention-profile"], ["Partly prepared", "partly-profile"], ["Save failed", "err-profile"], ["Result unknown", "unk-profile"]]],
    ["Team", [["Nothing found", "nothing-team"], ["Couldn’t prepare, first try", "fail-team"], ["Couldn’t prepare, after two tries", "fail2-team"], ["In review", "inreview-team"], ["Do it later", "later-team"], ["Details: nothing found", "notice-team-nothing"], ["Details: done by someone else", "notice-team-someone"], ["Details: stays editable", "notice-team-team"], ["Save changes dialog", "dialog-team"], ["Save dialog, read-only", "dialog-team-ro"], ["Done by someone else, on the card", "conc-card"], ["Done by someone else, on the page", "conc-deep"]]],
    ["Brands and LOBs", [["Nothing found", "nothing-brands"], ["Couldn’t prepare", "fail-brands"], ["Details: no suggestion prepared", "notice-brands-noprep"], ["Details: suggestion arrived late", "notice-brands-late"], ["Details: save failed", "derr-brands"], ["Save changes dialog", "dialog-brands"]]],
    ["GTM partners", [["No rate cards, locked", "norate-gtm"], ["Partly prepared", "partly-gtm"], ["Save changes dialog", "dialog-gtm"]]],
    ["Templates", [["Nothing found", "nothing-templates"], ["Trying again", "busy-templates"], ["Needs attention", "attention-templates"], ["Partly prepared", "partly-templates"], ["Save changes dialog", "dialog-templates"]]],
    ["Finale", [["Skipped steps", "fin-skipped"], ["Window not open yet", "fin-notopen"], ["Window open", "fin-open"], ["Window closed", "fin-closed"]]],
    ["Whole screen", [["Offline", "offline-x"], ["Deck failed to load", "loadfail-deck"], ["Card failed to load", "loadfail-card"], ["Details failed to load", "loadfail-deep"], ["Locked card opens", "conc-unlock"]]],
  ];
  m.innerHTML = G.map(([t, it], gi) => `<details class="pm-g"${gi === 0 ? " open" : ""}><summary>${t}<i>${it.length}</i></summary>${it.map(([l, s]) => s.startsWith("j:") ? `<button data-jump="${s.slice(2)}">${l}</button>` : `<button data-state="${s}">${l}</button>`).join("")}</details>`).join("");
  m.addEventListener("click", (e) => { const b = e.target.closest("[data-state]"); if (b) { m.hidden = true; uxState(b.dataset.state); } });
} }
/* richer success face */
const _pmDone = doneFace;
doneFace = function (i) {
  const out = _pmDone(i), c = S.cards[i], k = STEPS[i].key;
  if (c.st !== "done" || c.attn || !out.includes('class="done-face"')) return out;
  const n = PEOPLE.filter((p) => p.on).length, lobs = BRANDS.reduce((a, b) => a + b.lobs.length, 0);
  const F = { profile: ["7 fields filled", "Approved by 4 of 4 operators", "Logo added"], team: [`${n} people invited`, "Roles assigned", "Emails delivered"], brands: [`${BRANDS.length} brands`, `${lobs} lines of business`, "Set up"], gtm: PARTNERS.filter((p) => p.picked).map((p) => p.name).concat(["Terms accepted"]), templates: ["98 of 100 mapped", "2 left for later", "Ready to send"] }[k];
  const nx = { profile: "Next: Team is open now", team: "Next: Brands and LOBs", brands: "Next: GTM partners and Templates are open", gtm: "Next: Templates", templates: "That was the last step. You can start migration." }[k];
  const who = c.who ? esc(c.who.name) : "Ravi Menon", ini = who.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const extra = `<p class="pm-ft">${esc(F.join(" · "))}</p><div class="pm-by"><i>${ini}</i><span>Done by <b>${who}</b> · ${esc(c.at || "just now")}</span></div><div class="pm-nx">${esc(nx)}</div>`;
  return out.replace(/<p>[\s\S]*?<\/p>/, extra);
};
/* partly prepared profile: no typing animation, cursor goes to the first field the agent couldn't fill */
const _pmFill = fillProfile;
fillProfile = async function () {
  if (!S.pmSkipFill) return _pmFill();
  if (S.profileFilled || S.profileFilling) return;
  const el = card(0); if (!el || S.cards[0].st !== "review") return;
  $("[data-logo]", el)?.classList.add("is-in");
  $$(".pf", el).forEach((row) => { const f = KYC.find((x) => x.k === row.dataset.k), inp = $(".pin", row); row.classList.remove("is-waiting", "is-filling"); row.classList.add("is-filled"); if (inp && f && !inp.classList.contains("inp-miss")) inp.value = f.v(); });
  S.profileFilled = true; const pa = $("#pAuth", el); if (pa) pa.disabled = false;
};
const _pmUx = uxState;
uxState = function (name) { S.pmSkipFill = name === "partly-profile" || name === "self-profile"; _pmUx(name); if (S.pmSkipFill) [1500, 2600].forEach((t) => setTimeout(() => { const f = $(".inp-miss", card(0)); if (f && document.activeElement !== f && !S.pmFocused) { f.removeAttribute("readonly"); f.removeAttribute("tabindex"); f.focus(); if (t > 1500) S.pmFocused = true; } }, t)); S.pmFocused = false; };
