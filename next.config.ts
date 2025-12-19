import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "helmy-lms.t3.storage.dev",
        port: "",
        protocol: "https",
      },
    ],
  },
};
