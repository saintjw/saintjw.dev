import type { Metadata } from "next";

export const SITE_URL = "https://saintjw.dev";
export const SITE_NAME = "은결의 Serendipity";
export const AUTHOR_NAME = "은결";

// 사이트 공통 공유 이미지(app/opengraph-image.tsx). 하위 페이지가 openGraph를 정하면
// 레이아웃의 이미지가 상속되지 않으므로 여기서 직접 넣는다.
export const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME };

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
    openGraph: { title: fullTitle, description, images: [DEFAULT_OG_IMAGE], ...(path && { url: path }) },
    twitter: { title: fullTitle, description, images: [DEFAULT_OG_IMAGE.url] },
  };
}
