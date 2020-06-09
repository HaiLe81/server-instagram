var express = require('express')
var router = express.Router()
const accountController = require('../controller/auth.controller.js')

router.post('/login', accountController.postLogin)
router.post('/logout', accountController.logOut)
router.post('/signup', accountController.SignUp)
router.patch('/forgetpassword', accountController.forgetPassword)

module.exports = router; 