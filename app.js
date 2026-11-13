import {hoopsDrills} from './hoops-data.js';
import {drills as oldDrills} from './training.js';
import {diagramFor} from './diagrams.js';
const original=oldDrills.find(d=>d.id==='countdown');
const clean=s=>String(s).replace(/[\u2013\u2014]/g,'-');
const countdown={...original,name:'5-4-3-2-1',original:'Tava saglabātā metienu secība',category:'Metieni',players:[1],videos:[],steps:original.steps.map(clean)};
const drills=[countdown,...hoopsDrills];
const $=s=>document.querySelector(s),esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
let favorites=new Set(read('buki-v2-favorites',[])),plan=read('buki-v2-plan',[]).filter(x=>drills.some(d=>d.id===x.id)),view='all',step=0;
function save(){localStorage.setItem('buki-v2-favorites',JSON.stringify([...favorites]));localStorage.setItem('buki-v2-plan',JSON.stringify(plan));render()}
for(const cat of [...new Set(drills.map(d=>d.category))].sort())$('#category').add(new Option(cat,cat));
for(let n=1;n<=12;n++)$('#players').add(new Option(String(n),String(n)));
function render(){
 $('#fav-count').textContent=favorites.size;$('#plan-count').textContent=plan.length;
 $('#view-title').textContent={all:'Vingrinājumi',favorites:'Tavi favorīti',plan:'Mans treniņš'}[view];$('#plan-tools').hidden=view!=='plan';
 let rows=view==='plan'?plan.map(p=>drills.find(d=>d.id===p.id)):drills;
 rows=rows.filter(d=>(view!=='favorites'||favorites.has(d.id))&&(!$('#category').value||d.category===$('#category').value)&&(!$('#players').value||d.players.includes(Number($('#players').value)))&&(!$('#video-only').checked||d.videos.length||d.id==='countdown')&&`${d.name} ${d.original}`.toLocaleLowerCase('lv').includes($('#search').value.toLocaleLowerCase('lv')));
 $('#result-count').textContent=`${rows.length} vingrinājumi`;
 $('#grid').innerHTML=rows.length?rows.map((d,i)=>`<article class="card"><div class="card-meta"><span>${esc(d.category)}</span><button class="star ${favorites.has(d.id)?'selected':''}" data-fav="${d.id}" aria-label="${favorites.has(d.id)?'Izņemt no favorītiem':'Pievienot favorītiem'}" aria-pressed="${favorites.has(d.id)}">${favorites.has(d.id)?'★':'☆'}</button></div><button class="open-card" data-open="${d.id}"><div class="court-preview"><span class="court-ring"></span><b>${d.id==='countdown'?'5 · 4 · 3 · 2 · 1':d.videos.length?'▶':'◎'}</b><small>${d.id==='countdown'?'ANIMĒTA SHĒMA':d.videos.length?'DEMONSTRĀCIJAS VIDEO':'VIDEO NAV PIEVIENOTS'}</small></div><h3>${view==='plan'?`${i+1}. `:''}${esc(d.name)}</h3><p>${esc(d.original)}</p></button><div class="card-bottom"><span>${d.players.length?d.players.join(', ')+' spēlētāji':'Spēlētāju skaits nav pārbaudīts'}</span><button data-add="${d.id}">${plan.some(p=>p.id===d.id)?'Izņemt':'＋ Treniņā'}</button></div>${view==='plan'?`<label class="minutes">Ilgums <input type="number" min="1" max="120" value="${plan.find(p=>p.id===d.id).minutes}" data-time="${d.id}"> min</label>`:''}</article>`).join(''):'<div class="empty">Šeit vēl nav vingrinājumu. Maini filtrus vai pievieno vingrinājumus no bibliotēkas.</div>';
}
function open(id){const d=drills.find(d=>d.id===id);if(!d)return;step=0;
 $('#detail-body').innerHTML=`<p class="eyebrow">${esc(d.category)}</p><h2>${esc(d.name)}</h2><p class="original">${esc(d.original)}</p><div id="media"></div>${d.id==='countdown'?'<div class="step-controls"><button id="prev">← Iepriekšējais</button><span id="step-label"></span><button id="next">Nākamais →</button></div><p id="step-text"></p>':d.videos.length?`<p class="media-caption">Demonstrācijas video no oriģinālā autora. Šis ir video, nevis Hoops Geek animētā laukuma shēma.</p>${d.videos.length>1?'<label>Video variants<select id="video-choice">'+d.videos.map((v,i)=>`<option value="${v}">Demonstrācija ${i+1}</option>`).join('')+'</select></label>':''}`:'<div class="empty">Šim vingrinājumam publisks demonstrācijas video nav atrasts. Laukuma animācijas eksports vēl nav pievienots.</div>'}<div class="detail-actions"><button data-add="${d.id}">${plan.some(p=>p.id===d.id)?'Izņemt no treniņa':'＋ Pievienot treniņam'}</button><button data-fav="${d.id}">${favorites.has(d.id)?'★ Saglabāts':'☆ Favorītos'}</button></div>`;
 if(d.id==='countdown'){const draw=()=>{$('#media').innerHTML=diagramFor(original,step);$('#step-label').textContent=`${step+1} / ${d.steps.length}`;$('#step-text').textContent=d.steps[step];$('#prev').disabled=step===0;$('#next').disabled=step===d.steps.length-1};$('#prev').onclick=()=>{step--;draw()};$('#next').onclick=()=>{step++;draw()};draw()}
 else if(d.videos.length){const play=v=>{$('#media').innerHTML=`<iframe title="${esc(d.name)} - demonstrācija" src="https://www.youtube-nocookie.com/embed/${v}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`};play(d.videos[0]);if($('#video-choice'))$('#video-choice').onchange=e=>play(e.target.value)}
 if(!$('#detail').open)$('#detail').showModal();
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.view){view=b.dataset.view;document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));render()}if(b.dataset.open)open(b.dataset.open);if(b.dataset.fav){favorites.has(b.dataset.fav)?favorites.delete(b.dataset.fav):favorites.add(b.dataset.fav);save();if($('#detail').open)open(b.dataset.fav)}if(b.dataset.add){const id=b.dataset.add;plan.some(p=>p.id===id)?plan=plan.filter(p=>p.id!==id):plan.push({id,minutes:5});save();if($('#detail').open)open(id)}});
$('#grid').addEventListener('change',e=>{if(e.target.dataset.time){const item=plan.find(p=>p.id===e.target.dataset.time);item.minutes=Math.max(1,Math.min(120,Number(e.target.value)||5));save()}});
for(const s of ['#search','#category','#players','#video-only'])$(s).addEventListener('input',render);
$('#close').onclick=()=>$('#detail').close();$('#detail').addEventListener('close',()=>{$('#media')?.replaceChildren()});$('#clear-plan').onclick=()=>{plan=[];save()};render();
