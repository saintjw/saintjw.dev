import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/qna/admin" },
    sitemap: "https://saintjw.dev/sitemap.xml",
  };
}
