/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d27antr5s0rchh.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d38jghde4qp76w.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "ads-atlantis-media.s3.us-east-1.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/tina",
        destination: "/tina-admin/index.html",
      },
    ];
  },
}

export default nextConfig
