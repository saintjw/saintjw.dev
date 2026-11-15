import Link from "next/link";
import type { ReactNode } from "react";
import type { PostMeta } from "@/lib/posts";
import { getTopic, topics } from "@/lib/topics";
import {
  DateStamp,
  IndexTabs,
  SheetHeading,
  Tape,
  type TabColor,
} from "@/components/Diary";

/** 글 목록 속지: 오른쪽에 주제 인덱스 탭이 꽂히고, 안쪽에 제목과 소개가 들어간다. */
export function PostsSheet({
  active,
  counts,
  title,
  intro,
  children,
}: {
  active?: string;
  counts: Record<string, number>;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const color: TabColor = (active && getTopic(active)?.tab) || "rose";
  const tabs = [
    {
      href: "/posts",
      label: "전체",
      color: "rose" as TabColor,
      count: total,
      active: !active,
    },
    ...topics.map((t) => ({
      href: `/posts/topic/${t.slug}`,
      label: t.name,
      color: t.tab as TabColor,
      count: counts[t.slug] ?? 0,
      active: active === t.slug,
    })),
  ];
  return (
    <div className="mx-auto max-w-[56rem] px-3 pt-10 pb-20 sm:px-6 sm:pt-14 lg:pr-16">
      <div className="relative">
        <IndexTabs tabs={tabs} label="주제" />
        <div className="sheet px-5 pt-10 pb-8 sm:px-12 sm:pt-14 sm:pb-12">
          <Tape
            color={color}
            className="-top-3.5 left-14 hidden -rotate-2 lg:block"
          />
          <SheetHeading as="h1" color={color}>
            {title}
          </SheetHeading>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{intro}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
        아직 이 칸은 비어 있어요. 곧 채워 넣을게요.
      </p>
    );
  }
  return (
    <ul className="ruled mt-8 border-t border-dashed border-rule">
      {posts.map((p) => {
        const topic = getTopic(p.topic);
        return (
          <li key={p.slug}>
            <Link
              href={`/posts/${p.slug}`}
              className="group grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[7.5rem_1fr]"
            >
              <div className="flex items-start gap-2 sm:flex-col sm:gap-2.5">
                <DateStamp
                  date={p.date}
                  color={topic?.tab ?? "blue"}
                  full={false}
                />
                {p.draft && (
                  <span className="rounded bg-peach px-2 py-0.5 text-[11px] font-semibold text-foreground">
                    초안
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold leading-snug tracking-[-0.01em] text-foreground">
                  <span className="marker-link">{p.title}</span>
                </h2>
                <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">
                  {p.description}
                </p>
                {topic && (
                  <p className="mt-2 text-xs font-semibold text-muted">
                    {topic.name}
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function topicCounts(posts: PostMeta[]) {
  return posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.topic] = (acc[p.topic] ?? 0) + 1;
    return acc;
  }, {});
}
