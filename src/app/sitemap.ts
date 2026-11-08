import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { topics } from "@/lib/topics";

const BASE_URL = "https://saintjw-dev.vercel.app";

const routes = [
  "",
  "/posts",
  "/blog",
  "/games",
  "/games/tic-tac-toe",
  "/games/reaction-time",
  "/games/whack-a-mole",
  "/games/sky-fighter",
  "/projects",
  "/guestbook",
  "/now",
  "/uses",
  ...topics.map((t) => `/posts/topic/${t.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
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
  return [...pages, ...posts];
}
