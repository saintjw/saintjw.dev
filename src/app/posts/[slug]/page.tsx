import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/posts";
import { getTopic } from "@/lib/topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: "saintjw", url: "https://saintjw-dev.vercel.app" },
    keywords: post.tags.join(", "),
    ...(post.image && { image: `https://saintjw-dev.vercel.app${post.image}` }),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Link href="/posts" className="text-sm text-muted transition-colors hover:text-foreground">
        ← 글 목록
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        {post.draft && (
          <p className="mb-4 rounded-xl bg-peach px-4 py-2 text-sm text-foreground">
            초안이에요. 로컬에서만 보이고 배포된 사이트에는 나오지 않아요.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          {topic && (
            <Link href={`/posts/topic/${topic.slug}`} className="text-accent-strong hover:underline">
              {topic.name}
            </Link>
          )}
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{post.date}</time>
          {post.updated && <span>(수정 {post.updated})</span>}
          <span aria-hidden>·</span>
          <span>{post.readingMinutes}분 분량</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
      </header>

      <div
        className="prose prose-lg mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.tags.length > 0 && (
        <ul className="mt-12 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-sky px-2.5 py-1 text-xs font-medium text-foreground/80">
              #{tag}
            </li>
          ))}
        </ul>
      )}

      {(newer || older) && (
        <nav aria-label="다른 글" className="mt-14 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
          {older ? (
            <Link href={`/posts/${older.slug}`} className="group rounded-2xl border border-border bg-card p-5 hover:border-accent">
              <span className="text-xs text-muted">← 이전 글</span>
              <p className="mt-1 font-medium text-foreground group-hover:text-accent-strong">{older.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/posts/${newer.slug}`} className="group rounded-2xl border border-border bg-card p-5 text-right hover:border-accent">
              <span className="text-xs text-muted">다음 글 →</span>
              <p className="mt-1 font-medium text-foreground group-hover:text-accent-strong">{newer.title}</p>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
