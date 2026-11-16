// 스도쿠 퍼즐 생성기. 같은 시드(날짜+난이도)면 누구에게나 같은 퍼즐이 나온다.
// 판은 길이 81 배열이고, 0은 빈칸이다.

export type Difficulty = "easy" | "normal" | "hard";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

// 남길 단서 개수. 적을수록 어렵다.
const CLUES: Record<Difficulty, number> = { easy: 40, normal: 32, hard: 26 };

/** 문자열 시드로 0~1 난수를 내는 작은 생성기(mulberry32) */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const rowOf = (i: number) => Math.floor(i / 9);
export const colOf = (i: number) => i % 9;
export const boxOf = (i: number) => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);

/** i 칸과 같은 행·열·상자에 있는 칸들(자기 자신 제외) */
export const PEERS: number[][] = Array.from({ length: 81 }, (_, i) =>
  Array.from({ length: 81 }, (_, j) => j).filter(
    (j) => j !== i && (rowOf(j) === rowOf(i) || colOf(j) === colOf(i) || boxOf(j) === boxOf(i)),
  ),
);

function canPlace(board: number[], i: number, n: number): boolean {
  return PEERS[i].every((j) => board[j] !== n);
}

function fillBoard(board: number[], rand: () => number): boolean {
  const i = board.indexOf(0);
  if (i === -1) return true;
  for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rand)) {
    if (canPlace(board, i, n)) {
      board[i] = n;
      if (fillBoard(board, rand)) return true;
      board[i] = 0;
    }
  }
  return false;
}

/** 해답 개수를 limit까지만 센다(유일해 확인용). 후보가 가장 적은 칸부터 채운다. */
function countSolutions(board: number[], limit = 2): number {
  let best = -1;
  let bestCands: number[] = [];
  for (let i = 0; i < 81; i++) {
    if (board[i] !== 0) continue;
    const cands: number[] = [];
    for (let n = 1; n <= 9; n++) if (canPlace(board, i, n)) cands.push(n);
    if (cands.length === 0) return 0;
    if (best === -1 || cands.length < bestCands.length) {
      best = i;
      bestCands = cands;
      if (cands.length === 1) break;
    }
  }
  if (best === -1) return 1;
  let count = 0;
  for (const n of bestCands) {
    board[best] = n;
    count += countSolutions(board, limit - count);
    board[best] = 0;
    if (count >= limit) break;
  }
  return count;
}

export type Puzzle = { puzzle: number[]; solution: number[] };

export function generatePuzzle(seed: string, difficulty: Difficulty): Puzzle {
  const rand = seededRandom(`${seed}:${difficulty}`);
  const solution = new Array(81).fill(0);
  fillBoard(solution, rand);

  const puzzle = [...solution];
  let filled = 81;
  for (const i of shuffle(Array.from({ length: 81 }, (_, k) => k), rand)) {
    if (filled <= CLUES[difficulty]) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (countSolutions([...puzzle]) !== 1) puzzle[i] = keep;
    else filled--;
  }
  return { puzzle, solution };
}

/** 지금 판에서 규칙에 어긋나는(같은 줄·상자에 같은 숫자가 있는) 칸들 */
export function conflicts(board: number[]): Set<number> {
  const bad = new Set<number>();
  for (let i = 0; i < 81; i++) {
    if (!board[i]) continue;
    for (const j of PEERS[i]) if (board[j] === board[i]) bad.add(i);
  }
  return bad;
}

/** 사용자 기기의 오늘 날짜(YYYY-MM-DD) */
export function todayKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
