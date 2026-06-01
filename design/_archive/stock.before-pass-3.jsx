// =============================================================
// Equipment · Stock (v2.1, 2026-05-27)
//
// Form redesign per Components Review § Dialogs · Form constraint:
//   · One-column layout (no side-by-side fields).
//   · Thematic sections with uppercase eyebrow + 1px hairline.
//   · Conventional micro-order within each section.
//   · "Acquisition · Inventory" vs "Acquisition · Financial" split —
//     the financial block (supplier, unit cost, date) can be hidden
//     via the Tweaks panel (financialFields toggle) to simulate a
//     center without the Finance module.
//
// Purpose:  Quantity & lifecycle management. Anything that changes
//           how much gear we OWN lives here:
//             · Add a new indexed unit (BCD or Dive Computer — two
//               separate primary actions, no type tab).
//             · Assemble a new regulator set from components
//               (1st stage · 2nd Stage Primary · 2nd Stage Octopus ·
//               Gauge — gauge last; octopus carries the yellow OCT
//               convention label).
//             · Restock non-indexed bulk — type, brand, model, size
//               are selects backed by the catalog (Settings · Equipment ·
//               Definitions). Free text never.
//             · Run an inventory count (audit).
//             · Retire a unit (dispose / write-off).
//
// What's NOT here (lives in /equipment/inventory):
//             · Mark broken / lost / maintenance — operational events.
//
// DATA CONTRACT (proposed)
//   READS
//     equipment_items                 — id, type, brand, model, size,
//                                        acquired_at, retired_at, status,
//                                        components[] (regulator_set only)
//     equipment_stock_batches         — type, brand, model, size,
//                                        acquired_at, qty, unit_cost, supplier
//     equipment_components_stock      — type (first_stage|second_stage|gauge),
//                                        brand, model, total, in_sets, in_stock,
//                                        in_service
//     equipment_audits                — id, started_at, completed_at, by_user,
//                                        lines[] { type, brand, model, size,
//                                                  counted, expected, delta }
//     equipment_definitions           — catalog of brand/model/size per type
//   WRITES
//     POST   equipment_items                — add a new indexed unit
//     POST   equipment_items {type:set}     — assemble a regulator set
//     POST   equipment_stock_batches        — restock purchase
//     POST   equipment_audits               — start an inventory count
//     PATCH  equipment_items/:id            — retire
// =============================================================

const { Icon } = window;

const TODAY_ISO = "2026-05-27";

// =============================================================
// CATALOG  (mock — would come from equipment_definitions in prod)
// Each entry: { type, brand, model, sizes: [...] | null }
// `sizes: null` means "no size", e.g. masks, snorkels, dive computers.
// =============================================================
const CATALOG = {
  bcd: [
    { brand:"Aqualung", model:"Wave",    sizes:["XS","S","M","L","XL"] },
    { brand:"Mares",    model:"Rover",   sizes:["S","M","L","XL"] },
    { brand:"Cressi",   model:"Start",   sizes:["XS","S","M","L","XL"] },
    { brand:"Zeepro",   model:"Classic", sizes:["S","M","L"] },
  ],
  dive_computer: [
    { brand:"Suunto", model:"Zoop",    sizes:null },
    { brand:"Suunto", model:"D4i",     sizes:null },
    { brand:"Mares",  model:"Smart",   sizes:null },
  ],
  wetsuit: [
    { brand:"Cressi", model:"3mm Integral", sizes:["XS","S","M","L","XL"] },
    { brand:"Cressi", model:"3mm Shorty",   sizes:["S","M","L","XL"] },
    { brand:"Cressi", model:"5mm Integral", sizes:["XS","S","M","L"] },
    { brand:"Cressi", model:"5mm Shorty",   sizes:["S","M","L","XL"] },
  ],
  fins: [
    { brand:"Cressi", model:"Frog", sizes:["S","M","L","XL"] },
    { brand:"Apeks",  model:"Rk3",  sizes:["S","M","L"] },
  ],
  mask: [
    { brand:"Generic", model:"Black",       sizes:null },
    { brand:"Generic", model:"Snorkeling",  sizes:null },
    { brand:"Cressi",  model:"Big Eyes",    sizes:null },
  ],
  snorkel: [
    { brand:"Generic", model:"Standard",    sizes:null },
  ],
  compass: [
    { brand:"Suunto",  model:"SK-7",        sizes:null },
  ],
  torch: [
    { brand:"Princeton", model:"Genesis",   sizes:null },
  ],
  weights: [
    { brand:"Standard", model:"Lead",       sizes:["1kg","2kg","3kg","4kg","5kg"] },
  ],
};

// Per-type stock summary
const STOCK_BY_TYPE = [
  { id:"bcd",            label:"BCDs",            icon:"equipment", indexed:true,  total:28, retiredYtd:2 },
  { id:"regulator_set",  label:"Regulator Sets",  icon:"tank",      indexed:true,  total:12, retiredYtd:1 },
  { id:"dive_computer",  label:"Dive Computers",  icon:"clock",     indexed:true,  total:4,  retiredYtd:0 },
  { id:"wetsuit",        label:"Wetsuits",        icon:"shirt",     indexed:false, total:31, retiredYtd:3 },
  { id:"fins",           label:"Fins",            icon:"waves",     indexed:false, total:40, retiredYtd:1 },
  { id:"mask",           label:"Masks",           icon:"id",        indexed:false, total:43, retiredYtd:2 },
  { id:"snorkel",        label:"Snorkels",        icon:"waves",     indexed:false, total:40, retiredYtd:0 },
  { id:"compass",        label:"Compasses",       icon:"globe",     indexed:false, total:3,  retiredYtd:0 },
  { id:"torch",          label:"Torches",         icon:"bolt",      indexed:false, total:3,  retiredYtd:0 },
  { id:"weights",        label:"Weights",         icon:"package",   indexed:false, total:145,retiredYtd:0 },
];

