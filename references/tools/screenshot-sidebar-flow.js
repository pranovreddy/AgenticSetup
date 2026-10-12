const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage({viewport:{width:1280,height:820}});
  p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('file:///home/user/AgenticSetup/agentic-setup-sidebar.html');
  for(let i=0;i<70;i++){await p.waitForTimeout(1000); if(await p.$('.ag-loader-frame'))break;}
  await p.waitForTimeout(4500); await p.screenshot({path:'w-work.png'});
  for(let i=0;i<30;i++){await p.waitForTimeout(1000); if(!(await p.$('.ag-loader-frame')))break;}
  await p.waitForTimeout(2500); await p.screenshot({path:'w-ready.png'});
  await b.close();
})();
