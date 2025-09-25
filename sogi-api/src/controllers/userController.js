import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { saveAccessLog, saveErrorLog, saveActionLog } from "../utils/services/logs.js";


/** helpers */
const ok = (res, status, data) => res.status(status).json(data);
const fail = async (req, res, status, msg) => {
  await saveErrorLog(req, msg);
  return res.status(status).json({ message: msg });
};

// só deixa passar campos permitidos
const ALLOWED_FIELDS = ["cpf", "nome", "funcao", "cargo", "email", "senha"];
const pick = (obj, allow = ALLOWED_FIELDS) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([k]) => allow.includes(k)));

export async function getUsers(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Listar usuários");
    const users = await User.find().select("-senha").lean();
    return ok(res, 200, users);
  } catch (err) {
    return fail(req, res, 500, `Erro ao listar usuários: ${err.message}`);
  }
}

export async function getUserById(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Buscar usuário por ID");
    const doc = await User.findById(req.params.id).select("-senha").lean();
    if (!doc) return ok(res, 404, { message: "Usuário não encontrado" });
    return ok(res, 200, doc);
  } catch (err) {
    return fail(req, res, 500, `Erro ao buscar por ID: ${err.message}`);
  }
}

export async function getUsersByCpf(req, res) {
  try {
    await saveAccessLog(req.session?.userdata?._id, req, "Buscar usuários por CPF");
    const docs = await User.find({ cpf: req.params.cpf }).select("-senha").lean();
    return ok(res, 200, docs);
  } catch (err) {
    return fail(req, res, 500, `Erro ao buscar por CPF: ${err.message}`);
  }
}

export async function createUser(req, res) {
  try {
    const data = pick(req.body);

    if (!data.senha) {
      return ok(res, 400, { message: "Campo 'senha' é obrigatório" });
    }

    data.senha = await bcrypt.hash(String(data.senha), 10);

    const created = await User.create(data);
    await saveActionLog(req, `Criado usuário ${created._id}`);

    const obj = created.toObject();
    delete obj.senha;
    return ok(res, 201, obj);
  } catch (err) {
    if (err?.code === 11000) {
      // duplicidade (índices unique)
      const dupField = Object.keys(err.keyPattern || {})[0] || "campo";
      return ok(res, 400, { message: `Valor duplicado para ${dupField}` });
    }
    return fail(req, res, 400, `Erro ao criar usuário: ${err.message}`);
  }
}

export async function updateUser(req, res) {
  try {
    const payload = pick(req.body);

    if (payload.senha) {
      payload.senha = await bcrypt.hash(String(payload.senha), 10);
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true, projection: { senha: 0 } }
    );

    if (!updated) return ok(res, 404, { message: "Usuário não encontrado" });

    await saveActionLog(req, `Atualizado usuário ${updated._id}`);
    return ok(res, 200, updated);
  } catch (err) {
    if (err?.code === 11000) {
      const dupField = Object.keys(err.keyPattern || {})[0] || "campo";
      return ok(res, 400, { message: `Valor duplicado para ${dupField}` });
    }
    return fail(req, res, 400, `Erro ao atualizar usuário: ${err.message}`);
  }
}

export async function deleteUser(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).select("-senha");
    if (!deleted) return ok(res, 404, { message: "Usuário não encontrado" });

    await saveActionLog(req, `Deletado usuário ${deleted._id}`);
    return ok(res, 200, deleted);
  } catch (err) {
    return fail(req, res, 400, `Erro ao deletar usuário: ${err.message}`);
  }
}
