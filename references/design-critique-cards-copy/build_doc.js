const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,ImageRun,HeadingLevel,AlignmentType,PageBreak,LevelFormat,Footer,PageNumber}=require('docx');
const sizeOf=p=>{const b=fs.readFileSync(p);return {w:b.readUInt32BE(16),h:b.readUInt32BE(20)}};
const FONT='Calibri';
const P=(t,o={})=>new Paragraph({spacing:{after:o.after??120,before:o.before??0,line:300},alignment:o.align,keepNext:o.keepNext,children:(Array.isArray(t)?t:[t]).map(x=>typeof x==='string'?new TextRun({text:x,font:FONT,size:o.size??22,bold:o.bold,italics:o.italics,color:o.color}):x)});
const B=(l,t)=>new TextRun({text:l,bold:true,font:FONT,size:22});
const H1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:160},children:[new TextRun({text:t,font:FONT,size:32,bold:true,color:'1F3A8A'})]});
const H2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:300,after:120},keepNext:true,children:[new TextRun({text:t,font:FONT,size:26,bold:true,color:'1E293B'})]});
const bullet=t=>new Paragraph({numbering:{reference:'b',level:0},spacing:{after:80,line:290},children:(Array.isArray(t)?t:[t]).map(x=>typeof x==='string'?new TextRun({text:x,font:FONT,size:22}):x)});
const bd={style:BorderStyle.SINGLE,size:4,color:'CBD5E1'};const borders={top:bd,bottom:bd,left:bd,right:bd};
const cell=(t,w,o={})=>new TableCell({width:{size:w,type:WidthType.DXA},borders,margins:{top:60,bottom:60,left:100,right:100},shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR,color:'auto'}:undefined,children:(Array.isArray(t)?t:[t]).map(x=>new Paragraph({spacing:{after:40,line:260},children:[new TextRun({text:String(x),font:FONT,size:o.size??19,bold:o.bold,color:o.color})]}))});
const table=(cols,head,rows,o={})=>new Table({width:{size:cols.reduce((a,b)=>a+b,0),type:WidthType.DXA},columnWidths:cols,rows:[new TableRow({tableHeader:true,children:head.map((h,i)=>cell(h,cols[i],{fill:'E0E7FF',bold:true}))}),...rows.map(r=>new TableRow({cantSplit:true,children:r.map((c,i)=>cell(c,cols[i],{size:o.size}))}))]});
const img=(file,maxW=560)=>{const p='evidence/'+file;const s=sizeOf(p);let w=Math.min(maxW,s.w);let h=Math.round(s.h*w/s.w);if(h>340){w=Math.round(w*340/h);h=340}return new Paragraph({spacing:{after:80},keepNext:true,children:[new ImageRun({type:'png',data:fs.readFileSync(p),transformation:{width:w,height:h},altText:{title:file,description:file,name:file}})]})};
const cap=t=>P(t,{size:18,italics:true,color:'475569',after:160});

// ---- data
const data={};for(const f of fs.readdirSync('data'))if(f.endsWith('.json')&&!f.startsWith('focus'))data[f.slice(0,-5)]=JSON.parse(fs.readFileSync('data/'+f));
const sizes={},weights={};let tot=0;for(const d of Object.values(data)){tot+=d.texts;for(const[k,v]of Object.entries(d.sizes))sizes[k]=(sizes[k]||0)+v;for(const[k,v]of Object.entries(d.weights))weights[k]=(weights[k]||0)+v}
const sizeRows=Object.entries(sizes).sort((a,b)=>a[0]-b[0]).map(([k,v])=>[k+' px',v]);
const wRows=Object.entries(weights).sort((a,b)=>a[0]-b[0]).map(([k,v])=>[k,v]);

