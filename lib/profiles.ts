import { createClient } from "@/lib/supabase/server";

export async function ensureProfile(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    { id: userId },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}
