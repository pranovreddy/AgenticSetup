"""Builds agentic-setup-cards-states-pm-feedback.html from the states prototype: fixes for the PM team's 14 comments."""
import pathlib
here = pathlib.Path(__file__).parent
root = here.parents[4]
h = (root / "agentic-setup-cards-states.html").read_text()
css = (here / "pm.css").read_text(); js = (here / "pm.js").read_text()

def sub(old, new, n=1):
    global h
    assert h.count(old) == n, (h.count(old), old[:70])
    h = h.replace(old, new)

# 3 the start screen copy
sub('<span class="rdl-k"><i></i>5 steps</span><h2>Your agent will prepare five steps</h2><p>It reads your trusted sources and fills each step in. Nothing goes live until you review and approve it.</p>',
    '<span class="rdl-k"><i></i>5 steps</span><h2>Your agent will set up all five steps</h2><p>It reads your DLT registration, GSTIN, MCA, website and partner rate cards, then fills in each step for you. Nothing is submitted until you review and approve it.</p>')
# 6 the ready screen copy
sub('<h2>Your five steps are ready for review</h2>', '<h2>All five steps are ready for you</h2>')
sub('The agent has done the groundwork. Open each step, check it and approve.', 'I filled in every step from your sources. Open each one, check it, and approve it in one click.')
# 5 bigger card while the agent works
sub('Math.min(.8, (availH', 'Math.min(1.05, (availH')
# 8 bigger review card, more readable text
sub('return [1000, Math.round(base', 'return [940, Math.round(base')
sub('(STEPS[i].key === "profile" ? 1.15 : 1.12))', '(STEPS[i].key === "profile" ? 1.15 : STEPS[i].key === "brands" ? 1.32 : 1.12))')
sub('/ 1000));', '/ 940));', 2)
sub('const MIN_FONT = 16', 'const MIN_FONT = 17')
sub('Math.min(400, sr.width * .28)', 'Math.min(400, sr.width * .24)')
sub('LP = TB ? Math.min(400, r.width * .28) : 0,', 'LP = TB ? Math.min(400, r.width * .24) : 0,')
# 9 submitting is clear
sub('ti = "Verifying your business profile";', 'ti = "Sent to the telecom operators";')
sub("su = \"I'm checking this with telecom operators\";", 'su = "Your business profile is with the telecom operators for review. This takes a few minutes. Team opens once they approve it.";')
sub('toast("Business profile submitted")', 'toast("Submitted to the telecom operators for review")')
# 11 more time on the result
sub('RM ? 0 : (k === "profile" ? 2200 : 1300)', 'RM ? 0 : (k === "profile" ? 5200 : 3800)')
sub('t.classList.remove("on"), 2600)', 't.classList.remove("on"), 5200)')
# 12 What I did open by default
sub('accOpen: -1', 'accOpen: 0')
# 10 team checkbox
sub('<thead><tr><th>User</th><th>Department</th><th>Role</th></tr></thead><tbody data-ctb>', '<thead><tr><th class="ck"><input type="checkbox" data-ptog-all aria-label="Select all shown"></th><th>User</th><th>Department</th><th>Role</th></tr></thead><tbody data-ctb>')
sub('return rows.map((p) => `<tr class="${p.on ? "" : "off"}${isNewPerson(p) ? " newrow" : ""}"><td><div class="who">', 'return rows.map((p) => `<tr class="${p.on ? "" : "off"}${isNewPerson(p) ? " newrow" : ""}"><td class="ck"><input type="checkbox" data-ptog="${esc(p.email)}" ${p.on ? "checked" : ""} aria-label="Invite ${esc(p.name)}"></td><td><div class="who">')
sub('<tr><td colspan="3"><div class="empty">No one matches.', '<tr><td colspan="4"><div class="empty">No one matches.')
# 13 and 14 brands: proof and template status
sub('<input class="inp" aria-label="Line of business" data-lob="${bi}:${li}" value="${esc(l)}" ${dis}>', '<input class="inp" aria-label="Line of business" data-lob="${bi}:${li}" value="${esc(l)}" ${dis}>${pmLobMeta(bi, li, l, closed)}')
sub('<span class="lob${lobIsNew(b, l) ? " newlob" : ""}">${esc(l)}</span>', '<span class="lob${lobIsNew(b, l) ? " newlob" : ""}">${esc(l)}${pmTplCount(l) ? `<i class="lc">${pmTplCount(l)}</i>` : ""}</span>')
sub('<div class="ent2 cent">', '${pmMapStat()}<div class="ent2 cent">')
sub('<div class="bgrid">${BRANDS.map((b, bi) => `<div class="bcard">', '${pmMapStat()}<div class="bgrid">${BRANDS.map((b, bi) => `<div class="bcard">')
# 15 templates card text
sub('<h3 class="r-h">98 of 100 templates have a line of business ${editTag("templates")}</h3>', '<h3 class="r-h">98% of your 100 templates are mapped to a line of business ${editTag("templates")}</h3>')
sub("Matched by reading each message. The 2 unmapped don't hold up migration.", "I read each message to find its line of business. For 2 of them I couldn't find a suitable match. You can review the matched ones and the unmapped ones, and they don't hold up migration.")
sub("window.__deck = { uxState,", js + "\nwindow.__deck = { uxState,")
sub('<script>document.body.classList.add("dk-6","lt-1");</script>', f'<style id="pm-fb">{css}</style>\n<script>document.body.classList.add("dk-6","lt-1");</script>')
(root / "agentic-setup-cards-states-pm-feedback.html").write_text(h)
print("ok", len(h))
