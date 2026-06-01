// =============================================================
// Equipment · Inventory (v2.0, 2026-05-21)
//
// Purpose:  Operational state of every piece of gear, RIGHT NOW.
//           Lend, return, flag broken/lost/maintenance, swap reg-set
//           components — that's it. Quantity/restock/purchase live
//           in /equipment/stock.
//
// Two kinds of equipment, two row shapes:
//   · INDEXED   — BCD, Regulator Set, Dive Computer.
//                 Each unit has a code, brand/model, size, status.
//   · NON-INDEXED — Wetsuit, Fins, Mask, Snorkel, Compass, Torch,
//                 Weights. One row per brand/model/size, aggregated
//                 counts only (available / lent / maintenance / broken / lost).
//
// Regulator Set composition (key insight):
//   A Set is one indexed item assembled from four components:
//     1st Stage · 2nd Stage Primary · 2nd Stage Octopus · Gauge
//   Each component has its OWN service date. When a component fails
//   the operator swaps just that part (real-life dive-shop behavior).
//   The Set's status is the worst of its components.
//
// DATA CONTRACT (proposed, to be confirmed against repo schema)
//   READS
//     equipment_items       — id, code, type, brand, model, size, status,
//                             current_holder, last_action_at, components[]
//                             (components only for type='regulator_set')
//     equipment_stock       — type, brand, model, size, aggregated counts
//                             { total, available, lent, maintenance, broken, lost }
//     equipment_definitions — service rules per type/brand (from Settings)
//   WRITES
//     PATCH equipment_items/:id            { status, reason, holder, ... }
//     PATCH equipment_items/:id/components — swap one component of a Set
//     POST  equipment_stock/decrement      { type, model, size, reason, qty }
//     POST  equipment_stock/restore        { type, model, size, reason, qty }
//   DERIVED
//     condition_summary = group(equipment_items + equipment_stock) by type
//                         → { total, on_shelf, lent, maintenance, broken, lost }
//     issues_count      = SUM(maintenance + broken + lost + service_overdue)
// =============================================================

const { Icon } = window;

// =============================================================
// MOCK DATA
// Real production data plugs in here. Field names match the
// proposed schema in the contract above.
// =============================================================

const TODAY_ISO = "2026-05-21";
// ─── Indexed items ─────────────────────────────────────────────
const ITEMS = [
  // BCDs
  { id:"BCD-11", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  status:"available" },
  { id:"BCD-12", type:"bcd", brand:"Mares",    model:"Rover",   size:"L",  status:"lent",        holder:{name:"Hugo Leclercq", since:"2026-05-19"} },
  { id:"BCD-13", type:"bcd", brand:"Mares",    model:"Rover",   size:"L",  status:"available" },
  { id:"BCD-14", type:"bcd", brand:"Mares",    model:"Rover",   size:"L",  status:"available" },
  { id:"BCD-15", type:"bcd", brand:"Mares",    model:"Rover",   size:"XL", status:"maintenance", reason:"Inflator valve sticking", since:"2026-05-18" },
  { id:"BCD-16", type:"bcd", brand:"Mares",    model:"Rover",   size:"XL", status:"available" },
  { id:"BCD-17", type:"bcd", brand:"Mares",    model:"Rover",   size:"XL", status:"available" },
  { id:"BCD-18", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  status:"available" },
  { id:"BCD-19", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  status:"available" },
  { id:"BCD-20", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  status:"broken",      reason:"Bladder leak, beyond service",   since:"2026-05-15" },
  { id:"BCD-21", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  status:"available" },
  { id:"BCD-22", type:"bcd", brand:"Aqualung", model:"Wave",    size:"L",  status:"available" },
  { id:"BCD-23", type:"bcd", brand:"Zeepro",   model:"Classic", size:"M",  status:"available" },
  { id:"BCD-24", type:"bcd", brand:"Zeepro",   model:"Classic", size:"M",  status:"lent",        holder:{name:"DiveTribe Marseille", external:true, since:"2026-05-14"} },
  { id:"BCD-25", type:"bcd", brand:"Zeepro",   model:"Classic", size:"M",  status:"available" },
  { id:"BCD-26", type:"bcd", brand:"Cressi",   model:"Start",   size:"XS", status:"available" },
  { id:"BCD-27", type:"bcd", brand:"Cressi",   model:"Start",   size:"S",  status:"available" },
  { id:"BCD-28", type:"bcd", brand:"Cressi",   model:"Start",   size:"S",  status:"available" },

  // Regulator Sets — composed of 4 components
  { id:"SET-001", type:"regulator_set", status:"available",
    components:{
      stage1:  { brand:"Aqualung", model:"Titan",   serviceDue:"2026-09-12" },
      stagePr: { brand:"Scubapro", model:"R195",    serviceDue:"2026-09-12" },
      stageOc: { brand:"Scubapro", model:"R095",    serviceDue:"2026-09-12" },
      gauge:   { brand:"Noname",   model:"Basic",   serviceDue:null },
    } },
  { id:"SET-002", type:"regulator_set", status:"available",
    components:{
      stage1:  { brand:"Aqualung", model:"Titan",   serviceDue:"2026-09-12" },
      stagePr: { brand:"Scubapro", model:"R195",    serviceDue:"2026-09-12" },
      stageOc: { brand:"Scubapro", model:"R095",    serviceDue:"2026-09-12" },
      gauge:   { brand:"Noname",   model:"Basic",   serviceDue:null },
    } },
  { id:"SET-003", type:"regulator_set", status:"service_due",
    components:{
      stage1:  { brand:"Aqualung", model:"Titan",   serviceDue:"2026-06-04" },  // 14 days
      stagePr: { brand:"Scubapro", model:"R195",    serviceDue:"2026-09-12" },
      stageOc: { brand:"Scubapro", model:"R095",    serviceDue:"2026-09-12" },
      gauge:   { brand:"Noname",   model:"Basic",   serviceDue:null },
    } },
  { id:"SET-004", type:"regulator_set", status:"available",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}} },
  { id:"SET-005", type:"regulator_set", status:"available",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}} },
  { id:"SET-007", type:"regulator_set", status:"available",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}} },
  { id:"SET-008", type:"regulator_set", status:"maintenance",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12",issue:"Free-flow at depth, in service"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}},
    reason:"2nd-stage primary in service", since:"2026-05-17" },
  { id:"SET-009", type:"regulator_set", status:"available",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}} },
  { id:"SET-010", type:"regulator_set", status:"lent",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}},
    holder:{name:"General loan", external:true, since:"2026-05-19"} },
  { id:"SET-011", type:"regulator_set", status:"available",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}} },
  { id:"SET-012", type:"regulator_set", status:"lent",
    components:{
      stage1:{brand:"Aqualung",model:"Titan",serviceDue:"2026-09-12"},
      stagePr:{brand:"Scubapro",model:"R195",serviceDue:"2026-09-12"},
      stageOc:{brand:"Scubapro",model:"R095",serviceDue:"2026-09-12"},
      gauge:{brand:"Noname",model:"Basic",serviceDue:null}},
    holder:{name:"General loan", external:true, since:"2026-05-20"} },

  // Dive Computers
  { id:"CPU-01", type:"dive_computer", brand:"Suunto", model:"Zoop", size:"—", status:"available" },
  { id:"CPU-02", type:"dive_computer", brand:"Suunto", model:"Zoop", size:"—", status:"available" },
  { id:"CPU-03", type:"dive_computer", brand:"Suunto", model:"Zoop", size:"—", status:"lost",  reason:"Lost on Verde Island trip", since:"2026-04-28", customer:"Marie Lefevre" },
  { id:"CPU-04", type:"dive_computer", brand:"Suunto", model:"Zoop", size:"—", status:"available" },
];

