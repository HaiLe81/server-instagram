var express = require('express')
var router = express.Router()
const accountController = require('../controller/account.controller.js')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

router.patch('/avatar/:id', upload.single('avatar'), accountController.uploadImage)

router.get('/account/:id', accountController.getUserById)

router.get('/accounts', accountController.getAccounts)

router.patch('/follow', accountController.followUser)

module.exports = router; 