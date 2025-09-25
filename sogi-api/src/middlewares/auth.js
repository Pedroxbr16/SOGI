import { verifyToken } from "../utils/jwt.js";

export function auth(req, res, next) {
  try {
    // Aceita: Authorization: Bearer <token>
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Token ausente" });
    }

    const decoded = verifyToken(token);
    req.user = decoded; // ex.: { _id, email, roles, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

// opcional: autorização por papel/perm
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Não autenticado" });
    const ok = (req.user.roles || []).some(r => roles.includes(r));
    if (!ok) return res.status(403).json({ message: "Sem permissão" });
    next();
  };
}
