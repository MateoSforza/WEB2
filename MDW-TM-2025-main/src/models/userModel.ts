import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // clave única
    password: { type: String, required: true }, // contraseña hasheada
    age: { type: Number }
});

export default mongoose.model("User", userSchema);