// ─── Non-indexed stock (aggregated counts per brand/model/size) ──
const STOCK = [
  // type, brand, model, size, total, lent, maintenance, broken, lost
  // (available is derived: total - lent - maintenance - broken - lost)
  { type:"wetsuit", brand:"Cressi", model:"3mm Integral", size:"S",  total:3,  lent:3, maintenance:0, broken:0, lost:0 },
  { type:"wetsuit", brand:"Cressi", model:"3mm Integral", size:"XL", total:5,  lent:0, maintenance:0, broken:0, lost:0 },
  { type:"wetsuit", brand:"Cressi", model:"3mm Shorty",   size:"M",  total:4,  lent:3, maintenance:0, broken:0, lost:0 },
  { type:"wetsuit", brand:"Cressi", model:"3mm Shorty",   size:"L",  total:5,  lent:0, maintenance:0, broken:0, lost:0 },
  { type:"wetsuit", brand:"Cressi", model:"5mm Integral", size:"S",  total:4,  lent:0, maintenance:0, broken:0, lost:0 },
  { type:"wetsuit", brand:"Cressi", model:"5mm Shorty",   size:"M",  total:10, lent:1, maintenance:0, broken:0, lost:0 },

  { type:"fins",    brand:"Cressi", model:"Frog",   size:"S",  total:8,  lent:1, maintenance:0, broken:0, lost:0 },
  { type:"fins",    brand:"Cressi", model:"Frog",   size:"M",  total:12, lent:2, maintenance:1, broken:0, lost:0 },
  { type:"fins",    brand:"Apeks",  model:"Rk3",    size:"M",  total:10, lent:0, maintenance:0, broken:0, lost:0 },
  { type:"fins",    brand:"Apeks",  model:"Rk3",    size:"L",  total:10, lent:0, maintenance:0, broken:0, lost:0 },

  { type:"mask",    brand:"Generic", model:"Black",       size:"—", total:25, lent:0, maintenance:0, broken:2, lost:0 },
  { type:"mask",    brand:"Generic", model:"Snorkeling",  size:"—", total:18, lent:0, maintenance:0, broken:0, lost:0 },

  { type:"snorkel", brand:"Generic", model:"Standard",    size:"—", total:40, lent:0, maintenance:0, broken:0, lost:0 },

  { type:"compass", brand:"Suunto",  model:"SK-7",        size:"—", total:3,  lent:0, maintenance:0, broken:0, lost:0 },
  { type:"torch",   brand:"Princeton", model:"Genesis",   size:"—", total:3,  lent:0, maintenance:0, broken:0, lost:0 },

  // Weights — sum totals are by kg, kept simple here
  { type:"weights", brand:"Standard", model:"Lead",       size:"2kg", total:60, lent:0, maintenance:0, broken:0, lost:0 },
  { type:"weights", brand:"Standard", model:"Lead",       size:"3kg", total:50, lent:0, maintenance:0, broken:0, lost:0 },
  { type:"weights", brand:"Standard", model:"Lead",       size:"4kg", total:35, lent:0, maintenance:0, broken:0, lost:0 },
];

// ─── Type catalog ──────────────────────────────────────────────
const TYPES = [
  { id:"bcd",            label:"BCD",             icon:"equipment", indexed:true  },
  { id:"regulator_set",  label:"Regulator Sets",  icon:"tank",      indexed:true  },
  { id:"dive_computer",  label:"Dive Computers",  icon:"clock",     indexed:true  },
  { id:"wetsuit",        label:"Wetsuits",        icon:"shirt",     indexed:false },
  { id:"fins",           label:"Fins",            icon:"waves",     indexed:false },
  { id:"mask",           label:"Masks",           icon:"id",        indexed:false },
  { id:"snorkel",        label:"Snorkels",        icon:"waves",     indexed:false },
  { id:"compass",        label:"Compasses",       icon:"globe",     indexed:false },
  { id:"torch",          label:"Torches",         icon:"bolt",      indexed:false },
  { id:"weights",        label:"Weights",         icon:"package",   indexed:false },
];

// =============================================================
// PER-TYPE CONDITION SUMMARY  (kept here so it's the same math
// used by ConditionStrip and section headers)
// =============================================================
function summarize(typeId){
  const indexedItems = ITEMS.filter(i => i.type===typeId);
  const stockRows    = STOCK.filter(s => s.type===typeId);
  const sum = { total:0, available:0, lent:0, maintenance:0, broken:0, lost:0, serviceDue:0 };
  if (indexedItems.length) {
    indexedItems.forEach(it=>{
      sum.total++;
      if (it.status === "available")    sum.available++;
      else if (it.status === "lent")    sum.lent++;
      else if (it.status === "maintenance") sum.maintenance++;
      else if (it.status === "broken")  sum.broken++;
      else if (it.status === "lost")    sum.lost++;
      else if (it.status === "service_due") { sum.available++; sum.serviceDue++; }
    });
  } else {
    stockRows.forEach(s=>{
      sum.total += s.total;
      sum.lent  += s.lent;
      sum.maintenance += s.maintenance;
      sum.broken += s.broken;
      sum.lost   += s.lost;
      sum.available += (s.total - s.lent - s.maintenance - s.broken - s.lost);
    });
  }
  sum.onShelf = sum.available;
  sum.outOfService = sum.maintenance + sum.broken + sum.lost;
  sum.issues = sum.maintenance + sum.broken + sum.lost + sum.serviceDue;
  return sum;
}

