
// V6 PREVIEW: universe-wide search. The same search bar (header of every universe) now lists matches
// from ALL universes as you type: planets, people (leads), and words in their descriptions.
// Arrow keys + Enter, or click a result, to travel straight to it.
(()=>{
const $=id=>document.getElementById(id);
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');

function query(q){
 const terms=q.toLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return [];
 return window.wlsaNav.searchIndex().map(e=>{
  const label=e.label.toLowerCase(),lead=(e.lead||'').toLowerCase(),where=e.where.toLowerCase(),text=e.text.toLowerCase();let score=0;
  for(const t of terms){
   const s=(label.startsWith(t)?60:label.includes(t)?40:0)+(lead.includes(t)?30:0)+(where.includes(t)?8:0)+(text.includes(t)?4:0);
   if(!s)return null;score+=s}                                    // every word must match somewhere
  return {e,score}}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,8).map(x=>x.e)}

function attach(input,dimPlanets){
 const box=document.createElement('div');box.className='search-results';box.id=input.id+'-results';box.setAttribute('role','listbox');box.hidden=true;
 input.parentElement.appendChild(box);
 input.setAttribute('role','combobox');input.setAttribute('aria-controls',box.id);input.setAttribute('aria-expanded','false');input.setAttribute('autocomplete','off');
 input.placeholder='⌕  Find a project, person or planet…';
 let hits=[],sel=0;
 const close=()=>{box.hidden=true;input.setAttribute('aria-expanded','false')};
 function draw(){const q=input.value.trim();
  if(!q){close();return}
  box.hidden=false;input.setAttribute('aria-expanded','true');
  box.innerHTML=hits.length?hits.map((h,i)=>`<div class="sr-item" role="option" id="${box.id}-${i}" aria-selected="${i===sel}" data-i="${i}"><span class="sr-ico">${h.emoji||'•'}</span><span class="sr-main"><b>${esc(h.label)}</b>${h.lead?` <em>· ${esc(h.lead)}</em>`:''}<small>${esc(h.where)}</small></span></div>`).join(''):`<div class="sr-empty">No matches for “${esc(q)}”</div>`;
  input.setAttribute('aria-activedescendant',hits.length?`${box.id}-${sel}`:'')}
 function pick(h){if(!h)return;input.value='';close();dimPlanets&&dimPlanets('');h.run()}

 input.addEventListener('input',()=>{hits=query(input.value);sel=0;draw();dimPlanets&&dimPlanets(input.value.trim().toLowerCase())});
 input.addEventListener('focus',()=>{if(input.value.trim())draw()});
 input.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!hits.length)return;e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+hits.length)%hits.length;draw();box.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'})}
  else if(e.key==='Enter'){e.preventDefault();pick(hits[sel])}
  else if(e.key==='Escape'&&!box.hidden){e.preventDefault();e.stopPropagation();input.value='';close();dimPlanets&&dimPlanets('')}});
 input.addEventListener('blur',()=>setTimeout(close,150));
 box.addEventListener('mousedown',e=>e.preventDefault());          // keep focus so the click lands
 box.addEventListener('click',e=>{const r=e.target.closest('[data-i]');if(r)pick(hits[+r.dataset.i])});
}

// Main universe: dim planets that do not match, as before; but no longer auto-jump while typing.
const main=$('search');main.oninput=null;
attach(main,q=>document.querySelectorAll('.planet').forEach(n=>{
 const it=lookup[n.dataset.id];n.style.opacity=(!q||(it.name+' '+it.summary).toLowerCase().includes(q))?'':'.15'}));
attach($('edu-search'));
})();
