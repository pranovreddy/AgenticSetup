import re

def _unwrap(t):
    k = '</head><body>\n<!doctype html>'
    if t.startswith('<!doctype html><html><head><meta charset=utf8>') and k in t:
        t = t[t.index(k)+len('</head><body>\n'):]
        t = t[:t.rindex('</html>')+len('</html>')] + '\n'
    return t
src = _unwrap(open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail.html').read())

a = src.index("async function analyseAll(run) {")
endm = "analyse = analyseAll;\n"
b = src.index(endm, a) + len(endm)

NEW = r'''async function analyseAll(run) {
  S.phase = "analyse"; S.active = 0; window.__igActive = -1;
  const cs = cards();
  cs.forEach((el, i) => { S.cards[i].st = "analysing"; S.cards[i].step = 0; el.classList.add("is-analysing"); igEnsure(el, i); setStatus(i); $("[data-mini]", el).textContent = "Waiting"; $(".ig-pr i", el).style.transform = "scaleX(0)"; });
  const old = $("#sg"); if (old) old.remove();
  stage.insertAdjacentHTML("beforeend", `<div class="sg" id="sg"><span class="sg-beam"></span>
    <div class="tl" data-tlbox><div class="tl-h"><i></i><b>Agent telemetry</b><span>live</span></div><div class="tl-b" data-tl></div></div>
    <svg class="sg-svg" data-svg></svg><div class="sg-pod" data-pod></div>
    <div class="fx-orb sg-orb" data-orb><span class="sg-r4"></span><span class="sg-r3"></span><span class="sg-r2"></span><span class="sg-r1"></span><canvas></canvas><span class="fx-core">${AI_MARK}</span></div>
    <div class="sg-srcs" data-srcs></div></div>`);
  head("Onboarding Agent · working", "5 steps", "Preparing your setup", "Reading your sources", true);
  setMode("ingest");
  await W(560); if (run !== S.runId) return;
  layout();
  await W(1300); if (run !== S.runId) return;
  const sg = $("#sg"), svg = $("[data-svg]", sg), orb = $("[data-orb]", sg), pod = $("[data-pod]", sg), srcBox = $("[data-srcs]", sg), tlb = $("[data-tl]", sg);
  const ok = () => run === S.runId && sg.isConnected;
  const speed = { v: .7 };
  fxSphere($("canvas", orb), speed, () => sg.isConnected, { near: "#3a66e8", far: "#a9bff4" });
  const tele = (text, strong) => {
    const t = new Date(), hh = (n) => String(n).padStart(2, "0"), row = document.createElement("div");
    row.className = "tl-l" + (strong ? " is-s" : ""); row.innerHTML = `<time>${hh(t.getHours())}:${hh(t.getMinutes())}:${hh(t.getSeconds())}</time><b>${esc(text)}</b>`;
    tlb.appendChild(row);
    if (!RM) row.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" });
    while (tlb.children.length > 3) tlb.firstChild.remove();
    [...tlb.children].forEach((c, j, arr) => { c.style.opacity = String(.28 + .72 * ((j + 1) / arr.length)); });
  };
  const dotsOf = (i) => $$(".ig-dots i", cs[i]);
  const setCard = (i, text, nDots) => { const el = cs[i]; $("[data-mini]", el).textContent = text; if (nDots != null) dotsOf(i).forEach((d, j) => d.classList.toggle("on", j < nDots)); };
  const finishCard = (i) => { S.cards[i].st = "ready"; S.cards[i].at = now(); setStatus(i); renderAnalyse(i); dotsOf(i).forEach((d) => d.classList.add("on")); cs[i].classList.add("is-done-flash"); setTimeout(() => cs[i].classList.remove("is-done-flash"), 1100); };
  const N = IG_SRC.length, got = [0, 0, 0, 0, 0];
  if (RM) { STEPS.forEach((_, i) => finishCard(i)); tele("All five steps are prepared", true); sg.classList.add("is-in"); await W(0); sg.remove(); unlock(run); return; }
  const st0 = stage.getBoundingClientRect();
  const rel = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - st0.left, y: r.top - st0.top, w: r.width, h: r.height }; };
  svg.setAttribute("viewBox", `0 0 ${st0.width} ${st0.height}`); svg.setAttribute("width", st0.width); svg.setAttribute("height", st0.height);
  const ob = rel(orb), ox = ob.x + ob.w / 2, oy = ob.y + ob.h / 2, pb = rel(pod), px = pb.x + pb.w / 2, py = pb.y + pb.h / 2;
  const svgNS = "http://www.w3.org/2000/svg";
  const mk = (cls, d, parent = svg) => { const p = document.createElementNS(svgNS, "path"); p.setAttribute("d", d); if (cls) p.setAttribute("class", cls); parent.appendChild(p); return p; };
  /* two curved paths, one each side of the agent, like brackets around it; three sources ride each */
  const crx = Math.min(330, st0.width * .24), cry = Math.min(170, st0.height * .2), SPAN = 52;
  const cpt = (side, t) => { const a = (-SPAN + 2 * SPAN * t) * Math.PI / 180; return [ox + side * crx * Math.cos(a), oy + cry * Math.sin(a) / Math.sin(SPAN * Math.PI / 180) * Math.sin(SPAN * Math.PI / 180) * 1.0]; };
  const arcD = (side) => Array.from({ length: 31 }, (_, k) => { const [x, y] = cpt(side, -.16 + 1.32 * k / 30); return (k ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }).join(" ");
  const arcs = [-1, 1].map((side) => { const g = mk("s4-arcg", arcD(side)), l = mk("s4-arc", arcD(side)); [g, l].forEach((p, k) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1500, delay: 200 + k * 100, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }); }); return l; });
  const items = IG_SRC.map((src, k) => {
    const side = k < 3 ? -1 : 1, row = k % 3, t = (row + .5) / 3, [x, y] = cpt(side, t), el = document.createElement("div"); el.className = "s3-src s4-src " + (side < 0 ? "is-l" : "is-r");
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.innerHTML = `<i class="s3-ic">${FX_ICO[src.ico]}<u>${IC.check}</u></i><b>${esc(src.name)}</b>`;
    srcBox.appendChild(el); return { src, el, x, y };
  });
  const comet = (x1, y1, x2, y2, dur = 800, lift = 90) => {
    const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - lift, c = document.createElement("i"); c.className = "s3-dot";
    c.style.offsetPath = `path('M${x1} ${y1} Q ${mx} ${my}, ${x2} ${y2}')`; sg.appendChild(c);
    c.animate([{ offsetDistance: "0%", opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "scale(1)", offset: .18 }, { offsetDistance: "100%", opacity: 1, transform: "scale(.8)", offset: .92 }, { offsetDistance: "100%", opacity: 0, transform: "scale(.3)" }], { duration: dur, easing: "cubic-bezier(.45,.05,.4,1)", fill: "both" }).onfinish = () => c.remove();
  };
  const pulse = () => {
    orb.animate([{ transform: "scale(1)" }, { transform: "scale(1.09)" }, { transform: "scale(1)" }], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" });
    const rp = document.createElement("i"); rp.className = "sg-rip"; rp.style.left = `${ox}px`; rp.style.top = `${oy}px`; sg.appendChild(rp);
    rp.animate([{ transform: "translate(-50%,-50%) scale(.5)", opacity: .7 }, { transform: "translate(-50%,-50%) scale(2.2)", opacity: 0 }], { duration: 1000, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => rp.remove();
    const pr = document.createElement("i"); pr.className = "sg-prip"; pr.style.left = `${px}px`; pr.style.top = `${py}px`; sg.appendChild(pr);
    pr.animate([{ transform: "translate(-50%,-50%) scale(.7)", opacity: .75 }, { transform: "translate(-50%,-50%) scale(1.55)", opacity: 0 }], { duration: 1100, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => pr.remove();
  };
  /* the tether: one luminous beam from the agent to the card being processed, with light streaming along it */
  const tether = (tx, ty) => {
    const x1 = ox, y1 = oy - 104, dy = Math.max(40, y1 - ty), d = `M${x1} ${y1} C ${x1} ${y1 - dy * .55}, ${tx} ${ty + dy * .55}, ${tx} ${ty}`;
    const g = document.createElementNS(svgNS, "g"); g.setAttribute("class", "s4-tt"); svg.appendChild(g);
    const wide = mk("s4-tw", d, g), core = mk("s4-tc", d, g), L = core.getTotalLength();
    [wide, core].forEach((p) => { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 520, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }); });
    const ring = document.createElement("i"); ring.className = "s4-lock"; ring.style.left = `${tx}px`; ring.style.top = `${ty}px`; sg.appendChild(ring);
    const stream = setInterval(() => { if (!ok()) { clearInterval(stream); return; } const c = document.createElement("i"); c.className = "s3-dot s4-sm"; c.style.offsetPath = `path('${d}')`; sg.appendChild(c); c.animate([{ offsetDistance: "0%", opacity: 0 }, { opacity: 1, offset: .15 }, { offsetDistance: "100%", opacity: 1, offset: .92 }, { offsetDistance: "100%", opacity: 0 }], { duration: 760, easing: "linear", fill: "both" }).onfinish = () => c.remove(); }, 95);
    return { end() { clearInterval(stream); g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: "forwards" }).onfinish = () => g.remove(); ring.animate([{ opacity: 1, transform: "translate(-50%,-50%) scale(1)" }, { opacity: 0, transform: "translate(-50%,-50%) scale(1.8)" }], { duration: 600, fill: "forwards" }).onfinish = () => ring.remove(); } };
  };
  /* act 1 */
  sg.classList.add("is-in"); tele("Agent online · connecting to your sources", true);
  await sleep(900); if (!ok()) return;
  items.forEach((it, k) => setTimeout(() => ok() && it.el.classList.add("is-on"), 200 + (k % 3) * 130 + (k > 2 ? 60 : 0)));
  await sleep(1300); if (!ok()) return;
  /* act 2: read every source in turn */
  for (let k = 0; k < N; k++) {
    const it = items[k], src = it.src; if (!ok()) return;
    it.el.classList.add("is-active"); tele(src.tl[0]);
    await sleep(380); if (!ok()) return;
    comet(it.x + (it.x < ox ? 30 : -30), it.y, ox, oy + 30, 760, 60);
    await sleep(520); if (!ok()) return;
    tele(src.tl[1], true);
    await sleep(300); if (!ok()) return;
    pulse(); orb.style.setProperty("--e", (k + 1) / N);
    it.el.classList.remove("is-active"); it.el.classList.add("is-done");
    src.feeds.forEach((i) => { got[i]++; dotsOf(i).forEach((d, j) => d.classList.toggle("on", j < got[i])); setCard(i, got[i] >= IG_NEED[i] ? "Sources read" : `Read ${got[i]} of ${IG_NEED[i]}`); });
    await sleep(200);
  }
  /* act 3: the agent locks onto each card in turn, the card turns to it and is processed */
  speed.v = 2.4;
  const rect0 = cs.map((el) => rel(el));
  for (let i = 0; i < 5; i++) {
    if (!ok()) return;
    window.__igActive = i; const el = cs[i];
    tele(IG_CARD_TL[i], true); setCard(i, "Processing");
    const feeders = items.filter((it) => it.src.feeds.includes(i));
    feeders.forEach((it) => it.el.classList.add("is-feed"));
    el.classList.add("is-proc");
    const lift = el.animate([{ rotate: "y 0deg", translate: "0 0 0px" }, { rotate: "y 360deg", translate: "0 6px 150px" }], { duration: 1000, easing: "cubic-bezier(.45,.05,.2,1)", fill: "forwards" });
    await sleep(620); if (!ok()) return;
    const r = rect0[i], tt = tether(r.x + r.w / 2, r.y + r.h + 6);
    const feed = setInterval(() => { if (!ok()) { clearInterval(feed); return; } const it = feeders[Math.floor(Math.random() * feeders.length)]; comet(it.x + (it.x < ox ? 30 : -30), it.y, ox, oy + 30, 640, 50); }, 300);
    pulse();
    await sleep(1500); if (!ok()) return;
    clearInterval(feed); tt.end();
    finishCard(i); el.classList.remove("is-proc"); el.classList.add("is-ready");
    feeders.forEach((it) => it.el.classList.remove("is-feed"));
    lift.finished.then(() => el.animate([{ rotate: "y 360deg", translate: "0 6px 150px" }, { rotate: "y 360deg", translate: "0 0 0px" }], { duration: 650, easing: "cubic-bezier(.3,.6,.3,1)", fill: "forwards" }));
    await sleep(520);
  }
  window.__igActive = -1;
  tele("All five steps are prepared", true); speed.v = 1;
  await sleep(1300); if (!ok()) return;
  sg.classList.remove("is-in"); setTimeout(() => sg.remove(), 800);
  cs.forEach((el) => el.getAnimations().forEach((an) => an.cancel()));
  unlock(run);
}
analyse = analyseAll;
'''
out = src[:a] + NEW + src[b:]

# blob lower
old = 'sgEl.style.setProperty("--by", `${H * .6}px`);'
assert old in out
out = out.replace(old, 'sgEl.style.setProperty("--by", `${H * .685}px`);')
# card row a touch higher so the beam has room
out = out.replace("yc = H * .36 - H / 2;", "yc = H * .325 - H / 2;")

css = r'''
/* ---- variant: curved source paths either side of the agent, tether beam to the active card ---- */
.s4-arcg{ fill:none; stroke:rgba(79,132,255,.3); stroke-width:34; stroke-linecap:round; filter:blur(14px); }
.s4-arc{ fill:none; stroke:url(#ga4); stroke-width:2.2; stroke-linecap:round; stroke:rgba(79,132,255,.55); }
.s4-src{ width:132px; margin-left:-66px; margin-top:-34px; }
.s4-src.is-l{ transform:translateX(-20px) scale(.92); } .s4-src.is-r{ transform:translateX(20px) scale(.92); } .s4-src.is-on{ transform:none; }
.s4-src .s3-ic{ width:70px; height:70px; }
.s4-tw{ fill:none; stroke:#4f84ff; stroke-width:22; stroke-linecap:round; opacity:.2; filter:blur(7px); }
.s4-tc{ fill:none; stroke:#2f63ff; stroke-width:3.4; stroke-linecap:round; filter:drop-shadow(0 0 6px rgba(79,132,255,.9)); }
.s4-sm{ width:9px; height:9px; margin:-4.5px 0 0 -4.5px; box-shadow:0 0 14px 4px rgba(79,132,255,.55); }
.s4-lock{ position:absolute; width:96px; height:96px; margin:0; border-radius:50%; border:2px solid rgba(47,99,255,.7); box-shadow:0 0 30px rgba(79,132,255,.55),inset 0 0 20px rgba(79,132,255,.25); transform:translate(-50%,-50%); animation:lockp 1s ease-in-out infinite; }
@keyframes lockp{ 0%,100%{ transform:translate(-50%,-50%) scale(.9); opacity:.9 } 50%{ transform:translate(-50%,-50%) scale(1.12); opacity:.5 } }
.s3-band,.s3-bandg,.s3-fill,.s3-edge{ display:none; }
.sg{ z-index:30!important; }
'''
i = out.rindex('</style>', 0, out.index('</head>'))
out = out[:i] + css + out[i:]
out = out.replace('<title>DigiConsent Agent Deck 3D Glass Rail</title>', '<title>DigiConsent Agent Deck 3D Glass Rail Tether</title>')
open('/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-tether.html', 'w').write(out)
print('written', len(out))
