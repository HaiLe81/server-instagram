var cloudinary = require("cloudinary").v2;
const shortid = require("shortid");
const Account = require("../../model/instagram.accounts.model");
const Post = require("../../model/instagram.posts.model");
const Comment = require("../../model/instagram.comments.model");
const Noti = require("../../model/instagram.notifications.model");

const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports = {
  postLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new Error("username or passwrod is required!");
      }
      const user = await Account.findOne({ username });
      console.log("user", user);
      if (!user) {
        throw new Error("username incorrect!");
      }
      if (user.password !== password) {
        throw new Error("password incorrect!");
      } else {
        user.logged_in = true;
        user.save();
        res.status(200).json({
          message: "You have successfully logged in",
          user: user,
        });
      }
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  SignUp: async (req, res) => {
    const id = shortid.generate();
    const { username, fullname, email, password } = req.body;
    try {
      if (!username || !fullname || !email || !password) {
        throw new Error("please check again");
      }
      const user = await Account.findOne({ username });
      const emailuser = await Account.findOne({ email });

      if (user || emailuser) {
        throw new Error(
          "The username or email already exist. Please use a different username or email"
        );
      }
      const newAcc = new Account({
        id: id,
        username: username,
        fullname: fullname,
        email: email,
        password: password,
        logged_in: false,
        follower: [`${id}`],
        urlAvatar: "https://i.ya-webdesign.com/images/default-avatar-png-9.png",
      });
      newAcc.save();
      res.status(200).json({ message: "Signup successfully" });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
  forgetPassword: async (req, res) => {
    const randomPassword = shortid.generate();
    const { email } = req.body;
    try {
      const user = await Account.findOneAndUpdate(
        { email },
        { password: randomPassword },
        { new: true }
      );
      user.password = randomPassword;
      user.save();
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: "nguyenvy3681@gmail.com",
        subject: "Sending with Twilio SendGrid is Fun",
        text: "Reset Password",
        html: `<strong>this is a new password for your account</strong>: ${randomPassword}`,
      };
      sgMail.send(msg);
      res.status(200).json({ message: "ResetPassword Success" });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
};
