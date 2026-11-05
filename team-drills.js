const P=(x,y,label)=>({x,y,label,role:'player'});
const R=(points,type='move',actor=0)=>({points,type,actor});
const S=(text,actors,routes=[],extra={})=>({text,actors,routes,...extra});
const positions=(far=false)=>[P(far?110:170,far?340:270,'1'),P(far?490:430,far?340:270,'2'),P(far?110:170,far?420:350,'3'),P(far?490:430,far?420:350,'4')];
function columnGuide(far,goal,variant){
 const [l,r]=far?[[110,340],[490,340]]:[[170,270],[430,270]],a=positions(far);
 return [S(`Divas kolonnas abās groza pusēs. Katras kolonnas pirmajam ir bumba. Komandas mērķis — ${goal} trāpījumi.`,a,[],{balls:[[l[0]+20,l[1]-10],[r[0]+20,r[1]-10]]}),
 S(`Pirmie divi izpilda ${variant||'metienu'} no atzīmētajām vietām. Abi metieni skaitās kopīgajā rezultātā.`,a,[R([...l,300,73],'shot',0),R([...r,300,73],'shot',1)]),
 S('Katrs metējs savāc savu bumbu. Nākamais kolonnā gatavojas saņemt; zem groza nesaskrienieties.',a,[R([...l,260,135],'move',0),R([...r,340,135],'move',1)]),
 S('No kreisās puses piespēlē labajai kolonnai, no labās — kreisajai. Piespēlē tikai brīvā koridorā.',[P(260,135,'1'),P(340,135,'2'),P(...l,'3'),P(...r,'4')],[R([260,135,...r],'pass',0),R([340,135,...l],'pass',1)]),
 S('Pēc piespēles ej pretējās kolonnas beigās. Nākamie met; turpiniet nepārtrauktu rotāciju līdz kopīgajam mērķim.',[P(260,135,'1'),P(340,135,'2'),P(...l,'3'),P(...r,'4')],[R([260,135,520,220,520,450,r[0],r[1]+80],'move',0),R([340,135,80,220,80,450,l[0],l[1]+80],'move',1)],{caption:'Met → savāc savu → piespēlē pretējai → ej tās beigās.'})];
}
const specs=[
 ['team-midrange','Divas kolonnas · 30 pustālie',false,30,'pustālo metienu'],
 ['team-threes','Divas kolonnas · 20 trīnīši',true,20,'trīspunktu metienu'],
 ['team-50','Komandas 50',false,50,'metienu no vidējas distances'],
 ['team-five-spots','5 pozīciju pāri · kopā 50',false,50,'metienu; pēc katriem 10 komandas trāpījumiem pārbīdiet abas kolonnas uz nākamo punktu pāri'],
 ['team-pressure','20 trāpījumu izaicinājums',false,20,'metienu'],
 ['team-layup-relay','Divsoļu stafete · kopā 30',false,30,'divsoli no savas puses'],
 ['team-seven','Septiņi katrā pusē',false,14,'metienu; skaitiet 7 katrai pusei atsevišķi'],
 ['team-21','Komandas 21 · pustālie un trīņi',false,21,'metienu; pustālais dod 1, trīnītis 2 punktus']
];
export const teamGuides={};
export const teamDrills=specs.map(([id,title,far,target,variant])=>{
 const guide=columnGuide(far,target,variant);teamGuides[id]=guide;
 guide[1].text=far?'Pirmie divi izpilda trīspunktu metienus. Trāpījumus skaita kopīgajā rezultātā.':'Pirmie divi izpilda pustālos metienus. Trāpījumus skaita kopīgajā rezultātā.';
 if(id==='team-five-spots'){guide[0].text='Pirms starta atzīmējiet 5 metienu pozīciju pārus; abās pusēs pa kolonnai ar bumbu. Mērķis — kopā 50 trāpījumi.';guide[4].text='Pēc katriem 10 kopīgiem trāpījumiem pārbīdiet abas kolonnas uz nākamo pozīciju pāri. Katrā pārī saglabājiet savākšanu un piespēli pretējai kolonnai.';guide.forEach(g=>g.caption='Parādīts viena pozīciju pāra piemērs; pēc 10 trāpījumiem mainiet vietu.')}
 if(id==='team-pressure')guide[4].text='Pēc 10 kopīgiem trāpījumiem pārvietojiet abas kolonnas vienu soli tālāk. Savākšana un piespēles turpinās līdz kopā 20 trāpījumiem.';
 if(id==='team-layup-relay'){
  guide[1]=S('Kreisās kolonnas pirmais izpilda kreiso divsoli: kreisais–labais solis, metiens ar kreiso roku. Savāc savu bumbu un atbrīvo groza tuvumu.',positions(),[R([170,270,265,120],'dribble',0),R([265,120,300,73],'shot',0)]);
  guide[2]=S('Kad groza tuvums brīvs, labās kolonnas pirmais izpilda labo divsoli: labais–kreisais solis, metiens ar labo roku. Savāc savu bumbu.',[P(230,190,'1'),P(430,270,'2'),P(170,350,'3'),P(430,350,'4')],[R([430,270,335,120],'dribble',1),R([335,120,300,73],'shot',1)]);
 }
 if(id==='team-seven')guide[4]=S('Pēc piespēles pārej pretējā kolonnā. Mērķis — 7 trāpījumi no kreisās un 7 no labās; abu pušu rezultātus skaita atsevišķi.',positions(),[],{caption:'Kreisā 7 + labā 7; nepietiek ar 14 tikai no vienas puses.'});
 if(id==='team-21')guide[1]=S('Sāciet no pustālās distances. Pēc 5 kopīgiem trāpījumiem abas kolonnas atkāpjas uz trīspunktu distanci; tur 1 trāpījums dod 2 punktus.',positions(),[R([170,270,300,73],'shot',0),R([430,270,300,73],'shot',1)]);
 return {id,title,category:'shooting',min:4,tag:'KOPĪGS MĒRĶIS · 2 BUMBAS',teamFormat:'columns',goal:{target,editable:['team-midrange','team-threes','team-50'].includes(id),unit:id==='team-21'?'punkti':'trāpījumi',split:id==='team-seven',seconds:undefined},steps:guide.map(g=>g.text),tip:'Četriem: divi met, divi gatavojas saņemt; pēc metiena uzreiz savāc un piespēlē. Lielākā grupā ir īsa, skaidri norādīta rotācija.',equipment:'1 grozs un 2 bumbas',pattern:'shot'};
});
teamGuides['free-throws-10']=[
 S('Katram jāizmet 10 soda metienu mēģinājumi. Nav jāiemet 10; skaitiet arī garām aizmestos.',[P(300,260,'1'),P(380,130,'2')],[],{ball:true}),
 S('Sadalieties pie pieejamajiem groziem. Viens met, partneris savāc un piespēlē; viens pats bumbu savāc pats.',[P(300,260,'1'),P(380,130,'2')],[R([300,260,300,73],'shot',0)]),
 S('Pēc 2 mēģinājumiem mainiet metēju. Turpiniet līdz katram ir 10 mēģinājumi.',[P(300,260,'1'),P(380,130,'2')],[R([380,130,300,260],'pass',1)]),
 S('Pierakstiet katra trāpījumus no 10 un turpiniet nākamo vingrinājumu.',[P(300,260,'1')],[],{ball:true})
];
teamDrills.push({id:'free-throws-10',title:'Katram 10 soda metieni',category:'shooting',min:1,tag:'STARP VINGRINĀJUMIEM',shotsPerPlayer:10,steps:teamGuides['free-throws-10'].map(g=>g.text),tip:'Tie ir 10 mēģinājumi katram, nevis 10 kopīgi vai 10 obligāti trāpījumi.',equipment:'Vismaz 1 grozs un 1 bumba',pattern:'shot'});
export const challengeIds=['countdown','knockout',...specs.map(s=>s[0]),'around','horse','partner-21','beat-pro','partner-race','seven-minute'];
