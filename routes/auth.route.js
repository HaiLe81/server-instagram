var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid');

const authController = require('../controller/auth.controller')
const validate = require('../validate/auth.login.validate.js')

router.get('/login', authController.login)

router.post('/login', validate.postCreate, authController.postLogin)

router.get('/logout', authController.postLogOut)

module.exports = router;