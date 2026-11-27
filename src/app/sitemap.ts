import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { topics } from "@/lib/topics";
import { isStoreReady, listPublicQuestions } from "@/lib/qna";

const BASE_URL = "https://saintjw.dev";

const routes = [
  "",
  "/posts",
  "/blog",
  "/games",
  "/games/tic-tac-toe",
  "/games/reaction-time",
  "/games/whack-a-mole",
  "/games/sky-fighter",
  "/games/sudoku",
  "/games/memory-match",
  "/games/chosung-quiz",
  "/projects",
  "/qna",
  "/now",
  "/uses",
  "/privacy",
  ...topics.map((t) => `/posts/topic/${t.slug}`),
];

// 새로 답한 질문도 사이트맵에 올라가게 한 시간마다 다시 만든다.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = getAllPosts().filter((p) => !p.draft);
  // 글 목록이 담긴 페이지만 가장 최근 글 날짜를 쓴다. 나머지 고정 페이지는 빌드 시각을
  // 넣으면 매번 "수정됨"으로 보여 구글이 lastmod를 믿지 않게 되므로 아예 뺀다.
  const latest = published.reduce<string | undefined>((m, p) => {
    const d = p.updated ?? p.date;
    return !m || d > m ? d : m;
  }, undefined);
  const listing = new Set(["", "/posts", ...topics.map((t) => `/posts/topic/${t.slug}`)]);
  const pages = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    ...(listing.has(route) && latest ? { lastModified: new Date(latest) } : {}),
  }));
  const posts = published
    .map((p) => ({
      url: `${BASE_URL}/posts/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
    }));
  let questions: MetadataRoute.Sitemap = [];
  try {
    if (isStoreReady()) {
      questions = (await listPublicQuestions()).map((q) => ({
        url: `${BASE_URL}/qna/${q.id}`,
        lastModified: new Date(q.answeredAt ?? q.createdAt),
      }));
    }
  } catch {
    // 저장소에 닿지 못해도 사이트맵 전체가 깨지지 않게 질문만 뺀다.
  }
  return [...pages, ...posts, ...questions];
}
