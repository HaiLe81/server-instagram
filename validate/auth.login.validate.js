const md5 = require("md5"); //md5 is third party libraries so must declare first
const sgMail = require("@sendgrid/mail");
const db = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  postCreate: (req, res, next) => {
    try {
      var errors = [];
      const email = req.body.email;
      const password = req.body.password;

      const user = db
        .get("listUser")
        .find({ email: req.body.email })
        .value();

      if (!user) {
        errors.push("User does not exist.");
      } else {
        let passwordData = user.password;
        let countWrongPassword = user.wrongLoginCount;
        if (countWrongPassword >= 3) {
          errors.push(
            "Enter the wrong password more than the specified number of times. Pleasa comback after a day"
          );
          
          // using Twilio SendGrid's v3 Node.js Library
          // https://github.com/sendgrid/sendgrid-nodejs
          const sgMail = require("@sendgrid/mail");
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: email,
            from: 'lekhachai7979@gmail.com',
            subject:
              "Enter the wrong password more than the specified number of times",
            text:
              "If you receive this email, because you have entered the wrong password more than 3 times. The account will be reopened in 24 hours after receiving this email. If you want to reopen your account quickly or contact us via email <lekhachai9999@gmail.com>",
            html:
              "If you receive this email, because you have entered the wrong password more than 3 times. The account will be reopened in 24 hours after receiving this email. If you want to reopen your account quickly or contact us via email <lekhachai9999@gmail.com>"
          };
          sgMail.send(msg).then(
            () => {},
            error => {
              console.error(error);

              if (error.response) {
                console.error(error.response.body);
              }
            }
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
