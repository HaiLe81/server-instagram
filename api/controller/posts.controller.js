var Posts = require("../../model/post.model");

module.exports = {
  index: async (req, res) => {
    try {
      await Posts.find().then(doc => {
        return res.status(200).json({
          fullPosts: doc
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  }
};
