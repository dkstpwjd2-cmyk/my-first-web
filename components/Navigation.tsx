import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { href: "/posts", label: "포스트" },
  { href: "/posts/new", label: "작성" },
  { href: "/login", label: "로그인" },
  { href: "/mypage", label: "마이페이지" },
];

export default function Navigation() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-6 py-4">
        <Link
          href="/"
          className="mr-auto text-base font-bold tracking-normal text-[var(--foreground)]"
        >
          My First Web
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={buttonVariants({
              variant: item.href === "/posts/new" ? "default" : "ghost",
              className: "h-9",
            })}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
