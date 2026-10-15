import re
base = open('/home/user/AgenticSetup/agentic-setup-deck-enhanced.html').read()

SHARED_CSS = r'''
/* ===== 3D environment for the cards ===== */
.stage{ perspective:1500px; perspective-origin:50% 42%; -webkit-mask-image:none !important; mask-image:none !important; }
.card{ transform-style:flat; }
.env{ position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; opacity:0; transition:opacity 1s; }
body:not(.phase-gate) .env{ opacity:1; }
.env .floor{ position:absolute; left:-40%; right:-40%; bottom:-6%; height:58%; transform:perspective(700px) rotateX(64deg); transform-origin:50% 0; }
.env .dust i{ position:absolute; width:3px; height:3px; border-radius:50%; background:rgba(255,255,255,.7); animation:dust 14s linear infinite; }
@keyframes dust{ from{ transform:translateY(40px); opacity:0; } 20%{ opacity:.8; } to{ transform:translateY(-220px); opacity:0; } }
.hud3{ position:fixed; z-index:20; opacity:0; pointer-events:none; transition:opacity .6s .2s; }
body.deck-on:not(.mode-overview):not(.deep-open) .hud3{ opacity:1; pointer-events:auto; }
body.deep-open .hud3{ opacity:0 !important; pointer-events:none !important; }
.hud3 button{ font:inherit; cursor:pointer; }
.card:not(.is-focus) .lock-face b,.card:not(.is-focus) .lock-face span,.card:not(.is-focus) .lock-face .steps{ display:none; }
.card:not(.is-focus) .pane,.card:not(.is-focus) .r-foot{ opacity:.5; }
'''

