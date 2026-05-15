// =============================================================
// USERS PAGE — full-width diver profile
//
// Replaces the list+detail split with:
//   1. Recents strip   (horizontal, full-width — primary way to switch member)
//   2. Hero card       (avatar, name, IDs, primary actions)
//   3. Tabs            (Profile · Certifications · Dive history · Bookings · Notes)
//   4. Profile grid    (every field the system tracks, grouped by domain)
//
// Each field carries an ownership badge so the operator sees at a glance who
// is allowed to write it: DIVER, CENTER, BOTH, or PROTECTED (system / hub admin).
// =============================================================

function UsersPage({ tweaks }) {
  const [selected, setSelected] = React.useState(0);

  const members = [
    {
      initial:"H", name:"Hugo Leclercq", first:"Hugo", last:"Leclercq",
      id:"DV-A37188B517", userId:"7f8e4a91-2b3c-4d5e-9f1a-8c2b0d3e7f5a", displayId:"HL-001",
      email:"hugues.leclercq@gmail.com", phone:"+33 6 33 11 17 11",
      dob:"12 Aug 1991", age:34, lang:"FR (Français)",
      addr1:"14 rue de la Mer", addr2:"Apt 3B", city:"Marseille",
      region:"Provence-Alpes-Côte d'Azur", zip:"13007", country:"France",
      ecName:"Marie Leclercq", ecPhone:"+33 6 11 22 33 44",
      height:182, weight:78, shoe:43, bcd:"L", suit:"L", fins:"M",
      sizingAt:"22 Nov 2025", sizingCenter:"AlmaDiving Puerto Galera",
      allergies:"Penicillin · Tree nuts", diet:"Omnivore",
      diveInsurance:true, diveInsuranceName:"DAN World — #DW-49922", freeInsurance:false,
      ownGear:true, ownGearItems:["Mask","Snorkel","Computer (Shearwater Teric)","Wetsuit (3mm)","Boots"],
      ownFreeGear:true, ownFreeGearItems:["Mask (low-volume)","Long fins"],
      discipline:"Both — scuba primary",
      totalDives:212, lastDive:"23 Apr 2026",
      declaredAgency:"SSI", declaredLevel:"Dive Guide",
      totalFreedives:28, lastFreedive:"15 Feb 2026",
      declaredFreeAgency:"AIDA", declaredFreeLevel:"AIDA 2",
      cert:"DIVE GUIDE", role:"Instructor", verified:true, c:0,
      affiliations:[
        {center:"AlmaDiving Puerto Galera", status:"active", current:true, since:"10 Apr 2024"},
        {center:"DiveTribe Marseille", status:"lapsed", current:false, since:"03 Jun 2021"},
      ],
      certs:[
        {agency:"SSI", level:"Dive Guide", code:"7112070120377355110-CG", date:"May 2024", verified:true, primary:true},
        {agency:"SSI", level:"Divemaster", code:"7112677120377351110-DM", date:"Mar 2024", verified:true},
        {agency:"SSI", level:"Open Water", code:"7112070120377355110-OW", date:"Jul 2022", verified:true},
        {agency:"SSI", level:"Nitrox", code:"7112377120377355110-NX", date:"Aug 2023", verified:true, specialty:true},
        {agency:"DiveTribe", level:"Specialty programs", code:"7113677120377351155-SP", date:"Apr 2025", verified:true, specialty:true},
      ],
      specialties:["NITROX","WRECK","NIGHT"],
      hubRole:null, suspended:false, hasMobile:true,
      createdAt:"10 Apr 2024", updatedAt:"12 May 2026 · 14:22 UTC", joined:"23d ago",
    },
    {
      initial:"B", name:"Bdav", first:"Bertrand", last:"Davenas",
      id:"DV-FFC7A67972", userId:"2c4f87bd-…", displayId:"BD-014",
      email:"bdavgm@gmail.com", phone:"+33 6 22 04 19 33",
      dob:"04 Mar 1988", age:38, lang:"FR (Français)",
      cert:"DIVEMASTER", role:"Divemaster", verified:true, c:1,
      totalDives:148, lastDive:"02 May 2026", declaredAgency:"SSI", declaredLevel:"Divemaster",
      joined:"24d ago", specialties:["NITROX","DEEP"],
    },
    {
      initial:"S", name:"smokedrip", first:"Sam", last:"Okada",
      id:"DV-6776A276D8", email:"smoke@example.com", phone:"+33 6 11 22 33 44",
      cert:"AOWD", role:"—", verified:true, c:2,
      totalDives:42, lastDive:"15 Apr 2026", declaredAgency:"PADI", declaredLevel:"Advanced Open Water",
      joined:"1mo ago", specialties:["NITROX"],
    },
    {
      initial:"A", name:"Adrien Lemardeley", first:"Adrien", last:"Lemardeley",
      id:"DV-6ABE984745", email:"adrien.l@example.com", phone:"+33 7 09 18 22 30",
      cert:"OWD", role:"—", verified:false, c:3,
      totalDives:8, lastDive:"—", declaredAgency:"SSI", declaredLevel:"Open Water",
      joined:"1mo ago", specialties:[],
    },
    {
      initial:"M", name:"Miléna Boyer", first:"Miléna", last:"Boyer",
      id:"DV-3EBAAFCA6C", email:"milena.b@example.com", phone:"+33 6 87 22 04 02",
      cert:"AOWD", role:"—", verified:true, c:4,
      totalDives:36, lastDive:"28 Apr 2026", declaredAgency:"SSI", declaredLevel:"AOWD",
      joined:"1mo ago", specialties:["NITROX"],
    },
    {
      initial:"K", name:"keveqyza", first:"Kevin", last:"Eqyza",
      id:"DV-95C84E95AD", email:"keve@example.com", phone:"—",
      cert:"OWD", role:"—", verified:false, c:5,
      totalDives:4, lastDive:"—", declaredAgency:"PADI", declaredLevel:"Open Water",
      joined:"2mo ago", specialties:[],
    },
    {
      initial:"K", name:"keyawi9777", first:"Kara", last:"Yawi",
      id:"DV-FBDA1CE150", email:"keyawi@example.com", phone:"—",
      cert:"OWD", role:"—", verified:true, c:0,
      totalDives:18, lastDive:"12 Mar 2026", declaredAgency:"SSI", declaredLevel:"Open Water",
      joined:"2mo ago", specialties:[],
    },
  ];

  const m = members[selected];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Members</h1>
          <div className="page-sub">142 affiliated divers · 8 staff · 11 students enrolled</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> New member</button>
        </div>
      </div>

      {/* RECENTS — full-width, the primary way to swap members now that the list is gone */}
      <div className="card" style={{marginBottom:16, padding:"12px 16px"}}>
        <div className="flex items-center justify-between" style={{marginBottom:10}}>
          <div className="flex items-center gap-3">
            <span style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--ocean-700)",opacity:0.65}}>Recents</span>
            <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.5}}>·</span>
            <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.55,fontFamily:"var(--font-ui)"}}>last 7 viewed · use ⌘K to find anyone</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm" style={{height:26,padding:"0 8px"}}><Icon name="list" size={12}/> Browse all 142</button>
            <button style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:600,color:"var(--ocean-500)",letterSpacing:"0.04em",background:"none",border:0,cursor:"pointer",padding:0}}>Clear</button>
          </div>
        </div>
        <div className="flex gap-2 scroll" style={{overflowX:"auto",paddingBottom:2}}>
          {members.map((p,i)=>(
            <button key={i} onClick={()=>setSelected(i)}
                    style={{
                      display:"flex",alignItems:"center",gap:9,
                      padding:"5px 14px 5px 5px",flexShrink:0,
                      background: selected===i ? "var(--ocean-50)" : "var(--surface-2)",
                      border:`1px solid ${selected===i ? "var(--ocean-100)" : "transparent"}`,
                      borderRadius:9,cursor:"pointer",
                      transition:"border-color 120ms, background 120ms",
                    }}>
              <div className={`avatar avatar-c${p.c}`} style={{width:26,height:26,borderRadius:7,fontSize:11,flexShrink:0}}>{p.initial}</div>
              <div style={{textAlign:"left",lineHeight:1.2,minWidth:0}}>
                <div style={{fontFamily:"var(--font-ui)",fontWeight:600,fontSize:12,color:"var(--ocean-900)",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                <div className="tabular" style={{fontSize:10,color:"var(--ocean-700)",opacity:0.6}}>{p.id}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="card" style={{marginBottom:16, overflow:"hidden"}}>
        <div style={{position:"relative"}}>
          {/* Cover band */}
          <div style={{height:124,background:"linear-gradient(135deg, var(--ocean-deep) 0%, var(--ocean-deep-light) 100%)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 85% 25%, rgba(255,255,255,0.18), transparent 55%)"}}/>
            <div style={{position:"absolute",top:14,right:18,display:"flex",gap:6}}>
              <button className="btn btn-sm" style={{background:"rgba(255,255,255,0.18)",color:"white",backdropFilter:"blur(8px)"}}><Icon name="message" size={12}/> Message</button>
              <button className="btn btn-sm" style={{background:"rgba(255,255,255,0.18)",color:"white",backdropFilter:"blur(8px)"}}><Icon name="edit" size={12}/> Edit</button>
              <button className="btn btn-sm" style={{background:"rgba(255,255,255,0.18)",color:"white",backdropFilter:"blur(8px)"}}><Icon name="trash" size={12}/></button>
            </div>
          </div>

          {/* Avatar — straddles cover/white seam */}
          <div className={`avatar avatar-c${m.c}`} style={{position:"absolute",left:24,top:72,width:104,height:104,borderRadius:22,fontSize:36,border:"4px solid var(--surface-1)",boxShadow:"0 4px 12px rgba(10,37,64,0.12)",zIndex:2}}>{m.initial}</div>

          {/* Identity row */}
          <div style={{padding:"18px 24px 18px 148px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <div style={{minWidth:0}}>
              <div className="flex items-center gap-2" style={{flexWrap:"wrap",marginBottom:6}}>
                <h2 style={{margin:0,fontFamily:"var(--font-ui)",fontWeight:800,fontSize:26,color:"var(--ocean-900)",letterSpacing:"-0.02em"}}>{m.name}</h2>
                {m.role && m.role!=="—" && <span className="chip chip-ocean">{m.role.toUpperCase()}</span>}
                {m.verified
                  ? <span className="chip chip-green"><Icon name="check" size={10}/>VERIFIED</span>
                  : <span className="chip chip-amber">PENDING</span>}
                {m.suspended && <span className="chip chip-red"><Icon name="lock" size={10}/>SUSPENDED</span>}
              </div>
              <div className="flex items-center gap-3" style={{fontSize:12,color:"var(--ocean-700)",flexWrap:"wrap"}}>
                <span className="flex items-center gap-1"><Icon name="id" size={12} style={{opacity:0.55}}/><span className="tabular" style={{fontWeight:700,color:"var(--ocean-900)"}}>{m.id}</span></span>
                <span style={{opacity:0.3}}>·</span>
                <span className="flex items-center gap-1"><Icon name="mail" size={12} style={{opacity:0.55}}/>{m.email}</span>
                {m.phone && m.phone!=="—" && (<><span style={{opacity:0.3}}>·</span>
                  <span className="flex items-center gap-1"><Icon name="phone" size={12} style={{opacity:0.55}}/>{m.phone}</span></>)}
                <span style={{opacity:0.3}}>·</span>
                <span className="flex items-center gap-1"><Icon name="calendar" size={12} style={{opacity:0.55}}/>Joined {m.joined}</span>
              </div>
            </div>
            <button className="btn btn-primary"><Icon name="plus" size={13}/> Add to trip</button>
          </div>

          {/* Inline summary stats */}
          <div style={{borderTop:"1px solid var(--surface-3)",display:"grid",gridTemplateColumns:"repeat(5,1fr)"}}>
            <SummaryStat label="Total dives" value={m.totalDives ?? "—"} mono/>
            <SummaryStat label="Last dive" value={m.lastDive || "—"}/>
            <SummaryStat label="Cert level" value={m.cert}/>
            <SummaryStat label="Specialties" value={(m.specialties||[]).length} mono sub={(m.specialties||[]).slice(0,2).join(", ") || "—"}/>
            <SummaryStat label="Affiliations" value={(m.affiliations||[]).length || 1} mono sub="this center · current"/>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="card" style={{marginBottom:0}}>
        <div style={{padding:"0 18px",borderBottom:"1px solid var(--surface-3)"}}>
          <div style={{display:"flex",gap:4}}>
            {["Profile","Certifications","Dive history","Bookings","Notes"].map((t,i)=>(
              <button key={t} style={{
                padding:"14px 14px",fontFamily:"var(--font-ui)",fontWeight:600,fontSize:13,
                color: i===0 ? "var(--ocean-500)" : "var(--ocean-700)",
                borderBottom: i===0 ? "2px solid var(--ocean-500)" : "2px solid transparent",
                background:"none",
              }}>
                {t}
                {t==="Certifications" && <span style={{marginLeft:6,padding:"1px 5px",background:"var(--ocean-100)",color:"var(--ocean-500)",borderRadius:4,fontSize:10,fontWeight:700}} className="tabular">{(m.certs||[]).length}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* PROFILE GRID — every field grouped by domain */}
        <div style={{padding:18,background:"var(--surface-0)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2, minmax(0,1fr))",gap:12}}>

            {/* IDENTITY */}
            <ProfSection title="Identity" subtitle="Self-declared name and locale" owner="diver">
              <FieldGrid cols={2}>
                <Field label="First name" value={m.first}/>
                <Field label="Last name" value={m.last}/>
              </FieldGrid>
              <Field label="Display name" value={m.name} help="Auto-recomputed by DB trigger on every name change"/>
              <FieldGrid cols={2}>
                <Field label="Date of birth" value={m.dob ? `${m.dob} · ${m.age} yrs` : null} mono/>
                <Field label="Language" value={m.lang}/>
              </FieldGrid>
              <Field label="Email" value={m.email} help="Login + automated comms"/>
            </ProfSection>

            {/* SYSTEM IDS */}
            <ProfSection title="System IDs" subtitle="Set by hub at signup; never editable" owner="protected">
              <Field label="Dive ID" value={m.id} mono help="Public-facing diver ID for check-in / search"/>
              <Field label="Display ID" value={m.displayId} mono/>
              <Field label="User UUID" value={m.userId} mono help="Canonical identifier across hub and all centers"/>
              <FieldGrid cols={2}>
                <Field label="Created" value={m.createdAt}/>
                <Field label="Last updated" value={m.updatedAt}/>
              </FieldGrid>
            </ProfSection>

            {/* CONTACT */}
            <ProfSection title="Contact" subtitle="Phone — direct contact + SMS/OTP" owner="diver">
              <Field label="Phone" value={m.phone}/>
            </ProfSection>

            {/* ADDRESS */}
            <ProfSection title="Address" subtitle="Postal, billing, jurisdiction inference" owner="diver">
              <Field label="Line 1" value={m.addr1}/>
              <Field label="Line 2" value={m.addr2}/>
              <FieldGrid cols={2}>
                <Field label="City" value={m.city}/>
                <Field label="Postal code" value={m.zip} mono/>
              </FieldGrid>
              <FieldGrid cols={2}>
                <Field label="State / region" value={m.region}/>
                <Field label="Country" value={m.country}/>
              </FieldGrid>
            </ProfSection>

            {/* EMERGENCY CONTACT */}
            <ProfSection title="Emergency contact" subtitle="Next-of-kin · accessed in incident response" owner="both" span="full">
              <FieldGrid cols={2}>
                <Field label="Name" value={m.ecName}/>
                <Field label="Phone" value={m.ecPhone}/>
              </FieldGrid>
            </ProfSection>

            {/* HEALTH & SAFETY */}
            <ProfSection title="Health & safety" subtitle="Safety-critical · read by trip catering and incident response" owner="both" tone="amber">
              <Field label="Allergies" value={m.allergies} help="Food, medications, latex. Free-text."/>
              <Field label="Diet preference" value={m.diet}/>
              <FieldGrid cols={2}>
                <Field label="Scuba insurance" value={m.diveInsurance ? "Yes" : "No"} chip={m.diveInsurance?"green":"surface"} sub={m.diveInsuranceName}/>
                <Field label="Freediving insurance" value={m.freeInsurance ? "Yes" : "No"} chip={m.freeInsurance?"green":"surface"}/>
              </FieldGrid>
            </ProfSection>

            {/* BODY MEASUREMENTS */}
            <ProfSection title="Body measurements" subtitle="Drives ballast + wetsuit + fin sizing" owner="both">
              <FieldGrid cols={3}>
                <Field label="Height" value={m.height ? `${m.height} cm` : null} mono/>
                <Field label="Weight" value={m.weight ? `${m.weight} kg` : null} mono/>
                <Field label="Shoe size" value={m.shoe ? `${m.shoe} EU` : null} mono/>
              </FieldGrid>
            </ProfSection>

            {/* EQUIPMENT SIZING */}
            <ProfSection title="Equipment sizing" subtitle="Once measured at any center, never re-measured" owner="both">
              <FieldGrid cols={3}>
                <Field label="BCD size" value={m.bcd} mono/>
                <Field label="Wetsuit" value={m.suit} mono/>
                <Field label="Fins" value={m.fins} mono help="Open-heel; full-foot uses shoe size"/>
              </FieldGrid>
              <div style={{marginTop:8,paddingTop:10,borderTop:"1px dashed var(--surface-3)",display:"flex",alignItems:"center",gap:8,fontSize:11,color:"var(--ocean-700)",opacity:0.75}}>
                <Icon name="info" size={12} style={{opacity:0.6}}/>
                <span>Recorded by <strong style={{fontWeight:600,color:"var(--ocean-900)"}}>{m.sizingCenter}</strong> on <span className="tabular">{m.sizingAt}</span></span>
              </div>
            </ProfSection>

            {/* PERSONAL GEAR — SCUBA */}
            <ProfSection title="Personal gear — Scuba" subtitle="What the diver brings vs. needs to rent" owner="both">
              <Field label="Owns scuba gear" value={m.ownGear ? "Yes" : "No"} chip={m.ownGear?"ocean":"surface"}/>
              <Field label="Items" value={(m.ownGearItems||[]).length ? null : "—"} fieldChildren={
                (m.ownGearItems||[]).length>0 && (
                  <div className="flex gap-1" style={{flexWrap:"wrap",marginTop:4}}>
                    {m.ownGearItems.map(it=> <span key={it} className="chip" style={{textTransform:"none",letterSpacing:0,fontSize:11,fontWeight:500,padding:"3px 8px"}}>{it}</span>)}
                  </div>
                )
              }/>
            </ProfSection>

            {/* PERSONAL GEAR — FREEDIVING */}
            <ProfSection title="Personal gear — Freediving" subtitle="Long fins, low-volume mask, etc." owner="both">
              <Field label="Owns freediving gear" value={m.ownFreeGear ? "Yes" : "No"} chip={m.ownFreeGear?"teal":"surface"}/>
              <Field label="Items" fieldChildren={
                (m.ownFreeGearItems||[]).length>0 ? (
                  <div className="flex gap-1" style={{flexWrap:"wrap",marginTop:4}}>
                    {m.ownFreeGearItems.map(it=> <span key={it} className="chip chip-teal" style={{textTransform:"none",letterSpacing:0,fontSize:11,fontWeight:500,padding:"3px 8px"}}>{it}</span>)}
                  </div>
                ) : <span className="muted-strong">—</span>
              }/>
            </ProfSection>

            {/* SCUBA — ACTIVITY + DECLARED CERT */}
            <ProfSection title="Scuba — Activity & declared cert" subtitle="Activity is observed; cert is self-declared until verified" mixedOwner>
              <FieldGrid cols={2}>
                <Field label="Total dives" value={m.totalDives ?? "—"} mono owner="both" help="Center increments after each trip"/>
                <Field label="Last dive" value={m.lastDive || "—"} mono owner="both" help="Gap > 12mo may need refresher"/>
              </FieldGrid>
              <FieldGrid cols={2}>
                <Field label="Declared agency" value={m.declaredAgency} owner="diver"/>
                <Field label="Declared level" value={m.declaredLevel} owner="diver" help="Fast-path before cert image upload"/>
              </FieldGrid>
            </ProfSection>

            {/* FREEDIVING — DISCIPLINE + ACTIVITY + DECLARED CERT */}
            <ProfSection title="Freediving — Discipline & activity" subtitle="Discipline + declared cert are diver-only; activity is observed" mixedOwner>
              <Field label="Discipline preference" value={m.discipline} owner="diver"/>
              <FieldGrid cols={2}>
                <Field label="Total freedives" value={m.totalFreedives ?? "—"} mono owner="both"/>
                <Field label="Last freedive" value={m.lastFreedive || "—"} mono owner="both"/>
              </FieldGrid>
              <FieldGrid cols={2}>
                <Field label="Declared agency" value={m.declaredFreeAgency} owner="diver"/>
                <Field label="Declared level" value={m.declaredFreeLevel} owner="diver"/>
              </FieldGrid>
            </ProfSection>

            {/* VERIFIED CERTIFICATIONS — full width */}
            <ProfSection title="Verified certifications" subtitle="Backed by uploaded card images + OCR · the cert gate truth" owner="protected" span="full">
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                {(m.certs||[]).map((c,i)=>(
                  <CertRow key={i} agency={c.agency} level={c.level} code={c.code} date={c.date} verified={c.verified} primary={c.primary} specialty={c.specialty}/>
                ))}
                {(!m.certs || m.certs.length===0) && <Empty msg="No verified certifications yet" sub="Diver hasn't uploaded a card."/>}
              </div>
              {m.specialties && m.specialties.length>0 && (
                <div style={{marginTop:12,paddingTop:12,borderTop:"1px dashed var(--surface-3)"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7,marginBottom:6,fontFamily:"var(--font-ui)"}}>Specialty unlocks · derived from approved certs</div>
                  <div className="flex gap-2" style={{flexWrap:"wrap"}}>
                    {m.specialties.map(s=> <span key={s} className="chip chip-teal">{s}</span>)}
                  </div>
                </div>
              )}
            </ProfSection>

            {/* AFFILIATIONS — full width */}
            <ProfSection title="Affiliations" subtitle="Which centers can read/write this diver" owner="protected" span="full">
              {(m.affiliations||[]).map((a,i)=> <AffiliationRow key={i} a={a}/>)}
              {(!m.affiliations || m.affiliations.length===0) && (
                <AffiliationRow a={{center:"AlmaDiving Puerto Galera", status:"active", current:true, since:m.joined}}/>
              )}
            </ProfSection>

            {/* AUDIT & GOVERNANCE — full width */}
            <ProfSection title="Audit & governance" subtitle="Hub-admin only · never writable by diver or center" owner="protected" span="full">
              <FieldGrid cols={4}>
                <Field label="Suspended" value={m.suspended ? "Yes" : "No"} chip={m.suspended?"red":"green"} help="Banned from platform"/>
                <Field label="Hub role" value={m.hubRole || "—"} help="Internal role flag"/>
                <Field label="Has mobile app" value={m.hasMobile ? "Yes" : "No"} chip={m.hasMobile?"ocean":"surface"} help="Derived from push token presence"/>
                <Field label="Cert prompt dismissed" value="—" help="Last time diver dismissed the cert upload nag"/>
              </FieldGrid>
            </ProfSection>

          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Hero summary stat ----------
function SummaryStat({label, value, sub, mono}){
  return (
    <div style={{padding:"12px 16px",borderRight:"1px solid var(--surface-3)"}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.6,fontFamily:"var(--font-ui)",marginBottom:4}}>{label}</div>
      <div className={mono?"tabular":""} style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:16,color:"var(--ocean-900)",letterSpacing:"-0.01em"}}>{value}</div>
      {sub && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65,marginTop:2}}>{sub}</div>}
    </div>
  );
}

// ---------- Profile section card ----------
//
// owner: 'diver' | 'center' | 'both' | 'protected'
// mixedOwner: section has fields with different ownership — show no section badge,
//             each Field carries its own.
// span:  'full' to span the 2-column grid
// tone:  'amber' for safety-critical sections (subtle border tint)
function ProfSection({title, subtitle, owner, mixedOwner, span, tone, children}){
  const fullStyle = span==="full" ? {gridColumn:"1 / -1"} : {};
  const toneBorder = tone==="amber" ? "var(--amber-alert-bg)" : "var(--surface-3)";
  return (
    <div className="card" style={{...fullStyle, borderColor:toneBorder}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--surface-3)",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
        <div style={{minWidth:0}}>
          <div className="card-head-title" style={{display:"flex",alignItems:"center",gap:8}}>
            {tone==="amber" && <Icon name="info" size={13} style={{color:"var(--amber-alert)"}}/>}
            {title}
          </div>
          {subtitle && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>{subtitle}</div>}
        </div>
        {mixedOwner
          ? <OwnerChip owner="mixed"/>
          : owner && <OwnerChip owner={owner}/>}
      </div>
      <div style={{padding:14,display:"flex",flexDirection:"column",gap:10}}>
        {children}
      </div>
    </div>
  );
}

// ---------- Ownership chip ----------
function OwnerChip({owner}){
  const map = {
    diver:     {label:"Diver writes",        bg:"var(--ocean-100)",     color:"var(--ocean-500)",  icon:"user"},
    center:    {label:"Center writes",       bg:"var(--accent-teal-bg)",color:"var(--accent-teal)",icon:"shield"},
    both:      {label:"Diver + Center",      bg:"var(--surface-2)",     color:"var(--ocean-700)",  icon:"users"},
    protected: {label:"Protected · system",  bg:"var(--surface-2)",     color:"var(--ocean-700)",  icon:"lock"},
    mixed:     {label:"Mixed ownership",     bg:"var(--surface-2)",     color:"var(--ocean-700)",  icon:"info"},
  };
  const o = map[owner]; if(!o) return null;
  return (
    <span className="chip" style={{background:o.bg, color:o.color, textTransform:"uppercase", padding:"3px 7px", flexShrink:0}}>
      <Icon name={o.icon} size={10}/>{o.label}
    </span>
  );
}

// ---------- Field ----------
//
// Renders a label + value pair. Optional:
//   help          — small hint line under the value
//   sub           — extra inline text under the value (mono-styled)
//   chip          — render value as a colored chip ("green"/"red"/"amber"/"ocean"/"teal"/"surface")
//   owner         — per-field ownership chip (only when section uses mixedOwner)
//   fieldChildren — replace value with custom JSX (e.g. chip rows)
//   mono          — tabular nums on the value
function Field({label, value, mono, help, sub, chip, owner, fieldChildren}){
  const isEmpty = value === undefined || value === null || value === "" || value === "—";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:0}}>
      <div className="flex items-center justify-between gap-2">
        <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7,fontFamily:"var(--font-ui)"}}>{label}</span>
        {owner && <OwnerPip owner={owner}/>}
      </div>
      {fieldChildren !== undefined
        ? fieldChildren
        : chip
          ? <span><span className={`chip ${chipClass(chip)}`}>{value}</span></span>
          : <div className={mono?"tabular":""} style={{fontSize:13,color: isEmpty ? "var(--ocean-700)" : "var(--ocean-900)", opacity: isEmpty ? 0.5 : 1, fontWeight: isEmpty ? 400 : 500, wordBreak:"break-word"}}>{isEmpty ? "—" : value}</div>}
      {sub && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65}}>{sub}</div>}
      {help && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.55,lineHeight:1.4}}>{help}</div>}
    </div>
  );
}

