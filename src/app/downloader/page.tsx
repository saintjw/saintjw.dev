import { pageMetadata } from "@/lib/metadata";

// 개인용 페이지: 메뉴·sitemap에 넣지 않고 검색엔진 노출도 막는다.
export const metadata = {
  ...pageMetadata("다운로더", "내 PC에서 실행하는 개인용 다운로더로 이동합니다."),
  robots: { index: false, follow: false },
};

const LOCAL_URL = "http://localhost:8000";

export default function DownloaderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">다운로더</h1>
      <p className="mt-2 text-muted">
        내 PC에서 실행하는 개인용 다운로더예요. 앱이 켜져 있을 때만 열립니다.
      </p>

      <a
        href={LOCAL_URL}
        className="mt-8 inline-block rounded-xl bg-accent px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      >
        다운로더 열기
      </a>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted">
        <h2 className="text-base font-semibold text-foreground">열리지 않는다면</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          <li>
            PC에서 <code className="text-foreground">yt-downloader\run.bat</code>을
            실행하세요.
          </li>
          <li>검은 창이 뜬 상태에서 위 버튼을 다시 누르세요.</li>
          <li>이 페이지는 앱이 설치된 PC에서만 동작해요.</li>
        </ol>
      </div>
    </div>
  );
}
