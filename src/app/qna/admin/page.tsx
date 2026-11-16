import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import QnaCard from "@/components/QnaCard";
import QnaAdminLogin from "@/components/QnaAdminLogin";
import {
  ADMIN_COOKIE,
  adminConfigured,
  isAdminSession,
  isStoreReady,
  listQuestions,
  type Question,
} from "@/lib/qna";
import { adminLogout, hideQuestion, removeQuestion, restoreQuestion, saveAnswer } from "../actions";

export const metadata: Metadata = {
  title: "이야기방 관리",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const smallBtn =
  "rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted transition-colors hover:border-foreground/40 hover:text-foreground";

function AdminItem({ q }: { q: Question }) {
  return (
    <div className="flex flex-col gap-3">
      <QnaCard q={q} link={q.status === "answered" && !q.isPrivate} />
      {q.status !== "hidden" && (
        <form action={saveAnswer} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={q.id} />
          <textarea
            name="answer"
            rows={q.answer ? 4 : 5}
            defaultValue={q.answer ?? ""}
            placeholder="답변을 적어 주세요."
            maxLength={4000}
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground focus:border-foreground/40 focus:outline-none"
          />
          <div>
            <button
              type="submit"
              className="rounded-full border border-foreground/25 px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-foreground hover:bg-accent-soft"
            >
              {q.answer ? "답변 고치기" : q.isPrivate ? "답변 저장 (비공개)" : "답변하고 공개하기"}
            </button>
          </div>
        </form>
      )}
      <div className="flex flex-wrap gap-2">
        {q.status === "hidden" ? (
          <form action={restoreQuestion}>
            <input type="hidden" name="id" value={q.id} />
            <input type="hidden" name="answered" value={q.answer ? "1" : "0"} />
            <button type="submit" className={smallBtn}>
              숨김 풀기
            </button>
          </form>
        ) : (
          <form action={hideQuestion}>
            <input type="hidden" name="id" value={q.id} />
            <button type="submit" className={smallBtn}>
              숨기기
            </button>
          </form>
        )}
        <form action={removeQuestion}>
          <input type="hidden" name="id" value={q.id} />
          <button type="submit" className={smallBtn}>
            완전히 삭제
          </button>
        </form>
      </div>
    </div>
  );
}

function Group({ title, items, color }: { title: string; items: Question[]; color: "yellow" | "leaf" | "rose" }) {
  return (
    <section className="mt-14">
      <SheetHeading color={color}>
        {title} <span className="text-base text-muted tabular-nums">{items.length}</span>
      </SheetHeading>
      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted">없어요.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-12">
          {items.map((q) => (
            <AdminItem key={q.id} q={q} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function QnaAdminPage() {
  const store = await cookies();
  const authed = isAdminSession(store.get(ADMIN_COOKIE)?.value);

  if (!adminConfigured()) {
    return (
      <DiaryPage color="leaf" title="이야기방 관리">
        <p className="mt-10 text-sm text-muted">
          관리 비밀번호(QNA_ADMIN_PASSWORD)가 아직 설정되지 않았어요.
        </p>
      </DiaryPage>
    );
  }

  if (!authed) {
    return (
      <DiaryPage color="leaf" title="이야기방 관리">
        <QnaAdminLogin />
      </DiaryPage>
    );
  }

  const all = isStoreReady() ? await listQuestions() : [];
  const pending = all.filter((q) => q.status === "pending");
  const answered = all.filter((q) => q.status === "answered");
  const hidden = all.filter((q) => q.status === "hidden");

  return (
    <DiaryPage
      color="leaf"
      title="이야기방 관리"
      back={{ href: "/qna", label: "이야기방" }}
      intro={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            새 질문 {pending.length}개 · 답변 {answered.length}개 · 숨김 {hidden.length}개
          </p>
          <form action={adminLogout}>
            <button type="submit" className={smallBtn}>
              로그아웃
            </button>
          </form>
        </div>
      }
    >
      {!isStoreReady() && (
        <p className="mt-8 rounded-xl bg-pink px-4 py-3 text-sm">저장소(Redis)가 아직 연결되지 않았어요.</p>
      )}
      <Group title="답변 기다리는 질문" items={pending} color="yellow" />
      <Group title="답변한 질문" items={answered} color="leaf" />
      <Group title="숨긴 질문" items={hidden} color="rose" />
    </DiaryPage>
  );
}
