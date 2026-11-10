import type { ReactNode } from "react";
import Scene from "../ui/Scene";

type AuthShellProps = {
  children: ReactNode;
};

// The white rounded card with the colourful panel on the left.
// Sign-up and sign-in both render their form inside it.
export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white p-3 shadow-sm lg:grid-cols-2">
        <HeroPanel />
        <section className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">{children}</div>
        </section>
      </div>
    </main>
  );
}

function HeroPanel() {
  return (
    <aside className="relative hidden min-h-[820px] overflow-hidden rounded-[28px] bg-sky p-12 lg:block">
      <h2 className="max-w-md text-5xl font-extrabold leading-tight text-ink">
        Share the moments that move you.
      </h2>
      <p className="mt-6 max-w-xs text-ink/70">
        Stories, friends and communities in one calm, colourful place.
      </p>

      {/* Decorative collage (no data, just shapes) */}
      <div aria-hidden="true" className="absolute left-8 top-[330px] h-[460px] w-[480px]">
        <div className="absolute left-0 top-6 h-[280px] w-[190px] -rotate-6 overflow-hidden rounded-[28px] border-[5px] border-white shadow-lg">
          <Scene name="desert" />
        </div>
        <div className="absolute left-[175px] top-16 h-[310px] w-[210px] rotate-3 overflow-hidden rounded-[28px] border-[5px] border-white shadow-lg">
          <Scene name="hills" />
        </div>

        <div className="absolute left-[335px] top-0 grid h-28 w-28 place-items-center rounded-full bg-[#f2a8b8]">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#0e0e12" strokeWidth="2">
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
        </div>

        <div className="absolute left-[365px] top-[290px] grid h-[104px] w-[104px] place-items-center rounded-[28px] bg-lilac">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#0e0e12">
            <path d="M3 19l7-12 4 7 2-3 5 8z" />
          </svg>
        </div>

        <div className="absolute left-6 top-[310px] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f2b8a2] text-xs font-bold text-ink">
            KB
          </span>
          <div className="pr-2">
            <p className="text-sm font-bold text-ink">Karim liked your story</p>
            <p className="text-xs text-muted">just now</p>
          </div>
        </div>

        <span className="absolute left-[290px] top-[395px] rounded-full bg-rose px-4 py-2 text-sm font-bold text-[#7a1f3d]">
          Woow!!!
        </span>
      </div>
    </aside>
  );
}