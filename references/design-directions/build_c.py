src=open('build.py').read()
exec(src.split('OPTS=[')[0])
CSS+='''
.flat .inp{border:0;border-bottom:1.5px solid #d6dff2;border-radius:0;background:transparent;padding:0 2px;height:44px}
.flat .fd label{font-size:13px;color:var(--muted);font-weight:600}
.flat .inp .sk{background:linear-gradient(90deg,#e8edf9,#dbe4f8,#e8edf9)}
.tabs2{display:flex;gap:30px;border-bottom:1px solid var(--line)}
.tabs2 div{padding:14px 2px 13px;font-size:15.5px;font-weight:560;color:#8a96ad;display:flex;align-items:center;gap:8px;margin-bottom:-1px}
.tabs2 div.on{color:var(--ink);font-weight:650;border-bottom:2.5px solid var(--blue)}
.tabs2 .i{width:17px;height:17px}
.srcl{display:flex;gap:26px;align-items:center;font-size:14.5px;color:var(--ink2)}
.srcl span{display:inline-flex;align-items:center;gap:7px}.srcl .i{width:18px;height:18px;color:#6b86e8}
.srcl .ck{width:18px;height:18px;border-radius:50%;background:var(--gsoft);color:var(--green);display:grid;place-items:center}.srcl .ck .i{width:11px;height:11px;stroke-width:3;color:var(--green)}
.srcl .q{color:#a3aec4}
.srow{display:grid;grid-template-columns:250px 1fr;gap:34px;padding:26px 0;border-bottom:1px solid var(--line)}
.srow h4{font-size:16px;font-weight:650}.srow p{font-size:13.5px;color:var(--muted);margin-top:4px}
.led{display:grid;grid-template-columns:230px 1fr auto;align-items:center;gap:20px;padding:15px 0;border-bottom:1px solid var(--line)}
.led .k{font-size:14px;font-weight:600;color:var(--muted)}.led .v{font-size:16.5px;font-weight:550}
.led .v.sk2{height:9px;width:240px;border-radius:6px;background:linear-gradient(90deg,#e8edf9,#dbe4f8,#e8edf9)}
.led em{font:600 11.5px/1 Inter;font-style:normal;color:#2c47b2;background:var(--soft);padding:5px 8px;border-radius:6px}
.led em.ph{visibility:hidden}
'''
def tabs_flat(active,states):
    out=''
    for k,(ic,name) in enumerate(STEPS):
        st=states[k]
        out+=f'<div class="{"on" if k==active else ""}">{I("lock") if st=="lock" else I(ic) if k==active else ""}{name}</div>'
    return f'<div class="tabs2">{out}</div>'
def srcline(done=4):
    names=[("file","DLT"),("receipt","GSTIN"),("pulse","MCA"),("globe","Website"),("build","Registry")]
    return '<div class="srcl">'+''.join((f'<span><i class="ck">{I("check")}</i>{n}</span>' if k<done else f'<span class="q">{I(ic)}{n}</span>') for k,(ic,n) in enumerate(names))+'</div>'
def authrow(note=True):
    return f'<div style="display:flex;align-items:center;justify-content:space-between"><div class="auth"><div class="cb"></div><div><b>I\'m authorised to submit this KYC, and it\'s accurate.</b>{"<small>The company accepts responsibility for any false information.</small>" if note else ""}</div></div><span class="btn dis">Submit for approval</span></div>'
