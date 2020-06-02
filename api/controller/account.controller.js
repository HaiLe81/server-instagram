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
      return res.status(200).json({ message: "Get Data Success", user });
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
  followUser: async (req, res) => {
    const { userId, followUserId } = req.body;
    try {
      // find user follow userId
      const user = await Account.find({ id: userId }).then((doc) => {
        if (!doc) {
          throw new Error("Failed Manipulation");
        } else {
          // add followUserId to follower of userId
          // check exists
          const index = doc[0].follower.find((item) => item === followUserId);
          console.log("index1", index);
          if (!index) {
            doc[0].follower.push(followUserId);
            doc[0].save();
          }
        }
      });
      await Account.find({ id: followUserId }).then((doc) => {
        console.log("doc", doc);
        if (!doc) {
          throw new Error("Failed Manipilation");
        } else {
          // add userId to followeMember of followUserId
          // check exists
          const index = doc[0].followMember.find((item) => item === userId);
          console.log("index22", index);
          if (!index) {
            doc[0].followMember.push(userId);
            doc[0].save();
          }
        }
      });
      return res.status(200).json({ message: "Manipilation Success!", user });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
};
