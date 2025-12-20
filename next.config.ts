import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "helmy-lms.t3.storage.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;