import type { NextConfig } from "next";

const supabaseImagePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> =
  [];
try {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (raw) {
    const { hostname, protocol } = new URL(raw);
    if (hostname && (protocol === "https:" || protocol === "http:")) {
      supabaseImagePatterns.push({
        protocol: protocol === "https:" ? "https" : "http",
        hostname,
        pathname: "/storage/v1/object/public/**",
      });
    }
  }
} catch {
  /* URL invalide au build */
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    unoptimized: false,
    remotePatterns: [
      ...supabaseImagePatterns,
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