A_CSS = r'''
/* ---------- Version A: Stage (dark hall, light shaft, angled panels, left rail) ---------- */
body.v3a:not(.phase-gate){ background:radial-gradient(80% 60% at 50% 38%,#16233f 0,#0b1426 55%,#060b16 100%); color:#e8efff; }
body.v3a .bg{ opacity:.0; }
body.v3a .env .wall{ position:absolute; inset:0; background:radial-gradient(60% 50% at 50% 30%,rgba(120,170,255,.16),transparent 70%); }
body.v3a .env .beam{ position:absolute; left:50%; top:-4%; width:46%; height:78%; transform:translateX(-50%); background:linear-gradient(180deg,rgba(190,215,255,.34),rgba(120,170,255,.06) 70%,transparent); clip-path:polygon(34% 0,66% 0,100% 100%,0 100%); filter:blur(14px); animation:beam 7s ease-in-out infinite alternate; }
@keyframes beam{ to{ opacity:.72; } }
body.v3a .env .floor{ background:repeating-linear-gradient(90deg,rgba(150,185,255,.16) 0 1px,transparent 1px 90px),repeating-linear-gradient(0deg,rgba(150,185,255,.16) 0 1px,transparent 1px 90px),linear-gradient(180deg,rgba(120,170,255,.18),transparent 85%); -webkit-mask-image:linear-gradient(180deg,transparent,#000 25%,#000 70%,transparent); mask-image:linear-gradient(180deg,transparent,#000 25%,#000 70%,transparent); }
body.v3a .env .arch{ position:absolute; top:6%; width:34%; height:62%; border:1.5px solid rgba(150,185,255,.14); border-bottom:0; border-radius:50% 50% 0 0/38% 38% 0 0; }
body.v3a .env .arch.l{ left:-8%; transform:rotate(-8deg); } body.v3a .env .arch.r{ right:-8%; transform:rotate(8deg); }
body.v3a .env .dust i{ background:rgba(190,215,255,.8); }
body.v3a:not(.phase-gate) .hdr-logo{ filter:brightness(0) invert(1); }
body.v3a:not(.phase-gate) .hdr-org{ color:#9fb2d6; border-color:rgba(160,190,255,.25); }
body.v3a:not(.phase-gate) .usr,body.v3a:not(.phase-gate) .logout{ background:rgba(255,255,255,.08); box-shadow:0 0 0 1px rgba(160,190,255,.22) inset; color:#e6eeff; }
body.v3a:not(.phase-gate) .usr-meta strong{ color:#fff; } body.v3a:not(.phase-gate) .usr-meta span{ color:#9fb2d6; } body.v3a:not(.phase-gate) .logout:hover{ background:rgba(255,255,255,.16); color:#fff; }
body.v3a:not(.phase-gate) .usr-av i{ background:#dce8ff; }
body.v3a:not(.phase-gate) .closes{ background:rgba(255,255,255,.08); box-shadow:0 0 0 1px rgba(160,190,255,.22) inset; } body.v3a:not(.phase-gate) .closes em{ color:#9fb2d6; } body.v3a:not(.phase-gate) .closes b{ color:#fff; } body.v3a:not(.phase-gate) .closes .ci{ background:rgba(255,255,255,.1); color:#cfe0ff; }
body.v3a:not(.phase-gate) .ah h1{ color:#fff; } body.v3a:not(.phase-gate) .narr{ color:#a9bbdc; } body.v3a:not(.phase-gate) .narr b{ color:#e8efff; } body.v3a:not(.phase-gate) .ah-k{ color:#8fb4ff; } body.v3a:not(.phase-gate) .ah-k .n{ color:#7f93b8; }
body.v3a .proto > button{ background:rgba(255,255,255,.08); color:#9fb2d6; border-color:rgba(160,190,255,.2); }
body.v3a .finale p{ color:#a9bbdc; } body.v3a .finale p b{ color:#fff; } body.v3a .clock div{ background:rgba(255,255,255,.08); border-color:rgba(160,190,255,.22); } body.v3a .clock b{ color:#fff; } body.v3a .clock span{ color:#9fb2d6; }
body.v3a .card-in{ background:rgba(255,255,255,.94); box-shadow:0 0 0 1px rgba(190,215,255,.5),0 30px 80px -30px rgba(0,0,0,.7); }
body.v3a .card.is-focus .card-in{ box-shadow:0 0 0 1px rgba(210,228,255,.9),0 0 90px -10px rgba(120,170,255,.55),0 40px 90px -30px rgba(0,0,0,.8); }
body.v3a .card:not(.is-focus) .card-in{ background:rgba(236,243,255,.82); }
body.v3a .card{ color:var(--ink); -webkit-box-reflect:below 10px linear-gradient(transparent 68%,rgba(255,255,255,.12)); }
body.v3a .card.is-far{ filter:none; }
/* rail */
.rail3{ left:26px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:12px; }
.rail3 button{ position:relative; width:44px; height:44px; border-radius:12px; border:0; background:rgba(255,255,255,.08); box-shadow:0 0 0 1px rgba(160,190,255,.2) inset; color:#bcd0f5; display:grid; place-items:center; transition:background .3s,color .3s,width .45s var(--ease); }
.rail3 button svg{ width:20px; height:20px; }
.rail3 button.on{ background:#fff; color:#0f1f3d; box-shadow:0 0 24px rgba(140,180,255,.6); }
.rail3 button .lb{ position:absolute; left:54px; top:50%; transform:translate(-6px,-50%); padding:6px 10px; border-radius:8px; background:#fff; color:#0f1f3d; font-size:12.5px; font-weight:600; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .2s,transform .3s var(--ease); } .rail3 button:hover .lb,.rail3 button:focus-visible .lb{ opacity:1; transform:translate(0,-50%); }
.rail3 button .st{ position:absolute; right:-4px; top:-4px; width:16px; height:16px; border-radius:50%; display:grid; place-items:center; background:#16a34a; color:#fff; } .rail3 button .st svg{ width:9px; height:9px; } .rail3 button .st.lk{ background:#64748b; }
.rail3 button:disabled{ opacity:.5; cursor:not-allowed; }
.coord3{ left:26px; bottom:22px; font:500 11px/1.5 var(--mono); color:#7f93b8; display:none; }
'''

