import WhackAMole from "@/components/WhackAMole";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "두더지 잡기",
  "30초 동안 튀어나오는 두더지를 최대한 많이 잡는 게임. 설치 없이 PC와 휴대폰 브라우저에서 바로 할 수 있어요.",
  "/games/whack-a-mole",
);

export default function WhackAMolePage() {
  return (
    <DiaryPage
      color="leaf"
      title="두더지 잡기"
      intro={<p>30초 동안 튀어나오는 두더지를 최대한 많이 클릭하세요.</p>}
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("whack-a-mole")}
      tabsLabel="다른 게임"
    >
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <WhackAMole />
      </div>

      <section className="mt-16">
        <SheetHeading color="leaf">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li><strong>시작하기</strong>를 누르면 30초 동안 아홉 개 구멍 중 한 곳에 두더지가 나와요.</li>
          <li>두더지가 있는 칸을 누르면 1점이에요. 빈 칸을 눌러도 점수가 깎이지는 않아요.</li>
          <li>두더지는 0.5초에서 1초쯤 머물다 들어가고, 잠깐 뒤에 다른 구멍에서 나와요. 같은 구멍에서 연달아 나오지는 않아요.</li>
          <li>시간이 끝나면 이번 판 점수가 나오고, 높은 점수 5개가 이 브라우저에 저장돼요.</li>
        </ul>
      </section>

      <section className="mt-16">
        <SheetHeading color="leaf">점수 올리는 요령</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>가운데 칸을 바라보고 있으면 아홉 칸이 한눈에 들어와서 두더지를 빨리 찾을 수 있어요.</li>
          <li>두더지를 잡으면 다음 두더지가 곧바로 나와요. 빨리 잡을수록 30초 안에 나오는 두더지 수가 늘어나요.</li>
          <li>휴대폰에서는 양손 엄지로 왼쪽과 오른쪽을 나눠 맡으면 손이 덜 움직여서 더 빨라요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
