const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const src=fs.readFileSync('/home/user/AgenticSetup/agentic-setup.html','utf8');
const DOC=JSON.parse(/const AG_LOADER_DOC = ("(?:[^"\\]|\\.)*");/.exec(src)[1]).replace('.embed main{padding:8px 12px 16px}','.embed main{padding:0}');
const ids=(process.argv[2]||'agreements,kyc,team,brand,match,gtm').split(',');
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const out={};
  for(const id of ids){
    const p = await b.newPage({viewport:{width:720,height:id==='brand'?460:360}});
    fs.writeFileSync('fb.html',DOC.replace('__AG_ID__',id).replace('__AG_VI__','0'));
    await p.goto('file:///tmp/claude-0/-home-user-AgenticSetup/149b1330-b27d-5456-b6ad-d083dd017cc9/scratchpad/fb.html');
    let U=[1e9,1e9,-1e9,-1e9];
    for(let i=0;i<34;i++){
      await p.waitForTimeout(400);
      const r=await p.evaluate(()=>{
        const st=document.getElementById('stage').getBoundingClientRect();
        const sc=st.width/720;
        let u=[1e9,1e9,-1e9,-1e9];
        const add=e=>{const b=e.getBoundingClientRect(); if(b.width<3||b.height<3) return; const x0=(b.left-st.left)/sc,y0=(b.top-st.top)/sc,x1=(b.right-st.left)/sc,y1=(b.bottom-st.top)/sc; if(x1-x0>700) return; u=[Math.min(u[0],x0),Math.min(u[1],y0),Math.max(u[2],x1),Math.max(u[3],y1)];};
        document.querySelectorAll('#scene *').forEach(e=>{const c=getComputedStyle(e); if(c.display==='none'||c.visibility==='hidden'||parseFloat(c.opacity)<.15) return; if(e.closest('svg')&&e.tagName!=='svg') return; if(e.tagName==='CANVAS'||e.tagName==='svg') {return;} if(e.className&&/glow|halo|bloom|sheen|spot/.test(String(e.className))) return; add(e);});
        const cp=document.querySelector('.copy'); if(cp){const pill=cp.querySelector('.status'); if(pill) add(pill);}
        return u;});
      U=[Math.min(U[0],r[0]),Math.min(U[1],r[1]),Math.max(U[2],r[2]),Math.max(U[3],r[3])];
    }
    out[id]=U.map(Math.round); console.log(id,JSON.stringify(out[id]));
    await p.close();
  }
  await b.close();
})();
