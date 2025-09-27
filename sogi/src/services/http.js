// src/services/http.js
import axios from "axios";

/**
 * Base URL:
 * - CRA: use REACT_APP_API_URL no .env
 * - Vite: use VITE_API_URL no .env
 */
const BASE_URL =process.env.REACT_APP_API_URL ;


const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // true se usar cookies/sessão no backend
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Token helpers ----
/** Define/Remove o Authorization Bearer em TODAS as requisições */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// ---- 401 handler (opcional) ----
let onUnauthorized = null;
/** Registra um callback global para 401 (ex.: fazer signOut()) */
export function setOnUnauthorized(handler) {
  onUnauthorized = typeof handler === "function" ? handler : null;
}

// ---- Interceptors (opcional) ----
api.interceptors.request.use(
  (config) => {
    // Evita cache agressivo em alguns navegadores/proxies
    config.headers["Cache-Control"] = "no-cache";
    config.headers.Pragma = "no-cache";
    config.headers.Expires = "0";
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && onUnauthorized) {
      try { onUnauthorized(); } catch {}
    }
    return Promise.reject(error);
  }
);

export default api;
