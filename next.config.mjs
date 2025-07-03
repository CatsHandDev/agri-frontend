/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // unoptimized: true, // 開発環境でのみ使う場合は削除 (本番では最適化したい)
    remotePatterns: [
      // ローカル開発用
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      // Render デプロイ用
      {
        protocol: 'https', // Render は HTTPS を提供
        hostname: "https://agri-backend-fsry.onrender.com",
        port: '', // HTTPS のデフォルトポートなので空文字
        pathname: '/media/**',
      },
    ],
  },
};
export default nextConfig;