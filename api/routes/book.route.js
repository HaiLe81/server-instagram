var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./public/uploads/" });
const bookController = require("../controller/book.controller");

router.get("/", bookController.index);

router.get("/search", bookController.search);

router.get("/view/:id", bookController.view);

//?
router.post(
  "/create",
  upload.single("bookCover"),
  bookController.createPost
);

router.delete("/delete/:id", bookController.delete);

router.patch(
  "/edit/:id",
  upload.single("bookCover"),
  bookController.editPost
);

module.exports = router;
