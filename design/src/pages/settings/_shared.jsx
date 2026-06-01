const { Icon } = window;

// =============================================================
// Settings · _shared — helpers used by every sub-page.
// LOAD THIS FILE BEFORE any settings/*.jsx file.
// =============================================================

function SectionCard({title,sub,children,action,danger,compact}){
  return (
    <div className="card" style={{borderColor: danger?"var(--red-critical-bg)":"var(--surface-3)"}}>
      <div className="card-head" style={{padding: compact?"12px 14px":"14px 16px"}}>
        <div>
          <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize: compact?13:14,color: danger?"var(--red-critical)":"var(--ocean-900)",letterSpacing:"-0.005em"}}>{title}</div>
          {sub && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>{sub}</div>}
        </div>
        {action && <div className="flex gap-2">{action}</div>}
      </div>
      <div style={{padding: compact?"6px 14px 12px":"16px"}}>
        {children}
      </div>
    </div>
  );
}

function Field({label,value,help,type="text",mono,disabled,select,textarea}){
  return (
    <div className="field">
      <label>{label}</label>
      {textarea ? (
        <textarea className="input" defaultValue={value} style={{height:"auto",padding:"10px 12px",resize:"vertical",minHeight:64,fontFamily:"var(--font-body)"}}/>
      ) : select ? (
        <div style={{position:"relative"}}>
          <input className="input" defaultValue={value} style={{paddingRight:32}}/>
          <Icon name="chevron_down" size={14} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"var(--ocean-700)",opacity:0.5,pointerEvents:"none"}}/>
        </div>
      ) : (
        <input type={type} className={`input ${mono?"tabular":""}`} defaultValue={value} disabled={disabled}/>
      )}
      {help && <div className="help">{help}</div>}
    </div>
  );
}

function Row({icon,title,sub,action,last}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom: last?"none":"1px solid var(--surface-3)"}}>
      {icon && <div style={{width:32,height:32,borderRadius:8,background:"var(--surface-2)",display:"grid",placeItems:"center",color:"var(--ocean-500)",flexShrink:0}}><Icon name={icon} size={14}/></div>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:13,color:"var(--ocean-900)"}}>{title}</div>
        {sub && <div style={{fontSize:11,color:"var(--ocean-700)",opacity:0.7,marginTop:2}}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function SidebarRow({label,value,mono,highlight,last}){
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:last?"none":"1px solid var(--surface-3)"}}>
      <span style={{fontSize:12,color:"var(--ocean-700)",opacity:0.75}}>{label}</span>
      <span className={mono?"tabular":""} style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:12,color: highlight?"var(--ocean-500)":"var(--ocean-900)"}}>{value}</span>
    </div>
  );
}

function Toggle({on}){
  const [v, setV] = React.useState(!!on);
  return <div className={`toggle ${v?"on":""}`} onClick={()=>setV(!v)}/>;
}

// Expose to window so per-sub-page files can destructure:
//   const { SectionCard, Field, Row, SidebarRow, Toggle } = window;
Object.assign(window, { SectionCard, Field, Row, SidebarRow, Toggle });
