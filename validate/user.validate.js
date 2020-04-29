const md5 = require("md5");
// const db = require("../db");
var User = require("../model/user.model");

module.exports = {
  postCreate: async (req, res, next) => {
    var errors = [];
    const { name, email } = req.body;
    const { password } = req.body;

    // get data from collection "listUser"
    const data = User.find();
    // const data = db.get("listUser").value();
    const isExisted = await User.exists({ email });
    console.log("isE", isExisted);

    // check null username
    if (!name) {
      errors.push("User is required");
    }
    // check length username
    if (name.length > 30 || name.length < 2) {
      errors.push(
        "Greater than 2 characters and less than 30 chracters, Try again"
      );
    }
    //check email null
    if (!email) {
      errors.push("Emal is required");
    }

    // check exist email
    if (isExisted) {
      errors.push("The email already exist. Please use a different email");
    }

    //check password null
    if (!password) {
      errors.push("Password is required");
    }

    if (errors.length) {
      res.render("./users/createUser.pug", {
        errors: errors,
        values: req.body
      });
      return;
    } else {
      next();
    }
  }
};
