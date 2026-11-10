import type { ReactNode } from "react";
import Link from "next/link";
import Avatar from "../ui/Avatar";
import { me } from "../../lib/mock";

// Title row at the top of each page. On phones it also shows your avatar,
// because the sidebar (with the profile) is hidden there.
export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link href="/profile" className="lg:hidden" aria-label="Your profile">
          <Avatar initials={me.initials} color={me.color} size="sm" />
        </Link>
        <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}
