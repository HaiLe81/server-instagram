var cloudinary = require("cloudinary").v2;
const shortid = require("shortid");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const fs = require("fs");

var Book = require("../../model/shareBook.book.model");

module.exports = {
  index: async (req, res) => {
    try {
      await Book.find().then((doc) => {
        return res.status(200).json({
          fullBook: doc,
          message: "Get data success!",
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  getBooksByUserId: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) throw new console.error("userId is required!");
      await Book.find({ byUser: id }).then((doc) => {
        console.log("do1c", doc);
        if (!doc) return res.status(200).json({ message: "Not Have Data!" });
        return res
          .status(200)
          .json({ message: "Get data success!", books: doc });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  createPost: async (req, res) => {
    try {
      const id = shortid.generate();
      const { title, description, byUser, coverUrl, type, subType } = req.body;

      // validate check lại
      if (!title || !description || !byUser || !coverUrl || !type || !subType) {
        throw new Error("Please check all feild");
      }
      const newBook = new Book({
        id: id,
        title: title,
        byUser: byUser,
        description: description,
        coverUrl: coverUrl,
        type: type,
        subType: subType,
      });
      await newBook.save();
      return res.status(200).json({ newBook, message: "Create book success!" });
    } catch ({ message = "Invalid request", eror }) {
      return res.status(400).json({ message });
    }
  },
};
