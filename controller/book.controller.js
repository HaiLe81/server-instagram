const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (request, response) => {
    try {
      response.render("books.pug", {
        listBook: db.get("listBooks").value()
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
      console.log("book", book);
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
      console.log("id", id);
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
      console.log("body", req.body);
    } catch (err) {
      console.log(err);
    }
  },
  editPost: (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      console.log("body1", req.body);

      let id = req.params.id;
      console.log("id:", id);
      db.get("listBooks")
        .find({ id: id })
        .assign({ title: req.body.title, description: req.body.description })
        .write();
      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
    }
  }
};
