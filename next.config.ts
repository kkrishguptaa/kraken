import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    remotePatterns: [
      // Google OAuth avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/@:username/:path*",
        destination: "/~/:username/:path*",
      },
      {
        source: "/@:username",
        destination: "/~/:username",
      },
      {
        source: "/~:username",
        destination: "/@/:username",
      },
    ];
  },
};

export default nextConfig;
