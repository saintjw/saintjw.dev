import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading } from "@/components/Diary";
import { topics } from "@/lib/topics";

export const metadata = pageMetadata(
  "소개",
  "은결의 Serendipity를 만들고 글을 쓰는 개인 개발자 은결의 소개. 이 사이트에서 무엇을 다루는지, 글을 어떤 원칙으로 쓰는지 적어 두었어요.",
  "/about",
);

const LIST = "mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted";

export default function AboutPage() {
  return (
    <DiaryPage
      color="yellow"
      title="안녕하세요, 은결이에요"
      intro={<p>호기심 가득한 개인 개발자이고, 이 사이트의 글과 게임을 직접 만들고 있어요.</p>}
    >
      <section className="mt-12">
        <SheetHeading color="yellow">이곳의 이름</SheetHeading>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          Serendipity는 우연히 소중한 것을 발견하는 일을 뜻해요. 뉴스에서 스친 낯선 IT 용어나 쓰다가 막힌
          도구처럼, 궁금해서 파고들다 보면 생각지 못한 걸 알게 될 때가 많았어요. 그렇게 알게 된 것을 어렵지
          않은 말로 옮겨 두려고 이 사이트를 만들었어요.
        </p>
      </section>

      <section className="mt-12">
        <SheetHeading color="blue">여기서 볼 수 있는 것</SheetHeading>
        <ul className={LIST}>
          <li>
            <Link href="/posts" className="marker-link font-semibold text-foreground">
              탐구노트
            </Link>
            : 직접 공부하고 정리한 글이에요. 주제는 세 가지예요.
            <ul className="mt-2 list-[circle] space-y-1.5 pl-5">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link href={`/posts/topic/${t.slug}`} className="marker-link text-foreground">
                    {t.name}
                  </Link>
                  : {t.description}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link href="/blog" className="marker-link font-semibold text-foreground">
              잡학사전
            </Link>
            : 티스토리 블로그에 쓴 생활 정보 글을 주제별로 모아 둔 곳이에요.
          </li>
          <li>
            <Link href="/games" className="marker-link font-semibold text-foreground">
              게임
            </Link>
            : 스도쿠, 초성 퀴즈처럼 브라우저에서 바로 하는 작은 게임들이에요. 하나씩 직접 만들었어요.
          </li>
          <li>
            <Link href="/qna" className="marker-link font-semibold text-foreground">
              이야기방
            </Link>
            : 로그인 없이 질문을 남기면 제가 답을 달아요.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <SheetHeading color="leaf">글을 쓸 때 지키는 것</SheetHeading>
        <ul className={LIST}>
          <li>기술 이야기는 공식 문서와 발표 자료를 먼저 확인하고 써요.</li>
          <li>전문 용어는 처음 나올 때 쉬운 말로 풀고, 개발자가 아니어도 끝까지 읽히는 글을 목표로 해요.</li>
          <li>써 둔 글에서 바뀐 내용을 발견하면 고치고, 글 위에 고친 날짜를 남겨요.</li>
          <li>틀린 내용을 보셨다면 이야기방에 알려 주세요. 확인하고 바로 고칠게요.</li>
        </ul>
      </section>

      <section className="mt-12">
        <SheetHeading color="rose">더 알고 싶다면</SheetHeading>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          요즘 무엇을 하고 있는지는{" "}
          <Link href="/now" className="marker-link text-foreground">
            요즘
          </Link>
          에, 매일 쓰는 기기와 도구는{" "}
          <Link href="/uses" className="marker-link text-foreground">
            쓰는 것들
          </Link>
          에, 만든 것들은{" "}
          <Link href="/projects" className="marker-link text-foreground">
            프로젝트
          </Link>
          에 정리해 두었어요.
        </p>
      </section>
    </DiaryPage>
  );
}
