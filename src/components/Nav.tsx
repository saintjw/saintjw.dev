import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "홈" },
  { href: "/posts", label: "글" },
  { href: "/blog", label: "블로그" },
  { href: "/games", label: "게임" },
  { href: "/guestbook", label: "방명록" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group flex items-baseline gap-1.5 text-foreground">
          <span className="font-display text-xl sm:text-2xl">saintjw</span>
          <span className="hidden text-sm text-muted sm:inline">의 다이어리</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-5">
          <ul className="flex items-center gap-3.5 whitespace-nowrap text-sm text-muted sm:gap-6 sm:text-[15px] [@media(display-mode:standalone)]:hidden">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="marker-link transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
