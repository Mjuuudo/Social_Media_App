import PageHeader from "../components/layout/PageHeader";
import { PersonAvatar } from "../components/ui/Avatar";
import Icon from "../components/ui/Icon";
import Scene from "../components/ui/Scene";
import { Button, IconButton, NotificationBell, SectionTitle } from "../components/ui/Controls";
import { me, posts, stories, suggestions, tints } from "../lib/mock";

export default function FeedPage() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <PageHeader title="Feeds">
          <nav aria-label="Feed filter" className="hidden gap-7 text-[15px] sm:flex">
            <a href="#" className="text-muted hover:text-ink">Recents</a>
            <a href="#" aria-current="true" className="font-bold text-ink">Friends</a>
            <a href="#" className="text-muted hover:text-ink">Popular</a>
          </nav>
          <IconButton icon="search" label="Search" className="sm:hidden" />
          <NotificationBell />
        </PageHeader>

        <StoryRow />

        <div className="mt-6 space-y-5">
          {posts.map((post, i) => (
            <PostCard key={i} post={post} tint={tints[i % tints.length]} showReactions={i === 0} />
          ))}
          <Composer />
        </div>
      </div>

      <RightColumn />
    </div>
  );
}

type Post = (typeof posts)[number];

function PostCard({ post, tint, showReactions }: { post: Post; tint: string; showReactions: boolean }) {
  return (
    <article className={`rounded-[32px] p-5 sm:p-7 ${tint}`}>
      <header className="flex items-center gap-3">
        <PersonAvatar person={post.author} size="md" />
        <div className="flex-1">
          <p className="font-bold text-ink">{post.author.name}</p>
          <p className="text-xs text-muted">{post.time}</p>
        </div>
        <IconButton icon="dots" label="Post options" className="bg-transparent" />
      </header>

      <p className="mt-5 leading-relaxed text-ink">
        {post.text}
        {post.mentions.map((m, i) => (
          <span key={m.name}>
            {i === 0 ? " " : i === post.mentions.length - 1 ? " and " : ", "}
            <span className="mr-1 inline-block h-4 w-4 translate-y-0.5 rounded-full" style={{ background: m.color }} />
            <a href="#" className="font-semibold text-link underline underline-offset-2">
              {m.name.split(" ")[0]}
            </a>
          </span>
        ))}
        {post.mentions.length > 0 && "!"}
      </p>

      {post.images.length > 0 && (
        <div className="mt-5 grid h-[220px] grid-cols-[1fr_1.4fr] gap-2 sm:h-[270px] sm:grid-cols-[1fr_1fr_2.2fr]">
          {post.images.map((scene, i) => (
            <div
              key={scene}
              className={`relative overflow-hidden rounded-3xl ${i === 0 ? "hidden sm:block" : ""}`}
            >
              <Scene name={scene} />
              {showReactions && i === post.images.length - 1 && <ReactionBar />}
            </div>
          ))}
        </div>
      )}

      <footer className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
        <span className="flex items-center gap-2">
          <Icon name="eye" className="h-[18px] w-[18px]" /> {post.views}
        </span>
        <button type="button" className="flex items-center gap-2 text-[#c43d64]">
          <Icon name="heart" className="h-[18px] w-[18px]" /> Like
        </button>
        <button type="button" className="flex items-center gap-2 hover:text-ink">
          <Icon name="comment" className="h-[18px] w-[18px]" /> Comment
        </button>
        {post.images.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-rose px-5 py-2 text-sm font-bold text-[#7a1f3d]">
            <Icon name="flame" className="h-4 w-4 fill-[#f08a3c] stroke-[#f08a3c]" /> Woow!!!
          </span>
        )}
      </footer>
    </article>
  );
}

function ReactionBar() {
  const reactions = [
    { icon: "flame", label: "Fire", bg: "#fdeee0", fg: "#f08a3c" },
    { icon: "heart", label: "Love", bg: "#fde3ea", fg: "#e5476d" },
    { icon: "smile", label: "Haha", bg: "#fdf3d2", fg: "#d4a020" },
    { icon: "thumbsUp", label: "Like", bg: "#e2e8f9", fg: "#3f63c9" },
  ] as const;
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white p-1.5 shadow-md">
      {reactions.map((r) => (
        <button
          key={r.label}
          type="button"
          aria-label={r.label}
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{ background: r.bg, color: r.fg }}
        >
          <Icon name={r.icon} className="h-[18px] w-[18px]" />
        </button>
      ))}
      <button type="button" aria-label="Close reactions" className="grid h-9 w-9 place-items-center rounded-full border border-ink">
        <Icon name="x" className="h-4 w-4" />
      </button>
    </div>
  );
}

