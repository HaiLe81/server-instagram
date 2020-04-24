const md5 = require("md5"); //md5 is third party libraries so must declare first
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  postCreate: (req, res, next) => {
    try {
      var errors = [];
      const email = req.body.email;
      const password = req.body.password;

      console.log("password", password);
      console.log("email", email);

      const user = db
        .get("listUser")
        .find({ email: req.body.email })
        .value();

      if (!user) {
        errors.push("User does not exist.");
      } else {
        let passwordData = user.password;
        let countWrongPassword = user.wrongLoginCount;
        console.log("countWrongPassword:", countWrongPassword);
        if (countWrongPassword >= 3) {
          errors.push(
            "Enter the wrong password more than the specified number of times. Pleasa comback after a day"
          );
        } else {
          // const hash = bcrypt.hashSync(password, saltRounds);
          const result = bcrypt.compareSync(password, user.password);
          if (result === true) {
            console.log("password dung cmnr");
          } else {
            errors.push("Wrong password!");
            db.get("listUser")
              .find({ email: email })
              .assign({ wrongLoginCount: (countWrongPassword += 1) })
              .write();
            console.log("countWrongPassword2:", countWrongPassword);
          }
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
