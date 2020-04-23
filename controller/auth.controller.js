const db = require("../db");
const shortid = require("shortid");

module.exports = {
  login: (req, res) => {
    try {
      res.render("./auth/auth.pug", {
        errors: [],
        values: req.body
      });
    } catch (err) {
      console.log(err);
    }
  },
  postLogin: (req, res) => {
    const email = req.body.email;
    const user = db
      .get("listUser")
      .find({ email: email })
      .value();
    // pass userId = user.id
    res.cookie("userId", user.id);
    res.redirect("/users");
  }
};
