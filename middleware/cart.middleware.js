const db = require("../db");

module.exports = {
  cart: (req, res, next) => {
    const id = req.signedCookies.sessionId;
    // count book add cart
    const dataBook = db
      .get("sessions")
      .find({ id: id })
      .value();
    console.log("dataBook", dataBook);
    if (dataBook === undefined) {
      let listBookChoose = "";
      console.log("listChooseUnde", listBookChoose);
    }
    let listBookChoose = dataBook.cart;
    console.log("listChoose", listBookChoose);
    // count number book choosed
    // get values of object
    // convert object to array
    if (listBookChoose === undefined || listBookChoose === null) {
      const valuesArr = [];
      // get id of book
      const keyArr = [];
      const result = valuesArr.reduce((acc, cur) => (acc += cur), 0);
      console.log("result", result);
      res.locals.keyArr = keyArr;
      res.locals.countBooks = result;
    } else {
      const valuesArr = Object.values(listBookChoose);
      // get id of book
      const keyArr = Object.keys(listBookChoose);
      const result = valuesArr.reduce((acc, cur) => (acc += cur), 0);
      console.log("result", result);
      res.locals.keyArr = keyArr;
      res.locals.countBooks = result;
    }

    next();
  }
};
