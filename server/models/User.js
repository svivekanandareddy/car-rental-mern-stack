import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "user"], default: "user" },
  image: { type: String, default: "" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
