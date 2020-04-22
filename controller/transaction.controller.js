const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (request, response) => {
    try {
      response.render("./transactions/transaction.pug", {
        listTran: db.get("transactions").value(),
        dataUser: db.get("listUser").value(),
        dataBook: db.get("listBooks").value()
      });
    } catch (err) {
      console.log(err);
    }
  },
  create: (req, res) => {
    console.log("dbindex", db.get("transactions").value());
    res.render("./transactions/create.pug", {
      users: db.get("listUser").value(),
      books: db.get("listBooks").value()
    });
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
      console.log("result", result);

      // need update code to can push addition listBook
      // code below only change all listBook
      if (result === -1) {
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
        console.log("run here 2");
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
    const id = req.params.id;
    db.get("transactions")
      .find({ id: id })
      .assign({ isComplete: true })
      .write();

    res.render("./transactions/transaction.pug", {
      listTran: db.get("transactions").value(),
      dataUser: db.get("listUser").value(),
      dataBook: db.get("listBooks").value()
    });
  }
};