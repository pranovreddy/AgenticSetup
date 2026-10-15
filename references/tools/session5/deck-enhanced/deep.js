/* ---------- Gates: each step opens only after the one before it ---------- */
const LOCK_COPY = [
  null,
  ["Opens after your business profile is approved", "Telecom operators approve it first. Then you can invite your team, or skip it."],
  ["Opens after your team step", "Invite people or skip it. GTM partners come next either way."],
  ["Opens after you confirm partners", "Brands and lines of business follow GTM partners."],
  ["Opens after brands and LOBs are set up", "Templates are mapped to your lines of business, so they wait for that step."],
];
const passed = (i) => ["done", "later"].includes(S.cards[i].st);
const isLocked = (i) => i > 0 && !passed(i - 1);
function refreshLocks() {
  cards().forEach((_, i) => { if (i > 0 && S.cards[i].st === "review") renderReview(i); setStatus(i); });
  const d = S.cards.filter((c) => c.st === "done" || c.st === "later").length;
  const av = $(".usr-av"); if (av) av.style.setProperty("--p", d * 20);
}
function lockFace(i) {
  const [h, p] = LOCK_COPY[i];
  return `<div class="lock-face"><i>${IC.lock}</i><b>${h}</b><span>${p}</span><div class="steps">${STEPS.map((_, k) => `<s class="${k < i && passed(k) ? "on" : ""}"></s>`).join("")}</div></div>`;
}

