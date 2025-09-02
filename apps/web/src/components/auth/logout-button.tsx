"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/login");
      router.refresh(); // To ensure server state is updated
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
