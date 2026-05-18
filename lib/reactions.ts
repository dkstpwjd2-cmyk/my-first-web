import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/profiles";

export type ReactionType = "like" | "dislike";

export type ReactionSummary = {
  likeCount: number;
  dislikeCount: number;
  currentUserReaction: ReactionType | null;
};

type ReactionRow = {
  post_id: string;
  reaction: ReactionType;
};

const emptySummary: ReactionSummary = {
  likeCount: 0,
  dislikeCount: 0,
  currentUserReaction: null,
};

export async function getReactionSummary(
  postId: string
): Promise<ReactionSummary> {
  const summaries = await getReactionSummaries([postId]);
  return summaries[postId] ?? { ...emptySummary };
}

export async function getReactionSummaries(
  postIds: string[]
): Promise<Record<string, ReactionSummary>> {
  const ids = Array.from(new Set(postIds.filter(Boolean)));
  const summaries = Object.fromEntries(
    ids.map((id) => [id, { ...emptySummary }])
  ) as Record<string, ReactionSummary>;

  if (ids.length === 0) {
    return summaries;
  }

  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .in("post_id", ids);

  if (error) {
    return summaries;
  }

  for (const row of (rows ?? []) as ReactionRow[]) {
    const summary = summaries[row.post_id];
    if (!summary) continue;

    if (row.reaction === "like") {
      summary.likeCount += 1;
    } else {
      summary.dislikeCount += 1;
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return summaries;
  }

  const { data: userRows, error: userError } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", user.id)
    .in("post_id", ids);

  if (userError) {
    return summaries;
  }

  for (const row of (userRows ?? []) as ReactionRow[]) {
    const summary = summaries[row.post_id];
    if (summary) {
      summary.currentUserReaction = row.reaction;
    }
  }

  return summaries;
}

export async function togglePostReaction(
  postId: string,
  reaction: ReactionType
): Promise<{ summary: ReactionSummary; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      summary: await getReactionSummary(postId),
      error: "로그인 후 반응할 수 있습니다.",
    };
  }

  try {
    await ensureProfile(user.id);
  } catch (error) {
    return {
      summary: await getReactionSummary(postId),
      error: error instanceof Error ? error.message : "반응 저장에 실패했습니다.",
    };
  }

  const { data: existing, error: existingError } = await supabase
    .from("post_reactions")
    .select("reaction")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return {
      summary: await getReactionSummary(postId),
      error: existingError.message,
    };
  }

  if (existing?.reaction === reaction) {
    const { error } = await supabase
      .from("post_reactions")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      return {
        summary: await getReactionSummary(postId),
        error: error.message,
      };
    }
  } else {
    const { error } = await supabase.from("post_reactions").upsert(
      {
        post_id: postId,
        user_id: user.id,
        reaction,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "post_id,user_id" }
    );

    if (error) {
      return {
        summary: await getReactionSummary(postId),
        error: error.message,
      };
    }
  }

  return { summary: await getReactionSummary(postId) };
}
