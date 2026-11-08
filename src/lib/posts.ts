import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { getTopic, type TopicSlug } from "@/lib/topics";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
// 초안(draft: true)은 로컬 개발 서버에서만 보이고 배포된 사이트에는 나오지 않는다.
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  topic: TopicSlug;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  image?: string; // 본문 첫 이미지. SNS 미리보기 이미지로 쓴다.
};

export type Post = PostMeta & { html: string };

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 본문에 섞인 HTML은 실행하지 않고 글자로 보여준다. (자동 작성 글의 안전장치)
const markdown = new Marked({
  gfm: true,
  renderer: {
    html: ({ text }) => escapeHtml(text),
    // 이미지는 캡션(마크다운 title)이 있으면 figure로 감싸고, 늦게 불러오게 한다.
    image: ({ href, title, text }) => {
      const img = `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">`;
      return title
        ? `<figure>${img}<figcaption>${escapeHtml(title)}</figcaption></figure>`
        : img;
    },
  },
});

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toDateString(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return undefined;
}

function parseFile(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const where = `content/posts/${file}`;

  if (!SLUG_RE.test(slug) || slug === "topic") {
    throw new Error(`${where}: 파일 이름은 영문 소문자·숫자·하이픈만 쓸 수 있어요.`);
  }
  for (const key of ["title", "description", "topic"]) {
    if (typeof data[key] !== "string" || !data[key].trim()) {
      throw new Error(`${where}: frontmatter에 '${key}'가 필요해요.`);
    }
  }
  const date = toDateString(data.date);
  if (!date || !DATE_RE.test(date)) {
    throw new Error(`${where}: date는 YYYY-MM-DD 형식이어야 해요.`);
  }
  if (!getTopic(data.topic)) {
    throw new Error(`${where}: 알 수 없는 topic '${data.topic}'. src/lib/topics.ts를 확인하세요.`);
  }

  const chars = content.replace(/\s/g, "").length;
  const firstImage = content.match(/!\[[^\]]*\]\((\/[^)\s]+)/)?.[1];
  return {
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    date,
    updated: toDateString(data.updated),
    topic: data.topic as TopicSlug,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingMinutes: Math.max(1, Math.round(chars / 500)),
    image: firstImage,
    html: markdown.parse(content) as string,
  };
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  if (cache && !SHOW_DRAFTS) return cache;
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))
    : [];
  const posts = files
    .map(parseFile)
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  cache = posts;
  return posts;
}

function stripBody(post: Post): PostMeta {
  const meta: Partial<Post> = { ...post };
  delete meta.html;
  return meta as PostMeta;
}

export function getAllPosts(): PostMeta[] {
  return loadAll().map(stripBody);
}

export function getPostsByTopic(topic: string): PostMeta[] {
  return getAllPosts().filter((p) => p.topic === topic);
}

export function getPost(slug: string): Post | undefined {
  return loadAll().find((p) => p.slug === slug);
}