// Non-indexed batches — each row is one purchase / arrival
const BATCHES = [
  { type:"wetsuit", brand:"Cressi", model:"3mm Integral", size:"S",  qty:3,  acquired:"2024-03-12", supplier:"Cressi Direct",   unitCost: 89 },
  { type:"wetsuit", brand:"Cressi", model:"3mm Integral", size:"XL", qty:5,  acquired:"2024-03-12", supplier:"Cressi Direct",   unitCost: 89 },
  { type:"wetsuit", brand:"Cressi", model:"3mm Shorty",   size:"M",  qty:4,  acquired:"2025-04-18", supplier:"Cressi Direct",   unitCost: 79 },
  { type:"wetsuit", brand:"Cressi", model:"3mm Shorty",   size:"L",  qty:5,  acquired:"2025-04-18", supplier:"Cressi Direct",   unitCost: 79 },
  { type:"wetsuit", brand:"Cressi", model:"5mm Integral", size:"S",  qty:4,  acquired:"2025-11-02", supplier:"Cressi Direct",   unitCost:119 },
  { type:"wetsuit", brand:"Cressi", model:"5mm Shorty",   size:"M",  qty:10, acquired:"2026-03-08", supplier:"Cressi Direct",   unitCost:109 },
  { type:"fins",    brand:"Cressi", model:"Frog",         size:"S",  qty:8,  acquired:"2024-08-22", supplier:"Cressi Direct",   unitCost: 49 },
  { type:"fins",    brand:"Cressi", model:"Frog",         size:"M",  qty:12, acquired:"2024-08-22", supplier:"Cressi Direct",   unitCost: 49 },
  { type:"fins",    brand:"Apeks",  model:"Rk3",          size:"M",  qty:10, acquired:"2025-09-14", supplier:"Apeks Pro",       unitCost: 89 },
  { type:"fins",    brand:"Apeks",  model:"Rk3",          size:"L",  qty:10, acquired:"2025-09-14", supplier:"Apeks Pro",       unitCost: 89 },
  { type:"mask",    brand:"Generic", model:"Black",       size:"—",  qty:25, acquired:"2024-12-10", supplier:"Local Wholesaler",unitCost: 15 },
  { type:"mask",    brand:"Generic", model:"Snorkeling",  size:"—",  qty:18, acquired:"2025-06-05", supplier:"Local Wholesaler",unitCost: 12 },
  { type:"weights", brand:"Standard", model:"Lead",       size:"2kg",qty:60, acquired:"2024-01-15", supplier:"Marine Supply",   unitCost:  6 },
  { type:"weights", brand:"Standard", model:"Lead",       size:"3kg",qty:50, acquired:"2024-01-15", supplier:"Marine Supply",   unitCost:  8 },
  { type:"weights", brand:"Standard", model:"Lead",       size:"4kg",qty:35, acquired:"2024-01-15", supplier:"Marine Supply",   unitCost: 10 },
];

const INDEXED_UNITS = [
  { id:"BCD-11", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  acquired:"2023-04-12", supplier:"Aqualung Pro", unitCost:320 },
  { id:"BCD-12", type:"bcd", brand:"Mares",    model:"Rover",   size:"L",  acquired:"2023-04-12", supplier:"Mares Direct", unitCost:280 },
  { id:"BCD-20", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  acquired:"2023-04-12", supplier:"Aqualung Pro", unitCost:320, retired:false, status:"broken" },
  { id:"BCD-26", type:"bcd", brand:"Cressi",   model:"Start",   size:"XS", acquired:"2026-02-18", supplier:"Cressi Direct",unitCost:240 },
  { id:"CPU-01", type:"dive_computer", brand:"Suunto", model:"Zoop", size:"—", acquired:"2024-05-10", supplier:"Suunto Pro", unitCost:230 },
  { id:"CPU-03", type:"dive_computer", brand:"Suunto", model:"Zoop", size:"—", acquired:"2024-05-10", supplier:"Suunto Pro", unitCost:230, status:"lost" },
  { id:"SET-001", type:"regulator_set", acquired:"2024-06-01", components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic"} } },
  { id:"SET-008", type:"regulator_set", acquired:"2024-06-01", status:"maintenance", components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12",issue:"In service"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic"} } },
];

const COMPONENT_STOCK = [
  { type:"first_stage",  brand:"Aqualung", model:"Titan",  total:14, inSets:12, inStock:1, inService:1 },
  { type:"first_stage",  brand:"Scubapro", model:"Mk17",   total:2,  inSets:0,  inStock:2, inService:0 },
  { type:"second_stage", brand:"Scubapro", model:"R195",   total:18, inSets:12, inStock:5, inService:1 },
  { type:"second_stage", brand:"Scubapro", model:"R095",   total:14, inSets:12, inStock:2, inService:0 },
  { type:"second_stage", brand:"Aqualung", model:"Calypso",total:4,  inSets:0,  inStock:4, inService:0 },
  { type:"gauge",        brand:"Noname",   model:"Basic",  total:14, inSets:12, inStock:2, inService:0 },
];

const LAST_AUDIT = { date:"2026-04-12", by:"Adrien L.", linesChecked:18, deltas:2 };

// =============================================================
// HELPERS
// =============================================================
function daysAgo(iso){
  if (!iso) return null;
  return Math.round((new Date(TODAY_ISO) - new Date(iso))/86400000);
}
function ageBadge(iso){
  const d = daysAgo(iso);
  if (d == null) return null;
  if (d < 90)  return { cls:"chip chip-green", text:"NEW" };
  if (d < 365) return { cls:"chip", text:`${Math.round(d/30)}mo` };
  if (d < 730) return { cls:"chip chip-amber", text:`${Math.round(d/365*10)/10}y` };
  return { cls:"chip chip-red", text:`${Math.round(d/365)}y · aging` };
}

// =============================================================
// MODAL SHELL
// =============================================================
function ModalShell({title, sub, tone="ocean", icon, onClose, footer, children, width=560}){
  const tones = {
    ocean: {bg:"var(--ocean-100)", fg:"var(--ocean-500)"},
    amber: {bg:"var(--amber-alert-bg)", fg:"var(--amber-alert)"},
    red:   {bg:"var(--red-critical-bg)", fg:"var(--red-critical)"},
    green: {bg:"var(--safety-green-bg)", fg:"var(--safety-green)"},
    teal:  {bg:"var(--accent-teal-bg)", fg:"var(--accent-teal)"},
  }[tone];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,37,64,0.45)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",zIndex:1000}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width,maxWidth:"calc(100% - 32px)",maxHeight:"calc(100vh - 64px)",display:"flex",flexDirection:"column",background:"var(--surface-1)",borderRadius:14,boxShadow:"0 24px 60px rgba(10,37,64,0.30)",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--surface-3)",display:"flex",alignItems:"center",gap:11,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:8,background:tones.bg,color:tones.fg,display:"grid",placeItems:"center"}}><Icon name={icon} size={15}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:15,color:"var(--ocean-900)"}}>{title}</div>
            {sub && <div style={{fontSize:12,color:"var(--ocean-700)",opacity:0.8,marginTop:1}}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{background:"none",border:0,padding:4,color:"var(--ocean-700)",opacity:0.55,cursor:"pointer"}}><Icon name="x" size={14}/></button>
        </div>
        <div style={{padding:"18px 22px 22px",overflowY:"auto",flex:1,minHeight:0}}>{children}</div>
        <div style={{padding:"12px 20px",borderTop:"1px solid var(--surface-3)",display:"flex",justifyContent:"flex-end",gap:8,background:"var(--surface-0)",flexShrink:0}}>{footer}</div>
      </div>
    </div>
  );
}

