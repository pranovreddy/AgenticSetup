import re
base = open('/home/user/AgenticSetup/agentic-setup-deck-enhanced.html').read()

SHARED_CSS = r'''
/* ---------- KYC layout in the profile card: logo, starred labels, selects, filling ---------- */
.kyc-top{ display:flex; align-items:flex-start; gap:18px; margin-bottom:10px; }
.kyc-lg{ display:flex; flex-direction:column; gap:6px; } .kyc-lab{ font-size:11.5px; color:var(--muted); }
.kyc-logo{ position:relative; width:92px; height:80px; border-radius:14px; background:#fff; box-shadow:0 0 0 1px var(--line-2) inset; display:grid; place-items:center; overflow:hidden; }
.kyc-logo img{ position:absolute; inset:6px; width:calc(100% - 12px); height:calc(100% - 12px); object-fit:contain; opacity:0; transform:scale(.92); transition:opacity .5s var(--ease),transform .6s var(--ease); }
.kyc-logo .kl-ph{ color:#b5bdd0; } .kyc-logo .kl-ph svg{ width:26px; height:26px; }
.kyc-logo.is-in img{ opacity:1; transform:none; } .kyc-logo.is-in .kl-ph{ display:none; }
.kyc-logo.is-shimmer::after{ content:""; position:absolute; inset:0; background:linear-gradient(100deg,transparent 20%,rgba(59,110,255,.22) 50%,transparent 80%); background-size:200% 100%; animation:skel 1.1s linear infinite; }
.kyc-logo .kl-edit{ position:absolute; right:4px; bottom:4px; width:22px; height:22px; border-radius:50%; background:#fff; box-shadow:0 0 0 1px var(--line-2),0 4px 8px -4px rgba(37,99,235,.5); color:var(--blue); display:none; place-items:center; } .kyc-logo.is-in .kl-ph + img + .kl-edit,.kyc-logo.is-in .kl-edit{ display:grid; } .kl-edit svg{ width:12px; height:12px; }
.kyc-tt{ min-width:0; } .kyc-tt .r-h{ margin:0 0 3px; font-size:20px; } .kyc-tt .r-p{ margin:0; }
.pf label em{ color:#e0364f; font-style:normal; }
.pin-w{ position:relative; } .pin-w .pin{ height:40px; padding-right:30px; font-size:13.5px; }
.pf.is-sel .pin-w .chev{ position:absolute; right:10px; top:50%; width:16px; height:16px; margin-top:-8px; color:#8a96b3; pointer-events:none; }
.pf.is-filling .pin{ box-shadow:0 0 0 3px rgba(51,102,240,.16),0 8px 18px -10px rgba(51,102,240,.5); }
.pf.is-filled .pin{ animation:kycpop .6s var(--ease); }
@keyframes kycpop{ 0%{ background:#e6efff } 100%{ background:#FAFBFF } }
.pform{ gap:12px 16px; }
.check span{ display:flex; flex-direction:column; } .check small{ color:var(--muted); font-size:11.5px; line-height:1.35; }

/* crisp focused card: no pre-rasterised layer, no depth lift, no filters */
.card{ will-change:auto!important; }
.card.is-focus,.card.is-focus .card-in{ filter:none!important; -webkit-backdrop-filter:none!important; backdrop-filter:none!important; }
body.v3b .card.is-focus .card-in{ transform:none; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }

/* ---------- processing: blob centred on its own, telemetry inside the card ---------- */
.deck-head{ min-height:132px; align-items:center; transition:min-height .4s var(--ease); } body.is-working .deck-head{ min-height:96px; align-items:flex-start; padding-top:0; }
body.is-working .ah{ flex-direction:column; align-items:center; justify-content:center; }
body.is-working .ah-t{ display:none; }
body.is-working .ah .blob{ width:88px!important; height:88px!important; margin:0; }
body.is-working .ah,body.v3c.is-working .ah{ flex-direction:column; align-items:center; justify-content:flex-start; position:relative; }
body.is-working .ah::before{ left:50%!important; top:50%!important; transform:translate(-50%,-50%)!important; width:420px; height:170px; background:radial-gradient(closest-side,rgba(59,110,255,.28),rgba(59,110,255,0)); }

.beam{ position:absolute; left:50%; width:2px; margin-left:-1px; border-radius:2px; background:linear-gradient(180deg,rgba(59,110,255,.55),rgba(59,110,255,.12)); opacity:0; transition:opacity .4s; pointer-events:none; z-index:2; }
body.is-working .beam{ opacity:1; }
.beam::after{ content:""; position:absolute; left:-3px; top:-16px; width:8px; height:16px; border-radius:8px; background:radial-gradient(closest-side,#fff,rgba(59,110,255,.95) 55%,rgba(59,110,255,0)); animation:beamflow 1.15s cubic-bezier(.4,0,.6,1) infinite; }
.beam::before{ content:""; position:absolute; left:50%; bottom:-5px; width:34px; height:10px; margin-left:-17px; border-radius:50%; border:2px solid rgba(59,110,255,.55); animation:beamland 1.15s ease-out infinite; }
@keyframes beamflow{ 0%{ top:-16px; opacity:0 } 15%{ opacity:1 } 85%{ opacity:1 } 100%{ top:100%; opacity:0 } }
@keyframes beamland{ 0%,55%{ transform:scale(.4); opacity:0 } 70%{ opacity:.9 } 100%{ transform:scale(1.5); opacity:0 } }
body.is-working .card.is-focus .card-in{ animation:cardwork 2.3s ease-in-out infinite; }
@keyframes cardwork{ 0%,100%{ box-shadow:0 0 0 1.5px #fff inset,0 0 0 1px rgba(150,180,230,.5),0 50px 90px -34px rgba(30,70,170,.55),0 -6px 26px -6px rgba(59,110,255,.0) } 50%{ box-shadow:0 0 0 1.5px #fff inset,0 0 0 1.5px rgba(80,125,245,.7),0 50px 90px -34px rgba(30,70,170,.55),0 -10px 34px -6px rgba(59,110,255,.45) } }
@keyframes beam{ 0%,100%{ opacity:.25; } 50%{ opacity:1; } }
.tele{ position:absolute; left:76px; right:20px; top:60px; z-index:3; font-size:13px; line-height:1.3; color:var(--blue-d); display:flex; align-items:center; gap:8px; min-height:18px; }
.tele::before{ content:""; width:7px; height:7px; border-radius:50%; background:var(--blue); box-shadow:0 0 0 4px rgba(59,110,255,.18); animation:beam 1.4s ease-in-out infinite; flex:none; }
.tele b{ color:var(--ink); font-weight:600; } .tele:empty{ display:none; }
body.is-working .card.is-focus .pane{ top:94px; }
body.is-working .card.is-focus .c-head{ padding-bottom:6px; }

/* less top space */
.gate{ inset:24px 0 0!important; } .deck{ inset:30px 0 0!important; } .gate-head{ padding-top:20px!important; }
/* gate: no box around the policies, content sits on the page */
.gate-card{ height:100%!important; width:min(1200px,100%)!important; background:transparent!important; border:0!important; box-shadow:none!important; }
.gate-head{ border-bottom:1px solid rgba(160,185,230,.45); }
.gate-sum{ background:none!important; border-right:1px solid rgba(160,185,230,.45); }
.doc-wrap{ background:transparent!important; border:0!important; box-shadow:none!important; }
.doc{ background:transparent!important; }
.doc-foot{ background:transparent!important; border-top:1px solid rgba(160,185,230,.45); }

/* ---------- ready: cards in a row above the ready message ---------- */
.ringc{ position:absolute; left:50%; top:50%; width:560px; transform:translate(-50%,14px); text-align:center; z-index:60; opacity:0; pointer-events:none; transition:opacity .8s var(--ease),transform 1s var(--ease); display:flex; flex-direction:column; align-items:center; gap:10px; }
.ringc.on{ opacity:1; transform:translate(-50%,0); pointer-events:auto; transition-delay:.6s; } .ringcta.on{ transition-delay:1s; } .ringc{ transition-delay:0s; }
.ringc.ringcta{ width:auto; gap:0; } .ringc:not(.on){ transition-duration:.22s,.3s; }
.ringc .rk{ font:600 11px/1 var(--mono); letter-spacing:.12em; text-transform:uppercase; color:var(--blue-d); }
.ringc h2{ margin:0; font-size:28px; line-height:1.12; letter-spacing:-.025em; font-weight:650; color:var(--ink); }
.ringc p{ margin:0; font-size:14px; line-height:1.5; color:var(--muted); max-width:460px; }
.ringc .go{ margin-top:8px; height:46px; padding:0 22px; border:0; border-radius:99px; background:linear-gradient(180deg,#3f6ef6,#2554e6); color:#fff; font:600 14.5px/1 inherit; font-family:inherit; display:inline-flex; align-items:center; gap:10px; cursor:pointer; box-shadow:0 14px 28px -12px rgba(37,84,230,.75); transition:transform .25s var(--ease),box-shadow .25s; }
.ringc .go:hover{ transform:translateY(-2px); box-shadow:0 18px 32px -12px rgba(37,84,230,.85); } .ringc .go svg{ width:16px; height:16px; }
.ringc .ct{ display:flex; gap:6px; margin-top:2px; } .ringc .ct i{ width:8px; height:8px; border-radius:50%; background:#16a34a; }
body.mode-ring .card,body.v3b .card{ transition-timing-function:cubic-bezier(.22,1,.36,1); }
body.mode-ring .card .mini{ transform:rotate(calc(var(--rz,0deg) * -1)); } .card .mini{ transition:transform .9s var(--ease); }
body.v3c.mode-ring .ah{ flex-direction:column; align-items:center; text-align:center; gap:2px; } body.v3c.mode-ring .ah-t{ flex:none; width:100%; } body.v3c.mode-ring .ah-k{ justify-content:center; } body.v3c.mode-ring .ah .blob{ width:84px; height:84px; } body.v3c.mode-ring .ah h1{ font-size:27px; } body.v3c.mode-ring .ah::before{ left:50%; transform:translateX(-50%); }
body.v3a .ringc h2{ color:#fff; } body.v3a .ringc p{ color:#a9bbdc; } body.v3a .ringc .rk{ color:#8fb4ff; }

/* centred agent head: blob on top, text beneath */
.ah{ flex-direction:column; align-items:center; text-align:center; gap:2px; width:min(760px,100%); position:relative; }
.ah::before{ content:""; position:absolute; top:-30px; left:50%; width:360px; height:150px; transform:translateX(-50%); background:radial-gradient(closest-side,rgba(59,110,255,.2),rgba(59,110,255,0)); pointer-events:none; }
.ah .blob{ width:84px; height:84px; margin-bottom:-4px; }
.ah-t{ flex:none; width:100%; } .ah-k{ justify-content:center; }
.ah h1{ font-size:27px; margin:4px 0 3px; } .narr{ font-size:14.5px; }
body.v3a .ah::before{ background:radial-gradient(closest-side,rgba(90,140,255,.35),rgba(90,140,255,0)); }

/* top-left vertical identity pill */
.hdr{ position:fixed; top:16px; left:16px; right:auto; height:auto; width:auto; z-index:40; flex-direction:column; align-items:center; gap:12px; padding:10px; border-radius:40px; background:rgba(244,248,255,.9); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); box-shadow:0 0 0 1px rgba(196,214,245,.85) inset,0 16px 34px -18px rgba(37,99,235,.5); pointer-events:auto; }
.hdr .mk{ width:50px; height:50px; border-radius:50%; background:#fff; display:grid; place-items:center; color:#3b6bf5; box-shadow:0 6px 14px -10px rgba(37,99,235,.5); }
.hdr .mk img{ width:26px; height:auto; display:block; }
.hdr .me{ border:0; background:none; padding:3px; border-radius:50%; cursor:pointer; box-shadow:0 0 0 3px #dfe6f5 inset; }
.hdr .me .usr-av{ width:44px; height:44px; background:#3b5be8; color:#fff; font-size:14px; } .hdr .me .usr-av::before{ display:none; } .hdr .me .usr-av i{ background:#3b5be8; color:#fff; }
.hdr .fly{ position:absolute; left:calc(100% + 10px); top:0; min-width:260px; padding:14px; border-radius:20px; background:rgba(255,255,255,.96); box-shadow:0 0 0 1px rgba(196,214,245,.9) inset,0 22px 44px -20px rgba(15,35,90,.4); display:flex; flex-direction:column; gap:10px; opacity:0; transform:translateX(-6px); pointer-events:none; transition:opacity .2s,transform .25s var(--ease); }
.hdr:hover .fly,.hdr:focus-within .fly{ opacity:1; transform:none; pointer-events:auto; }
.hdr .fly{ text-align:left; } .hdr .fly .hdr-logo{ height:24px; align-self:flex-start; }
.hdr .who{ text-align:left; align-items:flex-start; display:flex; flex-direction:column; line-height:1.3; padding:8px 0; border-block:1px solid #e6edf8; } .hdr .who strong{ font-size:14px; color:var(--ink); } .hdr .who span{ font-size:12px; color:var(--muted); }
.hdr .logout{ height:38px; justify-content:center; background:#f1f5fd!important; box-shadow:none!important; border-radius:12px; }
body.v3a .hdr{ background:rgba(255,255,255,.1); box-shadow:0 0 0 1px rgba(160,190,255,.25) inset; } body.v3a .hdr .mk{ background:rgba(255,255,255,.92); }

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


/* bottom nav: arrows with dots, no step pill */
.cap3{ bottom:26px; height:auto; padding:0; gap:18px; background:none!important; box-shadow:none!important; -webkit-backdrop-filter:none!important; backdrop-filter:none!important; border-radius:0; }
.cap3 .nav{ width:42px; height:42px; background:rgba(255,255,255,.85); box-shadow:0 0 0 1px rgba(196,214,245,.9) inset,0 10px 20px -12px rgba(37,99,235,.5); }
.cap3 .nav:disabled{ opacity:.4; }
.cap3 .dts{ display:flex; gap:9px; align-items:center; } .cap3 .dts i{ width:9px; height:9px; border-radius:99px; background:rgba(37,99,235,.25); transition:width .5s var(--ease),background .3s; } .cap3 .dts i.on{ width:30px; background:var(--blue); } .cap3 .dts i.done{ background:#16a34a; }
.dots3{ display:none!important; }
body.v3b .card .ld{ flex:1 1 auto; height:auto; min-height:300px; }

/* richer room, floor at the bottom */
body.v3b:not(.phase-gate){ background:linear-gradient(180deg,#f7faff 0,#e8effb 55%,#dce6f6 100%); }
body.v3b .env .wall{ inset:0 0 21% 0; background:radial-gradient(60% 70% at 50% 100%,rgba(120,160,255,.28),rgba(120,160,255,0) 70%),radial-gradient(40% 40% at 18% 20%,rgba(190,210,255,.5),rgba(190,210,255,0)),radial-gradient(38% 38% at 84% 14%,rgba(205,190,255,.35),rgba(205,190,255,0)),linear-gradient(180deg,rgba(255,255,255,.6),rgba(214,226,246,.3)); }
body.v3b .env .wall::after{ left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(110,150,230,.5) 30%,rgba(110,150,230,.5) 70%,transparent); box-shadow:0 0 18px 2px rgba(110,150,255,.35); }
body.v3b .env .floor{ top:79%; bottom:auto; height:70%; background:repeating-linear-gradient(90deg,rgba(90,125,200,.16) 0 1px,transparent 1px 90px),repeating-linear-gradient(0deg,rgba(90,125,200,.16) 0 1px,transparent 1px 90px),radial-gradient(50% 60% at 50% 0,rgba(255,255,255,.95),rgba(206,220,244,.35)); -webkit-mask-image:linear-gradient(180deg,#000,transparent 85%); mask-image:linear-gradient(180deg,#000,transparent 85%); }
body.v3b .env::after{ content:""; position:absolute; left:50%; bottom:3%; width:min(980px,86vw); height:150px; transform:translateX(-50%); background:radial-gradient(closest-side,rgba(70,120,240,.28),rgba(70,120,240,0)); filter:blur(6px); }

/* vertical step label on the exposed edge of every unfocused card */
.cf-v{ display:none; position:absolute; top:96px; bottom:30px; left:24px; width:60px; writing-mode:vertical-rl; transform:rotate(180deg); align-items:flex-start; gap:12px; z-index:2; }
.card.is-right .cf-v{ left:auto; right:24px; transform:none; }
.cf-v b{ font-size:30px; font-weight:650; letter-spacing:-.01em; line-height:1.1; white-space:nowrap; } .cf-v em{ font-style:normal; font-size:14px; font-weight:600; opacity:.85; white-space:nowrap; align-self:flex-start; }
.card:not(.is-focus) .cf-v{ display:flex; }
body.v3b:not(.mode-overview) .card:not(.is-focus) .cf-mid{ display:none; }
body.v3b.mode-overview .cf-v{ display:none!important; }
.card.is-far .cf-v{ opacity:.8; }
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
      el.style.transform = `translate3d(${(i - 2) * (CW * so + g) * f}px, ${yOff}px, ${-Math.abs(i - 2) * 30}px) rotateY(${(2 - i) * 7}deg) rotateZ(0deg) scale(${so * f})`;
      el.style.opacity = 1; el.style.zIndex = 10; el.classList.remove("is-far", "is-focus");
      el.classList.toggle("is-clickable", S.phase === "review");
    });
    $("#finale").style.top = `${r.height / 2 + yOff + (CH * so * f) / 2 + 28}px`;
    return;
  }
  if (S.mode === "ring") {
    const so = 0.6, g = 18, gap2 = 30, ctaH = 48, botM = 24;
    const avail = r.height - gap2 - ctaH - botM - 8;
    let f = Math.min(0.92, avail / (CH * so), r.width / (5 * CW * so + 4 * g + 40));
    f = Math.max(f, 0.2);
    const ch = CH * so * f, cardTop = Math.max(4, (avail - ch) * 0.3 + 4), yOff = cardTop + ch / 2 - r.height / 2;
    window.__ringOut = 1;
    all.forEach((el, i) => {
      size(el, CW, CH);
      el.style.transitionDelay = `${Math.abs(i - 2) * 70}ms`;
      el.style.transform = `translate3d(${(i - 2) * (CW * so + g) * f}px, ${yOff}px, ${-Math.abs(i - 2) * 30}px) rotateY(${(2 - i) * 7}deg) rotateZ(0deg) scale(${so * f})`;
      el.style.setProperty("--o", 1); el.style.setProperty("--rz", "0deg"); el.style.opacity = 1; el.style.zIndex = 10; el.classList.remove("is-far", "is-focus", "is-right");
      el.classList.toggle("is-clickable", false);
    });
    const cta = $("#ringcta");
    if (cta) cta.style.top = `${cardTop + ch + gap2}px`;
    return;
  }
  if (window.__ringOut) { window.__ringOut = 0; all.forEach((el, i) => { el.style.transitionDelay = `${Math.abs(i - S.active) * 80}ms`; }); setTimeout(() => all.forEach((el) => { el.style.transitionDelay = ""; }), 1600); }
  const [aw, ah] = dims(S.active);
  const AN = S.phase === "analyse", TH = %(theta)s, GAP = %(gap)s + (AN ? 92 : 0), ZS = %(zstep)s, SC = %(sc)s, OP = %(op)s;
  let f = Math.max(0.42, Math.min(1.06, (r.height - %(dy)s) / ah, (r.width - (AN ? 250 : 48)) / aw));
  const proj = (i, a) => (dims(i)[0] * SC[a] * (a ? Math.cos(TH * Math.PI / 180) : 1)) / 2;
  all.forEach((el, i) => {
    const off = i - S.active, a = Math.min(Math.abs(off), 4), dir = Math.sign(off);
    let x = 0;
    for (let k = 1; k <= a; k++) x += proj(S.active + dir * (k - 1), k - 1) + GAP + proj(S.active + dir * k, k);
    const [w, h] = dims(i); size(el, w, h);
    const z = a === 0 ? %(lift)s : -ZS * a;
    el.style.transform = `translate3d(${dir * x * f}px, ${%(yoff)s}px, ${z}px) rotateY(${-dir * TH}deg) rotateZ(0deg) scale(${SC[a] * f})`;
    el.style.opacity = OP[a]; el.style.zIndex = 20 - a;
    el.classList.toggle("is-focus", off === 0);
    el.classList.toggle("is-far", a >= 2); el.classList.toggle("is-right", off > 0);
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
  return { cls, html: `<div class="cf-v"><b>${esc(s.title)}</b><em>${esc(txt)}</em></div><div class="cf-top"><span class="cf-ic">${IC[s.key]}</span><span class="cf-no">STEP ${String(i + 1).padStart(2, "0")} / 05</span></div>
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
  cap.innerHTML = `<button class="nav" data-n="-1" aria-label="Previous step" ${rev && i > 0 ? "" : "disabled"}>${IC.back}</button><span class="dts">${STEPS.map((x, k) => `<i class="${k === i ? "on" : passed(k) ? "done" : ""}" title="${esc(x.title)}"></i>`).join("")}</span>
    <button class="nav" data-n="1" aria-label="Next step" ${rev && i < 4 ? "" : "disabled"} style="transform:scaleX(-1)">${IC.back}</button>`;
  if ($("#dots3")) $("#dots3").innerHTML = STEPS.map((_, k) => `<i class="${k === i ? "on" : passed(k) ? "done" : ""}"></i>`).join("");
}
$("#cap3").addEventListener("click", (e) => {
  const n = e.target.closest("[data-n]"), d = e.target.closest("[data-det]");
  if (n && S.phase === "review") focusCard(Math.max(0, Math.min(4, S.active + +n.dataset.n)));
  if (d && S.phase === "review") openDeep(S.active);
});
setInterval(hudSync, 250); hudSync();

/* ---------- telemetry line inside the focused card ---------- */
(function () {
  const n = $("#narr"); if (!n) return;
  let raf = 0;
  const sync = () => {
    raf = 0;
    const html = n.innerHTML;
    $$(".card", stage).forEach((el) => {
      let t = $(".tele", el);
      const on = el.classList.contains("is-focus") && document.body.classList.contains("is-working");
      if (!t && on) { t = document.createElement("div"); t.className = "tele"; t.setAttribute("aria-live", "polite"); $(".c-head", el).after(t); }
      if (t) t.innerHTML = on ? html : "";
    });
  };
  new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(sync); }).observe(n, { childList: true, subtree: true, characterData: true });
  new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(sync); }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  stage.addEventListener("transitionend", () => { if (!raf) raf = requestAnimationFrame(sync); });

  /* beam between the blob and the focused card, and a relayout whenever the header height changes */
  let wasWorking = null;
  const beamSync = () => {
    const ah = $(".ah"), blob = $("#headBlob"); if (!ah || !blob) return;
    let b = $("#beam"); if (!b) { b = document.createElement("i"); b.id = "beam"; b.className = "beam"; ah.appendChild(b); }
    const w = document.body.classList.contains("is-working");
    if (w !== wasWorking) { wasWorking = w; setTimeout(() => window.dispatchEvent(new Event("resize")), 450); }
    const card = $(".card.is-focus", stage); if (!w || !card) return;
    const ar = ah.getBoundingClientRect(), br = blob.getBoundingClientRect(), cr = card.getBoundingClientRect();
    const top = br.bottom - 14 - ar.top, h = Math.max(0, cr.top - (br.bottom - 14));
    b.style.top = `${top}px`; b.style.height = `${h}px`;
  };
  setInterval(beamSync, 150);
})();
'''


