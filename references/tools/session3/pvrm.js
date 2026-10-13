// usage: node pv.js tag "set:sum-2=a,prev:sum-2,wait:1500,shot:name,click:#sel,eval:js"
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const OUT='/tmp/shots';
const W=+(process.env.W||1280),H=+(process.env.H||820);
(async()=>{
const tag=process.argv[2], steps=process.argv[3].split(process.argv[3].includes('|')?'|':',');
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H},reducedMotion:"reduce"});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',r=>errs.push('FAIL '+r.url().slice(0,120)));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
await p.goto('file:///home/user/AgenticSetup/agentic-setup-telemetry-opus.html');
for(let i=0;i<60;i++){await p.waitForTimeout(500); if(await p.$('#opVpBtn'))break;}
await p.waitForTimeout(1500);
for(const st of steps){
  const [k,...r]=st.split(':');const a=r.join(':');
  if(k==='set'){const [id,v]=a.split('=');await p.evaluate(([id,v])=>{const b=document.getElementById('opVpBtn');document.getElementById('opVp').hidden&&b.click();document.querySelector(`[data-op-set="${id}"][data-op-v="${v}"]`).click();b.click();},[id,v]);}
  else if(k==='prev'){await p.evaluate((id)=>{const b=document.getElementById('opVpBtn');document.getElementById('opVp').hidden&&b.click();document.querySelector(`[data-op-prev="${id}"]`).click();},a);}
  else if(k==='wait'){await p.waitForTimeout(+a);}
  else if(k==='shot'){await p.screenshot({path:`${OUT}/${tag}-${a}.png`});console.log('shot',a);}
  else if(k==='click'){await p.evaluate((s)=>document.querySelector(s).click(),a);}
  else if(k==='eval'){console.log('eval',JSON.stringify(await p.evaluate(a)));}
  else if(k==='panel'){await p.click('#opVpBtn');}
}
console.log('errors',errs);
await b.close();})();
