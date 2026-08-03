import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // ১. বাইরের কোনো ডোমেইন থেকে পিকচার লোড করতে (External Images)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
{
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Login Avatar-এর জন্য
      },
      // লোকাল ব্যাকএন্ড বা ডেভেলপমেন্টের জন্য (প্রয়োজন হলে অন করবেন)
      /*
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      */
    ],

    // ২. আধুনিক ও হালকা ইমেজের ফরম্যাট (স্মার্ট ব্রাউজারে দ্রুত লোড হওয়ার জন্য)
    formats: ["image/avif", "image/webp"],

    // ৩. ডিভাইস ব্রেকপয়েন্ট সাইজ (Responsive Layouts)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // ৪. <Image /> এর জন্য বিভিন্ন ইমেজ সাইজ (Image Breakpoints)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // ৫. সিকিউরিটি অন রেখে SVG ইমেজ এলাউ করতে চাইলে
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // ৬. অপটিমাইজড ইমেজের ক্যাশ ডিউরেশন (সেকেন্ডে)
    minimumCacheTTL: 60,
  },
};

export default nextConfig;