import Link from "next/link";
import { games, type Game } from "@/lib/games";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";
import GameIcon from "@/components/GameIcon";
import BestRecord from "@/components/BestRecord";

export const metadata = pageMetadata(
  "게임",
  "심심할 때 만든 작은 웹 게임들을 모아뒀습니다.",
  "/games",
);

// 날마다 퍼즐이 바뀌는 스도쿠를 맨 위 큰 포스트잇으로 꺼내 둔다.
const FEATURED = "sudoku";
const tilts = ["-1.4deg", "1.1deg", "-0.7deg", "1.6deg", "-1.1deg", "0.8deg"];

function Meta({ game }: { game: Game }) {
  return (
    <p className="tabular text-xs font-semibold tracking-wide text-foreground/70">
      {game.players}
      <span aria-hidden className="mx-1.5">
        ·
      </span>
      한 판 {game.duration}
    </p>
  );
}

/** 누르면 쏙 들어가는 키캡 모양 시작 단추. 카드 전체가 링크라서 장식용 span이다. */
function StartKey({ children }: { children: React.ReactNode }) {
  return (
    <span className="keycap shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold">
      {children}
      <span aria-hidden className="ml-1.5 inline-block text-[0.7em]">
        ▶
      </span>
    </span>
  );
}

export default function GamesPage() {
  const featured = games.find((g) => g.slug === FEATURED)!;
  const rest = games.filter((g) => g.slug !== FEATURED);

  return (
    <DiaryPage
      wide
      color="leaf"
      title="게임"
      intro={
        <p>
          틈틈이 만든 작은 웹 게임들입니다. 기록은 이 브라우저에만 저장되니
          마음 편히 도전해 보세요.
        </p>
      }
    >
      <Link
        href={`/games/${featured.slug}`}
        className="note group mt-10 flex flex-col gap-6 p-6 text-foreground sm:flex-row sm:items-center sm:p-8"
        style={{ background: `var(--${featured.color})`, transform: "rotate(-0.6deg)" }}
      >
        <span
          aria-hidden
          className="wiggle grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-foreground/80 bg-card/70 [&_svg]:h-10 [&_svg]:w-10"
        >
          <GameIcon slug={featured.slug} />
        </span>
        <span className="flex-1">
          <span className="text-xs font-bold tracking-[0.14em] text-foreground/70">
            매일 새 퍼즐
          </span>
          <span className="mt-1 block font-display text-[1.9rem] leading-tight">
            {featured.title}
          </span>
          <span className="mt-2 block max-w-xl text-sm leading-relaxed text-foreground/80">
            {featured.description}
          </span>
          <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Meta game={featured} />
            {featured.records && (
              <BestRecord records={featured.records} unit={featured.unit} />
            )}
          </span>
        </span>
        <span className="self-start sm:self-center">
          <StartKey>오늘 퍼즐 풀기</StartKey>
        </span>
      </Link>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {rest.map((game, i) => (
          <li key={game.slug}>
            <Link
              href={`/games/${game.slug}`}
              className="note group flex h-full flex-col p-6 text-foreground"
              style={{
                background: `var(--${game.color})`,
                transform: `rotate(${tilts[i % tilts.length]})`,
              }}
            >
              <span className="flex items-start justify-between gap-3">
                <span aria-hidden className="wiggle inline-block">
                  <GameIcon slug={game.slug} />
                </span>
                <Meta game={game} />
              </span>
              <h2 className="mt-3 font-display text-2xl">{game.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">
                {game.description}
              </p>
              <span className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-foreground/20 pt-4">
                {game.records ? (
                  <BestRecord records={game.records} unit={game.unit} />
                ) : (
                  <span className="text-xs text-foreground/75">
                    옆 사람과 번갈아 두기
                  </span>
                )}
                <StartKey>시작</StartKey>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DiaryPage>
  );
}
