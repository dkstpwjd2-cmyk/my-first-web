export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    title: "첫 번째 포스트",
    date: "2026년 3월 25일",
    category: "일상",
    author: "안세정",
    excerpt: "블로그를 시작하며 앞으로 어떤 글을 쓸지 소개합니다.",
    content: `안녕하세요. 첫 번째 포스트입니다.

이 공간에는 일상에서 배운 것, 만들고 싶은 것, 기록해두고 싶은 생각을 적어보려고 합니다.

작은 글이라도 꾸준히 쌓이면 나중에는 꽤 괜찮은 흔적이 될 거라고 믿고 있습니다.`,
  },
  {
    id: 2,
    title: "운동을 꾸준히 하는 법",
    date: "2026년 3월 20일",
    category: "운동",
    author: "안세정",
    excerpt: "바쁜 일상 속에서도 운동 습관을 이어가는 방법을 정리했습니다.",
    content: `운동은 거창한 목표보다 반복 가능한 루틴이 더 중요합니다.

처음부터 오래 하려고 하기보다 산책, 스트레칭, 가벼운 근력 운동처럼 바로 시작할 수 있는 단위로 쪼개면 좋습니다.

기록을 남기면 작은 변화도 눈에 보여서 다음 행동으로 이어지기 쉽습니다.`,
  },
  {
    id: 3,
    title: "학교생활에서 배운 것들",
    date: "2026년 3월 15일",
    category: "학교생활",
    author: "안세정",
    excerpt: "수업과 프로젝트를 하며 배운 점들을 소개합니다.",
    content: `학교생활에서는 지식만큼이나 협업과 기록의 중요성을 많이 배웠습니다.

작업을 작게 나누고, 진행 상황을 공유하고, 결과를 돌아보는 과정이 프로젝트의 완성도를 높여줍니다.

앞으로도 배운 것을 이곳에 차곡차곡 정리해보려고 합니다.`,
  },
];

let runtimePosts: Post[] = [...initialPosts];

export function getPosts(): Post[] {
  return runtimePosts;
}

export function getPostById(id: number): Post | undefined {
  return runtimePosts.find((post) => post.id === id);
}

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

export function createPost(input: {
  title: string;
  content: string;
  category: string;
  author?: string;
}): Post {
  const title = input.title.trim();
  const content = input.content.trim();
  const category = input.category.trim() || "일상";
  const author = input.author?.trim() || "안세정";
  const maxId = runtimePosts.reduce((acc, post) => Math.max(acc, post.id), 0);

  const newPost: Post = {
    id: maxId + 1,
    title,
    content,
    author,
    category,
    date: formatDate(new Date()),
    excerpt: buildExcerpt(content),
  };

  runtimePosts = [newPost, ...runtimePosts];
  return newPost;
}

export function deletePostById(id: number): boolean {
  const beforeCount = runtimePosts.length;
  runtimePosts = runtimePosts.filter((post) => post.id !== id);
  return runtimePosts.length < beforeCount;
}
