"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Logo from "./Logo";

// Mirrors the backend's RegisterRequest (backend/app/schemas/user.py).
// Keys are snake_case so the object can be sent to the API as-is.
export type registerData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type registerFormProps = {
  // Called with the typed values when the form is submitted.
  // The parent decides what happens (the API call is your logic).
  onSubmit: (data: registerData) => void | Promise<void>;
  // A message to show above the button, e.g. the backend's 409 text.
  error?: string;
  // Disables the button while the request is running.
  isLoading?: boolean;
};

const inputClass =
  "h-14 w-full rounded-2xl bg-field px-5 text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-lilac";

const labelClass = "mb-2 block text-sm font-bold text-ink";
const hintClass = "mt-1.5 text-xs text-muted";

export default function registerForm({ onSubmit, error, isLoading = false }: registerFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser from reloading the page
    onSubmit({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
  }

  return (
    <div>
      <Logo />

      <h1 className="mt-8 text-4xl font-extrabold text-ink">Create your account</h1>
      <p className="mt-2 text-muted">Join to share moments with your people.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* First + last name side by side on wider screens */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className={labelClass}>
              First name
            </label>
            <input
              id="first_name"
              type="text"
              autoComplete="given-name"
              placeholder="Yasmine"
              required
              minLength={2}
              maxLength={26}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
            />
            <p className={hintClass}>2 to 26 characters.</p>
          </div>

          <div>
            <label htmlFor="last_name" className={labelClass}>
              Last name
            </label>
            <input
              id="last_name"
              type="text"
              autoComplete="family-name"
              placeholder="Alaoui"
              required
              minLength={2}
              maxLength={26}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
            />
            <p className={hintClass}>2 to 26 characters.</p>
          </div>
        </div>

        <div>
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="yasmine.a"
            required
            minLength={2}
            maxLength={40}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
          <p className={hintClass}>2 to 40 characters.</p>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <p className={hintClass}>8 to 128 characters.</p>
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
        <Link href="/login" className="font-bold text-link underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
