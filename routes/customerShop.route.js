var express = require('express')
var router = express.Router()

const customerShopController = require('../controller/customerShop.controller')

// get customer shop
router.get("/:id", customerShopController.customerShop)

module.exports = router;