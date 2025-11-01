// API Configuration
// For remote access, use the server's public IP
// For local development, use localhost

const isProduction = import.meta.env.PROD;
const API_BASE_URL = isProduction
  ? 'http://37.60.249.62:3001'  // Remote access URL
  : 'http://localhost:3001';     // Local development URL

export const API_URL = API_BASE_URL;
