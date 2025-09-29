// src/services/contractService.js
import http from "./http";

/**
 * Modelo esperado pelo backend:
 * {
 *   empresa: string,
 *   machine: string[],
 *   status: string,        // ObjectId de StatusContract
 *   coordenador: string,   // ObjectId de User
 *   vencimento: string|Date,
 *   localizacao?: string
 * }
 */

const base = "/contracts"; // se sua API estiver sob /api, use "/api/contracts"

export async function listContracts(params = {}) {
  const { data } = await http.get(base, { params });
  return data; // pode ser array simples ou {docs, totalDocs...} se paginado
}

export async function getContractById(id) {
  if (!id) throw new Error("id é obrigatório");
  const { data } = await http.get(`${base}/${id}`);
  return data;
}

export async function createContract(payload) {
  if (!payload?.empresa) throw new Error("Campo 'empresa' é obrigatório");
  if (!Array.isArray(payload?.machine)) throw new Error("Campo 'machine' deve ser um array");
  if (!payload?.status) throw new Error("Campo 'status' é obrigatório");
  if (!payload?.coordenador) throw new Error("Campo 'coordenador' é obrigatório");
  if (!payload?.vencimento) throw new Error("Campo 'vencimento' é obrigatório");

  const body = {
    empresa: String(payload.empresa).trim(),
    machine: payload.machine.map(String),
    status: String(payload.status),
    coordenador: String(payload.coordenador),
    vencimento: payload.vencimento,         // string ISO "YYYY-MM-DD" ou Date
    ...(payload.localizacao ? { localizacao: String(payload.localizacao).trim() } : {}),
  };

  const { data } = await http.post(base, body);
  return data;
}

export async function updateContract(id, patch = {}) {
  if (!id) throw new Error("id é obrigatório");

  const body = {};
  if (patch.empresa != null) body.empresa = String(patch.empresa).trim();
  if (patch.machine != null) body.machine = Array.isArray(patch.machine) ? patch.machine.map(String) : [];
  if (patch.status != null) body.status = String(patch.status);
  if (patch.coordenador != null) body.coordenador = String(patch.coordenador);
  if (patch.vencimento != null) body.vencimento = patch.vencimento;
  if (patch.localizacao != null) body.localizacao = String(patch.localizacao).trim();

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
