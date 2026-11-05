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
 const defender=p.role==='defender',waiting=p.role==='waiting';
 return `<circle r="22" fill="#000" opacity=".15" cy="3"/><circle r="19" fill="${waiting?'#46545d':defender?'#faf8f2':'#f3aa5b'}" stroke="${defender?'#a9b9c4':'#fff0d5'}" stroke-width="2"/><text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="${waiting?'#d3dde4':'#17232d'}" font-family="Arial">${esc(p.label)}</text>`;
}
export function bodyPhotoFor(g){
 const map={stand:['Shoulder_Stretch',0,'Sagatavošanās poza'],wrists:['Wrist_Circles',0,'Plaukstu kustību piemērs'],balance:['Single-Leg_Hop_Progression',0,'Līdzsvars uz vienas kājas'],squat:['Bodyweight_Squat',1,'Saliektu kāju pozas piemērs']};
 return map[g?.pose]||null;
}
function body(g,id,animated){
 const photo=bodyPhotoFor(g);
 if(photo)return `<image href="./assets/exercises/${photo[0]}-${photo[1]}.jpg" x="20" y="45" width="560" height="430" preserveAspectRatio="xMidYMid meet"/><text x="300" y="510" text-anchor="middle" fill="#b9cbd5" font-size="14">${photo[2]}</text>`;
 const pose=g.pose||'stand';
 const shoe=(x,y,raised=false)=>`<g transform="translate(${x} ${y})"><g ${raised?'transform="rotate(20 55 0)"':''}><path d="M-55 0Q-60 -28 -40 -35L-10 -35Q5 -22 15 -17L55 -8Q70 0 55 10H-45Q-58 10 -55 0Z" fill="#e6e5dd" stroke="#88958e" stroke-width="2"/><path d="M-8 -28L-22 -12 M4 -22L-10 -8 M-48 5H54" stroke="#929b92" stroke-width="2"/></g></g>`;
 if(!g.ball&&pose!=='shoot'){
  const raised=pose==='calfraise',jump=['hop','skip'].includes(pose);
  return `<path d="M90 370H510" stroke="#61766a" stroke-width="2"/>${jump?'<path d="M300 230V405" stroke="#a7ba91" stroke-width="2" stroke-dasharray="7 7"/>':''}<g>${animated&&jump?'<animateTransform attributeName="transform" type="translate" values="-70 0;0 -40;70 0;0 -40;-70 0" dur="4s" repeatCount="indefinite"/>':''}${shoe(250,345,raised)}${shoe(380,345,raised)}</g><text x="300" y="470" fill="#c6d4be" text-anchor="middle" font-size="16">${raised?'Pacel papēžus · nolaid kontrolēti':jump?'Piezemējies uz abām pēdām':'Iekārtojies ērtā darba vietā'}</text><text x="300" y="505" fill="#83927a" text-anchor="middle" font-size="12">Pēdu kustības shēma</text>`;
 }
 const floorY=pose==='shoot'?430:440;
 let out=`<defs><radialGradient id="${id}-leather" cx=".3" cy=".25" r=".8"><stop stop-color="#efbd79"/><stop offset=".6" stop-color="#c47c36"/><stop offset="1" stop-color="#724119"/></radialGradient></defs><path d="M90 ${floorY}H510" stroke="#607366" stroke-width="2"/>`;
 const hand=(x,y,flip=false)=>`<g transform="translate(${x} ${y}) scale(${flip?-1:1} 1)"><path d="M-20 -8L-25 -46Q-25 -53 -19 -50L-10 -29L-12 -63Q-12 -70 -6 -66L2 -31L4 -68Q6 -74 11 -66L16 -27L22 -59Q26 -65 30 -57L29 -15L42 -30Q48 -33 48 -26L31 10L23 43H-5L-12 15Z" fill="#d6b392" stroke="#9d7f66" stroke-width="2"/></g>`;
 out+=pose==='shoot'?hand(245,260)+hand(355,260,true):hand(200,235)+hand(400,235,true);
 if(pose==='between'||pose==='wrap'||pose==='cross'||pose==='behind')out+=shoe(215,420)+shoe(385,420);
 let points=pose==='shoot'?[300,190,300,100]:pose==='inout'?[395,290,340,330,395,395]:pose==='vdribble'?[395,290,300,400,345,290]:pose==='pushpull'?[390,270,420,405,360,270]:pose==='wrap'?[220,300,190,355,245,375,355,315,410,355,355,375,220,300]:pose==='cross'?[205,300,300,408,395,300]:pose==='between'?[210,285,300,400,365,320]:pose==='behind'?[205,285,300,320,395,285]:[390,275,390,410,390,275];
 if(g.reverse)points=Array.from({length:points.length/2},(_,i)=>points.slice(i*2,i*2+2)).reverse().flat();
 const ball=(a,delay=0)=>`<path d="${routePath(a)}" fill="none" stroke="#c0d0ad" stroke-width="2" stroke-dasharray="5 8"/><g transform="translate(${a[0]} ${a[1]})"><g>${animated?`<animateMotion path="${routePath(a.map((n,i)=>n-a[i%2]))}" dur="2.2s" begin="${delay}s" repeatCount="indefinite"/>`:''}<circle r="23" fill="url(#${id}-leather)" stroke="#a5723d"/><path d="M-23 0H23 M0 -23V23 M-16 -16Q5 0 -16 16 M16 -16Q-5 0 16 16" stroke="#563920" stroke-width="1.6" fill="none"/></g></g>`;
 out+=pose==='two-balls'?ball([205,280,205,415,205,280])+ball([395,280,395,415,395,280],g.alternating?1.1:0):ball(points);
 out+=`<text x="200" y="160" text-anchor="middle" fill="#9eaf94" font-size="12">KREISĀ ROKA</text><text x="400" y="160" text-anchor="middle" fill="#9eaf94" font-size="12">LABĀ ROKA</text><text x="300" y="500" text-anchor="middle" fill="#b9c8ae" font-size="14">${pose==='behind'?'Bumbas ceļš aiz gurniem':pose==='between'?'Bumbas ceļš starp kājām':pose==='shoot'?'Bumbas izlaides virziens':'Bumbas un roku kustības shēma'}</text>`;
 return out;
}

