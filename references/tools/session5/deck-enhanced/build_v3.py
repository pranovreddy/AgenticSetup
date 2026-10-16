import re
f='/home/user/AgenticSetup/agentic-setup-deck-3d-glass-rail-tether.html'
s=open(f).read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)>=1, 'missing: '+old[:70]
    s=s.replace(old,new) if cnt==0 else s.replace(old,new,cnt)

# layout: cards low, blob high
rep("yc = H * .325 - H / 2;","yc = H * .76 - H / 2;")
rep('sgEl.style.setProperty("--by", `${H * .685}px`);','sgEl.style.setProperty("--by", `${H * .215}px`);')
# telemetry shows only the current line
rep("while (tlb.children.length > 3) tlb.firstChild.remove();","while (tlb.children.length > 1) tlb.firstChild.remove();")
# sources: soft scatter around the blob, no arcs
a=s.index("  const crx = Math.min(330, st0.width * .24)")
b=s.index("  const items = IG_SRC.map((src, k) => {")
s=s[:a]+'  const POS = [[-270, -78], [-360, 4], [-258, 78], [270, -84], [360, -2], [256, 74]];\n'+s[b:]
rep("const side = k < 3 ? -1 : 1, row = k % 3, t = (row + .5) / 3, [x, y] = cpt(side, t), el = document.createElement(\"div\");","const [dx, dy] = POS[k], x = ox + dx, y = oy + dy, el = document.createElement(\"div\");")
rep('el.className = "s3-src s4-src " + (side < 0 ? "is-l" : "is-r");','el.className = "s3-src s4-src " + (dx < 0 ? "is-l" : "is-r");')
# tether from blob bottom to card top
rep("const x1 = ox, y1 = oy - 104, dy = Math.max(40, y1 - ty), d = `M${x1} ${y1} C ${x1} ${y1 - dy * .55}, ${tx} ${ty + dy * .55}, ${tx} ${ty}`;","const x1 = ox, y1 = oy + 106, dy = Math.max(40, ty - y1), d = `M${x1} ${y1} C ${x1} ${y1 + dy * .55}, ${tx} ${ty - dy * .55}, ${tx} ${ty}`;")
rep("tether(r.x + r.w / 2, r.y + r.h + 6)","tether(r.x + r.w / 2, r.y - 6)")
css=r'''
/* ---- layout: agent on top, telemetry under it, cards below ---- */
.sg-pod,.sg-beam,.s4-arcg,.s4-arc{ display:none!important; }
.sg::before{ content:""; position:absolute; left:50%; top:var(--by); width:1100px; height:620px; margin:-300px 0 0 -550px; border-radius:50%; background:radial-gradient(closest-side,rgba(120,160,255,.30),rgba(150,180,255,.12) 55%,transparent 80%); pointer-events:none; }
.sg::after{ content:""; position:absolute; left:50%; top:calc(var(--by) + 40px); width:1400px; height:700px; margin-left:-700px; background:radial-gradient(closest-side,rgba(190,170,255,.14),transparent 75%); pointer-events:none; }
.sg .tl{ top:calc(var(--by) + 170px)!important; width:540px; margin-left:-270px; padding:10px 18px 11px; border-radius:26px; z-index:5; }
.sg .tl-b{ min-height:24px; margin-top:7px; }
.sg .tl-l{ font-size:15px; } .sg .tl-l b{ color:var(--ink); font-weight:600; }
.sg .tl-h{ justify-content:center; gap:9px; } .sg .tl-h span{ margin-left:0; }
.s4-src{ width:124px; margin-left:-62px; margin-top:-36px; }
.s4-src .s3-ic{ width:66px; height:66px; }
'''
i=s.rindex('</style>',0,s.index('</head>'))
s=s[:i]+css+s[i:]
open(f,'w').write(s); print('ok',len(s))
