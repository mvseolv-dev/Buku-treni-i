const soloShot=new Set(['countdown','mikan','reverse-mikan','layup-right','layup-left','spinout-shot','drop-step','front-pivot-shot','fake-pullup','paint-touch','star-shooting','floater','alternating-finish']);
const waitingGames=new Set(['knockout','horse','partner-21']);
const ballEach=new Set(['handle','slalom','crossover','between','behind','retreat','weak-hand','inout','hesitation','spin-dribble','figure-eight-wrap','high-low','push-pull','v-dribble','lateral-dribble','pace-change','long-weak','combo-change','wall-pass']);
const noBasket=new Set(['mirror','zigzag','reaction','passing','bounce-pass','protect-dribble','talk-switch','pass-follow']);
const roles={
 mirror:['Vadītājs','Sekotājs'],reaction:['Kustības izpildītājs','Signālu devējs'],
 boxout:['Metējs','Aizsargs','Uzbrucējs'],weave:['Kreisā mala','Vidējais','Labā mala'],
 'help-recover':['Piespēlētājs','Saņēmējs','Aizsargs'],lane:['Piespēlētājs','Saņēmējs','Aizsargs'],
 'attack-closeout':['Metējs','Piespēlētājs','Aizsargs'],'deny-cut':['Piespēlētājs','Uzbrucējs','Aizsargs'],
 'jump-to-ball':['Piespēlētājs','Saņēmējs','Aizsargs'],'two-one':['Uzbrucējs ar bumbu','Uzbrucējs bez bumbas','Aizsargs'],
 'pass-follow':['Piespēlētājs','Saņēmējs','Pārvietojas pēc piespēles'],
 'partner-race':['Metējs A','Savācējs A','Metējs B','Savācējs B'],
 'talk-switch':['Piespēlē un pārvietojas','Piespēlē un pārvietojas','Piespēlē un pārvietojas','Piespēlē un pārvietojas'],
 'three-two':['Uzbrucējs 1','Uzbrucējs 2','Uzbrucējs 3','Aizsargs 1','Aizsargs 2'],
 shell:['Uzbrucējs 1','Uzbrucējs 2','Uzbrucējs 3','Uzbrucējs 4','Aizsargs 1','Aizsargs 2','Aizsargs 3','Aizsargs 4']
};
function shootingGroups(n){
 if(n===1)return [1];
 // Use pairs/triples so every participant has a real job; no remainder or queue.
 for(let count=Math.ceil(n/3);count<=Math.floor(n/2);count++){
  const sizes=Array(count).fill(2);let extra=n-count*2;
  for(let i=0;i<count&&extra;i++,extra--)sizes[i]++;
  if(!extra)return sizes;
 }
 return null;
}
export function participationFor(d,n,resources=null){
 if(!Number.isInteger(n)||n<1||n>20||n<d.min||waitingGames.has(d.id))return null;
 const limits=resources||{baskets:20,balls:40};
 if(!Number.isInteger(limits.baskets)||limits.baskets<0||!Number.isInteger(limits.balls)||limits.balls<0)return null;
 let sizes,kind;
 if(d.id==='dribble-tag'){const count=Math.ceil(n/6);sizes=Array(count).fill(3);let extra=n-count*3;for(let i=0;i<count;i++){const add=Math.min(3,extra);sizes[i]+=add;extra-=add}kind='shared'}
 else if(d.id==='attack-closeout'){const size=n%4===0?4:n%3===0?3:0;if(!size)return null;sizes=Array(n/size).fill(size);kind='fixed'}
 else if(soloShot.has(d.id)){sizes=Array(n).fill(1);kind='individual'}
 else if(d.category==='shooting'&&d.min===2){if(n%2)return null;sizes=Array(n/2).fill(2);kind='shooting'}
 else if(d.category==='shooting'&&d.min===1){sizes=shootingGroups(n);kind='shooting'}
 else if(d.min===1){sizes=Array(n).fill(1);kind='individual'}
 else {if(n%d.min)return null;sizes=Array(n/d.min).fill(d.min);kind='fixed'}
 if(!sizes)return null;
 let baskets=0,balls=0;
 if(kind==='shooting'){baskets=sizes.length;balls=sizes.length}
 else if(d.id==='partner-race'){baskets=sizes.length*2;balls=sizes.length*2}
 else if(d.id==='weave'){baskets=sizes.length*2;balls=sizes.length}
 else if(kind==='shared'){balls=n}
 else if(d.min>=2){balls=['mirror','reaction'].includes(d.id)?0:sizes.length;baskets=noBasket.has(d.id)?0:sizes.length}
 else if(kind==='individual'&&d.category==='shooting'){baskets=n;balls=n}
 else if(d.id==='two-balls'){balls=2*n}
 else if(ballEach.has(d.id)||d.category==='dribbling'){balls=n}
 if(baskets>limits.baskets||balls>limits.balls)return null;
 let next=1;
 const groups=sizes.map((size,i)=>{
  let labels;
  if(kind==='shooting')labels=size===1?['Met un pats savāc']:size===2?['Metējs','Savāc un piespēlē']:['Metējs','Piespēlētājs','Savācējs'];
  else if(kind==='shared')labels=Array.from({length:size},(_,j)=>j===0?'Ķērājs, driblē':'Izvairās, driblē');
  else if(size===1)labels=['Izpilda vingrinājumu savā vietā'];
  else labels=roles[d.id]||Array.from({length:size},(_,j)=>j===0?(d.category==='defense'?'Uzbrucējs':'Pirmais partneris'):(d.category==='defense'?'Aizsargs':'Otrais partneris'));
  if(d.id==='attack-closeout'&&size===4)labels=[...labels,'Savācējs'];
  return {number:i+1,members:labels.map(role=>({player:next++,role})),size};
 });
 const groupLabel=kind==='individual'?`${n} vienlaikus`:groups.length===1?`Viena ${n} spēlētāju grupa`:groups.every(g=>g.size===2)?`${groups.length} pāri`:`Grupas: ${sizes.join(' + ')}`;
 const rotation=kind==='individual'?'Visi sāk reizē; katram sava droša darba vieta.':kind==='shared'?'Visi driblē; pēc pieskāriena mainās ķērājs.':'Visas grupas strādā paralēli. Mainiet lomas pēc norādītās sērijas; ja brīdis nav dots — ik pēc 60 s. Rindas nav.';
 return {players:n,kind,groups,active:n,waiting:0,summary:groupLabel,rotation,requirements:{baskets,balls}};
}
export function formatFor(d){
 if(waitingGames.has(d.id))return 'Spēle ar gaidīšanu';
 if(d.id==='attack-closeout')return '3 vai 4 spēlētāju grupās';
 if(d.id==='dribble-tag')return 'No 3; visi driblē';
 if(soloShot.has(d.id))return 'Individuāli; savs grozs katram';
 if(d.category==='shooting'&&d.min===2)return 'Pāros';
 if(d.category==='shooting'&&d.min===1)return 'Individuāli / pāros / trijniekos';
 if(d.min===1)return 'Visi vienlaikus';
 return d.min===2?'Pāros':`${d.min} spēlētāju grupās`;
}
export function adaptForPlayers(d,n,resources=null){
 const organization=participationFor(d,n,resources);
 if(!organization)return null;
 let steps=[...d.steps];
 if(organization.kind==='shooting'){
  const size=organization.groups[0].size;
  if(d.id==='around')steps[3]=size===1?'Turpini savā maršrutā līdz pēdējam punktam.':`Katrs savā grupā pilda savu lomu; ik pēc 60 s mainieties. Gaidīšanas rindas nav.`;
  if(d.id==='spots'){
   steps[1]=size===1?'No pirmās vietas izpildi 5 metienus; katru reizi pats savāc bumbu.':'No pirmās vietas izpildi 5 metienus. Savācējs atgriež bumbu; metējs paliek savā punktā.';
   steps[2]=size===1?'Pārej uz nākamo metiena vietu.':'Pārej uz nākamo metiena vietu; pārējie turpina savācēja un piespēlētāja darbu.';
  }
  if(['pull-right','pull-left'].includes(d.id)&&size>1)steps[3]='Savācējs atgriež bumbu, metējs atgriežas sākumā. Atkārto 5 reizes; tad mainiet lomas.';
  if(d.id==='beat-pro'&&size>1)steps[2]='Pēc katra metiena savācējs atgriež bumbu; metējs paliek savā punktā.';
  if(size===3)steps=steps.map(s=>s.replace(/Partneris savāc bumbu\./g,'Savācējs nogādā bumbu piespēlētājam.').replace(/partneris savāc bumbu/g,'savācējs nogādā bumbu piespēlētājam'));
 }
 return {...d,steps,participantCount:n,organization};
}
