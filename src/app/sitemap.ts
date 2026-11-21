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
  const pages = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
  const posts = getAllPosts()
    .filter((p) => !p.draft)
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
