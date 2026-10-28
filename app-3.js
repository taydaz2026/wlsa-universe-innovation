
// V7 PREVIEW: navigation and rendering for every universe. All content comes from universe-data.js.
// Route (URL hash):  #/ = standalone planet,  #/innovation = areas,  #/innovation/ai = iWLSA,
//                    #/innovation/pedag/intern,  #/innovation/ai/education/students
(()=>{
const {NET,cosmos,systems,TBC}=UNIVERSE;
const $=id=>document.getElementById(id);
const space=$('edu-space'),orbits=$('edu-orbits'),panel=$('edu-panel'),crumb=$('edu-crumb'),stage=space.querySelector('.edu-stage'),exitBtn=$('edu-exit'),modal=$('overview-modal'),searchBox=$('edu-search');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const PRESET6=[[50,12],[84,28],[86,72],[50,87],[14,72],[16,28]];
// 6-planet layout keeps the original hand-tuned positions; others sit on an even ring below the header.
const layout=n=>n===6?PRESET6:n===2?[[20,50],[80,50]]:Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [Math.round(50+36*Math.cos(a)),Math.round(50+29*Math.sin(a))]});

let stack=[],active=null,lastTrigger=null,leaveTimer=0;
const sysOf=s=>s.length?systems[s[s.length-1]]:cosmos;
const overlayShown=s=>!(s.length&&sysOf(s).view==='main');
const pathTo=k=>k?[...pathTo(systems[k].parent),k]:[];
const rootFor=id=>Object.keys(systems).find(k=>systems[k].entry===id);
// Guided tour: the same Explorer / Stop N of M experience as the AI universe, for every universe.
const tourBar=$('edu-tour'),tourText=$('edu-tourtext'),presentBtn=$('edu-present');
let touring=false,tourIndex=-1;
function updateTour(){const n=sysOf(stack).nodes.length,data=sysOf(stack);
 tourBar.hidden=presentBtn.hidden=!n;
 presentBtn.classList.toggle('active',touring);presentBtn.innerHTML=touring?'◼ <span>End tour</span>':'▶ <span>Guided tour</span>';
 tourText.innerHTML=touring&&tourIndex>=0&&data.nodes[tourIndex]?`<strong>Stop ${tourIndex+1} / ${n}:</strong> ${data.nodes[tourIndex].name}`:`<strong>Explorer mode</strong> · ${n} ${n===1?'world':'worlds'} to discover`}
function tourStep(d){const data=sysOf(stack),n=data.nodes.length;if(!n)return;
 if(tourIndex<0&&d<0)tourIndex=0;                                  // "back" from the start goes to the last stop
 tourIndex=(tourIndex+d+n)%n;showNode(data.nodes[tourIndex].id)}
presentBtn.onclick=()=>{touring=!touring;if(touring){tourIndex=-1;tourStep(1)}else updateTour()};
$('edu-prev').onclick=()=>tourStep(-1);$('edu-next').onclick=()=>tourStep(1);

const split=g=>{const i=g.indexOf(':');return [g.slice(0,i),g.slice(i+1)]};
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');

// Which planet is "here"? Global id '<system>:<planet>' (iWLSA planets: 'main:<id>'). Drives the atlas highlight.
function currentGid(){
 if(!stack.length)return 'core';
 const k=stack[stack.length-1],s=systems[k];
 if(s.view==='main')return 'main:'+selected;
 if(k==='education'||k==='students')return active&&k==='students'?k+':'+active:'main:training';
 if(k==='innovation')return active?'innovation:'+active:'core';
 return active?k+':'+active:GRAPH.openerGid(k)}

// ---------- routing ----------
const toHash=s=>s.length?'#/'+s.join('/'):'#/';
function parseHash(){const parts=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
 for(let i=0;i<parts.length;i++){const s=systems[parts[i]];if(!s||(s.parent||null)!==(parts[i-1]||null))return [];}
 return parts}
function navigate(next,push=true){if(toHash(next)===toHash(stack)&&overlayShown(next)===space.classList.contains('active'))return;
 if(push)history.pushState(null,'',toHash(next));applyRoute(next)}
window.addEventListener('popstate',()=>applyRoute(parseHash()));
window.addEventListener('hashchange',()=>{if(toHash(parseHash())!==toHash(stack))applyRoute(parseHash())});

