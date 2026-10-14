// Project information is present in the HTML; enhancements work progressively.
const projects = JSON.parse(document.querySelector('#project-data').textContent);
const dialog = document.querySelector('#project-dialog');
let opener;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const p = projects[Number(button.dataset.project)]; opener = button;
  document.querySelector('#dialog-category').textContent = p.type;
  document.querySelector('#dialog-title').textContent = p.title;
  document.querySelector('#dialog-description').textContent = p.description;
  document.querySelector('#dialog-features').replaceChildren(...p.features.map(f => {const li=document.createElement('li');li.textContent=f;return li}));
  document.querySelector('#dialog-scope').textContent = p.scope;
  const a=document.querySelector('#dialog-link');a.hidden=!p.repo;if(p.repo)a.href='https://github.com/saicharanteja-vulli/'+p.repo;else a.removeAttribute('href');
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>opener?.focus());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 let count=0;document.querySelectorAll('.project').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});
 document.querySelector('#results').textContent=`Showing ${count} ${count===1?'project':'projects'}`;
}));
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)'), toggle=document.querySelector('#motion-toggle');
let paused=motionQuery.matches;
try{paused=localStorage.getItem('teja-motion')==='paused'||motionQuery.matches}catch{}
function applyMotion(){document.documentElement.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Resume motion':'Pause motion'}
applyMotion();toggle.addEventListener('click',()=>{paused=!paused;applyMotion();try{localStorage.setItem('teja-motion',paused?'paused':'on')}catch{}});
motionQuery.addEventListener('change',e=>{paused=e.matches;applyMotion()});
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('tab-hidden',document.hidden));
const motionObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('offscreen',!e.isIntersecting)));
document.querySelectorAll('.portrait-stage,.tool-universe').forEach(el=>motionObserver.observe(el));
const nameText=document.querySelector('#hero-name>span');
nameText.replaceChildren(...[...'I’M TEJA'].map((c,i)=>{const s=document.createElement('span');s.className='name-letter';s.textContent=c===' '?'\u00a0':c;s.style.setProperty('--letter',i);return s}));
const stage=document.querySelector('.portrait-stage'),portrait=document.querySelector('.portrait');
addEventListener('pointermove',e=>{if(paused||motionQuery.matches||e.pointerType!=='mouse'||stage.classList.contains('offscreen'))return;portrait.style.transform=`perspective(1200px) rotateY(${(e.clientX/innerWidth-.5)*28}deg) rotateX(${(e.clientY/innerHeight-.5)*-26}deg) translateZ(40px)`},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>portrait.style.transform='');
const navLinks=[...document.querySelectorAll('nav a')];
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}),{rootMargin:'-15% 0px -60% 0px'});
navLinks.forEach(a=>navObserver.observe(document.querySelector(a.hash)));
addEventListener('scroll',()=>{const height=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.width=(height?scrollY/height*100:0)+'%'},{passive:true});
// Restored ambient network and floating particles; motion controls remain supported.
const canvas=document.querySelector('#network'),ctx=canvas.getContext('2d');let w,h,nodes=[],networkFrame;
function resizeNetwork(){w=innerWidth;h=innerHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);nodes=Array.from({length:w<700?35:75},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}));}
function drawNetwork(){ctx.clearRect(0,0,w,h);nodes.forEach((n,i)=>{if(!paused&&!motionQuery.matches){n.x=(n.x+n.vx+w)%w;n.y=(n.y+n.vy+h)%h}ctx.fillStyle=i%3?'#d9b68155':'#cc795d55';ctx.beginPath();ctx.arc(n.x,n.y,1.5,0,Math.PI*2);ctx.fill();for(let j=i+1;j<nodes.length;j++){const m=nodes[j],d=Math.hypot(n.x-m.x,n.y-m.y);if(d<115){ctx.strokeStyle=`rgba(205,162,111,${(1-d/115)*.14})`;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke()}}});if(!paused&&!motionQuery.matches&&!document.hidden)networkFrame=requestAnimationFrame(drawNetwork)}
function restartNetwork(){cancelAnimationFrame(networkFrame);drawNetwork()}
resizeNetwork();restartNetwork();addEventListener('resize',()=>{resizeNetwork();restartNetwork()},{passive:true});toggle.addEventListener('click',restartNetwork);motionQuery.addEventListener('change',restartNetwork);document.addEventListener('visibilitychange',restartNetwork);
const particles=document.querySelector('.particles');for(let i=0;i<65;i++){const d=document.createElement('i');d.style.left=((i*37.7)%100)+'%';d.style.top=((i*17.3)%100)+'%';d.style.animationDelay=-(i%15)+'s';particles.append(d)}
for(let i=0;i<18;i++){const d=document.createElement('i');d.className='holo-speck';d.style.cssText=`left:${12+(i*29)%77}%;top:${9+(i*17)%80}%;animation-delay:${-i*.37}s;`;stage.append(d)}
const typed=document.querySelector('#rotating'),phrases=['working software.','clearer insights.','useful AI experiments.'];let phrase=0,letterIndex=0,deleting=false;
function typeNext(){if(paused||motionQuery.matches||document.hidden||stage.classList.contains('offscreen')){setTimeout(typeNext,700);return}const word=phrases[phrase];letterIndex+=deleting?-1:1;typed.textContent=word.slice(0,letterIndex);let delay=deleting?35:75;if(letterIndex===word.length){deleting=true;delay=1600}else if(letterIndex===0){deleting=false;phrase=(phrase+1)%phrases.length;delay=350}setTimeout(typeNext,delay)}
typed.textContent=phrases[0];letterIndex=phrases[0].length;deleting=true;setTimeout(typeNext,1600);
if(matchMedia('(pointer:fine)').matches){
 const dot=document.createElement('div'),ring=document.createElement('div');dot.id='cursor-dot';ring.id='cursor-glow';dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');document.body.append(dot,ring);
 let mx=0,my=0,rx=0,ry=0,cursorFrame=0,active=false;
 const cursorEnabled=()=>!paused&&!motionQuery.matches&&!document.hidden;
 function hideCursor(){active=false;cancelAnimationFrame(cursorFrame);cursorFrame=0;dot.style.opacity=ring.style.opacity='0';document.body.classList.remove('custom-pointer')}
 function followCursor(){cursorFrame=0;if(!cursorEnabled()||!active)return;rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;if(Math.abs(mx-rx)+Math.abs(my-ry)>.2)cursorFrame=requestAnimationFrame(followCursor)}
 addEventListener('pointermove',e=>{if(!cursorEnabled()||e.pointerType!=='mouse'){hideCursor();return}mx=e.clientX;my=e.clientY;if(!active){rx=mx;ry=my}active=true;document.body.classList.add('custom-pointer');dot.style.opacity=ring.style.opacity='1';dot.style.transform=`translate3d(${mx}px,${my}px,0)`;ring.classList.toggle('hovering',!!e.target.closest('a,button,#hero-name,.project,.portrait'));if(!cursorFrame)cursorFrame=requestAnimationFrame(followCursor)},{passive:true});
 document.documentElement.addEventListener('pointerleave',hideCursor);document.addEventListener('visibilitychange',hideCursor);toggle.addEventListener('click',hideCursor);motionQuery.addEventListener('change',hideCursor);
 addEventListener('pointerdown',e=>{if(!cursorEnabled()||e.pointerType!=='mouse')return;ring.classList.add('pressed');const ripple=document.createElement('i');ripple.className='click-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.left=e.clientX+'px';ripple.style.top=e.clientY+'px';document.body.append(ripple);setTimeout(()=>ripple.remove(),650)});addEventListener('pointerup',()=>ring.classList.remove('pressed'));
 dialog.addEventListener('close',hideCursor); // Native cursor stays available over the modal top layer.
 const cursorStyle=document.createElement('style');cursorStyle.textContent='body:has(dialog[open]),body:has(dialog[open]) *{cursor:auto!important}body:has(dialog[open]) #cursor-dot,body:has(dialog[open]) #cursor-glow{display:none}';document.head.append(cursorStyle);
}
