"""Builds agentic-setup-cards-audit-fixes.html from the PM feedback file: fixes for the UI heuristics audit
(references/audits/ui-heuristics-2026-10-21.md). IDs in the comments match the audit table."""
import pathlib
here = pathlib.Path(__file__).parent
root = here.parents[4]
h = (root / "agentic-setup-cards-states-pm-feedback.html").read_text()
css = (here / "audit.css").read_text(); js = (here / "audit.js").read_text()

def sub(old, new, n=1):
    global h
    assert h.count(old) == n, (h.count(old), old[:70])
    h = h.replace(old, new)

# C1 profile fields are editable once the agent has filled them; a change is marked "Edited"
sub('<span class="src-tag">${esc(f.src)}</span></label><div class="pin-w"><input class="pin" id="pc-${f.k}" readonly tabindex="-1" value="${done ? esc(f.v()) : ""}">',
    '${auKycEdited(f.k) ? \'<span class="src-tag au-you">Edited</span>\' : `<span class="src-tag">${esc(f.src)}</span>`}</label><div class="pin-w"><input class="pin" id="pc-${f.k}" ${done ? `data-kyc="${f.k}"${f.sel ? ` list="au-dl-${f.k}"` : ""}` : \'readonly tabindex="-1"\'} value="${done ? esc(f.v()) : ""}">')
sub('  profile: "Check the details and submit",', '  profile: "Change any field that is wrong, then submit",')
# C2 the submit moment names the telecom operators
sub('<span><b>I\'m authorised to submit this KYC, and it\'s accurate.</b><small>The company accepts responsibility for any false or misleading information.</small></span></label><button class="btn btn-p" data-act="accept" data-i="${i}" ${S.profileAuth && done ? "" : "disabled"}>Submit for approval</button>',
    '<span><b>I\'m authorised to submit this KYC, and it\'s accurate.</b><small>Airtel, Jio, Vi and BSNL will review these 7 fields. The company accepts responsibility for any false or misleading information.</small></span></label><button class="btn btn-p" data-act="accept" data-i="${i}" ${S.profileAuth && done ? "" : "disabled"}>Submit to telecom operators</button>')
sub('${S.profileAuth ? "" : "disabled"}>Submit for approval<', '${S.profileAuth ? "" : "disabled"}>Submit to telecom operators<')
# card text floor is 14px (user choice, was 17)
sub('const MIN_FONT = 17;', 'const MIN_FONT = 14;')
# M2 review text never shrinks below the floor: the card gets shorter (its body scrolls) instead of scaling down
sub('return [940, Math.round(base * (STEPS[i].key === "profile" ? 1.15 : STEPS[i].key === "brands" ? 1.32 : 1.12))];',
    'return auDims(base * (STEPS[i].key === "profile" ? 1.15 : STEPS[i].key === "brands" ? 1.32 : 1.12), sr, LPx);')
sub('(S.phase === "review" ? innerHeight * .85 : r.height - 40) / ah', '(S.phase === "review" ? innerHeight - 150 : r.height - 40) / ah')
sub('#deep{ zoom:.85; }', '#deep{ zoom:1; }')
# M3 one deadline: the finale clock uses the pill's end date, in real seconds
sub('const closeAt = Date.now() + 30 * 864e5;', 'const closeAt = closeAt0;')
sub('Math.floor((closeAt - Date.now()) / 940))', 'Math.floor((closeAt - Date.now()) / 1000))')
# M4 the profile's status follows what is really happening, and the result stays on screen
sub('''    ti = "Sent to the telecom operators";
    su = "Your business profile is with the telecom operators for review. This takes a few minutes. Team opens once they approve it.";''',
    '''    [ti, su] = auVerifyHead();''')
sub('const sig = [ph, i, cd.st, locked, filling, verifying, S.cards[pI].step, S.cards.map((x) => x.st).join()].join("|");',
    'const sig = [ph, i, cd.st, locked, filling, verifying, S.cards[pI].step, S.cards.map((x) => x.st).join(), S.auSent, S.auVline, cd.attn, cd.partly, cd.flag].join("|");')
sub('toast("Submitted to the telecom operators for review")', 'S.auSent = 0')
sub('if (nx >= 0) focusCard(nx); } }, RM ? 0 : 1600);', 'if (nx >= 0) focusCard(nx); } }, RM ? 0 : 6500);')
# M6 GTM: accurate claim, one set of units, the terms can be read
sub('<p class="r-p">${PARTNERS.length} partners sent rate cards. ${two ? "These two have the lowest rates across the three phases." : "Your selection, split evenly."}</p>',
    '<p class="r-p">${S.cards[i].partly ? `These are Karix\'s rates. The other partners appear here when their rate cards arrive.` : `${PARTNERS.length} partners sent rate cards. ${two ? "Karix has the lowest rate in every phase. Value First matches it on acquisition and adds enterprise SLA cover, so the volume is split between them." : "Your selection, split evenly."}`}</p>')
