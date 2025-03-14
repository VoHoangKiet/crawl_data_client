const urls = {
    production: {
        dataURL: 'http://localhost:8000',
    },
    development: {
        dataURL: 'http://localhost:8000',
    },
};

const isDev = import.meta.env.MODE === 'development';
const { production, development } = urls;
export const appUrls = isDev ? development : production;