// =============================================================
// STATUS HELPERS — visual vocabulary, used everywhere
// =============================================================
const STATUS_TONE = {
  available:   { tone:"green", label:"Available",          shortLabel:"Available" },
  lent:        { tone:"ocean", label:"Lent out",           shortLabel:"Lent" },
  maintenance: { tone:"amber", label:"In maintenance",     shortLabel:"Maintenance" },
  broken:      { tone:"red",   label:"Broken",             shortLabel:"Broken" },
  lost:        { tone:"red",   label:"Lost",               shortLabel:"Lost" },
  service_due: { tone:"amber", label:"Service due soon",   shortLabel:"Service due" },
};

function StatusPip({status}){
  const colors = { available:"var(--safety-green)", lent:"var(--ocean-500)", maintenance:"var(--amber-alert)", broken:"var(--red-critical)", lost:"var(--red-critical)", service_due:"var(--amber-alert)" };
  return <span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:colors[status]||"var(--surface-3)",flexShrink:0}}/>;
}

function StatusChip({status, compact}){
  const meta = STATUS_TONE[status];
  if (!meta) return null;
  const cls = { green:"chip-green", ocean:"chip-ocean", amber:"chip-amber", red:"chip-red" }[meta.tone];
  return <span className={`chip ${cls}`}>{compact ? meta.shortLabel : meta.label}</span>;
}

function daysUntil(iso){
  if (!iso) return Infinity;
  const d = new Date(iso) - new Date(TODAY_ISO);
  return Math.round(d / 86400000);
}

