
// WLSA Universe v2: full detail dossiers and linked navigable mini-map
const extra={
 iwlsa:{audience:'Students · Teachers · Staff',goal:'One coherent school digital experience',deliverable:'Learning hub, school AI assistance and app access',depend:'Connected apps, approved content and secure identity',future:'Connect school-specific model capabilities when tested and approved',mission:'Explore the main platform that brings everything together.',roadmap:'Build and refine the shared learning experience'},
 athletics:{audience:'Athletes · Coaches · Families',goal:'Simplify and celebrate school sports',deliverable:'Schedules, profiles, team information and communications',depend:'Sports department workflows and controlled school records',future:'Optional authorised AI sports information and assistance',mission:'Discover how students can find fixtures and team updates.',roadmap:'Evolve the demo into an integrated working app'},
 wechat:{audience:'Parents · Students · School staff',goal:'Convenient authorised access via WeChat',deliverable:'Attendance, grades, leave requests and school notices',depend:'PowerSchool APIs, permissions and approval workflows',future:'AI guidance for navigating school services where appropriate',mission:'Find how parents can access school services from WeChat.',roadmap:'Confirm PowerSchool integration scope and privacy controls'},
 tools:{audience:'Students · Teachers · Departments',goal:'Build solutions for classroom needs',deliverable:'Games, websites, mini apps and revision aids',depend:'Teacher input, student creators and testing',future:'Reuse WLSA-approved AI learning services across tools',mission:'Discover interactive games and tools that teachers and students can create.',roadmap:'Identify pain points, prototype, pilot and improve'},
 interns:{audience:'Student innovators · Teachers',goal:'Develop practical AI innovation skills',deliverable:'Student projects and contributions to school solutions',depend:'Mentoring, scoped projects and staff collaboration',future:'Student participation in safe model evaluation and education AI research',mission:'See how students can become builders, not just users.',roadmap:'Mentor student teams and showcase outcomes'},
 agents:{audience:'Administration · AAO · Staff',goal:'Reduce repetitive school work',deliverable:'Supervised AI agents and automations',depend:'Workflow mapping, access permissions and approvals',future:'Use specialised WLSA AI capabilities with clear human oversight',mission:'Learn how school operations could become more efficient.',roadmap:'Pilot low-risk automations before broader deployment'},
 training:{audience:'Grade 9 students · Teachers · Staff',goal:'Grow responsible AI capability',deliverable:'AI curriculum, workshops and staff development',depend:'Curriculum planning and staff needs',future:'Prepare the community to use emerging school-specific AI safely',mission:'Explore how everyone can learn to use and create AI responsibly.',roadmap:'Run Grade 9 pilot and improve staff PD using feedback'},
 data:{audience:'Approved system owners · Developers',goal:'Connect platforms responsibly',deliverable:'Integrations, curated knowledge and governance',depend:'School data agreements, security and API access',future:'Support retrieval, evaluation and any future custom model work',mission:'Discover the invisible infrastructure connecting the universe.',roadmap:'Build governed knowledge and integration foundations'},
 llm:{audience:'Long-term school-wide vision',goal:'Explore a specialised WLSA educational AI capability',deliverable:'Evaluated, safe, school-specific model system',depend:'High-quality approved knowledge, governance and technical resources',future:'Personalised education supported by school-specific AI',mission:'Investigate the long-term goal and what must happen first.',roadmap:'Long-term ambition: research, evaluate and build responsibly'}
};
const originalChoose=choose;
choose=function(id){
 originalChoose(id);const v=lookup[id],e=extra[id];
 document.getElementById('detail').innerHTML=`
 <div class="dossier-top"><div class="bigicon" style="background:${v.color}22;border-color:${v.stroke};color:${v.stroke}">${icon(v.icon)}</div><div><h2>${v.name}</h2><div class="subtitle">${v.subtitle}</div></div></div>
 <div class="dossier-status"><span class="pill">${v.type}</span><span class="pill" style="color:#ffdda8;border-color:#896a32;background:#4e3a183c">${v.status}</span></div>
 <p class="dossier-desc">${v.summary}</p>
 <div class="dossier-section"><h3>01 / Mission brief</h3><p>${e.mission}</p></div>
 <div class="dossier-section"><h3>02 / Who it's for & why</h3><div class="info-grid"><div class="info-tile"><span>Audience</span><strong>${e.audience}</strong></div><div class="info-tile"><span>Objective</span><strong>${e.goal}</strong></div></div></div>
 <div class="dossier-section"><h3>03 / Core capabilities</h3><ul class="feature-list">${v.features.map(x=>`<li>${x}</li>`).join('')}</ul></div>
 <div class="dossier-section"><h3>04 / What needs to happen</h3><div class="info-grid"><div class="info-tile"><span>Next delivery focus</span><strong>${e.deliverable}</strong></div><div class="info-tile"><span>Key dependencies</span><strong>${e.depend}</strong></div></div><div class="roadmap-strip"><span class="dot"></span><span class="rule"></span><small>${e.roadmap}</small></div></div>
 <div class="dossier-section"><h3>05 / Future AI connection</h3><p>${e.future}</p></div>
 <div class="dossier-section"><h3>06 / Connected worlds</h3><div class="connected">${v.connections.map(c=>`<button type="button" data-open="${c}">${lookup[c].name} ↗</button>`).join('')}</div></div>
 <div class="panel-actions"><button type="button" id="show-on-atlas">◎ View in atlas</button><button type="button" id="next-mission">Next world →</button></div>`;
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>choose(b.dataset.open));
 document.getElementById('show-on-atlas').onclick=()=>openOverview();
 document.getElementById('next-mission').onclick=()=>{let n=order.indexOf(selected);choose(order[(n+1)%order.length])};
 document.getElementById('mapfocus').textContent=v.name;
 renderAtlas();
};
function atlasMarkup(full){let start=items.filter(x=>x.id==='iwlsa'), others=items.filter(x=>x.id!=='iwlsa');
 let paths=edges.map(e=>{let a=lookup[e.a],b=lookup[e.b];return `<line class="mini-link ${selected===a.id||selected===b.id?'hot':''}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`}).join('');
 let dots=[...start,...others].map(it=>{let isOn=it.id===selected;return `<g data-select="${it.id}" role="button" tabindex="0" aria-label="Open ${it.name}"><circle class="mini-dot ${isOn?'hot':''}" cx="${it.x}" cy="${it.y}" r="${full?(it.id==='iwlsa'?42:31):(it.id==='iwlsa'?38:27)}" fill="${it.color}"/><text x="${it.x}" y="${it.y-46}" text-anchor="middle" fill="#e7f5ff" font-size="${full?20:18}" font-weight="700" style="pointer-events:none">${it.name.replaceAll('&','&amp;')}</text></g>`}).join('');
 let box=full?'':`<rect class="mini-box" x="${700-390/zoom-offsetX*.5}" y="${425-210/zoom-offsetY*.5}" width="${780/zoom}" height="${420/zoom}"/>`;
 return paths+dots+box;
}
function bindAtlas(el){el.querySelectorAll('[data-select]').forEach(g=>{g.addEventListener('click',()=>{choose(g.dataset.select);if(el.id==='overview-svg')closeOverview()});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();g.dispatchEvent(new Event('click'))}})})}
function renderAtlas(){for(const [id,full] of [['minimap-svg',false],['overview-svg',true]]){const svg=document.getElementById(id);svg.innerHTML=atlasMarkup(full);bindAtlas(svg)}}
const om=document.getElementById('overview-modal');function openOverview(){renderAtlas();om.classList.add('open');document.getElementById('overview-close').focus()};function closeOverview(){om.classList.remove('open')};document.getElementById('expandmap').addEventListener('click',openOverview);document.getElementById('overview-close').addEventListener('click',closeOverview);om.addEventListener('click',e=>{if(e.target===om)closeOverview()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&om.classList.contains('open'))closeOverview()});
const oldUpdateWorld=updateWorld;let atlasQueued=false;updateWorld=function(){oldUpdateWorld();if(atlasQueued)return;atlasQueued=true;requestAnimationFrame(()=>{atlasQueued=false;renderAtlas()})};
choose('iwlsa');
