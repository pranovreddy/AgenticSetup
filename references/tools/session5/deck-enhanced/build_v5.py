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

# 1. top agent card replaces the pill: dark glass, disc, rings, live telemetry
rep('''function procCap(t) {
  let c = $("#pcap");
  if (!t) { if (c) { c.classList.remove("on"); setTimeout(() => c.remove(), 500); } return; }
  if (!c) { document.body.insertAdjacentHTML("beforeend", '<div class="pcap" id="pcap"><i></i><span></span></div>'); c = $("#pcap"); void c.offsetWidth; c.classList.add("on"); }
  $("span", c).textContent = t;
}''', r'''function agentTop() {
  let c = $("#agentTop");
  if (!c) {
    document.body.insertAdjacentHTML("beforeend", `<div class="atop" id="agentTop"><div class="at-glow"></div><span class="at-ic"><i class="at-r r1"></i><i class="at-r r2"></i>${AI_MARK}</span>
      <div class="at-tx"><span class="at-k"></span><span class="at-t" id="atTele"></span></div><div class="at-segs">${STEPS.map(() => "<i></i>").join("")}</div></div>`);
    c = $("#agentTop");
  }
  return c;
}
let atTok = 0;
function setAtTele(txt) {
  const el = $("#atTele"); if (!el || el.dataset.v === txt) return; el.dataset.v = txt;
  el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); el.textContent = txt;
}
function procCap(t) {
  const c = agentTop();
  if (!t) { c.classList.remove("on"); return; }
  const m = /step (\d) of 5 · (.+)$/.exec(t);
  $(".at-k", c).textContent = m ? `Step ${m[1]} of 5 · ${m[2]}` : "Onboarding agent";
  $$(".at-segs i", c).forEach((x, k) => { x.className = m ? (k < +m[1] - 1 ? "on" : k === +m[1] - 1 ? "cur" : "") : ""; });
  if (!c.classList.contains("on")) { void c.offsetWidth; c.classList.add("on"); }
  atTok++;
}
/* telemetry from the card being worked on is mirrored into the top agent card */
new MutationObserver(() => {
  if (S.phase !== "analyse") return;
  const el = $(".card.is-analysing .tele"); if (el && el.textContent.trim()) setAtTele(el.textContent.trim());
}).observe(document.body, { childList: true, subtree: true, characterData: true });''')

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
.atop{ position:fixed; left:50%; top:18px; z-index:46; width:min(540px,calc(100% - 200px)); min-height:78px; padding:14px 22px 14px 14px; display:flex; align-items:center; gap:16px; border-radius:26px; overflow:hidden; color:#fff;
  background:radial-gradient(120% 140% at 100% 120%,rgba(70,120,255,.8),rgba(78,64,226,.45) 34%,transparent 66%),linear-gradient(165deg,#0b1020,#111a3a 60%,#0a0f22); box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 24px 48px -22px rgba(8,14,50,.75);
  opacity:0; transform:translate(-50%,-14px) scale(.97); pointer-events:none; transition:opacity .6s var(--ease),transform .7s var(--ease); }
.atop.on{ opacity:1; transform:translate(-50%,0) scale(1); }
.at-glow{ position:absolute; inset:-40%; background:conic-gradient(from 0deg,transparent 0 55%,rgba(110,160,255,.28) 72%,transparent 90%); animation:spin 7s linear infinite; pointer-events:none; }
.at-ic{ position:relative; flex:none; width:54px; height:54px; border-radius:50%; display:grid; place-items:center; background:radial-gradient(circle at 34% 24%,#8cc0ff 0,#3f86f7 46%,#2154d8 100%); box-shadow:0 10px 22px -6px rgba(36,92,230,.8),0 0 0 1px rgba(255,255,255,.28) inset; }
.at-ic .ai-mark{ width:28px; height:28px; position:relative; z-index:1; animation:atspin 6s linear infinite; }
@keyframes atspin{ to{ transform:rotate(360deg); } }
.at-r{ position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(140,190,255,.55); animation:atring 2.4s ease-out infinite; } .at-r.r2{ animation-delay:1.2s; }
@keyframes atring{ from{ transform:scale(1); opacity:.9; } to{ transform:scale(2.1); opacity:0; } }
.at-tx{ position:relative; min-width:0; flex:1; display:flex; flex-direction:column; gap:5px; }
.at-k{ font:600 11px/1 var(--mono); letter-spacing:.12em; text-transform:uppercase; color:#8fb3ff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.at-t{ font-size:17px; font-weight:560; letter-spacing:-.01em; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; background:linear-gradient(90deg,#fff 0 38%,#9cc2ff 50%,#fff 62% 100%); background-size:250% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; animation:shimmer 1.8s linear infinite; }
.at-t.swap{ animation:swapIn .45s var(--ease),shimmer 1.8s linear infinite; }
.at-segs{ position:absolute; left:84px; right:22px; bottom:8px; display:flex; gap:4px; }
.at-segs i{ flex:1; height:2px; border-radius:2px; background:rgba(255,255,255,.14); position:relative; overflow:hidden; }
.at-segs i::after{ content:""; position:absolute; inset:0; background:linear-gradient(90deg,#6aa4ff,#a9c8ff); transform:scaleX(0); transform-origin:left; transition:transform .6s var(--ease); }
.at-segs i.on::after{ transform:scaleX(1); } .at-segs i.cur::after{ transform:scaleX(.55); transition-duration:5s; }
@media (max-height:700px){ .atop{ min-height:64px; top:10px; } .at-ic{ width:44px; height:44px; } .at-ic .ai-mark{ width:22px; height:22px; } .at-t{ font-size:15px; } }
'''
i = s.index('</style>', s.index('<html lang'))
s = s[:i] + css + s[i:]
s = s.replace('<title>DigiConsent Agent Deck 3D Glass Rail Cards</title>', '<title>DigiConsent Agent Deck 3D Glass Rail Blue</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-blue.html', 'w').write(s)
print('ok', len(s))
