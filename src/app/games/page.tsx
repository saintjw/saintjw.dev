import Link from "next/link";
import { games } from "@/lib/games";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "게임",
  "심심할 때 만든 작은 웹 게임들을 모아뒀습니다."
);

const colorClasses = {
  mint: "bg-mint/60",
  peach: "bg-peach/60",
  sky: "bg-sky/60",
  pink: "bg-pink/60",
} as const;

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">게임</h1>
      <p className="mt-3 text-muted">
        틈틈이 만든 작은 웹 게임들입니다. 계속 추가될 예정이에요.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={`/games/${game.slug}`}
            className={`group rounded-3xl border border-border p-8 transition-transform hover:-translate-y-1 ${colorClasses[game.color]}`}
          >
            <div className="text-3xl">{game.emoji}</div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {game.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{game.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-foreground/70 group-hover:text-foreground">
              플레이하기 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