# ---------- C2: open surface ----------
def C2_proc():
    return f'''<div class="frame">{leftpanel("Working on your business profile","Reading DLT registration, GSTIN, MCA and your company website.",'<div style="margin-top:36px">'+''.join(f'<div style="display:flex;gap:14px;align-items:center;padding:11px 0;font-size:16px;opacity:{0.55 if s=="pen" else 1};font-weight:{650 if s=="act" else 500}"><span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;{ {"ok":"background:#34d399;color:#06351f","act":"background:#fff","pen":"background:rgba(255,255,255,.2)"}[s]}">{I("check") if s=="ok" else ""}</span>{t}</div>' for t,s in FEED)+'</div>')}
  <div style="position:absolute;left:480px;right:64px;top:36px">{tabs_flat(0,["cur","q","q","q","q"])}
    <div style="display:flex;align-items:center;justify-content:space-between;margin:34px 0 22px"><div style="font-size:26px;font-weight:680;letter-spacing:-.025em">Business profile</div><span class="pill">Reading sources · 4 of 5</span></div>
    {srcline(4)}<div style="height:1px;background:var(--line);margin:26px 0 30px"></div>
    <div class="flat">{form(2,4,True)}</div></div></div>'''
def C2_rev():
    return f'''<div class="frame">{leftpanel("Please review your business profile","Filled your logo and all 7 fields from 4 sources.",'<div style="margin-top:34px;border-left:3px solid #ffd37a;padding:4px 0 4px 16px;font-size:15.5px"><b style="display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#ffd37a;margin-bottom:4px">Needs you</b>Confirm you are authorised to submit, then send it for approval.</div><div style="margin-top:30px;font-size:15.5px;line-height:2.2;font-weight:600"><div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.22);padding-top:6px">What I did <span style="opacity:.7">5 steps</span></div><div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.22);padding-top:6px;margin-top:6px">What happens next '+I("chev")+'</div></div>')}
  <div style="position:absolute;left:480px;right:64px;top:36px">{tabs_flat(0,["cur","lock","lock","lock","lock"])}
    <div style="display:flex;align-items:center;gap:22px;margin:34px 0 30px">{logo_slot().replace('margin-bottom:22px','margin-bottom:0')}</div>
    <div class="flat">{form(2,7,True)}</div>
    <div style="position:absolute;left:0;right:0;top:760px;border-top:1px solid var(--line);padding-top:22px">{authrow()}</div></div></div>'''
# ---------- C3: light console + ledger ----------
def C3_left(title,sub,body):
    return f'''<div style="position:absolute;left:0;top:0;bottom:0;width:430px;padding:48px 44px;border-right:1px solid var(--line);background:linear-gradient(180deg,#f3f6ff,#edf2fd)"><div>{CHIP}</div><h1 style="margin-top:22px;font-size:36px">{title}</h1><div class="sub" style="margin-top:12px">{sub}</div>{body}</div>'''
def C3_proc():
    tl=''
    for t,s in FEED:
        c={"ok":"background:var(--green);color:#fff","act":"background:#fff;box-shadow:0 0 0 2px var(--blue)","pen":"background:#fff;box-shadow:0 0 0 2px #cfd8ec"}[s]
        tl+=f'<div style="display:flex;gap:16px;align-items:center;padding:12px 0;font-size:16px;font-weight:{650 if s=="act" else 500};color:{"var(--ink)" if s!="pen" else "#9aa6bd"}"><span style="width:22px;height:22px;border-radius:50%;display:grid;place-items:center;{c}">{I("check") if s=="ok" else ""}</span>{t}</div>'
    body=f'<div style="margin-top:38px;position:relative"><div style="position:absolute;left:10px;top:24px;bottom:24px;width:2px;background:#d4def4"></div>{tl}</div>'
    crumbs=''.join(f'<span style="font-weight:{650 if k==0 else 500};color:{"var(--ink)" if k==0 else "#9aa6bd"}">{k+1} {n}</span>'+('<span style="color:#c3cde2">›</span>' if k<4 else '') for k,(_,n) in enumerate(STEPS))
    rows=''.join(f'<div class="led"><span class="k">{l}</span>'+(f'<span class="v">{v}</span><em>{s}</em>' if k<4 else '<span class="v sk2"></span><em class="ph">x</em>')+'</div>' for k,(l,v,s) in enumerate(FIELDS))
    return f'''<div class="frame">{C3_left("Working on your business profile","Reading DLT registration, GSTIN, MCA and your company website.",body)}
  <div style="position:absolute;left:430px;right:0;top:0;bottom:0;background:#fff;padding:42px 72px"><div style="display:flex;gap:14px;font-size:14.5px;align-items:center">{crumbs}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin:36px 0 12px"><div style="font-size:26px;font-weight:680;letter-spacing:-.025em">Business profile</div><span class="pill">Reading sources · 4 of 5</span></div>
    <div style="border-top:1px solid var(--line);margin-top:20px">{rows}</div></div></div>'''
