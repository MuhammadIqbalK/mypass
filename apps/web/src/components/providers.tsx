"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { TRPCProvider } from "@/lib/trpc-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TRPCProvider>
			{children}
			<Toaster richColors />
		</TRPCProvider>
	);
}
