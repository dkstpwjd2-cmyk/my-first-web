import { createClient } from "@/lib/supabase/server";

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  isPractice?: boolean;
};

type PostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
};

const practicePosts: Post[] = [
  {
    id: "1",
    title: "첫 번째 포스트",
    date: "2026년 3월 25일",
    category: "일상",
    author: "안세정",
    excerpt: "블로그를 시작하며 앞으로 어떤 글을 쓸지 소개합니다.",
    content: `안녕하세요. 첫 번째 포스트입니다.

이 공간에는 일상에서 배운 것, 만들고 싶은 것, 기록해두고 싶은 생각을 적어보려고 합니다.

작은 글이라도 꾸준히 쌓이면 나중에는 꽤 괜찮은 흔적이 될 거라고 믿고 있습니다.`,
    isPractice: true,
  },
  {
    id: "2",
    title: "운동을 꾸준히 하는 법",
    date: "2026년 3월 20일",
    category: "운동",
    author: "안세정",
    excerpt: "바쁜 일상 속에서도 운동 습관을 이어가는 방법을 정리했습니다.",
    content: `운동은 거창한 목표보다 반복 가능한 루틴이 더 중요합니다.

처음부터 오래 하려고 하기보다 산책, 스트레칭, 가벼운 근력 운동처럼 바로 시작할 수 있는 단위로 쪼개면 좋습니다.

기록을 남기면 작은 변화도 눈에 보여서 다음 행동으로 이어지기 쉽습니다.`,
    isPractice: true,
  },
  {
    id: "3",
    title: "학교생활에서 배운 것들",
    date: "2026년 3월 15일",
    category: "학교생활",
    author: "안세정",
    excerpt: "수업과 프로젝트를 하며 배운 점들을 소개합니다.",
    content: `학교생활에서는 지식만큼이나 협업과 기록의 중요성을 많이 배웠습니다.

작업을 작게 나누고, 진행 상황을 공유하고, 결과를 돌아보는 과정이 프로젝트의 완성도를 높여줍니다.

앞으로도 배운 것을 이곳에 차곡차곡 정리해보려고 합니다.`,
    isPractice: true,
  },
];

export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return [...(data ?? []).map(mapPostRow), ...practicePosts];
}

export async function getPostById(id: string): Promise<Post | null> {
  const practicePost = getPracticePostById(id);

  if (practicePost) {
    return practicePost;
  }

  if (!isSupabasePostId(id)) {
    return null;
  }

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
  if (getPracticePostById(id)) {
    return false;
  }

  if (!isSupabasePostId(id)) {
    return false;
  }

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

function getPracticePostById(id: string) {
  return practicePosts.find((post) => post.id === id) ?? null;
}

function isSupabasePostId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
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
