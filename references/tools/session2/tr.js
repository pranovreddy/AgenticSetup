const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:820}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/AgenticSetup/agentic-setup-sidebar.html');
for(let i=0;i<80;i++){await p.waitForTimeout(1000); if(await p.$('.ag-sec'))break;}
await p.waitForTimeout(12000);
for(let k=0;k<2;k++){await p.evaluate(()=>{const s=document.querySelector('.ag-agree');s.scrollTop=s.scrollHeight});await p.waitForTimeout(800);await p.click('#agAcceptBtn'); await p.waitForTimeout(2500);}
await p.waitForSelector('[data-nextup-go]');await p.click('[data-nextup-go]');
for(let i=0;i<90;i++){await p.waitForTimeout(1000); if(await p.evaluate(()=>!!document.querySelector('.ag-profile input[type=checkbox]')&&!document.querySelector('.ag-loader-frame')))break;}
await p.waitForTimeout(9000);
await p.evaluate(()=>document.querySelector('.ag-profile input[type=checkbox]').click());await p.waitForTimeout(600);
await p.evaluate(()=>[...document.querySelectorAll('button')].find(b=>/^\s*Submit\s*$/.test(b.textContent))?.click());
const done=new Set();
for(let i=0;i<500&&done.size<4;i++){await p.waitForTimeout(1500);
  const k=await p.evaluate(()=>document.getElementById('agSummary')?.dataset.key);
  if(k&&!done.has(k)){done.add(k);await p.waitForTimeout(2500);await p.screenshot({path:`t_${k}.png`});console.log('shot',k);
    await p.click('[data-sum-go]');await p.waitForTimeout(1200);
    if(k==='2') await p.evaluate(()=>document.querySelector('[data-action="ag-send-invites"]')?.click());
    else if(k==='e0') await p.evaluate(()=>{const bt=[...document.querySelectorAll('.ag-actions button')].find(x=>/Confirm/.test(x.textContent));bt&&bt.click()});
    else if(k==='e1') await p.evaluate(()=>{document.querySelectorAll('input[type=checkbox]').forEach(c=>{if(!c.checked&&c.offsetParent)c.click()});setTimeout(()=>{const bt=[...document.querySelectorAll('.ag-actions button')].find(x=>/Confirm|Accept/.test(x.textContent));bt&&bt.click()},500)});
    else if(k==='e2') await p.evaluate(()=>{const bt=[...document.querySelectorAll('.ag-actions button')].find(x=>/Confirm|Continue/.test(x.textContent));bt&&bt.click()});
  }
  const auto=await p.$('[data-action="ag-auto-now"]'); if(auto){try{await auto.click({timeout:800})}catch(e){}}
}
console.log([...done],errs);
await b.close();})();
