const db = require("../db");
let cookies_req = {};
let counter = 0;
var User = require("../model/user.model");
var Shop = require("../model/shop.model");

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
  isUser: async (req, res, next) => {
    const { userId } = req.signedCookies
    // isUser
    await User.find({ id: userId }).then(user => {
      res.locals.user = user[0];
    });
    // exist shop
    await Shop.find({ userId })
    .then(doc => {
      res.locals.existShop = doc[0]
    })
    next();
  }
};
