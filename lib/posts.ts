import { createClient } from "@/lib/supabase/server";

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
};

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
};

export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapPostRow);
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapPostRow(data) : null;
}

export async function createPost(input: {
  title: string;
  content: string;
}): Promise<Post> {
  const title = input.title.trim();
  const content = input.content.trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  await ensureProfile(user.id);

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, user_id: user.id })
    .select("id, title, content, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapPostRow(data);
}

async function ensureProfile(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    { id: userId },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePostById(id: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getCurrentUserPostCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

function mapPostRow(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: "작성자",
    category: "일상",
    date: row.created_at ? formatDate(new Date(row.created_at)) : "",
    excerpt: buildExcerpt(row.content),
  };
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

function buildExcerpt(content: string, maxLength = 70): string {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}
