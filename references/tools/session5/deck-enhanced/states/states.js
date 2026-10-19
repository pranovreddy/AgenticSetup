/* ===== Part 2 states layer ===== */
const usv = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const UXP = {
  queued: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 3.2"/>', preparing: '<path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5"/>',
  ready: '<path d="M12 3.5l1.9 5.2 5.2 1.9-5.2 1.9L12 17.7l-1.9-5.2-5.2-1.9 5.2-1.9L12 3.5Z"/>', locked: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  review: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', attention: '<path d="M12 4 3 19.5h18L12 4Z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  later: '<path d="M7 4.5h10v15l-5-3.6-5 3.6v-15Z"/>', done: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>', info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.8v.1"/>',
  offline: '<path d="M3 9a14 14 0 0 1 18 0M6 12.5a9.5 9.5 0 0 1 12 0M9.2 16a5 5 0 0 1 5.6 0M12 19.5v.1M4 4l16 16"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  dl: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>', doc: '<path d="M7 3.5h7l4 4v13H7v-17Z"/><path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5"/>',
};
const UXS = { queued: ["Queued", "#566176", "#edf0f6"], preparing: ["Preparing", "#1d4ed8", "#e1eaff"], ready: ["Ready", "#0e7490", "#d9f1f6"], locked: ["Locked", "#475569", "#e4e8ef"], review: ["In review", "#a15a07", "#fcefcf"], attention: ["Needs attention", "#c2410c", "#ffe4d5"], later: ["Do it later", "#6d28d9", "#ebe5ff"], done: ["Done", "#15803d", "#d9f4e2"] };
const uxI = (n) => usv(UXP[n]);
const UX_WHO = { name: "Anita Kulkarni", at: "14 Oct, 11:42" };
function uxStat(i) {
  const c = S.cards[i];
  if (c.st === "queued") return "queued";
  if (c.st === "analysing") return "preparing";
  if (c.st === "inreview") return "review";
  if (c.attn) return "attention";
  if (c.st === "done") return "done";
  if (c.st === "later") return "later";
  if (c.flag === "norate" || (c.st === "review" && isLocked(i))) return "locked";
  if (c.flag === "fail") return "attention";
  return "ready";
}
function uxChip(i) {
  const el = card(i); if (!el) return; const k = uxStat(i), [n, c, b] = UXS[k], st = $("[data-status]", el); if (!st) return;
  st.className = "status ux-chip" + (k === "ready" ? " ux-hide" : ""); st.style.setProperty("--c", c); st.style.setProperty("--b", b);
  st.innerHTML = `${k === "preparing" ? uxI(k).replace("<svg ", '<svg class="spin" ') : uxI(k)}${n}`;
}
const _ss = setStatus; setStatus = function (i) { _ss(i); uxChip(i); };
const _faces = faces;
faces = function () {
  _faces();
  $$(".card", stage).forEach((el, i) => {
    const f = $(".cardf", el), top = f && $(".cf-top", f); if (!top) return;
    const k = uxStat(i); $$(".cf-st", f).forEach((x) => x.remove());
    if (k === "done") return;
    let [n, c, b] = UXS[k], ico = uxI(k);
    const c0 = S.cards[i], early = S.phase === "analyse" || document.body.classList.contains("all-closed");
    if (early && c0.flag === "nothing") { n = "Nothing found"; c = "#566176"; b = "#edf0f6"; ico = uxI("search"); }
    if (early && c0.flag === "fail") n = "Couldn’t prepare";
    top.insertAdjacentHTML("beforeend", `<span class="cf-st ux" style="--c:${c};--b:${b}">${ico}${n}</span>`);
  });
};
const _rs = railSync;
railSync = function () { _rs(); $$("#rail3c .rc").forEach((b, i) => b.style.setProperty("--stc", UXS[uxStat(i)][1])); };

