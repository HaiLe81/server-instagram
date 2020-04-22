const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (request, response) => {
    response.render("books.pug", {
      listBook: db.get("listBooks").value()
    });
  },
  search: (req, res) => {
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
  },
  view: (req, res) => {
    const id = req.params.id;
    const book = db
      .get("listBooks")
      .find({ id: id })
      .value();
    console.log("book", book);
    res.render("view.pug", {
      book: book
    });
  },
  create: (request, response) => {
    response.render("create.pug");
  },
  createPost: (req, res) => {
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
  },
  delete: (req, res) => {
    // let id = parseInt(req.params.id);
    let id = req.params.id;
    console.log("id", id);
    db.get("listBooks")
      .remove({ id: id })
      .write();
    res.redirect("/bookStore/books");
  },
  edit: (req, res) => {
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
  },
  editPost: (req, res) => {
    // let id = parseInt(req.params.id);
    console.log("body1", req.body);

    let id = req.params.id;
    console.log("id:", id);
    db.get("listBooks")
      .find({ id: id })
      .assign({ title: req.body.title, description: req.body.description })
      .write();
    res.redirect("/bookStore/books");
  }
};
