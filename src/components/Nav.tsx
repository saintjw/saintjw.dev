import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NavLinks from "@/components/NavLinks";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3 md:py-4">
          <Link href="/" className="group flex items-baseline gap-1.5 text-foreground">
            <span className="font-display text-base text-muted sm:text-lg">은결의</span>
            <span className="relative font-display text-xl sm:text-2xl">
              Serendipity
              <span aria-hidden className="sparkle">
                ✦
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 md:gap-6">
            <NavLinks className="hidden gap-7 text-lg md:flex [@media(display-mode:standalone)]:!hidden" />
            <ThemeToggle />
          </div>
        </div>
        {/* 좁은 화면: 메뉴를 한 줄 아래에 크게 */}
        <NavLinks className="-mt-1 flex justify-between gap-2 overflow-x-auto pb-2.5 text-[15px] min-[400px]:justify-start min-[400px]:gap-5 min-[400px]:text-base md:hidden [@media(display-mode:standalone)]:hidden" />
      </nav>
    </header>
  );
}
