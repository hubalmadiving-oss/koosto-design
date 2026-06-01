// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsDestinations = SettingsDestinations;
