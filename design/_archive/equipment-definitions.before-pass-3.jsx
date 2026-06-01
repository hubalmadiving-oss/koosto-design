// Equipment · Definitions  (rebuilt 2026-05-27)
// =============================================================
// Owns:
//   1. Brands   — flat list. Add / delete. No visibility toggle here —
//                  a brand only matters if it's used in the catalog below.
//   2. Catalog  — per equipment TYPE, the brands and models the center
//                  accepts. This is the source for the Stock dropdowns.
//
// Does NOT own:
//   · Index numbering format    → Settings · Equipment · Settings
//   · Service intervals         → Settings · Equipment · Settings (TBD)
//   · Stock counts / sizes      → Equipment · Stock
//   · Regulator SETS            → Equipment · Inventory (assembled from
//                                   1st stage + 2nd stage + gauge components)
//
// One vocabulary: "Brand". Never "manufacturer". Stick to it.
//
// DATA CONTRACT (proposed)
//   equipment_brands  — id, name
//   equipment_catalog — id, type, brand_id, model, attrs JSONB
// =============================================================

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

// =============================================================
// MOCK DATA
// =============================================================
const DEF_BRANDS = [
  { id:"aqualung",  name:"Aqualung"  },
  { id:"mares",     name:"Mares"     },
  { id:"cressi",    name:"Cressi"    },
  { id:"scubapro",  name:"Scubapro"  },
  { id:"apeks",     name:"Apeks"     },
  { id:"suunto",    name:"Suunto"    },
  { id:"tusa",      name:"Tusa"      },
  { id:"princeton", name:"Princeton" },
  { id:"noname",    name:"Noname"    },
];

// Equipment types — Regulator SETS NOT included (assembled in Inventory).
const DEF_TYPES = [
  { id:"bcd",      label:"BCD",                  icon:"equipment", attr:null },
  { id:"reg1",     label:"Regulator · 1st stage", icon:"tank",     attr:"connector"          },
  { id:"reg2",     label:"Regulator · 2nd stage", icon:"tank",     attr:"role"               },
  { id:"gauge",    label:"Gauge",                icon:"clock",     attr:null                 },
  { id:"wetsuit",  label:"Wetsuit",              icon:"shirt",     attr:"thickness+activities" },
  { id:"fins",     label:"Fins",                 icon:"waves",     attr:"activities"         },
  { id:"mask",     label:"Mask",                 icon:"id",        attr:"activities"         },
  { id:"snorkel",  label:"Snorkel",              icon:"waves",     attr:"activities"         },
  { id:"computer", label:"Dive Computer",        icon:"clock",     attr:null                 },
  { id:"torch",    label:"Torch",                icon:"bolt",      attr:null                 },
  { id:"compass",  label:"Compass",              icon:"globe",     attr:null                 },
];

// Models — keyed by [type][brand]
const DEF_SEED_MODELS = {
  bcd: {
    aqualung: [{model:"Wave"},{model:"Rogue"}],
    mares:    [{model:"Rover"}],
    cressi:   [{model:"Start"}],
    scubapro: [{model:"Hydros"}],
  },
  reg1: {
    aqualung: [{model:"Titan", connector:"INT"},{model:"MC9", connector:"DIN"},{model:"Helix", connector:"DIN"}],
    mares:    [{model:"15X", connector:"DIN"},{model:"22X", connector:"DIN"}],
    scubapro: [{model:"Mk17", connector:"DIN"},{model:"Mk25", connector:"DIN"}],
    apeks:    [{model:"XTX50", connector:"DIN"},{model:"XTX100", connector:"DIN"}],
  },
  reg2: {
    scubapro: [{model:"R195", role:"primary"},{model:"S270", role:"primary"},{model:"R095", role:"octopus"}],
    aqualung: [{model:"Core", role:"primary"},{model:"Core Octo", role:"octopus"}],
    mares:    [{model:"Abyss", role:"primary"},{model:"Abyss Octo", role:"octopus"}],
    apeks:    [{model:"XTX50 2nd", role:"primary"},{model:"XTX40 Octo", role:"octopus"}],
    cressi:   [{model:"Master", role:"primary"}],
  },
  gauge: {
    noname:   [{model:"Basic"}],
    scubapro: [{model:"Premium"}],
  },
  wetsuit: {
    cressi:   [
      {model:"Lido",      thickness:"3mm", activities:["diving","snorkeling"]},
      {model:"Med X",     thickness:"5mm", activities:["diving"]},
      {model:"Diver Pro", thickness:"7mm", activities:["diving"]},
    ],
    aqualung: [{model:"HydroFlex", thickness:"3mm", activities:["diving","freediving"]}],
  },
  fins: {
    cressi: [
      {model:"Frog",      activities:["diving","snorkeling"]},
      {model:"Pro Light", activities:["freediving"]},
    ],
    apeks:  [{model:"Rk3", activities:["diving"]},{model:"Rk3 HD", activities:["diving"]}],
    mares:  [{model:"Avanti", activities:["diving","snorkeling"]}],
    tusa:   [{model:"Solla", activities:["diving"]}],
  },
  mask: {
    cressi: [{model:"Big Eyes", activities:["diving","snorkeling","freediving"]}],
    tusa:   [{model:"Freedom One", activities:["diving"]}],
  },
  snorkel: {
    cressi: [{model:"Alpha Ultra Dry", activities:["snorkeling","freediving"]}],
  },
  computer: { suunto: [{model:"Zoop"},{model:"D4i"}] },
  torch:    { princeton: [{model:"Genesis"}] },
  compass:  { suunto: [{model:"SK-7"}] },
};

