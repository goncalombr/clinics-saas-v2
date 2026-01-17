"use client";

import { useState } from "react";
import { InfoIcon } from "lucide-react";

export default function ProtectedPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function invite() {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMsg("Convite enviado (ver consola)");
      setEmail("");
    } else {
      const t = await res.text();
      setMsg("Erro: " + t);
    }

    setLoading(false);
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="bg-accent text-sm p-3 px-5 rounded-md flex gap-3 items-center">
        <InfoIcon size="16" /> Área protegida
      </div>

      <div className="flex gap-2 max-w-sm">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email do utilizador"
          className="border p-2 flex-1"
        />
        <button
          onClick={invite}
          disabled={loading}
          className="border p-2"
        >
          {loading ? "..." : "Convidar"}
        </button>
      </div>

      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
