const urls = {
    production: {
        dataURL: 'https://crawlapi.vercel.app',
    },
    development: {
        dataURL: 'https://crawlapi.vercel.app',
    },
};

const isDev = import.meta.env.MODE === 'development';
const { production, development } = urls;
export const appUrls = isDev ? development : production;
