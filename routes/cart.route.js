var express = require('express')
var router = express.Router()

const cartController = require('../controller/cart.controller')
// const cookiesMiddleWare = require('../middleware/cookies.middleware')


router.get("/add/:bookId",  cartController.addToCart);
router.get("/", cartController.index)
// router.get("/:bookId/delete",  cartController.addToCart);


module.exports = router;