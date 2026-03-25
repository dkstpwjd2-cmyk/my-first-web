const posts = [
  {
    id: 1,
    title: "첫 번째 블로그 포스트",
    date: "2026년 3월 25일",
    category: "일상",
    excerpt: "블로그를 시작하게 된 계기와 앞으로 어떤 글을 쓸지에 대해 소개합니다.",
  },
  {
    id: 2,
    title: "운동을 꾸준히 하는 법",
    date: "2026년 3월 20일",
    category: "운동",
    excerpt: "바쁜 일상 속에서도 운동 습관을 유지하는 나만의 방법을 공유합니다.",
  },
  {
    id: 3,
    title: "공공인재학부에서 배우는 것들",
    date: "2026년 3월 15일",
    category: "학교생활",
    excerpt: "한신대학교 공공인재학부에서의 수업과 활동들을 소개합니다.",
  },
];

const categoryColor: Record<string, string> = {
  일상: "bg-amber-50 text-amber-600",
  운동: "bg-emerald-50 text-emerald-600",
  학교생활: "bg-indigo-50 text-indigo-600",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-base font-bold text-stone-900 tracking-tight">
            안세정
          </a>
          <nav className="flex gap-6 text-sm text-stone-400">
            <a href="#posts" className="hover:text-stone-700 transition-colors">글 목록</a>
            <a href="#about" className="hover:text-stone-700 transition-colors">소개</a>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">
        {/* Profile */}
        <section id="about" className="flex items-center gap-5 mb-14">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg shrink-0">
            안
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 mb-1">안세정의 블로그</h1>
            <p className="text-stone-400 text-sm leading-relaxed">
              한신대학교 공공인재학부 · 운동을 좋아합니다<br />
              일상과 생각들을 기록합니다
            </p>
          </div>
        </section>

        {/* Posts */}
        <section id="posts">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-5">
            최근 글
          </h2>
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id}>
                <a
                  href="#"
                  className="group block bg-white rounded-2xl border border-stone-100 px-6 py-5 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[post.category] ?? "bg-stone-100 text-stone-500"}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-stone-300">{post.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{post.excerpt}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 mt-10">
        <div className="max-w-2xl mx-auto px-6 py-6 text-center text-xs text-stone-300">
          © 2026 안세정
        </div>
      </footer>
    </div>
  );
}
