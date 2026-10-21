/* ===== GTM compare table and Templates mapping, new designs ===== */
function pmGtmSelect(list, sel, best, closed, dis) {
  const R = ["mig", "acq", "ref", "sms", "voice", "rcs"];
  const cell = (p, r) => { const b = p.rates[r] === best[r]; return `<td class="g-c${b ? " bst" : ""}">${b ? '<em>BEST</em>' : ""}<b>₹${p.rates[r].toFixed(2)}</b></td>`; };
  return `<div class="g-pn"><div class="g-tools"><label class="srch">${SRCH}<input data-keep="gq" data-dq="gtm" aria-label="Search partners" placeholder="Search by GTM partner name" value="${esc(S.gtmQuery)}"></label></div>
    <div class="g-wrap"><table class="g-t"><thead><tr><th rowspan="2" class="g-nm">COMPARE PARTNERS ↓</th><th rowspan="2"><b>Migration</b><small>per consent</small></th><th rowspan="2"><b>Acquisition</b><small>per consent</small></th><th rowspan="2"><b>Refresh</b><small>yr / consent</small></th><th colspan="3" class="g-sc">Scrubbing</th></tr><tr class="g-sub"><th><b>SMS</b><small>/scrub</small></th><th><b>Voice</b><small>/scrub</small></th><th><b>RCS</b><small>/scrub</small></th></tr></thead><tbody>
    ${list.map(([p, j]) => `<tr class="${p.picked ? "" : "off"}"><td class="g-nm"><span class="g-w">${cbx(`data-gp="${j}"`, p.picked, dis, "Select " + p.name)}<span class="mk ${p.tone}">${p.mark}</span><b>${esc(p.name)}</b></span></td>${R.map((r) => cell(p, r)).join("")}</tr>`).join("") || `<tr><td colspan="7"><div class="empty">No partner matches "${esc(S.gtmQuery)}".</div></td></tr>`}</tbody></table></div></div>`;
}
const _pmRd = renderDeep;
renderDeep = function () {
  _pmRd(); const f = $(".deep-foot", deep); if (!f) return;
  const g = STEPS[deepI].key === "gtm" && S.gtmStep === "select";
  f.classList.toggle("pm-dark", g);
  if (g && !closedDeepNow()) { const sel = selPartners(); const m = $(".msg", f); if (m) m.textContent = `Selected ${sel.length}`; const b = $("[data-dact=gnext]", f); if (b) { b.insertAdjacentHTML("beforebegin", '<button class="btn pm-clr" data-dact="gclear">Clear</button>'); b.textContent = "Accept & Set Allocation"; } }
};
const closedDeepNow = () => ["done", "later", "inreview"].includes(S.cards[deepI].st);

