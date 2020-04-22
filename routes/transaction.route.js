var express = require('express')
var router = express.Router()

const tranController = require('../controller/transaction.controller')

router.get("/", tranController.index);

router.get("/create", tranController.create);

router.post("/create", tranController.createPost);

router.get("/:id/complete", tranController.complete)

module.exports = router;