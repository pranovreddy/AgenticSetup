/* ============================================================
   4. APPLICATION. One case-state model drives every surface.
   State changes only on user action.
   ============================================================ */
let CASES = buildCases('14:35');
const S = {
  mode: 'desks', screen: 1, caseId: 'C101', role: 'tap',
  intake: 'inbox', selected: null, shotSel: null, wrong: false,
  reason: null, box: false, boxTouched: false, submitted: false,
  pos: 0, clockT: null, opts: { w: false, alt: false },
  overturned: false, appeal: false, c105Send: '14:35',
  s6: { send: null, again: false, linked: null, note: null },
  today: false, panel: null, fact: null, arch: { view: 'overview', stage: 'all', layer: null, list: false }
};
const $ = (q, r) => (r || document).querySelector(q);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const cur = () => CASES[S.caseId];

/* ---------- icons: inline SVG only ---------- */
const IC = {
  check: '<path d="M4 12l5 5L20 6"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  net: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M13 9l3 3-3 3"/>', doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  left: '<path d="M15 5l-7 7 7 7"/>', right: '<path d="M9 5l7 7-7 7"/>', restart: '<path d="M4 12a8 8 0 108-8H8"/><path d="M11 1L8 4l3 3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>', shield: '<path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z"/>',
  link: '<path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1"/><path d="M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10 6a9 9 0 0112 6 13 13 0 01-3 4M6 7a13 13 0 00-4 5s4 7 10 7a9 9 0 004-1"/>', step: '<path d="M6 5l9 7-9 7zM18 5v14"/>', stepb: '<path d="M18 5l-9 7 9 7zM6 5v14"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>', list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.5M4 12h.5M4 18h.5"/>', diagram: '<rect x="3" y="4" width="7" height="6" rx="1"/><rect x="14" y="14" width="7" height="6" rx="1"/><path d="M10 7h4v10"/>',
  book: '<path d="M5 4h13v16H7a2 2 0 01-2-2z"/><path d="M9 8h6M9 12h6"/>', call: '<path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>', down: '<path d="M5 9l7 7 7-7"/>'
};
const ico = (n) => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (IC[n] || '') + '</svg>';
const tag = (k) => '<span class="tag tag-' + k + '">' + STR.tags[k] + '</span>';
const layerMark = (k) => '<span class="lay">' + ico(k === 'log' ? 'lock' : k === 'src' ? 'doc' : 'net') + STR.layers[k].short + '</span>';

/* ---------- derived case state (brief 9.1) ---------- */
function evs(c, o) {
  o = o || S.opts;
  return c.events.filter((e) => !e.on || e.on(o)).map((e) => Object.assign({}, e, { p: typeof e.p === 'function' ? e.p(o) : (e.p || {}) }));
}
function derive(c, pos, o) {
  o = o || S.opts;
  const list = evs(c, o);
  const st = { step: -1, edges: {}, list, applied: list.slice(0, pos) };
  st.applied.forEach((e) => {
    const p = e.p;
    Object.keys(p).forEach((k) => {
      if (k === 'e') p.e.forEach((x) => { if (!(x in st.edges)) st.edges[x] = e.t; });
      else if (k === 'msg') { st.msg = typeof p.msg === 'function' ? p.msg(o) : p.msg; st.msgAt = e.t; }
      else st[k] = p[k];
    });
    if (p.stopped) st.stoppedAt = e.t;
    if (p.finding && !st.findingAt) st.findingAt = e.t;
    if (p.remedy === 'effective') st.effectiveAt = st.effectiveAt || e.t;
    st.last = e;
  });
  st.nextEv = list[pos] || null;
  return st;
}
const now = () => derive(cur(), S.pos);
const mins = (a, b) => Math.round((TM.sec(b) - TM.sec(a)) / 60);
function posAt(c, t) { const lim = TM.sec(t); return evs(c).filter((e) => TM.sec(e.t) <= lim).length; }
function setPos(n) {
  const list = evs(cur());
  S.pos = Math.max(0, Math.min(list.length, n));
  if (S.pos > 0) S.clockT = list[S.pos - 1].t;
}
function metricOf(c, st, clockT) {
  if (!c.inScope) return 'excluded';
  if (S.overturned && c.id === S.caseId && c.id === 'C101') return 'overturned';
  if (st.stopped) return mins(c.regAt, st.stoppedAt) <= CONFIG.metric.targetMinutes ? 'met' : 'missed';
  if (clockT && mins(c.regAt, clockT) >= CONFIG.metric.targetMinutes) return 'pending';
  return 'running';
}
function chipOf(st) {
  if (!S.submitted) return ['notStarted', ''];
  if (S.overturned) return ['checking', 'amber'];
  if (st.step === 5) return ['resolved', 'green'];
  if (st.needs) return ['needs', 'amber'];
  if (st.step <= 0) return ['reported', ''];
  return ['checking', 'amber'];
}
function chipHtml(st) {
  const [k, tone] = chipOf(st);
  const icn = { notStarted: 'info', reported: 'flag', checking: 'clock', needs: 'alert', resolved: 'check' }[k];
  return '<span class="chip ' + tone + '">' + ico(icn) + STR.chips[k] + '</span>' + (S.overturned ? ' <span class="tag">' + STR.reopened.toUpperCase() + '</span>' : '');
}
function badge(m) {
  const map = { met: ['green', 'check', STR.met], missed: ['red', 'x', STR.missed], pending: ['amber', 'clock', STR.pending], excluded: ['', 'info', STR.excluded], running: ['', 'clock', STR.x.running], overturned: ['amber', 'restart', STR.reopened] };
  const b = map[m]; return '<span class="chip ' + b[0] + '">' + ico(b[1]) + b[2] + '</span>';
}
function actorName(c, a) {
  if (a === 'sub') return SUBSCRIBER.name;
  if (a === 'tap') return c.pair === 'internal' ? 'Vi (TAP and OAP)' : 'Vi (TAP)';
  if (a === 'oap') return c.pair === 'internal' ? 'Vi (TAP and OAP)' : c.oap + ' (' + (c.oapRole || 'OAP') + ')';
  if (a === 'dc') return STR.product;
  if (a === 'pe') return c.kind === 'call' ? STR.x.noEnterprise : 'Example Retail';
  return STR.desk.roles.rev.name;
}
const roleOf = (c, a) => (c.pair === 'internal' && a === 'oap') ? 'tap' : a;
const pairText = (c) => c.pair === 'internal' ? 'Vi' : c.pair === 'voice' ? 'Vi and Jio' : 'Vi and BSNL';
const target = (c) => c.inbox.find((m) => m.id === c.target);

/* ---------- case lifecycle ---------- */
function loadCase(id, keep) {
  S.caseId = id; S.selected = null; S.shotSel = null; S.wrong = false; S.reason = null; S.box = false; S.boxTouched = false;
  S.submitted = false; S.pos = 0; S.clockT = null; S.opts = { w: false, alt: false }; S.overturned = false; S.appeal = false; S.appealResult = false; S.againNote = false;
  S.intake = 'inbox'; S.today = false;
  const c = cur();
  S.s6 = { send: id === 'C105' ? S.c105Send : (c.repeat ? c.repeat.def : null), again: false, linked: null, note: null };
  if (!keep) S.screen = 1;
  say(fill(STR.live.caseLoaded, { id: c.id === 'VOICE' ? STR.x.voiceCase : c.id }));
}
function submit(explicit) {
  const c = cur();
  if (!S.selected) S.selected = c.target;
  if (!S.reason || (S.reason !== c.reason && S.reason !== c.altReason)) S.reason = c.reason;
  const box = explicit || S.boxTouched ? S.box : !!(c.consent && c.consent.boxDefault);
  S.box = box;
  S.opts = { w: !!(box && c.consent && !c.consent.already), alt: !!(c.altReason && S.reason === c.altReason) };
  S.submitted = true; S.clockT = c.regAt; S.pos = posAt(c, c.regAt);
  S.overturned = false; S.appeal = false;
  say(STR.live.submitted);
}
function go(n) {
  n = Math.max(1, Math.min(7, n));
  const c = cur();
  if (n >= 2 && !S.selected) S.selected = c.target;
  if (n >= 3 && !S.submitted) submit(false);
  if (n >= 4) setPos(Math.max(S.pos, posAt(c, c.branchAt)));
  if (n >= 6) setPos(evs(c).length);
  S.screen = n;
  say(fill(STR.live.screen, { n, name: STR.screens[n].name }));
  window.scrollTo(0, 0);
}
function restart() { CASES = buildCases('14:35'); S.c105Send = '14:35'; S.role = 'tap'; S.panel = null; loadCase('C101'); }
let liveMsg = '';
function say(t) { liveMsg = t; }

