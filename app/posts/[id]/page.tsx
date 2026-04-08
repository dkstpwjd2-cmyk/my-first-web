import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deletePostById, getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";

const categoryColor: Record<string, string> = {
  일상: "bg-amber-50 text-amber-600",
  운동: "bg-emerald-50 text-emerald-600",
  학교생활: "bg-indigo-50 text-indigo-600",
};

async function deletePostAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    deletePostById(id);
    revalidatePath("/posts");
    revalidatePath(`/posts/${id}`);
  }

  redirect("/posts");
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const post = getPostById(numericId);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-xl font-bold text-red-600">게시글을 찾을 수 없습니다</h1>
        <Link href="/posts" className="text-blue-500 underline mt-4 block">
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[post.category] ?? "bg-gray-100 text-gray-500"}`}>
          {post.category}
        </span>
        <span className="text-sm text-gray-400">{post.date}</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.author}</p>
      <div className="leading-relaxed text-gray-700 whitespace-pre-line">{post.content}</div>
      <div className="mt-8 flex items-center gap-4">
        <Link href="/posts" className="text-blue-500 underline">
          ← 목록으로 돌아가기
        </Link>
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={String(post.id)} />
          <button type="submit" className="text-red-600 underline">
            이 글 삭제
          </button>
        </form>
      </div>
    </article>
  );
}
