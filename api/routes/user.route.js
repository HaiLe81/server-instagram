var express = require('express')
var router = express.Router()
const shortid = require('shortid');
const validate = require('../../validate/user.validate.js')

const userController = require('../controller/user.controller')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

// get user list
router.get("/", userController.index);

// get user by idUser
router.get("/:id", userController.search);

// add user
router.post("/", userController.createPost);

// delete user
router.delete("/:id", userController.delete)

// edit user info
router.patch("/:id", upload.single('avatar'), userController.postProfile)

module.exports = router;