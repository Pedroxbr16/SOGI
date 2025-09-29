// src/controllers/contractController.js
import Contract from "../models/contractModel.js";
import { saveAccessLog, saveErrorLog, saveActionLog } from "../utils/services/logs.js";
import { ok, fail, pick } from "../utils/http.js"; // <-- importa os helpers

// Campos permitidos para criar/atualizar
const ALLOWED_FIELDS = [
  "empresa",
  "machine",
  "status",
  "coordenador",
  "vencimento",
  "localizacao", // opcional no schema, mas aceita caso venha
];

export async function createContract(req, res) {
  try {
    const data = pick(req.body, ALLOWED_FIELDS);
    const created = await Contract.create(data);
    await saveActionLog(req, `Criado contrato ${created._id}`);
    return ok(res, 201, created);
  } catch (err) {
    if (err?.code === 11000) {
      const dupField = Object.keys(err.keyPattern || {})[0] || "campo";
      await saveErrorLog(req, `Valor duplicado para ${dupField}`);
      return ok(res, 400, { message: `Valor duplicado para ${dupField}` });
    }
    await saveErrorLog(req, `Erro ao criar contrato: ${err.message}`);
    return fail(req, res, 400, `Erro ao criar contrato: ${err.message}`);
  }
}

export async function getContracts(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Listar contratos");
    const contracts = await Contract.find().lean();
    return ok(res, 200, contracts);
  } catch (err) {
    await saveErrorLog(req, `Erro ao listar contratos: ${err.message}`);
    return fail(req, res, 500, `Erro ao listar contratos: ${err.message}`);
  }
}

export async function getContractById(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Buscar contrato por ID");
    const doc = await Contract.findById(req.params.id).lean();
    if (!doc) return ok(res, 404, { message: "Contrato nao encontrado" });
    return ok(res, 200, doc);
  } catch (err) {
    await saveErrorLog(req, `Erro ao buscar contrato por ID: ${err.message}`);
    return fail(req, res, 500, `Erro ao buscar contrato por ID: ${err.message}`);
  }
}

export async function updateContract(req, res) {
  try {
    const payload = pick(req.body, ALLOWED_FIELDS);
    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!updated) return ok(res, 404, { message: "Contrato nao encontrado" });
    await saveActionLog(req, `Atualizado contrato ${updated._id}`);
    return ok(res, 200, updated);
  } catch (err) {
    if (err?.code === 11000) {
      const dupField = Object.keys(err.keyPattern || {})[0] || "campo";
      await saveErrorLog(req, `Valor duplicado para ${dupField}`);
      return ok(res, 400, { message: `Valor duplicado para ${dupField}` });
    }
    await saveErrorLog(req, `Erro ao atualizar contrato: ${err.message}`);
    return fail(req, res, 400, `Erro ao atualizar contrato: ${err.message}`);
  }
}

export async function deleteContract(req, res) {
  try {
    const deleted = await Contract.findByIdAndDelete(req.params.id);
    if (!deleted) return ok(res, 404, { message: "Contrato nao encontrado" });
    await saveActionLog(req, `Deletado contrato ${deleted._id}`);
    return ok(res, 200, deleted);
  } catch (err) {
    await saveErrorLog(req, `Erro ao deletar contrato: ${err.message}`);
    return fail(req, res, 400, `Erro ao deletar contrato: ${err.message}`);
  }
}
