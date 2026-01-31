import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: "..",
  },
  serverExternalPackages: [
    "@tanstack/react-query",
    "@trpc/client",
    "@trpc/react-query",
  ],
};

export default nextConfig;
