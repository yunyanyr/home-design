import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 忽略 eslint 检查
  },
  typescript: {
    ignoreBuildErrors: true, // 忽略 TypeScript 检查
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: ["d3cbeloe0vn1bb.cloudfront.net"],
  },
  reactStrictMode: false,
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       html2canvas: "html2canvas-pro",
  //     },
  //   },
  // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
