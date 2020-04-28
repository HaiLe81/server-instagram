var Book = require("../model/book.model");
var Sessions = require("../model/sessions.model");

module.exports = {
  cart: async (req, res, next) => {
    const id = req.signedCookies.sessionId;
    // count book add cart
    await Sessions.find({}).then(doc => {
      const cartArr = doc[0].cart;
      let result = cartArr.reduce((acc, cur) => {
        return (acc += cur.count);
      }, 0);
      res.locals.countBooks = result;
    });

    next();
  }
};