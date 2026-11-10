"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Logo from "./Logo";

export type SignInData = {
  // Username or email
  login: string;
  password: string;
};

type SignInFormProps = {
  onSubmit: (data: SignInData) => void | Promise<void>;
  error?: string;
  isLoading?: boolean;
};

const inputClass =
  "h-14 w-full rounded-2xl bg-field px-5 text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-lilac";

export default function SignInForm({ onSubmit, error, isLoading = false }: SignInFormProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ login: login.trim(), password });
  }

  return (
    <div>
      <Logo />

      <h1 className="mt-8 text-4xl font-extrabold text-ink">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to catch up with your people.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login" className="mb-2 block text-sm font-bold text-ink">
            Username or email
          </label>
          <input
            id="login"
            type="text"
            autoComplete="username"
            placeholder="yasmine.a or you@example.com"
            required
            maxLength={50}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
            autoComplete="current-password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* UI only: not connected to anything yet */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 text-ink">
            <input type="checkbox" name="remember" defaultChecked className="h-5 w-5 accent-ink" />
            Remember me
          </label>
          <a href="#" className="font-semibold text-link underline">
            Forgot password?
          </a>
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
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4 text-xs text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-[#e6e8ef]" /> or <span className="h-px flex-1 bg-[#e6e8ef]" />
      </div>

      {/* UI only: not connected to anything yet */}
      <button
        type="button"
        className="h-14 w-full rounded-full border border-ink font-bold text-ink transition hover:bg-field"
      >
        Send me a magic link
      </button>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-bold text-link underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
