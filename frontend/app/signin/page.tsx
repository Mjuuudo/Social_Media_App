"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "../components/auth/AuthShell";
import loginForm, { type loginData } from "../components/auth/loginForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function readDetail(body: unknown): string | null {
  return typeof body === "object" && body !== null && "detail" in body && typeof body.detail === "string"
    ? body.detail
    : null;
}

export default function loginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlelogin(data: loginData) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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
        toast.error(readDetail(body) ?? "Invalid username/email or password");
        return;
      }
      if (response.status === 422) {
        toast.error("Please fill in both fields");
        return;
      }
      toast.error("Sign in failed, please try again");
    } catch {
      toast.error("Could not connect, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <loginForm onSubmit={handlelogin} isLoading={loading} />
    </AuthShell>
  );

}

