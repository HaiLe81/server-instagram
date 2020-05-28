// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
// var cors = require("cors");
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
// routes
const authRoute = require("./routes/auth.route");
const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const cartRoute = require("./routes/cart.route");
const shopRoute = require("./routes/shop.route");
const customerShopRoute = require("./routes/customerShop.route");

//api
const authApiRoutes = require("./api/routes/auth.route");
const transactionsApiRoutes = require("./api/routes/transactions.route");
const usersApiRoutes = require("./api/routes/user.route");
const bookApiRoutes = require("./api/routes/book.route");
const docsApiRoutes = require("./api/routes/docs.route");
const postsApiRoutes = require("./api/routes/posts.route");
const instagramLoginApiRoutes = require("./api/routes/instagram.account.route");
const bookShare = require("./api/routes/bookShare.book.route");

// middleware
const transactionRoute = require("./routes/transaction.route");
const authMiddleWare = require("./middleware/auth.middleware");
const sessionMiddleWare = require("./middleware/session.middleware");
const cartMiddleWare = require("./middleware/cart.middleware");
const cookiesMiddleWare = require("./middleware/cookies.middleware");
const accountMiddleWare = require("./middleware/account.middleware");

const errorHandler = require("./middleware/error-handler.middleware");

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(errorHandler.error);
app.use(sessionMiddleWare.reqSession);
app.use(cookiesMiddleWare.countCookieRequest);
app.use(cartMiddleWare.cart);
// app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
// api
app.use("/api/v1/auth", authApiRoutes);
app.use("/api/v1/transactions", transactionsApiRoutes);
app.use("/api/v1/users", usersApiRoutes);
app.use("/api/v1/books", bookApiRoutes);
app.use("/api/v1/docs", docsApiRoutes);
app.use("/api/v1/posts", postsApiRoutes);
app.use("/api/v1/instagram", instagramLoginApiRoutes);
app.use("/api/v1/bookShare", bookShare);

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

app.use("/cart", accountMiddleWare.isUser, cartRoute);
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

app.use(
  "/shops",
  authMiddleWare.requireAuth,
  accountMiddleWare.isUser,
  shopRoute
);

app.use("/customerShop", customerShopRoute);

app.get("/*", (req, res) => res.render("./error/404.pug"));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
