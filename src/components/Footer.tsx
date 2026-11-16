import Link from "next/link";

const links = [
  { href: "/projects", label: "프로젝트" },
  { href: "/now", label: "요즘" },
  { href: "/uses", label: "쓰는 것들" },
  { href: "/guestbook", label: "방명록" },
  { href: "/privacy", label: "개인정보처리방침" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-background/90 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-display text-base text-foreground">saintjw</span>의 다이어리 · ©{" "}
          {new Date().getFullYear()}
        </p>
        <nav aria-label="보조 메뉴">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="marker-link transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
