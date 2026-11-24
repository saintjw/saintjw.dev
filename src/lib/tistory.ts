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

async function fetchText(url: string, revalidate = 3600) {
  const res = await fetch(url, { next: { revalidate } });
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

// ── 잡학사전 전체 검색용 색인 ──────────────────────────────────────────

/** 검색 색인 한 줄. 내려보내는 크기를 줄이려고 키를 한 글자로 쓴다. */
export type SearchEntry = { t: string; u: string; d: string; c: string };

const ONE_DAY = 86400;

/** "2026. 11. 24." → "2026-11-24" */
function dotDate(text: string): string {
  const m = text.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  return m ? `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` : "";
}

const stripTags = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, "")).trim();

/** 카테고리 목록 페이지 한 장에서 글(주소·제목·날짜)을 읽는다. */
function parseListPage(html: string, category: string): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const block of html.split('<div class="post-item">').slice(1)) {
    const href = block.match(/<a href="(\/\d+)"/)?.[1];
    const title = block.match(/<span class="title">([\s\S]*?)<\/span>/)?.[1];
    if (!href || !title) continue;
    const date = block.match(/<span class="date">([\s\S]*?)<\/span>/)?.[1] ?? "";
    out.push({ t: stripTags(title), u: `${BLOG_URL}${href}`, d: dotDate(date), c: category });
  }
  return out;
}

/** 동시에 limit개씩만 요청한다. 실패한 장은 건너뛴다. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: (R | undefined)[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]).catch(() => undefined);
      }
    }),
  );
  return results.filter((r): r is R => r !== undefined);
}

/**
 * 티스토리 글 전체(제목·주소·날짜·카테고리) 색인.
 * 카테고리 목록 페이지를 끝까지 넘겨 읽는다. 새 글이 쌓이는 첫 장과 RSS는 1시간,
 * 뒤쪽 장은 하루 동안 캐시한다. 새 글이 밀려 뒷장이 하루 늦게 갱신돼도
 * 최근 글은 RSS(최신 50편)로 채워지므로 빠지지 않는다.
 */
export async function getSearchIndex(): Promise<SearchEntry[]> {
  const [categories, recent] = await Promise.all([
    getCategories(),
    getLatestPosts(50).catch(() => [] as TistoryPost[]),
  ]);

  const firstPages = await mapLimit(categories, 4, async (c) => {
    const html = await fetchText(c.url, 3600);
    const posts = parseListPage(html, c.name);
    const perPage = Math.max(posts.length, 1);
    return { c, posts, pages: Math.ceil(c.count / perPage) };
  });

  const rest = firstPages.flatMap(({ c, pages }) =>
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ c, page: i + 2 })),
  );
  const restPosts = await mapLimit(rest, 6, async ({ c, page }) =>
    parseListPage(await fetchText(`${c.url}?page=${page}`, ONE_DAY), c.name),
  );

  const byUrl = new Map<string, SearchEntry>();
  for (const p of recent) {
    if (!p.url.startsWith(BLOG_URL)) continue;
    byUrl.set(p.url, { t: p.title, u: p.url, d: p.date, c: p.category ?? "" });
  }
  for (const p of [...firstPages.flatMap((f) => f.posts), ...restPosts.flat()]) {
    if (!byUrl.has(p.u)) byUrl.set(p.u, p);
  }
  return [...byUrl.values()].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
}
