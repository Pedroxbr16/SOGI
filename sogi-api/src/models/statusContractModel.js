import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const statusContractSchema = new mongoose.Schema({
    nome: { type: String, required: true },
}, { timestamps: true });


statusContractSchema.plugin(paginate);

const StatusContract = mongoose.models.StatusContract || mongoose.model("StatusContract", statusContractSchema);
export default StatusContract;


//renovação confirmada / ativo/ renovação pendente/ sem provisao/ encerrado