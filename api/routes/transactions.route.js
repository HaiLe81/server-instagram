var express = require('express')
var router = express.Router()

const tranController = require('../controller/transaction.controller')

// get transaction list
router.get("/", tranController.index);

// add transaction
router.post("/", tranController.createPost);

// edit status transaction
router.patch("/:id", tranController.complete);

module.exports = router;