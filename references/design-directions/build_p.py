exec(open('build_c.py').read().split('\nOPTS=[')[0])
CSS+='''
.lane2{display:grid;grid-template-columns:44px 210px 1fr 96px;gap:20px;align-items:center;padding:22px 0;border-bottom:1px solid var(--line)}
.lane2 .n{font-weight:650;font-size:17px}.lane2 .l{font-size:13.5px;color:var(--muted)}
.tabp{display:grid;grid-template-columns:repeat(5,1fr);gap:26px;border-bottom:1px solid var(--line)}
.tabp>div{padding:14px 0 14px;position:relative}.tabp .t{font-size:15.5px;font-weight:600;color:#8a96ad;display:flex;align-items:center;gap:8px}
.tabp .s{font-size:13px;color:var(--faint);margin:2px 0 9px}.tabp .b{height:3px;border-radius:3px;background:#e6ebf7;overflow:hidden}.tabp .b i{display:block;height:100%;background:var(--blue)}
.tabp .on .t{color:var(--ink);font-weight:680}.tabp .on .s{color:var(--blue)}
.tabp .t .i{width:17px;height:17px}
.pck{width:18px;height:18px;border-radius:50%;background:var(--gsoft);color:var(--green);display:grid;place-items:center;margin-left:2px}.pck .i{width:11px;height:11px;stroke-width:3}
'''
def console_all(title,sub,done=0):
    tl=''.join(f'<div style="display:flex;gap:14px;align-items:center;padding:11px 0;font-size:16px;opacity:{0.55 if s=="pen" else 1};font-weight:{650 if s=="act" else 500}"><span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;{ {"ok":"background:#34d399;color:#06351f","act":"background:#fff","pen":"background:rgba(255,255,255,.2)"}[s]}">{I("check") if s=="ok" else ""}</span>{t}</div>' for t,s in FEED)
    foot=f'<div style="position:absolute;left:40px;right:40px;bottom:40px;font-size:13.5px;color:rgba(255,255,255,.78)"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>{done} of 5 steps ready</span><span>about 40 s left</span></div><div class="bar" style="background:rgba(255,255,255,.22)"><i style="width:{6+done*20}%;background:#fff"></i></div></div>'
    return leftpanel(title,sub,'<div style="margin-top:34px">'+tl+'</div>'+foot)
def lane2(k,name,state,log,prog,open_=False):
    ic=STEPS[k][0]
    st={"run":'<span class="pill">Working</span>',"q":'<span class="pill gy">Queued</span>'}[state]
    tile=f'<div class="tile {"on" if state=="run" else ""}" style="width:40px;height:40px">{I(ic)}</div>'
    head=f'<div class="lane2" style="border:0;padding:6px 0">{tile}<div><div class="n">{name}</div><div class="l">{log}</div></div><div class="bar"><i style="width:{prog}%"></i></div><div style="text-align:right">{st}</div></div>'
    if not open_: return f'<div style="border-bottom:1px solid var(--line);padding:11px 0">{head}</div>'
    return f'<div style="border-bottom:1px solid var(--line);padding:22px 0 30px">{head}<div style="padding-left:64px;margin-top:20px">{srcline(4)}<div class="flat" style="margin-top:22px">{form3()}</div></div></div>'
def form3():
    F=FIELDS
    cells=[(0,1,True),(1,1,True),(3,1,True),(2,2,True),(4,1,False),(5,1,False),(6,1,False)]
    out=''
    for k,sp,fill in cells:
        l,v,t=F[k]
        out+=field(l,v,t,wide=False,fill=fill).replace('class="fd"',f'class="fd" style="grid-column:span {sp}"')
    return '<div class="form c3">'+out+'</div>'
# P1: lanes board in the C2 shell
def P1():
    rows=lane2(0,"Business profile","run","Looking up your website",78,True)+lane2(1,"Team","q","Waiting for the profile",0)+lane2(2,"Brands and LOBs","q","Waiting",0)+lane2(3,"GTM partners","q","Waiting",0)+lane2(4,"Templates","q","Waiting",0)
    return f'''<div class="frame">{console_all("Preparing your five steps","Each step opens for your review as soon as it is ready.")}
  <div style="position:absolute;left:480px;right:64px;top:44px"><div style="font-size:26px;font-weight:680;letter-spacing:-.025em;margin-bottom:6px">Five steps, in progress</div><div class="sub" style="font-size:15px;margin-bottom:18px">You can open a step as soon as it is ready. No need to wait for the rest.</div><div style="border-top:1px solid var(--line)">{rows}</div></div></div>'''
