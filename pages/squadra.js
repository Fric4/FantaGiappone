import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Squadra() {
  const [viaggiatori, setViaggiatori] = useState([]);
  const [selezionati, setSelezionati] = useState([]);
  const [randitz, setRanditz] = useState(100); // Randitz iniziali

  useEffect(() => {
    fetchViaggiatori();
  }, []);

  const fetchViaggiatori = async () => {
    const { data } = await supabase.from("viaggiatori").select("*");
    setViaggiatori(data);
  };

  const toggleViaggiatore = (v) => {
    // Non selezionare più di 3
    if (selezionati.includes(v)) {
      setSelezionati(selezionati.filter((s) => s.id !== v.id));
      setRanditz(randitz + v.costo);
    } else {
      if (selezionati.length < 3 && randitz >= v.costo) {
        setSelezionati([...selezionati, v]);
        setRanditz(randitz - v.costo);
      } else {
        alert("Non puoi selezionare più di 3 o superare i Randitz disponibili!");
      }
    }
  };

  const confermaSquadra = async () => {
    const giocatoreId = 1; // Sostituire con ID del giocatore loggato
    // Salva la squadra su Supabase
    for (let v of selezionati) {
      await supabase.from("squadre").insert({
        giocatore_id: giocatoreId,
        viaggiatore_id: v.id,
        punti: 0,
      });
    }
    alert("Squadra salvata!");
  };

  return (
    <div className="min-h-screen p-4 bg-yellow-50">
      <h1 className="text-2xl font-bold text-center mb-4 text-pink-600">
        Forma la tua squadra
      </h1>

      <p className="text-center mb-2">Randitz disponibili: {randitz}</p>

      <div className="grid grid-cols-1 gap-2">
        {viaggiatori.map((v) => (
          <button
            key={v.id}
            className={`w-full p-2 rounded border ${
              selezionati.includes(v)
                ? "bg-green-400 text-white"
                : "bg-white hover:bg-yellow-100"
            }`}
            onClick={() => toggleViaggiatore(v)}
          >
            {v.nome} - {v.costo} Randitz
          </button>
        ))}
      </div>

      <button
        className="mt-4 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        onClick={confermaSquadra}
      >
        Conferma Squadra
      </button>
    </div>
  );
}
