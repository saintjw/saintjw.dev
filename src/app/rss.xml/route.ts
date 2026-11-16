import { getAllPosts } from "@/lib/posts";
import { getTopic } from "@/lib/topics";

// 사이트 안에서 쓴 글의 RSS 피드. 네이버 서치어드바이저 등 검색엔진과 구독기에 새 글을 알린다.
// 빌드 때 정적으로 만들어지므로 글이 게시되어 재배포되면 자동으로 갱신된다.
export const dynamic = "force-static";

const SITE_URL = "https://saintjw.dev";
const SITE_TITLE = "은결의 Serendipity";
const SITE_DESCRIPTION = "호기심 가득한 개인 개발자의 탐구 공간. 어려운 건 쉽게, 귀찮은 지식은 간단하게.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 글 날짜(YYYY-MM-DD)를 한국 시간 자정 기준 RFC 822 형식으로 바꾼다.
function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00+09:00`).toUTCString();
}

export function GET() {
  const posts = getAllPosts()
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/posts/${post.slug}`;
      const topic = getTopic(post.topic);
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${toRfc822(post.date)}</pubDate>`,
        topic ? `      <category>${escapeXml(topic.name)}</category>` : "",
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuild = posts[0] ? toRfc822(posts[0].updated ?? posts[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
