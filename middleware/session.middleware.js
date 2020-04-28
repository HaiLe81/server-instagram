const db = require("../db");
const shortid = require("shortid");

module.exports = {
  reqSession: (req, res, next) => {
    if (!req.signedCookies.sessionId) {
      const sessionId = shortid.generate();
      res.cookie("sessionId", sessionId, {
        maxAge: 24 * 3600 * 1000,
        signed: true
      });

      db.get("sessions")
        .push({
          id: sessionId
        })
        .write();
    }
    next();
  }
};
