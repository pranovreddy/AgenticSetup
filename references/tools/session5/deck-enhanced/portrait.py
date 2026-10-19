import re,sys
d=open('/tmp/bd/loader_doc.html').read()
def rep(a,b,count=1):
    global d
    n=d.count(a)
    assert n==count,(n,count,a[:90])
    d=d.replace(a,b)

# ---- global: a portrait stage, 360 x 410 ----
rep("const W = 720; let H = 360;","const W = 360; let H = 410;")
rep("if (EMBED_ID === 'brand') { H = 460; document.documentElement.classList.add('tall'); }","")
CSS = """
/* portrait stage */
.stage{width:360px!important;height:410px!important}
.stage-wrap{aspect-ratio:360/410!important;max-height:none!important;min-height:0!important}
.wires,.dust,.radar,.sunburst,.bring{width:360px!important;height:410px!important}
.ksn{width:60px!important;text-align:center!important;margin-left:0}
"""
i=d.index('</style>'); d=d[:i]+CSS+d[i:]

# ---- KYC + Brand: sources in a row on top, the agent under them, the result card below ----
rep("const QY = [48, 100, 152, 204, 256];","const QY = [34, 34, 34, 34, 34]; const QXS = [36, 108, 180, 252, 324];",2)
rep("const BX = 300, BY = 148, QX = 166;","const BX = 180, BY = 108, QX = 36;")
rep("const BX = 236, BY = 152, QX = 96;","const BX = 180, BY = 120, QX = 36;")
rep("style=\"left:${QX - 32}px;top:${QY[0] - 32}px","style=\"left:${QXS[0] - 32}px;top:${QY[0] - 32}px",2)
rep("nd(s, QX, QY[i], {","nd(s, QXS[i], QY[i], {",2)
rep("style=\"left:${QX + 26}px;top:${QY[i] - 9}px\"","style=\"left:${QXS[i] - 30}px;top:${QY[i] + 22}px\"",2)
rep("bay.style.translate = `0 ${QY[si] - QY[0]}px`;","bay.style.translate = `${QXS[si] - QXS[0]}px 0`;",2)
rep('style="left:416px;top:24px;width:280px;height:296px;padding:14px 16px"','style="left:12px;top:184px;width:336px;height:218px;padding:10px 14px"')
rep('style="left:326px;top:36px;width:380px;height:250px"','style="left:12px;top:190px;width:336px;height:212px"')
BR = """
.hbrs{display:flex!important;flex-direction:column;gap:6px!important;margin-top:8px!important}
.hbr{min-height:0!important;display:flex;align-items:center;gap:10px;padding:7px 10px!important}
.hbr-h{border-bottom:0!important;padding-bottom:0!important;min-width:78px;flex:none}
.hent{padding:10px!important}.hent-h{height:20px!important}.hbrs{margin-top:4px!important}
.hlob{height:20px!important;line-height:20px!important;font-size:9.5px!important;padding:0 6px!important}
.hbr{padding:6px 8px!important}
.hlobs{flex-direction:row!important;flex-wrap:wrap;margin-top:0!important;gap:5px!important}
"""
i=d.index('</style>'); d=d[:i]+BR+d[i:]

# ---- TEAM ----
rep("const BX = 300, BY = 150, CX = 20, CY = 66, CH = 50;","const BX = 180, BY = 100, CX = 12, CY = 166, CH = 50;")
rep("nd('database', CX + 78, 32, { s: 42, k: 'reg', cls: 'tm-reg' })","nd('database', 180, 32, { s: 42, k: 'reg', cls: 'tm-reg' })")
rep('style="left:${CX + 78 + 28}px;top:23px">DLT platform','style="left:${180 + 28}px;top:23px">DLT platform')
rep('style="left:${CX}px;top:${CY + 4 * CH + 6}px">People on record','style="left:12px;top:272px">People on record')
rep('id="tmL3" style="left:420px;top:30px"','id="tmL3" style="left:196px;top:272px"')
rep('style="left:${CX}px;top:${CY + i * CH}px">\n          <span class="tm-av">','style="left:${CX + (i % 2) * 180}px;top:${CY + Math.floor(i / 2) * CH}px">\n          <span class="tm-av">')
rep('id="tmList" style="left:420px;top:52px"','id="tmList" style="left:12px;top:292px"')
rep("el.loader.dataset.dx = '304'; el.loader.dataset.dy = '278';","el.loader.dataset.dx = '180'; el.loader.dataset.dy = '150';")
TM = """
.tm-lab{display:none!important}
.tm-list{width:336px!important;padding:8px 10px!important;gap:6px!important;box-sizing:border-box}
.tm-rows{flex-direction:row!important;gap:8px!important}
.tm-row{flex:1;min-width:0;height:38px!important}
.tm-row .ls{display:none!important}
.tm-row .tm-mini{margin-left:auto}
"""
i=d.index('</style>'); d=d[:i]+TM+d[i:]

