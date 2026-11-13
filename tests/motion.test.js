import test from 'node:test';
import assert from 'node:assert/strict';
import {motionDrills,rotationFor} from '../motion-data.js';
import {stateAt} from '../motion-player.js';

test('32 original sequences cover solo work, pairs, small groups and team play',()=>{
 assert.equal(motionDrills.length,32);assert.equal(new Set(motionDrills.map(d=>d.id)).size,32);
 for(const n of [1,2,3,4,5,6,8,10])assert.ok(motionDrills.some(d=>d.teamSize===n));
 for(const category of ['Metieni','Noslēgumi','Dribls','Aizsardzība','Piespēles','Komandas darbs'])assert.ok(motionDrills.some(d=>d.category===category));
});
test('Every player count from 1 to 12 has eligible drills; rotation includes everyone exactly once and shares every role',()=>{
 for(let count=1;count<=12;count++){
  const eligible=motionDrills.filter(d=>d.players.includes(count));assert.ok(eligible.length);
  for(const d of eligible){const roles=Array.from({length:d.teamSize},()=>new Set());
   for(let round=0;round<count;round++){const {active,waiting}=rotationFor(d,count,round);assert.equal(active.length,d.teamSize);assert.deepEqual([...active,...waiting].sort((a,b)=>a-b),Array.from({length:count},(_,i)=>i+1));active.forEach((n,i)=>roles[i].add(n))}
   roles.forEach(role=>assert.equal(role.size,count,`${d.id}: every person gets every role`));
  }
 }
 assert.throws(()=>rotationFor(motionDrills.find(d=>d.teamSize===10),9));
});
test('Every pass and shot comes from the actual ball holder; all steps preserve state and participants',()=>{
 for(const d of motionDrills){let previous=null;
  assert.equal(d.start.length,d.teamSize);assert.ok(d.motion.length>=2);assert.ok(d.motion.every(s=>s.title&&s.text&&s.seconds>=1));
  for(const s of d.motion){
   if(previous)assert.deepEqual(s.before,previous,`${d.id}: state continuity`);
   const a=s.action;
   if(a?.type==='pass'){assert.equal(s.before.balls[0]?.owner,a.from,d.id);assert.ok(a.to<d.teamSize&&a.to!==a.from);assert.equal(s.after.balls[0]?.owner,a.to)}
   if(a?.type==='shot')assert.equal(s.before.balls[0]?.owner,a.actor,d.id);
   if(a?.type==='collect'){assert.ok(s.before.balls[0]?.point,d.id);assert.equal(s.after.balls[0]?.owner,a.actor)}
   for(const m of s.moves){assert.deepEqual(m.path[0],s.before.positions[m.actor]);assert.deepEqual(m.path.at(-1),s.after.positions[m.actor])}
   for(const f of [0,.1,.25,.5,.75,.9,1]){const state=stateAt(s,f);assert.equal(state.positions.length,d.teamSize);for(const [x,y] of state.positions){assert.ok(Number.isFinite(x)&&x>=50&&x<=550,d.id);assert.ok(Number.isFinite(y)&&y>=100&&y<=490,d.id)}if(state.ball)assert.ok(state.ball.every(Number.isFinite))}
   assert.deepEqual(stateAt(s,0).positions,s.before.positions);assert.deepEqual(stateAt(s,1).positions,s.after.positions);previous=s.after;
  }
 }
});
