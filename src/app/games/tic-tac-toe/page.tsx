import Link from "next/link";
import TicTacToe from "@/components/TicTacToe";
import ShareButton from "@/components/ShareButton";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "틱택토",
  "2인용 O/X 게임. 클래식하지만 늘 재밌죠."
);

export default function TicTacToePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/games" className="text-sm font-medium text-muted hover:text-foreground">
        ← 게임 목록으로
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">틱택토</h1>
          <p className="mt-2 text-muted">한 화면에서 번갈아 플레이하세요.</p>
        </div>
        <ShareButton title="틱택토" text="같이 틱택토 한 판 어때요?" />
      </div>

      <div className="mt-12">
        <TicTacToe />
      </div>
    </div>
  );
}