// =============================================================
// FORM PRIMITIVES — match the rules in Components Review § Dialogs
//   · SectionHead : uppercase eyebrow
//   · Divider     : 1px hairline between sections
//   · Field       : one-per-row label + control
// =============================================================
function SectionHead({label, accent}){
  return (
    <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color: accent || "var(--ocean-700)",opacity:0.78,marginBottom:10}}>{label}</div>
  );
}
function Divider(){
  return <div style={{height:1,background:"var(--surface-3)",margin:"18px 0"}}/>;
}
function Field({label, optional, help, children}){
  return (
    <div className="field" style={{marginBottom:12}}>
      <label style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",fontSize:11.5,color:"var(--ocean-700)",fontWeight:500,marginBottom:4}}>
        <span>{label}</span>
        {optional && <span style={{opacity:0.55,fontWeight:400,fontSize:11}}>(optional)</span>}
      </label>
      {children}
      {help && <div className="help" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65,marginTop:4}}>{help}</div>}
    </div>
  );
}

// Acquisition · Financial subsection (controlled by tweak.financialFields).
// When the tweak is OFF, the entire section disappears — simulating a center
// without the Finance module.
function AcquisitionFinancial({visible, supplier, setSupplier, unitCost, setUnitCost, acquired, setAcquired, currency="€"}){
  if (!visible) return null;
  return (
    <>
      <Divider/>
      <SectionHead label="Acquisition · Financial"/>
      <div style={{padding:"10px 12px",background:"var(--accent-teal-bg)",border:"1px solid rgba(13,148,136,0.18)",borderRadius:9,marginBottom:12,display:"flex",gap:8,alignItems:"center",fontSize:11.5,color:"var(--ocean-700)",lineHeight:1.4}}>
        <Icon name="finance" size={13} style={{color:"var(--accent-teal)",flexShrink:0}}/>
        <span>This block syncs with the <strong style={{color:"var(--ocean-900)"}}>Finance</strong> module. Toggle off in Tweaks to preview the form without it.</span>
      </div>
      <Field label="Supplier">
        <input className="input" placeholder="e.g. Cressi Direct" value={supplier} onChange={e=>setSupplier(e.target.value)}/>
      </Field>
      <Field label={`Unit cost (${currency})`}>
        <input className="input" type="number" placeholder="0" value={unitCost} onChange={e=>setUnitCost(e.target.value)}/>
      </Field>
      <Field label="Acquired on">
        <input className="input" type="date" value={acquired} onChange={e=>setAcquired(e.target.value)}/>
      </Field>
    </>
  );
}

// =============================================================
// QUICK ACTIONS  — Add BCD + Add Computer split (no tab switch)
// =============================================================
function QuickActions({onAddBCD, onAddComputer, onAssemble, onRestock, onCount}){
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:10,marginBottom:18}}>
      <QABtn label="Add BCD"             sub="Indexed unit · gets a code"            icon="equipment" tone="ocean" onClick={onAddBCD}/>
      <QABtn label="Add Dive Computer"   sub="Indexed unit · no size"                icon="clock"     tone="ocean" onClick={onAddComputer}/>
      <QABtn label="Assemble reg set"    sub="Pick components, get a set"            icon="tank"     tone="ocean" onClick={onAssemble} primary/>
      <QABtn label="Restock"             sub="Add a batch of non-indexed"            icon="package"  tone="ocean" onClick={onRestock}/>
      <QABtn label="Run inventory count" sub={`Last: ${LAST_AUDIT.date} · ${LAST_AUDIT.deltas} deltas`} icon="check" tone="green" onClick={onCount}/>
    </div>
  );
}
function QABtn({label, sub, icon, tone, onClick, primary}){
  const tones = {
    ocean: {bg:"var(--ocean-100)", fg:"var(--ocean-500)"},
    green: {bg:"var(--safety-green-bg)", fg:"var(--safety-green)"},
  }[tone];
  return (
    <button onClick={onClick}
      style={{textAlign:"left",padding:"14px 16px",borderRadius:12,border:`1px solid ${primary?"var(--ocean-500)":"var(--surface-3)"}`,background:primary?"linear-gradient(135deg, var(--ocean-deep), var(--ocean-deep-light))":"var(--surface-1)",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"transform 120ms, box-shadow 120ms"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(10,37,64,0.08)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
      <div style={{width:36,height:36,borderRadius:10,background:primary?"rgba(255,255,255,0.18)":tones.bg,color:primary?"white":tones.fg,display:"grid",placeItems:"center",flexShrink:0}}>
        <Icon name={icon} size={16}/>
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13.5,color:primary?"white":"var(--ocean-900)"}}>{label}</div>
        <div style={{fontSize:11.5,color:primary?"rgba(255,255,255,0.78)":"var(--ocean-700)",opacity:primary?1:0.75,marginTop:1}}>{sub}</div>
      </div>
    </button>
  );
}

