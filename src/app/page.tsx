import Link from "next/link";
import { getCategories, getLatestPosts, type TistoryCategory, type TistoryPost } from "@/lib/tistory";
import { categoryDescriptions } from "@/lib/blogCategories";
import { games } from "@/lib/games";
import { getAllPosts } from "@/lib/posts";
import { getTopic } from "@/lib/topics";

export const revalidate = 3600;

const socials = [
  { label: "GitHub", href: "https://github.com/saintjw" },
  { label: "Email", href: "mailto:saintjw@hanmail.net" },
];

function SectionHead({ index, title, href, cta }: { index: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-4">
      <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight text-foreground">
        <span className="font-mono text-xs text-accent-strong">{index}</span>
        {title}
      </h2>
      {href && cta && (
        <Link href={href} className="text-sm text-muted transition-colors hover:text-foreground">
          {cta} →
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const [categories, posts] = await Promise.all([
    getCategories().catch(() => [] as TistoryCategory[]),
    getLatestPosts(5).catch(() => [] as TistoryPost[]),
  ]);
  const total = categories.reduce((sum, c) => sum + c.count, 0);
  // 글이 1~2편뿐인 카테고리는 대문에서는 빼고 블로그 페이지에서만 보여준다.
  const topics = categories.filter((c) => c.count >= 5);
  const sitePosts = getAllPosts().slice(0, 3);
  // 보이는 섹션 순서대로 01, 02, ... 번호를 붙인다.
  let sectionNo = 0;
  const nextNo = () => String(++sectionNo).padStart(2, "0");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative isolate py-20 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-accent-soft opacity-70 blur-3xl"
        />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          saintjw.dev — personal archive
        </p>
        <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl">
          책상 앞의 하루와
          <br />
          <span className="text-accent-strong">달리는 주말</span>을 기록합니다.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          일하는 몸과 마음을 돌보는 법, 러닝과 여행, 책상 위의 기기들, 생활 속 돈
          공부까지. 직접 찾아보고 정리한 것들을 이곳에 차곡차곡 모아둡니다.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            글 읽으러 가기
          </Link>
          <Link
            href="/games"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent"
          >
            게임 한 판
          </Link>
          <div className="ml-1 flex gap-4 text-sm text-muted">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="transition-colors hover:text-foreground">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {total > 0 && (
          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              ["글", total.toLocaleString()],
              ["주제", String(categories.length)],
              ["게임", String(games.length)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold tracking-tight text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* Site posts */}
      {sitePosts.length > 0 && (
        <section className="pb-20">
          <SectionHead index={nextNo()} title="새로 쓴 글" href="/posts" cta="전체 보기" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {sitePosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/posts/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
                >
                  <span className="font-mono text-xs text-muted">
                    {getTopic(p.topic)?.name} · {p.date}
                  </span>
                  <h3 className="mt-2 font-semibold leading-snug text-foreground group-hover:text-accent-strong">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <section className="pb-20">
          <SectionHead index={nextNo()} title="블로그 주제" href="/blog" cta="전체 보기" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((c) => (
              <li key={c.name}>
                <Link
                  href={`/blog#${c.name}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <span className="font-mono text-xs text-muted">{c.count}</span>
                  </div>
                  {categoryDescriptions[c.name] && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {categoryDescriptions[c.name]}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="pb-20">
          <SectionHead index={nextNo()} title="블로그 최근 글" href="/blog" cta="더 보기" />
          <ul>
            {posts.map((p) => (
              <li key={p.url} className="border-b border-border/60">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-1 py-4 sm:grid-cols-[6.5rem_1fr] sm:gap-6"
                >
                  <time className="font-mono text-xs leading-6 text-muted">{p.date}</time>
                  <div>
                    <span className="text-[15px] text-foreground transition-colors group-hover:text-accent-strong">
                      {p.title}
                    </span>
                    {p.category && (
                      <span className="ml-2 text-xs text-muted">{p.category}</span>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Elsewhere */}
      <section className="pb-24">
        <SectionHead index={nextNo()} title="그 밖의 것들" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/games"
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent"
          >
            <h3 className="font-semibold text-foreground">게임</h3>
            <p className="mt-2 text-sm text-muted">
              틈틈이 만든 작은 웹 게임 {games.length}개. 반응속도부터 슈팅까지.
            </p>
            <span className="mt-4 inline-block text-sm text-muted transition-colors group-hover:text-foreground">
              플레이하기 →
            </span>
          </Link>
          <Link
            href="/projects"
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent"
          >
            <h3 className="font-semibold text-foreground">프로젝트</h3>
            <p className="mt-2 text-sm text-muted">
              이 사이트를 비롯해 직접 만들어 본 것들을 모아둡니다.
            </p>
            <span className="mt-4 inline-block text-sm text-muted transition-colors group-hover:text-foreground">
              둘러보기 →
            </span>
          </Link>
          <Link
            href="/now"
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent"
          >
            <h3 className="font-semibold text-foreground">요즘</h3>
            <p className="mt-2 text-sm text-muted">
              지금 쓰고, 만들고, 준비하는 것들. 한 달에 한 번쯤 고쳐요.
            </p>
            <span className="mt-4 inline-block text-sm text-muted transition-colors group-hover:text-foreground">
              근황 보기 →
            </span>
          </Link>
          <Link
            href="/uses"
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent"
          >
            <h3 className="font-semibold text-foreground">쓰는 것들</h3>
            <p className="mt-2 text-sm text-muted">
              매일 쓰는 기기와 도구, 서비스를 모아둡니다.
            </p>
            <span className="mt-4 inline-block text-sm text-muted transition-colors group-hover:text-foreground">
              구경하기 →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
