var express = require('express')
var router = express.Router()
const accountController = require('../controller/instagram.account.controller.js')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })


router.get('/timeline/:id', accountController.getPost)
router.get('/comments/:postId', accountController.getComments)
router.post('/like', accountController.postLike)
router.post('/comment', accountController.postComment)
router.get('/posts', accountController.getPostInstagtam)
router.post('/newPost', accountController.addPost)

module.exports = router; 