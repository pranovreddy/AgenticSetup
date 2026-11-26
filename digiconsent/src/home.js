
/* ==================================================================
   Home screen, implemented from the Consent OS Figma file
   (node 17952:118133). Icons and logos are the design's own assets,
   inlined by build.py as HA.<name>.
   ================================================================== */
const hImg = (name, w, hh, cls) => h("img", { src: HA[name], alt: "", width: w, height: hh || w, className: cls || null });
const BANNERS = [
  { t: "Your consent wallet", s: "See every brand that can reach you. Change it whenever you want.", art: "rows" },
  { t: "You're in control", s: "Turn promotional messages on or off for any brand or purpose.", art: "promos" },
  { t: "Essentials always reach you", s: "OTPs and service updates aren't affected when you limit promos.", art: "essentials" },
  { t: "Manage your rules", s: "Set when brands can contact you, or report a claimed consent.", art: "rules" },
];
const hmToggle = on => h("span", { className: "hm-tg" + (on ? " is-on" : "") }, h("i", null));
function BannerArt({ kind }) {
  if (kind === "rows") return h("div", { className: "hm-glass", style: { top: 46 } },
    [true, true, false].map((on, i) => h("div", { key: i, className: "hm-skrow" }, h("span", { className: "hm-dot" }), h("span", { className: "hm-bar" }), hmToggle(on))));
  if (kind === "promos") return h("div", { className: "hm-glass", style: { top: 40 } },
    h("div", { className: "hm-between" }, h("b", { className: "hm-t10" }, "Promos"), hmToggle(true)),
    h("div", { className: "hm-chiprow" }, h("span", null, "Sale alert"), h("em", null, "Allowed")),
    h("div", { className: "hm-chiprow is-off" }, h("span", null, "Promo call"), h("em", null, "Blocked")));
  if (kind === "essentials") return h("div", { className: "hm-glass hm-glass--list", style: { top: 27.5 } },
    ["OTP 482910", "Order shipped", "Promo SMS"].map(t => h("div", { key: t, className: "hm-lrow" }, h("span", null, t), hmToggle(true))));
  return h("div", { className: "hm-glass", style: { top: 47 } },
    h("div", { className: "hm-between" }, h("span", { className: "hm-t9" }, "Weekdays"), h("em", { className: "hm-pill" }, "Mon–Fri")),
    h("div", { className: "hm-between", style: { paddingTop: 8 } }, h("span", { className: "hm-t9" }, "Time slot"), h("em", { className: "hm-pill" }, "10–7")),
    h("div", { className: "hm-report" }, hImg("flag-sm", 14), "Report consent"));
}
const CONTACTS = [
  { name: "HDFC Bank", org: "HDFC Bank Limited", what: "Personal Loans, Home Loans & Balance Transfer", logo: "hdfc" },
  { name: "PayZapp", org: "HDFC Bank Limited", what: "Payments & Recharge Offers", logo: "payzapp" },
  { name: "SmartBuy", org: "HDFC Bank Limited", what: "Shopping & Travel Offers", logo: "smartbuy" },
  { name: "Swiggy", org: "Swiggy Limited", what: "Food Delivery Offers, Membership & Loyalty Offers", logo: "swiggy" },
];
const HDFC_PARTS = [["hdfc0", "8.57% 9.53% 9.52% 8.57%"], ["hdfc1", "22.91% 23.86% 23.84% 22.9%"], ["hdfc2", "8.57% 46.38% 9.52% 45.44%"], ["hdfc3", "45.44% 9.53% 46.37% 8.57%"], ["hdfc4", "37.24% 38.2% 38.18% 37.23%"]];
function Home() {
  const [slide, setSlide] = useState(0);
  const rail = useRef(null);
  const soon = what => () => toast(what + " isn’t part of this prototype");
  const go = i => { const el = rail.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: RM ? "auto" : "smooth" }); };
  const onScroll = () => { const el = rail.current; if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth)); };
  useEffect(() => {
    if (RM) return;
    const t = setInterval(() => { const el = rail.current; if (el) go((Math.round(el.scrollLeft / el.clientWidth) + 1) % BANNERS.length); }, 5000);
    return () => clearInterval(t);
  }, []);
  const action = (icon, title, sub, onClick) => h("button", { type: "button", className: "hm-act", onClick },
    h("span", { className: "hm-act__ic" }, hImg(icon, 20)),
    h("span", { className: "hm-act__b" }, h("span", { className: "hm-act__t" }, title), h("span", { className: "hm-act__s" }, sub)),
    hImg("chev", 16));
  return h("div", { className: "hm" },
    h("header", { className: "hm-top" },
      h("div", { className: "hm-who" },
        h("span", { className: "hm-logo" }, hImg("mark", 20)),
        h("div", null, h("p", { className: "hm-hi" }, "Hi, Rahul"), h("p", { className: "hm-tag" }, "Stop spam. Stay in control."))),
      h("div", { className: "hm-topbtns" },
        h("button", { type: "button", className: "hm-round", "aria-label": "Choose language", onClick: soon("Language") }, hImg("lang", 18)),
        h("button", { type: "button", className: "hm-round", "aria-label": "Notifications", onClick: soon("Notifications") }, hImg("bell", 18), h("i", { className: "hm-badge" })))),

    h("div", { className: "hm-body" },
      h("div", { className: "hm-rail", ref: rail, onScroll, role: "group", "aria-label": "Information banners" },
        BANNERS.map((b, i) => h("section", { key: b.t, className: "hm-banner", "aria-hidden": slide !== i },
          h("div", { className: "hm-banner__txt" }, h("h2", null, b.t), h("p", null, b.s)),
          h("div", { className: "hm-banner__art" }, h("span", { className: "hm-glow" }), h(BannerArt, { kind: b.art }))))),
      h("div", { className: "hm-dots", role: "tablist", "aria-label": "Information banners" },
        BANNERS.map((b, i) => h("button", { key: i, type: "button", role: "tab", "aria-selected": slide === i, "aria-label": "Go to banner " + (i + 1), className: slide === i ? "is-on" : "", onClick: () => go(i) }))),

      h("section", { className: "hm-stats" },
        h("button", { type: "button", className: "hm-stat", onClick: soon("My Wallet") },
          h("span", null, h("span", { className: "hm-eyebrow" }, "Opted In"), h("b", null, "2")), h("span", { className: "hm-stat__ic hm-stat__ic--in" }, hImg("optin", 22))),
        h("button", { type: "button", className: "hm-stat", onClick: soon("My Wallet") },
          h("span", null, h("span", { className: "hm-eyebrow" }, "Opted-out"), h("b", null, "5")), h("span", { className: "hm-stat__ic hm-stat__ic--out" }, hImg("optout", 22)))),

      h("section", { className: "hm-sec" },
        h("h2", { className: "hm-eyebrow" }, "Quick Actions"),
        h("div", { className: "hm-acts" },
          action("prefs", "Manage Preferences", "Choose days, times, and how often brands can reach you.", soon("Manage Preferences")),
          action("flag", "Report a claimed consent", "Dispute a consent you never gave.", soon("Report a claimed consent")),
          action("warn", "Raise a Complaint", "Report unauthorised spam", () => nav("/complaint")))),

      h("section", { className: "hm-sec" },
        h("div", { className: "hm-sechead" }, h("h2", { className: "hm-eyebrow" }, "Who Can Contact You"), h("button", { type: "button", className: "hm-viewall", onClick: soon("My Wallet") }, "View all →")),
        h("div", { className: "hm-contacts" }, CONTACTS.map(c => h("button", { key: c.name, type: "button", className: "hm-contact", onClick: soon("My Wallet") },
          h("span", { className: "hm-contact__logo" }, h("span", { className: "hm-contact__img" },
            c.logo === "hdfc" ? HDFC_PARTS.map(([n, inset]) => h("img", { key: n, src: HA[n], alt: "", style: { position: "absolute", inset, width: "auto", height: "auto" }, className: "hm-fill" }))
              : h("img", { src: HA[c.logo], alt: "", className: "hm-contain" }))),
          h("span", { className: "hm-contact__b" }, h("span", { className: "hm-contact__n" }, c.name), h("span", { className: "hm-contact__o" }, c.org), h("span", { className: "hm-contact__w" }, c.what))))))),

    h("nav", { className: "hm-nav", "aria-label": "Main" },
      h("div", { className: "hm-nav__in" },
        h("button", { type: "button", className: "hm-tab is-on", "aria-current": "page" }, h("span", { className: "hm-tab__pill" }), hImg("nav-home", 20), h("span", null, "Home")),
        h("button", { type: "button", className: "hm-tab", onClick: soon("My Wallet") }, hImg("nav-wallet", 20), h("span", null, "My Wallet")),
        h("button", { type: "button", className: "hm-tab", onClick: soon("Profile") }, hImg("nav-profile", 20), h("span", null, "Profile")))));
}
