const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const sendMail = require("./utils/mailer");
const Order = require("./models/Order");
const PDFDocument = require("pdfkit");
require("dotenv").config();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const User = require("./models/user");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");

// MongoDB connection

// mongoose
//   .connect("mongodb://localhost:27017/shreeram", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });
//for .env file

  require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));



app.use(
  session({
    secret: "shreeramsecret",
    resave: false,
    saveUninitialized: false,
  })
);
//updated  islogedIn

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// session data EJS ला उपलब्ध करून देण्यासाठी
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.user;
  // res.locals.userId = req.session.userId;

  res.locals.ownerName = req.session.user?.ownerName;
  next();
});

app.get("/", (req, res) => {
  res.render("listings/index.ejs");
});

app.get("/about", (req, res) => {
  res.render("listings/about.ejs");
});

app.get("/product", (req, res) => {
  res.render("listings/product.ejs");
});

app.get("/contact", isLoggedIn, (req, res) => {
  res.render("listings/contact.ejs");
});

app.get("/transport", (req, res) => {
  res.render("listings/transport.ejs");
});

app.get("/order", isLoggedIn, (req, res) => {
  res.render("listings/order.ejs");
});

app.get("/dashboard", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("listings/userDashboard.ejs", { user });
});

app.get("/register", (req, res) => {
  res.render("listings/register.ejs");
});

app.get("/login", (req, res) => {
  res.render("listings/login.ejs");
});

//

app.get("/login-fail", (req, res) => {
  res.render("listings/loginfail.ejs");
});
//
app.get("/admin-login", (req, res) => {
  res.render("admin-login.ejs");
});


app.get("/user/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    const totalOrders = await Order.countDocuments({
      user: user._id
    });

    res.render("users/profile.ejs", {
      user,
      totalOrders
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});


// 

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// POST route
app.post("/enquiry", async (req, res) => {
  const { name, email, phone, product, message } = req.body;
  try {
    await sendMail({ name, email, phone, product, message });
    res.render("contact-success", { name });
  } catch (err) {
    console.error(err);
    res.render("contact-fail", { error: "Email not sent. Please try again." });
  }
});
//
//contact us
const nodemailer = require("nodemailer");

module.exports = async function sendMail({ name, email, phone, message }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_EMAIL@gmail.com",
      pass: "YOUR_APP_PASSWORD",
    },
  });

  const adminMail = {
    from: email,
    to: "YOUR_EMAIL@gmail.com",
    subject: "📩 New Contact Form Message",
    html: `
      <h2>New Contact Query</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Message:</b> ${message}</p>
      <br>
      <small>Sent from Contact Form</small>
    `,
  };

  // AUTO-REPLY Email to User
  const autoReply = {
    from: "YOUR_EMAIL@gmail.com",
    to: email,
    subject: "📨 Thank You! We Received Your Message",
    html: `
      <h2>Dear ${name},</h2>
      <p>Thank you for contacting us! 🙏</p>

      <p>We have received your message and will get back to you shortly.</p>

      <p><b>Your Message:</b></p>
      <p>${message}</p>

      <br>
      <p>Regards,<br><b>ShreeRam Traders</b></p>
    `,
  };

  // Send emails
  await transporter.sendMail(adminMail);
  await transporter.sendMail(autoReply);

  return true;
};

app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    await sendMail({ name, email, phone, message });

    res.render("contact-success", { name });
  } catch (err) {
    console.error(err);
    res.render("contact-fail", { error: "Email not sent. Please try again." });
  }
});

