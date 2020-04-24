// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config()

const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const db = require('./db')

const authRoute = require('./routes/auth.route')
const bookRoute = require('./routes/book.route')
const userRoute = require('./routes/user.route')
const transactionRoute = require('./routes/transaction.route')
const authMiddleWare = require('./middleware/auth.middleware')
// const show_DB = db.get('listBooks').value()
const cookiesMiddleWare = require('./middleware/cookies.middleware')

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static("public"));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET))

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
console.log('secr', process.env.SESSION_SECRET)
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", authMiddleWare.requireAuth, cookiesMiddleWare.countCookieRequest, (req, res) => {
  res.cookie('user-id', 2626)
  res.render("index.pug");
});

app.use("/auth", authRoute, cookiesMiddleWare.countCookieRequest, cookiesMiddleWare.countCookieRequest)
app.use("/bookStore", authMiddleWare.requireAuth, cookiesMiddleWare.countCookieRequest, bookRoute)
app.use("/users", authMiddleWare.requireAuth, cookiesMiddleWare.countCookieRequest, userRoute)
app.use("/transactions", authMiddleWare.requireAuth, cookiesMiddleWare.countCookieRequest, transactionRoute)

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
