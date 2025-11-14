// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   resetToken: String,
//   resetTokenExpiry: Date,
// });

// const User = mongoose.model("User", userSchema);
// export default User;
   


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  avatar: String,
  role: { type: String, default: "Admin" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
