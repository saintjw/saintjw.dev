import type { Metadata } from "next";

export function pageMetadata(title: string, description: string): Metadata {
  const fullTitle = `${title} · 은결의 Serendipity`;
  return {
    title,
    description,
    openGraph: { title: fullTitle, description },
    twitter: { title: fullTitle, description },
  };
}