/* ---- finished faces, empty faces, error faces ---- */
const UX_ATTN = {
  profile: ["2 fields were returned", "Legal entity name and registered address need a fix."],
  team: ["2 invites didn’t arrive", "Two email addresses couldn’t be reached. Check them and send again."],
  brands: ["A line of business was returned", "One line of business needs a new name before it is set up."],
  gtm: ["A rate card changed", "Value First sent new rates. Check the split again."],
  templates: ["14 templates need a new line of business", "14 templates were mapped to lines of business that changed."],
};
const uxFaceHTML = (i, kind, h, p, label, act) => { const [, c, b] = UXS[kind]; return `<div class="ux-face"><span class="fi" style="--c:${c};--b:${b}">${uxI(kind)}</span><h3>${h}</h3><p>${p}</p>${label ? `<button class="btn" data-ux="${act}" data-i="${i}">${label}</button>` : ""}</div>`; };
const _df = doneFace;
doneFace = function (i) {
  const c = S.cards[i], k = STEPS[i].key;
  if (c.attn) return uxFaceHTML(i, "attention", UX_ATTN[k][0], UX_ATTN[k][1], "Review", k === "profile" ? "reopen" : "deep");
  if (c.st === "later") { const t = { team: "Team invites saved for later", templates: "Template mapping saved for later" }[k] || "Saved for later"; return uxFaceHTML(i, "later", t, "You chose to do this step later. Nothing has been sent.", "Review", "reopen"); }
  let h = _df(i).replace(/Open again/, "View");
  if (c.who) h = h.replace(/<p>[\s\S]*?<\/p>/, `<p>Submitted by ${esc(c.who.name)} · ${esc(c.who.at)}</p>`);
  return h;
};
const UX_NOUN = { team: ["people", "Your DLT registration has no contact list we can read. Add the people who should get access."], brands: ["brands", "Your DLT headers have no brands we can read. Add your first brand and its lines of business."], templates: ["templates", "Your DLT account has no templates yet. Add them manually when they exist."] };
const uxFoot = (l, r) => (l || r) ? `<div class="r-foot"><div class="ux-fl">${l}</div><div class="ux-fr">${r}</div></div>` : "";
function uxFace(i) {
  const c = S.cards[i], k = STEPS[i].key, el = card(i), box = el && $("[data-review]", el); if (!box) return;
  const live = c.st === "review" || c.st === "ready";
  const b = (act, label, cls = "") => `<button class="btn ${cls}" data-ux="${act}" data-i="${i}">${label}</button>`;
  const later = (k === "team" || k === "templates") ? b("later", "Do it later", "btn-t") : "";
  if (live && c.flag && !(isLocked(i) && c.flag !== "norate")) {
    if (c.flag === "nothing") box.innerHTML = `<div class="r-body">${uxFaceHTML(i, "ready", `We found no ${UX_NOUN[k][0]} to suggest`, UX_NOUN[k][1], "", "").replace(/--c:[^;]+;--b:[^"]+/, "--c:#566176;--b:#edf0f6").replace(uxI("ready"), uxI("search"))}</div>${uxFoot(b("add", `${uxI("plus").replace("<svg ", '<svg width="15" height="15" ')}Add manually`), later)}`;
    else if (c.flag === "fail") {
      const t = c.tries || 0, again = c.busy ? `<button class="btn ${t >= 2 ? "" : "btn-p"} is-busy"><span class="ux-sp"></span>Trying again…</button>` : b("retry", "Try again", t >= 2 ? "" : "btn-p");
      box.innerHTML = `<div class="r-body">${uxFaceHTML(i, "attention", t >= 2 ? "Still couldn’t prepare this step" : "Couldn’t prepare this step", t >= 2 ? "Two tries didn’t work. You can fill this step in yourself." : "The agent couldn’t read what it needs for this step. Try again in a moment.", "", "")}</div>${uxFoot(later, again + (t >= 2 ? b("self", "Do it yourself", "btn-p") : ""))}`;
    } else if (c.flag === "norate") box.innerHTML = `<div class="r-body"><div class="ux-ghost"><div></div><div></div><div></div><div></div></div><div class="ux-lockov"><span class="lk">${uxI("locked")}</span><b>Opens once a partner has sent a rate card</b><small>You get an email as soon as the first one arrives.</small><span class="dots"><i></i><i></i><i></i><i></i><i></i></span></div></div>`;
  } else if (live && c.attn) box.innerHTML = `<div class="r-body">${doneFace(i)}</div>`;
  if (live && !c.flag && !c.attn) uxPartly(i, box);
  const foot = $(".r-foot", box);
  if (c.err && foot) foot.insertAdjacentHTML("beforebegin", `<div class="ux-err${c.err.unk ? " unk" : ""}">${uxI(c.err.unk ? "info" : "attention")}${esc(c.err.t)}</div>`);
  if (c.busyBtn && foot) { const p = $(".btn-p", foot); if (p) { p.classList.add("is-busy"); p.innerHTML = `<span class="ux-sp"></span>${esc(c.busyBtn)}`; } }
}
function uxPartly(i, box) {
  const c = S.cards[i], k = STEPS[i].key, body = $(".r-body", box); if (!c.partly || !body) return;
  if (k === "profile") {
    body.insertAdjacentHTML("afterbegin", `<p class="ux-note warn">${uxI("attention")}Couldn’t fill 2 fields: Business PAN/TAN and Website URL. Add them to submit.</p>`);
    const blank = () => { ["pc-pan", "pc-web"].forEach((id) => { const f = $("#" + id, box); if (f) { f.value = ""; f.placeholder = "Couldn’t fill this"; f.classList.add("inp-miss"); } }); const sb = $('.r-foot .btn-p', box); if (sb) sb.disabled = true; const ck = $("#pAuth", box); if (ck) { ck.checked = false; ck.disabled = true; } };
    blank(); [300, 1200, 3000, 6000].forEach((t) => setTimeout(blank, t));
  } else if (k === "gtm") body.insertAdjacentHTML("afterbegin", `<p class="ux-note">${uxI("info")}Only Karix has sent a rate card. It takes all the volume until another one arrives.</p>`);
  else if (k === "templates") { body.insertAdjacentHTML("afterbegin", `<p class="ux-note warn">${uxI("attention")}14 templates have no line of business yet. They don’t hold up migration.</p>`); const u = $(".tm div:last-child b", body); if (u) { u.textContent = "14"; u.style.color = "#c2410c"; } }
}
const _rr = renderReview;
renderReview = function (i) { _rr(i); uxFace(i); };

