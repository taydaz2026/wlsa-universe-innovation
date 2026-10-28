
// V7 PREVIEW: the Universe Atlas shows the WHOLE network (all universes + cross-links), built from universe-data.js.
// Draggable, starts bottom-right, collapsible (button or "M"), resizable, pins on click. It never grows just because the mouse is over it.
// Clicking a place keeps your current view and selects it; "Go into it" takes you there.
(()=>{
const $=id=>document.getElementById(id);
const map=document.querySelector('.minimap'),title=map.querySelector('.map-title'),svg=$('minimap-svg'),big=$('overview-svg'),
 pinBtn=$('map-pin'),colBtn=$('map-collapse'),enterBtn=$('map-enter'),label=$('mapfocus'),count=$('mapcount'),om=$('overview-modal');
let pinned=false,collapsed=false,drag=null,mapSel=null,drawn='';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');

// ---- drawing ----
function markup(full,here){
 const N=GRAPH.byId,curve=(a,b,bend)=>{const mx=(a.x+b.x)/2+(a.y-b.y)*bend,my=(a.y+b.y)/2-(a.x-b.x)*bend;return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`};
 const focus=new Set([here,mapSel].filter(Boolean));
 GRAPH.links.forEach(l=>{if(focus.has(l.a))focus.add(l.b);if(focus.has(l.b))focus.add(l.a)});   // places connected to what you are looking at
 const hier=GRAPH.hier.map(([a,b])=>`<line class="g-hier ${a===here||b===here?'hot':''}" x1="${N[a].x}" y1="${N[a].y}" x2="${N[b].x}" y2="${N[b].y}"/>`).join('');
 const links=GRAPH.links.map(l=>`<path class="g-link ${l.kind} ${l.a===here||l.b===here||l.a===mapSel||l.b===mapSel?'hot':''}" d="${curve(N[l.a],N[l.b],.16)}"/>`).join('');
 const nodes=GRAPH.nodes.map(n=>{const on=n.id===here,sel=n.id===mapSel,r=n.r*(full?1.15:1),d=n.depth,fs=[22,20,14,12][d]*(full?1.05:1),side=n.x>700?1:-1;
  // Outer-ring labels would overlap in the small map: show them in the big view, or when they matter.
  const showLabel=d<3||full||on||sel||focus.has(n.id),showLead=n.lead&&d<2;
  // Outer planets put their label beside the dot, away from the centre, so neighbours do not overlap.
  // The outermost ring is written along the spoke, so labels fan out instead of colliding.
  const rot=Math.round(Math.atan2(n.y-425,n.x-700)*180/Math.PI+(side<0?180:0));
  const lx=d>=2?n.x+side*(r+5):n.x,ly=d>=2?n.y+fs*.35:n.y+r+fs+2,anchor=d>=2?(side>0?'start':'end'):'middle';
  return `<g class="g-node" data-gid="${n.id}" role="button" tabindex="0" aria-label="${esc(n.label)}${n.lead?', '+esc(n.lead):''}"><circle class="g-dot ${on?'here':''} ${sel?'sel':''}" cx="${n.x}" cy="${n.y}" r="${r}" fill="${n.color}"/>${showLabel?`<text class="g-label" x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="${fs}"${d===3?` transform="rotate(${rot} ${n.x} ${n.y})"`:''}>${esc(n.label)}</text>`:''}${showLead?`<text class="g-lead" x="${n.x}" y="${n.y+r+fs*2+3}" text-anchor="middle" font-size="${fs-4}">${esc(n.lead)}</text>`:''}</g>`}).join('');
 return hier+links+nodes}

// Replaces the old main-universe-only atlas (app-2.js calls these names).
renderAtlas=function(){const here=window.wlsaNav?GRAPH.resolve(wlsaNav.current()):'core',key=here+'|'+mapSel+'|'+(om.classList.contains('open')?1:0);
 if(key===drawn)return;drawn=key;[svg,big].forEach(e=>e.setAttribute('viewBox','-140 0 1680 850'));svg.innerHTML=markup(false,here);big.innerHTML=markup(true,here);
 label.textContent=GRAPH.byId[mapSel||here].label;
 const t=mapSel&&mapSel!==here?GRAPH.byId[mapSel]:null;enterBtn.hidden=!t;if(t)enterBtn.textContent=(t.enter?'Go into it':'Go there')+' ↗';
 count.textContent=`${GRAPH.nodes.length} places · ${GRAPH.links.length} links`};

// ---- interaction ----
function pick(e,svgEl){const g=e.target.closest('[data-gid]');return g&&svgEl.contains(g)?g.dataset.gid:null}
svg.addEventListener('click',e=>{setPinned(true);const g=pick(e,svg);if(g){mapSel=g;drawn='';renderAtlas()}});   // keep the view, just select
big.addEventListener('click',e=>{const g=pick(e,big);if(g){closeOverview();wlsaNav.enterGid(g)}});        // the full overview goes straight there
[svg,big].forEach(el=>el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-gid]')){e.preventDefault();e.target.closest('[data-gid]').dispatchEvent(new MouseEvent('click',{bubbles:true}))}}));
// Hovering a place previews its name without changing anything.
svg.addEventListener('mouseover',e=>{const g=pick(e,svg);if(g)label.textContent=GRAPH.byId[g].label+' (preview)'});
svg.addEventListener('mouseout',e=>{if(pick(e,svg)){const here=GRAPH.resolve(wlsaNav.current());label.textContent=GRAPH.byId[mapSel||here].label}});
enterBtn.addEventListener('click',()=>{const g=mapSel;mapSel=null;drawn='';wlsaNav.enterGid(g)});

function setPinned(v){pinned=v;map.classList.toggle('pinned',v);pinBtn.setAttribute('aria-pressed',String(v));pinBtn.textContent=v?'⌖ Unpin':'⌖ Pin'}
pinBtn.addEventListener('click',()=>setPinned(!pinned));
function setCollapsed(v){collapsed=v;map.classList.toggle('collapsed',v);colBtn.setAttribute('aria-expanded',String(!v));colBtn.textContent=v?'▢':'–';colBtn.title=v?'Open the map (M)':'Collapse the map (M)'}
colBtn.addEventListener('click',()=>setCollapsed(!collapsed));
document.addEventListener('keydown',e=>{if((e.key==='m'||e.key==='M')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/input|textarea/i.test(e.target.tagName))setCollapsed(!collapsed)});

// Dragging by the title bar. Anchor to the nearest screen edges so it grows inward when you resize or pin it.
var anchor=function(x,y,w,h){const s=map.style;s.left=s.right=s.top=s.bottom='auto';
 if(x+w/2<innerWidth/2)s.left=x+'px';else s.right=(innerWidth-x-w)+'px';
 if(y+h/2<innerHeight/2)s.top=y+'px';else s.bottom=(innerHeight-y-h)+'px'}
title.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const r=map.getBoundingClientRect();
 drag={dx:e.clientX-r.left,dy:e.clientY-r.top,w:r.width,h:r.height};title.setPointerCapture(e.pointerId);map.classList.add('dragging')});
title.addEventListener('pointermove',e=>{if(!drag)return;anchor(clamp(e.clientX-drag.dx,0,innerWidth-drag.w),clamp(e.clientY-drag.dy,0,innerHeight-drag.h),drag.w,drag.h)});
const endDrag=()=>{drag=null;map.classList.remove('dragging')};
title.addEventListener('pointerup',endDrag);title.addEventListener('pointercancel',endDrag);

// ---- resizing: drag the corner grip, or step through sizes with the button ----
// Height follows width (the chart keeps its shape), so only width is stored.
map.dataset.side='right';
const grip=document.createElement('span');grip.id='map-grip';grip.className='map-grip';grip.setAttribute('role','separator');grip.setAttribute('aria-label','Drag to resize the map');map.appendChild(grip);
const maxW=()=>Math.max(260,Math.min(innerWidth-40,(innerHeight-150)*1.95));
function setW(w){const v=clamp(w,230,maxW());map.style.setProperty('--map-w',Math.round(v)+'px');map.classList.add('sized')}
const leftAnchored=()=>map.dataset.side==='left';
grip.addEventListener('pointerdown',e=>{e.preventDefault();grip.setPointerCapture(e.pointerId);map.classList.add('resizing')});
grip.addEventListener('pointermove',e=>{if(!map.classList.contains('resizing'))return;const r=map.getBoundingClientRect();setW(leftAnchored()?e.clientX-r.left:r.right-e.clientX)});
const endResize=()=>map.classList.remove('resizing');grip.addEventListener('pointerup',endResize);grip.addEventListener('pointercancel',endResize);
grip.addEventListener('dblclick',()=>{map.classList.remove('sized');map.style.removeProperty('--map-w')});   // double-click resets
const sizeBtn=document.createElement('button');sizeBtn.id='map-size';sizeBtn.type='button';sizeBtn.title='Make the map bigger';sizeBtn.textContent='⤡ Size';
document.querySelector('.map-btns').insertBefore(sizeBtn,pinBtn);
let step=0;sizeBtn.addEventListener('click',()=>{const sizes=[290,520,760,9999];step=(step+1)%sizes.length;setW(sizes[step]);setCollapsed(false)});
addEventListener('resize',()=>{if(map.classList.contains('sized'))setW(parseFloat(map.style.getPropertyValue('--map-w'))||290)});
// keep the grip on the side that grows inward when the map is dragged to another edge
const baseAnchor=anchor;anchor=function(x,y,w,h){baseAnchor(x,y,w,h);map.dataset.side=x+w/2<innerWidth/2?'left':'right'};

renderAtlas();
})();
