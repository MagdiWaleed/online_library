import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gutenberg.org",
      "covers.openlibrary.org",
    ],
  },
};

export default nextConfig;