/* ---- actions ---- */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ux]"); if (!b) return;
  const i = +b.dataset.i, act = b.dataset.ux, c = S.cards[i], k = STEPS[i].key;
  if (act === "later") return decide(i, "later");
  if (act === "retry") { c.busy = true; renderReview(i); return setTimeout(() => { c.busy = false; c.tries = (c.tries || 0) + 1; if (c.tries >= 3) { c.flag = null; c.tries = 0; toast("Prepared on the third try"); } renderReview(i); setStatus(i); railSync(); faces(); }, RM ? 0 : 1400); }
  if (act === "self") { c.flag = null; c.tries = 0; c.notice = { kind: "noprep" }; renderReview(i); setStatus(i); if (k === "profile") { ["pc-name", "pc-type", "pc-addr", "pc-pan", "pc-web", "pc-ind", "pc-sub"].forEach((id) => { const f = $("#" + id, card(i)); if (f) f.value = ""; }); return; } return openDeep(i); }
  if (act === "add") { c.flag = null; c.notice = { kind: "nothing" }; if (k === "team") { c.stash = JSON.stringify(PEOPLE); PEOPLE.splice(0, PEOPLE.length); } renderReview(i); setStatus(i); return openDeep(i); }
  if (act === "reopen") { c.attn = null; c.st = "review"; renderReview(i); setStatus(i); refreshLocks(); faces(); return; }
  if (act === "deep") { c.attn = null; return openDeep(i); }
  if (act === "uselate") { const pop = $(".ux-pop", deep); if (pop) return pop.remove(); const host = $(".deep-content"); host.insertAdjacentHTML("afterbegin", `<div class="ux-pop">${uxI("attention").replace("<svg ", '<svg width="20" height="20" ')}<div><b>Replace what you entered?</b><p>The suggestion replaces the fields you filled in. Your entries can’t be brought back.</p></div><div class="r"><button class="btn" data-ux="keepmine" data-i="${i}">Keep mine</button><button class="btn btn-p" data-ux="replace" data-i="${i}">Replace</button></div></div>`); return; }
  if (act === "keepmine" || act === "replace") { $(".ux-pop", deep)?.remove(); $(".ux-nbar", deep)?.remove(); c.notice = null; if (act === "replace") toast("Suggestion applied"); return; }
}, true);

