/* ===== Brands approval scenarios, template mapping, next/previous, "change later" notes ===== */
const pmCounts = () => { let nb = 0, nl = 0, tl = 0, rem = 0; BRANDS.forEach((b) => { if (brandIsNew(b)) nb++; b.lobs.forEach((l) => { tl++; if (lobIsNew(b, l)) nl++; }); }); JSON.parse(BRANDS0).forEach((o) => { const b = BRANDS.find((y) => y.name === o.name); o.lobs.forEach((l) => { if (!b || !b.lobs.includes(l)) rem++; }); }); return { nb, nl, tl, rem }; };
const pmClassify = () => { const c = pmCounts(); if (!c.nb && !c.nl) return { ...c, type: c.rem ? "remove" : "none" }; return { ...c, type: c.nl === c.tl ? "all" : "partial" }; };
const pmPlural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const pmDecide = decide;
decide = function (i, kind) {
  if (STEPS[i].key !== "brands" || kind === "later" || !brandsChanged()) { if (STEPS[i].key === "brands") S.bPend = null; return pmDecide(i, kind); }
  const cl = pmClassify(), c = S.cards[i], el = card(i); c.at = now(); S.bPend = { ...cl, open: cl.type !== "remove" };
  if (cl.type === "remove") { S.remapPending = true; }
  if (cl.type === "all") { c.st = "inreview"; toast("Brands and LOBs sent for review"); LOCK_COPY[4] = ["Waiting for Brands and LOBs approval", "Your brands and LOBs are with the telecom operators. Skip this step for now and map templates once they are approved. You can change it later at any time."]; setTimeout(pmApprove, 45000); }
  else { c.st = "done"; toast(cl.type === "remove" ? "Brands and LOBs updated. Templates will be mapped again." : `Brands and LOBs saved. ${pmPlural(cl.nb, "brand")} and ${pmPlural(cl.nl, "LOB")} are under review.`); if (cl.type === "partial") setTimeout(pmApprove, 45000); }
  el.classList.add("is-done-flash"); setTimeout(() => el.classList.remove("is-done-flash"), 1100);
  renderReview(i); renderReview(4); setStatus(i); refreshLocks(); reviewHead();
  if (!S.pmNoAdv) setTimeout(() => { const nx = firstOpen(i + 1); if (nx >= 0) focusCard(nx); else maybeFinale(); }, RM ? 0 : 5500);
};
function pmApprove() {
  const p = S.bPend; if (!p || p.type === "none" || p.type === "remove" || p.done) return; p.done = true; p.open = false;
  const c = S.cards[2]; if (c.st === "inreview") { c.st = "done"; c.at = now(); LOCK_COPY[4] = ["Opens after brands and LOBs are set up and partners are confirmed", "Templates are mapped to your lines of business, so they wait for that step."]; }
  renderReview(2); renderReview(4); setStatus(2); setStatus(4); refreshLocks(); railSync(); faces();
  const live = S.cards[4].st === "review" && !isLocked(4) && ((S.phase === "review" && S.active === 4) || (!deep.hidden && deepI === 4));
  if (live) pmMapUpdated(); else toast("Brands and LOBs were approved. Template mapping is up to date.");
}
function pmMapUpdated() {
  const bd = document.createElement("div"); bd.className = "dlg-bd";
  bd.innerHTML = `<div class="dlg dlg3" role="dialog" aria-modal="true" aria-labelledby="dlgT"><span class="dlg-ic">${IC.check}</span><h3 id="dlgT">Your mapping was updated</h3><p>Your brands and LOBs were approved, so the templates were mapped again. Please check the mapping and confirm.</p><div class="row"><button class="btn btn-p" data-x="ok">Check mapping</button></div></div>`;
  document.body.appendChild(bd); $('[data-x="ok"]', bd).focus(); bd.addEventListener("click", (e) => { if (e.target === bd || e.target.dataset.x === "ok") { bd.remove(); renderReview(4); if (!deep.hidden && deepI === 4) rerenderDeep(); } });
  renderReview(4); if (!deep.hidden && deepI === 4) rerenderDeep();
}
/* the brands card says what is under review; all-edited is amber and not done */
const _pmDone4 = doneFace;
doneFace = function (i) {
  let out = _pmDone4(i); const k = STEPS[i].key, c = S.cards[i], p = S.bPend;
  if (k !== "brands" || !p) return out;
  if (c.st === "inreview" && p.type === "all") return out.replace(/<h3>[\s\S]*?<\/h3>/, "<h3>Not done yet. Waiting for approval</h3>").replace(/<p>[\s\S]*?<\/p>/, `<p>All your brands and LOBs were edited or added, so they were sent for review. Please wait for approval. Template mapping is locked until then. GTM partners is still open.</p>`);
  if (c.st === "done" && p.type === "partial" && p.open) return out.replace(/<div class="pm-nx">/, `<div class="pm-pend">${pmPlural(p.nb, "brand")} and ${pmPlural(p.nl, "LOB")} are under review. The rest is set up.</div><div class="pm-nx">`);
  return out;
};
/* warning on the templates card and page while brands are under review; remap loader */
function pmTplNote() { const p = S.bPend; return p && p.type === "partial" && p.open ? `${pmPlural(p.nb, "brand")} and ${pmPlural(p.nl, "LOB")} are still under review. We suggest you skip this step for now and map templates once they are approved. If you continue now, templates are mapped to the approved LOBs only. You can change the mapping later at any time.` : ""; }
const _pmRR = renderReview;
renderReview = function (i) {
  _pmRR(i); const k = STEPS[i].key, c = S.cards[i], box = card(i) && $("[data-review] .r-body", card(i)); if (!box || (c.st !== "review" && c.st !== "ready")) return;
  if (k === "templates" && pmTplNote() && !$(".pm-warn", box)) box.insertAdjacentHTML("afterbegin", `<p class="ux-note warn pm-warn">${uxI("attention")}${esc(pmTplNote())}</p>`);
  if (k !== "profile" && !$(".pm-chg", box) && !$(".ux-face,.ux-ghost", box)) box.insertAdjacentHTML("beforeend", '<p class="pm-chg">You can change this later at any time.</p>');
  if (k === "templates" && S.remapPending && !isLocked(4)) pmRemap();
};
let pmRemapOn = false;
function pmRemap() {
  if (pmRemapOn) return; pmRemapOn = true; const done = () => { S.remapPending = false; pmRemapOn = false; $$(".pm-remap").forEach((x) => x.remove()); const keep = new Set(BRANDS.flatMap((b) => b.lobs)); TPLS.forEach((t) => { if (t.lob && !keep.has(t.lob)) { t.lob = ""; t.lob0 = ""; } }); for (let k = TPL_LOBS.length - 1; k >= 0; k--) if (!keep.has(TPL_LOBS[k].lob)) TPL_LOBS.splice(k, 1); renderReview(4); if (!deep.hidden && deepI === 4) rerenderDeep(); toast("Templates were mapped again to your updated lines of business"); };
  const html = `<div class="pm-remap ux-fail" role="status"><span class="pm-rsp"></span><h3>Mapping your templates again</h3><p>You removed a line of business, so I am mapping your templates again. This takes a moment.</p></div>`;
  const hostC = $("[data-review] .r-body", card(4)); if (hostC) { hostC.style.position = "relative"; hostC.insertAdjacentHTML("beforeend", html); }
  if (!deep.hidden && deepI === 4) { const d = $(".deep-content", deep); if (d) d.insertAdjacentHTML("beforeend", html); }
  setTimeout(done, RM ? 200 : 4500);
}
const _pmRD = renderDeep;
renderDeep = function () {
  _pmRD(); const host = $(".deep-content .inner", deep); if (!host) return; const k = STEPS[deepI].key;
  if (k === "templates" && pmTplNote() && !$(".pm-nbar", host)) host.insertAdjacentHTML("afterbegin", `<div class="ux-nbar warn pm-nbar">${uxI("attention")}<span>${esc(pmTplNote())}</span></div>`);
  if (k === "templates" && S.remapPending) pmRemap();
};
/* menu states */
const _pmUx4 = uxState;
uxState = function (name) {
  if (!name.startsWith("pm-")) { S.bPend = null; S.remapPending = false; return _pmUx4(name); }
  uxReset(); S.bPend = null; S.remapPending = false; S.pmNoAdv = true; pmRemapOn = false; BRANDS.splice(0, BRANDS.length, ...JSON.parse(BRANDS0));
  jump("review"); S.profileFilled = S.profileAuth = true;
  S.cards[0].st = "done"; S.cards[1].st = "done"; S.cards[0].at = S.cards[1].at = now(); refreshLocks();
  const edit = { "pm-all": () => BRANDS.forEach((b) => { b.name += " Ltd"; b.lobs = b.lobs.map((l) => l + " (new)"); }), "pm-partial": () => { BRANDS[0].lobs.push("Gold Loan"); BRANDS.push({ name: "HDFC Securities", hdr: "HDFCSE", lobs: ["Trading"] }); }, "pm-remove": () => BRANDS[0].lobs.splice(2, 1) }[name.replace(/-(warn|popup|lock|remap)$/, "")];
  const kind = name.replace(/^pm-/, "");
  setTimeout(() => {
    STEPS.forEach((_, k) => { renderReview(k); setStatus(k); });
    if (kind === "all" || kind === "partial" || kind === "remove" || kind === "partial-warn" || kind === "partial-popup" || kind === "all-lock" || kind === "remove-remap") {
      S.cards[2].st = "review"; S.cards[3].st = (kind === "partial-warn" || kind === "partial-popup" || kind === "remove-remap") ? "done" : "review"; S.cards[3].at = now(); refreshLocks(); focusCard(2);
      
    }
  }, 400);
  setTimeout(() => {
    const fn = { all: () => BRANDS.forEach((b) => { b.name += " Ltd"; b.lobs = b.lobs.map((l) => l + " (new)"); }), partial: () => { BRANDS[0].lobs.push("Gold Loan"); BRANDS.push({ name: "HDFC Securities", hdr: "HDFCSE", lobs: ["Trading"] }); }, remove: () => BRANDS[0].lobs.splice(2, 1) };
    const key = kind.split("-")[0]; if (fn[key]) fn[key](); S.cards[2].st = "review"; decide(2, "accept");
    if (kind === "all-lock") setTimeout(() => focusCard(4), 900);
    if (kind === "partial-warn") setTimeout(() => focusCard(4), 900);
    if (kind === "partial-popup") { setTimeout(() => focusCard(4), 900); setTimeout(pmApprove, 3500); }
    if (kind === "remove-remap") setTimeout(() => focusCard(4), 900);
  }, 1500);
};
/* previous / next */
document.body.insertAdjacentHTML("beforeend", `<button class="pm-arrow prev" id="pmPrev" type="button" aria-label="Previous step" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg><span>Previous</span></button><button class="pm-arrow next" id="pmNext" type="button" aria-label="Next step" hidden><span>Next</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></button>`);
$("#pmPrev").addEventListener("click", () => { if (S.active > 0) focusCard(S.active - 1); }); $("#pmNext").addEventListener("click", () => { if (S.active < 4) focusCard(S.active + 1); });
setInterval(() => { const on = S.phase === "review" && deep.hidden && !$(".dlg-bd"), pv = $("#pmPrev"), nx = $("#pmNext"); pv.hidden = nx.hidden = !on; if (!on) return; pv.disabled = S.active === 0; nx.disabled = S.active === 4; const f = $(".card.is-focus", stage); if (!f) return; const r = f.getBoundingClientRect(); const y = Math.min(innerHeight - 70, r.bottom + 12); pv.style.cssText = `top:${y}px;left:${Math.max(12, r.left)}px`; nx.style.cssText = `top:${y}px;left:${Math.min(innerWidth - 160 - nx.offsetWidth, r.right - nx.offsetWidth)}px`; }, 200);
/* add scenario states to the Prototype menu */
{ const m = $("#protoMenu"); if (m) { const items = [["All edited: amber, waiting", "pm-all"], ["All edited: templates locked", "pm-all-lock"], ["Partly edited: done, N under review", "pm-partial"], ["Partly edited: templates warning", "pm-partial-warn"], ["Approved while mapping: popup", "pm-partial-popup"], ["LOB removed: remapping", "pm-remove-remap"]]; const g = [...m.querySelectorAll(".pm-g")].find((x) => x.firstChild && /Brands and LOBs/.test(x.textContent)); if (g) g.insertAdjacentHTML("beforeend", items.map(([l, s]) => `<button data-state="${s}">${l}</button>`).join("")); } }
