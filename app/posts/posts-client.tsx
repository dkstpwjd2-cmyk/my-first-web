"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SearchBar from "@/app/components/search-bar";

export type PostsListItem = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

type PostsClientProps = {
  initialPosts: PostsListItem[];
};

const categoryColor: Record<string, string> = {
  일상: "bg-amber-50 text-amber-600",
  운동: "bg-emerald-50 text-emerald-600",
  학교생활: "bg-indigo-50 text-indigo-600",
};

export default function PostsClient({ initialPosts }: PostsClientProps) {
  const [posts, setPosts] = useState<PostsListItem[]>(initialPosts);
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return posts;
    }

    return posts.filter((post) => post.title.toLowerCase().includes(keyword));
  }, [posts, query]);

  function handleDelete(id: number) {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  }

  return (
    <div>
      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
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
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  삭제
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