function applyRoute(next,boot){
 const prev=stack,wasOverlay=space.classList.contains('active')&&!space.classList.contains('leaving'),nowOverlay=overlayShown(next),deeper=next.length>prev.length;
 stack=next;active=null;touring=false;tourIndex=-1;clearTimeout(leaveTimer);
 if(nowOverlay){
  if(!wasOverlay){
   const origin=lastTrigger&&document.querySelector(`[data-id="${lastTrigger}"]`);
   if(origin&&!boot){const r=origin.getBoundingClientRect();space.style.transformOrigin=`${r.left+r.width/2}px ${r.top+r.height/2}px`}else space.style.transformOrigin='50% 50%';
   space.classList.remove('leaving','fx-outdeep','fx-outup');space.classList.add('active');space.setAttribute('aria-hidden','false');
   if(!boot)animate(deeper?'zoom':'rise',space)}
  else animate(deeper?'dive':'rise',stage);
  window.setStars&&window.setStars(false);render();
  if(!boot)(stack.length?exitBtn:orbits.querySelector('.edu-node')).focus();
 }else{
  // Heading into the existing iWLSA universe: the overlay flies past, then is removed.
  if(wasOverlay){space.classList.add('leaving');animate(deeper?'outdeep':'outup',space);
   leaveTimer=setTimeout(()=>{space.classList.remove('active','leaving','fx-outdeep','fx-outup');space.setAttribute('aria-hidden','true')},reduceMotion.matches?0:620)}
  window.setStars&&window.setStars(true);
  const back=lastTrigger&&document.querySelector(`[data-id="${lastTrigger}"]`);(back||$('to-home')).focus();
  window.renderAtlas&&renderAtlas();
 }}

function animate(kind,el){const cls='fx-'+kind;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);
 if(!kind.startsWith('out'))el.addEventListener('animationend',()=>el.classList.remove(cls),{once:true})}

// ---------- rendering (one function draws any universe, including the standalone planet) ----------
const connButtons=g=>GRAPH.linksOf(g).map(l=>{const i=GRAPH.info(l.gid);
 return `<button type="button" data-gid="${l.gid}" class="${l.kind==='proposed'?'proposed':''}">🔗 ${esc(i.label)}${i.lead?' · '+esc(i.lead):''}${i.where?` <span class="where">in ${esc(i.where)}</span>`:''}${l.kind==='proposed'?' <em>proposed</em>':''}</button>`}).join('');

