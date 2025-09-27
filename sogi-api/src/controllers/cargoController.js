import Cargo from "../models/cargoModel.js";
import { saveAccessLog, saveErrorLog, saveActionLog } from "../utils/services/logs.js";

/** helpers locais */
const ok = (res, status, data) => res.status(status).json(data);
const fail = async (req, res, status, msg) => {
  await saveErrorLog(req, msg);
  return res.status(status).json({ message: msg });
};
const ALLOWED_FIELDS = ["nome"];
const pick = (obj, allow = ALLOWED_FIELDS) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([k]) => allow.includes(k)));

export async function getCargos(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Listar cargos");
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { createdAt: -1 },
      lean: true,
    };
    const cargos = await Cargo.paginate({}, options);
    return ok(res, 200, cargos);
  } catch (err) {
    await saveErrorLog(req, `Erro ao listar cargos: ${err.message}`);
    return fail(req, res, 500, `Erro ao listar cargos: ${err.message}`);
  }
}

export async function getCargoById(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Buscar cargo por ID");
    const cargo = await Cargo.findById(req.params.id).lean();
    if (!cargo) return ok(res, 404, { message: "Cargo não encontrado" });
    return ok(res, 200, cargo);
  } catch (err) {
    await saveErrorLog(req, `Erro ao buscar cargo por ID: ${err.message}`);
    return fail(req, res, 500, `Erro ao buscar cargo por ID: ${err.message}`);
  }
}

export async function createCargo(req, res) {
  try {
    const data = pick(req.body);
    const cargo = await Cargo.create(data);
    await saveActionLog(req, `Criado cargo ${cargo._id}`);
    return ok(res, 201, cargo);
  } catch (err) {
    await saveErrorLog(req, `Erro ao criar cargo: ${err.message}`);
    return fail(req, res, 400, `Erro ao criar cargo: ${err.message}`);
  }
}

export async function updateCargo(req, res) {
  try {
    const data = pick(req.body);
    const updated = await Cargo.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true, lean: true }
    );
    if (!updated) return ok(res, 404, { message: "Cargo não encontrado" });
    await saveActionLog(req, `Atualizado cargo ${updated._id}`);
    return ok(res, 200, updated);
  } catch (err) {
    await saveErrorLog(req, `Erro ao atualizar cargo: ${err.message}`);
    return fail(req, res, 400, `Erro ao atualizar cargo: ${err.message}`);
  }
}

export async function deleteCargo(req, res) {
  try {
    const deleted = await Cargo.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return ok(res, 404, { message: "Cargo não encontrado" });
    await saveActionLog(req, `Deletado cargo ${deleted._id}`);
    return ok(res, 200, deleted);
  } catch (err) {
    await saveErrorLog(req, `Erro ao deletar cargo: ${err.message}`);
    return fail(req, res, 400, `Erro ao deletar cargo: ${err.message}`);
  }
}
