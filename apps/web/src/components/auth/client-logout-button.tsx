"use client";

import { useEffect, useState } from "react";
import { LogoutButton } from "./logout-button";

export function ClientLogoutButton({ show }: { show: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server
  if (!mounted) return null;

  // Only render the logout button if show is true
  return show ? <LogoutButton /> : null;
}