# P2: tabs carry the progress, one step in focus
def P2():
    names=STEPS
    sts=[("Reading sources · 78%",78,True),("Queued",0,False),("Queued",0,False),("Queued",0,False),("Queued",0,False)]
    tabs=''.join(f'<div class="{"on" if on else ""}"><div class="t">{I(ic) if on else ""}{n}</div><div class="s">{s}</div><div class="b"><i style="width:{p}%"></i></div></div>' for (ic,n),(s,p,on) in zip(names,sts))
    return f'''<div class="frame">{console_all("Preparing your five steps","Each step opens for your review as soon as it is ready.")}
  <div style="position:absolute;left:480px;right:64px;top:36px"><div class="tabp">{tabs}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin:34px 0 22px"><div style="font-size:26px;font-weight:680;letter-spacing:-.025em">Business profile</div><span class="pill">Reading sources · 4 of 5</span></div>
    {srcline(4)}<div style="height:1px;background:var(--line);margin:26px 0 30px"></div><div class="flat">{form(2,4,True)}</div></div></div>'''
# P3: pipeline, sources -> agent -> five outputs
def P3():
    W,H=896,780
    src_y=[150+k*92 for k in range(5)]; out_y=[130+k*112 for k in range(5)]
    ox,oy=448,400
    paths=''
    for k,y in enumerate(src_y):
        on=k<4
        paths+=f'<path d="M196 {y} C 320 {y}, 330 {oy}, {ox-60} {oy}" stroke="{"url(#g1)" if on else "#e1e7f6"}" stroke-width="2.2" fill="none" {"stroke-dasharray=\"2 7\" stroke-linecap=\"round\"" if k==3 else ""}/>'
    for k,y in enumerate(out_y):
        on=k==0
        paths+=f'<path d="M{ox+60} {oy} C 560 {oy}, 570 {y}, 650 {y}" stroke="{"url(#g1)" if on else "#e1e7f6"}" stroke-width="2.2" fill="none" {"" if on else "stroke-dasharray=\"2 7\" stroke-linecap=\"round\""}/>'
    svg=f'<svg width="{W}" height="{H}" style="position:absolute;left:0;top:0"><defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#8fb0ff"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs>{paths}</svg>'
    sources=''.join(f'<div style="position:absolute;left:0;top:{y-21}px;display:flex;align-items:center;gap:12px;font-size:15.5px;color:{"var(--ink2)" if k<4 else "#a3aec4"}"><span style="width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:#fff;box-shadow:0 0 0 1px var(--line);color:{"#4a6fe8" if k<4 else "#b5bfd3"}">{I(SRC[k][0])}</span>{SRC[k][1]}{"<i class=pck>"+I("check")+"</i>" if k<4 else ""}</div>' for k,y in enumerate(src_y)).replace('class=pck','class="pck"')
    outs=''
    texts=[("Reading your sources","4 of 5 checks"),("Team","Waiting for the profile"),("Brands and LOBs","Waiting"),("GTM partners","Waiting"),("Templates","Waiting")]
    for k,y in enumerate(out_y):
        ic=STEPS[k][0]
        on=k==0
        outs+=f'<div style="position:absolute;left:660px;top:{y-24}px;width:236px;display:flex;align-items:center;gap:14px"><div class="tile {"on" if on else ""}" style="width:44px;height:44px;opacity:{1 if on else .7}">{I(ic)}</div><div style="min-width:0"><div style="font-weight:650;font-size:16.5px;color:{"var(--ink)" if on else "#8a96ad"}">{STEPS[k][1]}</div><div style="font-size:13.5px;color:var(--muted)">{texts[k][1]}</div>{"<div class=bar style=margin-top:8px;width:150px><i style=width:78%></i></div>" if on else ""}</div></div>'
    outs=outs.replace('class=bar style=margin-top:8px;width:150px','class="bar" style="margin-top:8px;width:150px"').replace('style=width:78%','style="width:78%"')
    orb=f'<div style="position:absolute;left:{ox-60}px;top:{oy-60}px;width:120px;height:120px" class="orb"><i style="width:48px;height:48px"><img src="{logo}" style="width:25px;height:25px"></i></div><div style="position:absolute;left:{ox-130}px;top:{oy+78}px;width:260px;text-align:center;font-size:15px;font-weight:650">Looking up your website</div><div style="position:absolute;left:{ox-130}px;top:{oy+100}px;width:260px;text-align:center;font-size:13.5px;color:var(--muted)">Filling in the business profile next</div>'
    return f'''<div class="frame">{console_all("Preparing your five steps","Each step opens for your review as soon as it is ready.")}
  <div style="position:absolute;left:480px;top:60px;width:{W}px;height:{H}px">{svg}<div class="lab" style="left:0;top:78px">Sources</div><div class="lab" style="left:660px;top:78px">Your five steps</div>{sources}{orb}{outs}</div></div>'''
