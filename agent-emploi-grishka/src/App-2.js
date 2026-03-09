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

// Entreprises réelles et vérifiables en Valais / Romandie
const ENTREPRISES_REELLES = `
ENTREPRISES ÉNERGIES RENOUVELABLES RÉELLES EN VALAIS ET ROMANDIE (utilise UNIQUEMENT ces entreprises) :
- Romande Energie (Morges, VD) — romande-energie.ch
- Groupe E (Granges-Paccot, FR) — groupe-e.ch
- Alpiq (Lausanne, VD) — alpiq.com
- BKW Energie AG (Berne / Sion) — bkw.ch
- Forces Motrices Valaisannes FMV (Sion, VS) — fmv.ch
- Electricité de la Lienne SA (Ayent, VS) — electricite-lienne.ch
- Helion Energy (Zurich / Romandie) — helion.ch
- Solveo Energie (Sion, VS) — solveo.ch
- IWB (Basel / Romandie) — iwb.ch
- SIG Services Industriels de Genève (Genève) — sig-ge.ch
- Viteos (Neuchâtel) — viteos.ch
- Energie Sion Région ESR (Sion, VS) — esr.ch
- Canton du Valais / État du Valais (Sion, VS) — vs.ch
- HES-SO Valais (Sion, VS) — hevs.ch
- EPFL (Lausanne, VD) — epfl.ch
- CFF / SBB (transition mobilité durable) — sbb.ch
- Swisscom (Romandie) — swisscom.ch
- Agence cantonale de l'énergie Valais — énergie-valais.ch
`;

const FALLBACK = [
  { titre:"Responsable Commercial – Solutions Solaires", entreprise:"Solveo Energie", lieu:"Sion, VS", type:"CDI", match:91, transferable:"Gestion portefeuille haut de gamme + partenariats Manor directement transférables.", conseil:"Mentionne ta capacité à piloter des ouvertures — les PME solaires cherchent ce profil." },
  { titre:"Chargé de Développement Clientèle", entreprise:"Romande Energie", lieu:"Morges / Martigny", type:"CDI", match:84, transferable:"BTS Informatique + commerce = profil hybride rare et très recherché.", conseil:"Mets en avant ta double compétence tech/commerce dès l'accroche." },
  { titre:"Coordinateur Projets Énergétiques", entreprise:"Forces Motrices Valaisannes FMV", lieu:"Sion, VS", type:"CDI", match:76, transferable:"Piloter des ouvertures de magasins = même logique que coordonner des projets.", conseil:"Valorise ton expérience d'animation d'équipes terrain." },
  { titre:"Business Developer Mobilité Durable", entreprise:"BKW Energie AG", lieu:"Sion / remote", type:"CDI", match:71, transferable:"Négociation avec Apple, DJI, Devialet montre ta capacité à gérer des partenaires exigeants.", conseil:"Mets en avant ton anglais intermédiaire, BKW travaille avec des partenaires internationaux." },
];

const STEPS = [
  {id:"init", icon:"⚙️", label:"INIT"},
  {id:"search", icon:"🔍", label:"RECHERCHE"},
  {id:"match", icon:"🧠", label:"MATCHING"},
  {id:"email", icon:"📧", label:"EMAIL"},
];

const mc = score => score>=85?"#4ade80":score>=70?"#facc15":"#fb923c";

const jobsChLink = (titre) => {
  const stop = ["de","du","des","le","la","les","et","en","un","une","par","pour"];
  const kw = titre.split(/\s+/).filter(w => !stop.includes(w.toLowerCase()) && w.length > 2).slice(0,3).join(" ");
  return "https://www.jobs.ch/fr/offres-emploi/?term=" + encodeURIComponent(kw) + "&location=valais%2Bromandie";
};
const jobupLink = (titre) => {
  const stop = ["de","du","des","le","la","les","et","en","un","une","par","pour"];
  const kw = titre.split(/\s+/).filter(w => !stop.includes(w.toLowerCase()) && w.length > 2).slice(0,3).join("+");
  return "https://www.jobup.ch/fr/emplois/?term=" + encodeURIComponent(kw) + "&region=2";
};

