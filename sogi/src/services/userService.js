// src/services/userService.js
import api, { setAuthToken } from "./http";

/**
 * Login: POST /auth/login
 * body: { email, senha }
 * resp: { token, user }
 */
export async function login({ email, senha }) {
  const { data } = await api.post("/auth/login", { email, senha });
  const { token, user } = data || {};
  // injeta o token para as próximas chamadas
  setAuthToken(token);
  return { token, user };
}

/**
 * Logout só limpa o header Authorization (opcional).
 * Obs.: ajuste se usar endpoint de logout no backend.
 */
export function logout() {
  setAuthToken(null);
}

/* ---- (opcionais, caso tenha endpoints no seu backend) ---- */

// Busca usuário por id (GET /users/:id)
export async function getUserById(id) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

// Lista usuários (GET /users?page=&limit=)
export async function getUsers(params = {}) {
  const { data } = await api.get("/users", { params });
  return data;
}