app.post("/save-order", async (req, res) => {
  try {
    const { name, phone, email, address, storeName } = req.body;

    const productNames = req.body.productName;
    const productQtys = req.body.productQty;
    console.log("SESSION:", req.session);

    if (!req.session.userId) {
      console.log("❌ User not logged in");
      return res.redirect("/login");
    }
    let products = [];
    for (let i = 0; i < productNames.length; i++) {
      products.push({
        name: productNames[i],
        quantity: productQtys[i],
      });
    }

    const order = new Order({
      user: req.session.userId, // ⭐ LOGIN USER ID
      storeName, // ⭐ REQUIRED
      name,
      phone,
      email,
      address,
      products,
    });

    await order.save();

    // WhatsApp Message
    let msg = `🛒 *New Order*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🏠 Address: ${address}\n\n📦 *Products:*`;

    products.forEach((p, i) => {
      msg += `\n${i + 1}. ${p.name} - ${p.quantity}`;
    });

    const encodedMsg = encodeURIComponent(msg);
    const whatsappNumber = "917276045536";
    res.redirect(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Order failed");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { storeName, ownerName, email, phone, password } = req.body;

    const hashedPwd = await bcrypt.hash(password, 10);

    await User.create({
      storeName,
      ownerName,
      email,
      phone,
      password: hashedPwd,
    });

    res.redirect("/login");
  } catch (err) {
    console.log(err);
res.render("listings/registerfail.ejs");  }
});

app.get("/user/dashboard", isLoggedIn, (req, res) => {
  res.render("listings/userDashboard.ejs", {
    user: req.session.user,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return  res.render("listings/loginfail.ejs");
  req.session.userId = user._id;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return  res.render("listings/loginfail.ejs");

  // ✅ ownerName session मध्ये save
  req.session.user = {
    id: user._id,
    ownerName: user.ownerName,
  };

  res.redirect("dashboard");
});

function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  return res.redirect("/admin-login");
}


// ADMIN LOGIN ROUTES
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USER = "admin123";
  const ADMIN_PASS = "admin@123";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect("/admin"); // DIRECT ORDERS PAGE
  } else {
   
    

      res.render("listings/adminloginfail.ejs" );

  }
});



app.get("/admin/orders", isAdmin, async (req, res) => {
  try {
    let { from, to, status, search } = req.query;
    let filter = {};

    // 📅 Date Filter
    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    // 📦 Status Filter
    if (status && status !== "All") {
      filter.status = status;
    }

    let orders = await Order.find(filter)
      .populate("user")
      .sort({ createdAt: -1 });

    // 🔍 Search Filter (store / email / phone)
    if (search) {
      orders = orders.filter(order =>
        order.user &&
        (
          order.user.storeName?.toLowerCase().includes(search.toLowerCase()) ||
          order.user.email?.toLowerCase().includes(search.toLowerCase()) ||
          order.user.phone?.includes(search)
        )
      );
    }

    res.render("admin/orders", {
      orders,
      from,
      to,
      status,
      search
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading orders");
  }
});

app.get("/admin/orders/:id", isAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.render("admin/order-detail", { order });
});

app.post("/admin/orders/:id/status", isAdmin, async (req, res) => {
  const { status } = req.body;

  await Order.findByIdAndUpdate(req.params.id, { status });

  res.redirect("/admin/orders");
});
app.post("/admin/orders/:id/delete", isAdmin, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.redirect("/admin/orders");
});

//Auto Gst Claculate
app.post("/admin/orders/:id/update-amounts", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    let { subTotal, gst, deliveryCharges, discount } = req.body;

    // Convert to numbers
    subTotal = parseFloat(subTotal) || 0;
    gst = parseFloat(gst) || 0;
    deliveryCharges = parseFloat(deliveryCharges) || 0;
    discount = parseFloat(discount) || 0;

    // GST auto calculate
    const gstAmount = (subTotal * gst) / 100;

    // Total before discount
    const beforeDiscount = subTotal + gstAmount + deliveryCharges;

    // Final total
    const finalTotal = beforeDiscount - discount;

    await Order.findByIdAndUpdate(id, {
      subTotal,
      gst, // store %
      deliveryCharges,
      discount,
      totalAmount: finalTotal, // auto calculated
    });

    res.redirect(`/admin/orders/${id}`);
  } catch (err) {
    console.log("Auto Calculation Error:", err);
    res.status(500).send("Recalculate failed");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});







