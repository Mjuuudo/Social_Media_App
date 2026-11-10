import PageHeader from "../../components/layout/PageHeader";
import { PersonAvatar } from "../../components/ui/Avatar";
import Icon from "../../components/ui/Icon";
import { Badge, Button, NotificationBell, Segmented, SectionTitle } from "../../components/ui/Controls";
import { friendRequests, friends, tints } from "../../lib/mock";

export default function FriendsPage() {
  return (
    <div>
      <PageHeader title="Friends">
        <label className="relative w-full sm:w-80">
          <span className="sr-only">Search friends</span>
          <Icon name="search" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search friends"
            className="h-12 w-full rounded-full bg-field pl-12 pr-5 text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-lilac"
          />
        </label>
        <NotificationBell />
      </PageHeader>

      <section className="mt-8">
        <div className="flex items-center gap-3">
          <SectionTitle>Friend requests</SectionTitle>
          <Badge count={friendRequests.length} />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:max-w-[800px]">
          {friendRequests.map(({ person, mutual }, i) => (
            <div key={person.name} className={`rounded-[28px] p-5 ${tints[i % tints.length]}`}>
              <div className="flex items-center gap-3">
                <PersonAvatar person={person} size="md" />
                <div>
                  <p className="font-bold text-ink">{person.name}</p>
                  <p className="text-xs text-muted">{mutual} mutual friends</p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button className="flex-1 px-4">Accept</Button>
                <Button variant="outline" className="flex-1 px-4">Decline</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle>All friends · 214</SectionTitle>
          <Segmented items={["All", "Online", "Close friends"]} active="All" />
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {friends.map((f) => (
            <li key={f.name} className="flex flex-col items-center rounded-[28px] border border-[#eceef4] p-4 text-center">
              <PersonAvatar person={f} size="lg" showStatus />
              <a href="#" className="mt-3 font-bold text-link hover:underline">{f.name}</a>
              <p className="text-xs text-muted">{f.city}</p>
              <Button variant="soft" icon="comment" className="mt-4 h-11 w-full px-3">Message</Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
