// 사이트 안에서 직접 쓰는 글의 주제. 글 파일의 frontmatter `topic`에 slug를 적습니다.
export const topics = [
  {
    slug: "build-log",
    name: "만들기 기록",
    description: "이 사이트와 게임, 도구를 만들며 부딪힌 문제와 풀어낸 과정.",
  },
  {
    slug: "ai-work",
    name: "AI와 일하기",
    description: "AI 도구로 실제 일을 덜어낸 경험. 무엇이 됐고 무엇이 안 됐는지.",
  },
  {
    slug: "tech-explained",
    name: "쉽게 읽는 IT",
    description: "화제가 된 기술과 개념을 개발자가 아니어도 읽히게 풀어 씁니다.",
  },
] as const;

export type Topic = (typeof topics)[number];
export type TopicSlug = Topic["slug"];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