/* ---------- Deep review page ---------- */
let deepI = -1;
const deep = $("#deep");
const MOBILES = ["+91 98103 47291", "+91 98200 66418", "+91 98670 30952", "+91 98450 11234", "+91 99001 72684", "+91 99870 55321"];
PEOPLE.forEach((p, n) => { p.mobile = MOBILES[n]; });
Object.assign(S, { gtmStep: "select", allocMap: {}, allocSame: false, gtmQuery: "", teamTab: "users", teamQuery: "", addUser: false, tplLob: "all", tplPage: 0, tplQuery: "", tplFilter: "all", tplSel: new Set(), dirty: false });
const PER = 6;
const selPartners = () => PARTNERS.filter((p) => p.picked);
function allocPct(p, k, sel = selPartners()) {
  const m = S.allocMap[p.id]; if (m && m[k] != null) return m[k];
  if (sel.length === 2) return p === sel[0] ? ALLOC[k] : 100 - ALLOC[k];
  const base = sel.length ? Math.floor(100 / sel.length) : 0;
  return sel.length ? base + (p === sel[sel.length - 1] ? 100 - base * sel.length : 0) : 0;
}
function allocInit() {
  const sel = selPartners(); S.allocMap = {};
  const map = {}; sel.forEach((p) => { map[p.id] = {}; PHASES.forEach((ph) => { map[p.id][ph.k] = allocPct(p, ph.k, sel); }); });
  S.allocMap = map;
}
const phaseTotal = (k) => selPartners().reduce((a, p) => a + (S.allocMap[p.id]?.[k] ?? 0), 0);
const allocOk = () => selPartners().length > 0 && PHASES.every((ph) => phaseTotal(ph.k) === 100);
const cbx = (attr, on, dis, label) => `<label class="cbx"><input type="checkbox" aria-label="${esc(label || "Select")}" ${attr} ${on ? "checked" : ""} ${dis || ""}><span></span></label>`;
const SRCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
const PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
const ASIDE_P = {
  profile: "Matched on four sources. Edit anything that's wrong before you submit.",
  team: "Each person has a suggested role. Add people, change a role, or skip this step.",
  brands: "Confirm the draft as it is and it's set up straight away. Any change goes for review.",
  gtm: "Karix and Value First have the lowest rates. Change the choice or the split if you want.",
  templates: "A line of business is suggested for 98 of 100 templates. 2 still need mapping.",
};
const ASIDE_NEXT = {
  profile: "Submitting sends the profile to telecom operators for approval. Your team step opens once it's approved.",
  team: "Invites go out by email. GTM partners open next, whether you invite or skip.",
  gtm: "Accepting includes the rate card terms. Brands and LOBs open next.",
  brands: "Templates open once your brands and lines of business are set up.",
  templates: "Templates you map are sent for approval. The 2 unmapped ones don't hold up migration.",
};
function openDeep(i) {
  if (S.cards[i].st === "review" && isLocked(i)) { toast(LOCK_COPY[i][0]); return; }
  deepI = i; S.dirty = false;
  const r = card(i).getBoundingClientRect();
  if (STEPS[i].key === "profile") S.profileFilled = true;
  renderDeep(); deep.hidden = false;
  document.body.classList.add("deep-open");
  if (RM) return;
  deep.classList.add("is-enter"); setTimeout(() => deep.classList.remove("is-enter"), 1700);
  deep.animate([
    { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 20px)`, opacity: .5 },
    { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 },
  ], { duration: 760, easing: "cubic-bezier(.22,.9,.2,1)" });
}
function closeDeep(then) {
  const r = card(deepI).getBoundingClientRect();
  document.body.classList.remove("deep-open");
  const fin = () => { deep.hidden = true; deep.innerHTML = ""; renderReview(deepI); if (then) then(); };
  if (RM) return fin();
  deep.classList.remove("is-enter");
  deep.animate([
    { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 },
    { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 20px)`, opacity: .35 },
  ], { duration: 560, easing: "cubic-bezier(.65,0,.35,1)" }).onfinish = fin;
}
function renderDeep() {
  const i = deepI, s = STEPS[i], c = S.cards[i];
  const closed = ["done", "later", "inreview"].includes(c.st);
  const { main, action, msg } = deepBody(s.key, closed);
  deep.innerHTML = `<div class="deep-top"><button class="btn btn-t" data-dact="close">${IC.back}Back to cards</button>
      <div class="tt"><span class="tic">${IC[s.key]}</span><div><div class="crumb">STEP ${i + 1} OF 5</div><h2>${esc(s.title)}</h2></div></div>
      <div class="pg" aria-hidden="true">${STEPS.map((_, k) => `<i class="${passed(k) ? "done" : k === i ? "cur" : ""}"></i>`).join("")}</div></div>
    <div class="deep-main">
      <aside class="deep-aside">
        <span class="chip-agent" style="--k:0">${miniCore}Agent Summary</span>
        <h3 class="aside-h" style="--k:1">${esc(s.result)}</h3>
        <p class="aside-p" style="--k:2">${esc(ASIDE_P[s.key])}</p>
        <div class="acc" style="--k:3">
          <details><summary>What was checked${IC.chev}</summary><div class="ab"><ol>${s.checks.map((x) => `<li><i>${IC.check}</i>${esc(x[1])}</li>`).join("")}</ol></div></details>
          <details><summary>Sources${IC.chev}</summary><div class="ab"><div style="display:flex;flex-wrap:wrap;gap:6px">${s.sources.map((x) => `<span class="src-tag">${esc(x)}</span>`).join("")}</div></div></details>
          <details open><summary>What happens next${IC.chev}</summary><div class="ab">${esc(ASIDE_NEXT[s.key])}</div></details>
        </div>
      </aside>
      <div class="deep-content"><div class="inner">${main}</div></div>
    </div>
    <div class="deep-foot"><span class="msg">${msg || ""}</span>${closed ? `<button class="btn btn-p" data-dact="close">Done</button>` : action}</div>`;
  $$(".deep-content .inner > *", deep).forEach((el, k) => el.style.setProperty("--k", k));
}

