import {teamDrills} from './team-drills.js';
import {adaptForPlayers} from './participation.js';
import {guides} from './guides.js';
import {additionalDrills} from './additional-drills.js';
import {photoDrills} from './photo-drills.js';
import {extraDrills} from './extra-drills.js';
export const categories = {warmup:'Iesildīšanās',shooting:'Metieni',dribbling:'Dribls',defense:'Aizsardzība',fitness:'Fiziskā sagatavotība',stretching:'Stiepšanās'};
const initialDrills = [
  {
    "id": "warm",
    "category": "warmup",
    "title": "Iekustini spēli",
    "tag": "GATAVS STARTAM",
    "min": 1,
    "tip": "Sāc mierīgi un pakāpeniski palielini tempu.",
    "pattern": "warm"
  },
  {
    "id": "form",
    "category": "shooting",
    "title": "Metiena sajūta",
    "tag": "TEHNIKA PIRMS ĀTRUMA",
    "min": 1,
    "tip": "Mērķē uz vienu punktu. Saglabā metiena noslēgumu.",
    "pattern": "shot"
  },
  {
    "id": "spots",
    "category": "shooting",
    "title": "Pieci punkti",
    "tag": "ATRODI SAVU RITMU",
    "min": 1,
    "tip": "Vispirms līdzsvars, tad metiens. Pieraksti rezultātu.",
    "pattern": "shot"
  },
  {
    "id": "handle",
    "category": "dribbling",
    "title": "Bumba tavā kontrolē",
    "tag": "ZEMS DRIBLS · AUGSTA KONTROLE",
    "min": 1,
    "tip": "Vadi bumbu ar pirkstu spilventiņiem, nevis plaukstu.",
    "pattern": "dribble"
  },
  {
    "id": "slalom",
    "category": "dribbling",
    "title": "Maini virzienu",
    "tag": "ĀTRUMS AR KONTROLI",
    "min": 1,
    "tip": "Pirms virziena maiņas pazemini smaguma centru.",
    "pattern": "dribble"
  },
  {
    "id": "slide",
    "category": "defense",
    "title": "Aizsardzības soļi",
    "tag": "NEATDOD NEVIENU METRU",
    "min": 1,
    "tip": "Krūtis uz priekšu, gurni zemu. Nelec starp soļiem.",
    "pattern": "defense"
  },
  {
    "id": "mirror",
    "category": "defense",
    "title": "Spoguļa duelis",
    "tag": "LASI PRETINIEKU",
    "min": 2,
    "tip": "Vēro pretinieka gurnus, nevis rokas.",
    "pattern": "defense"
  },
  {
    "id": "pass",
    "category": "shooting",
    "title": "Piespēle un metiens",
    "tag": "KOMANDAS RITMS",
    "min": 2,
    "tip": "Rādi rokas un esi gatavs saņemt bumbu.",
    "pattern": "shot"
  },
  {
    "id": "sprint",
    "category": "fitness",
    "title": "Pēdējais paātrinājums",
    "tag": "SPĒKS LĪDZ FINĀLAM",
    "min": 1,
    "tip": "Bremzē ar īsiem soļiem. Sāpju vai reiboņa gadījumā apstājies.",
    "pattern": "warm"
  }
];
export const drills = [...initialDrills,...extraDrills,...photoDrills,...additionalDrills,...teamDrills].map(original=>{
 const d=guides[original.id]?{...original,steps:guides[original.id].map(g=>g.text)}:original;
 if(d.id==='countdown'){const {source,...clean}=d;return {...clean,title:'5–4–3–2–1',tag:'2 DIVSOĻI + 3 METIENI',tip:'Sāc soda līnijas kreisajā sānā. Pēc abiem divsoļiem metienu secība: stūris 3 → stūris 2 → augša 1.',reference:'Lietotāja precizētā secība: divi divsoļi, tad 3 → 2 → 1',equipment:'4 konusi un 1 bumba'}}
 if(d.id==='squat')return {...d,steps:['Nostājies ar pēdām plecu platumā; rokas aiz galvas vai sev priekšā.','Virzi gurnus atpakaļ un saliec ceļus sev ērtā dziļumā.','Celies augšā, ceļus saglabājot pēdu virzienā un pēdas pie zemes.','Izpildi 8–12 atkārtojumus; 45 s atpūta. Kopā 3 sērijas.'],media:{exercise:'Bodyweight_Squat',frames:[0,1,0,0],labels:['Sākuma pozīcija','Pietupiena pozīcija']},prescription:'8–12 atkārtojumi · 3 sērijas',equipment:'Bez inventāra'};
 if(d.id==='plank')return {...d,steps:['Nometies uz paklājiņa un sagatavo apakšdelmu atbalstu zem pleciem.','Iztaisno kājas, balstoties uz pēdu pirkstgaliem un apakšdelmiem; saglabā taisnu ķermeņa līniju.','Turi stāju 20 sekundes un brīvi elpo; pārtrauc, ja mugura sāk ieliekties.','Atgriez ceļus uz paklājiņa un atpūties 30 sekundes; atkārto 3 reizes.'],media:{exercise:'Plank',frames:[0,1,1,0],labels:['Sagatavošanās','Planka pozīcija']},prescription:'20 s darbs · 30 s atpūta · 3 sērijas',equipment:'Paklājiņš'};
 return d;
});
function shuffled(items, random){
 const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
}
export function makePlan(players,duration,focus,random=Math.random,resources={baskets:2,balls:players},options={}){
 if(!Number.isInteger(players)||players<1||players>20) throw new Error('Spēlētāju skaitam jābūt no 1 līdz 20.');
 if(![30,45,60,90].includes(duration)) throw new Error('Neatbalstīts ilgums.');
 if(focus!=='all'&&!categories[focus]) throw new Error('Neatbalstīts fokuss.');
 const eligible=drills.map(d=>adaptForPlayers(d,players,resources,{allowRotation:!!options.includeGames})).filter(Boolean);
 const exercisePool=eligible.filter(d=>!d.shotsPerPlayer);
 const warm=shuffled(exercisePool.filter(d=>d.category==='warmup'),random)[0];
 const slots=({30:3,45:4,60:5,90:7})[duration];
 let pool=exercisePool.filter(d=>d.category!=='warmup'&&(focus==='all'?d.category!=='stretching':d.category===focus));
 if(focus==='warmup')pool=exercisePool.filter(d=>d.category==='warmup'&&d.id!==warm.id);
 if(!pool.length)throw new Error(`Šim ${players} spēlētāju skaitam un inventāram nav piemērotu vingrinājumu izvēlētajā kategorijā. Maini fokusu vai pieejamo grozu/bumbu skaitu.`);
 const mainSlots=focus==='all'?slots-1:slots;
 let main;
 if(focus==='all'){
  main=[];const groups=shuffled(['shooting','dribbling','defense','fitness'],random);
  for(const c of groups){const d=shuffled(pool.filter(d=>d.category===c),random)[0];if(d&&main.length<mainSlots)main.push(d)}
  main.push(...shuffled(pool.filter(d=>!main.some(x=>x.id===d.id)),random).slice(0,mainSlots-main.length));
 }else main=shuffled(pool,random).slice(0,mainSlots);
 const cooldown=focus==='all'?shuffled(eligible.filter(d=>d.category==='stretching'),random)[0]:null;
 const ft=options.freeThrows&&['shooting','all'].includes(focus)?eligible.find(d=>d.shotsPerPlayer):null;
 const ftMinutes=ft?Math.max(2,Math.ceil(players*10*5/(Math.max(1,ft.organization.requirements.baskets)*60))):0;
 const warmMinutes=duration===30?5:8;
 while(main.length>1&&(duration-warmMinutes-(cooldown?5:0)-(ft?(main.length-1)*ftMinutes:0))/main.length<4)main.pop();
 const remaining=duration-warmMinutes-(cooldown?5:0)-(ft?(main.length-1)*ftMinutes:0);
 const mains=main.map((d,i)=>({...d,minutes:Math.floor(remaining/main.length)+(i<remaining%main.length?1:0)}));
 const entries=[{...warm,minutes:warmMinutes}];
 mains.forEach((d,i)=>{if(i&&ft)entries.push({...ft,minutes:ftMinutes});entries.push(d)});
 if(cooldown)entries.push({...cooldown,minutes:5});
 return entries.map((d,i)=>({...d,entryKey:`entry-${i}-${d.id}`}));
}
