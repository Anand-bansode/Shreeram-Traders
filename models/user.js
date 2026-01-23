
const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   storeName: String,
//   ownerName: String,
//   email: { type: String, unique: true },
//   phone: String,
//   password: String,
  
// });

// module.exports = mongoose.model("User", userSchema);
  const userSchema = new mongoose.Schema(
  {
    ownerName: String,
    storeName: String,
    email: String,
    phone: String,
    address: String,
    password: String
  },
  { timestamps: true }   // ⭐ IMPORTANT
);

 module.exports = mongoose.model("User", userSchema);

 

// const userSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
// });

// module.exports = mongoose.model("User", userSchema);
