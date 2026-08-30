import axios from "axios";
import { getToken } from "../utils/auth";

const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const baseURL = rawUrl.replace(/\/+$/, "").endsWith("/api")
  ? rawUrl.replace(/\/+$/, "")
  : `${rawUrl.replace(/\/+$/, "")}/api`;

const Api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;