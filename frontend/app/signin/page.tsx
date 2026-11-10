"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "../components/auth/AuthShell";
import SignInForm, { type SignInData } from "../components/auth/SignInForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function readDetail(body: unknown): string | null {
  return typeof body === "object" && body !== null && "detail" in body && typeof body.detail === "string"
    ? body.detail
    : null;
}

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignIn(data: SignInData) {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Required so the browser stores the httpOnly cookie the backend sets
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/");
        return;
      }
      if (response.status === 401) {
        const body: unknown = await response.json().catch(() => null);
        setError(readDetail(body) ?? "Invalid username/email or password");
        return;
      }
      if (response.status === 422) {
        setError("Please fill in both fields");
        return;
      }
      setError("Sign in failed, please try again");
    } catch {
      setError("Could not connect, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <SignInForm onSubmit={handleSignIn} error={error} isLoading={loading} />
    </AuthShell>
  );
}
