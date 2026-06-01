const { Icon } = window;

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
  { iso:"07/05/2026", long:"Thursday 07 May", trips:2, divers:0, staff:0, ready:true,
    snapshot:[{title:"Pamilican Trip · Pamilacan",group:"Pentagon Ewe (no divers)"},{title:"Night Dive · Golden Rock",group:"No divers assigned"}] },
  { iso:"06/05/2026", long:"Wednesday 06 May", trips:3, divers:1, staff:0 },
  { iso:"05/05/2026", long:"Tuesday 05 May", trips:4, divers:2, staff:0 },
  { iso:"03/05/2026", long:"Sunday 03 May", trips:2, divers:20, staff:2 },
  { iso:"02/05/2026", long:"Saturday 02 May", trips:3, divers:3, staff:1 },
];

/* ============================================================
   SPEC ADDITIONS (do not exist in page-planning.locked.jsx) — these
   clone TOMORROW's trip data to fake content for Today + Yesterday
   so the three lifecycle states can be visualised in one document.
   ============================================================ */

// Inject `plannedDives` into every diver of a TOMORROW trip clone
// (TOMORROW divers don't carry plannedDives — it's a property only used
// by the validation/locked states.)
function cloneTomorrowTrips(suffix, decorate) {
  return TOMORROW_TRIPS.map(t => ({
    ...t,
    id: t.id + suffix,
    groups: t.groups.map(g => ({
      ...g,
      divers: g.divers.map((d, i) => decorate({ ...d, plannedDives: t.dives }, i, t)),
    })),
  }));
}

// TODAY — validation mode in progress. Operator has resolved some divers,
// not others. Mix: full ✓ · partial · awaiting · cancelled.
const TODAY_PICKS = {
  "7517b4dc": ["full", "partial-2", null, "partial-1", "cancel", "full"],
  "5c48b4de": ["full", "partial-1", null, "cancel"],
};
const TODAY_TRIPS_SPEC = cloneTomorrowTrips("-today", (d, i, t) => {
  const pick = TODAY_PICKS[t.id]?.[i] ?? null;
  if (pick === "full")    return { ...d, allOk: true };
  if (pick === "cancel")  return { ...d, canceled: true };
  if (pick && pick.startsWith("partial-")) {
    return { ...d, doneDives: parseInt(pick.split("-")[1], 10), allOk: false };
  }
  return { ...d, allOk: false }; // awaiting operator decision — strip is interactive
});

// YESTERDAY — validation resolved. Used as the FIRST entry of PAST_FULL_DAYS
// (see below). Yesterday belongs to the past-days section; this const stays
// here only as a building block for that array.
const YESTERDAY = {
  iso: "08/05/2026", long: "Friday 08 May 2026",
  trips: TOMORROW.trips, divers: TOMORROW.divers, staff: TOMORROW.staff,
  tanks: TOMORROW.tanks, spareTanks: TOMORROW.spareTanks,
  spareRegs: TOMORROW.spareRegs, o2kits: TOMORROW.o2kits,
  almaPax: TOMORROW.almaPax, almaGroups: TOMORROW.almaGroups,
  boats: TOMORROW.boats, equip: TOMORROW.equip, ready: TOMORROW.ready,
};
const YESTERDAY_OUTCOMES = {
  "7517b4dc": ["full", "partial-2", "full", "partial-1", "cancel", "full"],
  "5c48b4de": ["full", "partial-1", "full", "cancel"],
};
const YESTERDAY_TRIPS = cloneTomorrowTrips("-yest", (d, i, t) => {
  const out = YESTERDAY_OUTCOMES[t.id]?.[i] ?? "full";
  if (out === "full")   return { ...d, allOk: true };
  if (out === "cancel") return { ...d, canceled: true };
  if (out.startsWith("partial-")) {
    return { ...d, doneDives: parseInt(out.split("-")[1], 10), allOk: false };
  }
  return { ...d, allOk: true };
});

// PAST_FULL_DAYS — each past day rendered as a full day card (same design as
// the Yesterday card). Yesterday is the most recent past day.
function makePastDay({ iso, long, label, suffix, outcomes }) {
  const tripCards = cloneTomorrowTrips(suffix, (d, i, t) => {
    const out = outcomes[t.id]?.[i] ?? "full";
    if (out === "full")   return { ...d, allOk: true };
    if (out === "cancel") return { ...d, canceled: true };
    if (out.startsWith("partial-")) {
      return { ...d, doneDives: parseInt(out.split("-")[1], 10), allOk: false };
    }
    return { ...d, allOk: true };
  });
  return {
    iso, long, label,
    trips: TOMORROW.trips, divers: TOMORROW.divers, staff: TOMORROW.staff,
    tanks: TOMORROW.tanks, spareTanks: TOMORROW.spareTanks,
    spareRegs: TOMORROW.spareRegs, o2kits: TOMORROW.o2kits,
    boats: TOMORROW.boats, equip: TOMORROW.equip, ready: TOMORROW.ready,
    tripCards,
  };
}

