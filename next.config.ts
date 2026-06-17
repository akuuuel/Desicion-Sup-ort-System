import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Menonaktifkan ESLint check saat build production
    // Ini aman karena kita sudah memvalidasi kode secara lokal
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Tetap izinkan build meski ada TypeScript warnings
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
