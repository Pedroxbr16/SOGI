// models/solicitacaoModel.js
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const SolicitacaoSchema = new mongoose.Schema({
  tipo: { type: String, required: true, enum: ["cadastro-usuario", "outro"] },
  aprovada: { type: Boolean, default: false },
  // user só existirá DEPOIS da aprovação
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // dados necessários para criar o usuário quando aprovar
  dadosCadastro: {
    cpf:   { type: String, required: true },
    nome:  { type: String, required: true },
    cargo: { type: mongoose.Schema.Types.ObjectId, ref: "cargo", required: true },
    email: { type: String, required: true },
    senhaHash: { type: String, required: true }, // senha já criptografada
  },
  createdAt: { type: Date, default: Date.now },
});

SolicitacaoSchema.plugin(paginate);

export default mongoose.models.Solicitacao ||
  mongoose.model("Solicitacao", SolicitacaoSchema);
