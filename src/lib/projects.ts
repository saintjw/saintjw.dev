export type Project = {
  title: string;
  description: string;
  url: string;
  tags: string[];
};

// TODO: 실제 프로젝트로 교체/추가하세요.
export const projects: Project[] = [
  {
    title: "saintjw.dev",
    description: "지금 보고 있는 이 사이트. 소개, 블로그 링크, 미니게임을 모아둔 개인 허브입니다.",
    url: "https://github.com/saintjw/saintjw.dev",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];
