import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "sandbox.enta.dev",
      }
    ],
  },
};

export default nextConfig;
