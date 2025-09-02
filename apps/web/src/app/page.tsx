"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page
    router.push("/login");
  }, [router]);
  
  return (
    <main className="grid h-svh place-items-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">mypass</h1>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </main>
  );
}