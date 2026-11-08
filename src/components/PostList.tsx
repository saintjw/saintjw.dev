import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { getTopic, topics } from "@/lib/topics";

export function TopicChips({ active, counts }: { active?: string; counts: Record<string, number> }) {
  const chip =
    "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors";
  return (
    <nav aria-label="주제" className="-mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 sm:flex-wrap">
        <li>
          <Link
            href="/posts"
            className={`${chip} ${!active ? "border-accent bg-accent-soft text-foreground" : "border-border bg-card text-foreground hover:border-accent"}`}
          >
            전체
          </Link>
        </li>
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/posts/topic/${t.slug}`}
              className={`${chip} ${active === t.slug ? "border-accent bg-accent-soft text-foreground" : "border-border bg-card text-foreground hover:border-accent"}`}
            >
              {t.name}
              <span className="font-mono text-xs text-muted">{counts[t.slug] ?? 0}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="mt-12 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
        아직 공개한 글이 없어요. 곧 채워질 예정입니다.
      </p>
    );
  }
  return (
    <ul className="mt-10 border-t border-border">
      {posts.map((p) => (
        <li key={p.slug} className="border-b border-border/60">
          <Link href={`/posts/${p.slug}`} className="group block py-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
              <time dateTime={p.date}>{p.date}</time>
              <span aria-hidden>·</span>
              <span>{getTopic(p.topic)?.name}</span>
              {p.draft && (
                <span className="rounded-full bg-peach px-2 py-0.5 font-sans text-[11px] font-semibold text-foreground">
                  초안
                </span>
              )}
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent-strong">
              {p.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function topicCounts(posts: PostMeta[]) {
  return posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.topic] = (acc[p.topic] ?? 0) + 1;
    return acc;
  }, {});
}
