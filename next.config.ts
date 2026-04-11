import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Vibe",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
