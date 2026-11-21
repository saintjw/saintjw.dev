import Sudoku from "@/components/Sudoku";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "오늘의 스도쿠",
  "날마다 새로 나오는 스도쿠 퍼즐. 쉬움·보통·어려움 중에 골라 풀고 기록을 남겨 보세요.",
  "/games/sudoku",
);

export default function Page() {
  return (
    <DiaryPage
      color="blue"
      title="오늘의 스도쿠"
      intro={<p>날마다 모두에게 같은 퍼즐이 나와요. 친구와 같은 문제로 시간을 겨뤄 보세요.</p>}
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("sudoku")}
      tabsLabel="다른 게임"
    >
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <Sudoku />
      </div>

      <section className="mt-16">
        <SheetHeading color="blue">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>가로줄, 세로줄, 굵은 선으로 나뉜 3×3 상자마다 1부터 9까지 숫자가 한 번씩만 들어가도록 빈칸을 채워요.</li>
          <li>칸을 누른 뒤 아래 숫자 패드나 키보드 숫자 키로 입력해요. 방향키로 칸을 옮기고, Backspace로 지울 수 있어요.</li>
          <li>후보 숫자를 적어 두고 싶을 때는 <strong>메모</strong>를 켜요(키보드 N). 숫자를 확정하면 같은 줄과 상자의 메모가 알아서 지워져요.</li>
          <li>같은 줄이나 상자에 겹치는 숫자는 빨간색으로 표시돼요. 숫자 패드 아래 작은 숫자는 그 숫자를 몇 개 더 넣어야 하는지예요.</li>
          <li>오늘의 퍼즐은 진행 상황이 이 브라우저에 저장돼서, 나중에 다시 와도 이어서 풀 수 있어요. 더 풀고 싶으면 <strong>연습 퍼즐</strong>을 눌러 보세요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
