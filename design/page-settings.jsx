// =============================================================
// SETTINGS — mirrors the live admin app exactly:
//   APP        · general · center · rights
//   PLANNING   · destinations · boats · planning
//   EQUIPMENT  · definitions · matching
//   BOOKING    · booking · notifications
//   FINANCIAL  · fin-settings
//
// Each sub-page is a standalone component below. Where I don't yet
// know the live app's shape, the screen is marked PLACEHOLDER and
// uses representative dive-center data so we can iterate together.
// =============================================================

function SettingsPage({ section = "general" }) {
  const sections = {
    // APP
    general:      <SettingsGeneral/>,
    center:       <SettingsCenter/>,
    rights:       <SettingsStaffRights/>,
    // PLANNING
    destinations: <SettingsDestinations/>,
    boats:        <SettingsBoats/>,
    planning:     <SettingsPlanningRules/>,
    // EQUIPMENT
    definitions:  <SettingsEquipmentDefinitions/>,
    matching:     <SettingsEquipmentMatching/>,
    // BOOKING
    booking:      <SettingsBooking/>,
    notifications:<SettingsNotifications/>,
    // FINANCIAL
    "fin-settings": <SettingsFinancial/>,
  };

  const titles = {
    general:      { group:"App",       title:"General",       sub:"Center identity, time zone, language" },
    center:       { group:"App",       title:"Center",        sub:"Operating bases & opening hours" },
    rights:       { group:"App",       title:"Staff Rights",  sub:"Roles and per-feature permissions" },
    destinations: { group:"Planning",  title:"Destinations",  sub:"Dive sites available for trips" },
    boats:        { group:"Planning",  title:"Boats",         sub:"Fleet — capacity, equipment, schedule" },
    planning:     { group:"Planning",  title:"Planning",      sub:"Validation, day-log, organizer rules" },
    definitions:  { group:"Equipment", title:"Definitions",   sub:"Equipment types, brands, sizes" },
    matching:     { group:"Equipment", title:"Matching",      sub:"Auto-assignment rules — diver → gear" },
    booking:      { group:"Booking",   title:"Booking",       sub:"Booking flow, deposits, cancellation" },
    notifications:{ group:"Booking",   title:"Notifications", sub:"Channels, rules, quiet hours" },
    "fin-settings":{ group:"Financial",title:"Settings",      sub:"Currency, tax, payouts, invoicing" },
  };
  const t = titles[section] || titles.general;

  return (
    <div>
      {/* Page header — RULE: NO inline breadcrumb in content. The topbar
          breadcrumb (Section › Subsection) is the single source of location;
          this header is just Title + Subtitle. See system.md → Page Skeleton. */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t.title}</h1>
          <div className="page-sub">{t.sub}</div>
        </div>
        <div className="page-actions" style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--ocean-700)",opacity:0.65,fontFamily:"var(--font-ui)"}}>
          <Icon name="check" size={13}/>
          <span>Changes save automatically</span>
        </div>
      </div>

      {sections[section] || sections.general}
    </div>
  );
}

// =============================================================
// APP · General — center identity, time zone, language
// =============================================================
function SettingsGeneral() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="Identity" sub="Public-facing organization details">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="Legal name" value="AlmaDiving SAS"/>
            <Field label="Trading name" value="AlmaDiving"/>
            <Field label="Tax ID / SIRET" value="89412376500024" mono/>
            <Field label="Founded" value="2019"/>
          </div>
          <Field label="Description" value="Eco-conscious dive center based in Puerto Galera. PADI 5★ IDC + SSI Diamond." textarea/>
        </SectionCard>

        <SectionCard title="Contact" sub="Primary contact information">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Email" value="hello@almadiving.com" type="email"/>
            <Field label="Phone" value="+63 917 555 0142"/>
            <Field label="Website" value="https://almadiving.com"/>
            <Field label="Instagram" value="@almadiving"/>
          </div>
        </SectionCard>

        <SectionCard title="Localization" sub="Hours, currency, language">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <Field label="Time zone" value="Asia/Manila (UTC+8)" select/>
            <Field label="Default currency" value="PHP — Philippine peso" select/>
            <Field label="Working language" value="English" select/>
            <Field label="Date format" value="DD/MM/YYYY" select/>
            <Field label="First day of week" value="Monday" select/>
            <Field label="Measurement units" value="Metric" select/>
          </div>
        </SectionCard>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="Center at a glance" compact>
          <SidebarRow label="Plan" value="Reef Pro"/>
          <SidebarRow label="Founded" value="Mar 2019"/>
          <SidebarRow label="Affiliated divers" value="142" mono/>
          <SidebarRow label="Staff seats" value="6 / 8" mono/>
          <SidebarRow label="Boats" value="4" mono last/>
        </SectionCard>

        <div style={{padding:14,background:"var(--ocean-50)",borderRadius:12,border:"1px solid var(--ocean-100)"}}>
          <div className="flex items-center gap-2 mb-2">
            <Icon name="sparkle" size={14} style={{color:"var(--ocean-500)"}}/>
            <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,color:"var(--ocean-900)"}}>Setup completion · 86%</span>
          </div>
          <div style={{height:6,background:"var(--surface-1)",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:"86%",height:"100%",background:"var(--ocean-500)"}}/>
          </div>
          <div style={{fontSize:11,color:"var(--ocean-700)",marginTop:8}}>Complete branding and add a second boat to reach 100%.</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// APP · Center — operating bases (multi-location centers)
