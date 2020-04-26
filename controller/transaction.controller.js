const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (req, res) => {
    try {
      const idAccount = req.signedCookies.userId;
      let dataTransactions = [];

      let page = parseInt(req.query.page) || 1;
      let perPage = 3;

      let start = (page - 1) * perPage;
      let end = page * perPage;
      
      const dataAdmin = db
        .get("listUser")
        .find({ id: idAccount })
        .value().isAdmin;

      if (dataAdmin === undefined || dataAdmin === false) {
        dataTransactions = db
          .get("transactions")
          .filter({ userId: idAccount })
          .value();
      } else {
        dataTransactions = db.get("transactions").value();
      }

      let pageSize = Math.ceil(dataTransactions.length/3)
      
      let paginationSizes = pageSize >= 3 ? 3 :  pageSize
      
      res.render("./transactions/transaction.pug", {
        listTran: dataTransactions.slice(start, end),
        fullListTran: dataTransactions,
        dataUser: db.get("listUser").value(),
        dataBook: db.get("listBooks").value(),
        paginationSize: paginationSizes,
        pageSize: pageSize
      });
    } catch (err) {
      console.log(err);
    }
  },
  create: (req, res) => {
    try {
      console.log("dbindex", db.get("transactions").value());
      res.render("./transactions/create.pug", {
        users: db.get("listUser").value(),
        books: db.get("listBooks").value()
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: (req, res) => {
    try {
      const id = shortid.generate();
      const idUser = req.body.user;
      const idBook = req.body.book;
      // let result = data.find(item => item.userId === idUser)
      // console.log('result', result instanceof Array)

      let data = db.get("transactions").value();
      let result = data.find(item => {
        item.userId === idUser;
      });

      // need update code to can push addition listBook
      // code below only change all listBook
      if (result === "undefined") {
        // not find userID
        console.log("run here 1");
        db.get("transactions")
          .push({
            id: id,
            userId: idUser,
            bookId: idBook,
            isComplete: false
          })
          .write();
      } else {
        // need change here
        // need fix error when choose one book
        db.get("transactions")
          .find({ userId: idUser })
          .assign({ bookId: req.body.book })
          .write();
      }
    } catch (err) {
      console.log(err);
    }
    res.redirect("/transactions/");
  },
  complete: (req, res) => {
    try {
      const id = req.params.id;
      const data = db.get("transactions").value();
      const result = data.find(item => item.id === id);
      var errors = [];
      if (result === undefined) {
        errors.push("Transaction not exist!!");
      }
      if (errors.length) {
        res.render("./transactions/transaction.pug", {
          listTran: db.get("transactions").value(),
          dataUser: db.get("listUser").value(),
          dataBook: db.get("listBooks").value(),
          errors: errors
        });
        return;
      }

      db.get("transactions")
        .find({ id: id })
        .assign({ isComplete: true })
        .write();

      res.render("./transactions/transaction.pug", {
        listTran: db.get("transactions").value(),
        dataUser: db.get("listUser").value(),
        dataBook: db.get("listBooks").value()
      });
    } catch (err) {
      console.log(err);
    }
  }
};
