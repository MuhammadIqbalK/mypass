import Link from "next/link";
import { cookies } from "next/headers";
import { ModeToggle } from "./mode-toggle";
import { ClientLogoutButton } from "./auth/client-logout-button";
import { KeyRound } from 'lucide-react';

export default async function Header() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <KeyRound className="h-6 w-6" />
          <span>MyPass</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          <ClientLogoutButton show={!!sessionToken} />
        </div>
      </div>
    </header>
  );
}