"""Builds agentic-setup-gaps.html: the Part 2 design-gap sheet, drawn on the new review layout (text left, centre card, side cards)."""
import pathlib
root = pathlib.Path(__file__).resolve().parents[5]

def ic(name, s=16):
    P = {
     "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
     "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
     "warn": '<path d="M12 4 3 19.5h18L12 4Z"/><path d="M12 10v4.5M12 17.2v.1"/>',
     "lock": '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
     "later": '<path d="M7 4.5h10v15l-5-3.6-5 3.6v-15Z"/>',
     "queued": '<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 3.2"/>',
     "spin": '<path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" class="sp"/>',
     "ready": '<path d="M12 3.5l1.9 5.2 5.2 1.9-5.2 1.9L12 17.7l-1.9-5.2-5.2-1.9 5.2-1.9L12 3.5Z"/>',
     "info": '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.8v.1"/>',
     "search": '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
     "offline": '<path d="M3 9a14 14 0 0 1 18 0M6 12.5a9.5 9.5 0 0 1 12 0M9.2 16a5 5 0 0 1 5.6 0M12 19.5v.1M4 4l16 16"/>',
     "dl": '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
     "refresh": '<path d="M19.5 12a7.5 7.5 0 1 1-2.3-5.4M19.5 4.5v4h-4"/>',
     "plus": '<path d="M12 5v14M5 12h14"/>',
     "x": '<path d="m6 6 12 12M18 6 6 18"/>',
     "back": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
     "user": '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 19.5c.7-3.6 3.6-5.5 7-5.5s6.3 1.9 7 5.5"/>',
     "doc": '<path d="M7 3.5h7l4 4v13H7v-17Z"/><path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5"/>',
     "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
     "logout": '<path d="M10 4.5H6.5v15H10M14 8l4 4-4 4M18 12H9.5"/>',
     "layers": '<path d="m12 4 8 4.2-8 4.2L4 8.2 12 4Z"/><path d="m4 12.4 8 4.2 8-4.2"/>',
     "bars": '<path d="M5 19.5v-6M10 19.5V9M15 19.5v-9M20 19.5V5"/>',
     "users": '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-4.8 5.5-4.8s4.9 1.6 5.5 4.8"/><path d="M15.5 6.2a3.2 3.2 0 0 1 0 6M17.5 14.5c1.7.6 2.8 2.2 3.2 4.5"/>',
     "id": '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6.5 15.5c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2M14 10h4M14 13.5h3"/>',
    }
    return f'<svg class="ic" width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{P[name]}</svg>'

STAT = {
 "queued": ("Queued", "#566176", "#edf0f6", "queued"),
 "preparing": ("Preparing", "#1d4ed8", "#e1eaff", "spin"),
 "ready": ("Ready", "#0e7490", "#d9f1f6", "ready"),
 "locked": ("Locked", "#475569", "#e4e8ef", "lock"),
 "review": ("In review", "#a15a07", "#fcefcf", "clock"),
 "attention": ("Needs attention", "#c2410c", "#ffe4d5", "warn"),
 "later": ("Do it later", "#6d28d9", "#ebe5ff", "later"),
 "done": ("Done", "#15803d", "#d9f4e2", "check"),
}
def chip(st, small=False, label=None):
    n, c, b, i = STAT[st]
    return f'<span class="chip{" sm" if small else ""}" style="--c:{c};--b:{b}">{ic(i, 13 if small else 15)}{label or n}</span>'
def bar(sts, labels=False):
    names = ["Business profile", "Team", "Brands and LOBs", "GTM partners", "Templates"]
    segs = "".join(f'<i style="--c:{STAT[s][1]}" title="{names[k]}: {STAT[s][0]}"></i>' for k, s in enumerate(sts))
    return f'<div class="seg">{segs}</div>'
def btn(label, kind="", busy=False, dis=False, icon=None):
    sp = f'<svg class="ic sp" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5"/></svg>' if busy else (ic(icon, 15) if icon else "")
    return f'<button class="mb {kind}{" busy" if busy else ""}"{" disabled" if dis else ""} tabindex="-1">{sp}{label}</button>'
def foot(left="", right=""):
    return f'<div class="foot"><div class="fl">{left}</div><div class="fr">{right}</div></div>'

STEPICON = {"Business profile": "id", "Team": "users", "Brands and LOBs": "layers", "GTM partners": "bars", "Templates": "doc"}
def card(title, n, st, body, footer="", err="", cls="", overlay=""):
    return f'''<div class="mcard {cls}"><div class="ch"><span class="tile">{ic(STEPICON[title], 20)}</span><b>{title}</b><span class="cr"><em>STEP {n} OF 5</em>{chip(st)}</span></div>
<div class="cb">{body}</div>{overlay}{('<div class="err">'+ic("warn",15)+err+'</div>') if err else ''}{footer}</div>'''
def face(icon_st, title, sub, button, who=""):
    n, c, b, i = STAT[icon_st]
    return f'<div class="face"><span class="fi" style="--c:{c};--b:{b}">{ic(i, 30)}</span><h4>{title}</h4><p>{sub}</p>{btn(button)}</div>'