const PAST_FULL_DAYS = [
  { ...YESTERDAY, label: "YESTERDAY", tripCards: YESTERDAY_TRIPS },
  makePastDay({
    iso: "07/05/2026", long: "Thursday 07 May 2026", label: "THU 07 MAY", suffix: "-d2",
    outcomes: {
      "7517b4dc": ["full","full","full","partial-2","full","cancel"],
      "5c48b4de": ["full","partial-1","full","full"],
    },
  }),
  makePastDay({
    iso: "06/05/2026", long: "Wednesday 06 May 2026", label: "WED 06 MAY", suffix: "-d3",
    outcomes: {
      "7517b4dc": ["full","full","partial-2","full","full","full"],
      "5c48b4de": ["full","full","cancel","full"],
    },
  }),
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
  // ─── Resolved state (whole day locked) → colour-coded pill ───────────
  //   canceled → red   "× Cancelled"
  //   allOk    → green "N/N ✓"
  //   partial  → amber "N/M"
  if (locked) {
    if (canceled) {
      return (
        <span className="vs-resolved vs-r-cancel" title="Trip cancelled for this diver">
          <Icon name="x" size={11}/>
          <span>Cancelled</span>
        </span>
      );
    }
    if (allOk) {
      return (
        <span className="vs-resolved vs-r-full tabular" title="All planned dives accomplished">
          <Icon name="check" size={11}/>
          <span>{planned}/{planned}</span>
        </span>
      );
    }
    return (
      <span className="vs-resolved vs-r-partial tabular" title="Partial outcome">
        <span>{done || 0}/{planned}</span>
      </span>
    );
  }

  // ─── Interactive state (validation in progress) ──────────────────────
  //   Layout:  × │ 1 │ … │ N-1 │ ✓     (N-1 middle squares for N planned dives)
  //   Single-select.  pick: 'cancel' | int 1..N-1 | 'full' | null
  const pick =
    canceled                                         ? "cancel"
  : allOk                                            ? "full"
  : (typeof done === "number" && done > 0 && done < planned) ? done
  :                                                    null;
  const hasPick = pick != null;
  const middleCount = Math.max(planned - 1, 0);

  return (
    <div className={`vs-strip ${hasPick ? "vs-strip-muted" : ""}`}>
      <button
        className={`vs vs-x ${pick === "cancel" ? "vs-selected" : ""}`}
        onClick={onCancel}
        title="Cancel / no-show">
        <Icon name="x" size={11}/>
      </button>
      {Array.from({ length: middleCount }).map((_, idx) => {
        const n = idx + 1;
        const selected = pick === n;
        return (
          <button key={n}
            className={`vs ${selected ? "vs-pick vs-selected" : ""}`}
            onClick={() => onPick && onPick(n)}>
            <span>{n}</span>
          </button>
        );
      })}
      <button
        className={`vs vs-check ${pick === "full" ? "vs-selected" : ""}`}
        onClick={onAllOk}
        title="All planned dives accomplished">
        <Icon name="check" size={11}/>
      </button>
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
          {d.spareTanks > 0 && <span className="tank-spare tabular">+{d.spareTanks} spare{d.spareTanks !== 1 ? "s" : ""}</span>}
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
          {d.spareRegs > 0 && (
            <span className="tank-spare tabular">+{d.spareRegs} spare reg{d.spareRegs !== 1 ? "s" : ""}</span>
          )}
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
  // Hardcoded states (no mode state, no tweaks):
  //   Tomorrow  → plan        (gear assignment phase)
  //   Today     → validation  (mode engaged, strips interactive)
  //   Yesterday → validation+locked  (resolved, every row collapses to coloured pill)
  const [columns, setColumns] = React.useState(2);
  const [paxOpen, setPaxOpen] = React.useState(null);
  const [tomorrowOpen, setTomorrowOpen] = React.useState(true);
  const [todayOpen, setTodayOpen] = React.useState(true);
  const [pastOpen, setPastOpen] = React.useState(true);
  const [expandedPast, setExpandedPast] = React.useState({});

  return (
    <div data-screen-label="Planning · Dashboard">
            <style>{`
        /* ============================================================
           VALIDATION SQUARES — spec from §Validation squares in Components Review
           Layout: × │ 1 │ … │ N-1 │ ✓  —  single-select.
           ============================================================ */
        .vs-strip { display: inline-flex; align-items: center; gap: 5px; }
        .vs-strip.vs-strip-muted .vs:not(.vs-selected) { opacity: 0.45; }
        .vs {
          width: 24px; height: 24px; border-radius: 5px;
          border: 1.5px solid var(--surface-3); background: var(--surface-1);
          display: grid; place-items: center;
          font-family: var(--font-ui); font-weight: 800; font-size: 10.5px;
          color: var(--ocean-700);
          cursor: pointer; transition: all 120ms;
          flex-shrink: 0; padding: 0;
        }
        .vs:hover { border-color: var(--ocean-500); color: var(--ocean-500); }
        /* × anchor — soft red tint at rest */
        .vs.vs-x { background: var(--red-critical-bg); border-color: rgba(220, 38, 38, 0.35); color: var(--red-critical); }
        .vs.vs-x:hover { border-color: var(--red-critical); }
        /* ✓ anchor — soft green tint at rest */
        .vs.vs-check { background: var(--safety-green-bg); border-color: rgba(22, 163, 74, 0.35); color: var(--safety-green); }
        .vs.vs-check:hover { border-color: var(--safety-green); }
        /* Selected — solid fill in the square's tone + 2px ring */
        .vs.vs-selected { box-shadow: 0 0 0 2px var(--surface-1), 0 0 0 3.5px currentColor; }
        .vs.vs-x.vs-selected     { background: var(--red-critical);  border-color: var(--red-critical);  color: var(--red-critical); }
        .vs.vs-x.vs-selected svg { color: white; }
        .vs.vs-check.vs-selected     { background: var(--safety-green); border-color: var(--safety-green); color: var(--safety-green); }
        .vs.vs-check.vs-selected svg { color: white; }
        /* Middle picked (partial outcome) — amber */
        .vs.vs-pick { background: var(--amber-alert); border-color: var(--amber-alert); color: var(--amber-alert); }
        .vs.vs-pick > span { color: white; }

        /* ============================================================
           RESOLVED PILL — spec from §Validation squares in Components Review
           ============================================================ */
        .vs-resolved {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 9px; border-radius: 6px;
          font-family: var(--font-ui); font-weight: 700; font-size: 11.5px;
          font-variant-numeric: tabular-nums; font-feature-settings: "tnum";
        }
        .vs-resolved.vs-r-full    { background: var(--safety-green-bg); color: var(--safety-green); }
        .vs-resolved.vs-r-partial { background: var(--amber-alert-bg);  color: var(--amber-alert); }
        .vs-resolved.vs-r-cancel  { background: var(--red-critical-bg); color: var(--red-critical); }
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

      {/* TOMORROW — gear assignment phase (header has "Validate gear assignments" CTA) */}
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
              <TripCard key={t.id} trip={t} mode="plan" onOpenPanel={setPaxOpen}/>
            ))}
          </div>
        )}
      </div>

      {/* TODAY — validation mode engaged (no toggle, strips interactive per row) */}
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
              <span className="chip chip-ocean" style={{padding:"4px 10px",fontSize:11}}>VALIDATION MODE</span>
              <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Print briefing</button>
            </div>
          </div>
          <DayStats d={TODAY}/>
        </div>

        {todayOpen && (
          <div className="trip-grid" style={{gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`}}>
            {TODAY_TRIPS_SPEC.map(t => (
              <TripCard key={t.id} trip={t} mode="validation" onOpenPanel={setPaxOpen}/>
            ))}
          </div>
        )}
      </div>

      {/* YESTERDAY + older past days — collapsed history, each day rendered as
          a full day card (same design as Yesterday). */}
      <div className="past-block">
        <button className="past-toggle" onClick={()=>setPastOpen(!pastOpen)}>
          <Icon name={pastOpen?"chevron_down":"chevron_right"} size={14}/>
          <span className="past-toggle-label">Past · {PAST_FULL_DAYS.length} days</span>
          <span className="past-toggle-meta">all locked</span>
        </button>
        {pastOpen && PAST_FULL_DAYS.map((day, i) => {
          const open = expandedPast[day.iso] ?? (i === 0); // yesterday open by default
          return (
            <div key={day.iso} className="day-block" style={{ marginTop: 14 }}>
              <div className="day-head">
                <div className="day-head-top">
                  <div className="day-head-stamp">
                    <button onClick={()=>setExpandedPast({...expandedPast, [day.iso]: !open})} style={{background:0,border:0,cursor:"pointer",padding:0,display:"inline-flex"}}>
                      <Icon name={open?"chevron_down":"chevron_right"} size={14}/>
                    </button>
                    <span className="day-tag day-tag-neutral">{day.label}</span>
                    <span className="day-date tabular">{day.iso}</span>
                  </div>
                  <div className="day-head-actions">
                    <span className="chip chip-green" style={{padding:"4px 10px",fontSize:11}}><Icon name="lock" size={10}/> DAY LOCKED</span>
                    <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Print briefing</button>
                  </div>
                </div>
                <DayStats d={day}/>
              </div>
              {open && (
                <div className="trip-grid" style={{gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`}}>
                  {day.tripCards.map(t => (
                    <TripCard key={t.id} trip={t} mode="validation" locked={true} onOpenPanel={setPaxOpen}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {paxOpen && <PaxPanel pax={paxOpen} mode="plan" onClose={()=>setPaxOpen(null)}/>}
    </div>
  );
}

window.PlanningPage = PlanningPage;