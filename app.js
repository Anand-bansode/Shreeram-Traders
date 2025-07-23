const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const sendMail = require("./utils/mailer");

const session = require('express-session');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const isLoggedIn = require('./middlewares/isLoggedIn');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shreeram', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
//

app.use(session({
  secret: 'secretkey123',
  resave: false,
  saveUninitialized: false
}));
//

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.username = req.session.username || null;
  next();
});
//

app.use(session({
  secret: 'secretkey123',
  resave: false,
  saveUninitialized: false
}));
//


app.get("/",(req,res)=>{
    res.render("listings/index.ejs");
});

app.get("/about",(req,res)=>{
    res.render("listings/about.ejs");
});

app.get("/product",(req,res)=>{
    res.render("listings/product.ejs");
});

app.get("/contact",isLoggedIn,(req,res)=>{
    res.render("listings/contact.ejs");
});

app.get("/transport",(req,res)=>{
    res.render("listings/transport.ejs");
});

app.get("/order",isLoggedIn,(req,res)=>{
    res.render("listings/order.ejs");
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



app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body; 

    await sendMail({ name, email, phone, message });

    res.render('contact-success', { name }); 
  } catch (err) {
    console.error(err);
    res.render('contact-fail', { error: "Email not sent. Please try again." });
  }
});



app.post('/order', async (req, res) => {
  const { name, phone, address } = req.body;
  const productNames = req.body.productName;
  const productQtys = req.body.productQty;

  let products = [];

  for (let i = 0; i < productNames.length; i++) {
    products.push({ name: productNames[i], quantity: productQtys[i] });
  }

  // 👉 Save in database
  const order = new Order({
    name,
    phone,
    address,
    products
  });

  await order.save();

  // 👉 WhatsApp Message
  let msg = `🛒 *New Order*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🏠 Address: ${address}\n\n📦 *Products:*`;

  products.forEach((p, i) => {
    msg += `\n${i + 1}. ${p.name} - ${p.quantity}`;
  });

  const encodedMsg = encodeURIComponent(msg);
  const whatsappNumber = "917276045536";
  const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

  // 👉 Redirect to WhatsApp
  res.redirect(url);
})

//session


// Register Form
app.get('/register', (req, res) => {
  res.render("listings/register.ejs");
});




app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPwd = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPwd });


  req.session.isLoggedIn = true;
  req.session.username = newUser.username;

  res.redirect('/');
});
//login
// Login Form
app.get('/login', (req, res) => {
  res.render('listings/login.ejs');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.send('User not found');
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    req.session.isLoggedIn = true;
    req.session.username = user.username;
    res.redirect('/');
  } else {
    res.send('Invalid credentials');
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});






//
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
// 

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}   );