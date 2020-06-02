require("dotenv").config();
// var cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
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

//api
const authApiRoutes = require("./api/routes/auth.route");
const accountsApiRoutes = require("./api/routes/accounts.route");
const postsApiRoutes = require("./api/routes/posts.route");
const notiApiRoutes = require("./api/routes/notifications.route");
const suggestionFollowApiRoutes = require("./api/routes/suggestionFollow.route");


app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
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
app.use("/api/v1/", accountsApiRoutes);
app.use("/api/v1/", postsApiRoutes);
app.use("/api/v1/", notiApiRoutes);
app.use("/api/v1/", suggestionFollowApiRoutes);


// https://expressjs.com/en/starter/basic-routing.html

app.get("/*", (req, res) => res.render("./error/404.pug"));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
