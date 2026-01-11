import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Registrazione() {
  const [nome, setNome] = useState("");
  const router = useRouter();

  const registraGiocatore = async () => {
    if (!nome) return alert("Inserisci il tuo nome!");

    // Inserisce il giocatore con 100 Randitz iniziali
    const { data, error } = await supabase.from("giocatori").insert([
      { nome: nome, randitz: 100, punti: 0 },
    ]);

    if (error) {
      alert("Errore nella registrazione: " + error.message);
      return;
    }

    alert("Registrazione completata! Ora puoi formare la tua squadra.");
    router.push("/squadra"); // manda alla pagina per formare la squadra
  };

  return (
    <div className="min-h-screen p-4 bg-yellow-50 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Registrati al FantaGiappone</h1>
      <input
        type="text"
        placeholder="Inserisci il tuo nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="border p-2 w-full max-w-xs mb-4 rounded"
      />
      <button
        onClick={registraGiocatore}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full max-w-xs"
      >
        Registrati
      </button>
    </div>
  );
}
