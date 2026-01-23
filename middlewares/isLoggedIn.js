module.exports = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}
module.exports = isLoggedIn;

function isAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(403).send("Access Denied");
  }
  next();
}
module.exports = isAdmin;
