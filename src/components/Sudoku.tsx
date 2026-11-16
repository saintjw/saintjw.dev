"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Leaderboard from "@/components/Leaderboard";
import ShareButton from "@/components/ShareButton";
import { getTopScores, submitScore, type ScoreEntry } from "@/lib/leaderboard";
import {
  DIFFICULTY_LABEL,
  PEERS,
  boxOf,
  colOf,
  conflicts,
  generatePuzzle,
  rowOf,
  todayKey,
  type Difficulty,
} from "@/lib/sudoku";

// 오늘의 스도쿠: 날짜마다 모두에게 같은 퍼즐. 진행 상황은 이 브라우저에 저장된다.

type Saved = { board: number[]; notes: number[]; elapsed: number; done: boolean };

const DIFFS: Difficulty[] = ["easy", "normal", "hard"];

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function load(key: string): Saved | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(key: string, data: Saved) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export default function Sudoku() {
  const [seed, setSeed] = useState<string | null>(null); // 날짜는 브라우저에서 정한다
  const [practice, setPractice] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<number[]>([]);
  const [notes, setNotes] = useState<number[]>([]); // 칸마다 메모 숫자를 비트로
  const [selected, setSelected] = useState<number | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [top, setTop] = useState<ScoreEntry[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSeed(todayKey()), []);

  const game = useMemo(() => (seed ? generatePuzzle(seed, difficulty) : null), [seed, difficulty]);
  const storageKey = seed ? `sudoku:${seed}:${difficulty}` : "";
  const boardKey = `sudoku-${difficulty}-leaderboard`;

  // 퍼즐이 바뀌면 저장된 진행 상황을 불러오거나 새로 시작한다.
  useEffect(() => {
    if (!game) return;
    const saved = practice ? null : load(storageKey);
    if (saved && saved.board?.length === 81) {
      setBoard(saved.board);
      setNotes(saved.notes ?? new Array(81).fill(0));
      setElapsed(saved.elapsed ?? 0);
      setDone(Boolean(saved.done));
    } else {
      setBoard([...game.puzzle]);
      setNotes(new Array(81).fill(0));
      setElapsed(0);
      setDone(false);
    }
    setSelected(null);
    setTop(getTopScores(boardKey));
  }, [game, storageKey, practice, boardKey]);

  // 타이머: 끝나지 않았고 탭이 보일 때만 흐른다.
  useEffect(() => {
    if (!game || done || board.length !== 81) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [game, done, board.length]);

  // 진행 상황 저장(오늘의 퍼즐만).
  useEffect(() => {
    if (!game || practice || board.length !== 81) return;
    save(storageKey, { board, notes, elapsed, done });
  }, [board, notes, elapsed, done, game, practice, storageKey]);

  const bad = useMemo(() => conflicts(board), [board]);
  const counts = useMemo(() => {
    const c = new Array(10).fill(0);
    board.forEach((n) => c[n]++);
    return c;
  }, [board]);

  const input = useCallback(
    (n: number) => {
      if (!game || done || selected === null || game.puzzle[selected] !== 0) return;
      if (noteMode && n !== 0) {
        if (board[selected]) return;
        setNotes((prev) => {
          const next = [...prev];
          next[selected] ^= 1 << n;
          return next;
        });
        return;
      }
      const next = [...board];
      next[selected] = n;
      setBoard(next);
      if (n !== 0) {
        // 같은 줄·상자의 메모에서 이 숫자를 지운다.
        setNotes((prev) => {
          const nn = [...prev];
          nn[selected] = 0;
          for (const j of PEERS[selected]) nn[j] &= ~(1 << n);
          return nn;
        });
      }
      if (next.every((v, i) => v === game.solution[i])) {
        setDone(true);
        setSelected(null);
        setTop(submitScore(boardKey, elapsed, false));
      }
    },
    [game, done, selected, noteMode, board, boardKey, elapsed],
  );

  // 키보드: 숫자, 지우기, 방향키, N(메모)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[1-9]$/.test(e.key)) input(Number(e.key));
      else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") input(0);
      else if (e.key === "n" || e.key === "N") setNoteMode((m) => !m);
      else if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        setSelected((s) => {
          const i = s ?? 40;
          if (e.key === "ArrowUp") return i >= 9 ? i - 9 : i;
          if (e.key === "ArrowDown") return i < 72 ? i + 9 : i;
          if (e.key === "ArrowLeft") return i % 9 ? i - 1 : i;
          return i % 9 < 8 ? i + 1 : i;
        });
      } else return;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [input]);

  function restart() {
    if (!game) return;
    setBoard([...game.puzzle]);
    setNotes(new Array(81).fill(0));
    setElapsed(0);
    setDone(false);
    setSelected(null);
  }

  function newPractice() {
    setPractice(true);
    setSeed(`practice-${Date.now()}`);
  }

  function backToDaily() {
    setPractice(false);
    setSeed(todayKey());
  }

  if (!game || board.length !== 81) {
    return <p className="py-20 text-center text-sm text-muted">퍼즐을 준비하고 있어요…</p>;
  }

  const sel = selected;
  const selValue = sel !== null ? board[sel] : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 난이도·모드 */}
      <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5" role="group" aria-label="난이도">
          {DIFFS.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              aria-pressed={difficulty === d}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                difficulty === d
                  ? "bg-foreground text-background"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {DIFFICULTY_LABEL[d]}
            </button>
          ))}
        </div>
        <p className="font-mono text-sm tabular-nums text-muted" aria-label="경과 시간">
          ⏱ {fmt(elapsed)}
        </p>
      </div>

      <p className="-mt-3 w-full max-w-md text-xs text-muted">
        {practice ? "연습 퍼즐 · 기록은 저장되지만 진행 상황은 저장되지 않아요" : `오늘의 퍼즐 · ${seed}`}
      </p>

      {/* 판 */}
      <div
        ref={gridRef}
        role="grid"
        aria-label="스도쿠 판"
        className="grid w-full max-w-md grid-cols-9 overflow-hidden rounded-xl border-2 border-foreground/70 bg-card"
      >
        {board.map((v, i) => {
          const given = game.puzzle[i] !== 0;
          const r = rowOf(i);
          const c = colOf(i);
          const related =
            sel !== null && (rowOf(sel) === r || colOf(sel) === c || boxOf(sel) === boxOf(i));
          const same = selValue !== 0 && v === selValue;
          const isBad = bad.has(i) && !given;
          const bg =
            sel === i
              ? "bg-highlight"
              : same
                ? "bg-sky"
                : related
                  ? "bg-accent-soft"
                  : "";
          return (
            <button
              key={i}
              role="gridcell"
              aria-label={`${r + 1}행 ${c + 1}열 ${v || "빈칸"}`}
              onClick={() => setSelected(i)}
              className={`relative flex aspect-square items-center justify-center border-foreground/15 text-lg sm:text-2xl ${bg} ${
                c % 3 === 2 && c !== 8 ? "border-r-2 border-r-foreground/60" : c !== 8 ? "border-r" : ""
              } ${r % 3 === 2 && r !== 8 ? "border-b-2 border-b-foreground/60" : r !== 8 ? "border-b" : ""} ${
                given ? "font-bold text-foreground" : isBad ? "font-semibold text-[var(--tab-rose)]" : "text-[var(--tab-blue)]"
              } focus:outline-none`}
            >
              {v !== 0 ? (
                v
              ) : notes[i] ? (
                <span className="grid h-full w-full grid-cols-3 p-[2px] text-[8px] leading-none text-muted sm:text-[10px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="flex items-center justify-center">
                      {notes[i] & (1 << n) ? n : ""}
                    </span>
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {done ? (
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl bg-mint px-5 py-5 text-center">
          <p className="font-display text-2xl text-foreground">완성! 🎉</p>
          <p className="text-sm text-foreground/80">
            {DIFFICULTY_LABEL[difficulty]} 퍼즐을 {fmt(elapsed)}만에 풀었어요.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <ShareButton
              title="오늘의 스도쿠"
              text={`오늘의 스도쿠(${DIFFICULTY_LABEL[difficulty]})를 ${fmt(elapsed)}만에 풀었어요!`}
            />
            <button
              onClick={newPractice}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              연습 퍼즐 하나 더
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 숫자 패드 */}
          <div className="grid w-full max-w-md grid-cols-9 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => input(n)}
                disabled={counts[n] >= 9 && !noteMode}
                className="flex aspect-[3/4] flex-col items-center justify-center rounded-lg border border-border bg-card text-xl font-semibold text-foreground transition-colors hover:bg-accent-soft disabled:opacity-30"
              >
                {n}
                <span className="text-[10px] font-normal text-muted">{Math.max(0, 9 - counts[n])}</span>
              </button>
            ))}
          </div>
          <div className="flex w-full max-w-md flex-wrap gap-2">
            <button
              onClick={() => setNoteMode((m) => !m)}
              aria-pressed={noteMode}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                noteMode ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"
              }`}
            >
              ✏️ 메모 {noteMode ? "켜짐" : "꺼짐"}
            </button>
            <button
              onClick={() => input(0)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              지우기
            </button>
            <button
              onClick={restart}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
            >
              처음부터
            </button>
            {practice ? (
              <button
                onClick={backToDaily}
                className="ml-auto rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
              >
                오늘의 퍼즐로
              </button>
            ) : (
              <button
                onClick={newPractice}
                className="ml-auto rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
              >
                연습 퍼즐
              </button>
            )}
          </div>
        </>
      )}

      <Leaderboard entries={top} unit="초" />
    </div>
  );
}
