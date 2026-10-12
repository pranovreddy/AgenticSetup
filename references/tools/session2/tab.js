const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:820}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/AgenticSetup/agentic-setup-telemetry.html');
for(let i=0;i<80;i++){await p.waitForTimeout(1000); if(await p.$('.ag-sec'))break;}
await p.waitForTimeout(12000);
for(let k=0;k<2;k++){await p.evaluate(()=>{const s=document.querySelector('.ag-agree');s.scrollTop=s.scrollHeight});await p.waitForTimeout(800);await p.click('#agAcceptBtn'); await p.waitForTimeout(2500);}
await p.waitForSelector('[data-nextup-go]');await p.click('[data-nextup-go]');
const cls=()=>p.evaluate(()=>document.getElementById('agTelPanel')?.className);
await p.waitForTimeout(5000);console.log('working:',await cls());
for(let i=0;i<60;i++){await p.waitForTimeout(1000); if(!(await p.$('.ag-loader-frame')))break;}
await p.waitForTimeout(600);console.log('just done:',await cls());await p.screenshot({path:'m1.png'});
await p.waitForTimeout(4000);console.log('after delay:',await cls());await p.screenshot({path:'m2.png'});
await p.click('.ag-tp-tab');await p.waitForTimeout(1000);console.log('after tab click:',await cls());await p.screenshot({path:'m3.png'});
await p.click('.ag-tp-min');await p.waitForTimeout(1000);console.log('after minimise click:',await cls());await p.screenshot({path:'m4.png'});
await p.click('.ag-tp-tab');await p.waitForTimeout(900);
await p.click('.rt-nav.is-next').catch(e=>console.log('next click failed',e.message.slice(0,60)));await p.waitForTimeout(900);
console.log('after next chevron:',await cls(), await p.evaluate(()=>document.querySelector('.ag-step.is-focused')?.dataset.agStep));
console.log(errs);
await b.close();})();
