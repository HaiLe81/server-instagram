var cloudinary = require("cloudinary").v2;
const shortid = require("shortid");
const Account = require("../../model/instagram.accounts.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports = {
  uploadImage: async (req, res) => {
    const { url } = req.body;
    try {
      if (!url) throw new Error("invalid avatarUrl");
      const { id } = req.params;
      const user = await Account.findOne({ id });
      if (!user) throw new Error("Not Found");
      user.urlAvatar = url;
      user.save();
      res.status(200).json({ message: "Change Avatar Success", user });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error("invalid id");
      const user = await Account.find({ id });
      if (!user) throw new Error("user not found", res.status(404));
      return res.status(200).json({ message: "Get Data Success",user });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
  getAccounts: async (req, res) => {
    try {
      const acc = await Account.find();
      return res
        .status(200)
        .json({ message: "get posts success", accounts: acc });
      // const posts = await Post.find({ postId:  })
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
};
