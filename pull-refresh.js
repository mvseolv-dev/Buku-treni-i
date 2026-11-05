export function measurePull(start,point){
 const dy=point.y-start.y,dx=Math.abs(point.x-start.x);
 return {distance:Math.max(0,Math.min(95,dy*.5)),armed:dy>=120&&dx<dy*.6,vertical:dy>8&&dx<dy*.6};
}
export function installPullRefresh({beforeReload=()=>{},reload=()=>window.location.reload()}={}){
 const el=document.createElement('div');el.className='pull-refresh';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML='<span aria-hidden="true">↻</span><b>Velc uz leju, lai atjaunotu</b>';document.body.append(el);
 let start=null,armed=false,busy=false;
 const reset=()=>{start=null;armed=false;el.classList.remove('visible','armed');el.style.removeProperty('--pull')};
 const onStart=e=>{if(e.touches.length!==1){reset();return}if(busy||window.scrollY>0||document.querySelector('dialog[open]')||e.target.closest('input,select,textarea,button,a,dialog'))return;start={x:e.touches[0].clientX,y:e.touches[0].clientY}};
 const onMove=e=>{if(!start)return;if(e.touches.length!==1){reset();return;}const m=measurePull(start,{x:e.touches[0].clientX,y:e.touches[0].clientY});if(window.scrollY>0){reset();return}if(!m.vertical){if(Math.abs(e.touches[0].clientX-start.x)>20||e.touches[0].clientY<start.y)reset();return}if(e.cancelable)e.preventDefault();armed=m.armed;el.classList.add('visible');el.classList.toggle('armed',armed);el.style.setProperty('--pull',`${m.distance}px`);el.querySelector('b').textContent=armed?'Atlaid, lai atjaunotu':'Velc uz leju, lai atjaunotu'};
 const onEnd=()=>{if(!start)return;if(!armed){reset();return}busy=true;start=null;el.classList.add('refreshing');el.querySelector('b').textContent='Atjauno…';try{beforeReload()}catch{}setTimeout(reload,150)};
 document.addEventListener('touchstart',onStart,{passive:true});document.addEventListener('touchmove',onMove,{passive:false});document.addEventListener('touchend',onEnd,{passive:true});document.addEventListener('touchcancel',reset,{passive:true});
 return ()=>{document.removeEventListener('touchstart',onStart);document.removeEventListener('touchmove',onMove);document.removeEventListener('touchend',onEnd);document.removeEventListener('touchcancel',reset);el.remove()};
}
