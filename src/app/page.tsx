import Link from "next/link";
import type { Metadata } from "next";
import { RSS_ALTERNATE } from "@/lib/metadata";
import {
  getCategories,
  getLatestPosts,
  type TistoryCategory,
  type TistoryPost,
} from "@/lib/tistory";
import { categoryDescriptions } from "@/lib/blogCategories";
import { games } from "@/lib/games";
import { getAllPosts } from "@/lib/posts";
import { getTopic, topics } from "@/lib/topics";
import {
  DateStamp,
  IndexTabs,
  SheetHeading,
  Tape,
  diaryDate,
  type TabColor,
} from "@/components/Diary";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/", types: RSS_ALTERNATE },
};

// 포스트잇 메모: 색과 기울기를 조금씩 다르게 붙인다.
const notes = [
  {
    href: "/games",
    title: "게임",
    body: `틈틈이 만든 작은 웹 게임 ${games.length}개. 반응속도부터 슈팅까지.`,
    cta: "한 판 하기",
    bg: "var(--peach)",
    tilt: "-1.6deg",
  },
  {
    href: "/now",
    title: "요즘",
    body: "지금 쓰고, 만들고, 준비하는 것들. 한 달에 한 번쯤 고쳐요.",
    cta: "근황 보기",
    bg: "var(--mint)",
    tilt: "1.2deg",
  },
  {
    href: "/projects",
    title: "프로젝트",
    body: "이 사이트를 비롯해 직접 만들어 본 것들을 모아둡니다.",
    cta: "둘러보기",
    bg: "var(--sky)",
    tilt: "-0.8deg",
  },
  {
    href: "/uses",
    title: "쓰는 것들",
    body: "매일 쓰는 기기와 도구, 서비스를 모아둡니다.",
    cta: "구경하기",
    bg: "var(--pink)",
    tilt: "1.8deg",
  },
];