/* ---- Details page: notice bar, read-only, bottom message ---- */
const UX_NOTICE = {
  nothing: (c) => ["info", "We found nothing for this step. Add what you need below."],
  noprep: (c) => ["info", "No suggestion was prepared for this step. Fill it in yourself."],
  someone: (c) => ["warn", `${(c.who || UX_WHO).name} submitted this step on ${(c.who || UX_WHO).at}. It is read-only now.`],
  late: (c) => ["late", "A suggestion is ready now."],
  team: (c) => ["info", `${UX_WHO.name} added 2 people while you were here. You can keep editing.`],
};
const _rd = renderDeep;
renderDeep = function () {
  _rd(); const c = S.cards[deepI]; document.body.classList.toggle("deep-ro", c.notice?.kind === "someone");
  const host = $(".deep-content .inner", deep); if (!host) return;
  if (c.notice) {
    const [kind, text] = UX_NOTICE[c.notice.kind](c);
    host.insertAdjacentHTML("afterbegin", `<div class="ux-nbar ${kind}">${uxI(kind === "warn" ? "attention" : kind === "late" ? "ready" : "info")}<span>${esc(text)}</span>${c.notice.kind === "late" ? `<button class="btn btn-p" data-ux="uselate" data-i="${deepI}">Use the suggestion</button>` : ""}</div>`);
  }
  if (STEPS[deepI].key === "team" && !PEOPLE.length && !$(".ux-empty", host)) host.insertAdjacentHTML("beforeend", `<div class="ux-empty">${uxI("search").replace("<svg ", '<svg width="28" height="28" ')}<b>No users yet</b><button class="btn btn-p" data-dact="adduser">Add user</button></div>`);
  const foot = $(".deep-foot", deep);
  if (c.notice?.kind === "someone" && foot) foot.innerHTML = `<span class="msg"></span><button class="btn" data-dact="close">Back to cards</button>`;
  if (c.derr && foot) { const m = $(".msg", foot); if (m) m.outerHTML = `<span class="ux-bmsg${c.derr.unk ? " unk" : ""}">${uxI(c.derr.unk ? "info" : "attention")}${esc(c.derr.t)}</span>`; }
};
const _cd = closeDeep;
closeDeep = function (then) { const c = S.cards[deepI]; document.body.classList.remove("deep-ro"); if (c.stash) { PEOPLE.splice(0, PEOPLE.length, ...JSON.parse(c.stash)); c.stash = null; } c.notice = null; c.derr = null; return _cd(then); };

/* ---- save dialog per step ---- */
const UX_SAVE = {
  profile: ["Save your business profile changes?", "You edited the profile. Save to keep your entries and go back to the cards, or discard to keep the agent’s suggestion."],
  team: ["Save your team changes?", "You edited the list of people. Save to keep it, or discard to go back to the 6 people the agent suggested."],
  brands: ["Save your brand and line of business changes?", "You added or changed brands. Saving sends the change for review. Discarding keeps the three brands the agent suggested."],
  gtm: ["Save your partner choice and split?", "You changed which partners are chosen or the volume split. Discarding keeps Karix and Value First at the agent’s split."],
  templates: ["Save your template mapping changes?", "You changed template mappings. Discarding keeps the agent’s mapping of 98 templates."],
};
const _al = askLeave;
askLeave = function () {
  _al(); const bd = $(".dlg-bd"); if (!bd) return; const key = STEPS[deepI].key, t = UX_SAVE[key];
  if (S.cards[deepI].notice?.kind === "someone") { $("#dlgT", bd).textContent = "This step was submitted while you were editing"; $("p", bd).textContent = `${UX_WHO.name} submitted ${STEPS[deepI].title} on ${UX_WHO.at}. Your edits can’t be saved.`; $(".row", bd).innerHTML = `<button class="btn" data-x="discard">Discard changes</button><button class="btn btn-p" data-x="discard">Back to cards</button>`; return; }
  $("#dlgT", bd).textContent = t[0]; $("p", bd).textContent = t[1];
};

