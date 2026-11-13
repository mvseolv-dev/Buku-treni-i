import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraft,compileDraft,finalState,readSavedDrafts,saveDraftRecord,parseDraft,CUSTOM_KEY} from '../creator-model.js';
import {stateAt} from '../motion-player.js';
const move=(actor,path)=>({type:'move',actor,path,seconds:3,note:''});
const pass=(actor,to)=>({type:'pass',actor,to,seconds:2,note:''});
const shot=(actor,result='hit',landing=[365,160])=>({type:'shot',actor,result,landing,seconds:2.5,note:''});
const collect=actor=>({type:'collect',actor,path:[],seconds:3,note:''});
function example(){const d=createDraft();d.actions=[move(0,[[108,207],[205,277]]),pass(1,0),shot(0),collect(2),pass(2,1),move(0,[[110,330]])];return d}

test('Custom pass, shot, partner rebound and next movement compile into continuous animated steps',()=>{const d=example(),out=compileDraft(d);assert.equal(out.teamSize,3);assert.equal(out.motion.length,6);for(let i=1;i<out.motion.length;i++)assert.deepEqual(out.motion[i].before,out.motion[i-1].after);assert.equal(out.motion[3].after.balls[0].owner,2);assert.equal(finalState(d).balls[0].owner,1);assert.deepEqual(stateAt(out.motion[5],1).positions[0],[110,330]);assert.equal(out.custom,true)});
test('A missed shot lands at the authored point and the selected rebounder collects that actual ball',()=>{const d=createDraft();d.actions=[shot(1,'miss',[430,190]),collect(0)];const out=compileDraft(d);assert.deepEqual(stateAt(out.motion[0],1).ball,[430,190]);assert.deepEqual(stateAt(out.motion[1],0).ball,[430,190]);assert.deepEqual(stateAt(out.motion[1],1).positions[0],[404,188]);assert.equal(out.motion[1].after.balls[0].owner,0)});
test('Impossible ownership sequences are rejected instead of teleporting a ball',()=>{for(const actions of [[pass(0,2)],[shot(0)],[pass(1,1)],[collect(0)],[shot(1),pass(1,0)],[shot(1),shot(1)]]){const d=createDraft();d.actions=actions;assert.throws(()=>compileDraft(d))}const d=createDraft();d.initialOwner=null;d.actions=[move(0,[[200,300]])];assert.equal(compileDraft(d).balls,0);d.actions.push(pass(0,1));assert.throws(()=>compileDraft(d))});
test('Editing a pass destination cannot silently make a later shot come from a non-holder',()=>{const d=example();d.actions[1]=pass(1,2);assert.throws(()=>compileDraft(d),/3\. solis/)});
test('Import validates limits, coordinates, identities and visible text before use',()=>{const d=example();assert.equal(parseDraft(JSON.stringify(d)).id,d.id);assert.throws(()=>parseDraft('{broken'));assert.throws(()=>parseDraft(' '.repeat(200001)));for(const patch of [{id:'<script>'},{start:[[0,0]]},{start:[[110,330],[110,330]]},{cones:Array.from({length:31},()=>[200,200])},{defenders:[99]},{name:'a'}])assert.throws(()=>compileDraft({...d,...patch}));assert.throws(()=>compileDraft({...d,actions:[{...pass(1,0),seconds:0}]}));assert.throws(()=>compileDraft({...d,actions:[{...pass(1,0),note:'a'.repeat(301)}]}))});
test('Saving edits preserves identity, survives a reload and reports storage failure',()=>{const m=new Map(),storage={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};const d=example();saveDraftRecord(storage,d);d.name='Mans labotais vingrinājums';saveDraftRecord(storage,d);const saved=readSavedDrafts(storage);assert.equal(saved.length,1);assert.equal(saved[0].name,d.name);assert.equal(saved[0].id,d.id);assert.ok(m.has(CUSTOM_KEY));assert.throws(()=>saveDraftRecord({getItem:()=>null,setItem:()=>{throw Error('quota')}},d),/Neizdevās saglabāt/)});
test('An unfinished draft can be exported but cannot enter the finished library',()=>{const d=createDraft();compileDraft(d,{allowEmpty:true});assert.equal(parseDraft(JSON.stringify(d)).actions.length,0);assert.throws(()=>compileDraft(d),/vismaz vienu darbību/)});


