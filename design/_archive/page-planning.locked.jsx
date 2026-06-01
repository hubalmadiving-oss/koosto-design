// =============================================================
// PLANNING DASHBOARD PAGE — N+1 focus, validation, gear assign
// =============================================================
// __PLAN_CSS is now in design/styles-planning-locked.css (loaded as <link>)

const TOMORROW = {
  iso: "10/05/2026", long: "Sunday 10 May 2026",
  trips: 2, divers: 10, staff: 0,
  tanks: [{k:"Air/12L", n:22},{k:"Air/15L", n:2},{k:"Nx40/12L", n:2}],
  spareTanks: 3, spareRegs: 2, o2kits: 1, almaPax: 10, almaGroups: 2,
  boats: [
    { name:"Alma", trips:2, spareRegs:2, o2:1 },
  ],
  equip: [
    { k:"BCD",   n:5 },
    { k:"Reg",   n:5 },
    { k:"Wetsuit", n:5 },
    { k:"Fins",  n:5 },
    { k:"Mask",  n:5 },
    { k:"Snorkel", n:2 },
  ],
  ready: true,
};

const TODAY = {
  iso: "09/05/2026", long: "Saturday 09 May 2026",
  trips: 3, divers: 3, staff: 0,
  tanks: [{k:"Air/12L", n:6}],
  spareTanks: 1, spareRegs: 3, o2kits: 1, almaPax: 0, almaGroups: 1,
  boats: [
    { name:"Alma", trips:1, spareRegs:1, o2:1 },
    { name:"Local (Arco)", trips:1, spareRegs:1, o2:0 },
    { name:"Deep Blue", trips:1, spareRegs:1, o2:1 },
  ],
  equip: [
    { k:"BCD", n:1 },
    { k:"Reg", n:2 },
    { k:"Wetsuit", n:1 },
    { k:"Fins", n:2 },
    { k:"Mask", n:2 },
  ],
  ready: true,
};

