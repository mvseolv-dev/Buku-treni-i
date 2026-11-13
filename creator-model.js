import {COURT} from './motion-data.js?v=20261113d';
export const CUSTOM_KEY='buki-custom-drills-v1';
export const DRAFT_KEY='buki-creator-draft-v1';
const copy=x=>JSON.parse(JSON.stringify(x));
const categories=['Metieni','Noslēgumi','Piespēles','Dribls','Aizsardzība','Aizsegi','Komandas darbs'];
const point=(p,bounds=[55,545,105,485])=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=bounds[0]&&p[0]<=bounds[1]&&p[1]>=bounds[2]&&p[1]<=bounds[3];
export function createDraft(){return {version:1,id:'custom-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)),name:'Mans animētais vingrinājums',category:'Metieni',start:[[110,330],[300,420],[490,330]],defenders:[],cones:[],initialOwner:1,actions:[]}}
export function defaultPositions(count){const spots=[[110,330],[300,420],[490,330],[90,150],[510,150],[230,180],[370,180],[180,430],[420,430],[190,300],[410,300],[300,275]];return copy(spots.slice(0,count))}
export function compileDraft(input,{allowEmpty=false}={}){
 if(!input||input.version!==1)throw Error('Neatpazīts vingrinājuma formāts.');
 const d=copy(input);if(typeof d.id!=='string'||!/^custom-[a-zA-Z0-9-]{1,80}$/.test(d.id))throw Error('Nederīgs vingrinājuma identifikators.');
 if(typeof d.name!=='string'||d.name.trim().length<3||d.name.length>100)throw Error('Nosaukumam jābūt 3-100 rakstzīmēm.');
 if(!categories.includes(d.category))throw Error('Izvēlies vingrinājuma kategoriju.');
 if(!Array.isArray(d.start)||d.start.length<1||d.start.length>12||!d.start.every(p=>point(p)))throw Error('Spēlētājiem jāatrodas laukumā; atļauti 1-12 spēlētāji.');
 for(let i=0;i<d.start.length;i++)for(let j=i+1;j<d.start.length;j++)if(Math.hypot(d.start[i][0]-d.start[j][0],d.start[i][1]-d.start[j][1])<32)throw Error('Sākumā nenovieto spēlētājus vienu virs otra.');
 const validActor=i=>Number.isInteger(i)&&i>=0&&i<d.start.length;
 if(d.initialOwner!==null&&!validActor(d.initialOwner))throw Error('Norādi, kuram sākumā ir bumba.');
 if(!Array.isArray(d.defenders)||d.defenders.some(i=>!validActor(i))||new Set(d.defenders).size!==d.defenders.length)throw Error('Pārbaudi aizsargu numurus.');
 if(!Array.isArray(d.cones)||d.cones.length>30||!d.cones.every(p=>point(p,[40,560,45,495])))throw Error('Atļauti līdz 30 konusiem laukumā.');
 if(!Array.isArray(d.actions)||d.actions.length>80||(!allowEmpty&&!d.actions.length))throw Error('Pievieno vismaz vienu darbību; vienā vingrinājumā atļauti 80 soļi.');
 let positions=copy(d.start),balls=d.initialOwner===null?[]:[{owner:d.initialOwner}],motion=[];
 for(const [i,a] of d.actions.entries()){
  const fail=message=>{throw Error(`${i+1}. solis: ${message}`)};
  if(!a||!['move','pass','shot','collect','wait'].includes(a.type))fail('neatpazīta darbība.');
  if(!Number.isFinite(a.seconds)||a.seconds<1||a.seconds>15)fail('ilgums var būt 1-15 sekundes.');
  if(typeof a.note!=='string'||a.note.length>300)fail('paskaidrojums var būt līdz 300 rakstzīmēm.');
  const before={positions:copy(positions),balls:copy(balls)},owner=balls[0]?.owner;let moves=[],action=null,title='',text='';
  const route=actor=>{if(!validActor(actor))fail('izvēlies esošu spēlētāju.');if(!Array.isArray(a.path)||a.path.length>30||!a.path.every(p=>point(p)))fail('kustības punktiem jāatrodas laukumā.');return [copy(positions[actor]),...copy(a.path)]};
  if(a.type==='move'){const path=route(a.actor);if(path.length<2)fail('iezīmē vismaz vienu kustības galapunktu.');moves=[{actor:a.actor,path}];positions[a.actor]=copy(path.at(-1));title=owner===a.actor?'Dribls':'Pārvietošanās';text=`${a.actor+1}. spēlētājs ${owner===a.actor?'pārvietojas ar driblu':'pārvietojas bez bumbas'} pa norādīto ceļu.`}
  if(a.type==='pass'){if(owner===undefined)fail('vispirms savāc bumbu.');if(a.actor!==owner)fail(`bumba ir ${owner+1}. spēlētājam.`);if(!validActor(a.to)||a.to===owner)fail('izvēlies citu piespēles saņēmēju.');action={type:'pass',from:owner,to:a.to};balls=[{owner:a.to}];title='Piespēle';text=`${owner+1}. piespēlē ${a.to+1}. spēlētājam.`}
  if(a.type==='shot'){if(owner===undefined||a.actor!==owner)fail('metienu var izpildīt tikai spēlētājs ar bumbu.');const landing=a.result==='miss'?a.landing:COURT.rebound;if(!['hit','miss'].includes(a.result)||!point(landing,[90,530,120,470]))fail('norādi bumbas savākšanas vietu laukumā.');action={type:'shot',actor:owner,result:a.result};balls=[{point:copy(landing)}];title='Metiens';text=`${owner+1}. met no savas pašreizējās vietas. ${a.result==='hit'?'Shēmā parādīts trāpījums.':'Bumba pēc metiena atlec uz norādīto savākšanas vietu.'}`}
  if(a.type==='collect'){if(owner!==undefined||!balls[0]?.point)fail('bumbu vispirms jāizmet; to pašlaik tur spēlētājs vai tās nav.');const path=route(a.actor),landing=balls[0].point,target=[landing[0]-26,landing[1]-2];path.push(target);moves=[{actor:a.actor,path}];positions[a.actor]=copy(target);action={type:'collect',actor:a.actor};balls=[{owner:a.actor}];title='Savāc bumbu';text=`${a.actor+1}. dodas pie bumbas, savāc to un turpina nākamo darbību.`}
  if(a.type==='wait'){title='Pauze / pozīcija';text='Spēlētāji saglabā savas vietas.'}
  motion.push({title,text:a.note.trim()?text+' '+a.note.trim():text,moves,action,seconds:a.seconds,before,after:{positions:copy(positions),balls:copy(balls)}});
 }
 return {id:d.id,name:d.name.trim(),category:d.category,original:'Mans veidotais vingrinājums',custom:true,draft:d,teamSize:d.start.length,players:Array.from({length:13-d.start.length},(_,i)=>i+d.start.length),start:copy(d.start),cones:copy(d.cones),defenders:copy(d.defenders),balls:d.initialOwner===null?0:1,baskets:d.actions.some(a=>a.type==='shot')?1:0,videos:[],motion,tip:'Paša veidota mācību secība. Pirms treniņa pārbaudi spēlētāju ceļus un atstāj brīvu vietu metieniem un piezemēšanās zonai.'};
}
export function finalState(draft){const d=compileDraft(draft,{allowEmpty:true});return d.motion.length?copy(d.motion.at(-1).after):{positions:copy(d.start),balls:d.initialOwner===null?[]:[{owner:d.initialOwner}]}}
export function readSavedDrafts(storage){try{const values=JSON.parse(storage.getItem(CUSTOM_KEY)||'[]');if(!Array.isArray(values))return [];const seen=new Set();return values.slice(0,50).filter(d=>{try{compileDraft(d);if(seen.has(d.id))return false;seen.add(d.id);return true}catch{return false}})}catch{return []}}
export function saveDraftRecord(storage,draft){compileDraft(draft);let list=readSavedDrafts(storage),i=list.findIndex(d=>d.id===draft.id);if(i>=0)list[i]=copy(draft);else{if(list.length>=50)throw Error('Šajā ierīcē saglabāti 50 vingrinājumi. Eksportē rezerves kopiju vai rediģē esošu.');list.push(copy(draft))}try{storage.setItem(CUSTOM_KEY,JSON.stringify(list))}catch{throw Error('Neizdevās saglabāt ierīcē. Izmanto eksportu failā.')}return list}
export function parseDraft(text){if(typeof text!=='string'||text.length>200000)throw Error('Vingrinājuma fails ir pārāk liels.');let d;try{d=JSON.parse(text)}catch{throw Error('Neizdevās nolasīt JSON failu.')}compileDraft(d,{allowEmpty:true});return d}
