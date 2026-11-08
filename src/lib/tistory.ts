export type TistoryPost = {
  title: string;
  url: string;
  date: string;
  category: string | null;
};

export type TistoryCategory = {
  name: string; // "::" 장식을 뗀 표시용 이름
  count: number;
  url: string;
};

export type CategoryWithPosts = TistoryCategory & { posts: TistoryPost[] };

const BLOG_URL = "https://saintjw.tistory.com";
const FEED_URL = `${BLOG_URL}/rss`;
const REVALIDATE = { next: { revalidate: 3600 } };

const NAMED_ENTITIES: Record<string, string> = {
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  middot: "·",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  amp: "&",
};

// RSS는 "&amp;middot;"처럼 이중 인코딩된 경우가 있어 바뀌지 않을 때까지 반복한다.
function decodeEntities(text: string) {
  let prev: string;
  let out = text;
  do {
    prev = out;
    out = out.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code: string) => {
      if (code[0] === "#") {
        const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isNaN(n) ? m : String.fromCodePoint(n);
      }
      return NAMED_ENTITIES[code.toLowerCase()] ?? m;
    });
  } while (out !== prev);
  return out;
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
  // 한국시간 기준 YYYY-MM-DD (sv-SE 로캘이 ISO 형식으로 출력됨)
  return parsed.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

const cleanCategory = (raw: string) => raw.replace(/::/g, "").trim();

async function fetchText(url: string) {
  const res = await fetch(url, REVALIDATE);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

export async function getLatestPosts(limit = 10): Promise<TistoryPost[]> {
  const xml = await fetchText(FEED_URL);
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items.slice(0, limit).map((block) => {
    const category = extractTag(block, "category");
    return {
      title: extractTag(block, "title") ?? "제목 없음",
      url: extractTag(block, "link") ?? "#",
      date: formatDate(extractTag(block, "pubDate")),
      category: category ? cleanCategory(category) : null,
    };
  });
}

/** 블로그 사이드바의 카테고리 목록(이름·글 수)을 글 수가 많은 순으로 가져온다. */
export async function getCategories(): Promise<TistoryCategory[]> {
  const html = await fetchText(BLOG_URL);
  const seen = new Map<string, TistoryCategory>();
  const re = /href="\/category\/([^"?#]+)"[^>]*>([\s\S]{0,300}?)<\/a>/g;
  for (const m of html.matchAll(re)) {
    const text = m[2].replace(/<[^>]+>/g, " ");
    const count = text.match(/\((\d+)\)/);
    if (!count) continue;
    const name = cleanCategory(decodeURIComponent(m[1]));
    if (!name || seen.has(name)) continue;
    seen.set(name, { name, count: Number(count[1]), url: `${BLOG_URL}/category/${m[1]}` });
  }
  return [...seen.values()].sort((a, b) => b.count - a.count);
}

/** 카테고리 페이지에 티스토리가 넣어주는 JSON-LD에서 최신 글(최대 6개)을 읽는다. */
async function getCategoryPosts(category: TistoryCategory): Promise<TistoryPost[]> {
  const html = await fetchText(category.url);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (data["@type"] !== "BreadcrumbList") continue;
      return (data.itemListElement ?? []).map(
        (el: { item: { "@id": string; name: string } }) => ({
          title: decodeEntities(el.item.name),
          url: el.item["@id"],
          date: "",
          category: category.name,
        })
      );
    } catch {
      // 다른 JSON-LD 블록이면 무시
    }
  }
  return [];
}

/** 카테고리별 최신 글 묶음. 날짜는 RSS에 있는 글만 채운다. */
export async function getPostsByCategory(): Promise<CategoryWithPosts[]> {
  const [categories, recent] = await Promise.all([
    getCategories(),
    getLatestPosts(50).catch(() => [] as TistoryPost[]),
  ]);
  const dates = new Map(recent.map((p) => [p.url, p.date]));

  return Promise.all(
    categories.map(async (c) => {
      const posts = await getCategoryPosts(c).catch(() => []);
      return { ...c, posts: posts.map((p) => ({ ...p, date: dates.get(p.url) ?? "" })) };
    })
  );
}