def empty(icon, title, sub):
    return f'<div class="face"><span class="fi" style="--c:#566176;--b:#edf0f6">{ic(icon, 30)}</span><h4>{title}</h4><p>{sub}</p></div>'

def side(title, st, sub=""):
    return f'<div class="side"><span class="sc">{chip(st, True)}</span><b>{title}</b><small>{sub}</small></div>'

def panel(title, sentence, fold=True, bars=("done", "done", "preparing", "queued", "queued"), cls="", note=""):
    folds = '<div class="fold"><span>What I did <em>5 steps</em></span>' + ic("arrow", 14) + '</div><div class="fold"><span>What happens next</span>' + ic("arrow", 14) + '</div>' if fold else ""
    return f'''<div class="mpanel {cls}"><span class="achip"><i></i>AGENT SUMMARY</span>{bar(bars)}<h3>{title}</h3><p>{sentence}</p><div class="folds">{folds}</div>{note}</div>'''

def fields(filled=True, miss=()):
    F = [("Legal Entity Name", "HDFC Bank Limited"), ("Entity Type", "Public Limited"), ("Registered Address", "HDFC Bank House, Senapati Bapat Marg, Mumbai 400013"), ("Business PAN/TAN", "AAACH2702H"), ("Website URL", "https://www.hdfcbank.com"), ("Primary Industry", "Banking & Financial Services")]
    o = ""
    for k, (l, v) in enumerate(F):
        cls = "fld" + (" wide" if k == 2 else "")
        if (not filled) or l in miss:
            o += f'<div class="{cls}{" miss" if l in miss else ""}"><label>{l} *</label><div class="inp empty">{("<span class=mk>"+ic("warn",14)+"Couldn’t fill this</span>") if l in miss else ""}</div></div>'
        else:
            o += f'<div class="{cls}"><label>{l} *</label><div class="inp">{v}</div></div>'
    return f'<div class="fgrid">{o}</div>'

def team_rows(n=4):
    P = [("Anita Kulkarni", "VP, Legal & Compliance", "Regulatory / Legal"), ("Meera Iyer", "Compliance Manager", "Regulatory / Legal"), ("Arjun Menon", "Head of Risk and Audit", "Regulatory / Legal"), ("Sanjay Prabhu", "Head of Marketing Operations", "Business Admin")]
    return '<div class="trows">' + "".join(f'<div class="tr"><span class="av">{a.split()[0][0]}{a.split()[1][0]}</span><div><b>{a}</b><small>{r}</small></div><span class="rp">{ro}</span></div>' for a, r, ro in P[:n]) + '</div>'

PH = ["Migration", "Acquisition", "Refresh"]
def gtm_table(rows):
    o = '<table class="mt"><thead><tr><th>Partner</th>' + "".join(f'<th class="n">{p}</th>' for p in PH) + '</tr></thead><tbody>'
    for nm, mk, tone, why, rates, shares, pick in rows:
        o += f'<tr class="{"" if pick else "off"}"><td><div class="who"><span class="pmk {tone}">{mk}</span><div><b>{nm}</b>{"<span class=chosen>Chosen</span>" if pick else ""}<small>{why}</small></div></div></td>' + "".join(f'<td class="n"><b>₹{r}</b>{("<small>"+str(s)+"%</small>") if s else ""}</td>' for r, s in zip(rates, shares)) + '</tr>'
    return o + '</tbody></table>'

def stats(note="", unm=2, scanned=100, hi=27, chk=71):
    return f'''{('<p class="note">'+ic("info",15)+note+'</p>') if note else ''}<div class="stats"><div class="ring"><span>{round((scanned-unm)/scanned*100)}%</span></div><div class="tm"><div><b>{scanned}</b><span>Scanned</span></div><div><b>{hi}</b><span>High confidence</span></div><div><b>{chk}</b><span>To check</span></div><div class="un"><b>{unm}</b><span>Unmapped</span></div></div></div>'''

def toast(t, icon="check"):
    return f'<div class="toast">{ic(icon, 16)}<span>{t}</span></div>'

def det(title, st, notice="", content="", msg="", buttons=None, ro=False, n=1, stepno=None):
    names = ["Business profile", "Team", "Brands and LOBs", "GTM partners", "Templates"]
    left = "".join(f'<li class="{"cur" if k == names.index(title) else ""}">{ic(STEPICON[nm], 15)}{nm}</li>' for k, nm in enumerate(names))
    btns = btn("Back to cards", "ghost") if ro else (buttons or (btn("Back to cards", "ghost") + btn("Save changes", "primary")))
    return f'''<div class="mdet"><div class="dtop"><span class="bk">{ic("back", 16)}Back to cards</span><b>{title}</b>{chip(st)}</div>
<div class="dbody"><aside><span class="achip"><i></i>AGENT SUMMARY</span><ul>{left}</ul></aside><div class="dmain">{notice}{content}</div></div>
<div class="dbot"><span class="msg">{msg}</span><div class="fr">{btns}</div></div></div>'''
def notice(kind, text, action=""):
    ico = {"info": "info", "warn": "warn", "ok": "check", "late": "ready"}[kind]
    return f'<div class="nbar {kind}">{ic(ico, 17)}<span>{text}</span>{action}</div>'

