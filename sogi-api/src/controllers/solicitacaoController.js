// controllers/solicitacaoController.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Solicitacao from "../models/solicitacaoModel.js";
import User from "../models/userModel.js";
import { saveAccessLog, saveErrorLog, saveActionLog } from "../utils/services/logs.js";

export const createSolicitacaoCadastro = async (req, res) => {
  try {
    const { cpf, nome, cargo, email, senha } = req.body;
    if (!cpf || !nome || !cargo || !email || !senha) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes" });
    }

    // opcional: checar duplicidade antecipada
    const dup = await User.findOne({ $or: [{ email }, { cpf }] }).lean();
    if (dup) return res.status(400).json({ message: "CPF ou e-mail já cadastrados" });

    const senhaHash = await bcrypt.hash(String(senha), 10);

    const solicitacao = await Solicitacao.create({
      tipo: "cadastro-usuario",
      aprovada: false,
      dadosCadastro: { cpf, nome, cargo, email, senhaHash },
    });

    await saveActionLog(req, `Criada solicitação de cadastro ${solicitacao._id}`);
    return res.status(201).json({ _id: solicitacao._id, status: "pendente" });
  } catch (error) {
    await saveErrorLog(req, "Criar solicitação cadastro", error);
    return res.status(400).json({ message: "Erro ao criar solicitação" });
  }
};

// admin APROVA: cria o User a partir da solicitação
export const aprovarSolicitacaoCadastro = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sol = await Solicitacao.findById(id).session(session);
    if (!sol || sol.tipo !== "cadastro-usuario")
      return res.status(404).json({ message: "Solicitação não encontrada" });

    if (sol.aprovada) return res.status(400).json({ message: "Já aprovada" });

    const { cpf, nome, cargo, email, senhaHash } = sol.dadosCadastro || {};
    if (!cpf || !nome || !cargo || !email || !senhaHash)
      return res.status(400).json({ message: "Solicitação incompleta" });

    // cria usuário
    const user = await User.create([{
      cpf, nome, cargo, email, senha: senhaHash
    }], { session });
    const created = user[0];

    // marca aprovada e linka user
    sol.aprovada = true;
    sol.user = created._id;
    await sol.save({ session });

    await session.commitTransaction();
    session.endSession();

    await saveActionLog(req, `Aprovada solicitação ${id}; user ${created._id}`);
    const obj = created.toObject(); delete obj.senha;
    return res.status(200).json({ message: "Aprovada", user: obj });
  } catch (error) {
    await session.abortTransaction(); session.endSession();
    await saveErrorLog(req, "Aprovar solicitação cadastro", error);
    return res.status(400).json({ message: "Erro ao aprovar solicitação" });
  }
};

// admin REPROVA
export const reprovarSolicitacaoCadastro = async (req, res) => {
  try {
    const { id } = req.params;
    const sol = await Solicitacao.findById(id);
    if (!sol) return res.status(404).json({ message: "Solicitação não encontrada" });
    if (sol.aprovada) return res.status(400).json({ message: "Já aprovada; não é possível reprovar" });

    await sol.deleteOne();
    await saveActionLog(req, `Reprovada/Removida solicitação ${id}`);
    return res.status(200).json({ message: "Reprovada" });
  } catch (error) {
    await saveErrorLog(req, "Reprovar solicitação cadastro", error);
    return res.status(400).json({ message: "Erro ao reprovar solicitação" });
  }
};
