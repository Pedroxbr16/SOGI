import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
  cpf:    { type: String, required: true, unique: true }, 
  nome:   { type: String, required: true },
  cargo:  { type: mongoose.Schema.Types.ObjectId, ref: 'cargo', required: true },
  senha:  { type: String, required: true, minlength: 8, select: false },
  email:  { type: String, required: true, unique: true },
}, { timestamps: true });

userSchema.plugin(paginate);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
