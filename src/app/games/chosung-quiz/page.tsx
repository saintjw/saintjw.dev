import ChosungQuiz from "@/components/ChosungQuiz";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { gameTabs } from "@/lib/games";

export const metadata = pageMetadata(
  "초성 퀴즈",
  "ㄱㅂ → 김밥! 한글 초성만 보고 단어를 맞히는 퀴즈. 음식, 동물, IT, 나라·도시, 영화, 속담 주제.",
  "/games/chosung-quiz",
);

export default function Page() {
  return (
    <DiaryPage
      color="yellow"
      title="초성 퀴즈"
      intro={<p>초성만 보고 어떤 단어인지 맞혀 보세요. 한 판에 10문제예요.</p>}
      back={{ href: "/games", label: "게임 목록" }}
      tabs={gameTabs("chosung-quiz")}
      tabsLabel="다른 게임"
    >
      <div className="mt-10 border-t border-dashed border-rule pt-10">
        <ChosungQuiz />
      </div>

      <section className="mt-16">
        <SheetHeading color="yellow">이렇게 해요</SheetHeading>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          <li>주제를 고르면 문제가 나와요. 화면의 초성(예: ㄱㅂ)을 보고 떠오르는 단어를 입력한 뒤 확인을 눌러요.</li>
          <li>바로 맞히면 10점, <strong>힌트</strong>를 보고 맞히면 5점이에요. 틀려도 몇 번이든 다시 입력할 수 있어요.</li>
          <li>도저히 모르겠으면 <strong>넘어가기</strong>로 정답을 확인하고 다음 문제로 가요.</li>
          <li>띄어쓰기는 상관없어요. 한 판이 끝나면 맞힌 단어와 놓친 단어를 한눈에 볼 수 있어요.</li>
        </ul>
      </section>
    </DiaryPage>
  );
}
