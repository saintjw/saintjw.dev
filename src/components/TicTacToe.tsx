"use client";

import { useState } from "react";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const winner = getWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  function handleClick(index: number) {
    if (board[index] || winner) return;
    const next = [...board];
    next[index] = isXTurn ? "X" : "O";
    setBoard(next);
    setIsXTurn(!isXTurn);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  const status = winner
    ? `${winner} 승리! 🎉`
    : isDraw
      ? "무승부예요"
      : `${isXTurn ? "X" : "O"}의 차례`;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-lg font-medium text-foreground">{status}</p>

      <div className="grid grid-cols-3 gap-3">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card text-4xl font-bold text-foreground transition-colors hover:bg-accent-soft disabled:cursor-not-allowed"
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={reset}
        className="rounded-full border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
      >
        다시 시작
      </button>
    </div>
  );
}
