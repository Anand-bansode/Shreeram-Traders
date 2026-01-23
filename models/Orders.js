// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   customerName: String,
//   totalAmount: Number,
//   status: { type: String, default: "Pending" },
// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   name: String,
//   phone: String,
//   address: String,
//   products: [{ name: String, quantity: Number }],
//   status: { type: String, enum: ["Pending","Delivered","Cancelled"], default: "Pending" },
//   subTotal: Number,
//   gst: Number,
//   deliveryCharges: Number,
//   discount: Number,
//   totalAmount: Number,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