KYC_JS_FILL_OLD = """  for (const row of $$(".pf", el)) {
    if (run !== S.runId || !row.isConnected) return;
    const f = PROFILE.find((x) => x.k === row.dataset.k), inp = $(".pin", row);"""
KYC_JS_FILL_NEW = """  const lg = $("[data-logo]", el);
  if (lg && !RM) { lg.classList.add("is-shimmer"); await sleep(750); if (run !== S.runId) return; }
  if (lg) { lg.classList.remove("is-shimmer"); lg.classList.add("is-in"); }
  if (S.active === 0) narrate("Fetching your enterprise logo from your website", "", true);
  if (!RM) await sleep(500);
  for (const row of $$(".pf", el)) {
    if (run !== S.runId || !row.isConnected) return;
    const f = KYC.find((x) => x.k === row.dataset.k), inp = $(".pin", row);"""
KYC_FIELDS = """const KYC = [
  { k: "name", label: "Legal Entity Name", src: "MCA", v: () => PROFILE.find((x) => x.k === "name").v },
  { k: "type", label: "Entity Type", src: "MCA", sel: 1, v: () => "Public Limited" },
  { k: "addr", label: "Registered Address", src: "GSTIN", wide: true, v: () => PROFILE.find((x) => x.k === "addr").v },
  { k: "pan", label: "Business PAN/TAN", src: "GSTIN", v: () => PROFILE.find((x) => x.k === "pan").v },
  { k: "web", label: "Website URL", src: "Website", v: () => "https://" + PROFILE.find((x) => x.k === "web").v.replace(/^https?:\\/\\//, "") },
  { k: "ind", label: "Primary Industry", src: "DLT", sel: 1, v: () => "Banking & Financial Services" },
  { k: "sub", label: "Sub Industry", src: "DLT", sel: 1, v: () => "Scheduled Commercial Bank" },
];
"""


