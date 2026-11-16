"use client";

import { useEffect, useRef, useState } from "react";
import Leaderboard from "@/components/Leaderboard";
import ShareButton from "@/components/ShareButton";
import { getTopScores, submitScore, type ScoreEntry } from "@/lib/leaderboard";

// 짝 맞추기: 다이어리 스티커 그림 카드를 두 장씩 뒤집어 같은 그림을 찾는다.

type Level = "easy" | "hard";
const LEVELS: Record<Level, { label: string; pairs: number; cols: string }> = {
  easy: { label: "4×4", pairs: 8, cols: "grid-cols-4" },
  hard: { label: "6×4", pairs: 12, cols: "grid-cols-4 sm:grid-cols-6" },
};

// 손그림 스티커(선 굵기 1.8로 통일). 색은 카드마다 인덱스 탭 색을 돌려 쓴다.
const STICKERS: { name: string; color: string; path: React.ReactNode }[] = [
  { name: "별", color: "var(--tab-yellow)", path: <path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7Z" /> },
  { name: "하트", color: "var(--tab-rose)", path: <path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" /> },
  { name: "달", color: "var(--tab-blue)", path: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" /> },
  { name: "잎", color: "var(--tab-leaf)", path: <><path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14Z" /><path d="M5 19 13 11" /></> },
  { name: "구름", color: "var(--tab-blue)", path: <path d="M7 18a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.6 1.2A3.4 3.4 0 0 1 17 18Z" /> },
  { name: "커피", color: "var(--tab-yellow)", path: <><path d="M4.5 9h11v5.5a4.5 4.5 0 0 1-4.5 4.5h-2a4.5 4.5 0 0 1-4.5-4.5Z" /><path d="M15.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-1.6" /><path d="M8 3.5c-.8 1 .8 2 0 3M11.5 3.5c-.8 1 .8 2 0 3" /></> },
  { name: "연필", color: "var(--tab-rose)", path: <><path d="m4 20 1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8Z" /><path d="m13.8 6.8 3.4 3.4" /></> },
  { name: "음표", color: "var(--tab-leaf)", path: <><path d="M9 17.5V5.5l10-2v12" /><circle cx="6.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="15.5" r="2.5" /></> },
  { name: "해", color: "var(--tab-yellow)", path: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" /></> },
  { name: "꽃", color: "var(--tab-rose)", path: <><circle cx="12" cy="10" r="2.2" /><path d="M12 7.8c-1.6-3.6 1.6-5 1.8-1.6M14.2 10c3.6-1.6 5 1.6 1.6 1.8M12 12.2c1.6 3.6-1.6 5-1.8 1.6M9.8 10c-3.6 1.6-5-1.6-1.6-1.8" /><path d="M12 12.5V21M12 17c-2 0-3.5-1-4-2.5" /></> },
  { name: "우산", color: "var(--tab-blue)", path: <><path d="M3 12a9 9 0 0 1 18 0Z" /><path d="M12 12v6.5a2 2 0 0 1-4 0" /><path d="M12 3v1" /></> },
  { name: "고양이", color: "var(--tab-leaf)", path: <><path d="M5 9 5.5 4l4 3h5l4-3 .5 5c1.2 1.4 1.5 3 1.5 4.5C20.5 18 16.6 20 12 20s-8.5-2-8.5-6.5C3.5 12 3.8 10.4 5 9Z" /><circle cx="9.5" cy="12.5" r=".8" fill="currentColor" stroke="none" /><circle cx="14.5" cy="12.5" r=".8" fill="currentColor" stroke="none" /><path d="M11 15.5h2l-1 1Z" /></> },
];

type Card = { id: number; sticker: number; matched: boolean };

function deal(pairs: number): Card[] {
  const picks = [...STICKERS.keys()].sort(() => Math.random() - 0.5).slice(0, pairs);
  const cards = [...picks, ...picks].map((sticker, id) => ({ id, sticker, matched: false }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function MemoryMatch() {
  const [level, setLevel] = useState<Level>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]); // 지금 뒤집힌(아직 판정 전) 카드 위치
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [top, setTop] = useState<ScoreEntry[]>([]);
  const lock = useRef(false);
  const boardKey = `memory-${level}-leaderboard`;

  function reset(l: Level = level) {
    setCards(deal(LEVELS[l].pairs));
    setOpen([]);
    setMoves(0);
    setElapsed(0);
    setStarted(false);
    lock.current = false;
  }

  // 카드 배치는 무작위라 서버 렌더와 어긋나지 않도록 브라우저에서 처음 한 번 섞는다.
  useEffect(() => {
    reset("easy");
    setTop(getTopScores("memory-easy-leaderboard"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeLevel(l: Level) {
    setLevel(l);
    reset(l);
    setTop(getTopScores(`memory-${l}-leaderboard`));
  }

  const won = cards.length > 0 && cards.every((c) => c.matched);

  useEffect(() => {
    if (!started || won) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [started, won]);


  function flip(pos: number) {
    if (lock.current || won) return;
    const card = cards[pos];
    if (card.matched || open.includes(pos)) return;
    if (!started) setStarted(true);

    const next = [...open, pos];
    setOpen(next);
    if (next.length < 2) return;

    const nextMoves = moves + 1;
    setMoves(nextMoves);
    const [a, b] = next;
    if (cards[a].sticker === cards[b].sticker) {
      const updated = cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
      setCards(updated);
      setOpen([]);
      if (updated.every((c) => c.matched)) setTop(submitScore(boardKey, nextMoves, false));
    } else {
      lock.current = true;
      setTimeout(() => {
        setOpen([]);
        lock.current = false;
      }, 800);
    }
  }

  const found = cards.filter((c) => c.matched).length / 2;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-xl flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5" role="group" aria-label="판 크기">
          {(Object.keys(LEVELS) as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => changeLevel(l)}
              aria-pressed={level === l}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                level === l ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {LEVELS[l].label}
            </button>
          ))}
        </div>
        <p className="font-mono text-sm tabular-nums text-muted">
          {moves}번 · {found}/{LEVELS[level].pairs}쌍 · ⏱ {elapsed}초
        </p>
      </div>

      <div className={`grid w-full max-w-xl gap-2 sm:gap-3 ${LEVELS[level].cols}`}>
        {cards.map((card, pos) => {
          const faceUp = card.matched || open.includes(pos);
          const s = STICKERS[card.sticker];
          return (
            <button
              key={`${level}-${card.id}`}
              onClick={() => flip(pos)}
              aria-label={faceUp ? s.name : "뒤집힌 카드"}
              className="memory-card aspect-[3/4] [perspective:600px]"
            >
              <span
                className={`relative block h-full w-full transition-transform duration-300 [transform-style:preserve-3d] motion-reduce:transition-none ${
                  faceUp ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* 뒷면: 모눈 노트 */}
                <span className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-accent-soft [backface-visibility:hidden] [background-image:linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] [background-size:12px_12px]">
                  <span className="font-display text-xl text-muted/60">?</span>
                </span>
                {/* 앞면: 스티커 */}
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border bg-card [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    card.matched ? "border-foreground/30 opacity-70" : "border-border"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3/5 w-3/5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <g style={{ fill: s.color, fillOpacity: 0.45 }}>{s.path}</g>
                  </svg>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {won ? (
        <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl bg-mint px-5 py-5 text-center">
          <p className="font-display text-2xl text-foreground">다 찾았어요! 🎉</p>
          <p className="text-sm text-foreground/80">
            {moves}번 뒤집어서 {elapsed}초 만에 {LEVELS[level].pairs}쌍을 모두 맞췄어요.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <ShareButton
              title="짝 맞추기"
              text={`짝 맞추기(${LEVELS[level].label})를 ${moves}번 만에 끝냈어요! 도전해보세요`}
            />
            <button
              onClick={() => reset()}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              한 판 더
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => reset()}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          카드 다시 섞기
        </button>
      )}

      <Leaderboard entries={top} unit="번" />
    </div>
  );
}
