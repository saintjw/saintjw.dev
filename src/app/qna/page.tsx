import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import QnaForm from "@/components/QnaForm";
import QnaCard from "@/components/QnaCard";
import { isStoreReady, listPublicQuestions } from "@/lib/qna";

export const metadata = pageMetadata(
  "이야기방(Q&A)",
  "로그인 없이 질문을 남기면 은결이 답해 드려요. 글, 사이트, 궁금한 무엇이든 묻고 답하는 공간.",
  "/qna",
);

// 새 답변이 바로 보이도록 요청마다 읽는다.
export const dynamic = "force-dynamic";

export default async function QnaPage() {
  const ready = isStoreReady();
  const questions = ready ? await listPublicQuestions() : [];

  return (
    <DiaryPage
      color="leaf"
      title="이야기방(Q&A)"
      intro={
        <p>
          궁금한 게 있으면 편하게 물어봐 주세요. 로그인 없이 닉네임만 적으면 돼요. 답변을 단 질문은
          아래에 차곡차곡 쌓아 둘게요.
        </p>
      }
    >
      <section className="mt-10">
        <SheetHeading color="leaf">질문 남기기</SheetHeading>
        <div className="mt-6">
          {ready ? (
            <QnaForm />
          ) : (
            <p className="text-sm text-muted">이야기방을 준비하고 있어요. 곧 열게요!</p>
          )}
        </div>
      </section>

      <section className="mt-16">
        <SheetHeading color="rose">
          묻고 답한 이야기 <span className="text-base text-muted tabular-nums">{questions.length}</span>
        </SheetHeading>
        {questions.length > 0 ? (
          <div className="mt-8 flex flex-col gap-10">
            {questions.map((q) => (
              <QnaCard key={q.id} q={q} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">아직 답변한 질문이 없어요. 첫 질문을 남겨 주세요!</p>
        )}
      </section>

      <p className="mt-16 text-sm text-muted">
        예전에 GitHub로 남겨 주신 글은{" "}
        <Link href="/guestbook" className="marker-link text-foreground">
          지난 방명록
        </Link>
        에 그대로 있어요.
      </p>
    </DiaryPage>
  );
}
