const shortid = require("shortid");
var User = require("../../model/user.model");
var Transactions = require("../../model/transactions.model");
var Book = require("../../model/book.model");

module.exports = {
  index: async (req, res) => {
    try {
      const idAccount = req.params.id;
      let dataTransactions = [];

      await User.find({}).then(async doc => {
        console.log("doc", doc);
        // dataTransactions = db.get("transactions").value();
        await Transactions.find().then(doc => {
          let page = parseInt(req.query.page) || 1;
          let perPage = 3;

          let start = (page - 1) * perPage;
          let end = page * perPage;
          let pageSize = Math.ceil(dataTransactions.length / 3);
          let paginationSize = pageSize >= 3 ? 3 : pageSize;
          User.find().then(dataUser => {
            Book.find().then(databook => {
              return res.status(200).json({
                fillListTransactions: doc,
                dataUser: dataUser,
                dataBook: databook,
                panigationSize: paginationSize,
                pageSize: pageSize
              });
            });
          });
        });
      });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
  createPost: async (req, res) => {
    try {
      const id = shortid.generate();
      const { user, book } = req.body;
      await Transactions.findOne({ userId: user }).then(tran => {
        if (!tran) {
          let newTan = Transactions();
          newTan.id = id;
          newTan.userId = user;
          newTan.bookId = book;
          newTan.isComplete = false;
          newTan.save();
        } else {
          tran.bookId = book;
          tran.save();
        }
        return res.status(200).json({
          transaction: tran
        });
      });

      // res.redirect("/transactions/");
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  complete: async (req, res) => {
    try {
      const { id } = req.params;
      await Transactions.findOne({ id: id }).then(tran => {
        if (!tran.isComplete) {
          // false => true
          tran.isComplete = true;
        } else {
          tran.isComplete = false;
        }
        tran.save();
        return res.status(200).json({
          transaction: tran
        });
        // res.redirect("/transactions");
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  }
};