function chipClass(t){
  return {green:"chip-green", red:"chip-red", amber:"chip-amber", ocean:"chip-ocean", teal:"chip-teal", surface:""}[t] || "";
}

// Per-field ownership pip — used only inside mixedOwner sections.
function OwnerPip({owner}){
  const map = {
    diver:  {label:"D", title:"Diver writes",  bg:"var(--ocean-100)",     color:"var(--ocean-500)"},
    center: {label:"C", title:"Center writes", bg:"var(--accent-teal-bg)",color:"var(--accent-teal)"},
    both:   {label:"·", title:"Both write",    bg:"var(--surface-2)",     color:"var(--ocean-700)"},
  };
  const o = map[owner]; if(!o) return null;
  return (
    <span title={o.title} style={{
      width:16,height:16,display:"inline-grid",placeItems:"center",
      background:o.bg, color:o.color, borderRadius:4,
      fontFamily:"var(--font-ui)", fontWeight:800, fontSize:9, letterSpacing:0,
      flexShrink:0,
    }}>{o.label}</span>
  );
}

// ---------- Field grid (1-3-4 columns inside a section) ----------
function FieldGrid({cols=2, children}){
  return <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gap:12}}>{children}</div>;
}

// ---------- Affiliation row ----------
function AffiliationRow({a}){
  const statusChip = {
    active:  <span className="chip chip-green">ACTIVE</span>,
    lapsed:  <span className="chip">LAPSED</span>,
    pending: <span className="chip chip-amber">PENDING</span>,
  }[a.status] || <span className="chip">{a.status?.toUpperCase()}</span>;
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--surface-3)"}}>
      <div style={{width:32,height:32,borderRadius:8,background:"var(--ocean-100)",color:"var(--ocean-500)",display:"grid",placeItems:"center"}}>
        <Icon name="home" size={14}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div className="flex items-center gap-2">
          <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{a.center}</span>
          {a.current && <span className="chip chip-ocean"><Icon name="check" size={10}/>CURRENT</span>}
        </div>
        <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65,marginTop:1}}>Affiliated since <span className="tabular">{a.since}</span></div>
      </div>
      {statusChip}
    </div>
  );
}

