"use client";

import { useEffect, useRef, useState } from "react";
import { getTopScores, submitScore, type ScoreEntry } from "@/lib/leaderboard";
import Leaderboard from "@/components/Leaderboard";
import ShareButton from "@/components/ShareButton";

type Phase = "idle" | "waiting" | "ready" | "result" | "too-soon";

const LEADERBOARD_KEY = "reaction-time-leaderboard";

function rating(ms: number) {
  if (ms < 200) return "번개 같은 반응! ⚡";
  if (ms < 300) return "훌륭해요! 🔥";
  if (ms < 400) return "괜찮은 편이에요 🙂";
  return "다음엔 더 빠르게! 🐢";
}

export default function ReactionTime() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultMs, setResultMs] = useState<number | null>(null);
  const [topScores, setTopScores] = useState<ScoreEntry[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    setTopScores(getTopScores(LEADERBOARD_KEY));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function startRound() {
    setResultMs(null);
    setPhase("waiting");
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("ready");
    }, delay);
  }

  function handleClick() {
    if (phase === "idle" || phase === "result" || phase === "too-soon") {
      startRound();
      return;
    }

    if (phase === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("too-soon");
      return;
    }

    if (phase === "ready") {
      const elapsed = Math.round(performance.now() - startRef.current);
      setResultMs(elapsed);
      setPhase("result");
      setTopScores(submitScore(LEADERBOARD_KEY, elapsed, false));
    }
  }

  const boxStyles: Record<Phase, string> = {
    idle: "bg-accent-soft",
    waiting: "bg-peach",
    ready: "bg-mint",
    result: "bg-mint",
    "too-soon": "bg-pink",
  };

  const label: Record<Phase, string> = {
    idle: "클릭해서 시작하기",
    waiting: "초록색으로 바뀔 때까지 기다리세요…",
    ready: "지금 클릭!",
    result: `${resultMs} ms`,
    "too-soon": "너무 빨랐어요! 다시 클릭해서 재시도",
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleClick}
        className={`flex h-64 w-full max-w-md items-center justify-center rounded-3xl border border-border text-2xl font-semibold text-foreground transition-colors ${boxStyles[phase]}`}
      >
        {label[phase]}
      </button>

      {phase === "result" && resultMs !== null && (
        <>
          <p className="text-muted">{rating(resultMs)}</p>
          <ShareButton
            title="반응속도 테스트"
            text={`반응속도 테스트에서 ${resultMs}ms 기록했어요! 도전해보세요`}
          />
        </>
      )}

      <Leaderboard entries={topScores} unit=" ms" />
    </div>
  );
}
