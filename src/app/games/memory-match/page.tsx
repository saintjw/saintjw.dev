import MemoryMatch from "@/components/MemoryMatch";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "짝 맞추기",
  "다이어리 스티커 카드를 뒤집어 같은 그림의 짝을 찾는 기억력 게임.",
);

export default function Page() {
  return (
    <DiaryPage
      color="rose"
      title="짝 맞추기"
      intro={<p>카드를 두 장씩 뒤집어 같은 스티커를 찾아보세요. 적게 뒤집을수록 좋은 기록이에요.</p>}
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("memory-match")}
      tabsLabel="다른 게임"
    >
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <MemoryMatch />
      </div>

      <section className="mt-16">
        <SheetHeading color="rose">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>카드를 한 장 누르면 그림이 보여요. 한 장 더 눌러 같은 그림이면 짝이 맞아 그대로 열려 있어요.</li>
          <li>그림이 다르면 잠시 뒤 다시 덮여요. 어떤 그림이 어디 있었는지 기억해 두는 게 요령이에요.</li>
          <li>두 장을 뒤집을 때마다 1번으로 세요. 모든 짝을 찾았을 때의 횟수가 기록으로 남아요(적을수록 좋아요).</li>
          <li>4×4는 8쌍, 6×4는 12쌍이에요. 익숙해지면 큰 판에 도전해 보세요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
