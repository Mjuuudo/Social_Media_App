import PageHeader from "../../components/layout/PageHeader";
import { PersonAvatar } from "../../components/ui/Avatar";
import Icon from "../../components/ui/Icon";
import { Button, NotificationBell, Pill, SectionTitle, Tag } from "../../components/ui/Controls";
import { communities, contributors, forumThreads, tints, topics } from "../../lib/mock";

export default function ForumsPage() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <PageHeader title="Forums">
          <Button icon="plus">New topic</Button>
          <NotificationBell />
        </PageHeader>

        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1">
          {topics.map((t) => (
            <Pill key={t} active={t === "All"}>{t}</Pill>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {forumThreads.map((thread, i) => (
            <article key={thread.title} className={`rounded-[32px] p-5 sm:p-7 ${tints[i % tints.length]}`}>
              <div className="flex items-center gap-2">
                <Tag>{thread.tag}</Tag>
                {thread.trending && <Tag dark>Trending</Tag>}
                <span className="ml-auto text-xs text-muted">{thread.time}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-ink">
                <a href="#" className="hover:underline">{thread.title}</a>
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{thread.body}</p>
              <footer className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                <span className="flex flex-1 items-center gap-3 font-semibold text-ink">
                  <PersonAvatar person={{ ...thread.author, color: "#ffffff" }} size="xs" />
                  {thread.author.name}
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="comment" className="h-[18px] w-[18px]" /> {thread.replies} replies
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="eye" className="h-[18px] w-[18px]" /> {thread.views}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>

      <aside className="space-y-10">
        <section>
          <SectionTitle className="mt-1">Communities</SectionTitle>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-2">
            {communities.map((c) => (
              <a
                key={c.name}
                href="#"
                className={`grid aspect-square place-items-center text-center transition hover:scale-[1.02] ${c.shape}`}
                style={{ background: c.bg }}
              >
                <span>
                  <span className="block font-bold text-ink">{c.name}</span>
                  <span className="block text-xs text-muted">{c.members} members</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] bg-ink p-7 text-white">
          <h2 className="text-2xl font-extrabold">Start your own circle</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Bring people together around something you love — a city, a craft, a weekend habit.
          </p>
          <Button variant="pink" className="mt-5">Create community</Button>
        </section>

        <section>
          <SectionTitle>Top contributors</SectionTitle>
          <ul className="mt-5 space-y-4">
            {contributors.map(({ person, posts }) => (
              <li key={person.name} className="flex items-center gap-3">
                <PersonAvatar person={person} size="md" />
                <span className="flex-1 font-bold text-ink">{person.name}</span>
                <span className="text-sm text-muted">{posts} posts</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
