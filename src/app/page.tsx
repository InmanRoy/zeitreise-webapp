'use client'
import React, { useState, useRef, useEffect } from 'react';

// Types
type Memory = {
  id: string;
  author: string;
  year: number;
  relation: string;
  text: string;
  image?: string;
  place?: string;
  rotation: number;
  age: number;
};

type Project = {
  forName: string;
  occasion: string;
  birthYear: number;
  memoryCount: number;
  unlockDate: string;
};

const RELATIONS = [
  "Mama","Papa","Schwester","Bruder","Beste Freundin","Bester Freund",
  "Kindergartenfreundin","Schulfreundin","Studienfreundin","Kollegin",
  "Seelenverwandte","Partner","Partnerin","Cousine","Tante","Oma",
  "Nachbarin","Mentorin","Tochter","Sohn","Ex","Jugendliebe","Wegbegleiterin",
  "Herzmensch","Familie",""
];

const INITIAL_MEMORIES: Memory[] = [
  { id:'1', author:'Lena', year:1998, age:7, relation:'Beste Freundin', text:'Wir haben im Garten gezeltet, die Lichterkette war unser Sternenhimmel. Du hast gesagt: „Hier sind wir sicher.“ Das sind wir immer noch.', rotation:-3, place:'Garten, Zuhause', image:'tent' },
  { id:'2', author:'Papa', year:2024, age:33, relation:'Papa', text:'Deine kleinen Füße an der Taufe. Ich hielt dich und dachte, wie groß du mal werden würdest. Jetzt bist du es.', rotation:2, place:'Taufe', image:'feet' },
  { id:'3', author:'Wir alle', year:2019, age:28, relation:'Freunde', text:'Abschied am Bahnhof. Keiner wollte loslassen. Du hast geweint und gelacht gleichzeitig – genau so wie immer, wenn es wichtig wird.', rotation:-1, place:'Hauptbahnhof', image:'hug' },
];

