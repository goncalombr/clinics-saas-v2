import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { email } = await req.json();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: cu } = await supabase
    .from("clinic_users")
    .select("clinic_id")
    .eq("user_id", user.user.id)
    .single();

  const token = randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await supabase.from("clinic_invites").insert({
    clinic_id: cu!.clinic_id,
    email,
    token,
    expires_at: expires.toISOString(),
  });

  const inviteUrl = `http://localhost:3000/invite/${token}`;

  await resend.emails.send({
    from: "Clinics <onboarding@resend.dev>",
    to: email,
    subject: "Convite para a clínica",
    html: `
      <p>Foste convidado para aceder à clínica.</p>
      <p><a href="${inviteUrl}">Aceitar convite</a></p>
      <p>Este link expira em 7 dias.</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
