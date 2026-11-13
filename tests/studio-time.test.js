import test from 'node:test';
import assert from 'node:assert/strict';
import {locateTime,phaseTime} from '../studio-time.js';
import {compileDraft,createDraft} from '../creator-model.js';
import {stateAt} from '../motion-player.js';
test('Continuous timeline resolves phase boundaries, end and out-of-range scrubbing',()=>{const motion=[{seconds:2},{seconds:3},{seconds:4}];assert.equal(locateTime(motion,-4).time,0);assert.deepEqual([locateTime(motion,2).index,locateTime(motion,2).fraction],[1,0]);assert.equal(locateTime(motion,3.5).fraction,.5);assert.equal(locateTime(motion,100).fraction,1);assert.equal(locateTime(motion,100).index,2);assert.equal(phaseTime(motion,2),5);assert.equal(locateTime([],5).index,-1)});
test('Scrubbed player and ball positions agree across shooting and rebound phase boundaries',()=>{const d=createDraft();d.actions=[{type:'shot',actor:1,result:'hit',seconds:2,note:''},{type:'collect',actor:2,path:[],seconds:3,note:''},{type:'pass',actor:2,to:0,seconds:2,note:''}];const built=compileDraft(d);const next=locateTime(built.motion,2);assert.deepEqual(stateAt(built.motion[0],1),stateAt(built.motion[next.index],next.fraction));const mid=locateTime(built.motion,3.5);assert.notDeepEqual(stateAt(built.motion[mid.index],mid.fraction).positions,built.start);});
