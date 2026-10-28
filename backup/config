import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://gdkfqcmhnzjxonuwonaw.supabase.co", // Ganti dengan URL domain Supabase-mu
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
        protocol: 'https',
        hostname: 'gdkfqcmhnzjxonuwonaw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Tambahkan domain Supabase Storage kamu jika menyimpan gambar di Supabase:
      // {
      //   protocol: "https",
      //   hostname: "YOUR_SUPABASE_PROJECT_ID.supabase.co",
      // },
    ],
  },
};

export default nextConfig;