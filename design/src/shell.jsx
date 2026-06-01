// =============================================================
// Koosto Console · Shell
//
// Composes the rail + subpanel + topbar + content area, and
// mounts the active page from window (each page's .jsx file
// publishes its component to window).
//
// Load order in Koosto Console.html:
//   1. CSS (tokens, shell, components, planning)
//   2. React + ReactDOM + Babel
//   3. src/icons.jsx                  (window.Icon)
//   4. src/nav.jsx                    (window.NAV, SUBNAV, SEARCH_RESULTS)
//   5. src/tweaks/tweaks-panel.jsx    (window.TweaksPanel, Tweak*…)
//   6. src/pages/settings/_shared.jsx (window.SectionCard, Field, …)
//   7. src/pages/settings/*.jsx       (window.SettingsGeneral, …)
//   8. src/pages/settings/index.jsx   (window.SettingsPage — uses sub-pages from window)
//   9. src/pages/dashboard.jsx        (window.DashboardPage)
//  10. src/pages/users.jsx            (window.UsersPage)
//  11. src/pages/planning.jsx         (window.PlanningPage)
//  12. THIS FILE                       — calls ReactDOM.createRoot at the end
//
// Per-page tweaks: when a page wants its own tweak controls, it
// exports `window.<Page>Tweaks = { defaults, render(t, setTweak) }`.
// The TweaksPanel below merges them in (TODO scaffolding).
// =============================================================

const {
  Icon,
  NAV, SUBNAV, SEARCH_RESULTS,
  useTweaks, TweaksPanel,
  TweakSection, TweakSelect, TweakRadio, TweakToggle,
  DashboardPage, UsersPage, PlanningPage, SettingsPage, EquipmentPage,
} = window;