// =============================================================
// ACTION MENU — the ⋯ dropdown that replaces the icon row
// =============================================================
function ActionMenu({item, onAction}){
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(()=>{
    if (!open) return;
    const close = (e)=>{ if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return ()=> document.removeEventListener("mousedown", close);
  }, [open]);

  // Build action list contextually
  const actions = [];
  if (item.status === "available" || item.status === "service_due") {
    actions.push({id:"lend",        label:"Lend out…",            icon:"arrow_up_right"});
  }
  if (item.status === "lent") {
    actions.push({id:"return",      label:"Mark returned",        icon:"check"});
  }
  actions.push({id:"maintenance", label:"Send to maintenance…",   icon:"settings"});
  if (item.type === "regulator_set") {
    actions.push({id:"swap",        label:"Swap component…",      icon:"refresh"});
  }
  actions.push({id:"broken",      label:"Mark broken…",           icon:"alert_triangle"});
  actions.push({id:"lost",        label:"Mark lost…",             icon:"alert_circle"});
  actions.push({id:"_sep"});
  actions.push({id:"history",     label:"View history",           icon:"file"});
  actions.push({id:"edit",        label:"Edit details",           icon:"edit"});
  actions.push({id:"_sep"});
  actions.push({id:"retire",      label:"Retire from inventory…", icon:"trash", destructive:true});

  return (
    <div ref={ref} style={{position:"relative"}}>
      <button
        onClick={()=>setOpen(o=>!o)}
        title="Actions"
        style={{width:28,height:28,borderRadius:8,border:"1px solid transparent",background:open?"var(--surface-2)":"transparent",color:"var(--ocean-700)",display:"grid",placeItems:"center",cursor:"pointer"}}>
        <Icon name="list" size={14}/>
      </button>
      {open && (
        <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,zIndex:20,minWidth:220,background:"white",border:"1px solid var(--surface-3)",borderRadius:10,boxShadow:"0 12px 28px rgba(10,37,64,0.14)",padding:6,overflow:"hidden"}}>
          {actions.map((a,i)=> a.id==="_sep" ? (
            <div key={i} style={{height:1,background:"var(--surface-3)",margin:"4px 6px"}}/>
          ) : (
            <button key={a.id}
              onClick={()=>{ setOpen(false); onAction(a.id, item); }}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"7px 9px",borderRadius:7,border:0,background:"transparent",color: a.destructive?"var(--red-critical)":"var(--ocean-900)",fontFamily:"var(--font-body)",fontSize:13,cursor:"pointer",textAlign:"left"}}
              onMouseEnter={e=>e.currentTarget.style.background = a.destructive ? "var(--red-critical-bg)" : "var(--surface-2)"}
              onMouseLeave={e=>e.currentTarget.style.background = "transparent"}>
              <Icon name={a.icon} size={14} style={{opacity:0.75,flexShrink:0}}/>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================
// CONDITION STRIP — top filter row
// =============================================================
function ConditionStrip({activeFilter, onFilter}){
  const totals = TYPES.reduce((acc, t)=>{
    const s = summarize(t.id);
    acc.total       += s.total;
    acc.available   += s.available;
    acc.lent        += s.lent;
    acc.maintenance += s.maintenance;
    acc.broken      += s.broken;
    acc.lost        += s.lost;
    return acc;
  }, { total:0, available:0, lent:0, maintenance:0, broken:0, lost:0 });

  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(154px, 1fr))",gap:10,marginBottom:18}}>
      {/* All-types overview card */}
      <button
        onClick={()=>onFilter(null)}
        style={{textAlign:"left",padding:"12px 14px",borderRadius:12,border:`1px solid ${activeFilter===null?"var(--ocean-500)":"var(--surface-3)"}`,background:activeFilter===null?"var(--ocean-50)":"var(--surface-1)",cursor:"pointer",transition:"all 120ms"}}>
        <div style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.75,marginBottom:6}}>All gear</div>
        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
          <span className="tabular" style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:22,color:"var(--ocean-900)",letterSpacing:"-0.02em"}}>{totals.available}</span>
          <span className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.6}}>/ {totals.total}</span>
        </div>
        <div style={{height:4,background:"var(--surface-2)",borderRadius:2,marginTop:8,overflow:"hidden"}}>
          <div style={{height:"100%",width: totals.total ? `${(totals.available/totals.total)*100}%` : 0, background:"var(--safety-green)"}}/>
        </div>
        <div style={{fontSize:10.5,color:"var(--ocean-700)",opacity:0.7,marginTop:6,display:"flex",gap:6}}>
          <span><span className="tabular" style={{fontWeight:700,color:"var(--ocean-500)"}}>{totals.lent}</span> lent</span>
          {(totals.maintenance + totals.broken + totals.lost) > 0 && (
            <span style={{color:"var(--amber-alert)"}}><span className="tabular" style={{fontWeight:700}}>{totals.maintenance + totals.broken + totals.lost}</span> issues</span>
          )}
        </div>
      </button>

      {TYPES.map(t=>{
        const s = summarize(t.id);
        if (s.total === 0) return null;
        const active = activeFilter === t.id;
        const pct = s.total ? (s.available/s.total)*100 : 0;
        const issues = s.maintenance + s.broken + s.lost;
        return (
          <button
            key={t.id}
            onClick={()=>onFilter(active ? null : t.id)}
            style={{textAlign:"left",padding:"12px 14px",borderRadius:12,border:`1px solid ${active?"var(--ocean-500)":"var(--surface-3)"}`,background:active?"var(--ocean-50)":"var(--surface-1)",cursor:"pointer",transition:"all 120ms",position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.75}}>{t.label}</div>
              <Icon name={t.icon} size={12} style={{opacity:0.45,color:"var(--ocean-700)"}}/>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
              <span className="tabular" style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:22,color:"var(--ocean-900)",letterSpacing:"-0.02em"}}>{s.available}</span>
              <span className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.6}}>/ {s.total}</span>
            </div>
            <div style={{height:4,background:"var(--surface-2)",borderRadius:2,marginTop:8,overflow:"hidden",display:"flex"}}>
              <div style={{width:`${pct}%`,background:"var(--safety-green)"}}/>
              {s.lent>0 && <div style={{width:`${(s.lent/s.total)*100}%`,background:"var(--ocean-400)"}}/>}
              {issues>0 && <div style={{width:`${(issues/s.total)*100}%`,background:"var(--amber-alert)"}}/>}
            </div>
            <div style={{fontSize:10.5,marginTop:6,display:"flex",gap:6,flexWrap:"wrap",minHeight:14}}>
              {s.lent>0 && <span style={{color:"var(--ocean-500)"}}><span className="tabular" style={{fontWeight:700}}>{s.lent}</span> lent</span>}
              {s.maintenance>0 && <span style={{color:"var(--amber-alert)"}}><span className="tabular" style={{fontWeight:700}}>{s.maintenance}</span> serv.</span>}
              {s.broken>0 && <span style={{color:"var(--red-critical)"}}><span className="tabular" style={{fontWeight:700}}>{s.broken}</span> brk.</span>}
              {s.lost>0 && <span style={{color:"var(--red-critical)"}}><span className="tabular" style={{fontWeight:700}}>{s.lost}</span> lost</span>}
              {s.serviceDue>0 && <span style={{color:"var(--amber-alert)"}}><span className="tabular" style={{fontWeight:700}}>{s.serviceDue}</span> due soon</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// =============================================================
// ISSUES CALLOUT — only renders when there are issues
// =============================================================
function IssuesCallout({onJump}){
  // Aggregate all items / stock rows in trouble
  const items = ITEMS.filter(i => ["maintenance","broken","lost","service_due"].includes(i.status));
  const stockIssues = STOCK.flatMap(s => {
    const out = [];
    if (s.maintenance>0) out.push({...s, kind:"maintenance", count:s.maintenance});
    if (s.broken>0)      out.push({...s, kind:"broken", count:s.broken});
    if (s.lost>0)        out.push({...s, kind:"lost", count:s.lost});
    return out;
  });
  const total = items.length + stockIssues.reduce((a,b)=>a+b.count,0);
  if (total === 0) return null;

  const breakdown = {
    service_due:  items.filter(i=>i.status==="service_due").length,
    maintenance:  items.filter(i=>i.status==="maintenance").length + stockIssues.filter(s=>s.kind==="maintenance").reduce((a,b)=>a+b.count,0),
    broken:       items.filter(i=>i.status==="broken").length      + stockIssues.filter(s=>s.kind==="broken").reduce((a,b)=>a+b.count,0),
    lost:         items.filter(i=>i.status==="lost").length        + stockIssues.filter(s=>s.kind==="lost").reduce((a,b)=>a+b.count,0),
  };

  return (
    <div style={{background:"var(--amber-alert-bg)",border:"1px solid rgba(217,119,6,0.25)",borderRadius:12,padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:34,height:34,borderRadius:9,background:"var(--amber-alert)",color:"white",display:"grid",placeItems:"center",flexShrink:0}}>
        <Icon name="alert_triangle" size={16}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13.5,color:"var(--ocean-900)"}}>
          <span className="tabular">{total}</span> item{total!==1?"s":""} need{total===1?"s":""} attention
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:12,color:"var(--ocean-700)",marginTop:3}}>
          {breakdown.service_due>0 && <span><span className="tabular" style={{fontWeight:700,color:"var(--amber-alert)"}}>{breakdown.service_due}</span> service due soon</span>}
          {breakdown.maintenance>0 && <span><span className="tabular" style={{fontWeight:700,color:"var(--amber-alert)"}}>{breakdown.maintenance}</span> in maintenance</span>}
          {breakdown.broken>0 && <span><span className="tabular" style={{fontWeight:700,color:"var(--red-critical)"}}>{breakdown.broken}</span> broken</span>}
          {breakdown.lost>0 && <span><span className="tabular" style={{fontWeight:700,color:"var(--red-critical)"}}>{breakdown.lost}</span> lost</span>}
        </div>
      </div>
      <button onClick={onJump}
        style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",height:34,borderRadius:9,background:"white",border:"1px solid var(--amber-alert)",color:"var(--amber-alert)",fontFamily:"var(--font-body)",fontWeight:600,fontSize:12.5,cursor:"pointer"}}>
        View all
      </button>
    </div>
  );
}

