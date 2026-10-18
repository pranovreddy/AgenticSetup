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
  profile: "Check the details and submit",
  team: "Choose who to invite",
  gtm: "Confirm the partners and split",
  brands: "Confirm brands and LOBs",
  templates: "Confirm the template mapping",
};
function tband() {
  let c = $("#tband");
  if (!c) {
    document.body.insertAdjacentHTML("beforeend", `<div class="tband" id="tband">
      <div class="tb-in"><div class="tb-row"><span class="tb-ic"><i class="tb-r r1"></i><i class="tb-r r2"></i>${AI_MARK}</span>
        <div class="tb-tx"><span class="tb-k"></span><span class="tb-t" id="atTele"></span></div>
        <nav class="tb-steps" id="tbSteps">${STEPS.map((s, i) => `<button type="button" data-i="${i}" title="${esc(s.title)}"><i></i><span>${esc(s.title)}</span></button>`).join("")}</nav></div>
        <div class="tb-two"><div><b>What the agent did</b><span id="tbDid"></span></div><div class="act"><b>Action needed</b><span id="tbAct"></span></div></div></div></div>`);
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
  $(".tb-k", c).textContent = s.title;
  if (rev) setAtTele(filling ? "Typing in what I found on DLT, GSTIN, MCA and your website" : locked ? did : cd.st === "done" ? "Reviewed. Nothing more to do here." : `${did}. ${act}.`);
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
.tband{ position:fixed; left:50%; top:12px; z-index:44; width:min(980px,calc(100% - 250px)); transform:translate(-50%,-10px); pointer-events:none; opacity:0; transition:opacity .6s var(--ease),transform .7s var(--ease); }
.tband.on{ opacity:1; transform:translate(-50%,0); }
.tb-in{ position:relative; padding:12px 18px 12px 14px; display:flex; flex-direction:column; gap:10px; border-radius:20px; background:#0e152b; box-shadow:0 0 0 1px rgba(255,255,255,.09) inset,0 22px 44px -26px rgba(8,14,50,.8); color:#fff; }
.tb-row{ display:flex; align-items:center; gap:14px; min-width:0; }
.tb-ic{ position:relative; flex:none; width:40px; height:40px; border-radius:50%; display:grid; place-items:center; background:radial-gradient(circle at 34% 24%,#8cc0ff 0,#3f86f7 46%,#2154d8 100%); box-shadow:0 8px 18px -6px rgba(36,92,230,.85),0 0 0 1px rgba(255,255,255,.3) inset; }
.tb-ic .ai-mark{ width:21px; height:21px; position:relative; z-index:1; animation:atspin 6s linear infinite; }
@keyframes atspin{ to{ transform:rotate(360deg); } }
.tb-r{ position:absolute; inset:0; border-radius:50%; border:1.5px solid rgba(110,165,255,.55); animation:atring 2.4s ease-out infinite; } .tb-r.r2{ animation-delay:1.2s; }
@keyframes atring{ from{ transform:scale(1); opacity:.9; } to{ transform:scale(2); opacity:0; } }
.tb-tx{ display:flex; flex-direction:column; gap:4px; min-width:0; flex:1; }
.tb-k{ font-size:16px; font-weight:620; letter-spacing:-.012em; line-height:1.2; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tb-t{ font-size:13.5px; font-weight:500; letter-spacing:-.003em; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; background:linear-gradient(90deg,#fff 0 38%,#9cc2ff 50%,#fff 62% 100%); background-size:250% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; animation:shimmer 1.8s linear infinite; }
.tb-t.swap{ animation:swapIn .45s var(--ease),shimmer 1.8s linear infinite; }
.tband.rev .tb-t{ animation:none; background:none; -webkit-text-fill-color:#aebbdc; color:#aebbdc; }
.tband .tb-two{ display:none!important; }
.tb-two{ display:none; gap:36px; padding:10px 4px 0 54px; border-top:1px solid rgba(255,255,255,.08); }
.tband.rev .tb-two{ display:flex; }
.tb-two > div{ display:flex; flex-direction:column; gap:5px; min-width:0; flex:1; }
.tb-two b{ font:600 10px/1 var(--mono); letter-spacing:.12em; text-transform:uppercase; color:#8ea0c9; }
.tb-two .act b{ color:#8fb3ff; }
.tb-two span{ font-size:13.5px; line-height:1.4; color:#e7ecfa; }
.tb-steps{ display:flex; align-items:center; gap:4px; pointer-events:auto; flex:none; }
.tb-steps button{ border:0; background:none; display:flex; align-items:center; gap:7px; height:24px; padding:0 6px; border-radius:99px; font:600 11px/1 var(--font); color:#8ea0c9; cursor:pointer; transition:background .25s,color .25s; }
.tb-steps button span{ display:none; }
.tb-steps button i{ width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.22); transition:background .3s,transform .3s; }
.tb-steps button.cur{ background:rgba(255,255,255,.1); color:#fff; padding:0 10px 0 8px; } .tb-steps button.cur span{ display:inline; } .tb-steps button.cur i{ background:#6aa4ff; transform:scale(1.2); }
.tb-steps button.done i{ background:#3ddc84; } .tb-steps button.work i{ background:#6aa4ff; animation:beam 1.2s ease-in-out infinite; }
.tb-steps button.lock{ cursor:default; opacity:.7; }
.tb-steps button:not(:last-child)::after{ content:""; width:10px; height:1px; margin-left:1px; background:rgba(255,255,255,.22); }
.rail3c{ display:none!important; }
body.has-tband .deck-head{ visibility:hidden; }
@media (max-height:760px){ .tb-two{ display:none!important; } .tband.rev .tb-t{ font-size:13px; } .tband{ top:8px; } .tb-in{ padding:8px 14px 8px 10px; } .tb-ic{ width:34px; height:34px; } }
@media (max-width:1000px){ .tband{ width:calc(100% - 190px); left:calc(50% + 40px); } }
'''
i = s.index('</style>', s.index('<html lang'))
s = s[:i] + css + s[i:]
s = s.replace('<title>DigiConsent Agent Deck 3D Glass Rail Cards</title>', '<title>DigiConsent Agent Deck 3D Glass Rail Blue</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-blue.html', 'w').write(s)
print('ok', len(s))
