import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer uses Node.js APIs that must run server-side only.
  // Marking it as an external package prevents Next.js from bundling it
  // into the client bundle, which would fail.
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },

  // Allow Vercel Blob hostnames in <Image> tags if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
