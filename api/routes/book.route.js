var express = require("express");
var router = express.Router();
var multer = require("multer");
// var cors = require('cors')
var upload = multer({ dest: "./public/uploads/" });
const bookController = require("../controller/book.controller");

// router.use(cors())

// get book list
router.get("/", bookController.index);

// router.get("/:id", bookController.view);

// create book
router.post(
  "/",
  upload.single("bookCover"),
  bookController.createPost
);

// get book by id
router.get("/:id/viewBook", bookController.findBookById);

// find book by query param
router.get("/search", bookController.search)

// delete book
router.delete("/:id", bookController.delete);

// update book
router.patch(
  "/:id",
  upload.single("bookCover"),
  bookController.editPost
);

module.exports = router;
