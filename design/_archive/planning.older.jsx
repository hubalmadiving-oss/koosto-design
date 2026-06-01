// Archived 2026-05-17. Superseded by the Planning Spec design.
// The spec became the canonical Planning Dashboard. Kept here for
// reference / diff against the older approach.

const { Icon } = window;

// =============================================================
// PLANNING DASHBOARD PAGE — N+1 focus, validation, gear assign
// =============================================================
const __PLAN_CSS = "/* ========================================================\n   PLANNING DASHBOARD STYLES\n   ======================================================== */\n\n/* Day block */\n.day-block { margin-bottom: 28px; }\n.day-head {\n  background: var(--surface-1);\n  border: 1px solid var(--surface-3);\n  border-radius: 14px;\n  padding: 18px 20px;\n  margin-bottom: 14px;\n}\n.day-head-top {\n  display: flex; align-items: center; justify-content: space-between;\n  margin-bottom: 18px; gap: 14px; flex-wrap: wrap;\n}\n.day-head-stamp { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }\n.day-tag {\n  font-family: var(--font-ui); font-weight: 800; font-size: 13px;\n  letter-spacing: 0.12em; padding: 4px 10px; border-radius: 5px;\n}\n.day-tag-ocean { background: var(--ocean-900); color: white; }\n[data-theme=\"dark\"] .day-tag-ocean { background: var(--ocean-deep); }\n.day-tag-amber { background: var(--amber-alert); color: white; }\n.day-tag-neutral { background: var(--surface-2); color: var(--ocean-700); }\n.day-date { font-family: var(--font-ui); font-weight: 800; font-size: 18px; color: var(--ocean-900); letter-spacing: -0.01em; }\n.day-date-long { font-size: 12px; color: var(--ocean-700); opacity: 0.7; font-family: var(--font-ui); font-weight: 600; }\n.day-head-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }\n\n.day-stats {\n  display: flex; align-items: stretch; gap: 22px; flex-wrap: wrap;\n}\n.day-stat { display: flex; flex-direction: column; gap: 4px; min-width: 56px; }\n.day-stat-label, .pax-section-label {\n  font-size: 10px; font-weight: 700; letter-spacing: 0.08em;\n  text-transform: uppercase; color: var(--ocean-700); opacity: 0.65;\n  font-family: var(--font-ui);\n}\n.day-stat-value {\n  font-family: var(--font-ui); font-weight: 800; font-size: 22px;\n  color: var(--ocean-900); line-height: 1; letter-spacing: -0.01em;\n}\n.day-stat.muted .day-stat-value { color: var(--ocean-700); opacity: 0.4; }\n.day-stat-divider { width: 1px; background: var(--surface-3); align-self: stretch; }\n.day-stat-block { display: flex; flex-direction: column; gap: 6px; min-width: 0; flex: 1; }\n.day-tank-row, .day-gear-row {\n  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;\n  font-size: 12px; color: var(--ocean-900);\n}\n.tank-pill {\n  display: inline-flex; align-items: center; gap: 4px;\n  padding: 3px 7px; border-radius: 5px;\n  background: var(--ocean-50); color: var(--ocean-500);\n  font-size: 11px; font-weight: 600;\n}\n.tank-pill-sm { font-size: 10.5px; padding: 2px 6px; }\n.tank-n { font-weight: 800; }\n.tank-k { font-weight: 600; opacity: 0.85; }\n.tank-spare {\n  display: inline-flex; align-items: center;\n  padding: 2px 7px; border-radius: 5px;\n  background: var(--amber-alert-bg); color: var(--amber-alert);\n  font-size: 11px; font-weight: 700;\n}\n.gear-stat { font-size: 12px; color: var(--ocean-900); }\n.gear-stat .tabular { font-weight: 700; }\n.gear-sep, .dim-sep { color: var(--ocean-700); opacity: 0.35; }\n.gear-ready {\n  display: inline-flex; align-items: center; gap: 4px;\n  margin-left: 6px; padding: 2px 9px; border-radius: 5px;\n  background: var(--safety-green-bg); color: var(--safety-green);\n  font-size: 11px; font-weight: 700;\n}\n.gear-short {\n  display: inline-flex; align-items: center; gap: 4px;\n  margin-left: 6px; padding: 2px 9px; border-radius: 5px;\n  background: var(--amber-alert-bg); color: var(--amber-alert);\n  font-size: 11px; font-weight: 700;\n}\n\n/* Trip grid */\n.trip-grid { display: grid; gap: 12px; }\n\n/* Trip card */\n.trip-card {\n  background: var(--surface-1);\n  border: 1px solid var(--surface-3);\n  border-radius: 12px;\n  overflow: hidden;\n  display: flex; flex-direction: column;\n  transition: border-color 120ms;\n}\n.trip-card:hover { border-color: var(--ocean-100); }\n.trip-card.trip-locked { background: var(--surface-2); opacity: 0.92; }\n.trip-card.trip-validation { border-color: var(--ocean-100); }\n\n.trip-head { padding: 14px 16px 8px; }\n.trip-head-left { display: flex; align-items: flex-start; gap: 14px; }\n.trip-time {\n  font-family: var(--font-ui); font-weight: 800; font-size: 18px;\n  color: var(--ocean-900); letter-spacing: -0.01em; line-height: 1.1;\n  padding-top: 1px;\n}\n.trip-title-block { flex: 1; min-width: 0; }\n.trip-title {\n  font-family: var(--font-ui); font-weight: 700; font-size: 14px;\n  color: var(--ocean-900); display: flex; align-items: center; gap: 8px;\n  flex-wrap: wrap;\n}\n.trip-boat {\n  font-family: var(--font-ui); font-weight: 600; font-size: 11px;\n  color: var(--ocean-500); padding: 1px 7px; border-radius: 4px;\n  background: var(--ocean-50);\n}\n.trip-status { font-size: 9px !important; padding: 2px 6px !important; }\n.trip-meta {\n  margin-top: 4px; display: flex; align-items: center; gap: 6px;\n  flex-wrap: wrap; font-size: 11.5px; color: var(--ocean-700); opacity: 0.85;\n}\n.trip-meta span { display: inline-flex; align-items: center; gap: 4px; }\n\n/* Trip summary block */\n.trip-summary {\n  margin: 4px 16px 10px; padding: 8px 12px;\n  background: var(--surface-2); border-radius: 8px;\n  display: flex; flex-direction: column; gap: 6px;\n}\n.trip-summary-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }\n.trip-summary-label {\n  font-size: 9.5px; font-weight: 700; text-transform: uppercase;\n  letter-spacing: 0.08em; color: var(--ocean-700); opacity: 0.65;\n  font-family: var(--font-ui); min-width: 38px;\n}\n.trip-summary-tanks, .trip-summary-gear {\n  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;\n  font-size: 11.5px; color: var(--ocean-900);\n}\n\n/* Trip group */\n.trip-group {\n  border-top: 1px solid var(--surface-3);\n}\n.group-head {\n  display: flex; align-items: center; justify-content: space-between;\n  padding: 10px 16px 6px;\n}\n.group-name {\n  font-family: var(--font-ui); font-weight: 700; font-size: 12px;\n  color: var(--ocean-900);\n}\n.group-meta {\n  display: flex; align-items: center; gap: 10px;\n  font-size: 11px; color: var(--ocean-700); opacity: 0.75;\n}\n.group-cap { font-family: var(--font-ui); font-weight: 700; color: var(--ocean-900); opacity: 1; }\n.group-empty {\n  padding: 10px 16px 14px; font-size: 12px; color: var(--ocean-700);\n  opacity: 0.55; font-style: italic; text-align: center;\n}\n\n/* Diver row */\n.diver-row {\n  padding: 6px 14px 6px 12px;\n  border-top: 1px dashed var(--surface-3);\n}\n.trip-group .diver-row:first-of-type { border-top: 1px solid var(--surface-3); }\n.diver-row.diver-locked { opacity: 0.85; }\n.diver-line { display: flex; align-items: center; gap: 10px; }\n.diver-status {\n  background: transparent; border: 0; padding: 0; cursor: pointer; flex-shrink: 0;\n  width: 22px; height: 22px;\n  display: grid; place-items: center;\n  border-radius: 5px;\n  color: #fff;\n  transition: transform 120ms, filter 120ms;\n}\n.diver-status:hover { filter: brightness(1.05); transform: translateY(-1px); }\n.diver-status-green  { background: var(--safety-green, #15803d); }\n.diver-status-amber  { background: var(--amber-alert, #d97706); }\n.diver-status-orange {\n  background: #ea580c;\n  animation: diver-status-pulse 1.6s ease-in-out infinite;\n}\n@keyframes diver-status-pulse {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.55); }\n  50%      { box-shadow: 0 0 0 6px rgba(234,88,12,0); }\n}\n\n.diver-id { flex: 1; min-width: 0; }\n.diver-name { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }\n.diver-name-link {\n  background: 0; border: 0; padding: 0; cursor: pointer;\n  font-family: var(--font-ui); font-weight: 700; font-size: 13.5px;\n  color: var(--ocean-900); letter-spacing: -0.005em;\n}\n.diver-name-link:hover { color: var(--ocean-500); }\n.diver-meta {\n  margin-top: 1px; display: flex; align-items: center; gap: 8px;\n  flex-wrap: wrap; font-size: 11px; color: var(--ocean-700); opacity: 0.9;\n}\n.diver-cert {\n  color: var(--ocean-700); font-weight: 600; font-size: 11px;\n}\n.diver-no-cert {\n  color: var(--amber-alert); font-style: italic; font-size: 10.5px;\n}\n.diver-dives { color: var(--ocean-700); }\n.diver-gas {\n  padding: 1px 6px; border-radius: 3px;\n  background: var(--accent-teal-bg); color: var(--accent-teal);\n  font-family: var(--font-ui); font-weight: 700; font-size: 10px;\n  letter-spacing: 0.04em;\n}\n.diver-warn-text {\n  display: inline-flex; align-items: center; gap: 3px;\n  color: var(--amber-alert); font-size: 10.5px; font-weight: 600;\n}\n\n.diver-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }\n.diver-dives-planned {\n  font-family: var(--font-ui); font-weight: 700; font-size: 13px;\n  color: var(--ocean-900); white-space: nowrap;\n}\n.diver-dives-planned .dim { color: var(--ocean-700); opacity: 0.4; margin: 0 1px; }\n.diver-gear-btn {\n  width: 26px; height: 26px; border-radius: 6px;\n  background: var(--surface-2); color: var(--ocean-700);\n  display: grid; place-items: center;\n  border: 1px solid transparent; cursor: pointer; transition: all 120ms;\n}\n.diver-gear-btn:hover { background: var(--ocean-50); color: var(--ocean-500); border-color: var(--ocean-100); }\n\n/* Gear pills row */\n.gear-row {\n  margin-top: 6px; margin-left: 36px;\n  display: flex; align-items: center; gap: 5px; flex-wrap: wrap;\n}\n.gear-row-empty { opacity: 0.7; }\n.gear-pill {\n  display: inline-flex; align-items: center; gap: 5px;\n  padding: 3px 8px; border-radius: 5px;\n  font-size: 10.5px; font-weight: 600; line-height: 1.4;\n  white-space: nowrap;\n  font-variant-numeric: tabular-nums;\n}\n.gear-pill .gear-kind {\n  font-family: var(--font-ui); font-weight: 800; font-size: 8.5px;\n  letter-spacing: 0.06em; opacity: 0.6;\n  padding-right: 1px;\n}\n.gear-pill .gear-id {\n  font-family: var(--font-ui); font-weight: 600;\n}\n.gear-pill-assigned {\n  background: var(--ocean-50); color: var(--ocean-500);\n  border: 1px solid var(--ocean-100);\n}\n.gear-pill-draft {\n  background: transparent; color: var(--ocean-700);\n  border: 1px dashed var(--ocean-100);\n}\n.gear-pill-unassigned { display: none; }\n.gear-warn {\n  display: inline-flex; align-items: center; gap: 4px;\n  padding: 2px 7px; border-radius: 4px;\n  background: var(--amber-alert-bg); color: var(--amber-alert);\n  font-size: 10px; font-weight: 600;\n}\n.gear-assign-cta {\n  background: transparent; color: var(--ocean-500);\n  border: 1px dashed var(--ocean-100); border-radius: 5px;\n  padding: 3px 9px; font-size: 10.5px; font-weight: 700;\n  display: inline-flex; align-items: center; gap: 4px;\n  font-family: var(--font-ui); cursor: pointer; letter-spacing: 0.02em;\n}\n.gear-assign-cta:hover { background: var(--ocean-50); }\n.gear-assign-cta-strong {\n  background: var(--ocean-50); border-style: solid;\n}\n\n/* Validation strip */\n.val-strip { display: inline-flex; align-items: center; gap: 5px; }\n.val-label {\n  font-family: var(--font-ui); font-weight: 700; font-size: 11px;\n  color: var(--ocean-700); opacity: 0.7; margin-right: 4px;\n}\n.val-square {\n  width: 24px; height: 24px; border-radius: 5px;\n  border: 1.5px solid var(--surface-3); background: var(--surface-1);\n  display: grid; place-items: center;\n  font-family: var(--font-ui); font-weight: 800; font-size: 10.5px;\n  color: var(--ocean-700);\n  cursor: pointer; transition: all 120ms;\n}\n.val-square:hover { border-color: var(--ocean-500); color: var(--ocean-500); }\n.val-square.done {\n  background: var(--safety-green); border-color: var(--safety-green); color: white;\n}\n.val-square.locked { cursor: default; }\n\n/* Trip foot */\n.trip-foot {\n  border-top: 1px solid var(--surface-3);\n  padding: 10px 16px;\n  display: flex; align-items: center; justify-content: space-between; gap: 10px;\n  background: var(--surface-2);\n  margin-top: auto;\n}\n.trip-foot-progress {\n  font-size: 11.5px; color: var(--ocean-700);\n  display: inline-flex; align-items: center; gap: 4px;\n  font-family: var(--font-ui); font-weight: 600;\n}\n.muted-text { color: var(--ocean-700); opacity: 0.7; display: inline-flex; align-items: center; gap: 4px; }\n.ok-text { color: var(--safety-green); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }\n\n/* Past block */\n.past-block { margin-bottom: 24px; }\n.past-toggle {\n  display: flex; align-items: center; gap: 10px; width: 100%;\n  background: transparent; border: 0; padding: 12px 4px; cursor: pointer;\n  border-bottom: 1px solid var(--surface-3); margin-bottom: 8px;\n}\n.past-toggle-label {\n  font-family: var(--font-ui); font-weight: 800; font-size: 11px;\n  letter-spacing: 0.1em; text-transform: uppercase; color: var(--ocean-900);\n}\n.past-toggle-meta { font-size: 11px; color: var(--ocean-700); opacity: 0.7; margin-left: 4px; }\n.past-list { display: flex; flex-direction: column; gap: 4px; }\n.past-day {\n  background: var(--surface-1); border: 1px solid var(--surface-3); border-radius: 10px;\n  overflow: hidden;\n}\n.past-day-head {\n  display: flex; align-items: center; gap: 12px; width: 100%;\n  background: transparent; border: 0; padding: 12px 14px; cursor: pointer;\n  font-family: inherit; text-align: left;\n}\n.past-day-head:hover { background: var(--surface-2); }\n.past-day-iso {\n  font-family: var(--font-ui); font-weight: 800; font-size: 13px; color: var(--ocean-900);\n  min-width: 80px;\n}\n.past-day-label { font-size: 12px; color: var(--ocean-700); }\n.past-day-stats {\n  font-size: 11.5px; color: var(--ocean-700);\n  display: inline-flex; align-items: center; gap: 5px; margin-left: 14px;\n}\n.past-day-body { padding: 0 14px 14px; }\n.past-day-empty {\n  font-size: 12px; color: var(--ocean-700); opacity: 0.65;\n  padding: 10px 12px; background: var(--surface-2); border-radius: 8px;\n  font-style: italic;\n}\n\n/* Pax panel — slides in from right */\n.pax-scrim {\n  position: fixed; inset: 0; background: rgba(10, 37, 64, 0.18);\n  backdrop-filter: blur(2px); z-index: 80; animation: fadeIn 160ms;\n}\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n.pax-panel {\n  position: fixed; top: 0; right: 0; bottom: 0;\n  width: 380px; background: var(--surface-1);\n  border-left: 1px solid var(--surface-3);\n  box-shadow: -10px 0 40px -10px rgba(10, 37, 64, 0.18);\n  z-index: 81; padding: 22px 22px 16px;\n  display: flex; flex-direction: column; gap: 18px;\n  animation: slideIn 200ms cubic-bezier(0.2, 0.8, 0.2, 1);\n  overflow-y: auto;\n}\n@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }\n.pax-head {\n  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;\n  padding-bottom: 14px; border-bottom: 1px solid var(--surface-3);\n}\n.pax-name { font-family: var(--font-ui); font-weight: 800; font-size: 18px; color: var(--ocean-900); }\n.pax-code { font-size: 11px; color: var(--ocean-700); opacity: 0.65; margin-top: 3px; }\n.pax-close {\n  width: 30px; height: 30px; border-radius: 8px;\n  background: var(--surface-2); color: var(--ocean-700); border: 0;\n  display: grid; place-items: center; cursor: pointer;\n}\n.pax-close:hover { background: var(--surface-3); color: var(--ocean-900); }\n\n.pax-section { display: flex; flex-direction: column; gap: 10px; }\n.pax-section-label {\n  display: flex; align-items: baseline; gap: 8px; justify-content: space-between;\n}\n.pax-section-hint { font-size: 9.5px; opacity: 0.6; font-weight: 600; letter-spacing: 0.04em; text-transform: none; }\n.pax-cert-card {\n  padding: 12px; background: var(--ocean-50); border: 1px solid var(--ocean-100);\n  border-radius: 10px;\n}\n.pax-cert-line { font-family: var(--font-ui); font-weight: 700; font-size: 13px; color: var(--ocean-900); }\n.pax-cert-meta { font-size: 11px; color: var(--ocean-700); margin-top: 3px; }\n\n.pax-mode-tabs {\n  display: grid; grid-template-columns: repeat(3, 1fr);\n  background: var(--surface-2); border-radius: 8px; padding: 3px; gap: 2px;\n  margin-bottom: 4px;\n}\n.pax-mode-tab {\n  background: transparent; border: 0; padding: 6px 8px;\n  font-family: var(--font-ui); font-weight: 700; font-size: 10.5px;\n  letter-spacing: 0.04em; text-transform: uppercase;\n  color: var(--ocean-700); cursor: pointer; border-radius: 6px;\n}\n.pax-mode-tab.active { background: var(--surface-1); color: var(--ocean-900); box-shadow: 0 1px 2px rgba(10,37,64,0.08); }\n\n.gear-field { display: flex; flex-direction: column; gap: 5px; }\n.gear-field-label {\n  font-family: var(--font-ui); font-weight: 700; font-size: 11px;\n  color: var(--ocean-900);\n}\n.gear-field-control { position: relative; }\n.gear-field-input {\n  display: flex; align-items: center; justify-content: space-between;\n  width: 100%; padding: 9px 12px; gap: 10px;\n  background: var(--surface-1); border: 1px solid var(--surface-3); border-radius: 8px;\n  cursor: pointer; font-family: inherit;\n  font-size: 12px; color: var(--ocean-900);\n}\n.gear-field-input.empty { background: var(--surface-2); border-style: dashed; }\n.gear-field-input:hover { border-color: var(--ocean-500); }\n.gear-field-edit {\n  display: inline-flex; align-items: center; justify-content: center;\n  width: 24px; height: 22px; border-radius: 6px;\n  background: var(--surface-2); color: var(--ocean-700);\n  flex-shrink: 0;\n}\n.gear-field-input:hover .gear-field-edit { background: var(--ocean-100, var(--surface-3)); color: var(--ocean-900); }\n.gear-field-menu-head {\n  display: flex; align-items: center; gap: 8px;\n  padding: 9px 12px; font-size: 12px;\n  border-bottom: 1px solid var(--surface-3);\n}\n.gear-field-value { display: inline-flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }\n.gear-pill-mini-kind {\n  font-family: var(--font-ui); font-weight: 800; font-size: 9px;\n  letter-spacing: 0.06em; padding: 2px 5px; border-radius: 3px;\n  background: var(--ocean-50); color: var(--ocean-500);\n}\n.gear-field-draft-mark {\n  margin-left: auto; font-size: 10px; color: var(--ocean-500); font-weight: 700;\n}\n.gear-field-menu {\n  position: absolute; top: calc(100% + 4px); left: 0; right: 0;\n  background: var(--ocean-900); color: white; border-radius: 8px;\n  box-shadow: 0 8px 24px -6px rgba(10, 37, 64, 0.35);\n  padding: 4px; z-index: 5; max-height: 220px; overflow-y: auto;\n}\n[data-theme=\"dark\"] .gear-field-menu { background: var(--ocean-deep); }\n.gear-field-opt {\n  display: flex; align-items: center; gap: 8px; width: 100%;\n  background: transparent; border: 0; cursor: pointer;\n  padding: 7px 10px; border-radius: 6px;\n  color: rgba(255,255,255,0.85); font-family: inherit; text-align: left;\n}\n.gear-field-opt:hover { background: rgba(255,255,255,0.1); color: white; }\n.gear-field-opt.active { background: rgba(59,130,198,0.2); color: white; }\n.gear-opt-star { width: 12px; color: #fbbf24; font-size: 11px; }\n.gear-opt-id { font-size: 12px; font-weight: 600; flex: 1; }\n.gear-opt-tag {\n  font-size: 9px; padding: 1px 5px; border-radius: 3px;\n  background: rgba(251, 191, 36, 0.2); color: #fbbf24; font-weight: 700;\n  letter-spacing: 0.04em; text-transform: uppercase;\n}\n.gear-opt-stock { font-size: 10px !important; opacity: 0.5; }\n\n.pax-sizing { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }\n.pax-sizing > div {\n  display: flex; align-items: center; justify-content: space-between;\n  padding: 7px 10px; background: var(--surface-2); border-radius: 6px;\n  font-size: 11.5px; color: var(--ocean-900);\n}\n.pax-sizing > div span:first-child { color: var(--ocean-700); opacity: 0.75; }\n.pax-sizing > div span:last-child { font-weight: 700; font-family: var(--font-ui); }\n\n.pax-actions {\n  margin-top: auto; padding-top: 14px;\n  display: flex; justify-content: flex-end; gap: 8px;\n  border-top: 1px solid var(--surface-3);\n}\n\n/* Segmented control for column selector */\n.seg button {\n  font-family: var(--font-ui); font-weight: 700; font-size: 12px;\n  font-variant-numeric: tabular-nums;\n  min-width: 28px;\n}\n\n.day-stat-counters { display: flex; align-items: center; gap: 12px; }\n.day-boat-row, .day-equip-row {\n  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n  font-size: 12px; color: var(--ocean-900);\n}\n.day-boat-row { margin-top: 4px; }\n.day-equip-row { margin-top: 4px; }\n.boat-pill {\n  display: inline-flex; align-items: center; gap: 6px;\n  padding: 3px 9px; border-radius: 6px;\n  background: var(--surface-1); border: 1px solid var(--surface-3);\n  color: var(--ocean-900); font-size: 11.5px; font-weight: 600;\n}\n.boat-pill .boat-name { color: var(--ocean-900); }\n.boat-pill .boat-trips { color: var(--ocean-500); font-weight: 700; }\n.boat-pill .boat-stat { color: var(--ocean-700); font-weight: 500; }\n.boat-pill .boat-sep { color: var(--ocean-700); opacity: 0.4; }\n.equip-pill {\n  display: inline-flex; align-items: center; gap: 5px;\n  padding: 3px 8px; border-radius: 5px;\n  background: var(--ocean-50); border: 1px solid var(--ocean-100);\n  color: var(--ocean-700); font-size: 11px; font-weight: 600;\n}\n.equip-pill .equip-n {\n  font-family: var(--font-ui); font-weight: 800; color: var(--ocean-900);\n}\n.equip-pill .equip-k {\n  text-transform: lowercase; letter-spacing: 0.01em;\n}\n.trip-head { padding: 12px 14px 12px; background: var(--surface-2); border-bottom: 1px solid var(--surface-3); border-top-left-radius: 12px; border-top-right-radius: 12px; }\n.trip-head-stamp { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }\n.trip-head-stamp .day-tag-trip {\n  background: var(--ocean-900); color: #fff;\n  font-family: var(--font-mono, var(--font-ui)); font-weight: 700;\n  letter-spacing: 0.04em;\n}\n.trip-title-text {\n  font-family: var(--font-ui); font-weight: 700; font-size: 13.5px;\n  color: var(--ocean-900); letter-spacing: -0.005em;\n}\n.trip-site-pill {\n  font-size: 11px; font-weight: 600; color: var(--ocean-700);\n  padding: 2px 8px; border-radius: 4px;\n  background: var(--surface-2); border: 1px solid var(--surface-3);\n  letter-spacing: 0.01em;\n}\n.trip-head-meta {\n  margin-top: 6px;\n  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;\n  font-size: 11px; color: var(--ocean-700);\n}\n.trip-head-meta .trip-meta-item { display: inline-flex; align-items: center; gap: 4px; }\n.trip-dives-pill {\n  font-size: 11px; font-weight: 700;\n  padding: 2px 8px; border-radius: 4px;\n  background: var(--ocean-50); color: var(--ocean-700);\n  letter-spacing: 0.01em;\n}\n.day-tag-green { background: var(--safety-green, #15803d); color: white; }\n.trip-stat-block { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }\n.trip-tank-row, .trip-boat-row {\n  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;\n  font-size: 12px; color: var(--ocean-900);\n}\n.trip-tank-row .day-stat-label, .trip-boat-row .day-stat-label { min-width: 48px; }\n\n/* drop the old separate summary box */\n.trip-summary { display: none !important; }\n\n/* white-background gear dropdown (reserve blue for night mode) */\n.gear-field-menu {\n  background: var(--surface-1) !important;\n  color: var(--ocean-900) !important;\n  border: 1px solid var(--surface-3);\n  box-shadow: 0 8px 24px -6px rgba(10, 37, 64, 0.18) !important;\n}\n.gear-field-opt { color: var(--ocean-900) !important; }\n.gear-field-opt:hover { background: var(--surface-2) !important; color: var(--ocean-900) !important; }\n.gear-field-opt.active { background: var(--ocean-50) !important; color: var(--ocean-900) !important; }\n.gear-field-opt .gear-opt-stock { color: var(--ocean-500) !important; }\n.gear-field-opt .gear-opt-tag { background: var(--ocean-50); color: var(--ocean-700); }\n\n.trip-people-row {\n  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;\n  font-size: 12px; color: var(--ocean-900);\n}\n.people-pill {\n  display: inline-flex; align-items: center; gap: 4px;\n  padding: 3px 8px; border-radius: 5px;\n  background: var(--ocean-50); color: var(--ocean-700);\n  font-size: 11px; font-weight: 600;\n}\n.people-pill .people-n { font-weight: 800; color: var(--ocean-900); }\n.day-stat-label { display: inline-flex; align-items: center; gap: 4px; }\n";

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
      <style>{__PLAN_CSS}</style>
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
