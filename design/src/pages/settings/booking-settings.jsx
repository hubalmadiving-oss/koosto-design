// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

function SettingsBooking() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Online booking" sub="What divers see when booking from your portal">
        <Row icon="globe" title="Public booking page" sub="almadiving.divewh.com/book" action={<Toggle on/>}/>
        <Row icon="users" title="Allow unaffiliated bookings" sub="Divers can book without joining the center" action={<Toggle/>}/>
        <Row icon="award" title="Require certification on file" sub="Block booking until cert is uploaded" action={<Toggle on/>}/>
        <Row icon="receipt" title="Show prices online" sub="Hide for B2B-only centers" action={<Toggle on/>} last/>
      </SectionCard>

      <SectionCard title="Deposits" sub="What's required to confirm a booking">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="Default deposit" value="20% of total"/>
          <Field label="Deposit due within" value="24 hours of booking"/>
          <Field label="Group bookings (4+)" value="50% of total"/>
          <Field label="Course bookings" value="Full payment"/>
        </div>
        <Row icon="info" title="Hold spot before deposit" sub="Reserve seat for 24h while diver pays" action={<Toggle on/>} last/>
      </SectionCard>

      <SectionCard title="Cancellation policy" sub="Refund schedule for diver-initiated cancellations">
        <table className="tbl" style={{margin:"0 -16px 0"}}>
          <thead><tr><th>When cancelled</th><th>Refund</th><th>Fee</th><th></th></tr></thead>
          <tbody>
            <tr><td style={{fontWeight:600}}>&gt; 7 days before</td><td className="tabular">100%</td><td className="tabular">—</td><td><span className="chip chip-green">FREE</span></td></tr>
            <tr><td style={{fontWeight:600}}>3–7 days before</td><td className="tabular">75%</td><td className="tabular">25%</td><td><span className="chip chip-amber">PARTIAL</span></td></tr>
            <tr><td style={{fontWeight:600}}>24h–3 days</td><td className="tabular">50%</td><td className="tabular">50%</td><td><span className="chip chip-amber">HALF</span></td></tr>
            <tr><td style={{fontWeight:600}}>&lt; 24 hours</td><td className="tabular">0%</td><td className="tabular">100%</td><td><span className="chip chip-red">NONE</span></td></tr>
            <tr><td style={{fontWeight:600}}>Weather (operator)</td><td className="tabular">100%</td><td className="tabular">—</td><td><span className="chip chip-green">FREE</span></td></tr>
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Confirmation flow" sub="What happens after a diver books">
        <Row icon="mail" title="Send confirmation email" sub="Booking summary + dive briefing PDF" action={<Toggle on/>}/>
        <Row icon="file" title="Attach health declaration" sub="PDF must be returned 24h before" action={<Toggle on/>}/>
        <Row icon="calendar" title="Add to diver's calendar" sub="ICS link in confirmation email" action={<Toggle on/>}/>
        <Row icon="bell" title="Send 24h reminder" sub="SMS + email · check-in details" action={<Toggle on/>} last/>
      </SectionCard>
    </div>
  );
}

// =============================================================
// BOOKING · Notifications — channels & rules
// =============================================================

window.SettingsBooking = SettingsBooking;
