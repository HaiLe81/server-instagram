var express = require('express')
var router = express.Router()
const accountController = require('../controller/instagram.account.controller.js')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

router.post('/login', accountController.postLogin)
router.post('/signup', accountController.SignUp)
router.patch('/forgetpassword', accountController.forgetPassword)
router.patch('/avatar/:id', upload.single('avatar'), accountController.uploadImage)
router.get('/timeline/:id', accountController.getPost)
router.get('/accounts', accountController.getAccounts)
router.get('/comments/:postId', accountController.getComments)
router.post('/like', accountController.postLike)
router.post('/comment', accountController.postComment)
router.get('/notification/:id', accountController.getNotification)
router.get('/posts', accountController.getPostInstagtam)
router.post('/newPost', accountController.addPost)

module.exports = router; 