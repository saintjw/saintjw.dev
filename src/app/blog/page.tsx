import { getLatestPosts } from "@/lib/tistory";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "블로그",
  "티스토리에 쓴 글들을 최신순으로 모아둡니다."
);

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getLatestPosts>> = [];
  let loadError = false;

  try {
    posts = await getLatestPosts(10);
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">블로그</h1>
      <p className="mt-3 text-muted">
        <a
          href="https://saintjw.tistory.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          티스토리
        </a>
        에 쓴 글들을 최신순으로 모아둡니다.
      </p>

      {loadError && (
        <p className="mt-10 text-sm text-muted">
          글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      <ul className="mt-10 flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.url}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5 hover:border-accent"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                {post.category && (
                  <span className="rounded-full bg-sky px-2.5 py-1 font-medium text-foreground/80">
                    {post.category}
                  </span>
                )}
                {post.date && <time>{post.date}</time>}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">
                {post.title}
              </h2>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