app.get("/admin/customers", isAdmin, async (req, res) => {
  try {
    const search = req.query.search || "";

    const customers = await User.find({
      $or: [
        { storeName: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.render("admin/customers", { customers, search });
  } catch (err) {
    console.log(err);
    res.send("Error loading customers");
  }
});


// Delete Registered User
app.post("/admin/customers/:id/delete", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/customers");
  } catch (err) {
    console.log(err);
    res.send("Error deleting customer");
  }
});

// View Customer History

app.get("/admin/customers/:id/history", isAdmin, async (req, res) => {
  try {
    const customerId = req.params.id;

    // Customer info
    const customer = await User.findById(customerId);

    // Orders of this customer
    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

    // Summary: total orders and total amount
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.render("admin/customerHistory", {
      customer,
      orders,
      totalOrders,
      totalAmount
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading customer history");
  }
});




app.get("/admin", isAdmin, async (req, res) => {
  try {
    // =======================
    // BASIC COUNTS
    // =======================
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // =======================
    // ORDER STATUS COUNTS (FOR PIE CHART)
    // =======================
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    // =======================
    // TOTAL REVENUE
    // =======================
    const deliveredList = await Order.find({ status: "Delivered" });
    let totalRevenue = 0;
    deliveredList.forEach(o => {
      totalRevenue += o.totalAmount || 0;
    });

    // =======================
    // RECENT ORDERS
    // =======================
    const recentOrders = await Order.find()
      .populate("user", "ownerName")
      .sort({ createdAt: -1 })
      .limit(5);

    // =======================
    // LOW STOCK PRODUCTS
    // =======================
    const lowStockProducts = await Product.find({ stock: { $lte: 100 } });

    // =======================
    // MONTHLY ORDERS (BAR CHART)
    // =======================
    const monthlyCounts = Array(12).fill(0);
    const orders = await Order.find();

    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlyCounts[month]++;
    });

    // =======================
    // RENDER DASHBOARD
    // =======================
    res.render("admin/dashboard", {
      totalOrders,
      totalCustomers,
      totalProducts,
      totalRevenue,

      pendingOrders,
      deliveredOrders,
      cancelledOrders,

      recentOrders,
      lowStockProducts,
      monthlyCounts
    });

  } catch (err) {
    console.log(err);
    res.send("Admin Dashboard Error");
  }
});




//for admin product management

const Product = require("./models/Product");
// Middleware: Admin check
function isAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.redirect("/login");
}

/* ------------------ LIST PRODUCTS ------------------ */
app.get("/admin/products", isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render("admin/products", { products });
  } catch (err) {
    console.log(err);
    res.send("Error fetching products");
  }
});

/* ------------------ ADD PRODUCT FORM ------------------ */
app.get("/admin/products/new", isAdmin, (req, res) => {
  res.render("admin/product-new");
});

/* ------------------ SAVE NEW PRODUCT ------------------ */
app.post("/admin/products", isAdmin, async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    await Product.create({ name, price, category, stock });
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.send("Error saving product");
  }
});

/* ------------------ EDIT PRODUCT FORM ------------------ */
app.get("/admin/products/:id/edit", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/product-edit", { product });
  } catch (err) {
    console.log(err);
    res.send("Error loading product");
  }
});

/* ------------------ UPDATE PRODUCT ------------------ */
app.post("/admin/products/:id/update", isAdmin, async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, category, stock });
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.send("Error updating product");
  }
});

/* ------------------ DELETE PRODUCT ------------------ */
app.post("/admin/products/:id/delete", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.send("Error deleting product");
  }
});



//admin and order filter














//user orders for dashbpard

app.get("/my-orders", async (req, res) => {
  try {
    // 🔐 login check
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const orders = await Order.find({
      user: req.session.userId, // ⭐ IMPORTANT LINE
    }).sort({ createdAt: -1 });

    res.render("listings/myOrders.ejs", { orders });
  } catch (err) {
    console.log(err);
    res.send("Error loading orders");
  }
});

app.get("/admin/orders", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.send("Access denied");
  }

  const orders = await Order.find().populate("user");

  res.render("admin/allOrders", { orders });
});

//updated gst, deliveryCharges, discount, totalAmount
app.post("/admin/orders/:id/update-amounts", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { subTotal, gst, deliveryCharges, discount, totalAmount } = req.body;

    await Order.findByIdAndUpdate(id, {
      subTotal,
      gst,
      deliveryCharges,
      discount,
      totalAmount,
    });

    res.redirect(`/admin/orders/${id}`);
  } catch (err) {
    console.log("Update Amount Error:", err);
    res.status(500).send("Recalculate failed");
  }
});

app.get("/invoice/:id", isLoggedIn, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order.invoiceGenerated) {
    return res
      .status(403)
      .send("Invoice not ready yet. Please wait for admin.");
  }

  // 🛡️ Security: फक्त user स्वतःचा order पाहू शकतो
  if (!order || order.user.toString() !== req.session.userId.toString()) {
    return res.status(403).send("Access Denied");
  }

  // PDF generate code / invoice render
  res.render("invoice", { order });
});

