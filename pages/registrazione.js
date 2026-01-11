import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Registrazione() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!nome.trim()) {
      alert("Inserisci un nome valido!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("giocatori")
        .insert([{ nome: nome.trim(), randitz: 100 }])
        .select()
        .single();

      if (error || !data) {
        console.log(error);
        alert("Errore nella registrazione. Riprova!");
      } else {
        // Salva ID e nome del giocatore
        localStorage.setItem("giocatoreId", data.id);
        localStorage.setItem("giocatoreNome", data.nome);

        // Vai alla pagina squadra
        router.push("/squadra");
      }
    } catch (err) {
      console.log(err);
      alert("Errore inatteso. Riprova!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Registrati al FantaGiappone</h1>

      <input
        className="w-full border px-3 py-2 rounded mb-3"
        placeholder="Inserisci il tuo nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        disabled={loading}
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registrazione..." : "Registrati"}
      </button>
    </div>
  );
}