const TOMORROW_TRIPS = [
  {
    id:"7517b4dc", time:"06:45", title:"Pamilican Trip", site:"Pamilacan",
    boat:"Alma", divers:6, staff:0, dives:3,
    tanksLine:"20 (18× Air/12L) + 2 spare", spareReg:"1 (per group)", o2:1,
    groups:[
      { name:"Kite Kangaroo", guide:null, cap:6, divers:[
        { id:"FK-000102", n:"marie.lefevre@fake.almadiving", short:"marie.lefevre@fake…", role:"Cust.", cert:"Advanced Open Water Diver", dives:85, gas:null, c0:0,
          gear:[{k:"BCD",id:"BCD-24",label:"Zeepro Classic M"},{k:"REG",id:"SET-005",label:"Regulator"},{k:"FINS",id:null,label:"Cressi Frog S"},{k:"WS",id:null,label:"Cressi 3mm Integral S"},{k:"MASK",id:null,label:"Generic Black"}],
          gearStatus:"assigned" },
        { id:"DV-015C2537B3", n:"Dav B", role:"Cust.", cert:"Open Water Diver", dives:null, gas:null, c0:1,
          gear:[{k:"BCD",id:"BCD-G",label:"Aqualung Wave M"},{k:"BCD-ALT",id:"BCD-21",label:"Aqualung Wave L"},{k:"REG",id:"SET-003",label:"Regulator"},{k:"FINS",id:null,label:"Apeks Rk3 M"},{k:"WS",id:null,label:"Cressi 3mm Integral S"},{k:"MASK",id:null,label:"Generic Snorkeling"}],
          gearStatus:"assigned", warn:"No sizing data — BCD · Fins · Wetsuit" },
        { id:"FK-000087", n:"Hugo Leclercko", role:"Cust.", cert:"Advanced Open Water Diver", dives:120, gas:null, c0:2,
          gear:[], gearStatus:"none" },
        { id:"FK-000099", n:"Hugo", role:"Cust.", cert:"1 Star Diver (P1)", dives:null, gas:null, c0:3,
          gear:[{k:"BCD",id:"BCD-12",label:"Mares Rover L"},{k:"REG",id:"SET-002",label:"Regulator"},{k:"FINS",id:null,label:"Cressi Frog S"},{k:"WS",id:null,label:"Cressi 5mm Shorty M"},{k:"MASK",id:null,label:"Generic Black"}],
          gearStatus:"draft" },
        { id:"FK-000108", n:"oliver.davies@fake.almadiving", short:"oliver.davies@fake.alma…", role:"Cust.", cert:"Open Water Diver", dives:42, gas:null, c0:4,
          gear:[{k:"BCD",id:"BCD-11",label:"Aqualung Wave L"},{k:"REG",id:"SET-001",label:"Regulator"},{k:"FINS",id:null,label:"Apeks Rk3 M"},{k:"WS",id:null,label:"Cressi 5mm Shorty M"},{k:"MASK",id:null,label:"Generic Snorkeling"}],
          gearStatus:"draft" },
        { id:"FK-000111", n:"Adrien", role:"Cust.", cert:"2 Star Diver (P2)", dives:36, gas:null, c0:5,
          gear:[{k:"BCD",id:"BCD-18",label:"Aqualung Wave L"},{k:"REG",id:"SET-004",label:"Regulator"},{k:"FINS",id:null,label:"Apeks Rk3 M"},{k:"WS",id:null,label:"Cressi 5mm Shorty M"},{k:"MASK",id:null,label:"Generic Black"}],
          gearStatus:"assigned" },
      ]}
    ],
  },
  {
    id:"5c48b4de", time:"15:00", title:"Pamilican Trip", site:"Pamilacan",
    boat:"Alma", divers:4, staff:0, dives:2,
    tanksLine:"9 (4× Air/12L · 2× Air/15L · 2× Nx40/12L) + 1 spare", spareReg:"1 (per group)", o2:1,
    groups:[
      { name:"Star Bull", guide:null, cap:4, divers:[
        { id:"FK-000087", n:"Hugo Leclercko", role:"Cust.", cert:"Advanced Open Water Diver", dives:120, gas:"Nx40", c0:2,
          gear:[{k:"BCD",id:"BCD-12",label:"Mares Rover L"},{k:"REG",id:"SET-002",label:"Regulator"},{k:"FINS",id:null,label:"Cressi Frog S"},{k:"WS",id:null,label:"Cressi 5mm Shorty M"},{k:"MASK",id:null,label:"Generic Black"}],
          gearStatus:"assigned" },
        { id:"FK-000099", n:"Hugo", role:"Cust.", cert:"1 Star Diver (P1)", dives:null, gas:null, c0:3,
          gear:[{k:"BCD",id:null,label:null},{k:"REG",id:null,label:null}], gearStatus:"empty" },
        { id:"FK-000102", n:"marie.lefevre@fake.almadiving", short:"marie.lefevre@fake…", role:"Cust.", cert:"Advanced Open Water Diver", dives:85, gas:null, c0:0,
          gear:[{k:"BCD",id:"BCD-24",label:"Zeepro Classic M"},{k:"REG",id:"SET-005",label:"Regulator"},{k:"FINS",id:null,label:"Cressi Frog S"},{k:"WS",id:null,label:"Cressi 3mm Integral S"},{k:"MASK",id:null,label:"Generic Black"}],
          gearStatus:"assigned" },
        { id:"FK-000108", n:"oliver.davies@fake.almadiving", short:"oliver.davies@fake.alma…", role:"Cust.", cert:"Open Water Diver", dives:42, gas:"15L", c0:4,
          gear:[{k:"BCD",id:"BCD-11",label:"Aqualung Wave L"},{k:"REG",id:"SET-001",label:"Regulator"},{k:"FINS",id:null,label:"Apeks Rk3 M"},{k:"WS",id:null,label:"Cressi 5mm Shorty M"},{k:"MASK",id:null,label:"Generic Snorkeling"}],
          gearStatus:"assigned" },
      ]}
    ],
  },
];

const TODAY_TRIPS = [
  { id:"76f97cf7", time:"06:45", title:"Pamilican Trip", site:"Pamilacan", boat:"Alma",
    departed:true, divers:0, staff:0, dives:3,
    groups:[{ name:"Star Bull", guide:null, cap:0, divers:[] }] },
  { id:"29396f3b", time:"09:00", title:"Test Dive 2", site:"Local (Arco)", boat:null,
    departed:true, divers:0, staff:0, dives:2,
    groups:[{ name:"Cube Rhea", guide:null, cap:0, divers:[] }] },
  { id:"c2255d38", time:"09:00", title:"Test Dive 3", site:"Deep Blue", boat:null,
    departed:true, divers:3, staff:0, dives:2,
    tanksLine:"7 (6× Air/12L) + 1 spare", spareReg:"1 (per group)", o2:1,
    groups:[{ name:"Star Canary", guide:null, cap:3, completed:3, divers:[
      { id:"FK-000087", n:"Hugo Leclercko", role:"Cust.", cert:"Advanced Open Water Diver", dives:120, c0:2,
        plannedDives:2, doneDives:2, gear:[], gearStatus:"none" },
      { id:"FK-000108", n:"oliver.davies@fake.almadiving", short:"oliver.davies@fake.alma…", role:"Cust.", cert:"Open Water Diver", dives:42, c0:4,
        plannedDives:2, doneDives:2,
        gear:[{k:"BCD",id:"BCD-13",label:"Mares Rover L"},{k:"REG",id:"SET-007",label:"Regulator"},{k:"FINS",id:null,label:"Apeks Rk3 M"},{k:"WS",id:null,label:"Cressi 5mm Shorty M"},{k:"MASK",id:null,label:"Generic Black"}],
        gearStatus:"draft" },
      { id:"DV-015C2537B3", n:"Dav B", role:"Cust.", cert:"Open Water Diver", dives:null, c0:1,
        plannedDives:2, doneDives:2,
        gear:[{k:"REG",id:"SET-008",label:"Regulator"},{k:"FINS",id:null,label:"Generic Black"}],
        gearStatus:"draft", warn:"No sizing data — BCD · Fins · Wetsuit" },
    ]}],
  },
];

