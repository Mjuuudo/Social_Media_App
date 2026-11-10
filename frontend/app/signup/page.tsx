"use client";

import AuthShell from '../components/auth/AuthShell' ;
import SignUpForm, { type SignUpData } from '../components/auth/SignUpForm';
import { useState} from 'react';
import {useRouter} from "next/navigation";

const API_URL=process.env.NEXT_PUBLIC_API_URL ;

export default function SignUpPage() {
   const [loading,setLoading]=useState(false);
    const [error,setError]=useState('');
    const router=useRouter();
   async function handleSignUp(data: SignUpData) {
      setError('');
      setLoading(true);
      try{
        const response = await fetch(`${API_URL}/auth/register`,{
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(data)
        });

        if(response.status===201){
          router.push("/signin");
          return;}
        if(response.status===409){
          const body:unknown =await response.json().catch(()=>null);
         const serverMessage =
            typeof body === "object" &&
             body !== null &&
             "detail" in body &&
             typeof body.detail === "string"
           ? body.detail: "Username or email already in use";
          setError(serverMessage);
          return
        }
        if(response.status===422){
          setError("please check your detail");
          return
        }
        setError("registration failed please try again");
      }catch{
        setError("could not connect please try again")
      }finally{
        setLoading(false);
      }
        
    console.log("sign-up submitted for", data.email);
  }

  return (
    <AuthShell>
      <SignUpForm onSubmit={handleSignUp}
      error={error}
      isLoading={loading} />
    </AuthShell>
  );
}