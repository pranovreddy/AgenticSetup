// Content block position per screen type at 1440x900
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const ids=['profile-waiting','profile-none','brands-review','brands-partial','tpl-attention','gtm-norates','team-empty','team-later','success-pair','kickoff-open','happy'];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
for(const id of ids){const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file:///home/user/AgenticSetup/agentic-setup-final-approach-cards-copy.html');
for(let i=0;i<120;i++){await p.waitForTimeout(1000);if(await p.$('#agAcceptBtn'))break}
await p.waitForTimeout(1500);
await p.evaluate(i=>document.querySelector('[data-id="'+i+'"]')?.click(),id);await p.waitForTimeout(6500);
const r=await p.evaluate(()=>{const sels=['.ag-outcome','.op-done','.ag-success','.ag-finale','#agSummary .op-wrap','.op-wrap'];for(const s of sels){const e=[...document.querySelectorAll(s)].find(x=>x.getBoundingClientRect().height>40&&getComputedStyle(x).visibility!=='hidden');if(e){const r=e.getBoundingClientRect();return {sel:s,top:Math.round(r.top),bottom:Math.round(r.bottom),left:Math.round(r.left),right:Math.round(r.right),h:Math.round(r.height)}}}return null});
console.log(id,JSON.stringify(r));await p.close()}
await b.close()})();
