import type { ReactNode } from "react";

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
    <aside className="relative hidden min-h-[620px] overflow-hidden rounded-[28px] bg-sky p-10 lg:block">
      <h2 className="max-w-md text-5xl font-extrabold leading-tight text-ink">
        Share the moments that move you.
      </h2>
      <p className="mt-6 max-w-xs text-ink/70">
        Stories, friends and communities in one calm, colourful place.
      </p>

      {/* Decorative collage (no data, just shapes) */}
      <div aria-hidden="true">
        <div
          className="absolute bottom-24 left-10 h-60 w-40 -rotate-3 rounded-3xl border-4 border-white shadow-lg"
          style={{ background: "linear-gradient(180deg, #a9c6dd 0%, #e3b676 70%, #c98a4f 100%)" }}
        />
        <div
          className="absolute bottom-16 left-44 h-64 w-44 rotate-2 rounded-3xl border-4 border-white shadow-lg"
          style={{ background: "linear-gradient(180deg, #ebbdbd 0%, #a67a8c 60%, #4d3347 100%)" }}
        />

        <div className="absolute right-24 top-[45%] grid h-28 w-28 place-items-center rounded-full bg-rose">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#0e0e12" strokeWidth="2">
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
        </div>

        <div className="absolute bottom-24 right-12 grid h-24 w-24 place-items-center rounded-3xl bg-lilac">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#0e0e12">
            <path d="M3 19l7-12 4 7 2-3 5 8z" />
          </svg>
        </div>

        <div className="absolute bottom-20 left-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-md">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f2b8a2] text-xs font-bold text-ink">
            KB
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Karim liked your story</p>
            <p className="text-xs text-muted">just now</p>
          </div>
        </div>

        <span className="absolute bottom-10 left-[42%] rounded-full bg-rose px-4 py-1.5 text-sm font-bold text-[#7a1f3d]">
          Woow!!!
        </span>
      </div>
    </aside>
  );
}