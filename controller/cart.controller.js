const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (req, res) => {
    const dataBook = db.get("listBooks").value()
    console.log('databook', dataBook instanceof Array)
    res.render("./cart/cart.pug", {
      dataBook: dataBook
    })
  },
  addToCart: (req, res) => {
    try {
      const bookId = req.params.bookId;
      const sessionId = req.signedCookies.sessionId;

      if (!sessionId) {
        res.redirect("/bookStore/books");
        return;
      }

      var count = db
        .get("sessions")
        .find({ id: sessionId })
        .get("cart." + bookId, 0)
        .value();

      db.get("sessions")
        .find({ id: sessionId })
        .set("cart." + bookId, count + 1)
        .write();

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
      // res.redirec("/booksStore/books");
    } catch (err) {
      console.log(err);
    }
  }
};