// =============================================================
function SettingsCenter() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Operating bases" sub="Locations where trips depart and equipment is stored"
        action={<button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> Add base</button>}>
        <Row icon="map_pin" title="Puerto Galera (HQ)" sub="Sabang Beach, Mindoro, PH · 12 staff · 4 boats" action={<span className="chip chip-green">PRIMARY</span>}/>
        <Row icon="map_pin" title="El Nido seasonal base" sub="Palawan · Open Nov–May" action={<span className="chip chip-amber">SEASONAL</span>}/>
        <Row icon="map_pin" title="Coron pop-up" sub="Wrecks expedition · Mar–Apr" action={<span className="chip">ARCHIVED</span>} last/>
      </SectionCard>

      <SectionCard title="Primary base — Puerto Galera" sub="Address, hours and check-in details">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="Address line 1" value="Sabang Beach Road"/>
          <Field label="Address line 2" value="Sitio Sabang, Brgy. Sabang"/>
          <Field label="City" value="Puerto Galera"/>
          <Field label="Region / Province" value="Oriental Mindoro"/>
          <Field label="Country" value="Philippines" select/>
          <Field label="Postal code" value="5203" mono/>
          <Field label="Latitude" value="13.51648" mono/>
          <Field label="Longitude" value="120.86592" mono/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Field label="Day starts at" value="06:00"/>
          <Field label="Day ends at" value="20:00"/>
          <Field label="Check-in starts" value="30 min before"/>
        </div>
      </SectionCard>

      <SectionCard title="Weekly hours" sub="Days the center is open for booking">
        <table className="tbl" style={{margin:"0 -16px -16px"}}>
          <thead><tr><th>Day</th><th>Open</th><th>Close</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {[
              ["Monday","06:00","20:00","open"],
              ["Tuesday","06:00","20:00","open"],
              ["Wednesday","06:00","20:00","open"],
              ["Thursday","06:00","20:00","open"],
              ["Friday","06:00","21:00","open"],
              ["Saturday","05:30","21:00","open"],
              ["Sunday","07:00","18:00","open"],
            ].map(([d,o,c,s])=>(
              <tr key={d}>
                <td style={{fontWeight:600}}>{d}</td>
                <td className="tabular">{o}</td>
                <td className="tabular">{c}</td>
                <td><span className="chip chip-green">OPEN</span></td>
                <td style={{textAlign:"right"}}><button className="btn btn-ghost btn-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

// =============================================================
// APP · Staff Rights — roles + permission matrix
// =============================================================
function SettingsStaffRights() {
  const features = [
    { f:"Trips — view",       owner:true, mgr:true, instr:true, dm:true,  recep:true  },
    { f:"Trips — create/edit",owner:true, mgr:true, instr:true, dm:false, recep:false },
    { f:"Trips — validate",   owner:true, mgr:true, instr:true, dm:true,  recep:false },
    { f:"Members — view",     owner:true, mgr:true, instr:true, dm:true,  recep:true  },
    { f:"Members — edit",     owner:true, mgr:true, instr:false,dm:false, recep:true  },
    { f:"Members — affiliate",owner:true, mgr:true, instr:false,dm:false, recep:true  },
    { f:"Bookings",           owner:true, mgr:true, instr:false,dm:false, recep:true  },
    { f:"Equipment",          owner:true, mgr:true, instr:true, dm:true,  recep:false },
    { f:"Finance",            owner:true, mgr:true, instr:false,dm:false, recep:false },
    { f:"Settings",           owner:true, mgr:false,instr:false,dm:false, recep:false },
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Roles" sub="6 staff members across 5 roles"
        action={<button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> New role</button>}>
        <RolePermRow role="Owner"      color="ocean" perms={["All settings","Billing","Delete data"]} count={1}/>
        <RolePermRow role="Manager"    color="teal"  perms={["Trips","Members","Finance","Equipment"]} count={1}/>
        <RolePermRow role="Instructor" color="green" perms={["Trips","Members read","Equipment"]} count={2}/>
        <RolePermRow role="Divemaster" color="amber" perms={["Trips","Validation","Equipment"]} count={1}/>
        <RolePermRow role="Reception"  color="ocean" perms={["Bookings","Members"]} count={1} last/>
      </SectionCard>

      <SectionCard title="Permission matrix" sub="Which role can do what — click any cell to flip">
        <div style={{margin:"0 -16px -16px",overflowX:"auto"}}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{minWidth:200}}>Capability</th>
                <th style={{textAlign:"center"}}><span className="chip chip-ocean">OWNER</span></th>
                <th style={{textAlign:"center"}}><span className="chip chip-teal">MANAGER</span></th>
                <th style={{textAlign:"center"}}><span className="chip chip-green">INSTRUCTOR</span></th>
                <th style={{textAlign:"center"}}><span className="chip chip-amber">DIVEMASTER</span></th>
                <th style={{textAlign:"center"}}><span className="chip chip-ocean">RECEPTION</span></th>
              </tr>
            </thead>
            <tbody>
              {features.map((row,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600}}>{row.f}</td>
                  {[row.owner,row.mgr,row.instr,row.dm,row.recep].map((on,j)=>(
                    <td key={j} style={{textAlign:"center"}}>
                      {on
                        ? <div style={{width:24,height:24,borderRadius:6,background:"var(--safety-green-bg)",color:"var(--safety-green)",display:"inline-grid",placeItems:"center"}}><Icon name="check" size={14}/></div>
                        : <div style={{width:24,height:24,borderRadius:6,background:"var(--surface-2)",color:"var(--ocean-700)",opacity:0.4,display:"inline-grid",placeItems:"center"}}><Icon name="x" size={12}/></div>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function RolePermRow({role,color,perms,count,last}){
  const cls = {ocean:"chip-ocean",teal:"chip-teal",green:"chip-green",amber:"chip-amber"}[color];
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom: last?"none":"1px solid var(--surface-3)"}}>
      <div style={{width:160}}>
        <span className={`chip ${cls}`}>{role.toUpperCase()}</span>
        <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:4}}>{count} {count===1?"member":"members"}</div>
      </div>
      <div className="flex gap-2" style={{flex:1,flexWrap:"wrap"}}>
        {perms.map(p=> <span key={p} className="chip">{p}</span>)}
      </div>
      <button className="btn btn-ghost btn-sm">Edit</button>
    </div>
  );
}

// =============================================================
// PLANNING · Destinations — list of dive sites
// =============================================================
function SettingsDestinations() {
  const dests = [
    { name:"North Wall",        depth:"18–32m", level:"AOWD+", current:"mild", typ:"reef",   trips:42, fav:true },
    { name:"Shark Point",       depth:"12–22m", level:"OWD",   current:"none", typ:"reef",   trips:88, fav:true },
    { name:"Coral Garden",      depth:"6–14m",  level:"OWD",   current:"none", typ:"reef",   trips:124,fav:true },
    { name:"Mandarin Point",    depth:"5–10m",  level:"OWD",   current:"none", typ:"night",  trips:36, fav:false },
    { name:"Pinnacle",          depth:"24–36m", level:"AOWD+", current:"strong",typ:"deep",  trips:28, fav:false },
    { name:"House Reef",        depth:"3–10m",  level:"All",   current:"none", typ:"reef",   trips:202,fav:true },
    { name:"Wreck of the Alma", depth:"22–30m", level:"AOWD+", current:"mild", typ:"wreck",  trips:14, fav:false },
    { name:"Shallow Bay",       depth:"3–6m",   level:"Intro", current:"none", typ:"intro",  trips:96, fav:false },
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="Dive sites" sub="8 sites · 630 trips run YTD"
          action={<><button className="btn btn-secondary btn-sm"><Icon name="filter" size={12}/> Filter</button><button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> Add site</button></>}>
          <div style={{margin:"0 -16px -16px"}}>
            <table className="tbl">
              <thead>
                <tr><th></th><th>Site</th><th>Depth</th><th>Min level</th><th>Current</th><th>Type</th><th style={{textAlign:"right"}}>Trips</th><th></th></tr>
              </thead>
              <tbody>
                {dests.map((d,i)=>(
                  <tr key={i}>
                    <td style={{width:32,textAlign:"center"}}>
                      <Icon name="award" size={14} style={{color: d.fav?"var(--amber-alert)":"var(--surface-3)"}}/>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Icon name="map_pin" size={14} style={{color:"var(--ocean-500)"}}/>
                        <span style={{fontWeight:700,fontFamily:"var(--font-ui)"}}>{d.name}</span>
                      </div>
                    </td>
                    <td className="tabular">{d.depth}</td>
                    <td><span className={`chip ${d.level==="AOWD+"||d.level==="DM+"?"chip-ocean":d.level==="Intro"?"chip-amber":""}`}>{d.level}</span></td>
                    <td>
                      <span className={`chip ${d.current==="strong"?"chip-red":d.current==="mild"?"chip-amber":"chip-green"}`}>
                        {d.current.toUpperCase()}
                      </span>
                    </td>
                    <td><span className="chip chip-teal">{d.typ.toUpperCase()}</span></td>
                    <td className="tabular" style={{textAlign:"right",fontWeight:600}}>{d.trips}</td>
                    <td style={{textAlign:"right"}}><button className="btn btn-ghost btn-sm"><Icon name="edit" size={14}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="Site preview" compact>
          <div style={{aspectRatio:"4/3",borderRadius:10,background:"linear-gradient(135deg, var(--ocean-deep), var(--ocean-deep-light))",position:"relative",overflow:"hidden",marginBottom:12}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 60%, rgba(13,148,136,0.4), transparent 60%)"}}/>
            <div style={{position:"absolute",bottom:12,left:12,right:12,color:"white"}}>
              <div style={{fontSize:10,opacity:0.7,letterSpacing:"0.08em",fontWeight:600}}>SELECTED · NORTH WALL</div>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:18,marginTop:2}}>13.527° N · 120.876° E</div>
            </div>
          </div>
          <SidebarRow label="Depth range" value="18–32m" mono/>
          <SidebarRow label="Min level" value="AOWD+"/>
          <SidebarRow label="Type" value="Reef · Drift"/>
          <SidebarRow label="Boat time" value="22 min" mono/>
          <SidebarRow label="Last visited" value="03 May 2026" last/>
        </SectionCard>

        <SectionCard title="Required gear" compact>
          <div className="flex gap-2" style={{flexWrap:"wrap"}}>
            <span className="chip">BCD</span>
            <span className="chip">REG</span>
            <span className="chip chip-teal">NX32</span>
            <span className="chip">3MM WS</span>
            <span className="chip">12L TANK</span>
            <span className="chip chip-amber">SMB</span>
            <span className="chip chip-amber">DRIFT-LINE</span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// =============================================================
// PLANNING · Boats — fleet management
// =============================================================
function SettingsBoats() {
  const boats = [
    { name:"M/V Discovery",   type:"Liveaboard", cap:18, length:"24m", year:2019, license:"PCG-RE-7821", status:"active",  c:0 },
    { name:"Banca 01",        type:"Day boat",   cap:8,  length:"12m", year:2021, license:"PCG-DB-2104", status:"active",  c:1 },
    { name:"Banca 02",        type:"Day boat",   cap:8,  length:"12m", year:2022, license:"PCG-DB-2202", status:"active",  c:2 },
    { name:"Banca 03",        type:"Day boat",   cap:6,  length:"10m", year:2018, license:"PCG-DB-1809", status:"service", c:3 },
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div className="stat-grid">
        <StatCard label="Boats in fleet" value="4" trend={{dir:"flat",val:"="}} foot="3 active · 1 in service" iconName="boat" iconColor="ocean"/>
        <StatCard label="Daily capacity" value="40" trend={{dir:"up",val:"+8"}} foot="pax across all boats" iconName="users" iconColor="teal"/>
        <StatCard label="Avg utilization" value="78%" trend={{dir:"up",val:"+6%"}} foot="last 30 days" iconName="trending" iconColor="green"/>
        <StatCard label="Service due" value="1" trend={{dir:"flat",val:"="}} foot="Banca 03 · 12 May" iconName="info" iconColor="amber"/>
      </div>

      <SectionCard title="Fleet" sub="Click a boat to edit"
        action={<button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> Add boat</button>}>
        <div style={{margin:"0 -16px -16px"}}>
          <table className="tbl">
            <thead>
              <tr><th>Boat</th><th>Type</th><th style={{textAlign:"right"}}>Capacity</th><th>Length</th><th>License</th><th>Year</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {boats.map((b,i)=>(
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`avatar avatar-sm avatar-c${b.c}`} style={{borderRadius:8}}><Icon name="boat" size={14}/></div>
                      <span style={{fontWeight:700,fontFamily:"var(--font-ui)"}}>{b.name}</span>
                    </div>
                  </td>
                  <td><span className={`chip ${b.type==="Liveaboard"?"chip-ocean":""}`}>{b.type.toUpperCase()}</span></td>
                  <td className="tabular" style={{textAlign:"right",fontWeight:600}}>{b.cap}</td>
                  <td className="tabular">{b.length}</td>
                  <td className="tabular muted">{b.license}</td>
                  <td className="tabular">{b.year}</td>
                  <td>
                    {b.status==="active"
                      ? <span className="chip chip-green"><span className="dot-status" style={{background:"var(--safety-green)"}}></span>ACTIVE</span>
                      : <span className="chip chip-amber">IN SERVICE</span>}
                  </td>
                  <td style={{textAlign:"right"}}><button className="btn btn-ghost btn-sm"><Icon name="edit" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Equipment per boat" sub="Standard kit carried on each vessel">
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {boats.slice(0,2).map(b=>(
            <div key={b.name} style={{padding:14,background:"var(--surface-2)",borderRadius:10}}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="boat" size={14} style={{color:"var(--ocean-500)"}}/>
                <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13}}>{b.name}</span>
              </div>
              <div className="flex gap-2" style={{flexWrap:"wrap"}}>
                <span className="chip">O₂ KIT</span>
                <span className="chip">FIRST AID</span>
                <span className="chip">VHF</span>
                <span className="chip">GPS</span>
                <span className="chip chip-teal">8× TANK</span>
                <span className="chip chip-teal">4× NX32</span>
                <span className="chip">SMB ×4</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// =============================================================
// PLANNING · Planning rules — validation, day-log behavior
// =============================================================
function SettingsPlanningRules() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Day-log validation" sub="When and how trips become permanent records">
        <Row icon="check" title="Auto-validate after grace period" sub="Validate dives automatically if no edit within 48h" action={<Toggle on/>}/>
        <Row icon="shield" title="Require instructor sign-off" sub="Trips with students need an instructor to validate" action={<Toggle on/>}/>
        <Row icon="bell" title="Notify on auto-validation" sub="Email the manager when a day rolls over" action={<Toggle/>}/>
        <Row icon="lock" title="Lock dives after validation" sub="Prevent edits — only managers can re-open" action={<Toggle on/>} last/>
      </SectionCard>

      <SectionCard title="Trip composition rules" sub="Constraints applied when building a trip">
        <Row icon="users" title="Max ratio — divers per guide" sub="OWD: 4·1 · AOWD: 6·1 · DM training: 2·1" action={<button className="btn btn-secondary btn-sm">Edit ratios</button>}/>
        <Row icon="award" title="Block trips above diver level" sub="Prevent booking sites the diver isn't certified for" action={<Toggle on/>}/>
        <Row icon="info" title="Warn on expired certifications" sub="Show warning, don't block" action={<Toggle on/>}/>
        <Row icon="clock" title="Surface interval check" sub="Min 1h between consecutive dives" action={<Toggle on/>} last/>
      </SectionCard>

      <SectionCard title="Day organizer defaults" sub="Pre-fill values when creating a new trip">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Default departure offset" value="60 min before site time"/>
          <Field label="Default trip duration" value="3h 30min"/>
          <Field label="Default gas blend" value="AIR" select/>
          <Field label="Default group size" value="6 divers"/>
        </div>
      </SectionCard>
    </div>
  );
}

// =============================================================
// EQUIPMENT · Definitions — types of equipment we track
// =============================================================
function SettingsEquipmentDefinitions() {
  const types = [
    { name:"BCD",        sizes:["XS","S","M","L","XL"],            track:"per-unit", count:42, c:0 },
    { name:"Regulator",  sizes:["DIN","INT"],                       track:"per-unit", count:38, c:1 },
    { name:"Tank",       sizes:["10L","12L","15L"],                  track:"per-unit", count:96, c:2 },
    { name:"Wetsuit",    sizes:["XS","S","M","L","XL","XXL"],       track:"per-unit", count:64, c:3 },
    { name:"Mask",       sizes:["S","M","L"],                        track:"per-unit", count:28, c:4 },
    { name:"Fins",       sizes:["XS","S","M","L","XL"],              track:"per-unit", count:54, c:5 },
    { name:"Computer",   sizes:["—"],                                track:"per-unit", count:18, c:0 },
    { name:"SMB",        sizes:["—"],                                track:"pool",     count:24, c:1 },
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Equipment types" sub="What categories your inventory uses"
        action={<button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> Add type</button>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {types.map((t,i)=>(
            <div key={i} style={{padding:14,border:"1px solid var(--surface-3)",borderRadius:12,display:"flex",alignItems:"center",gap:12}}>
              <div className={`avatar avatar-sm avatar-c${t.c}`} style={{borderRadius:10,width:40,height:40}}>
                <Icon name="equipment" size={16}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="flex items-center gap-2">
                  <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14}}>{t.name}</span>
                  <span className={`chip ${t.track==="per-unit"?"chip-ocean":"chip-teal"}`}>{t.track.toUpperCase()}</span>
                </div>
                <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>
                  Sizes: {t.sizes.join(" · ")}
                </div>
                <div className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.6,marginTop:2}}>{t.count} units in stock</div>
              </div>
              <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14}/></button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Brands" sub="Which manufacturers you stock"
        action={<button className="btn btn-secondary btn-sm"><Icon name="plus" size={12}/> Add brand</button>}>
        <div className="flex gap-2" style={{flexWrap:"wrap"}}>
          {["Cressi","Mares","Aqualung","Scubapro","Apeks","Suunto","Mares Pure","Tusa","Beuchat","Beauchat-Sport","Dive Rite"].map(b=>(
            <div key={b} style={{padding:"6px 12px",background:"var(--surface-2)",borderRadius:8,display:"inline-flex",alignItems:"center",gap:6}}>
              <span style={{fontFamily:"var(--font-ui)",fontWeight:600,fontSize:12,color:"var(--ocean-900)"}}>{b}</span>
              <button style={{background:"none",border:0,color:"var(--ocean-700)",opacity:0.5,padding:0,cursor:"pointer"}}><Icon name="x" size={12}/></button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Service intervals" sub="When equipment must be serviced">
        <table className="tbl" style={{margin:"0 -16px -16px"}}>
          <thead><tr><th>Type</th><th>Interval</th><th>Reminder lead</th><th>Block when overdue?</th><th></th></tr></thead>
          <tbody>
            {[
              ["Regulator","12 months","30 days","Yes"],
              ["BCD","12 months","30 days","Yes"],
              ["Tank — Hydro","60 months","90 days","Yes"],
              ["Tank — Visual","12 months","14 days","Yes"],
              ["Computer","Battery: as warned","—","No"],
            ].map(([t,iv,lead,block])=>(
              <tr key={t}>
                <td style={{fontWeight:600}}>{t}</td>
                <td className="tabular">{iv}</td>
                <td className="tabular">{lead}</td>
                <td>{block==="Yes"?<span className="chip chip-red">YES</span>:<span className="chip">NO</span>}</td>
                <td style={{textAlign:"right"}}><button className="btn btn-ghost btn-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

// =============================================================
// EQUIPMENT · Matching — auto-assignment rules
// =============================================================
function SettingsEquipmentMatching() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{padding:14,background:"var(--ocean-50)",borderRadius:12,border:"1px solid var(--ocean-100)",display:"flex",gap:10,alignItems:"flex-start"}}>
        <Icon name="info" size={16} style={{color:"var(--ocean-500)",flexShrink:0,marginTop:2}}/>
        <div style={{fontSize:12,color:"var(--ocean-900)"}}>
          <strong>Matching rules</strong> tell the planner how to auto-assign gear when a diver joins a trip. Rules run top-to-bottom; the first matching rule wins. Drag to reorder.
        </div>
      </div>

      <SectionCard title="Active rules" sub="6 rules · evaluated in order"
        action={<button className="btn btn-primary btn-sm"><Icon name="plus" size={12}/> Add rule</button>}>
        <MatchRule i={1} when="Diver has wetsuit size on profile"  then="Use diver's preferred size" prio="HIGH"/>
        <MatchRule i={2} when="Trip site requires NX32"             then="Match NX32-rated tank only" prio="HIGH"/>
        <MatchRule i={3} when="Diver < OWD certified"              then="Pair with instructor's BCD + tank" prio="HIGH"/>
        <MatchRule i={4} when="Water temp < 24°C"                   then="Default 5mm wetsuit" prio="MED"/>
        <MatchRule i={5} when="Tank — same diver, same day, 2nd dive" then="Reuse first-dive tank if &gt; 100bar"  prio="MED"/>
        <MatchRule i={6} when="No match found"                      then="Assign smallest available size" prio="LOW" last/>
      </SectionCard>

      <SectionCard title="Sizing fallbacks" sub="When the diver's size isn't in stock">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Field label="Wetsuit fallback" value="Next size up" select/>
          <Field label="BCD fallback" value="Next size up" select/>
          <Field label="Fin fallback" value="Same size, alternate brand" select/>
        </div>
      </SectionCard>

      <SectionCard title="Conflict resolution" sub="If two divers need the same item">
        <Row icon="users" title="Prioritize by booking date" sub="Earlier booking wins" action={<Toggle on/>}/>
        <Row icon="award" title="Boost certified divers" sub="Lower-cert intro divers get last pick" action={<Toggle/>}/>
        <Row icon="bell" title="Notify on conflicts" sub="Operator gets a heads-up at trip-build time" action={<Toggle on/>} last/>
      </SectionCard>
    </div>
  );
}

function MatchRule({i,when,then,prio,last}){
  const prioCls = {HIGH:"chip-red",MED:"chip-amber",LOW:""}[prio] || "";
  return (
    <div style={{display:"grid",gridTemplateColumns:"24px 24px 1fr auto",alignItems:"center",gap:14,padding:"12px 0",borderBottom:last?"none":"1px solid var(--surface-3)"}}>
      <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:14,color:"var(--ocean-700)",opacity:0.5}} className="tabular">{i}</div>
      <div style={{cursor:"grab",color:"var(--ocean-700)",opacity:0.4}}><Icon name="list" size={14}/></div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span className="chip">WHEN</span>
        <span style={{fontSize:13,color:"var(--ocean-900)"}}>{when}</span>
        <span className="chip chip-ocean">THEN</span>
        <span style={{fontSize:13,color:"var(--ocean-900)",fontWeight:600}} dangerouslySetInnerHTML={{__html: then}}/>
      </div>
      <div className="flex gap-2 items-center">
        <span className={`chip ${prioCls}`}>{prio}</span>
        <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14}/></button>
      </div>
    </div>
  );
}

// =============================================================
// BOOKING · Booking — flow, deposits, cancellation
// =============================================================
function SettingsBooking() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Online booking" sub="What divers see when booking from your portal">
        <Row icon="globe" title="Public booking page" sub="almadiving.divewh.com/book" action={<Toggle on/>}/>
        <Row icon="users" title="Allow unaffiliated bookings" sub="Divers can book without joining the center" action={<Toggle/>}/>
        <Row icon="award" title="Require certification on file" sub="Block booking until cert is uploaded" action={<Toggle on/>}/>
        <Row icon="receipt" title="Show prices online" sub="Hide for B2B-only centers" action={<Toggle on/>} last/>
      </SectionCard>

      <SectionCard title="Deposits" sub="What's required to confirm a booking">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="Default deposit" value="20% of total"/>
          <Field label="Deposit due within" value="24 hours of booking"/>
          <Field label="Group bookings (4+)" value="50% of total"/>
          <Field label="Course bookings" value="Full payment"/>
        </div>
        <Row icon="info" title="Hold spot before deposit" sub="Reserve seat for 24h while diver pays" action={<Toggle on/>} last/>
      </SectionCard>

      <SectionCard title="Cancellation policy" sub="Refund schedule for diver-initiated cancellations">
        <table className="tbl" style={{margin:"0 -16px 0"}}>
          <thead><tr><th>When cancelled</th><th>Refund</th><th>Fee</th><th></th></tr></thead>
          <tbody>
            <tr><td style={{fontWeight:600}}>&gt; 7 days before</td><td className="tabular">100%</td><td className="tabular">—</td><td><span className="chip chip-green">FREE</span></td></tr>
            <tr><td style={{fontWeight:600}}>3–7 days before</td><td className="tabular">75%</td><td className="tabular">25%</td><td><span className="chip chip-amber">PARTIAL</span></td></tr>
            <tr><td style={{fontWeight:600}}>24h–3 days</td><td className="tabular">50%</td><td className="tabular">50%</td><td><span className="chip chip-amber">HALF</span></td></tr>
            <tr><td style={{fontWeight:600}}>&lt; 24 hours</td><td className="tabular">0%</td><td className="tabular">100%</td><td><span className="chip chip-red">NONE</span></td></tr>
            <tr><td style={{fontWeight:600}}>Weather (operator)</td><td className="tabular">100%</td><td className="tabular">—</td><td><span className="chip chip-green">FREE</span></td></tr>
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Confirmation flow" sub="What happens after a diver books">
        <Row icon="mail" title="Send confirmation email" sub="Booking summary + dive briefing PDF" action={<Toggle on/>}/>
        <Row icon="file" title="Attach health declaration" sub="PDF must be returned 24h before" action={<Toggle on/>}/>
        <Row icon="calendar" title="Add to diver's calendar" sub="ICS link in confirmation email" action={<Toggle on/>}/>
        <Row icon="bell" title="Send 24h reminder" sub="SMS + email · check-in details" action={<Toggle on/>} last/>
      </SectionCard>
    </div>
  );
}

// =============================================================
// BOOKING · Notifications — channels & rules
// =============================================================
function SettingsNotifications() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Channels" sub="How AlmaDiving reaches you">
        <Row icon="mail" title="Email · adrien@almadiving.com" sub="Verified" action={<Toggle on/>}/>
        <Row icon="phone" title="SMS · +63 917 555 0142" sub="Verified" action={<Toggle on/>}/>
        <Row icon="message" title="In-app push" sub="Browser & mobile app" action={<Toggle on/>}/>
        <Row icon="bell" title="Slack · #almadiving-ops" sub="Connected via integration" action={<Toggle/>} last/>
      </SectionCard>

      <SectionCard title="Notification rules" sub="Choose what wakes you up">
        <NotifGrid/>
      </SectionCard>

      <SectionCard title="Quiet hours" sub="No notifications during these times (except critical safety alerts)">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="Start" value="22:00"/>
          <Field label="End" value="06:00"/>
          <Field label="Time zone" value="Asia/Manila" select/>
        </div>
        <Row icon="shield" title="Override for critical alerts" sub="Boat overdue, missing diver, equipment failure" action={<Toggle on/>} last/>
      </SectionCard>
    </div>
  );
}

function NotifGrid(){
  const events = [
    { ev:"New booking", e:true, s:false, p:true, sl:false },
    { ev:"Booking modified", e:true, s:false, p:true, sl:false },
    { ev:"Booking cancelled", e:true, s:true, p:true, sl:true },
    { ev:"Member affiliated", e:true, s:false, p:false, sl:false },
    { ev:"Cert verification result", e:true, s:false, p:true, sl:false },
    { ev:"Trip 24h reminder", e:false, s:true, p:true, sl:false },
    { ev:"Boat overdue", e:true, s:true, p:true, sl:true, critical:true },
    { ev:"Equipment service due", e:true, s:false, p:false, sl:true },
    { ev:"Invoice issued/paid", e:true, s:false, p:false, sl:false },
  ];
  return (
    <div style={{margin:"0 -16px -16px"}}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Event</th>
            <th style={{textAlign:"center",width:80}}>Email</th>
            <th style={{textAlign:"center",width:80}}>SMS</th>
            <th style={{textAlign:"center",width:80}}>Push</th>
            <th style={{textAlign:"center",width:80}}>Slack</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev,i)=>(
            <tr key={i}>
              <td>
                <div className="flex items-center gap-2">
                  <span style={{fontWeight:600}}>{ev.ev}</span>
                  {ev.critical && <span className="chip chip-red">CRITICAL</span>}
                </div>
              </td>
              <td style={{textAlign:"center"}}><Toggle on={ev.e}/></td>
              <td style={{textAlign:"center"}}><Toggle on={ev.s}/></td>
              <td style={{textAlign:"center"}}><Toggle on={ev.p}/></td>
              <td style={{textAlign:"center"}}><Toggle on={ev.sl}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================
// FINANCIAL · Settings — currency, tax, payouts, invoicing
// =============================================================
function SettingsFinancial() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="Currency & tax" sub="How prices are computed and displayed">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="Base currency" value="PHP — Philippine peso" select/>
            <Field label="Display secondary currency" value="USD" select/>
            <Field label="Tax mode" value="VAT included in price" select/>
            <Field label="Default VAT rate" value="12%"/>
            <Field label="Tax ID on invoices" value="89412376500024" mono/>
            <Field label="Round prices to" value="₱1"/>
          </div>
        </SectionCard>

        <SectionCard title="Payouts" sub="Where Stripe sends your earnings">
          <Row icon="bank" title="Bank account" sub="BPI · ••••8821 · Adrien Lemardeley" action={<span className="chip chip-green">VERIFIED</span>}/>
          <Row icon="finance" title="Payout schedule" sub="Weekly · every Monday" action={<button className="btn btn-secondary btn-sm">Change</button>}/>
          <Row icon="info" title="Reserve" sub="₱5,000 held for chargebacks (auto-released after 30d)" action={<span className="chip">₱5,000</span>} last/>
        </SectionCard>

        <SectionCard title="Invoice templates" sub="What goes on the invoices you send">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="Invoice prefix" value="INV-{YYYY}-"/>
            <Field label="Numbering starts at" value="0001" mono/>
            <Field label="Payment terms" value="Net 7 days" select/>
            <Field label="Late payment fee" value="2% / month"/>
          </div>
          <Field label="Notes on every invoice" value="Thank you for diving with AlmaDiving. Bank transfers welcome — see footer for details." textarea/>
        </SectionCard>

        <SectionCard title="Pricing rules" sub="Discounts and surcharges that apply automatically">
          <Row icon="users" title="Group discount" sub="4+ divers same booking → -10%" action={<Toggle on/>}/>
          <Row icon="award" title="Member loyalty" sub="50+ trips → -5% on every booking" action={<Toggle on/>}/>
          <Row icon="moon" title="Night dive surcharge" sub="+₱500 per diver" action={<Toggle on/>}/>
          <Row icon="boat" title="Weekend rate" sub="Sat/Sun → +15%" action={<Toggle/>} last/>
        </SectionCard>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="This month" compact>
          <SidebarRow label="Gross revenue" value="₱148,200" mono/>
          <SidebarRow label="Refunds" value="−₱4,800" mono/>
          <SidebarRow label="Tax collected" value="₱15,860" mono/>
          <SidebarRow label="Stripe fees" value="−₱4,128" mono/>
          <SidebarRow label="Net to bank" value="₱123,412" mono highlight last/>
        </SectionCard>

        <SectionCard title="Next payout" compact>
          <div style={{padding:14,background:"linear-gradient(135deg, var(--ocean-deep), var(--ocean-deep-light))",borderRadius:10,color:"white",marginBottom:10}}>
            <div style={{fontSize:11,opacity:0.75,letterSpacing:"0.06em",fontWeight:600}}>SCHEDULED</div>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:24,letterSpacing:"-0.02em",marginTop:4}} className="tabular">₱42,180</div>
            <div style={{fontSize:11,opacity:0.85,marginTop:2}}>Mon 11 May · BPI ••••8821</div>
          </div>
          <button className="btn btn-secondary btn-sm w-full" style={{justifyContent:"center"}}>View all payouts</button>
        </SectionCard>

        <SectionCard title="Connected" compact>
          <SidebarRow label="Stripe" value="Live"/>
          <SidebarRow label="Xero" value="Not connected"/>
          <SidebarRow label="Last sync" value="2 min ago" last/>
        </SectionCard>
      </div>
    </div>
  );
}

// =============================================================
// Shared bits — Section, Field, Row, Sidebar, Toggle
// =============================================================
function SectionCard({title,sub,children,action,danger,compact}){
  return (
    <div className="card" style={{borderColor: danger?"var(--red-critical-bg)":"var(--surface-3)"}}>
      <div className="card-head" style={{padding: compact?"12px 14px":"14px 16px"}}>
        <div>
          <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize: compact?13:14,color: danger?"var(--red-critical)":"var(--ocean-900)",letterSpacing:"-0.005em"}}>{title}</div>
          {sub && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>{sub}</div>}
        </div>
        {action && <div className="flex gap-2">{action}</div>}
      </div>
      <div style={{padding: compact?"6px 14px 12px":"16px"}}>
        {children}
      </div>
    </div>
  );
}

function Field({label,value,help,type="text",mono,disabled,select,textarea}){
  return (
    <div className="field">
      <label>{label}</label>
      {textarea ? (
        <textarea className="input" defaultValue={value} style={{height:"auto",padding:"10px 12px",resize:"vertical",minHeight:64,fontFamily:"var(--font-body)"}}/>
      ) : select ? (
        <div style={{position:"relative"}}>
          <input className="input" defaultValue={value} style={{paddingRight:32}}/>
          <Icon name="chevron_down" size={14} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"var(--ocean-700)",opacity:0.5,pointerEvents:"none"}}/>
        </div>
      ) : (
        <input type={type} className={`input ${mono?"tabular":""}`} defaultValue={value} disabled={disabled}/>
      )}
      {help && <div className="help">{help}</div>}
    </div>
  );
}

function Row({icon,title,sub,action,last}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom: last?"none":"1px solid var(--surface-3)"}}>
      {icon && <div style={{width:32,height:32,borderRadius:8,background:"var(--surface-2)",display:"grid",placeItems:"center",color:"var(--ocean-500)",flexShrink:0}}><Icon name={icon} size={14}/></div>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{title}</div>
        {sub && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function SidebarRow({label,value,mono,highlight,last}){
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:last?"none":"1px solid var(--surface-3)"}}>
      <span style={{fontSize:12,color:"var(--ocean-700)",opacity:0.75}}>{label}</span>
      <span className={mono?"tabular":""} style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,color: highlight?"var(--ocean-500)":"var(--ocean-900)"}}>{value}</span>
    </div>
  );
}

function Toggle({on}){
  const [v, setV] = React.useState(!!on);
  return <div className={`toggle ${v?"on":""}`} onClick={()=>setV(!v)}/>;
}

window.SettingsPage = SettingsPage;
