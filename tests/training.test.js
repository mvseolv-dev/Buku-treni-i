import {participationFor,adaptForPlayers} from '../participation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {makePlan,drills,categories} from '../training.js';
import {guides} from '../guides.js';
import {diagramFor} from '../diagrams.js';
test('All player counts, durations and focuses produce eligible plans with exact time budgets',()=>{
 for(let n=1;n<=20;n++)for(const duration of [30,45,60,90])for(const focus of ['all',...Object.keys(categories)]){
  const p=makePlan(n,duration,focus,Math.random,{baskets:20,balls:40});
  assert.equal(p.reduce((s,d)=>s+d.minutes,0),duration);
  assert.equal(p[0].category,'warmup');assert.ok(p.every(d=>d.min<=n&&d.minutes>0));
  assert.equal(new Set(p.map(d=>d.id)).size,p.length);if(focus!=='all')assert.ok(p.some(d=>d.category===focus));
 }
});
test('109 distinct exercises include usable instructions and player constraints',()=>{
 assert.equal(drills.length,109);assert.equal(new Set(drills.map(d=>d.id)).size,109);
 for(const d of drills){assert.ok(d.steps.length>=3,d.id);assert.ok(d.steps.every(s=>s.length>=20&&s.length<210),d.id);assert.ok(d.min>=1&&d.min<=20,d.id)}
 assert.equal(drills.find(d=>d.id==='knockout').min,3);assert.equal(drills.find(d=>d.id==='shell').min,8);
});
test('Rejects invalid settings',()=>{
 for(const n of [0,21,-1,1.5,NaN])assert.throws(()=>makePlan(n,60,'all'));
 assert.throws(()=>makePlan(4,31,'all'));assert.throws(()=>makePlan(4,60,'unknown'));
});
test('Every instruction has a matching human photograph or the exact same scene record',()=>{
 const sources=JSON.parse(readFileSync(new URL('../assets/exercises/sources.json',import.meta.url)));
 for(const d of drills){
  if(d.media){assert.equal(d.media.frames.length,d.steps.length);assert.ok(sources[d.media.exercise]);for(const i of d.media.frames){assert.ok([0,1].includes(i));assert.ok(existsSync(new URL(`../assets/exercises/${d.media.exercise}-${i}.jpg`,import.meta.url)))}continue}
  assert.deepEqual(d.steps,guides[d.id].map(s=>s.text));
  for(let i=0;i<d.steps.length;i++){const s=guides[d.id][i];const svg=diagramFor(d,i);assert.ok(svg.includes('<svg'));assert.ok(svg.includes(d.title));assert.ok(!svg.includes('undefined'));assert.ok(!svg.includes('NaN'));
   for(const r of s.routes){assert.ok(r.points.length>=4&&r.points.length%2===0);assert.ok(r.points.every(n=>Number.isFinite(n)&&n>=0&&n<=560));
    if(['move','dribble'].includes(r.type)){const actor=s.actors[r.actor];assert.ok(actor,`${d.id}:${i}`);assert.deepEqual(r.points.slice(0,2),[actor.x,actor.y],`${d.id}:${i} route must start at its player`)}
   }
  }
 }
});
test('54321 follows latest correction: left start, two layups, then shots at 3, 2 and 1',()=>{
 const d=drills.find(d=>d.id==='countdown'),g=guides.countdown;
 assert.equal(d.steps.length,6);assert.equal(d.source,undefined);assert.equal(g[0].cones.length,4);
 assert.deepEqual(g[0].actors.map(p=>[p.x,p.y]),[[235,239]]);
 assert.deepEqual(g[0].cones.map(c=>[c.label,c.x,c.y]),[['0',300,239],['1',300,370],['2',525,125],['3',75,125]]);
 assert.deepEqual(g[1].routes.find(r=>r.type==='shot').points.slice(0,2),[270,100]);
 assert.deepEqual(g[2].routes.find(r=>r.type==='shot').points.slice(0,2),[330,100]);
 assert.ok(g[2].routes.find(r=>r.type==='dribble').points.some((n,i)=>i%2===1&&n>239));
 assert.deepEqual(g[3].routes.find(r=>r.type==='shot').points.slice(0,2),[75,150]);
 assert.deepEqual(g[4].routes.find(r=>r.type==='shot').points.slice(0,2),[525,150]);
 assert.deepEqual(g[5].routes.find(r=>r.type==='shot').points.slice(0,2),[300,390]);
 assert.deepEqual(g[4].actors.map(p=>[p.x,p.y]),[[75,150]]);
 assert.deepEqual(g[5].actors.map(p=>[p.x,p.y]),[[525,150]]);
 assert.equal(g.flatMap(s=>s.routes).filter(r=>r.type==='shot').length,5);
});
test('Slalom shows four cones; two-ball work and defensive shell have correct setups',()=>{
 assert.equal(guides.slalom[0].cones.length,4);
 assert.equal(guides.shell[0].actors.filter(p=>p.role==='defender').length,4);
 assert.equal(guides.shell[0].actors.filter(p=>p.role!=='defender').length,4);
 assert.equal(guides.knockout[0].balls.length,2);assert.equal(guides['two-balls'][1].pose,'two-balls');
 assert.equal(guides['bounce-pass'][2].surface,'bounce');
});
test('Card and detail diagram identifiers cannot collide',()=>{
 const d=drills.find(d=>d.id==='countdown');const ids=s=>[...s.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);const a=ids(diagramFor(d,1,'card')),b=ids(diagramFor(d,1,'detail'));assert.ok(!a.some(id=>b.includes(id)));
});
test('Full sessions end with stretching and selection rotates without mutating the library',()=>{
 for(const duration of [30,45,60,90]){const p=makePlan(1,duration,'all');assert.equal(p.at(-1).category,'stretching');assert.equal(p.at(-1).minutes,5);assert.ok(p.length<=8)}
 const before=drills.map(d=>d.id);assert.notDeepEqual(makePlan(4,30,'shooting',()=>0).map(d=>d.id),makePlan(4,30,'shooting',()=>.99).map(d=>d.id));assert.deepEqual(drills.map(d=>d.id),before);
});

