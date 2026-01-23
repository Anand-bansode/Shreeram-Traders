// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   mobile: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Customer", customerSchema);
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },      // optional
  address: { type: String },    // optional
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