const F=[
{id:'S-01',t:'Type scale has 22 sizes, 13 weights and 5 font families',pr:'High',ef:'Medium',
 obs:`Across the ${Object.keys(data).length} captured states, ${Object.keys(sizes).length} distinct font sizes are in use, from 12 px to 40 px, with many half-pixel steps (12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17). A single screen uses up to 11 sizes (Templates summary). 13 distinct font weights appear (400 to 700, including 550, 560, 580, 620, 630, 640, 660, 680). Five font families appear: Geist, Inter, Geist Mono, JetBrains Mono and ui-monospace. The tables in the appendix list every value and its element count.`,
 ev:['ev_summary_e1.png'],evc:'Summary screen for GTM partners. Measured on this screen: 9 distinct sizes. The full counts are in the appendix tables.',
 pri:'Gestalt similarity (things that look alike read as alike); type-scale and token practice in Material 3, Carbon and Primer, which use a small fixed set of steps (roughly 8 to 10) and 3 or 4 weights. Nielsen heuristic 4 (consistency and standards).',
 dir:'Option: define one type scale of about 8 steps (for example 12, 14, 16, 20, 24, 32, 40) and 3 weights (400, 500 or 600, 700), map the existing values to the nearest step, and keep one sans and one mono family.'},
{id:'S-02',t:'Most supporting text sits at the 12 px floor',pr:'Medium',ef:'Medium',
 obs:`Of ${tot} text elements measured across all states, 689 (39%) are 12 px and 1,351 (76%) are 13.5 px or smaller. Labels, chips, scrubbing rates, reasons, accordion content and status text all share this range. The file also runs a script (opA11yPass) that raises any text under 12 px to 12 px at runtime, so the stylesheet itself may contain smaller values.`,
 ev:['ev_templates_cards.png'],evc:'Template cards: counts, labels and captions are 12 to 13 px.',
 pri:'Hierarchy and readability (Refactoring UI: size and weight carry hierarchy; too many items at one small size flatten it). Material 3 and Carbon keep 12 px for captions and helper text and use 14 px for body.',
 dir:'Option: lift body-level supporting text (reasons, descriptions, scrubbing row) to 14 px and keep 12 px for true captions only. Check that cards still fit.'},
{id:'S-03',t:'Status text falls below 4.5 to 1 contrast',pr:'Medium',ef:'Low',
 obs:'Amber status text "2 of 3 approved", "2 of 4 approved" and "Needs attention" (12.5 px) measures 4.02 to 1. Green "Approved" and "Active" (12 px) measure 4.31 to 1. Both are below the 4.5 to 1 needed for text under 18 px. White labels on the blue buttons were flagged by the script (1.05 to 1) but are false positives from the gradient background and read correctly by eye. Contrast over gradients uses the nearest solid background and is approximate.',
 ev:['ev_status_text.png'],evc:'Status text beside the eyebrow chip on the "Not approved yet" screen, enlarged 2.5 times.',
 pri:'WCAG 2.2 success criterion 1.4.3 (contrast minimum, 4.5 to 1 for normal text).',
 dir:'Option: darken the amber to about #92400E and the green to about #166534 for text, and keep the lighter tones for dots and fills.'},
{id:'S-04',t:'Status screens place content in the top third and leave about two thirds empty',pr:'High',ef:'Low',
 obs:'On the in-review, partly approved, none approved, no rate cards and templates attention screens, the content block (chips, title, sub, button) ends near y = 330 px of 900 px at 1440 by 900. The kick-off and success screens centre their content vertically. The remaining screen below the button is empty.',
 ev:['ev_status_profile_none.png','ev_status_gtm.png'],evc:'Two status screens at 1440 by 900. The red box marks where the content ends.',
 pri:'Gestalt figure and ground and balanced composition; Nielsen heuristic 4 (consistency), because other end states are centred.',
 dir:'Option: centre the block vertically as on the success screens, or anchor it at a fixed optical centre (about 40% from the top) on all end states.'},
{id:'S-05',t:'The primary action on summaries sits far from the content it confirms',pr:'Medium',ef:'Low',
 obs:'On summary screens, Accept sits in the bottom-right corner and the Review link in the bottom-left of the content column, while the title, sub and cards are at the top. The distance from the summary title to Accept is about 600 px at 1440 by 900. The countdown pill sits in the same band at the left.',
 ev:['ev_summary_e1.png'],evc:'GTM partners summary at 1440 by 900.',
 pri:'Fitts\'s law (time to reach a target grows with distance and falls with size); Gestalt proximity (an action near the thing it acts on reads as related).',
 dir:'Option: keep the action bar but dock it directly under the card grid when the grid is short, and fix it to the bottom only when the grid scrolls.'},
{id:'S-06',t:'Template count labels were truncated in the captured build',pr:'Medium',ef:'Low',
 obs:'In the captured build, the three counts on each template card read "SUGGESTED", "HIGH CONFIDENC" (cut off) and "NEED REVIEW". The tiles were about 95 px wide and the labels are uppercase 12 px. This was fixed during the review session after the captures (icons added, labels allowed to wrap). The evidence image shows the state at capture.',
 ev:['ev_templates_cards.png'],evc:'Template cards at capture time: the middle label is clipped.',
 pri:'Nielsen heuristic 1 (visibility of system status) and 8 (aesthetic and minimalist design): clipped labels read as errors.',
 dir:'Status: already adapted in the file (icon above, label wraps). Option: confirm the wrapped labels at narrower widths.'},
{id:'S-07',t:'GTM partner cards carry a lot of data per card',pr:'Medium',ef:'Medium',
 obs:'Each of the 4 cards shows a name, a status, a reason, three phase tiles (rate, plus share for selected partners) and a scrubbing row with three rates. That is up to 14 data points per card and about 50 on the screen. Comparing one phase across partners means reading across two rows of two cards.',
 ev:['ev_summary_e1.png'],evc:'GTM partners summary, selected partners first, then not selected.',
 pri:'Hick\'s law (more items, slower decisions); Gestalt proximity and common region (data to be compared should align); Refactoring UI (reduce what competes for attention).',
 dir:'Option: one column per phase aligned across partner rows so a phase can be scanned vertically, with the reason as the only sentence per partner. Cards can stay for the selected pair.'},
{id:'S-08',t:'The lowest rate is shown by colour alone',pr:'Medium',ef:'Low',
 obs:'On GTM cards the lowest rate in each phase is blue and bold inside a tinted tile. The explanatory note that said "Blue is the lowest rate" is no longer on the screen. Viewers who cannot tell the blue from the dark text, or who print the page, get no other signal.',
 ev:['ev_summary_e1.png'],evc:'GTM cards. The lowest rates are blue.',
 pri:'WCAG 2.2 success criterion 1.4.1 (use of colour): colour must not be the only way to convey information.',
 dir:'Option: add a small "Lowest" tag or a check icon next to the lowest rate, and keep the blue as reinforcement.'},
{id:'S-09',t:'Accordions look like plain text and hide the consequence of Accept',pr:'Medium',ef:'Low',
 obs:'The left column holds three collapsed rows: What was checked, Sources and What happens next. They have a 12 px grey chevron and no border or fill until hover. "What happens next" describes what Accept does, and it is collapsed by default.',
 ev:['ev_summary_e1.png'],evc:'The three rows sit under the summary sub.',
 pri:'Norman on signifiers (a control should show that it can be operated); Nielsen heuristic 5 (error prevention) and 1 (visibility of system status).',
 dir:'Option: open "What happens next" by default, and give all three rows a hairline divider and a visible chevron so they read as controls.'},
{id:'S-10',t:'Pending steps in the left rail are faint and have no labels',pr:'Medium',ef:'Low',
 obs:'Upcoming step icons are 14 px, colour #7D8FB3, shown at 0.75 opacity inside a 32 px button. Against the button fill this gives about 2.3 to 1 (the icon colour alone is 3.2 to 1). The rail is icon-only: step names appear only as a tooltip.',
 ev:['ev_rail.png'],evc:'The rail enlarged 2.5 times. The two lower icons are the pending steps, at about 2.3 to 1.',
 pri:'WCAG 2.2 success criterion 1.4.11 (non-text contrast, 3 to 1); Nielsen heuristic 6 (recognition rather than recall).',
 dir:'Option: raise pending icons to at least 3 to 1 with some margin (for example #64748B at full opacity, 4.8 to 1 on white), and show step names on hover and focus, or in a pinned wide state.'},
{id:'S-11',t:'The skip-intro control is an unlabelled double chevron',pr:'Low',ef:'Low',
 obs:'A 33 px round button with a "»" icon sits bottom-left on the agreements and setup plan screens. It has no visible label.',
 ev:['ev_nextup.png'],evc:'Setup plan screen. The control is at the bottom-left.',
 pri:'Nielsen heuristic 6 (recognition rather than recall); Norman on signifiers.',
 dir:'Option: add a label on hover and focus (for example "Skip intro"), or show the label next to the icon on first view.'},
{id:'S-12',t:'Team cards repeat the role twice',pr:'Low',ef:'Low',
 obs:'Each team card shows the role as a pill at the top right and again under a "Suggested role" label with a one-line description. The same role name appears twice per card, 12 times on the screen.',
 ev:['ev_team_cards.png'],evc:'Team cards.',
 pri:'Gestalt similarity and Refactoring UI (remove repeated elements that add no information).',
 dir:'Option: keep the pill and show only the description under it, without the repeated label.'},
{id:'S-13',t:'Brand cards repeat one line under every line of business',pr:'Low',ef:'Low',
 obs:'Under HDFC Life and HDFC ERGO every line of business carries the same second line, "Found in your DLT registration". It appears 4 times on one screen and has the same weight as the line above it.',
 ev:['ev_brand_cards.png'],evc:'Brands and LOBs summary: the same second line repeats under each line of business.',
 pri:'Refactoring UI (do not repeat what can be said once); Gestalt common region (a shared source can be stated once on the card).',
 dir:'Option: state the source once in the card header and keep per-line details only where they differ.'},
{id:'S-14',t:'GTM details page: clipped headline and avatars meeting the countdown pill',pr:'Medium',ef:'Low',
 obs:'The headline "Best Rates in Every Phase, Split Across Two…" is cut off inside a banner, and the avatar stack of the "4 partner requests" footer sits against the countdown pill at the bottom-left.',
 ev:['ev_details_gtm.png'],evc:'GTM details at 1440 by 900. The red boxes mark the clipped headline and the collision.',
 pri:'Nielsen heuristic 8 (aesthetic and minimalist design); Gestalt proximity (unrelated items touching read as related).',
 dir:'Option: let the banner grow with its text, and give the footer a left offset so it clears the pill.'},
{id:'S-15',t:'Setup plan: icons and step rows drift out of alignment',pr:'Medium',ef:'Low',
 obs:'On the setup plan, the five icons in the capsule are on an 88 px grid (y = 273, 361, 449, 537, 625). The step titles beside them sit at y = 261, 339, 427, 525, 613, so the offsets are 12, 22, 22, 12 and 12 px, and the rows have different heights. The primary button sits under the list at the far right, away from the left column that holds the three points.',
 ev:['ev_nextup.png'],evc:'Setup plan at 1440 by 900.',
 pri:'Gestalt continuity and proximity (items that belong together should align); Fitts\'s law for the button position.',
 dir:'Option: use a fixed row height for the five steps so each title centres on its icon, and place the button under the left column or centre it under both.'},
{id:'S-16',t:'Keyboard focus passes through controls that are not visible',pr:'High',ef:'Medium',
 obs:'On the Brands and LOBs summary, pressing Tab 70 times lands on 47 stops that are not visible (+ Add brand, Edit HDFC Bank, Delete HDFC Bank, Promo Examples and so on). Focus leaves the visible rail and reaches the visible Accept only after about 35 stops (the first Accept found is hidden). Details are in data/focus_order_summary_e0.json. This is likely caused by every screen being kept in the page at once.',
 ev:[],evc:'No screenshot: the stops are not visible, which is the finding. See data/focus_order_summary_e0.json.',
 pri:'WCAG 2.2 success criteria 2.4.7 (focus visible) and 2.4.3 (focus order); Nielsen heuristic 7 (flexibility and efficiency).',
 dir:'Option: mark inactive screens inert or remove them from the tab order, and keep the focus ring (2 px blue) that already exists on visible controls.'},
{id:'S-17',t:'Success card states the same facts twice',pr:'Low',ef:'Low',
 obs:'The success card shows "Accepted by Ravi Menon · 14 October 2026, 11:00 am" under the title and then repeats the same facts in a four-row table (Step, Accepted by, When, Record). The ring text around the check mark ("SIGNED · APPROVED · RECORDED") is about 8 px.',
 ev:['ev_success_stamp.png'],evc:'Success card after accepting GTM partners.',
 pri:'Gestalt similarity and Refactoring UI (repetition without new information); peak-end rule (the end of the step should be quick to read).',
 dir:'Option: keep the sub line and the Record row only, or drop the sub line and keep the table.'},
];
const DEC={"I-01": "Yes, intended. The bar stays hidden.", "I-02": "Left to the reviewer. Blue filled disc with a white check, no ring stamp, on every success screen. Applied in the fixes file.", "I-03": "Summaries and approvals: action at the bottom of the screen. Approved and end states: action next to the content, as on the business profile approved screen. Applied to success screens.", "I-04": "Open. Designer will choose after seeing show/I-04_status_forms.png. Interim: on status screens the coloured text goes below the chip (applied).", "I-05": "Yes, Team uses the centred end-state layout. Applied.", "I-06": "The dark screen should not exist. Removed: the user lands in the product.", "I-07": "Yes, the GTM details page follows the cards. Applied.", "I-08": "Open. Designer will answer after seeing show/I-08_card_tags.png."};
const I=[
['I-01','Agent bar','The copy document defines a bar line for every step. In every captured state the bar container is display:none (width 0, height 0).','Nielsen heuristic 1 (visibility of status); consistency with the requirements.','Is the bar intentionally removed, or should it show on summaries and success screens?'],
['I-02','Success glyph','Three treatments: a pale green outlined check (brands success), a blue filled disc with a ring stamp (team, GTM, templates success), and a larger blue disc (kick-off).','Gestalt similarity; Nielsen heuristic 4.','Should one success mark be used for all steps, with the stamp reserved for signed documents?'],
['I-03','CTA position','Success pair: Add more and Continue at the bottom-right. Kick-off and status screens: centred under the content. Summaries: bottom-right bar.','Fitts\'s law; Nielsen heuristic 4.','Is there one rule for where the primary action sits on end states?'],
['I-04','Status component','Status appears as coloured text next to a chip (status screens), as a pill with a dot (list rows) and as a dot with text ("Selected" on cards).','Gestalt similarity; Nielsen heuristic 4.','Which form is the status component, and where may the others be used?'],
['I-05','End-state layout','Profile, brands, templates and GTM status screens use a centred single column. Team empty and Team left for later use a split layout with the title on the left and a "Team" heading on the right with a lone button.','Gestalt similarity; Nielsen heuristic 4.','Should Team use the centred layout like the other end states?'],
['I-06','Interstitial colour','"Your organisation has finished setting up" is a full-screen dark navy page. Every other screen is light.','Gestalt similarity; peak-end rule.','Is the dark screen a deliberate exception?'],
['I-07','Summary and details','The GTM summary uses cards. The GTM details page still uses the earlier list with green tags and long chips, so the two views of one step look unrelated.','Nielsen heuristic 4; Gestalt similarity.','Should the details page follow the summary card style?'],
['I-08','Card header pattern','Team cards put the role pill at the top right, Templates put an amber "need review" tag, GTM puts "Selected", Brands put nothing.','Gestalt similarity; Nielsen heuristic 4.','Is a top-right tag meant to be the same slot on every card, and what does it carry?'],
];
const cover=[
 new Paragraph({spacing:{before:2400,after:120},children:[new TextRun({text:'UI and UX design critique',font:FONT,size:56,bold:true,color:'1F3A8A'})]}),
 P('DigiConsent agentic onboarding, cards-copy prototype',{size:30,after:240}),
 P('Subject: agentic-setup-final-approach-cards-copy.html, desktop, 1440 by 900',{after:60}),
 P('Date: 14 October 2026',{after:60}),
 P('Status: for design review',{bold:true,after:360}),
 P('This document is AI-assisted and covers design only: layout, hierarchy, type, colour, components, states and consistency. Copy, logic, bugs and legal content are out of scope. All suggestions are options for the design team to decide. Priority and effort ratings are estimates.',{italics:true,color:'475569'}),
];
const summary=[
 H1('Summary'),
 H2('What works well'),
 bullet('The summary screens share one structure: a "Summary" chip, title, sub and three accordions on the left, with the content on the right. The same structure holds for Team, Brands and LOBs, GTM partners and Templates.'),
 bullet('The button hierarchy is clear. One blue primary (Accept or Send invites), a quiet secondary (Skip for now, Do it later) and a text link (Review) are used the same way on each summary.'),
 bullet('Loaders explain what is happening: a one-line caption, a segmented progress bar and a scene that matches the step. Each loader settles into its summary between about 9 and 16 seconds.'),
 bullet('Step names agree across the rail tooltips, setup plan and summaries (Business profile, Team, Brands and LOBs, GTM partners, Templates).'),
 bullet('The soft glass cards and the violet, amber, red and green status colours are applied consistently in the captured states.'),
 H2('What most needs attention (suggested order)'),
 bullet('S-16 Keyboard focus goes through controls that are not visible (47 of 70 stops on one summary).'),
 bullet('S-10 Pending steps in the left rail are faint (about 2.3 to 1) and unlabelled.'),
 bullet('S-01 The type system is loose: 22 sizes, 13 weights, 5 families.'),
 bullet('S-04 End-state screens leave about two thirds of the screen empty and do not match the centred success screens.'),
 bullet('S-02 and S-03 Supporting text is small and some status text misses 4.5 to 1.'),
 H2('What was and was not captured'),
 P(`51 states were captured at 1440 by 900 with time series (4, 9, 16, 24 and 36 seconds for loaders and the setup plan; 3 to 10 seconds for summaries and success screens) and a final frame. They cover the agreements gate (both tabs), the setup plan, five loaders, four summaries (collapsed and expanded), four details pages, six success states and 25 scenarios. ${tot} text elements were measured. Not captured: hover and focus screenshots for most controls (one keyboard-order pass was run on the Brands summary), the business-profile verification overlay, the business-profile approved bar, and any viewport other than 1440 by 900. See the last section.`),
];
const listTable=table([800,4700,1100,1100,1900],['ID','Suggestion','Priority','Effort','Decision'],F.map(f=>[f.id,f.t,f.pr,f.ef,'']),{size:19});
const details=[H1('Suggestions in detail'),P('Priority and effort are estimates by the reviewer. Each suggestion is one option for the designer to decide.',{italics:true,color:'475569'})];
for(const f of F){
 details.push(H2(`${f.id}  ${f.t}`),
  P([new TextRun({text:'Suggested priority: ',bold:true,font:FONT,size:22}),new TextRun({text:f.pr+'.   ',font:FONT,size:22}),new TextRun({text:'Effort: ',bold:true,font:FONT,size:22}),new TextRun({text:f.ef+'.',font:FONT,size:22})],{keepNext:true}),
  P([new TextRun({text:'Observed. ',bold:true,font:FONT,size:22}),new TextRun({text:f.obs,font:FONT,size:22})]));
 if(f.ev.length){for(const e of f.ev)details.push(img(e,e.includes('rail')||e.includes('status_text')?260:520));details.push(cap(f.evc))}else details.push(cap(f.evc));
 details.push(P([new TextRun({text:'Principle or standard. ',bold:true,font:FONT,size:22}),new TextRun({text:f.pri,font:FONT,size:22})]),
  P([new TextRun({text:'Suggested direction (one option). ',bold:true,font:FONT,size:22}),new TextRun({text:f.dir,font:FONT,size:22})]),
  P('Decision:   ☐ Adopt     ☐ Adapt     ☐ Decline     ☐ Defer',{bold:true,after:200}));
}
const incons=[H1('Inconsistencies'),P('Where the prototype disagrees with itself, the requirements or the copy document. These are questions for the designer, not rulings.',{italics:true,color:'475569'}),
 table([600,900,2500,1500,1800,2300],['ID','Topic','What differs','Principle at stake','Question for the designer','Decision, 14 October 2026'],I.map(i=>[...i,DEC[i[0]]||'']),{size:17})];