B_CSS = r'''
/* ---------- Version B: Glass carousel (soft room, frosted cards on a curve, control capsule) ---------- */
body.v3b:not(.phase-gate){ background:radial-gradient(70% 55% at 50% 30%,#fbfdff 0,#e9f0fb 60%,#dbe5f6 100%); }
body.v3b .env .wall{ position:absolute; inset:0 0 38% 0; background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(214,226,246,.35)); }
body.v3b .env .wall::after{ content:""; position:absolute; left:8%; right:8%; bottom:0; height:1px; background:rgba(120,150,210,.25); }
body.v3b .env .floor{ background:repeating-linear-gradient(90deg,rgba(90,125,200,.13) 0 1px,transparent 1px 110px),repeating-linear-gradient(0deg,rgba(90,125,200,.13) 0 1px,transparent 1px 110px),linear-gradient(180deg,rgba(255,255,255,.85),rgba(206,220,244,.5)); -webkit-mask-image:linear-gradient(180deg,#000,transparent 92%); mask-image:linear-gradient(180deg,#000,transparent 92%); }
body.v3b .env .dust i{ background:rgba(37,99,235,.35); }
body.v3b .card-in{ background:linear-gradient(165deg,rgba(255,255,255,.82),rgba(255,255,255,.58)); -webkit-backdrop-filter:blur(26px) saturate(1.4); backdrop-filter:blur(26px) saturate(1.4); box-shadow:0 0 0 1.5px rgba(255,255,255,.95) inset,0 0 0 1px rgba(150,180,230,.35),0 40px 70px -34px rgba(30,70,160,.5); border-radius:30px; }
body.v3b .card{ border-radius:30px; }
body.v3b .card.is-focus .card-in{ background:linear-gradient(165deg,rgba(255,255,255,.96),rgba(255,255,255,.84)); box-shadow:0 0 0 1.5px #fff inset,0 0 0 1px rgba(150,180,230,.5),0 50px 90px -34px rgba(30,70,170,.55); }
body.v3b .card:not(.is-focus) .card-in{ background:linear-gradient(165deg,rgba(255,255,255,.55),rgba(255,255,255,.32)); }
body.v3b .card:not(.is-focus) .pane,body.v3b .card:not(.is-focus) .c-head{ opacity:.55; }
body.v3b .card::before,body.v3b .card::after{ border-radius:31px; }
.cap3{ left:50%; bottom:70px; transform:translateX(-50%); display:flex; align-items:center; gap:14px; height:74px; padding:0 18px; border-radius:99px; background:linear-gradient(180deg,rgba(255,255,255,.88),rgba(255,255,255,.62)); -webkit-backdrop-filter:blur(24px) saturate(1.4); backdrop-filter:blur(24px) saturate(1.4); box-shadow:0 0 0 1.5px #fff inset,0 0 0 1px rgba(150,180,230,.4),0 24px 50px -28px rgba(30,70,170,.5); }
.cap3 .nav{ width:38px; height:38px; border-radius:50%; border:0; background:rgba(37,99,235,.1); color:var(--blue-d); display:grid; place-items:center; transition:background .2s,transform .2s var(--ease); } .cap3 .nav:hover:not(:disabled){ background:rgba(37,99,235,.2); transform:scale(1.06); } .cap3 .nav:disabled{ opacity:.35; cursor:not-allowed; } .cap3 .nav svg{ width:17px; height:17px; }
.cap3 .tile{ width:46px; height:46px; border-radius:15px; display:grid; place-items:center; background:var(--blue-soft); color:var(--blue); } .cap3 .tile svg{ width:22px; height:22px; }
.cap3 .tx{ min-width:210px; display:flex; flex-direction:column; line-height:1.25; } .cap3 .tx b{ font-size:15px; font-weight:650; color:var(--ink); } .cap3 .tx span{ font-size:12px; color:var(--muted); }
.cap3 .det{ height:38px; padding:0 14px; border-radius:99px; border:0; background:rgba(37,99,235,.1); color:var(--blue-d); font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:7px; } .cap3 .det:hover:not(:disabled){ background:rgba(37,99,235,.2); } .cap3 .det:disabled{ opacity:.4; cursor:not-allowed; } .cap3 .det svg{ width:15px; height:15px; }
.dots3{ left:50%; bottom:46px; transform:translateX(-50%); display:flex; gap:7px; align-items:center; } .dots3 i{ width:8px; height:8px; border-radius:99px; background:rgba(37,99,235,.25); transition:width .5s var(--ease),background .3s; } .dots3 i.on{ width:44px; background:rgba(37,99,235,.6); } .dots3 i.done{ background:#16a34a; }
body.v3b .proto{ bottom:20px; }

/* flip cards: gradient face when out of focus, details when in focus */
body.v3b .card{ transform-style:preserve-3d; }
body.v3b .card.is-far{ filter:none; }
body.v3b .card-in{ backface-visibility:hidden; -webkit-backface-visibility:hidden; -webkit-backdrop-filter:none; backdrop-filter:none; opacity:var(--o,1); transform:rotateY(0deg); transition:transform .95s var(--ease); background:linear-gradient(165deg,rgba(255,255,255,.97),rgba(255,255,255,.9)); }
body.v3b .card:not(.is-focus) .card-in{ background:linear-gradient(165deg,rgba(255,255,255,.97),rgba(255,255,255,.9)); }
body.v3b .card:not(.is-focus) .pane,body.v3b .card:not(.is-focus) .c-head,body.v3b .card:not(.is-focus) .r-foot{ opacity:1; }
body.v3b:not(.mode-overview) .card:not(.is-focus) .card-in{ transform:rotateY(180deg); }
.cardf{ position:absolute; inset:0; border-radius:30px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; opacity:var(--o,1); transform:rotateY(180deg); transition:transform .95s var(--ease); color:#fff; padding:28px; display:flex; flex-direction:column; background:linear-gradient(140deg,#1e3a8a 0%,#2563eb 45%,#7db4ff 100%); box-shadow:0 0 0 1.5px rgba(255,255,255,.55) inset,0 40px 70px -34px rgba(30,70,170,.7); }
body.v3b:not(.mode-overview) .card:not(.is-focus) .cardf{ transform:rotateY(360deg); }
.cardf::before{ content:""; position:absolute; inset:0; background:radial-gradient(60% 55% at 85% 8%,rgba(255,255,255,.4),transparent 70%),radial-gradient(50% 50% at 8% 100%,rgba(11,26,70,.55),transparent 70%); }
.cardf::after{ content:""; position:absolute; top:-20%; bottom:-20%; width:34%; left:-50%; background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent); transform:skewX(-18deg); animation:cfsweep 6s ease-in-out infinite; }
@keyframes cfsweep{ 0%,55%{ left:-50%; } 100%{ left:130%; } }
.cardf > *{ position:relative; z-index:1; }
.cardf.s-queued{ background:linear-gradient(140deg,#334a7a 0%,#4b6aa8 55%,#8fa9d6 100%); }
.cardf.s-locked{ background:linear-gradient(140deg,#3a4558 0%,#566480 55%,#94a0b8 100%); }
.cardf.s-done{ background:linear-gradient(140deg,#0f4c81 0%,#1d6fd6 50%,#6fd0b0 100%); }
.cf-top{ display:flex; align-items:flex-start; justify-content:space-between; }
.cf-ic{ width:64px; height:64px; border-radius:20px; display:grid; place-items:center; background:rgba(255,255,255,.18); box-shadow:0 0 0 1px rgba(255,255,255,.4) inset; } .cf-ic svg{ width:30px; height:30px; }
.cf-no{ font:500 12px/1 var(--mono); letter-spacing:.08em; opacity:.8; }
.cf-mid{ margin-top:auto; }
.cf-mid h3{ margin:0 0 12px; font-size:30px; line-height:1.1; font-weight:650; letter-spacing:-.02em; }
.cf-st{ display:inline-flex; align-items:center; gap:8px; height:30px; padding:0 14px 0 10px; border-radius:99px; background:rgba(255,255,255,.2); box-shadow:0 0 0 1px rgba(255,255,255,.35) inset; font-size:13px; font-weight:600; backdrop-filter:blur(4px); }
.cf-st i{ width:9px; height:9px; border-radius:50%; background:#fff; } .cf-st.run i{ border:2px solid #fff; border-right-color:transparent; background:none; animation:spin .8s linear infinite; } .cf-st.ok i{ background:#7CF0B2; } .cf-st svg{ width:13px; height:13px; }
.cf-bot{ display:flex; align-items:center; justify-content:space-between; margin-top:26px; font:500 13px/1 var(--mono); letter-spacing:.12em; opacity:.85; }
.card.is-far .cf-mid,.card.is-far .cf-bot{ opacity:0; }
.cf-bot .ai-mark{ width:26px; height:26px; opacity:.95; }

'''

