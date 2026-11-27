
/* ==================================================================
   Version 2: report straight from the phone's call log.
   Swipe a call left -> amber hand -> a tray asks why, takes an optional
   comment and consent revoke -> Submit -> the same complaint receipt.
   The call log is a stand-in for the system dialer; names are invented.
   ================================================================== */
const mkCall = (id, name, sub, time, dir, tint) => ({ id, name, sub, time, dir, tint,
  item: { id, type: "call", cls: "unknown", sender: name, brandId: null, time, text: (dir === "out" ? "Outgoing call" : "Incoming call") } });
const fromItem = (it, sub, dir) => ({ id: it.id, name: it.sender, sub, time: it.time, dir, biz: true, item: it });
const CALL_LOG = [
  mkCall("p1", "Meera Iyer", "mobile", "8:05 PM", "out", "#7C6BD6"),
  fromItem(ITEMS.c1, "India", "in"),
  mkCall("p2", "Rohan Kapoor", "WhatsApp Audio", "5:48 PM", "out", "#3A9BD9"),
  fromItem(ITEMS.c3, "Flipkart · service line", "in"),
  mkCall("p3", "Ananya Rao", "home", "1:15 PM", "in", "#D9773A"),
  fromItem(ITEMS.c2, "Bajaj Finserv · telemarketer", "in"),
  mkCall("p4", "Dev Malhotra", "mobile", "9:40 AM", "out", "#2FA37B"),
  mkCall("p5", "Kavya Nair", "mobile", "Yesterday", "in", "#C2528B"),
  mkCall("p6", "Sameer Joshi", "work", "Yesterday", "out", "#5B6474"),
];
const ACT_W = 150;                                         // width of the revealed action strip
const HAND = '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>';
const TRASH = '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/>';
const svgi = (inner, size) => E("svg", { width: size || 18, height: size || 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, dangerouslySetInnerHTML: { __html: inner } });

function CallRow({ call, done, open, setOpen, onReport, onRemove }) {
  const [dx, setDx] = useState(null);                      // live drag offset, null when not dragging
  const drag = useRef(null);
  const base = open ? -ACT_W : 0, x = dx == null ? base : dx;
  const down = ev => { drag.current = { x0: ev.clientX, y0: ev.clientY, base, moved: false, lock: null }; };
  const move = ev => {
    const d = drag.current; if (!d) return;
    const ddx = ev.clientX - d.x0, ddy = ev.clientY - d.y0;
    if (!d.lock && Math.abs(ddx) + Math.abs(ddy) > 8) d.lock = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
    if (d.lock !== "x") return;
    d.moved = true;
    try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (e) {}
    setDx(Math.max(-ACT_W - 24, Math.min(0, d.base + ddx)));
  };
  const up = () => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (d.moved) setOpen(x < -ACT_W / 2 ? call.id : null);
    else if (d.lock == null) setOpen(open ? null : call.id);   // a plain tap toggles, for mouse and keyboard users
    setDx(null);
  };
  const it = call.item, br = it.brandId && BRANDS[it.brandId];
  return h("li", { className: "dl-row" + (open ? " is-open" : "") },
    h("div", { className: "dl-acts", "aria-hidden": !open },
      h("button", { type: "button", tabIndex: open ? 0 : -1, className: "dl-act dl-act--blue", "aria-label": "Remind me", onClick: () => toast("Reminders aren’t part of this prototype") }, ic("clock", 19)),
      h("button", { type: "button", tabIndex: open ? 0 : -1, className: "dl-act dl-act--amber", "aria-label": "Report " + call.name, onClick: () => onReport(call) }, svgi(HAND, 20)),
      h("button", { type: "button", tabIndex: open ? 0 : -1, className: "dl-act dl-act--red", "aria-label": "Delete call", onClick: () => onRemove(call.id) }, svgi(TRASH, 19))),
    h("div", { className: "dl-main" + (dx == null ? "" : " is-drag"), style: { transform: "translateX(" + x + "px)" }, role: "button", tabIndex: 0, "aria-expanded": open,
      "aria-label": call.name + ", " + call.time + ". Show actions",
      onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up,
      onKeyDown: ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); setOpen(open ? null : call.id); } } },
      br ? h("span", { className: "dl-av", style: { background: BRAND_TINT[br.id] } }, br.name.charAt(0))
         : h("span", { className: "dl-av", style: { background: call.tint || "#98A1B0" } }, call.biz ? ic("phone", 17) : call.name.charAt(0)),
      h("span", { className: "dl-txt" },
        h("span", { className: "dl-name" + (call.biz && !br ? " is-unk" : "") }, call.name, done && h("span", { className: "dl-done" }, svgi(HAND, 10), "Reported")),
        h("span", { className: "dl-sub" }, svgi(call.dir === "out" ? '<path d="M7 17 17 7M9 7h8v8"/>' : '<path d="M17 7 7 17M15 17H7V9"/>', 11), call.sub)),
      h("span", { className: "dl-time" }, call.time),
      h("span", { className: "dl-info" }, "i")));
}

