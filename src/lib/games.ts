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
];
