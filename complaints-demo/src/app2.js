/* ============================================================
   Role desks: the same case and clock, seen by each party.
   A role's action performs that role's next timed event.
   ============================================================ */
function rolesFor(c) { const r = ['sub', 'tap']; if (c.pair !== 'internal') r.push('oap'); r.push('dc'); if (c.kind !== 'call') r.push('pe'); r.push('rev'); return r; }
function roleLabel(c, r) { return r === 'tap' || r === 'oap' ? actorName(c, r) : STR.desk.roles[r].name; }
function turn(c, st, role) {
  const d = STR.desk;
  if (!S.submitted) return role === 'sub' ? '' : '<div class="turn wait"><span class="grow">' + d.preReg + '</span><button class="btn" data-act="desksubmit">' + d.submitFirst + '</button></div>';
  const ne = st.nextEv;
  if (!ne) return '<div class="turn wait">' + ico('check') + '<span class="grow">' + d.nothing + '</span></div>';
  const who = roleOf(c, ne.a), label = ne.act || ne.ttl;
  if (who === role) return '<div class="turn">' + ico('flag') + '<span class="grow"><b>' + d.yourTurn + '</b><br>' + esc(ne.t) + ' · ' + esc(label) + '</span><button class="btn" data-act="step">' + esc(label) + ico('right') + '</button></div>';
  return '<div class="turn wait">' + ico('clock') + '<span class="grow"><b>' + fill(d.waitingOn, { who: esc(actorName(c, ne.a)) }) + '</b><br>' + esc(ne.t) + ' · ' + esc(label) + '</span><button class="btn" data-act="step">' + d.stepTo + ico('step') + '</button></div>';
}
function activity(c, st, role) {
  const mine = st.applied.filter((e) => roleOf(c, e.a) === role || (c.pair === 'internal' && e.lane === 'oap' ? 'tap' : e.lane) === role);
  return '<div class="card"><h3>' + STR.desk.activity + '</h3>' + (mine.length ? '<ol class="queue">' + mine.map((e) => '<li><span class="num">' + e.t + '</span><span><b>' + esc(e.ttl) + '</b><small>' + esc(e.txt) + '</small></span></li>').join('') + '</ol>' : '<p class="muted">' + STR.x.activityNone + '</p>') + '</div>';
}
function rail(c, st, role) {
  const d = STR.desk, R = d.roles[role];
  let h = '<aside class="stack"><div class="card"><h4>' + d.sees + '</h4><ul class="small stack-s">' + R.sees.map((x) => '<li>' + x + '</li>').join('') + '</ul><h4 style="margin-top:10px">' + d.cannot + '</h4><ul class="small stack-s">' + R.cannot.map((x) => '<li>' + x + '</li>').join('') + '</ul></div>';
  if (S.submitted) h += '<div class="card"><h4>' + d.queue + '</h4><ol class="queue">' + st.list.map((e, i) => '<li class="' + (i < S.pos ? 'done' : i === S.pos ? 'now' : '') + '"><span class="num">' + e.t + '</span><span>' + esc(i < S.pos ? e.ttl : (e.act || STR.x.auto)) + '<small>' + esc(actorName(c, e.a)) + ' · ' + (i < S.pos ? d.queueDone : i === S.pos ? d.queueNow : d.queueLater) + '</small></span></li>').join('') + '</ol></div>';
  return h + '</aside>';
}
function logTable(c, rows) {
  return '<div class="tblwrap"><table class="tbl"><thead><tr>' + STR.s4.thr.map((x) => '<th>' + x + '</th>').join('') + '<th></th></tr></thead><tbody>' + rows.map((x) => '<tr><td class="num">' + x[0].t + '</td><td>' + esc(actorName(c, x[0].w)) + '</td><td>' + layerMark(x[0].layer) + ' ' + x[0].check + '</td><td>' + esc(x[0].result) + (x[0].ver ? ', register ' + x[0].ver : '') + '</td><td><button class="btn sm" data-act="fact" data-arg="log:' + x[1] + '" aria-haspopup="dialog">' + STR.fact.title + '</button></td></tr>').join('') + '</tbody></table></div>';
}
function findingMini(c, st) {
  if (!st.finding) return '<p class="muted">' + STR.x.noFindingYet + '</p>';
  const f = c.finding(S.opts);
  return '<p class="finding-name" style="font-size:18px"><span class="chip ' + f.tone + '">' + ico(f.tone === 'red' ? 'alert' : f.tone === 'green' ? 'check' : 'clock') + STR.s4.b[f.branch] + '</span>' + esc(f.name) + '</p><p>' + esc(f.head) + '</p>';
}
function deskTap(c, st) {
  const d = STR.desk, f = d.crmF;
  let h = '<div class="card stack"><h3>' + d.crm + '</h3><dl class="kv"><dt>' + f.sr + '</dt><dd>' + c.sr + ' · ' + caseName(c) + ' ' + tag(c.stage) + '</dd><dt>' + f.status + '</dt><dd>' + chipHtml(st) + '</dd><dt>' + f.sub + '</dt><dd>' + esc(st.sub || STR.steps[Math.max(0, st.step)]) + '</dd><dt>' + STR.owner + '</dt><dd>' + esc(st.owner || STR.none) + '</dd><dt>' + STR.nextUpdate + '</dt><dd>' + esc(st.next || STR.none) + '</dd><dt>' + f.match + '</dt><dd>' + (st.logOpen || c.noLog ? esc(c.match) : STR.pending) + '</dd><dt>' + f.feed + '</dt><dd>' + esc(c.feed) + '</dd>' + (c.linked ? '<dt>' + f.linked + '</dt><dd>' + c.linked + '</dd>' : '') + '</dl></div>';
  h += '<div class="card stack"><h3>' + ico('lock') + ' ' + d.logView + ' ' + tag(c.noLog ? 'later' : 'proposed') + '</h3>';
  if (c.noLog) h += '<p class="muted">' + STR.s3.logNone + '</p>';
  else if (!st.logOpen) h += '<div class="lockbox">' + ico('lock') + '<span>' + STR.s3.logClosed + ' ' + d.logAccess + '</span></div>';
  else {
    h += '<p class="small muted">' + fill(STR.s3.logOpened, { id: c.id, t: c.logOpenAt }) + ' ' + d.logAccess + '</p>';
    if (c.candidates) h += '<div class="tblwrap"><table class="tbl"><thead><tr>' + STR.s4.cand.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' + c.candidates.map((k) => '<tr>' + k.map((x) => '<td>' + x + '</td>').join('') + '</tr>').join('') + '</tbody></table></div><p class="note amber">' + ico('alert') + '<span>' + esc(c.feed) + '</span></p>';
    if (c.log.length) h += logTable(c, c.log.map((r, i) => [r, i]));
    if (c.logNote) h += '<p class="small muted">' + c.logNote + '</p>';
  }
  h += '</div><div class="card stack"><h3>' + STR.s4.finding + '</h3>' + findingMini(c, st) + '<p class="small muted">' + fill(STR.s3.rules, { tap: 'Vi' }) + '</p></div>';
  return h + activity(c, st, 'tap');
}
function deskOap(c, st) {
  const d = STR.desk;
  let h = '<div class="card stack"><h3>' + d.channel + '</h3><p>' + (S.submitted ? esc(st.applied.filter((e) => e.lane === 'oap').map((e) => e.ttl)[0] || STR.x.activityNone) : STR.x.activityNone) + '</p></div>';
  const mine = c.log.map((r, i) => [r, i]).filter((x) => x[0].w === 'oap');
  h += '<div class="card stack"><h3>' + ico('lock') + ' ' + fill(STR.x.logHalf, { who: esc(actorName(c, 'oap')) }) + ' ' + tag(c.noLog ? 'later' : 'proposed') + '</h3>' + (c.noLog ? '<p class="muted">' + STR.s3.logNone + '</p>' : mine.length ? logTable(c, mine) + '<p class="small muted">' + STR.x.logHalfNote + '</p>' : '<p class="note amber">' + ico('alert') + '<span>' + esc(c.feed) + '</span></p>') + '</div>';
  h += '<div class="card stack"><h3>' + d.matrix + ' ' + tag('illus') + '</h3>' + findingMini(c, st) + (st.finding ? '<dl class="kv"><dt>' + STR.x.position + '</dt><dd>' + esc(c.finding(S.opts).oapPos) + '</dd><dt>' + STR.desk.crmF.status + '</dt><dd>' + (st.accepted ? '<span class="chip green">' + ico('check') + STR.x.accepted + '</span>' : '<span class="chip amber">' + ico('clock') + STR.x.awaiting + '</span>') + '</dd></dl>' : '') + '<p class="small muted">' + d.matrixNote + '</p></div>';
  return h + activity(c, st, 'oap');
}
function deskDc(c, st) {
  const d = STR.desk, f = d.regF, k = c.consent;
  let h = '<div class="card stack"><h3>' + d.register + '</h3>';
  if (!k) h += '<p class="muted">' + STR.s5.wdNA + '</p>';
  else {
    const sms = st.wd === 'inforce' ? d.off + ' (' + STR.s2.inForce.toLowerCase() + ' ' + st.inForceAt + ')' : st.wd === 'recorded' ? d.offPending : d.on;
    h += '<dl class="kv"><dt>' + f.id + '</dt><dd>' + k.id + '</dd><dt>' + f.scope + '</dt><dd>' + esc(k.scope) + '</dd><dt>' + f.sms + '</dt><dd><span class="chip ' + (st.wd === 'inforce' ? 'green' : st.wd ? 'amber' : '') + '">' + sms + '</span></dd><dt>' + f.calls + '</dt><dd>' + STR.x.callsNone + '</dd><dt>' + f.version + '</dt><dd>' + (st.wd ? k.v1 : k.v0) + ' ' + tag('illus') + '</dd><dt>' + f.receipt + '</dt><dd>' + (st.wd ? k.receipt : STR.none) + '</dd><dt>' + f.history + '</dt><dd>' + fill(STR.x.granted, { d: k.granted }) + (st.wd ? '<br>' + fill(STR.s5.wdRecorded, { t: st.wdAt }) : '') + (st.wd === 'inforce' ? '<br>' + fill(STR.s5.wdInForce, { t: st.inForceAt }) : '') + '</dd></dl>';
    if (S.submitted && !st.wd) h += '<p class="note">' + ico('info') + '<span>' + STR.s5.wdNone + '</span></p>';
  }
  h += '</div><div class="lockbox">' + ico('lock') + '<span><b>' + d.lockedLog + '.</b> ' + d.lockedLogText + ' ' + d.noLogDesk + '</span></div>';
  return h + taskCard(c, st) + scoreCard(c, st) + activity(c, st, 'dc');
}
function deskPe(c, st) {
  const got = c.src.map((r, i) => [r, i]).filter((x) => (!x[0].on || x[0].on(S.opts)) && S.submitted && posAt(c, x[0].t) <= S.pos && TM.sec(x[0].t) <= TM.sec(S.clockT));
  return taskCard(c, st) + '<div class="card stack"><h3>' + STR.x.returned + '</h3>' + (got.length ? got.map((x) => factBtn('src:' + x[1])).join('') : '<p class="muted">' + STR.x.nothingReturned + '</p>') + '</div>' + followCard(c, st) + activity(c, st, 'pe');
}
function deskRev(c, st) {
  const d = STR.desk; let items = '';
  if (S.appeal) items += '<p class="note amber">' + ico('user') + '<span>' + fill(d.revAppeal, { id: caseName(c) }) + '</span></p>';
  if (S.submitted && st.finding && c.finding(S.opts).interim) items += '<p class="note amber">' + ico('clock') + '<span>' + fill(d.revPending, { what: esc(c.finding(S.opts).name) }) + '</span></p>';
  let h = '<div class="card stack"><h3>' + d.revQueue + '</h3>' + (items || '<p class="muted">' + d.revEmpty + '</p>');
  if (st.finding) h += findingMini(c, st);
  if (c.id === 'C101' && st.score) h += '<button class="btn" data-act="overturn" aria-pressed="' + S.overturned + '">' + ico('restart') + (S.overturned ? STR.s5.overturnUndo : STR.s5.overturn) + '</button>' + (S.overturned ? '<p class="note amber">' + ico('info') + '<span>' + STR.s5.overturned + '</span></p>' : '');
  return h + '</div>' + (S.submitted ? scoreCard(c, st) : '');
}
function desks(c, st) {
  const d = STR.desk, roles = rolesFor(c);
  if (roles.indexOf(S.role) < 0) S.role = 'tap';
  const ne = S.submitted ? st.nextEv : null, nextRole = ne ? roleOf(c, ne.a) : (S.submitted ? null : 'sub');
  let h = '<main id="main"><p class="eyebrow" style="margin-bottom:6px">' + d.viewing + '</p><div class="roles" role="tablist" aria-label="' + d.viewing + '">' + roles.map((r) => '<button role="tab" data-act="role" data-arg="' + r + '" aria-selected="' + (S.role === r) + '"><b>' + (nextRole === r ? '<span class="dot" title="' + d.yourTurn + '"></span>' : '') + esc(roleLabel(c, r)) + '</b><small>' + (c.pair === 'internal' && r === 'tap' ? STR.x.laneBoth : d.roles[r].sub) + (nextRole === r ? ' · ' + d.yourTurn : '') + '</small></button>').join('') + '</div>';
  if (S.submitted) h += '<div style="margin-bottom:16px">' + timebar(c, st) + '</div>';
  const r = S.role, tb = turn(c, st, r);
  if (r === 'sub') h += '<div class="desk sub"><div class="phonecol">' + (S.submitted ? phoneStatus(c, st, st.informed) : (S.selected === c.target && S.screen >= 2 ? phoneForm(c) : phoneIntake(c))) + '</div><div class="stack">' + tb + (S.submitted ? waitBox(c, st) + activity(c, st, 'sub') : '<div class="card"><h3>' + STR.s1.prefill + '</h3>' + (S.selected === c.target ? prefillKv(c) : '<p class="muted">' + STR.s1.reportHint + '</p>') + '</div>') + '</div>' + rail(c, st, r) + '</div>';
  else h += '<div class="desk"><div class="stack">' + tb + (S.submitted || r === 'rev' ? ({ tap: deskTap, oap: deskOap, dc: deskDc, pe: deskPe, rev: deskRev }[r])(c, st) : '') + '</div>' + rail(c, st, r) + '</div>';
  return h + '</main>';
}

