logo=open('/tmp/logo.txt').read()
STEPS=[("id","Business profile"),("users","Team"),("layers","Brands and LOBs"),("bars","GTM partners"),("doc","Templates")]
def I(n,c=""): return f'<svg class="i {c}"><use href="#i-{n}"/></svg>'
LG=f'<img class="lg" src="{logo}" alt="">'
CHIP=f'<span class="chip">{LG}Agent summary</span>'
FIELDS=[("Legal Entity Name","HDFC Bank Limited","MCA"),("Entity Type","Public Limited","MCA"),("Registered Address","HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013","DLT"),("Business PAN/TAN","AAACH2702H","GSTIN"),("Website URL","https://www.hdfcbank.com","Website"),("Primary Industry","Banking & Financial Services","Website"),("Sub Industry","Scheduled Commercial Bank","Website")]
def field(l,v,s,wide=False,fill=True,tag=True):
    t=f'<em>{s}</em>' if tag and fill else ''
    inner=f'<span>{v}</span>' if fill else '<span class="sk"></span>'
    return f'<div class="fd{" w2" if wide else ""}"><label>{l}<b>*</b>{t}</label><div class="inp">{inner}</div></div>'
def form(cols=2,filled=7,tags=True):
    out=[]
    for k,(l,v,s) in enumerate(FIELDS):
        out.append(field(l,v,s,wide=(k==2 and cols==2),fill=k<filled,tag=tags))
    return f'<div class="form c{cols}">'+''.join(out)+'</div>'
