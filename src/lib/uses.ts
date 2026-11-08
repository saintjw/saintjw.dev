// /uses 페이지 내용. 쓰는 장비나 도구가 바뀌면 여기만 고치면 됩니다.
// 참고: https://uses.tech

export type UseItem = {
  name: string;
  note: string;
  url?: string;
};

export type UseGroup = {
  title: string;
  items: UseItem[];
};

export const usesGroups: UseGroup[] = [
  // TODO: 실제로 쓰는 기기로 채워주세요. (예: 키보드, 마우스, 모니터, 데스크 소품, 러닝화, 러닝 워치)
  {
    title: "기기",
    items: [
      { name: "Windows 노트북", note: "글 정리부터 사이트 개발까지 모두 이 한 대로 합니다." },
    ],
  },
  {
    title: "개발",
    items: [
      { name: "Next.js", note: "이 사이트의 뼈대. App Router로 만들었어요.", url: "https://nextjs.org" },
      { name: "TypeScript", note: "타입이 있으면 마음이 편합니다.", url: "https://www.typescriptlang.org" },
      { name: "Tailwind CSS", note: "디자인을 코드 옆에서 바로 다듬을 수 있어서.", url: "https://tailwindcss.com" },
      { name: "Python", note: "PC에서 돌리는 작은 개인용 도구를 만들 때.", url: "https://www.python.org" },
      { name: "Claude Code", note: "기능을 같이 만들고 다듬는 코딩 파트너.", url: "https://claude.com/claude-code" },
    ],
  },
  {
    title: "배포와 서비스",
    items: [
      { name: "Vercel", note: "GitHub에 푸시하면 몇 분 안에 사이트가 바뀝니다.", url: "https://vercel.com" },
      { name: "GitHub", note: "코드 저장소. 방명록 댓글도 GitHub Discussions에 쌓여요.", url: "https://github.com/saintjw" },
      { name: "giscus", note: "방명록 댓글 위젯.", url: "https://giscus.app" },
    ],
  },
  {
    title: "글쓰기",
    items: [
      { name: "티스토리", note: "블로그 글을 쓰는 곳. 이 사이트의 블로그 목록도 여기서 가져와요.", url: "https://saintjw.tistory.com" },
    ],
  },
];