const DEF_THICKNESS_OPTIONS = ["3mm","5mm","7mm"];
const DEF_ACTIVITIES = ["diving","freediving","snorkeling"];

// =============================================================
// ATTRIBUTE CHIPS
// =============================================================
function PillChip({label, tone, active, onClick}){
  const styles = {
    ocean: {bg:"var(--ocean-100)", fg:"var(--ocean-500)"},
    amber: {bg:"var(--amber-alert-bg)", fg:"var(--amber-alert)"},
  }[tone] || {bg:"var(--surface-2)", fg:"var(--ocean-700)"};
  return (
    <button onClick={onClick}
      style={{
        padding:"3px 9px",
        borderRadius:4,
        border:`1px solid ${active ? styles.fg : "var(--surface-3)"}`,
        background: active ? styles.bg : "transparent",
        color: active ? styles.fg : "var(--ocean-700)",
        fontFamily:"var(--font-body)", fontWeight: active ? 700 : 600,
        fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em",
        cursor: onClick ? "pointer" : "default",
        opacity: active ? 1 : 0.65,
      }}>
      {label}
    </button>
  );
}

function ActivityChip({activity, active, onToggle}){
  const label = {diving:"Diving", freediving:"Freediving", snorkeling:"Snorkeling"}[activity];
  return (
    <button onClick={onToggle}
      className={`act-chip act-${activity} ${active ? "act-on" : ""}`}
      style={{cursor: onToggle ? "pointer" : "default"}}>
      {label}
    </button>
  );
}

