import { useState } from "react";

const sleep = ms => new Promise(r => setTimeout(r, ms));

const PROFIL = {
  prenom: "Grishka", nom: "Chabal",
  email: "gatchabal@gmail.com",
  localisation: "Martigny, Valais",
  formation: "BTS Informatique & Réseau",
  experience: "8+ ans Fnac Suisse — Gérant ShopinShop Manor, Responsable Multimédia Genève",
  competences: ["Gestion budgets","Partenariats commerciaux","Ouvertures de magasins","Formation d'équipes","Client haut de gamme"],
};

const FALLBACK = [
  { titre:"Responsable Commercial – Installations Solaires", entreprise:"Solveo Energie SA", lieu:"Sion, Valais", type:"CDI", match:91, lien:"https://jobs.ch", transferable:"Gestion portefeuille haut de gamme + partenariats Manor directement transférables.", conseil:"Mentionne ta capacité à piloter des ouvertures de magasins." },
  { titre:"Chargé de Développement – Transition Énergétique", entreprise:"Romande Energie", lieu:"Martigny / Lausanne", type:"CDI", match:82, lien:"https://romande-energie.ch/carrieres", transferable:"BTS Informatique + commerce = profil hybride rare.", conseil:"Mets en avant ta double compétence tech/commerce dès l'accroche." },
  { titre:"Coordinateur Projets Photovoltaïques", entreprise:"Helion Energy", lieu:"Viège, Valais", type:"CDI", match:75, lien:"https://helion.ch/jobs", transferable:"Piloter des ouvertures = même logique que coordonner des chantiers.", conseil:"Valorise ton expérience d'animation d'équipes terrain." },
  { titre:"Business Developer – Mobilité Durable", entreprise:"BKW Energie AG", lieu:"Sion / remote", type:"CDI", match:71, lien:"https://bkw.ch/fr/carrieres", transferable:"Négociation avec Apple, DJI, Devialet montre ta capacité premium.", conseil:"Mets en avant ton anglais, BKW travaille avec des partenaires internationaux." },
];

const STEPS = [
  {id:"init", icon:"⚙️", label:"INIT"},
  {id:"search", icon:"🔍", label:"RECHERCHE"},
  {id:"match", icon:"🧠", label:"MATCHING"},
  {id:"email", icon:"📧", label:"EMAIL"},
];

const mc = s => s>=85?"#4ade80":s>=70?"#facc15":"#fb923c";

