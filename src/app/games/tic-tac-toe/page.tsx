import Link from "next/link";
import TicTacToe from "@/components/TicTacToe";

export default function TicTacToePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/games" className="text-sm font-medium text-muted hover:text-foreground">
        ← 게임 목록으로
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">틱택토</h1>
      <p className="mt-2 text-muted">한 화면에서 번갈아 플레이하세요.</p>

      <div className="mt-12">
        <TicTacToe />
      </div>
    </div>
  );
}
