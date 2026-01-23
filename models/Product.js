// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   stock: {
//     type: Number,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// // });
// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   stock: {
//     type: Number,
//     default: 0
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Product", productSchema);

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   stock: { type: Number, required: true, default: 0 },
//   status: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Safe export to avoid OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
