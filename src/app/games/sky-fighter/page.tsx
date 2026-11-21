import SkyFighter from "@/components/SkyFighter";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";
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
    </DiaryPage>
  );
}
