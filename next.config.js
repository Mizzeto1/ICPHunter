/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.licdn.com" },
      { protocol: "https", hostname: "**.apollo.io" },
    ],
  },
};

module.exports = nextConfig;
