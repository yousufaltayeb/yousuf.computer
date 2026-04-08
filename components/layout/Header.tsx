"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/thoughts", label: "Thoughts" },
    { href: "/work", label: "Work" },
  ];

  return (
    <header className="py-6 bg-base">
      <nav className="max-w-[1200px] mx-auto px-8">
        <div className="flex justify-between mb-2 pb-4 text-xs md:text-[14px]">
          <Link
            href="/"
            className="logo-link font-mono"
            style={{ border: "1px solid var(--base)" }}
          >
            yousuf &gt;
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? "font-bold" : ""}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <hr className="h-[1px] bg-line border-0" />
      </nav>
    </header>
  );
}
