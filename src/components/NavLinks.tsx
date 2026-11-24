"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "홈", desktopOnly: true },
  { href: "/posts", label: "탐구노트" },
  { href: "/blog", label: "잡학사전" },
  { href: "/games", label: "게임(프로젝트)" },
  { href: "/qna", label: "이야기방" },
];

// 상단 메뉴. 지금 보고 있는 메뉴에는 형광펜이 칠해져 있다.
export default function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <ul className={`flex items-center whitespace-nowrap font-display ${className}`}>
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <li key={link.href} className={link.desktopOnly ? "hidden md:block" : ""}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`marker-link nav-link hover:text-foreground ${
                active ? "text-foreground" : "text-foreground/75"
              }`}
              style={active ? { backgroundSize: "100% 100%" } : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
