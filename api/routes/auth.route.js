var express = require('express')
var router = express.Router()
const shortid = require('shortid');

const authController = require('../controller/auth.controller.js')

router.post('/login', authController.postLogin)

router.get('/logout', authController.postLogOut)

module.exports = router;