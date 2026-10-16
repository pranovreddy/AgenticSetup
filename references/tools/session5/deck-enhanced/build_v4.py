import re
src=open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail.html').read()
s=src
def rep(old,new,cnt=1):
    global s
    assert s.count(old)>=1, 'missing: '+old[:80]
    s=s.replace(old,new) if cnt==0 else s.replace(old,new,cnt)

# 1. original per-card loaders back in the cards
rep("    box.innerHTML = fxMarkup(i, s);\n","""    box.innerHTML = `<div class="ld"><div class="ld-crop"><iframe title="${esc(s.title)}: the agent at work" tabindex="-1" aria-hidden="true"></iframe></div></div>
      <div class="cap"><div class="cap-row"><span class="sp"></span><span class="t run" data-line>${esc(s.checks[0][0])}</span><span class="n" data-n>1 of ${s.checks.length}</span></div>
      <div class="segs">${s.checks.map(() => "<i></i>").join("")}</div></div>`;
""")
rep("await playFx(i, run);","await playLoader(i, run);")
rep("    await W(450); if (run !== S.runId) return;\n    await playLoader","    await W(300); if (run !== S.runId) return;\n    await playLoader")
rep("    await W(220); if (run !== S.runId) return;\n    el.classList.remove(\"is-analysing\")","    await W(400); if (run !== S.runId) return;\n    el.classList.remove(\"is-analysing\")")
rep("    await W(650); if (run !== S.runId) return;\n    el.classList.remove(\"is-done-flash\");","    await W(900); if (run !== S.runId) return;\n    el.classList.remove(\"is-done-flash\");")
rep("analyse = analyseAll;\n","")
# progress caption while the agent works
rep('async function analyse(run) {\n  S.phase = "analyse"; S.active = 0; setMode("focus");','async function analyse(run) {\n  S.phase = "analyse"; S.active = 0; setMode("focus"); procCap("Your agent is preparing all five steps");')
rep('    head("Onboarding Agent · working", `${i + 1} of 5`, "Preparing your setup", s.checks[0][0], true, s.title);','    head("Onboarding Agent · working", `${i + 1} of 5`, "Preparing your setup", s.checks[0][0], true, s.title); procCap(`Preparing step ${i + 1} of 5 · ${s.title}`);')

# 2. speed shim inside the loader scenes (about 1.45x faster)
rep('.replace("</head>", `<style>.copy{visibility:hidden !important}','.replace("<head>", `<head><script>(function(){var K=1.7,st=window.setTimeout.bind(window);window.setTimeout=function(f,ms){var a=[].slice.call(arguments,2);return st.apply(null,[f,(ms||0)/K].concat(a));};var an=Element.prototype.animate;Element.prototype.animate=function(fr,o){if(o&&typeof o===\"object\"){o=Object.assign({},o);if(typeof o.duration===\"number\")o.duration=Math.max(1,o.duration/K);if(typeof o.delay===\"number\")o.delay=o.delay/K;}else if(typeof o===\"number\"){o=o/K;}return an.call(this,fr,o);};var si=window.setInterval.bind(window);window.setInterval=function(f,ms){var a=[].slice.call(arguments,2);return si.apply(null,[f,(ms||0)/K].concat(a));};function fx(){try{document.getAnimations().forEach(function(a){if(((window.CSSTransition&&a instanceof CSSTransition)||(window.CSSAnimation&&a instanceof CSSAnimation))&&a.playbackRate!==K)a.playbackRate=K;});}catch(e){}requestAnimationFrame(fx);}requestAnimationFrame(fx);})();<\\/script>`).replace("</head>", `<style>.copy{visibility:hidden !important}')

