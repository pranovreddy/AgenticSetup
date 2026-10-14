const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file:///home/user/AgenticSetup/agentic-setup-final-approach-cards-copy.html');
for(let i=0;i<120;i++){await p.waitForTimeout(1000);if(await p.$('#agAcceptBtn'))break}
await p.waitForTimeout(1500);
await p.evaluate(()=>window.__opPreview('summary','e0'));await p.waitForTimeout(6000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.ag-tel-ico')].map(e=>{const r=e.getBoundingClientRect();const s=e.querySelector('svg');const sc=s&&getComputedStyle(s);let op=1;for(let n=e;n;n=n.parentElement)op*=parseFloat(getComputedStyle(n).opacity);return {cls:e.className,w:Math.round(r.width),svg:s&&Math.round(s.getBoundingClientRect().width),color:getComputedStyle(e).color,svgcolor:sc&&sc.color,stroke:sc&&sc.stroke,effOpacity:+op.toFixed(2),bg:getComputedStyle(e).backgroundColor}}))));
await b.close()})();