const PAST_DAYS = [
  { iso:"08/05/2026", long:"Friday 08 May", trips:1, divers:0, staff:0, ready:true,
    snapshot:[{title:"Test Dive · Deep Blue", group:"Dodecagon Sloth (no divers)"}] },
  { iso:"07/05/2026", long:"Thursday 07 May", trips:2, divers:0, staff:0, ready:true,
    snapshot:[{title:"Pamilican Trip · Pamilacan",group:"Pentagon Ewe (no divers)"},{title:"Night Dive · Golden Rock",group:"No divers assigned"}] },
  { iso:"06/05/2026", long:"Wednesday 06 May", trips:3, divers:1, staff:0 },
  { iso:"05/05/2026", long:"Tuesday 05 May", trips:4, divers:2, staff:0 },
  { iso:"03/05/2026", long:"Sunday 03 May", trips:2, divers:20, staff:2 },
  { iso:"02/05/2026", long:"Saturday 02 May", trips:3, divers:3, staff:1 },
];

// Each kind has its own inventory. drafted = currently drafted for this pax.
// in-service items are intentionally absent from the dropdown (only available gear shown).
const GEAR_INVENTORY = {
  BCD: [
    { id:"BCD-24", left: 3, drafted: true },
    { id:"BCD-25", left: 2 },
    { id:"BCD-26", left: 1 },
  ],
  REG: [
    { id:"SET-007", left: 4, drafted: true },
    { id:"SET-008", left: 2 },
    { id:"SET-009", left: 1 },
  ],
  WETSUIT: [
    { id:"5mm · S",   left: 4 },
    { id:"5mm · M",   left: 3, drafted: true },
    { id:"5mm · L",   left: 2 },
  ],
  FINS: [
    { id:"Open · S",  left: 5 },
    { id:"Open · M",  left: 4, drafted: true },
    { id:"Open · L",  left: 3 },
  ],
  MASK: [
    { id:"one_size",  left: 12, drafted: true },
  ],
  TANK: [
    { id:"Air / 12L",      left: 8, drafted: true },
    { id:"Nitrox 32 / 12L", left: 4 },
  ],
};

// ----- Components ---------------------------------------------------------

function GearPill({ kind, id, label, mode }) {
  const cls = mode==="draft" ? "gear-pill gear-pill-draft" : "gear-pill gear-pill-assigned";
  return (
    <span className={cls}>
      <span className="gear-kind">{kind}</span>
      <span className="gear-id">{label || id || "—"}{id && label ? ` · ${id}` : ""}</span>
    </span>
  );
}

function GearRow({ diver, mode, onAssign }) {
  // mode: 'plan' | 'validation' | 'gear-draft' | 'gear-assigned'
  if (!diver.gear || diver.gear.length === 0) return null;
  // For 'plan' mode we show pills as-is per diver.gearStatus.
  // For 'gear-draft' tweak: force draft styling on planned-state divers.
  // For 'gear-assigned' tweak: force assigned styling.
  let pillMode = "assigned";
  if (mode === "gear-draft") pillMode = "draft";
  else if (mode === "gear-assigned") pillMode = "assigned";
  else pillMode = (diver.gearStatus === "draft") ? "draft" : "assigned";

  return (
    <div className="gear-row">
      {diver.warn && <span className="gear-warn">⚠ {diver.warn}</span>}
      {diver.gear.filter(g=>g.label||g.id).map((g,i)=>(
        <GearPill key={i} kind={g.k} id={g.id} label={g.label} mode={pillMode}/>
      ))}
    </div>
  );
}