// =============================================================
// STOCK ALERTS
// =============================================================
function StockAlerts(){
  return (
    <div style={{background:"var(--surface-1)",border:"1px solid var(--surface-3)",borderRadius:12,padding:"14px 16px",marginBottom:18,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>
      <AlertCell tone="amber" icon="alert_triangle" title="Low stock — 2 SKUs"
        sub="Cressi Frog S · Wetsuit 3mm Integral S — fewer than 5 on shelf."/>
      <AlertCell tone="ocean" icon="trending" title="Aging stock — 3 SKUs"
        sub="Wetsuit 3mm Integral S/XL bought 2024-03-12. FIFO: rotate to next-out."/>
      <AlertCell tone="green" icon="check" title={`Last audit · ${LAST_AUDIT.date}`}
        sub={`${LAST_AUDIT.linesChecked} lines checked · ${LAST_AUDIT.deltas} variances by ${LAST_AUDIT.by}.`}/>
    </div>
  );
}
function AlertCell({tone, icon, title, sub}){
  const tones = {
    amber: {bg:"var(--amber-alert-bg)", fg:"var(--amber-alert)"},
    ocean: {bg:"var(--ocean-100)", fg:"var(--ocean-500)"},
    green: {bg:"var(--safety-green-bg)", fg:"var(--safety-green)"},
  }[tone];
  return (
    <div style={{display:"flex",gap:11}}>
      <div style={{width:28,height:28,borderRadius:8,background:tones.bg,color:tones.fg,display:"grid",placeItems:"center",flexShrink:0}}><Icon name={icon} size={14}/></div>
      <div style={{minWidth:0}}>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12.5,color:"var(--ocean-900)"}}>{title}</div>
        <div style={{fontSize:11.5,color:"var(--ocean-700)",opacity:0.8,marginTop:2,lineHeight:1.4}}>{sub}</div>
      </div>
    </div>
  );
}

