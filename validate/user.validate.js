const md5 = require("md5");
const db = require("../db");

module.exports = {
  postCreate: (req, res, next) => {
    var errors = [];
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;
    const data = db.get("listUser").value();
    const resultFindName = data.find(item => item.name === nameInput);
    const resultFindEmail = data.find(item => item.email === emailInput);
    // check null username 
    if (!nameInput) {
      errors.push("User is required");
    }
    // check exist username
    if (resultFindName !== undefined) {
      errors.push(
        "The username already exist. Please use a different username"
      );
    }
    // check length username
    if (nameInput.length > 30 || nameInput.length < 2) {
      errors.push(
        "Greater than 2 characters and less than 30 chracters, Try again"
      );
    }
    //check email null
    if (!emailInput) {
      errors.push("Emal is required");
    }
    
    // check exist email
    if (resultFindEmail !== undefined) {
      errors.push("The email already exist. Please use a different email");
    }

    //check password null
      if (!passwordInput) {
        errors.push("Password is required");
      }

    if (errors.length) {
      res.render("./users/createUser.pug", {
        errors: errors,
        values: req.body
      })
      return;
    }

    next();
  }
};
