import type { Metadata } from "next";

export function pageMetadata(title: string, description: string): Metadata {
  const fullTitle = `${title} · saintjw.dev`;
  return {
    title,
    description,
    openGraph: { title: fullTitle, description },
    twitter: { title: fullTitle, description },
  };
}
