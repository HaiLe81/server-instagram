var cloudinary = require("cloudinary").v2;
const db = require("../db");
const shortid = require("shortid");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
module.exports = {
  index: (req, res) => {
    try {
      let page = parseInt(req.query.page) || 1;
      let perPage = 3;

      let start = (page - 1) * perPage;
      let end = page * perPage;

      let dataBooks = db.get("listBooks").value();

      let pageSize = Math.ceil(dataBooks.length / 3);

      let paginationSizes = pageSize >= 3 ? 3 : pageSize;

      let pageCurrent = parseInt(req.query.page);

      res.render("books.pug", {
        listBook: dataBooks.slice(start, end),
        fullBook: dataBooks,
        paginationSize: paginationSizes,
        pageSize: pageSize,
        page_Current: pageCurrent
      });
    } catch (err) {
      console.log(err);
    }
  },
  search: (req, res) => {
    try {
      var valueSearch = "";
      var q = req.query.q;
      valueSearch = q;
      var matchedTodos = db
        .get("listBooks")
        .value()
        .filter(item => {
          return item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
      res.render("books.pug", {
        listBook: matchedTodos,
        value: valueSearch
      });
    } catch (err) {
      console.log(err);
    }
  },
  view: (req, res) => {
    try {
      const id = req.params.id;
      const book = db
        .get("listBooks")
        .find({ id: id })
        .value();
      res.render("view.pug", {
        book: book
      });
    } catch (err) {
      console.log(err);
    }
  },
  create: (request, response) => {
    try {
      response.render("create.pug");
    } catch (err) {
      console.log(err);
    }
  },
  createPost: (req, res) => {
    try {
      const id = shortid.generate();
      // console.log('body', req.body)
      db.get("listBooks")
        .push({
          id: id,
          title: req.body.title,
          description: req.body.description
        })
        .write();
      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  },
  delete: (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      let id = req.params.id;
      db.get("listBooks")
        .remove({ id: id })
        .write();
      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  },
  edit: (req, res) => {
    try {
      const id = req.params.id;
      const book = db
        .get("listBooks")
        .find({ id: id })
        .value();
      console.log("book", book);
      res.render("edit.pug", {
        book: book,
        id: id
      });
    } catch (err) {
      console.log(err);
    }
  },
  editPost: async (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      let id = req.params.id;

      const file = req.file.path;
      const path = await cloudinary.uploader
        .upload(file)
        .then(result => result.url)
        .catch(error => console.log("erro:::>", error));

      db.get("listBooks")
        .find({ id: id })
        .assign({
          title: req.body.title,
          description: req.body.description,
          coverUrl: path
        })
        .write();
      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  }
};
