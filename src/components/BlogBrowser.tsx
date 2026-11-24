"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { CategoryWithPosts } from "@/lib/tistory";
import { SheetHeading, tabVar, type TabColor } from "@/components/Diary";

const SECTION_COLORS: TabColor[] = ["yellow", "leaf", "blue", "rose"];
const ALL = "__all__";

const tabInk = (c: TabColor) =>
  c === "blue" ? "var(--tab-blue-ink)" : "var(--tab-ink)";

type Props = {
  categories: CategoryWithPosts[];
  descriptions: Record<string, string>;
  total: number;
};

/**
 * 잡학사전 목록. 바인더 칸막이 같은 탭으로 카테고리를 고르고,
 * 줄 노트 검색칸으로 불러온 글 제목을 거른다. 선택한 탭은 주소의 #카테고리에 남는다.
 * 처음 그릴 때(서버)는 '전체'라서 모든 글 링크가 HTML에 그대로 들어간다.
 */
export default function BlogBrowser({ categories, descriptions, total }: Props) {
  const [active, setActive] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const searchId = useId();

  const colorOf = useMemo(() => {
    const map = new Map<string, TabColor>();
    categories.forEach((c, i) =>
      map.set(c.name, SECTION_COLORS[i % SECTION_COLORS.length]),
    );
    return map;
  }, [categories]);

  // 주소의 #카테고리로 들어오면 그 탭을 연다. (기존 목차 링크와 호환)
  useEffect(() => {
    const fromHash = () => {
      const name = decodeURIComponent(window.location.hash.slice(1));
      if (categories.some((c) => c.name === name)) setActive(name);
      else if (!name) setActive(ALL);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [categories]);

  const choose = (name: string) => {
    setActive(name);
    const url =
      name === ALL
        ? window.location.pathname + window.location.search
        : `#${encodeURIComponent(name)}`;
    window.history.replaceState(null, "", url);
  };

  const q = query.trim().toLowerCase();
  const pool =
    active === ALL ? categories : categories.filter((c) => c.name === active);
  const matches = q
    ? pool.flatMap((c) =>
        c.posts
          .filter((p) => p.title.toLowerCase().includes(q))
          .map((p) => ({ ...p, category: c.name })),
      )
    : [];
  const loadedCount = pool.reduce((n, c) => n + c.posts.length, 0);

  const tabs = [
    { key: ALL, label: "전체", count: total, color: "rose" as TabColor },
    ...categories.map((c) => ({
      key: c.name,
      label: c.name,
      count: c.count,
      color: colorOf.get(c.name)!,
    })),
  ];

  return (
    <div className="mt-10">
      {/* 칸막이 탭: 고른 탭은 솟아오르고 나머지는 살짝 들어가 있다 */}
      <div
        role="group"
        aria-label="카테고리 고르기"
        className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] sm:overflow-visible"
      >
        <ul className="flex min-w-max items-end gap-1.5 border-b-2 border-foreground/80 sm:min-w-0 sm:flex-wrap">
          {tabs.map((t) => {
            const on = active === t.key;
            return (
              <li key={t.key} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(t.key)}
                  className={`tab flex items-baseline gap-1.5 whitespace-nowrap rounded-t-lg px-3 text-[13px] font-semibold sm:px-3.5 sm:text-sm ${
                    on ? "pt-3 pb-2" : "mt-2 pt-1.5 pb-1.5 hover:mt-0 hover:pt-3"
                  }`}
                  style={
                    on
                      ? { background: tabVar(t.color), color: tabInk(t.color) }
                      : {
                          // 고르지 않은 탭은 색을 옅게 풀어 잉크 글자로: 고른 탭만 진하게 선다
                          background: `color-mix(in srgb, ${tabVar(t.color)} 32%, var(--card))`,
                          color: "var(--foreground)",
                        }
                  }
                >
                  {t.label}
                  <span className="tabular text-xs font-medium opacity-75">
                    {t.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 줄 노트 검색칸 */}
      <div className="mt-6 flex items-center gap-3 border-b border-dashed border-rule pb-2 transition-colors focus-within:border-solid focus-within:border-foreground/70">
        <label htmlFor={searchId} className="shrink-0 text-sm text-muted">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <circle cx="10.5" cy="10.5" r="6" />
            <path d="m15 15 5 5" />
          </svg>
          <span className="sr-only">글 제목에서 찾기</span>
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            active === ALL
              ? "최근 글 제목에서 찾기 (예: 모니터, 연말정산)"
              : `${active} 최근 글에서 찾기`
          }
          className="ruled-input min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-foreground placeholder:text-muted/70"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="marker-link shrink-0 text-sm text-muted hover:text-foreground"
          >
            지우기
          </button>
        )}
      </div>

      <div aria-live="polite">
        {q ? (
          <SearchResults
            query={query.trim()}
            matches={matches}
            loadedCount={loadedCount}
            colorOf={colorOf}
          />
        ) : (
          <div className="mt-12 flex flex-col gap-16">
            {pool.map((c) => (
              <CategorySection
                key={c.name}
                category={c}
                color={colorOf.get(c.name)!}
                description={descriptions[c.name]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category: c,
  color,
  description,
}: {
  category: CategoryWithPosts;
  color: TabColor;
  description?: string;
}) {
  return (
    <section aria-label={c.name}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <SheetHeading color={color}>{c.name}</SheetHeading>
          {description && (
            <p className="mt-2 text-sm text-muted">{description}</p>
          )}
        </div>
        <span className="tabular shrink-0 text-sm text-muted">{c.count}편</span>
      </div>

      <PostRows posts={c.posts} />

      {c.count > c.posts.length && (
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="marker-link mt-4 inline-block text-sm text-muted hover:text-foreground"
        >
          {c.name} 전체 {c.count}편 보기 →
        </a>
      )}
    </section>
  );
}

function PostRows({
  posts,
  label,
}: {
  posts: { title: string; url: string; date: string; category?: string | null }[];
  label?: (category: string) => React.ReactNode;
}) {
  return (
    <ul className="ruled mt-4 border-t border-dashed border-rule">
      {posts.map((post) => (
        <li key={post.url}>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline justify-between gap-4 py-3.5"
          >
            <span className="text-[15px] leading-snug text-foreground">
              {label && post.category && label(post.category)}
              <span className="marker-link">{post.title}</span>
            </span>
            {post.date && (
              <time className="tabular hidden shrink-0 text-xs text-muted sm:block">
                {post.date}
              </time>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SearchResults({
  query,
  matches,
  loadedCount,
  colorOf,
}: {
  query: string;
  matches: { title: string; url: string; date: string; category: string }[];
  loadedCount: number;
  colorOf: Map<string, TabColor>;
}) {
  return (
    <div className="mt-8">
      <p className="text-sm text-muted">
        최근 글 <span className="tabular">{loadedCount}</span>편 중 ‘
        <span className="font-semibold text-foreground">{query}</span>’이(가)
        들어간 글{" "}
        <span className="tabular font-semibold text-foreground">
          {matches.length}
        </span>
        편
      </p>
      {matches.length > 0 ? (
        <PostRows
          posts={matches}
          label={(category) => (
            <span className="mr-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
              <span
                aria-hidden
                className="inline-block h-2 w-2 -rotate-6 rounded-[2px]"
                style={{ background: tabVar(colorOf.get(category) ?? "rose") }}
              />
              {category}
            </span>
          )}
        />
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
          최근 글에는 없어요. 오래된 글은{" "}
          <a
            href={`https://saintjw.tistory.com/search/${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="marker-link font-semibold text-foreground"
          >
            티스토리 검색
          </a>
          에서 찾아보세요.
        </p>
      )}
    </div>
  );
}
