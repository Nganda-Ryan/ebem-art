import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Helps clients detect version skew after a new deploy (Server Actions, RSC).
  deploymentId: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_DEPLOYMENT_ID,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "ebem-art.vercel.app",
        "*.vercel.app",
      ],
    },
  },
};

export default nextConfig;
