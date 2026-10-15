"use client";
import { useState } from "react";
export default function OrganisatorPage() {
  const [email, setEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    if (!email || !projectName) { alert("Bitte E-Mail und Name eingeben"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, projectName }),
    });
    const data = await res.json();
    if (data.url) { window.location.href = data.url; }
  };
  return (
    <div className="min-h-screen bg-black text-white p-12">
      <h1 className="text-4xl font-bold">ORGANISATOR</h1>
      <p className="text-zinc-400 mb-8">Erstelle eine Zeitreise für 34,99€</p>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl">
        <input value={projectName} onChange={(e)=>setProjectName(e.target.value)} placeholder="Für wen? z.B. Katja - 35. Geburtstag" className="w-full mb-4 bg-black border border-zinc-700 rounded-lg px-4 py-3" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Deine E-Mail" className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3" />
        <div className="mt-6 bg-black rounded-xl p-6 border border-zinc-800">
          <div className="flex justify-between"><p>Zeitreise Paket</p><p className="text-2xl font-bold">34,99€</p></div>
          <button onClick={handleCheckout} className="w-full mt-6 bg-white text-black font-bold py-4 rounded-xl">{loading ? "Weiter..." : "Für 34,99€ freischalten"}</button>
        </div>
      </div>
    </div>
  );
}