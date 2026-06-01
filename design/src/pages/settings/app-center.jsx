// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsCenter = SettingsCenter;
