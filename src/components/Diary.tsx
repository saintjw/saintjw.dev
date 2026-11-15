import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// 다이어리 속지에 쓰는 작은 부품들: 색 인덱스 탭, 날짜 도장, 마스킹테이프.

export type TabColor = "yellow" | "leaf" | "blue" | "rose";

export const tabVar = (c: TabColor) => `var(--tab-${c})`;
const tabInk = (c: TabColor) =>
  c === "blue" ? "var(--tab-blue-ink)" : "var(--tab-ink)";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** "2026-11-15" → { short: "11. 15", full: "2026. 11. 15", day: "토" } */
export function diaryDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const day = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return { short: `${mm}. ${dd}`, full: `${y}. ${mm}. ${dd}`, day };
}

export function DateStamp({
  date,
  color = "blue",
  full = true,
  className = "",
}: {
  date: string;
  color?: TabColor;
  full?: boolean;
  className?: string;
}) {
  const d = diaryDate(date);
  return (
    <time
      dateTime={date}
      className={`stamp text-sm ${className}`}
      style={{ color: color === "yellow" ? "#c98a12" : tabVar(color) }}
    >
      {full ? d.full : d.short}
      <span className="text-xs">{d.day}</span>
    </time>
  );
}

export function Tape({
  color = "yellow",
  className = "",
}: {
  color?: TabColor;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`tape ${className}`}
      style={{ "--tape": tabVar(color) } as CSSProperties}
    />
  );
}

export type IndexTab = {
  href: string;
  label: string;
  color: TabColor;
  count?: number;
  active?: boolean;
};

/**
 * 속지 오른쪽 가장자리에 꽂힌 색 인덱스 탭.
 * 넓은 화면(lg)에서는 세로로 튀어나오고, 좁은 화면에서는 속지 위쪽에 가로로 줄 선다.
 * 부모(.sheet)가 relative여야 한다.
 */
export function IndexTabs({
  tabs,
  label,
}: {
  tabs: IndexTab[];
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="-mb-px overflow-x-auto lg:absolute lg:top-14 lg:left-full lg:mb-0 lg:overflow-visible"
    >
      <ul className="flex gap-1.5 px-3 lg:flex-col lg:gap-2 lg:px-0">
        {tabs.map((t) => (
          <li key={t.href} className="shrink-0">
            <Link
              href={t.href}
              aria-current={t.active ? "page" : undefined}
              className={`tab flex items-center gap-1.5 whitespace-nowrap rounded-t-lg px-3.5 text-sm font-semibold lg:rounded-t-none lg:rounded-r-lg lg:px-0 lg:py-4 lg:[writing-mode:vertical-rl] lg:[text-orientation:upright] lg:tracking-[-0.12em] ${
                t.active
                  ? "pt-2.5 pb-2 lg:w-12 lg:translate-x-0"
                  : "mt-1.5 pt-1.5 pb-1.5 opacity-90 hover:mt-0 hover:pt-3 hover:opacity-100 lg:mt-0 lg:w-10 lg:-translate-x-1 lg:hover:mt-0 lg:hover:translate-x-1 lg:hover:pt-4 focus-visible:opacity-100"
              }`}
              style={{ background: tabVar(t.color), color: tabInk(t.color) }}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="tabular text-xs font-medium opacity-75 lg:hidden">
                  {t.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 섹션 제목: 고운돋움 + 작은 테이프 조각 */
export function SheetHeading({
  children,
  href,
  cta,
  color = "yellow",
  as: Tag = "h2",
}: {
  children: ReactNode;
  href?: string;
  cta?: string;
  color?: TabColor;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <Tag className="relative font-display text-2xl text-foreground sm:text-[1.7rem]">
        <span
          aria-hidden
          className="absolute -left-2 top-1/2 -z-0 h-3 w-[calc(100%+1rem)] -translate-y-0.5 -rotate-1 opacity-40"
          style={{ background: tabVar(color) }}
        />
        <span className="relative">{children}</span>
      </Tag>
      {href && cta && (
        <Link
          href={href}
          className="marker-link shrink-0 text-sm text-muted hover:text-foreground"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

/**
 * 일반 페이지용 속지 한 장: 테이프, 제목, 소개, 본문.
 * tabs를 주면 오른쪽 가장자리에 인덱스 탭이 꽂힌다.
 */
export function DiaryPage({
  title,
  intro,
  color = "yellow",
  tabs,
  tabsLabel = "바로가기",
  back,
  stamp,
  wide = false,
  children,
}: {
  title: string;
  intro?: ReactNode;
  color?: TabColor;
  tabs?: IndexTab[];
  tabsLabel?: string;
  back?: { href: string; label: string };
  stamp?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`mx-auto px-3 pt-8 pb-20 sm:px-6 sm:pt-12 ${wide ? "max-w-5xl" : "max-w-[56rem]"} ${tabs ? "lg:pr-16" : ""}`}
    >
      {back && (
        <Link
          href={back.href}
          className="marker-link ml-1 text-sm text-muted hover:text-foreground"
        >
          ← {back.label}
        </Link>
      )}
      <div className={`relative ${back ? "mt-5" : ""}`}>
        {tabs && <IndexTabs tabs={tabs} label={tabsLabel} />}
        <div className="sheet px-5 pt-10 pb-10 sm:px-12 sm:pt-14 sm:pb-12 lg:px-16">
          <Tape
            color={color}
            className={`-top-3.5 left-14 -rotate-2 ${tabs ? "hidden lg:block" : ""}`}
          />
          {stamp && <div className="mb-6">{stamp}</div>}
          <SheetHeading as="h1" color={color}>
            {title}
          </SheetHeading>
          {intro && (
            <div className="mt-4 max-w-2xl leading-relaxed text-muted">
              {intro}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
