// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

function SettingsFinancial() {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="Currency & tax" sub="How prices are computed and displayed">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="Base currency" value="PHP — Philippine peso" select/>
            <Field label="Display secondary currency" value="USD" select/>
            <Field label="Tax mode" value="VAT included in price" select/>
            <Field label="Default VAT rate" value="12%"/>
            <Field label="Tax ID on invoices" value="89412376500024" mono/>
            <Field label="Round prices to" value="₱1"/>
          </div>
        </SectionCard>

        <SectionCard title="Payouts" sub="Where Stripe sends your earnings">
          <Row icon="bank" title="Bank account" sub="BPI · ••••8821 · Adrien Lemardeley" action={<span className="chip chip-green">VERIFIED</span>}/>
          <Row icon="finance" title="Payout schedule" sub="Weekly · every Monday" action={<button className="btn btn-secondary btn-sm">Change</button>}/>
          <Row icon="info" title="Reserve" sub="₱5,000 held for chargebacks (auto-released after 30d)" action={<span className="chip">₱5,000</span>} last/>
        </SectionCard>

        <SectionCard title="Invoice templates" sub="What goes on the invoices you send">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <Field label="Invoice prefix" value="INV-{YYYY}-"/>
            <Field label="Numbering starts at" value="0001" mono/>
            <Field label="Payment terms" value="Net 7 days" select/>
            <Field label="Late payment fee" value="2% / month"/>
          </div>
          <Field label="Notes on every invoice" value="Thank you for diving with AlmaDiving. Bank transfers welcome — see footer for details." textarea/>
        </SectionCard>

        <SectionCard title="Pricing rules" sub="Discounts and surcharges that apply automatically">
          <Row icon="users" title="Group discount" sub="4+ divers same booking → -10%" action={<Toggle on/>}/>
          <Row icon="award" title="Member loyalty" sub="50+ trips → -5% on every booking" action={<Toggle on/>}/>
          <Row icon="moon" title="Night dive surcharge" sub="+₱500 per diver" action={<Toggle on/>}/>
          <Row icon="boat" title="Weekend rate" sub="Sat/Sun → +15%" action={<Toggle/>} last/>
        </SectionCard>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <SectionCard title="This month" compact>
          <SidebarRow label="Gross revenue" value="₱148,200" mono/>
          <SidebarRow label="Refunds" value="−₱4,800" mono/>
          <SidebarRow label="Tax collected" value="₱15,860" mono/>
          <SidebarRow label="Stripe fees" value="−₱4,128" mono/>
          <SidebarRow label="Net to bank" value="₱123,412" mono highlight last/>
        </SectionCard>

        <SectionCard title="Next payout" compact>
          <div style={{padding:14,background:"linear-gradient(135deg, var(--ocean-deep), var(--ocean-deep-light))",borderRadius:10,color:"white",marginBottom:10}}>
            <div style={{fontSize:11,opacity:0.75,letterSpacing:"0.06em",fontWeight:600}}>SCHEDULED</div>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:800,fontSize:24,letterSpacing:"-0.02em",marginTop:4}} className="tabular">₱42,180</div>
            <div style={{fontSize:11,opacity:0.85,marginTop:2}}>Mon 11 May · BPI ••••8821</div>
          </div>
          <button className="btn btn-secondary btn-sm w-full" style={{justifyContent:"center"}}>View all payouts</button>
        </SectionCard>

        <SectionCard title="Connected" compact>
          <SidebarRow label="Stripe" value="Live"/>
          <SidebarRow label="Xero" value="Not connected"/>
          <SidebarRow label="Last sync" value="2 min ago" last/>
        </SectionCard>
      </div>
    </div>
  );
}

// =============================================================
// Shared bits — Section, Field, Row, Sidebar, Toggle
// =============================================================

window.SettingsFinancial = SettingsFinancial;
