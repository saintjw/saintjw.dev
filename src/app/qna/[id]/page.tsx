import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiaryPage } from "@/components/Diary";
import QnaCard from "@/components/QnaCard";
import { getQuestion, isStoreReady, tokenMatches } from "@/lib/qna";
import JsonLd from "@/components/JsonLd";
import { AUTHOR_NAME, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/metadata";

export const dynamic = "force-dynamic";

function isPublic(q: { status: string; isPrivate: boolean }) {
  return q.status === "answered" && !q.isPrivate;
}

export async function generateMetadata({ params }: PageProps<"/qna/[id]">): Promise<Metadata> {
  const { id } = await params;
  const q = isStoreReady() ? await getQuestion(id) : null;
  if (!q || !isPublic(q)) {
    return { title: "내 질문 확인", robots: { index: false, follow: false } };
  }
  const title = q.question.length > 40 ? `${q.question.slice(0, 40)}…` : q.question;
  const description = (q.answer ?? "").slice(0, 120);
  return {
    title: `Q. ${title}`,
    description,
    alternates: { canonical: `/qna/${id}` },
    openGraph: { title: `Q. ${title} · ${SITE_NAME}`, description, url: `/qna/${id}`, images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function QuestionPage({ params, searchParams }: PageProps<"/qna/[id]">) {
  const { id } = await params;
  const { k } = await searchParams;
  if (!isStoreReady()) notFound();
  const q = await getQuestion(id);
  if (!q) notFound();

  const owner = tokenMatches(q, typeof k === "string" ? k : undefined);
  if (!isPublic(q) && !owner) notFound();
  if (q.status === "hidden" && owner) {
    return (
      <DiaryPage color="leaf" title="내 질문" back={{ href: "/qna", label: "이야기방" }}>
        <p className="mt-10 text-sm text-muted">이 질문은 운영 원칙에 따라 정리되었어요.</p>
      </DiaryPage>
    );
  }

  // 공개 질문만 검색엔진에 질문·답변 구조로 알린다.
  const qaJsonLd = isPublic(q)
    ? {
        "@context": "https://schema.org",
        "@type": "QAPage",
        url: `${SITE_URL}/qna/${q.id}`,
        mainEntity: {
          "@type": "Question",
          name: q.question.length > 110 ? `${q.question.slice(0, 110)}…` : q.question,
          text: q.question,
          answerCount: 1,
          datePublished: q.createdAt,
          author: { "@type": "Person", name: q.nickname || "익명" },
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer ?? "",
            ...(q.answeredAt && { datePublished: q.answeredAt }),
            url: `${SITE_URL}/qna/${q.id}`,
            author: { "@type": "Person", "@id": `${SITE_URL}/#author`, name: AUTHOR_NAME, url: `${SITE_URL}/about` },
          },
        },
      }
    : null;

  return (
    <DiaryPage
      color="leaf"
      title={
        owner && !isPublic(q)
          ? "내 질문"
          : `Q. ${q.question.length > 60 ? `${q.question.slice(0, 60)}…` : q.question}`
      }
      back={{ href: "/qna", label: "이야기방" }}
      intro={
        owner ? (
          <p>
            {q.answer
              ? "답변이 도착했어요."
              : "질문이 잘 접수되어 있어요. 답변이 달리면 이 링크에서 볼 수 있어요."}
            {q.isPrivate && " 비공개 질문이라 이 링크로만 볼 수 있어요."}
          </p>
        ) : undefined
      }
    >
      {qaJsonLd && <JsonLd data={qaJsonLd} />}
      <div className="mt-10">
        <QnaCard q={q} link={false} showPending />
      </div>
    </DiaryPage>
  );
}
