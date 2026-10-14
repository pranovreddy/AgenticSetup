// Capture + measure driver. Usage: node capture.js <stateId>...   (writes shots/ and data/)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const FILE=process.env.FILE||'file:///home/user/AgenticSetup/agentic-setup-final-approach-cards-copy.html';
const OUT=process.env.OUT||__dirname;
const measure=()=>{
  const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
  const parse=s=>{const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return [p[0],p[1],p[2],p.length>3?p[3]:1]};
  const comp=(fg,bg)=>{const a=fg[3];return [fg[0]*a+bg[0]*(1-a),fg[1]*a+bg[1]*(1-a),fg[2]*a+bg[2]*(1-a),1]};
  const bgOf=el=>{let approx=false;const stack=[];for(let e=el;e;e=e.parentElement){const cs=getComputedStyle(e);if(cs.backgroundImage&&cs.backgroundImage!=='none')approx=true;const c=parse(cs.backgroundColor);if(c&&c[3]>0){stack.push(c);if(c[3]>=1)break}}
    let base=[255,255,255,1];for(let i=stack.length-1;i>=0;i--)base=comp(stack[i],base);return {c:base,approx}};
  const visible=el=>{const r=el.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)return false;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<.05)return false;
    for(let e=el.parentElement;e;e=e.parentElement){const s=getComputedStyle(e);if(parseFloat(s.opacity)<.05||s.visibility==='hidden')return false}
    const x=Math.min(innerWidth-1,Math.max(0,r.left+r.width/2)),y=Math.min(innerHeight-1,Math.max(0,r.top+r.height/2));const t=document.elementFromPoint(x,y);return !!t&&(el===t||el.contains(t)||t.contains(el))};
  const sizes={},weights={},low=[],small=[],tiny=[],hues=new Set();let texts=0;
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const seen=new Set();
  while(walker.nextNode()){const n=walker.currentNode;const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(!el||seen.has(el))continue;if(['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName))continue;if(!visible(el))continue;seen.add(el);texts++;
    const cs=getComputedStyle(el);const fs=parseFloat(cs.fontSize);const fw=cs.fontWeight;sizes[fs]=(sizes[fs]||0)+1;weights[fw]=(weights[fw]||0)+1;
    if(fs<12)small.push({t:t.slice(0,40),fs});
    const fg=parse(cs.color);if(!fg)continue;const b=bgOf(el);const f=comp(fg,b.c);const L1=lum(f),L2=lum(b.c);const cr=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    const big=fs>=24||(fs>=18.66&&parseInt(fw)>=700);const need=big?3:4.5;
    if(cr<need)low.push({t:t.slice(0,40),fs,fw,cr:+cr.toFixed(2),approx:b.approx});
    const mx=Math.max(f[0],f[1],f[2]),mn=Math.min(f[0],f[1],f[2]);if(mx-mn>40){const d=mx-mn;let h=mx===f[0]?((f[1]-f[2])/d)%6:mx===f[1]?(f[2]-f[0])/d+2:(f[0]-f[1])/d+4;hues.add(Math.round(((h*60+360)%360)/30)*30%360)}}
  const tg=[];document.querySelectorAll('button,a[href],[role=button],input,select,textarea,[tabindex]:not([tabindex="-1"]),[data-action]').forEach(el=>{if(!visible(el))return;const r=el.getBoundingClientRect();if(r.width<24||r.height<24)tg.push({t:(el.innerText||el.getAttribute('aria-label')||el.title||el.className||'').toString().trim().slice(0,30),w:Math.round(r.width),h:Math.round(r.height)})});
  return {texts,sizes,weights,small,low:low.sort((a,b)=>a.cr-b.cr).slice(0,25),lowCount:low.length,smallTargets:tg,hues:[...hues].sort((a,b)=>a-b),fontFamilies:[...new Set([...seen].map(e=>getComputedStyle(e).fontFamily.split(',')[0]))]};
};
const STATES={
 'gate-terms':async p=>{},
 'gate-privacy':async p=>{await p.evaluate(()=>document.querySelector('[data-doc="privacy"]')?.click());await p.waitForTimeout(1500)},
 'nextup':async p=>{await p.evaluate(()=>window.__opPreview('nextup','d'))},
 ...Object.fromEntries(['1','2','e0','e1','e2'].map(k=>['loader-'+k,async p=>{await p.evaluate(k=>window.__opPreview('loader',k),k)}])),
 ...Object.fromEntries(['2','e0','e1','e2'].map(k=>['summary-'+k,async p=>{await p.evaluate(k=>window.__opPreview('summary',k),k)}])),
 ...Object.fromEntries(['2','e0','e1','e2'].map(k=>['summary-open-'+k,async p=>{await p.evaluate(k=>window.__opPreview('summary',k),k);await p.waitForTimeout(5000);await p.evaluate(()=>document.querySelectorAll('.op-facc-h[aria-expanded="false"]').forEach(b=>b.click()))}])),
 ...Object.fromEntries(['2','e0','e1','e2'].map(k=>['details-'+k,async p=>{await p.evaluate(k=>window.__opPreview('details',k),k)}])),
 ...Object.fromEntries(['2','e0','e1','e2'].map(k=>['success-'+k,async p=>{await p.evaluate(k=>window.__opPreview('summary',k),k);await p.waitForTimeout(5000);await p.evaluate(()=>document.querySelector('[data-sum-go]')?.click())}])),
 'success-2-skip':async p=>{await p.evaluate(()=>window.__opPreview('summary','2'));await p.waitForTimeout(5000);await p.evaluate(()=>document.querySelector('[data-sum-skip]')?.click())},
 'success-e2-skip':async p=>{await p.evaluate(()=>window.__opPreview('summary','e2'));await p.waitForTimeout(5000);await p.evaluate(()=>document.querySelector('[data-sum-skip]')?.click())},
};
const SCEN=['happy','locked-team','profile-partial','profile-none','profile-waiting','team-empty','team-later','brands-review','brands-paused','brands-partial','brands-rejected','gtm-norates','tpl-attention','success-pair','kickoff-open','kickoff-closed','mig-notopen','walkthrough-open','walkthrough-soon','return-open','return-unchanged','logout-unsaved','org-finished','review-return','mm-waiting'];
SCEN.forEach(id=>STATES['scen-'+id]=async p=>{await p.evaluate(i=>document.querySelector('[data-id="'+i+'"]')?.click(),id)});
const WAITS={loader:[4,9,16,24,36],nextup:[4,9,16,24],scen:[4,9,16],gate:[3],summary:[5],success:[3,6,10],details:[5,9]};
(async()=>{
 const ids=process.argv.slice(2);
 if(ids[0]==='--list'){console.log(Object.keys(STATES).join(' '));return}
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 for(const id of ids){
  const p=await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(FILE);
  for(let i=0;i<120;i++){await p.waitForTimeout(1000);if(await p.$('#agAcceptBtn'))break}
  await p.waitForTimeout(1500);
  await STATES[id](p);
  const key=id.split('-')[0];const w=WAITS[key==='summary'||key==='success'||key==='details'||key==='scen'||key==='loader'||key==='nextup'||key==='gate'?key:'summary'];
  let t0=0;const times=[];
  for(const t of w){await p.waitForTimeout((t-t0)*1000);t0=t;await p.screenshot({path:`${OUT}/shots/${id}_t${String(t).padStart(2,'0')}.png`});times.push(t)}
  await p.screenshot({path:`${OUT}/shots/${id}_final.png`});
  const m=await p.evaluate(measure);m.errors=errs;m.times=times;
  fs.writeFileSync(`${OUT}/data/${id}.json`,JSON.stringify(m,null,1));
  await p.close();
 }
 await b.close();
})();