/* ---- Step bodies ---- */
function teamBody(closed) {
  const dis = closed ? "disabled" : "";
  const tabs = `<div class="tabs2" role="tablist"><button class="dtab${S.teamTab === "users" ? " on" : ""}" role="tab" data-dact="tt" data-t="users">Users<i>${PEOPLE.length}</i></button><button class="dtab${S.teamTab === "roles" ? " on" : ""}" role="tab" data-dact="tt" data-t="roles">Roles and permissions<i>${ROLES.length}</i></button></div>`;
  if (S.teamTab === "roles") {
    return tabs + `<div class="panel"><div class="panel-h"><b>What each role can do</b><span>Change a person's role on the Users tab</span></div><div class="rolegrid">${ROLES.map((r) => { const ps = PEOPLE.filter((p) => p.on && p.role === r.id); return `<div class="rolec"><b>${esc(r.id)}</b><p>${esc(r.desc)}</p><div class="stack">${ps.map((p) => `<span class="av t${p.t}" title="${esc(p.name)}">${p.i}</span>`).join("") || `<small style="color:var(--faint)">Nobody yet</small>`}</div><small style="color:var(--muted)">${ps.length} ${ps.length === 1 ? "person" : "people"}</small></div>`; }).join("")}</div></div>`;
  }
  const q = S.teamQuery.trim().toLowerCase();
  const rows = PEOPLE.map((p, j) => [p, j]).filter(([p]) => !q || [p.name, p.email, p.role, p.dept, p.title].join(" ").toLowerCase().includes(q));
  const n = PEOPLE.filter((p) => p.on).length;
  const all = rows.length && rows.every(([p]) => p.on);
  const add = S.addUser ? `<div class="addrow"><label>Name<input class="inp" id="auName" placeholder="Full name"></label><label>Work email<input class="inp" id="auMail" placeholder="name@hdfc.com"></label><label>Department<select class="sel" id="auDept">${DEPTS.map((x) => `<option>${esc(x)}</option>`).join("")}</select></label><label>Role<select class="sel" id="auRole">${ROLES.map((r) => `<option>${esc(r.id)}</option>`).join("")}</select></label><div class="btns"><button class="btn btn-p" data-dact="auSave">Add</button><button class="btn" data-dact="auCancel">Cancel</button></div></div>` : "";
  return tabs + `<div class="panel"><div class="panel-h"><b>Suggested users</b><span>${PEOPLE.length} found on your DLT registration · ${n} selected</span>${closed ? "" : `<div class="r"><button class="btn" data-dact="auOpen">${PLUS}Add user</button></div>`}</div>
    <div class="tools"><label class="srch">${SRCH}<input data-keep="teamq" data-dq="team" aria-label="Search users" placeholder="Search by name, role or email" value="${esc(S.teamQuery)}"></label></div>${add}
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:44px">${cbx('data-pall="1"', all, dis, "Select all")}</th><th>User</th><th>Mobile</th><th>Department</th><th>Role</th><th style="width:44px"></th></tr></thead><tbody>
    ${rows.map(([p, j]) => `<tr class="${p.on ? "" : "off"}"><td>${cbx(`data-pp="${j}"`, p.on, dis, "Invite " + p.name)}</td>
      <td><div class="who"><span class="av t${p.t}">${p.i}</span><div><b>${esc(p.name)}</b><small style="font-family:var(--mono)">${esc(p.email)}</small></div></div></td>
      <td>${esc(p.mobile || "-")}</td>
      <td><select class="sel" data-pd="${j}" aria-label="Department" ${dis}>${DEPTS.map((x) => `<option ${x === p.dept ? "selected" : ""}>${esc(x)}</option>`).join("")}</select></td>
      <td><select class="sel" data-pr="${j}" aria-label="Role" ${dis}>${ROLES.map((r) => `<option ${r.id === p.role ? "selected" : ""}>${esc(r.id)}</option>`).join("")}</select></td>
      <td>${closed ? "" : `<button class="rm" data-dact="rmp" data-j="${j}" aria-label="Remove ${esc(p.name)}">${IC.x}</button>`}</td></tr>`).join("") || `<tr><td colspan="6"><div class="empty">No one matches "${esc(S.teamQuery)}". Use Add user to include them.</div></td></tr>`}
    </tbody></table></div></div>`;
}
function gtmBody(closed) {
  const dis = closed ? "disabled" : "";
  const sel = selPartners(), step = S.gtmStep;
  const bar = `<div class="stepbar"><span class="st ${step === "select" ? "on" : "done"}"><i>${step === "select" ? 1 : IC.check}</i>Select partners</span><span class="gap"></span><span class="st ${step === "alloc" ? "on" : ""}"><i>2</i>Set allocation</span></div>`;
  const best = {}; ["mig", "acq", "ref", "sms", "voice", "rcs"].forEach((r) => (best[r] = Math.min(...PARTNERS.map((p) => p.rates[r]))));
  if (step === "select") {
    const q = S.gtmQuery.trim().toLowerCase(), list = PARTNERS.map((p, j) => [p, j]).filter(([p]) => !q || p.name.toLowerCase().includes(q));
    const cell = (p, r) => `<td class="${p.rates[r] === best[r] ? "bestc" : ""}">₹${p.rates[r].toFixed(2)}${p.rates[r] === best[r] ? `<span class="best">BEST</span>` : ""}</td>`;
    return bar + `<div class="panel"><div class="panel-h"><b>Compare partners</b><span>${sel.length} of ${PARTNERS.length} selected</span>${closed ? "" : `<div class="r"><button class="lnk" data-dact="gclear">Clear</button></div>`}</div>
      <div class="tools"><label class="srch">${SRCH}<input data-keep="gq" data-dq="gtm" aria-label="Search partners" placeholder="Search by GTM partner name" value="${esc(S.gtmQuery)}"></label></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th style="width:44px"></th><th>Partner</th><th>Migration</th><th>Acquisition</th><th>Refresh</th><th>SMS scrub</th><th>Call scrub</th><th>RCS scrub</th></tr></thead><tbody>
      ${list.map(([p, j]) => `<tr class="${p.picked ? "" : "off"}"><td>${cbx(`data-gp="${j}"`, p.picked, dis, "Select " + p.name)}</td><td><div class="who"><span class="mk ${p.tone}">${p.mark}</span><div><b>${esc(p.name)}</b><small>${esc(p.why)}</small></div></div></td>${["mig", "acq", "ref", "sms", "voice", "rcs"].map((r) => cell(p, r)).join("")}</tr>`).join("") || `<tr><td colspan="8"><div class="empty">No partner matches "${esc(S.gtmQuery)}".</div></td></tr>`}
      </tbody></table></div></div>`;
  }
  const cols = PHASES;
  return bar + `<div class="panel"><div class="panel-h"><b>Set distribution</b><span>How volume is split across the selected partners, per phase</span><label class="same">Assign same for all phases<span class="switch"><input type="checkbox" data-dact="asame" ${S.allocSame ? "checked" : ""} ${dis} aria-label="Assign same for all phases"><span></span></span></label></div>
    <div class="tbl-wrap"><table class="tbl alloc-t"><thead><tr><th>Partner</th>${cols.map((c) => `<th>${c.label}</th>`).join("")}</tr></thead><tbody>
    ${sel.map((p) => `<tr><td><div class="who"><span class="mk ${p.tone}">${p.mark}</span><b>${esc(p.name)}</b>${["mig", "acq", "ref"].some((r) => p.rates[r] === best[r]) ? `<span class="best">BEST RATE</span>` : ""}</div></td>${cols.map((c) => `<td><label class="pct"><input type="number" min="0" max="100" step="5" value="${S.allocMap[p.id]?.[c.k] ?? 0}" data-am="${p.id}:${c.k}" ${dis} aria-label="${esc(p.name)} ${c.label} share"><span>%</span></label></td>`).join("")}</tr>`).join("")}
    <tr class="totrow"><td>Total, must equal 100%</td>${cols.map((c) => { const t = phaseTotal(c.k); return `<td class="${t === 100 ? "totok" : "totbad"}">${t}%${t === 100 ? " ✓" : ""}</td>`; }).join("")}</tr></tbody></table></div></div>
    <div class="panel"><div class="panel-h"><b>Volume split</b><span>Updates as you change the numbers</span></div><div class="splitbars">${cols.map((c) => `<div class="sb"><span>${c.label}</span><div class="split">${sel.map((p) => { const v = S.allocMap[p.id]?.[c.k] ?? 0; return `<i style="width:${v}%;background:${toneC(p.tone)}">${v >= 14 ? `${esc(p.name)} ${v}%` : ""}</i>`; }).join("")}</div></div>`).join("")}</div></div>
    <label class="check" style="background:#fff;border:1px solid var(--line)"><input type="checkbox" id="gTermsDeep" data-dact="gterms" ${S.gtmTerms ? "checked" : ""} ${dis}>I accept the rate card terms of ${sel.map((p) => esc(p.name)).join(" and ") || "the selected partners"}.</label>`;
}
function brandsBody(closed) {
  const dis = closed ? "disabled" : "", ch = brandsChanged(), lobs = BRANDS.reduce((a, b) => a + b.lobs.length, 0);
  return `<div class="banner ${ch ? "warn" : ""}">${IC.info}<span>${ch ? "You changed the draft, so it goes for review before it's set up. Templates wait until it's approved." : "Confirm the draft as it is and it's set up straight away, with no review."}</span></div>
    <div class="ent2"><div class="ent2-h"><span class="eic">${IC.build}</span><div><b>HDFC Bank Limited</b><br><span class="sm">${BRANDS.length} brands · ${lobs} lines of business</span></div><span class="pill">Enterprise</span></div>
    <div class="bgrid">${BRANDS.map((b, bi) => `<div class="bcard"><div class="bcard-h"><span class="bic">${IC.brands}</span><div style="min-width:0;flex:1"><small>Brand</small><input class="bname" data-bn="${bi}" value="${esc(b.name)}" aria-label="Brand name" ${dis}></div><span class="mono" style="color:var(--faint)">${esc(b.hdr)}</span></div>
      ${b.lobs.map((l, li) => `<div class="lobrow"><input class="inp" aria-label="Line of business" data-lob="${bi}:${li}" value="${esc(l)}" ${dis}>${closed ? "" : `<button class="x" data-dact="rmlob" data-b="${bi}" data-l="${li}" aria-label="Remove ${esc(l)}">${IC.x}</button>`}</div>`).join("")}
      ${closed ? "" : `<button class="addlob" data-dact="addlob" data-b="${bi}">+ Add line of business</button>`}</div>`).join("")}
      ${closed ? "" : `<button class="addbrand" data-dact="addbrand">${PLUS}Add brand</button>`}</div></div>`;
}
const tplRows = () => {
  const q = S.tplQuery.trim().toLowerCase();
  return TPLS.filter((t) => (S.tplLob === "all" || (S.tplLob === "un" ? !t.lob : t.lob === S.tplLob)) && (S.tplFilter === "all" || (S.tplFilter === "check" && t.c === "m") || (S.tplFilter === "hi" && t.c === "h")) && (!q || (t.name + t.text + t.id).toLowerCase().includes(q)));
};
function tplBody(closed) {
  const dis = closed ? "disabled" : "";
  const rows = tplRows();
  const pages = Math.max(1, Math.ceil(rows.length / PER)); S.tplPage = Math.min(S.tplPage, pages - 1);
  const shown = rows.slice(S.tplPage * PER, S.tplPage * PER + PER);
  const allSel = shown.length && shown.every((t) => S.tplSel.has(t.id));
  const lobTotal = S.tplLob === "all" ? 100 : S.tplLob === "un" ? 2 : (TPL_LOBS.find((l) => l.lob === S.tplLob)?.n ?? rows.length);
  return `<div class="banner">${IC.info}<span>A mapping change is only saved when you send it for approval. Templates without a line of business don't hold up migration.</span></div>
    <div class="panel"><div class="tstats"><div class="ring"><span>98%</span></div><div class="tm"><div><b>100</b><span>Templates scanned</span></div><div><b>98</b><span><i style="background:var(--blue)"></i>Suggested</span></div><div><b>2</b><span><i style="background:rgba(11,18,32,.25)"></i>Unmapped</span></div></div></div></div>
    <div class="tsplit"><aside class="lobl"><h5><span>Lines of business</span><span>${TPL_LOBS.length}</span></h5>
      <button class="lobb${S.tplLob === "all" ? " on" : ""}" data-dact="tl" data-l="all">All templates<i>100</i></button>
      ${TPL_LOBS.map((l) => `<button class="lobb${S.tplLob === l.lob ? " on" : ""}" data-dact="tl" data-l="${esc(l.lob)}">${esc(l.lob)}<i>${l.n}</i></button>`).join("")}
      <button class="lobb${S.tplLob === "un" ? " on" : ""}" data-dact="tl" data-l="un">Unmapped<i>2</i></button></aside>
    <div class="panel"><div class="panel-h"><b>${S.tplLob === "all" ? "All templates" : S.tplLob === "un" ? "Unmapped" : esc(S.tplLob)}</b><span>Showing ${shown.length} of ${lobTotal} (sample)</span><div class="r filters">${[["all", "All"], ["hi", "High confidence"], ["check", "To check"]].map(([v, l]) => `<button class="fchip${S.tplFilter === v ? " on" : ""}" data-dact="tf" data-f="${v}">${l}</button>`).join("")}</div></div>
      <div class="tools"><label class="srch">${SRCH}<input data-keep="tq" data-dq="tpl" aria-label="Search templates" placeholder="Search templates" value="${esc(S.tplQuery)}"></label></div>
      ${S.tplSel.size && !closed ? `<div class="bulk"><b>${S.tplSel.size} selected</b><span>Assign a line of business to all of them</span><div class="r"><select class="sel" data-bulk="1" aria-label="Line of business for selected" style="height:32px;min-width:170px"><option value="">Choose…</option>${TPL_LOBS.map((l) => `<option>${esc(l.lob)}</option>`).join("")}</select><button class="btn" data-dact="tclear">Clear</button></div></div>` : ""}
      <div class="thead"><span>${cbx('data-tall="1"', allSel, dis, "Select page")}</span><span></span><span>Template</span><span>Message</span><span>Line of business</span><span>Confidence</span></div>
      ${shown.map((t) => { const j = TPLS.indexOf(t); return `<div class="trow${S.tplSel.has(t.id) ? " selrow" : ""}"><span>${cbx(`data-ts="${t.id}"`, S.tplSel.has(t.id), dis, "Select " + t.name)}</span><span class="grip" aria-hidden="true"></span><span><b>${esc(t.name)}</b><span class="mono" style="color:var(--faint)">${t.id}</span></span><div class="tpl-text" title="${esc(t.text)}">${esc(t.text)}</div>
        <select class="sel" data-tl="${j}" aria-label="Line of business" ${dis}><option value="">Not mapped</option>${TPL_LOBS.map((l) => `<option ${l.lob === t.lob ? "selected" : ""}>${esc(l.lob)}</option>`).join("")}</select>
        <span><span class="conf ${t.lob !== t.lob0 ? "m" : t.c}">${t.lob !== t.lob0 ? "Changed" : t.c === "h" ? "High" : t.c === "m" ? "Check" : "Unmapped"}</span></span></div>`; }).join("") || `<div class="empty">No templates match.</div>`}
      <div class="pager"><span>Page ${S.tplPage + 1} of ${pages}</span><div class="r"><button class="pg" data-dact="tpg" data-d="-1" ${S.tplPage === 0 ? "disabled" : ""} aria-label="Previous page">‹</button>${Array.from({ length: pages }, (_, k) => `<button class="pg${k === S.tplPage ? " on" : ""}" data-dact="tpg" data-p="${k}">${k + 1}</button>`).join("")}<button class="pg" data-dact="tpg" data-d="1" ${S.tplPage >= pages - 1 ? "disabled" : ""} aria-label="Next page">›</button></div></div></div></div>`;
}
function deepBody(k, closed) {
  const dis = closed ? "disabled" : "";
  if (k === "profile") {
    return {
      main: `<div class="banner">${IC.info}<span>${closed ? "Submitted for approval. Fields are read-only while it's checked." : "Every field was filled from a public record. The tag shows where each one came from. Change anything that's wrong."}</span></div>
        <div class="panel"><div class="panel-h"><b>Business details</b><span>10 of 10 filled</span></div>
        <div class="logo-slot"><div class="ls">HDFC</div><div><b>Enterprise logo</b><p>Found on your website. You can replace it later in settings.</p></div></div>
        <div class="fgrid">${PROFILE.map((f) => `<div class="field${f.wide ? " wide" : ""}"><label for="pf-${f.k}">${esc(f.label)}<span class="src-tag">${esc(f.src)}</span></label><input class="inp" id="pf-${f.k}" data-pf="${f.k}" value="${esc(f.v)}" ${dis}></div>`).join("")}</div></div>
        <label class="check" style="background:#fff;border:1px solid var(--line)"><input type="checkbox" id="pAuthDeep" data-dact="pauth" ${S.profileAuth ? "checked" : ""} ${dis}>I'm authorised to submit these details for HDFC Bank Limited.</label>`,
      action: `<button class="btn btn-p" data-dact="accept" ${S.profileAuth ? "" : "disabled"}>Submit for approval</button>`,
      msg: "Submitting sends the profile to telecom operators for approval.",
    };
  }
  if (k === "team") {
    const n = PEOPLE.filter((p) => p.on).length;
    return { main: teamBody(closed), action: `<button class="btn btn-t" data-dact="later">Do it later</button><button class="btn btn-p" data-dact="accept" ${n ? "" : "disabled"}>Send ${n} invites</button>`, msg: "Invites go out by email. You can add more people later." };
  }
  if (k === "gtm") {
    const sel = selPartners();
    return S.gtmStep === "select"
      ? { main: gtmBody(closed), action: `<button class="btn btn-p" data-dact="gnext" ${sel.length ? "" : "disabled"}>Continue to allocation</button>`, msg: "The agent chose these for the lowest rates. You can change the choice." }
      : { main: gtmBody(closed), action: `<button class="btn" data-dact="gback">Back</button><button class="btn btn-p" data-dact="accept" ${S.gtmTerms && allocOk() ? "" : "disabled"}>Confirm partners</button>`, msg: allocOk() ? "" : "Each phase must total 100%." };
  }
  if (k === "brands") return { main: brandsBody(closed), action: `<button class="btn btn-p" data-dact="accept">${brandsChanged() ? "Send for review" : "Confirm brands"}</button>`, msg: "" };
  const ch = TPLS.some((t) => t.lob !== t.lob0);
  return { main: tplBody(closed), action: `<button class="btn btn-p" data-dact="accept">${ch ? "Send for review" : "Confirm mapping"}</button>`, msg: "" };
}
const toneC = (t) => ({ violet: "#2563eb", red: "#60a5fa", teal: "#1e3a8a", amber: "#7aa7f7" }[t]);
deep.addEventListener("click", (e) => {
  const a = e.target.closest("[data-dact]"); if (!a) return;
  const act = a.dataset.dact;
  if (act === "close") return closeDeep();
  if (act === "accept") { const i = deepI; S.dirty = false; return closeDeep(() => decide(i, "accept")); }
  if (act === "later") { const i = deepI; S.dirty = false; return closeDeep(() => decide(i, "later")); }
  if (act === "rmlob") { S.dirty = true; BRANDS[+a.dataset.b].lobs.splice(+a.dataset.l, 1); return rerenderDeep(); }
  if (act === "addlob") { S.dirty = true; BRANDS[+a.dataset.b].lobs.push("New line of business"); rerenderDeep(); const ins = $$(`[data-lob^="${a.dataset.b}:"]`, deep); const last = ins[ins.length - 1]; if (last) { last.focus(); last.select(); } return; }
  if (act === "addbrand") { S.dirty = true; BRANDS.push({ name: "New brand", hdr: "NEWBRD", lobs: ["New line of business"] }); rerenderDeep(); const b = $$(".bname", deep).pop(); if (b) { b.focus(); b.select(); b.closest(".bcard")?.scrollIntoView({ behavior: "smooth", block: "nearest" }); } return; }
  if (act === "tf") { S.tplFilter = a.dataset.f; S.tplPage = 0; return rerenderDeep(); }
  if (act === "tl") { S.tplLob = a.dataset.l; S.tplPage = 0; return rerenderDeep(); }
  if (act === "tpg") { S.tplPage = a.dataset.p != null ? +a.dataset.p : S.tplPage + +a.dataset.d; return rerenderDeep(); }
  if (act === "tclear") { S.tplSel.clear(); return rerenderDeep(); }
  if (act === "tt") { S.teamTab = a.dataset.t; return rerenderDeep(); }
  if (act === "auOpen") { S.addUser = true; rerenderDeep(); const f = $("#auName", deep); if (f) f.focus(); return; }
  if (act === "auCancel") { S.addUser = false; return rerenderDeep(); }
  if (act === "auSave") {
    const name = $("#auName", deep).value.trim(), mail = $("#auMail", deep).value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(mail)) { toast("Enter a name and a work email"); return; }
    const ini = name.split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase();
    PEOPLE.push({ i: ini, name, email: mail, role: $("#auRole", deep).value, title: "New user", dept: $("#auDept", deep).value, on: true, t: PEOPLE.length % 4, mobile: "-" });
    S.addUser = false; S.dirty = true; toast(`${name} added`); return rerenderDeep();
  }
  if (act === "rmp") { S.dirty = true; PEOPLE.splice(+a.dataset.j, 1); return rerenderDeep(); }
  if (act === "gnext") { allocInit(); S.gtmStep = "alloc"; const c = $(".deep-content", deep); if (c) c.scrollTop = 0; return rerenderDeep(); }
  if (act === "gback") { S.gtmStep = "select"; return rerenderDeep(); }
  if (act === "gclear") { S.dirty = true; PARTNERS.forEach((p) => (p.picked = false)); return rerenderDeep(); }
});
deep.addEventListener("change", (e) => {
  const t = e.target; S.dirty = true;
  if (t.dataset.dact === "pauth") { S.profileAuth = t.checked; rerenderDeep(); }
  if (t.dataset.dact === "gterms") { S.gtmTerms = t.checked; rerenderDeep(); }
  if (t.dataset.dact === "asame") { S.allocSame = t.checked; if (t.checked) selPartners().forEach((p) => PHASES.forEach((ph) => (S.allocMap[p.id][ph.k] = S.allocMap[p.id].mig))); rerenderDeep(); }
  if (t.dataset.pall) { const q = S.teamQuery.trim().toLowerCase(); PEOPLE.forEach((p) => { if (!q || [p.name, p.email, p.role, p.dept, p.title].join(" ").toLowerCase().includes(q)) p.on = t.checked; }); rerenderDeep(); }
  if (t.dataset.pp != null) { PEOPLE[+t.dataset.pp].on = t.checked; rerenderDeep(); }
  if (t.dataset.pr != null) { PEOPLE[+t.dataset.pr].role = t.value; rerenderDeep(); }
  if (t.dataset.pd != null) PEOPLE[+t.dataset.pd].dept = t.value;
  if (t.dataset.gp != null) { PARTNERS[+t.dataset.gp].picked = t.checked; S.gtmTerms = false; rerenderDeep(); }
  if (t.dataset.am) {
    const [pid, ph] = t.dataset.am.split(":"), v = Math.max(0, Math.min(100, Math.round(+t.value || 0)));
    if (S.allocSame) PHASES.forEach((x) => (S.allocMap[pid][x.k] = v)); else S.allocMap[pid][ph] = v;
    rerenderDeep();
  }
  if (t.dataset.tl != null) { TPLS[+t.dataset.tl].lob = t.value; rerenderDeep(); }
  if (t.dataset.ts) { if (t.checked) S.tplSel.add(t.dataset.ts); else S.tplSel.delete(t.dataset.ts); rerenderDeep(); }
  if (t.dataset.tall) { const ids = tplRows().slice(S.tplPage * PER, S.tplPage * PER + PER).map((x) => x.id); ids.forEach((id) => { if (t.checked) S.tplSel.add(id); else S.tplSel.delete(id); }); rerenderDeep(); }
  if (t.dataset.bulk && t.value) { TPLS.forEach((x) => { if (S.tplSel.has(x.id)) x.lob = t.value; }); toast(`${S.tplSel.size} templates mapped to ${t.value}`); S.tplSel.clear(); rerenderDeep(); }
  if (t.dataset.lob != null) { const [b, l] = t.dataset.lob.split(":").map(Number); BRANDS[b].lobs[l] = t.value.trim() || BRANDS[b].lobs[l]; rerenderDeep(); }
  if (t.dataset.bn != null) { BRANDS[+t.dataset.bn].name = t.value.trim() || BRANDS[+t.dataset.bn].name; rerenderDeep(); }
});
deep.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset.dq) { S[{ team: "teamQuery", gtm: "gtmQuery", tpl: "tplQuery" }[t.dataset.dq]] = t.value; if (t.dataset.dq === "tpl") S.tplPage = 0; rerenderDeep(); return; }
  S.dirty = true;
  if (t.dataset.pf) { PROFILE.find((x) => x.k === t.dataset.pf).v = t.value; t.classList.add("edited"); }
});
function rerenderDeep() {
  const sc = $(".deep-content", deep)?.scrollTop || 0;
  const ae = document.activeElement, keep = ae && ae.dataset ? ae.dataset.keep : null, pos = ae ? ae.selectionStart : null;
  renderDeep();
  const c = $(".deep-content", deep); if (c) c.scrollTop = sc;
  if (keep) { const el = $(`[data-keep="${keep}"]`, deep); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (er) { /* ignore */ } } }
}
addEventListener("keydown", (e) => { if (e.key === "Escape" && !deep.hidden) closeDeep(); });
