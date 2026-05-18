import { createClient } from "@/lib/supabase/client";

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (data.user) {
    await upsertProfileName(supabase, data.user);
  }
  return { data, error };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (data.user) {
    await upsertProfileName(supabase, data.user);
  }
  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

async function upsertProfileName(
  supabase: ReturnType<typeof createClient>,
  user: { id: string; email?: string; user_metadata?: { name?: unknown } }
) {
  const username = getAuthorName(user);

  if (!username) {
    return;
  }

  await supabase
    .from("profiles")
    .upsert({ id: user.id, username }, { onConflict: "id" });
}

function getAuthorName(user: {
  email?: string;
  user_metadata?: { name?: unknown };
}) {
  const metadataName = user.user_metadata?.name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim().slice(0, 80);
  }

  return user.email?.split("@")[0]?.trim().slice(0, 80) ?? "";
}
