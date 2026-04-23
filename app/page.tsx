import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginPageClient from "./login-page-client";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/home");
  }

  return <LoginPageClient />;
}
