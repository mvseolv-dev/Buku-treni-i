import {diagramFor as court} from './diagrams.js';
import {categories,drills,makePlan} from './training.js';
const $=s=>document.querySelector(s);
const mediaPath=(d,frame)=>`./assets/exercises/${d.media.exercise}-${frame}.jpg`;
function cardVisual(d){
 if(d.media)return `<img class="exercise-cover" loading="lazy" src="${mediaPath(d,1)}" alt="${d.title}: ${d.media.labels[1]}"><span class="media-badge">CILVĒKA DEMONSTRĒJUMS</span>`;
 const icons={shooting:'01',dribbling:'02',defense:'03',warmup:'04',fitness:'05'};
 return `<div class="editorial-cover cover-${d.category}"><span class="cover-symbol" aria-hidden="true">${icons[d.category]||'→'}</span><span class="cover-instruction">${d.steps[0]}</span><span class="cover-label">${d.steps.length} SKAIDRI SOĻI</span></div>`;
}
let libraryFilter='all';
function renderLibrary(filter=libraryFilter){
 libraryFilter=filter;
 const query=$('#drill-search').value.trim().toLocaleLowerCase('lv');
 const players=Number($('#library-players').value);
 const visible=drills.filter(d=>(filter==='all'||d.category===filter)&&(!players||d.min<=players)&&`${d.title} ${d.tag} ${categories[d.category]}`.toLocaleLowerCase('lv').includes(query));
 $('#library-count').textContent=`${visible.length} no ${drills.length} vingrinājumiem`;
 $('#drill-grid').innerHTML=visible.map(d=>`<button class="card" data-drill="${d.id}" aria-label="Atvērt ${d.title}"><div class="card-art"><span class="card-number">${String(drills.indexOf(d)+1).padStart(2,'0')} / ${categories[d.category].toUpperCase()}</span>${cardVisual(d)}<span class="card-play">→</span></div><div class="card-body"><span class="card-meta">${d.tag}</span><h3>${d.title}</h3><div class="card-bottom"><span>${d.min}–20 spēlētāji</span><span>${d.steps.length} soļi <span aria-hidden="true">→</span></span></div></div></button>`).join('');
 $('#library-empty').hidden=visible.length>0;
}
$('#drill-search').addEventListener('input',()=>renderLibrary());
$('#library-players').addEventListener('change',()=>renderLibrary());
let activeDrill,step=0,stepInterval;
function renderDetail(){
 const d=activeDrill;
 const hasPhoto=!!d.media;
 const visual=hasPhoto?`<div class="human-demo"><img class="demo-photo" src="${mediaPath(d,d.media.frames[step])}" alt="${d.title}: ${d.media.labels[d.media.frames[step]]}"><span class="demo-label">${d.media.labels[d.media.frames[step]]}</span><span class="demo-counter">${String(step+1).padStart(2,'0')} / ${String(d.steps.length).padStart(2,'0')}</span></div><div class="pose-strip">${d.media.labels.map((label,i)=>`<figure><img src="${mediaPath(d,i)}" alt="${label}"><figcaption><b>${i+1}</b> ${label}</figcaption></figure>`).join('')}</div>`:'';
 const tactic=!hasPhoto&&d.min>=2?`<details class="tactic-details"><summary>Laukuma izvietojums <span>+</span></summary><div class="detail-art">${court(d,step)}</div><p class="tip">Zaļš — spēlētājs un kustība. Oranžs — bumba, piespēle vai metiens. Shēma ir vienkāršots skats no augšas.</p></details>`:'';
 const source=hasPhoto?`<a class="source-link" href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener noreferrer">Demonstrējumi: Free Exercise DB →</a>`:d.source?`<a class="source-link" href="${d.source.url}" target="_blank" rel="noopener noreferrer">${d.source.title} →</a><span> · Saistītais raksts vēl nav pārbaudīts; šeit aprakstīts BUKI variants.</span>`:'';
 $('#dialog-content').innerHTML=`<div class="exercise-detail"><div class="exercise-intro"><div class="eyebrow muted">${categories[d.category]} <span class="detail-type">${hasPhoto?'DEMONSTRĒJUMS':'IZPILDES CEĻVEDIS'}</span></div><h2>${d.title}</h2><div class="exercise-specs"><span>${d.min===1?'Individuāli vai grupā':`No ${d.min} spēlētājiem`}</span><span>${d.equipment||'Basketbola laukums'}</span>${d.prescription?`<span>${d.prescription}</span>`:''}</div></div><div class="exercise-layout"><div class="exercise-visual">${visual||`<div class="instruction-focus"><span class="focus-step">SOLIS ${String(step+1).padStart(2,'0')}</span><p>${d.steps[step]}</p><span class="focus-total">${categories[d.category]} · ${d.steps.length} izpildes soļi</span></div>`}${tactic}</div><div class="exercise-instructions"><div class="steps-heading"><span>IZPILDE PA SOĻIEM</span><button id="auto-steps" class="outline" aria-pressed="${!!stepInterval}">${stepInterval?'Ⅱ Apturēt':'▷ Automātiski'}</button></div><ol class="instruction-list">${d.steps.map((text,i)=>`<li><button data-step="${i}" class="${step===i?'step-active':''}" aria-current="${step===i?'step':'false'}"><span>${String(i+1).padStart(2,'0')}</span><p>${text}</p></button></li>`).join('')}</ol><div class="step-controls"><button id="prev-step" ${step===0?'disabled':''}>← Iepriekšējais</button><span>${step+1} / ${d.steps.length}</span><button id="next-step" ${step===d.steps.length-1?'disabled':''}>Nākamais →</button></div><aside class="coach-note"><span>TRENERA PADOMS</span><p>${d.tip}</p></aside></div></div>${source?`<p class="media-credit">${source}</p>`:''}</div>`;
 $('#prev-step').onclick=()=>{step--;renderDetail()};$('#next-step').onclick=()=>{step++;renderDetail()};
 document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);renderDetail()});
 $('#auto-steps').onclick=()=>{if(stepInterval){clearInterval(stepInterval);stepInterval=null}else{stepInterval=setInterval(()=>{step=(step+1)%d.steps.length;renderDetail()},5000)}renderDetail()};
}
function openDrill(id){activeDrill=drills.find(d=>d.id===id);step=0;clearInterval(stepInterval);stepInterval=null;renderDetail();$('#drill-dialog').showModal()}
document.addEventListener('click',e=>{const target=e.target.closest('[data-drill]');if(target)openDrill(target.dataset.drill)});
$('.close').onclick=()=>$('#drill-dialog').close();
$('#drill-dialog').addEventListener('close',()=>{clearInterval(stepInterval);stepInterval=null});
$('#drill-dialog').addEventListener('click',e=>{if(e.target===$('#drill-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.remove('selected');x.setAttribute('aria-pressed','false')});b.classList.add('selected');b.setAttribute('aria-pressed','true');renderLibrary(b.dataset.filter)});
$('#minus').onclick=()=>{$('#players').value=Math.max(1,(Number($('#players').value)||1)-1)};
$('#plus').onclick=()=>{$('#players').value=Math.min(20,(Number($('#players').value)||1)+1)};
let plan=[],planSettings={},sessionIndex=0,remaining=0,deadline=0,timerInterval=null,running=false;
function stopClock(){clearInterval(timerInterval);timerInterval=null;running=false}
function updateClock(){const mins=Math.floor(remaining/60),secs=remaining%60;$('#timer').textContent=`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`}
function displaySession(){document.querySelectorAll('.plan-row').forEach((r,i)=>r.classList.toggle('current',i===sessionIndex));$('#session-label').textContent=plan[sessionIndex]?`${sessionIndex+1} / ${plan.length} · ${plan[sessionIndex].title}`:'Treniņš pabeigts. Labs darbs, BUKI!';updateClock()}
function resetSession(){stopClock();sessionIndex=0;remaining=plan[0].minutes*60;$('#session-start').textContent='Sākt treniņu ▷';$('#session-next').hidden=true;displaySession()}
function createPlan(scroll=true){
 try{planSettings={players:Number($('#players').value),duration:Number($('#duration').value),focus:$('#focus').value};plan=makePlan(planSettings.players,planSettings.duration,planSettings.focus);$('#error').textContent=''}catch(e){$('#error').textContent=e.message;return}
 $('#plan').hidden=false;$('#plan-summary').textContent=`${planSettings.players} spēlētāji · ${planSettings.duration} minūtes · ${plan.length} vingrinājumi · ${planSettings.focus==='all'?'Pilns treniņš':categories[planSettings.focus]}`;
 $('#plan-list').innerHTML=plan.map((d,i)=>`<button class="plan-row" data-drill="${d.id}"><span>${String(i+1).padStart(2,'0')}</span><strong>${d.title}</strong><small>${d.minutes} min</small><span>→</span></button>`).join('');
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
$('#save').onclick=()=>{const text=`BUKI — TAVS TRENIŅA PLĀNS\n${planSettings.players} spēlētāji | ${planSettings.duration} minūtes\n\n`+plan.map((d,i)=>`${i+1}. ${d.title} — ${d.minutes} min\n${d.steps.map((s,j)=>`   ${j+1}. ${s}`).join('\n')}\nPadoms: ${d.tip}${d.source?'\nSaistītais raksts (nepārbaudīts): '+d.source.url:''}`).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='buki-trenina-plans.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
try{const settings=JSON.parse(localStorage.getItem('buki-settings'));if(settings){makePlan(settings.players,settings.duration,settings.focus);$('#players').value=settings.players;$('#duration').value=settings.duration;$('#focus').value=settings.focus}}catch{}
document.querySelectorAll('[data-filter]').forEach(b=>{const n=b.dataset.filter==='all'?drills.length:drills.filter(d=>d.category===b.dataset.filter).length;b.innerHTML=`${b.textContent.replace(/\d+/g,'').trim()} <span>${n}</span>`;b.setAttribute('aria-pressed',String(b.dataset.filter==='all'))});
renderLibrary();
