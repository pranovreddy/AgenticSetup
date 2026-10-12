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
const seen=new Set();
for(let i=0;i<600&&seen.size<4;i++){await p.waitForTimeout(1500);
  const k=await p.evaluate(()=>{const e=document.getElementById('agSummary');return e&&e.dataset.leaving!=='1'?e.dataset.key:null});
  if(k&&!seen.has(k)){seen.add(k);await p.waitForTimeout(2200);await p.screenshot({path:`c_${k}.png`});console.log('shot',k);
    const sel=(k==='2'||k==='e2')?'[data-sum-skip]':'[data-sum-go]';
    await p.click(sel);await p.waitForTimeout(1800);await p.screenshot({path:`c_${k}_after.png`});console.log('clicked',sel,k);
  }
  const auto=await p.$('[data-action="ag-auto-now"]'); if(auto){try{await auto.click({timeout:800})}catch(e){}}
}
console.log('done',[...seen],errs);
await b.close();})();
