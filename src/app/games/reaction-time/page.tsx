import Link from "next/link";
import ReactionTime from "@/components/ReactionTime";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "반응속도 테스트",
  "화면이 초록색으로 바뀌는 순간 클릭! 내 반응 속도는 몇 ms?"
);

export default function ReactionTimePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/games" className="text-sm font-medium text-muted hover:text-foreground">
        ← 게임 목록으로
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        반응속도 테스트
      </h1>
      <p className="mt-2 text-muted">
        박스가 초록색으로 바뀌는 순간 최대한 빠르게 클릭하세요.
      </p>

      <div className="mt-12">
        <ReactionTime />
      </div>
    </div>
  );
}
