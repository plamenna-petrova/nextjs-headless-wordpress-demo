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
        ],
    },
};

export default nextConfig;