INGEST_LAYOUT = r"""  if (S.mode === "ingest") {
    const W = r.width, H = r.height;
    const f = Math.max(.3, Math.min(.56, (H * .965 - 412) / (1.13 * CH), (W * .92) / (4 * CW * 1.12 + CW)));
    const cwid = CW * f, chei = CH * f, step = Math.min(cwid * 1.12, (W * .92 - cwid) / 4), amp = chei * .13;
    const by = H * .035 + chei + amp + 206, sgEl = $("#sg");
    if (sgEl) sgEl.style.setProperty("--by", `${by}px`);
    window.__ringOut = 1;
    all.forEach((el, i) => {
      const t = (i - 2) / 2;
      size(el, CW, CH);
      el.style.transitionDelay = `${Math.abs(i - 2) * 80}ms`;
      const y = H * .035 + chei / 2 + (1 - t * t) * amp - H / 2;
      el.style.transform = `translate3d(${(i - 2) * step}px, ${y}px, ${(1 - Math.abs(t)) * -30}px) rotateY(${-t * 16}deg) rotateZ(${t * 7}deg) scale(${f})`;
      el.style.setProperty("--o", 1); el.style.setProperty("--rz", "0deg"); el.style.opacity = 1; el.style.zIndex = 10 - Math.abs(i - 2); el.classList.remove("is-far", "is-focus", "is-right");
      el.classList.toggle("is-clickable", false);
    });
    return;
  }
"""

