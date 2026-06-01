// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

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

window.SettingsEquipmentMatching = SettingsEquipmentMatching;
