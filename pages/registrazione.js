import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Registrazione() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!nome) return alert("Inserisci un nome!");

    setLoading(true);

    // Inserimento giocatore con 100 Randitz
    const { data, error } = await supabase
      .from("giocatori")
      .insert([{ nome, randitz: 100 }])
      .select()
      .single(); // restituisce il giocatore inserito

    setLoading(false);

    if (error) {
      console.log(error);
      alert("Errore nella registrazione. Riprova!");
    } else {
      // Salva l'ID del giocatore in locale (puoi usarlo in altre pagine)
      localStorage.setItem("giocatoreId", data.id);
      localStorage.setItem("giocatoreNome", data.nome);

      // Vai alla pagina della squadra
      router.push("/squadra");
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
