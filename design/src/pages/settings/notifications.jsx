// Auto-extracted from monolith on 2026-05-17.
// Edit this file directly to evolve the screen.

const { Icon, SectionCard, Field, Row, SidebarRow, Toggle } = window;

function SettingsNotifications() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionCard title="Channels" sub="How AlmaDiving reaches you">
        <Row icon="mail" title="Email · adrien@almadiving.com" sub="Verified" action={<Toggle on/>}/>
        <Row icon="phone" title="SMS · +63 917 555 0142" sub="Verified" action={<Toggle on/>}/>
        <Row icon="message" title="In-app push" sub="Browser & mobile app" action={<Toggle on/>}/>
        <Row icon="bell" title="Slack · #almadiving-ops" sub="Connected via integration" action={<Toggle/>} last/>
      </SectionCard>

      <SectionCard title="Notification rules" sub="Choose what wakes you up">
        <NotifGrid/>
      </SectionCard>

      <SectionCard title="Quiet hours" sub="No notifications during these times (except critical safety alerts)">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="Start" value="22:00"/>
          <Field label="End" value="06:00"/>
          <Field label="Time zone" value="Asia/Manila" select/>
        </div>
        <Row icon="shield" title="Override for critical alerts" sub="Boat overdue, missing diver, equipment failure" action={<Toggle on/>} last/>
      </SectionCard>
    </div>
  );
}

function NotifGrid(){
  const events = [
    { ev:"New booking", e:true, s:false, p:true, sl:false },
    { ev:"Booking modified", e:true, s:false, p:true, sl:false },
    { ev:"Booking cancelled", e:true, s:true, p:true, sl:true },
    { ev:"Member affiliated", e:true, s:false, p:false, sl:false },
    { ev:"Cert verification result", e:true, s:false, p:true, sl:false },
    { ev:"Trip 24h reminder", e:false, s:true, p:true, sl:false },
    { ev:"Boat overdue", e:true, s:true, p:true, sl:true, critical:true },
    { ev:"Equipment service due", e:true, s:false, p:false, sl:true },
    { ev:"Invoice issued/paid", e:true, s:false, p:false, sl:false },
  ];
  return (
    <div style={{margin:"0 -16px -16px"}}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Event</th>
            <th style={{textAlign:"center",width:80}}>Email</th>
            <th style={{textAlign:"center",width:80}}>SMS</th>
            <th style={{textAlign:"center",width:80}}>Push</th>
            <th style={{textAlign:"center",width:80}}>Slack</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev,i)=>(
            <tr key={i}>
              <td>
                <div className="flex items-center gap-2">
                  <span style={{fontWeight:600}}>{ev.ev}</span>
                  {ev.critical && <span className="chip chip-red">CRITICAL</span>}
                </div>
              </td>
              <td style={{textAlign:"center"}}><Toggle on={ev.e}/></td>
              <td style={{textAlign:"center"}}><Toggle on={ev.s}/></td>
              <td style={{textAlign:"center"}}><Toggle on={ev.p}/></td>
              <td style={{textAlign:"center"}}><Toggle on={ev.sl}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================
// FINANCIAL · Settings — currency, tax, payouts, invoicing
// =============================================================

window.SettingsNotifications = SettingsNotifications;