ENV_A = '<div class="env" aria-hidden="true"><div class="wall"></div><div class="beam"></div><div class="arch l"></div><div class="arch r"></div><div class="floor"></div><div class="dust">' + ''.join(f'<i style="left:{(i*53)%100}%;bottom:{(i*37)%40}%;animation-delay:-{i*0.9}s;animation-duration:{11+i%5*2}s"></i>' for i in range(22)) + '</div></div>'
ENV_B = '<div class="env" aria-hidden="true"><div class="wall"></div><div class="floor"></div><div class="dust">' + ''.join(f'<i style="left:{(i*47)%100}%;bottom:{(i*29)%45}%;animation-delay:-{i*1.1}s;animation-duration:{13+i%4*3}s"></i>' for i in range(16)) + '</div></div>'

RAIL_HTML = '<nav class="hud3 rail3" id="rail3" aria-label="Steps"></nav>'
CAP_HTML = '<div class="hud3 cap3" id="cap3" aria-label="Step controls"></div><div class="hud3 dots3" id="dots3" aria-hidden="true"></div>'

def layout_js(theta, gap, zstep, sc, op, lift, dy, yoff, faces=False):
    return r'''function layout() {
  const r = stage.getBoundingClientRect();
  const all = cards();
  if (S.mode === "overview") {
    const so = 0.6, g = 18;
    let f = Math.min(1.1, (r.height - 40) / (CH * so), r.width / (5 * CW * so + 4 * g + 40));
    if (S.phase === "finale") f = Math.min(f, 0.72, (r.height - 270) / (CH * so));
    f = Math.max(f, 0.2);
    const yOff = S.phase === "finale" ? -(r.height / 2 - (CH * so * f) / 2 - 16) : 0;
    all.forEach((el, i) => {
      size(el, CW, CH);
      el.style.transform = `translate3d(${(i - 2) * (CW * so + g) * f}px, ${yOff}px, ${-Math.abs(i - 2) * 30}px) rotateY(${(2 - i) * 7}deg) scale(${so * f})`;
      el.style.opacity = 1; el.style.zIndex = 10; el.classList.remove("is-far", "is-focus");
      el.classList.toggle("is-clickable", S.phase === "review");
    });
    $("#finale").style.top = `${r.height / 2 + yOff + (CH * so * f) / 2 + 28}px`;
    return;
  }
  const [aw, ah] = dims(S.active);
  const TH = %(theta)s, GAP = %(gap)s, ZS = %(zstep)s, SC = %(sc)s, OP = %(op)s;
  let f = Math.max(0.42, Math.min(1.06, (r.height - %(dy)s) / ah, (r.width - 48) / aw));
  const proj = (i, a) => (dims(i)[0] * SC[a] * (a ? Math.cos(TH * Math.PI / 180) : 1)) / 2;
  all.forEach((el, i) => {
    const off = i - S.active, a = Math.min(Math.abs(off), 4), dir = Math.sign(off);
    let x = 0;
    for (let k = 1; k <= a; k++) x += proj(S.active + dir * (k - 1), k - 1) + GAP + proj(S.active + dir * k, k);
    const [w, h] = dims(i); size(el, w, h);
    const z = a === 0 ? %(lift)s : -ZS * a;
    el.style.transform = `translate3d(${dir * x * f}px, ${%(yoff)s}px, ${z}px) rotateY(${-dir * TH}deg) scale(${SC[a] * f})`;
    el.style.opacity = OP[a]; el.style.zIndex = 20 - a;
    el.classList.toggle("is-focus", off === 0);
    el.classList.toggle("is-far", a >= 2);
    el.classList.toggle("is-clickable", S.phase === "review" && off !== 0);
  });
}
''' % dict(theta=theta, gap=gap, zstep=zstep, sc=sc, op=op, lift=lift, dy=dy, yoff=yoff)