function ValStrip({ planned, done, allOk, canceled, locked, onAllOk, onCancel, onPick }) {
  // Already-validated state: show a neutral pill with accomplished dive count.
  if (locked) {
    const accomplished = canceled ? 0 : (allOk ? planned : (done || 0));
    return (
      <span className="val-done-pill tabular" title="Dives accomplished">
        <span className="val-done-n">{accomplished}</span>
        <span className="val-done-k">dive{accomplished===1?"":"s"}</span>
      </span>
    );
  }
  const partial = !canceled && !allOk && (done || 0) > 0 && (done || 0) < planned;
  const squares = [];
  for (let i = 1; i <= planned; i++) {
    const filled = !canceled && !allOk && i <= (done || 0);
    squares.push(
      <button key={i}
        className={`val-square val-num ${filled?"done":""} ${filled && partial?"amber":""} ${filled && !partial?"green":""}`}
        onClick={()=>onPick && onPick(i)}>{i}</button>
    );
  }
  return (
    <div className="val-strip">
      <button className={`val-square val-cancel ${canceled?"done":""}`} onClick={onCancel} title="Trip canceled for this diver"><Icon name="x" size={11}/></button>
      {squares}
      <button className={`val-square val-allok ${allOk?"done":""}`} onClick={onAllOk} title="All dives went as planned"><Icon name="check" size={11}/></button>
    </div>
  );
}

