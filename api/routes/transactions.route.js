var express = require('express')
var router = express.Router()

const tranController = require('../controller/transaction.controller')

router.get("/", tranController.index);

router.post("/", tranController.createPost);

router.patch("/:id", tranController.complete);

module.exports = router;