// =============================================================
// INDEXED STOCK TABLE  (unchanged)
// =============================================================
function IndexedStockSection({type, units, onRetire}){
  const [open, setOpen] = React.useState(true);
  const isSet = type.id === "regulator_set";
  return (
    <section style={{background:"var(--surface-1)",border:"1px solid var(--surface-3)",borderRadius:12,marginBottom:12,overflow:"hidden"}}>
      <header style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom: open?"1px solid var(--surface-3)":"none",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <Icon name={open?"chevron_down":"chevron_right"} size={14} style={{color:"var(--ocean-700)",opacity:0.6}}/>
        <Icon name={type.icon} size={16} style={{color:"var(--ocean-500)"}}/>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--ocean-900)"}}>{type.label}</div>
        <span className="chip" style={{fontSize:10,padding:"2px 7px"}}><span className="tabular">{type.total}</span> units</span>
        {type.retiredYtd > 0 && <span className="chip chip-amber" style={{fontSize:10,padding:"2px 7px"}}><span className="tabular">{type.retiredYtd}</span> retired YTD</span>}
        <div style={{flex:1}}/>
        <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.6}}>Sorted by age</span>
      </header>

      {open && (
        <div>
          <div style={{display:"grid",gridTemplateColumns: isSet?"90px minmax(0,1.6fr) 110px 110px 90px 100px 40px":"90px minmax(0,1fr) 70px 110px 110px 80px 90px 40px",alignItems:"center",gap:12,padding:"8px 16px",background:"var(--surface-2)",borderBottom:"1px solid var(--surface-3)",fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.85}}>
            <span>Code</span>
            <span>{isSet?"Components":"Brand / Model"}</span>
            {!isSet && <span>Size</span>}
            <span>Acquired</span>
            <span>Supplier</span>
            <span>Age</span>
            {!isSet && <span>Unit cost</span>}
            <span/>
          </div>
          {units.map((u,i)=>{
            const age = ageBadge(u.acquired);
            return (
              <div key={u.id} style={{display:"grid",gridTemplateColumns: isSet?"90px minmax(0,1.6fr) 110px 110px 90px 100px 40px":"90px minmax(0,1fr) 70px 110px 110px 80px 90px 40px",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:i===units.length-1?"none":"1px solid var(--surface-3)"}}>
                <div className="tabular" style={{fontFamily:"var(--font-ui)",fontSize:12.5,fontWeight:700,color:"var(--ocean-500)"}}>{u.id}</div>
                {isSet ? (
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {["stage1","stagePr","stageOc","gauge"].map(k=>(
                      <span key={k} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 7px",borderRadius:5,background:"var(--surface-2)",fontSize:11,color:"var(--ocean-900)",whiteSpace:"nowrap"}}>
                        <span style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:8.5,letterSpacing:"0.06em",opacity:0.65}}>{ {stage1:"1ST",stagePr:"PRI",stageOc:"OCT",gauge:"GAU"}[k] }</span>
                        <span style={{fontWeight:600}}>{u.components[k].brand}</span>
                        <span style={{opacity:0.7}}>{u.components[k].model}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{fontSize:13,color:"var(--ocean-900)"}}><span style={{fontWeight:600}}>{u.brand}</span> {u.model}</div>
                )}
                {!isSet && <div style={{fontSize:12,color:"var(--ocean-700)"}}>{u.size||"—"}</div>}
                <div className="tabular" style={{fontSize:12,color:"var(--ocean-700)"}}>{u.acquired}</div>
                <div style={{fontSize:11.5,color:"var(--ocean-700)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.supplier}</div>
                <div>{age && <span className={age.cls}>{age.text}</span>}</div>
                {!isSet && <div className="tabular" style={{fontSize:12,color:"var(--ocean-700)"}}>€{u.unitCost}</div>}
                <button onClick={()=>onRetire(u)} title="Retire / dispose"
                  style={{width:28,height:28,borderRadius:8,border:"1px solid transparent",background:"transparent",color:"var(--ocean-700)",display:"grid",placeItems:"center",cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="var(--red-critical-bg)";e.currentTarget.style.color="var(--red-critical)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--ocean-700)"}}>
                  <Icon name="trash" size={13}/>
                </button>
              </div>
            );
          })}
          <div style={{padding:"10px 16px",background:"var(--surface-0)",fontSize:11.5,color:"var(--ocean-700)",opacity:0.75,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Showing {units.length} of {type.total} units (truncated for mockup).</span>
            <button className="btn btn-ghost btn-sm">View all <Icon name="chevron_right" size={12}/></button>
          </div>
        </div>
      )}
    </section>
  );
}

// =============================================================
// NON-INDEXED STOCK TABLE  (unchanged)
// =============================================================
function NonIndexedStockSection({type, batches, onRestock, onAdjust}){
  const [open, setOpen] = React.useState(true);
  const groups = {};
  batches.forEach(b=>{
    const k = `${b.brand}__${b.model}__${b.size}`;
    if (!groups[k]) groups[k] = { brand:b.brand, model:b.model, size:b.size, batches:[] };
    groups[k].batches.push(b);
  });
  Object.values(groups).forEach(g => g.batches.sort((a,b)=> a.acquired < b.acquired ? -1 : 1));

  return (
    <section style={{background:"var(--surface-1)",border:"1px solid var(--surface-3)",borderRadius:12,marginBottom:12,overflow:"hidden"}}>
      <header style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom: open?"1px solid var(--surface-3)":"none",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <Icon name={open?"chevron_down":"chevron_right"} size={14} style={{color:"var(--ocean-700)",opacity:0.6}}/>
        <Icon name={type.icon} size={16} style={{color:"var(--ocean-500)"}}/>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--ocean-900)"}}>{type.label}</div>
        <span className="chip" style={{fontSize:10,padding:"2px 7px"}}><span className="tabular">{type.total}</span> units</span>
        <div style={{flex:1}}/>
        <button className="btn btn-secondary btn-sm" onClick={e=>{e.stopPropagation();onRestock(type);}}>
          <Icon name="plus" size={12}/> Restock
        </button>
      </header>

      {open && Object.values(groups).map((g,gi)=>(
        <div key={gi} style={{padding:"12px 16px",borderBottom: gi===Object.keys(groups).length-1?"none":"1px solid var(--surface-3)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{fontSize:13,color:"var(--ocean-900)"}}><span style={{fontWeight:600}}>{g.brand}</span> {g.model}</div>
            <span className="chip" style={{fontSize:10,padding:"2px 7px"}}>SIZE {g.size}</span>
            <span style={{fontSize:11.5,color:"var(--ocean-700)",opacity:0.7}} className="tabular">{g.batches.reduce((a,b)=>a+b.qty,0)} units across {g.batches.length} batch{g.batches.length>1?"es":""}</span>
            <div style={{flex:1}}/>
            <button onClick={()=>onAdjust(g)} className="btn btn-ghost btn-sm">
              <Icon name="edit" size={11}/> Adjust
            </button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {g.batches.map((b,bi)=>{
              const age = ageBadge(b.acquired);
              const isFifoNext = bi === 0 && g.batches.length > 1;
              return (
                <div key={bi}
                  style={{padding:"7px 10px",borderRadius:8,background: isFifoNext ? "var(--ocean-50)":"var(--surface-2)",border: isFifoNext ? "1px solid var(--ocean-100)" : "1px solid transparent",display:"inline-flex",alignItems:"baseline",gap:8}}>
                  {isFifoNext && (
                    <span style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:8.5,letterSpacing:"0.08em",color:"var(--ocean-500)",background:"var(--ocean-100)",padding:"1px 5px",borderRadius:3}}>FIFO · NEXT OUT</span>
                  )}
                  <span className="tabular" style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:14,color:"var(--ocean-900)"}}>{b.qty}×</span>
                  <span className="tabular" style={{fontSize:11.5,color:"var(--ocean-700)"}}>{b.acquired}</span>
                  {age && <span className={age.cls} style={{fontSize:9.5,padding:"1px 5px"}}>{age.text}</span>}
                  <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65}}>· {b.supplier}</span>
                  <span className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65}}>· €{b.unitCost}/u</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

// =============================================================
// COMPONENT STOCK SECTION  (unchanged)
// =============================================================
function ComponentStockSection({onAssemble}){
  const [open, setOpen] = React.useState(true);
  const grouped = COMPONENT_STOCK.reduce((acc, c)=>{
    (acc[c.type] = acc[c.type] || []).push(c);
    return acc;
  }, {});
  const labels = { first_stage:"1st Stages", second_stage:"2nd Stages", gauge:"Gauges" };
  return (
    <section style={{background:"var(--surface-1)",border:"1px solid var(--surface-3)",borderRadius:12,marginBottom:12,overflow:"hidden"}}>
      <header style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom: open?"1px solid var(--surface-3)":"none",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <Icon name={open?"chevron_down":"chevron_right"} size={14} style={{color:"var(--ocean-700)",opacity:0.6}}/>
        <Icon name="layers" size={16} style={{color:"var(--accent-teal)"}}/>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--ocean-900)"}}>Regulator Components</div>
        <span className="chip chip-teal" style={{fontSize:10,padding:"2px 7px"}}>STOCK · NOT INDEXED</span>
        <div style={{flex:1}}/>
        <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();onAssemble();}}>
          <Icon name="tank" size={12}/> Assemble a set
        </button>
      </header>

      {open && (
        <div style={{padding:"4px 16px 12px"}}>
          <div style={{fontSize:12,color:"var(--ocean-700)",marginBottom:10,padding:"8px 0",borderBottom:"1px dashed var(--surface-3)"}}>
            Components are not given a code — they're tracked per brand/model. Assembling a set consumes 1× 1st stage + 2× 2nd stage + 1× gauge from this pool.
          </div>
          {["first_stage","second_stage","gauge"].map(t=>(
            <div key={t} style={{marginTop:14}}>
              <div style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.75,marginBottom:6}}>{labels[t]}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:8}}>
                {(grouped[t]||[]).map((c,i)=>(
                  <div key={i} style={{padding:"10px 12px",background:"var(--surface-0)",border:"1px solid var(--surface-3)",borderRadius:9}}>
                    <div style={{fontSize:13,color:"var(--ocean-900)",marginBottom:6}}><span style={{fontWeight:600}}>{c.brand}</span> {c.model}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,fontSize:10.5}}>
                      <ComponentStat label="Total" value={c.total}/>
                      <ComponentStat label="In sets" value={c.inSets}/>
                      <ComponentStat label="In stock" value={c.inStock} accent={c.inStock>0?"ocean":null}/>
                      <ComponentStat label="Service" value={c.inService} accent={c.inService>0?"amber":null}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
function ComponentStat({label, value, accent}){
  const color = accent==="ocean" ? "var(--ocean-500)" : accent==="amber" ? "var(--amber-alert)" : "var(--ocean-900)";
  return (
    <div>
      <div style={{fontFamily:"var(--font-ui)",fontSize:8.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.6}}>{label}</div>
      <div className="tabular" style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color,marginTop:1}}>{value}</div>
    </div>
  );
}

// =============================================================
// ASSEMBLE REGULATOR SET MODAL — keeps 4 inner cards, reordered:
//   1st stage  →  2nd primary  →  2nd octopus (yellow label)  →  Gauge
// More space, hierarchy via uppercase eyebrow + larger card padding.
// =============================================================
function AssembleRegSetModal({onClose, tweaks}){
  const [qty, setQty] = React.useState(1);
  const [stage1, setStage1]   = React.useState("");
  const [stagePr, setStagePr] = React.useState("");
  const [stageOc, setStageOc] = React.useState("");
  const [gauge, setGauge]     = React.useState("");

  const opts = (kind)=> COMPONENT_STOCK.filter(c => c.type === kind && c.inStock > 0)
    .map(c => ({ value:`${c.brand}|${c.model}`, label:`${c.brand} ${c.model}`, stock:c.inStock }));

  const enough = (kind)=>{
    const sel = ({first_stage:stage1, second_stage_pr:stagePr, second_stage_oc:stageOc, gauge}[kind] || "");
    if (!sel) return null;
    const [brand, model] = sel.split("|");
    const realKind = kind === "second_stage_pr" || kind === "second_stage_oc" ? "second_stage" : kind;
    const c = COMPONENT_STOCK.find(x => x.type===realKind && x.brand===brand && x.model===model);
    return c ? c.inStock : 0;
  };

  const allChosen = stage1 && stagePr && stageOc && gauge;

  // accent: "primary" → ocean · "octopus" → amber/yellow · "neutral" → ocean
  const Card = ({slot, label, kind, value, onChange, accent})=>{
    const list = opts(kind === "second_stage_pr" || kind === "second_stage_oc" ? "second_stage" : kind);
    const eyebrow = {
      ocean:  {bg:"var(--ocean-100)",  fg:"var(--ocean-500)",  text:"COMPONENT"},
      octopus:{bg:"var(--amber-alert-bg)", fg:"var(--amber-alert)", text:"OCTOPUS"},
    }[accent];
    return (
      <div style={{padding:"16px 18px",background:"var(--surface-0)",border:`1px solid ${value?"var(--ocean-500)":"var(--surface-3)"}`,borderRadius:12,display:"flex",flexDirection:"column",gap:10,minHeight:152}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:9,letterSpacing:"0.08em",color:eyebrow.fg,background:eyebrow.bg,padding:"3px 7px",borderRadius:3}}>{eyebrow.text}</span>
          <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)",letterSpacing:"-0.005em"}}>{label}</div>
          <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:9.5,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.55,marginLeft:"auto"}}>{slot}</span>
          {value && <Icon name="check" size={14} style={{color:"var(--safety-green)"}}/>}
        </div>
        <select className="input" value={value} onChange={e=>onChange(e.target.value)} style={{height:38,fontSize:13}}>
          <option value="">Select a {kind === "gauge" ? "gauge" : "model"}…</option>
          {list.map(o=> <option key={o.value} value={o.value}>{o.label}  ·  {o.stock} in stock</option>)}
        </select>
        {value ? (
          <div style={{fontSize:11.5,color:"var(--ocean-700)",opacity:0.75,display:"flex",justifyContent:"space-between"}}>
            <span><span className="tabular">{enough(kind)}</span> in stock</span>
            <span className="tabular">Will consume {qty} unit{qty>1?"s":""}</span>
          </div>
        ) : (
          <div style={{fontSize:11.5,color:"var(--ocean-700)",opacity:0.5}}>{list.length} model{list.length!==1?"s":""} available in stock</div>
        )}
      </div>
    );
  };

  return (
    <ModalShell title="Assemble a regulator set"
      sub="Pick one component for each slot. Set code is auto-assigned. Service dates inherit from each component."
      icon="tank" tone="ocean" onClose={onClose} width={780}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!allChosen} onClick={onClose}>
          <Icon name="check" size={13}/> Assemble {qty>1?`${qty} sets`:"set"} (SET-014{qty>1?` … SET-${13+qty}`:""})
        </button>
      </>}>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <SectionHead label="Components"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Card slot="Slot 1" label="1st Stage"           kind="first_stage"     value={stage1}  onChange={setStage1}  accent="ocean"/>
          <Card slot="Slot 2" label="2nd Stage · Primary" kind="second_stage_pr" value={stagePr} onChange={setStagePr} accent="ocean"/>
          <Card slot="Slot 3" label="2nd Stage · Octopus" kind="second_stage_oc" value={stageOc} onChange={setStageOc} accent="octopus"/>
          <Card slot="Slot 4" label="Gauge"               kind="gauge"           value={gauge}   onChange={setGauge}   accent="ocean"/>
        </div>

        {allChosen && (
          <div style={{padding:"14px 16px",background:"var(--ocean-50)",border:"1px solid var(--ocean-100)",borderRadius:10}}>
            <div style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-500)",marginBottom:8}}>Preview</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {[
                {k:"1ST", v:stage1,  accent:"ocean"},
                {k:"PRI", v:stagePr, accent:"ocean"},
                {k:"OCT", v:stageOc, accent:"octopus"},
                {k:"GAU", v:gauge,   accent:"ocean"},
              ].map(p=>{
                const [brand, model] = p.v.split("|");
                const kindColor = p.accent==="octopus"?"var(--amber-alert)":"var(--ocean-700)";
                return (
                  <span key={p.k} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:6,background:"white",border:"1px solid var(--ocean-100)",fontSize:12,color:"var(--ocean-900)",whiteSpace:"nowrap"}}>
                    <span style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:9,letterSpacing:"0.06em",color:kindColor,opacity:0.85}}>{p.k}</span>
                    <span style={{fontWeight:600}}>{brand}</span>
                    <span style={{opacity:0.7}}>{model}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Divider/>
        <SectionHead label="Quantity"/>
        <Field label="How many identical sets to build" help="Each gets a sequential code (SET-014, SET-015…). If any component pool runs out, the operation is aborted.">
          <input className="input" type="number" min="1" max="20" value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)))} style={{height:38}}/>
        </Field>
      </div>
    </ModalShell>
  );
}

