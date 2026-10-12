const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const src=fs.readFileSync('/home/user/AgenticSetup/agentic-setup.html','utf8');
const DOC=JSON.parse(/const AG_LOADER_DOC = ("(?:[^"\\]|\\.)*");/.exec(src)[1]);
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  for(const id of (process.argv[2]||'agreements,kyc,team,match,gtm,brand').split(',')){
    const p = await b.newPage({viewport:{width:720,height:id==='brand'?460:360}});
    fs.writeFileSync('al.html',DOC.replace('__AG_ID__',id).replace('__AG_VI__','0'));
    await p.goto('file:///tmp/claude-0/-home-user-AgenticSetup/149b1330-b27d-5456-b6ad-d083dd017cc9/scratchpad/al.html');
    const res=[];
    for(let i=0;i<30;i++){
      await p.waitForTimeout(400);
      res.push(await p.evaluate(()=>{
        const st=document.getElementById('stage').getBoundingClientRect(); const sc=st.width/720;
        const core=document.getElementById('core'); if(!core) return null;
        const cr=core.getBoundingClientRect(); const cx=(cr.left+cr.width/2-st.left)/sc, cy=(cr.top+cr.height/2-st.top)/sc;
        const L=[1e9,-1e9],R=[1e9,-1e9];
        document.querySelectorAll('#scene *').forEach(e=>{
          if(e.closest('#core')||e.id==='core') return;
          const c=getComputedStyle(e); if(c.display==='none'||parseFloat(c.opacity)<.3) return;
          if(!/(card|ag-sum|ag-doc|lane|pdoc|tchip|nd\b|kdoc|bcol|gp-|tm-|mlane|tcard)/.test(String(e.className))) return;
          const b=e.getBoundingClientRect(); if(b.width<30||b.height<20||b.width>400) return;
          const x=(b.left+b.width/2-st.left)/sc, y0=(b.top-st.top)/sc, y1=(b.bottom-st.top)/sc;
          const t=x>cx?R:L; t[0]=Math.min(t[0],y0); t[1]=Math.max(t[1],y1);
        });
        return {cx:Math.round(cx),cy:Math.round(cy),L:L.map(Math.round),R:R.map(Math.round)};
      }));
    }
    const last=res.filter(Boolean).slice(-8)[0]; console.log(id,JSON.stringify(last)); await p.close();
  }
  await b.close();
})();
