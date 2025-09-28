import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const contractSchema = new mongoose.Schema({
    empresa: { type: String, required: true },
    machine: { type: [String], required: true },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'StatusContract', required: true },
    coordenador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vencimento: { type: Date, required: true },
    createAt : { type: Date, default: Date.now },
    updateAt : { type: Date, default: Date.now },
})

contractSchema.plugin(paginate);

const Contract = mongoose.models.Contract || mongoose.model("Contract", contractSchema);
export default Contract;

