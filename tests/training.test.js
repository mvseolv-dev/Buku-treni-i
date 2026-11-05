import test from 'node:test';
import assert from 'node:assert/strict';
import {makePlan,drills,categories} from '../training.js';
test('All player counts, durations and focuses produce suitable plans with exact time budgets',()=>{
 for(let n=1;n<=20;n++)for(const duration of [30,45,60,90])for(const focus of ['all',...Object.keys(categories)]){
  const plan=makePlan(n,duration,focus);
  assert.equal(plan.reduce((s,d)=>s+d.minutes,0),duration);
  assert.equal(plan[0].category,'warmup');
  assert.ok(plan.every(d=>d.min<=n&&d.minutes>0));
  assert.equal(new Set(plan.map(d=>d.id)).size,plan.length);
  if(focus!=='all')assert.ok(plan.some(d=>d.category===focus));
 }
});
test('Solo defense excludes partner exercise; teams include it',()=>{
 assert.ok(!makePlan(1,60,'defense').some(d=>d.id==='mirror'));
 assert.ok(drills.some(d=>d.id==='mirror'&&d.min===2));
});
test('Rejects invalid settings',()=>{
 for(const n of [0,21,-1,1.5,NaN])assert.throws(()=>makePlan(n,60,'all'));
 assert.throws(()=>makePlan(4,31,'all'));assert.throws(()=>makePlan(4,60,'unknown'));
});
test('Every drill has actionable steps and a unique id',()=>{
 assert.equal(new Set(drills.map(d=>d.id)).size,drills.length);
 assert.ok(drills.every(d=>d.steps.length>=3&&d.steps.every(s=>s.length>20)));
});

import {diagramFor} from '../diagrams.js';
import {diagramConfigs} from '../extra-drills.js';
import {phaseRoutes} from '../diagram-phases.js';
test('Every exercise has its own valid diagram and an explicit phase for every instruction',()=>{
 for(const d of drills){
  const key=d.scene||d.id;const config=diagramConfigs[key];
  assert.ok(config, d.id);assert.equal(phaseRoutes[key].length,d.steps.length,d.id);
  for(const indexes of phaseRoutes[key])for(const i of indexes)assert.ok(config[2][i],`${d.id}: route ${i}`);
  for(let i=0;i<d.steps.length;i++){const svg=diagramFor(d,i);assert.ok(svg.includes('<svg'));assert.ok(svg.includes(d.title));assert.ok(!svg.includes('undefined'));}
 }
});
test('Plans have time to practice; full training contains different skill groups',()=>{
 for(const duration of [30,45,60,90]){
  const p=makePlan(8,duration,'all',()=>0.5);
  assert.ok(p.length<=8);assert.ok(p.every(d=>d.minutes>=4));
  assert.ok(new Set(p.map(d=>d.category)).size>=4);
 }
});
test('Selection can rotate without mutating the drill library',()=>{
 const before=drills.map(d=>d.id);
 assert.notDeepEqual(makePlan(4,30,'shooting',()=>0).map(d=>d.id),makePlan(4,30,'shooting',()=>0.99).map(d=>d.id));
 assert.deepEqual(drills.map(d=>d.id),before);
});
test('Knockout, shell and two-ball dribbling have the required setups',()=>{
 assert.equal(drills.find(d=>d.id==='knockout').min,3);
 assert.equal(drills.find(d=>d.id==='shell').min,8);
 assert.ok(diagramFor(drills.find(d=>d.id==='knockout')).includes('2 BUMBAS'));
 assert.ok(diagramFor(drills.find(d=>d.id==='plank'),1).includes('SKATS NO SĀNIEM'));
});
