import Link from "next/link";
import { games } from "@/lib/games";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";

export const metadata = pageMetadata(
  "게임",
  "심심할 때 만든 작은 웹 게임들을 모아뒀습니다.",
);

const tilts = ["-1.4deg", "1.1deg", "-0.7deg", "1.6deg"];

export default function GamesPage() {
  return (
    <DiaryPage
      wide
      color="leaf"
      title="게임"
      intro={<p>틈틈이 만든 작은 웹 게임들입니다. 계속 추가될 예정이에요.</p>}
    >
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {games.map((game, i) => (
          <li key={game.slug}>
            <Link
              href={`/games/${game.slug}`}
              className="note group flex h-full flex-col p-6 text-foreground"
              style={{
                background: `var(--${game.color})`,
                transform: `rotate(${tilts[i % tilts.length]})`,
              }}
            >
              <span aria-hidden className="text-3xl">
                {game.emoji}
              </span>
              <h2 className="mt-3 font-display text-2xl">{game.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">
                {game.description}
              </p>
              <span className="mt-4 text-sm font-semibold">
                <span className="marker-link">플레이하기 →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DiaryPage>
  );
}
