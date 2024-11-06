// frontend/src/api/axios.js
import axios from 'axios';

if (!import.meta.env.VITE_API_URL) {
  console.error('VITE_API_URL is not defined in environment variables');
}

// Add /api to baseURL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor
// Add a request interceptor for JWT token

api.interceptors.request.use(
  (request) => {
    // Log the request for debugging
    console.log('Starting Request:', {
      url: request.url,
      baseURL: request.baseURL,
      method: request.method,
    });

    const token = localStorage.getItem('token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Successful response:', response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', "::" + error.message);
    }
    return Promise.reject(error);
  }
);


export default api;

