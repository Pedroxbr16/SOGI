
import Log from "../../models/logsModel.js"; 

const TIPOS = ["Acesso", "Erro", "Ação"];

function brNowParts() {
  const s = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const [data, hora] = s.split(" ");
  return { data: data.replace(/,/g, "").trim(), hora: hora.replace(/,/g, "").trim() };
}

function getIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    ""
  );
}

function buildReqInfo(req) {
  try {
    return {
      method: req.method || "",
      url: req.originalUrl || req.url || "",
      headers: JSON.stringify(req.headers || {}),
      body: JSON.stringify(req.body || {}),
      params: JSON.stringify(req.params || {}),
      query: JSON.stringify(req.query || {}),
    };
  } catch {
    return {};
  }
}

export async function saveAccessLog(userId, req, mensagem) {
  try {
    const { data, hora } = brNowParts();
    await Log.create({
      user: userId || undefined,
      tipo: TIPOS[0],
      mensagem,
      data,
      hora,
      ip: getIp(req),
    });
  } catch (err) {
    console.error("saveAccessLog error:", err);
  }
}

export async function saveErrorLog(req, mensagem) {
  try {
    const { data, hora } = brNowParts();
    const userId = req.session?.logged ? req.session.userdata?._id : undefined;
    await Log.create({
      user: userId,
      tipo: TIPOS[1],
      mensagem,
      reqInfo: buildReqInfo(req),
      data,
      hora,
      ip: getIp(req),
    });
  } catch (err) {
    console.error("saveErrorLog error:", err);
  }
}

export async function saveActionLog(req, mensagem) {
  try {
    const { data, hora } = brNowParts();
    const userId = req.session?.userdata?._id;
    await Log.create({
      user: userId || undefined,
      tipo: TIPOS[2],
      mensagem,
      data,
      hora,
      ip: getIp(req),
    });
  } catch (err) {
    console.error("saveActionLog error:", err);
  }
}
