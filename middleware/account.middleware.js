const db = require("../db");
let cookies_req = {};
let counter = 0;
var User = require("../model/user.model");

module.exports = {
  isAdmin: (req, res, next) => {
    try {

      // check isAdmin
      const idUser = req.signedCookies.userId;
      // console.log('idUser', idUser)
      if (!idUser) {
        res.locals.isAdmin = false;
      } else {
        const isAdmin = User.find({ id: idUser }).then(doc => {
          if (!doc[0].isAdmin) {
            res.locals.isAdmin = false;
          } else {
            res.locals.isAdmin = true;
          }
        });
      }
      next();
    } catch (err) {
      console.log(err);
    }
  },
  isUser: (req, res, next) => {
     // isUser
      const user = db
        .get("listUser")
        .find({ id: req.signedCookies.userId })
        .value();

      res.locals.user = user;
      // console.log('userMid', user)
    next()
  }
};
