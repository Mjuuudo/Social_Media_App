"use client";

import { useState } from "react";
import Icon from "../ui/Icon";
import { logout } from "../../lib/api";

// Calls POST /api/auth/logout, then sends the user to /login.
// `compact` shows only the icon (used in the mobile bottom bar).
export default function LogoutButton({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await logout();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label="Log out"
      className={`transition disabled:opacity-60 ${className}`}
    >
      <Icon name="logout" className={compact ? "h-[22px] w-[22px]" : "h-[19px] w-[19px]"} />
      {!compact && <span className="flex-1 text-left">{pending ? "Logging out..." : "Log out"}</span>}
    </button>
  );
}
