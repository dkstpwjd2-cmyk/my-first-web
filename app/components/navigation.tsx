"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/posts", label: "블로그" },
  { href: "/posts/new", label: "새 글 쓰기" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3 sm:gap-6">
        <Link href="/" className="font-bold tracking-tight mr-1">
          내 블로그
        </Link>

        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`text-sm px-2 py-1 rounded-md transition ${
                active
                  ? "bg-white text-gray-900 font-semibold"
                  : "text-gray-200 hover:text-white hover:bg-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}