const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const OUT='/tmp/shots';
const X=process.argv[2];
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:820}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/AgenticSetup/agentic-setup-telemetry-opus.html');
await p.waitForTimeout(6000);
await p.click('#opVpBtn');await p.click(`[data-op-exp="${X}"]`);
const t0=Date.now();let last='';let n=0;
while(Date.now()-t0<150000){
  await p.waitForTimeout(700);
  const sc=await p.evaluate(()=>{const s=document.getElementById('agSummary');if(document.getElementById('agNextUp'))return 'nextup';if(s)return (s.dataset.flow==='1'?'success-':'sum-')+s.dataset.key;if(document.querySelector('.ag-step.is-focused .ag-step-ai--loader'))return 'loader-'+document.querySelector('.ag-step.is-focused').dataset.agStep;return 'page-'+document.querySelector('.ag-step.is-focused')?.dataset.agStep;});
  if(sc!==last){last=sc;n++;await p.waitForTimeout(sc.startsWith('loader')?5000:1600);await p.screenshot({path:`${OUT}/X${X}-${n}-${sc}.png`});console.log(((Date.now()-t0)/1000).toFixed(0),sc);
    if(sc.startsWith('sum-')){await p.evaluate(()=>document.querySelector('#agSummary [data-sum-go]').click());}
    if(sc.startsWith('page-m'))break;}
}
console.log('errors',errs);await b.close();})();