// =============================================================
// MODEL ROW — type-aware attributes
// =============================================================
function ModelRow({type, model, onDelete, onToggleActivity, onSetAttr, last}){
  let attrs = null;
  if (type.id === "reg1") {
    attrs = (
      <span style={{display:"inline-flex",gap:4}}>
        <PillChip label="DIN" tone="ocean" active={model.connector === "DIN"} onClick={()=>onSetAttr("connector","DIN")}/>
        <PillChip label="INT" tone="ocean" active={model.connector === "INT"} onClick={()=>onSetAttr("connector","INT")}/>
      </span>
    );
  } else if (type.id === "reg2") {
    attrs = (
      <span style={{display:"inline-flex",gap:4}}>
        <PillChip label="Primary" tone="ocean" active={model.role === "primary"} onClick={()=>onSetAttr("role","primary")}/>
        <PillChip label="Octopus" tone="amber" active={model.role === "octopus"} onClick={()=>onSetAttr("role","octopus")}/>
      </span>
    );
  } else if (type.id === "wetsuit") {
    attrs = (
      <span style={{display:"inline-flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{display:"inline-flex",gap:4}}>
          {DEF_THICKNESS_OPTIONS.map(th =>
            <PillChip key={th} label={th} tone="ocean" active={model.thickness === th} onClick={()=>onSetAttr("thickness",th)}/>
          )}
        </span>
        <span style={{width:1,height:14,background:"var(--surface-3)",margin:"0 2px"}}/>
        <span style={{display:"inline-flex",gap:4}}>
          {DEF_ACTIVITIES.map(a =>
            <ActivityChip key={a} activity={a} active={(model.activities||[]).includes(a)} onToggle={()=>onToggleActivity(a)}/>
          )}
        </span>
      </span>
    );
  } else if (type.attr === "activities") {
    attrs = (
      <span style={{display:"inline-flex",gap:4}}>
        {DEF_ACTIVITIES.map(a =>
          <ActivityChip key={a} activity={a} active={(model.activities||[]).includes(a)} onToggle={()=>onToggleActivity(a)}/>
        )}
      </span>
    );
  }

  return (
    <div style={{display:"grid",gridTemplateColumns:"minmax(150px,1fr) auto auto",alignItems:"center",gap:12,padding:"8px 14px",borderBottom: last ? "none" : "1px solid var(--surface-3)"}}>
      <span style={{fontSize:13,color:"var(--ocean-900)",fontWeight:500}}>{model.model}</span>
      {attrs || <span/>}
      <button onClick={onDelete} title="Remove model"
        style={{width:24,height:24,borderRadius:6,background:"none",border:"none",color:"var(--ocean-700)",opacity:0.5,cursor:"pointer",display:"grid",placeItems:"center"}}
        onMouseEnter={e=>{e.currentTarget.style.background="var(--red-critical-bg)";e.currentTarget.style.color="var(--red-critical)";e.currentTarget.style.opacity="1"}}
        onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--ocean-700)";e.currentTarget.style.opacity="0.5"}}>
        <Icon name="trash" size={12}/>
      </button>
    </div>
  );
}

// =============================================================
// BRAND BLOCK (inside a type)
// =============================================================
function BrandBlock({type, brandId, brandName, models, onAddModel, onDeleteModel, onUpdateModel}){
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{border:"1px solid var(--surface-3)",borderRadius:10,marginBottom:8,background:"var(--surface-1)",overflow:"hidden"}}>
      <header onClick={()=>setOpen(!open)} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <Icon name={open?"chevron_down":"chevron_right"} size={12} style={{color:"var(--ocean-700)",opacity:0.55}}/>
        <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{brandName}</span>
        <span className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65}}>
          {models.length} model{models.length !== 1 ? "s" : ""}
        </span>
        <div style={{flex:1}}/>
        <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation(); onAddModel();}}>
          <Icon name="plus" size={11}/> Add model
        </button>
      </header>
      {open && (
        <div style={{borderTop:"1px solid var(--surface-3)",background:"var(--surface-0)"}}>
          {models.length === 0 ? (
            <div style={{padding:"16px",textAlign:"center",fontSize:12,color:"var(--ocean-700)",opacity:0.6}}>
              No models yet — add one to make it available in Stock.
            </div>
          ) : (
            models.map((m,i) => (
              <ModelRow key={i} type={type} model={m} last={i===models.length-1}
                onDelete={()=>onDeleteModel(i)}
                onSetAttr={(k,v)=>onUpdateModel(i, {[k]:v})}
                onToggleActivity={(a)=>{
                  const cur = m.activities || [];
                  const next = cur.includes(a) ? cur.filter(x=>x!==a) : [...cur, a];
                  onUpdateModel(i, {activities: next});
                }}/>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================
// TYPE SECTION
// =============================================================
function TypeSection({type, brands, models, onAttachBrand, onAddModel, onDeleteModel, onUpdateModel}){
  const [open, setOpen] = React.useState(false);
  const attachedBrandIds = Object.keys(models[type.id] || {});
  const attachedBrands = brands.filter(b => attachedBrandIds.includes(b.id));
  const unattachedBrands = brands.filter(b => !attachedBrandIds.includes(b.id));
  const totalModels = attachedBrandIds.reduce((sum, bid) => sum + (models[type.id][bid]?.length || 0), 0);

  return (
    <div style={{background:"var(--surface-1)",border:"1px solid var(--surface-3)",borderRadius:12,marginBottom:10,overflow:"hidden"}}>
      <header onClick={()=>setOpen(!open)} style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",borderBottom: open ? "1px solid var(--surface-3)" : "none"}}>
        <Icon name={open?"chevron_down":"chevron_right"} size={14} style={{color:"var(--ocean-700)",opacity:0.55}}/>
        <Icon name={type.icon} size={16} style={{color:"var(--ocean-500)"}}/>
        <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:14,color:"var(--ocean-900)"}}>{type.label}</span>
        <span className="tabular" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.65}}>
          {attachedBrands.length} brand{attachedBrands.length !== 1 ? "s" : ""} · {totalModels} model{totalModels !== 1 ? "s" : ""}
        </span>
        <div style={{flex:1}}/>
        {open && unattachedBrands.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={e=>{e.stopPropagation(); onAttachBrand();}}>
            <Icon name="plus" size={11}/> Attach brand
          </button>
        )}
      </header>
      {open && (
        <div style={{padding:"14px 16px",background:"var(--surface-0)"}}>
          {attachedBrands.length === 0 ? (
            <div style={{padding:"22px",textAlign:"center",border:"1px dashed var(--surface-3)",borderRadius:10,background:"var(--surface-1)"}}>
              <div style={{fontSize:12.5,color:"var(--ocean-700)",marginBottom:10}}>No brands attached to {type.label.toLowerCase()} yet.</div>
              <button className="btn btn-primary btn-sm" onClick={onAttachBrand}>
                <Icon name="plus" size={11}/> Attach a brand
              </button>
            </div>
          ) : (
            attachedBrands.map(b => (
              <BrandBlock
                key={b.id}
                type={type}
                brandId={b.id}
                brandName={b.name}
                models={models[type.id][b.id] || []}
                onAddModel={()=>onAddModel(b.id)}
                onDeleteModel={(idx)=>onDeleteModel(b.id, idx)}
                onUpdateModel={(idx, patch)=>onUpdateModel(b.id, idx, patch)}/>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================
// MODAL SHELL
// =============================================================
function ModalShell({title, sub, icon, tone="ocean", onClose, footer, children, width=520}){
  const tones = {
    ocean: {bg:"var(--ocean-100)", fg:"var(--ocean-500)"},
    green: {bg:"var(--safety-green-bg)", fg:"var(--safety-green)"},
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
// ADD BRAND MODAL — single field, single column
// =============================================================
function AddBrandModal({onClose, onConfirm, existing}){
  const [name, setName] = React.useState("");
  const trimmed = name.trim();
  const isDup = existing.some(b => b.name.toLowerCase() === trimmed.toLowerCase());
  const canAdd = trimmed.length > 0 && !isDup;

  return (
    <ModalShell title="Add a brand"
      sub="Brands are shared across every equipment type."
      icon="tag" tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!canAdd} onClick={()=>onConfirm(trimmed)}>
          <Icon name="check" size={13}/> Add brand
        </button>
      </>}>
      <div className="field">
        <label style={{fontSize:11.5,color:"var(--ocean-700)",fontWeight:500}}>Brand name</label>
        <input className="input" placeholder="e.g. Sherwood, Beuchat…" value={name} onChange={e=>setName(e.target.value)} autoFocus style={{marginTop:4}}/>
        {isDup && <div style={{fontSize:11,color:"var(--amber-alert)",marginTop:6}}>A brand with this name already exists.</div>}
      </div>
    </ModalShell>
  );
}

// =============================================================
// ATTACH BRAND MODAL — pick existing brand to attach to a type
// =============================================================
function AttachBrandModal({type, brands, onClose, onConfirm}){
  const [pick, setPick] = React.useState("");
  return (
    <ModalShell title={`Attach a brand to ${type.label}`}
      sub="Pick from the existing brands. Add a new one from the Brands card if it's missing."
      icon="plus" tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!pick} onClick={()=>onConfirm(pick)}>
          <Icon name="check" size={13}/> Attach brand
        </button>
      </>}>
      <div className="field">
        <label style={{fontSize:11.5,color:"var(--ocean-700)",fontWeight:500}}>Brand</label>
        <select className="input" value={pick} onChange={e=>setPick(e.target.value)} style={{height:36,marginTop:4}}>
          <option value="">Select a brand…</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
    </ModalShell>
  );
}

// =============================================================
// ADD MODEL MODAL — type-aware, one column, hairline sections
// =============================================================
function AddModelModal({type, brandName, onClose, onConfirm}){
  const [model, setModel] = React.useState("");
  const [connector, setConnector] = React.useState("DIN");
  const [role, setRole] = React.useState("primary");
  const [thickness, setThickness] = React.useState("3mm");
  const [acts, setActs] = React.useState([]);

  const toggle = a => setActs(s => s.includes(a) ? s.filter(x=>x!==a) : [...s, a]);

  const trimmed = model.trim();
  const canAdd =
    trimmed.length > 0 &&
    (type.attr !== "activities" || acts.length > 0) &&
    (type.id !== "wetsuit" || acts.length > 0);

  const confirm = () => {
    const m = { model: trimmed };
    if (type.id === "reg1") m.connector = connector;
    if (type.id === "reg2") m.role = role;
    if (type.id === "wetsuit") { m.thickness = thickness; m.activities = acts; }
    if (type.attr === "activities" && type.id !== "wetsuit") m.activities = acts;
    onConfirm(m);
  };

  return (
    <ModalShell title={`Add a ${type.label.toLowerCase()} model`}
      sub={`To ${brandName} — appears in Stock once saved.`}
      icon="plus" tone="ocean" onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!canAdd} onClick={confirm}>
          <Icon name="check" size={13}/> Add model
        </button>
      </>}>
      <div>
        <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.78,marginBottom:10}}>Model</div>
        <div className="field" style={{marginBottom:12}}>
          <label style={{fontSize:11.5,color:"var(--ocean-700)",fontWeight:500}}>Name</label>
          <input className="input" placeholder={`e.g. ${type.id === "bcd" ? "Wave Pro" : "X1"}`} value={model} onChange={e=>setModel(e.target.value)} autoFocus style={{marginTop:4}}/>
        </div>

        {type.id === "reg1" && (
          <>
            <div style={{height:1,background:"var(--surface-3)",margin:"18px 0"}}/>
            <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.78,marginBottom:10}}>Connector</div>
            <div className="field" style={{marginBottom:12}}>
              <div style={{display:"inline-flex",gap:6}}>
                {["DIN","INT"].map(c =>
                  <button key={c} type="button" onClick={()=>setConnector(c)}
                    style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${connector===c?"var(--ocean-500)":"var(--surface-3)"}`,background:connector===c?"var(--ocean-50)":"var(--surface-1)",color:"var(--ocean-900)",fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                    {c}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {type.id === "reg2" && (
          <>
            <div style={{height:1,background:"var(--surface-3)",margin:"18px 0"}}/>
            <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.78,marginBottom:10}}>Role</div>
            <div className="field" style={{marginBottom:12}}>
              <div style={{display:"inline-flex",gap:6}}>
                {[
                  {id:"primary", label:"Primary", tone:"ocean"},
                  {id:"octopus", label:"Octopus", tone:"amber"},
                ].map(o =>
                  <button key={o.id} type="button" onClick={()=>setRole(o.id)}
                    style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${role===o.id?(o.tone==="amber"?"var(--amber-alert)":"var(--ocean-500)"):"var(--surface-3)"}`,background:role===o.id?(o.tone==="amber"?"var(--amber-alert-bg)":"var(--ocean-50)"):"var(--surface-1)",color: role===o.id ? (o.tone==="amber"?"var(--amber-alert)":"var(--ocean-500)") : "var(--ocean-900)",fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                    {o.label}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {type.id === "wetsuit" && (
          <>
            <div style={{height:1,background:"var(--surface-3)",margin:"18px 0"}}/>
            <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.78,marginBottom:10}}>Thickness</div>
            <div className="field" style={{marginBottom:12}}>
              <div style={{display:"inline-flex",gap:6}}>
                {DEF_THICKNESS_OPTIONS.map(th =>
                  <button key={th} type="button" onClick={()=>setThickness(th)}
                    style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${thickness===th?"var(--ocean-500)":"var(--surface-3)"}`,background:thickness===th?"var(--ocean-50)":"var(--surface-1)",color:"var(--ocean-900)",fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                    {th}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {(type.attr === "activities" || type.id === "wetsuit") && (
          <>
            <div style={{height:1,background:"var(--surface-3)",margin:"18px 0"}}/>
            <div style={{fontFamily:"var(--font-ui)",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--ocean-700)",opacity:0.78,marginBottom:10}}>Activities</div>
            <div className="field" style={{marginBottom:6}}>
              <div className="help" style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginBottom:8}}>Pick every activity this model is suitable for. The fitting engine uses this to match models to trip activity types.</div>
              <div style={{display:"inline-flex",gap:6}}>
                {DEF_ACTIVITIES.map(a =>
                  <ActivityChip key={a} activity={a} active={acts.includes(a)} onToggle={()=>toggle(a)}/>
                )}
              </div>
              {acts.length === 0 && <div style={{fontSize:11,color:"var(--amber-alert)",marginTop:8}}>Pick at least one activity.</div>}
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}

// =============================================================
// MAIN
// =============================================================
function SettingsEquipmentDefinitions(){
  const [brands, setBrands] = React.useState(DEF_BRANDS);
  const [models, setModels] = React.useState(DEF_SEED_MODELS);
  const [modal, setModal] = React.useState(null);

  const close = () => setModal(null);

  const addBrand = (name) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setBrands(b => [...b, { id, name }]);
    close();
  };
  const deleteBrand = (id) => {
    setBrands(b => b.filter(x => x.id !== id));
    setModels(m => {
      const next = {};
      Object.keys(m).forEach(t => {
        next[t] = {};
        Object.keys(m[t]).forEach(bid => { if (bid !== id) next[t][bid] = m[t][bid]; });
      });
      return next;
    });
  };
  const attachBrand = (typeId, brandId) => {
    setModels(m => ({...m, [typeId]: { ...(m[typeId] || {}), [brandId]: [] }}));
    close();
  };
  const addModel = (typeId, brandId, modelObj) => {
    setModels(m => ({
      ...m,
      [typeId]: {
        ...(m[typeId] || {}),
        [brandId]: [ ...((m[typeId] || {})[brandId] || []), modelObj ],
      },
    }));
    close();
  };
  const deleteModel = (typeId, brandId, idx) => {
    setModels(m => ({
      ...m,
      [typeId]: {
        ...m[typeId],
        [brandId]: m[typeId][brandId].filter((_,i)=>i!==idx),
      },
    }));
  };
  const updateModel = (typeId, brandId, idx, patch) => {
    setModels(m => ({
      ...m,
      [typeId]: {
        ...m[typeId],
        [brandId]: m[typeId][brandId].map((x,i) => i===idx ? {...x, ...patch} : x),
      },
    }));
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>

      {/* 1 · Brands */}
      <SectionCard title="Brands"
        sub="Shared across every equipment type. Attach a brand to a type below to start adding models."
        action={
          <button className="btn btn-primary btn-sm" onClick={()=>setModal({kind:"add-brand"})}>
            <Icon name="plus" size={11}/> Add brand
          </button>
        }>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {brands.map(b => (
            <div key={b.id} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 10px",background:"var(--surface-2)",borderRadius:8}}>
              <span style={{fontFamily:"var(--font-ui)",fontWeight:600,fontSize:12.5,color:"var(--ocean-900)"}}>{b.name}</span>
              <button onClick={()=>deleteBrand(b.id)}
                style={{background:"none",border:0,padding:0,color:"var(--ocean-700)",opacity:0.5,cursor:"pointer",display:"inline-grid",placeItems:"center"}}
                onMouseEnter={e=>{e.currentTarget.style.color="var(--red-critical)";e.currentTarget.style.opacity="1"}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--ocean-700)";e.currentTarget.style.opacity="0.5"}}>
                <Icon name="x" size={11}/>
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 2 · Catalog */}
      <SectionCard title="Catalog"
        sub="Per type, the brands and models available in Equipment · Stock."
        action={
          <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,maxWidth:300,textAlign:"right",lineHeight:1.4}}>
            <Icon name="info" size={11} style={{verticalAlign:"middle",marginRight:4,opacity:0.55}}/>
            Regulator sets are not defined here — they're assembled from 1st stage + 2nd stage + gauge in <strong style={{color:"var(--ocean-900)"}}>Equipment · Inventory</strong>.
          </div>
        }>
        {DEF_TYPES.map(t => (
          <TypeSection
            key={t.id}
            type={t}
            brands={brands}
            models={models}
            onAttachBrand={()=>setModal({kind:"attach-brand",type:t})}
            onAddModel={(brandId)=>setModal({kind:"add-model",type:t,brandId})}
            onDeleteModel={(brandId, idx)=>deleteModel(t.id, brandId, idx)}
            onUpdateModel={(brandId, idx, patch)=>updateModel(t.id, brandId, idx, patch)}/>
        ))}
      </SectionCard>

      {/* Modals */}
      {modal?.kind === "add-brand" && (
        <AddBrandModal existing={brands} onClose={close} onConfirm={addBrand}/>
      )}
      {modal?.kind === "attach-brand" && (
        <AttachBrandModal
          type={modal.type}
          brands={brands.filter(b => !Object.keys(models[modal.type.id] || {}).includes(b.id))}
          onClose={close}
          onConfirm={(brandId)=>attachBrand(modal.type.id, brandId)}/>
      )}
      {modal?.kind === "add-model" && (
        <AddModelModal
          type={modal.type}
          brandName={brands.find(b=>b.id===modal.brandId)?.name || ""}
          onClose={close}
          onConfirm={(m)=>addModel(modal.type.id, modal.brandId, m)}/>
      )}
    </div>
  );
}

window.SettingsEquipmentDefinitions = SettingsEquipmentDefinitions;
