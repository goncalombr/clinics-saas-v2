import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function InvitePage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  // se não estiver logado → login + voltar aqui
  if (!user.user) {
    redirect(`/auth/login?redirect=/invite/${token}`);
  }

  const { data: invite } = await supabase
    .from("clinic_invites")
    .select("*")
    .eq("token", token)
    .single();

  if (!invite || invite.used_at || new Date(invite.expires_at) < new Date()) {
    return <div>Convite inválido ou expirado</div>;
  }

  await supabase.from("clinic_users").insert({
    user_id: user.user.id,
    clinic_id: invite.clinic_id,
    role: "member",
  });

  await supabase
    .from("clinic_invites")
    .update({ used_at: new Date().toISOString() })
    .eq("id", invite.id);

  redirect("/protected");
}