function render(){
 const data=sysOf(stack),key=stack[stack.length-1],parent=stack.length>1?systems[stack[stack.length-2]]:(stack.length?cosmos:null);
 const th=data.theme||cosmos.theme;['--t1','--t2','--t3','--accent'].forEach((v,i)=>space.style.setProperty(v,th[i]));
 $('edu-h1').textContent=(data.h1||data.core).toUpperCase();
 $('edu-eyebrow').textContent=data.eyebrow||(data.lead?'Led by '+data.lead:'One school. One ecosystem.');
 $('edu-title').textContent=data.title;searchBox.value='';
 crumb.innerHTML=(stack.length?`<button data-depth="0">${NET}</button>`:`<strong aria-current="page">${NET}</strong>`)+stack.map((id,i)=>{const last=i===stack.length-1,label=systems[id].crumb||systems[id].core;return ' › '+(last?`<strong aria-current="page">${label}</strong>`:`<button data-depth="${i+1}">${label}</button>`)}).join('');
 crumb.querySelectorAll('[data-depth]').forEach(b=>b.addEventListener('click',()=>navigate(stack.slice(0,+b.dataset.depth))));
 exitBtn.hidden=!stack.length;exitBtn.innerHTML='↖ '+(parent?parent.core:NET);

 const pos=layout(data.nodes.length),lead=l=>l?`<small class="edu-lead">${l}</small>`:'';
 const strings=`<svg class="edu-strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${data.nodes.map((n,i)=>`<line x1="50" y1="50" x2="${pos[i][0]}" y2="${pos[i][1]}" stroke="${n.color}" class="${active===n.id?'on':''}"/>`).join('')}</svg>`;
 const coreTag=data.enter?`<button type="button" class="edu-node core enter" data-core-enter aria-label="Enter ${esc(data.core)}"`:'<div class="edu-node core"';
 const core=`${coreTag} style="--x:50%;--y:50%;--planet:${data.planet}"><span class="edu-sphere">${data.emoji}</span><span class="edu-name">${data.core}${lead(data.lead)}</span>${data.enter?'<small class="edu-hint">Click to enter ✦</small>':''}</${data.enter?'button':'div'}>`;
 orbits.innerHTML='<div class="edu-ring" style="--w:96%;--h:78%"></div><div class="edu-ring" style="--w:69%;--h:91%"></div><div class="edu-ring" style="--w:84%;--h:67%"></div>'+strings+core+data.nodes.map((n,i)=>{const linked=key&&GRAPH.linksOf(key+':'+n.id).length;
  return `<button type="button" class="edu-node ${active===n.id?'picked':''}" data-edu-node="${n.id}" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%;--planet:${n.color};--delay:${i*.28}s"><span class="edu-sphere">${n.emoji}${linked?'<i class="edu-link-badge" title="Connected to other universes">🔗</i>':''}</span><span class="edu-name">${n.name}${n.children?' ✦':''}${lead(n.lead)}</span></button>`}).join('');
 orbits.querySelectorAll('[data-edu-node]').forEach(b=>b.addEventListener('click',()=>showNode(b.dataset.eduNode)));
 orbits.querySelector('[data-core-enter]')?.addEventListener('click',()=>navigate(data.enter));

 const n=data.nodes.find(x=>x.id===active),deeper=n&&n.children&&systems[n.children],hasSub=data.nodes.some(x=>x.children);
 const conn=n&&key?connButtons(key+':'+n.id):'';
 const connHtml=conn?`<h4>Connected to</h4><div class="edu-links">${conn}</div>`:'';
 const feats=n&&n.features!==TBC?`<h4>Focus areas</h4><ul>${n.features.map(f=>`<li>${f}</li>`).join('')}</ul>`:'';
 panel.innerHTML=n?`<div class="edu-kicker">${data.core} / Planet Details</div><h3>${n.emoji} ${n.name}</h3>${n.lead?`<div class="edu-leadline">Led by ${n.lead}</div>`:''}<span class="edu-tag">${deeper?'Opens its own universe':'Programme area'}</span><p>${n.summary}</p>${feats}${n.features===TBC?'<p class="edu-tbc">Details to be confirmed.</p>':''}${connHtml}${deeper?`<button class="edu-action" id="edu-deeper">🚀 Enter ${deeper.core==='AI'?'the AI Universe':deeper.core} →</button>`:''}<button class="edu-action secondary" id="edu-clear">← Back to universe overview</button>`
 :`<div class="edu-kicker">WLSA / Interactive learning journey</div><h3>${data.emoji} ${data.core}</h3>${data.lead?`<div class="edu-leadline">Led by ${data.lead}</div>`:''}<div class="edu-summary"><p>${data.intro}</p></div>${data.enter?`<button class="edu-action" id="edu-enter">🚀 Enter ${NET} →</button>`:`<h4>How to explore</h4><p>Click any orbiting planet to discover it.${hasSub?' <span class="edu-highlight">Planets marked ✦</span> open a deeper universe.':''}</p>${data.nodes.length?`<h4>Available planets</h4><ul>${data.nodes.map(x=>`<li>${x.name}${x.lead?` · ${x.lead}`:''}</li>`).join('')}</ul>`:''}`}${parent?`<button class="edu-action secondary" id="edu-back">← Back to ${parent.core}</button>`:''}`;
 panel.querySelector('#edu-deeper')?.addEventListener('click',()=>navigate([...stack,n.children]));
 panel.querySelector('#edu-enter')?.addEventListener('click',()=>navigate(data.enter));
 panel.querySelector('#edu-clear')?.addEventListener('click',()=>{active=null;render()});
 panel.querySelector('#edu-back')?.addEventListener('click',()=>navigate(stack.slice(0,-1)));
 panel.querySelectorAll('[data-gid]').forEach(b=>b.addEventListener('click',()=>gotoGid(b.dataset.gid)));

 const atlas=$('edu-map-links');atlas.parentElement.hidden=!data.nodes.length;
 atlas.innerHTML=data.nodes.map(x=>`<button type="button" data-map-node="${x.id}" class="${active===x.id?'selected':''}">${x.iconSmall||x.emoji} ${x.name}</button>`).join('');
 atlas.querySelectorAll('button').forEach(b=>b.onclick=()=>showNode(b.dataset.mapNode));
 updateTour();
 window.renderAtlas&&renderAtlas();
}
function showNode(id){active=id;tourIndex=sysOf(stack).nodes.findIndex(x=>x.id===id);render()}

// Same search bar in every universe: filters this universe's planets (universe-wide results: see app-5.js).
searchBox.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase(),data=sysOf(stack);
 orbits.querySelectorAll('[data-edu-node]').forEach(b=>{const n=data.nodes.find(x=>x.id===b.dataset.eduNode);
  b.style.opacity=(!q||(n.name+' '+(n.lead||'')+' '+n.summary).toLowerCase().includes(q))?'1':'.2'})});