def logo_slot(): return '<div class="lslot"><div class="lbox"><b>HDFC</b></div><div><div class="lt">Enterprise logo</div><div class="ls">Found on your website</div></div></div>'
CSS='''
*{box-sizing:border-box;margin:0}
:root{--blue:#2563eb;--blue2:#1d4ed8;--soft:#eef3ff;--ink:#0b1220;--ink2:#334155;--muted:#64748b;--faint:#94a3b8;--line:#e3e9f6;--green:#16a34a;--gsoft:#e8f7ee;--amber:#d97706;--asoft:#fff4de;--bg:#f4f7fd}
body{font-family:Inter,"Helvetica Neue",Arial,sans-serif;background:#eaeffa;color:var(--ink);-webkit-font-smoothing:antialiased}
.i{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:none}
.frame{position:relative;width:1440px;height:900px;overflow:hidden;background:radial-gradient(60% 50% at 70% 10%,#e6edff,transparent 70%),linear-gradient(180deg,#f7f9ff,#eef2fb);font-size:15px;line-height:1.45}
.lg{width:20px;height:20px;object-fit:contain;display:block}
.chip{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 13px 0 8px;border-radius:99px;background:#fff;box-shadow:0 0 0 1px rgba(99,128,255,.22);font:650 11.5px/1 Inter,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#2c47b2}
.dark .chip{background:rgba(255,255,255,.14);color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.28)}.dark .chip .lg{background:#fff;border-radius:50%;padding:3px;width:22px;height:22px}
h1{font-size:34px;line-height:1.12;letter-spacing:-.03em;font-weight:680}
.sub{color:var(--muted);font-size:16px}
.sheet{background:#fff;border-radius:22px;box-shadow:0 0 0 1px var(--line),0 30px 60px -36px rgba(30,60,160,.45)}
.tile{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--soft);color:var(--blue);flex:none}
.tile.on{background:linear-gradient(145deg,#6f98ff,#2f55e3);color:#fff;box-shadow:0 8px 16px -8px rgba(40,70,220,.7)}
.tile.ok{background:var(--gsoft);color:var(--green)}
.tile.lk{background:#eef0f5;color:#9aa5ba}
/* form */
.form{display:grid;gap:18px 22px;align-content:start}.form.c2{grid-template-columns:1fr 1fr}.form.c3{grid-template-columns:1fr 1fr 1fr}
.fd.w2{grid-column:1/-1}
.fd label{display:flex;align-items:center;gap:5px;font-size:13.5px;font-weight:600;color:var(--ink2);margin-bottom:7px}
.fd label b{color:#e0364f}.fd label em{margin-left:auto;font:600 11px/1 Inter;font-style:normal;color:#2c47b2;background:var(--soft);padding:4px 7px;border-radius:6px}
.inp{height:50px;border-radius:12px;border:1px solid var(--line);background:#fbfcff;display:flex;align-items:center;padding:0 15px;font-size:15.5px;font-weight:500;color:var(--ink)}
.inp .sk{height:9px;width:55%;border-radius:6px;background:linear-gradient(90deg,#e8edf9,#dbe4f8,#e8edf9)}
.lslot{display:flex;align-items:center;gap:16px;margin-bottom:22px}.lbox{width:76px;height:76px;border-radius:16px;box-shadow:0 0 0 1px var(--line) inset;display:grid;place-items:center;background:#fff}
.lbox b{font:800 15px/1 Inter;color:#d1242f;letter-spacing:-.02em}.lt{font-weight:600;font-size:14px}.ls{font-size:13px;color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 22px;border-radius:12px;background:var(--blue);color:#fff;font:600 15px/1 Inter;box-shadow:0 12px 24px -12px rgba(37,99,235,.7)}
.btn.dis{background:#c3d3fb;box-shadow:none}
.auth{display:flex;gap:12px;align-items:flex-start}.cb{width:20px;height:20px;border-radius:6px;border:1.5px solid #b6c3df;flex:none;margin-top:2px}
.auth b{font-size:14.5px;display:block}.auth small{font-size:13px;color:var(--muted)}
/* agent orb */
.orb{width:84px;height:84px;border-radius:50%;position:relative;display:grid;place-items:center;background:radial-gradient(circle,rgba(79,123,255,.28),transparent 66%)}
.orb:before{content:"";position:absolute;inset:6px;border-radius:50%;background:radial-gradient(circle,#6a93ff 1.2px,transparent 1.6px) 0 0/9px 9px;opacity:.7;mask:radial-gradient(circle,#000 62%,transparent 64%)}
.orb i{position:relative;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 28%,#8cc0ff,#3f6ef6 55%,#2154d8);box-shadow:0 0 0 5px #fff,0 8px 18px rgba(37,99,235,.45);display:grid;place-items:center}
.orb img{width:18px;height:18px;filter:brightness(0) invert(1)}
.src{display:flex;gap:14px}.s1{width:54px;height:54px;border-radius:15px;background:#fff;box-shadow:0 0 0 1px var(--line),0 8px 18px -10px rgba(30,60,160,.4);display:grid;place-items:center;color:#4a6fe8;position:relative}
.s1 .tk{position:absolute;right:-5px;top:-5px;width:20px;height:20px;border-radius:50%;background:var(--blue);display:grid;place-items:center;color:#fff;border:2px solid #fff}.s1 .tk .i{width:11px;height:11px;stroke-width:3}
.s1.q{color:#aab6cf}
.feed{display:flex;flex-direction:column;gap:2px}.fi{display:flex;align-items:center;gap:12px;padding:10px 0;font-size:15.5px;color:var(--ink2)}
.fi .d{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex:none;background:var(--gsoft);color:var(--green)}.fi .d .i{width:13px;height:13px;stroke-width:3}
.fi.act{font-weight:650;color:var(--ink)}.fi.act .d{background:var(--soft);color:var(--blue)}
.fi.act .d:after{content:"";width:12px;height:12px;border-radius:50%;border:2.5px solid var(--blue);border-right-color:transparent}
.fi.pen{color:var(--faint)}.fi.pen .d{background:#f1f3f8;color:#c0c9db}
.bar{height:6px;border-radius:6px;background:#e7ecf8;overflow:hidden}.bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#6f98ff,#2563eb)}
.pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 11px;border-radius:99px;font:600 12.5px/1 Inter;background:var(--soft);color:#2c47b2}
.pill.am{background:var(--asoft);color:#a55a05}.pill.gr{background:var(--gsoft);color:#157a3c}.pill.gy{background:#eff1f6;color:#7a869c}
.lab{position:absolute;left:24px;top:18px;font:650 12px/1 Inter;letter-spacing:.08em;text-transform:uppercase;color:#7a879e}
.note{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;background:var(--asoft);color:#8a4b04;font-size:14.5px;font-weight:550}
'''
SYM='''<svg width="0" height="0" style="position:absolute"><defs>
<symbol id="i-id" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h3M6.5 16c.6-1.4 1.6-2 2.5-2s1.9.6 2.5 2"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.4" opacity=".7"/><path d="M17 14c2.4 0 4 1.6 4 4.5" opacity=".7"/></symbol>
<symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5" opacity=".6"/></symbol>
<symbol id="i-bars" viewBox="0 0 24 24"><rect x="4" y="13" width="4" height="7" rx="1.5"/><rect x="10" y="8" width="4" height="12" rx="1.5"/><rect x="16" y="4" width="4" height="16" rx="1.5"/></symbol>
<symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/></symbol>
<symbol id="i-receipt" viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></symbol>
<symbol id="i-pulse" viewBox="0 0 24 24"><path d="M3 12h4l2-6 4 12 2-6h6"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></symbol>
<symbol id="i-build" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
</defs></svg>'''
SRC=[("file","DLT"),("receipt","GSTIN"),("pulse","MCA"),("globe","Website"),("build","Registry")]
def srcrow(done=4):
    return '<div class="src">'+''.join(f'<div class="s1{" q" if k>=done else ""}">{I(n)}'+(f'<span class="tk">{I("check")}</span>' if k<done else '')+'</div>' for k,(n,_) in enumerate(SRC))+'</div>'
