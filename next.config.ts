import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Allow Clerk images
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com", // Add more domains if needed
      },
    ],
  },
};

export default nextConfig;
