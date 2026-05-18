import { ensureProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

const MAX_COMMENT_LENGTH = 500;

export type PostComment = {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
  canDelete: boolean;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string | null;
  content: string;
  created_at: string | null;
};

export async function getComments(postId: string): Promise<PostComment[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("post_comments")
    .select("id, post_id, user_id, author_name, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CommentRow[]).map((row) =>
    mapCommentRow(row, user?.id ?? null)
  );
}

export async function getCommentCounts(
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
    .from("post_comments")
    .select("post_id")
    .in("post_id", ids);

  if (error) {
    return counts;
  }

  for (const row of (data ?? []) as Pick<CommentRow, "post_id">[]) {
    counts[row.post_id] = (counts[row.post_id] ?? 0) + 1;
  }

  return counts;
}

export async function createComment(
  postId: string,
  content: string
): Promise<{ comments: PostComment[]; error?: string }> {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return {
      comments: await getComments(postId),
      error: "댓글 내용을 입력해 주세요.",
    };
  }

  if (trimmedContent.length > MAX_COMMENT_LENGTH) {
    return {
      comments: await getComments(postId),
      error: `댓글은 ${MAX_COMMENT_LENGTH}자 이하로 입력해 주세요.`,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      comments: await getComments(postId),
      error: "로그인 후 댓글을 작성할 수 있습니다.",
    };
  }

  try {
    await ensureProfile(user.id);
  } catch (error) {
    return {
      comments: await getComments(postId),
      error: error instanceof Error ? error.message : "댓글 저장에 실패했습니다.",
    };
  }

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    user_id: user.id,
    author_name: getAuthorName(user),
    content: trimmedContent,
  });

  if (error) {
    return {
      comments: await getComments(postId),
      error: error.message,
    };
  }

  return { comments: await getComments(postId) };
}

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<{ comments: PostComment[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      comments: await getComments(postId),
      error: "로그인 후 댓글을 삭제할 수 있습니다.",
    };
  }

  const { error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", commentId)
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (error) {
    return {
      comments: await getComments(postId),
      error: error.message,
    };
  }

  return { comments: await getComments(postId) };
}

function mapCommentRow(
  row: CommentRow,
  currentUserId: string | null
): PostComment {
  return {
    id: row.id,
    postId: row.post_id,
    authorName: row.author_name?.trim() || "작성자",
    content: row.content,
    createdAt: row.created_at ?? "",
    canDelete: !!currentUserId && row.user_id === currentUserId,
  };
}

function getAuthorName(user: {
  email?: string;
  user_metadata?: { name?: unknown };
}) {
  const metadataName = user.user_metadata?.name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim().slice(0, 80);
  }

  const emailName = user.email?.split("@")[0]?.trim();
  return (emailName || "작성자").slice(0, 80);
}
