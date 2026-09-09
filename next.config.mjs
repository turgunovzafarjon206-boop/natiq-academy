/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Docker uchun optimallashtirilgan build
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