// =============================================================
// ADD INDEXED UNIT MODAL — typed (no type tab)
//   AddBCDModal      → kind="bcd",            requires size
//   AddComputerModal → kind="dive_computer",  no size
// Both wrap the same internal AddUnitForm.
// =============================================================
function AddBCDModal({onClose, tweaks}){
  return <AddUnitForm kind="bcd" label="BCD" icon="equipment" onClose={onClose} tweaks={tweaks}/>;
}
function AddComputerModal({onClose, tweaks}){
  return <AddUnitForm kind="dive_computer" label="Dive Computer" icon="clock" onClose={onClose} tweaks={tweaks}/>;
}
function AddUnitForm({kind, label, icon, onClose, tweaks}){
  const cat = CATALOG[kind] || [];
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [size, setSize] = React.useState("");
  const [qty, setQty] = React.useState(1);
  const [acquired, setAcquired] = React.useState(TODAY_ISO);
  const [supplier, setSupplier] = React.useState("");
  const [unitCost, setUnitCost] = React.useState("");
  const showFinancial = tweaks?.financialFields !== false;

  // Brand → models from catalog; Model → sizes
  const brands = [...new Set(cat.map(c=>c.brand))];
  const modelsForBrand = brand ? cat.filter(c=>c.brand===brand) : [];
  const selectedModel = modelsForBrand.find(c=>c.model===model);
  const sizes = selectedModel?.sizes || null;

  return (
    <ModalShell title={`Add a new ${label}`}
      sub="Single units that get a unique code. Brand and model come from the catalog."
      icon={icon} tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!brand||!model||qty<1||(sizes&&!size)} onClick={onClose}>
          <Icon name="check" size={13}/> Add {qty} unit{qty>1?"s":""}
        </button>
      </>}>
      <div>
        <SectionHead label={`${label} catalog`}/>
        <Field label="Brand" help={brands.length === 0 ? "No catalog entries — add brands in Settings · Equipment · Definitions." : undefined}>
          <select className="input" value={brand} onChange={e=>{setBrand(e.target.value); setModel(""); setSize("");}} style={{height:36}}>
            <option value="">Select a brand…</option>
            {brands.map(b=> <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Model">
          <select className="input" value={model} onChange={e=>{setModel(e.target.value); setSize("");}} disabled={!brand} style={{height:36}}>
            <option value="">{brand ? "Select a model…" : "Pick a brand first"}</option>
            {modelsForBrand.map(m=> <option key={m.model} value={m.model}>{m.model}</option>)}
          </select>
        </Field>
        {sizes && (
          <Field label="Size">
            <select className="input" value={size} onChange={e=>setSize(e.target.value)} style={{height:36}}>
              <option value="">Select a size…</option>
              {sizes.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        )}

        <Divider/>
        <SectionHead label="Acquisition · Inventory"/>
        <Field label="Quantity" help="Codes are assigned automatically (e.g. BCD-29, CPU-05). Multiple units are grouped as one batch.">
          <input className="input" type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} style={{height:36}}/>
        </Field>

        <AcquisitionFinancial visible={showFinancial}
          supplier={supplier} setSupplier={setSupplier}
          unitCost={unitCost} setUnitCost={setUnitCost}
          acquired={acquired} setAcquired={setAcquired}/>
      </div>
    </ModalShell>
  );
}

