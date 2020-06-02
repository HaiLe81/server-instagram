var cloudinary = require("cloudinary").v2;
const Account = require("../../model/instagram.accounts.model");

module.exports = {
  getfollowsuggestions: async (req, res) => {
    const { userId } = req.params;
    try {
      const listFollowed = await Account.find({ id: userId }).then((doc) => {
        if (!doc) {
          throw new Error("Failed Manipilation");
        } else {
          return doc[0].followMember;
        }
      });
      // get user suggestions follow
      const users = await Account.find({ id: { $nin: listFollowed } }).then(
        (doc) => {
          return doc;
        }
      );
      return res.status(200).json({ message: "Get Data Success", users });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
};
