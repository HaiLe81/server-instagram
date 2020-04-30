const shortid = require("shortid");
var User = require("../model/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  login: (req, res) => {
    res.render("./auth/auth.pug", {
      values: req.body
    });
  },
  postLogin: async (req, res, next) => {
    try {
      // var a;
      // a.v();
      const email = req.body.email;
      await User.find({ email: email }).then(doc => {
        // pass userId = user.id
        res.cookie("userId", doc[0].id, {
          signed: true
        });
        res.redirect("/users");
      });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  },
  postLogOut: (req, res) => {
    res.clearCookie("userId", {
      path: "/"
    });
    res.redirect("/auth/login");
  }
};
