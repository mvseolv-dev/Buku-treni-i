import {categories,drills,makePlan} from './training.js';
const $=s=>document.querySelector(s);
function court(d,step=0){
const defense=d.pattern==='defense',shot=d.pattern==='shot';
return `<svg class="court-svg ${d.pattern}" viewBox="0 0 300 200" role="img" aria-label="${categories[d.category]} — animēta laukuma shēma"><g fill="none" stroke="#778966" stroke-width="1" opacity=".6"><path d="M25 185V15H275V185Z M25 185H275 M105 15V85H195V15 M120 15V60H180V15"/><path d="M105 85 A45 45 0 0 0 195 85 M35 15V45 A115 115 0 0 0 265 45V15"/><circle cx="150" cy="38" r="10"/><path d="M135 26H165"/></g><path d="${defense?'M85 130H215':shot?'M150 125V55':'M100 155L145 120L110 85L155 55'}" stroke="#c6f778" stroke-dasharray="5 6" opacity=".5" fill="none"/><g class="motion" style="animation-delay:-${step*.6}s"><circle class="player-dot" cx="${defense?100:shot?150:100}" cy="${shot?135:145}" r="12"/><text x="${defense?100:shot?150:100}" y="${shot?139:149}" text-anchor="middle" font-size="10" font-family="Arial" font-weight="bold" fill="#14200c">1</text>${!shot?'<circle class="ball-dot" cx="118" cy="150" r="5"/>':''}</g>${shot?'<circle class="ball-dot" cx="150" cy="115" r="6"/>':''}${d.min>1?'<circle cx="215" cy="140" r="11" fill="#111" stroke="#c6f778"/><text x="215" y="144" text-anchor="middle" fill="#c6f778" font-size="10">2</text>':''}${d.id==='slalom'?'<g fill="#d78d4e"><path d="M140 112l5 10h-10z M110 77l5 10h-10z M155 47l5 10h-10z"/></g>':''}</svg>`;
}
function renderLibrary(filter='all'){
$('#drill-grid').innerHTML=drills.filter(d=>filter==='all'||d.category===filter).map(d=>`<button class="card" data-drill="${d.id}" aria-label="Atvērt ${d.title}"><div class="card-art"><span class="card-number">${String(drills.indexOf(d)+1).padStart(2,'0')} / ${categories[d.category].toUpperCase()}</span>${court(d)}<span class="card-play">▷</span></div><div class="card-body"><span class="card-meta">${d.tag}</span><h3>${d.title}</h3><div class="card-bottom"><span>${d.min===1?'1–20':'2–20'} spēlētāji</span><span>${d.steps.length} soļi <span aria-hidden="true">↗</span></span></div></div></button>`).join('');
}
let activeDrill,step=0,stepInterval;
function renderDetail(){
 const d=activeDrill;
 $('#dialog-content').innerHTML=`<div class="eyebrow muted">${categories[d.category]}</div><h2>${d.title}</h2><div class="detail-art">${court(d,step)}</div><div class="step-controls"><button id="prev-step" ${step===0?'disabled':''}>← Iepriekšējais</button><span class="step-dots">${d.steps.map((_,i)=>`<span class="${i===step?'on':''}"></span>`).join('')}</span><button id="next-step" ${step===d.steps.length-1?'disabled':''}>Nākamais →</button></div><p class="step-copy" aria-live="polite"><strong>${step+1}.</strong> ${d.steps[step]}</p><button id="auto-steps" class="outline" aria-pressed="${!!stepInterval}">${stepInterval?'Ⅱ Apturēt soļu maiņu':'▷ Automātiska soļu maiņa'}</button><p class="tip">Trenera padoms: ${d.tip}</p><p class="tip">Shēma ilustrē kustības virzienu. Vingrinājumu veic savā tempā un drošā laukumā.</p>`;
 $('#prev-step').onclick=()=>{step--;renderDetail()};$('#next-step').onclick=()=>{step++;renderDetail()};
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
 $('#plan-list').innerHTML=plan.map((d,i)=>`<button class="plan-row" data-drill="${d.id}"><span>${String(i+1).padStart(2,'0')}</span><strong>${d.title}</strong><small>${d.minutes} min</small><span>↗</span></button>`).join('');
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
$('#save').onclick=()=>{const text=`BUKI — TAVS TRENIŅA PLĀNS\n${planSettings.players} spēlētāji | ${planSettings.duration} minūtes\n\n`+plan.map((d,i)=>`${i+1}. ${d.title} — ${d.minutes} min\n${d.steps.map((s,j)=>`   ${j+1}. ${s}`).join('\n')}\nPadoms: ${d.tip}`).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='buki-trenina-plans.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
try{const settings=JSON.parse(localStorage.getItem('buki-settings'));if(settings){makePlan(settings.players,settings.duration,settings.focus);$('#players').value=settings.players;$('#duration').value=settings.duration;$('#focus').value=settings.focus}}catch{}
renderLibrary();
