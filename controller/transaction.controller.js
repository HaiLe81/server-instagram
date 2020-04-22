const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (request, response) => {
    response.render("./transactions/transaction.pug", {
      listTran: db.get("transactions").value(),
      dataUser: db.get("listUser").value(),
      dataBook: db.get("listBooks").value()
    });
  },
  create: (req, res) => {
    res.render("./transactions/create.pug", {
      users: db.get("listUser").value(),
      books: db.get("listBooks").value()
    });
  },
  createPost: (req, res) => {
    const id = shortid.generate();
    // console.log('body', req.body)
    const idUser = req.body.user;
    const data = db.get("transactions").value();
    const result = data.find(item => item.userId === idUser);

    // need update code to can push addition listBook
    // code below only change all listBook
    if (result === -1) {
      // not find userID
      db.get("transactions")
        .push({
          id: id,
          userId: req.body.user,
          bookId: req.body.book
        })
        .write();
    } else {
      // need change here
      db.get("transactions")
        .find({ userId: idUser })
        .assign({ bookId: req.body.book })
        .write();
    }

    res.redirect("/transaction/");
  }
};