/* ============================================================
   Shared components
   ============================================================ */
function clockBox(c, st) {
  if (!S.submitted) return '<div class="clockbox"><div><dt>' + STR.clock + '</dt><dd class="muted small">' + STR.clockNotStarted + '</dd></div></div>';
  const tgt = CONFIG.metric.targetMinutes;
  const el = mins(c.regAt, st.stopped ? st.stoppedAt : S.clockT);
  const m = metricOf(c, st, S.clockT);
  const txt = st.stopped ? fill(STR.clockStopped, { t: st.stoppedAt, n: el }) : (el > tgt ? STR.clockPast : fill(STR.clockMinute, { n: el }));
  const pct = Math.min(100, (el / (tgt * 1.5)) * 100);
  return '<div class="clockbox"><div><dt>' + STR.clock + '</dt><dd class="clock-t">' + esc(S.clockT) + '</dd></div><div class="small"><div class="row">' + chipHtml(st) + (m === 'running' ? '' : badge(m)) + '</div><div>' + fill(txt) + '</div>' +
    '<div class="meter' + (el > tgt ? ' over' : '') + '" role="img" aria-label="' + esc(fill(txt)) + '"><i style="width:' + pct + '%"></i><b style="left:66.6%"></b></div></div></div>';
}
function strip(c, st) {
  const m = target(c), sel = S.selected === c.target;
  const ev = sel ? esc(m.header) + ', ' + esc(m.time) + ': ' + esc(m.text) : STR.ctxNone;
  const chg = S.submitted ? (c.consent && !c.consent.already && !S.opts.w ? c.remedyNo : c.remedy) : (S.reason ? (S.box ? c.remedy : c.remedyNo) : STR.ctxNone);
  return '<section class="strip" aria-label="' + STR.ctxCase + '"><dl class="strip-in">' +
    '<div><dt>' + STR.ctxEvent + '</dt><dd>' + ev + '</dd></div>' +
    '<div><dt>' + STR.ctxReason + '</dt><dd>' + (S.reason ? '"' + esc(S.reason) + '"' : STR.ctxNone) + '</dd></div>' +
    '<div><dt>' + STR.ctxChange + '</dt><dd>' + esc(chg) + '</dd></div>' +
    clockBox(c, st) + '</dl></section>';
}
function caseName(c) { return c.id === 'VOICE' ? STR.x.voiceCase : c.id; }
function bar(c, st) {
  return '<header class="bar"><div class="bar-in">' +
    '<div class="brand"><div class="brand-mark">' + ico('shield') + '</div><h1>' + STR.product + ' <span>' + STR.module + '</span></h1></div>' +
    '<span class="fict">' + STR.fictional + '</span>' +
    '<button class="btn" data-act="panel" data-arg="cases" aria-haspopup="dialog">' + ico('list') + STR.caseSelect + ': ' + caseName(c) + ' ' + tag(c.stage) + '</button>' +
    '<div class="seg" role="group" aria-label="' + STR.modeLabel + '"><button data-act="mode" data-arg="desks" aria-pressed="' + (S.mode === 'desks') + '">' + STR.modeDesks + '</button><button data-act="mode" data-arg="story" aria-pressed="' + (S.mode === 'story') + '">' + STR.modeStory + '</button></div>' +
    '<button class="btn" data-act="panel" data-arg="about" aria-haspopup="dialog">' + ico('book') + STR.about + '</button>' +
    '<button class="btn quiet" data-act="restart" title="' + STR.restart + ' (R)">' + ico('restart') + STR.restart + '</button>' +
    '</div></header>';
}
function stepper() {
  let h = '<nav class="stepper" aria-label="' + STR.modeStory + '"><button class="btn" data-act="back"' + (S.screen === 1 ? ' disabled' : '') + '>' + ico('left') + STR.back + '</button><ol>';
  for (let i = 1; i <= 7; i++) h += '<li><button data-act="go" data-arg="' + i + '"' + (i === S.screen ? ' aria-current="step"' : '') + '><span class="n">' + i + '</span><span class="nm">' + STR.screens[i].name + '</span></button></li>';
  return h + '</ol><button class="btn" data-act="panel" data-arg="detail" aria-haspopup="dialog">' + ico('doc') + STR.detail + '</button><button class="btn primary" data-act="next"' + (S.screen === 7 ? ' disabled' : '') + '>' + STR.next + ico('right') + '</button></nav>';
}
function qhead(c) {
  const sc = STR.screens[S.screen];
  return '<div class="qhead"><div><p class="eyebrow">' + fill(STR.live.screen, { n: S.screen, name: sc.name }) + (sc.p ? ' · ' + fill(STR.problem, { n: sc.p }) + ': ' + STR.problems[sc.p] : '') + '</p><h2 id="top" tabindex="-1">' + sc.q + '</h2>' +
    '<p class="line"><b>' + STR.presenter + ':</b> ' + fill(sc.line, { tap: actorName(c, 'tap'), pairText: pairText(c) }) + '</p></div></div>';
}