def faces_fix(js):
    js = js.replace('el.style.opacity = OP[a];', 'el.style.setProperty("--o", OP[a]); el.style.opacity = 1;')
    js = js.replace('el.style.opacity = 1; el.style.zIndex = 10;', 'el.style.setProperty("--o", 1); el.style.opacity = 1; el.style.zIndex = 10;')
    return js

HUD_A = r'''
/* ---------- 3D rail (version A) ---------- */
function hudSync() {
  const rail = $("#rail3"); if (!rail) return;
  const rev = S.phase === "review";
  rail.innerHTML = STEPS.map((s, i) => {
    const lk = S.cards[i].st === "review" && isLocked(i), dn = passed(i);
    return `<button class="${i === S.active ? "on" : ""}" data-i="${i}" ${rev && !lk ? "" : (rev ? "" : "disabled")} aria-label="${esc(s.title)}">${IC[s.key]}<span class="lb">${esc(s.title)}</span>${dn ? `<span class="st">${IC.check}</span>` : lk ? `<span class="st lk">${IC.lock}</span>` : ""}</button>`;
  }).join("");
}
$("#rail3").addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b && S.phase === "review") focusCard(+b.dataset.i); });
setInterval(hudSync, 300); hudSync();
'''

HUD_B = r'''
/* ---------- 3D capsule (version B) ---------- */
let capSig = "";
function faceHTML(i) {
  const s = STEPS[i], c = S.cards[i], lk = c.st === "review" && isLocked(i);
  let cls = "s-active", txt = "", ic = "";
  if (c.st === "queued") { cls = "s-queued"; txt = "Queued"; ic = "<i></i>"; }
  else if (c.st === "analysing") { txt = "The agent is working"; ic = ""; }
  else if (c.st === "ready") txt = "Ready for review";
  else if (c.st === "review") { if (lk) { cls = "s-locked"; txt = "Locked"; ic = IC.lock; } else txt = "Your review"; }
  else if (c.st === "done") { cls = "s-done"; txt = "Done"; ic = IC.check; }
  else if (c.st === "later") { cls = "s-queued"; txt = "Saved for later"; }
  else if (c.st === "inreview") { txt = "In review"; }
  const run = c.st === "analysing" || c.st === "inreview";
  const done = c.st === "done";
  return { cls, html: `<div class="cf-top"><span class="cf-ic">${IC[s.key]}</span><span class="cf-no">STEP ${String(i + 1).padStart(2, "0")} / 05</span></div>
    <div class="cf-mid"><h3>${esc(s.title)}</h3><span class="cf-st ${run ? "run" : done ? "ok" : ""}">${run ? "<i></i>" : ic || "<i></i>"}${txt}</span></div>
    <div class="cf-bot"><span>•••• ${String(i + 1).padStart(2, "0")}</span>${AI_MARK}</div>` };
}
let faceSig = "";
function faces() {
  const sig = S.cards.map((c, i) => c.st + (c.st === "review" && isLocked(i))).join();
  if (sig === faceSig && $$(".cardf").length === 5) return; faceSig = sig;
  cards().forEach((el, i) => {
    let f = $(".cardf", el); if (!f) { f = document.createElement("div"); f.className = "cardf"; el.appendChild(f); }
    const { cls, html } = faceHTML(i); f.className = "cardf " + cls; f.innerHTML = html;
  });
}
function hudSync() {
  const cap = $("#cap3"); if (!cap) return;
  faces();
  const i = S.active, s = STEPS[i], c = S.cards[i], rev = S.phase === "review";
  const lk = c.st === "review" && isLocked(i);
  const status = { queued: "Queued", analysing: "The agent is working", ready: "Ready", review: lk ? "Locked" : "Your review", done: "Done", later: "Saved for later", inreview: "In review" }[c.st] || "";
  const sig = [i, c.st, lk, rev, S.cards.map((x) => x.st).join()].join("|");
  if (sig === capSig) return; capSig = sig;
  cap.innerHTML = `<button class="nav" data-n="-1" aria-label="Previous step" ${rev && i > 0 ? "" : "disabled"}>${IC.back}</button>
    <span class="tile">${IC[s.key]}</span><span class="tx"><b>${esc(s.title)}</b><span>Step ${i + 1} of 5 · ${status}</span></span>
    <button class="det" data-det="1" ${rev && !lk ? "" : "disabled"}>${IC.expand}Details</button>
    <button class="nav" data-n="1" aria-label="Next step" ${rev && i < 4 ? "" : "disabled"} style="transform:scaleX(-1)">${IC.back}</button>`;
  $("#dots3").innerHTML = STEPS.map((_, k) => `<i class="${k === i ? "on" : passed(k) ? "done" : ""}"></i>`).join("");
}
$("#cap3").addEventListener("click", (e) => {
  const n = e.target.closest("[data-n]"), d = e.target.closest("[data-det]");
  if (n && S.phase === "review") focusCard(Math.max(0, Math.min(4, S.active + +n.dataset.n)));
  if (d && S.phase === "review") openDeep(S.active);
});
setInterval(hudSync, 250); hudSync();
'''