// =============================================================
// INDEXED ROW
// =============================================================
function IndexedRow({item, onAction, last}){
  const isSet = item.type === "regulator_set";
  const sd = isSet ? Math.min(
    daysUntil(item.components.stage1.serviceDue),
    daysUntil(item.components.stagePr.serviceDue),
    daysUntil(item.components.stageOc.serviceDue)
  ) : Infinity;
  const showServiceFlag = isSet && sd >= 0 && sd <= 30;

  // Brand / model display
  const brandModelCell = isSet
    ? (
      <div style={{display:"flex",flexWrap:"wrap",gap:5,minWidth:0}}>
        <CompChip kind="1st"  brand={item.components.stage1.brand}  model={item.components.stage1.model}  warn={item.components.stage1.issue}  service={item.components.stage1.serviceDue}/>
        <CompChip kind="PRI"  brand={item.components.stagePr.brand} model={item.components.stagePr.model} warn={item.components.stagePr.issue} service={item.components.stagePr.serviceDue}/>
        <CompChip kind="OCT"  brand={item.components.stageOc.brand} model={item.components.stageOc.model} warn={item.components.stageOc.issue} service={item.components.stageOc.serviceDue}/>
        <CompChip kind="GAU"  brand={item.components.gauge.brand}   model={item.components.gauge.model}/>
      </div>
    )
    : (
      <div style={{fontSize:13,color:"var(--ocean-900)"}}>
        <span style={{fontWeight:600}}>{item.brand}</span> {item.model}
      </div>
    );

  // Current-state cell
  const stateCell = (() => {
    if (item.status === "available" && showServiceFlag) {
      return <div style={{fontSize:11.5,color:"var(--amber-alert)",fontWeight:600}}>Service due in <span className="tabular">{sd}d</span></div>;
    }
    if (item.status === "available") return <span style={{fontSize:12,color:"var(--ocean-700)",opacity:0.7}}>—</span>;
    if (item.status === "service_due") {
      return <div style={{fontSize:11.5,color:"var(--amber-alert)",fontWeight:600}}>Due in <span className="tabular">{sd}d</span></div>;
    }
    if (item.status === "lent") {
      return (
        <div style={{fontSize:12,color:"var(--ocean-700)"}}>
          with <span style={{fontWeight:600,color:"var(--ocean-900)"}}>{item.holder?.name}</span>
          {item.holder?.external && <span className="chip" style={{marginLeft:6,fontSize:9,padding:"1px 5px"}}>EXTERNAL</span>}
          <span className="tabular" style={{display:"block",fontSize:10.5,opacity:0.7,marginTop:1}}>since {item.holder?.since}</span>
        </div>
      );
    }
    if (item.status === "maintenance") {
      return (
        <div style={{fontSize:12,color:"var(--ocean-700)"}}>
          {item.reason || "In service"}
          <span className="tabular" style={{display:"block",fontSize:10.5,opacity:0.7,marginTop:1}}>since {item.since}</span>
        </div>
      );
    }
    if (item.status === "broken") {
      return (
        <div style={{fontSize:12,color:"var(--ocean-700)"}}>
          {item.reason || "Broken"}
          <span className="tabular" style={{display:"block",fontSize:10.5,opacity:0.7,marginTop:1}}>since {item.since}</span>
        </div>
      );
    }
    if (item.status === "lost") {
      return (
        <div style={{fontSize:12,color:"var(--ocean-700)"}}>
          {item.reason || "Lost"}
          <span className="tabular" style={{display:"block",fontSize:10.5,opacity:0.7,marginTop:1}}>since {item.since}{item.customer?` · ${item.customer}`:""}</span>
        </div>
      );
    }
    return null;
  })();

  return (
    <div style={{display:"grid",gridTemplateColumns:"14px 88px minmax(0, 1fr) 56px 120px minmax(120px, 1fr) 36px",alignItems:"center",gap:12,padding:"10px 16px",borderBottom: last?"none":"1px solid var(--surface-3)"}}>
      <StatusPip status={item.status === "available" && showServiceFlag ? "service_due" : item.status}/>
      <div className="tabular" style={{fontFamily:"var(--font-ui)",fontSize:12.5,fontWeight:700,color:"var(--ocean-500)"}}>{item.id}</div>
      {brandModelCell}
      <div style={{fontSize:12,color:"var(--ocean-700)"}}>{item.size || "—"}</div>
      <div><StatusChip status={item.status === "available" && showServiceFlag ? "service_due" : item.status} compact/></div>
      {stateCell}
      <ActionMenu item={item} onAction={onAction}/>
    </div>
  );
}

// Compact component chip used inside Reg-Set rows
function CompChip({kind, brand, model, warn, service}){
  const sd = daysUntil(service);
  const dueSoon = service && sd >= 0 && sd <= 30;
  const bg = warn ? "var(--amber-alert-bg)" : "var(--surface-2)";
  const fg = warn ? "var(--amber-alert)" : "var(--ocean-900)";
  return (
    <span title={warn || (dueSoon ? `Service due in ${sd}d` : `${brand} ${model}`)}
          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 7px",borderRadius:5,background:bg,fontSize:11,color:fg,whiteSpace:"nowrap"}}>
      <span style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:8.5,letterSpacing:"0.06em",opacity:0.65}}>{kind}</span>
      <span style={{fontWeight:600}}>{brand}</span>
      <span style={{opacity:0.7}}>{model}</span>
      {dueSoon && !warn && <span style={{color:"var(--amber-alert)",fontWeight:700}}>·{sd}d</span>}
    </span>
  );
}

// =============================================================
// NON-INDEXED ROW
// =============================================================
function NonIndexedRow({row, onAction, last}){
  const available = row.total - row.lent - row.maintenance - row.broken - row.lost;
  const hasIssues = row.maintenance + row.broken + row.lost > 0;

  return (
    <div style={{display:"grid",gridTemplateColumns:"14px minmax(0, 1.6fr) 60px 110px minmax(0, 1.4fr) 36px",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:last?"none":"1px solid var(--surface-3)"}}>
      <StatusPip status={hasIssues ? "maintenance" : (available === 0 ? "lent" : "available")}/>
      <div style={{fontSize:13,color:"var(--ocean-900)",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
        <span style={{fontWeight:600}}>{row.brand}</span> {row.model}
      </div>
      <div style={{fontSize:12,color:"var(--ocean-700)"}}>{row.size}</div>
      <div>
        <span style={{display:"inline-flex",alignItems:"baseline",gap:4}}>
          <span className="tabular" style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:15,color: available===0?"var(--red-critical)":"var(--ocean-900)"}}>{available}</span>
          <span className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.6}}>/ {row.total}</span>
        </span>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {row.lent>0 && <span className="chip chip-ocean tabular">{row.lent} LENT</span>}
        {row.maintenance>0 && <span className="chip chip-amber tabular">{row.maintenance} MAINT.</span>}
        {row.broken>0 && <span className="chip chip-red tabular">{row.broken} BROKEN</span>}
        {row.lost>0 && <span className="chip chip-red tabular">{row.lost} LOST</span>}
        {row.lent===0 && !hasIssues && <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.55}}>All on shelf</span>}
      </div>
      <button onClick={()=>onAction("flag", row)}
        title="Flag a unit (broken / lost / maintenance)"
        style={{width:28,height:28,borderRadius:8,border:"1px solid var(--surface-3)",background:"var(--surface-1)",color:"var(--ocean-700)",display:"grid",placeItems:"center",cursor:"pointer"}}>
        <Icon name="alert_triangle" size={13}/>
      </button>
    </div>
  );
}