def C3_rev():
    body='<div style="margin-top:34px;border-left:3px solid #f0a52c;padding:6px 0 6px 16px;font-size:15.5px;color:#7a4303"><b style="display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px">Needs you</b>Confirm you are authorised to submit, then send it for approval.</div><div style="margin-top:34px;font-size:15.5px;font-weight:600;color:var(--ink2)"><div style="display:flex;justify-content:space-between;padding:15px 0;border-top:1px solid #d4def4">What I did <span style="color:var(--muted);font-weight:500">5 steps</span></div><div style="display:flex;justify-content:space-between;padding:15px 0;border-top:1px solid #d4def4;border-bottom:1px solid #d4def4">What happens next '+I("chev")+'</div></div>'
    crumbs=''.join(f'<span style="font-weight:{650 if k==0 else 500};color:{"var(--ink)" if k==0 else "#9aa6bd"};display:inline-flex;align-items:center;gap:6px">{I("lock") if k else ""}{k+1} {n}</span>'+('<span style="color:#c3cde2">›</span>' if k<4 else '') for k,(_,n) in enumerate(STEPS))
    rows=''.join(f'<div class="led"><span class="k">{l}</span><span class="v">{v}</span><em>{s}</em></div>' for l,v,s in FIELDS)
    return f'''<div class="frame">{C3_left("Please review your business profile","Filled your logo and all 7 fields from 4 sources.",body)}
  <div style="position:absolute;left:430px;right:0;top:0;bottom:0;background:#fff;padding:42px 72px"><div style="display:flex;gap:14px;font-size:14.5px;align-items:center">{crumbs}</div>
    <div style="display:flex;align-items:center;gap:20px;margin:30px 0 8px">{logo_slot().replace('margin-bottom:22px','margin-bottom:0')}<span class="pill" style="margin-left:auto">Tap a value to edit</span></div>
    <div style="border-top:1px solid var(--line);margin-top:18px">{rows}</div>
    <div style="position:absolute;left:72px;right:72px;bottom:36px;border-top:1px solid var(--line);padding-top:22px">{authrow()}</div></div></div>'''
# ---------- C4: stepper inside console, settings-style form ----------
def C4_left(active_state,body_current):
    items=''
    for k,(ic,name) in enumerate(STEPS):
        cur=k==0
        sub=active_state[k]
        mark=I(ic) if cur else I("lock") if sub.startswith("Opens") or sub=="Locked" else I(ic)
        items+=f'<div style="display:flex;gap:14px;padding:13px 0;opacity:{1 if cur else .62}"><span style="width:34px;height:34px;border-radius:50%;display:grid;place-items:center;flex:none;{"background:#fff;color:#2563eb" if cur else "background:rgba(255,255,255,.16);color:#fff"}">{mark}</span><div style="flex:1"><div style="font-weight:{680 if cur else 560};font-size:16.5px">{name}</div><div style="font-size:13.5px;color:rgba(255,255,255,.78)">{sub}</div>{body_current if cur else ""}</div></div>'
    return f'''<div class="dark" style="position:absolute;left:0;top:0;bottom:0;width:440px;padding:44px 40px;color:#fff;background:radial-gradient(80% 50% at 0% 0%,rgba(150,120,255,.45),transparent 70%),linear-gradient(170deg,#2563eb,#1d4ed8 55%,#1a3aa8)"><div>{CHIP}</div><div style="margin-top:34px">{items}</div></div>'''
