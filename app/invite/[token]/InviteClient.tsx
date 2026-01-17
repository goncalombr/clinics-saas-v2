"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InviteClient({ token }: { token: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace(`/auth/login?redirect=/invite/${token}`);
        return;
      }

      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setError("Convite inválido ou expirado");
        return;
      }

      router.replace("/protected");
    };

    run();
  }, [router, supabase, token]);

  if (error) return <div>{error}</div>;

  return <div>A validar convite…</div>;
}
