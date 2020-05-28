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
        throw new Error("email or passwrod incorrect!");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("email not exists!");
      }
      let countWrongPassword = user.wrongLoginCount;
      if (countWrongPassword > 3) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: "leedaeyang1@gmail.com",
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
  register: async (req, res) => {
    try {
      const id = shortid.generate();
      const { name, email, password } = req.body;
      const isExisted = await User.exists({ email });
      // check null username
      if (!name) {
        throw "User is required";
      }
      // check length username
      if (name.length > 30 || name.length < 2) {
        throw new Error(
          "Greater than 2 characters and less than 30 chracters, Try again"
        );
      }
      //check email null
      if (!email) {
        throw new Error("Emal is required");
      }

      // check exist email
      if (isExisted) {
        throw new Error(
          "The email already exist. Please use a different email"
        );
      }

      //check password null
      if (!password) {
        throw new Error("Password is required");
      }
      // const userInput = req.body.name;
      await bcrypt.hash(req.body.password, saltRounds, async function(
        err,
        hash
      ) {
        const newUser = new User({
          id: id,
          name: req.body.name,
          email: req.body.email,
          isAdmin: false,
          avatarUrl:
            "https://i.ya-webdesign.com/images/default-avatar-png-18.png",
          password: hash,
          wrongLoginCount: 0
        });
        await newUser.save();
        return res.status(200).json({ newUser, message: "Register success" });
      });
      // res.redirect("/users/");
    } catch ({ message = "Invalid request!" }) {
      return res.status(400).json({ message });
    }
  },
};
