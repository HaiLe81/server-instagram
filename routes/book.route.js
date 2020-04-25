var express = require("express");
var router = express.Router();
const db = require("../db");
const shortid = require("shortid");
var multer = require("multer");
var upload = multer({ dest: "./public/uploads/" });
const bookController = require("../controller/book.controller");
// const cookiesMiddleWare = require('../middleware/cookies.middleware')

router.get("/books", bookController.index);

router.get("/books/search", bookController.search);

router.get("/books/view/:id", bookController.view);

router.get("/books/create", bookController.create);

router.post("/books/create", bookController.createPost);

router.get("/books/:id/delete", bookController.delete);

router.get("/books/edit/:id", bookController.edit);

router.post(
  "/books/edit/:id",
  upload.single("bookCover"),
  bookController.editPost
);

module.exports = router;
