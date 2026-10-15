"use client";
import { useState } from "react";

export default function RegisterPage(){
  const [loading,setLoading]=useState(false);
  const [f,setF]=useState({
    vorname:"",
    nachname:"",
    email:"",
    password:"",
    strasse:"",
    plz:"",
    ort:"",
    agb:false
  });

  const onChange=(e:any)=>{
    const {name,value,type,checked}=e.target;
    setF({...f,[name]:type==="checkbox"?checked:value});
  };

  const onSubmit=async(e:any)=>{
    e.preventDefault();
    if(!f.agb){alert("Bitte AGB akzeptieren");return;}
    setLoading(true);
    try {
      const res=await fetch("/api/checkout",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(f)
      });
      const data=await res.json();
      if(data.url) window.location.href=data.url;
      else {
        alert("Fehler: "+data.error);
        setLoading(false);
      }
    } catch(err) {
      alert("Fehler beim Checkout");
      setLoading(false);
    }
  };

  const s:any={
    width:"100%",
    padding:"12px",
    border:"1px solid #000",
    fontSize:14,
    background:"#fff",
    color:"#000"
  };

  return(
    <div style={{minHeight:"100vh",background:"#fff",color:"#000",fontFamily:"serif",padding:"60px 20px"}}>
      <div style={{maxWidth:540,margin:"0 auto"}}>
        <h1 style={{fontSize:36,lineHeight:1,fontWeight:800}}>FÜR TRÄNEN,<br/>DIE BLEIBEN.</h1>
        <p style={{opacity:0.6,marginTop:12,fontSize:14}}>
          Erst registrieren & bezahlen – dann Projekt anlegen. So ist es professionell und endkundentauglich.
        </p>

        <form onSubmit={onSubmit} style={{marginTop:28,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:12}}>
            <input name="vorname" required placeholder="Vorname *" value={f.vorname} onChange={onChange} style={s}/>
            <input name="nachname" required placeholder="Nachname *" value={f.nachname} onChange={onChange} style={s}/>
          </div>

          <input name="email" required type="email" placeholder="E-Mail-Adresse *" value={f.email} onChange={onChange} style={s}/>
          <input name="password" required type="password" placeholder="Passwort (min 8 Zeichen) *" minLength={8} value={f.password} onChange={onChange} style={s}/>
          <input name="strasse" required placeholder="Straße & Hausnummer *" value={f.strasse} onChange={onChange} style={s}/>

          <div style={{display:"flex",gap:12}}>
            <input name="plz" required placeholder="PLZ *" value={f.plz} onChange={onChange} style={{...s,flex:1}}/>
            <input name="ort" required placeholder="Ort *" value={f.ort} onChange={onChange} style={{...s,flex:2}}/>
          </div>

          <label style={{display:"flex",gap:8,fontSize:12,marginTop:16,lineHeight:1.3}}>
            <input type="checkbox" name="agb" checked={f.agb} onChange={onChange} required/>
            <span>Ich bestelle kostenpflichtig für 34,99€ inkl. MwSt. und akzeptiere AGB & Datenschutz *</span>
          </label>

          <button disabled={loading} type="submit" style={{marginTop:16,background:"#000",color:"#fff",padding:"16px",fontWeight:700,border:"none",cursor:"pointer",fontSize:14}}>
            {loading?"Weiter zu Stripe...":"Kostenpflichtig bestellen – 34,99€"}
          </button>

          <p style={{fontSize:11,opacity:0.5,marginTop:8,textAlign:"center"}}>
            Sichere Zahlung via Stripe. Rechnung mit ausgewiesener MwSt. an deine Adresse.
          </p>
        </form>
      </div>
    </div>
  );
}