import test from 'node:test';
import assert from 'node:assert/strict';
import {generatePlan,modes,gameRounds,lightDrill,organizationFor} from '../planner.js';
import {motionDrills} from '../motion-data.js';

test('All modes and player counts keep exact time budgets and respect every inventory limit',()=>{
 for(const mode of Object.keys(modes))for(const duration of modes[mode].durations)for(let players=1;players<=12;players++)for(const tomorrow of ['free','training','game'])for(const baskets of [1,2])for(const balls of [1,2])for(const cones of [0,6]){
  const p=generatePlan({mode,duration,players,tomorrow,baskets,balls,cones},players+cones);
  assert.equal(p.entries.reduce((n,e)=>n+e.minutes,0),p.settings.duration);
  assert.equal(new Set(p.entries.map(e=>e.key)).size,p.entries.length);
  assert.ok(p.entries.every(e=>Number.isInteger(e.minutes)&&e.minutes>0));
  for(const e of p.entries){for(const key of ['balls','cones','baskets'])assert.ok(e.required[key]<=p.settings[key],`${mode}/${players}: ${key}`);
   if(e.organization){const flat=e.organization.groups.flat().sort((a,b)=>a-b);assert.deepEqual(flat,Array.from({length:players},(_,i)=>i+1));for(const group of e.organization.groups)assert.ok(group.length>=motionDrills.find(d=>d.id===e.id).teamSize)}
  }
 }
});
test('Pre-match plans and tomorrow-game safeguards exclude conditioning, live games and contact examples',()=>{
 for(let players=1;players<=12;players++)for(const mode of ['prematch','warmup','full']){
  const p=generatePlan({mode,duration:modes[mode].duration,players,balls:2,baskets:2,cones:10,tomorrow:'game'});
  assert.ok(!p.entries.some(e=>e.kind==='game'||e.phase==='Fiziskā daļa'));
  for(const e of p.entries.filter(e=>e.id))assert.ok(lightDrill(motionDrills.find(d=>d.id===e.id)));
  if(mode==='full')assert.ok(p.settings.duration<=60);
  if(mode==='warmup')assert.equal(p.entries.at(-1).phase,'Gatavība spēlei');
 }
});
test('Full cycle has warm-up, conditioning, shooting, game and cool-down; solo substitutions are truthful',()=>{
 for(let players=1;players<=12;players++){
  const p=generatePlan({mode:'full',duration:90,players,balls:1,cones:0,baskets:1,tomorrow:'free'});
  assert.equal(p.entries[0].phase,'Iesildīšanās');assert.equal(p.entries.at(-1).phase,'Atsildīšanās');
  for(const phase of ['Fiziskā daļa','Metieni','Spēles daļa'])assert.ok(p.entries.some(e=>e.phase===phase));
  if(players===1){assert.ok(!p.entries.some(e=>e.kind==='game'));assert.ok(!p.entries.some(e=>e.phase==='Piespēles'||e.phase==='Sadarbības'))}
 }
});
test('Odd-player game rotations assign everyone exactly once and eventually include everyone in both teams',()=>{
 for(let n=2;n<=12;n++){const rounds=gameRounds(n);const teams=[new Set(),new Set()];for(const r of rounds){assert.equal(r.a.length,r.b.length);assert.deepEqual([...r.a,...r.b,...r.waiting].sort((a,b)=>a-b),Array.from({length:n},(_,i)=>i+1));r.a.forEach(x=>teams[0].add(x));r.b.forEach(x=>teams[1].add(x))}teams.forEach(t=>assert.equal(t.size,n))}
});
test('Cone drills cannot enter a plan with insufficient cones; parallel stations multiply actual equipment',()=>{
 const d=motionDrills.find(d=>d.id==='buki-cones-triangle');
 assert.equal(organizationFor(d,{players:6,balls:2,cones:2,baskets:2}),null);
 const org=organizationFor(d,{players:6,balls:2,cones:6,baskets:2});assert.equal(org.groups.length,2);assert.equal(org.cones,6);assert.equal(org.balls,2);
});
