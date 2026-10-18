import re
def _unwrap(t):
    k = '</head><body>\n<!doctype html>'
    if t.startswith('<!doctype html><html><head><meta charset=utf8>') and k in t:
        t = t[t.index(k)+len('</head><body>\n'):]
        t = t[:t.rindex('</html>')+len('</html>')] + '\n'
    return t
s = _unwrap(open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-blue.html').read())

# 1. hero band: the agent talks to the user; pills show each step; the screen edge glows while it works
a = s.index('function tband() {'); b = s.index('function setAtTele(txt)')
s = s[:a] + r'''function tband() {
  let c = $("#tband");
  if (!c) {
    document.body.insertAdjacentHTML("beforeend", `<div class="tband" id="tband"><div class="hero-bg"></div><div class="hero-in">
      <span class="h-hi" id="hHi"></span><h2 class="h-t" id="hTitle"></h2><p class="h-s" id="atTele"></p>
      <nav class="h-steps" id="tbSteps">${STEPS.map((s, i) => `<button type="button" data-i="${i}"><i class="si"><b class="ck">${IC.check}</b></i><span>${esc(s.title)}</span></button>`).join("")}</nav></div></div><div class="edge" id="edge"></div>`);
    c = $("#tband");
    $("#tbSteps").addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b && S.phase === "review" && !(S.cards[+b.dataset.i].st === "review" && isLocked(+b.dataset.i))) focusCard(+b.dataset.i); });
  }
  return c;
}
''' + s[b:]
a = s.index('let tbSig = "";'); b = s.index('setInterval(tbSync, 350);')
s = s[:a] + r'''let tbSig = "";
function heroSet(id, txt) {
  const el = $(id); if (!el || el.dataset.v === txt) return; el.dataset.v = txt;
  el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); el.textContent = txt;
}
function tbSync() {
  const c = tband(), ph = S.phase, on = ph === "analyse" || ph === "review";
  c.classList.toggle("on", on);
  document.body.classList.toggle("has-tband", on);
  if (!on) { tbSig = ""; document.body.classList.remove("agent-on"); return; }
  const i = Math.max(0, Math.min(4, S.active)), s = STEPS[i], cd = S.cards[i], rev = ph === "review";
  const locked = rev && cd.st === "review" && isLocked(i), filling = rev && s.key === "profile" && cd.st === "review" && !S.profileFilled;
  const readyNow = !rev && cd.st === "ready";
  const working = (!rev && !readyNow) || filling;
  document.body.classList.toggle("agent-on", working);
  const sig = [ph, i, cd.st, locked, filling, S.cards.map((x) => x.st).join()].join("|");
  if (sig === tbSig) return; tbSig = sig;
  if (readyNow || (rev && cd.st === "done")) { const e = $("#edge"); e.classList.remove("flash"); void e.offsetWidth; e.classList.add("flash"); }
  let hi, ti, su;
  if (!rev) {
    if (readyNow) { hi = "Done"; ti = `${s.title} is ready`; su = s.result; }
    else { hi = "Hi! I'm your onboarding agent."; ti = `Working on your ${s.title.toLowerCase()}`; su = ($(".card.is-analysing .tele") || {}).textContent || "Reading your trusted sources"; }
  } else if (locked) { hi = "Coming up"; ti = s.title; su = LOCK_COPY[i] ? LOCK_COPY[i][0] + "." : "Finish the earlier steps first."; }
  else if (filling) { hi = "Hold on"; ti = "I'm filling in your business profile"; su = "Typing in what I found on DLT, GSTIN, MCA and your website"; }
  else if (cd.st === "done") { hi = "All set"; ti = `${s.title} is done`; su = "Nothing more to do here."; }
  else { hi = "Your turn"; ti = `Please review your ${s.title.toLowerCase()}`; su = `${s.result}. ${TB_ACT[s.key] || ""}.`; }
  heroSet("#hHi", hi); heroSet("#hTitle", ti); setAtTele(su.trim());
  $$("#tbSteps button").forEach((b, k) => { const x = S.cards[k], lk = rev && x.st === "review" && isLocked(k);
    b.className = (k === i ? "cur " : "") + ((x.st === "done" || x.st === "ready") ? "done " : "") + (x.st === "analysing" ? "work " : "") + (lk || (!rev && x.st === "queued") ? "lock " : ""); });
}
''' + s[b:]

css = r'''
/* ---- agent variant: dark hero at the top where the agent talks to the user, step pills, glowing screen edge ---- */
.tband{ left:0!important; top:0!important; width:100%!important; transform:none!important; z-index:35!important; }
.tband.on{ transform:none!important; }
.hero-bg{ position:absolute; left:0; right:0; top:0; height:196px; -webkit-mask-image:linear-gradient(180deg,#000 0,#000 74%,transparent 100%); mask-image:linear-gradient(180deg,#000 0,#000 74%,transparent 100%);
  background:radial-gradient(70% 90% at 78% 100%,rgba(96,120,255,.55),transparent 70%),radial-gradient(50% 70% at 18% 105%,rgba(120,90,255,.35),transparent 70%),linear-gradient(180deg,#060a1a 0%,#0b1432 52%,#17296d 100%); }
.hero-bg::after{ content:""; position:absolute; inset:0; background-image:radial-gradient(rgba(190,205,255,.22) 1px,transparent 1.2px); background-size:7px 7px; -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 80%); mask-image:linear-gradient(180deg,transparent 0,#000 80%); opacity:.55; }
.hero-in{ position:relative; padding:20px 120px 0 120px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0; }
.h-hi{ font-size:14px; font-weight:600; letter-spacing:-.003em; color:#8fa8ff; line-height:1.3; }
.h-t{ margin:3px 0 0; font-size:30px; line-height:1.15; font-weight:560; letter-spacing:-.025em; color:#fff; max-width:min(760px,70vw); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.h-s{ margin:6px 0 0; font-size:14.5px; line-height:1.35; color:#b4c1e8; max-width:min(820px,72vw); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.h-hi.swap,.h-t.swap,.h-s.swap{ animation:swapIn .5s var(--ease); }
.h-s{ background:linear-gradient(90deg,#b4c1e8 0 40%,#fff 50%,#b4c1e8 60% 100%); background-size:250% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; }
body.agent-on .h-s{ animation:shimmer 2s linear infinite; } body.agent-on .h-s.swap{ animation:swapIn .5s var(--ease),shimmer 2s linear infinite; }
body:not(.agent-on) .h-s{ background:none; color:#b4c1e8; -webkit-text-fill-color:currentColor; }
.h-steps{ display:flex; align-items:center; gap:8px; margin-top:14px; pointer-events:auto; }
.h-steps button{ border:0; display:flex; align-items:center; gap:8px; height:30px; padding:0 14px 0 9px; border-radius:99px; font:600 12.5px/1 var(--font); color:#aebbe6; background:rgba(120,140,255,.14); box-shadow:0 0 0 1px rgba(160,180,255,.22) inset; cursor:pointer; transition:background .3s,color .3s,box-shadow .3s,transform .3s; }
.h-steps .si{ position:relative; width:14px; height:14px; border-radius:50%; background:rgba(255,255,255,.22); display:grid; place-items:center; }
.h-steps .ck{ display:none; } .h-steps .ck svg{ width:9px; height:9px; }
.h-steps button.cur{ background:rgba(255,255,255,.95); color:#0b1432; box-shadow:0 8px 20px -8px rgba(90,130,255,.9); }
.h-steps button.cur .si{ background:#3f6ef6; }
.h-steps button.work .si{ background:none; border:2px solid #fff; border-right-color:transparent; animation:spin .8s linear infinite; width:13px; height:13px; }
.h-steps button.cur.work .si{ border-color:#3f6ef6; border-right-color:transparent; }
.h-steps button.done .si{ background:#3ddc84; } .h-steps button.done .ck{ display:block; color:#06250f; }
.h-steps button.lock{ cursor:default; opacity:.6; }
.edge{ position:fixed; inset:0; z-index:43; pointer-events:none; opacity:0; transition:opacity .9s var(--ease); }
body.agent-on .edge{ opacity:1; }
.edge::before{ content:""; position:absolute; inset:0; padding:3px; background:conic-gradient(from var(--ang),transparent 0 48%,rgba(70,130,255,.0) 52%,#6aa4ff 70%,#8b6bff 85%,transparent 100%); -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude; animation:rot 3.6s linear infinite; filter:drop-shadow(0 0 10px rgba(90,150,255,.85)); }
.edge::after{ content:""; position:absolute; inset:0; box-shadow:inset 0 0 70px rgba(60,110,255,.20),inset 0 0 0 1px rgba(120,160,255,.25); }
.edge.flash::after{ animation:edgeflash 1.3s var(--ease); }
@keyframes edgeflash{ 0%{ box-shadow:inset 0 0 0 rgba(61,220,132,0); } 25%{ box-shadow:inset 0 0 120px rgba(61,220,132,.38),inset 0 0 0 3px rgba(61,220,132,.8); } 100%{ box-shadow:inset 0 0 70px rgba(60,110,255,.0),inset 0 0 0 1px rgba(120,160,255,.0); } }
.edge.flash{ opacity:1; }
@media (max-height:760px){ .h-t{ font-size:23px; } .h-hi{ display:none; } .hero-in{ padding-top:14px; } .h-steps{ margin-top:8px; } .hero-bg{ height:150px; } .h-steps button{ height:26px; font-size:11.5px; } }
@media (max-width:1000px){ .hero-in{ padding-left:100px; padding-right:24px; } .h-steps button span{ display:none; } .h-steps button.cur span{ display:inline; } }
@media (prefers-reduced-motion:reduce){ .edge::before{ animation:none; } }
'''
i = s.index('</style>', s.index('<html lang'))
s = s[:i] + css + s[i:]
s = s.replace('<title>DigiConsent Agent Deck 3D Glass Rail Blue</title>', '<title>DigiConsent Agent Deck 3D Glass Rail Agent</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-agent.html', 'w').write(s)
print('ok', len(s))