def dlg(title, text, btns, extra=""):
    return f'<div class="dlg"><span class="di">{ic("info", 22)}</span><h4>{title}</h4><p>{text}</p>{extra}<div class="dr">{btns}</div></div>'

def fig(cap, html, cls=""):
    return f'<figure class="{cls}"><div class="mock">{html}</div><figcaption>{cap}</figcaption></figure>'

SECTIONS = []
def sec(n, title, where, intro, body):
    SECTIONS.append((n, title, where, intro, body))

# ---------------------------------------------------------------- 1
long_sentence_wait = "The telecom operators are checking your business profile. This usually takes a few hours. Team opens as soon as it is approved. You can leave this page and come back."
sec(1, "Longer messages in the Agent panel", "The title and one sentence in the left column.",
 "The sentence takes up to five lines. The two folding sections stay pinned to the bottom of the panel, so a long message never pushes them off screen. The panel is 360px wide with a 32px clear gutter, and the side cards start after it, so a three-line title never runs under them.",
 '<div class="grid g4">' +
 fig("Waiting. Title on two lines, sentence on five.", panel("Nothing else is needed right now", long_sentence_wait, bars=("review", "locked", "locked", "locked", "locked"))) +
 fig("GTM waiting variant.", panel("GTM partners opens soon", "None of the four partners has sent a rate card yet. This step opens as soon as one arrives, and you get an email. Everything else is ready to review.", bars=("done", "done", "done", "locked", "ready"))) +
 fig("Returning user.", panel("Welcome back, Rohan", "You left off at Brands and LOBs. Business profile and Team are done. Three steps are waiting, and nothing has changed since your last visit.", bars=("done", "done", "ready", "ready", "ready"))) +
 fig("What to do next, after a decision.", panel("Team is done", "Six invites were sent. Next is Brands and LOBs. Confirm the three brands and seven lines of business, or open the details to change them.", bars=("done", "done", "ready", "ready", "ready"))) +
 '</div><div class="grid g1">' +
 fig("Clearance: the panel and the side cards never overlap, even with a three-line title.",
  '<div class="comp"><div class="cp">' + panel("Business profile needs your review before Team can open", "Filled your logo and all 7 fields from 4 sources. Check the details and submit.", bars=("ready", "locked", "locked", "locked", "locked")) + '</div><div class="gut"><span>32px clear</span></div><div class="cc"><div class="sides">' + side("Team", "locked", "") + side("Brands and LOBs", "locked") + '</div></div></div>', "wide") + '</div>')

# ---------------------------------------------------------------- 2
rows = [("queued", "Waiting for the agent to start.", "Grey, dashed ring"), ("preparing", "The agent is reading sources for this step.", "Blue, turning arc"), ("ready", "A suggestion is ready for you to review.", "Teal, spark"), ("locked", "Opens after another step or a rate card arrives.", "Slate, padlock"), ("review", "Sent to the telecom operators, waiting for approval.", "Amber, clock"), ("attention", "Returned, or something changed under it.", "Orange, warning"), ("later", "You chose to come back to it.", "Violet, bookmark"), ("done", "Submitted and approved, or confirmed.", "Green, tick")]
t2 = '<table class="kt"><thead><tr><th>Status</th><th>Centre card chip</th><th>Side card chip</th><th>Progress segment</th><th>Used when</th></tr></thead><tbody>' + "".join(f'<tr><td><b>{STAT[s][0]}</b><small>{d}</small></td><td>{chip(s)}</td><td><div class="sidechip">{chip(s, True)}</div></td><td><div class="seg one"><i style="--c:{STAT[s][1]}"></i></div></td><td class="u">{w}</td></tr>' for s, w, d in [(r[0], r[1], r[2]) for r in rows]) + '</tbody></table>'
sec(2, "A status chip on the centre card, and the full status set", "Top right of the centre card beside STEP n OF 5, on each side card, and in the progress bar.",
 "Eight statuses, each with one colour and one icon, used the same way in all three places. The chip colour is the progress segment colour, so the bar reads the same as the cards.",
 '<div class="grid g1">' + fig("The status set.", t2, "wide") + '</div><div class="grid g2">' +
 fig("On the centre card.", card("Team", 2, "attention", '<div class="skel"></div>', "")) +
 fig("On the side cards, and in the bar.", '<div class="sides row">' + side("Business profile", "done", "7 fields filled") + side("Team", "review") + side("Brands and LOBs", "ready") + side("GTM partners", "later") + side("Templates", "preparing") + '</div><div class="barwrap">' + bar(("done", "review", "ready", "later", "preparing")) + '</div>') + '</div>')

