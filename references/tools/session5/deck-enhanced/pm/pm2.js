/* ===== Brands and LOBs details page, new design ===== */
const PM_LOB = {
  "Credit Cards": ["India's largest credit card issuer. Segment-aware reward and EMI messaging drives the highest consent opt-in rates across all banking LOBs.", ["Reward points offers", "Cashback alerts", "EMI conversion"]],
  "Personal Loan": ["Life-stage product with high marketing volume. Salary-linked pre-approval and balance transfer campaigns drive strong EMI conversion.", ["Pre-approved loan offers", "Balance transfer campaigns"]],
  "Home Loan": ["Long-tenure product with a steady enquiry flow. Rate change and top-up messages keep existing borrowers engaged.", ["Rate change alerts", "Top-up loan offers"]],
  "Term Insurance": ["Protection product sold around life events. Renewal and cover increase reminders drive repeat consent.", ["Renewal reminders", "Cover increase offers"]],
  "Savings Plans": ["Goal-based savings with regular contribution reminders and maturity nudges.", ["Premium due reminders", "Maturity nudges"]],
  "Motor Insurance": ["Annual renewal product with strict reminder windows set by regulation.", ["Renewal reminders", "No-claim bonus offers"]],
  "Health Insurance": ["High-intent product. Claim status and wellness messages drive opt-in.", ["Claim status updates", "Wellness programme offers"]],
};
const PM_COL = ["#1f4e9b", "#2f7d6e", "#5b3fc4", "#b4651f"];
S.pmOpen = S.pmOpen || {}; S.pmCollapsed = S.pmCollapsed || {};
const pmSvg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const PM_ICO = { edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>', del: '<path d="M5 7h14M10 7V4.5h4V7M7 7l1 12.5h8L17 7M10 11v5M14 11v5"/>', chev: '<path d="m6 9 6 6 6-6"/>', up: '<path d="m6 15 6-6 6 6"/>', info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.8v.1"/>', drag: '<path d="M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01"/>' };
function pmPhone() {
  const rows = BRANDS.map((b, bi) => `<div class="ph-b"><div class="ph-bh"><span class="ph-bi" style="background:${PM_COL[bi % 4]}">${esc(b.name.split(" ").map((w) => w[0]).slice(0, 2).join(""))}</span><div><b>${esc(b.name)}</b><small>${b.lobs.length} Opted In</small></div></div>${b.lobs.slice(0, 2).map((l) => `<div class="ph-l"><div><b>${esc(l)}</b><span>PREFERRED CHANNELS</span><i>SMS</i><i>Calls</i></div><u></u></div>`).join("")}</div>`).join("");
  return `<aside class="pm-ph"><p>A preview of what your customers see in their Consent Wallet.</p><div class="ph-dev"><div class="ph-top"><span>10:28 am</span><span>5G</span></div><div class="ph-hd"><span class="ph-lg">${esc(BRANDS[0] ? BRANDS[0].name[0] : "H")}</span><div><b>HDFC Bank Limited</b><small>Consents across ${BRANDS.length} brands</small></div></div><div class="ph-bd">${rows}</div></div></aside>`;
}
function pmBrandsBody(closed) {
  const lobs = BRANDS.reduce((a, b) => a + b.lobs.length, 0), dis = closed ? "disabled" : "";
  const cards = BRANDS.map((b, bi) => {
    const nb = brandIsNew(b), col = S.pmCollapsed[bi];
    const lobCards = b.lobs.map((l, li) => {
      const info = PM_LOB[l], isNew = lobIsNew(b, l), key = `${bi}:${li}`, open = S.pmOpen[key], promos = info ? info[1] : [];
      return `<div class="pl-c"><div class="pl-h"><span class="pl-dr">${pmSvg(PM_ICO.drag)}</span><input class="pl-n" data-lob="${key}" value="${esc(l)}" aria-label="Line of business name" ${dis}>${isNew ? '<span class="pm-tag add">Added by you</span>' : '<span class="pm-tag ai">AI suggested</span>'}<span class="pl-a"><button class="pm-ib" data-pmedit="lob:${key}" aria-label="Edit ${esc(l)}">${pmSvg(PM_ICO.edit)}</button>${closed ? "" : `<button class="pm-ib" data-dact="rmlob" data-b="${bi}" data-l="${li}" aria-label="Remove ${esc(l)}">${pmSvg(PM_ICO.del)}</button>`}</span></div>
        <div class="pl-b"><span class="pl-i">${pmSvg(PM_ICO.info)}</span><p>${esc(info ? info[0] : "Added by you. Attach proof so it can be checked before it is set up.")}</p>${promos.length ? `<button class="pm-pe" data-pmpromo="${key}">Promo Examples ${pmSvg(open ? PM_ICO.up : PM_ICO.chev)}</button>` : ""}</div>
        ${open && promos.length ? `<div class="pl-p">${promos.map((p) => `<span>${esc(p)}</span>`).join("")}</div>` : ""}
        ${pmLobMeta(bi, li, l, closed)}</div>`;
    }).join("");
    return `<div class="pb-c"><div class="pb-h"><span class="pb-lg" style="background:${PM_COL[bi % 4]}">${esc(b.name.split(" ").map((w) => w[0]).slice(0, 2).join(""))}</span><input class="pb-n" data-bn="${bi}" value="${esc(b.name.toUpperCase())}" aria-label="Brand name" ${dis}><span class="pm-tag brand">Brand</span>${nb ? '<span class="pm-tag add">Added by you</span>' : '<span class="pm-tag ai">AI suggested</span>'}<span class="pb-a">${closed ? "" : `<button class="pm-lk" data-dact="addlob" data-b="${bi}">+ Add LOB</button>`}<button class="pm-ib" data-pmedit="brand:${bi}" aria-label="Edit ${esc(b.name)}">${pmSvg(PM_ICO.edit)}</button>${closed ? "" : `<button class="pm-ib" data-pmdelb="${bi}" aria-label="Remove ${esc(b.name)}">${pmSvg(PM_ICO.del)}</button>`}<button class="pm-ib" data-pmcol="${bi}" aria-label="${col ? "Expand" : "Collapse"}">${pmSvg(col ? PM_ICO.chev : PM_ICO.up)}</button></span></div>${col ? "" : `<div class="pb-l">${lobCards}</div>`}</div>`;
  }).join("");
  return `<div class="pm-ban">${pmSvg('<path d="M12 3.5l1.9 5.2 5.2 1.9-5.2 1.9L12 17.7l-1.9-5.2-5.2-1.9 5.2-1.9L12 3.5Z"/>')}<span>Based on your DLT headers and public sources, we've identified ${BRANDS.length} brands and ${lobs} LOBs for HDFC Bank Limited. Edit anything that is wrong, then confirm.</span></div>${pmMapStat()}
    <div class="pm-grid"><div class="pm-main"><div class="pm-bh"><b>BRANDS <i>(${BRANDS.length})</i></b>${closed ? "" : '<button class="pm-lk" data-dact="addbrand">+ Add brand</button>'}</div>${cards}</div>${pmPhone()}</div>`;
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-pmedit],[data-pmpromo],[data-pmcol],[data-pmdelb]"); if (!t) return;
  if (t.dataset.pmedit) { const [k, v] = t.dataset.pmedit.split(/:(.+)/); const inp = k === "brand" ? $(`[data-bn="${v}"]`, deep) : $(`[data-lob="${v}"]`, deep); if (inp) { inp.focus(); inp.select(); } return; }
  if (t.dataset.pmpromo) { S.pmOpen[t.dataset.pmpromo] = !S.pmOpen[t.dataset.pmpromo]; return rerenderDeep(); }
  if (t.dataset.pmcol) { S.pmCollapsed[t.dataset.pmcol] = !S.pmCollapsed[t.dataset.pmcol]; return rerenderDeep(); }
  if (t.dataset.pmdelb) { S.dirty = true; BRANDS.splice(+t.dataset.pmdelb, 1); return rerenderDeep(); }
}, true);
document.addEventListener("change", (e) => { if (e.target.id === "pmOk") { S.pmOk = e.target.checked; const b = $(".deep-foot [data-dact=accept]", deep); if (b) b.disabled = !S.pmOk; } }, true);
