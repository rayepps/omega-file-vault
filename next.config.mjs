/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.IS_FLEEK ? 'export' : undefined,
    reactStrictMode: true,
};

export default nextConfig;
