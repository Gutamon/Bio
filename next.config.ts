import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Bio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
