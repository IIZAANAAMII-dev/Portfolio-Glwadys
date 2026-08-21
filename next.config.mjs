/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  // Le badge de dev pollue les captures de QA visuel.
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Le layout racine vit dans [locale] pour porter le bon `lang`.
  // La racine redirige donc vers la langue par défaut.
  async redirects() {
    return [{ source: '/', destination: '/fr', permanent: false }];
  },
};

export default nextConfig;
