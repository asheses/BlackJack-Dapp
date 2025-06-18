/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  basePath:"/BlackJack",
  reactStrictMode: true,
  images: {
    unoptimized: true, // 禁用图片优化以支持静态导出
  },
};
