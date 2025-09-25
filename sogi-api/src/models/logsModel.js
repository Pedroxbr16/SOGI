import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const LogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tipo: { type: String, enum: ["Acesso", "Erro", "Ação"], required: true },
    mensagem: { type: String },

    reqInfo: {
      method: { type: String },
      url: { type: String },
      headers: { type: String },
      body: { type: String },
      params: { type: String },
      query: { type: String },
    },

    // Recomendo concentrar em 'date' (ISO) e deixar data/hora só se precisar legar
    date: { type: Date },
    data: { type: String },
    hora: { type: String },

    ip:   { type: String },

    refs: [{ type: String, index: true, select: false }],
    refs_att: { type: Boolean, default: false, select: false },
  },
  { collection: "Logs" }
);

// Pré-save: preenche 'date' a partir de data/hora se vierem no payload
LogSchema.pre("save", function (next) {
  if (!this.date && this.data && this.hora) {
    const [d, m, y] = this.data.split("/");
    this.date = new Date(`${y}-${m}-${d}T${this.hora}`);
  }
  if (!Array.isArray(this.refs)) this.refs = [];
  this.refs_att = true;
  next();
});

LogSchema.plugin(paginate);

// Único índice de texto combinando campos relevantes
LogSchema.index({
  tipo: "text",
  mensagem: "text",
  data: "text",
  hora: "text",
  ip: "text",
  "reqInfo.method": "text",
  "reqInfo.url": "text",
  "reqInfo.headers": "text",
  "reqInfo.body": "text",
  "reqInfo.params": "text",
  "reqInfo.query": "text",
  refs: "text",
});

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);
export default Log;
