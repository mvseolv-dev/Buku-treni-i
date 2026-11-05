import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {makePlan,drills,categories} from '../training.js';
import {guides} from '../guides.js';
import {diagramFor} from '../diagrams.js';
test('All player counts, durations and focuses produce eligible plans with exact time budgets',()=>{
 for(let n=1;n<=20;n++)for(const duration of [30,45,60,90])for(const focus of ['all',...Object.keys(categories)]){
  const p=makePlan(n,duration,focus);
  assert.equal(p.reduce((s,d)=>s+d.minutes,0),duration);
  assert.equal(p[0].category,'warmup');assert.ok(p.every(d=>d.min<=n&&d.minutes>0));
  assert.equal(new Set(p.map(d=>d.id)).size,p.length);if(focus!=='all')assert.ok(p.some(d=>d.category===focus));
 }
});
test('100 distinct exercises include usable instructions and player constraints',()=>{
 assert.equal(drills.length,100);assert.equal(new Set(drills.map(d=>d.id)).size,100);
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
test('54321 matches user reference: four cones, left start, two layups, corner 3 then top 1, no corner 2 shot',()=>{
 const d=drills.find(d=>d.id==='countdown'),g=guides.countdown;
 assert.equal(d.steps.length,5);assert.equal(d.source,undefined);assert.equal(g[0].cones.length,4);
 assert.deepEqual(g[0].actors.map(p=>[p.x,p.y]),[[235,239]]);
 assert.deepEqual(g[0].cones.map(c=>[c.label,c.x,c.y]),[['0',300,239],['1',300,370],['2',525,125],['3',75,125]]);
 assert.deepEqual(g[1].routes.find(r=>r.type==='shot').points.slice(0,2),[270,100]);
 assert.deepEqual(g[2].routes.find(r=>r.type==='shot').points.slice(0,2),[330,100]);
 assert.ok(g[2].routes.find(r=>r.type==='dribble').points.some((n,i)=>i%2===1&&n>239));
 assert.deepEqual(g[3].routes.find(r=>r.type==='shot').points.slice(0,2),[75,150]);
 assert.deepEqual(g[4].routes.find(r=>r.type==='shot').points.slice(0,2),[300,390]);
 assert.ok(g.every(s=>s.routes.filter(r=>r.type==='shot').every(r=>r.points[0]<500)));
 assert.equal(g.flatMap(s=>s.routes).filter(r=>r.type==='shot').length,4);
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
