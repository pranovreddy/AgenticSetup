const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:820}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/AgenticSetup/agentic-setup-sidebar.html');
for(let i=0;i<80;i++){await p.waitForTimeout(1000); if(await p.$('.ag-sec'))break;}
await p.waitForTimeout(3000);
for(let k=0;k<2;k++){await p.evaluate(()=>{const s=document.querySelector('.ag-agree');s.scrollTop=s.scrollHeight});await p.waitForTimeout(800);await p.click('#agAcceptBtn'); await p.waitForTimeout(2500);}
await p.waitForSelector('[data-nextup-go]');await p.screenshot({path:'u0.png'});
await p.click('[data-nextup-go]');
// wait for profile ready
for(let i=0;i<90;i++){await p.waitForTimeout(1000); if(await p.evaluate(()=>{const c=document.querySelector('.kyc-footer input[type=checkbox], .ag-profile input[type=checkbox]');return !!c && !document.querySelector('.ag-loader-frame')}))break;}
await p.waitForTimeout(9000);
console.log('profile',await p.evaluate(()=>[...document.querySelectorAll('.ag-profile button, .kyc-footer button')].map(b=>b.textContent.trim()+'|'+(b.dataset.action||'')).join(' ; ')));
await p.evaluate(()=>{const c=document.querySelector('.kyc-footer input[type=checkbox], .ag-profile input[type=checkbox]');c.click();});
await p.waitForTimeout(600);
await p.evaluate(()=>{const bt=[...document.querySelectorAll('button')].find(b=>/^\s*Submit\s*$/.test(b.textContent));bt&&bt.click()});
let seen=false;
for(let i=0;i<120;i++){await p.waitForTimeout(1500);
  const st=await p.evaluate(()=>({sum:!!document.getElementById('agSummary'),focus:document.querySelector('.ag-step.is-focused')?.dataset.agStep,loader:!!document.querySelector('.ag-loader-frame')}));
  if(st.sum){seen=true;await p.waitForTimeout(1200);await p.screenshot({path:'u1.png'});console.log('summary at',st);break;}
  if(i%10==0)console.log(i,st);
}
console.log(errs);
await b.close();})();
