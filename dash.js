function card(title,more,body,cls=''){return `<section class="card ${cls}"><h2>${title}<a class="more" href="${more}">View all &rarr;</a></h2><div class="body">${body}</div></section>`}
const expStatus=d=>d<TODAY?'Expired':(d<=addD(TODAY,30)?'Expiring':'Valid');
function render(){
 const J=JOBS.filter(inT),B=BIDS.filter(inT),X=EXC.filter(inT),M=MAINT.filter(inT),E=EMP.filter(inT);
 const week=[...Array(7)].map((_,i)=>addD(TODAY,i-1));
 const todays=J.filter(j=>j.date===TODAY);
 const cal=`<div class="muted" style="margin-bottom:6px">Today (${fd(TODAY)}): <b>${todays.length}</b> rig move${todays.length===1?'':'s'}${todays.map(j=>` &middot; <a href="${URLS.jobs}">${j.rig}</a>`).join('')}</div>
 <div class="week">${week.map(d=>`<div class="day ${d===TODAY?'today':''}"><div class="d">${new Date(d+'T12:00').toLocaleDateString('en-US',{weekday:'short'})} ${d.slice(8)}</div>${J.filter(j=>j.date===d).map(j=>`<a class="ev" href="${URLS.jobs}" title="${j.job}">${j.term} ${j.rig}</a>`).join('')}</div>`).join('')}</div>`;
 const st=['Draft','Pending','Sent','Won','Lost'];
 const bids=`<div class="pills">${st.map(s=>`<a class="pill" href="${R('bids')}&status=${s}">${s}<b>${B.filter(b=>b.status===s).length}</b></a>`).join('')}</div>`+
  table(['Bid #','Status','Rig','Price'],B.filter(b=>b.status!=='Won'&&b.status!=='Lost').map(b=>[b.bid,tag(b.status),b.rig,canMoney()?money(b.price):'—']),()=>URLS.bids);
 const act=J.filter(j=>j.status!=='Completed');
 const jobs=table(['Job','Rig','Term','Status','Move'],act.map(j=>[j.job,j.rig,j.term,tag(j.status),fd(j.date)]),()=>URLS.jobs);
 const exc=`<div><span class="big">${X.length}</span> <span class="muted">time-clock exceptions awaiting review</span></div>`+table(['Resource','Job','Reason'],X.slice(0,4).map(x=>[x.res,x.job,x.reason]),()=>R('exception'));
 const mo=M.filter(m=>m.status!=='Completed');
 const mnt=`<div><span class="big">${mo.length}</span> <span class="muted">open (${mo.filter(m=>m.status==='Open').length} new, ${mo.filter(m=>m.status==='In Progress').length} in progress)</span></div>`+table(['ID','Unit','Type','Status'],mo.map(m=>[m.id,m.unit,m.type,tag(m.status)]),()=>R('maint'));
 const ex=[];EQ.filter(inT).forEach(q=>[['Registration',q.reg],['DOT Insp',q.dot],['Equipment Insp',q.insp]].forEach(([k,d])=>{if(expStatus(d)!=='Valid')ex.push([d,'Equipment Dates',q.unit+' '+k,'eqdates'])}));
 TRAIN.filter(inT).forEach(t=>t.c.forEach((d,k)=>{if(expStatus(d)!=='Valid')ex.push([d,'Training',t.name+' – '+COURSES[k],'training'])}));
 INV.filter(inT).forEach(v=>{if(expStatus(v.exp)!=='Valid')ex.push([v.exp,'Inventory',v.item+' ('+v.to+')','inventory'])});
 ex.sort((a,b)=>a[0]<b[0]?-1:1);
 const exp=`<div class="pills">${['Equipment Dates','Training','Inventory'].map((s,i)=>`<a class="pill" href="${R(['eqdates','training','inventory'][i])}">${s}<b>${ex.filter(e=>e[1]===s).length}</b></a>`).join('')}</div>`+
  table(['Date','Source','Item','Status'],ex.slice(0,7).map(e=>[fd(e[0]),e[1],e[2],tag(expStatus(e[0]))]),i=>R(ex[i][3]));
 const G=GC.filter(inT).sort((a,b)=>a.date<b.date?1:-1);
 const gc=table(['Date','Type','Job','Potential','Description'],G.map(g=>[fd(g.date),g.type,g.job,tag(g.pot),g.desc]),()=>R('gcnm'));
 const N=NOTIF.filter(inT).sort((a,b)=>a.date<b.date?1:-1);
 const nt=table(['Date','Job','From','Title'],N.map(n=>[fd(n.date),n.job,n.sender,n.title]),()=>R('notif'));
 const tot=E.reduce((a,e)=>a+e.tot,0),ot=E.reduce((a,e)=>a+e.ot,0);
 const pay=`<div class="pills"><a class="pill" href="${R('payroll')}">Total hrs<b>${tot}</b></a><a class="pill" href="${R('payroll')}">Regular<b>${tot-ot}</b></a><a class="pill" href="${R('payroll')}">Overtime<b>${ot}</b></a>${canMoney()?`<a class="pill" href="${R('gross')}">Gross wages<b>${money(E.reduce((a,e)=>a+e.wage,0))}</b></a>`:''}</div><div class="muted">Period ${fd(PERIOD[0])} – ${fd(PERIOD[13])}, ${E.length} employees, through ${fd(TODAY)}</div>`+
  table(['Employee','Term','Total','OT'],E.slice().sort((a,b)=>b.tot-a.tot).slice(0,5).map(e=>[e.name,e.term,e.tot,e.ot]),()=>R('payroll'));
 const PJ=J.filter(j=>j.date>='2026-10-01');const rv=PJ.reduce((a,j)=>a+j.rev,0),cs=PJ.reduce((a,j)=>a+j.cost,0);
 const pl=canMoney()?`<div class="pills"><span class="pill">Revenue<b>${money(rv)}</b></span><span class="pill">Cost<b>${money(cs)}</b></span><span class="pill">Profit<b>${money(rv-cs)}</b></span><span class="pill">Margin<b>${rv?Math.round((rv-cs)/rv*100):0}%</b></span></div>`+
  table(['Job','Rig','Status','Revenue','Cost','Profit','Margin'],PJ.map(j=>[j.job,j.rig,tag(j.status),money(j.rev),money(j.cost),money(j.rev-j.cost),Math.round((j.rev-j.cost)/j.rev*100)+'%']),()=>URLS.jobs):'';
 const FS=SUBS().filter(inT).slice(0,5);const fsw=table(['Date','Form','By'],FS.map(f=>[fd(f.date),formName(f.form),f.by]),i=>'forms.html?form='+FS[i].form);
 $('#dash').innerHTML=
  card("Today's rig moves &middot; this week",'calendar.html',cal,'wide')+
  card('Open bids by status',R('bids'),bids)+card('Active jobs',R('jobs'),jobs)+
  card('Exception Queue',R('exception'),exc)+card('Maintenance Requests',R('maint'),mnt)+
  card('Expiring items (next 30 days)',R('eqdates'),exp)+card('Good Catch / Near Miss',R('gcnm'),gc)+
  card('Notifications',R('notif'),nt)+card('Payroll period hours',R('payroll'),pay)+card('Recent form submissions','forms.html',fsw)+
  (pl?card('Job P&amp;L &middot; Oct–Nov 2026 jobs (Admin / Management)',R('jobs'),pl,'wide'):'');
 $('#scope').textContent=(S.t==='all'?'All terminals':TERMS[S.t])+' · viewing as '+S.role+(readOnly()?' (read-only)':'');
}