/* a dual-SIM phone: the subscriber says which number received it (numbers are invented) */
const SIMS = [{ id: "sim1", slot: "SIM 1", number: "90000 12345", operator: "Airtel" }, { id: "sim2", slot: "SIM 2", number: "90000 67890", operator: "Jio" }];

/* the tray: SIM, reason, optional comment, optional consent revoke, submit */
function ReportTray({ item, name, source, onClose, onSubmit }) {
  const it = item, br = it.brandId && BRANDS[it.brandId], isCall = it.type === "call", noun = isCall ? "call" : "message";
  const reasons = reasonsFor(it.cls, it.type);
  const [reasonId, setReasonId] = useState(null);
  const [note, setNote] = useState("");
  const [revoke, setRevoke] = useState(false);
  const [simId, setSimId] = useState(SIMS[0].id);
  const [shut, setShut] = useState(false);
  const locked = useRef(false);
  /* every reason is listed up front; "This looks like a scam" and "Something else" stay last */
  const tailIds = ["scam", "else"];
  const list = reasons.main.filter(r => !tailIds.includes(r.id)).concat(reasons.more, reasons.main.filter(r => tailIds.includes(r.id)));
  const reason = list.find(r => r.id === reasonId);
  const tag = CLS_TAG[it.cls];
  const close = fn => { setShut(true); setTimeout(fn, RM ? 0 : 240); };
  useEffect(() => { const k = ev => { if (ev.key === "Escape") close(onClose); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  const submit = () => {
    if (!reason || locked.current) return;
    locked.current = true;
    close(() => onSubmit({ id: newId(), filedAt: new Date(), source, sim: SIMS.find(x => x.id === simId), item: it, cls: it.cls, reasonId, reasonLabel: reason.label, note: reasonId === "else" ? note.trim() : "", revoke: !!it.permission && revoke, brandName: br ? br.name : "" }));
  };
  return h("div", { className: "tray-wrap" + (shut ? " is-shut" : "") },
    h("div", { className: "tray-dim", onClick: () => close(onClose) }),
    h("div", { className: "tray cx", role: "dialog", "aria-modal": true, "aria-label": "Report " + name },
      h("div", { className: "tray__grab" }),
      h("div", { className: "tray__bar" },
        h("button", { type: "button", className: "tray__x", "aria-label": "Close", onClick: () => close(onClose) }, svgi('<path d="M18 6 6 18M6 6l12 12"/>', 18)),
        h("span", { className: "tray__brand" }, h("svg", { viewBox: "0 0 26 26", width: 18, height: 18, fill: "var(--blue)", "aria-hidden": true, dangerouslySetInnerHTML: { __html: MARK } }), "DigiConsent"),
        h("button", { type: "button", className: "tray__ok", disabled: !reason, onClick: submit, "aria-label": "Done" }, svgi('<path d="M20 6 9 17l-5-5"/>', 20))),
      h("div", { className: "tray__body" },
        h("div", { className: "tray__who" },
          h("span", { className: "tray__flag" }, svgi(HAND, 18)),
          h("div", { className: "tray__whotxt" },
            h("span", { className: "tray__num" }, "Report " + name),
            h("span", { className: "tray__meta" }, [br && br.name, it.time, isCall ? it.text.replace(/^Incoming call · /, "") : "SMS"].filter(Boolean).join(" · "))),
          tag && h("span", { className: "tag tag--" + tag[1] }, tag[0])),

        h("div", { className: "tray__sims" },
          h("span", { className: "tray__lbl", id: "tray-sim-l" }, "Received on"),
          h("div", { className: "sims", role: "radiogroup", "aria-labelledby": "tray-sim-l" }, SIMS.map(x =>
            h("button", { key: x.id, type: "button", role: "radio", "aria-checked": simId === x.id, className: "sim" + (simId === x.id ? " is-on" : ""), onClick: () => setSimId(x.id) },
              h("span", { className: "sim__slot" }, svgi('<path d="M7 3h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M9 12h6v5H9z"/>', 14), x.slot),
              h("span", { className: "sim__num" }, x.number),
              h("span", { className: "sim__op" }, x.operator))))),

        h("h2", { className: "tray__q" }, "Why are you reporting this " + noun + "?"),
        h("div", { className: "tray__reasons", role: "radiogroup", "aria-label": "Why are you reporting this " + noun + "?" },
          list.map(r =>
            h("button", { key: r.id, type: "button", role: "radio", "aria-checked": reasonId === r.id, className: "reason" + (reasonId === r.id ? " is-on" : ""),
              onClick: () => { setReasonId(r.id); setRevoke(r.id === "agreed"); } },
              h("span", { className: "radio" + (reasonId === r.id ? " is-on" : "") }, reasonId === r.id ? ic("check", 12) : null),
              h("span", null, r.label)))),
        reasonId === "else" && h("div", { className: "field tray__else" },
          h("label", { htmlFor: "tray-note", className: "bf-sr" }, "Tell us what happened"),
          h("textarea", { id: "tray-note", autoFocus: true, value: note, onChange: ev => setNote(ev.target.value.slice(0, 300)), rows: 3, className: "textarea", placeholder: isCall ? "Tell us what happened on the call" : "Tell us what bothered you about this message" }),
          h("span", { className: "field__count" }, note.length + "/300")),
        it.permission && h("div", { className: "tray__sep" }, h("span", { className: "eyebrow" }, "Your consent · optional")),
        it.permission && h("label", { className: "revoke tray__revoke" + (revoke ? " is-on" : ""), htmlFor: "tray-revoke" },
          h("input", { id: "tray-revoke", type: "checkbox", checked: revoke, onChange: ev => setRevoke(ev.target.checked) }),
          h("span", { className: "revoke__box" }, ic("check", 12)),
          h("span", { className: "revoke__txt" },
            h("span", { className: "revoke__t" }, "Also revoke my consent"),
            h("span", { className: "revoke__s" }, "Stop " + it.permission.purpose + " from " + (br ? br.name : "this sender") + " by " + chan(it.permission.channels) + ".")))),
      h("p", { className: "tray__hint" }, reason ? "To report this, tap Done in the top right corner." : "Choose a reason, then tap Done in the top right corner.")));
}

function Dialer({ calls, reported, onReport, onRemove }) {
  const [open, setOpen] = useState("c2");                  // one row starts open so the hand is visible
  return h("div", { className: "dl" },
    h("div", { className: "dl-top" },
      h("span", { className: "dl-edit" }, "Edit"),
      h("div", { className: "dl-seg" }, h("span", { className: "is-on" }, "All"), h("span", null, "Missed")),
      h("span", { className: "dl-edit dl-edit--r" }, svgi('<path d="M4 7h16M7 12h10M10 17h4"/>', 17))),
    h("h1", { className: "dl-h" }, "Recents"),
    h("p", { className: "dl-hint" }, svgi(HAND, 14), "Swipe a call left, or tap it, then tap the hand to report it."),
    h("ul", { className: "dl-list" }, calls.map(c =>
      h(CallRow, { key: c.id, call: c, done: !!reported[c.id], open: open === c.id, setOpen, onReport: x => { setOpen(null); onReport(x); }, onRemove }))),
    h("nav", { className: "dl-tabs", "aria-label": "Phone" },
      [["Favourites", '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.200 9.500l6.1-.9z"/>'], ["Recents", ICON.clock], ["Contacts", '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>'], ["Keypad", '<path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01"/>'], ["Voicemail", '<circle cx="6.500" cy="12" r="3.5"/><circle cx="17.500" cy="12" r="3.5"/><path d="M6.500 15.500h11"/>']].map(([t, d]) =>
        h("span", { key: t, className: "dl-tab" + (t === "Recents" ? " is-on" : "") }, svgi(d, 22), t))));
}

/* ---- Messages: open a text, tap "Report Message" under it ---- */
const THREADS = ["m1", "m2", "m3", "m4"].map(id => ITEMS[id]);
const BUILDING = '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01"/>';
function Messages({ onReport, reported }) {
  const [openId, setOpenId] = useState(null);
  const it = THREADS.find(t => t.id === openId);
  if (it) {
    const br = it.brandId && BRANDS[it.brandId];
    return h("div", { className: "dl ms" },
      h("div", { className: "ms-head" },
        h("button", { type: "button", className: "ms-back", "aria-label": "Back to messages", onClick: () => setOpenId(null) }, svgi('<path d="m15 5-7 7 7 7"/>', 20)),
        h("span", { className: "ms-ava" }, svgi(BUILDING, 26)),
        h("span", { className: "ms-pill" }, it.sender, svgi('<path d="m9 6 6 6-6 6"/>', 11))),
      h("p", { className: "ms-stamp" }, "Text Message · SMS", h("br"), "Today, " + it.time),
      h("p", { className: "ms-from" }, it.sender),
      h("div", { className: "ms-line" }, h("span", { className: "ms-mini" }, svgi(BUILDING, 13)), h("p", { className: "ms-bubble" }, it.text)),
      h("p", { className: "ms-note" }, "If you did not expect this message" + (br ? "" : " from an unknown sender") + ", it may be spam."),
      reported[it.id]
        ? h("p", { className: "ms-reported" }, svgi(HAND, 12), "Reported to DigiConsent")
        : h("button", { type: "button", className: "ms-report", onClick: () => onReport({ item: it, name: it.sender, source: "messages" }) }, "Report Message"));
  }
  return h("div", { className: "dl ms" },
    h("div", { className: "dl-top" }, h("span", { className: "dl-edit" }, "Edit"), h("span", { className: "dl-edit dl-edit--r" }, svgi('<path d="M12 20h9M16.500 3.500a2.100 2.100 0 0 1 3 3L7 19l-4 1 1-4z"/>', 17))),
    h("h1", { className: "dl-h" }, "Messages"),
    h("p", { className: "dl-hint" }, svgi(HAND, 14), "Open a message, then tap Report Message under it."),
    h("ul", { className: "dl-list" }, THREADS.map(t =>
      h("li", { key: t.id, className: "dl-row" },
        h("button", { type: "button", className: "dl-main ms-row", onClick: () => setOpenId(t.id) },
          h("span", { className: "dl-av", style: { background: "#8E96A8" } }, svgi(BUILDING, 20)),
          h("span", { className: "dl-txt" },
            h("span", { className: "ms-rowtop" }, h("span", { className: "dl-name" }, t.sender, reported[t.id] && h("span", { className: "dl-done" }, svgi(HAND, 10), "Reported")), h("span", { className: "dl-time" }, t.time)),
            h("span", { className: "ms-prev" }, t.text)))))));
}

/* In-app reporting only submits: no receipt or processing screen here. After Submit the subscriber is
   back on the call log or message list with a short confirmation; tracking happens elsewhere. */
function DialerApp() {
  const [calls, setCalls] = useState(CALL_LOG);
  const [app, setApp] = useState("phone");                 // phone | messages
  const [target, setTarget] = useState(null);              // { item, name, source }
  const [reported, setReported] = useState({});            // item id -> complaint id
  const [msgKey, setMsgKey] = useState(0);
  window.__nav = () => {};
  useEffect(() => { window.scrollTo(0, 0); }, [app]);
  const submitted = c => {
    setTarget(null);
    setReported(r => ({ ...r, [c.item.id]: c.id }));
    if (c.source === "messages") setMsgKey(k => k + 1);    // back to the message list
    toast("Complaint submitted · " + c.id);
  };
  return h(React.Fragment, null,
    h("div", { className: "dl-switch", role: "tablist", "aria-label": "Where to report from" },
      [["phone", "Phone", ICON.phone], ["messages", "Messages", ICON.message]].map(([id, t, d]) =>
        h("button", { key: id, type: "button", role: "tab", "aria-selected": app === id, className: app === id ? "is-on" : "", onClick: () => setApp(id) }, svgi(d, 14), t))),
    /* both apps stay mounted so switching keeps your place */
    h("div", { hidden: app !== "phone" }, h(Dialer, { calls, reported, onReport: c => setTarget({ item: c.item, name: c.name, source: "dialer" }), onRemove: id => setCalls(cs => cs.filter(c => c.id !== id)) })),
    h("div", { hidden: app !== "messages" }, h(Messages, { key: msgKey, reported, onReport: setTarget })),
    target && h(ReportTray, { key: target.item.id, ...target, onClose: () => setTarget(null), onSubmit: submitted }));
}
