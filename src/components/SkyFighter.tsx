"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_W = 360;
const CANVAS_H = 520;
const PLAYER_SIZE = 26;
const BULLET_SPEED = 7;
const BULLET_INTERVAL = 220;
const PLAYER_MOVE_SPEED = 4.5;
const BEST_KEY = "sky-fighter-best-score";

type Bullet = { x: number; y: number };
type Enemy = { x: number; y: number; speed: number };
type Star = { x: number; y: number; r: number };

type Phase = "idle" | "playing" | "over";

export default function SkyFighter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState<number | null>(null);

  const playerRef = useRef({ x: CANVAS_W / 2, y: CANVAS_H - 60 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const starsRef = useRef<Star[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const lastFireRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const rafRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem(BEST_KEY);
    if (stored) setBest(Number(stored));
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    playerRef.current = { x: CANVAS_W / 2, y: CANVAS_H - 60 };
    bulletsRef.current = [];
    enemiesRef.current = [];
    starsRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      r: Math.random() * 1.5 + 0.5,
    }));
    scoreRef.current = 0;
    livesRef.current = 3;
    elapsedRef.current = 0;
    lastFireRef.current = 0;
    lastSpawnRef.current = 0;

    function handleKeyDown(e: KeyboardEvent) {
      keysRef.current.add(e.key.toLowerCase());
    }
    function handleKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key.toLowerCase());
    }
    function pointerPos(e: PointerEvent): { x: number; y: number } | null {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
        y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
      };
    }
    function handlePointerDown(e: PointerEvent) {
      pointerRef.current = pointerPos(e);
    }
    function handlePointerMove(e: PointerEvent) {
      if (pointerRef.current) pointerRef.current = pointerPos(e);
    }
    function handlePointerUp() {
      pointerRef.current = null;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);

    let running = true;

    function endGame() {
      running = false;
      setScore(scoreRef.current);
      setLives(0);
      setPhase("over");
      setBest((prevBest) => {
        if (prevBest === null || scoreRef.current > prevBest) {
          localStorage.setItem(BEST_KEY, String(scoreRef.current));
          return scoreRef.current;
        }
        return prevBest;
      });
    }

    function loop(timestamp: number) {
      if (!running) return;
      elapsedRef.current += 16;

      const player = playerRef.current;
      const keys = keysRef.current;
      if (pointerRef.current) {
        player.x += (pointerRef.current.x - player.x) * 0.25;
        player.y += (pointerRef.current.y - player.y) * 0.25;
      } else {
        if (keys.has("arrowleft") || keys.has("a")) player.x -= PLAYER_MOVE_SPEED;
        if (keys.has("arrowright") || keys.has("d")) player.x += PLAYER_MOVE_SPEED;
        if (keys.has("arrowup") || keys.has("w")) player.y -= PLAYER_MOVE_SPEED;
        if (keys.has("arrowdown") || keys.has("s")) player.y += PLAYER_MOVE_SPEED;
      }
      player.x = Math.max(PLAYER_SIZE / 2, Math.min(CANVAS_W - PLAYER_SIZE / 2, player.x));
      player.y = Math.max(PLAYER_SIZE / 2, Math.min(CANVAS_H - PLAYER_SIZE / 2, player.y));

      if (timestamp - lastFireRef.current > BULLET_INTERVAL) {
        lastFireRef.current = timestamp;
        bulletsRef.current.push({ x: player.x, y: player.y - PLAYER_SIZE / 2 });
      }

      const spawnInterval = Math.max(380, 950 - elapsedRef.current / 60);
      if (timestamp - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = timestamp;
        const speed = 1.4 + Math.min(elapsedRef.current / 12000, 2.2);
        enemiesRef.current.push({
          x: 20 + Math.random() * (CANVAS_W - 40),
          y: -20,
          speed,
        });
      }

      bulletsRef.current = bulletsRef.current
        .map((b) => ({ ...b, y: b.y - BULLET_SPEED }))
        .filter((b) => b.y > -10);

      enemiesRef.current = enemiesRef.current.map((en) => ({
        ...en,
        y: en.y + en.speed,
      }));

      const survivingEnemies: Enemy[] = [];
      for (const en of enemiesRef.current) {
        if (en.y > CANVAS_H + 20) continue;

        let hit = false;
        bulletsRef.current = bulletsRef.current.filter((b) => {
          if (!hit && Math.hypot(b.x - en.x, b.y - en.y) < 18) {
            hit = true;
            return false;
          }
          return true;
        });

        if (hit) {
          scoreRef.current += 10;
          setScore(scoreRef.current);
          continue;
        }

        if (Math.hypot(player.x - en.x, player.y - en.y) < 20) {
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            endGame();
            return;
          }
          continue;
        }

        survivingEnemies.push(en);
      }
      enemiesRef.current = survivingEnemies;

      ctx.fillStyle = "#161528";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (const s of starsRef.current) {
        s.y += 0.6;
        if (s.y > CANVAS_H) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#ffe08a";
      for (const b of bulletsRef.current) {
        ctx.fillRect(b.x - 2, b.y - 8, 4, 8);
      }

      for (const en of enemiesRef.current) {
        ctx.fillStyle = "#ff8a80";
        ctx.beginPath();
        ctx.moveTo(en.x, en.y + 12);
        ctx.lineTo(en.x - 12, en.y - 10);
        ctx.lineTo(en.x + 12, en.y - 10);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = "#cbb8f0";
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - PLAYER_SIZE / 2);
      ctx.lineTo(player.x - PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.lineTo(player.x, player.y + PLAYER_SIZE / 4);
      ctx.lineTo(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.closePath();
      ctx.fill();

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [phase]);

  function startGame() {
    setScore(0);
    setLives(3);
    setPhase("playing");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-lg font-medium text-foreground">
        <span>점수: {score}</span>
        <span>{"❤️".repeat(Math.max(lives, 0)) || "💀"}</span>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-border"
        style={{ width: CANVAS_W, height: CANVAS_H }}
      >
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="block" />

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 text-center text-white">
            {phase === "over" && (
              <>
                <p className="text-xl font-semibold">게임 오버</p>
                <p>이번 점수: {score}점</p>
              </>
            )}
            {phase === "idle" && (
              <p className="max-w-[240px] text-sm text-white/80">
                방향키(WASD)나 화면 드래그로 비행기를 조종하세요.
                <br />
                총알은 자동으로 발사됩니다.
              </p>
            )}
            <button
              onClick={startGame}
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
            >
              {phase === "over" ? "다시 시작" : "시작하기"}
            </button>
          </div>
        )}
      </div>

      {best !== null && <p className="text-sm text-muted">최고 점수: {best}점</p>}
    </div>
  );
}
