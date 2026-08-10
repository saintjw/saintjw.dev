import Link from "next/link";

const socials = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "Email", href: "mailto:saintjw@hanmail.net" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <section className="flex flex-col items-start gap-6 py-24">
        <span className="rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent">
          Hello, world 👋
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          안녕하세요, saintjw입니다.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          코드를 쓰고, 글을 남기고, 가끔은 작은 게임을 만듭니다. 이 공간은
          저의 여러 활동들을 한곳에 모아두는 개인 허브입니다.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-5 pb-24 sm:grid-cols-2">
        <Link
          href="/blog"
          className="group rounded-3xl border border-border bg-mint/60 p-8 transition-transform hover:-translate-y-1"
        >
          <div className="text-3xl">✍️</div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">블로그</h2>
          <p className="mt-2 text-sm text-muted">
            생각과 경험을 정리한 글들을 모아봤어요.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-foreground/70 group-hover:text-foreground">
            글 보러 가기 →
          </span>
        </Link>

        <Link
          href="/games"
          className="group rounded-3xl border border-border bg-peach/60 p-8 transition-transform hover:-translate-y-1"
        >
          <div className="text-3xl">🎮</div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">게임</h2>
          <p className="mt-2 text-sm text-muted">
            심심할 때 만든 작은 웹 게임들을 플레이해보세요.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-foreground/70 group-hover:text-foreground">
            플레이하기 →
          </span>
        </Link>
      </section>
    </div>
  );
}
