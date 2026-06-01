// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsBoats = SettingsBoats;