// =============================================================
// SECTION  (per equipment type)
// =============================================================
function EquipmentSection({type, items, stockRows, summary, onAction, defaultOpen=true, statusFilter, onStatusFilter}){
  const [open, setOpen] = React.useState(defaultOpen);
  const indexed = type.indexed;
  const visible = indexed
    ? (statusFilter ? items.filter(i=>{
        if (statusFilter === "service_due") return i.status==="service_due" || (i.type==="regulator_set" && daysUntil(Math.min(...["stage1","stagePr","stageOc"].map(k=>(new Date(i.components[k].serviceDue) - new Date(TODAY_ISO))/86400000))) <=30);
        return i.status===statusFilter;
      }) : items)
    : stockRows;
  const total = summary.total;

  return (
    <section style={{background:"var(--surface-1)",border:"1px solid var(--surface-3)",borderRadius:12,marginBottom:12,overflow:"hidden"}}>
      <header style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:14,borderBottom: open ? "1px solid var(--surface-3)" : "none",cursor:"pointer"}}
              onClick={()=>setOpen(!open)}>
        <Icon name={open ? "chevron_down" : "chevron_right"} size={14} style={{color:"var(--ocean-700)",opacity:0.6}}/>
        <Icon name={type.icon} size={16} style={{color:"var(--ocean-500)"}}/>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--ocean-900)"}}>{type.label}</div>
        <span className="chip" style={{fontSize:10,padding:"2px 7px"}}>
          <span className="tabular">{summary.available}</span>&nbsp;/&nbsp;<span className="tabular">{total}</span>
        </span>
        {/* availability bar */}
        <div style={{flex:1,minWidth:60,maxWidth:160,height:5,background:"var(--surface-2)",borderRadius:3,overflow:"hidden",display:"flex"}}>
          <div style={{width:`${(summary.available/total)*100||0}%`,background:"var(--safety-green)"}}/>
          {summary.lent>0 && <div style={{width:`${(summary.lent/total)*100}%`,background:"var(--ocean-400)"}}/>}
          {(summary.maintenance+summary.broken+summary.lost)>0 && <div style={{width:`${((summary.maintenance+summary.broken+summary.lost)/total)*100}%`,background:"var(--amber-alert)"}}/>}
        </div>
        {/* chip filters — only for indexed sections */}
        {indexed && open && (
          <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
            {[
              {id:null, label:"All"},
              {id:"available", label:"Available", n:summary.available},
              {id:"lent",      label:"Lent",      n:summary.lent},
              {id:"maintenance",label:"Maint.",   n:summary.maintenance},
              {id:"broken",    label:"Broken",    n:summary.broken},
              {id:"lost",      label:"Lost",      n:summary.lost},
            ].filter(f => f.id===null || (f.n||0) > 0).map(f=>(
              <button key={f.id||"all"}
                onClick={()=>onStatusFilter(statusFilter===f.id?null:f.id)}
                style={{padding:"3px 8px",borderRadius:5,fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",border:`1px solid ${statusFilter===f.id?"var(--ocean-500)":"var(--surface-3)"}`,background: statusFilter===f.id?"var(--ocean-100)":"transparent",color: statusFilter===f.id?"var(--ocean-500)":"var(--ocean-700)",cursor:"pointer"}}>
                {f.label}{f.n!=null && <span className="tabular" style={{marginLeft:4,opacity:0.7}}>{f.n}</span>}
              </button>
            ))}
          </div>
        )}
      </header>

      {open && (
        <div>
          {/* Column headers */}
          {indexed ? (
            <div style={{display:"grid",gridTemplateColumns:"14px 88px minmax(0, 1fr) 56px 120px minmax(120px, 1fr) 36px",alignItems:"center",gap:12,padding:"8px 16px",background:"var(--surface-2)",borderBottom:"1px solid var(--surface-3)",fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.85}}>
              <span/><span>Code</span><span>{type.id==="regulator_set"?"Components":"Brand / Model"}</span><span>Size</span><span>Status</span><span>Current state</span><span/>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"14px minmax(0, 1.6fr) 60px 110px minmax(0, 1.4fr) 36px",alignItems:"center",gap:12,padding:"8px 16px",background:"var(--surface-2)",borderBottom:"1px solid var(--surface-3)",fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.85}}>
              <span/><span>Brand / Model</span><span>Size</span><span>Available</span><span>Currently out / flagged</span><span/>
            </div>
          )}

          {visible.length === 0 ? (
            <div style={{padding:"32px 16px",textAlign:"center",fontSize:12.5,color:"var(--ocean-700)",opacity:0.7}}>
              No items match this filter.
            </div>
          ) : indexed
            ? visible.map((it,i)=> <IndexedRow key={it.id} item={it} onAction={onAction} last={i===visible.length-1}/>)
            : visible.map((row,i)=> <NonIndexedRow key={`${row.brand}-${row.model}-${row.size}`} row={row} onAction={onAction} last={i===visible.length-1}/>)
          }
        </div>
      )}
    </section>
  );
}

// =============================================================
// MODALS  (lend, maintenance, broken, lost, swap, flag-non-indexed)
// =============================================================
function ModalShell({title, sub, tone="ocean", icon, onClose, footer, children}){
  const tones = {
    ocean: {bg:"var(--ocean-100)", fg:"var(--ocean-500)"},
    amber: {bg:"var(--amber-alert-bg)", fg:"var(--amber-alert)"},
    red:   {bg:"var(--red-critical-bg)", fg:"var(--red-critical)"},
    green: {bg:"var(--safety-green-bg)", fg:"var(--safety-green)"},
  }[tone];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,37,64,0.45)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",zIndex:1000}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:560,maxWidth:"calc(100% - 32px)",background:"var(--surface-1)",borderRadius:14,boxShadow:"0 24px 60px rgba(10,37,64,0.30)",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--surface-3)",display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:32,height:32,borderRadius:8,background:tones.bg,color:tones.fg,display:"grid",placeItems:"center"}}><Icon name={icon} size={15}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:15,color:"var(--ocean-900)"}}>{title}</div>
            {sub && <div style={{fontSize:12,color:"var(--ocean-700)",opacity:0.8,marginTop:1}}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{background:"none",border:0,padding:4,color:"var(--ocean-700)",opacity:0.55,cursor:"pointer"}}><Icon name="x" size={14}/></button>
        </div>
        <div style={{padding:"16px 20px"}}>{children}</div>
        <div style={{padding:"12px 20px",borderTop:"1px solid var(--surface-3)",display:"flex",justifyContent:"flex-end",gap:8,background:"var(--surface-0)"}}>{footer}</div>
      </div>
    </div>
  );
}