/* ---------- phone ---------- */
function phone(title, body, foot, o) {
  o = o || {};
  return '<div class="phone" role="group" aria-label="' + STR.x.phoneNow + '"><div class="ph-status"><span class="num">' + esc(o.time || '09:41') + '</span><span class="row"><span>Vi</span><span>5G</span></span></div>' +
    '<div class="ph-app">' + ico(o.icon || 'left') + '<span>' + esc(title) + '</span></div><div class="ph-body' + (o.white ? ' white' : '') + '">' + body + '</div>' + (foot ? '<div class="ph-foot">' + foot + '</div>' : '') +
    '<div class="ph-keys" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M16 5l-9 7 9 7z" fill="currentColor"/></svg><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg><svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor"/></svg></div></div>';
}
function msgBtn(m, act, on) {
  return '<button class="msg" data-act="' + act + '" data-arg="' + m.id + '" aria-pressed="' + on + '"><span class="h"><span>' + esc(m.header) + '</span><span class="num">' + esc(m.time) + '</span></span><span class="t">' + esc(m.text) + '</span>' +
    (m.note ? '<span class="sel muted">' + ico('link') + esc(m.note) + '</span>' : '') + (on ? '<span class="sel">' + ico('check') + STR.s1.selected + '</span>' : '') + '</button>';
}
function phoneIntake(c) {
  const call = c.kind === 'call', ok = S.selected === c.target, t = target(c);
  const time = TM.add(c.regAt, -2);
  if (S.intake === 'shot') {
    const body = '<p class="ph-h">' + STR.s1.shotTitle + '</p><p>' + STR.s1.shotHint + '</p><div class="shot">' + c.inbox.map((m) => msgBtn(m, 'shotpick', S.shotSel === m.id)).join('') + '</div>' +
      (S.wrong ? '<p class="note amber">' + ico('alert') + '<span>' + STR.s1.wrongPick + '</span></p>' : '');
    return phone('Vi', body, '<button class="btn primary block" data-act="shotok"' + (S.shotSel ? '' : ' disabled') + '>' + STR.s1.shotConfirm + '</button>' + (S.shotSel ? '' : '<p class="small muted">' + STR.s1.shotNeed + '</p>'), { time, icon: 'phone' });
  }
  if (S.intake === 'assist') {
    const v = { time: t.time, header: t.header, reason: c.reason };
    const body = STR.s1.assistLines.map((l, i) => '<div class="bubble' + (i % 2 ? ' me' : '') + '"><b>' + (i % 2 ? STR.s1.assistYou : STR.s1.assistAgent) + '</b>' + esc(fill(l, v)) + '</div>').join('') + '<p class="small muted">' + STR.s1.assistNote + '</p>';
    return phone(STR.s1.assistTitle, body, '<button class="btn primary block" data-act="assistok">' + ico('check') + STR.s1.assistConfirm + '</button>', { time, icon: 'call' });
  }
  const body = c.inbox.map((m) => msgBtn(m, 'pick', S.selected === m.id)).join('') +
    (S.wrong ? '<p class="note amber">' + ico('alert') + '<span>' + STR.s1.wrongPick + '</span></p>' : '') +
    (c.kind === 'service' || c.kind === 'promo' ? '<p class="small muted">' + STR.s1.serviceHint + '</p>' : '');
  return phone(call ? STR.s1.callsTitle : STR.s1.inboxTitle, body, '<button class="btn primary block" data-act="go" data-arg="2"' + (ok ? '' : ' disabled') + '>' + ico('flag') + (call ? STR.s1.reportCall : STR.s1.report) + '</button>' + (ok ? '' : '<p class="small muted">' + (call ? STR.s1.reportHintCall : STR.s1.reportHint) + '</p>'), { time, white: true });
}
function prefillKv(c) {
  const m = target(c), f = STR.s1.fields;
  if (c.kind === 'call') return '<dl class="kv"><dt>' + f.number + '</dt><dd>' + esc(m.header) + '</dd><dt>' + f.name + '</dt><dd>' + esc(m.shown) + '</dd><dt>' + f.sim + '</dt><dd>' + SUBSCRIBER.sim + '</dd><dt>' + f.channel + '</dt><dd>Voice call</dd><dt>' + f.when + '</dt><dd>Today, ' + esc(m.time) + '</dd><dt>' + f.duration + '</dt><dd>' + esc(m.duration) + '</dd></dl>';
  return '<dl class="kv"><dt>' + f.sender + '</dt><dd>' + esc(m.header) + '</dd><dt>' + f.sim + '</dt><dd>' + SUBSCRIBER.sim + '</dd><dt>' + f.channel + '</dt><dd>SMS</dd><dt>' + f.when + '</dt><dd>Today, ' + esc(m.time) + '</dd><dt>' + f.text + '</dt><dd>' + esc(m.text) + '</dd></dl>';
}
function phoneForm(c) {
  const call = c.kind === 'call';
  const rs = REASONS[c.kind].concat(STR.s2.always);
  let body = '<div class="ph-card"><p class="ph-h">' + STR.s2.preview + '</p>' + prefillKv(c) + '</div><fieldset class="stack-s" style="border:0;padding:0;margin:0"><legend class="ph-h">' + STR.s2.what + '</legend>' +
    rs.map((r, i) => '<label class="opt"><input type="radio" name="reason" id="reason' + i + '" data-chg="reason" value="' + esc(r) + '"' + (S.reason === r ? ' checked' : '') + '><span>' + esc(r) + '</span></label>').join('') + '</fieldset>';
  if (S.reason === STR.s2.always[0]) body += '<div class="note red">' + ico('alert') + '<span><b>' + STR.s2.scamTitle + '</b> ' + STR.s2.scamLost + ' <span class="small">' + STR.s2.scamNote + '</span></span></div>';
  if (S.reason && S.reason !== c.reason && S.reason !== c.altReason) body += '<p class="note">' + ico('info') + '<span>' + fill(STR.s2.scripted, { reason: c.reason }) + '</span></p>';
  body += '<p class="ph-h">' + STR.s2.remedy + '</p>';
  if (c.kind === 'promo' && c.consent && !c.consent.already) body += '<label class="opt"><input type="checkbox" id="wdbox" data-chg="box"' + (S.box ? ' checked' : '') + '><span>' + STR.s2.box + '</span></label><p class="small muted">' + STR.s2.boxNote + '</p>';
  else body += '<p class="ph-card">' + (c.consent && c.consent.already ? STR.x.already : call ? STR.s2.noBoxCall : STR.s2.noBoxService) + '</p>';
  return phone(call ? STR.s2.formTitleCall : STR.s2.formTitle, body, '<button class="btn primary block" data-act="submit"' + (S.reason ? '' : ' disabled') + '>' + STR.s2.submit + '</button>' + (S.reason ? '' : '<p class="small muted">' + STR.x.chooseReason + '</p>'), { time: TM.add(c.regAt, -1) });
}
function consentLine(c, st) {
  if (!c.consent) return '';
  if (c.kind !== 'promo') return '';
  if (st.wd === 'inforce') return fill(STR.x.prefInForce, { t: st.wdAt, f: st.inForceAt });
  if (st.wd === 'recorded') return fill(STR.x.prefWithdrawn, { t: st.wdAt });
  return st.effectiveAt ? '' : STR.x.prefUnchanged;
}
function stepsList(st) {
  const subTxt = S.overturned ? STR.x.underReview : st.sub;
  return '<ol class="tl">' + STR.steps.map((s, i) => {
    const skipped = st.skip && (i === 3 || i === 4);
    const done = !S.overturned && (i < st.step || st.step === 5) && !skipped, isNow = !S.overturned ? (i === st.step && st.step < 5) : i === 1;
    const cls = S.overturned ? (i === 0 ? 'done' : isNow ? 'now' : '') : (done ? 'done' : isNow ? 'now' : '');
    return '<li class="' + cls + '"><span class="dot">' + (cls === 'done' ? ico('check') : '') + '</span><span>' + s + (skipped ? '<br><span class="small muted">' + fill(STR.stepSkipped, { why: st.skip }) + '</span>' : '') + (isNow && subTxt ? '<br><span class="small">' + esc(subTxt) + '</span>' : '') + '</span></li>';
  }).join('') + '</ol>';
}
function phoneStatus(c, st, withControls) {
  const out = st.informed && c.outcome && !S.overturned ? c.outcome(S.opts) : null, R = STR.s5.resolvedCard;
  let body = '<div class="row" style="justify-content:space-between">' + '<b>' + esc(c.sr) + '</b>' + chipHtml(st) + '</div>';
  if (S.appeal) body += '<div class="ph-card"><b>' + STR.app.appealTitle + '</b><span>' + STR.app.appealText + '</span></div>';
  if (S.appealResult) body += '<div class="ph-card"><b>' + STR.app.appealTitle + '</b><span>' + STR.app.upheld + '</span></div>';
  if (S.againNote) body += '<div class="ph-card"><span>' + STR.x.reportAnother + '</span></div>';
  if (S.overturned) body += '<div class="ph-card"><b>' + STR.x.correctedNotice + '</b><span>' + STR.x.correctedText + '</span></div>';
  else if (st.msg) body += '<div class="ph-card"><span class="ph-h">' + fill(STR.x.latest, { t: st.msgAt }) + '</span>' + st.msg.map((l) => '<span>' + esc(l) + '</span>').join('') + '</div>';
  if (st.needs && c.candidates) body += '<div class="ph-card"><b>' + STR.x.question + '</b>' + c.candidates.map((k) => '<span class="msg"><span class="h"><span>' + k[1] + '</span><span>11:20</span></span><span class="t">' + esc(target(c).text) + '</span></span>').join('') + '<button class="btn primary" data-act="step">' + esc(st.nextEv ? st.nextEv.act : '') + '</button></div>';
  if (st.step === 0 && !S.overturned) {
    const cl = consentLine(c, st);
    body += '<div class="ph-card"><span><b>' + STR.s2.investigation + ':</b> ' + STR.s2.investigationPending + '</span>' + (cl ? '<span>' + esc(cl) + '</span>' : '') + (c.kind === 'promo' ? '<span>' + STR.s5.keeps + '</span>' : '') + '</div>';
  }
  if (out) body += '<div class="ph-card"><span class="ph-h">' + R.found + '</span><span>' + esc(out.found) + '</span><span class="ph-h">' + R.done + '</span><span>' + esc(out.done) + '</span><span class="ph-h">' + R.protection + '</span><span>' + esc(out.protection) + '</span><span class="ph-h">' + R.confirmed + '</span><span>' + esc(out.confirmed) + '</span></div>';
  body += stepsList(st);
  if (st.step > 0 || S.overturned) { const cl = consentLine(c, st); if (cl) body += '<div class="ph-card"><span class="ph-h">' + STR.s5.protection + '</span><span>' + esc(cl) + '</span><span>' + STR.s5.keeps + '</span></div>'; }
  if (!st.informed || S.overturned) body += '<div class="ph-card"><dl class="kv"><dt>' + STR.owner + '</dt><dd>' + esc(S.overturned ? STR.desk.roles.rev.sub.split(':')[0] : st.owner || STR.none) + '</dd><dt>' + STR.nextUpdate + '</dt><dd>' + esc(S.overturned ? TM.add(S.clockT, CONFIG.nextUpdateMinutes) : st.next || STR.none) + '</dd></dl></div>';
  if (out) body += '<p class="small muted">' + STR.x.reportAnother + '</p>';
  const foot = withControls ? '<div class="row"><button class="btn grow" data-act="again">' + STR.s6.again + '</button><button class="btn grow" data-act="disagree">' + STR.s6.disagree + '</button></div>' : '';
  return phone(c.id === 'VOICE' ? STR.x.voiceCase : fill(STR.x.caseTitle, { id: c.id }), body, foot, { time: S.clockT, icon: 'shield' });
}
function phoneFor(c, st, controls) {
  if (S.submitted) return phoneStatus(c, st, controls);
  return S.screen >= 2 && S.selected === c.target ? phoneForm(c) : phoneIntake(c);
}

