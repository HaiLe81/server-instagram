const shortid = require("shortid");
var Book = require("../model/book.model");
var Shops = require("../model/shop.model");

module.exports = {
  customerShop: (req, res) => {
    Shops.find().then(doc => {
      Book.find().then(book => {
        let listBooks = [];
        // find Book by id
        const books = doc[0].listBook;
        books.map(x => {
          const a = book.find(e => e.id === x.idBook);
          listBooks.push(a);
        });
        res.render("./shops/customerShop.pug", {
          shop: doc[0],
          Books: listBooks,
          fullBooks: book
        });
      });
    });
  }
};
