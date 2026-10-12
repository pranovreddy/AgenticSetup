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
await p.waitForTimeout(4500);await p.screenshot({path:'ld1.png'});
await p.click('.ag-ldet-btn');await p.waitForTimeout(900);await p.screenshot({path:'ld2.png'});
console.log(errs);await b.close();})();
