import {COURT} from './motion-data.js?v=20261113d';
export const CUSTOM_KEY='buki-custom-drills-v1';
export const DRAFT_KEY='buki-creator-draft-v1';
const copy=x=>JSON.parse(JSON.stringify(x));
const categories=['Metieni','Noslēgumi','Piespēles','Dribls','Aizsardzība','Aizsegi','Komandas darbs'];
const point=(p,bounds=[55,545,105,485])=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=bounds[0]&&p[0]<=bounds[1]&&p[1]>=bounds[2]&&p[1]<=bounds[3];
export function createDraft(){return {version:1,id:'custom-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)),name:'Mans animētais vingrinājums',category:'Metieni',start:[[110,330],[300,420],[490,330]],defenders:[],cones:[],initialOwner:1,actions:[]}}
export function defaultPositions(count){const spots=[[110,330],[300,420],[490,330],[90,150],[510,150],[230,180],[370,180],[180,430],[420,430],[190,300],[410,300],[300,275]];return copy(spots.slice(0,count))}
function compileSingle(input,{allowEmpty=false,continuation=false}={}){
 if(!input||input.version!==1)throw Error('Neatpazīts vingrinājuma formāts.');
 const d=copy(input);if(typeof d.id!=='string'||!/^custom-[a-zA-Z0-9-]{1,80}$/.test(d.id))throw Error('Nederīgs vingrinājuma identifikators.');
 if(typeof d.name!=='string'||d.name.trim().length<3||d.name.length>100)throw Error('Nosaukumam jābūt 3-100 rakstzīmēm.');
 if(!categories.includes(d.category))throw Error('Izvēlies vingrinājuma kategoriju.');
 if(!Array.isArray(d.start)||d.start.length<1||d.start.length>12||!d.start.every(p=>point(p)))throw Error('Spēlētājiem jāatrodas laukumā; atļauti 1-12 spēlētāji.');
 if(!continuation)for(let i=0;i<d.start.length;i++)for(let j=i+1;j<d.start.length;j++)if(Math.hypot(d.start[i][0]-d.start[j][0],d.start[i][1]-d.start[j][1])<32)throw Error('Sākumā nenovieto spēlētājus vienu virs otra.');
 const validActor=i=>Number.isInteger(i)&&i>=0&&i<d.start.length;
 if(d.initialBalls===undefined&&d.initialOwner!==null&&!validActor(d.initialOwner))throw Error('Norādi, kuram sākumā ir bumba.');
 if(!Array.isArray(d.defenders)||d.defenders.some(i=>!validActor(i))||new Set(d.defenders).size!==d.defenders.length)throw Error('Pārbaudi aizsargu numurus.');
 if(!Array.isArray(d.cones)||d.cones.length>30||!d.cones.every(p=>point(p,[40,560,45,495])))throw Error('Atļauti līdz 30 konusiem laukumā.');
 if(!Array.isArray(d.actions)||d.actions.length>80||(!allowEmpty&&!d.actions.length))throw Error('Pievieno vismaz vienu darbību; vienā vingrinājumā atļauti 80 soļi.');
 const initial=d.initialBalls??(d.initialOwner===null?[]:[{owner:d.initialOwner}]);if(!Array.isArray(initial)||initial.length>12||initial.some(b=>!b||(b.owner!==undefined?!validActor(b.owner):!point(b.point,[90,530,120,470]))))throw Error('Atļautas 0-12 bumbas ar turētāju vai vietu laukumā.');let positions=copy(d.start),balls=copy(initial),motion=[];
 for(const [i,a] of d.actions.entries()){
  const fail=message=>{throw Error(`${i+1}. solis: ${message}`)};
  if(!a||!['move','pass','shot','collect','wait'].includes(a.type))fail('neatpazīta darbība.');
  if(!Number.isFinite(a.seconds)||a.seconds<1||a.seconds>15)fail('ilgums var būt 1-15 sekundes.');
  if(a.parallel!==undefined&&typeof a.parallel!=='boolean')fail('pārbaudi vienlaicīgās darbības izvēli.');
  if(typeof a.note!=='string'||a.note.length>300)fail('paskaidrojums var būt līdz 300 rakstzīmēm.');
  const bi=a.ball??0;if(!Number.isInteger(bi)||bi<0||(a.type!=='move'&&a.type!=='wait'&&bi>=balls.length))fail('izvēlies esošu bumbu.');const before={positions:copy(positions),balls:copy(balls)},owner=balls[bi]?.owner;let moves=[],action=null,title='',text='';
  const route=actor=>{if(!validActor(actor))fail('izvēlies esošu spēlētāju.');if(!Array.isArray(a.path)||a.path.length>30||!a.path.every(p=>point(p)))fail('kustības punktiem jāatrodas laukumā.');return [copy(positions[actor]),...copy(a.path)]};
  if(a.type==='move'){const carrying=balls.some(b=>b.owner===a.actor);const path=route(a.actor);if(path.length<2)fail('iezīmē vismaz vienu kustības galapunktu.');moves=[{actor:a.actor,path}];positions[a.actor]=copy(path.at(-1));title=carrying?'Dribls':'Pārvietošanās';text=`${a.actor+1}. spēlētājs ${carrying?'pārvietojas ar driblu':'pārvietojas bez bumbas'} pa norādīto ceļu.`}
  if(a.type==='pass'){if(owner===undefined)fail('vispirms savāc bumbu.');if(a.actor!==owner)fail(`bumba ir ${owner+1}. spēlētājam.`);if(a.target!==undefined){if(!point(a.target,[90,530,120,470]))fail('piespēles mērķim jāatrodas laukumā.');action={type:'pass',from:owner,target:copy(a.target)};balls[bi]={point:copy(a.target)};text=`${owner+1}. piespēlē uz norādīto vietu laukumā. Nākamajā solī izvēlies bumbas saņēmēju.`}else{if(!validActor(a.to)||a.to===owner)fail('izvēlies citu piespēles saņēmēju.');action={type:'pass',from:owner,to:a.to};balls[bi]={owner:a.to};text=`${owner+1}. piespēlē ${a.to+1}. spēlētājam.`}title='Piespēle';}
  if(a.type==='shot'){if(owner===undefined||a.actor!==owner)fail('metienu var izpildīt tikai spēlētājs ar bumbu.');const target=a.target??COURT.rim;if(!point(target,[40,560,40,495]))fail('metiena mērķim jāatrodas laukumā.');const landing=a.result==='miss'?a.landing:a.target?[Math.max(90,Math.min(530,target[0])),Math.max(120,Math.min(470,target[1]+37))]:COURT.rebound;if(!['hit','miss'].includes(a.result)||!point(landing,[90,530,120,470]))fail('norādi bumbas savākšanas vietu laukumā.');action={type:'shot',actor:owner,result:a.result,target:copy(target)};balls[bi]={point:copy(landing)};title='Metiens';text=`${owner+1}. met no savas pašreizējās vietas${a.target?' uz norādīto mērķi':''}. ${a.result==='hit'?'Shēmā parādīts trāpījums.':'Bumba pēc metiena atlec uz norādīto savākšanas vietu.'}`}
  if(a.type==='collect'){if(owner!==undefined||!balls[bi]?.point)fail('bumbu vispirms jāizmet; to pašlaik tur spēlētājs vai tās nav.');const path=route(a.actor),landing=balls[bi].point,target=bi===0?[landing[0]-26,landing[1]-2]:[landing[0]-36*Math.cos(bi*2.4),landing[1]-2-36*Math.sin(bi*2.4)];target[0]=Math.max(55,Math.min(545,target[0]));target[1]=Math.max(105,Math.min(485,target[1]));path.push(target);moves=[{actor:a.actor,path}];positions[a.actor]=copy(target);action={type:'collect',actor:a.actor};balls[bi]={owner:a.actor};title='Savāc bumbu';text=`${a.actor+1}. dodas pie bumbas, savāc to un turpina nākamo darbību.`}
  if(a.type==='wait'){title='Pauze / pozīcija';text='Spēlētāji saglabā savas vietas.'}
  if(action)action.ball=bi;motion.push({title,text:a.note.trim()?text+' '+a.note.trim():text,moves,action,seconds:a.seconds,before,after:{positions:copy(positions),balls:copy(balls)}});
 }
 return {id:d.id,name:d.name.trim(),category:d.category,original:'Mans veidotais vingrinājums',custom:true,draft:d,teamSize:d.start.length,players:Array.from({length:13-d.start.length},(_,i)=>i+d.start.length),start:copy(d.start),cones:copy(d.cones),defenders:copy(d.defenders),balls:initial.length,baskets:d.actions.some(a=>a.type==='shot')?1:0,videos:[],motion,tip:'Paša veidota mācību secība. Pirms treniņa pārbaudi spēlētāju ceļus un atstāj brīvu vietu metieniem un piezemēšanās zonai.'};
}
export function compileDraft(input,options={}){
 if(!Array.isArray(input?.actions)||input.actions.length>80)return compileSingle(input,options);
 if(!input.actions.some(a=>a?.parallel))return compileSingle(input,options);
 const groups=[];for(const a of input.actions){if(a.parallel&&groups.length)groups.at(-1).push(a);else groups.push([a])}
 const seed=compileSingle({...input,actions:[]},{allowEmpty:true});let state={positions:copy(input.start),balls:copy(input.initialBalls??(input.initialOwner===null?[]:[{owner:input.initialOwner}]))};const motion=[];
 for(const [gi,events] of groups.entries()){
  const before=copy(state),after=copy(state),moves=[],actions=[],texts=[],usedActors=new Set(),usedBalls=new Set();let seconds=0;
  for(const event of events){const one=compileSingle({...input,start:before.positions,initialBalls:before.balls,actions:[{...event,parallel:false}]},{continuation:true});const phase=one.motion[0];
   for(const m of phase.moves){if(usedActors.has(m.actor))throw Error(`${gi+1}. solī spēlētājam jau ir kustības ceļš.`);usedActors.add(m.actor);moves.push(m);after.positions[m.actor]=copy(phase.after.positions[m.actor])}
   if(phase.action){const bi=event.ball??0;if(usedBalls.has(bi))throw Error(`${gi+1}. solī bumbai B${bi+1} jau ir darbība.`);usedBalls.add(bi);actions.push(phase.action);after.balls[bi]=copy(phase.after.balls[bi])}
   texts.push((before.balls.length>1&&phase.action?`B${(event.ball??0)+1}: `:'')+phase.text);seconds=Math.max(seconds,phase.seconds);
  }
  for(const a of actions)if(a.type==='collect'&&moves.some(m=>m.actor===a.actor&&m.path.at(-1)[0]!==after.positions[a.actor][0]))throw Error('Pārbaudi bumbas savācēja kustību.');
  motion.push({title:events.length>1?'Vienlaicīgas darbības':compileSingle({...input,start:before.positions,initialBalls:before.balls,actions:[events[0]]},{continuation:true}).motion[0].title,text:texts.join(' '),before,after,moves,actions,eventTexts:texts,action:actions[0]??null,seconds});state=after;
 }
 return {...seed,draft:copy(input),motion,baskets:input.actions.some(a=>a.type==='shot')?1:0};
}
export function finalState(draft){const d=compileDraft(draft,{allowEmpty:true});return d.motion.length?copy(d.motion.at(-1).after):{positions:copy(d.start),balls:copy(draft.initialBalls??(draft.initialOwner===null?[]:[{owner:draft.initialOwner}]))}}
export function readSavedDrafts(storage){try{const values=JSON.parse(storage.getItem(CUSTOM_KEY)||'[]');if(!Array.isArray(values))return [];const seen=new Set();return values.slice(0,50).filter(d=>{try{compileDraft(d);if(seen.has(d.id))return false;seen.add(d.id);return true}catch{return false}})}catch{return []}}
export function saveDraftRecord(storage,draft){compileDraft(draft);let list=readSavedDrafts(storage),i=list.findIndex(d=>d.id===draft.id);if(i>=0)list[i]=copy(draft);else{if(list.length>=50)throw Error('Šajā ierīcē saglabāti 50 vingrinājumi. Eksportē rezerves kopiju vai rediģē esošu.');list.push(copy(draft))}try{storage.setItem(CUSTOM_KEY,JSON.stringify(list))}catch{throw Error('Neizdevās saglabāt ierīcē. Izmanto eksportu failā.')}return list}
export function parseDraft(text){if(typeof text!=='string'||text.length>200000)throw Error('Vingrinājuma fails ir pārāk liels.');let d;try{d=JSON.parse(text)}catch{throw Error('Neizdevās nolasīt JSON failu.')}compileDraft(d,{allowEmpty:true});return d}

