import Link from "next/link";
import SkyFighter from "@/components/SkyFighter";

export default function SkyFighterPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/games" className="text-sm font-medium text-muted hover:text-foreground">
        ← 게임 목록으로
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        스카이 파이터
      </h1>
      <p className="mt-2 text-muted">
        방향키(WASD)나 화면 드래그로 조종하고, 총알은 자동으로 발사됩니다.
      </p>

      <div className="mt-12 flex justify-center">
        <SkyFighter />
      </div>
    </div>
  );
}
