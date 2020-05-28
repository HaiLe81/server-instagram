var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./public/uploads/" });
const bookController = require("../controller/bookShare.book.controller");
const authController = require("../controller/bookShare.auth.controller");
const usersController = require("../controller/bookShare.user.controller");
const numberController = require("../controller/bookShare.NumberLucky.controller");

// get book list
router.get("/books", bookController.index);

// get books by userId
router.get("/books/:id", bookController.getBooksByUserId);


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

// get users register lucky number
router.get("/luckynumbers", numberController.index);

// register lucky number
router.post("/luckynumber", numberController.createNumber);

// random lucky number for give away
router.post("/luckynumbers", numberController.randomLuckyNumber);

module.exports = router;
