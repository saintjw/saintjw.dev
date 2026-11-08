import { usesGroups } from "@/lib/uses";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("쓰는 것들", "매일 쓰는 기기와 도구, 서비스를 모아둡니다.");

export default function UsesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Uses</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        쓰는 것들
      </h1>
      <p className="mt-3 text-muted">
        글을 쓰고 이 사이트를 만드는 데 매일 쓰는 기기와 도구들이에요.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {usesGroups.map((group) => (
          <section key={group.title}>
            <h2 className="border-b border-border pb-3 text-lg font-semibold tracking-tight text-foreground">
              {group.title}
            </h2>
            <dl>
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="grid gap-1 border-b border-border/60 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <dt className="font-medium text-foreground">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent-strong"
                      >
                        {item.name} <span className="text-muted">↗</span>
                      </a>
                    ) : (
                      item.name
                    )}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted sm:text-[15px]">{item.note}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-16 text-sm text-muted">
        다른 사람들의 /uses 페이지는{" "}
        <a
          href="https://uses.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border underline-offset-4 hover:text-foreground"
        >
          uses.tech
        </a>
        에서 볼 수 있어요.
      </p>
    </div>
  );
}
