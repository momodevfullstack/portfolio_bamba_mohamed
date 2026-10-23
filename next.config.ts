import type { NextConfig } from "next";

const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const basePath =
  repositoryName && repositoryName.toLowerCase() !== `${repositoryOwner.toLowerCase()}.github.io`
    ? `/${repositoryName}`
    : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