def make(name, bodycls, extra_css, env, hud_html, hud_js, lay, title):
    s = base
    assert s.count('</style>\n</head>') == 1
    s = s.replace('</style>\n</head>', SHARED_CSS + extra_css + '</style>\n</head>')
    ha = s.index('<header class="hdr">'); hb = s.index('</header>', ha) + 9
    mark = open('/tmp/mark.b64').read()
    logo = re.search(r'<img class="hdr-logo" src="([^"]+)"', s[ha:hb]).group(1)
    s = s[:ha] + f'''<header class="hdr" id="hdr">
  <span class="mk" aria-hidden="true"><img src="{mark}" alt=""></span>
  <button class="me" type="button" aria-label="Account menu" aria-haspopup="true"><span class="usr-av" style="--p:0"><i>RM</i></span></button>
  <div class="fly" role="menu"><img class="hdr-logo" src="{logo}" alt="DigiConsent"><div class="who"><strong>Ravi Menon</strong><span>Super Admin · HDFC Bank Limited</span></div><button class="logout" id="logoutBtn" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Log out</button></div>
</header>''' + s[hb:]
    s = s.replace('<body class="phase-gate mode-overview">', f'<body class="phase-gate mode-overview {bodycls}">')
    s = s.replace('<div class="bg" aria-hidden="true">', env + '<div class="bg" aria-hidden="true">', 1)
    s = s.replace('<div class="deep" id="deep" hidden></div>', hud_html + '\n<div class="deep" id="deep" hidden></div>', 1)
    a = s.index('function layout() {'); b = s.index('addEventListener("resize"', a)
    s = s[:a] + lay + '\n' + s[b:]
    m = '/* ---------- Boot ---------- */'
    assert s.count(m) == 1
    s = s.replace(m, hud_js + '\n' + m)
    if 'glass' in name:
        pass
    if 'glass' in name or 'rail' in name:
        old = 'const CW = 372, CH = 548, AW = 640, AH = 446, RH = 500, RH_PROFILE = 566;'
        assert old in s
        s = s.replace(old, 'const CW = 372, CH = 548, AW = 760, AH = 530, RH = 570, RH_PROFILE = 620;')
    if 'glass' in name:
        pass
    if 'glass' in name or 'rail' in name:
        o = 'pre = lead ? `<b>${esc(lead)}</b> · ` : ""'
        assert o in s
        s = s.replace(o, 'pre = ""')
    if 'rail' in name:
        s = s.replace('AW = 760, AH = 530, RH = 570, RH_PROFILE = 620', 'AW = 800, AH = 560, RH = 610, RH_PROFILE = 660')
    if 'glass' in name or 'rail' in name:
        logo = open('/tmp/hdfc_logo.b64').read()
        # fields
        a = s.index('const ROLES = [')
        s = s[:a] + KYC_FIELDS.replace('v: () =>', 'v0: () =>') .replace('v0: () =>','v: () =>') + s[a:]
        # fillProfile uses KYC values (functions)
        assert KYC_JS_FILL_OLD in s
        s = s.replace(KYC_JS_FILL_OLD, KYC_JS_FILL_NEW)
        s = s.replace('await typeIntoField(inp, f.v, Math.min(1150, 260 + f.v.length * 26));', 'await typeIntoField(inp, f.v(), Math.min(1150, 260 + f.v().length * 26));')
        # card body
        a = s.index('    const show = ["name", "pan", "cin", "gstin", "type", "web", "addr"]')
        b = s.index('    foot = `${deepBtn}<span class="more">+3 more fields in Details</span>')
        newbody = (
          '    const done = S.profileFilled;\n'
          '    body = `<div class="kyc-top"><div class="kyc-lg"><span class="kyc-lab">Enterprise logo</span><div class="kyc-logo${done ? " is-in" : ""}" data-logo><span class="kl-ph">${IC.build}</span><img alt="Enterprise logo" src="' + logo + '"><i class="kl-edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></i></div></div>'
          '<div class="kyc-tt"><h3 class="r-h">Business Profile</h3><p class="r-p" data-pstat>${done ? "All 7 fields and your logo are filled. Check them, then submit." : "Pulling your details from DLT, GSTIN, MCA and your website…"}</p></div></div>\n'
          '      <div class="pform">${KYC.map((f) => `<div class="pf${f.wide ? " wide" : ""}${f.sel ? " is-sel" : ""} ${done ? "is-filled" : "is-waiting"}" data-k="${f.k}"><label for="pc-${f.k}">${esc(f.label)} <em>*</em><span class="src-tag">${esc(f.src)}</span></label><div class="pin-w"><input class="pin" id="pc-${f.k}" readonly tabindex="-1" value="${done ? esc(f.v()) : ""}">${f.sel ? `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>` : ""}</div></div>`).join("")}</div>\n'
          '      <label class="check"><input type="checkbox" id="pAuth" data-act="pauth" ${S.profileAuth ? "checked" : ""} ${done ? "" : "disabled"}><span><b>I\'m authorised to submit this KYC, and it\'s accurate.</b><small>The company accepts responsibility for any false or misleading information.</small></span></label>\n'
          '      ${whatIDid(i)}`;\n'
        )
        s = s[:a] + newbody + s[b:]
        s = s.replace('<span class="more">+3 more fields in Details</span>', '<span class="more">Edit anything in Details</span>')
        s = s.replace('Filled all 10 fields from 4 sources', 'Filled your logo and all 7 fields from 4 sources')
        s = s.replace('mini: "10 fields filled"', 'mini: "7 fields filled"')
        s = s.replace('All 10 fields are filled. Check them, then submit for approval.', 'All 7 fields and your logo are filled. Check them, then submit.')
        s = s.replace('<span>10 of 10 filled</span>', '<span>${PROFILE.length} of ${PROFILE.length} filled</span>')
    if 'rail' in name:
        a = s.index('    box.innerHTML = `<div class="ld"><div class="ld-crop"><iframe title="${esc(s.title)}: the agent at work"')
        endm = '<div class="segs">${s.checks.map(() => "<i></i>").join("")}</div></div>`;'
        b = s.index(endm, a) + len(endm)
        s = s[:a] + '    box.innerHTML = fxMarkup(i, s);' + s[b:]
        rdy = '  } else {\n    box.innerHTML = `<div class="res-a">'
        assert s.count(rdy) == 1
        s = s.replace(rdy, '  } else if ($("[data-fx]", box)) {\n    $("[data-fx]", box).classList.add("is-done");\n  } else {\n    box.innerHTML = `<div class="res-a">')
        for old, new in [
          ('await playLoader(i, run);', 'await playFx(i, run);'),
          ('await W(900); if (run !== S.runId) return;\n    el.classList.remove("is-analysing")', 'await W(220); if (run !== S.runId) return;\n    el.classList.remove("is-analysing")'),
          ('await W(1700); if (run !== S.runId) return;\n    el.classList.remove("is-done-flash");', 'await W(650); if (run !== S.runId) return;\n    el.classList.remove("is-done-flash");'),
        ]:
            assert s.count(old) == 1, old
            s = s.replace(old, new)
    o = 'function setMode(m) { S.mode = m; document.body.classList.toggle("mode-overview", m === "overview"); layout(); }'
    assert o in s
    s = s.replace(o, ('function setMode(m) { S.mode = m; document.body.classList.toggle("mode-overview", m === "overview" || m === "ring" || m === "ingest"); document.body.classList.toggle("mode-ring", m === "ring"); document.body.classList.toggle("mode-ingest", m === "ingest"); layout(); }' if 'rail' in name else 'function setMode(m) { S.mode = m; document.body.classList.toggle("mode-overview", m === "overview" || m === "ring"); document.body.classList.toggle("mode-ring", m === "ring"); layout(); }'))
    o2 = 'S.mode = "focus"; document.body.classList.remove("mode-overview");'
    assert o2 in s
    s = s.replace(o2, 'S.mode = "focus"; document.body.classList.remove("mode-overview", "mode-ring");')
    a = s.index('async function unlock(run) {'); b = s.index('function startReview() {')
    s = s[:a] + UNLOCK_JS + s[b:]
    s = s.replace('<title>DigiConsent Agent Deck Enhanced</title>', f'<title>{title}</title>')
    open(f'/home/user/AgenticSetup/{name}', 'w').write(s)
    print(name, len(s))

