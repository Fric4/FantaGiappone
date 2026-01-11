import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Registrazione() {
  const [nome, setNome] = useState("");

  async function handleRegister() {
    if (!supabase || !nome) return;
    // Inserimento nel DB
    const { data, error } = await supabase.from("giocatori").insert([{ nome, randitz: 100 }]);
    if (error) console.log(error);
    else alert("Registrazione completata!");
    setNome("");
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrati</h1>
      <input
        className="w-full border px-3 py-2 rounded mb-3"
        placeholder="Inserisci il tuo nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleRegister}
      >
        Registrati
      </button>
    </div>
  );
}
