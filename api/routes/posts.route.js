var express = require('express')
var router = express.Router()
const postsController = require('../controller/posts.controller.js')


router.get('/timeline/:id', postsController.getPost)
router.get('/comments/:postId', postsController.getComments)
router.post('/like', postsController.postLike)
router.post('/comment', postsController.postComment)
router.get('/posts', postsController.getPostInstagtam)
router.post('/newPost', postsController.addPost)

module.exports = router; 