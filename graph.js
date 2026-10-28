
// V7 PREVIEW: the network graph is BUILT from universe-data.js, so a new universe or connection appears in
// the Universe Atlas automatically. Layout is a radial "sunburst": the core in the middle, areas on a ring,
// their planets on the next ring, and sub-planets on the outer ring (deeper levels are summarised by their parent).
//   GRAPH.nodes/byId : places shown on the atlas        GRAPH.hier : parent→child strings
//   GRAPH.links      : cross-universe strings (ends resolved to a place that is on the atlas)
//   GRAPH.linksOf(g) : every connection of ANY planet (even ones too deep for the atlas)
const GRAPH=(()=>{
 const U=UNIVERSE,SYS=U.systems,MAXD=3,RX=[0,290,470,620],RY=[0,160,262,352],R=[40,24,13,8];
 const nodes=[],byId={},hier=[];
 const split=g=>{const i=g.indexOf(':');return [g.slice(0,i),g.slice(i+1)]};

 // Any planet's label/lead, whether or not it is drawn on the atlas.
 const info=g=>{if(g==='core')return {label:U.NET,lead:U.cosmos.lead,where:''};const [k,id]=split(g);
  if(k==='main'){const it=lookup[id];return {label:it.name,lead:'',where:'AI Universe'}}
  const n=SYS[k]&&SYS[k].nodes.find(x=>x.id===id);return n?{label:n.name,lead:n.lead||'',where:SYS[k].crumb||SYS[k].core}:{label:g,lead:'',where:''}};
 // The planet in the parent universe that opens system k.
 const openerGid=k=>{if(k==='innovation')return 'core';const s=SYS[k];if(s.entry)return 'main:'+s.entry;
  const n=SYS[s.parent].nodes.find(x=>x.children===k);return s.parent+':'+n.id};

 const kidsOf=(gid,depth)=>{if(depth>=MAXD)return [];
  if(gid==='core')return SYS.innovation.nodes.map(n=>({gid:'innovation:'+n.id,n}));
  if(gid==='innovation:ai')return items.map(it=>({gid:'main:'+it.id,main:it}));   // the iWLSA planets
  const [k,id]=split(gid),node=SYS[k]&&SYS[k].nodes.find(x=>x.id===id);
  return node&&node.children&&SYS[node.children]?SYS[node.children].nodes.map(n=>({gid:node.children+':'+n.id,n})):[]};

 function build(gid,d,n,main){
  const i=info(gid),t={gid,depth:d,label:i.label,lead:i.lead,color:main?main.color:(n?n.color:'#5b8cff'),kids:[],
   enter:gid==='core'||(n&&!!n.children)||gid==='main:training'};
  t.kids=kidsOf(gid,d).map(k=>build(k.gid,d+1,k.n,k.main));
  t.w=t.kids.length?Math.pow(t.kids.reduce((s,k)=>s+k.w,0),.75):1;   // damped, so big branches do not crowd out small ones
  if(d===1)t.w=Math.max(t.w,2.6);                                  // keep small areas from vanishing
  return t}
 const root=build('core',0);

 function place(t,a0,a1){const a=(a0+a1)/2;t.x=700+RX[t.depth]*Math.cos(a);t.y=425+RY[t.depth]*Math.sin(a);
  nodes.push({id:t.gid,label:t.label,lead:t.lead,color:t.color,depth:t.depth,r:R[t.depth],x:Math.round(t.x),y:Math.round(t.y),enter:t.enter});
  byId[t.gid]=nodes[nodes.length-1];
  const sum=t.kids.reduce((s,k)=>s+k.w,0);let acc=a0;t.kids.forEach(k=>{const span=(a1-a0)*k.w/sum;hier.push([t.gid,k.gid]);place(k,acc,acc+span);acc+=span})}
 const total=root.kids.reduce((s,k)=>s+k.w,0);
 // AI is centred on the left-hand side, where the iWLSA universe used to be.
 root.depth=0;nodes.push({id:'core',label:root.label,lead:root.lead,color:root.color,depth:0,r:R[0],x:700,y:425,enter:true});byId.core=nodes[0];
 let acc=Math.PI-(2*Math.PI*root.kids[0].w/total)/2;root.kids.forEach(k=>{const span=2*Math.PI*k.w/total;hier.push(['core',k.gid]);place(k,acc,acc+span);acc+=span});

 // Climb to the nearest place that IS drawn (e.g. 'vald:tracking' is 4 levels deep).
 const resolve=g=>{let guard=0;while(!byId[g]&&guard++<10)g=openerGid(split(g)[0]);return g};
 const raw=U.links.map(([a,b,kind])=>({a,b,kind}));
 const links=raw.map(l=>({a:resolve(l.a),b:resolve(l.b),kind:l.kind})).filter(l=>l.a!==l.b);
 const linksOf=g=>raw.filter(l=>l.a===g||l.b===g).map(l=>({gid:l.a===g?l.b:l.a,kind:l.kind}));
 return {nodes,byId,hier,links,linksOf,info,openerGid,resolve};
})();