// =============================================================
// RESTOCK MODAL — catalog-backed selects, situational size, one-col.
// =============================================================
function RestockModal({preselect, onClose, tweaks}){
  const nonIndexed = STOCK_BY_TYPE.filter(t => !t.indexed);
  const [type, setType] = React.useState(preselect?.id || nonIndexed[0]?.id);
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [size, setSize] = React.useState("");
  const [qty, setQty] = React.useState(5);
  const [acquired, setAcquired] = React.useState(TODAY_ISO);
  const [supplier, setSupplier] = React.useState("");
  const [unitCost, setUnitCost] = React.useState("");
  const showFinancial = tweaks?.financialFields !== false;

  // Catalog-driven cascading selects
  const cat = CATALOG[type] || [];
  const brands = [...new Set(cat.map(c=>c.brand))];
  const modelsForBrand = brand ? cat.filter(c=>c.brand===brand) : [];
  const selectedModel = modelsForBrand.find(c=>c.model===model);
  const sizes = selectedModel?.sizes || null; // null → no size needed

  React.useEffect(()=>{ setBrand(""); setModel(""); setSize(""); }, [type]);
  React.useEffect(()=>{ setModel(""); setSize(""); }, [brand]);
  React.useEffect(()=>{ setSize(""); }, [model]);

  return (
    <ModalShell title="Restock — add a batch"
      sub="Pick a SKU from the catalog. Free entry isn't allowed here — add new SKUs in Settings · Equipment · Definitions first."
      icon="package" tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!brand||!model||qty<1||(sizes&&!size)} onClick={onClose}>
          <Icon name="check" size={13}/> Add {qty} units
        </button>
      </>}>
      <div>
        <SectionHead label="Catalog SKU"/>
        <Field label="Type">
          <select className="input" value={type} onChange={e=>setType(e.target.value)} style={{height:36}}>
            {nonIndexed.map(t=> <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="Brand">
          <select className="input" value={brand} onChange={e=>setBrand(e.target.value)} style={{height:36}}>
            <option value="">Select a brand…</option>
            {brands.map(b=> <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Model">
          <select className="input" value={model} onChange={e=>setModel(e.target.value)} disabled={!brand} style={{height:36}}>
            <option value="">{brand ? "Select a model…" : "Pick a brand first"}</option>
            {modelsForBrand.map(m=> <option key={m.model} value={m.model}>{m.model}</option>)}
          </select>
        </Field>
        {sizes ? (
          <Field label="Size">
            <select className="input" value={size} onChange={e=>setSize(e.target.value)} style={{height:36}}>
              <option value="">Select a size…</option>
              {sizes.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        ) : (model && (
          <div style={{padding:"8px 12px",background:"var(--surface-2)",borderRadius:8,fontSize:12,color:"var(--ocean-700)",marginBottom:12}}>
            <Icon name="info" size={12} style={{verticalAlign:"middle",marginRight:6,opacity:0.6}}/>
            <strong style={{color:"var(--ocean-900)"}}>{model}</strong> doesn't carry a size — proceed without one.
          </div>
        ))}

        <Divider/>
        <SectionHead label="Acquisition · Inventory"/>
        <Field label="Quantity" help="This creates a new batch — units in this batch sit alongside any existing batches of the same SKU. FIFO rotation will still pick the oldest batch first.">
          <input className="input" type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} style={{height:36}}/>
        </Field>

        <AcquisitionFinancial visible={showFinancial}
          supplier={supplier} setSupplier={setSupplier}
          unitCost={unitCost} setUnitCost={setUnitCost}
          acquired={acquired} setAcquired={setAcquired}/>
      </div>
    </ModalShell>
  );
}

// =============================================================
// INVENTORY COUNT MODAL
// =============================================================
function InventoryCountModal({onClose}){
  return (
    <ModalShell title="Run an inventory count"
      sub="A point-in-time audit. Counts what's physically on the shelf, flags variances against the system count."
      icon="check" tone="green" onClose={onClose} width={620}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={onClose}><Icon name="check" size={13}/> Start count</button>
      </>}>
      <div>
        <SectionHead label="Last audit"/>
        <div style={{display:"flex",gap:12,marginBottom:8}}>
          <Stat label="Date"            value={LAST_AUDIT.date}        sub={`by ${LAST_AUDIT.by}`}/>
          <Stat label="Lines audited"   value={LAST_AUDIT.linesChecked} sub="all SKUs"/>
          <Stat label="Variances found" value={LAST_AUDIT.deltas}      sub="2 broken units written off"/>
        </div>

        <Divider/>
        <SectionHead label="Scope"/>
        <Field label="What to count">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              {id:"all",  label:"All equipment",  sub:"Full count, ~20 min"},
              {id:"type", label:"Single type",    sub:"BCDs / Wetsuits / …"},
              {id:"flag", label:"Flagged only",   sub:"Re-verify broken/lost units"},
            ].map(o=>(
              <button key={o.id} type="button"
                style={{padding:"9px 11px",borderRadius:9,border:`1px solid ${o.id==="all"?"var(--ocean-500)":"var(--surface-3)"}`,background:o.id==="all"?"var(--ocean-50)":"var(--surface-1)",cursor:"pointer",textAlign:"left"}}>
                <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12.5,color:"var(--ocean-900)"}}>{o.label}</div>
                <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:1}}>{o.sub}</div>
              </button>
            ))}
          </div>
        </Field>
        <div style={{background:"var(--ocean-50)",borderRadius:9,padding:"10px 12px",display:"flex",gap:8,fontSize:12,color:"var(--ocean-700)",lineHeight:1.5}}>
          <Icon name="info" size={13} style={{color:"var(--ocean-500)",flexShrink:0,marginTop:1}}/>
          <span>The count UI walks you through every SKU with mobile-friendly input. Variances are written to the audit log; you can resolve them (loss / restock-correction) at the end.</span>
        </div>
      </div>
    </ModalShell>
  );
}
function Stat({label, value, sub}){
  return (
    <div style={{flex:1,padding:"10px 12px",background:"var(--surface-2)",borderRadius:9}}>
      <div style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7}}>{label}</div>
      <div className="tabular" style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:16,color:"var(--ocean-900)",marginTop:3}}>{value}</div>
      <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:1}}>{sub}</div>
    </div>
  );
}

