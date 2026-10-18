import re
def _unwrap(t):
    k = '</head><body>\n<!doctype html>'
    if t.startswith('<!doctype html><html><head><meta charset=utf8>') and k in t:
        t = t[t.index(k)+len('</head><body>\n'):]
        t = t[:t.rindex('</html>')+len('</html>')] + '\n'
    return t
s = _unwrap(open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-cards.html').read())
def rep(old, new):
    global s
    assert s.count(old) == 1, 'count %d: %s' % (s.count(old), old[:80])
    s = s.replace(old, new)

# 1. top band: gradient wash from the top with the agent, live telemetry, review summary + minimal stepper
rep("""function procCap(t) {
  let c = $("#pcap");
  if (!t) { if (c) { c.classList.remove("on"); setTimeout(() => c.remove(), 500); } return; }
  if (!c) { document.body.insertAdjacentHTML("beforeend", '<div class="pcap" id="pcap"><i></i><span></span></div>'); c = $("#pcap"); void c.offsetWidth; c.classList.add("on"); }
  $("span", c).textContent = t;
}""", r"""const TB_ACT = {
  profile: "Check the details, tick the authorisation and submit for approval",
  team: "Choose who to invite and send the invites",
  gtm: "Check the partner choice and volume split, then confirm",
  brands: "Check the brands and lines of business, then confirm",
  templates: "Check the template mapping, then confirm",
};
function tband() {
  let c = $("#tband");
  if (!c) {
    document.body.insertAdjacentHTML("beforeend", `<div class="tband" id="tband"><div class="tb-wash"><i class="w1"></i><i class="w2"></i><i class="w3"></i></div>
      <div class="tb-in"><div class="tb-row"><span class="tb-ic"><i class="tb-r r1"></i><i class="tb-r r2"></i>${AI_MARK}</span>
        <div class="tb-tx"><span class="tb-k"></span><span class="tb-t" id="atTele"></span></div></div>
        <div class="tb-two"><div><b>What the agent did</b><span id="tbDid"></span></div><div class="act"><b>Action needed</b><span id="tbAct"></span></div></div>
        <nav class="tb-steps" id="tbSteps">${STEPS.map((s, i) => `<button type="button" data-i="${i}"><i></i><span>${esc(s.title)}</span></button>`).join("")}</nav></div></div>`);
    c = $("#tband");
    $("#tbSteps").addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b && S.phase === "review" && !(S.cards[+b.dataset.i].st === "review" && isLocked(+b.dataset.i))) focusCard(+b.dataset.i); });
  }
  return c;
}
function setAtTele(txt) {
  const el = $("#atTele"); if (!el || el.dataset.v === txt) return; el.dataset.v = txt;
  el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); el.textContent = txt;
}
let tbSig = "";
function tbSync() {
  const c = tband(), ph = S.phase, on = ph === "analyse" || ph === "review";
  c.classList.toggle("on", on);
  document.body.classList.toggle("has-tband", on);
  if (!on) { tbSig = ""; return; }
  const i = Math.max(0, Math.min(4, S.active)), s = STEPS[i], cd = S.cards[i], rev = ph === "review";
  const locked = rev && cd.st === "review" && isLocked(i), filling = rev && s.key === "profile" && cd.st === "review" && !S.profileFilled;
  const did = rev ? (locked ? (LOCK_COPY[i] ? LOCK_COPY[i][0] + "." : "Locked for now") : s.result) : "";
  const act = rev ? (locked ? "Finish the earlier steps first" : filling ? "Wait while the agent fills in your details" : cd.st === "done" ? "Nothing more to do here" : (TB_ACT[s.key] || "")) : "";
  const sig = [ph, i, cd.st, locked, filling, S.cards.map((x) => x.st).join()].join("|");
  if (sig === tbSig) return; tbSig = sig;
  c.classList.toggle("rev", rev);
  $(".tb-k", c).textContent = `Step ${i + 1} of 5 · ${s.title}`;
  if (rev) setAtTele(filling ? "Typing in what I found on DLT, GSTIN, MCA and your website" : locked ? "Locked for now" : cd.st === "done" ? "Reviewed" : "Your review");
  $("#tbDid").textContent = did; $("#tbAct").textContent = act;
  $$("#tbSteps button").forEach((b, k) => { const x = S.cards[k], lk = rev && x.st === "review" && isLocked(k);
    b.className = (k === i ? "cur " : "") + (x.st === "done" ? "done " : "") + (x.st === "analysing" ? "work " : "") + (lk || (!rev && x.st === "queued") ? "lock " : ""); });
}
setInterval(tbSync, 350);
function procCap() { tbSync(); }
/* telemetry of the card being worked on is mirrored into the top band */
new MutationObserver(() => {
  if (S.phase !== "analyse") return;
  const el = $(".card.is-analysing .tele"); if (el && el.textContent.trim()) setAtTele(el.textContent.trim());
}).observe(document.body, { childList: true, subtree: true, characterData: true });""")

# 3. no step list on the Start panel (comment request)
_n = len(re.findall(r'\n\s*<ul class="rdl-l">\$\{STEPS\.map\(\(s\) => `<li><span>\$\{IC\[s\.key\]\}</span><b>\$\{esc\(s\.title\)\}</b><em>\$\{esc\(PRE\[s\.key\] \|\| ""\)\}</em></li>`\)\.join\(""\)\}</ul>', s))
assert _n == 1, _n
s = re.sub(r'\n\s*<ul class="rdl-l">\$\{STEPS\.map\(\(s\) => `<li><span>\$\{IC\[s\.key\]\}</span><b>\$\{esc\(s\.title\)\}</b><em>\$\{esc\(PRE\[s\.key\] \|\| ""\)\}</em></li>`\)\.join\(""\)\}</ul>', '', s)

# 2. CSS: dark glass cards (reference), top agent card
css = r'''
/* ---- blue variant: dark navy glass cards, agent card on top while processing ---- */
.cardf, .cardf.s-queued, .cardf.s-locked, .cardf.s-done{
  background:radial-gradient(120% 85% at 90% 108%,rgba(70,120,255,.95) 0,rgba(78,64,226,.62) 30%,rgba(40,30,140,.0) 64%),radial-gradient(90% 60% at 8% 0%,rgba(60,90,190,.28),transparent 70%),linear-gradient(165deg,#0b1020 0%,#101838 58%,#0a0f22 100%);
  box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 30px 60px -28px rgba(8,14,50,.7); }
.cardf::before{ background:radial-gradient(70% 50% at 18% 0%,rgba(255,255,255,.10),transparent 70%)!important; }
.cardf.s-locked{ filter:saturate(.55) brightness(.95); }
.cf-ic{ width:64px; height:64px; border-radius:50%; background:radial-gradient(circle at 34% 24%,#8cc0ff 0,#3f86f7 46%,#2154d8 100%); box-shadow:0 10px 22px -6px rgba(36,92,230,.75),0 0 0 1px rgba(255,255,255,.25) inset; color:#0a1a52; }
.cf-ic svg{ width:30px; height:30px; }
.cf-no{ color:#aeb7d4; opacity:1; }
.cf-mid h3{ color:#fff; font-size:30px; }
.cf-res{ color:#aeb7d4!important; opacity:1!important; font-size:15px; line-height:1.4; }
.cf-st{ background:rgba(255,255,255,.07)!important; box-shadow:0 0 0 1px rgba(255,255,255,.2) inset!important; color:#e8edff; }
.cf-bot{ color:#9aa5c8; }
.cf-v b{ color:#fff; } .cf-v em{ color:#aeb7d4; opacity:1; }
.tele{ display:none!important; }
.tband{ position:fixed; left:0; right:0; top:0; z-index:44; pointer-events:none; opacity:0; transition:opacity .7s var(--ease); }
.tband.on{ opacity:1; }
.tb-wash{ position:absolute; left:0; right:0; top:0; height:230px; overflow:hidden; -webkit-mask-image:linear-gradient(180deg,#000 0,#000 40%,transparent 100%); mask-image:linear-gradient(180deg,#000 0,#000 40%,transparent 100%); }
.tb-wash::before{ content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(37,99,235,.30) 0,rgba(96,165,250,.14) 48%,transparent 100%); }
.tb-wash i{ position:absolute; top:-120px; width:520px; height:300px; border-radius:50%; filter:blur(46px); opacity:.55; animation:tbdrift 11s ease-in-out infinite alternate; }
.tb-wash .w1{ left:8%; background:radial-gradient(closest-side,rgba(37,99,235,.75),transparent); }
.tb-wash .w2{ left:38%; background:radial-gradient(closest-side,rgba(110,170,255,.7),transparent); animation-delay:-4s; }
.tb-wash .w3{ left:64%; background:radial-gradient(closest-side,rgba(98,70,230,.55),transparent); animation-delay:-8s; }
@keyframes tbdrift{ from{ transform:translateX(-60px) scale(.9); } to{ transform:translateX(80px) scale(1.15); } }
.tb-in{ position:relative; padding:16px 120px 0 120px; display:flex; flex-direction:column; align-items:center; gap:10px; }
.tb-row{ display:flex; align-items:center; gap:14px; max-width:100%; }
.tb-ic{ position:relative; flex:none; width:42px; height:42px; border-radius:50%; display:grid; place-items:center; background:radial-gradient(circle at 34% 24%,#8cc0ff 0,#3f86f7 46%,#2154d8 100%); box-shadow:0 10px 22px -8px rgba(36,92,230,.8),0 0 0 1px rgba(255,255,255,.55) inset; }
.tb-ic .ai-mark{ width:22px; height:22px; position:relative; z-index:1; animation:atspin 6s linear infinite; }
@keyframes atspin{ to{ transform:rotate(360deg); } }
.tb-r{ position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(70,130,255,.5); animation:atring 2.4s ease-out infinite; } .tb-r.r2{ animation-delay:1.2s; }
@keyframes atring{ from{ transform:scale(1); opacity:.9; } to{ transform:scale(2.2); opacity:0; } }
.tb-tx{ display:flex; flex-direction:column; gap:4px; min-width:0; }
.tb-k{ font:600 10.5px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:#2f63ff; white-space:nowrap; }
.tb-t{ font-size:17px; font-weight:560; letter-spacing:-.012em; line-height:1.25; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60vw; background:linear-gradient(90deg,#0f1f3d 0 36%,#2563eb 50%,#0f1f3d 64% 100%); background-size:250% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; animation:shimmer 1.8s linear infinite; }
.tb-t.swap{ animation:swapIn .45s var(--ease),shimmer 1.8s linear infinite; }
.tband.rev .tb-t{ animation:none; background:none; color:var(--ink); -webkit-text-fill-color:currentColor; }
@media (min-height:761px){ .tband.rev .tb-t{ display:none; } .tband.rev .tb-ic{ width:30px; height:30px; } .tband.rev .tb-ic .ai-mark{ width:16px; height:16px; } .tband.rev .tb-in{ gap:8px; padding-top:12px; } .tband.rev .tb-two{ max-width:min(1040px,100%); gap:44px; } .tband.rev .tb-two span{ font-size:13.5px; } }
.tb-two{ display:none; gap:34px; max-width:min(860px,100%); }
.tband.rev .tb-two{ display:flex; }
.tb-two > div{ display:flex; flex-direction:column; gap:4px; min-width:0; flex:1; }
.tb-two b{ font:600 10.5px/1 var(--mono); letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
.tb-two .act b{ color:#2f63ff; }
.tb-two span{ font-size:14px; line-height:1.4; color:var(--ink-2); }
.tb-steps{ display:flex; align-items:center; gap:6px; pointer-events:auto; margin-top:2px; }
.tb-steps button{ border:0; background:none; display:flex; align-items:center; gap:7px; height:26px; padding:0 10px 0 8px; border-radius:99px; font:600 11.5px/1 var(--font); color:#6d7fa3; cursor:pointer; transition:background .25s,color .25s; }
.tb-steps button i{ width:7px; height:7px; border-radius:50%; background:#b7c6e6; transition:background .3s,transform .3s; }
.tb-steps button.cur{ background:rgba(255,255,255,.72); color:var(--ink); box-shadow:0 0 0 1px rgba(160,185,235,.7) inset; } .tb-steps button.cur i{ background:#2563eb; transform:scale(1.25); }
.tb-steps button.done i{ background:#16a34a; } .tb-steps button.work i{ background:#2563eb; animation:beam 1.2s ease-in-out infinite; }
.tb-steps button.lock{ color:#a3b1cc; cursor:default; }
.tb-steps button:not(:last-child)::after{ content:""; width:14px; height:1px; margin-left:3px; background:rgba(120,150,210,.4); }
.rail3c{ display:none!important; }
body.has-tband .deck-head{ visibility:hidden; }
@media (max-height:760px){ .tb-two{ display:none!important; } .tband.rev .tb-t{ font-size:15px; } .tb-wash{ height:160px; } .tb-in{ padding-top:10px; } }
@media (max-width:1000px){ .tb-in{ padding-left:96px; padding-right:24px; } .tb-steps button span{ display:none; } .tb-steps button.cur span{ display:inline; } }
'''
i = s.index('</style>', s.index('<html lang'))
s = s[:i] + css + s[i:]
s = s.replace('<title>DigiConsent Agent Deck 3D Glass Rail Cards</title>', '<title>DigiConsent Agent Deck 3D Glass Rail Blue</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-blue.html', 'w').write(s)
print('ok', len(s))
