import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "웹 개발을 배우며 기록하는 공간",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <nav className="bg-gray-800 text-white p-4 flex gap-6 items-center">
          <Link href="/" className="font-bold hover:text-gray-300">내 블로그</Link>
          <Link href="/" className="text-sm hover:text-gray-300">홈</Link>
          <Link href="/posts" className="text-sm hover:text-gray-300">블로그</Link>
          <Link href="/posts/new" className="text-sm hover:text-gray-300">새 글 쓰기</Link>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
        <footer className="text-center text-gray-500 py-4">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
