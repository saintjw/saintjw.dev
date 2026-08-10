export type TistoryPost = {
  title: string;
  url: string;
  date: string;
  category: string | null;
};

const FEED_URL = "https://saintjw.tistory.com/rss";

function decodeEntities(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return null;
  return decodeEntities(match[1].trim());
}

function formatDate(pubDate: string | null): string {
  if (!pubDate) return "";
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export async function getLatestPosts(limit = 10): Promise<TistoryPost[]> {
  const res = await fetch(FEED_URL, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch RSS feed: ${res.status}`);

  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items.slice(0, limit).map((block) => {
    const category = extractTag(block, "category");
    return {
      title: extractTag(block, "title") ?? "제목 없음",
      url: extractTag(block, "link") ?? "#",
      date: formatDate(extractTag(block, "pubDate")),
      category: category ? category.replace(/::/g, "") : null,
    };
  });
}
