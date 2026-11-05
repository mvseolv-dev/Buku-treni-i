import {diagramConfigs} from './extra-drills.js';
import {phaseRoutes,routeKinds} from './diagram-phases.js';
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function diagramFor(d,step=-1){
 const key=d.scene||d.id;const config=diagramConfigs[key];
 if(!config)throw new Error(`Missing diagram: ${d.id}`);
 const [kind,positions,routes]=config;
 const active=step>=0, phase=active?step:0;
 const id=`d-${d.id}-${active?'detail':'card'}`;
 const title=active?`${d.title}: ${d.steps[step]}`:`${d.title}: sākuma izvietojums`;
 const body=['squat','plank','balance'].includes(key);
 const shot=kind==='S';
 const routeType=a=>routeKinds[key]?.[routes.indexOf(a)]||(shot?'shot':kind==='P'?'pass':'move');
 const routeColor=a=>['shot','pass','ball'].includes(routeType(a))?'#e79853':'#c6f778';
 let points=positions;
 if(key==='countdown'&&active&&phase>0)points=phase===1?positions.slice(0,2):phase===2?positions.slice(2):positions;
 let lines=active?(phaseRoutes[key]?.[phase]||[]).map(i=>routes[i]):[];
 // Positional shooting uses the exact shooting point selected by the instruction.
 if(['spots','countdown','points'].includes(key)&&active&&phase>0){
 const selected=key==='countdown'?(phase===1?positions.slice(0,2):phase===2?positions.slice(2):[]):phase===1?positions:[];
 lines=selected.map(p=>[...p,150,38]);
 }
 const path=a=>'M'+a.slice(0,2).join(' ')+' '+Array.from({length:a.length/2-1},(_,i)=>'L'+a.slice(2+i*2,4+i*2).join(' ')).join(' ');
 const ballStart=key==='twoBalls'?[[130,140],[170,140]]:key==='knockout'?positions.slice(0,2):['S','D','P'].includes(kind)?[positions[0]]:[];
 let drawing;
 if(body){
 const low=active&&phase===1;
 drawing=key==='plank'?`<path d="M55 140H245" stroke="#61734d"/><circle cx="85" cy="95" r="10"/><path d="M95 105L230 140 M110 109L110 140H85"/>`:key==='squat'?`<circle cx="150" cy="${low?65:40}" r="11"/><path d="M150 ${low?76:51}L${low?130:150} 110L${low?170:155} 125L165 165 M${low?130:150} 110L${low?110:140} 130L130 165 M150 ${low?85:65}L200 ${low?85:90}"/>`:`<circle cx="150" cy="45" r="11"/><path d="M150 56V110L140 165 M150 110L180 100L180 130 M150 72L110 100 M150 72L190 100"/>`;
 drawing=`<g fill="none" stroke="#c6f778" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${drawing}</g><text x="150" y="192" text-anchor="middle" fill="#aebca0" font-size="10">${key==='plank'?'SKATS NO SĀNIEM':key==='squat'?'PIETUPIENS · SKATS NO SĀNIEM':'LĪDZSVARS · SKATS NO PRIEKŠAS'}</text>`;
 }else{
 drawing=`<g fill="none" stroke="#778966" stroke-width="1" opacity=".65"><path d="M25 185V15H275V185Z M105 15V85H195V15 M120 15V60H180V15"/><path d="M105 85 A45 45 0 0 0 195 85 M35 15V45 A115 115 0 0 0 265 45V15"/><circle cx="150" cy="38" r="9"/><path d="M135 26H165"/></g>`;
 if(['slalom','retreat','reaction'].includes(key)){const cones=key==='reaction'?[[75,115],[225,115]]:key==='retreat'?[[150,85]]:[[145,125],[110,90],[155,60]];drawing+=cones.map(([x,y])=>`<path d="M${x} ${y-6}l5 10h-10z" fill="#e79853"/>`).join('')}
 if(['shuttle','hops'].includes(key))drawing+=`<path d="${key==='hops'?'M150 100V170':'M75 115H140 M75 65H140'}" stroke="#e79853" stroke-dasharray="3 3"/>`;
 drawing+=lines.map((a,i)=>`<path id="${id}-path-${i}" d="${path(a)}" fill="none" stroke="${routeColor(a)}" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#${id}-${routeColor(a)==='#e79853'?'ball':'move'})"/>`).join('');
 drawing+=points.map(([x,y],i)=>{const defender=kind==='A'&&(key==='shell'?i>=4:key==='boxout'?i===1:key==='help'?i===2:key==='deny'?i===2:i===1||key==='slide');return `<circle cx="${x}" cy="${y}" r="10" fill="${defender?'#101c21':'#c6f778'}" stroke="${defender?'#86c6e6':'#131910'}" stroke-width="2"/><text x="${x}" y="${y+3}" text-anchor="middle" fill="${defender?'#86c6e6':'#15200e'}" font-size="9" font-family="Arial">${key==='shell'&&i>=4?i-3:i+1}</text>`}).join('');
 drawing+=ballStart.map(([x,y])=>`<circle cx="${x+13}" cy="${y-5}" r="4" fill="#e79853"/>`).join('');
 if(active&&phase>0&&lines.length){drawing+=lines.map((a,i)=>`<circle r="${['shot','pass','ball'].includes(routeType(a))?'4':'6'}" fill="${routeColor(a)}" opacity=".9"><animateMotion dur="3s" repeatCount="indefinite" path="${path(a)}"/></circle>`).join('')}
 }
 return `<svg class="court-svg specific-diagram" viewBox="0 0 300 210" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title><defs>${[['ball','#e79853'],['move','#c6f778']].map(([name,color])=>`<marker id="${id}-${name}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="${color}"/></marker>`).join('')}</defs>${drawing}${!body?`<text x="150" y="204" text-anchor="middle" fill="#aebca0" font-size="9" font-family="Arial">${active?`SOLIS ${phase+1} / ${d.steps.length}`:'SĀKUMA IZVIETOJUMS'} · ${key==='twoBalls'?'2 BUMBAS':key==='knockout'?'2 BUMBAS · RINDA':key==='shell'?'4 UZBRUCĒJI · 4 AIZSARGI':'SKATS NO AUGŠAS'}</text>`:''}</svg>`;
}
