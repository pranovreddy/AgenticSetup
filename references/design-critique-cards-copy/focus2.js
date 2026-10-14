const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file:///home/user/AgenticSetup/agentic-setup-final-approach-cards-copy.html');
for(let i=0;i<120;i++){await p.waitForTimeout(1000);if(await p.$('#agAcceptBtn'))break}
await p.waitForTimeout(1500);
await p.evaluate(()=>window.__opPreview('summary','e0'));await p.waitForTimeout(6000);
const rows=[];let hit=-1;
for(let i=0;i<70;i++){await p.keyboard.press('Tab');await p.waitForTimeout(80);
 const r=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return {none:1};const r=e.getBoundingClientRect();const cs=getComputedStyle(e);let hid=false;for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.visibility==='hidden'||parseFloat(s.opacity)<.05||s.display==='none'){hid=true}}
  const x=Math.min(1439,Math.max(0,r.x+r.width/2)),y=Math.min(899,Math.max(0,r.y+r.height/2));const t=document.elementFromPoint(x,y);const vis=!!t&&(e===t||e.contains(t)||t.contains(e));
  return {txt:(e.innerText||e.getAttribute('aria-label')||e.className||'').toString().replace(/\s+/g,' ').slice(0,28),vis,hid,onscreen:r.bottom>0&&r.top<900&&r.right>0&&r.left<1440}});
 rows.push(r);if(hit<0&&/^\s*Accept/.test(r.txt||'')){hit=i;await p.screenshot({path:'shots/focus_summary_accept.png'})}}
const inv=rows.filter(r=>!r.vis).length;
fs.writeFileSync('data/focus_order_summary_e0.json',JSON.stringify({acceptAtTab:hit,total:rows.length,notVisibleStops:inv,rows},null,1));
console.log('accept at tab',hit,'of',rows.length,'not visible stops',inv);console.log(rows.map(r=>(r.vis?'V ':'- ')+r.txt).join('\n'));
await b.close()})();
