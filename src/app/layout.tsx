import type { Metadata } from "next";
import { Gowun_Dodum, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import JsonLd from "@/components/JsonLd";
import { AUTHOR_NAME, SITE_URL } from "@/lib/metadata";

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
// 홈 검색 결과에 나오는 제목·설명. 사이트 이름만으로는 무엇을 다루는지 알 수 없어 주제를 붙인다.
const HOME_TITLE = "은결의 Serendipity · IT를 쉽게 풀어 쓰는 개발 탐구노트";
const SITE_DESCRIPTION =
  "패스키, DNS, TLS 같은 IT 개념과 AI 도구 쓰는 법을 쉬운 말로 풀어 쓰는 개인 개발자의 탐구노트. 직접 만든 웹 게임과 이야기방도 있어요.";

export const metadata: Metadata = {
  metadataBase: new URL("https://saintjw.dev"),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_TITLE,
    title: HOME_TITLE,
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
    title: HOME_TITLE,
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
      name: AUTHOR_NAME,
      alternateName: "saintjw",
      url: `${SITE_URL}/about`,
      description: "호기심 가득한 개인 개발자. 어려운 IT 개념을 쉬운 말로 풀어 씁니다.",
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
