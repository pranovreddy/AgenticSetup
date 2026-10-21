/* ===== Templates while brands are under review: a lock-like state with Skip or Continue anyway ===== */
const _pmRR6 = renderReview;
renderReview = function (i) {
  _pmRR6(i); if (STEPS[i].key !== "templates") return; const el = card(i), box = el && $("[data-review] .r-body", el), c = S.cards[i];
  if (!box || (c.st !== "review" && c.st !== "ready")) return; const note = pmTplNote();
  if (!note) { S.tplProceed = false; return; }
  $(".pm-warn", box)?.remove(); const foot = $("[data-review] .r-foot", el); const conf = foot && $("[data-act=accept]", foot);
  if (S.tplProceed) { if (conf) conf.disabled = false; return; }
  if (conf) conf.disabled = true;
  if (!$(".pm-hold", box)) { box.style.position = "relative"; box.insertAdjacentHTML("beforeend", `<div class="ux-lockov pm-hold" role="status"><span class="lk">${uxI("locked")}</span><b>Your brands and LOBs are still under review</b><small>${esc(note)}</small><div class="pm-hb"><button class="btn btn-p" data-ux6="skip" type="button">Skip for now</button><button class="btn" data-ux6="go" type="button">Continue anyway</button></div></div>`); }
};
document.addEventListener("click", (e) => { const b = e.target.closest("[data-ux6]"); if (!b) return; if (b.dataset.ux6 === "skip") return decide(4, "later"); S.tplProceed = true; renderReview(4); toast("Templates will be mapped to the approved LOBs only"); }, true);