UNLOCK_JS = """async function unlock(run) {
  S.phase = "unlock";
  if (!$("#ringc")) stage.insertAdjacentHTML("beforeend", `<div class="ringc" id="ringc" hidden></div><div class="ringc ringcta" id="ringcta"><button class="go" id="ringGo" type="button">Start review<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>`);
  setMode("ring");
  head("Setup ready", "5 of 5 prepared", "Your five steps are ready for review", "The agent prepared everything. Look it over, change anything, then approve each step.", false);
  ripple($("#headBlob"), 2);
  await W(RM ? 0 : 700); if (run !== S.runId) return;
  setTimeout(() => { $("#ringc").classList.add("on"); $("#ringcta").classList.add("on"); }, RM ? 0 : 500); setTimeout(() => $("#ringGo").focus({ preventScroll: true }), RM ? 0 : 1500);
  for (let i = 0; i < 5; i++) {
    const el = card(i); el.classList.add("is-done-flash"); setTimeout(() => el.classList.remove("is-done-flash"), 1100);
    await W(150);
  }
}
if (!window.__ringBound) { window.__ringBound = 1; document.addEventListener("click", (e) => { if (!e.target.closest("#ringGo") || S.phase !== "unlock") return; $("#ringc").classList.remove("on"); $("#ringcta").classList.remove("on"); startReview(); }); }
"""
RAIL_C_CSS = r'''
/* the steps pill belongs to the review stage only */
body.v3c .rail3c{ opacity:0!important; pointer-events:none!important; }
body.v3c.ph-review .rail3c{ opacity:1!important; pointer-events:auto!important; }

/* steps as a horizontal pill at the top; no bottom arrows (Rail) */
body.v3c .deck{ inset:30px 0 0!important; } body.v3c.ph-review .deck{ inset:30px 0 92px!important; }
.cap3,.dots3{ display:none!important; }
.rail3c{ left:50%!important; top:auto!important; bottom:20px!important; margin:0!important; width:auto!important; height:56px; transform:translateX(-50%); flex-direction:row!important; align-items:center; gap:24px!important; padding:0 22px!important; border-radius:99px!important; }
.rail3c::before{ left:40px!important; right:40px!important; top:50%!important; bottom:auto!important; width:auto!important; height:2px!important; margin:-1px 0 0!important; }
.rc .lab{ left:50%!important; top:auto!important; bottom:calc(100% + 12px)!important; transform:translate(-50%,6px)!important; }
.rc:hover .lab,.rc:focus-visible .lab{ transform:translate(-50%,0)!important; }
.rc.on{ width:46px; height:46px; }

/* ---------- arc, podium, source tray (Rail) ---------- */
.sg{ position:absolute; inset:0; z-index:6; pointer-events:none; opacity:0; transition:opacity .7s var(--ease); --by:58%; --tt:80%; --tw:900px; }
.sg.is-in{ opacity:1; } .sg:not(.is-in){ transition-duration:.35s; }
.sg-svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.sg-arc{ fill:none; stroke:rgba(110,140,200,.28); stroke-width:1; stroke-dasharray:2 9; stroke-linecap:round; }
.sg-gd{ fill:none; stroke:rgba(100,130,195,.3); stroke-width:1.1; stroke-dasharray:1 7; stroke-linecap:round; transition:opacity .6s; }
.sg-glow{ fill:none; stroke:#4f84ff; stroke-width:6; stroke-linecap:round; opacity:.1; }
.sg-th{ fill:none; stroke:#4f84ff; stroke-width:1.7; stroke-linecap:round; filter:drop-shadow(0 0 5px rgba(79,132,255,.7)); }
.sg-st{ fill:none; stroke:#7aa5ff; stroke-width:.9; stroke-linecap:round; opacity:.7; }
.sg-dot{ position:absolute; left:0; top:0; width:30px; height:4px; margin:-2px 0 0 -15px; border-radius:4px; background:linear-gradient(90deg,rgba(79,132,255,0),#6f9bff 55%,#fff); box-shadow:0 0 10px 2px rgba(79,132,255,.55); offset-rotate:auto; opacity:0; }
.sg-rip{ position:absolute; width:140px; height:140px; border-radius:50%; border:1.5px solid rgba(79,132,255,.6); }
.sg-prip{ position:absolute; width:300px; height:46px; border-radius:50%; border:1.5px solid rgba(79,132,255,.55); }
.sg-hit{ position:absolute; width:90px; height:24px; border-radius:50%; border:1.5px solid rgba(79,132,255,.75); box-shadow:0 0 16px rgba(79,132,255,.5); }
.sg-beam{ position:absolute; left:50%; top:3%; bottom:calc(100% - var(--by)); width:min(520px,52%); transform:translateX(-50%); background:radial-gradient(ellipse 50% 100% at 50% 100%,rgba(90,140,255,.14),transparent 72%); -webkit-mask-image:linear-gradient(0deg,#000 30%,transparent); mask-image:linear-gradient(0deg,#000 30%,transparent); }
.sg .sg-orb{ left:50%; top:var(--by); width:140px; height:140px; margin:-70px 0 0 -70px; transform:translateY(24px) scale(.5); opacity:0; transition:transform 1.1s var(--ease),opacity .9s var(--ease); }
.sg.is-in .sg-orb{ transform:none; opacity:1; animation:sgfloat 5s ease-in-out 1.2s infinite; }
@keyframes sgfloat{ 0%,100%{ translate:0 0 } 50%{ translate:0 -5px } }
.sg .fx-orb::before{ border-top-color:#2f63ff; border-right-color:rgba(47,99,255,.25); filter:none; inset:-5px; }
.sg .fx-orb::after{ display:block; inset:-18px; border:1px dashed rgba(47,99,255,.22); }
.sg .fx-core{ inset:42px; box-shadow:0 0 calc(16px + var(--e,0) * 22px) calc(2px + var(--e,0) * 6px) rgba(70,120,255,.55),0 0 calc(36px + var(--e,0) * 50px) rgba(70,120,255,.28); }
.sg-pod{ position:absolute; left:50%; top:calc(var(--by) + 66px); width:300px; height:46px; margin-left:-150px; border-radius:50%; opacity:0; transform:scaleX(.6); transition:opacity 1s var(--ease),transform 1.2s var(--ease); background:radial-gradient(ellipse at 50% 35%,#fff 0,#eef2fb 52%,rgba(226,233,248,0) 71%); box-shadow:0 22px 38px -20px rgba(30,60,140,.4); }
.sg-pod::before,.sg-pod::after{ content:""; position:absolute; border-radius:50%; border:1px solid rgba(120,150,210,.38); }
.sg-pod::before{ inset:8px 36px; } .sg-pod::after{ inset:-10px -30px; border-color:rgba(120,150,210,.22); }
.sg.is-in .sg-pod{ opacity:1; transform:none; }
.sg-say{ position:absolute; left:50%; width:560px; margin-left:-280px; top:calc(var(--by) + 134px); text-align:center; display:flex; flex-direction:column; gap:9px; align-items:center; }
.sg-say em{ font:600 11px/1.3 var(--mono); letter-spacing:.15em; text-transform:uppercase; color:#6f7d99; font-style:normal; }
.sg-say b{ font-size:24px; line-height:1.2; font-weight:600; letter-spacing:-.02em; color:var(--ink); }
.sg-srcs{ position:absolute; inset:0; }
.sg-src{ position:absolute; width:130px; margin-left:-65px; margin-top:-29px; display:flex; flex-direction:column; align-items:center; gap:8px; opacity:0; transition:opacity .7s var(--ease),transform .8s var(--ease); }
.sg-src.is-l{ transform:translateX(-18px); } .sg-src.is-r{ transform:translateX(18px); } .sg-src.is-on{ opacity:1; transform:none; }
.sg-src b{ font:600 12.5px/1.2 var(--font); color:#5a6784; letter-spacing:-.005em; text-align:center; white-space:nowrap; transition:color .4s; }
.sg-ic{ position:relative; flex:none; width:58px; height:58px; border-radius:50%; display:grid; place-items:center; color:#3a4968; background:linear-gradient(180deg,#fff,#eef2fa); box-shadow:0 0 0 1px rgba(170,185,215,.75) inset,0 16px 26px -14px rgba(30,60,140,.5); transition:color .4s,box-shadow .5s,transform .5s var(--ease); }
.sg-ic svg{ width:24px; height:24px; }
.sg-ic u{ position:absolute; right:-3px; bottom:-3px; width:20px; height:20px; border-radius:50%; background:#16a34a; color:#fff; display:grid; place-items:center; transform:scale(0); transition:transform .45s var(--ease); box-shadow:0 0 0 3px #fff; text-decoration:none; } .sg-ic u svg{ width:10px; height:10px; }
.sg-src.is-active .sg-ic{ color:#2f63ff; transform:scale(1.1); box-shadow:0 0 0 1.5px rgba(79,132,255,.85) inset,0 0 0 7px rgba(79,132,255,.13),0 20px 32px -14px rgba(47,99,255,.6); }
.sg-src.is-active b{ color:var(--ink); }
.sg-src.is-done .sg-ic u{ transform:scale(1); }
.sg-ln{ fill:none; stroke:rgba(100,125,175,.55); stroke-width:1.3; stroke-linejoin:round; stroke-linecap:round; transition:stroke .4s; }
.sg-lane{ fill:none; stroke:rgba(110,135,185,.4); stroke-width:1.2; stroke-dasharray:7 9; animation:sglane 1.6s linear infinite; transition:stroke .4s; }
@keyframes sglane{ to{ stroke-dashoffset:-32 } }
.sg-rb.is-hot .sg-ln{ stroke:#4f84ff; stroke-width:2; filter:drop-shadow(0 0 5px rgba(79,132,255,.7)); } .sg-rb.is-hot .sg-lane{ stroke:#4f84ff; animation-duration:.7s; }
.sg-end{ fill:#6c85c4; } .sg-rb.is-hot .sg-end{ fill:#4f84ff; filter:drop-shadow(0 0 6px rgba(79,132,255,.9)); }
.sg-r1,.sg-r2{ position:absolute; border-radius:50%; pointer-events:none; }
.sg-r1{ inset:-16px; border:1px solid rgba(110,140,200,.5); box-shadow:0 0 0 1px rgba(255,255,255,.6) inset; } .sg-r2{ inset:-34px; border:1px solid rgba(110,140,200,.24); }
.mini .ig-pr{ display:none; width:64%; height:9px; border-radius:9px; background:rgba(120,150,210,.2); overflow:hidden; margin-top:2px; }
.mini .ig-pr i{ display:block; height:100%; width:100%; transform-origin:left; transform:scaleX(0); transition:transform .9s var(--ease); background:linear-gradient(90deg,#78aaff,#2f63ff); border-radius:9px; box-shadow:0 0 12px rgba(79,132,255,.7); }
body.mode-ingest .mini .ig-pr{ display:block; }
body.mode-ingest .mini .m-s{ min-height:26px; text-align:center; font-size:21px; color:#4d5b78; }
.card.is-hit .card-in{ box-shadow:0 0 0 2px rgba(79,132,255,.7),0 0 46px -4px rgba(79,132,255,.55),0 30px 50px -28px rgba(30,70,170,.5)!important; }
body.v3c.mode-ingest .deck-head{ min-height:0; height:0; padding:0; } body.v3c.mode-ingest .ah{ display:none; }
body.v3c.mode-ingest .stage{ -webkit-mask-image:none!important; mask-image:none!important; }

/* v2: source cards, caption text, fewer objects */
.fx-segs,.fx-pl{ display:none!important; }
.fx-orb::after{ display:none; }
.fx-orb{ width:128px; height:128px; margin:-64px 0 0 -64px; top:50%; }
.fx-core{ inset:36px; }
.fx-say{ position:absolute; left:0; right:0; top:22px; text-align:center; display:flex; flex-direction:column; gap:7px; align-items:center; padding:0 24px; z-index:3; }
.fx-say em{ font:600 10.5px/1 var(--mono); letter-spacing:.16em; text-transform:uppercase; color:#8fb4ff; font-style:normal; }
.fx-say b{ font-size:19px; line-height:1.25; font-weight:600; letter-spacing:-.015em; color:#fff; text-shadow:0 0 18px rgba(90,150,255,.55); }
.fx-prog{ top:calc(50% + 92px); width:min(240px,56%); }
.fx-card{ position:absolute; width:176px; padding:12px 13px 11px; border-radius:16px; opacity:0; will-change:transform,opacity; background:linear-gradient(160deg,rgba(78,124,250,.6),rgba(22,44,142,.66)); box-shadow:0 0 0 1px rgba(150,190,255,.55) inset,0 0 26px -2px rgba(80,140,255,.55),0 18px 36px -14px rgba(20,50,180,.9); backdrop-filter:blur(6px); color:#fff; }
.fx-card::after{ content:""; position:absolute; inset:0; border-radius:16px; background:linear-gradient(115deg,rgba(255,255,255,.22),transparent 38%); pointer-events:none; }
.fc-h{ display:flex; align-items:center; gap:9px; } .fc-h i{ flex:none; width:26px; height:26px; border-radius:8px; display:grid; place-items:center; background:rgba(255,255,255,.16); color:#dbe8ff; } .fc-h i svg{ width:15px; height:15px; }
.fc-h b{ font:600 13.5px/1.15 var(--font); letter-spacing:-.01em; }
.fc-l{ display:flex; flex-direction:column; gap:6px; margin:11px 0 10px; } .fc-l u{ display:block; height:5px; border-radius:4px; background:rgba(210,226,255,.3); } .fc-l u:nth-child(2){ width:82%; } .fc-l u:nth-child(3){ width:58%; }
.fx-card.is-read .fc-l u{ background:linear-gradient(90deg,rgba(210,226,255,.3) 0,rgba(255,255,255,.85) 50%,rgba(210,226,255,.3) 100%); background-size:220% 100%; animation:skel 1s linear infinite; }
.fc-s{ display:flex; align-items:center; gap:7px; font:600 10.5px/1 var(--mono); letter-spacing:.1em; text-transform:uppercase; color:#b9d0ff; } .fc-s span{ width:7px; height:7px; border-radius:50%; background:#8fd0ff; box-shadow:0 0 8px #8fd0ff; animation:beam 1s ease-in-out infinite; }
.fx-rows{ bottom:26px; }
.card:has(.fx) .tele{ display:none; }

/* ---------- agent ingest scene (Rail) ---------- */
body.v3c .fx{ position:relative; flex:1; min-height:0; margin:6px 18px 18px; border-radius:22px; overflow:hidden; opacity:0; transform:translateY(12px) scale(.985); transition:opacity .6s var(--ease),transform .8s var(--ease); background:radial-gradient(75% 95% at 50% 46%,#10297a 0,#08143f 52%,#040a24 100%); box-shadow:0 0 0 1px rgba(100,150,255,.5) inset,0 0 46px -8px rgba(59,110,255,.6) inset,0 26px 50px -26px rgba(20,50,170,.75); --e:0; }
body.v3c .fx.is-in{ opacity:1; transform:none; }
body.v3c .fx::before{ content:""; position:absolute; inset:0; background-image:linear-gradient(rgba(120,165,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(120,165,255,.07) 1px,transparent 1px); background-size:30px 30px; -webkit-mask-image:radial-gradient(70% 70% at 50% 46%,#000,transparent 85%); mask-image:radial-gradient(70% 70% at 50% 46%,#000,transparent 85%); pointer-events:none; }
.fx-glow{ position:absolute; inset:0; background:radial-gradient(55% 45% at 0% 0%,rgba(90,150,255,.4),transparent 62%),radial-gradient(50% 55% at 100% 100%,rgba(60,100,255,.34),transparent 62%); pointer-events:none; }
.fx-orb{ position:absolute; left:50%; top:47%; width:150px; height:150px; margin:-75px 0 0 -75px; transform:scale(.55); opacity:0; transition:transform .9s var(--ease),opacity .7s var(--ease); }
.fx.is-in .fx-orb{ transform:none; opacity:1; } .fx.is-out .fx-orb{ transform:translateY(var(--dy,-110px)) scale(.58); }
.fx-orb canvas{ position:absolute; inset:0; width:100%; height:100%; }
.fx-orb::before,.fx-orb::after{ content:""; position:absolute; border-radius:50%; pointer-events:none; }
.fx-orb::before{ inset:-4px; border:1.5px solid transparent; border-top-color:#79aaff; border-right-color:rgba(121,170,255,.35); animation:fxspin 2.6s linear infinite; filter:drop-shadow(0 0 6px rgba(100,160,255,.9)); }
.fx-orb::after{ inset:-18px; border:1px dashed rgba(121,170,255,.28); animation:fxspin 14s linear infinite reverse; }
.fx.is-proc .fx-orb::before{ animation-duration:.8s; }
@keyframes fxspin{ to{ transform:rotate(360deg); } }
.fx-core{ position:absolute; inset:44px; border-radius:50%; display:grid; place-items:center; color:#fff; background:radial-gradient(circle at 34% 28%,#cfe0ff 0,#5b8bff 42%,#1a3fc4 100%); box-shadow:0 0 calc(22px + var(--e) * 34px) calc(4px + var(--e) * 8px) rgba(80,130,255,.7),0 0 calc(60px + var(--e) * 70px) rgba(60,100,255,.38); transition:box-shadow .5s; }
.fx-core .ai-mark{ width:28px; height:28px; filter:drop-shadow(0 0 6px rgba(255,255,255,.7)); }
.fx-chips{ position:absolute; inset:0; pointer-events:none; }
.fx-chip{ position:absolute; display:flex; align-items:center; gap:8px; height:38px; padding:0 17px 0 8px; border-radius:99px; color:#eef4ff; font:600 13.5px/1 var(--font); white-space:nowrap; background:linear-gradient(180deg,rgba(54,98,228,.62),rgba(24,48,150,.6)); box-shadow:0 0 0 1px rgba(130,175,255,.5) inset,0 12px 26px -10px rgba(50,110,255,.9); opacity:0; will-change:transform,opacity; }
.fx-chip i{ width:24px; height:24px; border-radius:50%; display:grid; place-items:center; background:rgba(255,255,255,.14); color:#cfe0ff; } .fx-chip i svg{ width:13px; height:13px; }
.fx-rip{ position:absolute; width:150px; height:150px; border-radius:50%; border:1.5px solid rgba(130,180,255,.7); pointer-events:none; }
.fx-prog{ position:absolute; left:50%; top:calc(47% + 100px); width:min(260px,62%); transform:translate(-50%,8px); opacity:0; transition:opacity .4s,transform .5s var(--ease); }
.fx-prog.on{ opacity:1; transform:translate(-50%,0); }
.fx-pl{ display:flex; justify-content:space-between; font:600 10.5px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:#8fb4ff; margin-bottom:8px; } .fx-pl em{ font-style:normal; color:#dbe8ff; }
.fx-bar{ height:6px; border-radius:99px; background:rgba(120,165,255,.2); overflow:hidden; box-shadow:0 0 0 1px rgba(120,165,255,.25) inset; }
.fx-bar i{ display:block; height:100%; border-radius:99px; transform-origin:left; transform:scaleX(0); background:linear-gradient(90deg,#6aa8ff,#2f63ff); box-shadow:0 0 14px rgba(90,150,255,.95); }
.fx-rows{ position:absolute; left:7%; right:7%; bottom:40px; display:flex; flex-direction:column; gap:8px; }
.fx-row{ display:flex; align-items:center; gap:12px; height:42px; padding:0 14px; border-radius:14px; background:linear-gradient(180deg,rgba(54,98,228,.34),rgba(24,48,150,.3)); box-shadow:0 0 0 1px rgba(120,170,255,.38) inset; }
.fx-row b{ font-weight:500; color:#a9c1f5; font-size:12.5px; min-width:120px; } .fx-row span{ color:#fff; font-weight:600; font-size:13.5px; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fx-tg{ position:relative; width:36px; height:20px; border-radius:99px; background:rgba(90,130,235,.35); box-shadow:0 0 0 1px rgba(130,175,255,.35) inset; transition:background .3s; } .fx-tg::after{ content:""; position:absolute; left:3px; top:3px; width:14px; height:14px; border-radius:50%; background:#fff; transition:transform .35s var(--ease); box-shadow:0 0 8px rgba(160,200,255,.9); }
.fx-tg.on{ background:#4d83ff; } .fx-tg.on::after{ transform:translateX(16px); }
.fx-segs{ position:absolute; left:7%; right:7%; bottom:16px; display:flex; gap:6px; } .fx-segs i{ flex:1; height:3px; border-radius:3px; background:rgba(140,180,255,.2); transition:background .4s; } .fx-segs i.on{ background:#79aaff; } .fx-segs i.cur{ background:#79aaff; animation:beam 1.2s ease-in-out infinite; }
[data-analyse] .cap{ display:none; }
.fx.is-done .fx-segs i{ background:#5fe0a0; animation:none; }
/* header is gone while the agent works and in review; the blob lives in the card */
body.v3c.is-working .deck-head,body.v3c.ph-review .deck-head{ min-height:0; height:0; padding:0; }
body.v3c.is-working .ah,body.v3c.ph-review .ah{ display:none; }
.tele::before{ width:14px!important; height:14px!important; background:radial-gradient(circle at 34% 28%,#d6e5ff,#5b8bff 50%,#1d4ed8)!important; box-shadow:0 0 0 3px rgba(59,110,255,.16),0 0 12px rgba(80,130,255,.8)!important; }

/* no source tags on the profile fields (Rail only) */
body.v3c .pf label .src-tag{ display:none; }
/* review stage: the card carries the details, so the agent header keeps only the blob */
body.v3c.ph-review .deck-head{ min-height:96px; align-items:flex-start; padding-top:0; }
body.v3c.ph-review .ah{ flex-direction:column; align-items:center; justify-content:flex-start; }
body.v3c.ph-review .ah-t{ display:none; }
body.v3c.ph-review .ah .blob{ width:80px; height:80px; margin:0; }
body.v3c.ph-review .ah::before{ left:50%; top:50%; transform:translate(-50%,-50%); width:380px; height:150px; background:radial-gradient(closest-side,rgba(59,110,255,.2),rgba(59,110,255,0)); }

/* ---------- Version C: steps rail on the left, compact agent head ---------- */
body.v3c .deck{ left:100px; }
body.v3c .ah{ flex-direction:row; align-items:center; text-align:left; gap:14px; width:min(780px,100%); }
body.v3c .ah::before{ left:36px; top:-34px; width:260px; height:130px; transform:none; }
body.v3c .ah .blob{ width:64px; height:64px; margin:0; }
body.v3c .ah-t{ flex:1; width:auto; } body.v3c .ah-k{ justify-content:flex-start; }
body.v3c .ah h1{ font-size:24px; margin:2px 0 1px; } body.v3c .narr{ font-size:13.5px; }
body.v3c .stage{ -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 100%)!important; mask-image:linear-gradient(90deg,transparent 0,#000 9%,#000 100%)!important; }
body.v3c.mode-ring .stage{ -webkit-mask-image:none!important; mask-image:none!important; }
body.v3c .cap3{ left:calc(50% + 50px); }
.rail3c{ position:fixed; left:16px; top:50%; margin-top:-155px; width:66px; z-index:30; display:flex; flex-direction:column; align-items:center; gap:14px; padding:14px 0; border-radius:34px; background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(246,248,255,.75)); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); box-shadow:0 0 0 1px rgba(196,214,245,.85) inset,0 20px 40px -26px rgba(37,99,235,.45); opacity:0; transition:opacity .6s; pointer-events:none; }
body.deck-on .rail3c{ opacity:1; pointer-events:auto; }
.rail3c::before{ content:""; position:absolute; left:50%; top:36px; bottom:36px; width:2px; margin-left:-1px; background:rgba(120,150,210,.25); }
.rc{ position:relative; width:44px; height:44px; border:0; padding:0; border-radius:50%; background:#fff; color:#8a96b3; display:grid; place-items:center; box-shadow:0 0 0 1px rgba(196,214,245,.9) inset; cursor:default; z-index:1; transition:transform .25s var(--ease),background .3s,color .3s; }
.rc svg{ width:20px; height:20px; }
.rc.on{ width:50px; height:50px; background:linear-gradient(160deg,#4a78f7,#2554e6); color:#fff; box-shadow:0 0 0 4px rgba(59,107,245,.18),0 10px 22px -8px rgba(37,84,230,.7); }
.rc.done:not(.on){ color:#16a34a; background:#effaf3; box-shadow:0 0 0 1px rgba(110,200,150,.6) inset; }
.rc.lk{ opacity:.55; } .rc.run::after{ content:""; position:absolute; inset:-5px; border-radius:50%; border:2px solid rgba(37,99,235,.9); border-right-color:transparent; animation:spin 1s linear infinite; }
.rc.clk{ cursor:pointer; } .rc.clk:hover{ transform:scale(1.08); }
.rc .bd{ position:absolute; right:-3px; bottom:-3px; width:17px; height:17px; border-radius:50%; display:grid; place-items:center; background:#16a34a; color:#fff; box-shadow:0 0 0 2px #fff; } .rc .bd svg{ width:10px; height:10px; } .rc .bd.l{ background:#94a0b8; }
.rc .lab{ position:absolute; left:calc(100% + 12px); top:50%; transform:translate(-6px,-50%); display:flex; flex-direction:column; line-height:1.25; white-space:nowrap; padding:8px 14px 8px 12px; border-radius:99px; background:rgba(255,255,255,.97); box-shadow:0 0 0 1px rgba(196,214,245,.9) inset,0 14px 26px -14px rgba(37,84,230,.55); opacity:0; pointer-events:none; transition:opacity .2s,transform .25s var(--ease); }
.rc .lab b{ font-size:13px; font-weight:650; color:var(--ink); } .rc .lab i{ font-style:normal; font-size:11px; color:var(--muted); }
.rc:hover .lab,.rc:focus-visible .lab{ opacity:1; transform:translate(0,-50%); }
'''
RAIL_C_HTML = '<nav class="rail3c" id="rail3c" aria-label="Steps"></nav>'
RAIL_C_JS = r'''
/* ---------- agent ingest scene (Rail): sources fly into the blob, it processes, then furnishes the details ---------- */
const FX_ICO = {
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12 12 20 4 12V4h8z"/><circle cx="8.5" cy="8.5" r="1.2"/></svg>',
};
function fxMarkup(i, s) {
  return `<div class="fx" data-fx><span class="fx-glow"></span>
    <div class="fx-say" data-say><em data-kick>Collecting sources</em><b data-line2>Getting ready</b></div>
    <div class="fx-orb" data-orb><canvas></canvas><span class="fx-core">${AI_MARK}</span></div>
    <div class="fx-prog" data-prog><div class="fx-bar"><i></i></div></div>
    <div class="fx-rows" data-rows></div><div class="fx-chips" data-chips></div></div>
    <div class="cap" hidden><div class="cap-row"><span class="t run" data-line>${esc(s.checks[0][0])}</span><span class="n" data-n>1 of ${s.checks.length}</span></div><div class="segs">${s.checks.map(() => "<i></i>").join("")}</div></div>`;
}
function fxSphere(cv, speed, ok, pal) {
  const ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), S0 = cv.clientWidth || 150;
  cv.width = cv.height = Math.round(S0 * dpr);
  const pts = []; for (let k = 0; k < 130; k++) { const y = 1 - 2 * (k + .5) / 130, r = Math.sqrt(1 - y * y), th = k * 2.399963; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
  let ang = 0, last = performance.now();
  const frame = (t) => {
    if (!ok()) return;
    const dt = Math.min(.05, (t - last) / 1000); last = t; ang += dt * .9 * speed.v;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, S0, S0);
    const c = S0 / 2, R = S0 * .46, ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(.38), st = Math.sin(.38);
    for (const [x, y, z] of pts) {
      const X = x * ca + z * sa; let Z = -x * sa + z * ca; const Y = y * ct - Z * st; Z = y * st + Z * ct;
      const d = Math.max(0, Math.min(1, (Z + 1) / 2));
      ctx.globalAlpha = .22 + .78 * d; ctx.fillStyle = d > .6 ? (pal ? pal.near : "#bcd4ff") : (pal ? pal.far : "#6f9bff");
      ctx.beginPath(); ctx.arc(c + X * R, c + Y * R, .7 + 1.5 * d, 0, 6.2832); ctx.fill();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ---------- one scene for all five steps (Rail): cards on an arc above, the agent on its podium, all sources in one tray ---------- */
const IG_SRC = [
  { k: "dlt", name: "DLT registration", ico: "db", feeds: [0, 1, 3, 4] },
  { k: "gstin", name: "GSTIN", ico: "doc", feeds: [0] },
  { k: "mca", name: "MCA", ico: "doc", feeds: [0] },
  { k: "web", name: "Company website", ico: "globe", feeds: [0] },
  { k: "rates", name: "Partner rate cards", ico: "tag", feeds: [2], sub: "4 partners" },
  { k: "tpl", name: "DLT templates", ico: "doc", feeds: [4], sub: "100 templates" },
];
const IG_NEED = [4, 1, 1, 1, 2];
function igEnsure(el) {
  const m = $(".mini", el); if (!m) return;
  if (!$(".ig-pr", m)) m.insertAdjacentHTML("beforeend", '<div class="ig-pr"><i></i></div>');
}
async function analyseAll(run) {
  S.phase = "analyse"; S.active = 0;
  const cs = cards();
  cs.forEach((el, i) => { S.cards[i].st = "analysing"; S.cards[i].step = 0; el.classList.add("is-analysing"); igEnsure(el); setStatus(i); $("[data-mini]", el).textContent = "Waiting for sources"; $(".ig-pr i", el).style.transform = "scaleX(0)"; });
  const old = $("#sg"); if (old) old.remove();
  stage.insertAdjacentHTML("beforeend", `<div class="sg" id="sg"><span class="sg-beam"></span><svg class="sg-svg" data-svg></svg>
    <div class="sg-pod" data-pod></div><div class="fx-orb sg-orb" data-orb><span class="sg-r2"></span><span class="sg-r1"></span><canvas></canvas><span class="fx-core">${AI_MARK}</span></div>
    <div class="sg-say" data-say><em data-kick>Collecting sources</em><b data-line2>Getting ready</b></div><div class="sg-srcs" data-srcs></div></div>`);
  head("Onboarding Agent · working", "5 steps", "Preparing your setup", "Reading your sources", true);
  setMode("ingest");
  await W(560); if (run !== S.runId) return;
  layout();
  const sg = $("#sg"), svg = $("[data-svg]", sg), orb = $("[data-orb]", sg), pod = $("[data-pod]", sg), srcBox = $("[data-srcs]", sg), say = $("[data-say]", sg), kick = $("[data-kick]", sg), line2 = $("[data-line2]", sg);
  const ok = () => run === S.runId && sg.isConnected;
  const speed = { v: .7 };
  fxSphere($("canvas", orb), speed, () => sg.isConnected, { near: "#3a66e8", far: "#a9bff4" });
  const speak = (k, t) => {
    if (kick.textContent === k && line2.textContent === t) return;
    if (RM) { kick.textContent = k; line2.textContent = t; return; }
    say.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-6px)" }], { duration: 200, fill: "forwards" }).onfinish = () => {
      kick.textContent = k; line2.textContent = t;
      say.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
    };
  };
  const setCard = (i, text, p) => { const el = cs[i]; $("[data-mini]", el).textContent = text; $(".ig-pr i", el).style.transform = `scaleX(${p})`; };
  const finishCard = (i) => {
    S.cards[i].st = "ready"; S.cards[i].at = now(); setStatus(i); renderAnalyse(i);
    $(".ig-pr i", cs[i]).style.transform = "scaleX(1)"; cs[i].classList.add("is-done-flash"); setTimeout(() => cs[i].classList.remove("is-done-flash"), 1100);
  };
  const N = IG_SRC.length, got = [0, 0, 0, 0, 0];
  if (RM) { STEPS.forEach((_, i) => finishCard(i)); speak("Ready for review", "All five steps are prepared"); sg.classList.add("is-in"); await W(0); sg.remove(); unlock(run); return; }
  /* geometry from the live layout */
  const st0 = stage.getBoundingClientRect();
  const rel = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - st0.left, y: r.top - st0.top, w: r.width, h: r.height }; };
  svg.setAttribute("viewBox", `0 0 ${st0.width} ${st0.height}`); svg.setAttribute("width", st0.width); svg.setAttribute("height", st0.height);
  const ob = rel(orb), ox = ob.x + ob.w / 2, oy = ob.y + ob.h / 2, pb = rel(pod), px = pb.x + pb.w / 2, py = pb.y + pb.h / 2;
  /* sources: three round nodes on each side of the agent, always connected */
  const RIM = 86, NR = 29, offs = [[-222, -92], [-296, 0], [-222, 92]];
  const items = IG_SRC.map((src, k) => {
    const left = k < 3, row = k % 3, dx = offs[row][0], dy = offs[row][1];
    const x = ox + (left ? dx : -dx), y = oy + dy;
    const el = document.createElement("div"); el.className = `sg-src ${left ? "is-l" : "is-r"}`;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.innerHTML = `<i class="sg-ic">${FX_ICO[src.ico]}<u>${IC.check}</u></i><b>${esc(src.name)}</b>`;
    srcBox.appendChild(el);
    return { src, el, left, x, y, row };
  });
  const svgNS = "http://www.w3.org/2000/svg";
  const curve = (x1, y1, x2, y2, bend = .5, b2 = bend) => { const dy = y2 - y1; return `M${x1} ${y1} C ${x1} ${y1 + dy * bend}, ${x2} ${y2 - dy * b2}, ${x2} ${y2}`; };
  const mk = (cls, d, parent = svg) => { const p = document.createElementNS(svgNS, "path"); p.setAttribute("d", d); p.setAttribute("class", cls); parent.appendChild(p); return p; };
  const cardBot = (i) => { const r = rel(cs[i]); return [r.x + r.w / 2, r.y + r.h - 4]; };
  /* arcs behind the cards */
  [1, 2].forEach((n) => { const cr = rel(cs[2]); const R = Math.max(120, oy - cr.y - cr.h * .55) + n * 70; const a2 = mk("sg-arc", `M${ox - R} ${oy - 20} A ${R} ${R} 0 0 1 ${ox + R} ${oy - 20}`); a2.style.opacity = 0; a2.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, delay: 300 + n * 200, fill: "forwards" }); });
  /* a thin elbow line from every node to the ring, and a dashed lane running in from the edge */
  const ribbons = items.map((it) => {
    const g = document.createElementNS(svgNS, "g"); g.setAttribute("class", "sg-rb"); svg.appendChild(g);
    const sgn = it.left ? 1 : -1, ang = (it.row === 0 ? -38 : it.row === 2 ? 38 : 0) * Math.PI / 180;
    const rx2 = ox - sgn * RIM * Math.cos(ang), ry2 = oy + RIM * Math.sin(ang), x1 = it.x + sgn * NR, xm = x1 + sgn * 26;
    const d = `M${x1} ${it.y} L${xm} ${it.y} L${rx2} ${ry2}`;
    const far = it.left ? 20 : st0.width - 20, lane = `M${far} ${it.y} L${it.x - sgn * NR} ${it.y}`;
    const dash = mk("sg-lane", lane, g), ln = mk("sg-ln", d, g);
    const L = ln.getTotalLength(); ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L;
    const dot = document.createElementNS(svgNS, "circle"); dot.setAttribute("cx", rx2); dot.setAttribute("cy", ry2); dot.setAttribute("r", 3.4); dot.setAttribute("class", "sg-end"); dot.style.opacity = 0; g.appendChild(dot);
    dash.style.opacity = 0;
    return { g, ds: [d], ln, dash, dot, L };
  });
  const guideOut = STEPS.map((_, i) => { const [x, y] = cardBot(i); const d = curve(ox, oy - 68, x, y, .92, .3); const p = mk("sg-gd", d); p.style.opacity = 0; return p; });
  const bundle = (x1, y1, x2, y2, dur, bb = [.5, .5]) => {
    const g = document.createElementNS(svgNS, "g"); svg.appendChild(g);
    const defs = [["sg-glow", 0, 1], ["sg-th", 0, 1], ["sg-st", -.12, .55], ["sg-st", .12, .55]];
    const out = defs.map(([cls, off, op]) => { const d = curve(x1, y1, x2, y2, bb[0] + off, bb[1] - off), p = document.createElementNS(svgNS, "path"); p.setAttribute("d", d); p.setAttribute("class", cls); g.appendChild(p); const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.animate([{ strokeDashoffset: L, opacity: 0 }, { opacity: op, offset: .25 }, { strokeDashoffset: 0, opacity: op }], { duration: dur, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }); return d; });
    return { g, d: out[1], ds: out };
  };
  const unbundle = (b, delay = 0) => { b.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay, fill: "forwards" }).onfinish = () => b.g.remove(); };
  const comets = (ds, n, dur, gap) => {
    for (let j = 0; j < n; j++) {
      const d = ds[j % ds.length], c = document.createElement("i"); c.className = "sg-dot"; c.style.offsetPath = `path('${d}')`; sg.appendChild(c);
      const dd = dur * (.85 + Math.random() * .3);
      c.animate([{ offsetDistance: "0%", opacity: 0 }, { opacity: 1, offset: .14 }, { offsetDistance: "100%", opacity: 1, offset: .9 }, { offsetDistance: "100%", opacity: 0 }], { duration: dd, delay: j * gap, easing: "cubic-bezier(.5,.05,.45,.95)", fill: "both" }).onfinish = () => c.remove();
    }
  };
  const pulse = () => {
    orb.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }], { duration: 560, easing: "cubic-bezier(.16,1,.3,1)" });
    const rp = document.createElement("i"); rp.className = "sg-rip"; rp.style.left = `${ox}px`; rp.style.top = `${oy}px`; sg.appendChild(rp);
    rp.animate([{ transform: "translate(-50%,-50%) scale(.5)", opacity: .7 }, { transform: "translate(-50%,-50%) scale(2.2)", opacity: 0 }], { duration: 1000, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => rp.remove();
    const pr = document.createElement("i"); pr.className = "sg-prip"; pr.style.left = `${px}px`; pr.style.top = `${py}px`; sg.appendChild(pr);
    pr.animate([{ transform: "translate(-50%,-50%) scale(.7)", opacity: .75 }, { transform: "translate(-50%,-50%) scale(1.55)", opacity: 0 }], { duration: 1100, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => pr.remove();
  };
  const landing = (x, y) => {
    const h = document.createElement("i"); h.className = "sg-hit"; h.style.left = `${x}px`; h.style.top = `${y}px`; sg.appendChild(h);
    h.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: .9 }, { transform: "translate(-50%,-50%) scale(1.7)", opacity: 0 }], { duration: 800, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => h.remove();
  };
  /* act 1: the agent arrives, the sources appear around it and connect */
  sg.classList.add("is-in"); speak("Collecting sources", "Connecting to your sources");
  await sleep(800); if (!ok()) return;
  items.forEach((it, k) => setTimeout(() => ok() && it.el.classList.add("is-on"), k * 120));
  ribbons.forEach((r, k) => { r.ln.animate([{ strokeDashoffset: r.L, opacity: 0 }, { opacity: 1, offset: .2 }, { strokeDashoffset: 0, opacity: 1 }], { duration: 1000, delay: 300 + k * 110, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }); r.dash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 500 + k * 110, fill: "forwards" }); r.dot.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 900 + k * 110, fill: "forwards" }); });
  guideOut.forEach((p, k) => p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 700 + k * 90, fill: "forwards" }));
  await sleep(1500); if (!ok()) return;
  /* connected the whole time: a steady trickle of data from every source into the agent */
  const hot = new Set();
  const flow = setInterval(() => {
    if (!ok()) { clearInterval(flow); return; }
    const k = Math.floor(Math.random() * N); if (!hot.has(k) && Math.random() < .55) return;
    comets(ribbons[k].ds, 1, 1000, 0);
  }, 230);
  /* act 2: the agent reads each source, then sends what it learned up to the cards it feeds */
  const beat = async (k) => {
    const it = items[k], src = it.src; if (!ok()) return;
    speak(`Source ${k + 1} of ${N} · Feeds ${src.feeds.length} step${src.feeds.length > 1 ? "s" : ""}`, `Reading ${src.name}`);
    it.el.classList.add("is-active"); ribbons[k].g.classList.add("is-hot"); hot.add(k);
    src.feeds.forEach((i) => setCard(i, `Reading ${src.name}`, .72 * (got[i] / IG_NEED[i]) + .03));
    comets(ribbons[k].ds, 10, 900, 70);
    await sleep(1050); if (!ok()) return;
    pulse(); orb.style.setProperty("--e", (k + 1) / N);
    it.el.classList.remove("is-active"); it.el.classList.add("is-done"); ribbons[k].g.classList.remove("is-hot"); hot.delete(k);
    const outs = src.feeds.map((i) => { const [cx2, cy2] = cardBot(i); return { i, cx2, cy2, b: bundle(ox, oy - 68, cx2, cy2, 620, [.92, .3]) }; });
    await sleep(320); if (!ok()) return;
    outs.forEach(({ b }) => comets(b.ds, 7, 760, 90));
    await sleep(820); if (!ok()) return;
    outs.forEach(({ i, cx2, cy2, b }) => {
      got[i]++; cs[i].classList.add("is-hit"); setTimeout(() => cs[i].classList.remove("is-hit"), 900); landing(cx2, cy2);
      setCard(i, got[i] >= IG_NEED[i] ? "Sources read" : `Read ${got[i]} of ${IG_NEED[i]} sources`, .72 * (got[i] / IG_NEED[i]));
      unbundle(b, 120);
    });
  };
  await Promise.all(items.map((_, k) => sleep(k * 1700).then(() => ok() && beat(k)))); if (!ok()) return; await sleep(200);
  /* act 3: the agent puts it all together for every card at once */
  speed.v = 3; sg.classList.add("is-proc"); items.forEach((it, k) => { ribbons[k].g.classList.add("is-hot"); hot.add(k); });
  speak("Processing", "Putting your five steps together");
  const outs = STEPS.map((_, i) => { const [x, y] = cardBot(i); return { x, y, b: bundle(ox, oy - 68, x, y, 700, [.92, .3]) }; });
  await sleep(560); if (!ok()) return;
  outs.forEach(({ b }) => comets(b.ds, 8, 900, 160));
  STEPS.forEach((_, i) => setTimeout(() => ok() && setCard(i, "Processing", .97), i * 110));
  await sleep(2100); if (!ok()) return;
  outs.forEach(({ b, x, y }) => { unbundle(b); landing(x, y); });
  /* act 4: ready */
  clearInterval(flow); items.forEach((it, k) => ribbons[k].g.classList.remove("is-hot"));
  STEPS.forEach((_, i) => setTimeout(() => ok() && finishCard(i), i * 160));
  speak("Ready for review", "All five steps are prepared");
  await sleep(4 * 160 + 1200); if (!ok()) return;
  sg.classList.remove("is-in"); setTimeout(() => sg.remove(), 800); speed.v = 1;
  unlock(run);
}
analyse = analyseAll;

/* review phase flag for the compact header (Rail only) */
let phSeen = null;
setInterval(() => {
  const r = S.phase === "review" && S.mode === "focus";
  if (r === phSeen) return; phSeen = r;
  document.body.classList.toggle("ph-review", r);
  setTimeout(() => window.dispatchEvent(new Event("resize")), 450);
}, 150);

/* ---------- steps rail (version C) ---------- */
let railSig = "";
function railSync() {
  const r = $("#rail3c"); if (!r) return;
  const rev = S.phase === "review";
  const sig = [S.active, S.phase, S.cards.map((c, i) => c.st + (c.st === "review" && isLocked(i))).join()].join("|");
  if (sig === railSig) return; railSig = sig;
  r.innerHTML = STEPS.map((s, i) => {
    const c = S.cards[i], lk = c.st === "review" && isLocked(i), dn = c.st === "done";
    const run = c.st === "analysing" || c.st === "inreview";
    const txt = { queued: "Queued", analysing: "Agent is working", ready: "Ready", review: lk ? "Locked" : "Your review", done: "Done", later: "Saved for later", inreview: "In review" }[c.st] || "";
    const cls = ["rc", i === S.active ? "on" : "", dn ? "done" : "", lk ? "lk" : "", run ? "run" : "", rev && !lk && i !== S.active ? "clk" : ""].join(" ");
    return `<button class="${cls}" data-i="${i}" aria-label="${esc(s.title)}: ${txt}" ${rev && !lk ? "" : "tabindex=-1"}>${IC[s.key]}${dn ? `<span class="bd">${IC.check}</span>` : lk ? `<span class="bd l">${IC.lock}</span>` : ""}<span class="lab"><b>${esc(s.title)}</b><i>${txt}</i></span></button>`;
  }).join("");
}
$("#rail3c").addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b && S.phase === "review" && !(S.cards[+b.dataset.i].st === "review" && isLocked(+b.dataset.i))) focusCard(+b.dataset.i); });
setInterval(railSync, 250); railSync();
'''

