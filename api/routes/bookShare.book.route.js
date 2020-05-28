var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./public/uploads/" });
const bookController = require("../controller/bookShare.book.controller");
const authController = require("../controller/bookShare.auth.controller");
const usersController = require("../controller/bookShare.user.controller");


// get book list
router.get("/books", bookController.index);

// create book
router.post(
  "/books",
  bookController.createPost
);

// get users
router.get("/users/", usersController.index)

// login
router.post("/login", authController.postLogin);

// register
router.post("/register", authController.register);


module.exports = router;
