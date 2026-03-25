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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900">안세정의 블로그</a>
          <nav className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">글 목록</a>
            <a href="#" className="hover:text-gray-900">소개</a>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* About */}
        <section className="mb-14">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">안녕하세요, 안세정입니다 👋</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            한신대학교 공공인재학부에 재학 중이며, 운동을 좋아합니다.<br />
            일상과 생각들을 이곳에 기록합니다.
          </p>
        </section>

        {/* Posts */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">최근 글</h2>
          <ul className="divide-y divide-gray-100">
            {posts.map((post) => (
              <li key={post.id} className="py-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-indigo-500 font-medium">{post.category}</span>
                </div>
                <a href="#" className="block group">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2026 안세정. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
