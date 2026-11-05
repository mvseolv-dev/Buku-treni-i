import {guides} from './guides.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function routePath(points){
 const p=Array.from({length:points.length/2},(_,i)=>[points[i*2],points[i*2+1]]);
 let path=`M${p[0].join(' ')}`;
 for(let i=1;i<p.length-1;i++){
  const a=p[i-1],c=p[i],b=p[i+1],l1=Math.hypot(c[0]-a[0],c[1]-a[1]),l2=Math.hypot(b[0]-c[0],b[1]-c[1]);
  if(!l1||!l2){path+=` L${c.join(' ')}`;continue}
  const r=Math.min(20,l1/3,l2/3),entry=[c[0]-(c[0]-a[0])*r/l1,c[1]-(c[1]-a[1])*r/l1],exit=[c[0]+(b[0]-c[0])*r/l2,c[1]+(b[1]-c[1])*r/l2];
  path+=` L${entry.join(' ')} Q${c.join(' ')} ${exit.join(' ')}`;
 }
 return path+` L${p.at(-1).join(' ')}`;
}
function person(p){
 const defender=p.role==='defender';
 return `<circle r="22" fill="#000" opacity=".15" cy="3"/><circle r="19" fill="${defender?'#faf8f2':'#f3aa5b'}" stroke="${defender?'#a9b9c4':'#fff0d5'}" stroke-width="2"/><text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="#17232d" font-family="Arial">${esc(p.label)}</text>`;
}
function body(g,id,animated){
 const pose=g.pose||'stand',low=['dribble','cross','between','behind','two-balls','defend','squat','inout','vdribble','pushpull','wrap'].includes(pose),head=low?150:115,hip=low?305:290;
 const arms=pose==='wrists'?'M280 200L230 255L260 270 M320 200L370 255L340 270':pose==='shoot'?'M280 210L250 140L285 105 M320 210L340 140L315 100':pose==='defend'?'M280 220L215 195L160 220 M320 220L385 195L440 220':pose==='balance'?'M280 190L230 235 M320 190L365 235':'M280 220L245 255L210 280 M320 220L355 255L390 280';
 const legs=pose==='skip'?'M285 290L270 410 M315 290L370 265L390 320':pose==='calfraise'?'M285 290L270 390L285 410 M315 290L335 390L350 410':pose==='balance'?'M285 290L270 400 M315 290L360 330L330 355':low?'M280 305L235 350L215 415 M320 305L365 350L385 415':'M285 290L270 410 M315 290L335 410';
 let balls='';
 if(g.ball||pose==='shoot'){
 const points=pose==='shoot'?[300,90,300,90]:pose==='inout'?[395,290,340,330,395,395]:pose==='vdribble'?[395,290,300,400,345,290]:pose==='pushpull'?[390,270,420,405,360,270]:pose==='wrap'?[220,300,190,355,245,375,355,315,410,355,355,375,220,300]:pose==='cross'?[205,300,300,408,395,300]:pose==='between'?[210,285,300,400,365,320]:pose==='behind'?[205,285,300,320,395,285]:[390,275,390,410,390,275];
 const data=g.reverse?[...Array.from({length:points.length/2},(_,i)=>points.slice(i*2,i*2+2)).reverse().flat()]:points;
 const ball=(a,delay=0)=>`<circle cx="${a[0]}" cy="${a[1]}" r="13" fill="#f99124" stroke="#a64e0a" stroke-width="2">${animated?`<animateMotion path="${routePath(a.map((n,i)=>n-a[i%2]))}" dur="1.8s" begin="${delay}s" repeatCount="indefinite"/>`:""}</circle>`;
 balls=pose==='two-balls'?ball([210,275,210,410,210,275])+ball([390,275,390,410,390,275],g.alternating?.9:0):ball(data);
 }
 const title=pose==='behind'?'POGATS NO MUGURPUSES':pose==='between'?'SKATS IESLĪPI NO PRIEKŠAS':'SKATS NO PRIEKŠAS';
 const extras=pose==='wrists'?'<circle cx="260" cy="270" r="21" fill="none" stroke="#ffbb45" stroke-width="3" stroke-dasharray="6 4"/><circle cx="340" cy="270" r="21" fill="none" stroke="#ffbb45" stroke-width="3" stroke-dasharray="6 4"/>':'';
 return `${extras}<path d="M100 430H500" stroke="#6d818b" stroke-width="2"/>${pose==='hop'||g.jump?'<path d="M300 380V460" stroke="#f9a42c" stroke-width="4" stroke-dasharray="7 5"/>':''}<g class="body-person" fill="none" stroke="#188dcc" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"><circle cx="300" cy="${head}" r="28" fill="#e4ba94" stroke="#102b3b" stroke-width="3"/><path d="M300 ${head+35}V${hip}" stroke-width="65"/><path d="${arms}"/><path d="${legs}"/></g>${balls}<text x="300" y="490" text-anchor="middle" fill="#bdd4e0" font-size="14">${title.replace('POGATS','SKATS')}</text>`;
}
export function diagramFor(d,step=-1,context='detail'){
 const list=guides[d.id];if(!list)throw new Error(`Missing guide for ${d.id}`);
 const index=step<0?0:step,raw=list[index];if(!raw)throw new Error(`Missing step ${d.id}:${step}`);
 const g={...raw,cones:raw.cones??list[0].cones,spots:raw.spots??list[0].spots,wall:raw.wall??list[0].wall};
 const id=`${d.id}-${context}-${step<0?'setup':'step-'+step}`,surface=g.surface||'court';
 const animated=context==='detail';
 const title=`${d.title} — ${g.text}`;
 let contents='';
 if(surface==='body')contents=body(g,id,animated);
 else if(surface==='bounce'){
 contents='<path d="M80 410H520" stroke="#abc2cc" stroke-width="3"/><g stroke="#168dd1" stroke-width="13" stroke-linecap="round"><circle cx="100" cy="235" r="20" fill="#dfb28d"/><path d="M100 265V340L80 405 M100 340L125 405 M100 280L150 300"/><circle cx="500" cy="235" r="20" fill="#dfb28d"/><path d="M500 265V340L480 405 M500 340L525 405 M500 280L450 300"/></g><text x="300" y="475" fill="#bdd4e0" text-anchor="middle" font-size="15">SKATS NO SĀNIEM · 3 m</text>';
 if(index>0)contents+=`<path d="M150 300L350 402L450 300" fill="none" stroke="#ffc53d" stroke-width="4" stroke-dasharray="9 7"/><circle cx="350" cy="402" r="5" fill="#ffc53d"/><text x="350" y="435" fill="#ffc53d" text-anchor="middle" font-size="13">1 ATSITIENS</text>`;
 contents+=index>1&&animated?'<circle r="12" fill="#f68a21"><animateMotion dur="3s" repeatCount="indefinite" path="M150 300L350 402L450 300"/></circle>':'<circle cx="150" cy="300" r="12" fill="#f68a21"/>';
 }else{
 if(surface==='court'||surface==='full'){
 contents=`<rect x="30" y="30" width="540" height="504" rx="4" fill="#192b36" stroke="#7c929f" stroke-width="2"/><g clip-path="url(#${id}-clip)" opacity=".035" stroke="#dde7ed">${Array.from({length:32},(_,i)=>`<path d="M30 ${35+i*16}H570"/>`).join('')}</g><g fill="none" stroke="#a4b5bf" stroke-width="2"><path d="M212 30V239H388V30 M244 30V170H356V30 M265 56H335"/><circle cx="300" cy="73" r="14" stroke="#f3aa5b" stroke-width="3"/><path d="M212 239 A88 88 0 0 0 388 239" stroke-dasharray="9 6"/><path d="M212 239 A88 88 0 0 1 388 239"/><path d="M55 30V110 A246 246 0 0 0 545 110V30"/></g>`;
 if(surface==='full')contents=`<rect x="30" y="30" width="540" height="504" fill="#192b36" stroke="#7c929f" stroke-width="2"/><g fill="none" stroke="#a4b5bf" stroke-width="2"><path d="M30 282H570 M220 30V140H380V30 M220 534V424H380V534 M270 55H330 M270 510H330"/><circle cx="300" cy="282" r="60"/><circle cx="300" cy="73" r="12" stroke="#f47a28"/><circle cx="300" cy="515" r="12" stroke="#f47a28"/></g>`;
 }else contents='<rect x="55" y="65" width="490" height="440" rx="8" fill="#142f3c" stroke="#688392" stroke-width="2"/><path d="M300 65V505" stroke="#344e5a" stroke-dasharray="9 12"/>';
 if(g.wall)contents+='<rect x="80" y="125" width="440" height="20" fill="#627d8b"/><text x="300" y="110" fill="#c4d8e3" text-anchor="middle" font-size="15">SIENA</text>';
 contents+=(g.spots||[]).map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="19" fill="#102531" stroke="#efac35" stroke-width="3"/><text x="${x}" y="${y+5}" fill="#ffd27a" text-anchor="middle" font-size="15">${i+1}</text>`).join('');
 contents+=(g.cones||[]).map(c=>`<g transform="translate(${c.x} ${c.y})"><path d="M0 -12L10 9H-10Z" fill="#f3aa5b" stroke="#f8d7ae" stroke-width="1.2"/><rect x="-18" y="-39" width="36" height="22" rx="11" fill="#0d1a23" stroke="#6d8797" stroke-width="1"/><text y="-23" fill="#f4e9d9" text-anchor="middle" font-size="14" font-weight="bold">${esc(c.label)}</text></g>`).join('');
 contents+=g.routes.map((r,i)=>`<path d="${routePath(r.points)}" fill="none" stroke="#07131a" stroke-width="7" opacity=".35"/><path d="${routePath(r.points)}" fill="none" stroke="${r.type==='shot'||r.type==='pass'?'#f7c891':'#83bed9'}" stroke-width="3.5" ${r.type==='shot'||r.type==='pass'?'stroke-dasharray="8 7"':''} stroke-linejoin="round" stroke-linecap="round" marker-end="url(#${id}-${r.type==='shot'||r.type==='pass'?'ball':'move'})"/>`).join('');
 const ballRoutes=g.routes.filter(r=>r.type==='shot'||r.type==='pass');
 contents+=g.actors.map((p,i)=>{
 const r=g.routes.find(r=>r.actor===i&&['move','dribble'].includes(r.type));
 const relative=r?r.points.map((n,j)=>n-(j%2?p.y:p.x)):null;
 const at=!animated&&r?r.points.slice(-2):[p.x,p.y];
 const attached=(g.ball&&i===(g.ballActor??0))||(g.ballActor===i)||g.ballAll||r?.type==='dribble';
 const hasRelease=ballRoutes.some(route=>route.type==='shot');
 const carry=attached&&(!ballRoutes.length||r?.type==='dribble');
 return `<g transform="translate(${at[0]} ${at[1]})"><g>${r&&animated?`<animateMotion path="${routePath(relative)}" dur="5s" keyPoints="0;1;1" keyTimes="0;.65;1" calcMode="linear" repeatCount="indefinite"/>`:''}${person(p)}${carry&&(animated||!hasRelease)?`<circle cx="22" cy="-12" r="9" fill="#ef9f51" stroke="#58371d" stroke-width="2">${hasRelease&&animated?'<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.649;.65;1" dur="5s" repeatCount="indefinite"/>':''}</circle>`:''}</g></g>`;
 }).join('');
 contents+=(g.balls||[]).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="#ef9f51" stroke="#58371d" stroke-width="2"/>`).join('');
 contents+=ballRoutes.map((r,i)=>{
 if(!animated)return `<circle cx="${r.points[0]+22}" cy="${r.points[1]-12}" r="9" fill="#ef9f51" stroke="#58371d" stroke-width="2"/>`;
 const start=ballRoutes.length>1&&d.id!=='knockout'?(i===0?.05:.65):g.routes.some(r=>r.type==='dribble')?.65:.1;
 const end=ballRoutes.length>1&&d.id!=='knockout'?(i===0?.3:.9):.9;
 const before=Math.max(0,start-.001),after=Math.min(1,end+.001);
 return `<circle r="9" fill="#ef9f51" stroke="#58371d" stroke-width="2" opacity="0"><animateMotion dur="5s" path="${routePath(r.points)}" keyPoints="0;0;1;1" keyTimes="0;${start};${end};1" calcMode="linear" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;${before};${start};${end};${after};1" dur="5s" repeatCount="indefinite"/></circle>`;
 }).join('');
 }
 return `<svg class="court-svg precise-guide" viewBox="0 0 600 560" role="img" aria-label="${esc(title)}" data-exercise="${d.id}" data-frame="${index}"><title>${esc(title)}</title><defs><clipPath id="${id}-clip"><rect x="30" y="30" width="540" height="504"/></clipPath>${[['move','#83bed9'],['ball','#f7c891']].map(([name,color])=>`<marker id="${id}-${name}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10" fill="${color}"/></marker>`).join('')}</defs>${contents}</svg>`;
}
