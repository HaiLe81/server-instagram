var express = require("express");
var router = express.Router();
const postsController = require("../controller/posts.controller");

router.get("/", postsController.index);

module.exports = router;
