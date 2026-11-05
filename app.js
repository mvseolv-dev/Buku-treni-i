import {participationFor,adaptForPlayers,formatFor} from './participation.js';
import {guides} from './guides.js';
import {diagramFor as court,bodyPhotoFor} from './diagrams.js';
import {categories,drills,makePlan} from './training.js';
const $=s=>document.querySelector(s);
const mediaPath=(d,frame)=>`./assets/exercises/${d.media.exercise}-${frame}.jpg`;
function cardVisual(d){
 if(d.media)return `<img class="exercise-cover" loading="lazy" src="${mediaPath(d,d.media.cover??1)}" alt="${d.title}: ${d.media.labels[d.media.cover??1]}"><span class="media-badge">CILVĒKA DEMONSTRĒJUMS</span>`;
 const preview=previewStep(d),photo=bodyPhotoFor(guides[d.id]?.[preview]);
 if(photo)return `<img class="exercise-cover" loading="lazy" src="./assets/exercises/${photo[0]}-${photo[1]}.jpg" alt="${photo[2]}"><span class="media-badge">POZAS PIEMĒRS</span>`;
 return `<div class="diagram-preview">${court(d,preview,'card')}<span class="preview-label">${['squat','plank','ankles'].includes(d.id)?'KUSTĪBAS ILUSTRĀCIJA':'IZPILDES SHĒMA PA SOĻIEM'}</span></div>`;
}
function previewStep(d){
 // Show an actual movement phase in the thumbnail rather than an empty setup.
 for(let i=1;i<d.steps.length;i++)if(court(d,i).includes('<animateMotion'))return i;
 return d.id==='ankles'?1:0;
}
function humanVisual(d,index){
 const still=d.media.kind==='photo',frame=d.media.frames[index];
 return `<div class="human-demo"><img class="demo-photo" src="${mediaPath(d,frame)}" alt="${d.title}: ${d.media.labels[frame]}"><span class="demo-label">${still?'Stiepšanās poza':d.media.labels[frame]}</span>${still?'':`<span class="demo-counter">${index+1} / ${d.steps.length}</span>`}</div>${still?`<p class="photo-context">Pozas piemērs · ${d.prescription}</p>`:`<div class="pose-strip">${d.media.labels.map((label,i)=>`<figure><img src="${mediaPath(d,i)}" alt="${label}"><figcaption><b>${i+1}</b> ${label}</figcaption></figure>`).join('')}</div>`}`;
}
function renderRecovery(){
 $('#recovery-grid').innerHTML=drills.filter(d=>d.category==='stretching').map(d=>`<button type="button" class="recovery-card" data-drill="${d.id}"><div class="recovery-image"><img loading="lazy" src="${mediaPath(d,d.media.cover??1)}" alt="${d.title}: stiepšanās poza"><span>${d.tag}</span></div><div class="recovery-copy"><h3>${d.title}</h3><span>15–20 s katrai pusei</span><b aria-hidden="true">→</b></div></button>`).join('');
}
let libraryFilter='all',libraryFollowsPlanner=true;
$('#library-players').innerHTML='<option value="0">Visi spēlētāju formāti</option>'+Array.from({length:20},(_,i)=>`<option value="${i+1}">${i+1} spēlētāji</option>`).join('');
function renderLibrary(filter=libraryFilter){
 libraryFilter=filter;
 const query=$('#drill-search').value.trim().toLocaleLowerCase('lv');
 const players=Number($('#library-players').value);
 const visible=drills.filter(d=>(filter==='all'||d.category===filter)&&(!players||!!participationFor(d,players,currentInventory()))&&`${d.title} ${d.tag} ${categories[d.category]}`.toLocaleLowerCase('lv').includes(query));
 $('#library-count').textContent=`${visible.length} no ${drills.length} vingrinājumiem`;
 $('#drill-grid').innerHTML=visible.map(d=>`<button class="card" data-drill="${d.id}" aria-label="Atvērt ${d.title}"><div class="card-art"><span class="card-number">${String(drills.indexOf(d)+1).padStart(2,'0')} / ${categories[d.category].toUpperCase()}</span>${cardVisual(d)}<span class="card-play">→</span></div><div class="card-body"><span class="card-meta">${d.tag}</span><h3>${d.title}</h3><div class="card-bottom"><span>${formatFor(d)}</span><span>${d.steps.length} soļi <span aria-hidden="true">→</span></span></div></div></button>`).join('');
 document.querySelectorAll('.card svg').forEach(svg=>svg.pauseAnimations?.());
 $('#library-empty').hidden=visible.length>0;
}
$('#drill-search').addEventListener('input',()=>renderLibrary());
$('#library-players').addEventListener('change',()=>{libraryFollowsPlanner=false;renderLibrary()});$('#baskets').addEventListener('change',()=>renderLibrary());
function currentInventory(){return {baskets:Number($('#baskets').value),balls:Number($('#balls').value)}}
function organizationPanel(d){
 const o=d.organization;if(!o)return '';
 return `<section class="organization" aria-label="Visu spēlētāju darba sadalījums"><div class="organization-title"><strong>${o.players} no ${o.players} iesaistīti</strong><span>${o.summary}</span></div><p class="starting-roles">Sākuma lomas</p><div class="work-groups">${o.groups.map(g=>`<div class="work-group"><h4>${o.groups.length===1?'Darba grupa':`Grupa ${g.number}`}</h4>${g.members.map(m=>`<p><b>${m.player}</b><span>${m.role}</span></p>`).join('')}</div>`).join('')}</div><p>${o.rotation}</p><p class="work-equipment">Nepieciešams: ${o.requirements.baskets} grozi · ${o.requirements.balls} bumbas.</p></section>`;
}
let activeDrill,step=0,stepInterval,storyboardOpen=false;
function renderDetail(){
 const d=activeDrill;
 const hasPhoto=!!d.media;
 const frame=guides[d.id]?.[step];
 const bodyVisual=frame&&['body','bounce'].includes(frame.surface);
 const posturePhoto=bodyPhotoFor(frame);
 const visual=hasPhoto?humanVisual(d,step):posturePhoto?`<div class="human-demo"><img class="demo-photo" src="./assets/exercises/${posturePhoto[0]}-${posturePhoto[1]}.jpg" alt="${posturePhoto[2]}"><span class="demo-label">${posturePhoto[2]}</span></div>`:'';
 const tactic=!hasPhoto&&!posturePhoto?`<div class="visible-demonstration"><div class="visual-heading"><span>${step===0?'SĀKUMA POZĪCIJA':`SOLIS ${step} / ${d.steps.length-1}`}</span><span>${bodyVisual?(bodyPhotoFor(frame)?'FOTO PIEMĒRS':'KUSTĪBAS SHĒMA'):frame?.surface==='floor'?'KUSTĪBU ZONA':'SKATS NO AUGŠAS'}</span></div><div class="detail-art">${court(d,step)}</div>${frame?.caption?`<p class="visual-caption">${frame.caption}</p>`:''}${!bodyVisual?'<div class="visual-key"><span>━ Pārvietošanās</span><span>┄ Metiens / piespēle</span><span>▲ Konuss</span></div>':''}</div>`:'';
 const source=hasPhoto||bodyPhotoFor(frame)?`<a class="source-link" href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener noreferrer">Demonstrējumi: Free Exercise DB →</a>`:d.source?`<a class="source-link" href="${d.source.url}" target="_blank" rel="noopener noreferrer">${d.source.title} →</a><span> · Saistītais raksts vēl nav pārbaudīts; šeit aprakstīts BUKI variants.</span>`:'';
 $('#dialog-content').innerHTML=`<div class="exercise-detail"><div class="exercise-intro"><div class="eyebrow muted">${categories[d.category]} <span class="detail-type">${hasPhoto?'DEMONSTRĒJUMS':'IZPILDES CEĻVEDIS'}</span></div><h2>${d.title}</h2><div class="exercise-specs"><span>${d.organization?`${d.organization.players} spēlētāji · ${d.organization.summary}`:formatFor(d)}</span><span>${d.equipment?`${d.equipment}${d.organization?.groups.length>1?' vienai darba vietai':''}`:'Basketbola laukums'}</span>${d.prescription?`<span>${d.prescription}</span>`:''}</div></div>${d.organization?`<div class="organization-brief"><strong>${d.organization.players} no ${d.organization.players} iesaistīti</strong><span>${d.organization.summary} · ${d.organization.requirements.baskets} grozi, ${d.organization.requirements.balls} bumbas</span></div>`:''}${d.id==='countdown'?`<div class="route-summary"><span>01 <b>Kreisais divsolis</b></span><span>02 <b>Labais divsolis</b></span><span>03 <b>Stūris 3</b></span><span>04 <b>Stūris 2</b></span><span>05 <b>Augša 1</b></span></div>`:''}<div class="exercise-layout"><div class="exercise-visual">${visual}${tactic}${d.organization?`<p class="group-diagram-note">${d.organization.kind==='individual'?`Attēls rāda viena cilvēka tehniku. Visi ${d.organization.players} strādā vienlaikus.`:`${d.organization.groups.length>1?'Parādīts vienas grupas piemērs; visu dalībnieku lomas ir zemāk.':'Visas grupas dalībnieku lomas norādītas zemāk.'}`}</p>`:''}</div><div class="exercise-instructions"><div class="steps-heading"><span>IZPILDE PA SOĻIEM</span><button id="show-storyboard" class="outline" aria-expanded="${storyboardOpen}">${storyboardOpen?'Aizvērt secību':'Visa secība'}</button><button id="auto-steps" class="outline" aria-pressed="${!!stepInterval}">${stepInterval?'Ⅱ Apturēt':'▷ Automātiski'}</button></div><ol class="instruction-list">${d.steps.map((text,i)=>`<li><button data-step="${i}" class="${step===i?'step-active':''}" aria-current="${step===i?'step':'false'}"><span>${i===0?'S':String(i).padStart(2,'0')}</span><p>${text}</p></button></li>`).join('')}</ol><div class="step-controls"><button id="prev-step" ${step===0?'disabled':''}>← Iepriekšējais</button><span>${step===0?'Sākums':`${step} / ${d.steps.length-1}`}</span><button id="next-step" ${step===d.steps.length-1?'disabled':''}>Nākamais →</button></div><aside class="coach-note"><span>TRENERA PADOMS</span><p>${d.tip}</p></aside></div></div>${organizationPanel(d)}${storyboardOpen?`<section class="storyboard" aria-label="Visa vingrinājuma secība">${d.steps.map((text,i)=>`<article><h3>${i===0?'Sākuma pozīcija':`Solis ${i}`}</h3>${hasPhoto?`<img src="${mediaPath(d,d.media.frames[i])}" alt="${d.media.labels[d.media.frames[i]]}">`:court(d,i,'overview')}<p>${text}</p></article>`).join('')}</section>`:''}${source?`<p class="media-credit">${source}</p>`:''}</div>`;
 $('#show-storyboard').onclick=()=>{storyboardOpen=!storyboardOpen;renderDetail()};
 document.querySelectorAll('.storyboard svg').forEach(svg=>svg.pauseAnimations?.());
 $('#prev-step').onclick=()=>{step--;renderDetail()};$('#next-step').onclick=()=>{step++;renderDetail()};
 document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);renderDetail()});
 $('#auto-steps').onclick=()=>{if(stepInterval){clearInterval(stepInterval);stepInterval=null}else{stepInterval=setInterval(()=>{step=(step+1)%d.steps.length;renderDetail()},5000)}renderDetail()};
}
function openDrill(id,fromPlan=false){storyboardOpen=false;const base=drills.find(d=>d.id===id);const n=Number($('#library-players').value);activeDrill=fromPlan?plan.find(d=>d.id===id):n?adaptForPlayers(base,n,currentInventory()):base;if(!activeDrill)return;step=0;clearInterval(stepInterval);stepInterval=null;renderDetail();$('#drill-dialog').showModal()}
document.addEventListener('click',e=>{const target=e.target.closest('[data-drill]');if(target)openDrill(target.dataset.drill,!!target.closest('.plan-row'))});
$('.close').onclick=()=>$('#drill-dialog').close();
$('#drill-dialog').addEventListener('close',()=>{clearInterval(stepInterval);stepInterval=null});
$('#drill-dialog').addEventListener('click',e=>{if(e.target===$('#drill-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.remove('selected');x.setAttribute('aria-pressed','false')});b.classList.add('selected');b.setAttribute('aria-pressed','true');renderLibrary(b.dataset.filter)});
let customBalls=false;$('#balls').addEventListener('input',()=>{customBalls=true;renderLibrary()});function syncBalls(){if(!customBalls)$('#balls').value=$('#players').value;if(libraryFollowsPlanner){$('#library-players').value=$('#players').value;renderLibrary()}}$('#players').addEventListener('input',syncBalls);
$('#minus').onclick=()=>{$('#players').value=Math.max(1,(Number($('#players').value)||1)-1);syncBalls()};
$('#plus').onclick=()=>{$('#players').value=Math.min(20,(Number($('#players').value)||1)+1);syncBalls()};
let plan=[],planSettings={},sessionIndex=0,remaining=0,deadline=0,timerInterval=null,running=false;
function stopClock(){clearInterval(timerInterval);timerInterval=null;running=false}
function updateClock(){const mins=Math.floor(remaining/60),secs=remaining%60;$('#timer').textContent=`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`}
function displaySession(){document.querySelectorAll('.plan-row').forEach((r,i)=>r.classList.toggle('current',i===sessionIndex));$('#session-label').textContent=plan[sessionIndex]?`${sessionIndex+1} / ${plan.length} · ${plan[sessionIndex].title}`:'Treniņš pabeigts. Labs darbs, BUKI!';updateClock()}
function resetSession(){stopClock();sessionIndex=0;remaining=plan[0].minutes*60;$('#session-start').textContent='Sākt treniņu ▷';$('#session-next').hidden=true;displaySession()}
function createPlan(scroll=true){
 try{planSettings={players:Number($('#players').value),duration:Number($('#duration').value),focus:$('#focus').value,resources:currentInventory()};plan=makePlan(planSettings.players,planSettings.duration,planSettings.focus,Math.random,planSettings.resources);$('#error').textContent=''}catch(e){$('#error').textContent=e.message;$('#plan').hidden=true;plan=[];stopClock();return}
 libraryFollowsPlanner=true;$('#library-players').value=String(planSettings.players);renderLibrary();
 $('#plan').hidden=false;$('#plan-summary').textContent=`${planSettings.players} spēlētāji · ${planSettings.duration} minūtes · ${plan.length} vingrinājumi · ${planSettings.focus==='all'?'Pilns treniņš':categories[planSettings.focus]}`;
 $('#plan-list').innerHTML=plan.map((d,i)=>`<button class="plan-row" data-drill="${d.id}"><span>${String(i+1).padStart(2,'0')}</span><strong>${d.title}<span class="plan-organization">${d.organization.summary} · visi ${d.organization.players} iesaistīti</span></strong><small>${d.minutes} min</small><span>→</span></button>`).join('');
 resetSession();try{localStorage.setItem('buki-settings',JSON.stringify(planSettings))}catch{}
 if(scroll)$('#plan').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
$('#plan-form').onsubmit=e=>{e.preventDefault();createPlan()};
$('#session-start').onclick=()=>{
 if(sessionIndex>=plan.length){resetSession()}
 if(running){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));stopClock();$('#session-start').textContent='Turpināt ▷';updateClock();return}
 if(remaining===0)return;
 running=true;deadline=Date.now()+remaining*1000;$('#session-start').textContent='Ⅱ Pauze';$('#session-next').hidden=false;
 timerInterval=setInterval(()=>{remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));updateClock();if(!remaining){stopClock();$('#session-start').textContent='Vingrinājums pabeigts ✓';$('#session-label').textContent='Laiks nākamajam vingrinājumam.'}},250);
};
$('#session-next').onclick=()=>{stopClock();sessionIndex++;if(sessionIndex>=plan.length){remaining=0;$('#session-start').textContent='Sākt vēlreiz ↻';$('#session-next').hidden=true}else{remaining=plan[sessionIndex].minutes*60;$('#session-start').textContent='Sākt vingrinājumu ▷'}displaySession()};
$('#save').onclick=()=>{const text=`BUKI — TAVS TRENIŅA PLĀNS\n${planSettings.players} spēlētāji | ${planSettings.duration} minūtes\n\n`+plan.map((d,i)=>`${i+1}. ${d.title} — ${d.minutes} min\nDarba sadalījums: ${d.organization.summary}\n${d.organization.groups.map(g=>g.members.map(m=>`Spēlētājs ${m.player}: ${m.role}`).join('; ')).join('\n')}\n${d.organization.rotation}\nInventārs: ${d.organization.requirements.baskets} grozi, ${d.organization.requirements.balls} bumbas.\n${d.steps.map((s,j)=>`   ${j+1}. ${s}`).join('\n')}\nPadoms: ${d.tip}${d.source?'\nSaistītais raksts (nepārbaudīts): '+d.source.url:''}`).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='buki-trenina-plans.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
try{const settings=JSON.parse(localStorage.getItem('buki-settings'));if(settings){makePlan(settings.players,settings.duration,settings.focus,Math.random,settings.resources||{baskets:2,balls:settings.players});$('#players').value=settings.players;$('#duration').value=settings.duration;$('#focus').value=settings.focus;if(settings.resources){$('#baskets').value=settings.resources.baskets;$('#balls').value=settings.resources.balls;customBalls=true}else syncBalls()}}catch{}
document.querySelectorAll('[data-filter]').forEach(b=>{const n=b.dataset.filter==='all'?drills.length:drills.filter(d=>d.category===b.dataset.filter).length;b.innerHTML=`${b.textContent.replace(/\d+/g,'').trim()} <span>${n}</span>`;b.setAttribute('aria-pressed',String(b.dataset.filter==='all'))});
$('#library-players').value=$('#players').value;
renderRecovery();
renderLibrary();