rep('const playLoader = (i, run) => runScene($(".ld", card(i)), STEPS[i].loader, LD_BOX[STEPS[i].loader], run, (n) => capStep(i, Math.max(S.cards[i].step, n)));','const playLoader = (i, run) => runScene($(".ld", card(i)), STEPS[i].loader, LD_BOX[STEPS[i].loader], run, (n) => capStep(i, Math.max(S.cards[i].step, n)), undefined, 7600);')
rep('return LOADER_DOC.replace("__AG_ID__", id)','return LOADER_DOC.replace("(now - s) / ms", "(now - s) / (ms / 1.7)").replace("__AG_ID__", id)')
rep('function resetAll() {\n  S.runId++;','function resetAll() {\n  document.body.classList.remove("all-closed"); { const r0 = document.getElementById("readyL"); if (r0) r0.remove(); const pc = document.getElementById("pcap"); if (pc) pc.remove(); }\n  S.runId++;')
rep('function startReview() {\n','function startReview() {\n  document.body.classList.remove("all-closed"); { const r0 = document.getElementById("readyL"); if (r0) { r0.classList.remove("on"); setTimeout(() => r0.remove(), 600); } }\n')
# 3. closed cards + left title instead of the ready row
a=s.index("async function unlock(run) {")
b=s.index("function startReview() {")
NEW=r'''function procCap(t) {
  let c = $("#pcap");
  if (!t) { if (c) { c.classList.remove("on"); setTimeout(() => c.remove(), 500); } return; }
  if (!c) { document.body.insertAdjacentHTML("beforeend", '<div class="pcap" id="pcap"><i></i><span></span></div>'); c = $("#pcap"); void c.offsetWidth; c.classList.add("on"); }
  $("span", c).textContent = t;
}
async function unlock(run) {
  S.phase = "unlock"; procCap(null);
  if (!$("#readyL")) stage.insertAdjacentHTML("beforeend", `<div class="rdl" id="readyL"><span class="rdl-k"><i></i>5 of 5 prepared</span><h2>Your five steps are ready for review</h2><p>The agent has done the groundwork. Open each step, check it and approve.</p>
    <ul class="rdl-l">${STEPS.map((s) => `<li><span>${IC[s.key]}</span><b>${esc(s.title)}</b><em>${esc(s.mini)}</em></li>`).join("")}</ul>
    <button class="rdl-go" id="rdlGo" type="button">Review them<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>`);
  head("Setup ready", "5 of 5", "Your five steps are ready for review", "", false);
  document.body.classList.add("all-closed");
  S.mode = "focus"; document.body.classList.remove("mode-overview", "mode-ring");
  cards().forEach((el) => el.classList.remove("is-analysing", "is-done-flash"));
  S.active = 2; layout(); faceSig = ""; faces();
  setTimeout(() => { const r = $("#readyL"); if (r) { r.classList.add("on"); $("#rdlGo").focus({ preventScroll: true }); } }, RM ? 0 : 700);
}
if (!window.__rdlBound) { window.__rdlBound = 1; document.addEventListener("click", (e) => { if (!e.target.closest("#rdlGo") || S.phase !== "unlock") return; const r = $("#readyL"); r.classList.remove("on"); setTimeout(() => r.remove(), 600); document.body.classList.remove("all-closed"); startReview(); }); }
'''
s=s[:a]+NEW+s[b:]

# layout: closed cards are smaller and sit right of the left title
rep("function dims(i) {\n","function dims(i) {\n  if (document.body.classList.contains(\"all-closed\")) return [CW + 40, CH + 30];\n")
rep("translate3d(${dir * x * f}px, ${-4 * f}px, ${z}px)","translate3d(${dir * x * f + (document.body.classList.contains(\"all-closed\") ? Math.max(r.width * .16, 170) : 0)}px, ${-4 * f}px, ${z}px)")

# face carries the result in plain words
rep('<div class="cf-mid"><h3>${esc(s.title)}</h3><span class="cf-st','<div class="cf-mid"><h3>${esc(s.title)}</h3>${c.st === "ready" || c.st === "review" || c.st === "done" ? `<p class="cf-res">${esc(s.mini)}</p>` : ""}<span class="cf-st')

