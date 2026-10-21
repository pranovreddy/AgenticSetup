/* ===== Partial KYC approval: at least one operator approved, so the step is done, but only partly ===== */
const PM_TELCOS = ["Airtel", "Jio", "Vi", "BSNL"];
const pmTelco = (ok) => ({ ok, total: PM_TELCOS.length, list: PM_TELCOS.map((n, k) => ({ n, a: k < ok })) });
const _pmD5 = doneFace;
doneFace = function (i) {
  const out = _pmD5(i), c = S.cards[i];
  if (STEPS[i].key !== "profile" || c.st !== "done" || !c.telco || c.telco.ok >= c.telco.total || !out.includes('class="done-face"')) return out;
  const t = c.telco, list = `<ul class="pm-tl">${t.list.map((x) => `<li class="${x.a ? "ok" : "wait"}">${x.a ? IC.check : IC.clock}<b>${x.n}</b><span>${x.a ? "Approved" : "Still reviewing"}</span></li>`).join("")}</ul>`;
  return out.replace(/<h3>[\s\S]*?<\/h3>/, `<h3>Approved by ${t.ok} of ${t.total} operators</h3>`)
    .replace(/<p class="pm-ft">[\s\S]*?<\/p>/, `<p class="pm-ft">Your business profile is done. ${t.total - t.ok} operators are still reviewing it.</p>`)
    .replace(/<div class="pm-nx">/, `${list}<div class="pm-pend">You can carry on. Messages go out only through the approved operators until the others approve.</div><div class="pm-nx">`);
};
/* left text, rail and finale card wording */
setInterval(() => { const c = S.cards[0]; if (!c || c.st !== "done" || !c.telco || c.telco.ok >= c.telco.total) return; if (S.phase === "review" && S.active === 0) { const t = $("#atTele"); if (t && t.textContent.indexOf("Approved by") !== 0) t.textContent = `Approved by ${c.telco.ok} of ${c.telco.total} telecom operators. The others are still reviewing.`; const h = $("#hTitle"); if (h && /is done/.test(h.textContent)) h.textContent = "Business profile is partly approved"; } }, 300);
const _pmMini = doneMini;
doneMini = function (i) { const c = S.cards[i]; if (STEPS[i].key === "profile" && c.telco && c.telco.ok < c.telco.total && c.st === "done") return `Approved by ${c.telco.ok} of ${c.telco.total}`; return _pmMini(i); };
const _pmUx5 = uxState;
uxState = function (name) {
  if (name !== "pm-kyc" && name !== "pm-kyc-all") return _pmUx5(name);
  uxReset(); S.bPend = null; jump("review"); S.profileFilled = S.profileAuth = true;
  setTimeout(() => { const c = S.cards[0]; c.st = "done"; c.at = now(); c.telco = pmTelco(name === "pm-kyc" ? 2 : 4); STEPS.forEach((_, k) => { renderReview(k); setStatus(k); }); refreshLocks(); railSync(); faces(); focusCard(0); }, 500);
};
{ const m = $("#protoMenu"); if (m) { const g = [...m.querySelectorAll(".pm-g")].find((x) => /^Business profile/.test(x.textContent.trim())); if (g) g.insertAdjacentHTML("beforeend", '<button data-state="pm-kyc">Approved by 2 of 4 operators</button>'); } }
