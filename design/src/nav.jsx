// ============= NAV CONFIG =============
// Order + labels mirror the real admin app's top tab bar:
//   Admin · Users · Courses · Equipment · Planning · Staff · Bookings · Finance · Settings
// "Dashboard" is the implicit home behind the Admin/logo click.
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "users", label: "Users", icon: "users", badge: 3 },
  { id: "courses", label: "Courses", icon: "book" },
  { id: "equipment", label: "Equipment", icon: "equipment" },
  { id: "planning", label: "Planning", icon: "calendar" },
  { id: "staff", label: "Staff", icon: "shield" },
  { id: "bookings", label: "Bookings", icon: "bookings", badge: 7 },
  { id: "finance", label: "Finance", icon: "finance" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const SUBNAV = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Center overview at a glance",
    sections: [
      { items: [
        { id: "overview", label: "Overview", icon: "grid" },
        { id: "activity", label: "Live activity", icon: "activity" },
        { id: "kpis", label: "KPIs & trends", icon: "trending" },
      ]},
      { label: "Shortcuts", items: [
        { id: "create-trip", label: "Create trip", icon: "plus" },
        { id: "today", label: "Today's plan", icon: "clock" },
        { id: "exports", label: "Exports", icon: "download" },
      ]},
    ],
  },
  users: {
    title: "Users",
    subtitle: "Members, staff, and roles",
    sections: [
      { items: [
        { id: "all", label: "All members", icon: "users", count: 142 },
        { id: "search", label: "Search", icon: "search" },
        { id: "staff", label: "Staff", icon: "shield", count: 8 },
        { id: "students", label: "Students", icon: "book", count: 11 },
      ]},
      { label: "Filters", items: [
        { id: "current", label: "Affiliated", icon: "check" },
        { id: "pending", label: "Pending verify", icon: "info", count: 3 },
        { id: "expired", label: "Expired certs", icon: "x" },
      ]},
    ],
  },
  planning: {
    title: "Planning",
    subtitle: "Trips, days, and assignments",
    sections: [
      { items: [
        { id: "dashboard", label: "Dashboard", icon: "grid" },
        { id: "calendar", label: "Calendar", icon: "calendar" },
        { id: "organize", label: "Organization", icon: "layers" },
        { id: "destinations", label: "Destinations", icon: "map_pin" },
      ]},
      { label: "Operations", items: [
        { id: "boats", label: "Boats", icon: "boat" },
        { id: "validation", label: "Validation", icon: "check", count: 2 },
        { id: "logs", label: "Day logs", icon: "file" },
      ]},
    ],
  },
  // Sections + item labels — restructured 2026-05:
  //   APP        · General · Center · Staff Rights · Notifications (was under Booking)
  //   PLANNING   · Destinations · Boats · Planning
  //   EQUIPMENT  · Definitions · Matching · Settings (new)
  //   BOOKING    · Booking
  //   FINANCIAL  · Settings
  settings: {
    title: "Settings",
    subtitle: "Configure your dive center",
    sections: [
      { label: "App", items: [
        { id: "general",       label: "General",       icon: "settings" },
        { id: "center",        label: "Center",        icon: "map_pin" },
        { id: "rights",        label: "Staff Rights",  icon: "shield" },
        { id: "notifications", label: "Notifications", icon: "bell" },
      ]},
      { label: "Planning", items: [
        { id: "destinations", label: "Destinations", icon: "map_pin" },
        { id: "boats",        label: "Boats",        icon: "boat" },
        { id: "planning",     label: "Planning",     icon: "calendar" },
      ]},
      { label: "Equipment", items: [
        { id: "definitions",        label: "Definitions", icon: "tag" },
        { id: "matching",           label: "Matching",    icon: "layers" },
        { id: "equipment-settings", label: "Settings",    icon: "settings" },
      ]},
      { label: "Booking", items: [
        { id: "booking", label: "Booking", icon: "bookings" },
      ]},
      { label: "Financial", items: [
        { id: "fin-settings", label: "Settings", icon: "finance" },
      ]},
    ],
  },
  courses: { title: "Courses", subtitle: "Curricula & enrollments", sections: [{ items: [{id:"all",label:"All courses",icon:"book"},{id:"enrollments",label:"Enrollments",icon:"users"}]}]},
  equipment: {
    title: "Equipment",
    subtitle: "Inventory, stock, lifecycle",
    sections: [
      { items: [
        { id: "inventory", label: "Inventory", icon: "equipment" },
        { id: "stock",     label: "Stock",     icon: "package" },
      ]},
      { label: "Insights", items: [
        { id: "log",       label: "Log",       icon: "file" },
        { id: "analytics", label: "Analytics", icon: "trending" },
      ]},
    ],
  },
  bookings: { title: "Bookings", subtitle: "Reservations & waitlist", sections: [{ items: [{id:"upcoming",label:"Upcoming",icon:"calendar",count:7},{id:"waitlist",label:"Waitlist",icon:"clock"}]}]},
  finance: { title: "Finance", subtitle: "Invoices & payouts", sections: [{ items: [{id:"inv",label:"Invoices",icon:"file"},{id:"payouts",label:"Payouts",icon:"finance"}]}]},
};

// ============= SEARCH RESULTS =============
const SEARCH_RESULTS = [
  { group: "Members", items: [
    { id: 1, name: "Hugo Leclercq", sub: "hugues.leclercq@gmail.com · DV-A37188B517", meta: "AOWD", color: "ocean" },
    { id: 2, name: "Hugo Bertrand", sub: "hugo.b@example.com · DV-FFC7A67972", meta: "DM", color: "ocean" },
    { id: 3, name: "Hughes Martel", sub: "h.martel@example.com · DV-6776A276D8", meta: "OWD", color: "" },
  ]},
  { group: "Staff", items: [
    { id: 4, name: "Hugo Leclercq", sub: "Instructor · 4 trips this week", meta: "INSTR", color: "teal" },
  ]},
  { group: "Pages", items: [
    { id: 5, name: "Trip — Hugo Reef Dive · 28 Apr", sub: "Planning · Tomorrow morning", meta: "TRIP", color: "amber" },
    { id: 6, name: "Booking #B-2891 — Leclercq", sub: "Bookings · Confirmed", meta: "BKG", color: "green" },
    { id: 7, name: "Settings → Staff Rights", sub: "Settings · App", meta: "PAGE", color: "" },
  ]},
];

window.NAV = NAV;
window.SUBNAV = SUBNAV;
window.SEARCH_RESULTS = SEARCH_RESULTS;
