import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [giocatori, setGiocatori] = useState([]);
  const [miaSquadra, setMiaSquadra] = useState([]);
  const [puntiTotali, setPuntiTotali] = useState(0);

  useEffect(() => {
    fetchGiocatori();
    fetchMiaSquadra();
  }, []);

  // Classifica generale dei giocatori
  const fetchGiocatori = async () => {
    const { data } = await supabase
      .from("giocatori")
      .select("*")
      .order("punti", { ascending: false });
    setGiocatori(data);
  };

  // La tua squadra
  const fetchMiaSquadra = async () => {
    const giocatoreId = 1; // Per test, puoi prendere l'ID del giocatore loggato
    const { data } = await supabase
      .from("squadre")
      .select("viaggiatore:viaggiatori(*), punti")
      .eq("giocatore_id", giocatoreId);
    
    setMiaSquadra(data);
    const tot = data.reduce((acc, v) => acc + v.punti, 0);
    setPuntiTotali(tot);
  };

  return (
    <div className="min-h-screen p-4 bg-yellow-50">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
        FantaGiappone
      </h1>

      {/* Classifica generale */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2 text-center">Classifica Giocatori</h2>
        <ul>
          {giocatori.map((g, index) => (
            <li
              key={g.id}
              className="flex justify-between border-b py-1 px-2 hover:bg-yellow-100 rounded"
            >
              <span>{index + 1}. {g.nome}</span>
              <span>{g.punti} pt</span>
            </li>
          ))}
        </ul>
      </div>

      {/* La tua squadra */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2 text-center">La Mia Squadra</h2>
        <p className="text-center mb-2">Punti totali: {puntiTotali}</p>
        <ul>
          {miaSquadra.map((v) => (
            <li
              key={v.viaggiatore.id}
              className="flex justify-between border-b py-1 px-2 hover:bg-yellow-100 rounded"
            >
              <span>{v.viaggiatore.nome}</span>
              <span>{v.punti} pt</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="bg-pink-500 text-white px-4 py-2 rounded w-full hover:bg-pink-600 mb-4">
        Modifica Squadra
      </button>

      <button className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600">
        Vai alle Azioni / Aggiorna Punti
      </button>
    </div>
  );
}