# ---------------------------------------------------------------- 3
sec(3, "Finished faces of the centre card", "The middle of the card body, in place of the content. One button sits under the text.",
 "A step that is not open for editing shows a face: a large status icon, one title, one line of detail and one button. The icon and colour are the status chip's, so the card and its chip agree.",
 '<div class="grid g3">' +
 fig("Done", card("Business profile", 1, "done", face("done", "Business profile approved", "Submitted by Rohan Mehta on 14 Oct, 11:42. Approved by the telecom operators on 14 Oct, 15:08.", "View"))) +
 fig("In review", card("Business profile", 1, "review", face("review", "Sent for approval", "Submitted by Rohan Mehta on 14 Oct, 11:42. Telecom operators usually reply within a few hours.", "View"))) +
 fig("Needs attention", card("Business profile", 1, "attention", face("attention", "2 fields were returned", "Legal entity name and registered address need a fix.", "Review"))) +
 fig("Do it later: its own bookmark icon, not the clock", card("Team", 2, "later", face("later", "Saved for later", "You chose to do this step later. Nothing has been sent.", "Review"))) +
 fig("Templates, matched again: a one-line note above the figures", card("Templates", 5, "done", stats("98 of 100 matched again after your brands changed."))) +
 fig("Templates, needs attention", card("Templates", 5, "attention", face("attention", "14 templates need a new line of business", "14 templates were mapped to lines of business that changed.", "Review"))) +
 '</div>')

# ---------------------------------------------------------------- 4
sec(4, "A card where nothing was found", "The card body in place of the step content. Add manually replaces View and edit.",
 "The message says what was checked and what the person can do. There is no Try again, because the agent finished and found nothing. Team and Templates keep Do it later on the right. GTM is the exception: with no rate cards it reuses the Locked overlay, has no buttons, and its chip says Locked.",
 '<div class="grid g2">' +
 fig("Team", card("Team", 2, "ready", empty("search", "We found no people to suggest", "Your DLT registration has no contact list we can read. Add the people who should get access."), foot(btn("Add manually", "", icon="plus"), btn("Do it later", "text")))) +
 fig("Brands and LOBs", card("Brands and LOBs", 3, "ready", empty("search", "We found no brands on your DLT headers", "Add your first brand and its lines of business to set up templates."), foot(btn("Add manually", "", icon="plus"), ""))) +
 fig("Templates", card("Templates", 5, "ready", empty("search", "We found no templates to map", "Your DLT account has no templates yet. Add them manually when they exist."), foot(btn("Add manually", "", icon="plus"), btn("Do it later", "text")))) +
 fig("GTM partners: no rate cards. Existing Locked overlay, no footer buttons.", card("GTM partners", 4, "locked", '<div class="ghost"><div></div><div></div><div></div><div></div></div>', "", overlay='<div class="lockov"><span class="lk">' + ic("lock", 22) + '</span><b>Opens once a partner has sent a rate card</b><small>You get an email as soon as the first one arrives.</small><span class="dots"><i></i><i></i><i></i><i></i><i></i></span></div>')) +
 '</div>')

# ---------------------------------------------------------------- 5
sec(5, "A card where the agent couldn’t prepare", "The card body, with the buttons in the footer.",
 "Try again is the only main button the first time. After two failed tries the message changes and Do it yourself becomes the main button, with Try again second. Team and Templates also show Do it later on the left. While a retry runs the button shows Trying again.",
 '<div class="grid g2">' +
 fig("First version. Brands and LOBs, no Do it later.", card("Brands and LOBs", 3, "attention", empty("warn", "Couldn’t prepare this step", "The agent couldn’t read your DLT headers. Try again in a moment."), foot("", btn("Try again", "primary")), cls=""), ) +
 fig("First version. Team adds Do it later.", card("Team", 2, "attention", empty("warn", "Couldn’t prepare this step", "The agent couldn’t read your DLT contact list. Try again in a moment."), foot(btn("Do it later", "text"), btn("Try again", "primary")))) +
 fig("After two failed tries. Do it yourself becomes the main button.", card("Team", 2, "attention", empty("warn", "Still couldn’t prepare this step", "Two tries didn’t work. You can fill this step in yourself."), foot(btn("Do it later", "text"), btn("Try again") + btn("Do it yourself", "primary")))) +
 fig("Busy: Trying again.", card("Templates", 5, "preparing", empty("warn", "Couldn’t prepare this step", "The agent couldn’t read your templates. Trying again now."), foot(btn("Do it later", "text"), btn("Trying again…", "primary", busy=True)))) +
 '</div>')

# ---------------------------------------------------------------- 6
def tile(kind, title, counts):
    c = {"ready": ("#0e7490", "#d9f1f6", "ready"), "none": ("#566176", "#edf0f6", "search"), "fail": ("#c2410c", "#ffe4d5", "warn")}[kind]
    return f'<div class="prep"><span class="pt" style="--c:{c[0]};--b:{c[1]}">{ic(c[2], 15)}{title}</span><div class="pc">' + "".join(f'<div><b>{a}</b><span>{b}</span></div>' for a, b in counts) + '</div></div>'
