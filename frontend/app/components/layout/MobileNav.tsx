"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "../ui/Icon";

const items: { href: string; label: string; icon: IconName; dot?: boolean }[] = [
  { href: "/", label: "News Feed", icon: "compass" },
  { href: "/messages", label: "Messages", icon: "mail", dot: true },
  { href: "/friends", label: "Friends", icon: "friends" },
  { href: "/profile", label: "Profile", icon: "user" },
];

// Bottom tab bar shown on phones and tablets (hidden on desktop).
export default function MobileNav() {
  const pathname = usePathname();
  // The chat screen has its own message bar at the bottom
  if (pathname.startsWith("/messages")) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-4 bottom-4 z-20 mx-auto flex h-[72px] max-w-md items-center justify-between rounded-full bg-ink px-3 lg:hidden"
    >
      {items.slice(0, 2).map((item) => (
        <NavLink key={item.href} {...item} active={isActive(item.href)} />
      ))}
      <button
        type="button"
        aria-label="Create a post"
        className="grid h-14 w-14 place-items-center rounded-full bg-lilac text-ink"
      >
        <Icon name="plus" className="h-6 w-6" />
      </button>
      {items.slice(2).map((item) => (
        <NavLink key={item.href} {...item} active={isActive(item.href)} />
      ))}
    </nav>
  );
}

function NavLink({ href, label, icon, dot, active }: { href: string; label: string; icon: IconName; dot?: boolean; active: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`relative grid h-14 w-14 place-items-center rounded-full transition ${active ? "bg-white text-ink" : "text-white"}`}
    >
      <Icon name={icon} className="h-[22px] w-[22px]" />
      {dot && <span className="absolute right-3.5 top-3.5 h-2.5 w-2.5 rounded-full bg-rose" />}
    </Link>
  );
}
