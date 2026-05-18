import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export async function ensureProfile(userId: string, username?: string | null) {
  const supabase = await createClient();
  const trimmedUsername = username?.trim();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      ...(trimmedUsername ? { username: trimmedUsername.slice(0, 80) } : {}),
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export async function updateAvatarUrl(userId: string, avatarUrl: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
