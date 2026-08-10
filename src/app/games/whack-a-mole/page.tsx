import Link from "next/link";
import WhackAMole from "@/components/WhackAMole";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "두더지 잡기",
  "30초 동안 튀어나오는 두더지를 최대한 많이 잡아보세요."
);

export default function WhackAMolePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/games" className="text-sm font-medium text-muted hover:text-foreground">
        ← 게임 목록으로
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        두더지 잡기
      </h1>
      <p className="mt-2 text-muted">
        30초 동안 튀어나오는 두더지를 최대한 많이 클릭하세요.
      </p>

      <div className="mt-12">
        <WhackAMole />
      </div>
    </div>
  );
}
