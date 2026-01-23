// const Product = require("../models/Product");
// const express = require("express");
// const router = express.Router();
// module.exports = router;


// const isAdmin = require("../middlewares/isAdmin");
// const Customer = require("../models/customer");
// // View all products
// router.get("/products", isAdmin, async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });

//     res.render("admin/products", {
//       title: "Products",
//       products
//     });
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/dashboard");
//   }
// });


// // Show add product form
// router.get("/products/add", isAdmin, (req, res) => {
//   res.render("admin/add-product", {
//     title: "Add Product"
//   });
// });

// // Handle add product
// router.post("/products/add", isAdmin, async (req, res) => {
//   try {
//     const { name, price, stock, category } = req.body;

//     await Product.create({
//       name,
//       price,
//       stock,
//       category
//     });

//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/products/add");
//   }
// });


// // Show edit product form
// router.get("/products/edit/:id", isAdmin, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     res.render("admin/edit-product", {
//       title: "Edit Product",
//       product
//     });
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/products");
//   }
// });

// // Handle edit product
// router.post("/products/edit/:id", isAdmin, async (req, res) => {
//   try {
//     const { name, price, stock, category } = req.body;

//     await Product.findByIdAndUpdate(req.params.id, {
//       name,
//       price,
//       stock,
//       category
//     });

//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/products");
//   }
// });
// // Handle delete product

// // Delete product
// router.post("/products/delete/:id", isAdmin, async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/products");
//   }
// });


// // Order details page
// router.get("/orders/:id", isAdmin, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     res.render("admin/order-details", {
//       title: "Order Details",
//       order
//     });
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/orders");
//   }
// });


// // Update order status
// router.post("/orders/status/:id", isAdmin, async (req, res) => {
//   try {
//     await Order.findByIdAndUpdate(req.params.id, {
//       status: req.body.status
//     });

//     res.redirect("/admin/orders/" + req.params.id);
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/orders");
//   }
// });


// const Order = require("../models/Order");

// // Customers list
// router.get("/customers", isAdmin, async (req, res) => {
//   try {
//     const customers = await Customer.find().sort({ createdAt: -1 });

//     res.render("admin/customers", {
//       title: "Customers",
//       customers
//     });
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/dashboard");
//   }
// });


// // Customer order history
// router.get("/customers/:mobile", isAdmin, async (req, res) => {
//   try {
//     const orders = await Order.find({ mobile: req.params.mobile });

//     res.render("admin/customer-orders", {
//       title: "Customer Orders",
//       orders,
//       mobile: req.params.mobile
//     });
//   } catch (err) {
//     console.log(err);
//     res.redirect("/admin/customers");
//   }
// });
// router.get("/admin/dashboard", (req, res) => {
//   if (!req.session.isAdmin) {
//     return res.redirect("/login");
//   }

//   res.render("admin/dashboard");
// });
// module.exports = router;