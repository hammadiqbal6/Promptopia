/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  webpack(config, { dev }) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "/etc/**",
          "/opt/**",
          "/root/**",
          "/run/**",
        ],
      };
    }

    return config;
  },
};

module.exports = nextConfig;
