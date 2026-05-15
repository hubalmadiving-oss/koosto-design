// =============================================================
// DASHBOARD PAGE
// =============================================================
function DashboardPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Welcome back, Adrien</h1>
          <div className="page-sub">Here's what's happening at AlmaDiving today, Sun May 3</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-secondary"><Icon name="calendar" size={14}/> Calendar</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> New trip</button>
        </div>
      </div>

      {/* Stat row */}
      <div className="stat-grid">
        <StatCard label="Affiliated divers" value="142" trend={{dir:"up",val:"+11"}} foot="vs last month" iconName="users" iconColor="ocean"/>
        <StatCard label="Trips this week" value="18" trend={{dir:"up",val:"+3"}} foot="6 today" iconName="calendar" iconColor="teal"/>
        <StatCard label="Active courses" value="4" trend={{dir:"flat",val:"="}} foot="11 students enrolled" iconName="book" iconColor="amber"/>
        <StatCard label="Revenue (MTD)" value="₱148.2k" trend={{dir:"up",val:"+8.4%"}} foot="vs Apr · target ₱180k" iconName="finance" iconColor="green"/>
      </div>

      {/* Bento row */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
        <TodayPlanCard/>
        <WeatherCard/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <RecentlyAffiliatedCard/>
        <PendingCard/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:12}}>
        <BookingTrendCard/>
        <StaffOnDutyCard/>
      </div>
    </div>
  );
}

