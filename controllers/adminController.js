exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (username === "admin123" && password === "admin@123") {
    req.session.isAdmin = true;
    return res.redirect("/admin/dashboard");
  }

  res.send("Invalid credentials");
};

exports.dashboard = (req, res) => {
  res.render("admin/dashboard");
};

exports.orders = (req, res) => {
  res.render("admin/orders");
};

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.dashboard = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments();

  res.render("admin/dashboard", {
    totalOrders,
    totalProducts,
    totalCustomers
  });
};

exports.productsPage = async (req, res) => {
  const products = await Product.find();
  res.render("admin/products", { products });
};
// SHOW ADD FORM
exports.addProductPage = (req, res) => {
  res.render("admin/add-product");
};

// SAVE PRODUCT
exports.saveProduct = async (req, res) => {
  const { name, price, stock } = req.body;

  await Product.create({
    name,
    price,
    stock
  });

  res.redirect("/admin/products");
};
