/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  devIndicators: false,
  ...(isGitHubPages ? {
    output: 'export',
    basePath: '/Portfolio-Glwadys',
    trailingSlash: true,
  } : {
    async redirects() {
      return [{ source: '/', destination: '/fr', permanent: false }];
    },
  }),
  images: {
    unoptimized: isGitHubPages,
    formats: ['image/avif', 'image/webp'],
  },
};
export default nextConfig;
