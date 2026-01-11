import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ClassificaViaggiatori() {
  const [viaggiatori, setViaggiatori] = useState([]);
  const [azioni, setAzioni] = useState([]);

  useEffect(() => {
    fetchViaggiatori();
  }, []);

  const fetchViaggiatori = async () => {
    const { data } = await supabase
      .from("viaggiatori")
      .select("*")
      .order("punti", { ascending: false });
    setViaggiatori(data);
  };

  const mostraAzioni = async (viaggiatoreId) => {
    const { data } = await supabase
      .from("azioni")
      .select("*")
      .eq("viaggiatore_id", viaggiatoreId);
    setAzioni(data);
  };

  return (
    <div className="min-h-screen p-4 bg-yellow-50">
      <h1 className="text-2xl font-bold text-center mb-4 text-pink-600">
        Classifica Viaggiatori
      </h1>

      <ul className="mb-4">
        {viaggiatori.map((v, i) => (
          <li
            key={v.id}
            className="flex justify-between border-b py-1 px-2 hover:bg-yellow-100 rounded cursor-pointer"
            onClick={() => mostraAzioni(v.id)}
          >
            <span>
              {i + 1}. {v.nome}
            </span>
            <span>{v.punti} pt</span>
          </li>
        ))}
      </ul>

      {azioni.length > 0 && (
        <div className="bg-white p-2 rounded shadow">
          <h2 className="font-bold mb-2">Azioni selezionato</h2>
          <ul>
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
