"use client";

import { useEffect, useRef, useState } from "react";

const HOLE_COUNT = 9;
const DURATION = 30;
const BEST_KEY = "whack-a-mole-best-score";

function randomHole(exclude: number | null) {
  let next = Math.floor(Math.random() * HOLE_COUNT);
  while (next === exclude) next = Math.floor(Math.random() * HOLE_COUNT);
  return next;
}

export default function WhackAMole() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moleIndexRef = useRef<number | null>(null);
  const spawnRef = useRef<() => void>(() => {});
  moleIndexRef.current = moleIndex;

  useEffect(() => {
    const stored = localStorage.getItem(BEST_KEY);
    if (stored) setBest(Number(stored));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown);
          setPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMoleIndex(null);
      return;
    }

    function hide() {
      setMoleIndex(null);
      const gap = 150 + Math.random() * 250;
      timeoutRef.current = setTimeout(spawnRef.current, gap);
    }

    function spawn() {
      setMoleIndex((prev) => randomHole(prev));
      const showDuration = 550 + Math.random() * 450;
      timeoutRef.current = setTimeout(hide, showDuration);
    }

    spawnRef.current = spawn;
    spawn();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [playing]);

  function startGame() {
    setScore(0);
    setTimeLeft(DURATION);
    setPlaying(true);
  }

  function handleHoleClick(index: number) {
    if (!playing || index !== moleIndexRef.current) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setScore((s) => s + 1);
    setMoleIndex(null);

    const gap = 150 + Math.random() * 250;
    timeoutRef.current = setTimeout(spawnRef.current, gap);
  }

  useEffect(() => {
    if (playing) return;
    if (score > 0 && (best === null || score > best)) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-6 text-lg font-medium text-foreground">
        <span>점수: {score}</span>
        <span>남은 시간: {timeLeft}s</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleHoleClick(i)}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card text-4xl transition-colors hover:bg-accent-soft sm:h-24 sm:w-24"
          >
            {moleIndex === i ? "🐹" : ""}
          </button>
        ))}
      </div>

      {!playing && (
        <button
          onClick={startGame}
          className="rounded-full border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
        >
          {timeLeft === 0 ? "다시 시작" : "시작하기"}
        </button>
      )}

      {!playing && timeLeft === 0 && (
        <p className="text-muted">이번 판 점수: {score}점</p>
      )}

      {best !== null && <p className="text-sm text-muted">최고 점수: {best}점</p>}
    </div>
  );
}
