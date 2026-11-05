import {photoDrills} from './photo-drills.js';
import {extraDrills} from './extra-drills.js';
export const categories = {warmup:'Iesildīšanās',shooting:'Metieni',dribbling:'Dribls',defense:'Aizsardzība',fitness:'Fiziskā sagatavotība',stretching:'Stiepšanās'};
const initialDrills = [
{id:'warm',category:'warmup',title:'Iekustini spēli',tag:'GATAVS STARTAM',min:1,steps:['2 minūtes viegla skrējiena un sānu soļu.','Izapļo potītes, gurnus un plecus.','Veic izklupienus, tad 3 īsus paātrinājumus.'],tip:'Sāc mierīgi un pakāpeniski palielini tempu.',pattern:'warm'},
{id:'form',category:'shooting',title:'Metiena sajūta',tag:'TEHNIKA PIRMS ĀTRUMA',min:1,steps:['Nostājies 1–2 metrus no groza; pēdas plecu platumā.','Pacel bumbu virs acīm, elkoni turi zem bumbas.','Iztaisno kājas un roku; pabeidz ar atbrīvotu plaukstu.','Pēc 5 precīziem metieniem atkāpies vienu soli.'],tip:'Mērķē uz vienu punktu. Saglabā metiena noslēgumu.',pattern:'shot'},
{id:'spots',category:'shooting',title:'Pieci punkti',tag:'ATRODI SAVU RITMU',min:1,steps:['Izvēlies 5 punktus ap soda laukumu.','No katra izpildi 5 metienus; pēc metiena savāc bumbu.','Grupā viens met, otrs piespēlē, pārējie rotē.','Pēc katras sērijas maini punktu un saskaiti trāpījumus.'],tip:'Vispirms līdzsvars, tad metiens. Pieraksti rezultātu.',pattern:'shot'},
{id:'handle',category:'dribbling',title:'Bumba tavā kontrolē',tag:'ZEMS DRIBLS · AUGSTA KONTROLE',min:1,steps:['Ieliecies ceļos un turi skatienu uz priekšu.','30 sekundes driblē ar labo, tad kreiso roku.','Maini roku priekšā ķermenim, dribls zem ceļgaliem.','Veic 3 soļus uz priekšu un atpakaļ, saglabājot kontroli.'],tip:'Vadi bumbu ar pirkstu spilventiņiem, nevis plaukstu.',pattern:'dribble'},
{id:'slalom',category:'dribbling',title:'Maini virzienu',tag:'ĀTRUMS AR KONTROLI',min:1,steps:['Izvieto 4 konusus ar 2 metru atstarpi.','Driblē līkločos, pie katra konusa mainot roku.','Atpakaļceļā izmanto vājāko roku.','Grupā startē ar drošu atstarpi, katrs ar savu bumbu.'],tip:'Pirms virziena maiņas pazemini smaguma centru.',pattern:'dribble'},
{id:'slide',category:'defense',title:'Aizsardzības soļi',tag:'NEATDOD NEVIENU METRU',min:1,steps:['Ieliecies aizsardzības stājā, rokas plaši.','Virzies sānis 3 metrus, nekrustojot kājas.','Pieskaries līnijai un maini virzienu.','Strādā 20 sekundes, atpūties 20 sekundes.'],tip:'Krūtis uz priekšu, gurni zemu. Nelec starp soļiem.',pattern:'defense'},
{id:'mirror',category:'defense',title:'Spoguļa duelis',tag:'LASI PRETINIEKU',min:2,steps:['Sadalieties pāros; nostājieties 2 metrus viens no otra.','Vadītājs kustas sānis, partneris atkārto kustību.','Pēc 30 sekundēm mainieties lomām.','Nepāra spēlētājs atpūšas un pēc sērijas rotē pārī.'],tip:'Vēro pretinieka gurnus, nevis rokas.',pattern:'defense'},
{id:'pass',category:'shooting',title:'Piespēle un metiens',tag:'KOMANDAS RITMS',min:2,steps:['Viens spēlētājs pie soda līnijas, otrs ar bumbu sānos.','Saņem piespēli, nostājies līdzsvarā un met.','Piespēlētājs savāc atlēkušo bumbu; metējs pāriet piespēlē.','Pārējie rotē rindas galā; pēc 5 metieniem maini pusi.'],tip:'Rādi rokas un esi gatavs saņemt bumbu.',pattern:'shot'},
{id:'sprint',category:'fitness',title:'Pēdējais paātrinājums',tag:'SPĒKS LĪDZ FINĀLAM',min:1,steps:['Atzīmē startu un līniju 5 metrus tālāk.','Skrien līdz līnijai un atpakaļ 20 sekundes.','Atpūties 40 sekundes; atkārto 3 reizes.','Noslēgumā 1 minūti ej un atjauno mierīgu elpošanu.'],tip:'Bremzē ar īsiem soļiem. Sāpju vai reiboņa gadījumā apstājies.',pattern:'warm'}
];
export const drills = [...initialDrills,...extraDrills,...photoDrills].map(d=>{
 if(d.id==='squat')return {...d,media:{exercise:'Bodyweight_Squat',frames:[0,1,0,0],labels:['Sākuma pozīcija','Pietupiena pozīcija']},prescription:'8–12 atkārtojumi · 3 sērijas',equipment:'Bez inventāra'};
 if(d.id==='plank')return {...d,steps:['Nometies uz paklājiņa un sagatavo apakšdelmu atbalstu zem pleciem.','Iztaisno kājas, balstoties uz pēdu pirkstgaliem un apakšdelmiem; saglabā taisnu ķermeņa līniju.','Turi stāju 20 sekundes un brīvi elpo; pārtrauc, ja mugura sāk ieliekties.','Atgriez ceļus uz paklājiņa un atpūties 30 sekundes; atkārto 3 reizes.'],media:{exercise:'Plank',frames:[0,1,1,0],labels:['Sagatavošanās','Planka pozīcija']},prescription:'20 s darbs · 30 s atpūta · 3 sērijas',equipment:'Paklājiņš'};
 return d;
});
function shuffled(items, random){
 const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
}
export function makePlan(players,duration,focus,random=Math.random){
 if(!Number.isInteger(players)||players<1||players>20) throw new Error('Spēlētāju skaitam jābūt no 1 līdz 20.');
 if(![30,45,60,90].includes(duration)) throw new Error('Neatbalstīts ilgums.');
 if(focus!=='all'&&!categories[focus]) throw new Error('Neatbalstīts fokuss.');
 const eligible=drills.filter(d=>d.min<=players&&(!d.max||d.max>=players));
 const warm=shuffled(eligible.filter(d=>d.category==='warmup'),random)[0];
 const slots=({30:3,45:4,60:5,90:7})[duration];
 let pool=eligible.filter(d=>d.category!=='warmup'&&(focus==='all'?d.category!=='stretching':d.category===focus));
 if(focus==='warmup')pool=eligible.filter(d=>d.category==='warmup'&&d.id!==warm.id);
 const mainSlots=focus==='all'?slots-1:slots;
 let main;
 if(focus==='all'){
  main=[];const groups=shuffled(['shooting','dribbling','defense','fitness'],random);
  for(const c of groups){const d=shuffled(pool.filter(d=>d.category===c),random)[0];if(d&&main.length<mainSlots)main.push(d)}
  main.push(...shuffled(pool.filter(d=>!main.some(x=>x.id===d.id)),random).slice(0,mainSlots-main.length));
 }else main=shuffled(pool,random).slice(0,mainSlots);
 const cooldown=focus==='all'?shuffled(eligible.filter(d=>d.category==='stretching'),random)[0]:null;
 const chosen=[warm,...main,...(cooldown?[cooldown]:[])];
 const warmMinutes=duration===30?5:8,remaining=duration-warmMinutes-(cooldown?5:0);
 return chosen.map((d,i)=>({...d,minutes:i===0?warmMinutes:cooldown&&i===chosen.length-1?5:Math.floor(remaining/main.length)+(i<=remaining%main.length?1:0)}));
}
