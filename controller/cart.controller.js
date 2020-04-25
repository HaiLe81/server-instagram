const db = require("../db");
const shortid = require("shortid");

module.exports = {
  addToCart: (req, res) => {
    try {
      const bookId = req.params.bookId;
      const sessionId = req.signedCookies.sessionId;
      console.log("sessionId::", sessionId);
      if (!sessionId) {
        res.redirect("/bookStore/books");
        return;
      }

      var count = db
      .get("sessions")
      .find({ id: sessionId })
      .get('cart.' + bookId, 0)
      .value()
      
      db.get("sessions")
        .find({ id: sessionId })
        .set("cart." + bookId, count+1)
        .write()
      console.log('sess', db.get("sessions").find({ id: sessionId }).value())
    } catch (err) {
      console.log(err);
    }
  }
};
