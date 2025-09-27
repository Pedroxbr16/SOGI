// src/services/solicitacaoService.js
import api from "./http";

/**
 * Cria solicitação de cadastro
 * POST /solicitacoes/cadastro
 * body: { cpf, nome, cargo, email, senha }
 * resp: { _id, status: "pendente" }
 */
export async function createSignupRequest({ cpf, nome, cargo, email, senha }) {
  const { data } = await api.post("/solicitacoes/cadastro", {
    cpf, nome, cargo, email, senha,
  });
  return data;
}

/**
 * (ADMIN) Aprovar solicitação
 * POST /solicitacoes/:id/aprovar
 * resp: { message: "Aprovada", user }
 */
export async function approveRequest(id) {
  const { data } = await api.post(`/solicitacoes/${id}/aprovar`);
  return data;
}

/**
 * (ADMIN) Reprovar solicitação
 * POST /solicitacoes/:id/reprovar
 * resp: { message: "Reprovada" }
 */
export async function rejectRequest(id) {
  const { data } = await api.post(`/solicitacoes/${id}/reprovar`);
  return data;
}

/**
 * Listar solicitações
 * GET /solicitacoes?tipo=&aprovada=&page=&limit=
 */
export async function listSolicitacoes(params = {}) {
  const { data } = await api.get("/solicitacoes", { params });
  return data;
}

/**
 * Buscar solicitação por ID
 * GET /solicitacoes/:id
 */
export async function getSolicitacao(id) {
  const { data } = await api.get(`/solicitacoes/${id}`);
  return data;
}
