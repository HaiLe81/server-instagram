const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("../model/user.model");

module.exports = {
  login: async (req, res, next) => {
    try {
      var errors = [];
      const { email, password } = req.body;
      
      const users = await User.find();
      // find user
      const user = users.find(item => item.email === email);

      if (!user) {
        // throw ('User does not exist')
        errors.push("User does not exist.");
      } else {
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
            from: "lekhachai7979@gmail.com",
            subject:
              "Enter the wrong password more than the specified number of times",
            text:
              "If you receive this email, because you have entered the wrong password more than 3 times. The account will be reopened in 24 hours after receiving this email. If you want to reopen your account quickly or contact us via email (lekhachai9999@gmail.com)",
            html:
              "If you receive this email, because you have entered the wrong password more than 3 times. The account will be reopened in 24 hours after receiving this email. If you want to reopen your account quickly or contact us via email (lekhachai9999@gmail.com)"
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
            // change numbers countWrongPassword +1
            
            User.find({ email: email })
            .then(doc => {
              doc[0].wrongLoginCount = (countWrongPassword+=1)
              doc[0].save()
            })
            errors.push("Wrong password!");
          }
        }
      }

      if (errors.length) {
        res.render("./auth/auth.pug", {
          errors: errors,
          values: req.body
        });
        return;
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  }
};