FEED=[("Checked DLT registration","ok"),("Checked GSTIN","ok"),("Checked MCA","ok"),("Looking up your company website","act"),("Filling in your business profile","pen")]
def feed(alldone=False):
    out=''
    for t,s in FEED:
        if alldone: s='ok'
        d=I("check") if s=="ok" else ""
        out+=f'<div class="fi {"act" if s=="act" else "pen" if s=="pen" else ""}"><span class="d">{d}</span>{t}</div>'
    return f'<div class="feed">{out}</div>'
def left_tile(k,state,sub):
    ic,name=STEPS[k]
    cls={"cur":"on","done":"ok","lock":"lk","q":""}[state]
    ico=I("check") if state=="done" else I("lock") if state=="lock" else I(ic)
    return f'<div class="tile {cls}">{ico}</div>'

# ---------------- OPTION A: workspace + rail ----------------
def rail(states):
    rows=''
    for k,(ic,name) in enumerate(STEPS):
        st,sub=states[k]
        cur=st=="cur"
        rows+=f'''<div style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:16px;{'background:#fff;box-shadow:0 0 0 1px #d6e0f7,0 12px 24px -16px rgba(30,60,160,.5);' if cur else ''}position:relative">
        {left_tile(k,st,sub)}<div style="min-width:0"><div style="font-weight:{650 if cur else 560};font-size:15.5px;color:{'var(--ink)' if st!='lock' else '#8a96ad'}">{name}</div><div style="font-size:13px;color:{'#a55a05' if sub.startswith('Needs') else 'var(--muted)'}">{sub}</div></div></div>'''
        if k<4: rows+=f'<div style="width:2px;height:12px;margin-left:33px;background:{"#bfe5cc" if st=="done" else "#dbe3f5"}"></div>'
    return f'<div style="position:absolute;left:28px;top:96px;width:292px">{rows}</div>'
def A_proc():
    return f'''<div class="frame">
  <img class="lg" src="{logo}" style="position:absolute;left:36px;top:34px;width:34px;height:34px">
  {rail([("cur","Reading sources · 4 of 5"),("q","Queued"),("q","Queued"),("q","Queued"),("q","Queued")])}
  <div style="position:absolute;left:352px;right:48px;top:34px">{CHIP}<h1 style="margin-top:12px">Working on your business profile</h1><div class="sub" style="margin-top:6px">Reading DLT registration, GSTIN, MCA and your company website.</div></div>
  <div class="sheet" style="position:absolute;left:352px;right:48px;top:196px;bottom:40px;display:grid;grid-template-columns:1fr 360px">
    <div style="position:relative;padding:34px 40px">
      <div style="display:flex;justify-content:center">{srcrow(4)}</div>
      <div style="display:flex;justify-content:center;margin:26px 0 18px"><div class="orb"><i><img src="{logo}"></i></div></div>
      {form(2,4,True)}
    </div>
    <div style="border-left:1px solid var(--line);padding:34px 30px;background:linear-gradient(180deg,#fafcff,#fff);border-radius:0 22px 22px 0">
      <div class="lab" style="position:static;margin-bottom:14px">What the agent is doing</div>{feed()}
      <div style="margin-top:22px"><div style="display:flex;justify-content:space-between;font-size:13.5px;color:var(--muted);margin-bottom:8px"><span>Step 1 of 5</span><span>4 of 5 checks</span></div><div class="bar"><i style="width:78%"></i></div></div>
    </div></div></div>'''
