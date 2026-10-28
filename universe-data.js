
// V7 PREVIEW: ALL universe content lives here. Add a universe = add one block to `systems` and a planet
// with `children:'<id>'` in its parent. Add a connection = add a row to `links`.
//   parent : system it sits inside (null = directly under WLSA Innovation & Technology)
//   view   : 'main' = the existing iWLSA universe (no overlay drawn)
//   entry  : id of an iWLSA planet that opens this system
//   theme  : [centre, mid, edge, accent] colours so each universe feels different
// Planet ids are unique inside a system. A planet's global id is '<systemId>:<planetId>' (iWLSA planets: 'main:<id>').
// Text starting "Placeholder" or "Part of" is waiting for real wording. Names and leads come from the brief.
const UNIVERSE=(()=>{
const TBC=['Placeholder: details to be confirmed'];
const NET='WLSA Innovation & Technology';
const PAL=['#4bc7ff','#ffbd73','#ec9bda','#4ee0be','#b98aff','#f5b95d','#65ceef','#9b88ff'];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// Planets for a list of items. An item is a name, or {id,name,emoji,summary,features,lead,children}.
const planets=(parent,emoji,list)=>list.map((x,i)=>{const o=typeof x==='string'?{name:x}:x;
 return {id:o.id||slug(o.name),name:o.name,emoji:o.emoji||emoji,color:o.color||PAL[i%PAL.length],lead:o.lead,children:o.children,
  summary:o.summary||`Part of ${parent}.`,features:o.features||TBC}});

// The AI "circuit chip" icon, drawn as inline SVG so it scales with the text around it.
// Its gradient (#wlsa-chip-g) is defined once in index.html. The bold version is used where the icon is small.
const CHIP_T=['M41 30V21L35 15','M50 30V11','M59 30V21L65 15','M41 70V79L35 85','M50 70V89','M59 70V79L65 85','M30 41H21L15 35','M30 50H11','M30 59H21L15 65','M70 41H79L85 35','M70 50H89','M70 59H79L85 65'];
const CHIP_D=[[35,15],[50,11],[65,15],[35,85],[50,89],[65,85],[15,35],[11,50],[15,65],[85,35],[89,50],[85,65]];
const chipIcon=bold=>`<svg class="aichip" viewBox="0 0 100 100" role="img" aria-label="AI"><g fill="none" stroke="url(#wlsa-chip-g)" stroke-width="${bold?3.4:2.2}" stroke-linecap="round" stroke-linejoin="round">${CHIP_T.map(d=>`<path d="${d}"/>`).join('')}</g><g fill="url(#wlsa-chip-g)">${CHIP_D.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${bold?4.6:3.1}"/>`).join('')}</g><rect x="30" y="30" width="40" height="40" rx="6" fill="#0a1630" stroke="url(#wlsa-chip-g)" stroke-width="${bold?3:2.4}"/><rect x="35.5" y="35.5" width="29" height="29" rx="3.5" fill="none" stroke="url(#wlsa-chip-g)" stroke-opacity=".75" stroke-width="1.2"/><text x="50" y="${bold?59:57.5}" text-anchor="middle" font-size="${bold?25:20}" font-weight="800" font-family="Inter,'Segoe UI',Arial,sans-serif" fill="url(#wlsa-chip-g)">AI</text></svg>`;
const AI_ICON=chipIcon(false),AI_ICON_SMALL=chipIcon(true);

const cosmos={h1:NET,eyebrow:'One school. One ecosystem.',title:'Discover our digital future.',core:NET,lead:'Slava Matvejevs',emoji:'💡',planet:'#2f8cff',enter:['innovation'],nodes:[],
 theme:['#1c1b54','#080f30','#030815','#9fb7ff'],intro:'The department behind WLSA’s AI, prototyping, programmes, networks and school systems. Select the planet to see the areas around it.'};

const systems={
 innovation:{parent:null,crumb:'Areas',h1:NET,title:'Choose an area to explore',core:NET,lead:'Slava Matvejevs',emoji:'💡',planet:'#2f8cff',theme:cosmos.theme,
  intro:'Each world below is led by a named colleague and opens its own universe. Strings in the atlas show how areas connect to each other.',nodes:[
  {id:'ai',name:'AI',lead:'Darren Taylor',emoji:AI_ICON,iconSmall:AI_ICON_SMALL,color:'#45bbff',summary:'The WLSA AI Universe: iWLSA and every connected platform and initiative.',features:['iWLSA learning platform and connected apps','AI Education for students, teachers, parents and staff','Administrative AI and automation','North Star: a WLSA education LLM (long-term aspiration)'],children:'ai'},
  {id:'proto',name:'3D & Prototyping',lead:'Jose Dominguez',emoji:'🧊',color:'#f5b95d',summary:'Prototyping, emerging technology, community outreach, interns and fellows.',features:['Prototyping','Emerging Technology','Community Outreach & Education','Interns','Fellows'],children:'proto'},
  {id:'pedag',name:'Pedagogical & Internship Programs',lead:'Jing Wu',emoji:'🎓',color:'#ea537c',summary:'Teacher support, PBL and innovation events, the Innovation Fellowship and the student internship.',features:['Teacher Professional Support','PBL Projects & Innovation Fair','Innovation Fellowship','Innovation Center Student Internship'],children:'pedag'},
  {id:'network',name:'Network & System Architecture',lead:'Jackey & Jimmy',emoji:'🌐',color:'#4fd8f0',summary:'A shared ecosystem with two systems: Jackey’s infrastructure, network and security, and Jimmy’s helpdesk, on-site support and system support.',features:['Jackey: Infrastructure, Network & Security','Jimmy: Helpdesk, Support & Systems'],children:'network'},
  {id:'schoolsys',name:'School Systems',lead:'Johnson',emoji:'🏫',color:'#6ee79f',summary:'PowerSchool SIS configuration, academic workflow support and cross-department collaboration.',features:['PowerSchool SIS Configuration & Management','Academic Workflow and Stakeholder Support','Cross Department Collaboration'],children:'schoolsys'}
 ]},

 // ---------- AI (Taylor) ----------
 ai:{parent:'innovation',view:'main',title:'WLSA AI Universe',core:'AI',lead:'Darren Taylor'},
 education:{parent:'ai',entry:'training',h1:'WLSA AI EDUCATION',title:'AI learning for the whole community',core:'AI Education',emoji:'🎓',planet:'#996ef4',theme:['#2a1b5c','#0d0f33','#04081a','#c6b4ff'],intro:'A school-wide programme for developing informed, capable and responsible AI users and creators.',nodes:[
  {id:'students',name:'Students',emoji:'🧑‍🎓',color:'#4bc7ff',summary:'AI education designed around student learning, creativity and real projects.',features:['Grade 9 AI pilot course','AI literacy and digital citizenship','Prompt engineering and practical tools','Independent student innovation projects'],children:'students'},
  {id:'teachers',name:'Teachers',emoji:'📚',color:'#5ca7ff',summary:'Supporting teachers in the responsible, effective use of AI for teaching and learning.',features:['AI-assisted lesson preparation','Feedback and resource design','Subject-specific workshops','Classroom implementation and evaluation']},
  {id:'parents',name:'Parents',emoji:'🏡',color:'#ec9bda',summary:'Helping families understand AI, school expectations and safe use at home.',features:['Parent AI awareness sessions','Academic integrity guidance','Family digital citizenship resources','Understanding AI-supported learning']},
  {id:'staff',name:'Staff',emoji:'💼',color:'#4ee0be',summary:'Building the professional skills needed to work productively with AI.',features:['Staff professional development','Everyday AI workflows','Privacy and responsible AI','Practical department-specific training']},
  {id:'literacy',name:'AI Literacy',emoji:'🧠',color:'#ffbd73',summary:'Developing critical awareness of AI capabilities, risks and limitations across WLSA.',features:['Model reliability and bias','Critical thinking and verification','Ethics and academic honesty','Data privacy and online safety']},
  {id:'resources',name:'Resources',emoji:'📖',color:'#ba9aff',summary:'Shared teaching materials, reference guides and learning opportunities.',features:['Tutorials and learning guides','Course and workshop materials','Approved tool recommendations','Learning activities and templates']}
 ]},
 students:{parent:'education',h1:'WLSA STUDENT AI',title:'Learn • Experiment • Build • Lead',core:'Student AI',emoji:'🧑‍🎓',planet:'#239ed9',theme:['#0b3b63','#07173a','#030a1a','#8fd8ff'],intro:'Student opportunities range from introductory AI literacy to authentic innovation and school projects.',nodes:[
  {id:'grade9',name:'Grade 9 AI Course',emoji:'🚀',color:'#59beff',summary:'A proposed structured Grade 9 pilot course to introduce AI principles, practical prompting and responsible use.',features:['Foundations of artificial intelligence','Prompt engineering and evaluation','Responsible AI use','Practical activities and mini projects']},
  {id:'prompting',name:'Prompt Engineering',emoji:'💬',color:'#9b88ff',summary:'Learn how to communicate effectively with AI systems and critically assess their responses.',features:['Prompt structures','Iteration and testing','Verification of AI outputs','Appropriate AI assistance']},
  {id:'citizenship',name:'Responsible AI',emoji:'🛡️',color:'#45d1be',summary:'Learn the ethical and safe use of generative AI at school and beyond.',features:['Academic integrity','Bias and hallucination awareness','Privacy and data protection','Disclosure and transparency']},
  {id:'projects',name:'Student AI Projects',emoji:'🛠️',color:'#ffbe6c',summary:'Create prototypes, educational tools and solutions to genuine school challenges.',features:['Educational games and apps','Department-supported innovation','Collaborative prototyping','Testing and presentations']},
  {id:'internships',name:'AI Internships',emoji:'🌟',color:'#f48cca',summary:'Student interns contribute to approved Innovation Team projects under staff supervision.',features:['Mentored development work','Small school improvement projects','Project documentation','Showcase and reflection']},
  {id:'studentresources',name:'Learning Resources',emoji:'📚',color:'#65ceef',summary:'Find curated resources to improve AI literacy and technical skills.',features:['Starter guides','Suggested practice challenges','School AI expectations','Project resources']}
 ]},

 // ---------- 3D & Prototyping (Jose Dominguez) ----------
 proto:{parent:'innovation',h1:'3D & PROTOTYPING',title:'Make it real',core:'3D & Prototyping',lead:'Jose Dominguez',emoji:'🧊',planet:'#d9942c',theme:['#4d300b','#211306','#0b0603','#ffcb6e'],intro:'Prototyping, emerging technology, community outreach, and the interns and fellows who work alongside them.',nodes:[
  {id:'prototyping',name:'Prototyping',emoji:'🛠️',color:'#f5b95d',summary:'Making ideas physical, from design through to finished prototypes.',features:['3D Printing','Laser Cutting','CAD','Design Fundamentals','Event support, teacher training and procurement'],children:'protolab'},
  {id:'emerging',name:'Emerging Technology',emoji:'🛰️',color:'#b98aff',summary:'VALD athletic systems and AI, MagicSchool AI and other emerging tools.',features:['VALD Athletic Systems & AI','MagicSchool AI','VR Learning'],children:'emerging'},
  {id:'outreach',name:'Community Outreach & Education',emoji:'🤝',color:'#ec9bda',summary:'Education and support for students, teachers, parents and external partners.',features:['In-School Collaboration','Student Education & Wellbeing','Teacher Education','Parent Education & Parenting Support','School Incentive Schemes for Self-Paced PD','Masterclass Style In-House PD','External Partnerships'],children:'outreach'},
  {id:'interns',name:'Interns',emoji:'🧑‍💻',color:'#4ee0be',summary:'Student interns working in three tracks. Part of the Innovation Center Student Internship.',features:['Digital Media Track','3D Printing & Prototyping Track','Emerging Tech & Research Track']},
  {id:'fellows',name:'Fellows',emoji:'🏅',color:'#9b88ff',summary:'Teacher fellows working in three areas. Part of the Innovation Fellowship.',features:['Humanities (MagicSchool)','Prototyping & Emerging Tech','Humanities Lab: Community focused Impact Project across all of G12, Curriculum Design, Teaching']}
 ]},
 protolab:{parent:'proto',h1:'PROTOTYPING',title:'From idea to object',core:'Prototyping',lead:'Jose Dominguez',emoji:'🛠️',planet:'#d9942c',theme:['#573709','#241506','#0c0702','#ffd27d'],intro:'The prototyping lab and the skills, tools and events around it.',nodes:planets('Prototyping','🛠️',[
  {name:'3D Printing',emoji:'🖨️'},{id:'events',name:'In-House Event Support (Bazaar, Innovation Fair, etc)',emoji:'🎪'},{name:'Laser Cutting',emoji:'✂️'},
  {id:'cad',name:'CAD',emoji:'📐',summary:'Computer-aided design tools.',features:['AutoCAD','TinkerCAD','SketchUp','xTool','Lightforge','UE5']},
  {name:'Design Fundamentals',emoji:'🎨'},{id:'teachertrain',name:'Teacher Training and Subject Integration',emoji:'🧑‍🏫'},{name:'Procurement and Protocols',emoji:'📦'}])},
 emerging:{parent:'proto',h1:'EMERGING TECHNOLOGY',title:'What is next',core:'Emerging Technology',lead:'Jose Dominguez',emoji:'🛰️',planet:'#8f5fe0',theme:['#33206b','#120c31','#05030f','#c9b0ff'],intro:'Athletic systems, AI platforms and other emerging tools in school use.',nodes:[
  {id:'vald',name:'VALD Athletic Systems & AI',emoji:'🏃',color:'#4ee0be',summary:'Athletic performance systems and AI for student athletes and PE staff.',features:['SpeedGate and ForceDeck Systems','Student Athlete Data Tracking','Injury Prevention','Sport-Specific Training Resources','PE and Athletic Leadership Training','Student Athlete Education and Sports Growth'],children:'vald'},
  {id:'magic',name:'MagicSchool AI',emoji:'✨',color:'#ec9bda',summary:'The MagicSchool AI platform in classrooms.',features:['Subject Integration','Platform Data Analysis'],children:'magic'},
  {id:'vr',name:'VR Learning',emoji:'🥽',color:'#b98aff',summary:'Placeholder: from the earlier brief; not in the latest list. Keep or remove?',features:TBC}
 ]},
 vald:{parent:'emerging',h1:'VALD ATHLETIC SYSTEMS & AI',title:'Data for student athletes',core:'VALD',lead:'Jose Dominguez',emoji:'🏃',planet:'#27b58f',theme:['#0c4a3e','#07201b','#020b09','#7dffd6'],intro:'Athletic performance systems and the people and training around them.',nodes:planets('VALD Athletic Systems & AI','🏃',[
  {name:'SpeedGate and ForceDeck Systems',emoji:'⏱️'},{id:'tracking',name:'Student Athlete Data Tracking',emoji:'📊'},{name:'Student Athlete Injury Prevention',emoji:'🩹'},
  {name:'Student Athlete Sport-Specific Training Resources',emoji:'🏋️'},{name:'PE Teacher, HoD, Athletic Leadership Training',emoji:'🧑‍🏫'},{name:'Student Athlete Education and Sports Growth',emoji:'📈'}])},
 magic:{parent:'emerging',h1:'MAGICSCHOOL AI',title:'AI in the classroom',core:'MagicSchool AI',lead:'Jose Dominguez',emoji:'✨',planet:'#c45bb0',theme:['#4a1b45','#1d0b1c','#09030a','#ffa9ea'],intro:'How MagicSchool AI is used across subjects, and what its data shows.',nodes:planets('MagicSchool AI','✨',['Subject Integration','Platform Data Analysis'])},
 outreach:{parent:'proto',h1:'COMMUNITY OUTREACH & EDUCATION',title:'Learning beyond the classroom',core:'Community Outreach',lead:'Jose Dominguez',emoji:'🤝',planet:'#d1578f',theme:['#521a3a','#220a18','#0b040a','#ffa8d2'],intro:'Education and support for students, teachers, parents and external partners.',nodes:planets('Community Outreach & Education','🤝',[
  {name:'In-School Collaboration',emoji:'🏫'},{name:'Student Education & Wellbeing',emoji:'🧒'},{id:'teacheredu',name:'Teacher Education',emoji:'🧑‍🏫'},{name:'Parent Education & Parenting Support',emoji:'👪'},
  {name:'School Incentive Schemes for Self-Paced PD',emoji:'🎯'},{name:'Masterclass Style In-House PD',emoji:'🎓'},{name:'External Partnerships',emoji:'🌍'}])},

 // ---------- Pedagogical & Internship Programs (Jing Wu) ----------
 pedag:{parent:'innovation',h1:'PEDAGOGICAL & INTERNSHIP PROGRAMS',title:'Programmes for learning and experience',core:'Pedagogical & Internships',lead:'Jing Wu',emoji:'🎓',planet:'#d1476f',theme:['#521735','#220a17','#0b040a','#ff9fc0'],intro:'Programmes that develop teaching practice and give students real project experience.',nodes:[
  {id:'teacherpd',name:'Teacher Professional Support',emoji:'🧑‍🏫',color:'#4bc7ff',summary:'Support teachers with educational technology integration and innovative pedagogy coaching, including PBL, differentiation, and educational tools.',features:['Educational technology integration','Innovative pedagogy coaching','PBL, differentiation and educational tools']},
  {id:'pbl',name:'PBL Projects & Innovation Fair',emoji:'🧩',color:'#ffbd73',summary:'Support project-based learning and lead events that showcase student learning and teacher innovation.',features:['Project-based learning support','Events that showcase student learning','Events that showcase teacher innovation']},
  {id:'fellowship',name:'Innovation Fellowship',emoji:'🏅',color:'#9b88ff',summary:'Develop and manage the Fellowship structure, mentor teachers passionate about educational innovation, and empower them to experiment, collaborate, and share effective teaching practices.',features:['Fellowship structure','Mentoring teachers','Experiment, collaborate and share practice'],children:'fellows'},
  {id:'internship',name:'Innovation Center Student Internship',emoji:'🌟',color:'#ffbe6c',summary:'Lead internship projects, coordinate student internship programs, and mentor students in developing technical skills, leadership, and real-world experience while supporting school projects.',features:['Internship projects','Coordinating the internship programs','Mentoring technical skills, leadership and real-world experience'],children:'intern'}
 ]},
 fellows:{parent:'pedag',h1:'INNOVATION FELLOWSHIP',title:'Teachers who experiment',core:'Innovation Fellowship',lead:'Jing Wu',emoji:'🏅',planet:'#7d6be0',theme:['#2b2368','#100d33','#04030f','#c4baff'],intro:'Teacher fellows exploring educational innovation in three areas.',nodes:[
  {id:'humanities',name:'Humanities',emoji:'📜',color:'#ffbd73',summary:'Humanities fellows.',features:['MagicSchool']},
  {id:'protoet',name:'Prototyping & Emerging Tech',emoji:'🧪',color:'#4ee0be',summary:'Fellows working in prototyping and emerging technology.',features:TBC},
  {id:'humlab',name:'Humanities Lab',emoji:'🔬',color:'#ec9bda',summary:'A humanities lab for fellows.',features:['Community focused Impact Project across all of G12','Curriculum Design','Teaching']}
 ]},
 intern:{parent:'pedag',h1:'INNOVATION CENTER STUDENT INTERNSHIP',title:'Six tracks, one programme',core:'Student Internship',lead:'Jing Wu',emoji:'🌟',planet:'#e08a2c',theme:['#512a0e','#211007','#0b0503','#ffb066'],intro:'Students join a project track and work on real school projects. Three tracks come from Jose Dominguez’s list; the AI, Robotics and Events teams from the earlier brief.',nodes:[
  {id:'int-ai',name:'AI',lead:'Taylor',emoji:AI_ICON,iconSmall:AI_ICON_SMALL,color:'#45bbff',summary:'The AI internship team. Connected to AI Interns and AI Education in the AI universe.',features:TBC},
  {id:'int-robotics',name:'Robotics',lead:'Sofian',emoji:'🦾',color:'#4ee0be',summary:'The robotics internship team.',features:TBC},
  {id:'int-media',name:'Digital Media Track',lead:'Jose Dominguez',emoji:'🎬',color:'#ec9bda',summary:'The digital media internship track.',features:TBC},
  {id:'int-proto',name:'3D Printing & Prototyping Track',lead:'Jose Dominguez',emoji:'🖨️',color:'#f5b95d',summary:'The 3D printing and prototyping internship track.',features:TBC},
  {id:'int-emerging',name:'Emerging Tech & Research Track',lead:'Jose Dominguez',emoji:'🛰️',color:'#b98aff',summary:'The emerging technology and research internship track.',features:TBC},
  {id:'int-events',name:'Events',emoji:'🎪',color:'#ffbd73',summary:'The events internship team.',features:TBC}
 ]},

 // ---------- Network & System Architecture (Jackey & Jimmy): two linked systems ----------
 network:{parent:'innovation',h1:'NETWORK & SYSTEM ARCHITECTURE',title:'One shared ecosystem, two systems',core:'Network & Systems',lead:'Jackey & Jimmy',emoji:'🌐',planet:'#1fb5d1',theme:['#0b4150','#061b21','#020b0e','#6ee7ff'],intro:'Jackey and Jimmy share one ecosystem. Jackey looks after infrastructure, networks and security; Jimmy looks after the helpdesk, on-site support and the school’s support systems.',nodes:[
  {id:'jacky',name:'Infrastructure, Network & Security',lead:'Jackey',emoji:'🏗️',color:'#4bc7ff',summary:'The servers, networks and security the school runs on.',features:['Infrastructure & Systems','Network & Connectivity','Security & Identity'],children:'jacky'},
  {id:'jimmy',name:'Helpdesk, Support & Systems',lead:'Jimmy',emoji:'🎧',color:'#ffbd73',summary:'Day-to-day support for staff and events, and the school’s support systems.',features:['Helpdesk service','On-site Support','System Support'],children:'jimmy'}
 ]},

 // Jackey
 jacky:{parent:'network',h1:'INFRASTRUCTURE, NETWORK & SECURITY',title:'The foundations underneath',core:'Jackey’s Systems',lead:'Jackey',emoji:'🏗️',planet:'#2f9fe0',theme:['#0c3a5c','#07182b','#020910','#8fd8ff'],intro:'Infrastructure, connectivity and security. Shares an ecosystem with Jimmy’s helpdesk and support systems.',nodes:[
  {id:'infra',name:'Infrastructure & Systems',emoji:'🖥️',color:'#4bc7ff',summary:'The servers, cloud and storage the school runs on.',features:['IT Infrastructure','Cloud & Hybrid Systems','Server & Virtualization','Enterprise Storage & Backup','High Availability & Disaster Recovery'],children:'netinfra'},
  {id:'conn',name:'Network & Connectivity',emoji:'📡',color:'#4ee0be',summary:'Campus and wide-area networking.',features:['Campus Network','Wireless Infrastructure','SD-WAN & WAN','Network Engineering','Network Performance'],children:'netconn'},
  {id:'sec',name:'Security & Identity',emoji:'🔐',color:'#ec9bda',summary:'Keeping systems, accounts and data safe.',features:['Cybersecurity','Identity & Access Management','Endpoint Security','Network Security','Security Monitoring & Compliance'],children:'netsec'}
 ]},
 netinfra:{parent:'jacky',h1:'INFRASTRUCTURE & SYSTEMS',title:'Where everything runs',core:'Infrastructure',lead:'Jackey',emoji:'🖥️',planet:'#2f9fe0',theme:['#0c3a5c','#07182b','#020910','#8fd8ff'],intro:'IT infrastructure from cloud to disaster recovery.',nodes:planets('Infrastructure & Systems','🖥️',['IT Infrastructure','Cloud & Hybrid Systems','Server & Virtualization','Enterprise Storage & Backup','High Availability & Disaster Recovery'])},
 netconn:{parent:'jacky',h1:'NETWORK & CONNECTIVITY',title:'How the campus connects',core:'Connectivity',lead:'Jackey',emoji:'📡',planet:'#1fb59a',theme:['#0b4a42','#061f1c','#020b0a','#7dffe6'],intro:'Campus, wireless and wide-area networks.',nodes:planets('Network & Connectivity','📡',['Campus Network','Wireless Infrastructure','SD-WAN & WAN','Network Engineering','Network Performance'])},
 netsec:{parent:'jacky',h1:'SECURITY & IDENTITY',title:'Safe by design',core:'Security & Identity',lead:'Jackey',emoji:'🔐',planet:'#c4508f',theme:['#4a1b3e','#1d0b19','#09030a','#ffa9dc'],intro:'Cybersecurity, identity and compliance.',nodes:planets('Security & Identity','🔐',['Cybersecurity','Identity & Access Management','Endpoint Security','Network Security','Security Monitoring & Compliance'])},

 // Jimmy
 jimmy:{parent:'network',h1:'HELPDESK, SUPPORT & SYSTEMS',title:'Keeping the school running',core:'Jimmy’s Systems',lead:'Jimmy',emoji:'🎧',planet:'#d9942c',theme:['#4d300b','#211306','#0b0603','#ffcb6e'],intro:'The helpdesk, on-site support and the school’s support systems. Shares an ecosystem with Jackey’s infrastructure, network and security.',nodes:[
  {id:'helpdesk',name:'Helpdesk service',emoji:'🎧',color:'#ffbd73',summary:'First-line help for staff.',features:['Computer','Wifi account','Printing service','Door access control permissions','E-mail','Monitoring Query'],children:'jhelp'},
  {id:'onsite',name:'On-site Support',emoji:'🧑‍🔧',color:'#4ee0be',summary:'Support in person at school events and important meetings.',features:['School events','Important meetings'],children:'jonsite'},
  {id:'syssupport',name:'System Support',emoji:'📺',color:'#b98aff',summary:'The school’s support systems.',features:['Dingding System','Broadcast Ringtone System','Electronic Screen Information Release System'],children:'jsys'}
 ]},
 jhelp:{parent:'jimmy',h1:'HELPDESK SERVICE',title:'Help when you need it',core:'Helpdesk',lead:'Jimmy',emoji:'🎧',planet:'#d9942c',theme:['#573709','#241506','#0c0702','#ffd27d'],intro:'The services staff ask the helpdesk for.',nodes:planets('Helpdesk service','🎧',[
  {id:'computer',name:'Computer',emoji:'💻'},{id:'wifi',name:'Wifi account',emoji:'📶'},{id:'printing',name:'Printing service',emoji:'🖨️'},
  {id:'door',name:'Door access control permissions',emoji:'🚪'},{id:'email',name:'E-mail',emoji:'✉️'},{id:'monitoring',name:'Monitoring Query',emoji:'📹'}])},
 jonsite:{parent:'jimmy',h1:'ON-SITE SUPPORT',title:'Support in the room',core:'On-site Support',lead:'Jimmy',emoji:'🧑‍🔧',planet:'#27b58f',theme:['#0c4a3e','#07201b','#020b09','#7dffd6'],intro:'Hands-on support at school events and important meetings.',nodes:planets('On-site Support','🧑‍🔧',[{name:'School events',emoji:'🎪'},{name:'Important meetings',emoji:'🗓️'}])},
 jsys:{parent:'jimmy',h1:'SYSTEM SUPPORT',title:'The systems behind the school day',core:'System Support',lead:'Jimmy',emoji:'📺',planet:'#8f5fe0',theme:['#33206b','#120c31','#05030f','#c9b0ff'],intro:'Messaging, bells and information screens.',nodes:planets('System Support','📺',[
  {name:'Dingding System',emoji:'💬'},{name:'Broadcast Ringtone System',emoji:'🔔'},{id:'screens',name:'Electronic Screen Information Release System',emoji:'📺'}])},

 // ---------- School Systems (Johnson) ----------
 schoolsys:{parent:'innovation',h1:'SCHOOL SYSTEMS',title:'The systems the school runs on',core:'School Systems',lead:'Johnson',emoji:'🏫',planet:'#3bc77c',theme:['#10432a','#07190f','#020b05','#7dffb0'],intro:'PowerSchool SIS configuration and management, academic workflow support, and collaboration across departments.',nodes:[
  {id:'sis',name:'PowerSchool SIS Configuration & Management',emoji:'🗄️',color:'#4bc7ff',summary:'Configuring and maintaining the PowerSchool student information system.',features:['Configure Different Modules','Maintain System Stability','Oversee Data Imports & Exports','Conduct Routine Data Audits'],children:'sissys'},
  {id:'workflow',name:'Academic Workflow and Stakeholder Support',emoji:'🔄',color:'#ffbd73',summary:'Keeping academic workflows running and supporting the people who rely on the SIS.',features:['Coordinate Multiple Productions','Ensure Workflows','Support for SIS Inquiries and Troubleshooting'],children:'siswork'},
  {id:'collab',name:'Cross Department Collaboration',emoji:'🤝',color:'#ec9bda',summary:'Aligning the SIS with curriculum leaders and working with IT infrastructure.',features:['Align SIS with Curriculum Leaders','Liaise with IT Infra'],children:'siscollab'}
 ]},
 sissys:{parent:'schoolsys',h1:'POWERSCHOOL SIS CONFIGURATION & MANAGEMENT',title:'Configure, maintain, audit',core:'PowerSchool SIS',lead:'Johnson',emoji:'🗄️',planet:'#2f9fe0',theme:['#0c3a5c','#07182b','#020910','#8fd8ff'],intro:'Configuring modules, keeping the system stable, and overseeing data flowing in and out.',nodes:planets('PowerSchool SIS Configuration & Management','🗄️',['Configure Different Modules','Maintain System Stability','Oversee Data Imports & Exports','Conduct Routine Data Audits'])},
 siswork:{parent:'schoolsys',h1:'ACADEMIC WORKFLOW AND STAKEHOLDER SUPPORT',title:'Keeping work flowing',core:'Academic Workflow',lead:'Johnson',emoji:'🔄',planet:'#d9942c',theme:['#4d300b','#211306','#0b0603','#ffcb6e'],intro:'Workflows, coordination and support for SIS users.',nodes:planets('Academic Workflow and Stakeholder Support','🔄',['Coordinate Multiple Productions','Ensure Workflows','Support for SIS Inquiries and Troubleshooting'])},
 siscollab:{parent:'schoolsys',h1:'CROSS DEPARTMENT COLLABORATION',title:'Working across the school',core:'Collaboration',lead:'Johnson',emoji:'🤝',planet:'#c4508f',theme:['#4a1b3e','#1d0b19','#09030a','#ffa9dc'],intro:'Aligning the SIS with curriculum leaders and liaising with IT infrastructure.',nodes:planets('Cross Department Collaboration','🤝',['Align SIS with Curriculum Leaders',{id:'itinfra',name:'Liaise with IT Infra',emoji:'🖥️'}])}
};

// Strings between universes. S = confirmed. P = proposed (shown dotted, with a PROPOSED tag) until you approve it.
// To add one, add a row: [planetA, planetB, S].
const S='stated',P='proposed';
const links=[
 ['innovation:ai','main:interns',S],['innovation:ai','main:training',S],
 ['intern:int-ai','main:interns',S],['intern:int-ai','main:training',S],['innovation:ai','intern:int-ai',S],
 // the same programmes appear in two people's lists
 ['proto:interns','pedag:internship',S],['proto:fellows','pedag:fellowship',S],['protolab:events','pedag:pbl',S],
 ['protolab:teachertrain','pedag:teacherpd',S],['outreach:teacheredu','pedag:teacherpd',S],
 ['emerging:magic','innovation:ai',S],['fellows:humanities','emerging:magic',S],
 ['vald:tracking','main:athletics',S],
 ['jacky:sec','main:data',S],['innovation:network','innovation:schoolsys',S],
 // Jackey and Jimmy share one ecosystem
 ['network:jacky','network:jimmy',S],
 ['jhelp:wifi','netconn:wireless-infrastructure',P],['jhelp:door','netsec:identity-access-management',P],
 ['jhelp:monitoring','netsec:security-monitoring-compliance',P],['jhelp:computer','netsec:endpoint-security',P],
 // School Systems
 ['siscollab:itinfra','innovation:network',S],['schoolsys:sis','main:wechat',S],['schoolsys:sis','main:data',S]
];
return {NET,cosmos,systems,links,TBC};
})();
