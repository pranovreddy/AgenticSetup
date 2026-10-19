"""Builds agentic-setup-cards-ux.html from agentic-setup-cards.html: UI/UX audit fixes only, the source stays untouched."""
import pathlib
root = pathlib.Path(__file__).resolve().parents[5]
h = (root / "agentic-setup-cards.html").read_text()

def sub(old, new):
    global h
    assert h.count(old) == 1, (h.count(old), old[:60])
    h = h.replace(old, new)

CSS = r"""<style id="ux-audit">
/* UX audit fixes. 1 contrast, 2 focus, 3 touch targets, 4 narrow screens, 5 text size, 6 reduced motion */
:root{ --faint:#66708a; }
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{ outline:2px solid #2563eb; outline-offset:2px; border-radius:inherit; }
.btn-p:focus-visible,.rdl-go:focus-visible{ outline-color:#0b1220; outline-offset:3px; }
.proto > button{ height:36px; padding:0 16px; font-size:12.5px; color:#475066; }
.rail3c button{ position:relative; } .rail3c button::after{ content:""; position:absolute; inset:-8px -14px; }
.fchip,.rchips .fchip{ min-height:30px; }
.gate{ grid-template-columns:minmax(0,1fr); } .gate-card,.gate-body,.doc-wrap,.gate-head > div{ min-width:0; }
.tabs{ max-width:100%; overflow-x:auto; scrollbar-width:none; } .tab,.tabs button{ white-space:nowrap; min-height:40px; }
.doc-foot span{ color:#475066; }
.q-note,.gate-meta,.ah-k .n{ color:#5d6780; }
body.phase-finale .cf-mid h3{ font-size:31px; } body.phase-finale .cf-res{ font-size:25px; opacity:1; }
/* review: step label and the side cards on the right are readable */
.card .c-head .c-n{ font-size:16px; } .card [data-review] input:not([type=checkbox]),.card [data-review] select,.card [data-review] textarea{ font-size:16px!important; }
body.ph-review .cf-v{ width:90px; gap:16px; } body.ph-review .cf-v b{ font-size:34px; } body.ph-review .cf-v em{ font-size:20px; opacity:1; } body.ph-review .cf-st{ font-size:19px; height:38px; }
/* the vertical stepper left of the review text is removed */
body.has-tband .tband .h-steps{ display:none!important; }
/* enterprise logo 1.5x (112x96 -> 168x144) */
.card [data-review] .kyc-logo{ width:168px; height:144px; border-radius:20px; } .kyc-logo .kl-edit{ width:30px; height:30px; } .kyc-logo .kl-ph svg{ width:38px; height:38px; }
/* review text sits 40px from the left edge, just right of the logo pill edge */
@media (min-width:861px){ body.has-tband .tband .hero-in{ padding-left:40px!important; } }
/* review text consistency: one size per role (labels and body 16, brand names 18, headings 22/30), buttons one weight */
.card [data-review] .btree b,.card [data-review] .ent2-h b{ font-size:18px!important; }
.card [data-review] ~ * .btn,.card .card-foot .btn,.card [data-act].btn{ font-weight:600; }
/* skipped steps on the finished page: light blue instead of grey */
.cardf.s-skipped,body[class*="dk-"] .cardf.s-skipped,body.dk-6 .cardf.s-skipped{ background:linear-gradient(170deg,#e3eeff,#b4cffb)!important; box-shadow:0 0 0 1px rgba(255,255,255,.7) inset,0 24px 44px -26px rgba(37,99,235,.35)!important; color:#1e3a8a!important; }
.cardf.s-skipped .cf-res,.cardf.s-skipped .cf-mid h3,.cardf.s-skipped .cf-bot{ color:#1e3a8a!important; }
.cardf.s-skipped .cf-top .cf-st{ background:rgba(255,255,255,.75)!important; color:#1e40af!important; box-shadow:0 0 0 1px rgba(37,99,235,.25) inset!important; }
.cardf.s-skipped .cf-art svg g{ stroke:#2563eb!important; opacity:.5; }
body.phase-finale .cf-st{ font-size:16px; height:34px; }
@media (max-width:1180px){ .rdl{ left:92px; width:min(300px,28%); } .rdl h2{ font-size:29px; } .rdl p{ font-size:14px; } }
@media (max-width:860px){
  .hdr{ top:10px!important; left:10px!important; flex-direction:row!important; gap:8px!important; padding:6px!important; border-radius:30px!important; }
  .hdr .mk{ width:40px; height:40px; } .hdr .mk img{ width:21px; } .hdr .me .usr-av{ transform:scale(.86); }
  body.phase-gate .gate,.gate{ inset:72px 10px 10px 10px!important; padding:0!important; } .gate-card{ border-radius:16px; }
  .gate-head{ padding:16px 16px 0; gap:8px; } .gate-head h1{ font-size:21px; } .gate-head p{ font-size:12.5px; margin-bottom:10px; }
  .gate-sum{ max-height:26vh; padding:14px 16px; gap:10px; } .gate-sum .prose{ font-size:15px; line-height:1.55; } .gate-sum .note,.gate-meta{ display:none; }
  .doc{ padding:14px 16px; } .doc-foot{ flex-wrap:wrap; gap:8px; padding:10px 14px; } .doc-foot .btn{ flex:1; min-height:44px; }
  .gate-body{ grid-template-columns:minmax(0,1fr)!important; grid-template-rows:auto minmax(0,1fr)!important; } .gate-sum{ border-right:0!important; border-bottom:1px solid var(--line); }
  .proto{ bottom:auto; top:16px; right:12px; } .proto-menu{ bottom:auto; top:42px; }
  .tband{ width:100%!important; bottom:auto!important; height:auto!important; left:0!important; top:0!important; }
  .tband .hero-in{ position:relative!important; inset:auto!important; transform:none!important; height:auto!important; background:linear-gradient(180deg,rgba(244,248,255,.96) 70%,rgba(244,248,255,0)); padding:76px 16px 14px 16px!important; align-items:flex-start; text-align:left; }
  .tband .h-t{ font-size:22px!important; white-space:normal; max-width:100%; } .tband .h-s{ font-size:13.5px; }
  .rdl,.rdl.on{ left:16px!important; right:16px; top:auto!important; bottom:84px; width:auto!important; transform:none!important; text-align:center; }
  .rdl p{ display:none; } .rdl h2{ font-size:24px; margin:8px 0 12px; } .rdl-go{ width:100%; justify-content:center; height:52px; }
}
@media (prefers-reduced-motion:reduce){ *,*::before,*::after{ animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }
</style>
"""
sub('<script>document.body.classList.add("dk-6","lt-1");</script>', CSS + '<script>document.body.classList.add("dk-6","lt-1");</script>')
sub("const LPa = (document.body.classList.contains(\"has-tband\") || RING.idle) ? Math.min(400, r.width * .28) : 0;",
    "const LPa = (innerWidth <= 860) ? 0 : (document.body.classList.contains(\"has-tband\") || RING.idle) ? Math.min(400, r.width * (r.width < 1180 ? .36 : .28)) : 0;")

