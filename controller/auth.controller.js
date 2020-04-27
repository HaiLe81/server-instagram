const db = require("../db");
const shortid = require("shortid");
var User = require("../model/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  login: (req, res) => {
    try {
      res.render("./auth/auth.pug", {
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
    res.cookie("userId", user.id, {
      signed: true
    });
    res.redirect("/users");
  },
  postLogOut: (req, res) => {
    res.clearCookie("userId", {
      path: "/"
    });
    res.redirect("/auth/login");
  }
};
