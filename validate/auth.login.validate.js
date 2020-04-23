const md5 = require("md5") //md5 is third party libraries so must declare first
const db = require("../db");

module.exports = {
  postCreate: (req, res, next) => {
    try {
      var errors = [];
      const email = req.body.email;
      const password = md5(req.body.password);

      var user = db
        .get("listUser")
        .find({ email: email })
        .value();
      console.log("check exist", user);
      
      if (!user) {
        errors.push("User does not exist.");
      } else {
        if (user.password !== password) {
          errors.push("Wrong password");
        }
      }

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