export default async function Home() {
  const [categories, posts] = await Promise.all([
    getCategories().catch(() => [] as TistoryCategory[]),
    getLatestPosts(5).catch(() => [] as TistoryPost[]),
  ]);
  const total = categories.reduce((sum, c) => sum + c.count, 0);
  // 글이 1~2편뿐인 카테고리는 대문에서는 빼고 블로그 페이지에서만 보여준다.
  const blogTopics = categories.filter((c) => c.count >= 5);
  const sitePosts = getAllPosts().slice(0, 3);
  const latest = sitePosts[0];

  const tabs = [
    ...topics.map((t) => ({
      href: `/posts/topic/${t.slug}`,
      label: t.name,
      color: t.tab as TabColor,
    })),
    { href: "/blog", label: "잡학사전", color: "rose" as TabColor },
  ];

  return (
    <div className="mx-auto max-w-5xl px-3 pt-8 pb-24 sm:px-6 sm:pt-14 lg:pr-20">
      {/* 오늘의 속지 */}
      <div className="relative">
        <IndexTabs tabs={tabs} label="주제 바로가기" />
        <section className="sheet px-5 pt-10 pb-10 sm:px-12 sm:pt-14 sm:pb-12 lg:px-16">
          <Tape
            color="yellow"
            className="-bottom-3 right-6 w-16 rotate-3 lg:bottom-auto lg:-top-3.5 lg:right-auto lg:left-14 lg:w-[116px] lg:-rotate-3"
          />
          <Tape
            color="blue"
            className="-top-3 right-10 hidden w-20 rotate-6 lg:block"
          />

          {latest && (
            <p className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <DateStamp date={latest.date} color="blue" />
              <span>에 마지막으로 적었어요</span>
            </p>
          )}

          <h1 className="mt-7 break-keep font-display text-[1.85rem] leading-[1.35] text-foreground sm:text-[3.2rem] sm:leading-[1.25]">
            호기심 가득한 개인 개발자의{" "}
            <span className="marker whitespace-nowrap">탐구 공간</span>입니다.
          </h1>
          <p className="mt-6 text-lg text-muted sm:text-xl">
            어려운 건 쉽게, 귀찮은 지식은 간단하게
          </p>
          <p className="mt-4 max-w-2xl break-keep text-[13px] leading-relaxed text-muted/90 sm:text-sm">
            <span className="mr-1.5 font-semibold text-foreground/80">Serendipity란?</span>
            뜻밖의 행운, 우연히 소중한 것을 발견하는 일을 말해요. 『세렌디프의 세 왕자』라는 옛이야기에서
            나온 말로, 찾던 것 너머에서 생각지 못한 기쁨을 만나는 순간이죠. 이곳에서 그런 작은 발견을
            만나시길 바라요.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/posts"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              꿀팁 글모음
            </Link>
            <Link
              href="/games"
              className="rounded-full border border-foreground/25 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground hover:bg-accent-soft"
            >
              게임 모음
            </Link>
          </div>

          {sitePosts.length > 0 && (
            <div className="mt-14 border-t border-dashed border-rule pt-10">
              <SheetHeading href="/posts" cta="전체 보기" color="blue">
                새로 쓴 글
              </SheetHeading>
              <ul className="ruled mt-4">
                {sitePosts.map((p) => {
                  const topic = getTopic(p.topic);
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/posts/${p.slug}`}
                        className="group grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[7.5rem_1fr]"
                      >
                        <div>
                          <DateStamp
                            date={p.date}
                            color={topic?.tab ?? "blue"}
                            full={false}
                          />
                        </div>
                        <div>
                          <h3 className="text-[1.1rem] font-bold leading-snug text-foreground">
                            <span className="marker-link">{p.title}</span>
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">
                            {p.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* 블로그 색인 + 최근 글 */}
      {(blogTopics.length > 0 || posts.length > 0) && (
        <section className="sheet mt-16 grid gap-12 px-5 py-10 sm:px-12 sm:py-12 lg:grid-cols-[1fr_1.15fr] lg:px-16">
          <Tape
            color="rose"
            className="-top-3.5 left-1/2 -translate-x-1/2 rotate-2"
          />
          {blogTopics.length > 0 && (
            <div>
              <SheetHeading href="/blog" cta="잡학사전으로" color="rose">
                잡학사전 색인
              </SheetHeading>
              <p className="mt-3 text-sm text-muted">
                티스토리에 쓴 글{" "}
                <span className="tabular font-semibold text-foreground">
                  {total.toLocaleString()}
                </span>
                편을 주제별로 모았어요.
              </p>
              <ul className="mt-5">
                {blogTopics.map((c) => (
                  <li key={c.name}>
                    <Link
                      href={`/blog#${c.name}`}
                      className="group block py-2.5"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="marker-link font-semibold text-foreground">
                          {c.name}
                        </span>
                        <span
                          aria-hidden
                          className="mx-1 flex-1 translate-y-[-0.2em] border-b-2 border-dotted border-rule"
                        />
                        <span className="tabular text-sm text-muted">
                          {c.count}
                        </span>
                      </span>
                      {categoryDescriptions[c.name] && (
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                          {categoryDescriptions[c.name]}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {posts.length > 0 && (
            <div>
              <SheetHeading color="leaf">잡학사전 최근 글</SheetHeading>
              <ul className="ruled mt-5">
                {posts.map((p) => (
                  <li key={p.url}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block py-3.5"
                    >
                      <span className="tabular text-xs text-muted">
                        {/^\d{4}-\d{2}-\d{2}$/.test(p.date)
                          ? `${diaryDate(p.date).full} ${diaryDate(p.date).day}`
                          : p.date}
                        {p.category && <> · {p.category}</>}
                      </span>
                      <span className="mt-1 block text-[15px] leading-snug text-foreground">
                        <span className="marker-link">{p.title}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 포스트잇 */}
      <section className="mt-16" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="sr-only">
          그 밖의 것들
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {notes.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="note group flex h-full flex-col p-5 pb-4 text-foreground"
                style={{ background: n.bg, transform: `rotate(${n.tilt})` }}
              >
                <span className="font-display text-xl">{n.title}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">
                  {n.body}
                </span>
                <span className="mt-4 text-sm font-semibold">
                  <span className="marker-link">{n.cta} →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