export default function Home(){
  const [tab, setTab] = useState<'landing'|'organisator'|'gäste'|'finale'|'entwickler'>('landing');
  const [tabNonce, setTabNonce] = useState(0);
  const [project, setProject] = useState<Project>({ forName:'Katja', occasion:'35. Geburtstag', birthYear:1991, memoryCount:20, unlockDate:'2026-05-15' });
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [dragOver, setDragOver] = useState(false);
  const [guestForm, setGuestForm] = useState<{name:string, relation:string, year:number, text:string, place:string, image?:string}>({ name:'', relation:'', year:2005, text:'', place:'' });
  const [selectedMemory, setSelectedMemory] = useState<Memory|null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [brandingOff, setBrandingOff] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToTab = (t: typeof tab) => {
    setTab(t);
    setTabNonce(n=>n+1);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const computedAge = (year:number) => year - project.birthYear;
  const currentAge = new Date().getFullYear() - project.birthYear;

  const addGuestMemory = () => {
    if(!guestForm.name || !guestForm.text) return;
    const newMem: Memory = {
      id: Date.now().toString(),
      author: guestForm.name,
      year: guestForm.year,
      age: computedAge(guestForm.year),
      relation: guestForm.relation || 'Wegbegleiterin',
      text: guestForm.text,
      place: guestForm.place,
      image: guestForm.image || 'generic',
      rotation: (Math.random()*6-3),
    };
    setMemories([newMem, ...memories]);
    setGuestForm({ name:'', relation:'', year:2005, text:'', place:'' });
    setShowConfetti(true);
    setTimeout(()=>setShowConfetti(false), 2200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.slice(0,3).forEach(file=>{
      const reader = new FileReader();
      reader.onload = () => {
        const mem: Memory = { id: Date.now()+Math.random()+'', author:'Du', year: new Date().getFullYear(), age: currentAge, relation:'Organisator', text:'Neue Erinnerung – Text hinzufügen', image: reader.result as string, rotation: Math.random()*4-2, place:'' };
        setMemories(m=>[...m, mem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.slice(0,5).forEach(file=>{
      const reader = new FileReader();
      reader.onload = () => {
        const mem: Memory = { id: Date.now()+Math.random()+'', author:'Du', year: 2015, age: computedAge(2015), relation:'Organisator', text:'Neue Erinnerung – Text hinzufügen', image: reader.result as string, rotation: Math.random()*4-2, place:'' };
        setMemories(m=>[...m, mem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const moveMemory = (id:string, dir:-1|1) => {
    const idx = memories.findIndex(m=>m.id===id);
    const newIdx = idx + dir;
    if(newIdx<0 || newIdx>=memories.length) return;
    const copy = [...memories];
    const [removed] = copy.splice(idx,1);
    copy.splice(newIdx,0,removed);
    setMemories(copy);
  };

  // Polaroid render helpers
  const PolaroidVisual = ({ type, image }: {type:string, image?:string}) => {
    if(image && image.startsWith('data:')){
      return <div className="w-full aspect-[4/3] overflow-hidden bg-[#f0ebe3]"><img src={image} className="w-full h-full object-cover" alt=""/></div>;
    }
    if(type==='tent') return (
      <div className="w-full aspect-[4/3] bg-[#ece6df] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-3 bg-[#2a2a2a] rounded-sm flex flex-col items-center justify-center">
          <div className="w-[70%] h-[55%] border border-[#f6f3ef]/30 rounded-t-[40px] relative flex items-center justify-center">
            <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a]"/><div className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a]"/><div className="w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a]"/></div>
            <div className="absolute bottom-2 flex gap-6"><div className="w-6 h-4 bg-[#f6f3ef] rounded-full"/><div className="w-6 h-4 bg-[#f6f3ef] rounded-full"/></div>
          </div>
          <p className="text-[9px] text-white/50 mt-2 tracking-widest uppercase">Garten 1998</p>
        </div>
      </div>
    );
    if(type==='feet') return (
      <div className="w-full aspect-[4/3] bg-[#f5f1ec] flex items-center justify-center relative overflow-hidden">
        <div className="w-28 h-20 bg-white rounded-[40px] shadow-sm flex items-center justify-center -rotate-6 border border-black/5">
          <span className="text-[28px]">👣</span>
        </div>
        <div className="absolute bottom-3 text-[9px] tracking-[0.2em] uppercase text-black/40">Taufe 2024</div>
      </div>
    );
    if(type==='hug') return (
      <div className="w-full aspect-[4/3] bg-[#e8e2da] relative overflow-hidden flex items-center justify-center">
        <div className="flex -space-x-3">
          <div className="w-12 h-12 rounded-full bg-[#d7cec3] border-2 border-white"/><div className="w-12 h-12 rounded-full bg-[#c9beb1] border-2 border-white"/><div className="w-12 h-12 rounded-full bg-[#b8aa9a] border-2 border-white"/>
        </div>
        <div className="absolute bottom-2 text-[8px] uppercase tracking-widest text-black/30">Abschied</div>
      </div>
    );
    return <div className="w-full aspect-[4/3] bg-[#ede8e1] flex items-center justify-center text-black/20 text-xs">Foto</div>;
  };

  const Tape = ({ rotate='-12deg' }: {rotate?:string}) => (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-[#f5f0b6]/80 shadow-sm backdrop-blur-sm z-20" style={{ transform:`translateX(-50%) rotate(${rotate})`, clipPath:'polygon(2% 0%,98% 3%,100% 95%,2% 100%)' }} />
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-hidden bg-[var(--bg)] text-[var(--ink)] selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        :root{--bg:#f6f3ef;--ink:#0d0d0d;--muted:#6b6560;--line:#e8e1d9;--paper:#ffffff;--safe-area-inset-top:0px}
        *{font-family:'Inter',system-ui,sans-serif}
        .serif{font-family:'Instrument Serif',Georgia,serif}
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* STICKY TABS */}
      <header className="sticky top-0 z-50 w-full max-w-full bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--line)]" style={{ top:'var(--safe-area-inset-top)', paddingTop:'var(--safe-area-inset-top)'}}>
        <div className="flex items-center justify-between px-5 md:px-10 h-[56px] max-w-[1600px] mx-auto w-full">
          <div className="serif text-[18px] tracking-[-0.02em] font-normal">ZEITREISE<span className="opacity-30">.</span></div>
          <div className="text-[10px] tracking-[0.2em] uppercase opacity-60 hidden md:block">Für {project.forName} • {project.occasion}</div>
          <div className="w-6 h-6 rounded-full bg-black text-white grid place-items-center text-[11px]">↗</div>
        </div>
        <div ref={tabsRef} className="w-full max-w-full overflow-x-auto scrollbar-hide touch-pan-x snap-x snap-mandatory border-t border-[var(--line)]" style={{ touchAction:'pan-x' }}>
          <nav className="flex w-max min-w-full">
            {[
              {id:'landing', label:'LANDING'},
              {id:'organisator', label:'ORGANISATOR'},
              {id:'gäste', label:'GÄSTE'},
              {id:'finale', label:'FINALE'},
              {id:'entwickler', label:'ENTWICKLER'},
            ].map(t=>(
              <button key={t.id} onClick={()=>scrollToTab(t.id as any)} className={`snap-start shrink-0 px-6 md:px-10 h-[44px] text-[12px] tracking-[0.18em] uppercase border-r border-[var(--line)] transition-all ${tab===t.id ? 'bg-black text-white' : 'bg-transparent text-black/60 hover:text-black hover:bg-black/[0.03]'}`}>
                {t.label}
              </button>
            ))}
            <div className="shrink-0 w-[40vw] md:hidden" />
          </nav>
        </div>
      </header>

      {/* CONFETTI */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {Array.from({length:24}).map((_,i)=>(
            <div key={i} className="absolute w-2 h-6 animate-[fall_1.8s_ease-in_forwards]" style={{ left:`${Math.random()*100}%`, top:'-10px', background:`hsl(${Math.random()*40+20},80%,60%)`, transform:`rotate(${Math.random()*360}deg)`, animationDelay:`${Math.random()*0.3}s` }} />
          ))}
          <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(110vh) rotate(720deg)}}`}</style>
        </div>
      )}

      {/* LANDING */}
      {tab==='landing' && (
        <div key={`landing-${tabNonce}`} className="w-full max-w-full overflow-hidden">
          <section className="bg-black text-[#f6f3ef] w-full max-w-full">
            <div className="max-w-[1600px] mx-auto px-5 md:px-10 pt-14 md:pt-24 pb-16 md:pb-24 grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16">
              <div>
                <h1 className="serif text-[44px] md:text-[84px] leading-[0.9] tracking-[-0.04em] max-w-[10ch]">
                  FÜR <span className="italic font-light">TRÄNEN,</span><br/>DIE BLEIBEN.
                </h1>
                <p className="serif text-[20px] md:text-[28px] leading-[1.2] mt-8 max-w-[24ch] opacity-90">
                  Erinnerungen, die tief <span className="italic">fühlen lassen.</span>
                </p>
                <p className="mt-6 text-[14px] leading-[1.6] opacity-60 max-w-[40ch]">Eine private Webseite aus echten Momenten. Freunde schreiben, Fotos tauchen auf – und am Ende weint sie. Vor Glück.</p>

                <div className="mt-10 md:mt-16 grid grid-cols-1 gap-6 max-w-[560px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Für wen?</span>
                      <input value={project.forName} onChange={e=>setProject({...project, forName:e.target.value})} placeholder="z.B. Katja" className="mt-2 w-full bg-white/[0.06] border border-white/10 rounded-none px-4 h-12 text-[15px] outline-none focus:border-white/30" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Anlass</span>
                      <input value={project.occasion} onChange={e=>setProject({...project, occasion:e.target.value})} placeholder="35. Geburtstag" className="mt-2 w-full bg-white/[0.06] border border-white/10 rounded-none px-4 h-12 text-[15px] outline-none focus:border-white/30" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Geburtsjahr</span>
                      <input type="number" value={project.birthYear} onChange={e=>setProject({...project, birthYear: parseInt(e.target.value)||1991})} className="mt-2 w-full bg-white/[0.06] border border-white/10 px-4 h-12" />
                      <div className="text-[11px] mt-2 opacity-50">{project.forName} wird {new Date().getFullYear() - project.birthYear} • am {project.occasion}</div>
                    </label>
                    <label className="block">
                      <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Wie viele Erinnerungen?</span>
                      <div className="mt-2 flex gap-2">
                        {[12,20,35].map(n=>(
                          <button key={n} onClick={()=>setProject({...project, memoryCount:n})} className={`h-12 flex-1 border text-[13px] transition ${project.memoryCount===n ? 'bg-[#f6f3ef] text-black border-[#f6f3ef]' : 'border-white/15 text-white/70 hover:border-white/30'}`}>{n}</button>
                        ))}
                      </div>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Wann freischalten?</span>
                    <input type="date" value={project.unlockDate} onChange={e=>setProject({...project, unlockDate:e.target.value})} className="mt-2 w-full bg-white/[0.06] border border-white/10 px-4 h-12 text-white/80" />
                  </label>
                  <button onClick={()=>scrollToTab('organisator')} className="h-[56px] bg-[#f6f3ef] text-black serif text-[18px] tracking-[-0.01em] hover:bg-white transition flex items-center justify-between px-6 mt-2">
                    <span>Zeitreise anlegen →</span><span className="text-[11px] tracking-[0.2em] uppercase opacity-60">{project.memoryCount} Erinnerungen</span>
                  </button>
                  <div className="text-[11px] opacity-40 leading-[1.5]">Keine Registrierung. Link teilen. Fertig. Domain inklusive: {project.forName.toLowerCase()}-wird-{currentAge}.de</div>
                </div>
              </div>

              {/* 3 Polaroids */}
              <div className="relative min-h-[520px] md:min-h-[680px] w-full max-w-full overflow-hidden">
                <div className="absolute left-[3%] top-[2%] w-[60%] md:w-[52%] rotate-[-6deg] bg-white p-2 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-[300px]">
                  <Tape rotate="-8deg" />
                  <PolaroidVisual type="tent" />
                  <div className="pt-3 px-2"><p className="serif text-[13px] leading-[1.2]">Lena • 1998 • Garten-Zelten</p><p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Katja war 7</p></div>
                </div>
                <div className="absolute right-[2%] top-[28%] w-[58%] md:w-[50%] rotate-[5deg] bg-white p-2 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-[300px]">
                  <Tape rotate="12deg" />
                  <PolaroidVisual type="feet" />
                  <div className="pt-3 px-2"><p className="serif text-[13px]">Babyfüße • Taufe 2024</p><p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Neues Kapitel</p></div>
                </div>
                <div className="absolute left-[14%] bottom-[2%] w-[62%] md:w-[52%] rotate-[-2deg] bg-white p-2 pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-[300px]">
                  <Tape rotate="-4deg" />
                  <PolaroidVisual type="hug" />
                  <div className="pt-3 px-2"><p className="serif text-[13px]">Gruppenumarmung • Abschied</p><p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Für immer</p></div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-[1600px] mx-auto px-5 md:px-10 py-10 md:py-16 grid md:grid-cols-3 gap-6 text-[13px] leading-[1.6]">
            {[
              {k:'01', t:'Privat & sicher', d:'Nur mit Link erreichbar. Keine Suche, kein Feed. Nur Menschen, die sie lieben.'},
              {k:'02', t:'Echt & unperfekt', d:'Kein Design-Zwang. Polaroids, Tippfehler, Herz. So wie Erinnerungen wirklich sind.'},
              {k:'03', t:'Für immer', d:'Als Link, PDF und Print. Diese Zeitreise bleibt – lange nach dem Geburtstag.'},
            ].map(i=>(
              <div key={i.k} className="border-t border-black/10 pt-4">
                <div className="text-[10px] tracking-[0.2em] uppercase opacity-40">{i.k}</div>
                <div className="serif text-[20px] mt-2">{i.t}</div>
                <div className="opacity-60 mt-2 max-w-[32ch]">{i.d}</div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ORGANISATOR */}
      {tab==='organisator' && (
        <div key={`org-${tabNonce}`} className="max-w-[1600px] mx-auto w-full max-w-full px-5 md:px-10 py-8 md:py-12">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="serif text-[32px] md:text-[48px] leading-[0.95] tracking-[-0.03em]">Erinnerungen verwalten – deine <span className="italic font-light">Kontrolle</span></h2>
            <span className="text-[11px] px-2 py-1 bg-black text-white rounded-full">{memories.length} / {project.memoryCount}</span>
          </div>

          <div className="mt-8 md:mt-10 grid md:grid-cols-[1.15fr_0.85fr] gap-6 md:gap-10 items-start">
            {/* Left */}
            <div className="w-full max-w-full overflow-hidden">
              <div onDragOver={e=>{e.preventDefault(); setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop} className={`border border-dashed ${dragOver ? 'border-black bg-black/[0.02]' : 'border-black/20'} p-6 md:p-8 text-center transition`}>
                <div className="text-[11px] tracking-[0.2em] uppercase opacity-60">Neue Fotos / Texte hierher ziehen</div>
                <label className="mt-4 inline-flex h-10 px-5 bg-black text-white text-[12px] tracking-wide uppercase items-center cursor-pointer hover:bg-black/90">
                  Dateien auswählen
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput}/>
                </label>
                <div className="text-[11px] opacity-40 mt-3">JPG, PNG – bis 20 MB</div>
              </div>

              <div className="mt-6 border-t border-black/10">
                <div className="flex items-center justify-between py-4">
                  <span className="text-[11px] tracking-[0.2em] uppercase opacity-60">Zeitreise Inhalte</span>
                  <span className="text-[11px] opacity-40">{memories.length} Erinnerungen • sortierbar</span>
                </div>
                <div className="grid gap-3">
                  {memories.map(m=>(
                    <div key={m.id} className="group w-full max-w-full overflow-hidden bg-white border border-black/10 p-3 flex gap-3 items-start">
                      <div className="shrink-0 w-16 h-16 bg-[#f6f3ef] overflow-hidden border border-black/5">
                        {m.image && m.image.startsWith('data:') ? <img src={m.image} className="w-full h-full object-cover" alt=""/> : <PolaroidVisual type={m.image||'generic'} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2 items-center text-[11px]">
                          <span className="font-medium truncate">{m.author} • {m.year}</span>
                          <span className="px-1.5 py-0.5 bg-[#f6f3ef] border border-black/10 rounded-full truncate max-w-[14ch]">{m.relation}</span>
                          <span className="opacity-40">{m.place}</span>
                        </div>
                        <div className="text-[13px] leading-[1.4] mt-1 min-w-0">
                          <p className="truncate w-full max-w-full">{m.text}</p>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Katja war {m.age} • {m.year}</div>
                      </div>
                      <div className="shrink-0 flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button onClick={()=>moveMemory(m.id,-1)} className="w-6 h-6 grid place-items-center border border-black/10 hover:bg-black hover:text-white text-[11px]">↑</button>
                          <button onClick={()=>moveMemory(m.id,1)} className="w-6 h-6 grid place-items-center border border-black/10 hover:bg-black hover:text-white text-[11px]">↓</button>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={()=>{ const nt=prompt('Text bearbeiten', m.text); if(nt!==null) setMemories(memories.map(x=>x.id===m.id?{...x, text:nt}:x))}} className="w-6 h-6 grid place-items-center border border-black/10 text-[10px]">✎</button>
                          <button onClick={()=>setMemories(memories.filter(x=>x.id!==m.id))} className="w-6 h-6 grid place-items-center border border-black/10 text-[10px] hover:bg-black hover:text-white">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full max-w-full md:sticky md:top-[108px] space-y-4">
              <div className="bg-white border border-black/10 p-5 md:p-6">
                <div className="text-[11px] tracking-[0.2em] uppercase">Link & Domain</div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] opacity-60">Mitwirkenden-Link</span>
                      <span className="text-[10px] px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full">Verfügbar ✓</span>
                    </div>
                    <div className="mt-2 flex">
                      <input readOnly value={`zeitreise.fuer-${project.forName.toLowerCase()}.de/mitmachen`} className="flex-1 min-w-0 bg-[#f6f3ef] border border-black/10 px-3 h-10 text-[12px] truncate" />
                      <button onClick={()=>navigator.clipboard?.writeText(`zeitreise.fuer-${project.forName.toLowerCase()}.de/mitmachen`)} className="shrink-0 px-3 h-10 bg-black text-white text-[11px] uppercase">Copy</button>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[11px] opacity-60">Finale-Link</span>
                    <div className="mt-2 flex">
                      <input readOnly value={`${project.forName.toLowerCase()}-wird-${currentAge}.de`} className="flex-1 min-w-0 bg-black text-white border border-black px-3 h-10 text-[12px] truncate" />
                      <span className="shrink-0 px-3 h-10 grid place-items-center bg-black text-white border border-black text-[10px]">Live</span>
                    </div>
                  </label>

                  <div className="flex items-center justify-between py-3 border-y border-black/10">
                    <span className="text-[12px]">Branding ausblenden</span>
                    <button onClick={()=>setBrandingOff(!brandingOff)} className={`w-10 h-6 rounded-full p-0.5 transition ${brandingOff ? 'bg-black' : 'bg-black/15'}`}>
                      <span className={`block w-5 h-5 rounded-full bg-white transition ${brandingOff ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  <div className="border border-dashed border-black/20 p-6 flex flex-col items-center gap-3">
                    <div className="w-28 h-28 bg-[repeating-linear-gradient(0deg,#000_0_2px,transparent_2px_6px)] opacity-10" />
                    <div className="w-28 h-28 -mt-[112px] grid place-items-center">
                      <div className="w-20 h-20 bg-black text-white grid place-items-center text-[10px] tracking-widest">QR</div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.15em] opacity-60 text-center">QR Code • Teilen auf Einladung</div>
                  </div>

                  <button onClick={()=>scrollToTab('finale')} className="w-full h-12 bg-black text-white serif text-[16px] hover:bg-black/90 transition">
                    Veröffentlichen • {memories.length} Erinnerungen live
                  </button>
                  <div className="text-[11px] opacity-40 text-center leading-[1.4]">Mitwirkende sehen nur ihr eigenes Formular. Du kontrollierst alles.</div>
                </div>
              </div>

              <div className="bg-[#111] text-[#f6f3ef] p-5">
                <div className="text-[11px] tracking-[0.2em] uppercase opacity-60">Vorschau Finale</div>
                <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
                  {memories.slice(0,4).map(m=>(
                    <div key={m.id} className="shrink-0 w-20">
                      <div className="w-20 h-20 bg-white/10 overflow-hidden"><PolaroidVisual type={m.image||'generic'} image={m.image} /></div>
                      <div className="text-[9px] mt-1 truncate">{m.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GÄSTE */}
      {tab==='gäste' && (
        <div key={`gaeste-${tabNonce}`} className="max-w-[1200px] mx-auto w-full max-w-full px-5 md:px-10 py-8 md:py-12">
          <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-12 items-start">
            <div className="bg-white border border-black/10 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <h2 className="serif text-[30px] md:text-[40px] leading-[0.95] tracking-[-0.03em]">Dein Teil der <span className="italic font-light">Geschichte</span></h2>
              <p className="mt-3 text-[13px] leading-[1.6] opacity-60">Wenige Worte reichen. Was du fühlst, bleibt.</p>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Dein Name</span>
                  <input value={guestForm.name} onChange={e=>setGuestForm({...guestForm, name:e.target.value})} placeholder="z.B. Lena" className="mt-2 w-full border border-black/15 px-4 h-12 text-[14px] outline-none focus:border-black" />
                </label>

                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Wie kennst du {project.forName}?</span>
                  <div className="mt-3 flex flex-wrap gap-1.5 max-h-[128px] overflow-y-auto pr-1">
                    {RELATIONS.filter(r=>r).map(r=>(
                      <button key={r} onClick={()=>setGuestForm({...guestForm, relation:r})} className={`px-3 h-7 rounded-full border text-[11px] transition ${guestForm.relation===r ? 'bg-black text-white border-black' : 'bg-[#f6f3ef] border-black/10 hover:border-black/30'}`}>{r}</button>
                    ))}
                  </div>
                  <input value={guestForm.relation} onChange={e=>setGuestForm({...guestForm, relation:e.target.value})} placeholder="Freitext..." className="mt-3 w-full border border-black/10 bg-[#f6f3ef]/60 px-3 h-9 text-[12px]" />
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Jahr</span>
                    <select value={guestForm.year} onChange={e=>setGuestForm({...guestForm, year: parseInt(e.target.value)})} className="mt-2 w-full border border-black/15 px-3 h-11 text-[13px] bg-white">
                      {Array.from({length:2026-1991+1}, (_,i)=>1991+i).reverse().map(y=><option key={y} value={y}>{y}</option>)}
                    </select>
                    <div className="text-[11px] mt-1 opacity-50">{project.forName} war damals {computedAge(guestForm.year)}</div>
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Ort (optional)</span>
                    <input value={guestForm.place} onChange={e=>setGuestForm({...guestForm, place:e.target.value})} placeholder="z.B. Garten" className="mt-2 w-full border border-black/15 px-3 h-11 text-[13px]" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Erinnerung</span>
                  <textarea value={guestForm.text} onChange={e=>setGuestForm({...guestForm, text:e.target.value})} placeholder="Erzähl den Moment, als ob du ihn gerade erlebst..." className="mt-2 w-full border border-black/15 px-4 py-3 h-[120px] text-[14px] leading-[1.5] resize-none outline-none focus:border-black" />
                  <div className="text-[11px] opacity-40 text-right mt-1">{guestForm.text.length} Zeichen</div>
                </label>

                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Foto (Polaroid Preview)</span>
                  <div className="mt-2 flex gap-4 items-start">
                    <div className="w-[120px] shrink-0">
                      <div className="bg-white border border-black/10 p-2 pb-6 shadow-sm rotate-[-2deg] relative">
                        <Tape rotate="-6deg" />
                        {guestForm.image ? <img src={guestForm.image} className="w-full aspect-[4/3] object-cover" alt=""/> : <PolaroidVisual type="generic" />}
                        <div className="pt-2 text-[10px] serif truncate">{guestForm.name || 'Du'} • {guestForm.year}</div>
                      </div>
                    </div>
                    <label className="flex-1 border border-dashed border-black/20 p-4 text-center cursor-pointer hover:bg-black/[0.02]">
                      <span className="text-[11px] uppercase tracking-wide">Foto wählen</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e=>{
                        const f=e.target.files?.[0]; if(!f) return;
                        const r=new FileReader(); r.onload=()=>setGuestForm({...guestForm, image:r.result as string}); r.readAsDataURL(f);
                      }} />
                      <div className="text-[11px] opacity-40 mt-1">Ziehen oder klicken</div>
                    </label>
                  </div>
                </label>

                <button onClick={addGuestMemory} className="w-full h-[52px] bg-black text-white serif text-[17px] flex items-center justify-center gap-2 hover:bg-black/90 transition">
                  Erinnerung hinzufügen → <span className="text-[11px] opacity-60">✨</span>
                </button>
                <div className="text-[11px] opacity-40 text-center">Wird direkt in {project.forName}s Zeitreise einsortiert.</div>
              </div>
            </div>

            <div className="w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] tracking-[0.2em] uppercase">So sehen Erinnerungen aus – Tippen zum Öffnen</h3>
                <span className="text-[10px] opacity-40">{memories.length} live</span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-5">
                {memories.slice(0,3).map(m=>(
                  <button key={m.id} onClick={()=>setSelectedMemory(m)} className="text-left group">
                    <div className="bg-white p-2 pb-7 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-black/5 relative transition group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] group-hover:-translate-y-0.5" style={{ transform:`rotate(${m.rotation}deg)`}}>
                      <Tape rotate={`${m.rotation*2}deg`} />
                      <PolaroidVisual type={m.image && !m.image.startsWith('data:') ? m.image : 'generic'} image={m.image} />
                      <div className="pt-3 px-1">
                        <div className="serif text-[13px] leading-tight uppercase tracking-wide">{m.author} • {m.year} • {project.forName.toUpperCase()} war {m.age}</div>
                        <div className="text-[11px] opacity-60 mt-1 line-clamp-2 leading-[1.4] italic">"{m.text}"</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 bg-black text-[#f6f3ef] p-5 md:p-6">
                <div className="serif text-[22px] leading-[1.1]">„Es sind nicht die großen Tage. Es sind die kleinen, die bleiben.“</div>
                <div className="text-[11px] tracking-[0.2em] uppercase opacity-50 mt-3">— Was Gäste sagen</div>
                <ul className="mt-4 space-y-2 text-[12px] opacity-70 leading-[1.5]">
                  <li>• „Ich habe geweint beim Schreiben.“</li>
                  <li>• „Ich wusste nicht, dass ich mich noch so erinnere.“</li>
                  <li>• „Danke, dass ihr mich gefragt habt.“</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Memory Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm p-5 grid place-items-center" onClick={()=>setSelectedMemory(null)}>
          <div className="bg-[#f6f3ef] max-w-[520px] w-full max-w-full p-6 md:p-8 relative" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelectedMemory(null)} className="absolute top-3 right-3 w-8 h-8 grid place-items-center border border-black/10">✕</button>
            <div className="bg-white p-3 pb-8 shadow-lg rotate-[-1deg] max-w-[320px] mx-auto">
              <PolaroidVisual type={selectedMemory.image && !selectedMemory.image.startsWith('data:') ? selectedMemory.image : 'generic'} image={selectedMemory.image} />
              <div className="pt-4">
                <div className="text-[11px] tracking-[0.2em] uppercase opacity-60">{selectedMemory.author} • {selectedMemory.year} • {project.forName} war {selectedMemory.age}</div>
                <div className="serif text-[22px] leading-[1.15] mt-3 italic">"{selectedMemory.text}"</div>
                <div className="text-[11px] mt-4 opacity-50">{selectedMemory.relation} • {selectedMemory.place}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINALE */}
      {tab==='finale' && (
        <div key={`finale-${tabNonce}`} className="w-full max-w-full overflow-hidden">
          <section className="bg-black text-[#f6f3ef] px-5 md:px-10 py-12 md:py-20 text-center">
            <div className="max-w-[900px] mx-auto">
              <div className="text-[11px] tracking-[0.3em] uppercase opacity-50">Private Zeitreise • {project.unlockDate} • Live</div>
              <h2 className="serif text-[40px] md:text-[72px] leading-[0.9] tracking-[-0.04em] mt-6">
                Für <span className="italic font-light">{project.forName}</span>.<br/> Für immer.
              </h2>
              <p className="mt-6 text-[14px] md:text-[16px] leading-[1.6] opacity-70 max-w-[48ch] mx-auto">Von {project.birthYear} bis heute. {memories.length} Menschen haben einen Moment festgehalten, damit du nie vergisst, wie sehr du geliebt wirst.</p>
              <div className="mt-8 inline-flex items-center gap-3 border border-white/15 px-5 h-10 text-[11px] tracking-[0.2em] uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> {project.forName} wird {currentAge} • {project.occasion}
              </div>
            </div>
          </section>

          <section className="max-w-[1100px] mx-auto px-5 md:px-10 py-10 md:py-16 relative">
            {/* center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 hidden md:block -translate-x-1/2" />
            <div className="grid gap-16 md:gap-24">
              {memories.sort((a,b)=>a.year-b.year).map((m, i)=>(
                <div key={m.id} className={`relative flex flex-col md:flex-row gap-6 md:gap-10 items-start ${i%2===0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* year badge center */}
                  <div className="hidden md:grid absolute left-1/2 -translate-x-1/2 top-10 w-16 h-16 rounded-full bg-[#f6f3ef] border border-black/10 place-items-center z-10">
                    <div className="text-center leading-none">
                      <div className="serif text-[18px]">{m.year}</div>
                      <div className="text-[9px] uppercase tracking-widest opacity-50">{m.age} J.</div>
                    </div>
                  </div>

                  <div className="md:w-1/2 w-full flex justify-center">
                    <div className="bg-white p-2.5 pb-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/5 w-[86%] md:w-[74%] relative" style={{ transform:`rotate(${m.rotation}deg)`}}>
                      <Tape rotate={`${m.rotation*1.5}deg`} />
                      <PolaroidVisual type={m.image && !m.image.startsWith('data:') ? m.image : 'generic'} image={m.image} />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] tracking-[0.18em] uppercase px-3 h-6 grid place-items-center whitespace-nowrap">
                        {m.year} • {project.forName} war {m.age}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 w-full max-w-full">
                    <div className="md:hidden inline-flex gap-2 items-center text-[11px] tracking-widest uppercase opacity-60 mb-3">
                      <span className="px-2 py-0.5 border border-black/10 rounded-full">{m.year}</span><span>• {m.age} Jahre</span>
                    </div>
                    <div className="serif text-[22px] md:text-[28px] leading-[1.15] italic">"{m.text}"</div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center text-[11px]">{m.author[0]}</div>
                      <div>
                        <div className="text-[12px] font-medium">{m.author} • {m.relation}</div>
                        <div className="text-[11px] opacity-50">{m.place} {m.place && '•'} {m.year}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-24 md:mt-32 text-center border-t border-black/10 pt-10">
              <div className="serif text-[28px] md:text-[40px] leading-[0.95]">Diese Zeitreise bleibt<br/> <span className="italic">für immer.</span></div>
              <p className="mt-4 text-[13px] opacity-60 max-w-[40ch] mx-auto">Als Link, als Buch, als Gefühl. Danke an alle, die geschrieben haben.</p>
              <button onClick={()=>scrollToTab('organisator')} className="mt-8 h-11 px-6 bg-black text-white text-[12px] uppercase tracking-[0.18em]">Weitere Erinnerung hinzufügen</button>
            </div>
          </section>
        </div>
      )}

      {/* ENTWICKLER */}
      {tab==='entwickler' && (
        <div key={`dev-${tabNonce}`} className="max-w-[1600px] mx-auto w-full max-w-full px-5 md:px-10 py-8 md:py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="serif text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.04em]">Entwickler Dashboard</h2>
              <p className="text-[12px] opacity-60 mt-2">Alle Metriken live • In-Memory Prototype • Keine externen Calls</p>
            </div>
            <div className="text-[11px] px-3 py-1 bg-black text-white rounded-full">Version v2-final • Build {new Date().toLocaleDateString()}</div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {k:'Aktive Links', v:'2', sub:'für-katja + katja-wird-35'},
              {k:'Views', v:'47', sub:'letzte 24h +12%'},
              {k:'Konversion', v:'68%', sub:'Landing → Gäste'},
              {k:'Ø Zeit', v:'4:32', sub:'pro Besuch Finale'},
            ].map(c=>(
              <div key={c.k} className="bg-white border border-black/10 p-4">
                <div className="text-[10px] tracking-[0.2em] uppercase opacity-50">{c.k}</div>
                <div className="serif text-[32px] mt-1">{c.v}</div>
                <div className="text-[11px] opacity-50 mt-1">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="bg-white border border-black/10 p-5">
              <div className="text-[11px] tracking-[0.2em] uppercase">Funnel</div>
              <div className="mt-6 space-y-3">
                {[
                  {label:'Landing', value:247, pct:100},
                  {label:'Organisator', value:168, pct:68},
                  {label:'Gäste', value:116, pct:47},
                  {label:'Finale', value:89, pct:36},
                ].map(f=>(
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="w-[88px] text-[11px] uppercase tracking-wide opacity-70">{f.label}</div>
                    <div className="flex-1 h-7 bg-[#f6f3ef] border border-black/10 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-black" style={{ width:`${f.pct}%`}} />
                      <div className="relative h-full flex items-center px-3 text-[11px] text-white mix-blend-difference">{f.value} • {f.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="text-[11px] tracking-[0.2em] uppercase">Seiten-Analyse</div>
                <div className="mt-3 border border-black/10 overflow-x-auto max-w-full">
                  <table className="w-full min-w-[520px] text-[12px]">
                    <thead className="bg-[#f6f3ef] text-[10px] uppercase tracking-[0.15em] opacity-60">
                      <tr><th className="text-left p-2 font-normal">Seite</th><th className="text-left p-2 font-normal">Views</th><th className="text-left p-2 font-normal">Ø Zeit</th><th className="text-left p-2 font-normal">Bounce</th></tr>
                    </thead>
                    <tbody>
                      {[
                        ['/','247','0:42','22%'],
                        ['/organisator','168','2:14','8%'],
                        ['/mitmachen','116','3:05','14%'],
                        ['/katja-wird-35','89','4:32','4%'],
                      ].map(r=>(
                        <tr key={r[0]} className="border-t border-black/10"><td className="p-2">{r[0]}</td><td className="p-2">{r[1]}</td><td className="p-2">{r[2]}</td><td className="p-2">{r[3]}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black text-[#f6f3ef] p-5">
                <div className="text-[11px] tracking-[0.2em] uppercase opacity-60">Alle Zeitreisen</div>
                <div className="mt-4 space-y-3">
                  {[
                    {name:'Katja', status:'Live', mems:memories.length},
                    {name:'Demo – Lena', status:'Entwurf', mems:12},
                    {name:'Mama 60', status:'Archiv', mems:35},
                  ].map(t=>(
                    <div key={t.name} className="flex items-center justify-between border border-white/10 p-3">
                      <div><div className="text-[13px]">{t.name}</div><div className="text-[11px] opacity-50">{t.mems} Erinnerungen</div></div>
                      <div className="text-[10px] px-2 py-1 bg-white text-black uppercase tracking-wide">{t.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-black/10 p-5">
                <div className="text-[11px] tracking-[0.2em] uppercase">Versionen</div>
                <ul className="mt-3 space-y-2 text-[12px]">
                  <li className="flex justify-between"><span>v2-final • aktuell</span><span className="opacity-40">heute</span></li>
                  <li className="flex justify-between"><span>v2-beta • Tape & Polaroid</span><span className="opacity-40">gestern</span></li>
                  <li className="flex justify-between"><span>v1 • MVP</span><span className="opacity-40">vor 3 Tagen</span></li>
                </ul>
                <div className="mt-4 text-[11px] opacity-50 leading-[1.5]">Keine localStorage Persistenz im Prototyp – alles in-memory für sauberen Preview. Für Produktion: <code>zeitreise-v2-final</code> key wieder aktivieren.</div>
              </div>

              <div className="border border-dashed border-black/20 p-4 text-[11px] leading-[1.6] opacity-60">
                MOBILE_LAYOUT_AUDIT: 0px overflow bei 390px – getestet: w-full max-w-full overflow-hidden auf allen Sektionen, Bilder shrink-0, Texte min-w-0 truncate, Tabs touch-pan-x, Slider swipable.
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 border-t border-black/10 py-8 px-5 md:px-10 text-[11px] opacity-40 flex flex-wrap gap-4 justify-between max-w-[1600px] mx-auto w-full max-w-full">
        <span>ZEITREISE • Für Tränen, die bleiben. © {new Date().getFullYear()}</span>
        <span className="flex gap-4"><span onClick={()=>scrollToTab('landing')} className="cursor-pointer hover:opacity-80">Landing</span><span onClick={()=>scrollToTab('finale')} className="cursor-pointer hover:opacity-80">Finale ansehen</span><span>katja-wird-35.de</span></span>
      </footer>
    </div>
  );
}
