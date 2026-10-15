import re
src = open('/tmp/deck.html').read()
css = open('/tmp/bd/css.css').read().replace('.trow.sel{', '.trow.selrow{')
deepjs = open('/tmp/bd/deep.js').read()
logo = open('/tmp/logo.b64').read()

def rep(old, new, count=1):
    global src
    assert src.count(old) >= 1, 'missing: ' + old[:80]
    if count == 1:
        assert src.count(old) == 1, f'not unique ({src.count(old)}): ' + old[:80]
    src = src.replace(old, new)

# ---------- CSS ----------
rep('</style>\n</head>', css + '</style>\n</head>')

# ---------- Header (product wordmark, org, account, Log out) ----------
a = src.index('<header class="top">')
b = src.index('</header>', a) + len('</header>')
hdr = f'''<header class="hdr">
  <div class="hdr-l"><img class="hdr-logo" src="{logo}" alt="DigiConsent"><span class="hdr-org">HDFC Bank Limited · Onboarding</span></div>
  <div class="hdr-r">
    <div class="usr" title="Ravi Menon"><span class="usr-av" style="--p:0"><i>RM</i></span><span class="usr-meta"><strong>Ravi Menon</strong><span>Super Admin</span></span></div>
    <button class="logout" id="logoutBtn" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Log out</button>
  </div>
</header>
<div class="closes" id="closes" role="timer" aria-label="Migration window closes in"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg></span><span class="s"><em>Closes in</em><b id="closesT">30d 00h 00m</b></span></div>'''
src = src[:a] + hdr + src[b:]

# ---------- Locks ----------
rep('const [cls, html, mini] = map[c.st] || map.queued;',
    'const lockedNow = c.st === "review" && isLocked(i);\n  const [cls, html, mini] = lockedNow ? ["s-lock", `${IC.lock}Locked`, "Locked"] : (map[c.st] || map.queued);\n  el.classList.toggle("is-locked", lockedNow);')
rep('if (c.st === "ready" || c.st === "review") m = STEPS[i].mini;', 'if (c.st === "ready" || c.st === "review") m = lockedNow ? "Locked" : STEPS[i].mini;')
rep('function renderReview(i) {', 'function renderReview(i) {\n  renderReviewBase(i);\n  if (S.cards[i].st === "review" && isLocked(i)) { const pane = $("[data-review]", card(i)); if (pane) pane.insertAdjacentHTML("beforeend", lockFace(i)); }\n}\nfunction renderReviewBase(i) {')
rep('const lock = !brandsReady(), changed', 'const lock = false, changed')
rep('for (let k = 0; k < 5; k++) { const i = (from + k) % 5; if (S.cards[i].st === "review") return i; }',
    'for (let k = 0; k < 5; k++) { const i = (from + k) % 5; if (S.cards[i].st === "review" && !isLocked(i)) return i; }')
rep('function reviewHead() {\n  const s = STEPS[S.active], c = S.cards[S.active];',
    'function reviewHead() {\n  const s = STEPS[S.active], c = S.cards[S.active];\n  if (c.st === "review" && isLocked(S.active)) { head("Locked for now", "", s.title, LOCK_COPY[S.active][0] + ".", false); return; }')
rep('renderReview(i); setStatus(i); reviewHead();\n  setTimeout(() => ripple', 'renderReview(i); setStatus(i); refreshLocks(); reviewHead();\n  setTimeout(() => ripple')
rep('setTimeout(() => { c.st = "done"; renderReview(i); setStatus(i); renderReview(4); toast("Brands and LOBs approved. Templates are open."); maybeFinale(); }',
    'setTimeout(() => { c.st = "done"; renderReview(i); setStatus(i); refreshLocks(); toast("Brands and LOBs approved. Templates are open."); if (S.phase === "review" && deep.hidden) { const nx = firstOpen(); if (nx >= 0) focusCard(nx); } maybeFinale(); }')
rep('toast("Business profile approved by 4 of 4 telecom operators");',
    'toast("Business profile approved by 4 of 4 telecom operators");\n  refreshLocks(); setTimeout(() => { if (S.phase === "review" && deep.hidden) { const nx = firstOpen(); if (nx >= 0) focusCard(nx); } }, RM ? 0 : 1600);')
