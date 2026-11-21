import { getPostsByCategory, type CategoryWithPosts } from "@/lib/tistory";
import { categoryDescriptions } from "@/lib/blogCategories";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage, SheetHeading, type TabColor } from "@/components/Diary";

const SECTION_COLORS: TabColor[] = ["yellow", "leaf", "blue", "rose"];

export const revalidate = 3600;

export const metadata = pageMetadata(
  "잡학사전",
  "티스토리에 쓴 글들을 주제별로 모아둡니다.",
  "/blog",
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
    <DiaryPage
      wide
      color="rose"
      title="주제별로 모아 본 글"
      intro={
        <p>
          <a
            href="https://saintjw.tistory.com"
            target="_blank"
            rel="noopener noreferrer"
            className="marker-link font-semibold text-foreground"
          >
            티스토리
          </a>
          에 쓴 글을 주제별로 정리했어요.
          {total > 0 && (
            <>
              {" "}
              지금까지{" "}
              <span className="tabular font-semibold text-foreground">
                {total.toLocaleString()}
              </span>
              편을 썼습니다.
            </>
          )}
        </p>
      }
    >
      {categories.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
          글 목록을 불러오지 못했어요. 잠시 후 다시 들러 주세요.
        </p>
      ) : (
        <>
          <nav
            aria-label="카테고리"
            className="mt-10 border-y border-dashed border-rule py-6"
          >
            <ul className="grid gap-x-12 gap-y-1 sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c.name}>
                  <a
                    href={`#${c.name}`}
                    className="group flex items-baseline gap-2 py-1.5"
                  >
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
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-14 flex flex-col gap-16">
            {categories.map((c, i) => (
              <section key={c.name} id={c.name} className="scroll-mt-24">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <SheetHeading
                      color={SECTION_COLORS[i % SECTION_COLORS.length]}
                    >
                      {c.name}
                    </SheetHeading>
                    {categoryDescriptions[c.name] && (
                      <p className="mt-2 text-sm text-muted">
                        {categoryDescriptions[c.name]}
                      </p>
                    )}
                  </div>
                  <span className="tabular shrink-0 text-sm text-muted">
                    {c.count}편
                  </span>
                </div>

                <ul className="ruled mt-4 border-t border-dashed border-rule">
                  {c.posts.map((post) => (
                    <li key={post.url}>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline justify-between gap-4 py-3.5"
                      >
                        <span className="text-[15px] leading-snug text-foreground">
                          <span className="marker-link">{post.title}</span>
                        </span>
                        {post.date && (
                          <time className="tabular hidden shrink-0 text-xs text-muted sm:block">
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
                    className="marker-link mt-4 inline-block text-sm text-muted hover:text-foreground"
                  >
                    {c.name} 전체 {c.count}편 보기 →
                  </a>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </DiaryPage>
  );
}
