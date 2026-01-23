// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const User = require('./models/User');
// mongoose.connect('mongodb://127.0.0.1:27017/shreeram')
//   .then(() => console.log("DB Connected"))

// async function createAdmin() {
//   const username = "srmt@123";   // येथे तुमचा हवा तो username
//   const password = "srm@123";  // येथे तुम्ही नवीन password देऊ शकता

//   const hash = await bcrypt.hash(password, 10);

//   const admin = new User({
//     username,
//     password: hash
//   });

//   await admin.save();
//   console.log("Admin Created Successfully!");
//   mongoose.connection.close();
// }

// createAdmin();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/shreeram')
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

async function createAdmin() {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if(existingAdmin) return console.log("Admin already exists!");

  const hashedPassword = await bcrypt.hash('srm@123', 10);

  const admin = new User({
    username: 'srmt@123',
    email: 'admin@shreeram.com',
    password: hashedPassword,
    role: 'admin'
  });

  await admin.save();
  console.log("Admin created successfully!");
  process.exit(0);
}

createAdmin();