def stackchip(t, st, extra=""):
    return f'<div class="mini"><b>{t}</b>{chip(st, True, extra or None)}</div>'
sec(6, "Preparation view for these outcomes", "The preparation card, where the Suggestion ready tile and the three counts sit, and the ready screen.",
 "Two new tiles sit beside Suggestion ready: Nothing found in a neutral colour, and Couldn’t prepare in a warning colour. Each has its own three counts. On the ready screen the label and sentence change, and the dot turns amber when not all five are prepared.",
 '<div class="grid g3">' +
 fig("Suggestion ready (existing)", tile("ready", "Suggestion ready", [("4", "sources read"), ("5", "checks done"), ("1", "step to review")])) +
 fig("Nothing found", tile("none", "Nothing found", [("4", "sources read"), ("5", "checks done"), ("0", "results")])) +
 fig("Couldn’t prepare", tile("fail", "Couldn’t prepare", [("2", "sources read"), ("3", "checks done"), ("1", "check failed")])) + '</div><div class="grid g2">' +
 fig("Ready screen, all five prepared (existing)", '<div class="rdy"><div class="rl"><span class="lab"><i class="g"></i>5 OF 5 PREPARED</span><h3>Your five steps are ready for review</h3><p>The agent has done the groundwork. Open each step, check it and approve.</p>' + btn("Review them", "primary", icon="arrow") + '</div><div class="stk">' + stackchip("Business profile", "ready") + stackchip("Team", "ready") + '</div></div>') +
 fig("Ready screen, not all prepared", '<div class="rdy"><div class="rl"><span class="lab"><i class="a"></i>3 OF 5 PREPARED</span><h3>Three steps are ready for review</h3><p>One step found nothing and one couldn’t be prepared. You can still open both and fill them in yourself.</p>' + btn("Review them", "primary", icon="arrow") + '</div><div class="stk">' + stackchip("Business profile", "ready") + stackchip("Team", "ready", "Nothing found") + stackchip("Brands and LOBs", "attention", "Couldn’t prepare") + '</div></div>') + '</div>')

# ---------------------------------------------------------------- 7
rows7 = [("Karix", "K", "violet", "Only partner with a rate card for all three phases.", ("0.75", "1.20", "0.60"), (100, 100, 100), True), ("Value First", "V", "red", "No rate card yet.", ("–", "–", "–"), (0, 0, 0), False), ("Tata", "T", "amber", "No rate card yet.", ("–", "–", "–"), (0, 0, 0), False)]
sec(7, "Partly prepared", "Inside the card, with the part that is missing named.",
 "A step the agent only partly finished still opens as a normal review. The gap is marked where it is, and the card says in one line what is missing.",
 '<div class="grid g1">' + fig("Business profile: unfilled fields stay empty, are marked inside the card, and are named.", card("Business profile", 1, "ready", '<p class="note warn">' + ic("warn", 15) + 'Couldn’t fill 2 fields: Business PAN/TAN and Website URL. Add them to submit.</p>' + fields(miss=("Business PAN/TAN", "Website URL")), foot("", btn("Submit for approval", "primary", dis=True))), "wide") + '</div><div class="grid g2">' +
 fig("GTM partners: one partner, chosen at 100%.", card("GTM partners", 4, "ready", '<p class="note">' + ic("info", 15) + 'Only Karix has sent a rate card. It takes all the volume until another arrives.</p>' + gtm_table(rows7), foot(btn("View and edit"), btn("Confirm partners", "primary")))) +
 fig("Templates: a count of unmapped templates beside the figures.", card("Templates", 5, "ready", stats("", unm=14, hi=22, chk=64) + '<p class="note warn">' + ic("warn", 15) + '14 templates have no line of business yet. They don’t hold up migration.</p>', foot(btn("View and edit"), btn("Do it later", "text") + btn("Confirm mapping", "primary")))) + '</div>')

# ---------------------------------------------------------------- 8
form_skel = fields(True)
sec(8, "The Details page notice bar and read-only state", "The strip at the top of the Details content, under the top bar.",
 "One notice bar holds every message about how the page was reached or what changed under it. It is blue for information, amber when the person must act, green for success. When someone else finished the step, the form is read-only and the bottom bar has only Back to cards.",
 '<div class="grid g2">' +
 fig("Nothing was found (after Add manually)", det("Team", "ready", notice("info", "We found nothing for this step. Add the people who need access."), '<div class="tabs"><b class="on">Users</b><b>Roles</b></div>' + '<div class="emptyrow">' + ic("users", 28) + '<p>No users yet</p>' + btn("Add user", "primary", icon="plus") + '</div>', "", )) +
 fig("No suggestion was prepared (after Do it yourself)", det("Business profile", "attention", notice("info", "No suggestion was prepared for this step. Fill it in yourself."), fields(False))) +
 fig("Someone else completed or submitted this step. Read-only.", det("Business profile", "review", notice("warn", "Anita Kulkarni submitted this step on 14 Oct, 11:42. It is read-only now."), fields(True), ro=True)) +
 fig("A suggestion arrived late", det("Business profile", "ready", notice("late", "A suggestion is ready now.", btn("Use the suggestion", "primary")) + '<div class="pop">' + ic("warn", 18) + '<div><b>Replace what you entered?</b><p>The suggestion replaces the 3 fields you filled in. Your entries can’t be brought back.</p></div><div class="pr">' + btn("Keep mine") + btn("Replace", "primary") + '</div></div>', fields(True, ())) ) +
 fig("Team: the page stays editable", det("Team", "ready", notice("info", "Anita Kulkarni added 2 people while you were here. You can keep editing."), '<div class="tabs"><b class="on">Users</b><b>Roles</b></div>' + team_rows(3))) +
 fig("Empty: Business profile, every field blank", det("Business profile", "ready", "", fields(False), "Fill all 7 fields to submit.", btn("Back to cards", "ghost") + btn("Submit for approval", "primary", dis=True))) +
 '</div>')

