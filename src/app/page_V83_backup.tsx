'use client';
import { useState } from 'react';

const ORTE = [
  "Berlin 1923 - Alexanderplatz",
  "Paris 1968 - Barrikaden",
  "New York 1955 - Times Square",
  "Karlsruhe 1985 - Schloss",
  "Achern 1995 - Heimat",
];

export default function Home() {
  const [ort, setOrt] = useState(ORTE[0]);
  const [wer, setWer] = useState("");
  const [jahr, setJahr] = useState("");
  const [bildName, setBildName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBildName(f.name);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">ZEITREISE V83</h1>
        <p className="text-zinc-400 mt-2">Catalina Edition – läuft!</p>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">

          <div>
            <label className="text-sm text-zinc-400">Ort wählen (Dropdown)</label>
            <select value={ort} onChange={e=>setOrt(e.target.value)}
              className="mt-2 w-full bg-black border border-zinc-700 rounded-xl px-4 py-3">
              {ORTE.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Bild hochladen</label>
            <input type="file" accept="image/*" onChange={onFile}
              className="mt-2 w-full bg-black border border-zinc-700 rounded-xl px-4 py-3" />
            {preview && <img src={preview} alt="" className="mt-4 rounded-xl border border-zinc-700 max-h-72 w-full object-cover" />}
            {bildName && <p className="mt-2 text-xs text-zinc-500">{bildName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Wer</label>
              <input value={wer} onChange={e=>setWer(e.target.value)} placeholder="z.B. Opa Hans"
                className="mt-2 w-full bg-black border border-zinc-700 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Jahr + Bild</label>
              <input value={jahr} onChange={e=>setJahr(e.target.value)} placeholder="z.B. 1972, 35mm"
                className="mt-2 w-full bg-black border border-zinc-700 rounded-xl px-4 py-3" />
            </div>
          </div>

          <button onClick={()=>alert(`Zeitreise:\nOrt: ${ort}\nWer: ${wer}\nJahr/Bild: ${jahr}`)}
            className="w-full bg-white text-black font-bold rounded-xl py-4">
            Zeitreise starten →
          </button>

          <p className="text-center text- text-zinc-600">Next 14.2.5 | Tailwind 3.4.1 | iMac 2013 Catalina</p>
        </div>
      </div>
    </main>
  );
}