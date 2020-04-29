const shortid = require("shortid");
var User = require("../../model/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const sgMail = require("@sendgrid/mail");

module.exports = {
  postLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        throw "email or passwrod incorect!";
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw "email or password incorect!";
      }
      let countWrongPassword = user.wrongLoginCount;
      if (countWrongPassword > 3) {
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
      }
      const result = bcrypt.compareSync(password, user.password);
      if (result === false) {
        User.find({ email: email }).then(doc => {
          doc[0].wrongLoginCount = countWrongPassword += 1;
          doc[0].save();
        });
      }
      res.status(200).json({
        message: "You have successfully logged in",
        user: user
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  postLogOut: (req, res) => {
    try {
      res.clearCookie("userId", { path: "/" })
      res.status(200).json({ message: "Logout successfully" })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
    res.clearCookie("userId", {
      path: "/"
    });
    res.redirect("/auth/login");
  }
};