def A_rev():
    return f'''<div class="frame">
  <img class="lg" src="{logo}" style="position:absolute;left:36px;top:34px;width:34px;height:34px">
  {rail([("cur","Needs you: review"),("lock","Opens after approval"),("lock","Locked"),("lock","Locked"),("lock","Locked")])}
  <div style="position:absolute;left:352px;right:48px;top:34px">{CHIP}<h1 style="margin-top:12px">Please review your business profile</h1><div class="sub" style="margin-top:6px">Filled your logo and all 7 fields from 4 sources. Check the details and submit.</div></div>
  <div class="sheet" style="position:absolute;left:352px;right:48px;top:196px;bottom:40px;display:grid;grid-template-columns:1fr 340px;grid-template-rows:1fr 84px">
    <div style="padding:30px 40px;overflow:hidden">{logo_slot()}{form(2,7,True)}</div>
    <div style="border-left:1px solid var(--line);padding:30px 28px;background:#fafcff;border-radius:0 22px 0 0"><div class="lab" style="position:static;margin-bottom:14px">What I did</div>{feed(True)}<div class="lab" style="position:static;margin:22px 0 12px">What happens next</div><div style="font-size:14.5px;color:var(--muted)">Telecom operators check it. Your Team step opens once it is approved.</div></div>
    <div style="grid-column:1/-1;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 40px"><div class="auth"><div class="cb"></div><div><b>I'm authorised to submit this KYC, and it's accurate.</b><small>The company accepts responsibility for any false information.</small></div></div><span class="btn dis">Submit for approval</span></div>
  </div></div>'''

# ---------------- OPTION B: top dock ----------------
def dock(states):
    out=''
    for k,(ic,name) in enumerate(STEPS):
        st,sub,prog=states[k]
        cur=st=="cur"
        bg='#fff' if cur else 'rgba(255,255,255,.55)'
        out+=f'''<div style="flex:{1.5 if cur else 1};position:relative;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:18px;background:{bg};box-shadow:0 0 0 {1.5 if cur else 1}px {'#7da0ff' if cur else '#dfe6f6'}{',0 18px 32px -20px rgba(30,60,160,.6)' if cur else ''};overflow:hidden">
        {left_tile(k,st,sub)}<div style="min-width:0"><div style="font-weight:650;font-size:15.5px;color:{'var(--ink)' if st!='lock' else '#8a96ad'};white-space:nowrap">{name}</div><div style="font-size:13px;color:{'#a55a05' if sub.startswith('Needs') else 'var(--muted)'};white-space:nowrap">{sub}</div></div>
        <div style="position:absolute;left:0;right:0;bottom:0;height:3px;background:#edf1fa"><i style="display:block;height:100%;width:{prog}%;background:{'var(--green)' if st=='done' else 'var(--blue)'}"></i></div></div>'''
    return f'<div style="position:absolute;left:40px;right:40px;top:28px;display:flex;gap:12px">{out}</div>'
def B_proc():
    return f'''<div class="frame">
  {dock([("cur","Reading sources",78),("q","Queued",0),("q","Queued",0),("q","Queued",0),("q","Queued",0)])}
  <div class="sheet" style="position:absolute;left:40px;right:40px;top:128px;bottom:40px;padding:34px 44px">
    <div style="display:flex;align-items:center;justify-content:space-between"><div>{CHIP}<h1 style="margin-top:12px;font-size:30px">Working on your business profile</h1></div><span class="pill">Step 1 of 5 · 4 of 5 checks</span></div>
    <div style="display:grid;grid-template-columns:260px 120px 1fr;gap:34px;margin-top:34px;align-items:start">
      <div><div class="lab" style="position:static;margin-bottom:14px">Sources</div>{feed()}</div>
      <div style="display:flex;flex-direction:column;align-items:center;padding-top:30px"><div class="orb"><i><img src="{logo}"></i></div><div style="width:2px;flex:1;min-height:60px;margin-top:10px;background:linear-gradient(#8fb0ff,transparent)"></div></div>
      <div><div class="lab" style="position:static;margin-bottom:14px">Your business profile</div>{form(2,4,True)}</div>
    </div><div style="position:absolute;left:44px;right:44px;bottom:30px"><div style="display:flex;justify-content:space-between;font-size:14px;color:var(--muted);margin-bottom:8px"><span>Reading your sources</span><span>Next: Team opens once the profile is approved</span></div><div class="bar"><i style="width:78%"></i></div></div></div></div>'''
