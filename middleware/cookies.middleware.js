const db = require("../db");
let cookies_req = {};
let counter = 0;
var User = require("../model/user.model");

module.exports = {
  countCookieRequest: (req, res, next) => {
    try {
      // let counter = cookies_req[req.cookies];
      // if (counter || counter === 0) {
      //   cookies_req[req.cookies] = counter += 1;
      // } else {
      //   cookies_req[req.cookies] = 0;
      // }
      // console.log(req.cookies, `:${counter}`);

      // let page_visits = {};
      //   let counter = page_visits[req.originalUrl];
      //   if (counter || counter === 0)
      //     page_visits[req.originalUrl] = counter + 1;
      //   else page_visits[req.originalUrl] = 0;
      //   console.log(req.originalUrl, counter);
      //   next();

      var cookie = req.cookies.count;
      if (cookie === undefined) {
        var randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, 5);
        res.cookie("count", randomNumber);
      } else {
        var count = parseInt(req.cookies.count);
        count++;
        res.cookie("count", count);
      }
      console.log(`count: ${count} 1`);
      
      next();
    } catch (err) {
      console.log(err);
    }
  }
};