css=r'''
/* ---- cards variant: per-card processing, closed cards with a left title ---- */
body.v3b.all-closed .card.is-focus .card-in{ transform:rotateY(180deg); }
body.v3b.all-closed .card.is-focus .cardf{ transform:rotateY(360deg); }
body.all-closed .deck-head{ min-height:0!important; height:0!important; padding:0!important; } body.all-closed .ah,body:has(#readyL.on) .ah{ display:none!important; } body:has(#readyL.on) .deck-head{ min-height:0!important; height:0!important; padding:0!important; }
body.v3c.all-closed .stage,body.v3c.all-closed .stage{ -webkit-mask-image:none!important; mask-image:none!important; }
.cf-res{ margin:-2px 0 14px; font-size:15px; opacity:.92; letter-spacing:-.005em; }
.pcap{ position:fixed; left:50%; top:20px; z-index:45; transform:translate(-50%,-10px); opacity:0; display:flex; align-items:center; gap:10px; height:42px; padding:0 20px 0 16px; border-radius:99px; background:linear-gradient(180deg,rgba(255,255,255,.94),rgba(240,244,252,.84)); box-shadow:0 0 0 1px rgba(170,185,215,.7) inset,0 20px 34px -22px rgba(30,60,140,.5); font-size:14px; font-weight:600; color:var(--ink); letter-spacing:-.01em; transition:opacity .5s var(--ease),transform .6s var(--ease); }
.pcap.on{ opacity:1; transform:translate(-50%,0); } .pcap i{ width:9px; height:9px; border-radius:50%; background:#2f63ff; box-shadow:0 0 0 4px rgba(47,99,255,.18),0 0 12px rgba(47,99,255,.8); animation:beam 1.2s ease-in-out infinite; }
.rdl{ position:absolute; left:116px; top:50%; width:min(360px,30%); z-index:60; transform:translate(-14px,-50%); opacity:0; pointer-events:none; transition:opacity .7s var(--ease),transform .9s var(--ease); }
.rdl.on{ opacity:1; transform:translate(0,-50%); pointer-events:auto; }
.rdl-k{ display:inline-flex; align-items:center; gap:8px; font:600 11px/1 var(--mono); letter-spacing:.14em; text-transform:uppercase; color:#2f63ff; } .rdl-k i{ width:8px; height:8px; border-radius:50%; background:#16a34a; box-shadow:0 0 0 4px rgba(22,163,74,.16); }
.rdl h2{ margin:14px 0 10px; font-size:36px; line-height:1.08; letter-spacing:-.03em; font-weight:650; color:var(--ink); }
.rdl p{ margin:0 0 20px; font-size:15px; line-height:1.5; color:var(--muted); }
.rdl-l{ list-style:none; margin:0 0 24px; padding:0; display:flex; flex-direction:column; gap:8px; }
.rdl-l li{ display:flex; align-items:center; gap:12px; height:46px; padding:0 14px 0 8px; border-radius:16px; background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(240,244,252,.78)); box-shadow:0 0 0 1px rgba(170,185,215,.6) inset; }
.rdl-l li span{ width:30px; height:30px; border-radius:10px; display:grid; place-items:center; color:#2f63ff; background:linear-gradient(160deg,#e3ebff,#f6f8ff); } .rdl-l li span svg{ width:16px; height:16px; }
.rdl-l li b{ font-size:14px; font-weight:600; color:var(--ink); } .rdl-l li em{ margin-left:auto; font-style:normal; font-size:12.5px; color:#15803d; font-weight:600; }
@media (max-height:760px){ .rdl-l{ display:none; } .rdl h2{ font-size:30px; } .rdl p{ margin-bottom:16px; } }
.rdl-go{ height:50px; padding:0 26px; border:0; border-radius:99px; background:linear-gradient(180deg,#3f6ef6,#2554e6); color:#fff; font:600 15px/1 var(--font); display:inline-flex; align-items:center; gap:10px; cursor:pointer; box-shadow:0 16px 30px -12px rgba(37,84,230,.8); transition:transform .25s var(--ease),box-shadow .25s; } .rdl-go:hover{ transform:translateY(-2px); box-shadow:0 20px 34px -12px rgba(37,84,230,.9); } .rdl-go svg{ width:17px; height:17px; }
/* what was done: a clearer result block */
.res-a{ padding:18px 20px!important; border-radius:18px!important; background:linear-gradient(135deg,rgba(51,102,240,.1),rgba(46,182,245,.06))!important; }
.res-a .v{ font-size:20px!important; letter-spacing:-.02em!important; }
.plan li.ok{ font-size:14px; } .plan li.ok i{ width:20px!important; height:20px!important; }
'''
# 7. prototype menu: jump straight to the ready-for-review screen; clicking a closed card also starts review
rep('    <button data-jump="review">Review cards</button>','    <button data-jump="ready">Ready for review</button>\n    <button data-jump="review">Review cards</button>')
rep('  if (where === "analyse") {\n','  if (where === "ready") {\n    STEPS.forEach((s, i) => { S.cards[i].st = "ready"; renderAnalyse(i); });\n    S.phase = "analyse"; setMode("overview"); const run = S.runId;\n    setTimeout(() => run === S.runId && unlock(run), 200); return;\n  }\n  if (where === "analyse") {\n')
rep('if (!window.__rdlBound) { window.__rdlBound = 1; document.addEventListener("click", (e) => { if (!e.target.closest("#rdlGo") ||','if (!window.__rdlBound) { window.__rdlBound = 1; document.addEventListener("click", (e) => { if (!(e.target.closest("#rdlGo") || (document.body.classList.contains("all-closed") && e.target.closest(".card"))) ||')

i=s.rindex('</style>',0,s.index('</head>'))
s=s[:i]+css+s[i:]
s=s.replace('<title>DigiConsent Agent Deck 3D Glass Rail</title>','<title>DigiConsent Agent Deck 3D Glass Rail Cards</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-cards.html','w').write(s); print('ok',len(s))
