import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const cargoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
}, { timestamps: true });

cargoSchema.plugin(paginate);

const Cargo = mongoose.models.Cargo || mongoose.model("Cargo", cargoSchema);
export default Cargo;