# ---- GTM ----
rep("const BX = 360, BY = 196, CW = 148, CG = 16, CX0 = 40, CY = 16;","const BX = 180, BY = 208, CW = 148, CG = 16, CX0 = 40, CY = 16;")
rep("const cx = i => CX0 + i * (CW + CG);","const cx = i => 20 + (i % 2) * 172; const cyy = i => 10 + Math.floor(i / 2) * 84;")
rep("left:${cx(i) + (CW - 128) / 2}px;top:${CY + 84}px","left:${cx(i) + (CW - 128) / 2}px;top:${cyy(i) + 2}px")
rep("left:${cx(i)}px;top:${CY}px;--c:${p.c}","left:${cx(i)}px;top:${cyy(i)}px;--c:${p.c}")
rep('id="gpAlloc" style="left:28px;top:116px"','id="gpAlloc" style="left:12px;top:268px"')
rep('id="gpSum" style="left:448px;top:124px"','id="gpSum" style="left:184px;top:268px"')
rep("style=\"width:244px;","style=\"width:164px;")
rep("el.loader.dataset.dx = '360'; el.loader.dataset.dy = '276';","el.loader.dataset.dx = '180'; el.loader.dataset.dy = '242';")
GT = """
.gp-panel{width:164px!important;box-sizing:border-box;padding:8px!important;gap:7px!important}
.gp-rate{z-index:3!important}
.gp-legend{display:none!important}
"""
i=d.index('</style>'); d=d[:i]+GT+d[i:]

# ---- MATCH ----
rep("const BX = 300, BY = 128;","const BX = 180, BY = 190;")
rep("nd('layers', 88, 30, { s: 40, k: 'tsrc' })","nd('layers', 67, 30, { s: 40, k: 'tsrc' })")
rep('style="left:22px;top:60px;width:128px;height:268px"','style="left:12px;top:62px;width:110px;height:336px"')
rep("nd('building', 528, 30, { s: 40, k: 'lsrc' })","nd('building', 293, 30, { s: 40, k: 'lsrc' })")
rep("left:458px;top:${60 + j * 48}px","left:238px;top:${64 + j * 68}px")
rep("left:458px;top:${60 + 4 * 48}px","left:238px;top:${64 + 4 * 68}px")
MT = """
.mlane{width:110px!important;box-sizing:border-box}
"""
i=d.index('</style>'); d=d[:i]+MT+d[i:]

# ---- BRAND: placeholders instead of invented names ----
rep('<span class="hn-t">Your enterprise</span>','<span class="hn-t">${sk(92, \'t\')}</span>')
rep('<small>Brand</small>','')
rep('<span class="hn-t">${b.name}</span>','<span class="hn-t">${sk(48, \'t\')}</span>')
rep('<span class="hlob" data-b="${i}" data-j="${j}">${l}</span>','<span class="hlob" data-b="${i}" data-j="${j}" style="width:${52 + ((i + j) % 3) * 14}px"></span>')
i=d.index('</style>'); d=d[:i]+".hlob{min-width:0!important;padding:0!important}.hbr-n .sk{height:8px}\n"+d[i:]

rep('<em class="hent-tag">Enterprise</em>','<em class="hent-tag">${ic(\'layers\')}</em>')
i=d.index('</style>'); d=d[:i]+".hent-tag{display:grid!important;place-items:center;width:24px;height:20px;padding:0!important}.hent-tag svg{width:12px;height:12px}\n"+d[i:]

KF = '''
#gForm .fld-box{height:22px!important}
#gForm .fld-hd{min-height:13px!important}
#gForm .fld-name{font-size:9.5px!important}
#gForm>div[style*=grid]{gap:3px 10px!important}
#gForm .card-h{margin-bottom:6px!important}
'''
i=d.index('</style>'); d=d[:i]+KF+d[i:]
open('/tmp/bd/loader_portrait.html','w').write(d)
print('ok',len(d))