# ---------------------------------------------------------------- 9
sec(9, "Busy, error and offline feedback", "Buttons, above the card footer, the Details bottom bar, the top of the screen.",
 "A button that is working shows a spinner and a present-tense label and ignores clicks. A failed save shows one line directly above the footer buttons on a card, or at the left of the bottom bar on the Details page. When the save result is unknown the line says so.",
 '<div class="grid g3">' +
 fig("Busy buttons", '<div class="btnrow col">' + btn("Submitting…", "primary", busy=True) + btn("Saving…", "primary", busy=True) + btn("Sending 6 invites…", "primary", busy=True) + btn("Confirming…", "primary", busy=True) + '</div>') +
 fig("Card: error line above the footer", card("Business profile", 1, "ready", fields(True), foot("", btn("Submit for approval", "primary")), err="That wasn’t saved. Try again.")) +
 fig("Card: result unknown", card("Business profile", 1, "ready", fields(True), foot("", btn("Submitting…", "primary", busy=True)), err="Checking whether that was saved…")) + '</div><div class="grid g2">' +
 fig("Details page: message left of the bottom bar", det("Business profile", "ready", "", fields(True), '<span class="bad">' + ic("warn", 15) + 'That wasn’t saved. Try again.</span>')) +
 fig("Details page: result unknown", det("Business profile", "ready", "", fields(True), '<span class="bad ok">' + ic("refresh", 15) + 'Checking whether that was saved…</span>', btn("Back to cards", "ghost") + btn("Saving…", "primary", busy=True))) + '</div><div class="grid g3">' +
 fig("Offline: a thin bar at the top, right of the avatar", '<div class="top"><span class="avp"><i>RM</i></span><div class="offbar">' + ic("offline", 15) + 'You’re offline. Changes are paused until you’re back.</div></div>') +
 fig("Load failure: the deck", '<div class="fail">' + ic("warn", 26) + '<h4>Couldn’t load your setup</h4><p>Check your connection and try again.</p>' + btn("Try again", "primary") + '</div>') +
 fig("Load failure: a card", card("Team", 2, "attention", '<div class="face"><span class="fi" style="--c:#c2410c;--b:#ffe4d5">' + ic("warn", 30) + '</span><h4>Couldn’t load this step</h4><p>The rest of your setup is fine.</p>' + btn("Try again", "primary") + '</div>')) + '</div><div class="grid g1">' +
 fig("Load failure: a Details page", det("Team", "attention", "", '<div class="face"><span class="fi" style="--c:#c2410c;--b:#ffe4d5">' + ic("warn", 30) + '</span><h4>Couldn’t load the details</h4><p>Your changes so far are kept.</p>' + btn("Try again", "primary") + '</div>', "", btn("Back to cards", "ghost")), "wide") + '</div>')

# ---------------------------------------------------------------- 10
bk = btn("Keep editing") + btn("Discard changes", "danger") + btn("Save changes", "primary")
what = [("Business profile", "Save your business profile changes?", "You edited the profile. Save to keep your entries and go back to the cards, or discard to keep the agent’s suggestion."), ("Team", "Save your team changes?", "You edited the list of people. Save to keep it, or discard to go back to the 6 people the agent suggested."), ("Brands and LOBs", "Save your brand and line of business changes?", "You added or changed brands. Saving sends the change for review. Discarding keeps the three brands the agent suggested."), ("GTM partners", "Save your partner choice and split?", "You changed which partners are chosen or the volume split. Discarding keeps Karix and Value First at the agent’s split."), ("Templates", "Save your template mapping changes?", "You changed 5 template mappings. Discarding keeps the agent’s mapping of 98 templates.")]
sec(10, "The Save your changes? dialog", "Over the Details page, with a scrim.",
 "Same three buttons everywhere. The text names what was edited and what discarding returns to, so it is longer for steps where saving sends something for review. The read-only version appears when someone else finished the step while the person was editing.",
 '<div class="grid g3">' + "".join(fig(w[0], '<div class="scrim">' + dlg(w[1], w[2], bk) + '</div>') for w in what) +
 fig("Read-only: someone else finished the step", '<div class="scrim">' + dlg("This step was submitted while you were editing", "Anita Kulkarni submitted Business profile on 14 Oct, 11:42. Your edits can’t be saved.", btn("Discard changes", "danger") + btn("Back to cards", "primary")) + '</div>') + '</div>')

