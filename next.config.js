/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Отключаем все индикаторы загрузки
    devIndicators: {
        buildActivity: false,
        buildActivityPosition: 'bottom-right',
    },
    // Отключаем индикатор сборки
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.devtool = false;
        }
        return config;
    }
}

module.exports = nextConfig 