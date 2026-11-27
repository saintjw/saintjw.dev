import { getPostsByCategory, type CategoryWithPosts } from "@/lib/tistory";
import { categoryDescriptions } from "@/lib/blogCategories";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";
import BlogBrowser from "@/components/BlogBrowser";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "잡학사전",
  "티스토리 블로그 라이프업 연구소에 쓴 생활 정보 글을 데스크케어, 러닝, IT 전자기기, 여행, 재테크 같은 주제별로 모아 둔 잡학사전이에요.",
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
        <BlogBrowser
          categories={categories}
          descriptions={categoryDescriptions}
          total={total}
        />
      )}
    </DiaryPage>
  );
}