// =============================================================
// APP SHELL — rail + subpanel + topbar with omnisearch
// =============================================================
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "section": "users",
    "settingsSection": "general",
    "equipmentSection": "inventory",
    "planningSection": "dashboard",
    "financialFields": true,
    "subSection": "overview",
    "showSearch": false,
    "darkMode": false,
    "subpanelHidden": false,
    "density": "regular",
    "accent": "ocean"
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [searchOpen, setSearchOpen] = React.useState(t.showSearch);
  const [query, setQuery] = React.useState("hu");

  React.useEffect(()=>{ setSearchOpen(t.showSearch); }, [t.showSearch]);
  React.useEffect(()=>{
    document.documentElement.setAttribute("data-theme", t.darkMode ? "dark" : "light");
  }, [t.darkMode]);

  // Keyboard shortcut for search
  React.useEffect(()=>{
    const h = (e)=>{
      if((e.metaKey||e.ctrlKey) && e.key==="k"){ e.preventDefault(); setSearchOpen(true); }
      if(e.key==="Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", h);
    return ()=> window.removeEventListener("keydown", h);
  },[]);

  const navItem = NAV.find(n=>n.id===t.section) || NAV[0];
  const sub = SUBNAV[t.section] || SUBNAV.dashboard;

  const setSection = (id)=> setTweak({ section: id, subSection: (SUBNAV[id]?.sections?.[0]?.items?.[0]?.id) || "overview" });

  const PageMap = {
    dashboard: <DashboardPage tweaks={t}/>,
    users: <UsersPage tweaks={t}/>,
    planning: <PlanningPage section={t.planningSection}/>,
    settings: <SettingsPage section={t.settingsSection}/>,
    equipment: <EquipmentPage section={t.equipmentSection} tweaks={t}/>,
  };

  return (
    <div className="app" data-subpanel={t.subpanelHidden ? "hidden" : "shown"}>
      {/* RAIL */}
      <nav className="rail">
        <div className="rail-logo"><img src="assets/koosto-k-white.png" alt="Koosto"/></div>
        <div className="rail-divider"/>
        {NAV.map(n=>(
          <button key={n.id} className={`rail-btn ${t.section===n.id?"active":""}`} onClick={()=>setSection(n.id)}>
            <Icon name={n.icon} size={20}/>
            {n.badge && <span className="badge">{n.badge}</span>}
            <span className="rail-tooltip">{n.label}</span>
          </button>
        ))}
        <div className="rail-spacer"/>
        <button className="rail-btn" onClick={()=>setTweak('darkMode', !t.darkMode)}>
          <Icon name={t.darkMode?"sun":"moon"} size={18}/>
          <span className="rail-tooltip">{t.darkMode?"Light mode":"Dark mode"}</span>
        </button>
        <button className="rail-btn">
          <Icon name="info" size={18}/>
          <span className="rail-tooltip">Help &amp; docs</span>
        </button>
      </nav>

      {/* SUBPANEL */}
      <aside className="subpanel">
        <div className="subpanel-header">
          <div className="subpanel-title">{sub.title}</div>
          <div className="subpanel-subtitle">{sub.subtitle}</div>
        </div>
        <div className="scroll" style={{flex:1, overflowY:"auto", margin:"0 -4px", padding:"0 4px"}}>
          {sub.sections.map((s, si)=>(
            <div key={si}>
              {s.label && <div className="subpanel-section">{s.label}</div>}
              {s.items.map(it=>{
                const active = (t.section==="settings" ? t.settingsSection===it.id : (t.section==="equipment" ? t.equipmentSection===it.id : (t.section==="planning" ? t.planningSection===it.id : t.subSection===it.id)));
                return (
                  <button key={it.id} className={`subnav-item ${active?"active":""}`}
                    onClick={()=>{
                      if(t.section==="settings") setTweak('settingsSection', it.id);
                      else if(t.section==="equipment") setTweak('equipmentSection', it.id);
                      else if(t.section==="planning") setTweak('planningSection', it.id);
                      else setTweak('subSection', it.id);
                    }}>
                    <Icon name={it.icon} size={16} className="ico"/>
                    <span>{it.label}</span>
                    {it.count!=null && <span className="count tabular">{it.count}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom card */}
        <div style={{marginTop:12,padding:12,borderRadius:12,background:"linear-gradient(135deg, var(--ocean-deep), var(--ocean-deep-light))",color:"white"}}>
          <div className="flex items-center gap-2" style={{fontSize:11,opacity:0.85,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>
            <Icon name="sparkle" size={12}/> Tip of the day
          </div>
          <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,marginTop:6,lineHeight:1.35}}>Press <kbd style={{background:"rgba(255,255,255,0.2)",padding:"1px 5px",borderRadius:3,fontSize:11,fontFamily:"inherit"}}>⌘K</kbd> to search anything.</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <button className="toggle-btn" onClick={()=>setTweak('subpanelHidden', !t.subpanelHidden)}>
            <Icon name="panel_left" size={18}/>
          </button>

          {/* Breadcrumb — when subpanel hidden, lead with section name */}
          <div className="flex items-center gap-2" style={{fontSize:12,color:"var(--ocean-700)"}}>
            {t.subpanelHidden && (
              <>
                <span style={{fontFamily:"var(--font-ui)",fontWeight:700,color:"var(--ocean-900)"}}>{sub.title}</span>
                <Icon name="chevron_right" size={12} style={{opacity:0.4}}/>
              </>
            )}
            {!t.subpanelHidden && (
              <>
                <span style={{opacity:0.6}}>{sub.title}</span>
                <Icon name="chevron_right" size={12} style={{opacity:0.4}}/>
              </>
            )}
            <span style={{fontFamily:"var(--font-ui)",fontWeight:700,color:"var(--ocean-900)"}}>
              {t.section==="settings"
                ? (sub.sections.flatMap(s=>s.items).find(i=>i.id===t.settingsSection)?.label || "General")
                : t.section==="equipment"
                ? (sub.sections.flatMap(s=>s.items).find(i=>i.id===t.equipmentSection)?.label || "Inventory")
                : t.section==="planning"
                ? (sub.sections.flatMap(s=>s.items).find(i=>i.id===t.planningSection)?.label || "Dashboard")
                : (sub.sections.flatMap(s=>s.items).find(i=>i.id===t.subSection)?.label || "Overview")}
            </span>
          </div>

          {/* Omnisearch */}
          <div className="omni" style={{marginLeft:"auto"}}>
            <Icon name="search" size={15} className="omni-icon"/>
            <input
              className="omni-input"
              placeholder="Search members, trips, settings…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              onFocus={()=>{setSearchOpen(true); setTweak('showSearch', true);}}
              onBlur={()=>setTimeout(()=>{setSearchOpen(false); setTweak('showSearch', false);}, 180)}
            />
            {!searchOpen && <span className="omni-kbd"><kbd>⌘</kbd><kbd>K</kbd></span>}
            {searchOpen && (
              <div className="omni-results">
                <div style={{padding:"10px 14px",borderBottom:"1px solid var(--surface-3)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7}}>
                    <span style={{fontWeight:700,color:"var(--ocean-900)"}} className="tabular">7</span> results for <span className="tabular" style={{fontWeight:600,color:"var(--ocean-900)"}}>"{query}"</span>
                  </span>
                  <span style={{fontSize:10,color:"var(--ocean-700)",opacity:0.6}}>↑↓ navigate · ⏎ open · esc close</span>
                </div>
                {SEARCH_RESULTS.map((g, gi)=>(
                  <div key={g.group} className="omni-group">
                    <div className="omni-group-label">{g.group}</div>
                    {g.items.map((r,ri)=>(
                      <div key={r.id} className={`omni-row ${gi===0&&ri===0?"kbd-focus":""}`}>
                        <div className={`avatar ${r.color}`}>{r.name[0]}</div>
                        <div className="info">
                          <div className="title">{highlight(r.name, query)}</div>
                          <div className="sub">{r.sub}</div>
                        </div>
                        <span className="meta">{r.meta}</span>
                        <Icon name="arrow_up_right" size={14} className="arrow"/>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{padding:"10px 14px",borderTop:"1px solid var(--surface-3)",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11}}>
                  <span style={{color:"var(--ocean-700)",opacity:0.7}}>Filter:</span>
                  <div className="flex gap-1">
                    {["All","Members","Trips","Settings"].map((f,i)=>(
                      <button key={f} className={`chip ${i===0?"chip-ocean":""}`} style={{cursor:"pointer"}}>{f}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="topbar-actions">
            <button className="action-btn"><Icon name="refresh" size={16}/></button>
            <button className="action-btn"><Icon name="message" size={16}/><span className="badge-num">2</span></button>
            <button className="action-btn"><Icon name="bell" size={16}/><span className="dot"></span></button>
            <button className="profile-btn">
              <div className="avatar">A</div>
              <div className="who">
                <div className="name">Adrien L.</div>
                <div className="role">Owner · AlmaDiving</div>
              </div>
              <Icon name="chevron_down" size={14} style={{color:"var(--ocean-700)",opacity:0.6}}/>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content scroll">
          {PageMap[t.section] || <DashboardPage tweaks={t}/>}
        </div>
      </main>

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Navigation"/>
        <TweakSelect label="Page" value={t.section} options={NAV.map(n=>({value:n.id,label:n.label}))} onChange={v=>setSection(v)}/>
        {t.section==="settings" && (
          <TweakSelect label="Settings section" value={t.settingsSection}
            options={[
              {value:"general",            label:"App · General"},
              {value:"center",             label:"App · Center"},
              {value:"rights",             label:"App · Staff Rights"},
              {value:"notifications",      label:"App · Notifications"},
              {value:"destinations",       label:"Planning · Destinations"},
              {value:"boats",              label:"Planning · Boats"},
              {value:"planning",           label:"Planning · Settings"},
              {value:"definitions",        label:"Equipment · Definitions"},
              {value:"matching",           label:"Equipment · Matching"},
              {value:"equipment-settings", label:"Equipment · Settings"},
              {value:"booking",            label:"Booking · Settings"},
              {value:"fin-settings",       label:"Financial · Settings"},
            ]} onChange={v=>setTweak('settingsSection', v)}/>
        )}
        {t.section==="equipment" && (<>
          <TweakSelect label="Equipment section" value={t.equipmentSection}
            options={[
              {value:"inventory", label:"Inventory"},
              {value:"stock",     label:"Stock"},
              {value:"log",       label:"Log"},
              {value:"analytics", label:"Analytics"},
            ]} onChange={v=>setTweak('equipmentSection', v)}/>
          <TweakToggle label="Show financial fields in forms" value={t.financialFields !== false} onChange={v=>setTweak('financialFields', v)}/>
        </>)}
        {t.section==="planning" && (
          <TweakSelect label="Planning section" value={t.planningSection}
            options={[
              {value:"dashboard",    label:"Dashboard"},
              {value:"calendar",     label:"Calendar"},
              {value:"organize",     label:"Organization"},
              {value:"destinations", label:"Destinations"},
              {value:"boats",        label:"Boats"},
              {value:"validation",   label:"Validation"},
              {value:"logs",         label:"Day logs"},
            ]} onChange={v=>setTweak('planningSection', v)}/>
        )}
        <TweakToggle label="Hide subpanel" value={t.subpanelHidden} onChange={v=>setTweak('subpanelHidden', v)}/>

        <TweakSection label="Appearance"/>
        <TweakToggle label="Dark mode" value={t.darkMode} onChange={v=>setTweak('darkMode', v)}/>
        <TweakRadio label="Density" value={t.density} options={["compact","regular","comfy"]} onChange={v=>setTweak('density', v)}/>

        <TweakSection label="Search"/>
        <TweakToggle label="Show search results" value={t.showSearch} onChange={v=>setTweak('showSearch', v)}/>

        {t.section === "planning" && <>
          <TweakSection label="Planning · Page state"/>
          <TweakRadio label="State" value={t.planState || 'plan'} options={['plan','gear-draft','gear-assigned','validation']} onChange={v=>{
            setTweak('planState', v);
            window.__almaPlanState = v;
            window.dispatchEvent(new CustomEvent('alma-plan-state', { detail: v }));
          }}/>
        </>}
      </TweaksPanel>
    </div>
  );
}

function highlight(text, q){
  if(!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return text;
  return <>{text.slice(0,i)}<mark style={{background:"var(--amber-alert-bg)",color:"var(--amber-alert)",padding:"0 2px",borderRadius:2}}>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
