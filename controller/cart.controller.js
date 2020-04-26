var _ = require("lodash");
const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (req, res) => {
    const dataBook = db.get("listBooks").value();
    res.render("./cart/cart.pug", {
      dataBook: dataBook
    });
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
  },
  delete: (req, res) => {
    const id = req.signedCookies.sessionId;
    const idBook = req.params.bookId;
    console.log("idBook", idBook);
    // get object have id: sessionId
    let object = db
      .get("sessions")
      .find({ id: id })
      .value();
    console.log("object", object);
    // use lodash get data in cart
    let a = _.get(object, `cart.${idBook}`);
    console.log("a", a);
    // remove  choosed book
    // db.get("a")
    //   .find({ id: idBook })
    //   .remove(`${idBook}`)
    //   .write();
    res.redirect("/cart");
  },
  postCart: (req, res) => {
    try {
      const id = req.signedCookies.sessionId;
      const userId = req.signedCookies.userId;
      const idTranSactions = shortid.generate();
      var notifi = [];
      // check has user login
      const user = db
        .get("listUser")
        .find({ id: userId })
        .value();
      if (!user) {
        notifi.push("You need to be logged in to perform this operation");
      } else {
        // get values of cart need add to transactions
        const dataBook = db
          .get("sessions")
          .find({ id: id })
          .value();
        const checkUser = db
          .get("transactions")
          .find({ userId: userId })
          .value();
        const valuesArr = Object.keys(dataBook.cart);
        // check transactions has user?
        if (!checkUser) {
          // add transactions with userId
          db.get("transactions")
            .push({
              id: idTranSactions,
              userId: userId,
              bookId: valuesArr,
              isComplete: false
            })
            .write();
        } else {
          db.get("transactions")
          .find({ userId: userId })
          .assign({ 
            bookId: valuesArr
          })
          .write()
        }
      }
      if (notifi.length > 0) {
        const dataBook = db.get("listBooks").value();
        res.render("./cart/cart.pug", {
          dataBook: dataBook,
          notifi: notifi
        });
      } else {
        console.log("db:>", db.get("transactions").value());
        res.redirect("/bookStore/books");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
