import api from "./http";

/**
 * Lista cargos com paginação
 * GET /cargos?page=&limit=
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<{docs: any[], totalDocs: number, page: number, totalPages: number}>}
 */
export async function listCargos(params = {}) {
  const { data } = await api.get("/cargos", { params });
  return data;
}

/**
 * Obtém um cargo por ID
 * GET /cargos/:id
 */
export async function getCargoById(id) {
  const { data } = await api.get(`/cargos/${id}`);
  return data;
}

/**
 * Cria cargo
 * POST /cargos
 * body: { nome }
 */
export async function createCargo(payload) {
  const { data } = await api.post("/cargos", payload);
  return data;
}

/**
 * Atualiza cargo
 * PUT /cargos/:id
 * body: { nome }
 */
export async function updateCargo(id, payload) {
  const { data } = await api.put(`/cargos/${id}`, payload);
  return data;
}

/**
 * Deleta cargo
 * DELETE /cargos/:id
 */
export async function deleteCargo(id) {
  const { data } = await api.delete(`/cargos/${id}`);
  return data;
}

/* --------- Helpers opcionais --------- */

/**
 * Retorna opções para <select> no formato { value: _id, label: nome }
 * ideal para popular o select de "cargo" no cadastro.
 */
export async function getCargoOptions() {
  const res = await listCargos({ page: 1, limit: 1000 });
  const docs = res?.docs || res; // compatível se o paginate estiver habilitado ou não
  return docs.map((c) => ({ value: c._id, label: c.nome }));
}