def B_rev():
    return f'''<div class="frame">
  {dock([("cur","Needs you: review",100),("lock","Opens after approval",0),("lock","Locked",0),("lock","Locked",0),("lock","Locked",0)])}
  <div class="sheet" style="position:absolute;left:40px;right:40px;top:128px;bottom:40px;display:grid;grid-template-rows:auto 1fr 84px">
    <div style="display:flex;align-items:center;gap:18px;padding:22px 44px;border-bottom:1px solid var(--line)">{CHIP}<div><div style="font-weight:680;font-size:20px;letter-spacing:-.02em">Please review your business profile</div><div class="sub" style="font-size:14.5px">Filled your logo and all 7 fields from 4 sources.</div></div><span style="margin-left:auto" class="pill gy">What I did · 5 steps {I("chev")}</span></div>
    <div style="padding:28px 44px;display:grid;grid-template-columns:120px 1fr;gap:34px">
      <div><div class="lbox" style="width:110px;height:110px"><b>HDFC</b></div><div class="lt" style="margin-top:10px">Enterprise logo</div><div class="ls">Found on your website</div></div>{form(2,7,True)}</div>
    <div style="border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 44px"><div class="auth"><div class="cb"></div><div><b>I'm authorised to submit this KYC, and it's accurate.</b><small>The company accepts responsibility for any false information.</small></div></div><span class="btn dis">Submit for approval</span></div>
  </div></div>'''

# ---------------- OPTION C: agent console split ----------------
def tabs(active,states):
    out=''
    for k,(ic,name) in enumerate(STEPS):
        st=states[k]
        cur=k==active
        dot={"cur":'<i style="width:8px;height:8px;border-radius:50%;background:var(--blue)"></i>',"q":'<i style="width:8px;height:8px;border-radius:50%;background:#c3cde2"></i>',"lock":I("lock")}[st]
        out+=f'<div style="display:flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:99px;font-weight:{650 if cur else 560};font-size:15px;{"background:#1d2b64;color:#fff" if cur else "background:#fff;color:#52607d;box-shadow:0 0 0 1px #dfe6f6"}">{dot if not cur else I(ic)}{name}</div>'
    return f'<div style="display:flex;gap:10px">{out}</div>'
def leftpanel(title,sub,body):
    return f'''<div class="dark" style="position:absolute;left:0;top:0;bottom:0;width:420px;padding:44px 40px;color:#fff;background:radial-gradient(80% 50% at 0% 0%,rgba(150,120,255,.45),transparent 70%),linear-gradient(170deg,#2563eb,#1d4ed8 55%,#1a3aa8)">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:36px">{CHIP}</div>
    <h1 style="color:#fff;font-size:36px">{title}</h1><div style="margin-top:12px;color:rgba(255,255,255,.82);font-size:16px">{sub}</div>{body}</div>'''
