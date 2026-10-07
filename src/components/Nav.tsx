import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "블로그" },
  { href: "/games", label: "게임" },
  { href: "/projects", label: "프로젝트" },
  { href: "/guestbook", label: "방명록" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          saintjw<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <ul className="flex items-center gap-3 whitespace-nowrap text-xs text-muted sm:gap-6 sm:text-sm [@media(display-mode:standalone)]:hidden">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
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