/* ============================================================
   Panels: about, operating detail, case selection, fact, architecture
   ============================================================ */
function panelShell(title, body, cls) {
  return '<div class="scrim" data-act="scrim"><section class="panel ' + (cls || '') + '" role="dialog" aria-modal="true" aria-labelledby="ptitle"><div class="panel-h"><h2 id="ptitle">' + title + '</h2><button class="btn" data-act="close" id="pclose">' + ico('x') + STR.close + '</button></div>' + body + '</section></div>';
}
function panelAbout() {
  return panelShell(STR.about, CONTENT.about.map((s) => '<section class="prose"><h3>' + s.h + '</h3>' + fill(s.html) + '</section>').join('') + '<section class="prose"><h3>' + STR.x.glossary + '</h3><dl class="gloss">' + CONTENT.glossary.map((g) => '<dt>' + g[0] + '</dt><dd>' + g[1] + '</dd>').join('') + '</dl></section>');
}
function panelDetail() {
  const n = S.screen;
  return panelShell(STR.detail + ': ' + STR.screens[n].name, '<div class="stack">' + CONTENT.detail[n].map((s, i) => '<details class="x"' + (i === 0 ? ' open' : '') + '><summary>' + s.h + '</summary><div class="prose">' + fill(s.html) + '</div></details>').join('') + '</div>');
}
function panelCases() {
  return panelShell(STR.caseSelectTitle, '<p class="muted">' + STR.caseSelectHint + '</p><ul class="caselist">' + CASE_ORDER.map((id) => { const c = CASES[id]; return '<li><button data-act="case" data-arg="' + id + '"' + (id === S.caseId ? ' aria-current="true"' : '') + '><span class="row"><b>' + caseName(c) + (id === 'VOICE' ? '' : ', ' + c.label.toLowerCase()) + '</b>' + tag(c.stage) + '</span><span class="muted small">' + esc(c.short) + ' · ' + esc(c.type) + ' · ' + (c.pair === 'internal' ? 'Vi to Vi' : c.pair === 'voice' ? 'Vi, Jio and Airtel' : 'BSNL to Vi') + '</span></button></li>'; }).join('') + '</ul>', 'narrow');
}
function panelFact() {
  const f = getFact(S.fact), L = STR.layers[f.layer], s = STR.fact;
  return panelShell(s.title, '<p style="font-size:17px"><b>' + esc(f.name) + '</b></p><dl class="kv"><dt>' + s.layer + '</dt><dd>' + layerMark(f.layer) + ' ' + L.name + ' ' + tag(L.status) + '</dd><dt>' + s.source + '</dt><dd>' + esc(f.source) + '</dd><dt>' + s.time + '</dt><dd class="num">' + esc(f.time) + '</dd>' + (f.ver ? '<dt>' + s.version + '</dt><dd>' + f.ver + '</dd>' : '') + '</dl><div class="note green">' + ico('check') + '<span><b>' + s.est + '</b><br>' + esc(f.est) + '</span></div><div class="note amber">' + ico('alert') + '<span><b>' + s.not + '</b><br>' + esc(f.not) + '</span></div><p class="small muted">' + tag('illus') + ' ' + STR.x.illusNote + '</p>', 'narrow');
}
function archOverview(c) {
  const A = STR.arch, s1 = S.arch.stage === 's1';
  const ops = [['Vi', 150, 70], ['BSNL', 570, 70], ['Jio', 150, 230], ['Airtel', 570, 230]], in1 = (n) => n === 'Vi' || n === 'BSNL';
  let lines = '', nodes = '';
  ops.forEach((a) => ops.forEach((b) => {
    if (a === b) return;
    const dx = b[1] - a[1], dy = b[2] - a[2], len = Math.hypot(dx, dy), ox = (-dy / len) * 6, oy = (dx / len) * 6;
    const hi = c.pair === 'cross' && a[0] === c.oap && b[0] === c.tap, dim = s1 && !(in1(a[0]) && in1(b[0]));
    const mx = a[1] + dx * 0.4 + ox, my = a[2] + dy * 0.4 + oy;
    lines += '<polyline points="' + (a[1] + ox) + ',' + (a[2] + oy) + ' ' + mx + ',' + my + ' ' + (b[1] + ox) + ',' + (b[2] + oy) + '" fill="none" stroke="' + (hi ? '#1F6F65' : '#173B5E') + '" stroke-width="' + (hi ? 4 : 1.2) + '" opacity="' + (dim ? 0.15 : hi ? 1 : 0.55) + '" marker-mid="url(#' + (hi ? 'ah' : 'an') + ')"/>';
  }));
  ops.forEach((o) => {
    const dim = s1 && !in1(o[0]), hi = c.pair === 'internal' && o[0] === c.tap, lx = o[1] + (o[1] < 360 ? -62 : 62), st = in1(o[0]) ? STR.tags.stage1 : STR.tags.stage2;
    nodes += '<g opacity="' + (dim ? 0.3 : 1) + '"><circle cx="' + lx + '" cy="' + (o[2] - 22) + '" r="15" fill="none" stroke="' + (hi ? '#1F6F65' : '#173B5E') + '" stroke-width="' + (hi ? 4 : 1.2) + '"/><rect x="' + (o[1] - 62) + '" y="' + (o[2] - 25) + '" width="124" height="50" rx="8" fill="#FFFFFF" stroke="#173B5E" stroke-width="1.5"/><text x="' + o[1] + '" y="' + (o[2] - 2) + '" text-anchor="middle" font-size="17" font-weight="700" fill="#173B5E">' + o[0] + '</text><text x="' + o[1] + '" y="' + (o[2] + 15) + '" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1" fill="#5B6B7B">' + st + '</text></g>';
  });
  const hiTxt = c.pair === 'cross' ? fill(A.pairHi, { oap: c.oap, tap: c.tap, id: c.id }) : c.pair === 'internal' ? fill(A.pairInt, { tap: c.tap, id: c.id }) : A.pairVoice;
  return '<div class="stack ov"><div class="arch-bar"><b>' + A.dlt + '</b>' + A.dltText + '</div>' +
    '<svg viewBox="0 0 720 300" role="img" aria-label="' + esc(A.svgAlt) + '"><defs><marker id="an" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1l8 4-8 4z" fill="#173B5E"/></marker><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1l8 4-8 4z" fill="#1F6F65"/></marker></defs>' + lines + nodes + '</svg>' +
    '<p class="small">' + ico('lock') + ' <b>' + (s1 ? A.pairsS1 : A.pairs) + '</b> ' + tag('proposed') + ' · ' + STR.s3.logLock + '. ' + hiTxt + '.</p>' +
    '<div><p class="eyebrow">' + A.streams + '</p><div class="streams"><div><b>' + A.stream1 + '</b><br>' + ico('lock') + ' ' + A.stream1b + ' ' + tag('proposed') + '</div><div class="later' + (c.pair === 'voice' ? ' hi' : '') + '"><b>' + A.stream2 + '</b><br>' + ico('net') + ' ' + A.stream2b + ' ' + tag('later') + '</div></div></div>' +
    '<div class="arch-bar dc"><b>' + A.dc + '</b><ul>' + A.dcItems.map((x) => '<li>' + x + '</li>').join('') + '</ul></div></div>';
}
function archModel(c, st) {
  const A = STR.arch, N = A.nodes, internal = c.pair === 'internal', voice = c.pair === 'voice', m = target(c);
  const v = { tap: actorName(c, 'tap'), oap: c.oap };
  const nodes = [
    { id: 'phone', x: 10, y: 250, w: 180, t: N.phone, b: (S.selected ? esc(m.header) + ', ' + m.time + '. ' : '') + (S.reason ? '"' + esc(S.reason) + '". ' : '') + (S.submitted ? esc(S.opts.w || !c.consent || c.consent.already ? c.remedy : c.remedyNo) : ''), lay: [] },
    { id: 'tap', x: 240, y: 230, w: 200, t: actorName(c, 'tap'), tags: ['stage1'], b: internal ? N.bothText : N.tapText, lay: ['net'] },
    { id: 'dlt', x: 420, y: 14, w: 230, t: N.dlt, b: N.dltText, lay: [] },
    internal ? null : { id: 'oap', x: 660, y: 230, w: 200, t: actorName(c, 'oap'), tags: [voice ? 'stage2' : 'stage1'], b: voice ? STR.x.jioText : N.oapText, lay: ['net'] },
    { id: 'log', x: internal ? 480 : 458, y: internal ? 240 : 250, w: 184, cls: voice ? 'dash' : 'log', t: voice ? STR.layers.net.short : N.log, icon: voice ? 'net' : 'lock', tags: [voice ? 'later' : 'proposed'], b: voice ? N.logNone : internal ? N.logTextOne : N.logText, lay: [voice ? 'net' : 'log'] },
    { id: 'src', x: 458, y: 440, w: 184, cls: 'dash', t: N.src, icon: 'doc', tags: ['exists'], b: N.srcText, lay: ['src'] },
    { id: 'dc', x: 200, y: 510, w: 240, t: A.dc, b: N.dcText, lay: ['src'] },
    { id: 'pe', x: 690, y: 480, w: 210, t: voice ? STR.x.noEnterprise : N.pe, b: voice ? STR.x.noEnterpriseText : N.peText, lay: ['src'] },
    { id: 'rev', x: 820, y: 14, w: 200, t: N.rev, b: N.revText, lay: [] },
    voice ? { id: 'airtel', x: 840, y: 150, w: 180, cls: 'dash', t: N.airtel, tags: ['stage2'], b: N.airtelText, lay: [] } : null
  ].filter(Boolean);
  const ctr = { phone: [100, 300], tap: [340, 290], dlt: [535, 50], oap: [760, 290], log: [internal ? 572 : 550, 300], src: [550, 480], dc: [320, 560], pe: [795, 520], rev: [920, 50], airtel: [930, 190] };
  const segs = [['phone', 'tap', ['report', 'inform']], ['tap', 'dlt', ['dlt']], internal ? null : ['dlt', 'oap', ['oap', 'reroute']], ['tap', 'log', ['log', 'finding']], internal ? null : ['oap', 'log', ['log']], ['tap', 'dc', ['wd', 'remedy', 'effective']], ['dc', 'pe', ['task', 'remedy']], ['pe', 'src', ['proof']], ['src', 'tap', ['proof']], voice ? ['tap', 'airtel', ['lookup']] : null].filter(Boolean)
    .map((s) => ({ a: s[0], b: s[1], lit: s[2].some((k) => k in st.edges) }));
  segs.push({ a: 'rev', b: 'tap', lit: S.overturned || S.appeal, dash: true });
  const keys = voice ? ['report', 'dlt', 'lookup', 'reroute', 'log', 'inform'] : ['report', 'dlt', 'oap', 'wd', 'log', 'task', 'proof', 'finding', 'remedy', 'effective', 'inform', 'score'].filter((k) => !(internal && k === 'oap') && !(k === 'wd' && c.consent == null));
  const edges = keys.map((k) => ({ k, text: fill(A.edges[k], v), at: st.edges[k] || null }));
  return { nodes, ctr, segs, edges };
}
function archCase(c, st) {
  const A = STR.arch, M = archModel(c, st), lf = S.arch.layer;
  const edgeList = '<ol class="edges">' + M.edges.map((e) => '<li class="' + (e.at ? 'lit' : '') + '">' + esc(e.text) + ' <span class="small">' + (e.at ? ico('check') + ' ' + fill(A.lit, { t: e.at }) : '(' + A.notLit + ')') + '</span></li>').join('') + '</ol>';
  if (S.arch.list) return '<ol class="stack-s">' + M.nodes.map((n) => '<li><b>' + esc(n.t) + '</b> ' + (n.tags || []).map(tag).join(' ') + '<br>' + n.b + '</li>').join('') + '</ol><h3>' + STR.x.pathOrder + '</h3>' + edgeList;
  const svg = '<svg viewBox="0 0 1040 660" aria-hidden="true">' + M.segs.map((s) => '<line class="seg-l' + (s.lit ? ' lit' : '') + (s.dash ? ' dash' : '') + '" x1="' + M.ctr[s.a][0] + '" y1="' + M.ctr[s.a][1] + '" x2="' + M.ctr[s.b][0] + '" y2="' + M.ctr[s.b][1] + '"/>').join('') + '</svg>';
  const boxes = M.nodes.map((n) => '<div class="nd ' + (n.cls || '') + (lf ? (n.lay.indexOf(lf) >= 0 ? ' hi' : ' dim') : '') + '" style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.w + 'px"><b>' + (n.icon ? ico(n.icon) : '') + esc(n.t) + ' ' + (n.tags || []).map(tag).join(' ') + '</b><span>' + n.b + '</span></div>').join('');
  const L = lf ? STR.layers[lf] : null;
  return '<div class="row"><span class="eyebrow">' + A.layerFilter + '</span><div class="seg" role="group" aria-label="' + A.layerFilter + '"><button data-act="archlayer" data-arg="" aria-pressed="' + !lf + '">' + A.layerOff + '</button>' + ['net', 'log', 'src'].map((k) => '<button data-act="archlayer" data-arg="' + k + '" aria-pressed="' + (lf === k) + '">' + ico(k === 'log' ? 'lock' : k === 'src' ? 'doc' : 'net') + STR.layers[k].short + '</button>').join('') + '</div></div>' +
    (L ? '<p class="note teal">' + ico('info') + '<span><b>' + L.name + '</b> ' + tag(L.status) + ' ' + L.where + ' ' + STR.fact.not + ': ' + NOT[lf === 'log' ? 'consent' : lf] + '</span></p>' : '') +
    '<div class="tcwrap" role="img" aria-label="' + esc(STR.x.caseAlt) + '"><div class="tc">' + svg + boxes + '</div></div><p class="small muted">' + STR.x.archClock + ' ' + (S.submitted ? esc(S.clockT) : STR.clockNotStarted) + '. ' + STR.x.rulesTelco + '</p><h3>' + STR.x.pathOrder + '</h3>' + edgeList;
}
function panelArch(c, st) {
  const A = STR.arch, a = S.arch;
  let h = '<div class="row"><div class="seg" role="group" aria-label="' + A.title + '"><button data-act="archview" data-arg="overview" aria-pressed="' + (a.view === 'overview') + '">' + A.overview + '</button><button data-act="archview" data-arg="case" aria-pressed="' + (a.view === 'case') + '">' + A.thisCase + ': ' + caseName(c) + '</button></div>';
  if (a.view === 'overview') h += '<div class="seg" role="group" aria-label="' + A.stageSwitch + '"><button data-act="archstage" data-arg="all" aria-pressed="' + (a.stage === 'all') + '">' + A.stageAll + '</button><button data-act="archstage" data-arg="s1" aria-pressed="' + (a.stage === 's1') + '">' + A.stage1 + '</button></div>';
  h += '<button class="btn" data-act="archlist" aria-pressed="' + a.list + '">' + ico(a.list ? 'diagram' : 'list') + (a.list ? A.diagram : A.list) + '</button></div>';
  if (a.view === 'overview') h += a.list ? '<ol class="stack-s"><li><b>' + A.dlt + '.</b> ' + A.dltText + '</li><li><b>Vi, BSNL, Jio and Airtel.</b> ' + (a.stage === 's1' ? A.pairsS1 + '. Vi and BSNL ' + tag('stage1') + '. Jio and Airtel ' + tag('stage2') : A.pairs) + '. ' + STR.s3.logLock + '. ' + tag('proposed') + '</li><li><b>' + A.stream1 + '.</b> ' + A.stream1b + '.</li><li><b>' + A.stream2 + '.</b> ' + A.stream2b + '. ' + tag('later') + '</li><li><b>' + A.dc + '.</b> ' + A.dcItems.join('. ') + '.</li></ol>' : archOverview(c);
  else h += archCase(c, st);
  return panelShell(A.title, h, 'wide');
}

/* ============================================================
   Render and events
   ============================================================ */
let lastScreenKey = '';
function render() {
  const c = cur(), st = now(), ae = document.activeElement;
  const fk = ae && ae.dataset && (ae.dataset.act || ae.dataset.chg) ? (ae.dataset.act || ae.dataset.chg) + '|' + (ae.dataset.arg || ae.value || '') : null;
  const inPanel = ae && ae.closest && ae.closest('#panel');
  let h = bar(c, st) + strip(c, st);
  if (S.mode === 'story') h += stepper() + '<main id="main">' + qhead(c) + [null, screen1, screen2, screen3, screen4, screen5, screen6, screen7][S.screen](c, st) + '</main>';
  else h += desks(c, st);
  h += '<footer class="foot"><p>' + STR.keys + ' ' + STR.fictional + ' ' + STR.x.namesNote + '</p></footer>';
  $('#app').innerHTML = h;
  const p = S.panel;
  $('#panel').innerHTML = !p ? '' : p === 'about' ? panelAbout() : p === 'detail' ? panelDetail() : p === 'cases' ? panelCases() : p === 'fact' ? panelFact() : panelArch(c, st);
  $('#app').inert = !!p;
  const key = S.mode + S.screen + S.caseId;
  let el = null;
  if (fk) { const [a, v] = fk.split('|'); el = Array.from(document.querySelectorAll('[data-act="' + a + '"],[data-chg="' + a + '"]')).find((x) => (x.dataset.arg || x.value || '') === v && (!!x.closest('#panel') === !!p)) || null; }
  if (p && (!el || !inPanel)) el = $('#pclose');
  if (!p && !el && key !== lastScreenKey) el = $('#top');
  if (el && !el.disabled) el.focus({ preventScroll: !!fk && el.id !== 'top' });
  lastScreenKey = key;
  if (liveMsg) { $('#live').textContent = liveMsg; liveMsg = ''; }
}
function stepTo(n) { const before = S.pos; setPos(n); const st = now(); if (S.pos !== before && st.last) say(fill(STR.live.clock, { t: st.last.t, what: st.last.ttl })); }
const ACT = {
  go: (a) => go(Number(a)), back: () => go(S.screen - 1), next: () => go(S.screen + 1), restart,
  mode: (a) => { S.mode = a; say(fill(STR.live.mode, { mode: a === 'story' ? STR.modeStory : STR.modeDesks })); },
  role: (a) => { S.role = a; },
  panel: (a) => { S.panel = a; }, close: () => { S.panel = null; }, scrim: (a, el, ev) => { if (ev.target === el) S.panel = null; else return false; },
  case: (a) => { S.panel = null; loadCase(a, S.mode === 'desks'); },
  fact: (a) => { S.fact = a; S.panel = 'fact'; },
  intake: (a) => { S.intake = a; S.wrong = false; }, today: () => { S.today = !S.today; },
  pick: (a) => { const ok = a === cur().target; S.selected = ok ? a : null; S.wrong = !ok; if (S.mode === 'desks' && ok) S.screen = 2; },
  shotpick: (a) => { S.shotSel = a; S.wrong = false; },
  shotok: () => { if (S.shotSel === cur().target) { S.selected = S.shotSel; S.wrong = false; if (S.mode === 'story') go(2); else S.screen = 2; } else S.wrong = true; },
  assistok: () => { S.selected = cur().target; S.reason = cur().reason; if (S.mode === 'story') go(2); else S.screen = 2; },
  submit: () => submit(true), desksubmit: () => submit(false),
  unsubmit: () => { S.submitted = false; S.pos = 0; S.clockT = null; S.overturned = false; S.appeal = false; S.opts = { w: false, alt: false }; },
  step: () => stepTo(S.pos + 1),
  stepback: () => { if (S.pos > posAt(cur(), cur().regAt)) stepTo(S.pos - 1); },
  setpos: (a) => stepTo(Number(a)),
  branch: (a) => { loadCase(a, true); submit(false); go(4); },
  overturn: () => { S.overturned = !S.overturned; },
  again: () => { if (S.mode !== 'story' || S.screen !== 6) { S.mode = 'story'; go(6); S.s6.again = true; } else S.s6.again = !S.s6.again; },
  disagree: () => { if (S.mode !== 'story' || S.screen !== 6) { S.mode = 'story'; go(6); S.appeal = true; } else S.appeal = !S.appeal; },
  s6note: (a) => { S.s6.note = S.s6.note === a ? null : a; },
  link: (a) => { S.s6.linked = a; },
  send: (a) => setSend(a),
  open105: () => { S.c105Send = S.s6.send || '14:35'; CASES = buildCases(S.c105Send); loadCase('C105'); },
  archview: (a) => { S.arch.view = a; }, archstage: (a) => { S.arch.stage = a; }, archlayer: (a) => { S.arch.layer = a || null; }, archlist: () => { S.arch.list = !S.arch.list; }
};
function setSend(v) {
  const rp = repeatParams(cur()); if (!rp || !/^\d\d:\d\d$/.test(v)) return;
  const lo = TM.sec(rp.recorded) + 60, hi = TM.sec(rp.recorded) + 2940;
  v = TM.fmt(Math.max(lo, Math.min(hi, TM.sec(v))));
  S.s6.send = v;
  if (S.caseId === 'C105') { S.c105Send = v; CASES = buildCases(v); submit(false); setPos(evs(cur()).length); }
}
const CHG = {
  reason: (el) => { S.reason = el.value; },
  box: (el) => { S.box = el.checked; S.boxTouched = true; },
  slider: (el) => { const c = cur(), t = TM.fmt(Number(el.value) * 60); S.clockT = t; S.pos = Math.max(posAt(c, c.regAt), posAt(c, t)); say(fill(STR.live.clock, { t, what: now().last ? now().last.ttl : '' })); },
  send: (el) => setSend(el.value)
};
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
  const r = ACT[el.dataset.act](el.dataset.arg, el, ev);
  if (r !== false) render();
});
document.addEventListener('change', (ev) => { const el = ev.target.closest('[data-chg]'); if (!el) return; CHG[el.dataset.chg](el); render(); });
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && S.panel) { S.panel = null; render(); return; }
  const t = ev.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  if (typing || S.panel || ev.altKey || ev.ctrlKey || ev.metaKey) return;
  if (ev.key === 'ArrowRight' && S.mode === 'story') { go(S.screen + 1); render(); }
  else if (ev.key === 'ArrowLeft' && S.mode === 'story') { go(S.screen - 1); render(); }
  else if (ev.key === 'r' || ev.key === 'R') { restart(); render(); }
});
document.title = STR.pageTitle;
S.s6.send = cur().repeat.def;
render();
