import { nowSections, nowUpdated } from "@/lib/now";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("요즘", "요즘 쓰고, 만들고, 준비하는 것들.");

function formatKoreanDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

export default function NowPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Now</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        요즘 하고 있는 일
      </h1>
      <p className="mt-3 text-muted">
        지금 제 시간을 쓰고 있는 것들을 적어둡니다. 한 달에 한 번쯤 고쳐요.
      </p>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        <time dateTime={nowUpdated}>{formatKoreanDate(nowUpdated)}</time> 업데이트
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {nowSections.map((section) => (
          <section key={section.title}>
            <h2 className="border-b border-border pb-3 text-lg font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-foreground/90">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted">
        이 페이지는{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border underline-offset-4 hover:text-foreground"
        >
          /now 페이지
        </a>{" "}
        형식을 따릅니다.
      </p>
    </div>
  );
}