/* ---- offline bar, load failures ---- */
document.body.insertAdjacentHTML("beforeend", `<div id="uxOff" role="status">${uxI("offline")}You’re offline. Changes are paused until you’re back.</div>`);
function uxFail(where) {
  const mk = (cls, t, p) => `<div class="ux-fail ${cls}" role="alert">${uxI("attention").replace("<svg ", '<svg width="28" height="28" ')}<h3>${t}</h3><p>${p}</p><button class="btn btn-p" data-ux-x="retry">Try again</button></div>`;
  let host, html;
  if (where === "deck") { host = document.body; html = mk("deck", "Couldn’t load your setup", "Check your connection and try again."); }
  else if (where === "card") { host = $(".card.is-focus", stage) || card(0); html = mk("", "Couldn’t load this step", "The rest of your setup is fine."); }
  else { host = $(".deep-content", deep); html = mk("", "Couldn’t load the details", "Your changes so far are kept."); }
  host.style.position = host === document.body ? "" : "relative"; host.insertAdjacentHTML("beforeend", html);
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-ux-x]"); if (b) b.closest(".ux-fail")?.remove(); });

/* ---- finale: window states, time line; closes-in pill ---- */
const _fin = finale;
finale = function () {
  _fin();
  const w = S.win || "open", fin = $(".finale"), d = (n) => new Date(Date.now() + n * 864e5).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const took = S.reviewStart ? Math.round((Date.now() - S.reviewStart) / 1000) : 0;
  const el = $("#elapsed"); if (el) { el.textContent = w === "open" && took < 300 ? "You completed onboarding in less than 5 minutes" : ""; el.style.cssText = el.textContent ? "display:block;color:#15803d;font-weight:600;margin:0" : ""; }
  const p = $("p", fin);
  if (w === "notopen") { $("#clock").style.display = "none"; p.innerHTML = `The migration window opens on <b>${d(4)}</b>.`; $("#goMig").disabled = true; }
  if (w === "closed") { $("#clock").style.display = "none"; p.innerHTML = `Your migration window closed on <b>${d(-2)}</b>. Ask your account manager to open a new one.`; $("#goMig").style.display = "none"; }
  uxCloses();
};
function uxCloses() {
  const w = S.win || "open", c = $("#closes"); if (!c) return; c.style.display = w === "closed" ? "none" : "";
  const em = $("em", c); if (em) em.textContent = w === "notopen" ? "OPENS IN" : "CLOSES IN"; if (w === "notopen") { $("#closesT").textContent = "4d 06h 12m"; }
}

/* ---- gate states ---- */
function uxGate(kind) {
  const hint = $("#docHint"), btn = $("#acceptBtn"), doc = $("#doc");
  if (kind === "accepted") { hint.textContent = "Accepted by Rohan Mehta on 14 Oct 2026, 11:42"; btn.disabled = false; btn.innerHTML = `${uxI("dl").replace("<svg ", '<svg width="15" height="15" ')} Download`; $("#tabs .on, #tabs [aria-selected=true]")?.insertAdjacentHTML("afterbegin", `<span style="color:#15803d;margin-right:6px">${uxI("done").replace("<svg ", '<svg width="14" height="14" ')}</span>`); }
  if (kind === "fail") { doc.innerHTML = `<div class="ux-fail" style="position:static;min-height:240px">${uxI("attention").replace("<svg ", '<svg width="28" height="28" ')}<h3>Couldn’t load this document</h3><button class="btn btn-p" data-ux-x="retry">Try again</button></div>`; hint.textContent = "You can’t accept until the document loads."; btn.disabled = true; }
  if (kind === "refused") { hint.innerHTML = `<span class="ux-bmsg">${uxI("attention")}We couldn’t record your acceptance. Try again.</span>`; btn.disabled = false; }
}

