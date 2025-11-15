/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/inquiry",
        destination: `${process.env.API_URL}/api/inquiry`,
      },
    ];
  },
};

console.log("👉 API_URL =", process.env.API_URL);

export default nextConfig;
