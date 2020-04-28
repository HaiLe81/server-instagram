var cloudinary = require("cloudinary").v2;
// const db = require("../db");
const shortid = require("shortid");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
const fs = require("fs");

var Book = require("../model/book.model");

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
        res.render("books.pug", {
          listBook: doc.slice(start, end),
          fullBook: doc,
          paginationSize: paginationSizes,
          pageSize: pageSize,
          page_Current: pageCurrent
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  search: async (req, res) => {
    try {
      var valueSearch = "";
      var q = req.query.q;
      valueSearch = q;

      await Book.find().then(doc => {
        const matchedTodos = doc.filter(item => {
          return item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        res.render("books.pug", {
          listBook: matchedTodos,
          value: valueSearch
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  view: async (req, res) => {
    try {
      const id = req.params.id;
      await Book.find({ id: id }).then(doc => {
        console.log("doc", doc);
        res.render("view.pug", {
          book: doc[0]
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  create: async (req, res) => {
    try {
      res.render("create.pug");
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      const errors = [];
      const id = shortid.generate();
      const file = req.file.path;
      const title = req.body.title;
      const description = req.body.description;
      // console.log('body', req.body)
      const path = await cloudinary.uploader
        .upload(file)
        .then(result => result.url)
        .catch(error => console.log("erro:::>", error));

      // validate check lại
      if (!title) {
        errors.push("Title is required");
      }
      if (!description) {
        errors.push("Description is required");
      }
      const newBook = new Book({
        id: id,
        title: title,
        description: description,
        coverUrl: path,
        errors: errors
      });
      await newBook.save();
      fs.unlinkSync(req.file.path);

      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  },
  delete: async (req, res) => {
    try {
      // let id = parseInt(req.params.id);

      let id = req.params.id;
      if (!id) throw new Error("not found");
      await Book.deleteOne({ id: id });

      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;

      await Book.find({ id: id }).then(doc => {
        console.log("doc[0]", doc[0]);
        res.render("edit.pug", {
          book: doc[0],
          id: id
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  editPost: async (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      const errors = [];
      const id = req.params.id;
      const title = req.body.title;
      const description = req.body.description;

      var book = await Book.findOne({ id: id });
      if (!title) {
        errors.push("Title is required!");
      }
      if (!description) {
        errors.push("Description is required!");
      }

      if (errors.length > 0) {
        await Book.find({ id: id }).then(doc => {
          res.render("edit.pug", {
            book: doc[0],
            id: id,
            errors: errors
          });
        });
      } else {
        // const file = req.file.path;
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
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.redirect("/bookStore/books");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