def C_proc():
    tl=''
    for t,s in FEED:
        c={"ok":"background:#34d399;color:#06351f","act":"background:#fff;color:#2563eb","pen":"background:rgba(255,255,255,.2);color:transparent"}[s]
        tl+=f'<div style="display:flex;gap:14px;align-items:center;padding:11px 0;font-size:16px;opacity:{0.55 if s=="pen" else 1};font-weight:{650 if s=="act" else 500}"><span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;{c}">{I("check") if s=="ok" else ""}</span>{t}</div>'
    return f'''<div class="frame">{leftpanel("Working on your business profile","Reading DLT registration, GSTIN, MCA and your company website.",f'<div style="margin-top:36px;position:relative">{tl}</div><div style="position:absolute;left:40px;right:40px;bottom:40px;font-size:13.5px;color:rgba(255,255,255,.75)"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Step 1 of 5</span><span>4 of 5 checks</span></div><div class="bar" style="background:rgba(255,255,255,.22)"><i style="width:78%;background:#fff"></i></div></div>')}
  <div style="position:absolute;left:460px;right:44px;top:34px">{tabs(0,["cur","q","q","q","q"])}</div>
  <div class="sheet" style="position:absolute;left:460px;right:44px;top:100px;bottom:40px;padding:34px 44px">
    <div style="display:flex;align-items:center;gap:22px;margin-bottom:26px">{srcrow(4)}<div style="flex:1;height:2px;background:linear-gradient(90deg,#8fb0ff,transparent)"></div><div class="orb" style="width:70px;height:70px"><i style="width:28px;height:28px"><img src="{logo}" style="width:15px;height:15px"></i></div></div>
    {form(2,4,True)}</div></div>'''
def C_rev():
    body=f'''<div class="note" style="margin-top:32px;background:rgba(255,236,190,.97);color:#7a4303;flex-direction:column;align-items:flex-start;gap:4px"><b style="font-size:12px;letter-spacing:.08em;text-transform:uppercase">Needs you</b><span>Confirm you're authorised to submit, then send it for approval.</span></div>
    <div style="margin-top:30px;border-top:1px solid rgba(255,255,255,.22)"><div style="display:flex;justify-content:space-between;padding:16px 0;font-size:16px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.22)">What I did <span style="opacity:.7">5 steps</span></div><div style="display:flex;justify-content:space-between;padding:16px 0;font-size:16px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.22)">What happens next {I("chev")}</div></div>'''
    return f'''<div class="frame">{leftpanel("Please review your business profile","Filled your logo and all 7 fields from 4 sources.",body)}
  <div style="position:absolute;left:460px;right:44px;top:34px">{tabs(0,["cur","lock","lock","lock","lock"])}</div>
  <div class="sheet" style="position:absolute;left:460px;right:44px;top:100px;bottom:40px;display:grid;grid-template-rows:1fr 84px">
    <div style="padding:34px 44px;overflow:hidden">{logo_slot()}{form(2,7,True)}</div>
    <div style="border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 44px"><div class="auth"><div class="cb"></div><div><b>I'm authorised to submit this KYC, and it's accurate.</b></div></div><span class="btn dis">Submit for approval</span></div></div></div>'''

# ---------------- OPTION D: mission board + folder tabs ----------------
def lane(k,name,state,log,prog,expanded=False):
    ic=STEPS[k][0]
    st={"run":'<span class="pill">Working</span>',"q":'<span class="pill gy">Queued</span>',"ok":'<span class="pill gr">Ready</span>'}[state]
    tile=f'<div class="tile {"on" if state=="run" else "ok" if state=="ok" else ""}">{I(ic) if state!="ok" else I("check")}</div>'
    head=f'''<div style="display:flex;align-items:center;gap:18px">{tile}<div style="width:190px"><div style="font-weight:650;font-size:17px">{name}</div><div style="font-size:13.5px;color:var(--muted)">{log}</div></div><div class="bar" style="flex:1"><i style="width:{prog}%"></i></div><div style="width:84px;text-align:right">{st}</div></div>'''
    if not expanded: return f'<div style="padding:26px 28px;border-bottom:1px solid var(--line)">{head}</div>'
    return f'''<div style="padding:20px 28px 26px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#f8faff,#fff)">{head}
      <div style="display:grid;grid-template-columns:auto 1fr;gap:34px;margin-top:22px;align-items:center;padding-left:58px"><div><div style="display:flex;align-items:center;gap:24px">{srcrow(4)}<div class="orb" style="width:74px;height:74px"><i style="width:30px;height:30px"><img src="{logo}" style="width:16px;height:16px"></i></div></div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">{''.join(f'<div class="inp" style="height:46px;font-size:14.5px">{FIELDS[j][1][:22]}</div>' if j<4 else '<div class="inp"><span class="sk"></span></div>' for j in range(6))}</div></div></div>'''
