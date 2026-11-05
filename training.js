export const categories = {warmup:'Iesildīšanās',shooting:'Metieni',dribbling:'Dribls',defense:'Aizsardzība',fitness:'Fiziskā sagatavotība'};
export const drills = [
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
export function makePlan(players,duration,focus){
 if(!Number.isInteger(players)||players<1||players>20) throw new Error('Spēlētāju skaitam jābūt no 1 līdz 20.');
 if(![30,45,60,90].includes(duration)) throw new Error('Neatbalstīts ilgums.');
 if(focus!=='all'&&!categories[focus]) throw new Error('Neatbalstīts fokuss.');
 const eligible=drills.filter(d=>d.min<=players&&d.category!=='warmup');
 const main=focus==='all'?eligible:eligible.filter(d=>d.category===focus);
 const chosen=[drills[0],...main];
 if(focus!=='all'&&focus!=='fitness')chosen.push(drills.find(d=>d.id==='sprint'));
 const warm=duration===30?5:8,remaining=duration-warm;
 return chosen.map((d,i)=>({...d,minutes:i===0?warm:Math.floor(remaining/(chosen.length-1))+(i<=remaining%(chosen.length-1)?1:0)}));
}