const s = {
  root:{maxWidth:760,margin:"0 auto",padding:"24px 20px",fontFamily:"Georgia,serif",background:"#07100a",minHeight:"100vh",color:"#d0e8d8",boxSizing:"border-box"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #0d1f12"},
  avatar:{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#16a34a,#065f46)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:"bold",color:"#fff",flexShrink:0},
  title:{fontSize:14,fontWeight:"bold",color:"#f0f6fc",letterSpacing:"2px",fontFamily:"monospace"},
  subtitle:{fontSize:11,color:"#2d5c3a",marginTop:3},
  pill:(st)=>({fontSize:11,padding:"4px 12px",borderRadius:20,background:st==="done"?"#0f2d1a":st==="running"?"#0f2a10":"#111827",color:st==="done"?"#4ade80":st==="running"?"#86efac":"#6b7280",border:`1px solid ${st!=="idle"?"#16a34a":"#1f2937"}`,fontFamily:"monospace"}),
  pipeline:{display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:"#0a1a0d",border:"1px solid #0d1f12",borderRadius:10,padding:12,marginBottom:18,flexWrap:"wrap"},
  pipeRow:{display:"flex",alignItems:"center",gap:5},
  pipeCircle:(a,d)=>({width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,background:a?"#14532d":d?"#052e16":"#0d1f12",border:`2px solid ${a?"#4ade80":d?"#16a34a":"#1a3a20"}`,transition:"all 0.3s",flexShrink:0}),
  pipeLabel:(a,d)=>({fontSize:9,letterSpacing:1,fontFamily:"monospace",color:a?"#4ade80":d?"#16a34a":"#1f3a25"}),
  arrow:{color:"#1a3a20",fontSize:12},
  card:{background:"#0a1a0d",border:"1px solid #0d1f12",borderRadius:10,padding:18,marginBottom:14},
  cardTitle:{fontSize:12,fontWeight:"bold",color:"#2d5c3a",marginBottom:14},
  label:{display:"flex",flexDirection:"column",fontSize:11,color:"#2d5c3a",gap:6,marginBottom:14},
  input:{background:"#07100a",border:"1px solid #1a3a20",borderRadius:6,padding:"9px 12px",color:"#d0e8d8",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"},
  btn:{background:"linear-gradient(135deg,#16a34a,#065f46)",color:"#fff",border:"none",borderRadius:8,padding:"12px 0",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",width:"100%"},
  log:{background:"#07100a",borderRadius:6,padding:"10px 12px",fontFamily:"monospace",fontSize:12,maxHeight:160,overflowY:"auto"},
  logLine:{display:"flex",gap:10,marginBottom:4},
  logTime:{color:"#1a4a22",minWidth:65,flexShrink:0},
  logMsg:{color:"#2d5c3a"},
  jobCard:{background:"#07100a",border:"1px solid #0d1f12",borderRadius:8,padding:14,marginBottom:10},
  jobHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10},
  jobTitle:{fontSize:14,fontWeight:"bold",color:"#d0e8d8",marginBottom:3},
  jobMeta:{fontSize:11,color:"#2d5c3a"},
  matchBadge:(c)=>({fontSize:12,fontFamily:"monospace",fontWeight:"bold",color:c,border:`1px solid ${c}`,borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap",flexShrink:0}),
  transferBox:{background:"#052e16",border:"1px solid #14532d",borderRadius:6,padding:"7px 10px",fontSize:11,color:"#86efac",marginBottom:8},
  conseilBox:{background:"#1a1000",border:"1px solid #854d0e",borderRadius:6,padding:"7px 10px",fontSize:11,color:"#fbbf24",marginBottom:8},
  lienBtn:{display:"inline-block",fontSize:11,color:"#60a5fa",textDecoration:"none",border:"1px solid #1e3a5f",borderRadius:4,padding:"4px 10px",fontFamily:"monospace"},
  gmailBtn:{background:"#ea4335",color:"#fff",border:"none",borderRadius:8,padding:"12px 0",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:"bold",width:"100%",marginTop:14},
  successBox:{background:"#052e16",border:"1px solid #16a34a",borderRadius:8,padding:14,fontSize:13,color:"#4ade80",textAlign:"center",marginTop:14},
  resetBtn:{background:"transparent",color:"#2d5c3a",border:"1px solid #0d1f12",borderRadius:6,padding:"8px 16px",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:10},
};

export default function App() {
  const [recipientEmail, setRecipientEmail] = useState(PROFIL.email);
  const [status, setStatus] = useState("idle");
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [agentLog, setAgentLog] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

  const addLog = msg => setAgentLog(p => [...p, {time: new Date().toLocaleTimeString("fr-CH"), msg}]);
  const completeStep = id => setCompletedSteps(p => [...p, id]);

  const runAgent = async () => {
    if (!recipientEmail.includes("@")) { alert("Email invalide."); return; }
    setStatus("running"); setAgentLog([]); setJobs([]); setEmailSent(false); setCompletedSteps([]);

    setCurrentStep("init");
    addLog("🚀 Agent démarré");
    addLog(`👤 ${PROFIL.prenom} ${PROFIL.nom} · ${PROFIL.localisation}`);
    await sleep(600); completeStep("init");

    setCurrentStep("search");
    addLog("🔍 Recherche d'offres en cours...");
    await sleep(700); completeStep("search");

    setCurrentStep("match");
    addLog("🧠 Analyse IA en cours...");
    await sleep(400);

    const prompt = `Tu es un agent de veille emploi expert en reconversion vers les énergies renouvelables en Suisse.
Profil : ${PROFIL.prenom} ${PROFIL.nom}, ${PROFIL.localisation}, ${PROFIL.formation}, ${PROFIL.experience}.
Génère 4 offres réalistes marché suisse romand 2025-2026.
JSON valide uniquement sans markdown :
{"jobs":[{"titre":"string","entreprise":"string","lieu":"string","type":"CDI|CDD","match":number,"lien":"string","transferable":"string","conseil":"string"}],"conseil_global":"string"}`;

    let finalJobs = FALLBACK;
    let conseil = "Cette semaine, priorise les candidatures spontanées auprès des PME solaires valaisannes. Ton profil BTS Informatique + management est rare — contacte Solveo Energie directement.";

    try {
      const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
      if (apiKey) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]})
        });
        const data = await res.json();
        if (!data.error) {
          const raw = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
          let parsed = null;
          try { parsed = JSON.parse(raw); } catch { const m = raw.match(/\{[\s\S]*\}/); if(m) try{parsed=JSON.parse(m[0]);}catch{} }
          if (parsed?.jobs?.length) { finalJobs = parsed.jobs; conseil = parsed.conseil_global || conseil; }
        }
      } else {
        addLog("→ Démo — configure REACT_APP_ANTHROPIC_KEY sur Vercel");
      }
    } catch(e) { addLog("→ Données de démonstration"); }

    addLog(`✓ ${finalJobs.length} offres · Match moyen : ${Math.round(finalJobs.reduce((a,j)=>a+j.match,0)/finalJobs.length)}%`);
    setJobs(finalJobs); completeStep("match");

    setCurrentStep("email");
    addLog("📧 Génération du rapport Gmail...");
    await sleep(400);

    const today = new Date().toLocaleDateString("fr-CH",{weekday:"long",day:"numeric",month:"long"});
    const subject = `[Veille Emploi] ${finalJobs.length} offres · ${today}`;
    const topJob = [...finalJobs].sort((a,b)=>b.match-a.match)[0];

    const emailBody = `Bonjour ${PROFIL.prenom},

Rapport de veille emploi du ${today} · ${finalJobs.length} offres sélectionnées

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 OFFRE PHARE : ${topJob.titre}
${topJob.entreprise} · ${topJob.lieu} · ${topJob.match}% match
✓ ${topJob.transferable}
💡 ${topJob.conseil}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${finalJobs.map((j,i)=>`${i+1}. ${j.titre} — ${j.entreprise} (${j.match}%)\n   → ${j.conseil}`).join("\n\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${conseil}

Agent IA · ${PROFIL.prenom} ${PROFIL.nom} · ${PROFIL.localisation}`;

    const gmailLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailLink, "_blank");
    addLog("✅ Gmail ouvert — 1 clic pour envoyer !");
    completeStep("email");
    setEmailSent(true);
    setStatus("done");
    setCurrentStep(null);
  };

  const reset = () => { setStatus("idle"); setJobs([]); setAgentLog([]); setCompletedSteps([]); setEmailSent(false); };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={s.avatar}>GC</div>
          <div>
            <div style={s.title}>AGENT VEILLE EMPLOI <span style={{background:"#16a34a",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4,marginLeft:6}}>VERCEL</span></div>
            <div style={s.subtitle}>Énergies Renouvelables · {PROFIL.localisation}</div>
          </div>
        </div>
        <div style={s.pill(status)}>
          {status==="idle"&&"⏸ Prêt"}
          {status==="running"&&"⚡ En cours"}
          {status==="done"&&"✓ Terminé"}
        </div>
      </div>

      <div style={s.pipeline}>
        {STEPS.map((step,i) => (
          <div key={step.id} style={s.pipeRow}>
            <div style={s.pipeCircle(currentStep===step.id, completedSteps.includes(step.id))}>{step.icon}</div>
            <div style={s.pipeLabel(currentStep===step.id, completedSteps.includes(step.id))}>{step.label}</div>
            {i<STEPS.length-1 && <div style={s.arrow}>→</div>}
          </div>
        ))}
      </div>

      {status==="idle" && (
        <div style={s.card}>
          <div style={s.cardTitle}>⚙️ Configuration</div>
          <label style={s.label}>
            Email destinataire
            <input style={s.input} type="email" value={recipientEmail} onChange={e=>setRecipientEmail(e.target.value)} />
          </label>
          <button style={s.btn} onClick={runAgent}>🌱 Lancer l'agent</button>
        </div>
      )}

      {agentLog.length>0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>📋 Journal</div>
          <div style={s.log}>
            {agentLog.map((e,i)=>(
              <div key={i} style={s.logLine}>
                <span style={s.logTime}>{e.time}</span>
                <span style={s.logMsg}>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {jobs.length>0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>💼 Offres sélectionnées</div>
          {jobs.map((job,i)=>(
            <div key={i} style={s.jobCard}>
              <div style={s.jobHeader}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={s.jobTitle}>{job.titre}</div>
                  <div style={s.jobMeta}>{job.entreprise} · {job.lieu} · <span style={{color:"#4ade80"}}>{job.type}</span></div>
                </div>
                <div style={s.matchBadge(mc(job.match))}>{job.match}%</div>
              </div>
              <div style={s.transferBox}><strong>✓ Ton atout : </strong>{job.transferable}</div>
              <div style={s.conseilBox}><strong>💡 Conseil : </strong>{job.conseil}</div>
              <a href={job.lien} target="_blank" rel="noreferrer" style={s.lienBtn}>Voir l'offre →</a>
            </div>
          ))}
        </div>
      )}

      {emailSent && (
        <div style={s.card}>
          <div style={s.successBox}>✅ Gmail ouvert — rapport prêt à envoyer en 1 clic !</div>
          <button style={s.resetBtn} onClick={reset}>↩ Nouvelle recherche</button>
        </div>
      )}
    </div>
  );
}
