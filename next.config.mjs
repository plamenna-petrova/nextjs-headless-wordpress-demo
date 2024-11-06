/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: 'wordpress.local',
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: 'localhost',
                port: "",
                pathname: "/**",
            }
        ],
    },
};

export default nextConfig;