// Serve tracking page
app.get("/track/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.render("track", { order });
});

app.get("/admin/orders/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.send("Order not found");
    // After PDF generation logic
    order.invoiceGenerated = true;
    await order.save();

    // Create invoices folder if not exists
    const invoiceFolder = path.join(__dirname, "invoices");
    if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder);

    const pdfPath = path.join(invoiceFolder, `invoice-${order._id}.pdf`);

    // Create PDF
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.pipe(res);

    // ------------- HEADER -------------
    doc.fontSize(22).text("SHREE RAM TRADERS", { align: "center" });
    doc
      .fontSize(12)
      .text("NH_166 Andhalgaon, Tal Mangalvedha, Solapur", { align: "center" });
    doc.fontSize(12).text("Phone: +91 9876543210", { align: "center" });
    doc
      .fontSize(12)
      .text("Email: srmtraderinfo@gmail.com", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(18).text("TAX INVOICE", { align: "center" });
    doc.moveDown(1);

    // ------------- CUSTOMER DETAILS -------------
    doc.fontSize(12).text(`Invoice ID: INV-${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Customer: ${order.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown(1);

    // ------------- PRODUCT TABLE -------------
    const tableTop = doc.y;
    const itemX = 40;
    const descX = 100;
    const qtyX = 300;
    const priceX = 360;
    const totalX = 450;

    // Table Header
    doc
      .rect(itemX - 2, tableTop - 2, 510, 20)
      .fill("#D3D3D3")
      .stroke();
    doc.fillColor("black").font("Helvetica-Bold");
    doc.text("S.N", itemX, tableTop);
    doc.text("Product", descX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Price", priceX, tableTop);
    doc.text("Total", totalX, tableTop);

    let y = tableTop + 25;
    doc.font("Helvetica").fillColor("black");

    // Rows with alternating colors
    order.products.forEach((p, i) => {
      if (i % 2 === 0) {
        doc
          .rect(itemX - 2, y - 2, 510, 20)
          .fill("#F2F2F2")
          .stroke();
        doc.fillColor("black");
      }
      const price = p.price || 0;
      const qty = parseFloat(p.quantity) || 1;
      const lineTotal = price * qty;

      doc.text(i + 1, itemX, y);
      doc.text(p.name, descX, y);
      doc.text(p.quantity, qtyX, y);
      doc.text("" + price.toFixed(2), priceX, y);
      doc.text("" + lineTotal.toFixed(2), totalX, y);

      y += 25;
    });

    // ------------- SPACE BEFORE TOTALS -------------
    y += 10;

    // ------------- TOTALS -------------
    doc.moveTo(300, y).lineTo(550, y).stroke();
    y += 10;
    doc.font("Helvetica-Bold");
    doc.text(`Subtotal: ${order.subTotal.toFixed(2)}`, 360, y);
    y += 20;
    doc.text(`GST: ${order.gst.toFixed(2)}`, 360, y);
    y += 20;
    doc.text(`Delivery Charges: ${order.deliveryCharges.toFixed(2)}`, 360, y);
    y += 20;
    doc.text(`Discount: ${order.discount.toFixed(2)}`, 360, y);
    y += 20;
    doc
      .fontSize(15)
      .text(`Total Amount: ${order.totalAmount.toFixed(2)}`, 360, y, {
        underline: true,
      });

    // ------------- FOOTER -------------
    doc.moveDown(4);
    doc
      .fontSize(10)
      .text("Thank you for shopping with us!", { align: "center" });
    doc.text("This is a system-generated invoice.", { align: "center" });

    doc.end();

    // ------------- EMAIL SEND -------------
    stream.on("finish", async () => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: "Shree Ram Traders <srmtraderinfo@gmail.com>",
        to: order.email,
        subject: `Your Invoice INV-${order._id}`,
        text: "Hello! This is your invoice.",
        attachments: [{ filename: `invoice-${order._id}.pdf`, path: pdfPath }],
      });

      console.log("Invoice emailed successfully!");
    });
  } catch (err) {
    console.log(err);
    res.send("Invoice generation failed");
  }
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
//

const PORT = process.env.PORT || 3000;  // Render वर process.env.PORT वापरेल, local वर 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