function StatCard({label, value, trend, foot, iconName, iconColor}) {
  const colors = {
    ocean: {bg:"var(--ocean-100)", c:"var(--ocean-500)"},
    teal:  {bg:"var(--accent-teal-bg)", c:"var(--accent-teal)"},
    amber: {bg:"var(--amber-alert-bg)", c:"var(--amber-alert)"},
    green: {bg:"var(--safety-green-bg)", c:"var(--safety-green)"},
  }[iconColor];
  return (
    <div className="stat">
      <div className="stat-head">
        <div className="stat-icon" style={{background:colors.bg, color:colors.c}}>
          <Icon name={iconName} size={16}/>
        </div>
        <span className={`stat-trend ${trend.dir}`}>
          {trend.dir==="up" && <Icon name="arrow_up_right" size={11}/>}
          {trend.val}
        </span>
      </div>
      <div>
        <div className="stat-value tabular">{value}</div>
        <div className="stat-label" style={{marginTop:6}}>{label}</div>
      </div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}

function TodayPlanCard() {
  const trips = [
    { time:"07:30", title:"Tubbataha Reef — Drift", site:"North Wall · Site 3", boat:"M/V Discovery", divers:8, cap:12, status:"confirmed", staff:["HL","DB"]},
    { time:"10:00", title:"Apo Reef — Family Trip", site:"Shark Point", boat:"Banca 02", divers:6, cap:8, status:"confirmed", staff:["HL"]},
    { time:"14:00", title:"Discover Scuba", site:"House Reef", boat:"—", divers:3, cap:4, status:"teaching", staff:["DB"]},
    { time:"18:30", title:"Night Dive · 🌙", site:"Mandarin Point", boat:"Banca 01", divers:4, cap:6, status:"pending", staff:["HL"]},
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div className="flex items-center gap-3">
          <span className="card-head-title">Today's plan</span>
          <span className="chip chip-ocean">4 TRIPS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="seg">
            <button className="active">Today</button>
            <button>Tomorrow</button>
            <button>Week</button>
          </div>
        </div>
      </div>
      <div>
        {trips.map((t,i)=> (
          <div key={i} style={{display:"grid",gridTemplateColumns:"68px 1fr auto auto",alignItems:"center",gap:14,padding:"12px 16px",borderBottom: i<trips.length-1 ? "1px solid var(--surface-3)" : "none"}}>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:16,color:"var(--ocean-900)"}} className="tabular">{t.time}</div>
            <div>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{t.title}</div>
              <div className="flex items-center gap-2" style={{marginTop:3,fontSize:11,color:"var(--ocean-700)",opacity:0.75}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:3}}><Icon name="map_pin" size={11}/>{t.site}</span>
                <span style={{opacity:0.4}}>·</span>
                <span style={{display:"inline-flex",alignItems:"center",gap:3}}><Icon name="boat" size={11}/>{t.boat}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {t.staff.map(s=> <div key={s} className={`avatar avatar-sm avatar-c${s==="HL"?0:1}`} style={{width:24,height:24,fontSize:10,borderRadius:6}}>{s}</div>)}
            </div>
            <div className="flex items-center gap-3">
              <div style={{fontFamily:"var(--font-ui)",fontSize:12,fontWeight:700,color:"var(--ocean-900)"}} className="tabular">
                {t.divers}<span style={{opacity:0.4}}>/{t.cap}</span>
              </div>
              {t.status==="confirmed" && <span className="chip chip-green">CONFIRMED</span>}
              {t.status==="teaching" && <span className="chip chip-amber">TEACHING</span>}
              {t.status==="pending" && <span className="chip chip-amber">PENDING</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeatherCard() {
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-head-title">Conditions</span>
        <span className="chip">PUERTO GALERA</span>
      </div>
      <div style={{padding:16}}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:36,color:"var(--ocean-900)",letterSpacing:"-0.02em",lineHeight:1}} className="tabular">28°</div>
            <div style={{fontSize:12,color:"var(--ocean-700)",marginTop:4}}>Mostly sunny · feels 31°</div>
          </div>
          <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg, var(--ocean-100), var(--accent-teal-bg))",display:"grid",placeItems:"center",color:"var(--accent-teal)"}}>
            <Icon name="sun" size={32}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          <Mini label="Wind" value="12kn" sub="ENE"/>
          <Mini label="Visibility" value="20m" sub="excellent"/>
          <Mini label="Current" value="Mild" sub="N→S"/>
        </div>
        <div style={{marginTop:12,padding:10,background:"var(--surface-2)",borderRadius:10,fontSize:11,color:"var(--ocean-700)",display:"flex",alignItems:"center",gap:8}}>
          <Icon name="info" size={14} style={{color:"var(--ocean-500)",flexShrink:0}}/>
          <span>Conditions favorable across all sites today.</span>
        </div>
      </div>
    </div>
  );
}
function Mini({label,value,sub}){
  return (
    <div style={{padding:"8px 10px",background:"var(--surface-2)",borderRadius:10}}>
      <div style={{fontSize:10,color:"var(--ocean-700)",opacity:0.7,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
      <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--ocean-900)",marginTop:2}} className="tabular">{value}</div>
      <div style={{fontSize:10,color:"var(--ocean-700)",opacity:0.6}}>{sub}</div>
    </div>
  );
}

function RecentlyAffiliatedCard() {
  const people = [
    { initial:"H", name:"Hugo Leclercq", id:"DV-A37188B517", time:"23d", c:0 },
    { initial:"B", name:"Bdav", id:"DV-FFC7A67972", time:"24d", c:1 },
    { initial:"S", name:"smokedrip", id:"DV-6776A276D8", time:"1mo", c:2 },
    { initial:"A", name:"adrien.lemardeley", id:"DV-6ABE984745", time:"1mo", c:3 },
    { initial:"M", name:"Miléna Boyer", id:"DV-3EBAAFCA6C", time:"1mo", c:4 },
    { initial:"K", name:"keveqyza", id:"DV-95C84E95AD", time:"2mo", c:5 },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div className="flex items-center gap-3">
          <span className="card-head-title">Recently affiliated</span>
          <span className="chip chip-green">+11 THIS MONTH</span>
        </div>
        <button className="btn btn-ghost btn-sm">View all <Icon name="chevron_right" size={12}/></button>
      </div>
      <div style={{padding:8}}>
        {people.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10}}
               onMouseOver={e=>e.currentTarget.style.background="var(--surface-2)"}
               onMouseOut={e=>e.currentTarget.style.background="transparent"}>
            <div className={`avatar avatar-sm avatar-c${p.c}`}>{p.initial}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{p.name}</div>
              <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}} className="tabular">{p.id}</div>
            </div>
            <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}}>{p.time} ago</div>
            <span className="chip chip-green">CURRENT</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingCard(){
  const items = [
    { type:"cert", who:"Adrien Lemardeley", what:"AOWD certification waiting OCR review", time:"2h", icon:"shield", color:"amber"},
    { type:"booking", who:"Banca 02 · 04 May", what:"Overbooked by 2 spots — review & confirm", time:"4h", icon:"info", color:"red"},
    { type:"course", who:"Open Water · Group B", what:"Final exam scheduled, awaiting validation", time:"1d", icon:"book", color:"amber"},
    { type:"equipment", who:"Cressi BCD #BCD-007", what:"Service due — overdue 5 days", time:"5d", icon:"equipment", color:"red"},
    { type:"validation", who:"Trip 02 May 14:00", what:"Day complete — confirm validation", time:"6d", icon:"check", color:"amber"},
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div className="flex items-center gap-3">
          <span className="card-head-title">Needs your attention</span>
          <span className="chip chip-amber">5 ITEMS</span>
        </div>
        <button className="btn btn-ghost btn-sm">All</button>
      </div>
      <div style={{padding:8}}>
        {items.map((it,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px",borderRadius:10}}
               onMouseOver={e=>e.currentTarget.style.background="var(--surface-2)"}
               onMouseOut={e=>e.currentTarget.style.background="transparent"}>
            <div className={`avatar avatar-sm avatar-c${it.color==="amber"?2:4}`} style={{borderRadius:8,width:32,height:32}}>
              <Icon name={it.icon} size={14}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,color:"var(--ocean-900)"}}>{it.who}</div>
              <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.85,marginTop:2}}>{it.what}</div>
            </div>
            <div style={{fontSize:10,color:"var(--ocean-700)",opacity:0.6}}>{it.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingTrendCard(){
  const data = [12,18,14,22,26,32,28,24,30,36,42,38,30,34,40,46,52,48,42,38,44,50,55,52,48,44,50,58,62,58];
  const max = Math.max(...data);
  return (
    <div className="card">
      <div className="card-head">
        <div className="flex items-center gap-3">
          <span className="card-head-title">Booking trend</span>
          <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}}>Last 30 days</span>
        </div>
        <div className="seg">
          <button>7d</button>
          <button className="active">30d</button>
          <button>90d</button>
        </div>
      </div>
      <div style={{padding:"20px 16px 16px"}}>
        <div className="flex items-center gap-4 mb-3">
          <div>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:28,color:"var(--ocean-900)",letterSpacing:"-0.02em"}} className="tabular">1,148</div>
            <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}}>total dives booked</div>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--safety-green)"}} className="tabular">+24.6%</div>
            <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}}>vs prior period</div>
          </div>
        </div>
        <svg width="100%" height="120" viewBox={`0 0 ${data.length*14} 120`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ocean-500)" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="var(--ocean-500)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={`M 0 ${120 - (data[0]/max)*100} ${data.map((v,i)=>`L ${i*14} ${120-(v/max)*100}`).join(" ")} L ${(data.length-1)*14} 120 L 0 120 Z`} fill="url(#grad)"/>
          <path d={`M 0 ${120 - (data[0]/max)*100} ${data.map((v,i)=>`L ${i*14} ${120-(v/max)*100}`).join(" ")}`} stroke="var(--ocean-500)" strokeWidth="2" fill="none"/>
          {data.map((v,i)=> i===data.length-3 ? <circle key={i} cx={i*14} cy={120-(v/max)*100} r="4" fill="var(--ocean-500)" stroke="var(--surface-1)" strokeWidth="2"/> : null)}
        </svg>
      </div>
    </div>
  );
}

function StaffOnDutyCard(){
  const staff = [
    { initial:"HL", name:"Hugo Leclercq", role:"Instructor", trips:3, status:"on", c:0 },
    { initial:"DB", name:"Dav B.", role:"Divemaster", trips:2, status:"on", c:1 },
    { initial:"AM", name:"Amélie M.", role:"Divemaster", trips:0, status:"off", c:2 },
    { initial:"PR", name:"Pablo R.", role:"Instructor", trips:1, status:"on", c:5 },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-head-title">Staff on duty</span>
        <span className="chip chip-green"><span className="dot-status" style={{background:"var(--safety-green)"}}></span>3 ACTIVE</span>
      </div>
      <div style={{padding:8}}>
        {staff.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10}}>
            <div className={`avatar avatar-sm avatar-c${s.c}`}>{s.initial}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{s.name}</div>
              <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}}>{s.role}</div>
            </div>
            <div style={{fontSize:11,color:"var(--ocean-700)"}} className="tabular">{s.trips} trips</div>
            {s.status==="on"
              ? <span className="chip chip-green">ACTIVE</span>
              : <span className="chip chip-amber">DAY OFF</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { DashboardPage, StatCard });
