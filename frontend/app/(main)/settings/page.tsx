
"use client";

import PageHeader from "../../components/layout/PageHeader";
import { PersonAvatar } from "../../components/ui/Avatar";
import { Button, NotificationBell } from "../../components/ui/Controls";
import React, { useEffect, useRef, useState } from "react";

const sections = ["Account", "Privacy", "Notifications", "Appearance", "Security"];

const notificationOptions = [
  { id: "likes", title: "Likes and reactions", hint: "When someone reacts to your posts", on: true },
  { id: "comments", title: "Comments and mentions", hint: "Replies, tags and @mentions", on: true },
  { id: "followers", title: "New followers", hint: "When someone starts following you", on: false },
  { id: "digest", title: "Weekly digest", hint: "A Sunday summary of what you missed", on: true },
];

const field =
  "h-12 w-full rounded-2xl border border-[#e6e8ef] bg-white px-4 text-ink outline-none focus:ring-2 focus:ring-lilac";

const API = "http://localhost:8000";

type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  joined_at: Date;
  location: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
};

export default function SettingsPage() {
  const [user, setUser] = useState<User>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatar,setAvatar]=useState<File | null>(null);
  const [avatarPreview,setAvatarPreview]= useState<string | null>(null);
  const fileInputRef=useRef<HTMLInputElement>(null);


  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to load user: ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Could not load your account.");
      }
    }

    load();
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);

    const updates = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      username: formData.get("username"),
      headline: formData.get("headline"),
      location: formData.get("location"),
      bio: formData.get("bio"),
    };

    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      // if (!res.ok) {
      //   const data = await res.json().catch(() => null);
      //   throw new Error(
      //     data?.detail
      //       ? JSON.stringify(data.detail)
      //       : `Failed to save: ${res.status}`
      //   );
      // }

      // const savedUser = await res.json();

      // setUser((previous) =>
      //   previous ? { ...previous, ...savedUser } : previous
      // );
      let updatedUser=await res.json();
      if(avatar){
        const avatarData= new FormData();
        avatarData.append("file",avatar);
        const avatarRes= await fetch(`${API}/api/users/me/avatar`,{
          method:"POST",
          credentials:"include",
          body: avatarData,
        });
        if(!avatarRes.ok){
          const data= await avatarRes.json().catch(()=>null);
          throw new Error(data?.detail || "Failed to upload avatar");
        }
        updatedUser= await avatarRes.json();
      }
      setUser((previous)=>
        previous ? {...previous,...updatedUser}: previous);
      setAvatar(null)
      setAvatarPreview(null);

      setMessage("Changes saved successfully!");
      
      setMessage("Changes saved successfully!");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <p className="p-6">{error || "Loading your settings..."}</p>;
  }
  
  function handleFileChange(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file))
    
  }

  return (
    <div>
      <PageHeader title="Settings">
        <NotificationBell />
      </PageHeader>

      <div className="mt-6 grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:px-0"
        >
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
          <form
            id="account"
            onSubmit={handleSave}
            className="rounded-[32px] bg-field p-5 sm:p-7"
          >
            <h2 className="text-2xl font-bold text-ink">Account</h2>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <PersonAvatar
                person={{
                  initials: `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase(),
                  color: "#f4cd6b",
                }}
                size="lg"
                className="h-20 w-20 text-2xl"
                imageUrl={avatarPreview ?? user.avatar_url}
              />
              <input type="file" accept="image/jpeg,image/png,image/webp"  ref={fileInputRef} onChange={handleFileChange} hidden/>
              <Button type="button" onClick={()=>fileInputRef.current?.click()} >Change photo</Button>
              <Button type="button" variant="outline">Remove</Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Field label="First name" id="first_name" defaultValue={user.first_name} />
              <Field label="Last name" id="last_name" defaultValue={user.last_name} />
              <Field label="Username" id="username" defaultValue={user.username} />
              <Field label="Headline" id="headline" defaultValue={user.headline} />
              <Field label="Email" id="email" type="email" defaultValue={user.email}  />
              <Field label="Location" id="location" defaultValue={user.location ?? ""} />
            </div>

            <label
              htmlFor="bio"
              className="mb-2 mt-4 block text-sm font-bold text-ink"
            >
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={user.bio ?? ""}
              className={`${field} h-auto py-3`}
            />

            {message && (
              <p className="mt-4 text-sm text-green-700">{message}</p>
            )}

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <Button
                type="submit"
                variant="outline"
                className="px-7"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="px-7"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>

          {/* Notifications */}
          <section
            id="notifications"
            className="rounded-[32px] bg-cream p-5 sm:p-7"
          >
            <h2 className="text-2xl font-bold text-ink">Notifications</h2>

            <ul className="mt-5 space-y-5">
              {notificationOptions.map((opt) => (
                <li
                  key={opt.id}
                  className="flex items-center justify-between gap-4"
                >
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

function Field({
  label,
  id,
  type = "text",
  defaultValue,
  disabled = false,
}: {
  label: string;
  id: string;
  type?: string;
  defaultValue: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-ink"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`${field} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      />
    </div>
  );
}

function Toggle({
  id,
  defaultChecked,
}: {
  id: string;
  defaultChecked: boolean;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <input
        id={id}
        type="checkbox"
        role="switch"
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="h-8 w-14 rounded-full bg-[#d8d6cc] transition peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-lilac" />
      <span className="pointer-events-none absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-6" />
    </span>
  );
}
