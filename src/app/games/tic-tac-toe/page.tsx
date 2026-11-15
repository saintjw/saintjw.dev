import TicTacToe from "@/components/TicTacToe";
import ShareButton from "@/components/ShareButton";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "틱택토",
  "2인용 O/X 게임. 클래식하지만 늘 재밌죠.",
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
    </DiaryPage>
  );
}