function Composer() {
  const actions = [
    { icon: "file", label: "File" },
    { icon: "image", label: "Image" },
    { icon: "pin", label: "Location" },
  ] as const;
  return (
    <form className="hidden rounded-[32px] bg-field p-6 lg:block" action="#">
      <div className="flex items-center gap-4">
        <PersonAvatar person={me} size="sm" />
        <label className="relative flex-1">
          <span className="sr-only">Share something</span>
          <input
            type="text"
            placeholder="Share something"
            className="h-12 w-full rounded-full bg-white px-5 pr-12 text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-lilac"
          />
          <Icon name="smile" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-6 text-sm font-semibold text-ink">
        {actions.map((a) => (
          <button key={a.label} type="button" className="flex items-center gap-2 hover:text-link">
            <Icon name={a.icon} className="h-5 w-5" /> {a.label}
          </button>
        ))}
        <button type="button" className="flex items-center gap-2 hover:text-link">
          <Icon name="globe" className="h-5 w-5" /> Public <Icon name="chevronDown" className="h-4 w-4" />
        </button>
        <Button type="submit" className="ml-auto px-10">Send</Button>
      </div>
    </form>
  );
}

// Round story bubbles — shown above the posts on smaller screens
function StoryRow() {
  return (
    <div className="-mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 xl:hidden">
      <button type="button" className="flex shrink-0 flex-col items-center gap-2">
        <span className="grid h-[72px] w-[72px] place-items-center rounded-full border-2 border-dashed border-muted/50">
          <Icon name="plus" className="h-6 w-6" />
        </span>
        <span className="text-xs font-semibold text-ink">Your story</span>
      </button>
      {stories.map((s) => (
        <button key={s.person.name} type="button" className="flex shrink-0 flex-col items-center gap-2">
          <span className="block h-[72px] w-[72px] rounded-full border-[3px] p-[3px]" style={{ borderColor: s.ring }}>
            <span className="block h-full w-full overflow-hidden rounded-full">
              <Scene name={s.scene} />
            </span>
          </span>
          <span className="text-xs font-semibold text-ink">{s.person.name.split(" ")[0]}</span>
        </button>
      ))}
    </div>
  );
}

function RightColumn() {
  const recommendations = (
    <div className="mt-5 grid grid-cols-2 gap-4">
      <a href="#" className="grid aspect-square place-items-center rounded-full bg-[#dfe6f8] text-center font-bold text-ink">
        <span><Icon name="x" className="mx-auto mb-1 h-6 w-6" />UI/UX</span>
      </a>
      <a href="#" className="grid aspect-square place-items-center rounded-full bg-[#f2a8b8] text-center font-bold text-ink ring-8 ring-blush">
        <span><Icon name="music" className="mx-auto mb-1 h-6 w-6" />Music</span>
      </a>
      <a href="#" className="relative block aspect-square overflow-hidden rounded-full">
        <Scene name="salad" />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-sm font-bold text-ink">
          Cooking
        </span>
      </a>
      <a href="#" className="grid aspect-square place-items-center rounded-[28px] bg-lilac text-center font-bold text-ink">
        <span><Icon name="mountain" className="mx-auto mb-1 h-6 w-6" />Hiking</span>
      </a>
    </div>
  );

  return (
    <aside className="hidden xl:block">
      <SectionTitle className="mt-1">Stories</SectionTitle>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {stories.slice(0, 2).map((s) => (
          <a key={s.person.name} href="#" className="relative block h-44 overflow-hidden rounded-3xl border-4" style={{ borderColor: s.ring + "55" }}>
            <Scene name={s.scene} />
            <span className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-ink">
              <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: s.ring }} />
              <span className="truncate">{s.person.name}</span>
            </span>
          </a>
        ))}
      </div>

      <SectionTitle className="mt-10">Suggestions</SectionTitle>
      <ul className="mt-5 space-y-4">
        {suggestions.map((p) => (
          <li key={p.name} className="flex items-center gap-3">
            <PersonAvatar person={p} size="md" />
            <span className="flex-1 font-bold leading-tight text-ink">{p.name.split(" ").map((w) => <span key={w} className="block">{w}</span>)}</span>
            <Button className="h-11 px-5">Follow</Button>
          </li>
        ))}
      </ul>
      <a href="#" className="mt-5 inline-block text-sm text-muted hover:text-ink">See all</a>

      <SectionTitle className="mt-10">Recommendations</SectionTitle>
      {recommendations}
    </aside>
  );
}
