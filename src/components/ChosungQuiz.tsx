"use client";

import { useEffect, useRef, useState } from "react";
import Leaderboard from "@/components/Leaderboard";
import ShareButton from "@/components/ShareButton";
import { getTopScores, submitScore, type ScoreEntry } from "@/lib/leaderboard";
import { categories, isAccepted, normalize, toChosung, type Word } from "@/lib/chosung";

// 초성 퀴즈: 한 판에 10문제. 정답 10점, 힌트를 보고 맞히면 5점.

const ROUND = 10;
const BOARD_KEY = "chosung-leaderboard";

type Phase = "pick" | "play" | "end";
type Result = { word: Word; correct: boolean; hinted: boolean };

function pickWords(slug: string): Word[] {
  const pool =
    slug === "all" ? categories.flatMap((c) => c.words) : (categories.find((c) => c.slug === slug)?.words ?? []);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, ROUND);
}

export default function ChosungQuiz() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [category, setCategory] = useState("all");
  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [hinted, setHinted] = useState(false);
  const [feedback, setFeedback] = useState<"" | "wrong" | "right" | "skip">("");
  const [results, setResults] = useState<Result[]>([]);
  const [altAnswer, setAltAnswer] = useState(""); // 출제 단어와 다르지만 인정된 답
  const [top, setTop] = useState<ScoreEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setTop(getTopScores(BOARD_KEY)), []);
  useEffect(() => {
    if (phase === "play") inputRef.current?.focus();
  }, [phase, index]);

  const score = results.reduce((s, r) => s + (r.correct ? (r.hinted ? 5 : 10) : 0), 0);
  const word = words[index];

  function start(slug = category) {
    setCategory(slug);
    setWords(pickWords(slug));
    setIndex(0);
    setGuess("");
    setHinted(false);
    setFeedback("");
    setResults([]);
    setPhase("play");
  }

  function next(result: Result) {
    const all = [...results, result];
    setResults(all);
    setTimeout(() => {
      if (index + 1 >= words.length) {
        const final = all.reduce((s, r) => s + (r.correct ? (r.hinted ? 5 : 10) : 0), 0);
        setTop(submitScore(BOARD_KEY, final, true));
        setPhase("end");
      } else {
        setIndex((i) => i + 1);
        setGuess("");
        setHinted(false);
        setFeedback("");
        setAltAnswer("");
      }
    }, 900);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!word || feedback === "right" || feedback === "skip") return;
    if (!normalize(guess)) return;
    if (isAccepted(guess, word.answer)) {
      setAltAnswer(normalize(guess) === normalize(word.answer) ? "" : normalize(guess));
      setFeedback("right");
      next({ word, correct: true, hinted });
    } else {
      setFeedback("wrong");
    }
  }

  function skip() {
    if (!word || feedback === "right" || feedback === "skip") return;
    setFeedback("skip");
    next({ word, correct: false, hinted });
  }

  if (phase === "pick") {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-center text-muted">주제를 고르면 바로 시작해요. 한 판에 {ROUND}문제!</p>
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          {[{ slug: "all", name: "전체 섞기" }, ...categories].map((c) => (
            <button
              key={c.slug}
              onClick={() => start(c.slug)}
              className="rounded-2xl border border-border bg-card px-4 py-5 font-display text-xl text-foreground transition-colors hover:bg-accent-soft"
            >
              {c.name}
            </button>
          ))}
        </div>
        <Leaderboard entries={top} unit="점" />
      </div>
    );
  }

  if (phase === "end") {
    const correct = results.filter((r) => r.correct).length;
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl bg-mint px-5 py-6 text-center">
          <p className="font-display text-3xl text-foreground">{score}점</p>
          <p className="text-sm text-foreground/80">
            {ROUND}문제 중 {correct}개를 맞혔어요.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <ShareButton title="초성 퀴즈" text={`초성 퀴즈에서 ${score}점 받았어요! 도전해보세요`} />
            <button
              onClick={() => start()}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              같은 주제로 한 판 더
            </button>
            <button
              onClick={() => setPhase("pick")}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              주제 바꾸기
            </button>
          </div>
        </div>
        <ol className="ruled w-full max-w-md text-sm">
          {results.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-2.5">
              <span className="font-mono text-muted">{toChosung(r.word.answer)}</span>
              <span className="font-semibold text-foreground">{r.word.answer}</span>
              <span className="w-14 text-right">{r.correct ? (r.hinted ? "⭕ +5" : "⭕ +10") : "❌"}</span>
            </li>
          ))}
        </ol>
        <Leaderboard entries={top} unit="점" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center justify-between text-sm text-muted">
        <span>
          {categories.find((c) => c.slug === category)?.name ?? "전체 섞기"} · {index + 1} / {words.length}
        </span>
        <span className="font-mono tabular-nums">{score}점</span>
      </div>

      <div
        className={`flex w-full max-w-md flex-col items-center gap-3 rounded-3xl border border-border px-6 py-10 transition-colors ${
          feedback === "right" ? "bg-mint" : feedback === "wrong" ? "bg-pink" : feedback === "skip" ? "bg-peach" : "bg-card"
        }`}
      >
        <p
          className={`break-keep text-center font-display text-foreground ${
            word.answer.length > 8
              ? "text-2xl leading-relaxed tracking-[0.12em] sm:text-3xl"
              : "text-5xl tracking-[0.2em] sm:text-6xl"
          }`}
          aria-label="초성"
        >
          {toChosung(word.answer)}
        </p>
        <p className="min-h-[1.5rem] text-center text-sm text-muted">
          {feedback === "right"
            ? altAnswer
              ? `정답! ${altAnswer}도 인정 (출제 단어: ${word.answer})`
              : `정답! ${word.answer}`
            : feedback === "skip"
              ? `정답은 '${word.answer}'였어요`
              : feedback === "wrong"
                ? "아쉬워요, 다시 생각해 보세요"
                : hinted
                  ? `힌트: ${word.hint}`
                  : `${normalize(word.answer).length}글자${/\s/.test(word.answer) ? " · 띄어쓰기는 상관없어요" : ""}`}
        </p>
      </div>

      <form onSubmit={submit} className="flex w-full max-w-md gap-2">
        <input
          ref={inputRef}
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            if (feedback === "wrong") setFeedback("");
          }}
          placeholder="정답을 입력하세요"
          aria-label="정답"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-lg text-foreground focus:border-foreground/40 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl border border-foreground/25 px-5 text-sm font-semibold text-foreground hover:bg-accent-soft"
        >
          확인
        </button>
      </form>

      <div className="flex gap-2">
        <button
          onClick={() => setHinted(true)}
          disabled={hinted || feedback === "right" || feedback === "skip"}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground disabled:opacity-40"
        >
          💡 힌트 보기 (정답 시 5점)
        </button>
        <button
          onClick={skip}
          disabled={feedback === "right" || feedback === "skip"}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground disabled:opacity-40"
        >
          넘어가기
        </button>
      </div>
    </div>
  );
}