make('agentic-setup-deck-3d-stage.html', 'v3a', A_CSS, ENV_A, RAIL_HTML, HUD_A,
     layout_js(36, 14, 150, '[1, .68, .54, .44, .38]', '[1, .78, .42, .18, .06]', 70, 90, '-12 * f'), 'DigiConsent Agent Deck 3D Stage')
make('agentic-setup-deck-3d-glass.html', 'v3b', B_CSS, ENV_B, CAP_HTML, HUD_B,
     faces_fix(layout_js(56, -118, 110, '[1, .7, .6, .52, .46]', '[1, .62, .38, .2, .08]', 0, 150, '-30 * f')), 'DigiConsent Agent Deck 3D Glass')

make('agentic-setup-deck-3d-glass-rail.html', 'v3b v3c', B_CSS + RAIL_C_CSS, ENV_B, CAP_HTML + RAIL_C_HTML, HUD_B + RAIL_C_JS,
     faces_fix(layout_js(56, -118, 110, '[1, .7, .6, .52, .46]', '[1, .62, .38, .2, .08]', 0, 64, '-4 * f')).replace('  if (S.mode === "ring") {', INGEST_LAYOUT + '  if (S.mode === "ring") {', 1), 'DigiConsent Agent Deck 3D Glass Rail')
