"use client"

import { useEffect, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { PersonAvatar } from "../../components/ui/Avatar";
import { Button, NotificationBell } from "../../components/ui/Controls";
import { me } from "../../lib/mock";
import { getInitials, loadProfile, loadSettings, modifySettings, type User, type UserSettings } from "@/app/lib/auth";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { toast } from "sonner";
import { modifyProfile } from "@/app/lib/auth";



const sections = ["Account", "Privacy", "Notifications", "Appearance", "Security"];

// Labels for each notification setting. `id` is the backend field name, and the
// on/off value comes from the `settings` state (loaded from GET /api/auth/settings).
type NotificationKey = Exclude<keyof UserSettings, "user_id">;

const notificationOptions: { id: NotificationKey; title: string; hint: string }[] = [
  { id: "notify_reactions", title: "Likes and reactions", hint: "When someone reacts to your posts" },
  { id: "notify_comments", title: "Comments and mentions", hint: "Replies, tags and @mentions" },
  { id: "notify_follows", title: "New followers", hint: "When someone starts following you" },
  { id: "notify_messages", title: "Messages", hint: "When someone sends you a message" },
  { id: "weekly_digest", title: "Weekly digest", hint: "A Sunday summary of what you missed" },
];

const field =
  "h-12 w-full rounded-2xl border border-[#e6e8ef] bg-white px-4 text-ink outline-none focus:ring-2 focus:ring-lilac";

export default function SettingsPage() {

  const [user, setUser ] = useState<User | null>(null);
  const [settings, setSettings ] = useState<UserSettings | null>(null);
  const router = useRouter( )


  useEffect ( ( ) => {
    const importUserData = async ( ) => {
      const response: Response = await loadProfile ( );

      if ( response.status === 401 ) {
        router.push("/login");
        return ;
      }
      if ( !response.ok ){
        return ;
      }

      const data: User = await response.json();
      if ( !data ) {
        return ;
      }
      console.log(data)
      setUser(data);

    }




    const importSettings = async ( ) => {
      const response: Response = await loadSettings ( );

      if ( !response.ok ) {
        return ;
      }

      const data: UserSettings = await response.json();
      setSettings(data);
    }

    importUserData();
    importSettings();
  }, [])


  // Saves one notification switch right away (PATCH /api/auth/settings).
  // The switch flips immediately, and flips back if the request fails.
  async function handleToggle ( key: NotificationKey, on: boolean ) {
    setSettings((s) => (s ? { ...s, [key]: on } : s));

    const response = await modifySettings({ [key]: on });

    if ( response.status === 401 ) {
      router.push("/login");
      return ;
    }
    if ( !response.ok ) {
      setSettings((s) => (s ? { ...s, [key]: !on } : s));
      toast.error("Couldn't save your notification settings");
    }
  }

  // Called on "Save changes" with the Account form's data (read values with form.get("first_name"), ...).
  async function handleChanges ( form: FormData ) {
    const first_name = String(form.get("first_name") ?? "").trim();
    const last_name  = String(form.get("last_name") ?? "").trim();
    const location   = String(form.get("location") ?? "").trim() || null;
    const bio        = String(form.get("bio") ?? "").trim() || null;
   

    const body = {
      ...(first_name !== user?.first_name && { first_name }),
      ...(last_name  !== user?.last_name  && { last_name }),
      ...(location   !== user?.location   && { location }),
      ...(bio        !== user?.bio        && { bio }),
    };

    if ( !Object.keys(body).length) {
      toast.info("No Fields Were Changed")
      return ;
    }
    
    const response = await modifyProfile(body);

    if (response.status === 401 ) {
      router.push("/login");
      return ;
    }

    if( !response.ok ) {
      toast.error("Error happend While Modifying the Profile");
      return ;
    }
    
    toast.info("Changes Saved Successfully")
    console.log(body);
  }



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
          {/* key remounts the form once the profile loads, so defaultValue picks up the real data */}
          <form id="account" key={user?.id ?? "loading"} onSubmit={(event) => { event.preventDefault(); handleChanges(new FormData(event.currentTarget)); }} className="rounded-[32px] bg-field p-5 sm:p-7">
            <h2 className="text-2xl font-bold text-ink">Account</h2>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <PersonAvatar person={{ initials: getInitials(user), color: me.color }} size="lg" className="h-20 w-20 text-2xl" />
              <Button>Change photo</Button>
              <Button variant="outline">Remove</Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Field label="First name" id="first_name" defaultValue={user?.first_name ?? ""} placeholder="Your first name" />
              <Field label="Last name" id="last_name" defaultValue={user?.last_name ?? ""} placeholder="Your last name" />
              <Field label="Location" id="location" defaultValue={user?.location ?? ""} placeholder="Location not specified" />
              <Field label="Username" id="username" defaultValue={user ? `@${user.username}` : ""}  />
              <Field label="Email" id="email" type="email" defaultValue={user?.email ?? ""} />
            </div>

            <label htmlFor="bio" className="mb-2 mt-4 block text-sm font-bold text-ink">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className={`${field} h-auto py-3`}
              defaultValue={user?.bio ?? ""}
              placeholder="You don't have a bio yet, write one"
            />

            <div className="mt-5 flex justify-end gap-3">
              <Link href="/" className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-ink bg-transparent px-7 text-sm font-bold text-ink transition hover:bg-ink/5">Cancel</Link>
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
                  <Toggle
                    id={opt.id}
                    checked={settings?.[opt.id] ?? false}
                    disabled={!settings}
                    onChange={(on) => handleToggle(opt.id, on)}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, type = "text", defaultValue, placeholder }: { label: string; id: string; type?: string; defaultValue: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-ink">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={field}
      />
    </div>
  );
}

// A styled checkbox that looks like an on/off switch. Its value is controlled by the parent.
function Toggle({ id, checked, disabled = false, onChange }: { id: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
  return (
    // A <label> (not a <span>) so clicking the visible switch toggles the hidden checkbox.
    <label className={`relative inline-flex shrink-0 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="h-8 w-14 rounded-full bg-[#d8d6cc] transition peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-lilac" />
      <span className="pointer-events-none absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-6" />
    </label>
  );
}