def make(name, bodycls, extra_css, env, hud_html, hud_js, lay, title):
    s = base
    assert s.count('</style>\n</head>') == 1
    s = s.replace('</style>\n</head>', SHARED_CSS + extra_css + '</style>\n</head>')
    s = s.replace('<body class="phase-gate mode-overview">', f'<body class="phase-gate mode-overview {bodycls}">')
    s = s.replace('<div class="bg" aria-hidden="true">', env + '<div class="bg" aria-hidden="true">', 1)
    s = s.replace('<div class="deep" id="deep" hidden></div>', hud_html + '\n<div class="deep" id="deep" hidden></div>', 1)
    a = s.index('function layout() {'); b = s.index('addEventListener("resize"', a)
    s = s[:a] + lay + '\n' + s[b:]
    m = '/* ---------- Boot ---------- */'
    assert s.count(m) == 1
    s = s.replace(m, hud_js + '\n' + m)
    s = s.replace('<title>DigiConsent Agent Deck Enhanced</title>', f'<title>{title}</title>')
    open(f'/home/user/AgenticSetup/{name}', 'w').write(s)
    print(name, len(s))

make('agentic-setup-deck-3d-stage.html', 'v3a', A_CSS, ENV_A, RAIL_HTML, HUD_A,
     layout_js(36, 14, 150, '[1, .68, .54, .44, .38]', '[1, .78, .42, .18, .06]', 70, 90, '-12 * f'), 'DigiConsent Agent Deck 3D Stage')
make('agentic-setup-deck-3d-glass.html', 'v3b', B_CSS, ENV_B, CAP_HTML, HUD_B,
     faces_fix(layout_js(56, -118, 110, '[1, .7, .6, .52, .46]', '[1, .62, .38, .2, .08]', 40, 230, '-52 * f')), 'DigiConsent Agent Deck 3D Glass')
