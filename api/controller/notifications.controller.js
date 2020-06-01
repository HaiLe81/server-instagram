var cloudinary = require("cloudinary").v2;
const Post = require("../../model/instagram.posts.model");
const Noti = require("../../model/instagram.notifications.model");

const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports = {
  getNotification: async (req, res) => {
    const { id } = req.params;
    try {
      const noti = Noti.find({ toUserId: id });
      if (!noti) throw new Error("notification not found");
      noti.then((doc) => {
        if (!doc.length) {
          return res.status(200).json({ message: "not found" });
        } else {
          return res
            .status(200)
            .json({ message: "get notification success", noti: doc });
        }
      });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
};
