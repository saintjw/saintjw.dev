import ReactionTime from "@/components/ReactionTime";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "반응속도 테스트",
  "화면이 초록색으로 바뀌는 순간 클릭! 내 반응 속도는 몇 ms?",
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
    </DiaryPage>
  );
}