def D_proc():
    rows=lane(0,"Business profile","run","Looking up your website",78,True)+lane(1,"Team","q","Waiting for the profile",0)+lane(2,"Brands and LOBs","q","Waiting",0)+lane(3,"GTM partners","q","Waiting",0)+lane(4,"Templates","q","Waiting",0)
    return f'''<div class="frame">
  <div style="position:absolute;left:56px;right:56px;top:34px;display:flex;align-items:flex-end;justify-content:space-between"><div>{CHIP}<h1 style="margin-top:12px">The agent is preparing your five steps</h1><div class="sub" style="margin-top:6px">Each step opens for your review as soon as it is ready.</div></div><span class="pill" style="height:34px;font-size:14px">0 of 5 ready · about 40 s left</span></div>
  <div class="sheet" style="position:absolute;left:56px;right:56px;top:196px;overflow:hidden">{rows}</div><div style="position:absolute;left:56px;right:56px;bottom:40px;display:flex;align-items:center;gap:10px;color:var(--muted);font-size:15px">{I("info")}You can open a step as soon as it is ready. No need to wait for the rest.</div></div>'''
def D_rev():
    tabs=''
    for k,(ic,name) in enumerate(STEPS):
        cur=k==0
        tabs+=f'<div style="height:{54 if cur else 44}px;align-self:flex-end;padding:0 24px;display:flex;align-items:center;gap:10px;border-radius:16px 16px 0 0;font-weight:650;font-size:16px;{"background:#fff;color:var(--ink);box-shadow:0 0 0 1px var(--line);position:relative;z-index:2;margin-bottom:-1px" if cur else "background:rgba(255,255,255,.55);color:#8a96ad;box-shadow:0 0 0 1px #e1e8f6"}">{I(ic) if cur else I("lock")}{name}</div>'
    return f'''<div class="frame">
  <div style="position:absolute;left:56px;right:56px;top:34px;display:flex;align-items:center;gap:22px"><img class="lg" src="{logo}" style="width:34px;height:34px">{CHIP}<span class="sub" style="font-size:15px">Filled your logo and all 7 fields from 4 sources. Check the details and submit.</span></div>
  <div style="position:absolute;left:56px;right:56px;top:104px;display:flex;gap:6px;align-items:flex-end;height:54px">{tabs}</div>
  <div class="sheet" style="position:absolute;left:56px;right:56px;top:158px;bottom:40px;border-top-left-radius:0;display:grid;grid-template-rows:1fr 84px">
    <div style="padding:34px 48px;display:grid;grid-template-columns:130px 1fr;gap:40px;overflow:hidden"><div><div class="lbox" style="width:116px;height:116px"><b>HDFC</b></div><div class="lt" style="margin-top:10px">Enterprise logo</div><div class="ls">Found on your website</div></div>{form(3,7,True)}</div>
    <div style="border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 48px"><div class="auth"><div class="cb"></div><div><b>I'm authorised to submit this KYC, and it's accurate.</b><small>The company accepts responsibility for any false information.</small></div></div><span class="btn dis">Submit for approval</span></div></div></div>'''

OPTS=[
 ("A","Workspace + Rail","One big workspace, and the other steps live in a slim stepper on the left as mini cards. Only the current step gets the full width.",A_proc,A_rev,
  "Short windows: the rail collapses to icon-only tiles and the sheet scrolls inside with its action bar pinned, so text never shrinks. Processing: the stage plays in the sheet, not in a card. Unlock: the next tile fills in and slides the workspace over."),
 ("B","Top Dock","Five mini cards sit in a dock across the top (progress under each). The current step opens as a full-width sheet below. Finished steps tick green, upcoming ones show what unlocks them.",B_proc,B_rev,
  "Short windows: the dock shrinks to a 56px strip of icons and progress, the sheet takes the rest, and its footer stays pinned. Unlock: the dock tile expands and the sheet changes with a slide."),
 ("C","Agent Console","The agent has a dedicated blue panel on the left (what it did, what it needs from you). The work surface on the right has step pills on top and uses the full width for content.",C_proc,C_rev,
  "Short windows: the console collapses to a slim bar with the agent line and the 'Needs you' note; the surface gets the full height. Processing is a live timeline plus the form filling in."),
 ("D","Mission Board + Folder Tabs","No cards at all. Processing is a board of five lanes with live progress, the active lane expanding to show the agent at work. Review uses folder tabs: the open step is a tall sheet, the others are locked tabs that unlock one by one.",D_proc,D_rev,
  "Short windows: lanes collapse to single rows and the active one scrolls; in review the tabs shrink to icons and the sheet scrolls with a pinned footer. Three-column forms keep the fields large and short."),
]
frames={}
for k,name,desc,p,r,sh in OPTS:
    frames[k+"-proc"]=p(); frames[k+"-rev"]=r()
