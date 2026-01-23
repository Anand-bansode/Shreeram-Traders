// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   address: String,
//   email: String,
//   storeName: { type: String, required: true }, // 🆕 Store Name
//   products: [{ name: String, quantity: String }],
//   status: { type: String, default: "Pending" },
//   createdAt: { type: Date, default: Date.now },
//   location: {
//     lat: { type: Number, default: 19.076 },
//     lng: { type: Number, default: 72.8777 },
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   subTotal: { type: Number, default: 0 },
//   gst: { type: Number, default: 0 },
//   deliveryCharges: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, default: 0 },
//   email: { type: String, required: true },
//   invoiceGenerated: { type: Boolean, default: false },
// });

// module.exports = mongoose.model("Orders3", orderSchema);
// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   email: { type: String, required: true },
//   address: String,

//   storeName: { type: String, required: true },

//   products: [{ name: String, quantity: Number }],

//   status: {
//     type: String,
//     enum: ["Pending", "Delivered", "Cancelled"],
//     default: "Pending",
//   },

//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   subTotal: { type: Number, default: 0 },
//   gst: { type: Number, default: 0 },
//   deliveryCharges: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, default: 0 },

//   invoiceGenerated: { type: Boolean, default: false },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports =
//   mongoose.models.Order || mongoose.model("Order", orderSchema);
// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   address: String,
//   email: { type: String, required: true },
//   storeName: { type: String, required: true },

//   products: [
//     {
//       name: String,
//       quantity: Number,
//     },
//   ],

//   status: {
//     type: String,
//     enum: ["Pending", "Delivered", "Cancelled"],
//     default: "Pending",
//   },

//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   subTotal: Number,
//   gst: Number,
//   deliveryCharges: Number,
//   discount: Number,
//   totalAmount: Number,

//   createdAt: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model("Order", orderSchema);
// //module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);


// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   email: { type: String, required: true },
//   address: String,

//   storeName: { type: String, required: true },

//   products: [
//     {
//       name: String,
//       quantity: String,   // ✅ CHANGED FROM Number → String
//     },
//   ],

//   status: {
//     type: String,
//     enum: ["Pending", "Delivered", "Cancelled"],
//     default: "Pending",
//   },

//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   subTotal: { type: Number, default: 0 },
//   gst: { type: Number, default: 0 },
//   deliveryCharges: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, default: 0 },

//   invoiceGenerated: { type: Boolean, default: false },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports =
//   mongoose.models.Order || mongoose.model("Order", orderSchema);
// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, required: true },
  address: String,
  storeName: { type: String, required: true },

  products: [
    {
      name: String,
      quantity: String,   // ✅ CHANGED TO STRING to allow "10kg"
    },
  ],

  status: {
    type: String,
    enum: ["Pending", "Delivered", "Cancelled"],
    default: "Pending",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subTotal: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  deliveryCharges: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },

  invoiceGenerated: { type: Boolean, default: false },


  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
//module.exports = mongoose.model("Order", orderSchema);