"use client";

import AuthShell from "../components/auth/AuthShell";
import registerForm, { type registerData } from "../components/auth/registerForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function registerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleregister(data: registerData) {
    setError("");
    setLoading(true);
    try{
      const response= await fetch(`${API_URL}/api/auth/register`,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
        })
      if(response.status===201){
        router.push("/login");
        return;

      }

      if(response.status===409){
        const body= await response.json();
        setError(body.detail);
        return;
      }
      if(response.status===422){
        const body= await response.json();
        if(Array.isArray(body.detail)){
          setError(body.detail[0]?.msg ?? "Please check your email");
          return;

        }

      }
      setError("registration failed!")
    }catch{
      setError("could not connect!")
    }finally{
      setLoading(false)
    }
    // `data` already matches the backend's RegisterRequest:
    //   { username, first_name, last_name, email, password }

    // STEP 1: Reset the UI state
    //   - clear any previous error message
    //   - turn the loading flag on (disables the button)

    // STEP 2: Send the request (wrap steps 2–4 in try / catch / finally)
    //   - endpoint: POST `${API_URL}/api/auth/register`
    //     (router is mounted with prefix "/api/auth" in backend/app/main.py)
    //   - header:   "Content-Type": "application/json"
    //   - body:     JSON.stringify(data)

    // STEP 3: Handle success
    //   - status 201 → account created → redirect to "/login"

    // STEP 4: Handle the backend errors
    //   - 409 → username or email already taken.
    //           The body is { detail: "..." } with a string message → show it.
    //   - 422 → validation failed (a field broke a min/max length or the email is invalid).
    //           Here `detail` is an ARRAY of errors, each with `loc` and `msg`
    //           → show a friendly message (or build one from the first item).
    //   - anything else → show a generic "registration failed" message.

    // STEP 5: catch → network error (backend down / CORS) → show a "could not connect" message

    // STEP 6: finally → turn the loading flag off

    // void data; // remove this line once you use `data`
  }
  
  return (
    <AuthShell>
      <registerForm onSubmit={handleregister} error={error} isLoading={loading} />
    </AuthShell>
  );
}
