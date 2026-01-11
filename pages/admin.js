import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [azioni, setAzioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descrizione, setDescrizione] = useState("");
  const [punteggio, setPunteggio] = useState(0);
  const [viaggiatore, setViaggiatore] = useState("");

  // Fetch azioni dal DB
  useEffect(() => {
    if (!supabase) return;

    async function fetchAzioni() {
      setLoading(true);
      const { data, error } = await supabase.from("azioni").select("*");
      if (error) console.log("Errore fetch azioni:", error);
      else setAzioni(data);
      setLoading(false);
    }

    fetchAzioni();
  }, []);

  // Aggiungi nuova azione
  async function handleAdd() {
    if (!supabase || !descrizione || !viaggiatore) return;

    const { data, error } = await supabase
      .from("azioni")
      .insert([{ descrizione, punteggio, viaggiatore_id: viaggiatore }]);

    if (error) console.log("Errore insert:", error);
    else setAzioni([...azioni, data[0]]);

    setDescrizione("");
    setPunteggio(0);
    setViaggiatore("");
  }

  if (!supabase)
    return (
      <div className="p-4 text-center">
        Supabase non configurato correttamente.
      </div>
    );

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin FantaGiappone</h1>

      {/* Form inserimento azione */}
      <div className="mb-6 space-y-2">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Descrizione azione"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
        />
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          placeholder="Punti + o -"
          value={punteggio}
          onChange={(e) => setPunteggio(Number(e.target.value))}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="ID Viaggiatore"
          value={viaggiatore}
          onChange={(e) => setViaggiatore(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Aggiungi Azione
        </button>
      </div>

      {/* Lista azioni */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Azioni registrate</h2>
        {loading ? (
          <p>Caricamento...</p>
        ) : azioni.length === 0 ? (
          <p>Nessuna azione</p>
        ) : (
          <ul className="space-y-2">
            {azioni.map((a) => (
              <li
                key={a.id}
                className="border px-3 py-2 rounded flex justify-between items-center"
              >
                <span>
                  {a.descrizione} ({a.punteggio} punti) - Viaggiatore{" "}
                  {a.viaggiatore_id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
