const db = require("../db");
var User = require("../model/user.model");

module.exports = {
  requireAuth: async (req, res, next) => {
    const { userId } = req.signedCookies;
    if (!userId) {
      res.redirect("/auth/login");
      return;
    }
    await User.find({ id: userId }).then(doc => {
      if (!doc) {
        res.redirect("/auth/login");
        return;
      } else {
        let pageCurrent = parseInt(req.query.page);
        res.locals.page_Current = pageCurrent;
        next();
      }
    });
  }
};
