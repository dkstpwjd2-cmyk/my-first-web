"use client";

import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("저장되었습니다");
    router.push("/posts");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">새 글 쓰기</h1>
      <input type="text" placeholder="제목"
        className="w-full p-3 border rounded-lg" />
      <textarea placeholder="내용"
        className="w-full p-3 border rounded-lg h-40" />
      <button type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        저장하기
      </button>
    </form>
  );
}
