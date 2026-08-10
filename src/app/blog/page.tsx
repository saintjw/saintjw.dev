import { posts } from "@/lib/posts";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">블로그</h1>
      <p className="mt-3 text-muted">
        여러 곳에 쓴 글들을 이곳에 모아둡니다.
      </p>

      <ul className="mt-10 flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.title}>
            <a
              href={post.url}
              className="block rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5 hover:border-accent"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-sky px-2.5 py-1 font-medium text-foreground/80">
                  {post.tag}
                </span>
                <time>{post.date}</time>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">
                {post.title}
              </h2>
              <p className="mt-1.5 text-sm text-muted">{post.excerpt}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
