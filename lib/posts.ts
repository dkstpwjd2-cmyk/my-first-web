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
    title: "첫 번째 블로그 포스트",
    date: "2026년 3월 25일",
    category: "일상",
    author: "안세정",
    excerpt: "블로그를 시작하게 된 계기와 앞으로 어떤 글을 쓸지에 대해 소개합니다.",
    content: `안녕하세요, 안세정입니다.

드디어 블로그를 시작하게 됐어요. 오래전부터 내 생각을 글로 남기고 싶었는데, 막상 어디서부터 시작해야 할지 몰라서 계속 미뤄왔던 것 같아요.

이 블로그에는 일상, 운동, 학교생활 등 제가 경험하고 느낀 것들을 기록할 예정이에요. 거창한 글보다는 솔직하고 편안한 글을 쓰고 싶어요.

앞으로 자주 찾아와 주세요!`,
  },
  {
    id: 2,
    title: "운동을 꾸준히 하는 법",
    date: "2026년 3월 20일",
    category: "운동",
    author: "안세정",
    excerpt: "바쁜 일상 속에서도 운동 습관을 유지하는 나만의 방법을 공유합니다.",
    content: `운동을 꾸준히 하는 게 쉽지 않다는 걸 누구보다 잘 알아요.

저도 처음엔 작심삼일을 반복했거든요. 그런데 몇 가지 방법을 바꾸고 나서부터 꾸준히 할 수 있게 됐어요.

1. 목표를 작게 잡는다
처음부터 "매일 1시간"을 목표로 세우면 금방 지쳐요. "일주일에 3번, 30분"처럼 작게 시작하는 게 훨씬 효과적이에요.

2. 시간을 고정한다
저는 아침 수업 전 7시에 운동하는 걸 루틴으로 만들었어요. 결정 피로를 없애는 게 핵심이에요.

3. 기록을 남긴다
운동 일지를 쓰면 성취감이 생겨요. 앱이든 노트든 상관없어요.

여러분도 작은 것부터 시작해보세요!`,
  },
  {
    id: 3,
    title: "공공인재학부에서 배우는 것들",
    date: "2026년 3월 15일",
    category: "학교생활",
    author: "안세정",
    excerpt: "한신대학교 공공인재학부에서의 수업과 활동들을 소개합니다.",
    content: `한신대학교 공공인재학부에 입학한 지 벌써 1년이 넘었어요.

처음엔 공공인재학부가 뭘 배우는 곳인지 잘 몰랐는데, 지내다 보니 정말 다양한 걸 배우는 학과더라고요.

배우는 것들:
- 행정학, 정치학, 법학 기초
- 공공정책 분석
- 지역사회와 시민참여

단순히 이론만 배우는 게 아니라 실제 지역사회 문제를 분석하고 해결책을 고민하는 프로젝트도 많아서 좋아요.

앞으로도 학교생활 이야기 자주 올릴게요!`,
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
