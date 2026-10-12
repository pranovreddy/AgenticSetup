const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage({viewport:{width:1280,height:820}});
  p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('file:///home/user/AgenticSetup/agentic-setup-sidebar.html');
  for(let i=0;i<80;i++){await p.waitForTimeout(1000); if(await p.$('.ag-sec'))break;}
  await p.waitForTimeout(6000);
  for(let k=0;k<2;k++){
    await p.evaluate(()=>{const s=document.querySelector('.ag-agree');s.scrollTop=s.scrollHeight});
    await p.waitForTimeout(800);
    await p.click('#agAcceptBtn'); await p.waitForTimeout(2500);
  }
  await p.screenshot({path:'sd-success.png'});
  for(let i=0;i<40;i++){await p.waitForTimeout(1000); if(await p.$('.ag-loader-frame'))break;}
  await p.waitForTimeout(5000); await p.screenshot({path:'sd-kyc-load.png'});
  for(let i=0;i<40;i++){await p.waitForTimeout(1000); if(!(await p.$('.ag-loader-frame')))break;}
  await p.waitForTimeout(4000); await p.screenshot({path:'sd-profile.png'});
  await b.close();
})();
