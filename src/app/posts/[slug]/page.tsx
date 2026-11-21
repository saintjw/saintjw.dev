import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/posts";
import type { CSSProperties } from "react";
import { getTopic, topics } from "@/lib/topics";
import { topicCounts } from "@/components/PostList";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { RSS_ALTERNATE, SITE_URL } from "@/lib/metadata";
import {
  DateStamp,
  IndexTabs,
  Tape,
  diaryDate,
  tabVar,
  type TabColor,
} from "@/components/Diary";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}`, types: RSS_ALTERNATE },
    openGraph: {
      type: "article",
      url: `/posts/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      ...(post.image && { images: [post.image] }),
    },
    twitter: {
      title: post.title,
      description: post.description,
      ...(post.image && { images: [post.image] }),
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const topic = getTopic(post.topic);

  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === post.slug);
  const newer = i > 0 ? all[i - 1] : undefined;
  const older = i < all.length - 1 ? all[i + 1] : undefined;

  const postUrl = `${SITE_URL}/posts/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#post`,
        mainEntityOfPage: postUrl,
        url: postUrl,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "ko-KR",
        author: { "@type": "Person", "@id": `${SITE_URL}/#author`, name: "saintjw", url: SITE_URL },
        publisher: { "@id": `${SITE_URL}/#author` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        keywords: post.tags.join(", "),
        ...(topic && { articleSection: topic.name }),
        ...(post.image && { image: `${SITE_URL}${post.image}` }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "탐구노트", item: `${SITE_URL}/posts` },
          ...(topic
            ? [{ "@type": "ListItem", position: 3, name: topic.name, item: `${SITE_URL}/posts/topic/${topic.slug}` }]
            : []),
          { "@type": "ListItem", position: topic ? 4 : 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  const color: TabColor = topic?.tab ?? "blue";
  const counts = topicCounts(all);
  const tabs = topics.map((t) => ({
    href: `/posts/topic/${t.slug}`,
    label: t.name,
    color: t.tab,
    count: counts[t.slug] ?? 0,
    active: t.slug === post.topic,
  }));

  return (
    <article className="mx-auto max-w-[56rem] px-3 pt-8 pb-20 sm:px-6 sm:pt-12 lg:pr-16">
      <JsonLd data={jsonLd} />

      <Link
        href="/posts"
        className="marker-link ml-1 text-sm text-muted hover:text-foreground"
      >
        ← 글 목록
      </Link>

      <div className="relative mt-5">
        <IndexTabs tabs={tabs} label="주제" />
        <div
          className="sheet px-5 pt-10 pb-10 sm:px-12 sm:pt-14 sm:pb-14 lg:px-16"
          style={{ "--topic": tabVar(color) } as CSSProperties}
        >
          <Tape
            color={color}
            className="-top-3 right-4 w-14 rotate-6 lg:-top-3.5 lg:right-auto lg:left-14 lg:w-[116px] lg:-rotate-3"
          />

          <header className="border-b border-dashed border-rule pb-8">
            {post.draft && (
              <p className="mb-5 rounded-lg bg-peach px-4 py-2 text-sm text-foreground">
                초안이에요. 로컬에서만 보이고 배포된 사이트에는 나오지 않아요.
              </p>
            )}
            <DateStamp date={post.date} color={color} />
            <h1 className="mt-6 text-[1.75rem] font-extrabold leading-[1.3] tracking-[-0.02em] text-balance text-foreground sm:text-[2.4rem]">
              {post.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
              {topic && (
                <Link
                  href={`/posts/topic/${topic.slug}`}
                  className="marker-link font-semibold text-foreground"
                >
                  {topic.name}
                </Link>
              )}
              <span aria-hidden>·</span>
              <span className="tabular">{post.readingMinutes}분 분량</span>
              {post.updated && (
                <>
                  <span aria-hidden>·</span>
                  <span className="tabular">
                    {diaryDate(post.updated).full} 고침
                  </span>
                </>
              )}
            </p>
            <p className="mt-5 text-[1.075rem] leading-[1.8] text-muted sm:text-lg">
              {post.description}
            </p>
          </header>

          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

          <div
            className="prose prose-lg mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-muted">
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}

          {(newer || older) && (
            <nav
              aria-label="다른 글"
              className="mt-12 grid gap-6 border-t border-dashed border-rule pt-8 sm:grid-cols-2"
            >
              {older ? (
                <Link href={`/posts/${older.slug}`} className="group block">
                  <span className="text-sm text-muted">← 앞 장</span>
                  <p className="mt-1.5 font-semibold leading-snug text-foreground">
                    <span className="marker-link">{older.title}</span>
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/posts/${newer.slug}`}
                  className="group block sm:text-right"
                >
                  <span className="text-sm text-muted">다음 장 →</span>
                  <p className="mt-1.5 font-semibold leading-snug text-foreground">
                    <span className="marker-link">{newer.title}</span>
                  </p>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
