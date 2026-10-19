const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
(async()=>{const ids=process.argv.slice(2);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const html=fs.readFileSync('/tmp/bd/loader_portrait.html','utf8');
for(const id of ids){
 const p=await b.newPage({viewport:{width:360,height:410},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.route('**/fonts.g*/**',r=>r.abort());
 await p.setContent(html.replace('__AG_ID__',id).replace('__AG_VI__','0'));
 for(const t of [1500,3000,3000,3000]){await p.waitForTimeout(t);const n=await p.evaluate(()=>1);}
 // sequential screenshots
 await p.close();
 const p2=await b.newPage({viewport:{width:360,height:410},deviceScaleFactor:1});
 await p2.route('**/fonts.g*/**',r=>r.abort());
 await p2.setContent(html.replace('__AG_ID__',id).replace('__AG_VI__','0'));
 let k=0;for(const t of [1800,2400,2400,2400,2400]){await p2.waitForTimeout(t);await p2.screenshot({path:`/tmp/bd/portrait/${id}_${k++}.png`});}
 console.log(id,errs.slice(0,3));await p2.close();}
await b.close()})();