const typeTbl=table([2200,1500],['Font size','Elements'],sizeRows,{size:19});
const wTbl=table([2200,1500],['Font weight','Elements'],wRows,{size:19});
const visual=[H1('Visual system reference (one option)'),
 P('The system is loose in type (S-01), so one illustrated option is given. It is a starting point, not a prescription.'),
 H2('Type scale (one option)'),
 table([1700,1300,1300,4400],['Role','Size','Weight','Used for'],[['Caption','12','500','Chips, helper text, table labels'],['Body small','14','400','Descriptions, reasons, scrubbing rates'],['Body','16','400','Primary reading text'],['Label strong','14','600','Buttons, row titles'],['Title small','20','600','Card names, section headings'],['Title','24','600','Summary and screen titles'],['Display','32','700','Success and end-state titles']],{size:19}),
 H2('Status colours with text contrast on white (one option)'),
 table([1700,1800,1800,3400],['Status','Dot or fill','Text colour','Contrast of text on white'],[['In review, paused','#7C3AED','#5B21B6','9.0 to 1'],['Needs attention','#F59E0B','#92400E','7.1 to 1'],['Not approved','#DC2626','#B91C1C','6.5 to 1'],['Approved, active','#22A06B','#166534','7.1 to 1'],['Working now','#2563EB','#1D4ED8','6.7 to 1']],{size:19}),
 P('Contrast values are computed with the WCAG relative luminance formula against white. Check them again over the real card backgrounds before adopting.',{italics:true,color:'475569',size:20}),
 H2('Spacing scale (one option)'),
 P('4, 8, 12, 16, 24, 32, 48 px. Card padding 16 or 24. Gap between cards 16. Gap between sections 32.')];