// =============================================================
// RETIRE MODAL
// =============================================================
function RetireModal({unit, onClose}){
  const [reason, setReason] = React.useState("");
  return (
    <ModalShell title={`Retire ${unit.id}`} sub={`${unit.type === "regulator_set" ? unit.id : `${unit.brand} ${unit.model}${unit.size?" · "+unit.size:""}`} · acquired ${unit.acquired}`}
      icon="trash" tone="red" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger-solid" disabled={!reason.trim()} onClick={onClose}>
          <Icon name="check" size={13}/> Retire
        </button>
      </>}>
      <div>
        <SectionHead label="Reason"/>
        <Field label="Why is this unit being retired?" help="Reason appears in lifecycle reports (EOL analytics).">
          <textarea className="input" rows="3" style={{height:"auto",padding:"10px 12px",resize:"vertical"}} placeholder="e.g. EOL, beyond repair, donated" value={reason} onChange={e=>setReason(e.target.value)} autoFocus/>
        </Field>
        {unit.type === "regulator_set" && (
          <div style={{background:"var(--amber-alert-bg)",borderRadius:9,padding:"10px 12px",display:"flex",gap:8,fontSize:12,color:"#6e3e02",lineHeight:1.5,marginBottom:10}}>
            <Icon name="info" size={13} style={{color:"var(--amber-alert)",flexShrink:0,marginTop:1}}/>
            <span>Retiring a regulator set returns its 4 components to the component stock pool — unless they're also retired (toggle below in v2).</span>
          </div>
        )}
        <div style={{background:"var(--red-critical-bg)",borderRadius:9,padding:"10px 12px",display:"flex",gap:8,fontSize:12,color:"var(--red-critical)",lineHeight:1.5}}>
          <Icon name="alert_triangle" size={13} style={{flexShrink:0,marginTop:1}}/>
          <span>Retirement is permanent — the unit is removed from inventory and counted under "Retired YTD" in lifecycle stats.</span>
        </div>
      </div>
    </ModalShell>
  );
}

// =============================================================
// MAIN
// =============================================================
function StockPage({tweaks}){
  const [modal, setModal] = React.useState(null);
  const close = () => setModal(null);

  return (
    <div data-screen-label="Equipment · Stock">
      <div className="page-head">
        <div>
          <h1 className="page-title">Stock</h1>
          <div className="page-sub">Quantity, lifecycle, purchases. Operational events live in <span style={{color:"var(--ocean-500)",fontWeight:600}}>Inventory</span>.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-secondary"><Icon name="file" size={14}/> Audit log</button>
        </div>
      </div>

      <QuickActions
        onAddBCD={()=>setModal({kind:"add-bcd"})}
        onAddComputer={()=>setModal({kind:"add-computer"})}
        onAssemble={()=>setModal({kind:"assemble"})}
        onRestock={()=>setModal({kind:"restock"})}
        onCount={()=>setModal({kind:"count"})}/>

      <StockAlerts/>

      {STOCK_BY_TYPE.filter(t=>t.indexed).map(t=>{
        const units = INDEXED_UNITS.filter(u=>u.type===t.id);
        return <IndexedStockSection key={t.id} type={t} units={units} onRetire={u=>setModal({kind:"retire",payload:u})}/>;
      })}

      <ComponentStockSection onAssemble={()=>setModal({kind:"assemble"})}/>

      {STOCK_BY_TYPE.filter(t=>!t.indexed).map(t=>{
        const batches = BATCHES.filter(b=>b.type===t.id);
        if (batches.length === 0) return null;
        return <NonIndexedStockSection key={t.id} type={t} batches={batches}
          onRestock={preselect=>setModal({kind:"restock",payload:preselect})}
          onAdjust={()=>{}}/>;
      })}

      {modal?.kind === "add-bcd"      && <AddBCDModal           tweaks={tweaks} onClose={close}/>}
      {modal?.kind === "add-computer" && <AddComputerModal      tweaks={tweaks} onClose={close}/>}
      {modal?.kind === "assemble"     && <AssembleRegSetModal   tweaks={tweaks} onClose={close}/>}
      {modal?.kind === "restock"      && <RestockModal          tweaks={tweaks} preselect={modal.payload} onClose={close}/>}
      {modal?.kind === "count"        && <InventoryCountModal   onClose={close}/>}
      {modal?.kind === "retire"       && <RetireModal           unit={modal.payload} onClose={close}/>}
    </div>
  );
}

window.StockPage = StockPage;
