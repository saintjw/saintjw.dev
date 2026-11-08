import Link from "next/link";

const links = [
  { href: "/now", label: "요즘" },
  { href: "/uses", label: "쓰는 것들" },
  { href: "/guestbook", label: "방명록" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} saintjw · made with Next.js</span>
        <nav aria-label="보조 메뉴">
          <ul className="flex gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
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