def sec(title,desc,inner): return f'<div class="srow"><div><h4>{title}</h4><p>{desc}</p></div><div>{inner}</div></div>'
def two(a,b): return f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px 26px">{a}{b}</div>'
def FF(k,fill=True,wide=False): l,v,s=FIELDS[k]; return field(l,v,s,wide=False,fill=fill)
def C4_proc():
    cur=''.join(f'<div style="display:flex;gap:9px;align-items:center;margin-top:8px;font-size:14px;opacity:{0.6 if s=="pen" else 1};font-weight:{650 if s=="act" else 500}"><span style="width:16px;height:16px;border-radius:50%;display:grid;place-items:center;{ {"ok":"background:#34d399;color:#06351f","act":"background:#fff","pen":"background:rgba(255,255,255,.25)"}[s]}">{I("check").replace("class=\"i \"","class=\"i\" style=\"width:9px;height:9px;stroke-width:3.4\"") if s=="ok" else ""}</span>{t}</div>' for t,s in FEED)
    return f'''<div class="frame">{C4_left(["Reading sources · 4 of 5","Queued","Queued","Queued","Queued"],cur)}
  <div style="position:absolute;left:440px;right:0;top:0;bottom:0;background:#fff;padding:44px 72px"><div style="display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:30px;font-weight:690;letter-spacing:-.03em">Working on your business profile</div><div class="sub" style="margin-top:4px">Reading DLT registration, GSTIN, MCA and your company website.</div></div></div>
    <div class="flat" style="margin-top:20px;border-top:1px solid var(--line)">{sec("Identity","Name and type from MCA",two(FF(0),FF(1)))}{sec("Registration","From DLT and GSTIN",two(FF(3),FF(2).replace('class="fd"','class="fd" style="grid-column:1/-1"')) if False else FF(2)+'<div style="height:20px"></div>'+two(FF(3),'<div></div>'))}{sec("Online presence","From your website",two(FF(4,False),FF(5,False))+'<div style="height:20px"></div>'+two(FF(6,False),'<div></div>'))}</div></div></div>'''
def C4_rev():
    cur='<div style="margin-top:8px;font-size:14px;color:#ffd37a;font-weight:600">Needs you: confirm you are authorised</div>'
    return f'''<div class="frame">{C4_left(["Review and submit","Opens after approval","Locked","Locked","Locked"],cur)}
  <div style="position:absolute;left:440px;right:0;top:0;bottom:0;background:#fff;padding:44px 72px"><div style="font-size:30px;font-weight:690;letter-spacing:-.03em">Please review your business profile</div><div class="sub" style="margin-top:4px">Filled your logo and all 7 fields from 4 sources. Check the details and submit.</div>
    <div class="flat" style="margin-top:20px;border-top:1px solid var(--line)">{sec("Identity","Name, type and logo",logo_slot().replace('margin-bottom:22px','margin-bottom:20px')+two(FF(0),FF(1)))}{sec("Registration","From DLT and GSTIN",FF(2)+'<div style="height:20px"></div>'+two(FF(3),'<div></div>'))}{sec("Online presence","From your website",two(FF(4),FF(5))+'<div style="height:20px"></div>'+two(FF(6),'<div></div>'))}</div>
    <div style="position:absolute;left:72px;right:72px;bottom:34px;padding-top:6px">{authrow()}</div></div></div>'''
OPTS=[
 ("C1","Agent Console, as it is now","The version you leaned towards: blue console, step pills, one white sheet, boxed fields.",C_proc,C_rev,"Reference only."),
 ("C2","Open surface","Same blue console, but the white sheet is gone. The form sits straight on the page, steps become plain underlined tabs, fields become underlined lines, and the sources are one line of text.","" ,"",""),
 ("C3","Light console + ledger","The blue panel becomes a soft tinted column with one continuous timeline. The right side is a flat ledger: label, value and source tag per row, with hairlines instead of boxes. The steps are a breadcrumb line.","" ,"",""),
 ("C4","Steps inside the console","The step tabs move into the blue console as a vertical stepper (the current step expands with what the agent did). The right side is a full-bleed white page in a settings layout, with a short title and description per section and underlined fields.","" ,"",""),
]
fn={"C2":(C2_proc,C2_rev),"C3":(C3_proc,C3_rev),"C4":(C4_proc,C4_rev)}
OPTS=[(k,n,d,fn[k][0] if k in fn else p,fn[k][1] if k in fn else r,sh) for k,n,d,p,r,sh in OPTS]
frames={}
for k,name,desc,p,r,sh in OPTS:
    frames[k+"-proc"]=p(); frames[k+"-rev"]=r()
