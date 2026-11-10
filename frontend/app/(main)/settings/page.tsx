import PageHeader from "../../components/layout/PageHeader";
import { PersonAvatar } from "../../components/ui/Avatar";
import { Button, NotificationBell } from "../../components/ui/Controls";
import { me } from "../../lib/mock";

const sections = ["Account", "Privacy", "Notifications", "Appearance", "Security"];

const notificationOptions = [
  { id: "likes", title: "Likes and reactions", hint: "When someone reacts to your posts", on: true },
  { id: "comments", title: "Comments and mentions", hint: "Replies, tags and @mentions", on: true },
  { id: "followers", title: "New followers", hint: "When someone starts following you", on: false },
  { id: "digest", title: "Weekly digest", hint: "A Sunday summary of what you missed", on: true },
];

const field =
  "h-12 w-full rounded-2xl border border-[#e6e8ef] bg-white px-4 text-ink outline-none focus:ring-2 focus:ring-lilac";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings">
        <NotificationBell />
      </PageHeader>

      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:px-0">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              aria-current={s === "Account" ? "true" : undefined}
              className={`block shrink-0 rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-ink transition ${
                s === "Account" ? "bg-sky" : "hover:bg-field"
              }`}
            >
              {s}
            </a>
          ))}
        </nav>

        <div className="space-y-5">
          {/* Account */}
          <form id="account" action="#" className="rounded-[32px] bg-field p-5 sm:p-7">
            <h2 className="text-2xl font-bold text-ink">Account</h2>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <PersonAvatar person={me} size="lg" className="h-20 w-20 text-2xl" />
              <Button>Change photo</Button>
              <Button variant="outline">Remove</Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Field label="Full name" id="fullName" defaultValue={me.name} />
              <Field label="Username" id="username" defaultValue={`@${me.username}`} />
              <Field label="Email" id="email" type="email" defaultValue="yasmine@example.com" />
              <Field label="Location" id="location" defaultValue="Casablanca, Morocco" />
            </div>

            <label htmlFor="bio" className="mb-2 mt-4 block text-sm font-bold text-ink">Bio</label>
            <textarea
              id="bio"
              rows={3}
              defaultValue="Designer, coffee lover and weekend explorer."
              className={`${field} h-auto py-3`}
            />

            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" className="px-7">Cancel</Button>
              <Button type="submit" className="px-7">Save changes</Button>
            </div>
          </form>

          {/* Notifications */}
          <section id="notifications" className="rounded-[32px] bg-cream p-5 sm:p-7">
            <h2 className="text-2xl font-bold text-ink">Notifications</h2>
            <ul className="mt-5 space-y-5">
              {notificationOptions.map((opt) => (
                <li key={opt.id} className="flex items-center justify-between gap-4">
                  <label htmlFor={opt.id} className="cursor-pointer">
                    <span className="block font-bold text-ink">{opt.title}</span>
                    <span className="block text-sm text-muted">{opt.hint}</span>
                  </label>
                  <Toggle id={opt.id} defaultChecked={opt.on} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, type = "text", defaultValue }: { label: string; id: string; type?: string; defaultValue: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-ink">{label}</label>
      <input id={id} type={type} defaultValue={defaultValue} className={field} />
    </div>
  );
}

// A styled checkbox that looks like an on/off switch (CSS only, no state).
function Toggle({ id, defaultChecked }: { id: string; defaultChecked: boolean }) {
  return (
    <span className="relative inline-flex shrink-0">
      <input id={id} type="checkbox" role="switch" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="h-8 w-14 rounded-full bg-[#d8d6cc] transition peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-lilac" />
      <span className="pointer-events-none absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-6" />
    </span>
  );
}
