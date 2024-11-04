// src/config/index.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  environment: import.meta.env.MODE, // 'development' or 'production'
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
};

export default config;
