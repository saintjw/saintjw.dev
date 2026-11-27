import ReactionTime from "@/components/ReactionTime";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "반응속도 테스트",
  "화면이 초록색으로 바뀌는 순간 클릭! 내 반응 속도는 몇 ms?",
  "/games/reaction-time",
);

export default function ReactionTimePage() {
  return (
    <DiaryPage
      color="leaf"
      title="반응속도 테스트"
      intro={<p>박스가 초록색으로 바뀌는 순간 최대한 빠르게 클릭하세요.</p>}
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("reaction-time")}
      tabsLabel="다른 게임"
    >
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <ReactionTime />
      </div>

      <section className="mt-16">
        <SheetHeading color="leaf">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>상자를 눌러 시작하면 상자가 살구색으로 바뀌어요. 1초에서 4초 사이 아무 때나 초록색으로 바뀌어요.</li>
          <li>초록색이 되는 순간 상자를 눌러요. 색이 바뀐 때부터 누를 때까지 걸린 시간이 ms(1000분의 1초) 단위로 나와요.</li>
          <li>초록색이 되기 전에 누르면 "너무 빨랐어요"가 뜨고 그 판은 기록되지 않아요. 다시 눌러 새로 시작하면 돼요.</li>
          <li>가장 빠른 기록 5개가 이 브라우저에 저장돼요. 다른 기기나 다른 브라우저와는 공유되지 않아요.</li>
        </ul>
      </section>

      <section className="mt-16">
        <SheetHeading color="leaf">기록 읽는 법</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>200ms 미만이면 "번개 같은 반응", 300ms 미만이면 "훌륭해요", 400ms 미만이면 "괜찮은 편"으로 표시돼요.</li>
          <li>화면이 바뀌는 걸 보고 손으로 누르는 단순한 반응은 보통 0.2~0.3초쯤 걸린다고 알려져 있어요.</li>
          <li>같은 사람이라도 마우스, 터치 화면, 모니터에 따라 기록이 수십 ms씩 달라질 수 있어요. 비교할 때는 같은 기기로 여러 번 재 보세요.</li>
          <li>초록색이 될 때를 짐작해서 미리 누르면 실수만 늘어요. 상자만 보고 있다가 색이 바뀐 걸 본 뒤에 누르는 게 기록이 좋아요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
