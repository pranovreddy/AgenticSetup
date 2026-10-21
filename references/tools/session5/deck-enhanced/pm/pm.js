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