/* templates */
const pmConf = (t) => { if (!t.lob) return ["Unmapped", "un"]; let h = 0; for (const ch of t.id) h = (h * 31 + ch.charCodeAt(0)) % 997; return t.c === "h" ? [`${92 + (h % 5)}% Confidence`, "hi"] : [`${71 + (h % 17)}% Confidence`, "md"]; };
const pmLobStat = (l) => { const need = Math.round(l.n * 0.72); return [l.n, need]; };
function tplBody(closed) {
  const dis = closed ? "disabled" : "", rows = tplRows(), pages = Math.max(1, Math.ceil(rows.length / PER)); S.tplPage = Math.min(S.tplPage, pages - 1);
  const shown = rows.slice(S.tplPage * PER, S.tplPage * PER + PER), allSel = shown.length && shown.every((t) => S.tplSel.has(t.id));
  const cur = TPL_LOBS.find((l) => l.lob === S.tplLob), n = S.tplLob === "all" ? 100 : S.tplLob === "un" ? 2 : cur ? cur.n : rows.length, need = S.tplLob === "un" ? 2 : Math.round(n * 0.72), hi = n - need;
  const title = S.tplLob === "all" ? "All templates" : S.tplLob === "un" ? "Unmapped" : S.tplLob;
  const tile = (i) => `<span class="tl-lg" style="background:${PM_COL[i % 4]}">${esc(TPL_LOBS[i].lob.split(" ").map((w) => w[0]).slice(0, 2).join(""))}</span>`;
  return `<div class="t-top"><label class="srch">${SRCH}<input data-keep="tq" data-dq="tpl" aria-label="Search promotional templates" placeholder="Search promotional templates" value="${esc(S.tplQuery)}"></label></div>
    <div class="pm-ban"><span>A mapping change is only saved when you send the template for approval. Drag a template, or select several, to change their mapping.</span></div>
    <div class="t-grid"><aside class="t-side"><h5>LINES OF BUSINESS <i>${TPL_LOBS.length}</i></h5>
      <button class="t-lb${S.tplLob === "all" ? " on" : ""}" data-dact="tl" data-l="all"><span class="tl-lg" style="background:#566176">All</span><div><b>All templates</b><small>100 scanned · 98 suggested</small></div></button>
      ${TPL_LOBS.map((l, i) => { const [a, b] = pmLobStat(l); return `<button class="t-lb${S.tplLob === l.lob ? " on" : ""}" data-dact="tl" data-l="${esc(l.lob)}">${tile(i)}<div><b>${esc(l.lob)} <u>· HDFC</u></b><small>${a} suggested · <s>${b} need review</s></small></div></button>`; }).join("")}
      <button class="t-lb${S.tplLob === "un" ? " on" : ""}" data-dact="tl" data-l="un"><span class="tl-lg un">?</span><div><b>Unmapped</b><small>2 templates</small></div></button></aside>
    <div class="t-main"><div class="t-h"><b>${esc(title)}</b><u> · HDFC BANK</u></div>
      <div class="t-f"><span>${cbx('data-tall="1"', allSel, dis, "Select page")}</span>${[["all", "All", n], ["hi", "High confidence", hi], ["check", "Needs review", need]].map(([v, l, c]) => `<button class="t-chip${S.tplFilter === v ? " on" : ""}" data-dact="tf" data-f="${v}">${l} <i>${c}</i></button>`).join("")}</div>
      ${S.tplSel.size && !closed ? `<div class="bulk"><b>${S.tplSel.size} selected</b><span>Assign a line of business to all of them</span><div class="r"><select class="sel" data-bulk="1" aria-label="Line of business for selected" style="height:36px;min-width:180px"><option value="">Choose…</option>${TPL_LOBS.map((l) => `<option>${esc(l.lob)}</option>`).join("")}</select><button class="btn" data-dact="tclear">Clear</button></div></div>` : ""}
      ${shown.map((t) => { const [cl, ck] = pmConf(t), ch = t.lob !== t.lob0; return `<div class="t-r${S.tplSel.has(t.id) ? " sel" : ""}" ${closed ? "" : 'draggable="true"'} data-tdrag="${t.id}"><span>${cbx(`data-ts="${t.id}"`, S.tplSel.has(t.id), dis, "Select " + t.name)}</span><span class="t-gr">⋮⋮</span><div class="t-tx"><b>${esc(t.name)} <code>${t.id}</code></b><p title="${esc(t.text)}">${esc(t.text)}</p></div><span class="t-pill ${ch ? "ch" : ck}"><i></i>${ch ? "Changed" : cl}</span><span class="t-in" title="Matched by reading the message and the brand headers">${pmSvg(PM_ICO.info)}</span></div>`; }).join("") || `<div class="empty" style="padding:30px">No templates match.</div>`}
      <div class="t-pg"><span>Rows per page <select disabled aria-label="Rows per page"><option>${PER}</option></select></span><span class="t-sh">Showing ${rows.length ? S.tplPage * PER + 1 : 0}–${S.tplPage * PER + shown.length} of ${rows.length}</span><div class="t-pb"><button class="pg" data-dact="tpg" data-d="-1" ${S.tplPage === 0 ? "disabled" : ""}>‹ Prev</button>${Array.from({ length: pages }, (_, k) => `<button class="pg${k === S.tplPage ? " on" : ""}" data-dact="tpg" data-p="${k}">${k + 1}</button>`).join("")}<button class="pg" data-dact="tpg" data-d="1" ${S.tplPage >= pages - 1 ? "disabled" : ""}>Next ›</button></div></div></div></div>`;
}
/* drag a template onto a line of business */
let pmDrag = null;
document.addEventListener("dragstart", (e) => { const r = e.target.closest("[data-tdrag]"); if (!r) return; pmDrag = r.dataset.tdrag; e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", pmDrag); } catch (er) { /* ignore */ } });
document.addEventListener("dragover", (e) => { if (pmDrag && e.target.closest(".t-lb[data-l]")) { e.preventDefault(); e.target.closest(".t-lb").classList.add("drop"); } });
document.addEventListener("dragleave", (e) => { e.target.closest?.(".t-lb")?.classList.remove("drop"); });
document.addEventListener("drop", (e) => { const b = e.target.closest(".t-lb[data-l]"); if (!pmDrag || !b) return; e.preventDefault(); const l = b.dataset.l; if (l !== "all") { const ids = S.tplSel.has(pmDrag) ? [...S.tplSel] : [pmDrag]; TPLS.forEach((t) => { if (ids.includes(t.id)) t.lob = l === "un" ? "" : l; }); S.dirty = true; S.tplSel.clear(); toast(`${ids.length} template${ids.length > 1 ? "s" : ""} moved to ${l === "un" ? "Unmapped" : l}`); } pmDrag = null; rerenderDeep(); });
document.addEventListener("dragend", () => { pmDrag = null; $$(".t-lb.drop").forEach((x) => x.classList.remove("drop")); });
