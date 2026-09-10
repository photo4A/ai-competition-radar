import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "aivs.one" },
      { protocol: "https", hostname: "**.aivs.one" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "challengepost-s3-challengepost.netdna-ssl.com" },
      { protocol: "https", hostname: "devpost-challengepost.netdna-ssl.com" },
      { protocol: "https", hostname: "d2r80wdbkwti6l.cloudfront.net" },
      { protocol: "https", hostname: "d112y698adiu2z.cloudfront.net" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
};

export default nextConfig;
