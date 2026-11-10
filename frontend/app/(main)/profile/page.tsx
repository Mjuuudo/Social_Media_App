import { PersonAvatar } from "../../components/ui/Avatar";
import Icon from "../../components/ui/Icon";
import Scene from "../../components/ui/Scene";
import { Button, NotificationBell, Segmented, SectionTitle } from "../../components/ui/Controls";
import { people, profile, tints } from "../../lib/mock";

export default function ProfilePage() {
  const { person } = profile;
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        {/* Cover + avatar */}
        <div className="relative">
          <div className="h-44 overflow-hidden rounded-[32px] sm:h-60">
            <Scene name="mountain" label="Profile cover: a snowy mountain" />
          </div>
          <div className="absolute right-4 top-4">
            <NotificationBell />
          </div>
          <PersonAvatar
            person={person}
            size="xl"
            className="absolute -bottom-14 left-5 h-28 w-28 border-[6px] border-white text-3xl sm:left-8 sm:h-36 sm:w-36 sm:text-5xl"
          />
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-4 sm:mt-4 sm:pl-48">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">{person.name}</h1>
            <p className="text-sm text-muted">@{person.username} · {person.city}</p>
          </div>
          <div className="flex gap-3">
            <Button className="px-8">Follow</Button>
            <Button variant="outline" className="px-8">Message</Button>
          </div>
        </div>

        <p className="mt-6 max-w-2xl leading-relaxed text-ink">{profile.bio}</p>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {profile.stats.map((s, i) => (
            <div key={s.label} className={`rounded-[24px] px-4 py-4 sm:px-6 ${tints[i % tints.length]}`}>
              <dd className="text-2xl font-extrabold text-ink sm:text-3xl">{s.value}</dd>
              <dt className="text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>

        <Segmented items={["Posts", "Photos", "About"]} active="Posts" className="mt-6" />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {profile.photos.map((scene) => (
            <button key={scene} type="button" className="aspect-square overflow-hidden rounded-3xl">
              <Scene name={scene} />
            </button>
          ))}
        </div>
      </div>

      <aside className="space-y-8">
        <section className="rounded-[32px] bg-cream p-6">
          <SectionTitle>About</SectionTitle>
          <ul className="mt-4 space-y-3 text-sm text-ink">
            {profile.about.map((a) => (
              <li key={a.text} className="flex items-center gap-3">
                <Icon name={a.icon} className="h-[18px] w-[18px]" /> {a.text}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>Interests</SectionTitle>
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((it) => (
              <li key={it.name} className="rounded-full px-4 py-2 text-sm font-bold text-ink" style={{ background: it.bg }}>
                {it.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>Mutual friends</SectionTitle>
          <div className="mt-4 flex">
            {[people.lena, people.omar, people.sofia].map((p) => (
              <PersonAvatar key={p.name} person={p} size="md" className="-mr-2 border-2 border-white" />
            ))}
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-ink text-sm font-bold text-white">
              +18
            </span>
          </div>
          <a href="/friends" className="mt-4 inline-block text-sm text-muted hover:text-ink">See all friends</a>
        </section>
      </aside>
    </div>
  );
}