/* ---------- fact access ---------- */
function getFact(ref) {
  const c = cur(), [k, i] = ref.split(':'), n = Number(i);
  if (k === 'log') { const r = c.log[n]; return { name: r.check + ': ' + r.result, layer: r.layer, source: actorName(c, r.w) + (r.layer === 'net' ? ', network record referenced from the log' : ', scrub log entry'), time: r.t, est: r.est, not: r.not, ver: r.ver, writer: actorName(c, r.w) }; }
  if (k === 'src') { const r = c.src[n]; return { name: r.fact, layer: r.layer || 'src', source: r.from, time: r.t, est: r.est, not: r.not }; }
  const e = evs(c)[n]; if (e.factRef) return getFact(e.factRef.join(':'));
  return { name: e.ttl, layer: e.fact.layer, source: e.fact.source, time: e.t, est: e.fact.est, not: e.fact.not };
}
function factBtn(ref, why) {
  const f = getFact(ref);
  return '<button class="factbtn" data-act="fact" data-arg="' + ref + '" aria-haspopup="dialog">' + layerMark(f.layer) + '<span class="grow"><b>' + esc(f.name) + '</b>' + (why ? '<br><span class="small muted">' + esc(why) + '</span>' : '') + '</span>' + ico('right') + '</button>';
}

/* ============================================================
   Screens 1 to 7
   ============================================================ */
