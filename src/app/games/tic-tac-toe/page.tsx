import TicTacToe from "@/components/TicTacToe";
import ShareButton from "@/components/ShareButton";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "틱택토",
  "친구와 한 화면에서 번갈아 두는 2인용 틱택토(O/X 게임). 규칙과 이기는 요령도 함께 정리했어요.",
  "/games/tic-tac-toe",
);

export default function TicTacToePage() {
  return (
    <DiaryPage
      color="leaf"
      title="틱택토"
      intro={<p>한 화면에서 번갈아 플레이하세요.</p>}
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("tic-tac-toe")}
      tabsLabel="다른 게임"
    >
      <div className="mt-6">
        <ShareButton title="틱택토" text="같이 틱택토 한 판 어때요?" />
      </div>
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <TicTacToe />
      </div>

      <section className="mt-16">
        <SheetHeading color="leaf">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>두 사람이 한 화면에서 번갈아 칸을 눌러요. 먼저 두는 쪽이 X, 다음 사람이 O예요.</li>
          <li>가로, 세로, 대각선 중 한 줄에 같은 표시 세 개를 먼저 놓으면 이겨요. 아홉 칸이 다 찼는데 줄이 없으면 무승부예요.</li>
          <li>이미 표시된 칸은 다시 누를 수 없어요. 판이 끝나면 <strong>다시 시작</strong>을 눌러 새 판을 열어요.</li>
        </ul>
      </section>

      <section className="mt-16">
        <SheetHeading color="leaf">이기는 요령</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>첫 수는 가운데가 가장 좋아요. 가운데 칸은 가로·세로·대각선 두 줄까지 네 줄에 걸쳐 있어서 노릴 수 있는 줄이 제일 많아요.</li>
          <li>가운데를 상대가 먼저 잡았다면 모서리를 잡아요. 모서리는 세 줄, 변 칸은 두 줄에 걸쳐 있어요.</li>
          <li>상대가 한 줄에 두 개를 놓았으면 내 공격보다 막는 게 먼저예요. 반대로 한 수로 두 줄을 동시에 노리는 자리를 만들면 상대는 하나밖에 못 막아요.</li>
          <li>둘 다 실수 없이 두면 틱택토는 언제나 무승부로 끝나요. 결국 승부는 누가 먼저 실수하느냐에서 갈려요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
