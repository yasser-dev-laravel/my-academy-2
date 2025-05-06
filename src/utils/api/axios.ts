import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_HelpTable_URL = import.meta.env.VITE_API_HelpTable_URL;


const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // Optional: Set a timeout in milliseconds
});

// Add logging to verify if the token is being included in requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[AXIOS] Token included in request headers:", config.headers.Authorization); // Log the token
    } else {
      console.log("[AXIOS] No token found in localStorage"); // Log if no token is found
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove token and user from localStorage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