sub('chosen · rate per message, share of volume</span>', 'chosen · ₹ per consent (refresh: per consent a year) and share of volume</span>')
sub('id="gTerms" data-act="gterms" ${S.gtmTerms ? "checked" : ""}>I accept the rate card terms of', 'id="gTerms" data-act="gterms" ${S.gtmTerms ? "checked" : ""}><span>I accept the <button type="button" class="lnk au-terms" data-au-terms>rate card terms</button> of')
sub('id="gTermsDeep" data-dact="gterms" ${S.gtmTerms ? "checked" : ""} ${dis}>I accept the rate card terms of', 'id="gTermsDeep" data-dact="gterms" ${S.gtmTerms ? "checked" : ""} ${dis}><span>I accept the <button type="button" class="lnk au-terms" data-au-terms>rate card terms</button> of')
sub('${sel.map((p) => esc(p.name)).join(" and ")}.</label>${deepBtn}', '${sel.map((p) => esc(p.name)).join(" and ")}.</span></label>${deepBtn}')
sub('${sel.map((p) => esc(p.name)).join(" and ") || "the selected partners"}.</label>', '${sel.map((p) => esc(p.name)).join(" and ") || "the selected partners"}.</span></label>')
sub('b.textContent = "Accept & Set Allocation";', 'b.textContent = "Next: set allocation";')
# M7 templates: the button says the templates are sent, and how many still need a look
sub('foot = `${deepBtn}<button class="btn btn-t" data-act="later" data-i="${i}">Do it later</button><button class="btn btn-p" data-act="accept" data-i="${i}" ${lock ? "disabled" : ""}>${changed ? "Send for review" : "Confirm mapping"}</button>`;',
    'foot = `${deepBtn}<span class="au-fnote">71 need review. Check them first, or send them as they are.</span><button class="btn btn-t" data-act="later" data-i="${i}">Do it later</button><button class="btn btn-p" data-act="accept" data-i="${i}" ${lock ? "disabled" : ""}>${changed ? "Send for review" : "Send 98 for approval"}</button>`;')
sub('action: `<button class="btn btn-p" data-dact="accept">${ch ? "Send for review" : "Confirm mapping"}</button>`', 'action: `<button class="btn btn-p" data-dact="accept">${ch ? "Send for review" : "Send 98 for approval"}</button>`')
sub('A mapping change is only saved when you send the template for approval. Drag a template, or select several, to change their mapping.',
    'Changes to the mapping are saved when you press Send 98 for approval. Drag a template, or select several, to change their mapping.')
sub('"Mapping sent for review" : "Template mapping confirmed"; p = `2 unmapped stay as a reminder', '"Mapping sent for review" : "98 templates sent for approval"; p = `2 unmapped stay as a reminder')
sub('k === "brands" ? "Brands and LOBs set up" : "Template mapping confirmed"', 'k === "brands" ? "Brands and LOBs set up" : "98 templates sent for approval"')
# M8 one label set across card and edit page
sub('<span><i style="background:#8FB0FF"></i>To check</span>', '<span><i style="background:#8FB0FF"></i>Needs review</span>')
sub('["check", "To check"]', '["check", "Needs review"]')
sub('<span>Open Details to read and change each one</span>', '<span>Use View and edit to read and change each one</span>')
sub('<details><summary>What was checked${IC.chev}</summary>', '<details><summary>What I did${IC.chev}</summary>')
sub('${S.pmOk ? "" : "disabled"}>Confirm &amp; continue →</button>', '${S.pmOk ? "" : "disabled"}>${brandsChanged() ? "Send for review" : "Confirm brands"}</button>')
sub("I've reviewed these details and confirm they're correct.", "I've reviewed these details and they're correct.")
sub('foot = `${deepBtn}<button class="btn btn-p" data-act="accept" data-i="${i}">${brandsChanged() ? "Send for review" : "Confirm brands"}</button>`;',
    'foot = `<label class="check"><input type="checkbox" data-au-ok ${S.pmOk ? "checked" : ""}>I\'ve reviewed these details and they\'re correct.</label>${deepBtn}<button class="btn btn-p" data-act="accept" data-i="${i}" ${S.pmOk ? "" : "disabled"}>${brandsChanged() ? "Send for review" : "Confirm brands"}</button>`;')
sub('value="${esc(b.name.toUpperCase())}" aria-label="Brand name"', 'value="${esc(b.name)}" aria-label="Brand name"')
sub('<u> · HDFC BANK</u>', '<u> · HDFC Bank</u>')
# M10 team card shows who gets the email; m4/m5 handled in CSS
sub('<small>${esc(p.title || "")}</small></div></div></td><td>${esc(p.dept)}</td><td><span class="rolep">${esc(p.role)}</span></td></tr>`',
    '<small>${esc(p.title || "")}</small><small class="au-mail">${esc(p.email)}</small></div></div></td><td>${esc(p.dept)}</td><td><span class="rolep">${esc(p.role)}</span></td></tr>`')
