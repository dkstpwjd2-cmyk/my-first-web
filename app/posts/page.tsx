import Link from "next/link";
import { revalidatePath } from "next/cache";
import { deletePostById, getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const categoryColor: Record<string, string> = {
  일상: "bg-amber-50 text-amber-600",
  운동: "bg-emerald-50 text-emerald-600",
  학교생활: "bg-indigo-50 text-indigo-600",
};

async function deletePostAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) {
    return;
  }

  deletePostById(id);
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
}

export default function PostsPage() {
  const posts = getPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">블로그</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <article key={post.id} className="p-4 border rounded-lg hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[post.category] ?? "bg-gray-100 text-gray-500"}`}>
                {post.category}
              </span>
              <span className="text-sm text-gray-400">{post.date}</span>
            </div>
            <h2 className="font-bold mb-1">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.excerpt}</p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href={`/posts/${post.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                자세히 보기
              </Link>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={String(post.id)} />
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline"
                >
                  삭제
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
