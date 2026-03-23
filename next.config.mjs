/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
}

export default nextConfig
