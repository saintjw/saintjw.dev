import type { Metadata } from "next";
import { Gowun_Dodum, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/metadata";

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      document.documentElement.classList.add(stored);
    }
  } catch (e) {}
})();
`;

// 제목용: 손글씨처럼 둥근 고운돋움. 본문은 Pretendard(아래 link)로 읽는다.
const gowun = Gowun_Dodum({
  variable: "--font-gowun",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "은결의 Serendipity";
const SITE_DESCRIPTION = "호기심 가득한 개인 개발자의 탐구 공간. 어려운 건 쉽게, 귀찮은 지식은 간단하게.";

export const metadata: Metadata = {
  metadataBase: new URL("https://saintjw.dev"),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "은결의 Serendipity 탐구노트" }],
    },
  },
  verification: {
    other: {
      "naver-site-verification": "46d4304bfeceeab4ee4fe85d2ea431d0b88fa199",
    },
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// 사이트 전체 구조화 데이터: 검색 결과에 사이트 이름과 운영자를 알려 준다.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: "saintjw",
      alternateName: "은결",
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${gowun.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <JsonLd data={siteJsonLd} />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
