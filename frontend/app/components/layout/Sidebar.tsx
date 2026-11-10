"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar, { PersonAvatar } from "../ui/Avatar";
import Icon, { type IconName } from "../ui/Icon";
import { Badge } from "../ui/Controls";
import Logo from "../auth/Logo";
import { me, people } from "../../lib/mock";

export const navItems: { href: string; label: string; icon: IconName; count?: number }[] = [
  { href: "/", label: "News Feed", icon: "compass" },
  { href: "/messages", label: "Messages", icon: "mail", count: 6 },
  { href: "/forums", label: "Forums", icon: "forums" },
  { href: "/friends", label: "Friends", icon: "friends", count: 3 },
  { href: "/media", label: "Media", icon: "image" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-48px)] max-h-[960px] flex-col px-8 py-12 lg:flex">
      {/* Profile */}
      <Link href="/profile" className="flex flex-col items-center text-center">
        <span className="flex items-center">
          <span className="grid h-[84px] w-[84px] place-items-center rounded-full bg-mist">
            <Logo />
          </span>
          <Avatar initials={me.initials} color={me.color} size="lg" className="-ml-5 h-[84px] w-[84px] text-2xl" />
        </span>
        <span className="mt-3 text-lg font-bold text-ink">{me.name}</span>
        <span className="text-sm text-muted">@{me.username}</span>
      </Link>

      {/* Navigation */}
      <nav aria-label="Main" className="mt-6 space-y-2">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-12 items-center gap-4 rounded-2xl px-5 text-[15px] font-semibold transition ${
                active ? "bg-ink font-bold text-white" : "text-ink hover:bg-field"
              }`}
            >
              <Icon name={item.icon} className="h-[19px] w-[19px]" />
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && <Badge count={item.count} inverted={active} />}
            </Link>
          );
        })}
      </nav>

      <DownloadCard />
    </aside>
  );
}

function DownloadCard() {
  return (
    <div className="mt-auto flex flex-col items-center rounded-3xl border-2 border-dashed border-[#dcdfe8] px-4 pb-6 pt-6">
      <div className="relative">
        <div className="grid h-[104px] w-[104px] place-items-center rounded-[28px] bg-lilac">
          <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
            <path
              d="M24 4l5 7 8-2 1 8 7 4-5 6 3 8-8 1-3 8-7-4-8 3-2-8-8-3 4-7-4-7 8-2 2-8z"
              fill="#fff"
            />
          </svg>
        </div>
        <PersonAvatar person={people.lena} size="xs" className="absolute -left-3 -top-3 border-2 border-white" />
        <PersonAvatar person={people.omar} size="sm" className="absolute -bottom-3 -right-3 border-2 border-white" />
      </div>
      <a href="#" className="mt-7 text-[15px] font-bold text-link">
        Download the App
      </a>
    </div>
  );
}
