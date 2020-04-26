const db = require("../db");

module.exports = {
  cart: (req, res, next) => {
    const id = req.signedCookies.sessionId;
    // count book add cart
    const dataBook = db
      .get("sessions")
      .find({ id: id })
      .value();

    if (!dataBook) {
      let listBookChoose = "";
    }
    let listBookChoose = dataBook.cart;

    // count number book choosed
    // get values of object
    // convert object to array
    if (!listBookChoose) {
      const valuesArr = [];
      // get id of book
      const keyArr = [];
      const result = valuesArr.reduce((acc, cur) => (acc += cur), 0);

      res.locals.keyArr = keyArr;
      res.locals.countBooks = result;
    } else {
      const valuesArr = Object.values(listBookChoose);
      // get id of book
      const keyArr = Object.keys(listBookChoose);
      const result = valuesArr.reduce((acc, cur) => (acc += cur), 0);

      res.locals.keyArr = keyArr;
      res.locals.valueArr = valuesArr;
      res.locals.countBooks = result;
    }

    next();
  }
};
