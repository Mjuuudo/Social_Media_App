"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "../components/auth/AuthShell";
import RegisterForm, { type RegisterData } from "../components/auth/RegisterForm";
import { Register } from "../lib/auth"





// 409 → { detail: "..." }; 422 → { detail: [{ loc, msg }, ...] }
function readDetail(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("detail" in body)) return null;
  const { detail } = body;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const first: unknown = detail[0];
    if (typeof first === "object" && first !== null && "msg" in first && typeof first.msg === "string") {
      return first.msg;
    }
  }
  return null;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(data: RegisterData) {
    setLoading(true);
    try {
      const response = await Register( data );

      if (response.status === 201) {
        toast.success("Account created, you can sign in now");
        router.push("/signin");
        return;
      }
      if (response.status === 409 || response.status === 422) {
        const body: unknown = await response.json().catch(() => null);
        toast.error(readDetail(body) ?? "Please check your details");
        return;
      }
      toast.error("Registration failed, please try again");
    } catch {
      toast.error("Could not connect, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <RegisterForm onSubmit={handleRegister} isLoading={loading} />
    </AuthShell>
  );
}