function diverGearStatus(d, mode) {
  // Three states only:
  //   green check    -> all gear set / own gear
  //   amber stripes  -> gear partially set
  //   orange ?       -> gear not set AND/OR no sizing data (pulses)
  const status = d.gearStatus;
  const hasWarn = !!d.warn;
  if (hasWarn || status === "none" || status === "empty") {
    return { kind:"orange", glyph:"question", label:"Gear not set — sizing data missing" };
  }
  if (mode === "gear-assigned" || status === "assigned") {
    return { kind:"green", glyph:"check", label:"All gear set" };
  }
  return { kind:"amber", glyph:"stripes", label:"Gear partially set" };
}
function StatusGlyph({ glyph }) {
  if (glyph === "check") return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
  );
  if (glyph === "x") return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
  );
  if (glyph === "question") return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.4M12 18v.01"/></svg>
  );
  // stripes
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
      <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
      <line x1="4" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
      <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  );
}
function DiverRow({ d, mode, onOpenPanel, locked }) {
  const showVal = mode === "validation" && d.plannedDives;
  const showDives = !showVal && d.plannedDives;
  const st = diverGearStatus(d, mode);
  return (
    <div className={`diver-row diver-row-compact ${mode === "validation" ? "diver-locked" : ""}`}>
      <div className="diver-line">
        <button className={`diver-status diver-status-${st.kind} diver-status-${st.glyph}`} onClick={()=>onOpenPanel(d)} aria-label={st.label} title={st.label}>
          <StatusGlyph glyph={st.glyph}/>
        </button>
        <div className="diver-id">
          <div className="diver-name">
            <button className="diver-name-link" onClick={()=>onOpenPanel(d)}>{d.short || d.n}</button>
          </div>
          <div className="diver-meta">
            {d.cert && <span className="diver-cert">{d.cert}</span>}
            {d.cert && <span className="dim-sep">·</span>}
            <span className="diver-dives tabular">{(d.dives ?? 0)} dive{(d.dives ?? 0) === 1 ? "" : "s"}</span>
            {d.gas && <><span className="dim-sep">·</span><span className="diver-gas">{d.gas}</span></>}
            {d.warn && <><span className="dim-sep">·</span><span className="diver-warn-text">⚠ No sizing</span></>}
          </div>
        </div>
        <div className="diver-actions">
          {showVal && <ValStrip planned={d.plannedDives} done={d.doneDives ?? d.plannedDives} allOk={d.allOk ?? true} canceled={d.canceled} locked={locked}/>}
          {showDives && (
            <span className="diver-dives-planned"><span className="tabular">{d.plannedDives}</span><span className="dim">/</span><span className="tabular">{d.plannedDives}</span></span>
          )}
          {!showVal && (
            <button className="diver-gear-btn" onClick={()=>onOpenPanel(d)} title="Open equipment panel" aria-label="Open equipment panel">
              <Icon name="shirt" size={14}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function parseTanks(line) {
  const s = String(line||"");
  const m = s.match(/\(([^)]*)\)/);
  if (!m) return [];
  return m[1].split("\u00b7").map(x=>x.trim()).map(seg=>{
    const mm = seg.match(/(\d+)\u00d7\s*(.+)/) || seg.match(/(\d+)x\s*(.+)/i);
    return mm ? { n: parseInt(mm[1],10), k: mm[2].trim() } : null;
  }).filter(Boolean);
}
function parseSpare(line) {
  const m = String(line||"").match(/\+\s*(\d+)\s*spare/);
  return m ? parseInt(m[1],10) : 0;
}
function parseSpareRegN(s) {
  const m = String(s||"").match(/(\d+)/);
  return m ? m[1] : "1";
}

function TripCard({ trip, mode, onOpenPanel, locked }) {
  const totalPlanned = trip.groups.reduce((a,g)=>a + g.divers.reduce((b,d)=>b+(d.plannedDives||0),0), 0);
  const totalDone = trip.groups.reduce((a,g)=>a + g.divers.reduce((b,d)=>b+(d.doneDives||0),0), 0);
  return (
    <div className={`trip-card ${mode==="validation"?"trip-validation":""} ${locked?"trip-locked":""}`}>
      <div className="trip-head">
        <div className="trip-head-stamp">
          <span className="day-tag day-tag-trip">{trip.time}</span>
          <span className="trip-title-text">{trip.title}</span>
          <span className="trip-dives-pill tabular">{trip.dives} dive{trip.dives>1?"s":""}</span>
          {trip.site && <span className="trip-site-pill">{trip.site}</span>}
          {trip.departed && <span className="day-tag day-tag-ocean">DEPARTED</span>}
          {locked && <span className="day-tag day-tag-green">COMPLETED · LOCKED</span>}
        </div>

        {trip.tanksLine && (
          <div className="trip-stat-block">
            <div className="trip-tank-row">
              <span className="day-stat-label"><Icon name="tank" size={11}/> Tanks</span>
              {parseTanks(trip.tanksLine).map((t,i)=>(
                <span key={i} className="tank-pill"><span className="tank-n tabular">{t.n}×</span><span className="tank-k">{t.k}</span></span>
              ))}
              {parseSpare(trip.tanksLine) && (
                <span className="tank-pill tank-spare"><span className="tank-n tabular">{parseSpare(trip.tanksLine)}×</span><span className="tank-k">spare</span></span>
              )}
            </div>
            {trip.boat && (
              <div className="trip-boat-row">
                <span className="day-stat-label"><Icon name="boat" size={11}/> Boat</span>
                <span className="boat-pill">
                  <Icon name="boat" size={11}/>
                  <span className="boat-name">{trip.boat}</span>
                  <span className="boat-sep">·</span>
                  <span className="boat-stat tabular">×{parseSpareRegN(trip.spareReg)} spare regulators</span>
                  <span className="boat-sep">·</span>
                  <span className="boat-stat tabular">×{trip.o2} O₂ kit</span>
                </span>
              </div>
            )}
            <div className="trip-people-row">
              <span className="day-stat-label"><Icon name="users" size={11}/> People</span>
              <span className="people-pill"><span className="people-n tabular">{trip.groups.length}</span><span className="people-k">group{trip.groups.length>1?"s":""}</span></span>
              <span className="people-pill"><span className="people-n tabular">{trip.divers}</span><span className="people-k">pax</span></span>
              <span className="people-pill"><span className="people-n tabular">{trip.staff}</span><span className="people-k">staff</span></span>
            </div>
          </div>
        )}
      </div>

      {trip.groups.map((g,gi)=>(
        <div key={gi} className="trip-group">
          <div className="group-head">
            <div className="group-name">{g.name} <span className="muted-text">({g.guide ? "Guide: "+g.guide : "No guide"})</span></div>
            <div className="group-meta">
              {mode === "validation" && g.completed != null
                ? <span className="ok-text"><Icon name="check" size={11}/> {g.completed}/{g.cap} completed</span>
                : <span className="group-cap tabular">0/{g.cap}</span>
              }
            </div>
          </div>
          {g.divers.length === 0 && <div className="group-empty">No divers in this group</div>}
          {g.divers.map(d=>(
            <DiverRow key={d.id} d={d} mode={mode} onOpenPanel={onOpenPanel} locked={locked}/>
          ))}
        </div>
      ))}

      <div className="trip-foot">
        <div className="trip-foot-progress">
          {mode === "validation" && totalPlanned > 0 ? (
            <span className={totalDone === totalPlanned ? "ok-text" : "muted-text"}>
              <Icon name="check" size={11}/> {totalDone}/{totalPlanned} dives validated
            </span>
          ) : trip.divers === 0 ? (
            <span className="muted-text">0/0 ✓</span>
          ) : (
            <span className="ok-text"><Icon name="check" size={11}/> 0/{trip.divers} ready</span>
          )}
          <span className="dim-sep">·</span>
          <span className="muted-text">#{trip.id}</span>
        </div>
        <div className="flex gap-2">
          {mode === "validation" && !locked && (
            <button className="btn btn-primary btn-sm"><Icon name="check" size={11}/> Mark trip completed</button>
          )}
          {mode !== "validation" && <button className="btn btn-ghost btn-sm">Edit trip</button>}
        </div>
      </div>
    </div>
  );
}

function DayStats({ d }) {
  return (
    <div className="day-stats">
      <div className="day-stat-counters">
        <div className="day-stat"><span className="day-stat-label">Trips</span><span className="day-stat-value tabular">{d.trips}</span></div>
        <div className="day-stat"><span className="day-stat-label">Divers</span><span className="day-stat-value tabular">{d.divers}</span></div>
        <div className={`day-stat ${d.staff===0?"muted":""}`}><span className="day-stat-label">Staff</span><span className="day-stat-value tabular">{d.staff}</span></div>
      </div>
      <div className="day-stat-divider"></div>
      <div className="day-stat-block">
        <div className="day-tank-row">
          <span className="day-stat-label">Tanks</span>
          {d.tanks.map((t,i)=>(
            <span key={i} className="tank-pill"><span className="tank-n tabular">{t.n}×</span><span className="tank-k">{t.k}</span></span>
          ))}
          {d.spareTanks > 0 && <span className="tank-spare tabular">+{d.spareTanks} spare</span>}
        </div>
        <div className="day-boat-row">
          <span className="day-stat-label">Boats</span>
          {(d.boats || []).map((b,i)=>(
            <span key={i} className="boat-pill">
              <Icon name="boat" size={11}/>
              <span className="boat-name">{b.name}{b.trips>1 && <span className="boat-trips tabular"> ({b.trips} trips)</span>}</span>
              <span className="boat-sep">·</span>
              <span className="boat-stat tabular">×{b.spareRegs} spare regulators</span>
              <span className="boat-sep">·</span>
              <span className="boat-stat tabular">×{b.o2} O₂ kit</span>
            </span>
          ))}
        </div>
        <div className="day-equip-row">
          <span className="day-stat-label">Equipment</span>
          {(d.equip || []).map((g,i)=>(
            <span key={i} className="equip-pill">
              <span className="equip-n tabular">{g.n}</span>
              <span className="equip-k">{g.k}</span>
            </span>
          ))}
          {d.ready
            ? <span className="gear-ready"><Icon name="check" size={10}/> Equipment ready</span>
            : <span className="gear-short">⚠ Gear short</span>}
        </div>
      </div>
    </div>
  );
}

// One row per equipment kind. Renders the assigned item inline, with an
// edit icon that opens a dropdown of available inventory.
// Two states:
//  • unassigned → dropdown is open, header reads "Select…", drafted option marked with ★
//  • assigned   → dropdown closes, row collapses to: kind chip + selected id + edit icon
//                 clicking edit re-opens the dropdown
function GearField({ label, kind, options, initialSelected }) {
  const draftedOpt = options.find(o => o.drafted);
  const [selected, setSelected] = React.useState(initialSelected || null);
  const [open, setOpen] = React.useState(!initialSelected);
  return (
    <div className="gear-field">
      <div className="gear-field-label">{label}</div>
      <div className="gear-field-control">
        {selected && !open && (
          <button className="gear-field-input" onClick={()=>setOpen(true)}>
            <span className="gear-field-value">
              <span className="gear-pill-mini-kind">{kind}</span>
              <span className="tabular">{selected}</span>
            </span>
            <span className="gear-field-edit" aria-label="Change"><Icon name="edit" size={11}/></span>
          </button>
        )}
        {open && (
          <div className="gear-field-menu">
            <div className="gear-field-menu-head">
              <span className="gear-pill-mini-kind">{kind}</span>
              <span className="muted-text">Select…</span>
              {draftedOpt && <span className="gear-field-draft-mark">★ drafted</span>}
            </div>
            {options.map(o => (
              <button key={o.id}
                className={`gear-field-opt ${o.id === selected ? "active" : ""}`}
                onClick={()=>{ setSelected(o.id); setOpen(false); }}>
                <span className="gear-opt-star">{o.drafted ? "★" : ""}</span>
                <span className="gear-opt-id tabular">{o.id}</span>
                {o.drafted && <span className="gear-opt-tag">drafted</span>}
                <span className="gear-opt-stock muted-text tabular">{o.left} left</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Right pax panel with gear assignment dropdowns (open)
function PaxPanel({ pax, onClose, mode }) {
  return (
    <>
      <div className="pax-scrim" onClick={onClose}></div>
      <aside className="pax-panel" onClick={e=>e.stopPropagation()}>
        <div className="pax-head">
          <div>
            <div className="pax-name">{pax.short || pax.n}</div>
            <div className="pax-code tabular">{pax.id}</div>
          </div>
          <button className="pax-close" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        <div className="pax-section">
          <div className="pax-section-label">Certification</div>
          <div className="pax-cert-card">
            <div className="pax-cert-line">{pax.cert}</div>
            {pax.dives != null && <div className="pax-cert-meta tabular">{pax.dives} dives · Last: 20/12/2025</div>}
          </div>
        </div>

        <div className="pax-section">
          <div className="pax-section-label">
            Equipment assignment
            <span className="pax-section-hint">Tap a row to change</span>
          </div>

          <GearField label="BCD"       kind="BCD" options={GEAR_INVENTORY.BCD}     initialSelected="BCD-24" />
          <GearField label="Regulator" kind="REG" options={GEAR_INVENTORY.REG} />
          <GearField label="Wetsuit"   kind="WET" options={GEAR_INVENTORY.WETSUIT} initialSelected="5mm · M" />
          <GearField label="Fins"      kind="FIN" options={GEAR_INVENTORY.FINS}    initialSelected="Open · M" />
          <GearField label="Mask"      kind="MSK" options={GEAR_INVENTORY.MASK}    initialSelected="one_size" />
        </div>

        <div className="pax-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm"><Icon name="check" size={11}/> Save assignment</button>
        </div>
      </aside>
    </>
  );
}

function PastDayCard({ d, expanded, onToggle }) {
  return (
    <div className="past-day">
      <button className="past-day-head" onClick={onToggle}>
        <Icon name={expanded?"chevron_down":"chevron_right"} size={12}/>
        <span className="past-day-iso tabular">{d.iso}</span>
        <span className="past-day-label">{d.long}</span>
        <span className="past-day-stats">
          <span className="tabular">{d.trips}</span> trip · <span className="tabular">{d.divers}</span> diver · <span className="tabular">{d.staff}</span> staff
        </span>
        <span style={{marginLeft:"auto", display:"inline-flex", gap:8, alignItems:"center"}}>
          <span className="chip chip-green">LOCKED</span>
          <span className="muted-text" style={{fontSize:11}}>Print briefing</span>
        </span>
      </button>
      {expanded && d.snapshot && (
        <div className="past-day-body">
          {d.snapshot.map((s,i)=>(
            <div key={i} className="past-day-empty">{s.title} — {s.group}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----- Main page ---------------------------------------------------------

function PlanningPage() {
  const [mode, setMode] = React.useState("plan"); // plan | validation | gear-draft | gear-assigned
  const [columns, setColumns] = React.useState(2);
  // data-screen-label set on the wrapper <div> below — derived from mode.
  const [paxOpen, setPaxOpen] = React.useState(null);
  const [tomorrowOpen, setTomorrowOpen] = React.useState(true);
  const [todayOpen, setTodayOpen] = React.useState(true);
  const [pastOpen, setPastOpen] = React.useState(false);
  const [expandedPast, setExpandedPast] = React.useState({});

  // Auto-open the first pax in tomorrow trip when 'gear-assigned' or 'gear-draft' is on
  React.useEffect(() => {
    if (mode === "gear-draft" || mode === "gear-assigned") {
      const firstPax = TOMORROW_TRIPS[1].groups[0].divers[1]; // Hugo (no gear)
      setPaxOpen(firstPax);
    } else if (mode === "plan") {
      setPaxOpen(null);
    }
  }, [mode]);

  // Listen for state changes from the platform Tweaks panel
  React.useEffect(() => {
    const initial = (window.__almaPlanState) || null;
    if (initial) setMode(initial);
    const handler = e => { if (e && e.detail) setMode(e.detail); };
    window.addEventListener('alma-plan-state', handler);
    return () => window.removeEventListener('alma-plan-state', handler);
  }, []);

  return (
    <div data-screen-label={`Planning · ${mode === "validation" ? "Validate" : "Overview"}`}>
            <style>{`
        .val-strip { gap: 4px; }
        .val-square { background: var(--surface-1); border: 1px solid var(--surface-3); color: var(--ocean-700); transition: background 120ms, border-color 120ms, color 120ms; }
        .val-square:hover { border-color: var(--ocean-500); }
        /* Numbered dive squares */
        .val-square.val-num.done.amber { background: var(--amber-alert, #d97706); border-color: var(--amber-alert, #d97706); color: white; }
        .val-square.val-num.done.green { background: var(--safety-green, #15803d); border-color: var(--safety-green, #15803d); color: white; }
        /* All-OK check button */
        .val-square.val-allok { color: var(--safety-green); }
        .val-square.val-allok:hover { border-color: var(--safety-green); color: var(--safety-green); }
        .val-square.val-allok.done { background: var(--safety-green); border-color: var(--safety-green); color: white; }
        /* Cancel × button */
        .val-square.val-cancel { color: var(--red-critical, #dc2626); }
        .val-square.val-cancel:hover { border-color: var(--red-critical, #dc2626); color: var(--red-critical, #dc2626); }
        .val-square.val-cancel.done { background: var(--red-critical, #dc2626); border-color: var(--red-critical, #dc2626); color: white; }
        /* Validated pill */
        .val-done-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:6px; background: var(--surface-2); border: 1px solid var(--surface-3); color: var(--ocean-900); font-size: 12px; font-weight: 700; }
        .val-done-pill .val-done-n { font-weight: 800; }
        .val-done-pill .val-done-k { font-weight: 600; color: var(--ocean-700); }
      `}</style>

      {/* Page header */}
      <div className="page-head" style={{marginBottom:18, alignItems:"flex-start"}}>
        <div>
          <h1 className="page-title">Overview</h1>
          <div className="page-sub">Prep tomorrow's trips · validate today's deliveries</div>
        </div>
        <div className="page-actions">
          <span style={{fontSize:11, color:"var(--ocean-700)", opacity:0.65, fontWeight:600, fontFamily:"var(--font-ui)", letterSpacing:"0.04em", textTransform:"uppercase"}}>Columns</span>
          <div className="seg">
            {[2,3,4,5].map(n=>(
              <button key={n} className={columns===n?"active":""} onClick={()=>setColumns(n)}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* TOMORROW — primary focus of the page */}
      <div className="day-block">
        <div className="day-head">
          <div className="day-head-top">
            <div className="day-head-stamp">
              <button onClick={()=>setTomorrowOpen(!tomorrowOpen)} style={{background:0,border:0,cursor:"pointer",padding:0,display:"inline-flex"}}>
                <Icon name={tomorrowOpen?"chevron_down":"chevron_right"} size={14}/>
              </button>
              <span className="day-tag day-tag-ocean">TOMORROW</span>
              <span className="day-date tabular">{TOMORROW.iso}</span>
            </div>
            <div className="day-head-actions">
              <button className="btn btn-primary btn-sm"><Icon name="check" size={12}/> Validate gear assignments</button>
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Print briefing</button>
            </div>
          </div>
          <DayStats d={TOMORROW}/>
        </div>

        {tomorrowOpen && (
          <div className="trip-grid" style={{gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`}}>
            {TOMORROW_TRIPS.map(t => (
              <TripCard key={t.id} trip={t} mode={mode === "validation" ? "plan" : mode} onOpenPanel={setPaxOpen}/>
            ))}
          </div>
        )}
      </div>

      {/* TODAY — meant for use in validation mode */}
      <div className="day-block">
        <div className="day-head">
          <div className="day-head-top">
            <div className="day-head-stamp">
              <button onClick={()=>setTodayOpen(!todayOpen)} style={{background:0,border:0,cursor:"pointer",padding:0,display:"inline-flex"}}>
                <Icon name={todayOpen?"chevron_down":"chevron_right"} size={14}/>
              </button>
              <span className="day-tag day-tag-amber">TODAY</span>
              <span className="day-date tabular">{TODAY.iso}</span>
            </div>
            <div className="day-head-actions">
              {mode === "validation"
                ? <span className="chip chip-ocean" style={{padding:"4px 10px",fontSize:11}}>VALIDATION MODE</span>
                : <button className="btn btn-secondary btn-sm" onClick={()=>setMode("validation")}><Icon name="check" size={12}/> Enter validation mode</button>}
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Print briefing</button>
            </div>
          </div>
          <DayStats d={TODAY}/>
        </div>

        {todayOpen && (
          <div className="trip-grid" style={{gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`}}>
            {TODAY_TRIPS.map(t => (
              <TripCard key={t.id} trip={t} mode={mode === "validation" ? "validation" : "plan"} onOpenPanel={setPaxOpen}/>
            ))}
          </div>
        )}
      </div>

      {/* PAST */}
      <div className="past-block">
        <button className="past-toggle" onClick={()=>setPastOpen(!pastOpen)}>
          <Icon name={pastOpen?"chevron_down":"chevron_right"} size={14}/>
          <span className="past-toggle-label">Past · 6 days</span>
          <span className="past-toggle-meta">26 divers · all locked</span>
        </button>
        {pastOpen && (
          <div className="past-list">
            {PAST_DAYS.map(d => (
              <PastDayCard key={d.iso} d={d} expanded={!!expandedPast[d.iso]} onToggle={()=>setExpandedPast({...expandedPast, [d.iso]: !expandedPast[d.iso]})}/>
            ))}
          </div>
        )}
      </div>

      {paxOpen && <PaxPanel pax={paxOpen} mode={mode} onClose={()=>setPaxOpen(null)}/>}
    </div>
  );
}

window.PlanningPage = PlanningPage;