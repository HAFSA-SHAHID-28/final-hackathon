import axios from "axios";
import { getToken } from "../utils/auth";

const Api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

Api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default Api;