OPTS=[("P1","Lanes board","Attached style, in the C2 shell: all five steps as flat lanes with live progress. The active lane opens to show the sources and the form filling in. Everything else is a single line.",P1,P1,""),
 ("P2","Tabs carry the progress","The five step tabs double as progress: each has its own bar and status. One step stays in focus below, so the screen already looks like the review screen the user lands on next.",P2,P2,""),
 ("P3","Pipeline","Sources on the left, the agent in the middle, the five steps on the right, joined by lines. Steps light up as the agent finishes them. No boxes at all, only icons, text and lines.",P3,P3,"")]
frames={k:p() for k,n,d,p,r,s in OPTS}
import json
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Processing options</title><style>{CSS}
body{{padding:32px 24px 80px}}.wrap{{max-width:1560px;margin:0 auto}}
h2.t{{font-size:30px;letter-spacing:-.03em;margin:6px 0 8px}}.lead{{color:var(--muted);font-size:17px;max-width:900px;margin-bottom:34px}}
.opt{{margin-bottom:44px}}.oh{{display:flex;align-items:baseline;gap:16px;margin-bottom:6px}}.oh b{{font-size:26px;letter-spacing:-.02em}}.oh span{{background:#1d2b64;color:#fff;font:700 13px/1 Inter;padding:6px 10px;border-radius:8px}}
.od{{color:var(--ink2);font-size:16px;max-width:1000px;margin-bottom:16px}}.fw{{position:relative;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px #d6def0,0 24px 50px -30px rgba(30,60,160,.5);cursor:zoom-in;background:#fff}}
.lb{{position:fixed;inset:0;background:rgba(10,16,40,.82);display:none;place-items:center;z-index:50;cursor:zoom-out}}.lb.on{{display:grid}}
</style></head><body>{SYM}<div class="wrap"><h2 class="t">Agent processing options</h2><div class="lead">All three use the C2 shell (blue console on the left, open surface on the right). P1 is the lanes style from your picture. Click a picture to enlarge it.</div>'''
for k,n,d,p,r,s in OPTS:
    page+=f'<div class="opt"><div class="oh"><span>{k}</span><b>{n}</b></div><div class="od">{d}</div><div class="fw" data-f="{k}"></div></div>'
page+='</div><div class="lb" id="lb"></div><script>var F='+json.dumps(frames)+''';
function fit(){var w=Math.min(1100,document.querySelector('.wrap').clientWidth);var s=w/1440;document.querySelectorAll('.fw[data-f]').forEach(function(e){e.style.width=1440*s+'px';e.style.height=900*s+'px';e.innerHTML=F[e.dataset.f];e.firstChild.style.transform='scale('+s+')';e.firstChild.style.transformOrigin='0 0';});}
fit();addEventListener('resize',fit);
var lb=document.getElementById('lb');document.addEventListener('click',function(e){var t=e.target.closest('.fw[data-f]');if(t&&!lb.classList.contains('on')){var s=Math.min((innerWidth-40)/1440,(innerHeight-40)/900);lb.innerHTML='<div class="fw" style="width:'+1440*s+'px;height:'+900*s+'px">'+F[t.dataset.f]+'</div>';lb.firstChild.firstChild.style.transform='scale('+s+')';lb.firstChild.firstChild.style.transformOrigin='0 0';lb.classList.add('on');}else if(lb.classList.contains('on')){lb.classList.remove('on');}});
</script></body></html>'''
open('processing-options.html','w').write(page)
for key,html in frames.items():
    open(f'/tmp/frame-{key}.html','w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS} body{{margin:0}}</style></head><body>{SYM}{html}</body></html>')
print('ok')
