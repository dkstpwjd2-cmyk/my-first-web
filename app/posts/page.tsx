import { getPosts } from "@/lib/posts";
import PostsClient, { type PostsListItem } from "./posts-client";

export const dynamic = "force-dynamic";

type JsonPlaceholderPost = {
  id: number;
  title: string;
  body: string;
};

const categories = ["일상", "운동", "학교생활"];

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

function buildExcerpt(content: string, maxLength = 70): string {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}

async function fetchPosts(): Promise<PostsListItem[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("failed to fetch posts");
    }

    const apiPosts = (await response.json()) as JsonPlaceholderPost[];

    return apiPosts.map((post, index) => ({
      id: post.id,
      title: post.title,
      excerpt: buildExcerpt(post.body),
      category: categories[index % categories.length],
      date: formatDate(new Date()),
    }));
  } catch {
    const fallbackPosts = getPosts();
    return fallbackPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: post.date,
    }));
  }
}

export default async function PostsPage() {
  const posts = await fetchPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">블로그</h1>
      <PostsClient initialPosts={posts} />
    </div>
  );
}
