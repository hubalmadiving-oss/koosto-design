// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsPlanningRules = SettingsPlanningRules;