import json
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Layout Directions</title><style>{CSS}
body{{padding:32px 24px 80px}}.wrap{{max-width:1560px;margin:0 auto}}
h2.t{{font-size:30px;letter-spacing:-.03em;margin:6px 0 8px}}.lead{{color:var(--muted);font-size:17px;max-width:900px;margin-bottom:34px}}
.opt{{margin-bottom:54px}}.oh{{display:flex;align-items:baseline;gap:16px;margin-bottom:6px}}.oh b{{font-size:26px;letter-spacing:-.02em}}.oh span{{background:#1d2b64;color:#fff;font:700 13px/1 Inter;padding:6px 10px;border-radius:8px}}
.od{{color:var(--ink2);font-size:16px;max-width:1000px;margin-bottom:6px}}.os{{color:var(--muted);font-size:14.5px;max-width:1000px;margin-bottom:16px}}
.pair{{display:flex;gap:20px;flex-wrap:wrap}}.fw{{position:relative;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px #d6def0,0 24px 50px -30px rgba(30,60,160,.5);cursor:zoom-in;background:#fff}}
.fw .frame{{transform-origin:0 0}}.cap{{font:650 12px/1 Inter;letter-spacing:.08em;text-transform:uppercase;color:#7a879e;margin:0 0 8px}}
.lb{{position:fixed;inset:0;background:rgba(10,16,40,.82);display:none;place-items:center;z-index:50;cursor:zoom-out}}.lb.on{{display:grid}}.lb .fw{{cursor:zoom-out}}
</style></head><body>{SYM}<div class="wrap"><h2 class="t">Layout directions</h2><div class="lead">Four ways to give the content the full space, keep the card-transition idea, and stop the credit-card look. Each shows the agent processing and the review step at 1440 x 900. Click a picture to enlarge.</div>'''
for k,name,desc,p,r,sh in OPTS:
    page+=f'<div class="opt"><div class="oh"><span>{k}</span><b>{name}</b></div><div class="od">{desc}</div><div class="os">{sh}</div><div class="pair"><div><div class="cap">Agent processing</div><div class="fw" data-f="{k}-proc"></div></div><div><div class="cap">Review</div><div class="fw" data-f="{k}-rev"></div></div></div></div>'
page+='</div><div class="lb" id="lb"></div><script>var F='+json.dumps(frames)+''';
function fit(){var w=Math.min(740,(document.querySelector('.wrap').clientWidth-20)/2);if(innerWidth<900)w=document.querySelector('.wrap').clientWidth;var s=w/1440;document.querySelectorAll('.fw[data-f]').forEach(function(e){e.style.width=1440*s+'px';e.style.height=900*s+'px';e.innerHTML=F[e.dataset.f];var f=e.firstChild;f.style.transform='scale('+s+')';});}
fit();addEventListener('resize',fit);
var lb=document.getElementById('lb');document.addEventListener('click',function(e){var t=e.target.closest('.fw[data-f]');if(t&&!lb.classList.contains('on')){var s=Math.min((innerWidth-40)/1440,(innerHeight-40)/900);lb.innerHTML='<div class="fw" style="width:'+1440*s+'px;height:'+900*s+'px">'+F[t.dataset.f]+'</div>';lb.firstChild.firstChild.style.transform='scale('+s+')';lb.classList.add('on');}else if(lb.classList.contains('on')){lb.classList.remove('on');}});
</script></body></html>'''
open('layout-directions.html','w').write(page)
# standalone frames for PNG export
for key,html in frames.items():
    open(f'/tmp/frame-{key}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS} body{{margin:0}}</style></head><body>{SYM}{html}</body></html>')
print(len(page))
