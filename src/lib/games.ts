export type Game = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  color: "mint" | "peach" | "sky" | "pink";
};

export const games: Game[] = [
  {
    slug: "tic-tac-toe",
    title: "틱택토",
    description: "2인용 O/X 게임. 클래식하지만 늘 재밌죠.",
    emoji: "⭕",
    color: "sky",
  },
  {
    slug: "reaction-time",
    title: "반응속도 테스트",
    description: "화면이 초록색으로 바뀌는 순간 클릭! 내 반응 속도는 몇 ms?",
    emoji: "⚡",
    color: "pink",
  },
  {
    slug: "whack-a-mole",
    title: "두더지 잡기",
    description: "30초 동안 튀어나오는 두더지를 최대한 많이 잡아보세요.",
    emoji: "🐹",
    color: "peach",
  },
];
