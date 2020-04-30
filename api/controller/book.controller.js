var cloudinary = require("cloudinary").v2;
const shortid = require("shortid");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
const fs = require("fs");

var Book = require("../../model/book.model");

module.exports = {
  index: async (req, res) => {
    try {
      let page = parseInt(req.query.page) || 1;
      let perPage = 3;

      let start = (page - 1) * perPage;
      let end = page * perPage;

      // let dataBooks = db.get("listBooks").value();

      await Book.find().then(doc => {
        let pageSize = Math.ceil(doc.length / 3);

        let paginationSizes = pageSize >= 3 ? 3 : pageSize;

        let pageCurrent = parseInt(req.query.page);
        return res.status(200).json({
          listBook: doc.slice(start, end),
          fullBook: doc,
          paginationSize: paginationSizes,
          pageSize: pageSize,
          page_Current: pageCurrent
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  search: async (req, res) => {
    try {
      var q = req.query.q;
      var valueSearch = q;

      await Book.find().then(doc => {
        const matchedTodos = doc.filter(item => {
          return item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        return res.status(200).json({
          listBook: matchedTodos,
          value: valueSearch
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  view: async (req, res) => {
    try {
      const id = req.params.id;
      await Book.find({ id: id }).then(doc => {
        return res.status(200).json({ book: doc[0] });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  createPost: async (req, res) => {
    try {
      const id = shortid.generate();
      const file = req.file.path;
      const { title, description } = req.body;

      // const path = await cloudinary.uploader
      //   .upload(file)
      //   .then(result => result.url)
      //   .catch(error => console.log("erro:::>", error));

      // validate check lại
      if (!title) {
        throw new Error("Title is required");
      }
      if (!description) {
        throw new Error("Description is required");
      }
      var path;
      !req.file
        ? (path = "https://arm256.com/jspui/image/default-cover-item.jpg")
        : (path = await cloudinary.uploader
            .upload(req.file.path)
            .then(result => result.url)
            .catch(error => console.log("erro:::>", error)));
      const newBook = new Book({
        id: id,
        title: title,
        description: description,
        coverUrl: path
      });
      await newBook.save();
      fs.unlinkSync(req.file.path);
      return res.status(200).json({ newBook });
    } catch ({ message = "Invalid request", eror }) {
      return res.status(400).json({ message });
      console.log("error", eror);
    }
  },
  delete: async (req, res) => {
    try {
      // let id = parseInt(req.params.id);

      let id = req.params.id;
      if (!id) throw new Error("not found");
      await Book.deleteOne({ id: id });
      return res.status(200).json({ message: "Delete successfully" });
      res.redirect("/bookStore/books");
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  editPost: async (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      const errors = [];
      const id = req.params.id;
      const { title, description } = req.body;

      var book = await Book.findOne({ id: id });
      if (!title) {
        throw new Error("Title is required!")
      }
      if (!description) {
        throw new Error("Description is required!");
      }
      var path;
      !req.file
        ? (path = "https://arm256.com/jspui/image/default-cover-item.jpg")
        : (path = await cloudinary.uploader
            .upload(req.file.path)
            .then(result => result.url)
            .catch(error => console.log("erro:::>", error)));
      book.title = title;
      book.description = description;
      book.coverUrl = path;
      await book.save();
      return res.status(200).json({ book });
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  }
};
