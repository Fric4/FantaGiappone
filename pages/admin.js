import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

if (!supabase) {
  return <div className="p-4">Supabase non configurato</div>;
}

export default function Admin() {
  const [viaggiatori, setViaggiatori] = useState([]);
  const [azioni, setAzioni] = useState([]);
  const [nomeViaggiatore, setNomeViaggiatore] = useState("");
  const [costoViaggiatore, setCostoViaggiatore] = useState(10);
  const [descrizioneAzione, setDescrizioneAzione] = useState("");
  const [puntiAzione, setPuntiAzione] = useState(0);
  const [viaggiatoreSelezionato, setViaggiatoreSelezionato] = useState(null);

  useEffect(() => {
    fetchViaggiatori();
  }, []);

  const fetchViaggiatori = async () => {
    const { data } = await supabase.from("viaggiatori").select("*");
    setViaggiatori(data);
  };

  const addViaggiatore = async () => {
    if (!nomeViaggiatore) return alert("Inserisci un nome!");
    await supabase.from("viaggiatori").insert({
      nome: nomeViaggiatore,
      costo: costoViaggiatore,
      punti: 0,
    });
    setNomeViaggiatore("");
    setCostoViaggiatore(10);
    fetchViaggiatori();
  };

  const fetchAzioni = async (id) => {
    setViaggiatoreSelezionato(id);
    const { data } = await supabase
      .from("azioni")
      .select("*")
      .eq("viaggiatore_id", id);
    setAzioni(data);
  };

  const addAzione = async () => {
    if (!descrizioneAzione) return alert("Inserisci descrizione!");
    if (!viaggiatoreSelezionato) return alert("Seleziona un viaggiatore!");
    await supabase.from("azioni").insert({
      viaggiatore_id: viaggiatoreSelezionato,
      descrizione: descrizioneAzione,
      punti: puntiAzione,
    });
    setDescrizioneAzione("");
    setPuntiAzione(0);
    fetchAzioni(viaggiatoreSelezionato);
  };

  return (
    <div className="min-h-screen p-4 bg-yellow-50">
      <h1 className="text-2xl font-bold text-center text-pink-600 mb-4">
        Pannello Admin FantaGiappone
      </h1>

      {/* Aggiungi Viaggiatore */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Aggiungi Viaggiatore</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nomeViaggiatore}
          onChange={(e) => setNomeViaggiatore(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="Costo Randitz"
          value={costoViaggiatore}
          onChange={(e) => setCostoViaggiatore(parseInt(e.target.value))}
          className="border p-2 w-full mb-2 rounded"
        />
        <button
          onClick={addViaggiatore}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Aggiungi Viaggiatore
        </button>
      </div>

      {/* Lista viaggiatori */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Lista Viaggiatori</h2>
        <ul>
          {viaggiatori.map((v) => (
            <li
              key={v.id}
              className="flex justify-between border-b py-1 px-2 hover:bg-yellow-100 rounded cursor-pointer"
              onClick={() => fetchAzioni(v.id)}
            >
              <span>{v.nome}</span>
              <span>{v.costo} Randitz</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Aggiungi Azione */}
      {viaggiatoreSelezionato && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Aggiungi Azione per Viaggiatore</h2>
          <input
            type="text"
            placeholder="Descrizione azione"
            value={descrizioneAzione}
            onChange={(e) => setDescrizioneAzione(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="number"
            placeholder="Punti (+/-)"
            value={puntiAzione}
            onChange={(e) => setPuntiAzione(parseInt(e.target.value))}
            className="border p-2 w-full mb-2 rounded"
          />
          <button
            onClick={addAzione}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Aggiungi Azione
          </button>

          {/* Lista azioni */}
          <ul className="mt-2">
            {azioni.map((a) => (
              <li key={a.id} className="border-b py-1 px-2">
                {a.descrizione} → {a.punti} pt
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
