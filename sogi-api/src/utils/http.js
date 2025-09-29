// src/utils/http.js

/**
 * Responde com sucesso (status default 200).
 * Ex.: ok(res, 201, novoRegistro)
 */
export function ok(res, status = 200, payload = {}) {
  return res.status(status).json(payload);
}

/**
 * Responde com erro (status default 500).
 * Ex.: fail(req, res, 400, "Mensagem de erro")
 */
export function fail(_req, res, status = 500, message = "Erro") {
  return res.status(status).json({ message });
}

/**
 * pick: seleciona/filtra apenas campos permitidos do body
 * Ajuste a lista de campos conforme seu schema.
 */
export function pick(obj = {}, allowed = [
  "empresa",
  "machine",
  "status",
  "coordenador",
  "vencimento",
  "localizacao",
]) {
  const out = {};
  for (const k of allowed) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}
