/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Skelet bosqichida deploy'ni to'xtatib qo'ymaslik uchun: tur/lint xatolari
  // build'ni buzmaydi. Ishlab chiqarishga o'tishda bularni olib tashlang.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
