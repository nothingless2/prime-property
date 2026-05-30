import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.26.1', 'localhost'],
  serverExternalPackages: ['bcrypt'],
  images: {
    qualities: [25, 50, 75, 90, 100],
  },
};

export default nextConfig;