# allocation on the cards follows the user's split
rep('${n === 0 ? ALLOC[ph.k] : 100 - ALLOC[ph.k]}%', '${allocPct(p, ph.k, sel)}%')


# ---------- Order: profile, team, GTM partners, brands and LOBs, templates ----------
m = re.search(r'(  \{ key: "brands", loader: "brand".*?\},\n)(  \{ key: "gtm", loader: "gtm".*?\},\n)', src, re.S)
assert m, 'steps order'
src = src.replace(m.group(0), m.group(2) + m.group(1))
rep('const brandsReady = () => S.cards[2].st === "done";', 'const brandsReady = () => S.cards[3].st === "done";')
rep('if (a.dataset.act === "gterms") { S.gtmTerms = a.checked; renderReview(3); }', 'if (a.dataset.act === "gterms") { S.gtmTerms = a.checked; renderReview(2); }')

# ---------- Replace the old deep section ----------
a = src.index('/* ---------- Deep review page ---------- */', src.index('<script>\n(() =>'))
b = src.index('/* ---------- Toast ---------- */')
src = src[:a] + deepjs + '\n' + src[b:]

# ---------- Log out, closes-in ticker (appended before the boot section) ----------
extra = r'''
/* ---------- Log out and the closes-in pill ---------- */
const closeAt0 = Date.now() + 30 * 864e5 - 1000;
function tickCloses() {
  const t = Math.max(0, Math.floor((closeAt0 - Date.now()) / 1000)), p = (n) => String(n).padStart(2, "0");
  $("#closesT").textContent = `${Math.floor(t / 86400)}d ${p(Math.floor(t / 3600) % 24)}h ${p(Math.floor(t / 60) % 60)}m`;
}
tickCloses(); setInterval(tickCloses, 20000);
$("#logoutBtn").addEventListener("click", () => {
  const dirty = S.dirty && !deep.hidden;
  const bd = document.createElement("div"); bd.className = "dlg-bd";
  bd.innerHTML = `<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT"><h3 id="dlgT">Log out?</h3><p>${dirty ? "You have unsaved changes on this step. Log out anyway?" : "Your progress is saved. You will need to sign in again to continue setup."}</p><div class="row"><button class="btn" data-x="cancel">Cancel</button><button class="btn btn-p" data-x="ok">Log out</button></div></div>`;
  document.body.appendChild(bd); bd.querySelector('[data-x="ok"]').focus();
  const close = () => bd.remove();
  bd.addEventListener("click", (e) => {
    if (e.target === bd || e.target.dataset.x === "cancel") return close();
    if (e.target.dataset.x === "ok") {
      close(); S.dirty = false;
      const so = document.createElement("div"); so.className = "signed";
      so.innerHTML = `<img src="${$(".hdr-logo").src}" alt="DigiConsent"><h2>You're logged out</h2><p>Your setup is saved. Sign in to carry on where you left off.</p><button class="btn btn-p" data-x="in">Sign in</button>`;
      document.body.appendChild(so); so.querySelector("button").focus();
      so.addEventListener("click", (ev) => { if (ev.target.dataset.x === "in") { so.remove(); toast("Welcome back, Ravi"); } });
    }
  });
  addEventListener("keydown", function esc1(ev) { if (ev.key === "Escape" && bd.isConnected) { close(); removeEventListener("keydown", esc1); } });
});
'''
rep('/* ---------- Boot ---------- */', extra + '\n/* ---------- Boot ---------- */')

# reset helper keeps the new state tidy
rep('if (!deep.hidden) { deep.hidden = true; deep.innerHTML = ""; }',
    'if (!deep.hidden) { deep.hidden = true; deep.innerHTML = ""; }\n  document.body.classList.remove("deep-open"); S.gtmStep = "select"; S.allocMap = {}; S.gtmTerms = false; S.tplSel = new Set(); S.dirty = false;')

rep('window.__deck = { jump, S, focusCard, openDeep };','window.__deck = { jump, S, focusCard, openDeep, refreshLocks, renderReview, setStatus, firstOpen };')
rep('async function typeInto(el, text, duration) {', 'async function typeIntoField(el, text, duration) {')
rep('await typeInto(inp, f.v,', 'await typeIntoField(inp, f.v,')
# title + copy
rep('<title>DigiConsent Agent Deck</title>', '<title>DigiConsent Agent Deck Enhanced</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-enhanced.html', 'w').write(src)
print('written', len(src))
