var express = require('express')
var router = express.Router()
const shortid = require('shortid');
const validate = require('../../validate/user.validate.js')

const userController = require('../controller/user.controller')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

router.get("/", userController.index);

router.get("/search", userController.search);

router.get('/view/:id', userController.view)

router.post("/create", userController.createPost);

router.delete("/:id", userController.delete)

router.patch("/edit/:id",  userController.editPost)

router.get("/profile/:id", userController.profile)

router.patch("/profile/:id", upload.single('avatar'), userController.postProfile)

module.exports = router;