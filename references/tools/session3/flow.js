const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const OUT=process.env.OUT||'/tmp/shots';
const FILE=process.env.FILE||'agentic-setup-telemetry-opus.html';
const W=+(process.env.W||1280),H=+(process.env.H||820);
const P=process.env.P||'a';
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
const t0=Date.now();const T=()=>((Date.now()-t0)/1000).toFixed(1);
const shot=async(n)=>{await p.screenshot({path:`${OUT}/${P}-${n}.png`});console.log(T(),'shot',n);};
await p.goto('file:///home/user/AgenticSetup/'+FILE);
for(let i=0;i<80;i++){await p.waitForTimeout(1000); if(await p.$('#agAcceptBtn') && await p.evaluate(()=>{const b=document.getElementById('agBoot');return !b||getComputedStyle(b).display==='none'||getComputedStyle(b).opacity==='0'||b.hidden}))break;}
await p.waitForTimeout(2500);await shot('00-gate');
for(let k=0;k<2;k++){await p.evaluate(()=>{const s=document.querySelector('.ag-agree');s.scrollTop=s.scrollHeight});await p.waitForTimeout(800);await p.click('#agAcceptBtn'); await p.waitForTimeout(2500);}
await p.waitForSelector('[data-nextup-go]');await p.waitForTimeout(800);await shot('01-nextup');
await p.click('[data-nextup-go]');
const loaderShots=async(tag)=>{ // capture loader early/mid/late
  for(let i=0;i<60;i++){await p.waitForTimeout(500); if(await p.$('.ag-loader-frame'))break;}
  await p.waitForTimeout(2500);await shot(tag+'-l1');
  await p.waitForTimeout(4000);await shot(tag+'-l2');
  await p.waitForTimeout(4000);await shot(tag+'-l3');
};
await loaderShots('02-kyc');
for(let i=0;i<90;i++){await p.waitForTimeout(1000); if(await p.evaluate(()=>{const c=document.querySelector('.kyc-footer input[type=checkbox], .ag-profile input[type=checkbox]');return !!c && !document.querySelector('.ag-loader-frame')}))break;}
for(let i=0;i<60;i++){await p.waitForTimeout(1000); if(await p.evaluate(()=>{const w=[...document.querySelectorAll('input')].find(x=>x.placeholder==='Enter website URL');const bt=[...document.querySelectorAll('button')].find(b=>/^\s*Submit\s*$/.test(b.textContent));return w&&w.value&&bt&&!bt.disabled&&getComputedStyle(bt).opacity>0.9}))break;}
await p.waitForTimeout(2500);await shot('03-profile');
await p.evaluate(()=>{const c=document.querySelector('.kyc-footer input[type=checkbox], .ag-profile input[type=checkbox]');c.click();});
await p.waitForTimeout(600);
await p.evaluate(()=>{const bt=[...document.querySelectorAll('button')].find(b=>/^\s*Submit\s*$/.test(b.textContent));bt&&bt.click()});
await p.waitForTimeout(700);await shot('03b-after-submit');
for(const tag of ['04-team','05-brand','06-gtm','07-match']){
  await loaderShots(tag);
  for(let i=0;i<120;i++){await p.waitForTimeout(500); if(await p.$('#agSummary [data-sum-go]'))break;}
  await p.waitForTimeout(1500);await shot(tag+'-sum');
  if(tag==='05-brand'){
    await p.click('[data-sum-details]');await p.waitForTimeout(1000);await shot(tag+'-details');
    const ts=Date.now();for(let i=0;i<80;i++){await p.waitForTimeout(100); if(await p.$('#agSumReopen'))break;}
    console.log('reopen pill after ms',Date.now()-ts);await p.waitForTimeout(500);await shot(tag+'-details2');
    await p.click('#agSumReopen');await p.waitForTimeout(1200);await shot(tag+'-back');
  }
  await p.click('#agSummary [data-sum-go]');await p.waitForTimeout(900);await shot(tag+'-success');
}
for(let i=0;i<60;i++){await p.waitForTimeout(1000); if(!await p.$('#agSummary') && !await p.$('.ag-loader-frame'))break;}
await p.waitForTimeout(2500);await shot('08-kickoff');
console.log('errors',errs);
await b.close();})();
