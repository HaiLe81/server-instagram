const shortid = require("shortid");
var Book = require("../model/book.model");
var User = require("../model/user.model");
var Sessions = require("../model/sessions.model");
var Transactions = require("../model/transactions.model");

module.exports = {
  index: async (req, res) => {
    const { sessionId } = req.signedCookies;
    console.log("sessionId", sessionId);
    let page = parseInt(req.query.page) || 1;
    let perPage = 3;

    let start = (page - 1) * perPage;
    let end = page * perPage;

    // let dataBooks = db.get("listBooks").value();

    await Sessions.find({ id: sessionId }).then(async doc => {
      console.log("doc1,", doc[0]);
      if (!doc[0]) {
        console.log('here1')
        await Book.find().then(book => {
          res.render("./cart/cart.pug", {
            dataCart: 0,
            fullCart: 0,
            paginationSize: 0,
            pageSize: 0,
            page_Current: 0,
            dataBook: book
          });
        });
      } else {
        console.log('here2')
        let pageSize = Math.ceil(doc[0].cart.length / 3);
        let paginationSizes = pageSize >= 3 ? 3 : pageSize;

        let pageCurrent = parseInt(req.query.page);
        await Book.find().then(book => {
          res.render("./cart/cart.pug", {
            dataCart: doc[0].cart.slice(start, end),
            fullCart: doc[0].cart,
            paginationSize: paginationSizes,
            pageSize: pageSize,
            page_Current: pageCurrent,
            dataBook: book
          });
        });
      }
    });
  },
  addToCart: (req, res, next) => {
    try {
      const { bookId } = req.params;
      const { sessionId } = req.signedCookies;

      if (!sessionId) {
        res.redirect("/bookStore/books");
        return;
      }
      // find by sessionId
      Sessions.findOne({ id: sessionId }, async function(err, doc) {
        if (err) {
          console.log(err);
        }
        if (!doc) {
          let newSes = new Sessions();
          newSes.id = sessionId;
          newSes.cart = [{ bookId: bookId, count: 1 }];
          await newSes.save();
        } else {
          let listCart = doc.cart;
          // found bookId
          let index = listCart.findIndex(x => x.bookId === bookId);
          // not found
          if (index !== -1) {
            listCart[index].count += 1;
          } else {
            listCart.push({ bookId: bookId, count: 1 });
          }
          doc.save();
        }
      });
      res.redirect("/bookStore/books");
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.signedCookies.sessionId;
      const idBook = req.params.bookId;

      await Sessions.find({ id: id }).then(doc => {
        console.log('doc', doc[0].cart)
        let listCart = doc[0].cart;
        const index = listCart.findIndex(x => x.bookId === idBook);
        let a = (listCart[index].count-=1);
        console.log('a', a)
        if (a === 0) {
          doc[0].cart.splice(index, 1)
        }
        doc[0].save();
      });

      res.redirect("/cart");
    } catch (err) {
      console.log(err);
    }
  },
  postCart: async (req, res, next) => {
    try {
      const id = shortid.generate();
      const { sessionId } = req.signedCookies;
      const userId = req.signedCookies.userId;
      const idTranSactions = shortid.generate();
      var notifi = [];
      await User.find({ id: userId }).then(async user => {
        if (!user[0]) {
          notifi.push("You need to be logged in to perform this operation");
        } else {
          await Sessions.findOne({ id: sessionId }).then(async session => {
            await Transactions.find({ userId: userId }).then(tran => {
              let listBookId = session.cart.map(x => x.bookId);
              if (!tran[0]) {
                tran[0].id = id;
                tran[0].userId = userId;
                tran[0].isComplete = false;
                tran[0].bookId = listBookId;
              } else {
                tran[0].bookId = listBookId;
              }
              tran[0].save();
            });
          });
        }
      });
      if (notifi.length > 0) {
        Sessions.find({ id: sessionId }).then(doc => {
          //get data book from collection"listBooks"
          Book.find().then(book => {
            res.render("./cart/cart.pug", {
              dataBook: book,
              dataCart: doc[0].cart,
              notifi: notifi
            });
          });
        });
      } else {
        res.redirect("/cart/");
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
};
