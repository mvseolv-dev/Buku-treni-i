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
 assert.ok(makePlan(2,60,'defense').some(d=>d.id==='mirror'));
});
test('Rejects invalid settings',()=>{
 for(const n of [0,21,-1,1.5,NaN])assert.throws(()=>makePlan(n,60,'all'));
 assert.throws(()=>makePlan(4,31,'all'));assert.throws(()=>makePlan(4,60,'unknown'));
});
test('Every drill has actionable steps and a unique id',()=>{
 assert.equal(new Set(drills.map(d=>d.id)).size,drills.length);
 assert.ok(drills.every(d=>d.steps.length>=3&&d.steps.every(s=>s.length>20)));
});
