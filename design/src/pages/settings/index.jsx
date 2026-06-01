// =============================================================
// Settings · index — router that picks the right sub-page.
// LOAD ORDER: _shared → all sub-pages → THIS FILE.
// =============================================================

const {
  Icon,
  SettingsGeneral, SettingsCenter, SettingsStaffRights,
  SettingsDestinations, SettingsBoats, SettingsPlanningRules,
  SettingsEquipmentDefinitions, SettingsEquipmentMatching, SettingsEquipmentSettings,
  SettingsBooking, SettingsNotifications, SettingsFinancial,
} = window;

function SettingsPage({ section = "general" }) {
  const sections = {
    // APP
    general:             <SettingsGeneral/>,
    center:              <SettingsCenter/>,
    rights:              <SettingsStaffRights/>,
    notifications:       <SettingsNotifications/>,
    // PLANNING
    destinations:        <SettingsDestinations/>,
    boats:               <SettingsBoats/>,
    planning:            <SettingsPlanningRules/>,
    // EQUIPMENT
    definitions:         <SettingsEquipmentDefinitions/>,
    matching:            <SettingsEquipmentMatching/>,
    "equipment-settings":<SettingsEquipmentSettings/>,
    // BOOKING
    booking:             <SettingsBooking/>,
    // FINANCIAL
    "fin-settings":      <SettingsFinancial/>,
  };

  const titles = {
    general:             { group:"App",       title:"General",       sub:"Center identity, time zone, language" },
    center:              { group:"App",       title:"Center",        sub:"Operating bases & opening hours" },
    rights:              { group:"App",       title:"Staff Rights",  sub:"Roles and per-feature permissions" },
    notifications:       { group:"App",       title:"Notifications", sub:"Channels, rules, quiet hours — applies app-wide" },
    destinations:        { group:"Planning",  title:"Destinations",  sub:"Dive sites available for trips" },
    boats:               { group:"Planning",  title:"Boats",         sub:"Fleet — capacity, equipment, schedule" },
    planning:            { group:"Planning",  title:"Planning",      sub:"Validation, day-log, organizer rules" },
    definitions:         { group:"Equipment", title:"Definitions",   sub:"Equipment types, brands, sizes" },
    matching:            { group:"Equipment", title:"Matching",      sub:"Auto-assignment rules — diver → gear" },
    "equipment-settings":{ group:"Equipment", title:"Settings",      sub:"Inventory-wide settings (placeholder)" },
    booking:             { group:"Booking",   title:"Booking",       sub:"Booking flow, deposits, cancellation" },
    "fin-settings":      { group:"Financial", title:"Settings",      sub:"Currency, tax, payouts, invoicing" },
  };
  const t = titles[section] || titles.general;

  return (
    <div data-screen-label={`Settings · ${t.group} · ${t.title}`}>
      {/* Page header — RULE: NO inline breadcrumb in content. The topbar
          breadcrumb (Section › Subsection) is the single source of location;
          this header is just Title + Subtitle. See system.md → Page Skeleton. */}
      <div className="page-head">
        <div>
          <h1 className="page-title">{t.title}</h1>
          <div className="page-sub">{t.sub}</div>
        </div>
        <div className="page-actions" style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--ocean-700)",opacity:0.65,fontFamily:"var(--font-ui)"}}>
          <Icon name="check" size={13}/>
          <span>Changes save automatically</span>
        </div>
      </div>

      {sections[section] || sections.general}
    </div>
  );
}

window.SettingsPage = SettingsPage;
