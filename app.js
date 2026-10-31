// Rig Runner Tracker - dashboard mockup. ALL DATA IS FAKE.
const URLS={jobs:'https://mojopin23-sudo.github.io/rig-runner-job-mockup/index.html',bids:'https://mojopin23-sudo.github.io/rig-runner-bid-mockup/',res:'https://mojopin23-sudo.github.io/rig-runner-resources-mockup/'};
const TERMS={'308':'308 Alice','331':'331 Jourdanton','335':'335 Odessa','346':'346 Kilgore'};
const TODAY='2026-11-02';
const S={get t(){return localStorage.rrT||'all'},set t(v){localStorage.rrT=v},get role(){return localStorage.rrRole||'Admin'},set role(v){localStorage.rrRole=v}};
const canMoney=()=>S.role!=='Dispatch';const readOnly=()=>S.role==='Management';
const inT=r=>S.t==='all'||r.term===S.t;
const $=s=>document.querySelector(s);const money=n=>'$'+Math.round(n).toLocaleString();
const fd=d=>{const x=new Date(d+'T12:00');return (x.getMonth()+1)+'/'+x.getDate()+'/'+x.getFullYear()};
const addD=(d,n)=>{const x=new Date(d+'T12:00');x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const tag=(s)=>{const c={Won:'green',Completed:'green',Closed:'green',Valid:'green','In Progress':'blue',Moving:'blue',Sent:'amber',Open:'red',Pending:'amber',Draft:'',Lost:'red',Scheduled:'amber',Expired:'red','Expiring':'amber',High:'red',Medium:'amber',Low:'green'}[s];return `<span class="tag ${c?'t-'+c:''}">${s}</span>`};
// ---------- fake master data ----------
const EMP=[['Wade Callister','308','Driver'],['Luis Barrientos','308','Swamper'],['Corey Nash','308','Crane Operator'],['Hector Villareal','308','Pusher'],
['Dale Pruitt','331','Driver'],['Jesse Okafor','331','Swamper'],['Rudy Saenz','331','Driver'],['Tom Kessler','331','Truck Pusher'],
['Mario Gallegos','335','Driver'],['Kyle Brandt','335','Swamper'],['Andre Pham','335','Crane Operator'],['Shane Whitlow','335','Driver'],
['Travis Ellery','346','Driver'],['Marcus Hollins','346','Swamper'],['Grant Tolliver','346','Pusher'],['Owen Riggs','346','Owner Operator']].map(([name,term,occ],i)=>({name,term,occ,acct:'EMP-'+(1040+i)}));
const DISPATCH={'308':'Kara Delgado','331':'Brett Mahaffey','335':'Lena Ortiz','346':'Cody Faulk'};
const CUST=['Lone Mesa Energy','Red Caliche Operating','Pecos Flats Petroleum','Sabine Ridge Oil'];
const OPER=['Hartline Drilling','Cobalt Basin Drilling'];
const JOBS=[
['J-26-1182','308','Hartline 12','In Progress','2026-11-02','B-4410',0,'Full Rig Move',38,182000,141500],
['J-26-1185','308','Cobalt 7','Scheduled','2026-11-05','B-4418',1,'Full Rig Move',22,156000,118400],
['J-26-1179','308','Hartline 21','Completed','2026-10-21','B-4397',2,'Partial Move',14,64000,47900],
['J-26-1183','331','Cobalt 3','Moving','2026-11-02','B-4412',3,'Full Rig Move',51,201500,163200],
['J-26-1188','331','Hartline 30','Scheduled','2026-11-06','B-4421',0,'Skid / Walk',4,38500,27100],
['J-26-1176','331','Cobalt 15','Completed','2026-10-14','B-4390',1,'Full Rig Move',33,174000,149800],
['J-26-1184','335','Hartline 44','In Progress','2026-11-03','B-4414',2,'Full Rig Move',67,238000,181300],
['J-26-1187','335','Cobalt 22','Scheduled','2026-11-04','B-4419',2,'Rig Down Only',0,72000,51600],
['J-26-1180','335','Hartline 9','Completed','2026-10-26','B-4401',3,'Full Rig Move',45,192500,158900],
['J-26-1186','346','Cobalt 18','Scheduled','2026-11-03','B-4417',3,'Full Rig Move',29,149000,112200],
['J-26-1189','346','Hartline 5','Scheduled','2026-11-07','B-4423',1,'Partial Move',11,58000,43800],
['J-26-1177','346','Cobalt 11','Completed','2026-10-19','B-4393',0,'Full Rig Move',36,168500,140100]
].map(([job,term,rig,status,date,bid,c,type,miles,rev,cost],i)=>({job,term,rig,status,date,bid,cust:CUST[c],oper:OPER[i%2],type,miles,rev,cost}));
const BIDS=JOBS.map(j=>({bid:j.bid,status:'Won',date:addD(j.date,-12),cust:j.cust,oper:j.oper,term:j.term,rig:j.rig,type:j.type,job:j.job,miles:j.miles,price:Math.round(j.rev*0.97/100)*100,final:j.rev})).concat([
['B-4425','308','Sent','2026-10-29',1,'Cobalt 25','Full Rig Move',41,171000],['B-4426','308','Draft','2026-10-31',3,'Hartline 17','Skid / Walk',3,29500],
['B-4424','331','Sent','2026-10-28',0,'Hartline 38','Full Rig Move',27,148000],['B-4416','331','Lost','2026-10-20',2,'Cobalt 29','Full Rig Move',58,214000],
['B-4427','335','Draft','2026-10-30',2,'Cobalt 31','Full Rig Move',72,246000],['B-4428','335','Sent','2026-10-30',3,'Hartline 50','Partial Move',18,69000],['B-4429','335','Pending','2026-10-31',0,'Hartline 52','Rig Down Only',0,66000],
['B-4422','346','Sent','2026-10-27',1,'Cobalt 33','Full Rig Move',31,152000],['B-4415','346','Lost','2026-10-18',0,'Hartline 41','Partial Move',9,51000]
].map(([bid,term,status,date,c,rig,type,miles,price],i)=>({bid,status,date,cust:CUST[c],oper:OPER[i%2],term,rig,type,job:'',miles,price,final:''})));
const jobOf=id=>JOBS.find(j=>j.job===id);
const EXC=[['J-26-1182','Luis Barrientos','11/01 05:12 AM','—','Missing clock out'],['J-26-1182','Corey Nash','11/01 04:48 AM','11/01 09:55 PM','Shift over 16 hrs'],
['J-26-1183','Rudy Saenz','11/01 06:02 AM','11/01 06:40 PM','Clock in outside geofence'],['J-26-1183','Jesse Okafor','—','11/01 07:15 PM','Missing clock in'],
['J-26-1184','Kyle Brandt','11/01 05:30 AM','11/01 11:58 PM','Overlapping punch'],['J-26-1184','Andre Pham','11/01 06:15 AM','—','Missing clock out'],['J-26-1184','Shane Whitlow','10/31 07:00 PM','11/01 08:05 AM','Night shift not approved'],
['J-26-1186','Marcus Hollins','11/01 05:55 AM','11/01 05:58 AM','Punch under 5 min']].map(([job,res,ci,co,reason])=>({job,res,ci,co,reason,term:jobOf(job).term}));
const MAINT=[['MR-0931','2026-10-27','Wade Callister','Brakes','T-308-14','Open'],['MR-0934','2026-10-29','Hector Villareal','Hydraulic leak','C-308-02','In Progress'],
['MR-0928','2026-10-22','Dale Pruitt','Tires','T-331-07','Completed'],['MR-0935','2026-10-30','Rudy Saenz','Lights / electrical','T-331-11','Open'],
['MR-0936','2026-10-30','Mario Gallegos','Engine warning','T-335-03','Open'],['MR-0937','2026-10-31','Andre Pham','Winch line','C-335-01','In Progress'],['MR-0925','2026-10-18','Kyle Brandt','A/C','T-335-09','Completed'],
['MR-0938','2026-11-01','Travis Ellery','Fifth wheel','T-346-05','Open']].map(([id,date,by,type,unit,status])=>({id,date,by,type,unit,status,term:unit.split('-')[1],done:status==='Completed'?addD(date,3):'',notes:status==='Completed'?'Repaired at shop':'Awaiting parts'}));
const EQ=[['T-308-14','308',2019,'Kenworth','1XKAD49X0KJ2271','RR-4471','OS-77812','2026-11-18','2027-03-02','2026-12-01'],['C-308-02','308',2016,'Grove','1G9CR4511G4410','RR-3310','OS-77801','2027-05-10','2026-11-09','2027-01-20'],
['T-331-07','331',2021,'Peterbilt','1XPBD49X1MD5531','RR-5120','OS-77840','2026-11-25','2027-04-14','2027-02-01'],['T-331-11','331',2018,'Mack','1M2GR4GC5JM0071','RR-4022','OS-77851','2027-02-11','2027-06-30','2026-11-14'],
['T-335-03','335',2020,'Kenworth','1XKAD49X2LJ3392','RR-4901','OS-77866','2026-10-29','2027-01-05','2027-03-15'],['C-335-01','335',2017,'Link-Belt','LB9213330088','RR-3555','OS-77870','2027-07-01','2026-11-21','2027-02-11'],
['T-346-05','346',2022,'Peterbilt','1XPBD49X4ND7718','RR-5333','OS-77890','2027-04-20','2027-05-01','2026-11-28'],['T-346-09','346',2015,'Freightliner','1FUJGLDR5FL0912','RR-2988','OS-77895','2027-08-08','2026-12-30','2027-04-04']]
.map(([unit,term,year,make,vin,plate,permit,reg,dot,insp],i)=>({unit,term,year,make,vin,plate,permit,reg,dot,insp,own:i%4===3?'Owner Operator':'Company'}));
const INV=[['SN-77120','308','H2S Monitor','Personal gas monitor','Luis Barrientos','2025-11-10','2026-11-10'],['SN-77131','308','Fall Harness','Full body harness','Corey Nash','2024-11-20','2026-11-20'],
['SN-77144','331','H2S Monitor','Personal gas monitor','Jesse Okafor','2025-11-06','2026-11-06'],['SN-77152','331','Fire Extinguisher','10 lb ABC, truck T-331-11','Rudy Saenz','2025-10-30','2026-10-30'],
['SN-77163','335','Fall Harness','Full body harness','Kyle Brandt','2024-12-01','2026-12-01'],['SN-77170','335','First Aid Kit','Class B kit, C-335-01','Andre Pham','2025-11-15','2026-11-15'],
['SN-77188','346','H2S Monitor','Personal gas monitor','Marcus Hollins','2025-11-25','2026-11-25']].map(([serial,term,item,desc,to,issued,exp])=>({serial,term,item,desc,to,issued,exp}));
const COURSES=['H2S','First Aid/CPR','PEC SafeLand','Rigging','Forklift'];
const TRAIN=EMP.map((e,i)=>({name:e.name,term:e.term,prim:e.occ,sec:i%3===0?'Swamper':'—',c:COURSES.map((c,k)=>addD(TODAY,((i*37+k*53)%400)-20))}));
const GC=[['2026-11-01','Luis Barrientos','J-26-1182','Near Miss','High','Serious','Load shifted on lowboy during turn'],['2026-10-30','Hector Villareal','J-26-1182','Good Catch','Medium','Moderate','Spotted frayed sling before lift'],
['2026-10-31','Jesse Okafor','J-26-1183','Good Catch','Low','Minor','Missing wheel chock on parked trailer'],['2026-11-01','Andre Pham','J-26-1184','Near Miss','High','Serious','Crane swing near energized line'],
['2026-10-28','Kyle Brandt','J-26-1184','Good Catch','Medium','Moderate','Pinch point on mast pin flagged'],['2026-10-29','Marcus Hollins','J-26-1177','Near Miss','Medium','Moderate','Pickup backed toward walkway']]
.map(([date,by,job,type,pot,sev,desc])=>({date,by,job,type,pot,sev,desc,term:jobOf(job).term}));
const NOTIF=[['2026-11-02','J-26-1182','Kara Delgado','Rig down starts 6:00 AM','All Hartline 12 crew'],['2026-11-01','J-26-1183','Brett Mahaffey','Road closure on FM 140, use alternate','Drivers 331'],
['2026-11-02','J-26-1184','Lena Ortiz','Safety meeting at yard 5:30 AM','Hartline 44 crew'],['2026-11-01','J-26-1187','Lena Ortiz','Cobalt 22 rig down moved to Wed','Crew + customer'],
['2026-11-02','J-26-1186','Cody Faulk','Permits approved for Cobalt 18','Drivers 346'],['2026-10-31','J-26-1185','Kara Delgado','Crane needed Thu, confirm by noon','Crane operators']]
.map(([date,job,sender,title,rcp])=>({date,job,sender,title,rcp,term:jobOf(job).term}));
// payroll period: 10/25-11/07; hours generated deterministically
const PERIOD=[...Array(14)].map((_,i)=>addD('2026-10-25',i));
const hrs=(e,i)=>{const n=EMP.indexOf(e);if(PERIOD[i]>TODAY)return 0;const v=((n*7+i*5)%6);return v===0?0:9+v};
EMP.forEach(e=>{e.h=PERIOD.map((_,i)=>hrs(e,i));e.tot=e.h.reduce((a,b)=>a+b,0);e.reg=Math.min(80,e.tot);e.ot=e.tot-e.reg;e.rate=e.occ.includes('Crane')?31:e.occ.includes('Pusher')?33:e.occ==='Owner Operator'?0:25;e.wage=e.reg*e.rate+e.ot*e.rate*1.5;e.job=JOBS.filter(j=>j.term===e.term&&j.status!=='Completed')[0].job});
// ---------- chrome ----------
function chrome(active){
 const nav=[['Dashboard','index.html'],['Calendar','calendar.html'],['Jobs',URLS.jobs],['Bids',URLS.bids],['Resources',URLS.res],['Reports','reports.html'],['Forms','forms.html'],['Admin','admin.html']];
 document.body.insertAdjacentHTML('afterbegin',`<header class="topbar"><a class="brand" href="index.html"><img src="logo.png" alt="Rig Runner"><span class="divider"></span><span class="appname">Tracker</span></a>
 <nav class="nav">${nav.map(([n,h])=>`<a href="${h}" class="${n===active?'active':''}">${n}</a>`).join('')}</nav><span class="spacer"></span>
 <span class="user"><span class="avatar">RT</span><span>Ray Tolbert</span></span></header>
 <div class="ctl"><label>Terminal</label><select id="tsel"><option value="all">All terminals</option>${Object.entries(TERMS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
 <label style="margin-left:8px">Role</label><span class="seg" id="rsel">${['Admin','Dispatch','Management'].map(r=>`<button data-r="${r}">${r==='Management'?'Management (read-only)':r}</button>`).join('')}</span>
 <span class="spacer"></span>${active!=='Dashboard'?'<a href="index.html">&larr; Back to Dashboard</a>':'<span class="muted">Mockup, all data is fake. Browser Back works from Jobs/Bids/Resources.</span>'}</div>`);
 document.body.insertAdjacentHTML('beforeend','<footer>Rig Runner Tracker V1, clickable mockup. All names and figures are fictional.</footer><div class="toast" id="toast"></div>');
 $('#tsel').value=S.t;$('#tsel').onchange=e=>{S.t=e.target.value;render()};
 document.querySelectorAll('#rsel button').forEach(b=>{b.classList.toggle('on',b.dataset.r===S.role);b.onclick=()=>{S.role=b.dataset.r;document.querySelectorAll('#rsel button').forEach(x=>x.classList.toggle('on',x===b));render()}});
}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2200)}
const go=u=>location.href=u;
const R=k=>'reports.html?r='+k;
function table(cols,rows,link){return `<div class="tw"><table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map((r,i)=>`<tr class="${link?'click':''}" ${link?`onclick="go('${link(i)}')"`:''}>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="muted">No rows for this terminal.</td></tr>`}</tbody></table></div>`}
// ---------- forms ----------
const F_TERM=['Terminal','sel',Object.values(TERMS)];
const FORMS=[
['Safety','jsa','Load / Unload JSA',[['Job #','sel',JOBS.map(j=>j.job)],['Load type','sel',['Standard','OS (Oversize)','OW (Overweight)','OS/OW']],['Hazards identified','text'],['Escort required','sel',['No','Yes']]]],
['Safety','bbs','HSE Behavior Based Safety Intervention',[['Job #','sel',JOBS.map(j=>j.job)],['Behavior observed','sel',['Safe','At-risk']],['Intervention notes','text']]],
['Safety','cjsa','Customer JSA',[['Customer','sel',CUST],['Job #','sel',JOBS.map(j=>j.job)],['Customer rep','text']]],
['Employee','dl','Driver License Renewal',[['License class','sel',['CDL A','CDL B']],['New expiration','date']]],
['Employee','med','Medical Card Renewal',[['Examiner','text'],['New expiration','date']]],
['Employee','lunch','Lunch Break Deduction Authorization',[['Pay period start','date'],['Authorize deduction','sel',['Yes','No']]]],
['Employee','orient','Orientation Policies Agreement',[['Orientation date','date'],['I agree to the policies','sel',['Yes']]]],
['Employee','vehicle','Vehicle Use Policy',[['Unit #','sel',EQ.map(q=>q.unit)],['Acknowledged','sel',['Yes']]]],
['Employee','elec','Electronic Equipment Policy & Installation Receipt',[['Device','sel',['ELD tablet','Dash camera','Phone']],['Serial','text']]],
['Employee','timesheet',"Driver's Time Sheet",[['Date','date'],['Job #','sel',JOBS.map(j=>j.job)],['Hours','text']]],
['Equipment','loadlist','Load List',[['Job #','sel',JOBS.map(j=>j.job)],['Loads','text'],['Notes','text']]],
['Equipment','stock','Equipment Stock Addition',[['Item','text'],['Quantity','text'],['Unit #','sel',EQ.map(q=>q.unit)]]],
['Equipment','mumm','Multiple Unit Monthly Maintenance Report',[['Month','sel',['October 2026','November 2026']],['Units checked','text'],['Issues found','text']]]
].map(([group,id,name,fields])=>({group,id,name,fields}));
const SEED=[['jsa','2026-11-02','Wade Callister','308','Job #: J-26-1182 · Load type: OS/OW'],['bbs','2026-11-01','Dale Pruitt','331','Behavior observed: Safe'],
['timesheet','2026-11-01','Mario Gallegos','335','Job #: J-26-1184 · Hours: 13'],['med','2026-10-31','Travis Ellery','346','New expiration: 2028-10-31'],
['loadlist','2026-10-31','Corey Nash','308','Loads: 34'],['cjsa','2026-10-30','Grant Tolliver','346','Customer: Sabine Ridge Oil'],
['mumm','2026-10-30','Andre Pham','335','Month: October 2026 · Units checked: 9'],['jsa','2026-10-29','Rudy Saenz','331','Job #: J-26-1183 · Load type: OW (Overweight)']]
.map(([form,date,by,term,summary])=>({form,date,by,term,summary}));
const SUBS=()=>JSON.parse(localStorage.rrSubs||'[]').concat(SEED).sort((a,b)=>a.date<b.date?1:-1);
const formName=id=>FORMS.find(f=>f.id===id).name;
