import Link from "next/link";
import { DateStamp } from "@/components/Diary";
import { kstDate, type Question } from "@/lib/qna";

// 질문 한 장: 위에는 방문자의 질문(Q), 아래 점선 밑에는 운영자의 답(A).
export default function QnaCard({
  q,
  link = true,
  showPending = false,
}: {
  q: Question;
  link?: boolean;
  showPending?: boolean;
}) {
  return (
    <article className="sheet px-5 py-6 sm:px-8 sm:py-7">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">{q.nickname}</span> 님의 질문
          {q.isPrivate && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs">비공개</span>}
        </p>
        <DateStamp date={kstDate(q.createdAt)} color="leaf" />
      </header>

      <div className="mt-4 flex gap-3">
        <span aria-hidden className="font-display text-2xl leading-none text-[var(--tab-leaf)]">
          Q.
        </span>
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground sm:text-base">
          {q.question}
        </p>
      </div>

      {q.answer ? (
        <div className="mt-5 flex gap-3 border-t border-dashed border-rule pt-5">
          <span aria-hidden className="font-display text-2xl leading-none text-[var(--tab-rose)]">
            A.
          </span>
          <div className="min-w-0">
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground sm:text-base">
              {q.answer}
            </p>
            <p className="mt-3 text-xs text-muted">saintjw 답변</p>
          </div>
        </div>
      ) : (
        showPending && (
          <p className="mt-5 border-t border-dashed border-rule pt-5 text-sm text-muted">
            아직 답변을 쓰고 있어요. 조금만 기다려 주세요.
          </p>
        )
      )}

      {link && (
        <p className="mt-4 text-right">
          <Link href={`/qna/${q.id}`} className="marker-link text-xs text-muted hover:text-foreground">
            이 질문만 보기 →
          </Link>
        </p>
      )}
    </article>
  );
}
