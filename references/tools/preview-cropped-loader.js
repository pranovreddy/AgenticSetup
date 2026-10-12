const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const src=fs.readFileSync('/home/user/AgenticSetup/agentic-setup.html','utf8');
const DOC=JSON.parse(/const AG_LOADER_DOC = ("(?:[^"\\]|\\.)*");/.exec(src)[1]);
const BOX={agreements:[5,0,604,350],kyc:[120,3,710,306],team:[6,0,655,340],brand:[14,0,700,440],match:[8,0,613,360],gtm:[14,0,712,340]};
const W=+process.argv[2]||1000,H=+process.argv[3]||650;
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  for(const id of (process.argv[4]||'kyc,team,brand,match,gtm').split(',')){
    const p = await b.newPage({viewport:{width:W,height:H}});
    const [x0,y0,x1,y1]=BOX[id]; const bw=x1-x0,bh=y1-y0;
    const hw=W-196, hh=H-120;
    const s=Math.max(.5,Math.min((hw-64)/bw,(hh-48)/bh,1.5));
    fs.writeFileSync('fh-'+id+'.html',DOC.replace('__AG_ID__',id).replace('__AG_VI__','0'));
    fs.writeFileSync('host-'+id+'.html',`<body style="margin:0;background:#f8fafd"><div style="position:absolute;left:196px;top:100px;width:${hw}px;height:${hh}px;display:flex;align-items:center;justify-content:center"><div style="position:relative;overflow:hidden;width:${Math.round(bw*s)}px;height:${Math.round(bh*s)}px"><iframe src="file:///tmp/claude-0/-home-user-AgenticSetup/149b1330-b27d-5456-b6ad-d083dd017cc9/scratchpad/fh-${id}.html" style="position:absolute;left:0;top:0;border:0;width:720px;height:${id==='brand'?460:360}px;transform-origin:0 0;transform:translate(${-x0*s}px,${-y0*s}px) scale(${s})"></iframe></div></div>`); await p.goto('file:///tmp/claude-0/-home-user-AgenticSetup/149b1330-b27d-5456-b6ad-d083dd017cc9/scratchpad/host-'+id+'.html');
    await p.waitForTimeout(5500); await p.screenshot({path:`h2-${id}-a.png`});
    await p.waitForTimeout(4500); await p.screenshot({path:`h2-${id}-b.png`});
    await p.close();
  }
  await b.close();
})();
