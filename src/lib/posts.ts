export type Post = {
  title: string;
  excerpt: string;
  date: string;
  url: string;
  tag: string;
};

// TODO: 실제 블로그 글로 교체하세요. RSS 연동으로 바꾸고 싶다면
// 이 배열을 fetch로 대체하면 됩니다.
export const posts: Post[] = [
  {
    title: "첫 번째 글: 이 사이트를 만든 이유",
    excerpt: "왜 개인 사이트를 만들었는지, 앞으로 어떤 걸 채워갈지 적었습니다.",
    date: "2026-08-10",
    url: "#",
    tag: "노트",
  },
];
