var Book = require("../model/book.model");
var Sessions = require("../model/sessions.model");

module.exports = {
  cart: async (req, res, next) => {
    const id = req.signedCookies.sessionId;
    // count book add cart
    await Sessions.find({ id: id }).then(doc => {
      if (!doc[0]) {
        res.locals.countBooks = 0;
      } else {
        const cartArr = doc[0].cart;
        let result = cartArr.reduce((acc, cur) => {
          return (acc += cur.count);
        }, 0);
        console.log('count1', result)
        res.locals.countBooks = result;
      }
    });

    next();
  }
};
