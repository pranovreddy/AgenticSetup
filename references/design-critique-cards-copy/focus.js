const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file:///home/user/AgenticSetup/agentic-setup-final-approach-cards-copy.html');
for(let i=0;i<120;i++){await p.waitForTimeout(1000);if(await p.$('#agAcceptBtn'))break}
await p.waitForTimeout(1500);
await p.evaluate(()=>window.__opPreview('summary','e0'));await p.waitForTimeout(6000);
const rows=[];
await p.mouse.move(5,5);
for(let i=0;i<14;i++){await p.keyboard.press('Tab');await p.waitForTimeout(150);
 const r=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return {tag:e.tagName,cls:(e.className||'').toString().slice(0,40),txt:(e.innerText||e.getAttribute('aria-label')||'').slice(0,30),outline:cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor,shadow:cs.boxShadow.slice(0,80),w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y)}});
 rows.push(r);
 if(r&&/Accept/.test(r.txt)){await p.screenshot({path:'shots/focus_summary_accept.png'})}
 if(r&&/Review/.test(r.txt)&&!fs.existsSync('shots/focus_summary_review.png')){await p.screenshot({path:'shots/focus_summary_review.png'})}
}
fs.writeFileSync('data/focus_summary_e0.json',JSON.stringify(rows,null,1));
// hover on Accept
const a=await p.$('[data-sum-go]');if(a){await a.hover();await p.waitForTimeout(400);await p.screenshot({path:'shots/hover_summary_accept.png'});
 console.log(await p.evaluate(()=>{const e=document.querySelector('[data-sum-go]');const cs=getComputedStyle(e);return cs.backgroundImage.slice(0,80)+' | '+cs.boxShadow.slice(0,60)}))}
console.log(JSON.stringify(rows,null,0).slice(0,1800));
await b.close()})();