const log=[H1('Decision log'),P('Record each decision with the date. If a suggestion is adapted, note what is wanted or write "details to be added".'),
 table([900,3200,1700,1200,2500],['ID','Suggestion','Decision','Date','Notes'],[...F.map(f=>[f.id,f.t,'','','']),...I.map(i=>[i[0],i[1],(DEC[i[0]]||'').split('.')[0]+'.','14 Oct 2026',DEC[i[0]]||''])],{size:18})];
const lim=[H1('Method and limits'),
 H2('How it was captured'),
 bullet('Chrome driven by Playwright at 1440 by 900. Motion left on. The script is capture.js in this folder.'),
 bullet('Each state was loaded fresh. Loaders and the setup plan were captured at 4, 9, 16, 24 and 36 seconds. Summaries, success and details screens were captured at 3 to 10 seconds, then a final frame.'),
 bullet('Summaries were also captured with the accordions expanded. Success screens were reached by clicking the primary or skip action on each summary. All 25 scenario buttons were clicked and captured.'),
 bullet('The prototype keeps several screens in the page at once, so visibility was checked with elementFromPoint before any text, size, contrast or target was counted. The loader "final" frames show the summary because each loader settles into it; the loader itself is in the 4, 9 and 16 second frames.'),
 H2('Measurements'),
 bullet('Type: computed font size, weight and family for every visible text element. Contrast: WCAG relative luminance of the text colour composited on the nearest opaque background. Where an ancestor has a gradient, the value is approximate and flagged. Targets: bounding box of every visible button, link, input and tabbable element, flagged under 24 by 24 px. Inline links in sentences are exempt from WCAG 2.5.8, so they were not raised as findings.'),
 bullet('Contrast of 1.0 to 1.05 on white-on-blue buttons and on coloured avatar letters is a false reading from gradient backgrounds and was discarded.'),
 bullet('The file runs a script that raises text under 12 px to 12 px and darkens some grey text. Measured sizes and contrasts therefore describe the screen as a user sees it, not the raw stylesheet.'),
 H2('Not reached or approximate'),
 bullet('Hover and focus screenshots: one keyboard-order pass was run on the Brands summary and one hover on Accept. Other controls were not captured in those states.'),
 bullet('The business-profile verification overlay and the approved bar were not reached in a clean capture.'),
 bullet('Only 1440 by 900 was tested. Narrower desktop widths, where some labels already wrap, were not captured.'),
 bullet('Return open and return unchanged show the same screen in the captures, so the difference between them could not be seen.'),
 bullet('Prototype data (partner names, rates, counts, the countdown) is illustrative and was not critiqued.'),
 bullet('The Templates mapping list, the business profile form, the agreement text, the rate-card table and the migration page come from approved designs or existing screens and were not critiqued.'),
 H2('Standards used'),
 P('WCAG 2.2: 1.4.1 use of colour, 1.4.3 contrast minimum, 1.4.11 non-text contrast, 2.4.3 focus order, 2.4.7 focus visible, 2.5.8 target size (minimum). Nielsen\'s ten usability heuristics. Gestalt principles. Fitts\'s law and Hick\'s law. Type-scale practice from Material 3, Carbon and Primer. Refactoring UI. Norman on affordances and signifiers. Peak-end rule.'),
 H2('Noted, not critiqued'),
 bullet('Copy: the loader caption "Marking how confident each suggestion is" reads as cut off. The log-out dialog title is in Title Case.'),
 bullet('Logic: the success screens move on after a short countdown; the Return open and Return unchanged scenarios cannot be told apart.'),
 H2('Appendix: measured values'),
 typeTbl,P('',{after:120}),wTbl,
];
const doc=new Document({creator:'Design review',title:'UI and UX design critique',
 styles:{default:{document:{run:{font:FONT,size:22}}}},
 numbering:{config:[{reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]}]},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1134,bottom:1134,left:1134,right:1134}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'Design critique, for design review. Page ',font:FONT,size:16,color:'64748B'}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:16,color:'64748B'})]})]})},
  children:[...cover,new Paragraph({children:[new PageBreak()]}),...summary,new Paragraph({children:[new PageBreak()]}),H1('The list'),P('Every suggestion with a suggested priority and effort (the reviewer\'s estimates). The Decision column is left empty for the design team.'),listTable,new Paragraph({children:[new PageBreak()]}),...details,new Paragraph({children:[new PageBreak()]}),...incons,new Paragraph({children:[new PageBreak()]}),...visual,new Paragraph({children:[new PageBreak()]}),...log,new Paragraph({children:[new PageBreak()]}),...lim]}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('Design_critique_cards_copy.docx',b);console.log('written',b.length)});
