import Link from "next/link";
import { getPost, posts } from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.slug }));
}

const categoryColor: Record<string, string> = {
  일상: "bg-amber-50 text-amber-600",
  운동: "bg-emerald-50 text-emerald-600",
  학교생활: "bg-indigo-50 text-indigo-600",
};

export default async function PostPage(props: PageProps<"/posts/[id]">) {
  const { id } = await props.params;
  const post = getPost(id);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-stone-900 tracking-tight">
            안세정
          </Link>
          <nav className="flex gap-6 text-sm text-stone-400">
            <Link href="/#posts" className="hover:text-stone-700 transition-colors">글 목록</Link>
            <Link href="/#about" className="hover:text-stone-700 transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-10"
        >
          ← 목록으로
        </Link>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[post.category] ?? "bg-stone-100 text-stone-500"}`}>
              {post.category}
            </span>
            <span className="text-xs text-stone-300">{post.date}</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 leading-snug">{post.title}</h1>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-100 mb-8" />

        {/* Content */}
        <article className="text-stone-600 text-base leading-8 whitespace-pre-line">
          {post.content}
        </article>
      </main>

      <footer className="border-t border-stone-100 mt-10">
        <div className="max-w-2xl mx-auto px-6 py-6 text-center text-xs text-stone-300">
          © 2026 안세정
        </div>
      </footer>
    </div>
  );
}
