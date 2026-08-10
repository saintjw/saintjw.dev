import type { MetadataRoute } from "next";

const BASE_URL = "https://saintjw-dev.vercel.app";

const routes = [
  "",
  "/blog",
  "/games",
  "/games/tic-tac-toe",
  "/games/reaction-time",
  "/games/whack-a-mole",
  "/games/sky-fighter",
  "/projects",
  "/guestbook",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
