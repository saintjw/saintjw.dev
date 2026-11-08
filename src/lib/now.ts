// /now 페이지 내용. 한 달에 한 번쯤 고치고 updated 날짜도 같이 바꿔주세요.
// 참고: https://nownownow.com/about

export const nowUpdated = "2026-11-08";

export type NowSection = {
  title: string;
  items: string[];
};

export const nowSections: NowSection[] = [
  {
    title: "쓰는 것",
    items: [
      "티스토리에 여섯 가지 주제로 꾸준히 글을 쓰고 있어요. 어느새 600편을 넘겼습니다.",
      "요즘은 늦가을 국내 여행 코스와 연말정산 시즌에 맞춘 세금·공제 글을 많이 정리하고 있어요.",
    ],
  },
  {
    title: "만드는 것",
    items: [
      "이 사이트를 다듬는 중이에요. 대문을 새로 꾸미고 블로그 글을 주제별로 묶었습니다.",
      "내 PC에서만 쓰는 개인용 도구들을 하나씩 만들고 있어요.",
    ],
  },
  {
    title: "다음에 할 것",
    items: [
      "미니게임 순위표를 방문자끼리 겨룰 수 있는 전체 순위로 바꾸기",
      "러닝 페이스 계산기 만들기",
    ],
  },
  // 예) { title: "읽는 것", items: ["책 제목 — 한 줄 감상"] },
  // 예) { title: "준비하는 것", items: ["12월 하프 마라톤"] },
];
