JS = r"""const PRE = { profile: "Fills your business details", team: "Suggests who to invite", gtm: "Picks your SMS partners", brands: "Sets up brands and LOBs", templates: "Maps your DLT templates" };
function preStart(run) {
  S.phase = "pre"; S.preRun = run;
  if (!$("#preL")) stage.insertAdjacentHTML("beforeend", `<div class="rdl rdl-pre" id="preL"><span class="rdl-k"><i></i>5 steps</span><h2>Your agent will prepare five steps</h2><p>It reads your trusted sources and fills each step in. Nothing goes live until you review and approve it.</p>
    <ul class="rdl-l">${STEPS.map((s) => `<li><span>${IC[s.key]}</span><b>${esc(s.title)}</b><em>${esc(PRE[s.key] || "")}</em></li>`).join("")}</ul>
    <button class="rdl-go" id="preGo" type="button">Start AI setup<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>`);
  head("Onboarding Agent", "", "Five steps, prepared at once", "", false);
  document.body.classList.add("all-closed");
  S.mode = "focus"; document.body.classList.remove("mode-overview", "mode-ring");
  S.cards.forEach((c) => { c.st = "queued"; });
  S.active = 2; layout(); faceSig = ""; faces();
  setTimeout(() => { const r = $("#preL"); if (r) { r.classList.add("on"); const g = $("#preGo"); if (g) g.focus({ preventScroll: true }); } }, RM ? 0 : 500);
}
document.addEventListener("click", (e) => {
  if (!e.target.closest("#preGo") || S.phase !== "pre") return;
  const r = $("#preL"); r.classList.remove("on"); setTimeout(() => r.remove(), 600);
  document.body.classList.remove("all-closed");
  const run = S.preRun; analyse(run, true);
});
async function analyse(run, go) {
  if (!go) return preStart(run);
  S.phase = "analyse";"""
rep('async function analyse(run) {\n  S.phase = "analyse";', JS)
rep('document.body.classList.remove("all-closed"); { const r0 = document.getElementById("readyL");', 'document.body.classList.remove("all-closed"); { const q0 = document.getElementById("preL"); if (q0) q0.remove(); } { const r0 = document.getElementById("readyL");', 0)