function LendOutModal({item, onClose}){
  const [target, setTarget] = React.useState("");
  const [externalToggle, setExternalToggle] = React.useState(false);
  const itemLabel = item.type === "regulator_set" ? item.id : `${item.id} · ${item.brand} ${item.model}${item.size?" · "+item.size:""}`;
  return (
    <ModalShell title={`Lend out ${item.id}`} sub={itemLabel} icon="arrow_up_right" tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!target.trim()} onClick={onClose}><Icon name="check" size={13}/> Lend out</button>
      </>}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="field">
          <label>Lend to</label>
          <input className="input" placeholder={externalToggle?"Center / organization name":"Diver name or DV-ID"} value={target} onChange={e=>setTarget(e.target.value)} autoFocus/>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:10,fontSize:12.5,color:"var(--ocean-700)",cursor:"pointer"}}>
          <span className={`toggle ${externalToggle?"on":""}`} onClick={()=>setExternalToggle(!externalToggle)}/>
          External loan (to another center or organization, not a diver)
        </label>
        <div style={{background:"var(--ocean-50)",borderRadius:9,padding:"10px 12px",display:"flex",gap:8,fontSize:12,color:"var(--ocean-700)",lineHeight:1.5}}>
          <Icon name="info" size={13} style={{color:"var(--ocean-500)",flexShrink:0,marginTop:1}}/>
          <span>Lending out marks this item unavailable for trip planning until it's returned. The Planning module will skip it during gear assignment.</span>
        </div>
      </div>
    </ModalShell>
  );
}

function ReasonModal({item, action, onClose}){
  const meta = {
    maintenance: { title:`Send ${item.id} to maintenance`, icon:"settings",         tone:"amber", verb:"Send to maintenance" },
    broken:      { title:`Mark ${item.id} broken`,         icon:"alert_triangle",   tone:"red",   verb:"Mark broken" },
    lost:        { title:`Mark ${item.id} lost`,           icon:"alert_circle",     tone:"red",   verb:"Mark lost" },
  }[action];
  const [reason, setReason] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const askCustomer = action === "lost" || action === "broken";
  return (
    <ModalShell title={meta.title} sub={item.type==="regulator_set"?item.id:`${item.brand} ${item.model}${item.size?" · "+item.size:""}`}
      icon={meta.icon} tone={meta.tone} onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!reason.trim()} onClick={onClose} style={meta.tone==="red"?{background:"var(--red-critical)"}:meta.tone==="amber"?{background:"var(--amber-alert)"}:undefined}><Icon name="check" size={13}/> {meta.verb}</button>
      </>}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="field">
          <label>What happened?</label>
          <textarea className="input" rows="3" style={{height:"auto",padding:"10px 12px",resize:"vertical"}} placeholder={action==="maintenance"?"e.g. O-ring replacement, annual service":action==="broken"?"e.g. Bladder leak, beyond service":"e.g. Lost on Verde Island trip"} value={reason} onChange={e=>setReason(e.target.value)} autoFocus/>
        </div>
        {askCustomer && (
          <div className="field">
            <label>Customer involved <span style={{opacity:0.55,fontWeight:400}}>(optional)</span></label>
            <input className="input" placeholder="Diver name or DV-ID — for billing follow-up" value={customer} onChange={e=>setCustomer(e.target.value)}/>
            <div className="help">{action==="lost" ? "If recorded, the lost item can be billed via the Finance module (negligence)." : "Useful for warranty / incident reports. No billing trigger."}</div>
          </div>
        )}
        {action === "broken" && item.type === "regulator_set" && (
          <div style={{background:"var(--amber-alert-bg)",borderRadius:9,padding:"10px 12px",display:"flex",gap:8,fontSize:12,color:"#6e3e02",lineHeight:1.5}}>
            <Icon name="info" size={13} style={{color:"var(--amber-alert)",flexShrink:0,marginTop:1}}/>
            <span>If only one component is broken (a 2nd stage, a gauge…), use <strong>Swap component</strong> instead — it lets you keep the set in service while one part goes for repair.</span>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function SwapComponentModal({item, onClose}){
  const slots = [
    {key:"stage1",  label:"1st stage",        kind:"FIRST"},
    {key:"stagePr", label:"2nd stage primary",kind:"PRIMARY"},
    {key:"stageOc", label:"2nd stage octopus",kind:"OCTOPUS"},
    {key:"gauge",   label:"Gauge",            kind:"GAUGE"},
  ];
  const [pick, setPick] = React.useState(null); // which slot
  const [action, setAction] = React.useState("maintenance"); // 'maintenance' | 'broken' | 'lost'
  const [replacement, setReplacement] = React.useState("auto"); // 'auto' | 'none'

  return (
    <ModalShell title={`Swap a component of ${item.id}`}
      sub="Real-life behaviour: pull one part for service, optionally fit a spare so the set stays in rotation."
      icon="refresh" tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!pick} onClick={onClose}><Icon name="check" size={13}/> Swap</button>
      </>}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7,marginBottom:8}}>Which component?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {slots.map(s=>{
              const comp = item.components[s.key];
              const sd = daysUntil(comp.serviceDue);
              const dueSoon = comp.serviceDue && sd>=0 && sd<=30;
              const active = pick === s.key;
              return (
                <button key={s.key} onClick={()=>setPick(s.key)}
                  style={{textAlign:"left",padding:"10px 12px",borderRadius:10,border:`1px solid ${active?"var(--ocean-500)":"var(--surface-3)"}`,background:active?"var(--ocean-50)":"var(--surface-1)",cursor:"pointer"}}>
                  <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:10.5,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.8}}>{s.label}</div>
                  <div style={{fontSize:13,color:"var(--ocean-900)",marginTop:3}}><span style={{fontWeight:600}}>{comp.brand}</span> {comp.model}</div>
                  {comp.issue && <div style={{fontSize:11,color:"var(--amber-alert)",marginTop:2}}>{comp.issue}</div>}
                  {!comp.issue && dueSoon && <div className="tabular" style={{fontSize:11,color:"var(--amber-alert)",marginTop:2}}>Service due in {sd}d</div>}
                  {!comp.issue && !dueSoon && comp.serviceDue && <div className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65,marginTop:2}}>Service: {comp.serviceDue}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {pick && (
          <>
            <div>
              <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7,marginBottom:8}}>Why is it coming out?</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[
                  {id:"maintenance", label:"Service", sub:"Routine / scheduled"},
                  {id:"broken",      label:"Broken",  sub:"Needs repair"},
                  {id:"lost",        label:"Lost",    sub:"Not recovered"},
                ].map(o=>(
                  <button key={o.id} onClick={()=>setAction(o.id)}
                    style={{textAlign:"left",padding:"9px 11px",borderRadius:9,border:`1px solid ${action===o.id?"var(--ocean-500)":"var(--surface-3)"}`,background:action===o.id?"var(--ocean-50)":"var(--surface-1)",cursor:"pointer"}}>
                    <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12.5,color:"var(--ocean-900)"}}>{o.label}</div>
                    <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:1}}>{o.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7,marginBottom:8}}>Replacement</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button onClick={()=>setReplacement("auto")}
                  style={{textAlign:"left",padding:"10px 12px",borderRadius:9,border:`1px solid ${replacement==="auto"?"var(--ocean-500)":"var(--surface-3)"}`,background:replacement==="auto"?"var(--ocean-50)":"var(--surface-1)",cursor:"pointer"}}>
                  <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12.5,color:"var(--ocean-900)"}}>Pick a spare from stock</div>
                  <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:1}}>Set stays in service. Suggestion: <span className="tabular">Scubapro R195 (4 in stock)</span></div>
                </button>
                <button onClick={()=>setReplacement("none")}
                  style={{textAlign:"left",padding:"10px 12px",borderRadius:9,border:`1px solid ${replacement==="none"?"var(--amber-alert)":"var(--surface-3)"}`,background:replacement==="none"?"var(--amber-alert-bg)":"var(--surface-1)",cursor:"pointer"}}>
                  <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12.5,color:"var(--ocean-900)"}}>Leave the slot empty</div>
                  <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:1}}>Set becomes <span style={{color:"var(--amber-alert)",fontWeight:600}}>incomplete</span> until refitted.</div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}

