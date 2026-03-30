import Link from "next/link";
import { posts } from "@/lib/posts";

const categoryColor: Record<string, string> = {
  일상: "bg-amber-50 text-amber-600",
  운동: "bg-emerald-50 text-emerald-600",
  학교생활: "bg-indigo-50 text-indigo-600",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            안세정의 블로그
          </Link>
          <nav className="flex justify-between items-center gap-6 text-sm">
            <a href="#posts">글 목록</a>
            <a href="#about">소개</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Profile */}
        <section id="about" className="my-6">
          <h1 className="text-lg font-bold mb-1">안세정의 블로그</h1>
          <p className="text-gray-600 text-sm">
            한신대학교 공공인재학부 · 운동을 좋아합니다<br />
            일상과 생각들을 기록합니다
          </p>
        </section>

        {/* Posts */}
        <section id="posts">
          <h2 className="text-base font-semibold mb-4">최근 글</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <article>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[post.category] ?? "bg-gray-100 text-gray-500"}`}>
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{post.title}</h3>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t mt-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-center items-center text-sm text-gray-400">
          © 2026 안세정
        </div>
      </footer>
    </div>
  );
}
