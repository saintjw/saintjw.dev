import SkyFighter from "@/components/SkyFighter";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "스카이 파이터",
  "적기를 피하고 쏘면서 최대한 오래 살아남으세요.",
  "/games/sky-fighter",
);

export default function SkyFighterPage() {
  return (
    <DiaryPage
      color="leaf"
      title="스카이 파이터"
      intro={
        <p>
          방향키(WASD)나 화면 드래그로 조종하고, 총알은 자동으로 발사됩니다.
        </p>
      }
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("sky-fighter")}
      tabsLabel="다른 게임"
    >
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <div className="flex justify-center">
          <SkyFighter />
        </div>
      </div>

      <section className="mt-16">
        <SheetHeading color="leaf">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li><strong>시작하기</strong>를 누르면 내 비행기가 화면 아래쪽에 나오고, 총알은 알아서 위로 계속 나가요.</li>
          <li>컴퓨터에서는 방향키나 W·A·S·D로, 휴대폰에서는 화면을 손가락으로 끌어서 비행기를 움직여요.</li>
          <li>적기를 맞히면 10점이에요. 적기와 부딪히면 하트가 하나 줄고, 하트 세 개를 모두 잃으면 게임이 끝나요.</li>
          <li>화면 아래로 빠져나간 적기는 그냥 사라져요. 놓쳐도 하트는 줄지 않아요.</li>
          <li>오래 버틸수록 적기가 더 자주, 더 빠르게 내려와요. 높은 점수 5개가 이 브라우저에 저장돼요.</li>
        </ul>
      </section>

      <section className="mt-16">
        <SheetHeading color="leaf">오래 살아남는 요령</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>총알은 비행기 바로 위로만 나가요. 적기와 좌우 위치만 맞추면 위아래로 크게 움직이지 않아도 맞힐 수 있어요.</li>
          <li>화면 위쪽으로 올라갈수록 내려오는 적기를 피할 시간이 짧아져요. 아래쪽에 머물면서 좌우로 움직이는 게 안전해요.</li>
          <li>적기가 빨라지는 후반에는 모두 잡으려 하기보다 빈 틈으로 피하는 데 집중하세요. 살아 있어야 계속 점수를 낼 수 있어요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
