import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	async rewrites() {
		return [
			{
				source: "/api/trpc/:path*",
				destination: "http://localhost:3000/trpc/:path*",
			},
		];
	},
};

export default nextConfig;