test('Every stretching exercise has a verified local posture photo, used consistently rather than a fake start/end pair',()=>{
 const stretching=drills.filter(d=>d.category==='stretching');assert.equal(stretching.length,6);
 for(const d of stretching){assert.equal(d.media.kind,'photo');assert.ok(Number.isInteger(d.media.cover));assert.ok(d.media.frames.every(f=>f===d.media.cover));assert.ok(existsSync(new URL(`../assets/exercises/${d.media.exercise}-${d.media.cover}.jpg`,import.meta.url)))}
});

test('Every participant is assigned exactly once in every supported exercise and group size',()=>{
 for(const d of drills)for(let n=1;n<=20;n++){
  const o=participationFor(d,n);if(!o)continue;
  const members=o.groups.flatMap(g=>g.members);assert.equal(members.length,n,`${d.id}:${n}`);assert.deepEqual(members.map(m=>m.player),Array.from({length:n},(_,i)=>i+1));assert.ok(members.every(m=>m.role.length>4));assert.equal(o.waiting+o.active,n);if(o.kind!=='free-throws')assert.equal(o.waiting,0);
 }
});
test('Four players work in two pairs; fixed three-person exercises are excluded',()=>{
 for(const id of ['mirror','passing','form']){const o=participationFor(drills.find(d=>d.id===id),4);assert.deepEqual(o.groups.map(g=>g.size),[2,2]);assert.equal(o.active,4)}
 for(const id of ['weave','boxout','lane','two-one'])assert.equal(participationFor(drills.find(d=>d.id===id),4),null,id);
 const d=adaptForPlayers(drills.find(d=>d.id==='attack-closeout'),4,{baskets:1,balls:1});assert.equal(d.organization.groups[0].members.length,4);assert.equal(d.organization.groups[0].members.at(-1).role,'Savācējs');assert.ok(diagramFor(d,0).includes('>S</text>'));
});
test('Five-player shooting uses a triple and a pair, with no remainder',()=>{
 const d=drills.find(d=>d.id==='form'),o=participationFor(d,5,{baskets:2,balls:2});assert.deepEqual(o.groups.map(g=>g.size),[3,2]);assert.equal(o.requirements.baskets,2);assert.equal(o.active,5);
});
test('Inventory constrains the plan; incompatible or waiting games cannot sneak in',()=>{
 const solo=drills.find(d=>d.id==='countdown');assert.equal(participationFor(solo,4,{baskets:2,balls:4}),null);
 assert.ok(participationFor(solo,4,{baskets:4,balls:4}));
 for(const id of ['knockout','horse','partner-21'])assert.equal(participationFor(drills.find(d=>d.id===id),4),null);
 assert.equal(participationFor(drills.find(d=>d.id==='two-balls'),4,{baskets:2,balls:4}),null);
 assert.ok(participationFor(drills.find(d=>d.id==='two-balls'),4,{baskets:2,balls:8}));
 assert.throws(()=>makePlan(4,60,'shooting',Math.random,{baskets:0,balls:4}));
 for(const d of makePlan(4,60,'shooting',Math.random,{baskets:1,balls:1})){assert.equal(d.organization.players,4);assert.ok(d.organization.requirements.baskets<=1);assert.ok(d.organization.requirements.balls<=1)}
});
test('No generic blue humanoid remains in the demonstration renderer',()=>{
 for(const d of drills)if(!d.media)for(let i=0;i<d.steps.length;i++){const svg=diagramFor(d,i);assert.ok(!svg.includes('body-person'));assert.ok(!svg.includes('#188dcc'));assert.ok(!svg.includes('#168dd1'));}
});
test('The manifest and browser icons reference the supplied team logo',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url)));assert.equal(manifest.icons[0].src,'./assets/buki-logo.png');assert.equal(manifest.icons[0].sizes,'1000x1000');const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.ok(html.includes('rel="apple-touch-icon" href="./assets/buki-logo.png"'));assert.ok(!html.includes('icon.svg'));
});

