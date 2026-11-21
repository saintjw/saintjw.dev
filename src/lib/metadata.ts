import type { Metadata } from "next";

export const SITE_URL = "https://saintjw.dev";
export const SITE_NAME = "은결의 Serendipity";

// 하위 페이지가 alternates를 정하면 레이아웃의 alternates를 통째로 덮어쓴다.
// 그래서 RSS 링크를 여기서도 같이 넣어 둔다.
export const RSS_ALTERNATE = {
  "application/rss+xml": [{ url: "/rss.xml", title: "은결의 Serendipity 탐구노트" }],
};

/** 페이지 공통 메타데이터. path를 주면 그 주소를 canonical(대표 주소)로 지정한다. */
export function pageMetadata(title: string, description: string, path?: string): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    ...(path && { alternates: { canonical: path, types: RSS_ALTERNATE } }),
    openGraph: { title: fullTitle, description, ...(path && { url: path }) },
    twitter: { title: fullTitle, description },
  };
}