test('Two balls preserve independent ownership through simultaneous pass and shot, rebound and outlet',()=>{
 const d=createDraft();d.initialBalls=[{owner:0},{owner:1}];d.actions=[{...pass(0,2),ball:0},{...shot(1,'miss',[430,190]),ball:1,parallel:true},{...collect(0),ball:1},{...pass(0,1),ball:1}];
 const out=compileDraft(d);assert.equal(out.balls,2);assert.equal(out.motion.length,3);assert.equal(out.motion[0].actions.length,2);assert.deepEqual(out.motion[0].after.balls,[{owner:2},{point:[430,190]}]);assert.equal(finalState(d).balls[1].owner,1);
 for(let i=1;i<out.motion.length;i++)assert.deepEqual(stateAt(out.motion[i-1],1),stateAt(out.motion[i],0));
 const mid=stateAt(out.motion[0],.5);assert.equal(mid.balls.length,2);assert.notDeepEqual(mid.balls,stateAt(out.motion[0],0).balls);
 assert.deepEqual(parseDraft(JSON.stringify(d)),d);
});
test('Parallel movement supports a moving receiver and rejects duplicate ball use or conflicting routes',()=>{
 const d=createDraft();d.initialBalls=[{owner:0},{owner:1}];d.actions=[pass(0,2),{...move(2,[[430,360]]),parallel:true}];assert.equal(compileDraft(d).motion[0].moves.length,1);assert.deepEqual(finalState(d).positions[2],[430,360]);
 d.actions=[pass(0,2),{...shot(0),parallel:true}];assert.throws(()=>compileDraft(d),/jau ir darbība/);
 d.actions=[move(2,[[430,360]]),{...move(2,[[440,300]]),parallel:true}];assert.throws(()=>compileDraft(d),/jau ir kustības ceļš/);
});
test('Multi-ball boundaries, ground setup, two-ball dribble and legacy saved records remain valid',()=>{
 const d=createDraft();d.initialBalls=[{owner:0},{owner:0},{point:[430,190]}];d.actions=[move(0,[[200,300]]),{...collect(2),ball:2}];assert.equal(compileDraft(d).balls,3);assert.equal(finalState(d).balls[2].owner,2);assert.notDeepEqual(stateAt(compileDraft(d).motion[0],.5).balls[0],stateAt(compileDraft(d).motion[0],.5).balls[1]);
 assert.throws(()=>compileDraft({...d,initialBalls:Array.from({length:13},()=>({owner:0}))}));assert.throws(()=>compileDraft({...d,actions:[{...pass(0,1),ball:9}]}));assert.throws(()=>compileDraft({...d,actions:Array.from({length:81},()=>({...move(0,[[200,300]]),parallel:true}))}));
 const legacy=example(),storage={getItem:()=>JSON.stringify([legacy,d])};assert.equal(readSavedDrafts(storage).length,2);
});

test('Passes can target a court point and the selected receiver collects that same ball',()=>{const d=createDraft();d.actions=[{...pass(1,0),target:[420,210]},collect(2),pass(2,0)];const out=compileDraft(d);assert.deepEqual(stateAt(out.motion[0],1).ball,[420,210]);assert.deepEqual(stateAt(out.motion[1],0).ball,[420,210]);assert.equal(finalState(d).balls[0].owner,0);assert.throws(()=>compileDraft({...d,actions:[{...pass(1,0),target:[999,999]}]}));});
test('Shot flight and rebound follow a custom aim point, including mirrored-ready route data',()=>{const d=createDraft();d.actions=[{...shot(1,'miss',[450,230]),target:[460,100]},collect(0)];const out=compileDraft(d);assert.deepEqual(stateAt(out.motion[0],.78).ball,[460,100]);assert.deepEqual(stateAt(out.motion[0],1).ball,[450,230]);assert.deepEqual(out.motion[0].action.target,[460,100]);assert.deepEqual(parseDraft(JSON.stringify(d)),d);assert.throws(()=>compileDraft({...d,actions:[{...shot(1),target:[null,100]}]}));});
