import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true // Required for Telegram Mini Apps
  }
};

export default nextConfig;
