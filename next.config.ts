import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/ecommerce",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gdkfqcmhnzjxonuwonaw.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gdkfqcmhnzjxonuwonaw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;