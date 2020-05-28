var cloudinary = require("cloudinary").v2;
// const md5 = require("md5");
const shortid = require("shortid");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("../../model/shareBook.user.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  index: async (req, res) => {
    try {
      await User.find().then(doc => {
        return res.status(200).json({
          fullUser: doc,
          message: "get users success!"
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  createPost: async (req, res) => {
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
        return res.status(200).json({ newUser });
      });
      // res.redirect("/users/");
    } catch ({ message = "Invalid request!" }) {
      return res.status(400).json({ message });
    }
  }
};
