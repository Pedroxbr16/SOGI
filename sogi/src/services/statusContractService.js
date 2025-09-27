// src/services/statusContractService.js
import http from "./http";

/**
 * StatusContract
 * {
 *   nome: string
 * }
 */

const base = "/status-contract";

export async function listStatusContracts(params = {}) {
  const { data } = await http.get(base, { params });
  return data;
}

export async function getStatusContractById(id) {
  if (!id) throw new Error("id é obrigatório");
  const { data } = await http.get(`${base}/${id}`);
  return data;
}

export async function createStatusContract(payload) {
  if (!payload?.nome) throw new Error("Campo 'nome' é obrigatório");
  const { data } = await http.post(base, { nome: String(payload.nome).trim() });
  return data;
}

export async function updateStatusContract(id, patch) {
  if (!id) throw new Error("id é obrigatório");
  const body = {};
  if (patch?.nome != null) body.nome = String(patch.nome).trim();
  const { data } = await http.put(`${base}/${id}`, body);
  return data;
}

export async function deleteStatusContract(id) {
  if (!id) throw new Error("id é obrigatório");
  const { data } = await http.delete(`${base}/${id}`);
  return data;
}

export default {
  list: listStatusContracts,
  getById: getStatusContractById,
  create: createStatusContract,
  update: updateStatusContract,
  remove: deleteStatusContract,
};
