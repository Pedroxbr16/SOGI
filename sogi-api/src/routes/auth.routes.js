import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { signToken } from "../utils/jwt.js";

const router = Router();

/**
 * POST /auth/login
 * body: { email, senha }  // ou troque para cpf se preferir
 */
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: "Email e senha são obrigatórios" });

    const user = await User.findOne({ email }).select("+senha");
    if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

    const ok = await bcrypt.compare(String(senha), user.senha);
    if (!ok) return res.status(401).json({ message: "Credenciais inválidas" });

    const payload = { _id: user._id, email: user.email, nome: user.nome };
    const token = signToken(payload);

    return res.status(200).json({ token, user: { _id: user._id, email: user.email, nome: user.nome } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
