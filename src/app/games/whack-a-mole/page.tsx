import WhackAMole from "@/components/WhackAMole";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "두더지 잡기",
  "30초 동안 튀어나오는 두더지를 최대한 많이 잡아보세요.",
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
    </DiaryPage>
  );
}
