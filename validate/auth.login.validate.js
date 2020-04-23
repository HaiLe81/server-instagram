const md5 = require("md5"); //md5 is third party libraries so must declare first
const bcrypt = require("bcrypt");
const db = require("../db");
const saltRounds = 10;

module.exports = {
  postCreate: (req, res, next) => {
    try {
      var errors = [];
      const email = req.body.email;
      const password = req.body.password;

      var user = db
        .get("listUser")
        .find({ email: email })
        .value();
      let passwordData = user.password;
      console.log("passworddata", passwordData);
      console.log("check exist", user);

      if (!user) {
        errors.push("User does not exist.");
      } else {
        // if (user.password !== password) {
        //   errors.push("Wrong password");
        // }
      }

      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          console.log("password dung r");
        } else {
          errors.push("Wrong password!");
          console.log("password sai r");
          console.log('errors1', errors)
        }
      });

      console.log('errors2', errors)
      if (errors.length) {
        res.render("./auth/auth.pug", {
          errors: errors,
          values: req.body
        });
        return;
      }
      next();
    } catch (err) {
      console.log(err);
    }
  }
};
