// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const db = require("./db");

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(_ => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB can't connect", err));

const authRoute = require("./routes/auth.route");
const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const cartRoute = require("./routes/cart.route");
//api
const authApiRoutes = require("./api/routes/auth.route")
const transactionsApiRoutes = require("./api/routes/transactions.route")
const usersApiRoutes = require("./api/routes/user.route")
const bookApiRoutes = require("./api/routes/book.route")
const docsApiRoutes = require("./api/routes/docs.route")

const transactionRoute = require("./routes/transaction.route");
const authMiddleWare = require("./middleware/auth.middleware");
const sessionMiddleWare = require("./middleware/session.middleware");
const cartMiddleWare = require("./middleware/cart.middleware");
const cookiesMiddleWare = require("./middleware/cookies.middleware");
const accountMiddleWare = require("./middleware/account.middleware");

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleWare.reqSession);
app.use(cookiesMiddleWare.countCookieRequest);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(cartMiddleWare.cart);


// api mobile
app.use("/api/v1/auth", authApiRoutes)
app.use("/api/v1/transactions", transactionsApiRoutes)
app.use("/api/v1/users", usersApiRoutes)
app.use("/api/v1/books", bookApiRoutes)
app.use("/api/v1/docs", docsApiRoutes)

// https://expressjs.com/en/starter/basic-routing.html
app.get(
  "/",
  authMiddleWare.requireAuth,
  accountMiddleWare.isUser,
  (req, res) => {
    res.cookie("user-id", 2626);
    res.render("index.pug");
  }
);

app.use(
  "/cart",
  accountMiddleWare.isUser,
  cartRoute
);
app.use(
  "/auth",
  authRoute,
  accountMiddleWare.isUser,
  cookiesMiddleWare.countCookieRequest
);
app.use(
  "/bookStore",

  accountMiddleWare.isUser,
  accountMiddleWare.isAdmin,
  bookRoute
);
app.use(
  "/users",
  authMiddleWare.requireAuth,
  accountMiddleWare.isAdmin,
  accountMiddleWare.isUser,

  userRoute
);
app.use(
  "/transactions",
  authMiddleWare.requireAuth,
  accountMiddleWare.isUser,
  transactionRoute
);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