export function diagramFor(d,step=-1,context='detail'){
 const list=guides[d.id];if(!list)throw new Error(`Missing guide for ${d.id}`);
 const index=step<0?0:step,raw=list[index];if(!raw)throw new Error(`Missing step ${d.id}:${step}`);
 let g={...raw,cones:raw.cones??list[0].cones,spots:raw.spots??list[0].spots,wall:raw.wall??list[0].wall};
 if(d.id==='attack-closeout'&&d.organization?.groups[0]?.size===4)g={...g,actors:[...g.actors,{x:390,y:120,label:'S',role:'player'}]};
 if(d.organization?.kind==='shooting'&&g.actors.length){
  const members=d.organization.groups[0].members,size=members.length;
  const actors=g.actors.slice(0,size).map((p,i)=>({...p,label:String(members[i].player)}));
  while(actors.length<size)actors.push({x:actors.length===1?420:380,y:actors.length===1?200:125,label:String(members[actors.length].player),role:'player'});
  g={...g,actors,routes:size===1?g.routes.filter(r=>r.type!=='pass'&&(!['move','dribble'].includes(r.type)||r.actor===0)):g.routes};
 }
 if(d.organization?.kind==='shared'&&g.actors.length){
  const members=d.organization.groups[0].members,positions=[[170,350],[420,350],[300,180],[300,430],[120,180],[480,180]];
  g={...g,actors:members.map((m,i)=>g.actors[i]?{...g.actors[i],label:String(m.player)}:{x:positions[i][0],y:positions[i][1],label:String(m.player),role:'player'})};
 }
 if(d.organization?.kind==='free-throws'&&d.organization.groups[0].size===1)g={...g,actors:g.actors.slice(0,1),routes:g.routes.filter(r=>r.type!=='pass'&&r.actor===0)};
 if(d.organization?.kind==='rotation'&&index===0){
  const members=d.organization.groups[0].members,actors=g.actors.slice(0,Math.min(members.length,5)).map((p,i)=>({...p,label:String(members[i].player),role:members[i].working?'player':'waiting'}));
  while(actors.length<Math.min(members.length,5)){const i=actors.length;actors.push({x:d.id==='knockout'?300:530,y:d.id==='knockout'?255+i*60:330+i*45,label:String(members[i].player),role:'waiting'})}
  g={...g,actors};
 }
 const id=`${d.id}-${context}-${step<0?'setup':'step-'+step}`,surface=g.surface||'court';
 const animated=context==='detail';
 const title=`${d.title} — ${d.steps[index]}`;
 let contents='';
 if(surface==='body')contents=body(g,id,animated);
 else if(surface==='bounce'){
 contents='<path d="M80 410H520" stroke="#7f9281" stroke-width="2"/><circle cx="105" cy="300" r="25" fill="#d9dcd0"/><text x="105" y="306" fill="#243026" text-anchor="middle" font-family="Arial" font-size="17">1</text><circle cx="495" cy="300" r="25" fill="#d9dcd0"/><text x="495" y="306" fill="#243026" text-anchor="middle" font-family="Arial" font-size="17">2</text><text x="105" y="260" fill="#b8cbb1" text-anchor="middle" font-size="13">Piespēlētājs</text><text x="495" y="260" fill="#b8cbb1" text-anchor="middle" font-size="13">Saņēmējs</text><text x="300" y="475" fill="#b8cbb1" text-anchor="middle" font-size="15">BUMBA ATSITAS 1 REIZI · 3 m</text>';
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
