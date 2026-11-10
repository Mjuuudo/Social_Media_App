import Link from "next/link";
import { PersonAvatar } from "../../components/ui/Avatar";
import Icon from "../../components/ui/Icon";
import Scene from "../../components/ui/Scene";
import { IconButton, NotificationBell } from "../../components/ui/Controls";
import { conversations, people } from "../../lib/mock";

export default function MessagesPage() {
  return (
    <div className="grid gap-6 lg:h-[calc(100vh-128px)] lg:max-h-[880px] lg:grid-cols-[300px_minmax(0,1fr)]">
      <ConversationList />
      <ChatPanel />
    </div>
  );
}

function ConversationList() {
  return (
    <section className="hidden min-h-0 flex-col lg:flex" aria-label="Conversations">
      <div className="flex items-center gap-3">
        <h1 className="flex-1 text-3xl font-extrabold text-ink">Messages</h1>
        <NotificationBell />
        <IconButton icon="plus" label="New message" variant="solid" />
      </div>

      <label className="relative mt-6 block">
        <span className="sr-only">Search people or chats</span>
        <Icon name="search" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search people or chats"
          className="h-12 w-full rounded-full bg-field pl-12 pr-5 text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-lilac"
        />
      </label>

      <ul className="mt-4 min-h-0 space-y-1 overflow-y-auto">
        {conversations.map((c, i) => (
          <li key={c.person.name}>
            <a
              href="#"
              aria-current={i === 0 ? "true" : undefined}
              className={`flex items-center gap-3 rounded-3xl p-3.5 transition ${i === 0 ? "bg-sky" : "hover:bg-field"}`}
            >
              <PersonAvatar person={c.person} size="md" showStatus />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-bold text-ink">{c.person.name}</span>
                  <span className="shrink-0 text-xs text-muted">{c.time}</span>
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-muted">{c.last}</span>
                  {c.unread > 0 && (
                    <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ChatPanel() {
  const lena = people.lena;
  const incoming = "w-fit max-w-[85%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed text-ink sm:max-w-[480px]";
  return (
    <section
      aria-label={`Chat with ${lena.name}`}
      className="-mx-4 -mb-28 -mt-6 flex min-h-screen flex-col bg-field sm:-mx-6 lg:m-0 lg:min-h-0 lg:rounded-[32px] lg:p-5"
    >
      {/* Chat header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 rounded-b-[28px] bg-white px-4 py-4 lg:static lg:rounded-[28px] lg:px-4 lg:py-3">
        <Link href="/" aria-label="Back" className="grid h-12 w-12 place-items-center rounded-full border border-ink lg:hidden">
          <Icon name="chevronLeft" />
        </Link>
        <PersonAvatar person={lena} size="md" showStatus className="lg:[&>span]:hidden" />
        <div className="flex-1">
          <p className="font-bold text-ink">{lena.name}</p>
          <p className="text-xs font-semibold text-online">Online now</p>
        </div>
        <div className="hidden gap-3 lg:flex">
          <IconButton icon="phone" label="Voice call" />
          <IconButton icon="video" label="Video call" />
          <IconButton icon="dots" label="More options" />
        </div>
        <IconButton icon="video" label="Video call" variant="solid" className="lg:hidden" />
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-6 lg:px-2">
        <p className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">Today</p>

        <p className={`${incoming} bg-sky`}>Your mountain photos are unreal. Which trail did you take to the top?</p>
        <p className={`${incoming} bg-sky`}>I want to try it before the snow closes everything.</p>
        <p className="text-xs text-muted">10:24</p>

        <div className="flex flex-col items-end gap-3">
          <p className="w-fit max-w-[85%] rounded-3xl bg-ink px-5 py-3.5 text-[15px] leading-relaxed text-white sm:max-w-[500px]">
            The north ridge one! Start early — the last hour is steep but the view is worth every step.
          </p>
          <figure className="w-[260px] rounded-3xl bg-white p-1.5 pb-3 sm:w-[310px]">
            <div className="h-40 overflow-hidden rounded-[20px]">
              <Scene name="lake" label="A lake surrounded by pine trees" />
            </div>
            <figcaption className="mt-2.5 px-2 text-sm font-semibold text-ink">Halfway point — the lake</figcaption>
          </figure>
          <p className="text-xs text-muted">10:31 · Seen</p>
        </div>

        <div className="space-y-2">
          <p className={`${incoming} bg-cream`}>Saving this. Coffee after, my treat?</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-ink">
              <Icon name="heart" className="h-4 w-4 fill-alert stroke-alert" /> 2
            </span>
            <span className="rounded-full bg-rose px-4 py-1.5 text-sm font-bold text-[#7a1f3d]">Woow!!!</span>
          </div>
        </div>

        <p className="flex w-fit items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-sm text-muted">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a7a55]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a7a55] [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c2b48f] [animation-delay:300ms]" />
          </span>
          Lena is typing
        </p>
      </div>

      {/* Quick replies (phones) */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {["Deal!", "Sounds great", "Which café?"].map((r) => (
          <button key={r} type="button" className="shrink-0 rounded-full border border-ink bg-white px-4 py-2.5 text-sm font-bold text-ink">
            {r}
          </button>
        ))}
      </div>

      {/* Composer */}
      <form action="#" className="sticky bottom-0 mx-4 mb-4 flex items-center gap-3 rounded-full bg-white p-2 lg:static lg:mx-0 lg:mb-0">
        <button type="button" aria-label="Attach a file" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-field text-ink">
          <Icon name="paperclip" className="hidden h-5 w-5 lg:block" />
          <Icon name="plus" className="h-5 w-5 lg:hidden" />
        </button>
        <label className="flex-1">
          <span className="sr-only">Message</span>
          <input type="text" placeholder="Write a message..." className="h-12 w-full bg-transparent text-ink outline-none placeholder:text-muted" />
        </label>
        <button type="submit" className="h-12 shrink-0 rounded-full bg-ink px-4 font-bold text-white lg:px-8">
          <span className="hidden lg:inline">Send</span>
          <Icon name="send" className="h-5 w-5 lg:hidden" />
          <span className="sr-only lg:hidden">Send</span>
        </button>
      </form>
    </section>
  );
}