# focus card: 80vh tall. The scale stays width-limited, so the card grows in height, not in text size.
sub('''  if (S.mode === "focus") return [1000, STEPS[i].key === "profile" ? RH_PROFILE : STEPS[i].key === "team" ? 720 : RH];''',
'''  if (S.mode === "focus") {
    const base = STEPS[i].key === "profile" ? RH_PROFILE : STEPS[i].key === "team" ? 720 : RH;
    if (S.phase !== "review") return [1000, base];
    const sr = stage.getBoundingClientRect(), LPx = document.body.classList.contains("has-tband") ? Math.min(400, sr.width * .28) : 0;
    const fw = Math.max(0.42, Math.min(1.14, (sr.width - LPx - 56 - (document.body.classList.contains("has-tband") ? 40 : 0)) / 1000));
    return [1000, Math.round(base * (STEPS[i].key === "profile" ? 1.15 : 1.12))];
  }''')
sub("(r.width - LP - (AN ? 220 : 32) - (TB ?", "(r.width - LP - (AN ? 220 : (S.phase === \"review\" ? 56 : 32)) - (TB ?")

# review cards: smallest text 10px -> 16px (+6). Each text element below the floor is raised to it; larger text keeps its size.
sub("window.__deck = { opening,", """const MIN_FONT = 16; let fzQ = 0;
function bumpFonts() { fzQ = 0; document.querySelectorAll(".card [data-review] *").forEach((e) => { if (e.dataset.fz || !([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))) return; e.dataset.fz = 1; if (parseFloat(getComputedStyle(e).fontSize) < MIN_FONT) e.style.setProperty("font-size", `${MIN_FONT}px`, "important"); }); document.querySelectorAll(".card [data-review] input:not([type=checkbox]),.card [data-review] select").forEach((e) => { if (parseFloat(getComputedStyle(e).fontSize) < MIN_FONT) e.style.setProperty("font-size", `${MIN_FONT}px`, "important"); }); }
new MutationObserver(() => { if (!fzQ) fzQ = requestAnimationFrame(bumpFonts); }).observe(document.getElementById("stage"), { childList: true, subtree: true, characterData: true });
window.__deck = { opening,""")
# review focus card: 80% of the window height (scale follows the card's content height)
sub("let f = Math.max(0.42, Math.min(1.14, (r.height - 40) / ah,", "let f = Math.max(0.42, Math.min(1.14, (S.phase === \"review\" ? innerHeight * .8 : r.height - 40) / ah,")
(root / "agentic-setup-cards-ux.html").write_text(h)
print("ok", len(h))

