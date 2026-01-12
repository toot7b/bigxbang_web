import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
