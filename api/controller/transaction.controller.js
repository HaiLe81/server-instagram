const shortid = require("shortid");
var User = require("../../model/user.model");
var Transactions = require("../../model/transactions.model");
var Book = require("../../model/book.model");

module.exports = {
  index: async (req, res) => {
    req.user = {
      // id: "8QnKkqtaj",
      // name: "Pham Thi Thanh",
      // email: "PhamThiThanh@gmail.com",
      // password: "$2b$10$nGjLDOeIpPswKF/LOZXLqexOLRXrHHPrRXtsPyZZFtyCAmU9tnXkO",
      // wrongLoginCount: 0,
      // avatarUrl: "http://res.cloudinary.com/hai-le/image/upload/v1588004843/fwxylg2hmlsvc10oolkx.jpg",
      // isAdmin: false
    };

    try {
      const idAccount = req.user.id;
      let dataTransactions = [];

      // await User.findOne({ id: idAccount }).then(async doc => {
      // console.log('doc', doc)
      if (req.user.isAdmin === false) {
        // not admin
        await Transactions.find({ userId: idAccount }).then(x => {
          dataTransactions = x;
        });
      } else {
        // dataTransactions = db.get("transactions").value();
        await Transactions.find().then(doc => {
          dataTransactions = doc;
        });
        console.log("tran1", dataTransactions);
      }
      // console.log("isAdmin", dataTransactions);
      let page = parseInt(req.query.page) || 1;
      let perPage = 3;

      let start = (page - 1) * perPage;
      let end = page * perPage;
      let pageSize = Math.ceil(dataTransactions.length / 3);
      let paginationSize = pageSize >= 3 ? 3 : pageSize;
      User.find().then(dataUser => {
        Book.find().then(databook => {
          res.status(200).json({
            fillListTransactions: dataTransactions,
            dataUser: dataUser,
            dataBook: databook,
            panigationSize: paginationSize,
            pageSize: pageSize
          });
        });
      });
      // });
    } catch ({ message = "Invalid request" }) {
      res.status(400).json({ message });
    }
  },
  createPost: async (req, res) => {
    try {
      const id = shortid.generate();
      const { user, book } = req.body;
      console.log('zz', user, book)
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
      return res.status(400).json({ message })
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
        })
        // res.redirect("/transactions");
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message })
    }
  }
};
