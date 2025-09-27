// src/services/contractService.js
import http from "./http";

/**
 * Contrato
 * {
 *   nome: string,
 *   machine: string[],           // ex.: ["Guindaste (100-06)", "Empilhadeira (ED10-16)"]
 *   status: string,              // ObjectId de StatusContract
 *   coordenador: string,         // ObjectId de User
 *   vencimento: string|Date      // "YYYY-MM-DD"
 * }
 */

const base = "/contracts";

export async function listContracts(params = {}) {
  // params: { page, limit, search, sort } – use o que seu backend aceitar
  const { data } = await http.get(base, { params });
  return data;
}

export async function getContractById(id) {
  if (!id) throw new Error("id é obrigatório");
  const { data } = await http.get(`${base}/${id}`);
  return data;
}

export async function createContract(payload) {
  // validação básica
  if (!payload?.nome) throw new Error("Campo 'nome' é obrigatório");
  if (!Array.isArray(payload?.machine)) throw new Error("Campo 'machine' deve ser um array");
  if (!payload?.status) throw new Error("Campo 'status' é obrigatório");
  if (!payload?.coordenador) throw new Error("Campo 'coordenador' é obrigatório");
  if (!payload?.vencimento) throw new Error("Campo 'vencimento' é obrigatório");

  const body = {
    nome: String(payload.nome).trim(),
    machine: payload.machine.map(String),
    status: String(payload.status),
    coordenador: String(payload.coordenador),
    vencimento: payload.vencimento, // string ISO "YYYY-MM-DD" ou Date
  };

  const { data } = await http.post(base, body);
  return data;
}

export async function updateContract(id, patch) {
  if (!id) throw new Error("id é obrigatório");
  const body = {};
  if (patch?.nome != null) body.nome = String(patch.nome).trim();
  if (patch?.machine != null) body.machine = Array.isArray(patch.machine) ? patch.machine.map(String) : [];
  if (patch?.status != null) body.status = String(patch.status);
  if (patch?.coordenador != null) body.coordenador = String(patch.coordenador);
  if (patch?.vencimento != null) body.vencimento = patch.vencimento;

  const { data } = await http.put(`${base}/${id}`, body);
  return data;
}

export async function deleteContract(id) {
  if (!id) throw new Error("id é obrigatório");
  const { data } = await http.delete(`${base}/${id}`);
  return data;
}

export default {
  list: listContracts,
  getById: getContractById,
  create: createContract,
  update: updateContract,
  remove: deleteContract,
};
