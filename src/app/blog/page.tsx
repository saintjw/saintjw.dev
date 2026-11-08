import { getPostsByCategory, type CategoryWithPosts } from "@/lib/tistory";
import { categoryDescriptions } from "@/lib/blogCategories";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "블로그",
  "티스토리에 쓴 글들을 주제별로 모아둡니다."
);

export default async function BlogPage() {
  let categories: CategoryWithPosts[] = [];
  try {
    categories = await getPostsByCategory();
  } catch {
    // 아래에서 안내 문구를 보여준다.
  }
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Blog</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        주제별로 모아 본 글
      </h1>
      <p className="mt-3 text-muted">
        <a
          href="https://saintjw.tistory.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border underline-offset-4 hover:text-foreground"
        >
          티스토리
        </a>
        에 쓴 글을 주제별로 정리했어요.
        {total > 0 && <> 지금까지 {total.toLocaleString()}편을 썼습니다.</>}
      </p>

      {categories.length === 0 ? (
        <p className="mt-12 text-sm text-muted">
          글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      ) : (
        <>
          <nav aria-label="카테고리" className="-mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <ul className="flex gap-2 sm:flex-wrap">
              {categories.map((c) => (
                <li key={c.name}>
                  <a
                    href={`#${c.name}`}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-accent"
                  >
                    {c.name}
                    <span className="font-mono text-xs text-muted">{c.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-14 flex flex-col gap-16">
            {categories.map((c) => (
              <section key={c.name} id={c.name} className="scroll-mt-24">
                <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                      {c.name}
                    </h2>
                    {categoryDescriptions[c.name] && (
                      <p className="mt-1 text-sm text-muted">{categoryDescriptions[c.name]}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted">{c.count}편</span>
                </div>

                <ul>
                  {c.posts.map((post) => (
                    <li key={post.url} className="border-b border-border/60">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline justify-between gap-4 py-3.5"
                      >
                        <span className="text-[15px] text-foreground transition-colors group-hover:text-accent-strong">
                          {post.title}
                        </span>
                        {post.date && (
                          <time className="hidden shrink-0 font-mono text-xs text-muted sm:block">
                            {post.date}
                          </time>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>

                {c.count > c.posts.length && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {c.name} 전체 {c.count}편 보기 →
                  </a>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