test('A drill with a defined pair format does not acquire an invented third role',()=>{
 const paired=drills.find(d=>d.id==='give-go');assert.equal(participationFor(paired,5),null);assert.equal(participationFor(paired,3),null);assert.deepEqual(participationFor(paired,4).groups.map(g=>g.size),[2,2]);
});

import {measurePull} from '../pull-refresh.js';
test('Requested games remain available with explicitly labeled rotation',()=>{
 for(const id of ['countdown','knockout','horse','partner-21']){const d=drills.find(d=>d.id===id),o=participationFor(d,4,{baskets:1,balls:2},{allowRotation:true});assert.ok(o,id);assert.equal(o.groups.flatMap(g=>g.members).length,4);assert.equal(o.active+o.waiting,4);assert.ok(o.waiting>0);}
});
test('Two columns use one hoop, two balls and all four players in the continuous cycle',()=>{
 for(const d of drills.filter(d=>d.teamFormat==='columns')){const o=participationFor(d,4,{baskets:1,balls:2});assert.ok(o,d.id);assert.equal(o.active,4);assert.equal(o.waiting,0);assert.deepEqual(o.requirements,{baskets:1,balls:2});assert.equal(participationFor(d,4,{baskets:1,balls:1}),null);assert.equal(participationFor(d,6,{baskets:1,balls:2}),null);const r=participationFor(d,6,{baskets:1,balls:2},{allowRotation:true});assert.equal(r.waiting,2);}
 const g=guides['team-midrange'];assert.ok(g[3].routes.some(r=>r.type==='pass'&&r.points[0]<300&&r.points[2]>300));assert.ok(g[3].routes.some(r=>r.type==='pass'&&r.points[0]>300&&r.points[2]<300));
});
test('Ten free-throw attempts are inserted between main drills with unique entry identities and exact time budgets',()=>{
 for(const players of [1,4,5,12,20])for(const duration of [30,45,60,90]){
  const p=makePlan(players,duration,'shooting',()=>.5,{baskets:20,balls:40},{includeGames:true,freeThrows:true});
  assert.equal(p.reduce((s,d)=>s+d.minutes,0),duration);assert.equal(new Set(p.map(d=>d.entryKey)).size,p.length);
  for(let i=2;i<p.length;i+=2){assert.equal(p[i].id,'free-throws-10');assert.equal(p[i].shotsPerPlayer,10);assert.equal(p[i].organization.players,players)}
  assert.ok(p.every(d=>d.minutes>=2));
 }
});
test('Pull refresh arms only after a sufficient downward vertical drag',()=>{
 const start={x:100,y:10};assert.equal(measurePull(start,{x:100,y:70}).armed,false);assert.equal(measurePull(start,{x:100,y:160}).armed,true);assert.equal(measurePull(start,{x:300,y:160}).armed,false);assert.equal(measurePull(start,{x:100,y:0}).armed,false);
});
