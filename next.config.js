/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true, // 禁用图片优化以支持静态导出
  },
};