# ---------------------------------------------------------------- 11
def fcard(t, st, sub, mark):
    return f'<div class="fcard"><span class="fm {mark}">{ic({"done":"check","review":"clock","attention":"warn","later":"later"}[mark], 14)}</span><b>{t}</b><small>{sub}</small></div>'
sec(11, "Finale in every state", "The sentence under the title, the five blue cards, the countdown tiles and the line below them.",
 "The skipped sentence stays under the title and now names where to finish each step. The tick on a card becomes a clock, a warning or a bookmark when the step is not done. The window has three states, and the time line only appears when it is true.",
 '<div class="grid g1">' + fig("Skipped variant. The title sentence names where to finish each step; cards carry their own mark.", '<div class="fin"><h3>Almost complete</h3><p>Team and Templates are saved for later. Finish Team from Team, and Templates from Templates, before 18 November.</p><div class="frow">' + fcard("Business profile", "done", "7 fields filled", "done") + fcard("Team", "later", "Saved for later", "later") + fcard("Brands and LOBs", "review", "In review", "review") + fcard("GTM partners", "attention", "Needs attention", "attention") + fcard("Templates", "later", "Saved for later", "later") + '</div></div>', "wide") + '</div><div class="grid g3">' +
 fig("Window not open yet: no countdown tiles", '<div class="fin sm"><h3>You’re set to start migration</h3><p class="wl">The migration window opens on 3 November 2026.</p>' + btn("Go to migration", "primary", dis=True, icon="arrow") + '</div>') +
 fig("Window open (as today)", '<div class="fin sm"><h3>You’re set to start migration</h3><div class="tiles"><div><b>29</b>days</div><div><b>23</b>hrs</div><div><b>59</b>mins</div><div><b>57</b>secs</div></div><p class="wl"><i class="g"></i>Your migration window is open until <b>18 November 2026</b>.</p><p class="tl">You completed onboarding in less than 5 minutes</p>' + btn("Go to migration", "primary", icon="arrow") + '</div>') +
 fig("Window closed: a placeholder", '<div class="fin sm"><span class="fi" style="--c:#566176;--b:#edf0f6">' + ic("clock", 28) + '</span><h3>Your migration window has closed</h3><p class="wl">It closed on 18 November 2026. Ask your account manager to open a new one.</p></div>') + '</div>')

# ---------------------------------------------------------------- 12
sec(12, "The Closes in label", "The pill at the bottom left.",
 "Same pill, three states. Before the window opens it counts down to the start. After it closes the pill is removed, because the finale already says so.",
 '<div class="grid g3">' + fig("Closes in (existing)", '<div class="pill"><span class="pi">' + ic("refresh", 16) + '</span><span><em>CLOSES IN</em><b>29d 23h 59m</b></span></div>') + fig("Opens in", '<div class="pill"><span class="pi">' + ic("clock", 16) + '</span><span><em>OPENS IN</em><b>4d 6h 12m</b></span></div>') + fig("Window closed: hidden", '<div class="pill hid"><span>Not shown</span></div>') + '</div>')

# ---------------------------------------------------------------- 13
def gate(tab1, tab2, docmsg, hint, hintcls, right):
    return f'''<div class="mgate"><div class="gh"><div><h3>Review and accept</h3></div><div class="gt">{tab1}{tab2}</div></div><div class="gd">{docmsg}</div><div class="gf"><span class="gh2 {hintcls}">{hint}</span>{right}</div></div>'''
tabon = lambda t, tick=False: f'<b class="on">{(ic("check", 14) if tick else "")}{t}</b>'
taboff = lambda t, tick=False: f'<b>{(ic("check", 14) if tick else "")}{t}</b>'
doc = '<div class="dl"><b>0. Introduction</b><p>THIS DOCUMENT IS AN ELECTRONIC RECORD IN TERMS OF THE INFORMATION TECHNOLOGY ACT, 2000 AND RULES THERE UNDER AS APPLICABLE.</p></div>'
sec(13, "The gate in more states", "The bar at the bottom of the document: hint on the left, Accept on the right.",
 "The hint carries the state. Once accepted, the tab shows a tick and Download replaces Accept. If the document can’t load, Accept stays disabled. If recording the acceptance fails, the error line replaces the hint.",
 '<div class="grid g3">' +
 fig("Accepted", gate(tabon("Terms of Use", True), taboff("Privacy Policy"), doc, "Accepted by Rohan Mehta on 14 Oct 2026, 11:42", "", btn("Download", icon="dl"))) +
 fig("Document can’t be loaded", gate(tabon("Terms of Use"), taboff("Privacy Policy"), '<div class="fail s">' + ic("warn", 24) + '<h4>Couldn’t load this document</h4>' + btn("Try again", "primary") + '</div>', "You can’t accept until the document loads.", "", btn("Accept terms of use", "primary", dis=True))) +
 fig("Acceptance refused", gate(tabon("Terms of Use"), taboff("Privacy Policy"), doc, ic("warn", 15) + "We couldn’t record your acceptance. Try again.", "bad", btn("Accept terms of use", "primary"))) + '</div>')

