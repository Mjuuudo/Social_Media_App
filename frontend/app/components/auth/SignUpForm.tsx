"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export type SignUpData = {
  username: string;
  email: string;
  password: string;
};

type SignUpFormProps = {
  // Called with the typed values when the form is submitted.
  // The parent decides what happens (the API call is your logic).
  onSubmit: (data: SignUpData) => void | Promise<void>;
  // A message to show above the button, e.g. the backend's 409 text.
  error?: string;
  // Disables the button while the request is running.
  isLoading?: boolean;
};

const inputClass =
  "h-14 w-full rounded-2xl bg-field px-5 text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-lilac";

export default function SignUpForm({ onSubmit, error, isLoading = false }: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser from reloading the page
    onSubmit({ username, email, password });
  }

  return (
    <div>
      <Logo />

      <h1 className="mt-8 text-4xl font-extrabold text-ink">Create your account</h1>
      <p className="mt-2 text-muted">Join to share moments with your people.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-bold text-ink">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="yasmine.a"
            required
            minLength={5}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-muted">5 to 30 characters.</p>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-bold text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-2xl bg-rose/25 px-4 py-3 text-sm font-semibold text-[#7a1f3d]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full rounded-full bg-ink font-bold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/signin" className="font-bold text-link underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <path
        d="M24 3l6 6 8-1 3 8 7 5-4 7 1 8-8 2-5 7-8-3-8 3-5-7-8-2 1-8-4-7 7-5 3-8 8 1z"
        fill="#b8a5f0"
      />
      <circle cx="20" cy="22" r="3.5" fill="#8fd8b8" />
      <circle cx="29" cy="20" r="3.5" fill="#f4a6b8" />
      <circle cx="26" cy="29" r="3.5" fill="#f2c96b" />
    </svg>
  );
}