import type { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";

// Shared frame for every signed-in page: sidebar on desktop, bottom bar on mobile.
// The "(main)" folder is a route group, so it doesn't appear in the URL.
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page lg:p-6">
      <div className="mx-auto min-h-screen max-w-[1440px] bg-white lg:grid lg:min-h-[calc(100vh-48px)] lg:grid-cols-[296px_minmax(0,1fr)] lg:rounded-[32px]">
        <Sidebar />
        <main className="min-w-0 px-4 pb-28 pt-6 sm:px-6 lg:py-10 lg:pl-2 lg:pr-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