function FlagNonIndexedModal({row, onClose}){
  const [action, setAction] = React.useState("broken");
  const [qty, setQty] = React.useState(1);
  const [reason, setReason] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const available = row.total - row.lent - row.maintenance - row.broken - row.lost;
  return (
    <ModalShell title={`Flag a unit · ${row.brand} ${row.model}`} sub={`Size ${row.size} · ${available} available of ${row.total}`}
      icon="alert_triangle" tone={action==="lost"||action==="broken"?"red":"amber"} onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!reason.trim()||qty<1} onClick={onClose} style={{background: action==="lost"||action==="broken"?"var(--red-critical)":"var(--amber-alert)"}}><Icon name="check" size={13}/> Flag {qty} unit{qty!==1?"s":""}</button>
      </>}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.7,marginBottom:8}}>Reason</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              {id:"maintenance", label:"Maintenance"},
              {id:"broken",      label:"Broken"},
              {id:"lost",        label:"Lost"},
            ].map(o=>(
              <button key={o.id} onClick={()=>setAction(o.id)}
                style={{padding:"9px 11px",borderRadius:9,border:`1px solid ${action===o.id?"var(--ocean-500)":"var(--surface-3)"}`,background:action===o.id?"var(--ocean-50)":"var(--surface-1)",fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12.5,color:"var(--ocean-900)",cursor:"pointer"}}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:14}}>
          <div className="field">
            <label>Quantity</label>
            <input className="input" type="number" min="1" max={available} value={qty} onChange={e=>setQty(Number(e.target.value))}/>
          </div>
          <div className="field">
            <label>Notes</label>
            <input className="input" placeholder={action==="lost"?"e.g. Not returned by customer":action==="broken"?"e.g. Zipper torn":"e.g. Refurbishing"} value={reason} onChange={e=>setReason(e.target.value)}/>
          </div>
        </div>
        {(action==="lost"||action==="broken") && (
          <div className="field">
            <label>Customer involved <span style={{opacity:0.55,fontWeight:400}}>(optional)</span></label>
            <input className="input" placeholder="Diver name or DV-ID — for billing follow-up" value={customer} onChange={e=>setCustomer(e.target.value)}/>
            <div className="help">{action==="lost"?"Lost units can be billed via the Finance module (negligence).":"Useful for warranty / incident reports."}</div>
          </div>
        )}
        <div style={{background:"var(--ocean-50)",borderRadius:9,padding:"10px 12px",display:"flex",gap:8,fontSize:12,color:"var(--ocean-700)",lineHeight:1.5}}>
          <Icon name="info" size={13} style={{color:"var(--ocean-500)",flexShrink:0,marginTop:1}}/>
          <span>This decrements the on-shelf count immediately. To physically dispose of the unit, head to <strong>Stock</strong>.</span>
        </div>
      </div>
    </ModalShell>
  );
}

// =============================================================
// MAIN
// =============================================================
function InventoryPage(){
  const [typeFilter,   setTypeFilter]   = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState(null);
  const [modal,        setModal]        = React.useState(null); // { kind, item }

  const onAction = (kind, item)=>{
    if (kind === "return") return; // future: optimistic update
    setModal({ kind, item });
  };
  const closeModal = () => setModal(null);

  const visibleTypes = typeFilter ? TYPES.filter(t=>t.id===typeFilter) : TYPES;

  return (
    <div data-screen-label="Equipment · Inventory">
      <div className="page-head">
        <div>
          <h1 className="page-title">Inventory</h1>
          <div className="page-sub">What's on the shelf right now. Lend, flag, swap — quantity & purchases live in Stock.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="filter" size={14}/> Filter</button>
          <button className="btn btn-secondary"><Icon name="search" size={14}/> Find item</button>
        </div>
      </div>

      <ConditionStrip activeFilter={typeFilter} onFilter={setTypeFilter}/>
      <IssuesCallout onJump={()=>setStatusFilter("broken")}/>

      {visibleTypes.map(t=>{
        const items = ITEMS.filter(i=>i.type===t.id);
        const stockRows = STOCK.filter(s=>s.type===t.id);
        const summary = summarize(t.id);
        if (summary.total === 0) return null;
        return (
          <EquipmentSection
            key={t.id}
            type={t}
            items={items}
            stockRows={stockRows}
            summary={summary}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
            onAction={onAction}/>
        );
      })}

      {modal?.kind === "lend"        && <LendOutModal       item={modal.item} onClose={closeModal}/>}
      {modal?.kind === "maintenance" && <ReasonModal action="maintenance" item={modal.item} onClose={closeModal}/>}
      {modal?.kind === "broken"      && <ReasonModal action="broken"      item={modal.item} onClose={closeModal}/>}
      {modal?.kind === "lost"        && <ReasonModal action="lost"        item={modal.item} onClose={closeModal}/>}
      {modal?.kind === "swap"        && <SwapComponentModal item={modal.item} onClose={closeModal}/>}
      {modal?.kind === "flag"        && <FlagNonIndexedModal row={modal.item} onClose={closeModal}/>}
    </div>
  );
}

window.InventoryPage = InventoryPage;
