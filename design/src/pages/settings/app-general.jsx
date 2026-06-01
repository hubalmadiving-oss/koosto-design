// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsGeneral = SettingsGeneral;
