import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

/**
 * next/image refuses any host not listed here, and CMS portraits and partner
 * logos are served from the CMS itself. Evaluated at build time, so with
 * output: "standalone" a change of CMS host needs a rebuild.
 */
function cmsImageHost(): RemotePattern[] {
  const base = process.env.CMS_API_BASE_URL;
  if (!base) return [];
  try {
    const { protocol, hostname, port } = new URL(base);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        ...(port ? { port } : {}),
        pathname: "/**",
      },
    ];
  } catch {
    // A malformed URL must not break the build: the site falls back to its
    // bundled content, which uses no CMS images.
    return [];
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...cmsImageHost(),
    ],
  },
};

export default nextConfig;
