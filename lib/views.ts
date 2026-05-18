import { createClient } from "@/lib/supabase/server";

type ViewRow = {
  post_id: string;
  view_count: number | string | null;
};

export type ViewCountResult = {
  viewCount: number;
  error?: string;
};

export async function getViewCounts(
  postIds: string[]
): Promise<Record<string, number>> {
  const ids = Array.from(new Set(postIds.filter(Boolean)));
  const counts = Object.fromEntries(ids.map((id) => [id, 0])) as Record<
    string,
    number
  >;

  if (ids.length === 0) {
    return counts;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_views")
    .select("post_id, view_count")
    .in("post_id", ids);

  if (error) {
    return counts;
  }

  for (const row of (data ?? []) as ViewRow[]) {
    counts[row.post_id] = normalizeCount(row.view_count);
  }

  return counts;
}

export async function getViewCount(postId: string): Promise<number> {
  const counts = await getViewCounts([postId]);
  return counts[postId] ?? 0;
}

export async function incrementPostView(
  postId: string
): Promise<ViewCountResult> {
  if (!postId.trim()) {
    return { viewCount: 0, error: "게시글 정보가 올바르지 않습니다." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("increment_post_view", {
    p_post_id: postId,
  });

  if (error) {
    return {
      viewCount: await getViewCount(postId),
      error: error.message,
    };
  }

  return { viewCount: normalizeCount(data) };
}

function normalizeCount(value: unknown) {
  const count =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  return Number.isFinite(count) ? Math.max(0, count) : 0;
}
