"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "../components/auth/AuthShell";
import LoginForm, { type LoginData } from "../components/auth/LoginForm";
import { Login } from "../lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function readDetail(body: unknown): string | null {
  return typeof body === "object" && body !== null && "detail" in body && typeof body.detail === "string"
    ? body.detail
    : null;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(data: LoginData) {
    setLoading(true);
    try {
      // TODO: replace this fetch with apiFetch("/api/auth/login", { ... }) from "@/app/lib/api"
      //       (apiFetch adds API_URL and credentials: "include"); the local API_URL constant can then be removed.

      const response = await Login ( data );

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
      <LoginForm onSubmit={handleLogin} isLoading={loading} />
    </AuthShell>
  );

}