function todayPanel() {
  const s = STR.s1;
  return '<div class="card stack"><h3>' + s.todayOn + '</h3><ol class="stack-s">' + s.todaySteps.map((x) => '<li>' + x + '</li>').join('') + '</ol>' +
    '<p><b>' + s.todayForm + '</b> ' + tag('sourced') + ' <span class="small muted">' + s.todayFormSrc + '</span></p><div class="todayform" aria-label="' + s.todayForm + '">' + s.todayFields.map((f) => '<div>' + f + '<span></span></div>').join('') + '</div>' +
    '<p class="note">' + ico('info') + '<span>' + s.todayReject + ' ' + tag('sourced') + ' ' + s.window + ' ' + tag('sourced') + '</span></p><p><b>' + s.todayNew + '</b></p></div>';
}
function todayToggle() { return '<button class="btn" data-act="today" aria-pressed="' + S.today + '">' + ico(S.today ? 'eyeoff' : 'eye') + STR.s1.today + '</button>'; }
function routesStrip(c) {
  const s = STR.s1;
  return '<div class="routes"><b>' + fill(s.routes, { tap: 'Vi (TAP)' }) + '</b><div>' + tag('exists') + '<ul>' + s.routesExist.map((r) => '<li>' + r + '</li>').join('') + '</ul></div><div>' + tag('proposed') + '<ul>' + s.routesNew.map((r) => '<li>' + r + '</li>').join('') + '</ul></div><p class="muted">' + s.routesNote + '</p></div>';
}
function screen1(c, st) {
  const s = STR.s1, sel = S.selected === c.target;
  const modes = [['inbox', s.modeInbox], ['shot', s.modeShot], ['assist', s.modeAssist]];
  return '<div class="two"><div class="phonecol">' + phoneIntake(c) + routesStrip(c) + '</div><div class="stack">' +
    '<div class="row"><div class="seg" role="group" aria-label="' + s.modes + '">' + modes.map((m) => '<button data-act="intake" data-arg="' + m[0] + '" aria-pressed="' + (S.intake === m[0]) + '">' + m[1] + '</button>').join('') + '</div>' + todayToggle() + '</div>' +
    (S.today ? todayPanel() : '') +
    '<div class="cols2"><div class="card stack"><h3>' + s.prefill + '</h3>' + (sel ? prefillKv(c) + '<p class="small muted">' + s.prefillNote + '</p>' : '<p class="muted">' + (c.kind === 'call' ? s.reportHintCall : s.reportHint) + '</p>') + '</div>' +
    '<div class="card stack"><h3>' + s.typed + '</h3><div class="row" style="gap:28px"><div><div class="count">' + s.typedNew + '</div><div class="small">' + STR.x.newFlow + ' ' + tag('proposed') + '</div></div><div class="muted"><div class="count">' + s.typedOld + '</div><div class="small">' + STR.x.todayFlow + ' ' + tag('sourced') + '</div></div></div><p class="small muted">' + s.todayNew + '</p></div></div>' +
    '</div></div>';
}
function screen2(c, st) {
  const s = STR.s2, promo = c.kind === 'promo' && c.consent && !c.consent.already;
  let right = '<div class="row">' + todayToggle() + (S.submitted ? '<button class="btn" data-act="unsubmit">' + ico('restart') + s.resubmit + '</button>' : '') + '</div>' + (S.today ? todayPanel() : '');
  right += '<div class="card stack"><h3>' + s.explainTitle + '</h3><ol class="stack-s"><li>' + s.explain1 + '</li><li>' + s.explain2 + '</li><li>' + s.explain3 + '</li></ol>';
  if (promo) {
    const chk = S.submitted ? S.opts.w : S.box;
    right += '<div class="cols2"><div class="note ' + (chk ? 'teal' : '') + '">' + ico(chk ? 'check' : 'info') + '<span><b>' + (chk ? s.checkedPath : s.uncheckedPath) + '</b><br>' + (chk ? esc(c.consent.scope) : STR.x.prefUnchanged) + '</span></div>' +
      '<dl class="kv"><dt>' + s.recorded + '</dt><dd>' + (st.wd ? esc(st.wdAt) + ' · ' + esc(c.consent.v1) + ' · ' + esc(c.consent.receipt) : (chk && !S.submitted ? STR.x.onSubmit : s.notRequested)) + '</dd><dt>' + s.inForce + '</dt><dd>' + (st.wd === 'inforce' ? esc(st.inForceAt) : st.wd ? STR.s5.wdPending : s.notRequested) + '</dd></dl></div><p class="small muted">' + s.pathNote + '</p>';
    if (c.altReason && !S.submitted) right += '<p class="note">' + ico('info') + '<span>' + s.altPrompt + '</span></p>';
  } else right += '<p class="note">' + ico('info') + '<span>' + (c.consent && c.consent.already ? STR.x.already : c.kind === 'call' ? s.noBoxCall : s.noBoxService) + '</span></p>';
  right += '</div><div class="card"><h3>' + s.ackTarget + ' <span class="tag">' + STR.x.proposedTarget + '</span></h3><p class="muted">' + s.ackTargetNote + '</p></div>';
  return '<div class="two"><div class="phonecol">' + (S.submitted ? phoneStatus(c, derive(c, posAt(c, c.regAt)), false) : phoneForm(c)) + '</div><div class="stack">' + right + '</div></div>';
}
function timebar(c, st) {
  const s = STR.s3, list = st.list, lo = TM.sec(c.regAt) / 60, hi = TM.sec(list[list.length - 1].t) / 60, v = TM.sec(S.clockT) / 60;
  const ne = st.nextEv;
  return '<div class="timebar" role="group" aria-label="' + s.time + '"><button class="btn sm" data-act="stepback"' + (S.pos <= posAt(c, c.regAt) ? ' disabled' : '') + '>' + ico('stepb') + s.stepBack + '</button>' +
    '<label class="sr" for="clockslider">' + s.slider + '</label><input type="range" id="clockslider" data-chg="slider" min="' + lo + '" max="' + hi + '" step="1" value="' + v + '" aria-valuetext="' + esc(S.clockT) + '">' +
    '<button class="btn sm primary" data-act="step"' + (ne ? '' : ' disabled') + '>' + s.step + ico('step') + '</button><span class="small muted grow">' + (ne ? esc(fill(s.nextEvent, { t: ne.t, who: actorName(c, ne.a), what: ne.act || ne.ttl })) : s.noNext) + '</span>' +
    '<button class="btn sm" data-act="panel" data-arg="arch" aria-haspopup="dialog">' + ico('diagram') + s.how + '</button></div>';
}
function waitBox(c, st) {
  const s = STR.s3, open = !st.stopped || S.overturned;
  return '<div class="card"><h4>' + s.waiting + '</h4>' + (open ? '<dl class="waitbox"><div><dt class="muted small">' + STR.x.statusNow + '</dt><dd><b>' + esc(S.overturned ? STR.x.underReview : st.sub || STR.steps[Math.max(0, st.step)]) + '</b></dd></div><div><dt class="muted small">' + STR.owner + '</dt><dd><b>' + esc(S.overturned ? STR.desk.roles.rev.name : st.owner || STR.none) + '</b></dd></div><div><dt class="muted small">' + STR.nextUpdate + '</dt><dd><b>' + esc(S.overturned ? TM.add(S.clockT, CONFIG.nextUpdateMinutes) : st.next || STR.none) + '</b></dd></div><div><dt class="muted small">' + STR.desk.crmF.feed + '</dt><dd class="small' + (c.feedWarn ? '"><span class="chip amber wrap">' + ico('alert') + esc(c.feed) + '</span>' : '">' + esc(c.feed)) + '</dd></div></dl>' : '<p>' + s.waitingNone + ' ' + (c.follow && st.follow ? '<span class="muted">' + STR.s5.follow + ': ' + esc(c.follow.task) + '. ' + STR.s5.followNote + '</span>' : '') + '</p>') + '</div>';
}
let LOGSPAN = 2;
function logBand(c, st) {
  const s = STR.s3;
  if (c.noLog) return '<aside class="logband none" style="grid-row:1 / span ' + LOGSPAN + '" aria-label="' + s.logBand + '"><h3>' + ico('net') + STR.layers.net.short + '</h3>' + tag('later') + '<p>' + s.logNone + '</p></aside>';
  let h = '<aside class="logband" style="grid-row:1 / span ' + LOGSPAN + '" aria-label="' + s.logBand + '"><h3>' + ico('lock') + s.logBand + '</h3>' + tag('proposed') + '<p><b>' + (c.pair === 'internal' ? s.logLockOne : s.logLock) + '</b></p>';
  if (!st.logOpen) return h + '<p>' + s.logClosed + '</p></aside>';
  h += '<p>' + fill(s.logOpened, { id: c.id, t: c.logOpenAt }) + '</p>' + (c.pair === 'internal' ? '<p>' + fill(s.logInternal, { tap: 'Vi' }) + '</p>' : '');
  if (c.candidates) h += c.candidates.map((k) => '<div class="le"><span>' + k[0] + ' · ' + k[2] + '</span>' + k[3] + '</div>').join('');
  h += c.log.map((r, i) => '<button class="le" data-act="fact" data-arg="log:' + i + '" aria-haspopup="dialog"><span>' + r.t + ' · ' + esc(actorName(c, r.w)) + '</span>' + esc(r.check) + ': ' + esc(r.result) + (r.ver ? ' (' + r.ver + ')' : '') + '</button>').join('');
  if (c.logNote) h += '<p>' + c.logNote + '</p>';
  return h + '</aside>';
}
function lanes(c, st) {
  const s = STR.s3, internal = c.pair === 'internal';
  const cols = internal ? { tap: 1, oap: 1, dc: 3, pe: 4 } : { tap: 1, oap: 3, dc: 4, pe: 5 };
  const order = internal ? ['tap', 'dc', 'pe'] : ['tap', 'oap', 'dc', 'pe'];
  const subs = { tap: STR.x.laneTap, oap: STR.x.laneOap, dc: STR.x.laneDc, pe: STR.x.lanePe };
  const laneOf = (e) => (internal && e.lane === 'oap' ? 'tap' : e.lane), rows = []; let rr = 1, used = {}, rt = null;
  st.applied.forEach((e) => { const l = laneOf(e); if (e.t !== rt || used[l]) { rr++; used = {}; rt = e.t; } used[l] = 1; rows.push(rr); });
  LOGSPAN = rr + 1;
  let h = '<div class="lanes ' + (internal ? 'internal' : 'cross') + '">';
  order.forEach((ln, li) => {
    h += '<section class="lane" aria-label="' + esc(actorName(c, ln)) + '"><div class="lane-h" style="grid-column:' + cols[ln] + '">' + esc(actorName(c, ln)) + (ln === 'tap' || (ln === 'oap' && c.stage === 'stage1') ? ' ' : '') + '<small>' + (internal && ln === 'tap' ? STR.x.laneBoth : subs[ln]) + '</small></div>';
    let n = 0;
    st.applied.forEach((e, i) => {
      const row = rows[i];
      if ((internal && e.lane === 'oap' ? 'tap' : e.lane) !== ln) return; n++;
      const isFact = e.fact || e.factRef, f = isFact ? getFact('ev:' + i) : null;
      const inner = '<span class="t"><span class="num">' + e.t + '</span>' + (roleOf(c, e.a) !== ln ? '<span>' + esc(fill(STR.x.by, { who: actorName(c, e.a) })) + '</span>' : '') + (f ? layerMark(f.layer) : '') + '</span><b>' + esc(e.ttl) + '</b><span>' + esc(e.txt) + '</span>';
      const st2 = 'style="grid-column:' + cols[ln] + ';grid-row:' + row + '"';
      h += isFact ? '<button class="ev' + (i === S.pos - 1 ? ' new' : '') + '" ' + st2 + ' data-act="fact" data-arg="ev:' + i + '" aria-haspopup="dialog">' + inner + '</button>' : '<div class="ev' + (i === S.pos - 1 ? ' new' : '') + '" ' + st2 + '>' + inner + '</div>';
    });
    if (!n) h += '<div class="lane-empty" style="grid-column:' + cols[ln] + ';grid-row:2">' + (ln === 'pe' && c.kind === 'call' ? STR.x.noEnterpriseText : fill(s.notYet, { t: S.clockT })) + '</div>';
    if (ln === 'dc') h += '<div class="lane-empty" style="grid-column:' + cols[ln] + ';grid-row:' + (rr + 1) + '">' + ico('lock') + ' ' + s.dcNoLog + '</div>';
    h += '</section>';
    if (li === 0) h += logBand(c, st);
  });
  return h + '</div>';
}
function screen3(c, st) {
  const s = STR.s3;
  return '<div class="two"><div class="phonecol">' + phoneStatus(c, st, false) + '</div><div class="stack">' + timebar(c, st) + waitBox(c, st) +
    '<p class="small muted">' + ico('info') + ' ' + s.factHint + ' ' + fill(s.rules, { tap: 'Vi' }) + '</p>' + lanes(c, st) + '</div></div>';
}
function checkedBlock(c, st) {
  const s = STR.s4;
  let h = '<details class="x"><summary>' + s.checked + '</summary><div>';
  if (c.candidates) h += '<div class="tblwrap"><table class="tbl"><thead><tr>' + s.cand.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' + c.candidates.map((k) => '<tr>' + k.map((x) => '<td>' + x + '</td>').join('') + '</tr>').join('') + '</tbody></table></div><p class="note amber">' + ico('alert') + '<span>' + esc(c.feed) + '</span></p>';
  if (c.log.length && st.logOpen) h += '<h4>' + layerMark('log') + ' ' + s.checkedLog + ' ' + tag('proposed') + '</h4><div class="tblwrap"><table class="tbl"><thead><tr>' + s.thr.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' + c.log.map((r) => '<tr><td class="num">' + r.t + '</td><td>' + esc(actorName(c, r.w)) + '</td><td>' + r.check + '</td><td>' + esc(r.result) + (r.ver ? ', register ' + r.ver : '') + '</td></tr>').join('') + '</tbody></table></div>' + (c.logNote ? '<p class="small muted">' + c.logNote + '</p>' : '') + '<p class="small muted">' + s.logNote + '</p>';
  const srcs = c.src.map((r, i) => [r, i]).filter((x) => (!x[0].on || x[0].on(S.opts)) && TM.sec(x[0].t) <= TM.sec(S.clockT) && posAt(c, x[0].t) <= S.pos);
  if (srcs.length) h += '<h4>' + s.checkedSrc + ' ' + tag('exists') + '</h4><div class="stack-s">' + srcs.map((x) => factBtn('src:' + x[1])).join('') + '</div>';
  return h + '<p class="small muted">' + tag('illus') + ' ' + STR.x.illusNote + '</p></div></details>';
}
function findingCard(c, st) {
  const s = STR.s4, f = st.finding ? c.finding(S.opts) : null;
  let h = '<div class="card stack"><div><p class="eyebrow">' + s.allegation + '</p><p class="quote">"' + esc(S.reason) + '"</p></div>';
  if (S.overturned) h += '<div class="note amber">' + ico('restart') + '<span>' + STR.s5.overturned + '</span></div>';
  if (!f) {
    h += '<div><p class="eyebrow">' + s.finding + '</p><p class="finding-name"><span class="chip amber">' + ico('clock') + STR.s4.b.pending + '</span>' + s.noFinding + '</p></div><p>' + esc(c.pendingWhy || s.noFindingWhy) + '</p><p class="note">' + ico('info') + '<span>' + s.noFindingWhy + '</span></p>' +
      '<dl class="kv"><dt>' + STR.x.statusNow + '</dt><dd>' + esc(st.sub || STR.steps[Math.max(0, st.step)]) + '</dd><dt>' + STR.owner + '</dt><dd>' + esc(st.owner || STR.none) + '</dd><dt>' + STR.nextUpdate + '</dt><dd>' + esc(st.next || STR.none) + '</dd></dl>';
    const refs = c.src.filter((r) => TM.sec(r.t) <= TM.sec(S.clockT));
    if (refs.length) h += '<div><p class="eyebrow">' + STR.x.soFar + '</p><div class="stack-s">' + c.src.map((r, i) => TM.sec(r.t) <= TM.sec(S.clockT) ? factBtn('src:' + i) : '').join('') + '</div></div>';
    return h + checkedBlock(c, st) + '</div>';
  }
  const tone = f.tone, icn = tone === 'red' ? 'alert' : tone === 'green' ? 'check' : 'clock';
  h += '<div><p class="eyebrow">' + s.answers + '</p><div class="stack-s">' + f.facts.map((x) => factBtn(x[0] + ':' + x[1], x[2])).join('') + '</div></div>' +
    '<div><p class="eyebrow">' + (f.interim ? s.interim : s.finding) + ' · ' + f.at + '</p><p class="finding-name"><span class="chip ' + tone + '">' + ico(icn) + s.b[f.branch] + '</span>' + esc(f.name) + '</p><p style="font-size:17px;margin-top:6px"><b>' + esc(f.head) + '</b></p></div>' +
    '<div><p class="eyebrow">' + s.why + '</p><p>' + esc(f.why) + '</p></div>' +
    '<dl class="kv"><dt>' + s.authority + '</dt><dd>' + esc(f.authority) + '</dd><dt>' + s.runner + '</dt><dd>' + esc(f.runner) + ' <span class="muted">(' + STR.x.telco + ')</span></dd><dt>' + s.rule + '</dt><dd>' + f.rule + ' ' + tag('illus') + '</dd><dt>' + s.oap + '</dt><dd>' + esc(f.oapPos) + ' ' + tag('illus') + '</dd><dt>' + s.actor + '</dt><dd>' + esc(f.actor) + '</dd><dt>' + s.first + '</dt><dd>' + esc(f.first) + '</dd></dl>';
  if (st.msg) h += '<div class="note">' + ico('phone') + '<span><b>' + s.told + ':</b> ' + st.msg.map(esc).join(' ') + '</span></div>';
  return h + checkedBlock(c, st) + '</div>';
}
function screen4(c, st) {
  const s = STR.s4, ic = { violation: 'alert', none: 'check', pending: 'clock' }, tn = { violation: 'red', none: 'green', pending: 'amber' }, load = { violation: 'C101', none: 'C102', pending: 'C103' };
  const curBranch = st.finding ? c.finding(S.opts).branch : 'pending';
  return '<div class="stack"><div class="branches" role="group" aria-label="' + s.branches + '">' + ['violation', 'none', 'pending'].map((b) => '<button class="branch" data-act="branch" data-arg="' + load[b] + '" aria-pressed="' + (curBranch === b) + '"><b><span class="chip ' + tn[b] + '">' + ico(ic[b]) + s.b[b] + '</span></b><span class="small muted">' + s.bLoads[b] + (curBranch === b ? ' · ' + fill(s.showing, { id: caseName(c), label: c.label }) : '') + '</span></button>').join('') + '</div>' +
    '<div class="two wide">' + findingCard(c, st) + '<div class="stack">' + timebar(c, st) + waitBox(c, st) + '</div></div></div>';
}
function taskCard(c, st) {
  const s = STR.s5, t = c.task ? c.task(S.opts) : null;
  if (!t || !st.task) return '<div class="card"><h3>' + s.task + '</h3><p class="muted">' + (c.kind === 'call' ? STR.x.noEnterpriseText : s.taskNone) + '</p></div>';
  const order = ['assigned', 'acknowledged', 'investigating', 'applied', 'verified'], idx = order.indexOf(st.task), f = s.tf;
  let h = '<div class="card stack"><h3>' + s.task + '</h3><ol class="track" aria-label="' + s.task + '">' + s.taskStates.map((n, i) => '<li class="' + (i < idx || idx === 4 ? 'done' : i === idx ? 'now' : '') + '">' + (i < idx || idx === 4 ? ico('check') : i === idx ? ico('clock') : '') + n + '</li>').join('') + '</ol><p class="small muted">' + s.taskBranches + '</p>';
  if (st.task === 'acknowledged') h += '<p class="note amber">' + ico('alert') + '<span>' + s.ackWarn + '</span></p>';
  if (st.task === 'applied') h += '<p class="note amber">' + ico('alert') + '<span>' + s.appliedWarn + '</span></p>';
  h += '<dl class="kv"><dt>' + f.pe + '</dt><dd>Example Retail, Online Retail</dd><dt>' + f.item + '</dt><dd>' + esc(t.item) + '</dd><dt>' + f.reason + '</dt><dd>' + esc(t.reason) + '</dd><dt>' + f.evidence + '</dt><dd>' + esc(t.evidence) + '</dd><dt>' + f.fix + '</dt><dd>' + esc(t.fix) + '</dd><dt>' + f.due + '</dt><dd>' + esc(t.due) + ' ' + tag('illus') + '</dd><dt>' + f.owner + '</dt><dd>' + esc(t.owner) + '</dd><dt>' + f.done + '</dt><dd>' + s.completion + '</dd><dt>' + f.challenge + '</dt><dd>' + s.challenge + '</dd></dl>' +
    '<details class="x"><summary>' + s.overdue + '</summary><div><p>' + fill(s.overdueText, { tap: 'Vi (TAP)' }) + '</p></div></details></div>';
  return h;
}
function scoreCard(c, st) {
  const s = STR.s5;
  let h = '<div class="card stack"><h3>' + s.score + '</h3><p class="small muted">' + s.scoreBelongs + '</p><div class="row"><span>' + s.band + ':</span><span class="chip green">' + ico('shield') + s.bandGreen + '</span>' + tag('illus') + '</div><p class="small muted">' + fill(s.bandNote) + '</p>';
  if (!c.score || !st.score) return h + '<p class="muted">' + (c.score ? s.ledgerEmpty : STR.x.noScore) + '</p></div>';
  const sc = c.score, alt = S.opts.alt && sc.altDecision;
  const adj = sc.key === 'decrease' ? '<span class="chip red">' + ico('down') + s.entries.decrease + '</span><br><span class="small">' + fill(s.demerit) + ' ' + tag('illus') + '</span>' : '<span class="chip">' + s.entries.nochange + '</span>';
  const row = (cells) => '<tr>' + cells.map((x) => '<td>' + x + '</td>').join('') + '</tr>';
  h += '<div class="tblwrap"><table class="tbl"><thead><tr>' + s.ledgerHead.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' +
    row([caseName(c) + '<br><span class="small muted num">' + (alt ? sc.altAt : sc.at) + '</span>', esc(sc.incident), esc(alt ? 'Not yet attributed' : sc.actor), esc(alt ? sc.altDecision : sc.decision), sc.policy, esc(sc.severity), adj, S.overturned ? STR.x.overturnedShort : STR.none]);
  if (S.overturned) h += row([caseName(c) + '<br><span class="small muted num">' + TM.add(S.clockT, 0) + '</span>', esc(sc.incident), esc(sc.actor), STR.x.reversalDecision, sc.policy, STR.none, '<span class="chip amber">' + ico('restart') + s.entries.reversal + '</span>', STR.x.overturnedShort]);
  h += '</tbody></table></div><p class="small muted">' + s.scoreSep + '</p>';
  if (c.id === 'C101') h += '<button class="btn" data-act="overturn" aria-pressed="' + S.overturned + '">' + ico('restart') + (S.overturned ? s.overturnUndo : s.overturn) + '</button>' + (S.overturned ? '<p class="note amber">' + ico('info') + '<span>' + s.overturned + '</span></p>' : '');
  return h + '</div>';
}
function advanceCard(c, st) {
  const s = STR.s5, w = st.wd, rank = { requested: 1, effective: 2, informed: 3 }[st.remedy] || 0;
  const first = w ? [s.stages.recorded, st.wdAt, true] : [s.stages.requested, '', rank >= 1];
  const eff = [s.stages.effective, st.effectiveAt || st.inForceAt || '', rank >= 2 || w === 'inforce'];
  const inf = [s.stages.informed, st.stoppedAt || '', !!st.informed];
  const idx = st.list.findIndex((e, i) => i >= S.pos && (e.p.remedy || e.p.informed || e.p.wd === 'inforce'));
  if (st.informed && !st.remedy && !w) return '<div class="card stack"><h3>' + s.advance + '</h3><p class="note green">' + ico('check') + '<span>' + fill(STR.stepSkipped, { why: st.skip || '' }) + ' ' + s.done + '</span></p></div>';
  let btn;
  if (idx >= 0) { const e = st.list[idx]; btn = '<button class="btn primary" data-act="setpos" data-arg="' + (idx + 1) + '">' + esc(fill(s.advanceTo, { what: e.ttl, t: e.t })) + ico('right') + '</button>'; }
  else if (st.nextEv) btn = '<button class="btn primary" data-act="step">' + STR.s3.step + ': ' + esc(st.nextEv.ttl) + ico('step') + '</button>';
  else btn = '<p class="note ' + (st.informed ? 'green' : 'amber') + '">' + ico(st.informed ? 'check' : 'clock') + '<span>' + (st.informed && !S.overturned ? s.done : s.stillOpen + ' ' + STR.owner + ': ' + esc(st.owner || STR.none) + '. ' + STR.nextUpdate + ': ' + esc(st.next || STR.none) + '.') + '</span></p>';
  return '<div class="card stack"><h3>' + s.advance + '</h3><div class="adv">' + [first, eff, inf].map((x) => '<div class="' + (x[2] ? 'done' : '') + '"><b>' + (x[2] ? ico('check') : ico('clock')) + x[0] + '</b><span class="small num">' + (x[2] && x[1] ? x[1] : x[2] ? '' : STR.pending) + '</span></div>').join('') + '</div>' + btn + '</div>';
}
function followCard(c, st) {
  if (!c.follow || !st.follow) return '';
  return '<div class="card"><h3>' + STR.s5.follow + '</h3><dl class="kv"><dt>' + STR.x.taskWord + '</dt><dd>' + esc(c.follow.task) + '</dd><dt>' + STR.owner + '</dt><dd>' + esc(c.follow.owner) + '</dd><dt>' + STR.desk.crmF.status + '</dt><dd><span class="chip amber">' + ico('clock') + c.follow.state + '</span></dd></dl><p class="small muted">' + STR.s5.followNote + '</p></div>';
}
function screen5(c, st) {
  const s = STR.s5;
  return '<div class="two"><div class="phonecol"><p class="eyebrow">' + s.left + '</p>' + phoneStatus(c, st, false) + '</div><div class="stack"><p class="eyebrow">' + s.right + '</p>' + advanceCard(c, st) + taskCard(c, st) + followCard(c, st) + scoreCard(c, st) + '</div></div>';
}
function repeatParams(c) { return c.id === 'C105' ? CASES.C101.repeat : c.repeat; }
function screen6(c, st) {
  const s = STR.s6, rp = repeatParams(c), n = S.s6;
  let right = '<div class="card stack"><h3>' + s.controls + '</h3><div class="row"><button class="btn" data-act="again" aria-pressed="' + n.again + '">' + ico('flag') + s.again + '</button><button class="btn" data-act="disagree" aria-pressed="' + S.appeal + '">' + ico('alert') + s.disagree + '</button><button class="btn" data-act="s6note" data-arg="dup" aria-pressed="' + (n.note === 'dup') + '">' + s.dup + '</button><button class="btn" data-act="s6note" data-arg="other" aria-pressed="' + (n.note === 'other') + '">' + s.other + '</button></div>';
  if (S.appeal) right += '<p class="note amber">' + ico('user') + '<span>' + fill(s.appealOpen, { id: caseName(c), t: TM.add(S.clockT, CONFIG.nextUpdateMinutes) }) + ' ' + s.appealResult + '</span></p>';
  if (n.note === 'dup') right += '<p class="note">' + ico('info') + '<span>' + fill(s.dupResult, { id: caseName(c) }) + '</span></p>';
  if (n.note === 'other') right += '<p class="note">' + ico('info') + '<span>' + s.otherResult + '</span></p>';
  right += '</div>';
  if (n.again || c.id === 'C105') {
    right += '<div class="card stack"><h3>' + s.same + '</h3><p class="muted">' + s.sameHint + '</p>';
    if (c.id === 'C105') right += '<p class="note teal">' + ico('link') + '<span>' + fill(s.linked, { id: 'C101' }) + '</span></p>';
    else right += '<div class="row"><button class="btn primary" data-act="link" data-arg="yes" aria-pressed="' + (n.linked === 'yes') + '">' + fill(s.sameYes, { id: caseName(c) }) + '</button><button class="btn" data-act="link" data-arg="no" aria-pressed="' + (n.linked === 'no') + '">' + s.sameNo + '</button></div>' + (n.linked === 'yes' ? '<p class="note teal">' + ico('link') + '<span>' + fill(s.linked, { id: caseName(c) }) + '</span></p>' + (c.id === 'C101' ? '<button class="btn" data-act="open105">' + s.open105 + ico('right') + '</button>' : '') : n.linked === 'no' ? '<p class="note">' + ico('info') + '<span>' + s.notLinked + '</span></p>' : '');
    right += '</div>';
  }
  if (rp) {
    const a = TM.sec(rp.recorded) - 600, b = a + 3600, x = (t) => Math.max(0, Math.min(100, ((TM.sec(t) - a) / (b - a)) * 100));
    const send = n.send || rp.def, late = TM.sec(send) >= TM.sec(rp.inForce), deliv = TM.fmt(TM.sec(send) + (late ? 24 : 240));
    right += '<div class="card stack"><h3>' + s.tl + '</h3><div class="rtl" role="img" aria-label="' + esc(fill(late ? s.lateText : s.earlyText, { s: send, f: rp.inForce })) + '"><div class="axis"></div><div class="zone" style="left:' + x(rp.inForce) + '%"></div>' +
      '<div class="mk" style="left:' + x(rp.recorded) + '%">' + fill(s.recorded, { t: rp.recorded }) + '<i></i></div><div class="mk teal low" style="left:' + x(rp.inForce) + '%">' + ico('check') + fill(s.inforce, { t: rp.inForce }) + '<i></i></div><div class="mk ' + (late ? 'red' : 'amber') + '" style="left:' + x(send) + '%;top:' + (Math.abs(x(send) - x(rp.recorded)) < 22 ? 20 : 0) + 'px">' + ico('flag') + fill(s.newSend, { t: send }) + '<i></i></div></div>' +
      '<div class="row"><label for="sendtime"><b>' + s.field + '</b></label><input class="time num" type="time" id="sendtime" data-chg="send" value="' + send + '" min="' + TM.add(rp.recorded, 1) + '" max="' + TM.fmt(b - 60) + '"><span>' + s.presets + ':</span><button class="btn sm" data-act="send" data-arg="' + rp.def + '">' + rp.def + '</button><button class="btn sm" data-act="send" data-arg="' + rp.alt + '">' + rp.alt + '</button>' + tag('illus') + '</div>' +
      '<div class="note ' + (late ? 'red' : 'amber') + '">' + ico(late ? 'alert' : 'clock') + '<span><b>' + (late ? s.late : s.early) + '</b><br>' + fill(late ? s.lateText : s.earlyText, { s: send, f: rp.inForce }) + ' ' + fill(s.delivered, { t: deliv }) + '.</span></div><p class="small muted">' + s.rule + '</p></div>';
  } else right += '<div class="card"><h3>' + s.tl + '</h3><p class="muted">' + s.noFix + '</p></div>';
  const linkedN = (c.id === 'C105' || n.linked === 'yes') ? 2 : 1;
  right += '<div class="card stack"><h3>' + s.prevention + '</h3><p class="muted">' + fill(s.preventionText) + ' ' + tag('illus') + '</p>' + ((c.id === 'C101' || c.id === 'C105') ? '<div class="tblwrap"><table class="tbl"><thead><tr>' + s.prevHead.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody><tr><td>Example Retail, campaign on list L-0911</td><td class="num">' + linkedN + '</td><td class="num">1</td><td class="num">14:07</td><td>' + (linkedN > 1 ? ((c.id === 'C105' ? c.late : TM.sec(n.send) >= TM.sec(rp.inForce)) ? STR.x.recurYes : STR.x.recurNo) : STR.none) + '</td></tr></tbody></table></div>' : '') + '</div>';
  return '<div class="two"><div class="phonecol">' + phoneStatus(c, st, true) + '</div><div class="stack">' + right + '</div></div>';
}
function caseTally() {
  return CASE_ORDER.map((id) => {
    const c = CASES[id], o = { w: !!(c.consent && c.consent.boxDefault), alt: false }, list = evs(c, o), st = derive(c, list.length, o);
    const save = S.overturned; let m;
    if (!c.inScope) m = 'excluded'; else if (st.stopped) m = mins(c.regAt, st.stoppedAt) <= CONFIG.metric.targetMinutes ? 'met' : 'missed'; else m = 'pending';
    if (id === 'C101' && save && S.caseId === 'C101') m = 'overturned';
    return { c, st, m, n: st.stopped ? mins(c.regAt, st.stoppedAt) : null };
  });
}
function screen7(c, st) {
  const s = STR.s7, m = metricOf(c, st, S.clockT), el = st.stopped ? mins(c.regAt, st.stoppedAt) : null;
  const res = m === 'excluded' ? '' : m === 'overturned' ? s.resOverturned : m === 'met' ? fill(s.resMet, { n: el }) : m === 'missed' ? fill(s.resMissed, { n: el }) : fill(s.resPending);
  let h = '<div class="stack"><div class="cols2"><div class="hero-metric"><p class="eyebrow" style="color:inherit;opacity:.8">' + s.metric + '</p><p class="big">' + fill(s.metricText) + '</p><span class="base">' + s.baseline + '</span><ul>' + s.metricRules.map((x) => '<li>' + x + '</li>').join('') + '</ul></div>' +
    '<div class="stack"><div class="card stack"><h3>' + s.counted + '</h3><div class="row">' + tag(c.stage) + badge(m) + '</div><p>' + fill(c.inScope ? s.countYes : s.countNo, { id: caseName(c) }) + ' ' + res + '</p></div>' +
    '<div class="card stack"><h3>' + s.examples + '</h3><p class="small muted">' + tag('illus') + ' ' + s.examplesNote + '</p><div class="tblwrap"><table class="tbl"><thead><tr>' + s.exHead.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' +
    caseTally().map((r) => '<tr><td><b>' + caseName(r.c) + '</b><br><span class="small muted">' + esc(r.c.label) + '</span></td><td>' + tag(r.c.stage) + '</td><td>' + (r.c.inScope ? s.yes : s.no) + '</td><td class="num">' + (r.n != null ? fill(STR.x.minutes, { n: r.n }) : STR.x.open) + '</td><td>' + badge(r.m) + '</td></tr>').join('') + '</tbody></table></div></div></div></div>';
  h += '<section class="sec"><h3>' + s.rollout + '</h3><div class="stage-row">' + s.stages.map((x) => '<div>' + tag(x.tag) + '<b>' + x.name + '</b><span>' + x.who + '</span><span class="muted small">' + x.what + '</span><span class="muted small">' + x.how + '</span></div>').join('') + '</div><p class="small muted" style="margin-top:6px">' + s.stage1Note + '</p></section>';
  h += '<div class="cols2"><div class="card"><h3>' + s.proofs + '</h3><ol class="stack-s">' + s.proofList.map((x) => '<li><b>' + x[0] + '.</b> <span class="muted">' + x[1] + '</span></li>').join('') + '</ol></div><div class="card"><h3>' + s.ask + '</h3><ol class="asks">' + s.asks.map((x) => '<li><span><b>' + x[0] + '.</b><br><span class="muted">' + x[1] + '</span></span></li>').join('') + '</ol></div></div>';
  if (st.informed && c.outcome && !S.overturned) { const o = c.outcome(S.opts); h += '<div class="card"><h3>' + STR.x.forRohan + '</h3><p>' + esc(o.done) + ' ' + esc(o.protection) + '</p><p class="small muted">' + STR.x.reportAnother + '</p></div>'; }
  return h + '</div>';
}