sub('foot = `${deepBtn}<button class="btn btn-t" data-act="later" data-i="${i}">Do it later</button><button class="btn btn-p" data-act="accept" data-i="${i}" ${on.length ? "" : "disabled"}>Send ${on.length} invites</button>`;',
    'foot = `${deepBtn}${auAdminNote()}<button class="btn btn-t" data-act="later" data-i="${i}">Do it later</button><button class="btn btn-p" data-act="accept" data-i="${i}" ${on.length ? "" : "disabled"}>Send ${on.length} invites</button>`;')
# m2 ready screen: honest note; the ring turns once and stops with Business profile in front
sub('Every step is filled in and checked.', 'Every step is filled in. Templates has 2 for you to look at.')
sub('RING.pos = (RING.pos + dt * .15) % 5; ringPaint(); RING.raf = requestAnimationFrame(tick); };',
    'const np = RING.pos + dt * .15; RING.trav = (RING.trav || 0) + dt * .15; if (RING.trav > 4 && np >= 5) { RING.pos = 0; ringPaint(); RING.raf = 0; return; } RING.pos = np % 5; ringPaint(); RING.raf = requestAnimationFrame(tick); };')
sub('RING.idle = true; cancelAnimationFrame(RING.raf);\n  document.body.classList.add("arc-mode", "arc-idle", "arc-live");', 'RING.idle = true; RING.trav = 0; cancelAnimationFrame(RING.raf);\n  document.body.classList.add("arc-mode", "arc-idle", "arc-live");')
# m3 the signed-in user is Ravi Menon
sub('back: ["Welcome back, Rohan",', 'back: ["Welcome back, Ravi",')
sub('"Accepted by Rohan Mehta on 14 Oct 2026, 11:42"', '"Accepted by Ravi Menon on 14 Oct 2026, 11:42"')
sub('<small style="color:var(--muted)">Rohan Mehta · 14 Oct 2026, 11:42</small>', '<small style="color:var(--muted)">Ravi Menon · 14 Oct 2026, 11:42</small>')
# m8 attention: say who returned the fields
sub('profile: ["2 fields were returned", "Legal entity name and registered address need a fix."],', 'profile: ["Jio and Vi returned 2 fields", "Fix the legal entity name and registered address, then submit again."],')
# m10 verification check names fit their rows
for a, b in [("'DLT Asset health'", "'DLT assets'"), ("'Traffic Distribution'", "'Traffic'"), ("'Complaints Data'", "'Complaints'"), ("'Business Health'", "'Health'"), ("'Digital Reputation'", "'Reputation'")]:
    sub(a, b, 2)
# p1 copy: grammar, honest done lines, jargon spelled out once
sub('else if (cd.st === "done") { ti = `${s.title} is done`; su = "Nothing more to do here."; }',
    'else if (cd.st === "done") { ti = `${s.title} ${s.key === "templates" || s.key === "brands" ? "are" : "is"} done`; su = s.key === "templates" ? "2 templates are left for later. They don\'t hold up migration." : "Nothing more to do here."; }')
sub('"Roles assigned", "Emails delivered"]', '"Roles assigned", "Emails sent"]')
sub('<p>It reads your DLT registration, GSTIN, MCA, website and partner rate cards, then fills in each step for you. Nothing is submitted until you review and approve it.</p>',
    '<p>It reads your DLT (telecom sender) registration, GSTIN, MCA, website and the rate cards of your go-to-market (GTM) partners. Then it fills in each step, including your brands and lines of business (LOBs). Nothing is submitted until you review and approve it.</p>')
# p2 finale with skipped steps points at the steps themselves
sub('any time from settings.` : "Every step is done and your migration window is open."', 'any time with View on each step below.` : "Every step is done and your migration window is open."')

# a pre-existing console error: "Review and submit" has data-ux but no step index
sub('const i = +b.dataset.i, act = b.dataset.ux, c = S.cards[i], k = STEPS[i].key;', 'const i = +b.dataset.i; if (!STEPS[i]) return; const act = b.dataset.ux, c = S.cards[i], k = STEPS[i].key;')
sub("window.__deck = { uxState,", js + "\nwindow.__deck = { uxState,")
sub('<script>document.body.classList.add("dk-6","lt-1");</script>', f'<style id="au-fix">{css}</style>\n<script>document.body.classList.add("dk-6","lt-1");</script>')
sub('<title>Agentic Setup Cards</title>', '<title>Agentic Setup Audit Fixes</title>')
(root / "agentic-setup-cards-audit-fixes.html").write_text(h)
print("ok", len(h))