# ---------------------------------------------------------------- 14
sec(14, "Avatar menu and signing out", "The pill at the top left.",
 "Signed agreements sits above Log out and opens a short list: the document, who accepted it, the date, and Download. The log out dialog warns when there are unsaved changes. After signing out there is a plain signed-out screen.",
 '<div class="grid g3">' +
 fig("Menu with Signed agreements", '<div class="menuwrap"><span class="avp big"><i>RM</i></span><div class="menu"><div class="mu"><b>Rohan Mehta</b><small>HDFC Bank Limited</small></div><div class="mi">' + ic("doc", 16) + 'Signed agreements<span class="chev">' + ic("arrow", 14) + '</span></div><div class="mi">' + ic("logout", 16) + 'Log out</div></div></div>') +
 fig("Signed agreements list", '<div class="agr"><h4>Signed agreements</h4><div class="ar"><div><b>Terms of Use</b><small>Rohan Mehta · 14 Oct 2026, 11:42</small></div>' + btn("Download", icon="dl") + '</div><div class="ar"><div><b>Privacy Policy</b><small>Rohan Mehta · 14 Oct 2026, 11:42</small></div>' + btn("Download", icon="dl") + '</div></div>') +
 fig("Log out dialog with unsaved changes", '<div class="scrim">' + dlg("Log out?", "You have unsaved changes on this step. They won’t be kept if you log out now.", btn("Stay") + btn("Log out anyway", "danger")) + '</div>') + '</div><div class="grid g1">' +
 fig("After logging out", '<div class="signed"><span class="fi" style="--c:#15803d;--b:#d9f4e2">' + ic("check", 30) + '</span><h3>You’re signed out</h3><p>Your progress is saved. Sign in again to carry on with your setup.</p>' + btn("Sign in", "primary") + '</div>', "wide") + '</div>')

# ---------------------------------------------------------------- 15
sec(15, "Working with others at the same time", "The centre card, the Details page, a locked card.",
 "When someone else changes a step, the person sees it without losing their place. The card swaps to its finished face with who and when, and a toast says what changed. A Details page turns read-only. A card that was locked opens as Ready, and the toast says why.",
 '<div class="grid g3">' +
 fig("Centre card swaps to the finished face, with a toast", '<div class="stack">' + card("Business profile", 1, "done", face("done", "Business profile submitted", "Anita Kulkarni submitted this step on 14 Oct, 11:42.", "View")) + toast("Anita Kulkarni submitted Business profile.", "users") + '</div>') +
 fig("Details page: notice says who did it, form read-only", det("Business profile", "review", notice("warn", "Anita Kulkarni submitted this step on 14 Oct, 11:42. Your changes weren’t saved."), fields(True), ro=True)) +
 fig("Locked card opens as Ready, toast says why", '<div class="stack">' + card("Team", 2, "ready", '<div class="skel"></div><p class="note">' + ic("info", 15) + 'Business profile was approved. Team is open now.</p>', foot(btn("View and edit"), btn("Do it later", "text") + btn("Send 6 invites", "primary"))) + toast("Business profile was approved. Team is now open.", "check") + '</div>') + '</div>')

# ---------------------------------------------------------------- page
CSS = open(pathlib.Path(__file__).with_name("gaps.css")).read()
idx = "".join(f'<a href="#s{n}"><span>{n}</span>{t}</a>' for n, t, *_ in SECTIONS)
SMALL = {6, 11, 12, 13, 14}
secs = "".join(f'<section id="s{n}"><header><span class="num">{n}</span><div><h2>{t}</h2><p class="where">{w}</p></div></header><p class="intro">{i}</p>{b.replace('grid g3"', 'grid g3s"') if n in SMALL else (b.replace('grid g3"', 'grid g2"') if n == 10 else b)}</section>' for n, t, w, i, b in SECTIONS)
html = f'''<title>Onboarding Design Gaps</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<style>{CSS}</style>
<div class="wrap"><div class="hero"><p class="eyebrow">DigiConsent onboarding · Part 2</p><h1>Design gaps, placed on the new layout</h1><p class="lead">Fifteen states the prototype does not show yet. Each is drawn on the current layout: the Agent panel on the left, the centre card with its angled side cards, and the Details page. Screens are drawn at their on-screen size, so text is 16px or larger throughout.</p>
<div class="key"><b>Status key</b>{"".join(chip(s) for s in STAT)}</div></div>
<nav class="idx" aria-label="Sections">{idx}</nav>{secs}</div>'''
(root / "agentic-setup-gaps.html").write_text(html)
print("ok", len(html))