// ---------- jumping between universes (works for ANY planet, however deep) ----------
function gotoGid(g){if(g==='core'){navigate([]);return}const [k,id]=split(g);
 if(k==='main'){lastTrigger=id;navigate(['innovation','ai']);choose(id);return}
 lastTrigger=null;navigate(pathTo(k));active=id;render()}
function enterGid(g){if(g==='core'){navigate(['innovation']);return}const [k,id]=split(g);
 if(k==='main'){if(id==='training'){lastTrigger='training';navigate(pathTo('education'))}else gotoGid(g);return}
 const n=systems[k].nodes.find(x=>x.id===id);if(n&&n.children){lastTrigger=null;navigate(pathTo(n.children))}else gotoGid(g)}

// ---------- hooks into the existing iWLSA universe ----------
exitBtn.onclick=()=>navigate(stack.slice(0,-1));
$('to-home').onclick=()=>navigate(['innovation']);
Object.keys(systems).filter(k=>systems[k].entry).forEach(k=>{
 const planet=document.querySelector(`[data-id="${systems[k].entry}"]`);
 planet&&planet.addEventListener('click',e=>{e.stopImmediatePropagation();lastTrigger=systems[k].entry;choose(systems[k].entry);navigate(pathTo(k))},true)});
const originalChooseV7=choose;
choose=function(id){originalChooseV7(id);const k=rootFor(id),actions=document.querySelector('#detail .panel-actions');
 if(k&&actions&&!$('edu-entry')){const btn=document.createElement('button');btn.id='edu-entry';btn.type='button';btn.innerHTML=`🚀 Enter ${systems[k].title}`;btn.style.cssText='background:#6045b4;color:white;border:1px solid #a18bfd;font-weight:800';btn.onclick=()=>{lastTrigger=id;navigate(pathTo(k))};actions.prepend(btn)}
 // Cross-universe strings in this planet's dossier.
 const conn=connButtons('main:'+id);
 if(conn&&actions&&!document.getElementById('cross-links')){const sec=document.createElement('div');sec.className='dossier-section';sec.id='cross-links';
  sec.innerHTML=`<h3>07 / Connected universes</h3><div class="edu-links">${conn}</div>`;
  actions.before(sec);sec.querySelectorAll('[data-gid]').forEach(b=>b.onclick=()=>gotoGid(b.dataset.gid))}};

// Everything searchable, across every universe. Built on first use.
let searchCache=null;
function searchIndex(){if(searchCache)return searchCache;
 const out=[],clean=t=>String(t||'').replace(/^Placeholder: /,''),where=k=>[NET,...pathTo(k).map(x=>systems[x].crumb||systems[x].core)].join(' › ');
 out.push({label:cosmos.core,lead:cosmos.lead,where:'Start',text:cosmos.intro,emoji:cosmos.emoji,run:()=>navigate([])});
 Object.keys(systems).forEach(k=>(systems[k].nodes||[]).forEach(n=>out.push({label:n.name,lead:n.lead,where:where(k),emoji:n.iconSmall||n.emoji,
  text:clean(n.summary)+' '+(n.features===TBC?'':n.features.join(' ')),run:()=>gotoGid(k+':'+n.id)})));
 items.forEach(it=>{const e=extra[it.id];out.push({label:it.name,lead:'',where:'WLSA AI Universe',emoji:'🪐',
  text:[it.subtitle,it.summary,...it.features,e.audience,e.goal,e.deliverable,e.mission].join(' '),run:()=>gotoGid('main:'+it.id)})});
 return searchCache=out}
window.wlsaNav={gotoGid,enterGid,current:currentGid,searchIndex};

// Escape goes up ONE level. Capture phase so an open overview modal gets the key first.
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||modal.classList.contains('open')||!stack.length)return;
 if(e.target.matches&&e.target.matches('input'))return;e.preventDefault();navigate(stack.slice(0,-1))},true);

$('main-eyebrow').textContent='Led by '+systems.ai.lead;   // the AI universe names its lead like every other universe
choose('iwlsa');
// The experience STARTS at the standalone WLSA Innovation & Technology planet (or a shared deep link).
const initial=parseHash();if(initial.length){const k=[...initial].reverse().find(x=>systems[x].entry);lastTrigger=k?systems[k].entry:null}
applyRoute(initial,true);
})();
