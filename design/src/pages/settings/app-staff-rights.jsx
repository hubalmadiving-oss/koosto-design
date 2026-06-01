// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsStaffRights = SettingsStaffRights;