import json
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Console variations</title><style>{CSS}
body{{padding:32px 24px 80px}}.wrap{{max-width:1560px;margin:0 auto}}
h2.t{{font-size:30px;letter-spacing:-.03em;margin:6px 0 8px}}.lead{{color:var(--muted);font-size:17px;max-width:900px;margin-bottom:34px}}
.opt{{margin-bottom:54px}}.oh{{display:flex;align-items:baseline;gap:16px;margin-bottom:6px}}.oh b{{font-size:26px;letter-spacing:-.02em}}.oh span{{background:#1d2b64;color:#fff;font:700 13px/1 Inter;padding:6px 10px;border-radius:8px}}
.od{{color:var(--ink2);font-size:16px;max-width:1000px;margin-bottom:16px}}
.pair{{display:flex;gap:20px;flex-wrap:wrap}}.fw{{position:relative;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px #d6def0,0 24px 50px -30px rgba(30,60,160,.5);cursor:zoom-in;background:#fff}}
.cap{{font:650 12px/1 Inter;letter-spacing:.08em;text-transform:uppercase;color:#7a879e;margin:0 0 8px}}
.lb{{position:fixed;inset:0;background:rgba(10,16,40,.82);display:none;place-items:center;z-index:50;cursor:zoom-out}}.lb.on{{display:grid}}
</style></head><body>{SYM}<div class="wrap"><h2 class="t">Console variations</h2><div class="lead">C1 is the version you liked. C2 to C4 keep the console idea but remove most of the boxes in different ways. Agent processing and review at 1440 x 900. Click a picture to enlarge.</div>'''
for k,name,desc,p,r,sh in OPTS:
    page+=f'<div class="opt"><div class="oh"><span>{k}</span><b>{name}</b></div><div class="od">{desc}</div><div class="pair"><div><div class="cap">Agent processing</div><div class="fw" data-f="{k}-proc"></div></div><div><div class="cap">Review</div><div class="fw" data-f="{k}-rev"></div></div></div></div>'
page+='</div><div class="lb" id="lb"></div><script>var F='+json.dumps(frames)+''';
function fit(){var w=Math.min(740,(document.querySelector('.wrap').clientWidth-20)/2);if(innerWidth<900)w=document.querySelector('.wrap').clientWidth;var s=w/1440;document.querySelectorAll('.fw[data-f]').forEach(function(e){e.style.width=1440*s+'px';e.style.height=900*s+'px';e.innerHTML=F[e.dataset.f];e.firstChild.style.transform='scale('+s+')';e.firstChild.style.transformOrigin='0 0';});}
fit();addEventListener('resize',fit);
var lb=document.getElementById('lb');document.addEventListener('click',function(e){var t=e.target.closest('.fw[data-f]');if(t&&!lb.classList.contains('on')){var s=Math.min((innerWidth-40)/1440,(innerHeight-40)/900);lb.innerHTML='<div class="fw" style="width:'+1440*s+'px;height:'+900*s+'px">'+F[t.dataset.f]+'</div>';lb.firstChild.firstChild.style.transform='scale('+s+')';lb.firstChild.firstChild.style.transformOrigin='0 0';lb.classList.add('on');}else if(lb.classList.contains('on')){lb.classList.remove('on');}});
</script></body></html>'''
open('console-variations.html','w').write(page)
for key,html in frames.items():
    open(f'/tmp/frame-{key}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS} body{{margin:0}}</style></head><body>{SYM}{html}</body></html>')
print('ok')
