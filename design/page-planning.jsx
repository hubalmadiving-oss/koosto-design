// =============================================================
// PLANNING DASHBOARD — TOMORROW · TODAY · PAST
// Three-level info: Day → Trip → Diver (+ gear pills).
// Tomorrow = plan gear · Today = validate · Past = locked.
// =============================================================

// -------- mock data --------
const G = (kind, id) => ({ kind, id });

const TOMORROW = {
  label: "Tomorrow", date: "Sun · 10 May 2026", iso: "10/05/2026",
  totals: { trips: 2, divers: 10, groups: 2, boats: 2, staff: 0, dives: 5 },
  tanks: [{ k: "Air 12L", n: 22 }, { k: "Air 15L", n: 2 }, { k: "Nx40 12L", n: 2 }],
  spareTanks: 3, spareRegs: 2, o2: 1, status: "ready",
  trips: [
    {
      id: "t1", time: "06:45", name: "Pamilican Trip", site: "Pamilacan", boat: "Alma",
      pax: 6, staff: 0, dives: 3,
      tanks: [{ k: "Air 12L", n: 18 }], spareTanks: 2, spareRegs: 1, o2: 1,
      groups: [{
        name: "Kite Kangaroo", guide: null, cap: 6,
        divers: [
          { id: "marie", in: "M", c0: 0, name: "Marie Lefevre", handle: "marie.lefevre", role: "Cust", cert: "AOWD", dives: 85, planned: 3, done: 0,
            gear: [G("BCD","BCD-24"), G("REG","SET-005"), G("FINS","Cressi Frog S"), G("SUIT","Cressi 3mm Integral S"), G("MASK","Generic Black")] },
          { id: "davb", in: "D", c0: 1, name: "Dav B", role: "Cust", cert: null, dives: 0, planned: 3, done: 0,
            gear: [G("BCD","BCD-G"), G("BCD","BCD-21"), G("REG","SET-003"), G("FINS","Apeks Rk3 M"), G("SUIT","Cressi 3mm Integral S"), G("MASK","Generic Snorkeling")] },
          { id: "leclercko", in: "H", c0: 2, name: "Hugo Leclercko", role: "Cust", cert: "AOWD", dives: 120, planned: 3, done: 0, gear: [] },
          { id: "hugo", in: "H", c0: 3, name: "Hugo", role: "Cust", cert: null, dives: 0, planned: 3, done: 0,
            gear: [G("BCD","BCD-12"), G("REG","SET-002"), G("FINS","Cressi Frog S"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Black")] },
          { id: "oliver", in: "O", c0: 4, name: "Oliver Davies", handle: "oliver.davies", role: "Cust", cert: "OWD", dives: 42, planned: 3, done: 0,
            gear: [G("BCD","BCD-11"), G("REG","SET-001"), G("FINS","Apeks Rk3 M"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Snorkeling")] },
          { id: "adrien", in: "A", c0: 5, name: "Adrien", role: "Cust", cert: "P2", certFull: "2 Star Diver", dives: 36, planned: 3, done: 0,
            gear: [G("BCD","BCD-18"), G("REG","SET-004"), G("FINS","Apeks Rk3 M"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Black")] },
        ]
      }]
    },
    {
      id: "t2", time: "15:00", name: "Pamilican Trip", site: "Pamilacan", boat: "Alma",
      pax: 4, staff: 0, dives: 2,
      tanks: [{ k: "Air 12L", n: 4 }, { k: "Air 15L", n: 2 }, { k: "Nx40 12L", n: 2 }], spareTanks: 1, spareRegs: 1, o2: 1,
      groups: [{
        name: "Star Bull", guide: null, cap: 4,
        divers: [
          { id: "leclercko", in: "H", c0: 2, name: "Hugo Leclercko", role: "Cust", cert: "AOWD", dives: 120, planned: 2, done: 0, gas: "Nx40",
            gear: [G("BCD","BCD-12"), G("REG","SET-002"), G("FINS","Cressi Frog S"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Black")] },
          { id: "hugo", in: "H", c0: 3, name: "Hugo", role: "Cust", cert: null, dives: 0, planned: 2, done: 0, gear: [] },
          { id: "marie2", in: "M", c0: 0, name: "Marie Lefevre", handle: "marie.lefevre", role: "Cust", cert: "AOWD", dives: 85, planned: 2, done: 0,
            gear: [G("BCD","BCD-24"), G("REG","SET-005"), G("FINS","Cressi Frog S"), G("SUIT","Cressi 3mm Integral S"), G("MASK","Generic Black")] },
          { id: "oliver2", in: "O", c0: 4, name: "Oliver Davies", handle: "oliver.davies", role: "Cust", cert: "OWD", dives: 42, planned: 2, done: 0, tank: 15,
            gear: [G("BCD","BCD-11"), G("REG","SET-001"), G("FINS","Apeks Rk3 M"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Snorkeling")] },
        ]
      }]
    }
  ]
};

const TODAY = {
  label: "Today", date: "Sat · 09 May 2026", iso: "09/05/2026",
  totals: { trips: 3, divers: 3, groups: 3, boats: 3, staff: 0, dives: 7 },
  tanks: [{ k: "Air 12L", n: 6 }],
  spareTanks: 1, spareRegs: 3, o2: 1, status: "ready",
  trips: [
    {
      id: "td1", time: "06:45", name: "Pamilican Trip", site: "Pamilacan", boat: "Alma",
      pax: 0, staff: 0, dives: 3, departed: true,
      tanks: [], spareTanks: 0, spareRegs: 0, o2: 0,
      groups: [{ name: "Star Bull", guide: null, cap: 0, empty: true, divers: [] }]
    },
    {
      id: "td2", time: "09:00", name: "Test Dive 2", site: "Local (Arco)", boat: null,
      pax: 0, staff: 0, dives: 2, departed: true,
      tanks: [], spareTanks: 0, spareRegs: 0, o2: 0,
      groups: [{ name: "Cube Rhea", guide: null, cap: 0, empty: true, divers: [] }]
    },
    {
      id: "td3", time: "09:00", name: "Test Dive 3", site: "Deep Blue", boat: null,
      pax: 3, staff: 0, dives: 2, departed: true,
      tanks: [{ k: "Air 12L", n: 6 }], spareTanks: 1, spareRegs: 1, o2: 1,
      groups: [{
        name: "Star Canary", guide: null, cap: 3,
        divers: [
          { id: "leclercko-t", in: "H", c0: 2, name: "Hugo Leclercko", role: "Cust", cert: "AOWD", dives: 120, planned: 2, done: 2,
            gear: [G("BCD","BCD-13"), G("REG","SET-007"), G("FINS","Apeks Rk3 M"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Black")] },
          { id: "oliver-t", in: "O", c0: 4, name: "Oliver Davies", handle: "oliver.davies", role: "Cust", cert: "OWD", dives: 42, planned: 2, done: 2,
            gear: [G("BCD","BCD-13"), G("REG","SET-007"), G("FINS","Apeks Rk3 M"), G("SUIT","Cressi 5mm Shorty M"), G("MASK","Generic Black")] },
          { id: "davb-t", in: "D", c0: 1, name: "Dav B", role: "Cust", cert: null, dives: 0, planned: 2, done: 2, noSizing: true,
            gear: [G("REG","SET-008"), G("MASK","Generic Black")] },
        ]
      }]
    }
  ]
};

const PAST = [
  { iso: "08/05/2026", label: "Fri · 08 May", trips: 1, divers: 0, staff: 0, validated: false },
  { iso: "07/05/2026", label: "Thu · 07 May", trips: 2, divers: 0, staff: 0, validated: false },
  { iso: "06/05/2026", label: "Wed · 06 May", trips: 3, divers: 1, staff: 0, validated: true },
  { iso: "05/05/2026", label: "Tue · 05 May", trips: 4, divers: 2, staff: 0, validated: true },
  { iso: "03/05/2026", label: "Sun · 03 May", trips: 2, divers: 20, staff: 2, validated: true },
  { iso: "02/05/2026", label: "Sat · 02 May", trips: 3, divers: 3, staff: 1, validated: true },
];

// inventory mock for the right panel
const INVENTORY = {
  BCD: [{ id: "BCD-24", drafted: true }, { id: "BCD-11", drafted: false }, { id: "BCD-12", drafted: false }, { id: "BCD-G", drafted: false }, { id: "BCD-18", drafted: false }],
  REG: [{ id: "SET-005", drafted: true }, { id: "SET-007", drafted: false }, { id: "SET-008", drafted: false }, { id: "SET-009", drafted: false }, { id: "SET-010", drafted: false }],
  FINS: [{ id: "Cressi Frog S", drafted: true }, { id: "Cressi Frog M", drafted: false }, { id: "Apeks Rk3 M", drafted: false }, { id: "Apeks Rk3 L", drafted: false }],
  SUIT: [{ id: "Cressi 3mm Integral S", drafted: true }, { id: "Cressi 3mm Integral M", drafted: false }, { id: "Cressi 5mm Shorty M", drafted: false }],
  MASK: [{ id: "Generic Black", drafted: true }, { id: "Generic Snorkeling", drafted: false }, { id: "Cressi Mask", drafted: false }],
};

// =============================================================
function PlanningPage({ tweaks: t, setTweak }) {
  const validation = t.planningView === "validation";
  const gearMode = t.planningGear || "draft";
  const paxOpen = !!t.planningPaxOpen;
  const cols = Number(t.planningCols) || 2;

  const [pastOpen, setPastOpen] = React.useState(true);
  const [openDay, setOpenDay] = React.useState({ "08/05/2026": true, "07/05/2026": false });

  const [tripDone, setTripDone] = React.useState({});
  const [dayValidated, setDayValidated] = React.useState(false);

  const onPax = () => setTweak("planningPaxOpen", true);

  return (
    <div style={{ position: "relative" }}>
      <PageHeader cols={cols} setCols={(n) => setTweak("planningCols", n)} />

      <DayBlock
        day={TOMORROW} when="tomorrow" validation={false}
        gearMode={gearMode} cols={cols} onPax={onPax}
        action={null}
      />

      <DayBlock
        day={TODAY} when="today" validation={validation}
        gearMode="assigned" cols={cols} onPax={onPax}
        tripDone={tripDone} setTripDone={setTripDone}
        dayValidated={dayValidated} setDayValidated={setDayValidated}
        onToggleValidation={() => setTweak("planningView", validation ? "default" : "validation")}
      />

      <PastBlock open={pastOpen} setOpen={setPastOpen}
        days={PAST} openDay={openDay} setOpenDay={setOpenDay} cols={cols} />

      {paxOpen && (
        <PaxPanel
          gearMode={gearMode}
          setGearMode={(v) => setTweak("planningGear", v)}
          onClose={() => setTweak("planningPaxOpen", false)}
        />
      )}
    </div>
  );
}

// -------- header --------
function PageHeader({ cols, setCols }) {
  return (
    <div className="page-head" style={{ marginBottom: 14 }}>
      <div>
        <h1 className="page-title">Overview</h1>
        <div className="page-sub">Prepare tomorrow · validate today · review the past week</div>
      </div>
      <div className="page-actions">
        <div className="seg" title="Trip cards per row">
          {[2, 3, 4, 5].map(n => (
            <button key={n} className={cols === n ? "active" : ""} onClick={() => setCols(n)}>{n}</button>
          ))}
        </div>
        <button className="btn btn-secondary"><Icon name="filter" size={14} /> Filter</button>
        <button className="btn btn-secondary"><Icon name="calendar" size={14} /> Today</button>
      </div>
    </div>
  );
}

// -------- day block --------
function DayBlock({ day, when, validation, gearMode, cols, onPax, action,
                    tripDone, setTripDone, dayValidated, setDayValidated, onToggleValidation }) {
  const isToday = when === "today";
  const isTomorrow = when === "tomorrow";
  const accent = isTomorrow ? "ocean" : isToday ? "amber" : "neutral";

  return (
    <section className={`day-block day-${when} mb-4`}>
      <div className="day-head">
        <div className="day-head-top">
          <div className="day-head-stamp">
            <span className={`day-tag day-tag-${accent}`}>{day.label.toUpperCase()}</span>
            <span className="day-date tabular">{day.iso}</span>
            <span className="day-date-long">{day.date}</span>
          </div>
          <div className="day-head-actions">
            {isToday && (
              <button
                className={`btn ${validation ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={onToggleValidation}>
                <Icon name={validation ? "check" : "edit"} size={12} />
                {validation ? "Validation mode active" : "Enter validation mode"}
              </button>
            )}
            {isToday && validation && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDayValidated(!dayValidated)}>
                <Icon name={dayValidated ? "lock" : "check"} size={12} />
                {dayValidated ? "Day locked" : "Lock day · all complete"}
              </button>
            )}
            <button className="btn btn-ghost btn-sm"><Icon name="bookings" size={12} /> Print briefing</button>
          </div>
        </div>

        <div className="day-stats">
          <DayStat label="Trips" value={day.totals.trips} />
          <DayStat label="Divers" value={day.totals.divers} />
          <DayStat label="Groups" value={day.totals.groups} />
          <DayStat label="Boats" value={day.totals.boats} />
          <DayStat label="Staff" value={day.totals.staff} muted={day.totals.staff === 0} />
          <DayStat label="Dives" value={day.totals.dives} />
          <div className="day-stat-divider" />
          <TankBreakdown tanks={day.tanks} spare={day.spareTanks} />
          <div className="day-stat-divider" />
          <GearStrip spareRegs={day.spareRegs} o2={day.o2} status={day.status} />
        </div>
      </div>

      <div className="trip-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {day.trips.map(trip => (
          <TripCard key={trip.id} trip={trip} validation={validation && isToday}
            gearMode={gearMode} onPax={onPax}
            locked={dayValidated || (tripDone && tripDone[trip.id])}
            tripDone={tripDone && tripDone[trip.id]}
            onToggleTripDone={() => setTripDone && setTripDone({ ...tripDone, [trip.id]: !tripDone[trip.id] })}
            isToday={isToday} />
        ))}
      </div>
    </section>
  );
}

// -------- day stats --------
function DayStat({ label, value, muted }) {
  return (
    <div className={`day-stat ${muted ? "muted" : ""}`}>
      <div className="day-stat-label">{label}</div>
      <div className="day-stat-value tabular">{value}</div>
    </div>
  );
}

function TankBreakdown({ tanks, spare }) {
  return (
    <div className="day-stat-block">
      <div className="day-stat-label">Tanks</div>
      <div className="day-tank-row">
        {tanks.length === 0 ? <span className="muted-text">—</span> : tanks.map((t, i) => (
          <span key={i} className="tank-pill">
            <span className="tank-n tabular">{t.n}×</span>
            <span className="tank-k">{t.k}</span>
          </span>
        ))}
        {spare > 0 && <span className="tank-spare tabular">+{spare} spare</span>}
      </div>
    </div>
  );
}

function GearStrip({ spareRegs, o2, status }) {
  return (
    <div className="day-stat-block">
      <div className="day-stat-label">Gear</div>
      <div className="day-gear-row">
        <span className="gear-stat"><span className="tabular">{spareRegs}</span> spare regs</span>
        <span className="gear-sep">·</span>
        <span className="gear-stat"><span className="tabular">{o2}</span> O₂ kit</span>
        {status === "ready" && <span className="gear-ready"><Icon name="check" size={11} /> Equipment ready</span>}
        {status === "shortage" && <span className="gear-short"><Icon name="warning" size={11} /> Shortage</span>}
      </div>
    </div>
  );
}

// -------- trip card --------
function TripCard({ trip, validation, gearMode, onPax, locked, tripDone, onToggleTripDone, isToday }) {
  return (
    <div className={`trip-card ${locked ? "trip-locked" : ""} ${validation ? "trip-validation" : ""}`}>
      <div className="trip-head">
        <div className="trip-head-left">
          <div className="trip-time tabular">{trip.time}</div>
          <div className="trip-title-block">
            <div className="trip-title">
              {trip.name}
              {trip.boat && <span className="trip-boat">{trip.boat}</span>}
              {trip.departed && !validation && <span className="chip chip-ocean trip-status">DEPARTED</span>}
              {locked && <span className="chip chip-green trip-status"><Icon name="lock" size={10} /> LOCKED</span>}
            </div>
            <div className="trip-meta">
              <span><Icon name="map_pin" size={11} />{trip.site}</span>
              <span className="dim-sep">·</span>
              <span className="tabular">{trip.pax} div + {trip.staff} staff</span>
              <span className="dim-sep">·</span>
              <span className="tabular">{trip.dives} dive{trip.dives !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      {(trip.tanks.length > 0 || trip.spareTanks > 0) && (
        <div className="trip-summary">
          <div className="trip-summary-row">
            <span className="trip-summary-label">Tanks</span>
            <div className="trip-summary-tanks">
              {trip.tanks.map((t, i) => (
                <span key={i} className="tank-pill tank-pill-sm">
                  <span className="tank-n tabular">{t.n}×</span>
                  <span className="tank-k">{t.k}</span>
                </span>
              ))}
              {trip.spareTanks > 0 && <span className="tank-spare tabular">+{trip.spareTanks} spare</span>}
            </div>
          </div>
          <div className="trip-summary-row">
            <span className="trip-summary-label">Gear</span>
            <div className="trip-summary-gear">
              {trip.spareRegs > 0 && <span><span className="tabular">{trip.spareRegs}</span> spare reg/grp</span>}
              {trip.spareRegs > 0 && trip.o2 > 0 && <span className="dim-sep">·</span>}
              {trip.o2 > 0 && <span><span className="tabular">{trip.o2}</span> O₂ kit</span>}
            </div>
          </div>
        </div>
      )}

      {trip.groups.map((g, gi) => (
        <div key={gi} className="trip-group">
          <div className="group-head">
            <div className="group-name">{g.name}</div>
            <div className="group-meta">
              <span className="group-guide">{g.guide ? `Guide · ${g.guide}` : "No guide"}</span>
              <span className="group-cap tabular">{g.divers.length}/{g.cap}</span>
            </div>
          </div>

          {g.empty && <div className="group-empty">No divers in this group</div>}

          {g.divers.map((d, di) => (
            <DiverRow key={di} d={d}
              validation={validation}
              gearMode={gearMode}
              locked={locked}
              onPax={onPax} />
          ))}
        </div>
      ))}

      <div className="trip-foot">
        {validation ? (
          <>
            <div className="trip-foot-progress">
              {locked
                ? <><Icon name="lock" size={12} /> Trip completed · all dives recorded</>
                : <span className="tabular">{trip.groups.flatMap(g => g.divers).filter(d => d.done > 0).length}/{trip.groups.flatMap(g => g.divers).length} validated</span>
              }
            </div>
            <button
              className={`btn ${locked ? "btn-secondary" : "btn-primary"} btn-sm`}
              onClick={onToggleTripDone}>
              <Icon name={locked ? "check" : "lock"} size={12} />
              {locked ? "Unlock trip" : "Mark trip completed"}
            </button>
          </>
        ) : (
          <>
            <div className="trip-foot-progress">
              {gearMode === "unassigned" && <span className="muted-text"><Icon name="warning" size={11} /> Gear not assigned</span>}
              {gearMode === "draft" && <span className="muted-text"><Icon name="edit" size={11} /> Draft assignment · review &amp; confirm</span>}
              {gearMode === "assigned" && <span className="ok-text"><Icon name="check" size={11} /> Gear assigned · ready for departure</span>}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm">Edit trip</button>
              {gearMode !== "assigned" && <button className="btn btn-primary btn-sm"><Icon name="check" size={12} /> Confirm all gear</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -------- diver row --------
// Status icon: green = all gear confirmed, amber = partial/draft, red = none assigned or no sizing + partial.
function gearStatus(d, gearMode) {
  const EXPECTED = 5; // BCD, REG, FINS, SUIT, MASK
  const count = (d.gear || []).length;
  if (gearMode === "unassigned" || count === 0) return "red";
  if (d.noSizing && count < EXPECTED) return "red";
  if (gearMode === "assigned" && count >= EXPECTED) return "green";
  return "amber";
}

function DiverRow({ d, validation, gearMode, locked, onPax }) {
  const status = gearStatus(d, gearMode);
  const certShort = d.cert || "Uncertified";
  return (
    <div className={`diver-row diver-row-compact ${locked ? "diver-locked" : ""}`}>
      <div className="diver-line">
        <button
          className={`diver-status diver-status-${status}`}
          onClick={onPax}
          title={
            status === "green" ? "All gear confirmed" :
            status === "amber" ? "Gear partial or drafted" :
                                 "Gear not set — needs attention"
          }
        >
          <span className="diver-status-dot" />
        </button>
        <div className="diver-id">
          <div className="diver-name">
            <button className="diver-name-link" onClick={onPax}>{d.name}</button>
            {d.handle && <span className="diver-handle-text">@{d.handle}</span>}
          </div>
          <div className="diver-meta">
            {d.cert
              ? <span className="diver-cert-code tabular">{certShort}</span>
              : <span className="diver-no-cert">No cert</span>}
            <span className="dim-sep">·</span>
            <span className="diver-dives tabular">{d.dives} dive{d.dives !== 1 ? "s" : ""}</span>
            {d.gas && <><span className="dim-sep">·</span><span className="diver-gas">{d.gas}</span></>}
            {d.noSizing && <><span className="dim-sep">·</span><span className="diver-warn-text"><Icon name="warning" size={10} /> No sizing</span></>}
          </div>
        </div>

        <div className="diver-actions">
          {validation ? (
            <ValStrip planned={d.planned} done={d.done} locked={locked} />
          ) : (
            <>
              <span className="diver-dives-planned">
                <span className="tabular">{d.planned}</span><span className="dim">×</span>
                <span className="tabular">{d.tank || 12}</span><span className="dim">L</span>
              </span>
              <button className="diver-gear-btn" onClick={onPax} title="Open equipment panel">
                <Icon name="arrow_up_right" size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GearPill({ kind, id, mode }) {
  return (
    <span className={`gear-pill gear-pill-${mode}`}>
      <span className="gear-kind">{kind}</span>
      <span className="gear-id">{id}</span>
    </span>
  );
}

// -------- validation strip --------
function ValStrip({ planned, done, locked }) {
  const [marked, setMarked] = React.useState(done);
  const eff = locked ? done : marked;
  return (
    <div className="val-strip">
      <span className="val-label tabular">{eff}/{planned}</span>
      {Array.from({ length: planned }).map((_, i) => {
        const isDone = i < eff;
        return (
          <button key={i}
            className={`val-square ${isDone ? "done" : ""} ${locked ? "locked" : ""}`}
            onClick={() => !locked && setMarked(isDone && i === eff - 1 ? i : i + 1)}>
            {isDone ? <Icon name="check" size={11} /> : i + 1}
          </button>
        );
      })}
    </div>
  );
}

// -------- past block --------
function PastBlock({ open, setOpen, days, openDay, setOpenDay, cols }) {
  return (
    <section className="past-block">
      <button className="past-toggle" onClick={() => setOpen(!open)}>
        <Icon name={open ? "chevron_down" : "chevron_right"} size={14} />
        <span className="past-toggle-label">Past 7 days</span>
        <span className="past-toggle-meta tabular">{days.length} days · {days.reduce((a, d) => a + d.trips, 0)} trips · {days.reduce((a, d) => a + d.divers, 0)} divers</span>
      </button>
      {open && (
        <div className="past-list">
          {days.map(d => (
            <div key={d.iso} className="past-day">
              <button className="past-day-head" onClick={() => setOpenDay({ ...openDay, [d.iso]: !openDay[d.iso] })}>
                <Icon name={openDay[d.iso] ? "chevron_down" : "chevron_right"} size={12} />
                <span className="past-day-iso tabular">{d.iso}</span>
                <span className="past-day-label">{d.label}</span>
                <span className="past-day-stats">
                  <span className="tabular">{d.trips}</span> trip{d.trips !== 1 ? "s" : ""}
                  <span className="dim-sep">·</span>
                  <span className="tabular">{d.divers}</span> diver{d.divers !== 1 ? "s" : ""}
                  <span className="dim-sep">·</span>
                  <span className="tabular">{d.staff}</span> staff
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  {d.validated
                    ? <span className="chip chip-green"><Icon name="lock" size={10} /> LOCKED</span>
                    : <span className="chip chip-amber">NEEDS VALIDATION</span>}
                  <button className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}>
                    <Icon name="bookings" size={12} /> Briefing
                  </button>
                </div>
              </button>
              {openDay[d.iso] && (
                <div className="past-day-body">
                  <div className="past-day-empty">
                    {d.divers === 0
                      ? "No divers assigned · trips departed empty."
                      : `${d.divers} divers across ${d.trips} trip${d.trips !== 1 ? "s" : ""} · ${d.validated ? "all dives validated and locked" : "awaiting validation"}.`}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// -------- pax panel --------
function PaxPanel({ gearMode, setGearMode, onClose }) {
  const pax = {
    name: "Marie Lefevre",
    handle: "marie.lefevre@fake.almadiving.test",
    code: "FK-000102",
    cert: "Advanced Open Water Diver (SSI)",
    certShort: "AOWD",
    dives: 85,
    last: "20/12/2025",
  };
  return (
    <>
      <div className="pax-scrim" onClick={onClose} />
      <aside className="pax-panel scroll">
        <div className="pax-head">
          <div>
            <div className="pax-name">{pax.name}</div>
            <div className="pax-code tabular">{pax.code} · {pax.handle}</div>
          </div>
          <button className="pax-close" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        <div className="pax-section">
          <div className="pax-section-label">Certification</div>
          <div className="pax-cert-card">
            <div className="pax-cert-line">{pax.cert}</div>
            <div className="pax-cert-meta tabular">{pax.dives} dives · last {pax.last}</div>
          </div>
        </div>

        <div className="pax-section">
          <div className="pax-section-label">
            Equipment assignment
            <span className="pax-section-hint">★ = drafted by auto-match</span>
          </div>

          <PaxGearTabs mode={gearMode} setMode={setGearMode} />

          <GearField label="BCD" kind="BCD" mode={gearMode} options={INVENTORY.BCD} />
          <GearField label="Regulator" kind="REG" mode={gearMode} options={INVENTORY.REG} />
          <GearField label="Fins" kind="FINS" mode={gearMode} options={INVENTORY.FINS} />
          <GearField label="Wetsuit" kind="SUIT" mode={gearMode} options={INVENTORY.SUIT} />
          <GearField label="Mask" kind="MASK" mode={gearMode} options={INVENTORY.MASK} />
        </div>

        <div className="pax-section">
          <div className="pax-section-label">Sizing</div>
          <div className="pax-sizing">
            <div><span>BCD size</span><span className="tabular">M</span></div>
            <div><span>Wetsuit</span><span className="tabular">S · 3 mm</span></div>
            <div><span>Fins</span><span className="tabular">S</span></div>
            <div><span>Mask</span><span>one size</span></div>
          </div>
        </div>

        <div className="pax-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary"><Icon name="check" size={13} />
            {gearMode === "draft" ? "Confirm draft assignment" : gearMode === "assigned" ? "Save changes" : "Assign all"}
          </button>
        </div>
      </aside>
    </>
  );
}

function PaxGearTabs({ mode, setMode }) {
  return (
    <div className="pax-mode-tabs">
      <button className={`pax-mode-tab ${mode === "unassigned" ? "active" : ""}`} onClick={() => setMode("unassigned")}>Unassigned</button>
      <button className={`pax-mode-tab ${mode === "draft" ? "active" : ""}`} onClick={() => setMode("draft")}>Drafted</button>
      <button className={`pax-mode-tab ${mode === "assigned" ? "active" : ""}`} onClick={() => setMode("assigned")}>Assigned</button>
    </div>
  );
}

function GearField({ label, kind, mode, options }) {
  const drafted = options.find(o => o.drafted);
  const [selected, setSelected] = React.useState(drafted?.id);
  const [open, setOpen] = React.useState(label === "Regulator"); // showcase open dropdown
  const display = mode === "unassigned" ? "" : selected;

  return (
    <div className="gear-field">
      <div className="gear-field-label">{label}</div>
      <div className="gear-field-control">
        <button className={`gear-field-input ${mode === "unassigned" ? "empty" : ""}`} onClick={() => setOpen(!open)}>
          <span className="gear-field-value">
            {mode === "unassigned" ? <span className="muted-text">Select an item…</span> : (
              <>
                <span className="gear-pill-mini-kind">{kind}</span>
                <span className="tabular">{display}</span>
                {mode === "draft" && <span className="gear-field-draft-mark">★ drafted</span>}
              </>
            )}
          </span>
          <Icon name="chevron_down" size={12} />
        </button>
        {open && (
          <div className="gear-field-menu">
            {options.map(o => (
              <button key={o.id} className={`gear-field-opt ${o.id === selected ? "active" : ""}`}
                onClick={() => { setSelected(o.id); setOpen(false); }}>
                <span className="gear-opt-star">{o.drafted ? "★" : ""}</span>
                <span className="gear-opt-id tabular">{o.id}</span>
                {o.drafted && <span className="gear-opt-tag">drafted</span>}
                <span className="gear-opt-stock muted-text tabular">in stock</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.PlanningPage = PlanningPage;