// ---------- Cert row (kept from previous version) ----------
function CertRow({agency,level,code,date,verified,primary,specialty}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:12,background:primary?"var(--ocean-50)":"var(--surface-2)",borderRadius:10,border: primary?"1px solid var(--ocean-100)":"1px solid transparent"}}>
      <div style={{width:38,height:46,background: specialty?"var(--accent-teal)":"var(--ocean-deep)",borderRadius:6,display:"grid",placeItems:"center",color:"white",fontFamily:"var(--font-ui)",fontWeight:800,fontSize:11,letterSpacing:"0.04em"}}>
        {agency}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div className="flex items-center gap-1">
          <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{level}</span>
          {primary && <span className="chip chip-ocean" style={{fontSize:9}}>PRIMARY</span>}
          {specialty && <span className="chip chip-teal" style={{fontSize:9}}>SPECIALTY</span>}
        </div>
        <div style={{fontSize:10,color:"var(--ocean-700)",opacity:0.7,marginTop:2}} className="tabular">{code}</div>
        <div style={{fontSize:10,color:"var(--ocean-700)",opacity:0.6,marginTop:1}}>Issued {date}</div>
      </div>
      {verified && (
        <div style={{display:"grid",placeItems:"center",width:22,height:22,borderRadius:"50%",background:"var(--safety-green)",color:"white"}}>
          <Icon name="check" size={12}/>
        </div>
      )}
    </div>
  );
}

function Empty({msg, sub}){
  return (
    <div style={{gridColumn:"1 / -1",padding:"24px",textAlign:"center",background:"var(--surface-2)",borderRadius:10}}>
      <Icon name="info" size={20} style={{color:"var(--ocean-700)",opacity:0.4}}/>
      <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)",marginTop:6}}>{msg}</div>
      {sub && <div style={{fontSize:12,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>{sub}</div>}
    </div>
  );
}

window.UsersPage = UsersPage;