/* ---- avatar menu: signed agreements ---- */
{ const lb = $("#logoutBtn"); if (lb) { lb.insertAdjacentHTML("beforebegin", `<button class="btn btn-t" id="uxAgrBtn" type="button" style="justify-content:flex-start">${uxI("doc").replace("<svg ", '<svg width="16" height="16" ')}Signed agreements</button>`);
  $("#uxAgrBtn").addEventListener("click", () => { const bd = document.createElement("div"); bd.className = "dlg-bd"; bd.innerHTML = `<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT"><h3 id="dlgT">Signed agreements</h3>${["Terms of Use", "Privacy Policy"].map((n) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;background:#f6f8fd;border-radius:12px"><div><b>${n}</b><br><small style="color:var(--muted)">Rohan Mehta · 14 Oct 2026, 11:42</small></div><button class="btn" data-x="dl">Download</button></div>`).join("")}<div class="row"><button class="btn btn-p" data-x="close">Close</button></div></div>`; document.body.appendChild(bd); bd.addEventListener("click", (e) => { if (e.target === bd || e.target.dataset.x === "close") bd.remove(); if (e.target.dataset.x === "dl") toast("Download isn’t available in the prototype"); }); }); } }

/* ---- agent panel messages, ready screen copy ---- */
const UX_MSG = {
  wait: ["Nothing else is needed right now", "The telecom operators are checking your business profile. This usually takes a few hours. Team opens as soon as it is approved. You can leave this page and come back."],
  gtm: ["GTM partners opens soon", "None of the four partners has sent a rate card yet. This step opens as soon as one arrives, and you get an email. Everything else is ready to review."],
  back: ["Welcome back, Rohan", "You left off at Brands and LOBs. Business profile and Team are done. Three steps are waiting, and nothing has changed since your last visit."],
  next: ["Team is done", "Six invites were sent. Next is Brands and LOBs. Confirm the three brands and seven lines of business, or open the details to change them."],
};
function uxPanel(k) { const [t, s] = UX_MSG[k]; const h = $("#hTitle"), p = $(".h-s", $("#tband")); if (h) h.textContent = t; if (p) p.textContent = s; }
new MutationObserver(() => { const r = $("#readyL"); if (!r || r.dataset.ux) return; r.dataset.ux = 1; const n = S.cards.filter((c) => !c.flag).length; if (n === 5) return; $(".rdl-k", r).innerHTML = `<i style="background:#d98a0b;box-shadow:0 0 0 4px rgba(217,138,11,.18)"></i>${n} of 5 prepared`; $("h2", r).textContent = `${["No", "One", "Two", "Three", "Four"][n]} step${n === 1 ? " is" : "s are"} ready for review`; const p = $("p", r); if (p) p.textContent = "Some steps found nothing or couldn’t be prepared. You can still open every step and fill it in yourself."; }).observe(stage, { childList: true });
const _ra = renderAnalyse;
renderAnalyse = function (i) {
  _ra(i); const c = S.cards[i], el = card(i), box = el && $("[data-analyse]", el) || el; if (!c.flag || c.st !== "ready") return;
  const k = $(".res-a .k", el); if (k) { k.innerHTML = c.flag === "nothing" ? `${uxI("search")}Nothing found` : `${uxI("attention")}Couldn’t prepare`; k.style.color = c.flag === "nothing" ? "#566176" : "#c2410c"; }
  const st = $$(".rr-stats div", el); if (st[2]) { st[2].innerHTML = c.flag === "nothing" ? "<b>0</b><span>results</span>" : "<b>1</b><span>check failed</span>"; }
};

/* ---- forcing a state from the Prototype menu ---- */
function uxReset() { S.cards.forEach((c) => { c.flag = c.attn = c.notice = c.err = c.derr = c.busy = c.busyBtn = c.partly = c.who = null; c.tries = 0; }); S.win = "open"; document.body.classList.remove("deep-ro"); $("#uxOff")?.classList.remove("on"); $$(".ux-fail").forEach((x) => x.remove()); if (typeof deep !== "undefined" && !deep.hidden) { deep.hidden = true; deep.innerHTML = ""; document.body.classList.remove("deep-open"); } }
function uxState(name) {
  uxReset(); const [kind, step] = name.split("-"), i = { profile: 0, team: 1, brands: 2, gtm: 3, templates: 4 }[step]; let c;
  const toReview = () => { jump("review"); S.profileFilled = S.profileAuth = true; c = S.cards[i]; };
  const unlockAll = (upto) => { S.cards.forEach((x, k) => { if (k < upto) { x.st = "done"; x.at = now(); } }); refreshLocks(); };
  const show = (idx) => { STEPS.forEach((_, k) => { renderReview(k); setStatus(k); }); railSync(); faces(); focusCard(idx); setTimeout(() => { const f = S.cards[idx].flag, t = STEPS[idx].title; const h = $("#hTitle"), p = $(".h-s", $("#tband")); if (!h || !p) return; if (f === "nothing") { h.textContent = `Nothing found for ${t}`; p.textContent = "The agent checked your sources and found nothing to suggest. Add it yourself, or come back to it later."; } else if (f === "fail") { h.textContent = `${t} couldn’t be prepared`; p.textContent = (S.cards[idx].tries || 0) >= 2 ? "Two tries didn’t work. You can fill this step in yourself." : "The agent couldn’t read what it needs. Try again in a moment."; } else if (f === "norate") { h.textContent = "GTM partners opens soon"; p.textContent = "No partner has sent a rate card yet. This step opens as soon as one arrives."; } }, 900); };
  if (kind === "msg") { jump("review"); return setTimeout(() => uxPanel(step), 600); }
  if (kind === "nothing" || kind === "fail" || kind === "fail2" || kind === "busy" || kind === "norate") {
    toReview(); unlockAll(i); c.st = "review"; if (kind === "nothing") c.flag = "nothing"; if (kind === "norate") c.flag = "norate"; if (kind === "fail") c.flag = "fail"; if (kind === "fail2") { c.flag = "fail"; c.tries = 2; } if (kind === "busy") { c.flag = "fail"; c.busy = true; }
    return setTimeout(() => show(i), 400);
  }
  if (kind === "done" || kind === "inreview" || kind === "attention" || kind === "later") {
    toReview(); unlockAll(i); c.at = now(); if (kind === "done") { c.st = "done"; c.who = UX_WHO; } if (kind === "inreview") { c.st = "inreview"; c.who = UX_WHO; } if (kind === "attention") { c.st = "review"; c.attn = true; } if (kind === "later") c.st = "later";
    return setTimeout(() => show(i), 400);
  }
  if (kind === "partly") { toReview(); unlockAll(i); c.st = "review"; c.partly = true; if (step === "gtm") PARTNERS.forEach((p, k) => (p.picked = k === 0)); return setTimeout(() => show(i), 400); }
  if (kind === "notice") { toReview(); unlockAll(i); c.st = "review"; const [, nk] = [0, name.split("-")[2]]; c.notice = { kind: nk }; if (nk === "someone") c.who = UX_WHO; if (nk === "nothing" && STEPS[i].key === "team") { c.stash = JSON.stringify(PEOPLE); PEOPLE.splice(0, PEOPLE.length); } return setTimeout(() => { show(i); setTimeout(() => openDeep(i), 300); }, 400); }
  if (kind === "dialog") { toReview(); unlockAll(i); c.st = "review"; if (name.split("-")[2] === "ro") { c.notice = { kind: "someone" }; c.who = UX_WHO; } return setTimeout(() => { show(i); setTimeout(() => { openDeep(i); setTimeout(() => { S.dirty = true; askLeave(); }, 900); }, 300); }, 400); }
  if (kind === "err" || kind === "unk" || kind === "derr") { toReview(); c.st = "review"; setTimeout(() => { show(0); const x = { t: kind === "unk" ? "Checking whether that was saved…" : "That wasn’t saved. Try again.", unk: kind === "unk" }; if (kind === "derr") { unlockAll(i || 2); S.cards[2].st = "review"; S.cards[2].derr = x; show(2); setTimeout(() => openDeep(2), 300); } else { S.cards[0].err = x; if (kind === "unk") S.cards[0].busyBtn = "Submitting…"; renderReview(0); } }, 400); return; }
  if (kind === "offline") { jump("review"); return setTimeout(() => $("#uxOff").classList.add("on"), 500); }
  if (kind === "loadfail") { toReview(); return setTimeout(() => { const w = name.split("-")[1]; if (w === "deep") { unlockAll(1); show(1); setTimeout(() => { openDeep(1); setTimeout(() => uxFail("deep"), 900); }, 300); } else uxFail(w); }, 600); }
  if (kind === "fin") { const m = name.split("-")[1]; jump("finale"); S.win = m === "skipped" ? "open" : m; setTimeout(() => { if (m === "skipped") { S.cards[1].st = "later"; S.cards[4].st = "later"; S.cards[2].st = "inreview"; S.cards[3].attn = true; } S.phase = "review"; document.body.classList.remove("phase-finale"); finale(); STEPS.forEach((_, k) => setStatus(k)); faceSig = ""; faces(); const n = $("#narr"); if (m === "notopen") n.textContent = "Every step is done. You can start migration once the window opens."; if (m === "closed") n.textContent = "Every step is done, but the migration window has closed."; }, 700); return; }
  if (kind === "gate") { jump("restart"); return setTimeout(() => { uxGate(step); }, 600); }
  if (kind === "conc") {
    toReview(); unlockAll(step === "unlock" ? 0 : 1);
    if (step === "unlock") { S.cards[0].st = "inreview"; S.cards[1].st = "review"; return setTimeout(() => { show(1); setTimeout(() => { S.cards[0].st = "done"; S.cards[0].at = now(); refreshLocks(); renderReview(0); renderReview(1); setStatus(0); setStatus(1); railSync(); faces(); toast("Business profile was approved. Team is now open."); }, 1500); }, 400); }
    if (step === "card") { S.cards[0].st = "review"; S.cards[0].done = 0; S.cards[1].st = "review"; return setTimeout(() => { show(1); setTimeout(() => { S.cards[1].st = "inreview"; S.cards[1].who = UX_WHO; S.cards[1].at = UX_WHO.at; renderReview(1); setStatus(1); railSync(); faces(); toast(`${UX_WHO.name} submitted Team.`); }, 1500); }, 400); }
    if (step === "deep") { S.cards[1].st = "review"; return setTimeout(() => { show(1); setTimeout(() => { openDeep(1); setTimeout(() => { S.cards[1].notice = { kind: "someone" }; S.cards[1].who = UX_WHO; renderDeep(); toast(`${UX_WHO.name} submitted Team.`); }, 1600); }, 300); }, 400); }
  }
}
{ const m = $("#protoMenu"); const items = [
  ["Agent panel messages", null], ["Waiting", "msg-wait"], ["GTM waiting", "msg-gtm"], ["Welcome back", "msg-back"], ["After a decision", "msg-next"],
  ["Finished faces", null], ["Done, who and when", "done-profile"], ["In review", "inreview-team"], ["Needs attention", "attention-profile"], ["Needs attention, templates", "attention-templates"], ["Do it later", "later-team"],
  ["Nothing found", null], ["Team", "nothing-team"], ["Brands and LOBs", "nothing-brands"], ["Templates", "nothing-templates"], ["GTM, no rate cards", "norate-gtm"],
  ["Couldn’t prepare", null], ["First time, Brands", "fail-brands"], ["First time, Team", "fail-team"], ["After two tries", "fail2-team"], ["Busy, Trying again", "busy-templates"],
  ["Partly prepared", null], ["Business profile", "partly-profile"], ["GTM partners", "partly-gtm"], ["Templates", "partly-templates"],
  ["Details notice bar", null], ["Nothing was found", "notice-team-nothing"], ["No suggestion prepared", "notice-brands-noprep"], ["Done by someone else", "notice-team-someone"], ["Suggestion arrived late", "notice-brands-late"], ["Team stays editable", "notice-team-team"],
  ["Feedback", null], ["Save failed (card)", "err-profile"], ["Result unknown (card)", "unk-profile"], ["Save failed (details)", "derr-brands"], ["Offline", "offline-x"], ["Load failed: deck", "loadfail-deck"], ["Load failed: card", "loadfail-card"], ["Load failed: details", "loadfail-deep"],
  ["Save changes dialog", null], ["Brands", "dialog-brands"], ["Team", "dialog-team"], ["GTM", "dialog-gtm"], ["Templates", "dialog-templates"], ["Read-only", "dialog-team-ro"],
  ["Finale", null], ["Skipped steps", "fin-skipped"], ["Window not open yet", "fin-notopen"], ["Window open", "fin-open"], ["Window closed", "fin-closed"],
  ["Gate", null], ["Accepted", "gate-accepted"], ["Can’t be loaded", "gate-fail"], ["Refused", "gate-refused"],
  ["Working with others", null], ["Card swaps to finished", "conc-card"], ["Details turns read-only", "conc-deep"], ["Locked card opens", "conc-unlock"],
]; m.insertAdjacentHTML("beforeend", items.map(([l, s]) => s ? `<button data-state="${s}">${l}</button>` : `<b class="ux">${l}</b>`).join(""));
  m.addEventListener("click", (e) => { const b = e.target.closest("[data-state]"); if (!b) return; m.hidden = true; uxState(b.dataset.state); }); }