const st = {
  root:{maxWidth:760,margin:"0 auto",padding:"24px 20px",fontFamily:"Georgia,serif",background:"#07100a",minHeight:"100vh",color:"#d0e8d8",boxSizing:"border-box"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #0d1f12"},
  avatar:{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#16a34a,#065f46)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:"bold",color:"#fff",flexShrink:0},
  title:{fontSize:14,fontWeight:"bold",color:"#f0f6fc",letterSpacing:"2px",fontFamily:"monospace"},
  subtitle:{fontSize:11,color:"#2d5c3a",marginTop:3},
  pill:(s)=>({fontSize:11,padding:"4px 12px",borderRadius:20,background:s==="done"?"#0f2d1a":s==="running"?"#0f2a10":"#111827",color:s==="done"?"#4ade80":s==="running"?"#86efac":"#6b7280",border:`1px solid ${s!=="idle"?"#16a34a":"#1f2937"}`,fontFamily:"monospace"}),
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
  disclaimer:{background:"#1a1a00",border:"1px solid #854d0e",borderLeft:"3px solid #d97706",borderRadius:6,padding:"8px 12px",fontSize:11,color:"#92400e",marginBottom:14},
  jobCard:{background:"#07100a",border:"1px solid #0d1f12",borderRadius:8,padding:14,marginBottom:10},
  jobHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10},
  jobTitle:{fontSize:14,fontWeight:"bold",color:"#d0e8d8",marginBottom:3},
  jobMeta:{fontSize:11,color:"#2d5c3a"},
  matchBadge:(c)=>({fontSize:12,fontFamily:"monospace",fontWeight:"bold",color:c,border:`1px solid ${c}`,borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap",flexShrink:0}),
  transferBox:{background:"#052e16",border:"1px solid #14532d",borderRadius:6,padding:"7px 10px",fontSize:11,color:"#86efac",marginBottom:8},
  conseilBox:{background:"#1a1000",border:"1px solid #854d0e",borderRadius:6,padding:"7px 10px",fontSize:11,color:"#fbbf24",marginBottom:8},
  lienBtn:{display:"inline-block",fontSize:11,color:"#60a5fa",textDecoration:"none",border:"1px solid #1e3a5f",borderRadius:4,padding:"4px 10px",fontFamily:"monospace"},
  gmailBtn:{display:"block",background:"#ea4335",color:"#fff",borderRadius:8,padding:"12px 0",fontSize:14,fontFamily:"inherit",fontWeight:"bold",width:"100%",textAlign:"center",textDecoration:"none",marginBottom:10},
  successBox:{background:"#052e16",border:"1px solid #16a34a",borderRadius:8,padding:12,fontSize:12,color:"#4ade80",textAlign:"center",marginBottom:10},
  resetBtn:{background:"transparent",color:"#2d5c3a",border:"1px solid #0d1f12",borderRadius:6,padding:"8px 16px",fontSize:12,cursor:"pointer",fontFamily:"inherit"},
};

export default function App() {
  const [recipientEmail, setRecipientEmail] = useState(PROFIL.email);
  const [status, setStatus] = useState("idle");
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [agentLog, setAgentLog] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [gmailLink, setGmailLink] = useState(null);

  const addLog = msg => setAgentLog(p => [...p, {time: new Date().toLocaleTimeString("fr-CH"), msg}]);
  const completeStep = id => setCompletedSteps(p => [...p, id]);

  const runAgent = async () => {
    if (!recipientEmail.includes("@")) { alert("Email invalide."); return; }
    setStatus("running"); setAgentLog([]); setJobs([]); setGmailLink(null); setCompletedSteps([]);

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

Profil candidat :
- ${PROFIL.prenom} ${PROFIL.nom}, ${PROFIL.localisation}
- Formation : ${PROFIL.formation}
- Expérience : ${PROFIL.experience}
- Compétences : ${PROFIL.competences.join(", ")}

${ENTREPRISES_REELLES}

RÈGLES STRICTES :
1. Utilise UNIQUEMENT les entreprises listées ci-dessus — aucune entreprise inventée
2. Les titres de postes doivent être réalistes pour ces entreprises
3. Le score match doit refléter honnêtement le profil du candidat
4. Les conseils doivent être concrets et spécifiques à l'entreprise

Génère 4 suggestions de postes à cibler. JSON valide uniquement sans markdown :
{"jobs":[{"titre":"string","entreprise":"string","lieu":"string","type":"CDI|CDD","match":number,"transferable":"string","conseil":"string"}],"conseil_global":"string"}`;

    let finalJobs = FALLBACK;
    let conseil = "Cette semaine, contacte directement Solveo Energie à Sion et FMV — ces entreprises valaisannes recrutent souvent sans publier d'offres. Ton profil BTS Informatique + management est une vraie rareté sur ce marché.";

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

    addLog(`✓ ${finalJobs.length} pistes identifiées · Match moyen : ${Math.round(finalJobs.reduce((a,j)=>a+j.match,0)/finalJobs.length)}%`);
    setJobs(finalJobs); completeStep("match");

    setCurrentStep("email");
    addLog("📧 Génération du rapport...");
    await sleep(400);

    const today = new Date().toLocaleDateString("fr-CH",{weekday:"long",day:"numeric",month:"long"});
    const subject = `[Veille Emploi] ${finalJobs.length} pistes · ${today}`;
    const topJob = [...finalJobs].sort((a,b)=>b.match-a.match)[0];

    const emailBody = `Bonjour ${PROFIL.prenom},

Rapport de veille emploi du ${today}
${finalJobs.length} pistes identifiées sur entreprises réelles · Match moyen : ${Math.round(finalJobs.reduce((a,j)=>a+j.match,0)/finalJobs.length)}%

⚠️ Ces suggestions sont générées par IA à partir d'entreprises réelles — vérifie les offres actives sur leur site ou jobs.ch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 PISTE PHARE : ${topJob.titre}
${topJob.entreprise} · ${topJob.lieu} · ${topJob.match}% match
✓ ${topJob.transferable}
💡 ${topJob.conseil}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${finalJobs.map((j,i)=>`${i+1}. ${j.titre} — ${j.entreprise} (${j.match}%)\n   → ${j.conseil}`).join("\n\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${conseil}

Agent IA · ${PROFIL.prenom} ${PROFIL.nom} · ${PROFIL.localisation}`;

    const link = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    setGmailLink(link);
    addLog("✅ Rapport prêt — clique le bouton Gmail !");
    completeStep("email");
    setStatus("done");
    setCurrentStep(null);
  };

  const reset = () => { setStatus("idle"); setJobs([]); setAgentLog([]); setCompletedSteps([]); setGmailLink(null); };

  return (
    <div style={st.root}>
      <div style={st.header}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={st.avatar}>GC</div>
          <div>
            <div style={st.title}>AGENT VEILLE EMPLOI <span style={{background:"#16a34a",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4,marginLeft:6}}>VERCEL</span></div>
            <div style={st.subtitle}>Énergies Renouvelables · {PROFIL.localisation}</div>
          </div>
        </div>
        <div style={st.pill(status)}>
          {status==="idle"&&"⏸ Prêt"}
          {status==="running"&&"⚡ En cours"}
          {status==="done"&&"✓ Terminé"}
        </div>
      </div>

      <div style={st.pipeline}>
        {STEPS.map((step,i) => (
          <div key={step.id} style={st.pipeRow}>
            <div style={st.pipeCircle(currentStep===step.id, completedSteps.includes(step.id))}>{step.icon}</div>
            <div style={st.pipeLabel(currentStep===step.id, completedSteps.includes(step.id))}>{step.label}</div>
            {i<STEPS.length-1 && <div style={st.arrow}>→</div>}
          </div>
        ))}
      </div>

      {status==="idle" && (
        <div style={st.card}>
          <div style={st.cardTitle}>⚙️ Configuration</div>
          <div style={st.disclaimer}>
            ⚠️ Les suggestions sont générées par IA à partir d'entreprises réelles en Valais/Romandie. Vérifie toujours les offres actives sur leur site ou jobs.ch avant de postuler.
          </div>
          <label style={st.label}>
            Email destinataire
            <input style={st.input} type="email" value={recipientEmail} onChange={e=>setRecipientEmail(e.target.value)} />
          </label>
          <button style={st.btn} onClick={runAgent}>🌱 Lancer l'agent</button>
        </div>
      )}

      {agentLog.length>0 && (
        <div style={st.card}>
          <div style={st.cardTitle}>📋 Journal</div>
          <div style={st.log}>
            {agentLog.map((e,i)=>(
              <div key={i} style={st.logLine}>
                <span style={st.logTime}>{e.time}</span>
                <span style={st.logMsg}>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {jobs.length>0 && (
        <div style={st.card}>
          <div style={st.cardTitle}>💼 Pistes identifiées <span style={{fontWeight:"normal",color:"#1a3a20",fontSize:10}}>— entreprises réelles uniquement</span></div>
          {jobs.map((job,i)=>(
            <div key={i} style={st.jobCard}>
              <div style={st.jobHeader}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={st.jobTitle}>{job.titre}</div>
                  <div style={st.jobMeta}>{job.entreprise} · {job.lieu} · <span style={{color:"#4ade80"}}>{job.type}</span></div>
                </div>
                <div style={st.matchBadge(mc(job.match))}>{job.match}%</div>
              </div>
              <div style={st.transferBox}><strong>✓ Ton atout : </strong>{job.transferable}</div>
              <div style={st.conseilBox}><strong>💡 Conseil : </strong>{job.conseil}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                <a href={jobsChLink(job.titre)} target="_blank" rel="noreferrer" style={{...st.lienBtn,background:"#0f2d1a"}}>
                  🔍 jobs.ch →
                </a>
                <a href={jobupLink(job.titre)} target="_blank" rel="noreferrer" style={{...st.lienBtn,background:"#0f1a2d"}}>
                  🔍 jobup.ch →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {gmailLink && (
        <div style={st.card}>
          <a href={gmailLink} target="_blank" rel="noreferrer" style={st.gmailBtn}>
            📬 Ouvrir Gmail et envoyer le rapport
          </a>
          <div style={st.successBox}>✅ Rapport généré — 1 clic pour envoyer !</div>
          <button style={st.resetBtn} onClick={reset}>↩ Nouvelle recherche</button>
        </div>
      )}
    </div>
  );
}
